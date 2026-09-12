/* Optional first-party loader. No Google request is made until analytics is allowed. */
(function () {
  'use strict';
  if (window.__guideAnalytics) return;
  window.__guideAnalytics = true;
  var loader = document.getElementById('analytics-banner');
  if (!loader) return;
  var id = loader.dataset.measurementId;
  var productionOrigin = loader.dataset.productionOrigin;
  var consentKey = 'guide-analytics-consent-v1';
  var exclusionKey = 'guide-analytics-excluded';
  function read(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch { /* Choice still applies to this page. */ } }
  var consent = read(consentKey);
  var excluded = read(exclusionKey) === '1';
  var mode = new URLSearchParams(location.search).get('analytics');
  if (mode === 'off') { excluded = true; write(exclusionKey, '1'); }
  if (mode === 'on') { excluded = false; write(exclusionKey, '0'); }
  // Keep an explicit QA session marked across full-document navigation.
  var debug = mode === 'debug';
  try {
    if (mode === 'debug') sessionStorage.setItem('guide-analytics-debug', '1');
    if (mode === 'on' || mode === 'off') sessionStorage.removeItem('guide-analytics-debug');
    debug = sessionStorage.getItem('guide-analytics-debug') === '1';
  } catch { /* A blocked session store limits debug mode to this page. */ }
  var production = location.origin === productionOrigin && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var started = false;
  var active = false;
  var banner = document.getElementById('analytics-banner');
  function cleanUrl(value) {
    try { var url = new URL(value, location.href); return url.origin + url.pathname; } catch { return ''; }
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      document.cookie = name + '=; Max-Age=0; path=/';
      var labels = location.hostname.split('.');
      for (var i = 0; i < labels.length - 1; i++) document.cookie = name + '=; Max-Age=0; path=/; domain=.' + labels.slice(i).join('.');
    });
  }
  function updateStatus() {
    if (banner) banner.hidden = !production || excluded || consent === 'granted' || consent === 'denied';
    var status = document.getElementById('analytics-status');
    if (status) status.textContent = excluded ? 'Analytics is excluded for this browser.' : !production ? 'Analytics is disabled on this preview or local site.' : consent === 'granted' ? 'Analytics is allowed. You can withdraw consent below.' : 'Analytics is off. You can allow it below.';
  }
  function start() {
    active = production && !excluded && consent === 'granted' && /^G-[A-Z0-9]+$/.test(id || '');
    window['ga-disable-' + id] = !active;
    if (!active) return;
    if (started) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    // This site uses full-document links: config sends the single page_view.
    // No manual page_view or History API tracking is added by this loader.
    window.gtag('config', id, {
      page_location: cleanUrl(location.href),
      page_referrer: cleanUrl(document.referrer),
      page_title: document.title,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 60 * 60 * 24 * 365,
      ...(debug ? { debug_mode: true, traffic_type: 'internal' } : {})
    });
    var script = document.createElement('script');
    script.id = 'ga4-loader';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
  }
  document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element)) return;
    var choice = event.target.closest('[data-analytics-choice]');
    if (choice) {
      consent = choice.dataset.analyticsChoice;
      write(consentKey, consent);
      if (consent === 'denied') {
        active = false;
        window['ga-disable-' + id] = true;
        if (started) window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        clearCookies();
      } else start();
      updateStatus();
      return;
    }
    if (!active || event.defaultPrevented) return;
    var link = event.target.closest('a[href]');
    if (!link) return;
    var destination;
    try { destination = new URL(link.href, location.href); } catch { return; }
    if (!/^https?:$/.test(destination.protocol)) return;
    var internal = destination.origin === location.origin;
    if (internal && destination.pathname === location.pathname) return; // Table-of-contents anchors are not page visits.
    var source = link.closest('.source-panel') || (link.closest('.mdx-content') && !internal);
    if (!internal && !source) return;
    var card = link.closest('.guide-card, .start-card, .category-card');
    var eventName = internal ? (card ? 'guide_card_click' : 'internal_link_click') : 'outbound_source_click';
    var placement = link.closest('.related') ? 'related' : link.closest('.site-header') ? 'header' : link.closest('.site-footer') ? 'footer' : link.closest('.article-body') ? 'article' : location.pathname === '/' ? 'home' : 'directory';
    window.gtag('event', eventName, {
      page_path: location.pathname,
      destination_path: internal ? destination.pathname : destination.origin + destination.pathname,
      link_placement: placement,
      transport_type: 'beacon'
    });
  });
  window.addEventListener('storage', function (event) {
    if (event.key === consentKey || event.key === exclusionKey) {
      consent = read(consentKey);
      excluded = read(exclusionKey) === '1';
      if (consent !== 'granted' || excluded) { active = false; window['ga-disable-' + id] = true; clearCookies(); }
      else start();
      updateStatus();
    }
  });
  if (excluded || consent !== 'granted' || !production) { window['ga-disable-' + id] = true; clearCookies(); }
  start();
  updateStatus();
})();
