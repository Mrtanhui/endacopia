(function () {
  'use strict';
  var root = document.querySelector('[data-guide-search]');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  var input = root.querySelector('input');
  var list = root.querySelector('#guide-search-results');
  var status = root.querySelector('[data-search-status]');
  var empty = root.querySelector('[data-search-empty]');
  var clear = root.querySelector('[data-search-clear]');
  var topics = Array.from(root.querySelectorAll('button[data-search-category]'));
  var category = '';
  var zh = root.dataset.language === 'zh';
  var questionWords = new Set('how what where why when who do does did can could should would i im me my we you your the a an to of in on at for and or is isnt are was be get find use beat solve make please help with it'.split(' '));
  var aliases = { keys: 'key', switches: 'switch', passwords: 'password', endings: 'ending', football: 'soccer', bosses: 'boss' };
  function normalize(value) {
    return (value || '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/['’]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function words(value) { return normalize(value).split(/\s+/).filter(Boolean); }
  function matches(tokens, term) {
    return tokens.some(function (word) { return term.length === 1 ? word === term : word.startsWith(term); });
  }
  var entries = Array.from(root.querySelectorAll('[data-search-text]')).map(function (row, index) {
    return { row: row, index: index, title: normalize(row.dataset.searchTitle), titleWords: words(row.dataset.searchTitle), keywords: words(row.dataset.searchKeywords), text: words(row.dataset.searchText) };
  });
  function restoreQuery() {
    var params = new URLSearchParams(location.search);
    input.value = (params.get('q') || '').slice(0, 120);
    var requested = params.get('topic') || '';
    category = topics.some(function (button) { return button.dataset.searchCategory === requested; }) ? requested : '';
  }
  function syncURL() {
    // Keep Next's history state and unrelated URL parameters intact.
    var url = new URL(location.href);
    var query = input.value.trim().slice(0, 120);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (category) url.searchParams.set('topic', category); else url.searchParams.delete('topic');
    if (url.href !== location.href) {
      try { history.replaceState(history.state, '', url); } catch { /* Filtering still works when history is restricted. */ }
    }
  }
  function applyFilter(updateURL) {
    var query = words(input.value.slice(0, 120));
    var terms = query.filter(function (word, index) {
      // "Ending A" is meaningful even though "a" normally starts a question.
      return !questionWords.has(word) || (word === 'a' && /^endings?$/.test(query[index - 1] || ''));
    }).map(function (word) { return Object.hasOwn(aliases, word) ? aliases[word] : word; });
    if (!terms.length && query.length) terms = query;
    var count = 0;
    var ranked = entries.map(function (entry) {
      var visible = (!category || entry.row.dataset.searchCategory === category) && terms.every(function (term) { return matches(entry.text, term); });
      entry.row.hidden = !visible;
      if (visible) count++;
      var score = terms.reduce(function (total, term) { return total + (matches(entry.titleWords, term) ? 20 : matches(entry.keywords, term) ? 10 : 1); }, 0);
      if (terms.length && entry.title.includes(terms.join(' '))) score += 60;
      return { entry: entry, score: score };
    });
    ranked.sort(function (a, b) { return b.score - a.score || a.entry.index - b.entry.index; }).forEach(function (item) { list.appendChild(item.entry.row); });
    topics.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.searchCategory === category)); });
    status.textContent = zh ? '找到 ' + count + ' 篇攻略' : count + (count === 1 ? ' guide' : ' guides') + ' found' + (category ? ' in ' + topics.find(function (button) { return button.dataset.searchCategory === category; }).textContent : '');
    empty.hidden = count > 0;
    clear.hidden = !input.value && !category;
    if (updateURL) syncURL();
  }
  function reset() { input.value = ''; category = ''; applyFilter(true); input.focus(); }
  input.addEventListener('input', function () { applyFilter(true); });
  root.querySelector('[data-directory-form]').addEventListener('submit', function (event) { event.preventDefault(); applyFilter(true); });
  clear.addEventListener('click', reset);
  root.querySelector('[data-search-reset]').addEventListener('click', reset);
  topics.forEach(function (button) { button.addEventListener('click', function () { category = button.dataset.searchCategory; applyFilter(true); }); });
  window.addEventListener('popstate', function () { restoreQuery(); applyFilter(false); });
  root.querySelector('[data-search-topics]').hidden = false;
  restoreQuery();
  applyFilter(false);
})();
