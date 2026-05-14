/**
 * iHeartTheatre - Shared JavaScript v1.0
 * Common functionality across all pages
 */

// ============================================
// Service Worker Registration + Update Toast
// ============================================
if ('serviceWorker' in navigator) {
 window.addEventListener('load', () => {
 navigator.serviceWorker.register('/sw.js')
 .then(reg => console.log('[iHT] Service Worker registered:', reg.scope))
 .catch(err => console.log('[iHT] Service Worker registration failed:', err));
 });

 // Listen for SW_UPDATED message from the new service worker
 navigator.serviceWorker.addEventListener('message', event => {
 if (event.data && event.data.type === 'SW_UPDATED') {
 _showUpdateToast();
 }
 });
}

function _showUpdateToast() {
 if (document.getElementById('iht-update-toast')) return;
 const t = document.createElement('div');
 t.id = 'iht-update-toast';
 t.style.cssText = [
 'position:fixed', 'bottom:90px', 'left:50%', 'transform:translateX(-50%)',
 'background:#12121a', 'border:1px solid rgba(102,126,234,0.4)',
 'border-radius:12px', 'padding:12px 18px', 'display:flex',
 'align-items:center', 'gap:12px', 'z-index:9999',
 'box-shadow:0 4px 24px rgba(0,0,0,0.5)', 'font-size:0.9rem',
 'font-family:"Inter",-apple-system,sans-serif', 'color:#f5f5f5',
 'white-space:nowrap'
 ].join(';');
 t.innerHTML = '<span>🎭 Site updated!</span>'
 + '<button onclick="location.reload()" style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;padding:6px 14px;cursor:pointer;font-size:0.85rem;font-family:inherit;">Refresh</button>'
 + '<button onclick="document.getElementById(\'iht-update-toast\').remove()" style="background:none;border:none;color:#a0a0b0;cursor:pointer;font-size:1.2rem;padding:0 4px;" aria-label="Dismiss">&times;</button>';
 document.body.appendChild(t);
 // Auto-dismiss after 12 seconds
 setTimeout(() => { const el = document.getElementById('iht-update-toast'); if (el) el.remove(); }, 12000);
}

