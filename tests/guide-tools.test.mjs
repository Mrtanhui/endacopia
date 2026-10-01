import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const checklistScript = readFileSync('public/checklist.js', 'utf8');
function element(extra = {}) {
  return { hidden: true, textContent: '', handlers: {}, dataset: {}, addEventListener(type, fn) { this.handlers[type] = fn; }, focus() { this.focused = true; }, ...extra };
}
function collection(initial = null, blocked = false) {
  const store = new Map(initial ? [['guide-checklist-v1:fish', initial]] : []);
  const boxes = ['a', 'b', 'c'].map((value) => element({ value, checked: false }));
  const parts = Object.fromEntries(['count', 'progress', 'status', 'reset', 'confirm', 'actions', 'clear', 'cancel'].map((key) => [key, element()]));
  const root = element({ dataset: { checklist: 'fish' }, querySelectorAll() { return boxes; }, querySelector(selector) { return parts[selector.match(/data-checklist-(\w+)/)[1]]; } });
  const win = element();
  const storage = { getItem(key) { if (blocked) throw Error('blocked'); return store.get(key) ?? null; }, setItem(key, value) { if (blocked) throw Error('blocked'); store.set(key, value); }, removeItem(key) { if (blocked) throw Error('blocked'); store.delete(key); } };
  const context = vm.createContext({ window: win, document: { querySelectorAll() { return [root]; } }, localStorage: storage });
  vm.runInContext(checklistScript, context);
  return { boxes, parts, root, win, store, context };
}

test('collection restores valid IDs and preserves checked progress across reloads', () => {
  const page = collection('["a","a","retired-id"]');
  assert.equal(page.parts.count.textContent, '1 / 3 collected');
  page.boxes[1].checked = true;
  page.root.handlers.change();
  const reloaded = collection(page.store.get('guide-checklist-v1:fish'));
  assert.deepEqual(reloaded.boxes.map((box) => box.checked), [true, true, false]);
  assert.equal(reloaded.parts.progress.value, 2);
  vm.runInContext(checklistScript, reloaded.context);
  assert.equal(reloaded.parts.count.textContent, '2 / 3 collected');
});

test('reset requires the explicit clear action; cancel and cross-tab changes work', () => {
  const page = collection('["a"]');
  page.parts.reset.handlers.click();
  assert.equal(page.parts.confirm.hidden, false);
  page.parts.cancel.handlers.click();
  assert.equal(page.boxes[0].checked, true);
  page.win.handlers.storage({ key: 'guide-checklist-v1:fish', newValue: '["b","c"]' });
  assert.equal(page.parts.count.textContent, '2 / 3 collected');
  page.parts.reset.handlers.click();
  page.parts.clear.handlers.click();
  assert.equal(page.parts.count.textContent, '0 / 3 collected');
  assert.equal(page.store.has('guide-checklist-v1:fish'), false);
  assert.equal(page.parts.reset.focused, true);
});

test('malformed and denied storage do not prevent using a checklist', () => {
  for (const value of ['not-json', '{"a":true}', 'null']) assert.equal(collection(value).parts.count.textContent, '0 / 3 collected');
  const page = collection(null, true);
  page.boxes[2].checked = true;
  page.root.handlers.change();
  assert.equal(page.parts.count.textContent, '1 / 3 collected');
  assert.match(page.parts.status.textContent, /storage is unavailable/);
});

test('directory filters every query term, handles no matches and restores all links', () => {
  const input = element({ value: '' });
  const status = element();
  const empty = element();
  const rows = ['Old Key fish Timesville', 'Projector Remote Misery'].map((text) => element({ dataset: { searchText: text } }));
  const root = element({ querySelector(selector) { return selector === 'input' ? input : selector === '[data-search-status]' ? status : empty; }, querySelectorAll() { return rows; } });
  vm.runInNewContext(readFileSync('public/guide-search.js', 'utf8'), { document: { querySelector() { return root; } } });
  input.value = ' FISH  key '; input.handlers.input();
  assert.deepEqual(rows.map((row) => row.hidden), [false, true]);
  input.value = 'unavailable'; input.handlers.input();
  assert.equal(empty.hidden, false);
  input.value = ''; input.handlers.input();
  assert.deepEqual(rows.map((row) => row.hidden), [false, false]);
  assert.equal(status.textContent, '2 guides found');
});
