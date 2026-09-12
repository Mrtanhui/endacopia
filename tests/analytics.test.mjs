import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync('public/analytics.js', 'utf8');
function harness({ origin = 'https://endacopia.example', consent, excluded, search = '', debugSession = false } = {}) {
  const store = new Map();
  const session = new Map(debugSession ? [['guide-analytics-debug', '1']] : []);
  if (consent) store.set('guide-analytics-consent-v1', consent);
  if (excluded) store.set('guide-analytics-excluded', '1');
  const listeners = {}, scripts = [], banner = {dataset: {measurementId: 'G-TEST123', productionOrigin: 'https://endacopia.example'}}, status = {};
  class Element { constructor(matches = {}) { this.matches = matches; } closest(selector) { return this.matches[selector] ?? null; } }
  const window = { addEventListener: (name, listener) => { listeners[name] = listener; } };
  const document = {
    title: 'Test guide', referrer: 'https://search.example/results?email=private#secret', cookie: '_ga=old; unrelated=keep',
    getElementById: (name) => ({ 'site-analytics': { dataset: { measurementId: 'G-TEST123', productionOrigin: 'https://endacopia.example' } }, 'analytics-banner': banner, 'analytics-status': status })[name],
    addEventListener: (name, listener) => { listeners[name] = listener; },
    createElement: () => ({}), head: { appendChild: (script) => scripts.push(script) }
  };
  const location = new URL(origin + '/guide/secrets' + search);
  const context = vm.createContext({ window, document, location, Element, URL, URLSearchParams, sessionStorage: {getItem:(key)=>session.get(key),setItem:(key,value)=>session.set(key,value),removeItem:(key)=>session.delete(key)}, localStorage: { getItem: (key) => store.get(key), setItem: (key, value) => store.set(key, value) } });
  vm.runInContext(source, context);
  const commands = () => Array.from(window.dataLayer ?? [], (args) => Array.from(args));
  return { window, scripts, banner, status, commands, context, listeners, store,
    choose: (value) => listeners.click({ target: new Element({ '[data-analytics-choice]': { dataset: { analyticsChoice: value } } }) }),
    click: (href, matches = {}) => listeners.click({ target: new Element({ 'a[href]': Object.assign(new Element(matches), { href }) }) })
  };
}
test('no consent, declined, excluded and preview visits never load Google', () => {
  for (const options of [{}, {consent:'denied'}, {consent:'granted',excluded:true}, {consent:'granted',origin:'http://localhost:3000'}, {consent:'granted',origin:'https://preview.vercel.app'}, {consent:'granted',search:'?analytics=off'}]) {
    const h = harness(options); assert.equal(h.scripts.length, 0); assert.equal(h.commands().length, 0);
  }
});
test('consent starts one config pageview, repeat consent and script execution do not duplicate it', () => {
  const h = harness({search:'?email=private#secret'}); h.choose('granted'); h.choose('granted'); vm.runInContext(source, h.context);
  assert.equal(h.scripts.length, 1);
  const configs = h.commands().filter(([name]) => name === 'config');
  assert.equal(configs.length, 1);
  assert.equal(configs[0][2].page_location, 'https://endacopia.example/guide/secrets');
  assert.equal(configs[0][2].page_referrer, 'https://search.example/results');
  assert.equal(h.commands().filter(([name, type]) => name === 'event' && type === 'page_view').length, 0);
});
test('each click has exactly one event with no query or personal label', () => {
  const h = harness({consent:'granted'});
  h.click('https://endacopia.example/puzzles/old-key?email=private', { '.guide-card, .start-card, .category-card': {} });
  h.click('https://endacopia.example/puzzles/core-key');
  h.click('https://steamcommunity.com/sharedfiles/filedetails/?id=123', { '.source-panel': {} });
  h.click('https://endacopia.example/guide/secrets#table');
  const events = h.commands().filter(([name]) => name === 'event');
  assert.deepEqual(events.map(([, name]) => name), ['guide_card_click', 'internal_link_click', 'outbound_source_click']);
  assert.ok(!JSON.stringify(events).includes('private'));
  h.choose('denied'); h.click('https://endacopia.example/wiki');
  assert.equal(h.commands().filter(([name]) => name === 'event').length, 3);
  assert.equal(h.window['ga-disable-G-TEST123'], true);
});
test('debug is explicitly marked, browser exclusion persists until cleared', () => {
  const h = harness({consent:'granted',search:'?analytics=debug'});
  const config = h.commands().find(([name]) => name === 'config')[2];
  assert.equal(config.debug_mode, true); assert.equal(config.traffic_type, 'internal');
  const next = harness({consent:'granted',debugSession:true});
  assert.equal(next.commands().find(([name]) => name === 'config')[2].debug_mode, true);
  const off = harness({consent:'granted',search:'?analytics=off'}); assert.equal(off.store.get('guide-analytics-excluded'), '1');
  const on = harness({consent:'granted',excluded:true,search:'?analytics=on'}); assert.equal(on.scripts.length, 1);
});