// ============================================
// iHT User Data — saves, export, import
// All user data uses iht_ prefix in localStorage.
// localStorage is NOT cleared during SW cache busts — data is always safe.
// ============================================
window.iHT = (function() {
 var SAVES_KEY = 'iht_saves';
 var DATA_VER_KEY = 'iht_data_version';
 var CURRENT_VER = 1;

 function _read(key) {
 try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
 }

 function _write(key, val) {
 try { localStorage.setItem(key, JSON.stringify(val)); return true; }
 catch(e) { console.warn('[iHT] localStorage write failed:', e); return false; }
 }

 function _getSaves() {
 return _read(SAVES_KEY) || { shows: {}, auditions: {}, services: {} };
 }

 return {
 /** Toggle save for an item. Returns new saved state (true/false) */
 toggle: function(type, id, summary) {
 var saves = _getSaves();
 var bucket = type + 's';
 if (!saves[bucket]) saves[bucket] = {};
 if (saves[bucket][id]) {
 delete saves[bucket][id];
 _write(SAVES_KEY, saves);
 this._updateBadge();
 return false;
 } else {
 saves[bucket][id] = Object.assign({}, summary, { _savedAt: new Date().toISOString() });
 _write(SAVES_KEY, saves);
 this._updateBadge();
 return true;
 }
 },

 /** Check if an item is saved */
 isSaved: function(type, id) {
 var saves = _getSaves();
 return !!(saves[type + 's'] && saves[type + 's'][id]);
 },

 /** Get all saves object */
 getSaves: function() { return _getSaves(); },

 /** Count all saved items across all types */
 count: function() {
 var s = _getSaves();
 return Object.values(s).reduce(function(n, obj) { return n + Object.keys(obj).length; }, 0);
 },

 /** Export all iHT localStorage data as a JSON file download */
 exportData: function() {
 var out = { _exported: new Date().toISOString(), _version: CURRENT_VER };
 for (var i = 0; i < localStorage.length; i++) {
 var k = localStorage.key(i);
 if (k && k.startsWith('iht_')) {
 try { out[k] = JSON.parse(localStorage.getItem(k)); }
 catch(e) { out[k] = localStorage.getItem(k); }
 }
 }
 // Include legacy keys so nothing is lost
 ['cookie-consent','visited','clickedReviews','reviewsSubmitted'].forEach(function(k) {
 var v = localStorage.getItem(k);
 if (v !== null) out['_legacy_' + k] = v;
 });
 var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
 var url = URL.createObjectURL(blob);
 var a = document.createElement('a');
 a.href = url;
 a.download = 'ihearttheatre-my-data-' + new Date().toISOString().slice(0,10) + '.json';
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
 },

 /** Import from a previously exported JSON file */
 importData: function(jsonText) {
 try {
 var data = JSON.parse(jsonText);
 var count = 0;
 Object.entries(data).forEach(function(entry) {
 var k = entry[0], v = entry[1];
 if (k.startsWith('iht_')) {
 localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
 count++;
 }
 });
 this._updateBadge();
 return count;
 } catch(e) { console.error('[iHT] Import failed:', e); return -1; }
 },

 /** Update the floating saves badge count */
 _updateBadge: function() {
 var btn = document.getElementById('iht-saves-btn');
 if (!btn) return;
 var n = this.count();
 btn.dataset.count = n;
 var badge = btn.querySelector('.iht-saves-badge');
 if (badge) badge.textContent = n;
 btn.style.opacity = n > 0 ? '1' : '0.6';
 },

 /** Initialise the floating saves button and panel */
 _initPanel: function() {
 var self = this;

 // Floating button
 var btn = document.createElement('button');
 btn.id = 'iht-saves-btn';
 btn.setAttribute('aria-label', 'My saved items');
 btn.innerHTML = '<span style="font-size:1.1rem;">♡</span><span class="iht-saves-badge" style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:10px;padding:1px 7px;font-size:0.75rem;font-weight:700;min-width:18px;text-align:center;">' + this.count() + '</span>';
 btn.style.cssText = [
 'position:fixed', 'bottom:76px', 'right:20px',
 'background:#12121a', 'border:1px solid rgba(255,255,255,0.1)',
 'border-radius:24px', 'padding:8px 14px', 'cursor:pointer',
 'display:flex', 'align-items:center', 'gap:7px',
 'color:#f5f5f5', 'font-family:"Inter",-apple-system,sans-serif',
 'font-size:0.9rem', 'z-index:9990',
 'box-shadow:0 2px 12px rgba(0,0,0,0.4)',
 'transition:all 0.2s ease',
 'opacity:' + (this.count() > 0 ? '1' : '0.6')
 ].join(';');
 btn.addEventListener('click', function() { self._openPanel(); });
 document.body.appendChild(btn);

 // Panel overlay
 var overlay = document.createElement('div');
 overlay.id = 'iht-saves-overlay';
 overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:10000;opacity:0;pointer-events:none;transition:opacity 0.25s ease;';
 overlay.addEventListener('click', function(e) { if (e.target === overlay) self._closePanel(); });
 document.body.appendChild(overlay);

 // Panel drawer
 var panel = document.createElement('div');
 panel.id = 'iht-saves-panel';
 panel.style.cssText = [
 'position:fixed', 'top:0', 'right:0', 'bottom:0', 'width:min(420px,100vw)',
 'background:#0a0a0f', 'border-left:1px solid rgba(255,255,255,0.08)',
 'z-index:10001', 'display:flex', 'flex-direction:column',
 'transform:translateX(100%)', 'transition:transform 0.3s cubic-bezier(0.4,0,0.2,1)',
 'font-family:"Inter",-apple-system,sans-serif', 'color:#f5f5f5'
 ].join(';');
 panel.innerHTML = this._panelHTML();
 document.body.appendChild(panel);

 // Wire up panel buttons
 panel.querySelector('#iht-panel-close').addEventListener('click', function() { self._closePanel(); });
 panel.querySelector('#iht-export-btn').addEventListener('click', function() { self.exportData(); });
 panel.querySelector('#iht-import-label').addEventListener('click', function() {
 var inp = document.createElement('input');
 inp.type = 'file'; inp.accept = '.json';
 inp.addEventListener('change', function() {
 if (!inp.files[0]) return;
 var reader = new FileReader();
 reader.onload = function(ev) {
 var n = self.importData(ev.target.result);
 if (n >= 0) { self._refreshPanelContent(); alert('Imported ' + n + ' data entries!'); }
 else { alert('Import failed — file may be invalid.'); }
 };
 reader.readAsText(inp.files[0]);
 });
 inp.click();
 });

 document.addEventListener('keydown', function(e) {
 if (e.key === 'Escape') self._closePanel();
 });
 },

 _panelHTML: function() {
 var s = this.getSaves();
 var shows = Object.values(s.shows || {});
 var auditions = Object.values(s.auditions || {});
 var services = Object.values(s.services || {});

 function itemCard(item, type) {
 var title = item.title || item.show_title || item.name || '—';
 var sub = item.company || item.tagline || '';
 var date = item.date_start || item.audition_date || item.date_end || '';
 if (date) { try { date = new Date(date).toLocaleDateString('en-AU', {day:'numeric',month:'short',year:'numeric'}); } catch(e) {} }
 return '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">'
 + '<div style="flex:1;min-width:0;">'
 + '<div style="font-weight:600;font-size:0.9rem;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + title + '">' + title + '</div>'
 + (sub ? '<div style="color:#a0a0b0;font-size:0.8rem;margin-bottom:2px;">' + sub + '</div>' : '')
 + (date ? '<div style="color:#a0a0b0;font-size:0.78rem;">📅 ' + date + '</div>' : '')
 + '</div>'
 + '<button onclick="iHT._removeFromPanel(\'' + type + '\',\'' + item.id + '\')" style="background:none;border:none;color:#a0a0b0;cursor:pointer;font-size:1.1rem;padding:2px 4px;flex-shrink:0;" aria-label="Remove" title="Remove">✕</button>'
 + '</div>';
 }

 function section(label, items, type, emptyMsg) {
 return '<div style="margin-bottom:16px;">'
 + '<div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#667eea;margin-bottom:8px;">' + label + ' (' + items.length + ')</div>'
 + (items.length ? items.map(function(i) { return itemCard(i, type); }).join('') : '<div style="color:#a0a0b0;font-size:0.85rem;padding:8px 0;">' + emptyMsg + '</div>')
 + '</div>';
 }

 return '<div style="padding:20px 18px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);">'
 + '<div style="font-family:\'Playfair Display\',serif;font-size:1.2rem;font-weight:600;">My Saved Items</div>'
 + '<button id="iht-panel-close" style="background:none;border:none;color:#a0a0b0;font-size:1.4rem;cursor:pointer;padding:4px;" aria-label="Close">&times;</button>'
 + '</div>'
 + '<div id="iht-panel-body" style="flex:1;overflow-y:auto;padding:18px;">'
 + section('Shows', shows, 'show', 'No shows saved yet — tap ♡ on any show card.')
 + section('Auditions', auditions, 'audition', 'No auditions saved yet — tap ♡ on any audition.')
 + section('Services', services, 'service', 'No services saved yet — tap ♡ on any provider.')
 + '</div>'
 + '<div style="padding:14px 18px;border-top:1px solid rgba(255,255,255,0.08);display:flex;gap:10px;flex-wrap:wrap;">'
 + '<button id="iht-export-btn" style="flex:1;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;padding:10px 16px;cursor:pointer;font-size:0.88rem;font-family:inherit;font-weight:600;">📥 Export My Data</button>'
 + '<span id="iht-import-label" style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 16px;cursor:pointer;font-size:0.88rem;text-align:center;color:#f5f5f5;">📤 Import Data</span>'
 + '</div>';
 },

 _openPanel: function() {
 var overlay = document.getElementById('iht-saves-overlay');
 var panel = document.getElementById('iht-saves-panel');
 if (!overlay || !panel) return;
 overlay.style.opacity = '1';
 overlay.style.pointerEvents = 'auto';
 panel.style.transform = 'translateX(0)';
 document.body.style.overflow = 'hidden';
 },

 _closePanel: function() {
 var overlay = document.getElementById('iht-saves-overlay');
 var panel = document.getElementById('iht-saves-panel');
 if (!overlay || !panel) return;
 overlay.style.opacity = '0';
 overlay.style.pointerEvents = 'none';
 panel.style.transform = 'translateX(100%)';
 document.body.style.overflow = '';
 },

 _removeFromPanel: function(type, id) {
 this.toggle(type, id, null); // toggle off
 this._refreshPanelContent();
 // Update save buttons on page
 var btn = document.querySelector('[data-save-type="' + type + '"][data-save-id="' + id + '"]');
 if (btn) { btn.innerHTML = '♡'; btn.title = 'Save'; btn.classList.remove('saved'); }
 },

 _refreshPanelContent: function() {
 var panel = document.getElementById('iht-saves-panel');
 if (!panel) return;
 var body = panel.querySelector('#iht-panel-body');
 if (body) {
 // Re-render the full panel HTML and replace just the scrollable body
 var tempDiv = document.createElement('div');
 tempDiv.innerHTML = this._panelHTML();
 var newBody = tempDiv.querySelector('#iht-panel-body');
 if (newBody) body.replaceWith(newBody);
 }
 this._updateBadge();
 }
 };
})();

