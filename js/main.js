/* ============================================================
   iHeartTheatre — main.js
   App shell injector · Ticker · Animations · Service Worker
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. SVG Icons ──────────────────────────────────────── */
  var ICONS = {
    home:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    mic:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
    star:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    info:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    search:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    heart:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    users:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    mail:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
  };

  /* ── 2. Nav Config ─────────────────────────────────────── */
  var NAV_ITEMS = [
    { href: '/index.html',    label: 'Home',      page: 'home',     icon: 'home'     },
    { href: '/whats-on.html', label: "What's On", page: 'whats-on', icon: 'calendar' },
    { href: '/auditions.html', label: 'Auditions', page: 'audition', icon: 'mic'      },
    { href: '/reviews.html',  label: 'Reviews',   page: 'reviews',  icon: 'star'     },
    { href: '/reviewers.html', label: 'Reviewers', page: 'reviewers', icon: 'users'   },
    { href: '/contact.html',  label: 'Contact',   page: 'contact',  icon: 'mail'     }
  ];

  /* ── 3. Determine active page ──────────────────────────── */
  function getActivePage() {
    var path = window.location.pathname;
    var fn = path.split('/').pop();
    if (!fn || fn === '' || fn === 'index.html') return 'home';
    if (fn.indexOf('whats-on') !== -1) return 'whats-on';
    if (fn.indexOf('audition') !== -1) return 'audition';
    if (fn.indexOf('reviews') !== -1 || fn.indexOf('review') !== -1) return 'reviews';
    if (fn.indexOf('reviewer') !== -1) return 'reviewers';
    if (fn.indexOf('about') !== -1 || fn.indexOf('companies') !== -1) return 'about';
    if (fn.indexOf('contact') !== -1 || fn.indexOf('submit') !== -1) return 'contact';
    if (fn.indexOf('musicals') !== -1 || fn.indexOf('songs') !== -1 || fn.indexOf('career') !== -1) return 'audition';
    return '';
  }

  /* ── 4. Build nav HTML ─────────────────────────────────── */
  function buildSidebarNavItems(activePage) {
    return NAV_ITEMS.map(function (item) {
      var isActive = item.page === activePage;
      return (
        '<a href="' + item.href + '" class="sidebar-nav-link' + (isActive ? ' active' : '') + '" data-page="' + item.page + '">' +
          '<span class="sidebar-nav-icon">' + ICONS[item.icon] + '</span>' +
          '<span>' + item.label + '</span>' +
        '</a>'
      );
    }).join('');
  }

  function buildMobileNavItems(activePage) {
    var MOB_ICONS = ['🏠', '🎭', '🎤', '⭐', '👥', '✉️'];
    return NAV_ITEMS.map(function (item, i) {
      var isActive = item.page === activePage;
      return (
        '<a href="' + item.href + '" class="mobile-nav-item' + (isActive ? ' active' : '') + '">' +
          '<span class="mobile-nav-icon">' + MOB_ICONS[i] + '</span>' +
          '<span>' + item.label + '</span>' +
        '</a>'
      );
    }).join('');
  }

  /* ── 5. SIDEBAR HTML ───────────────────────────────────── */
  function buildSidebarHTML(activePage) {
    return (
      '<aside class="app-sidebar" role="navigation" aria-label="Main navigation">' +
        '<a href="/index.html" class="sidebar-logo">' +
          '<div class="sidebar-logo-icon">' + ICONS.heart + '</div>' +
          '<div class="sidebar-logo-text">iHeartTheatre' +
            '<span>Your Theatre Community</span>' +
          '</div>' +
        '</a>' +
        '<nav class="sidebar-nav">' +
          '<div class="sidebar-nav-label">Navigate</div>' +
          buildSidebarNavItems(activePage) +
          '<div class="sidebar-nav-label" style="margin-top:14px">More</div>' +
          '<a href="/about.html" class="sidebar-nav-link">' +
            '<span class="sidebar-nav-icon">' + ICONS.info + '</span><span>About</span>' +
          '</a>' +
          '<a href="/musicals.html" class="sidebar-nav-link">' +
            '<span class="sidebar-nav-icon">🎼</span><span>Role Finder</span>' +
          '</a>' +
          '<a href="/songs.html" class="sidebar-nav-link">' +
            '<span class="sidebar-nav-icon">🎵</span><span>Song Browser</span>' +
          '</a>' +
          '<a href="/career-builder.html" class="sidebar-nav-link">' +
            '<span class="sidebar-nav-icon">🚀</span><span>Career Builder</span>' +
          '</a>' +
        '</nav>' +
        '<div class="sidebar-footer">' +
          '<div style="margin-bottom:6px">© 2026 iHeartTheatre</div>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
            '<a href="/privacy.html">Privacy</a>' +
            '<a href="/disclaimer.html">Disclaimer</a>' +
          '</div>' +
        '</div>' +
      '</aside>'
    );
  }

  /* ── 6. NOW BAR (Ticker) ───────────────────────────────── */
  var TICKER_FALLBACK = [
    { badge: 'NOW SHOWING', text: 'Mamma Mia! — Geelong Lyric Theatre Society at Geelong Arts Centre', link: '/whats-on.html' },
    { badge: 'OPENING SOON', text: 'Les Misérables — Upstage Theatre Company at Berwick', link: '/whats-on.html' },
    { badge: 'NEW REVIEW', text: 'Deanna reviews Dying: A Memoir ★★★★★ — MTC', link: '/reviews.html' },
    { badge: 'AUDITIONS', text: 'Grease — Footlights Youth Theatre open auditions', link: '/auditions.html' },
    { badge: 'CLOSING SOON', text: "The Good Life — Brighton Theatre Company, don't miss it", link: '/whats-on.html' },
    { badge: 'NOW SHOWING', text: 'Mamma Mia! — National Theatre, St Kilda', link: '/whats-on.html' },
    { badge: 'KIDS', text: 'Junior theatre workshops open for ages 8-16', link: '/junior-kids-schools.html' },
    { badge: 'NEW REVIEW', text: 'Wayne Michael joins iHeartTheatre — first review coming soon', link: '/reviews.html' }
  ];

  var BADGE_STYLE = {
    'NOW SHOWING':  'color:#ffd700;border-color:rgba(255,215,0,.5)',
    'OPENING SOON': 'color:#c9a84c;border-color:rgba(212,175,55,.5)',
    'NEW REVIEW':   'color:#f472b6;border-color:rgba(244,114,182,.5)',
    'AUDITIONS':    'color:#d4af37;border-color:rgba(212,175,55,.5)',
    'CLOSING SOON': 'color:#f87171;border-color:rgba(248,113,113,.5)',
    'KIDS':         'color:#34d399;border-color:rgba(52,211,153,.5)',
    'REVIEW':       'color:#ffd700;border-color:rgba(255,215,0,.5)',
    'NEWS':         'color:#f472b6;border-color:rgba(244,114,182,.5)'
  };

  function buildTickerHTML(items) {
    var html = '';
    for (var copy = 0; copy < 2; copy++) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var bs = BADGE_STYLE[item.badge] || 'color:#d4af37;border-color:rgba(212,175,55,.5)';
        var badgeHtml = item.badge
          ? '<span class="ticker-badge" style="' + bs + '">' + item.badge + '</span>'
          : '';
        var textHtml = item.link
          ? '<a href="' + item.link + '">' + item.text + '</a>'
          : item.text;
        html += '<span class="ticker-item">' + badgeHtml + textHtml + '</span>';
        html += '<span class="ticker-sep">◆</span>';
      }
    }
    return html;
  }

  function buildNowBarHTML() {
    return (
      '<div class="now-bar" role="marquee" aria-label="Latest theatre news">' +
        '<div class="now-bar-label">🎭 On Stage</div>' +
        '<div class="now-bar-track-wrap">' +
          '<div class="now-bar-track" id="tickerTrack">' +
            buildTickerHTML(TICKER_FALLBACK) +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ── 7. Mobile nav HTML ────────────────────────────────── */
  function buildMobileNavHTML(activePage) {
    return (
      '<nav class="mobile-nav" role="navigation" aria-label="Mobile navigation">' +
        '<div class="mobile-nav-inner">' +
          buildMobileNavItems(activePage) +
        '</div>' +
      '</nav>'
    );
  }

  /* ── 8. Inject app shell ───────────────────────────────── */
  function injectShell() {
    var activePage = getActivePage();
    var existing = document.querySelector('.app-sidebar');
    if (existing) return; // already injected

    // Insert sidebar
    var sidebarEl = document.createElement('div');
    sidebarEl.innerHTML = buildSidebarHTML(activePage);
    document.body.insertBefore(sidebarEl.firstElementChild, document.body.firstChild);

    // Wrap main in .main-content if not already wrapped
    var mainEl = document.querySelector('main');
    if (mainEl && !mainEl.classList.contains('main-content')) {
      var wrapper = document.createElement('div');
      wrapper.className = 'main-content';
      mainEl.parentNode.insertBefore(wrapper, mainEl);
      wrapper.appendChild(mainEl);
    } else if (!mainEl) {
      // Wrap all non-shell body children in .main-content so sidebar layout works
      var wrapper = document.createElement('div');
      wrapper.className = 'main-content';
      var toWrap = Array.prototype.slice.call(document.body.children).filter(function(el) {
        return !el.classList.contains('app-sidebar') &&
               !el.classList.contains('stage-curtain') &&
               el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE';
      });
      if (toWrap.length) {
        document.body.insertBefore(wrapper, toWrap[0]);
        toWrap.forEach(function(el) { wrapper.appendChild(el); });
      }
    }

    // Insert mobile nav + ticker bar
    document.body.insertAdjacentHTML('beforeend', buildMobileNavHTML(activePage));
    document.body.insertAdjacentHTML('beforeend', buildNowBarHTML());
  }

  /* ── 9. Ticker fetch ───────────────────────────────────── */
  function initTicker() {
    var tickerTrack = document.getElementById('tickerTrack');
    if (!tickerTrack) return;

    fetch('/data/ticker.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        if (!data.items || !data.items.length) return;
        // Reset animation → swap content → force reflow → restart
        tickerTrack.style.animation = 'none';
        tickerTrack.innerHTML = buildTickerHTML(data.items);
        void tickerTrack.offsetWidth;
        tickerTrack.style.animation = '';
      })
      .catch(function () {
        /* fallback already rendered */
      });
  }

  /* ── 10. Scroll reveal (IntersectionObserver) ─────────── */
  var _revealObserver = null;
  function initReveal() {
    if (!window.IntersectionObserver) {
      // Fallback: reveal everything instantly
      document.querySelectorAll('.reveal-section, .reveal-stagger').forEach(function(el) {
        el.classList.add('visible');
      });
      return;
    }
    _revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          _revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal-section, .reveal-stagger').forEach(function (el) {
      _revealObserver.observe(el);
    });
    // Expose for dynamically injected content (e.g. review cards from JS)
    window.iHTRevealObserver = _revealObserver;
  }

  /* ── 11. Card hover glow (desktop only) ───────────────── */
  function initCardGlow() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.article-card, .show-card, .tool-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--mouse-x', x);
        card.style.setProperty('--mouse-y', y);
      });
    });
  }

  /* ── 12. Cmd-K / Ctrl-K search trigger ───────────────── */
  function initSearchShortcut() {
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Dispatch a custom event — individual pages or pagefind can listen
        document.dispatchEvent(new CustomEvent('iht:opensearch'));
      }
    });
  }

  /* ── 13. Accordion (delegated) ────────────────────────── */
  function initAccordions() {
    document.addEventListener('click', function (e) {
      var header = e.target.closest('.accordion-header');
      if (!header) return;
      var item = header.closest('.accordion-item');
      if (!item) return;
      item.classList.toggle('open');
    });
  }

  /* ── 14. Hero panel MutationObserver fade ─────────────── */
  function initHeroPanelAnim() {
    var panel = document.getElementById('heroContentPanel');
    if (!panel || !window.MutationObserver) return;
    var mo = new MutationObserver(function () {
      panel.classList.remove('animating');
      void panel.offsetWidth;
      panel.classList.add('animating');
    });
    mo.observe(panel, { childList: true });
  }

  /* ── 15. Active nav highlight (SPA-style) ─────────────── */
  function refreshActiveNav() {
    var activePage = getActivePage();
    document.querySelectorAll('.sidebar-nav-link[data-page]').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === activePage);
    });
    document.querySelectorAll('.mobile-nav-item').forEach(function (item) {
      var href = item.getAttribute('href') || '';
      var page = href.split('/').pop().replace('.html', '').replace('index', 'home') || 'home';
      if (page === '') page = 'home';
      item.classList.toggle('active', page === activePage || item.dataset.page === activePage);
    });
  }

  /* ── 16. Service Worker ────────────────────────────────── */
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
        .catch(function () { /* non-fatal */ });
    }
  }

  /* ── 17. GA4 ───────────────────────────────────────────── */
  function initGA4() {
    // Only inject if not already present
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-RS9LV72HK8';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', 'G-RS9LV72HK8');
  }

  /* ── 18. submitFormViaEmail helper ────────────────────── */
  // Preserved from original iHT pattern for contact forms
  window.submitFormViaEmail = function (formEl, subjectPrefix) {
    subjectPrefix = subjectPrefix || 'iHT Contact';
    var data = {};
    var inputs = formEl.querySelectorAll('input, textarea, select');
    inputs.forEach(function (el) {
      if (el.name) data[el.name] = el.value;
    });
    var body = Object.keys(data).map(function (k) {
      return k + ': ' + data[k];
    }).join('\n');
    var subject = encodeURIComponent(subjectPrefix + ' — ' + (data.name || data.subject || 'Message'));
    var bodyEnc = encodeURIComponent(body);
    var mailto = 'mailto:hello@ihearttheatre.com?subject=' + subject + '&body=' + bodyEnc;

    // Try clipboard copy too
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(body).catch(function () {});
    }
    window.location.href = mailto;
  };

  /* ── 19. Lazy-load hero images (off-screen slides) ────── */
  function initHeroLazyLoad() {
    var imgs = document.querySelectorAll('.hero-slide-img[data-src]');
    if (!imgs.length) return;
    // Slide 2 onwards — loaded on demand by slideshow JS
    // This is a safety net: load any remaining after 3s
    setTimeout(function () {
      imgs.forEach(function (img) {
        if (!img.getAttribute('src') && img.dataset.src) {
          img.setAttribute('src', img.dataset.src);
        }
      });
    }, 3000);
  }


  /* ── 21. Stage Curtain ─────────────────────────────────── */
  function initCurtain() {
    var el = document.createElement('div');
    el.id = 'stageCurtain';
    el.className = 'stage-curtain';
    el.innerHTML = '<div class="curtain-l"></div><div class="curtain-r"></div>';
    document.body.appendChild(el);

    // CSS @keyframes on .curtain-l/.curtain-r fires automatically on DOM insert.
    // animation-fill-mode:both holds panels closed during the delay, open after.
    // No JS class needed for the open direction.

    // Intercept all internal navigation to close curtain first
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      // Skip: external, anchors, mailto, tel, _blank targets
      if (href.charAt(0) === '#' ||
          href.indexOf('://') !== -1 ||
          href.indexOf('mailto:') === 0 ||
          href.indexOf('tel:') === 0 ||
          a.target === '_blank') return;
      // Skip if already on this page
      var curr = window.location.pathname;
      var dest = href;
      if (curr === dest ||
          (curr === '/' && dest === '/index.html') ||
          (curr.endsWith('/index.html') && dest === '/index.html')) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      // curtain-closing class triggers reverse CSS animation then navigate
      el.classList.add('curtain-closing');
      setTimeout(function() {
        window.location.href = dest;
      }, 620);
    }, true); // capture phase
  }

  /* ── 20. Init ──────────────────────────────────────────── */
  function init() {
    initCurtain();
    injectShell();
    initTicker();
    initReveal();
    initCardGlow();
    initSearchShortcut();
    initAccordions();
    initHeroPanelAnim();
    refreshActiveNav();
    initHeroLazyLoad();
    initGA4();
    registerSW();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
