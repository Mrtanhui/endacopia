import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const script = readFileSync('public/guide-search.js', 'utf8');
const guides = readdirSync('content/guides').filter(name => name.endsWith('.mdx')).map(name => {
  const [, metadata, body] = readFileSync(`content/guides/${name}`, 'utf8').split('---');
  const guide = JSON.parse(metadata);
  return { ...guide, headings: [...body.matchAll(/^##? (.+)$/gm)].map(match => match[1]).join(' ') };
}).sort((a, b) => a.title.localeCompare(b.title));
function element(extra = {}) {
  return { hidden: false, textContent: '', handlers: {}, dataset: {}, attributes: {}, setAttribute(key, value) { this.attributes[key] = value; }, addEventListener(type, handler) { this.handlers[type] = handler; }, focus() { this.focused = true; }, ...extra };
}
function directory(url = 'https://endacopia.example/wiki', fixtures = guides, blockHistory = false) {
  let currentURL = new URL(url);
  const rows = fixtures.map(guide => element({ slug: guide.slug, dataset: { searchTitle: guide.title, searchKeywords: guide.keyword, searchCategory: guide.category.toLowerCase(), searchText: `${guide.title} ${guide.description ?? ''} ${guide.category} ${guide.keyword ?? ''} ${guide.quickAnswer ?? ''} ${guide.headings ?? ''}` } }));
  const list = { children: [...rows], appendChild(row) { this.children.splice(this.children.indexOf(row), 1); this.children.push(row); } };
  const parts = Object.fromEntries(['input', 'status', 'empty', 'clear', 'topics', 'reset', 'form'].map(key => [key, element({ value: '' })]));
  const topics = ['', ...new Set(fixtures.map(guide => guide.category.toLowerCase()))].map(category => element({ dataset: { searchCategory: category }, textContent: category || 'All guides' }));
  const selectors = { input: parts.input, '#guide-search-results': list, '[data-search-status]': parts.status, '[data-search-empty]': parts.empty, '[data-search-clear]': parts.clear, '[data-search-topics]': parts.topics, '[data-search-reset]': parts.reset, '[data-directory-form]': parts.form };
  const root = element({ querySelector(selector) { assert.ok(selector in selectors, selector); return selectors[selector]; }, querySelectorAll(selector) { return selector === '[data-search-text]' ? rows : topics; } });
  const win = element();
  const location = { get href() { return currentURL.href; }, get search() { return currentURL.search; } };
  const history = { state: { nextState: true }, calls: 0, replaceState(state, title, next) { if (blockHistory) throw Error('denied'); assert.equal(state, this.state); currentURL = new URL(next); this.calls++; } };
  const context = vm.createContext({ document: { querySelector() { return root; } }, window: win, location, history, URL, URLSearchParams });
  vm.runInContext(script, context);
  return { rows, list, parts, topics, history, root, context, query(value) { parts.input.value = value; parts.input.handlers.input(); }, visible() { return list.children.filter(row => !row.hidden).map(row => row.slug); }, url() { return currentURL; }, pop(url) { currentURL = new URL(url); win.handlers.popstate(); } };
}

test('real player questions find and rank the focused guide ahead of broad directories', () => {
  const page = directory();
  for (const [query, expected] of [
    ['how do I use the lost key?', 'puzzles/old-key'],
    ['Where can I find the water-cooler?', 'puzzles/core-key'],
    ['How do I make the Blue Guy cry?', 'puzzles/make-blue-guy-cry'],
    ['How do I beat the Chameleon?', 'characters/chameleon'],
    ['football', 'puzzles/soccer-ball'],
  ]) { page.query(query); assert.equal(page.visible()[0], expected, query); }
});

test('search preserves all meaningful terms and single-letter ending choices', () => {
  const page = directory(undefined, [
    { slug: 'a', title: 'Ending A guide', category: 'Endings' },
    { slug: 'c', title: 'Ending C guide', category: 'Endings' },
  ]);
  page.query('How do I get Ending A?');
  assert.deepEqual(page.visible(), ['a']);
  page.query('ending c'); assert.deepEqual(page.visible(), ['c']);
  page.query('ending unavailable'); assert.deepEqual(page.visible(), []);
  assert.equal(page.parts.empty.hidden, false);
  page.parts.reset.handlers.click();
  assert.deepEqual(page.visible(), ['a', 'c']);
  assert.equal(page.parts.input.focused, true);
});

test('topic links, query edits and reset preserve unrelated parameters and Next history', () => {
  const page = directory('https://endacopia.example/wiki?q=key&topic=puzzles&utm_source=test#find-a-guide');
  assert.ok(page.visible().length > 0);
  assert.ok(page.visible().every(slug => slug.startsWith('puzzles/')));
  assert.equal(page.topics.find(button => button.dataset.searchCategory === 'puzzles').attributes['aria-pressed'], 'true');
  page.query('blue guy');
  assert.equal(page.url().searchParams.get('q'), 'blue guy');
  assert.equal(page.url().searchParams.get('utm_source'), 'test');
  assert.equal(page.url().hash, '#find-a-guide');
  assert.deepEqual(directory(page.url()).visible(), page.visible());
  page.topics.find(button => button.dataset.searchCategory === 'characters').handlers.click();
  assert.deepEqual(page.visible(), []);
  assert.equal(page.parts.empty.hidden, false);
  page.parts.clear.handlers.click();
  assert.equal(page.visible().length, guides.length);
  assert.equal(page.url().searchParams.has('q'), false);
  assert.equal(page.url().searchParams.has('topic'), false);
  assert.equal(page.url().searchParams.get('utm_source'), 'test');
});

test('back navigation restores the query and category; submit does not reload', () => {
  const page = directory();
  page.query('key');
  page.pop('https://endacopia.example/wiki?q=Henry&topic=characters');
  assert.equal(page.parts.input.value, 'Henry');
  assert.equal(page.visible()[0], 'characters/henry');
  let prevented = false;
  page.parts.form.handlers.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(page.history.calls, 1);
});

test('unknown topics, long URLs and blocked history do not break filtering', () => {
  const page = directory('https://endacopia.example/wiki?topic=unknown');
  assert.equal(page.visible().length, guides.length);
  const long = directory(`https://endacopia.example/wiki?q=${'x'.repeat(500)}`);
  assert.equal(long.parts.input.value.length, 120);
  const blocked = directory(undefined, guides, true);
  blocked.query('lost key');
  assert.equal(blocked.visible()[0], 'puzzles/old-key');
  vm.runInContext(script, blocked.context);
  assert.equal(blocked.visible()[0], 'puzzles/old-key');
});