// ============================================
// Progress Bar
// ============================================
function initProgressBar() {
 const progressBar = document.getElementById('progressBar');
 if (!progressBar) return;

 window.addEventListener('scroll', () => {
 const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
 const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
 const progress = (scrollTop / scrollHeight) * 100;
 progressBar.style.width = progress + '%';
 });
}

// ============================================
// Hamburger Menu
// ============================================
function initHamburger() {
 const hamburger = document.querySelector('.hamburger');
 const navLinks = document.querySelector('.nav-links');
 if (!hamburger || !navLinks) return;

 hamburger.addEventListener('click', () => {
 hamburger.classList.toggle('active');
 navLinks.classList.toggle('active');
 });

 // Close menu when clicking a link
 navLinks.querySelectorAll('a').forEach(link => {
 link.addEventListener('click', () => {
 hamburger.classList.remove('active');
 navLinks.classList.remove('active');
 });
 });

 // Close menu when clicking outside
 document.addEventListener('click', (e) => {
 if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
 hamburger.classList.remove('active');
 navLinks.classList.remove('active');
 }
 });
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
 const btn = document.getElementById('backToTop');
 if (!btn) return;

 window.addEventListener('scroll', () => {
 if (window.scrollY > 400) {
 btn.classList.add('visible');
 } else {
 btn.classList.remove('visible');
 }
 });

 btn.addEventListener('click', () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 });
}

