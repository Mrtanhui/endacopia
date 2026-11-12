/* Native details work without this enhancement. A section link asks before revealing answers. */
(function () {
  'use strict';
  var root = document.querySelector('[data-guide-reveal]');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  var notice = root.querySelector('[data-linked-notice]');
  var button = root.querySelector('[data-reveal-linked]');
  var pending = null;
  function linkedTarget() {
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return null; }
    if (!id) return null;
    var target = document.getElementById(id);
    if (target && target.dataset.anchorTarget) target = document.getElementById(target.dataset.anchorTarget);
    return target;
  }
  function closedParents(target) {
    var parents = [];
    for (var node = target && target.parentElement; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS' && !node.open) parents.push(node);
    }
    return parents;
  }
  function showTarget(target) {
    target.scrollIntoView({ block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  function checkLink(scroll) {
    var target = linkedTarget();
    if (!target || !root.contains(target)) { notice.hidden = true; pending = null; return; }
    if (closedParents(target).length) {
      pending = target;
      notice.hidden = false;
      if (scroll) notice.scrollIntoView({ block: 'start' });
    } else {
      notice.hidden = true;
      pending = null;
      if (scroll) showTarget(target);
    }
  }
  button.addEventListener('click', function () {
    if (!pending) return;
    var target = pending;
    closedParents(target).reverse().forEach(function (panel) { panel.open = true; });
    notice.hidden = true;
    pending = null;
    showTarget(target);
  });
  root.querySelectorAll('details[data-guide-panel]').forEach(function (panel) {
    panel.addEventListener('toggle', function () {
      if (panel.open && pending && !closedParents(pending).length) {
        var target = pending;
        notice.hidden = true;
        pending = null;
        showTarget(target);
      }
    });
  });
  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    var link = event.target.closest('a[href]');
    if (!link) return;
    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    if (url.hash === location.hash) checkLink(true);
  });
  window.addEventListener('hashchange', function () { checkLink(true); });
  checkLink(true);
})();
