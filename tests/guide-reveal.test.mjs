import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync('public/guide-reveal.js', 'utf8');
function setup(hash = '#current-step') {
  class Element {
    constructor(tagName = 'DIV', parentElement = null, dataset = {}) { Object.assign(this, { tagName, parentElement, dataset, handlers: {}, open: false, hidden: false, attributes: {} }); }
    addEventListener(name, fn) { this.handlers[name] = fn; }
    contains(node) { for (; node; node = node.parentElement) if (node === this) return true; return false; }
    hasAttribute(key) { return key in this.attributes; }
    setAttribute(key, value) { this.attributes[key] = value; }
    scrollIntoView() { this.scrolled = true; }
    focus() { this.focused = true; }
  }
  const root = new Element();
  const full = new Element('DETAILS', root);
  const first = new Element('DETAILS', full);
  const later = new Element('DETAILS', full);
  const answer = new Element('DETAILS', full);
  const heading = new Element('H2', new Element('SUMMARY', first));
  const subheading = new Element('H3', first);
  const alias = new Element('SPAN', root, { anchorTarget: 'guide-section-current-step' });
  const nestedAlias = new Element('SPAN', root, { anchorTarget: 'guide-section-substep' });
  const notice = new Element();
  const confirm = new Element('BUTTON');
  const openAll = new Element('BUTTON');
  const closeAll = new Element('BUTTON');
  const controls = new Element();
  controls.querySelector = selector => selector === '[data-open-all]' ? openAll : closeAll;
  root.querySelector = selector => ({ '[data-linked-notice]': notice, '[data-reveal-linked]': confirm, '[data-guide-controls]': controls })[selector];
  root.querySelectorAll = selector => selector === 'details[data-guide-panel]' ? [full, first, later, answer] : [first, later, answer];
  const ids = { 'current-step': alias, 'guide-section-current-step': heading, 'substep': nestedAlias, 'guide-section-substep': subheading };
  const location = new URL('https://example.test/puzzles/item' + hash);
  const events = {};
  const context = vm.createContext({ Element, URL, location, document: { querySelector: () => root, getElementById: id => ids[id], addEventListener: () => {} }, window: { addEventListener: (event, fn) => { events[event] = fn; } } });
  vm.runInContext(source, context);
  return { root, full, first, later, answer, heading, subheading, notice, confirm, openAll, closeAll, controls, events, location };
}

test('a public section link stays closed until confirmed and reveals only its target', () => {
  const page = setup();
  assert.equal(page.notice.hidden, false);
  assert.equal(page.full.open, false);
  assert.equal(page.first.open, false);
  page.confirm.handlers.click();
  assert.equal(page.full.open, true);
  assert.equal(page.first.open, true);
  assert.equal(page.later.open, false);
  assert.equal(page.answer.open, false);
  assert.equal(page.heading.focused, true);
  assert.equal(page.notice.hidden, true);
});

test('subheading links open their containing section, not later steps', () => {
  const page = setup('#substep');
  page.confirm.handlers.click();
  assert.equal(page.first.open, true);
  assert.equal(page.later.open, false);
  assert.equal(page.subheading.focused, true);
});

test('all steps require a separate explicit action and can be closed again', () => {
  const page = setup('');
  assert.equal(page.notice.hidden, true);
  assert.equal(page.controls.hidden, false);
  page.openAll.handlers.click();
  assert.ok([page.first, page.later, page.answer].every(panel => panel.open));
  page.closeAll.handlers.click();
  assert.ok([page.first, page.later, page.answer].every(panel => !panel.open));
  page.location.hash = '#current-step';
  page.events.hashchange();
  assert.equal(page.notice.hidden, false);
});

test('missing and malformed fragments do not reveal any content', () => {
  for (const hash of ['#not-found', '#%E0%A4%A']) {
    const page = setup(hash);
    assert.equal(page.notice.hidden, true);
    assert.ok([page.full, page.first, page.later, page.answer].every(panel => !panel.open));
  }
});