// ============================================
// Cookie/Privacy Consent Banner
// ============================================
function initCookieConsent() {
 if (localStorage.getItem('cookie-consent')) return;

 const banner = document.createElement('div');
 banner.id = 'cookie-consent';
 banner.className = 'cookie-consent';
 banner.innerHTML = `
 <div class="cookie-text">
 <p>We use cookies and local storage to improve your experience, remember your preferences, and enable offline access via our service worker.
 <a href="${window.location.pathname.includes('/reviews/') ? '../privacy.html' : 'privacy.html'}">Privacy Policy</a></p>
 </div>
 <div class="cookie-actions">
 <button class="cookie-accept" onclick="acceptCookies()">Accept</button>
 <button class="cookie-decline" onclick="declineCookies()">Decline</button>
 </div>
 `;
 document.body.appendChild(banner);
 requestAnimationFrame(() => banner.classList.add('show'));
}

function acceptCookies() {
 localStorage.setItem('cookie-consent', 'accepted');
 closeCookieBanner();
}

function declineCookies() {
 localStorage.setItem('cookie-consent', 'declined');
 closeCookieBanner();
}

function closeCookieBanner() {
 const banner = document.getElementById('cookie-consent');
 if (banner) {
 banner.classList.remove('show');
 setTimeout(() => banner.remove(), 400);
 }
}

