(function () {
  'use strict';
  var root = document.querySelector('[data-guide-search]');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  var input = root.querySelector('input');
  var rows = Array.from(root.querySelectorAll('[data-search-text]'));
  input.addEventListener('input', function () {
    var terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var count = 0;
    rows.forEach(function (row) {
      row.hidden = !terms.every(function (term) { return row.dataset.searchText.toLowerCase().includes(term); });
      if (!row.hidden) count++;
    });
    root.querySelector('[data-search-status]').textContent = count + (count === 1 ? ' guide' : ' guides') + ' found';
    root.querySelector('[data-search-empty]').hidden = count > 0;
  });
})();
