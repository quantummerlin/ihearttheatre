/**
 * iHeartTheatre — Cmd-K Search Modal
 * Powered by Pagefind. Self-contained: injects its own DOM and CSS.
 * Load from shared.js or any page. No other dependencies.
 */
(function () {
  'use strict';

  /* ── Constants ─────────────────────────────────── */
  const DEBOUNCE_MS = 180;
  const MAX_RESULTS = 12;

  /* ── Inject CSS ────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    /* Overlay */
    .iht-search-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(2, 2, 6, 0.75);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; justify-content: center; align-items: flex-start;
      padding-top: min(18vh, 160px);
      opacity: 0; visibility: hidden;
      transition: opacity .2s ease, visibility .2s ease;
    }
    .iht-search-overlay.open {
      opacity: 1; visibility: visible;
    }

    /* Modal */
    .iht-search-modal {
      width: min(640px, 92vw);
      background: rgba(12, 12, 20, 0.96);
      border: 1px solid rgba(102, 126, 234, 0.25);
      border-radius: 16px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6),
                  0 0 60px rgba(102, 126, 234, 0.08);
      overflow: hidden;
      transform: translateY(-12px) scale(0.97);
      transition: transform .2s ease;
    }
    .iht-search-overlay.open .iht-search-modal {
      transform: translateY(0) scale(1);
    }

    /* Input row */
    .iht-search-input-row {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .iht-search-icon {
      flex-shrink: 0; width: 20px; height: 20px;
      color: rgba(160, 160, 176, 0.7);
    }
    .iht-search-input {
      flex: 1; background: none; border: none; outline: none;
      font-family: 'Inter', sans-serif; font-size: 17px;
      color: #f5f5f5; caret-color: #667eea;
    }
    .iht-search-input::placeholder { color: rgba(160, 160, 176, 0.5); }
    .iht-search-kbd {
      flex-shrink: 0;
      padding: 3px 8px; border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-family: 'Inter', sans-serif; font-size: 12px;
      color: rgba(160, 160, 176, 0.6); letter-spacing: 0.02em;
    }

    /* Results area */
    .iht-search-results {
      max-height: min(50vh, 420px);
      overflow-y: auto; padding: 8px;
      scrollbar-width: thin;
      scrollbar-color: rgba(102, 126, 234, 0.25) transparent;
    }
    .iht-search-results::-webkit-scrollbar { width: 6px; }
    .iht-search-results::-webkit-scrollbar-track { background: transparent; }
    .iht-search-results::-webkit-scrollbar-thumb {
      background: rgba(102, 126, 234, 0.25); border-radius: 3px;
    }

    /* Empty / status states */
    .iht-search-status {
      padding: 32px 20px; text-align: center;
      font-family: 'Inter', sans-serif; font-size: 14px;
      color: rgba(160, 160, 176, 0.6); line-height: 1.5;
    }
    .iht-search-status kbd {
      padding: 2px 6px; border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px; color: rgba(160, 160, 176, 0.7);
    }

    /* Result item */
    .iht-search-result {
      display: block; text-decoration: none;
      padding: 12px 16px; border-radius: 10px;
      transition: background .15s ease;
      cursor: pointer; color: inherit;
    }
    .iht-search-result:hover,
    .iht-search-result.active {
      background: rgba(102, 126, 234, 0.1);
    }
    .iht-search-result-title {
      font-family: 'Playfair Display', serif;
      font-size: 15px; font-weight: 600;
      color: #f5f5f5; margin-bottom: 3px;
      display: flex; align-items: center; gap: 8px;
    }
    .iht-search-result-badge {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.08em;
      padding: 2px 7px; border-radius: 4px;
      flex-shrink: 0;
    }
    .iht-search-badge-show {
      background: rgba(102, 126, 234, 0.18); color: #8da2f0;
    }
    .iht-search-badge-review {
      background: rgba(255, 215, 0, 0.14); color: #ffd700;
    }
    .iht-search-badge-role {
      background: rgba(118, 75, 162, 0.2); color: #b58fe0;
    }
    .iht-search-badge-song {
      background: rgba(0, 206, 180, 0.14); color: #00ceb4;
    }
    .iht-search-badge-page {
      background: rgba(255, 255, 255, 0.06); color: rgba(160, 160, 176, 0.7);
    }
    .iht-search-result-excerpt {
      font-family: 'Inter', sans-serif;
      font-size: 13px; color: rgba(160, 160, 176, 0.7);
      line-height: 1.45; display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .iht-search-result-excerpt mark {
      background: rgba(102, 126, 234, 0.25); color: #c7d2fe;
      border-radius: 2px; padding: 0 1px;
    }

    /* Footer */
    .iht-search-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-family: 'Inter', sans-serif; font-size: 11px;
      color: rgba(160, 160, 176, 0.4);
    }
    .iht-search-footer-keys {
      display: flex; gap: 12px; align-items: center;
    }
    .iht-search-footer-keys kbd {
      padding: 2px 5px; border-radius: 3px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 10px; color: rgba(160, 160, 176, 0.5);
    }

    /* Nav search button (injected into nav) */
    .iht-nav-search-btn {
      background: none; border: none; cursor: pointer;
      padding: 6px; border-radius: 8px; display: flex;
      align-items: center; justify-content: center;
      color: rgba(160, 160, 176, 0.7);
      transition: color .2s, background .2s;
    }
    .iht-nav-search-btn:hover {
      color: #f5f5f5;
      background: rgba(255, 255, 255, 0.06);
    }
    .iht-nav-search-btn svg {
      width: 18px; height: 18px;
    }

    @media (max-width: 768px) {
      .iht-search-overlay { padding-top: 12px; }
      .iht-search-modal { width: 96vw; border-radius: 14px; }
      .iht-search-input { font-size: 16px; }
      .iht-search-kbd { display: none; }
      .iht-search-footer-keys { display: none; }
    }
  `;
  document.head.appendChild(style);

  /* ── Build DOM ─────────────────────────────────── */
  const SEARCH_SVG = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><line x1="13" y1="13" x2="18" y2="18"/></svg>';

  const overlay = document.createElement('div');
  overlay.className = 'iht-search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Site search');
  overlay.innerHTML = `
    <div class="iht-search-modal">
      <div class="iht-search-input-row">
        <span class="iht-search-icon">${SEARCH_SVG}</span>
        <input class="iht-search-input" type="text"
               placeholder="Search shows, reviews, roles, songs..."
               aria-label="Search" autocomplete="off" spellcheck="false">
        <span class="iht-search-kbd">ESC</span>
      </div>
      <div class="iht-search-results">
        <div class="iht-search-status">
          Type to search across all of iHeartTheatre.<br>
          <kbd>${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd> to open anytime.
        </div>
      </div>
      <div class="iht-search-footer">
        <div class="iht-search-footer-keys">
          <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
        <span>Powered by Pagefind</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.iht-search-input');
  const resultsEl = overlay.querySelector('.iht-search-results');
  let activeIdx = -1;
  let pagefind = null;
  let debounceTimer = null;

  /* ── Pagefind loader ──────────────────────────── */
  async function loadPagefind() {
    if (pagefind) return pagefind;
    try {
      pagefind = await import('/_pagefind/pagefind.js');
      await pagefind.options({ excerptLength: 20 });
      return pagefind;
    } catch (e) {
      console.warn('[iHT Search] Pagefind not available:', e);
      return null;
    }
  }

  /* ── Classify result by URL ───────────────────── */
  function classify(url) {
    if (/\/shows\//.test(url))    return { badge: 'Show',   cls: 'show'   };
    if (/\/reviews\//.test(url))  return { badge: 'Review', cls: 'review' };
    if (/\/musicals\/.*\/.*\.html/.test(url)) return { badge: 'Role', cls: 'role' };
    if (/songs\.html/.test(url))  return { badge: 'Song',   cls: 'song'   };
    if (/musicals\.html/.test(url)) return { badge: 'Role Finder', cls: 'role' };
    if (/auditions\.html/.test(url)) return { badge: 'Audition', cls: 'show' };
    if (/career-builder/.test(url)) return { badge: 'Career', cls: 'role' };
    return { badge: 'Page', cls: 'page' };
  }

  /* ── Render search results ────────────────────── */
  async function runSearch(query) {
    if (!query || query.length < 2) {
      resultsEl.innerHTML = `<div class="iht-search-status">
        Type to search across all of iHeartTheatre.<br>
        <kbd>${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd> to open anytime.
      </div>`;
      activeIdx = -1;
      return;
    }

    const pf = await loadPagefind();
    if (!pf) {
      resultsEl.innerHTML = '<div class="iht-search-status">Search index not available.</div>';
      return;
    }

    const search = await pf.search(query);

    if (!search.results.length) {
      resultsEl.innerHTML = `<div class="iht-search-status">No results for "${escHtml(query)}"</div>`;
      activeIdx = -1;
      return;
    }

    /* Load the first N results' data in parallel */
    const top = search.results.slice(0, MAX_RESULTS);
    const loaded = await Promise.all(top.map(r => r.data()));

    let html = '';
    loaded.forEach((d, i) => {
      const c = classify(d.url);
      /* Clean title — strip " | iHeartTheatre" suffixes */
      let title = (d.meta?.title || d.url).replace(/\s*[|–—]\s*iHeartTheatre.*$/i, '').trim();
      if (!title) title = d.url;
      html += `
        <a href="${escAttr(d.url)}" class="iht-search-result" data-idx="${i}">
          <div class="iht-search-result-title">
            <span>${escHtml(title)}</span>
            <span class="iht-search-result-badge iht-search-badge-${c.cls}">${c.badge}</span>
          </div>
          <div class="iht-search-result-excerpt">${d.excerpt || ''}</div>
        </a>`;
    });
    resultsEl.innerHTML = html;
    activeIdx = -1;
  }

  /* ── Keyboard navigation ──────────────────────── */
  function getItems() { return resultsEl.querySelectorAll('.iht-search-result'); }

  function setActive(idx) {
    const items = getItems();
    items.forEach(el => el.classList.remove('active'));
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    }
    activeIdx = idx;
  }

  function navigateResult() {
    const items = getItems();
    if (activeIdx >= 0 && activeIdx < items.length) {
      const href = items[activeIdx].getAttribute('href');
      if (href) window.location.href = href;
    }
  }

  /* ── Open / close ─────────────────────────────── */
  function open() {
    overlay.classList.add('open');
    input.value = '';
    resultsEl.innerHTML = `<div class="iht-search-status">
      Type to search across all of iHeartTheatre.<br>
      <kbd>${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd> to open anytime.
    </div>`;
    activeIdx = -1;
    /* Pre-load Pagefind while user is about to type */
    loadPagefind();
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    overlay.classList.remove('open');
    input.blur();
    activeIdx = -1;
  }

  /* ── Event listeners ──────────────────────────── */
  /* Click overlay backdrop to close */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  /* Input handler with debounce */
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(input.value.trim()), DEBOUNCE_MS);
  });

  /* Keyboard within modal */
  input.addEventListener('keydown', e => {
    const items = getItems();
    const count = items.length;

    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIdx < count - 1 ? activeIdx + 1 : 0);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIdx > 0 ? activeIdx - 1 : count - 1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      navigateResult();
      return;
    }
  });

  /* Global Cmd/Ctrl+K */
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('open')) close();
      else open();
    }
    /* Also close on Escape if open */
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      close();
    }
  });

  /* ── Inject search button into nav ────────────── */
  function injectNavButton() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const btn = document.createElement('button');
    btn.className = 'iht-nav-search-btn';
    btn.setAttribute('aria-label', 'Search (Ctrl+K)');
    btn.title = `Search (${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K)`;
    btn.innerHTML = SEARCH_SVG;
    btn.addEventListener('click', e => { e.preventDefault(); open(); });

    /* Insert before the first link */
    navLinks.insertBefore(btn, navLinks.firstChild);
  }

  /* ── Utilities ─────────────────────────────────── */
  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
  function escAttr(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Init ──────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavButton);
  } else {
    injectNavButton();
  }

  /* Expose for external triggers */
  window.ihtSearchOpen = open;
  window.ihtSearchClose = close;
})();