// ============================================
// Gallery Lightbox
// ============================================
function initLightbox() {
 // Find all gallery images
 var galleryImages = document.querySelectorAll(
  '.gallery img, .gallery-item img, .review-gallery-item img'
 );
 if (galleryImages.length === 0) return;

 // Create lightbox overlay
 var overlay = document.createElement('div');
 overlay.className = 'lightbox-overlay';
 overlay.innerHTML =
  '<button class="lightbox-close" aria-label="Close">&times;</button>' +
  '<button class="lightbox-nav prev" aria-label="Previous">&lsaquo;</button>' +
  '<img src="" alt="Full size image">' +
  '<button class="lightbox-nav next" aria-label="Next">&rsaquo;</button>';
 document.body.appendChild(overlay);

 var lightboxImg = overlay.querySelector('img');
 var closeBtn = overlay.querySelector('.lightbox-close');
 var prevBtn = overlay.querySelector('.lightbox-nav.prev');
 var nextBtn = overlay.querySelector('.lightbox-nav.next');
 var images = Array.from(galleryImages);
 var currentIndex = 0;

 function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt || 'Gallery image';
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
 }

 function closeLightbox() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
 }

 function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt || 'Gallery image';
 }

 function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt || 'Gallery image';
 }

 images.forEach(function(img, i) {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', function(e) {
   e.preventDefault();
   openLightbox(i);
  });
 });

 closeBtn.addEventListener('click', closeLightbox);
 prevBtn.addEventListener('click', function(e) { e.stopPropagation(); showPrev(); });
 nextBtn.addEventListener('click', function(e) { e.stopPropagation(); showNext(); });

 overlay.addEventListener('click', function(e) {
  if (e.target === overlay) closeLightbox();
 });

 document.addEventListener('keydown', function(e) {
  if (!overlay.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
 });
}

// ============================================
// Initialize Everything
// ============================================
// ============================================
// Scroll Reveal
// ============================================
function initScrollReveal() {
 if (!window.IntersectionObserver) {
  // Fallback: reveal everything instantly
  document.querySelectorAll('[data-reveal]').forEach(function(el) { el.classList.add('revealed'); });
  return;
 }
 var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
   if (entry.isIntersecting) {
    entry.target.classList.add('revealed');
    io.unobserve(entry.target);
   }
  });
 }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

 // Auto-stagger children of [data-reveal-stagger] parents
 document.querySelectorAll('[data-reveal-stagger]').forEach(function(parent) {
  var children = Array.prototype.slice.call(parent.querySelectorAll('[data-reveal]'));
  children.forEach(function(child, i) {
   if (i < 4) child.setAttribute('data-reveal-delay', String(i + 1));
  });
 });

 document.querySelectorAll('[data-reveal]').forEach(function(el) {
  io.observe(el);
 });

 // Expose so dynamically injected elements can also be observed
 window.iHTReveal = io;
}

document.addEventListener('DOMContentLoaded', () => {
 initProgressBar();
 initHamburger();
 initBackToTop();
 initCookieConsent();
 initLightbox();
 initScrollReveal();
 initFilterAccordion();
 initNavScroll();
 initCounters();
 initActiveNavLink();
});

// ============================================
// Nav Scroll Shrink
// ============================================
function initNavScroll() {
 var nav = document.querySelector('nav');
 if (!nav) return;
 var ticking = false;
 function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function() {
   nav.classList.toggle('scrolled', window.scrollY > 60);
   ticking = false;
  });
 }
 window.addEventListener('scroll', onScroll, { passive: true });
}

