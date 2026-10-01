(function () {
  'use strict';
  document.querySelectorAll('[data-checklist]').forEach(function (root) {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    var key = 'guide-checklist-v1:' + root.dataset.checklist;
    var boxes = Array.from(root.querySelectorAll('input[type="checkbox"]'));
    var count = root.querySelector('[data-checklist-count]');
    var progress = root.querySelector('[data-checklist-progress]');
    var status = root.querySelector('[data-checklist-status]');
    var reset = root.querySelector('[data-checklist-reset]');
    var confirm = root.querySelector('[data-checklist-confirm]');
    var storageAvailable = true;
    function restore(value) {
      var saved;
      try { saved = JSON.parse(value || '[]'); } catch { saved = []; }
      if (!Array.isArray(saved)) saved = [];
      boxes.forEach(function (box) { box.checked = saved.includes(box.value); });
    }
    function update() {
      var selected = boxes.filter(function (box) { return box.checked; }).map(function (box) { return box.value; });
      count.textContent = selected.length + ' / ' + boxes.length + ' collected';
      progress.value = selected.length;
      status.textContent = !storageAvailable ? 'Browser storage is unavailable. Checks will last only on this page.' : selected.length === boxes.length ? 'All items checked. Compare with your in-game collection before claiming the reward.' : 'Saved in this browser. Clear browser data or use Reset checklist to remove your checks.';
      return selected;
    }
    try { restore(localStorage.getItem(key)); } catch { storageAvailable = false; }
    update();
    count.hidden = false;
    progress.hidden = false;
    root.querySelector('[data-checklist-actions]').hidden = false;
    root.addEventListener('change', function () {
      var selected = update();
      try { localStorage.setItem(key, JSON.stringify(selected)); } catch { storageAvailable = false; update(); }
    });
    reset.addEventListener('click', function () { confirm.hidden = false; root.querySelector('[data-checklist-cancel]').focus(); });
    root.querySelector('[data-checklist-cancel]').addEventListener('click', function () { confirm.hidden = true; reset.focus(); });
    root.querySelector('[data-checklist-clear]').addEventListener('click', function () {
      restore(null);
      try { localStorage.removeItem(key); } catch { storageAvailable = false; }
      update(); confirm.hidden = true; reset.focus();
    });
    window.addEventListener('storage', function (event) {
      if (event.key === key || event.key === null) { restore(event.newValue); update(); }
    });
  });
})();