// ============================================
// Count-Up Animation
// ============================================
function initCounters() {
 var counters = document.querySelectorAll('[data-count]');
 if (!counters.length || !window.IntersectionObserver) return;
 var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
   if (!entry.isIntersecting) return;
   var el = entry.target;
   var target = parseInt(el.getAttribute('data-count'), 10);
   var duration = parseInt(el.getAttribute('data-count-duration') || '1500', 10);
   var start = performance.now();
   function tick(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) {
     requestAnimationFrame(tick);
    } else {
     el.textContent = target;
    }
   }
   requestAnimationFrame(tick);
   io.unobserve(el);
  });
 }, { threshold: 0.5 });
 counters.forEach(function(el) { io.observe(el); });
}

// ============================================
// Active Nav Link Highlighter
// ============================================
function initActiveNavLink() {
 var path = window.location.pathname.replace(/\/$/, '');
 var filename = path.split('/').pop() || 'index.html';
 document.querySelectorAll('.nav-links a').forEach(function(link) {
  var href = link.getAttribute('href') || '';
  var linkFile = href.split('/').pop().replace(/^\.\.\//, '') || 'index.html';
  if (linkFile === filename || (filename === '' && linkFile === 'index.html')) {
   link.classList.add('active');
  }
 });
}

// ============================================
// Filter Accordion
// ============================================
function initFilterAccordion() {
 var headers = document.querySelectorAll('.filter-accordion-header');
 headers.forEach(function(header) {
  var body = document.getElementById(header.dataset.target);
  if (!body) return;
  header.addEventListener('click', function() {
   var isOpen = header.classList.contains('open');
   // Close all
   document.querySelectorAll('.filter-accordion-header.open').forEach(function(h) {
    h.classList.remove('open');
    var b = document.getElementById(h.dataset.target);
    if (b) b.classList.remove('open');
   });
   // Open this one if it was closed
   if (!isOpen) {
    header.classList.add('open');
    body.classList.add('open');
   }
  });
 });
}

// Expose so pages with dynamic filters can call after render
window.iHTInitFilterAccordion = initFilterAccordion;


/* ───────────────────────────────────────────────────────────
   submitFormViaEmail — shared form-to-email submission handler
   Reads a <form> element OR a plain object, builds a clean
   formatted email body, and shows a modal with a mailto: link
   + copy-to-clipboard fallback. No third-party backend.

   Usage with a <form>:
     <form id="contactForm">
       <label for="name">Your Name</label>
       <input id="name" name="name" required>
       ...
       <button type="submit">Send</button>
     </form>
     <script>
       document.getElementById('contactForm').addEventListener('submit', function(e) {
         e.preventDefault();
         submitFormViaEmail(this, {
           to: 'hello@ihearttheatre.com',
           subject: 'iHeartTheatre contact: ' + this.subject.value
         });
       });
     </script>

   Usage with a data object (when there's no real <form>):
     submitFormViaEmail({
       Name: name, Pronouns: pronouns, Role: role, ...
     }, {
       to: 'auditions@ihearttheatre.com',
       subject: 'New Performer Profile: ' + name,
       attachmentNote: 'Please attach your headshot before sending.',
       formId: 'submit-actor'
     });
─────────────────────────────────────────────────────────── */

window.submitFormViaEmail = function(source, opts) {
 opts = opts || {};
 var to = opts.to || 'hello@ihearttheatre.com';
 var subject = opts.subject || 'iHeartTheatre submission';
 var attachmentNote = opts.attachmentNote || null;
 var intro = opts.intro || null;
 var formEl = null;
 var fields = [];

 if (source && source.nodeType === 1 && source.tagName === 'FORM') {
  formEl = source;
  if (!formEl.checkValidity()) {
   formEl.reportValidity();
   return false;
  }
  var els = formEl.querySelectorAll('input, textarea, select');
  var skipTypes = ['submit','button','reset','hidden','file','image'];
  var groups = {};
  for (var i = 0; i < els.length; i++) {
   var el = els[i];
   if (!el.name || skipTypes.indexOf(el.type) > -1) continue;
   if (el.name.charAt(0) === '_') continue; // skip formsubmit-style hidden fields
   var value = '';
   if (el.type === 'checkbox') {
    if (!el.checked) continue;
    value = (el.value && el.value !== 'on') ? el.value : 'Yes';
   } else if (el.type === 'radio') {
    if (!el.checked) continue;
    value = el.value;
   } else {
    value = (el.value || '').trim();
   }
   if (value === '') continue;
   var label = el.getAttribute('data-email-label');
   if (!label && el.id) {
    var labelEl = formEl.querySelector('label[for="' + el.id + '"]');
    if (labelEl) label = labelEl.textContent.trim().replace(/[*:]+$/, '').trim();
   }
   if (!label) label = _iHTTitleCase(el.name);
   if (groups[el.name]) {
    groups[el.name].value += ', ' + value;
   } else {
    groups[el.name] = { name: el.name, label: label, value: value };
    fields.push(groups[el.name]);
   }
  }
 } else if (source && typeof source === 'object') {
  var keys = Object.keys(source);
  for (var k = 0; k < keys.length; k++) {
   var key = keys[k];
   var v = source[key];
   if (v === null || v === undefined || v === '') continue;
   if (Array.isArray(v)) v = v.join(', ');
   fields.push({ name: key, label: _iHTTitleCase(key), value: String(v) });
  }
 } else {
  if (window.console) console.warn('submitFormViaEmail: invalid source');
  return false;
 }

 // Build email body
 var lines = [];
 if (intro) { lines.push(intro, ''); }
 for (var j = 0; j < fields.length; j++) {
  var f = fields[j];
  if (f.value.indexOf('\n') > -1) {
   lines.push(f.label + ':');
   lines.push(f.value);
   lines.push('');
  } else {
   lines.push(f.label + ': ' + f.value);
  }
 }
 if (attachmentNote) {
  lines.push('', '— ' + attachmentNote);
 }
 lines.push('');
 lines.push('—');
 lines.push('Submitted via ihearttheatre.com on ' + new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' }));
 var body = lines.join('\n');
 var mailtoUrl = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

 // GA4 event (if gtag loaded)
 if (typeof gtag === 'function') {
  try {
   gtag('event', 'form_submit', {
    form_id: (formEl && formEl.id) || opts.formId || 'unknown',
    destination: to
   });
  } catch(e) {}
 }

 _iHTShowEmailFallbackModal({ to: to, subject: subject, body: body, mailtoUrl: mailtoUrl });
 return false;
};

function _iHTTitleCase(s) {
 return String(s).replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
}

function _iHTShowEmailFallbackModal(opts) {
 var modal = document.getElementById('email-fallback-modal');
 if (!modal) {
  modal = document.createElement('div');
  modal.id = 'email-fallback-modal';
  modal.innerHTML = ''
   + '<div class="efm-overlay" data-efm-close></div>'
   + '<div class="efm-panel" role="dialog" aria-labelledby="efm-title" aria-modal="true">'
   +  '<button class="efm-close" data-efm-close aria-label="Close">&times;</button>'
   +  '<h3 class="efm-title" id="efm-title">Almost there — send your submission</h3>'
   +  '<p class="efm-sub">Your message is ready for <strong class="efm-to"></strong>. Open it in your mail app, or copy the text below to send manually.</p>'
   +  '<textarea class="efm-body" readonly></textarea>'
   +  '<div class="efm-actions">'
   +   '<a class="efm-btn efm-btn-primary efm-mailto" href="#">Open in mail app</a>'
   +   '<button class="efm-btn efm-btn-secondary efm-copy" type="button">Copy to clipboard</button>'
   +  '</div>'
   +  '<p class="efm-note">No mail app? Copy the message above and email it to <strong class="efm-to-inline"></strong> from any account. We will be in touch shortly after receiving it.</p>'
   + '</div>';
  document.body.appendChild(modal);

  var closers = modal.querySelectorAll('[data-efm-close]');
  for (var c = 0; c < closers.length; c++) {
   closers[c].addEventListener('click', function() {
    modal.classList.remove('efm-open');
   });
  }
  modal.querySelector('.efm-copy').addEventListener('click', function() {
   var ta = modal.querySelector('.efm-body');
   ta.focus();
   ta.select();
   var btn = this;
   var done = function() {
    btn.textContent = 'Copied ✓';
    setTimeout(function(){ btn.textContent = 'Copy to clipboard'; }, 2200);
   };
   if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ta.value).then(done, function() {
     try { document.execCommand('copy'); done(); } catch(e) {}
    });
   } else {
    try { document.execCommand('copy'); done(); } catch(e) {}
   }
  });
  document.addEventListener('keydown', function(e) {
   if (e.key === 'Escape' && modal.classList.contains('efm-open')) {
    modal.classList.remove('efm-open');
   }
  });
 }

 var toEls = modal.querySelectorAll('.efm-to, .efm-to-inline');
 for (var t = 0; t < toEls.length; t++) toEls[t].textContent = opts.to;
 modal.querySelector('.efm-body').value = 'To: ' + opts.to + '\nSubject: ' + opts.subject + '\n\n' + opts.body;
 modal.querySelector('.efm-mailto').setAttribute('href', opts.mailtoUrl);
 modal.classList.add('efm-open');
}

// ============================================
// Site-wide Search (Cmd-K modal, Pagefind)
// ============================================
(function() {
  var s = document.createElement('script');
  s.src = '/js/search.js';
  s.defer = true;
  document.head.appendChild(s);
})();

// ============================================
// GA4 Custom Events
// ============================================
(function() {
 function ga4(event, params) {
  if (typeof gtag === 'function') gtag('event', event, params || {});
 }

 var path = window.location.pathname;
 var page = path.split('/').pop() || 'index.html';

 // Page-type events — fire once on load
 // Reviews: /reviews/review-*.html
 if (/^\/reviews\//.test(path)) {
  var title = document.title.replace(/\s*[|–—].*$/, '').trim();
  var reviewer = /penelope/i.test(page) ? 'Penelope' : 'Deanna';
  ga4('review_read', { review_title: title, reviewer: reviewer });
 }

 // Shows: /shows/mel-*.html
 if (/^\/shows\//.test(path)) {
  var showTitle = document.title.replace(/\s*[|–—].*$/, '').trim();
  ga4('show_view', { show_title: showTitle });
 }

 // Per-role pages: /musicals/*/role.html
 if (/^\/musicals\/[^/]+\/[^/]+\.html/.test(path)) {
  var parts = path.split('/');
  ga4('role_page_view', { musical: parts[2], role: parts[3].replace('.html', '') });
 }

 // Songs browser
 if (page === 'songs.html') {
  ga4('songs_browse', {});
 }

 // Auditions page
 if (page === 'auditions.html') {
  ga4('auditions_browse', {});
 }

 // Role Finder (musicals.html)
 if (page === 'musicals.html') {
  ga4('role_finder_view', {});

  // Track search usage (debounced — fires after user stops typing)
  document.addEventListener('DOMContentLoaded', function() {
   var searchInput = document.getElementById('role-search') ||
                     document.querySelector('input[type="search"], input[placeholder*="earch"]');
   if (searchInput) {
    var timer;
    searchInput.addEventListener('input', function() {
     clearTimeout(timer);
     var val = this.value.trim();
     if (val.length >= 3) {
      timer = setTimeout(function() {
       ga4('role_search', { search_term: val });
      }, 1500);
     }
    });
   }
  });
 }

 // Track outbound audition link clicks across all pages
 document.addEventListener('click', function(e) {
  var link = e.target.closest('a[href]');
  if (!link) return;
  var href = link.getAttribute('href') || '';

  // Audition-related clicks (links to auditions page or external audition sites)
  if (/audition/i.test(href) && href !== '#') {
   ga4('audition_click', {
    link_url: href,
    link_text: (link.textContent || '').trim().substring(0, 80)
   });
  }

  // Track show booking / ticket clicks (external links from show pages)
  if (/^\/shows\//.test(path) && /^https?:\/\//.test(href) && !/ihearttheatre/i.test(href)) {
   ga4('show_ticket_click', {
    show_title: document.title.replace(/\s*[|–—].*$/, '').trim(),
    link_url: href
   });
  }
 });
})();
