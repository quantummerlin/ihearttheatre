/**
 * iHeartTheatre - Shared JavaScript v1.0
 * Common functionality across all pages
 */

// ============================================
// Service Worker Registration
// ============================================
if ('serviceWorker' in navigator) {
 window.addEventListener('load', () => {
 navigator.serviceWorker.register('/sw.js')
 .then(reg => console.log('[iHT] Service Worker registered:', reg.scope))
 .catch(err => console.log('[iHT] Service Worker registration failed:', err));
 });
}

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
// Floating Particles
// ============================================
function initParticles() {
 const container = document.getElementById('particles');
 if (!container) return;

 const count = window.innerWidth < 768 ? 8 : 15;
 for (let i = 0; i < count; i++) {
 const particle = document.createElement('div');
 particle.className = 'particle';
 particle.style.left = Math.random() * 100 + '%';
 particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
 particle.style.animationDelay = (Math.random() * 15) + 's';
 particle.style.width = (Math.random() * 4 + 2) + 'px';
 particle.style.height = particle.style.width;
 container.appendChild(particle);
 }
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
// Achievement System
// ============================================
let scrollDepth = 0;

function showAchievement(text) {
 const achievement = document.createElement('div');
 achievement.className = 'achievement-toast';
 achievement.textContent = text;
 document.body.appendChild(achievement);
 setTimeout(() => achievement.remove(), 3000);
}

function triggerConfetti() {
 const colors = ['#667eea', '#764ba2', '#ffd700', '#ff6b6b', '#f093fb'];
 for (let i = 0; i < 50; i++) {
 const confetti = document.createElement('div');
 confetti.style.cssText = `
 position: fixed;
 width: ${Math.random() * 8 + 4}px;
 height: ${Math.random() * 8 + 4}px;
 background: ${colors[Math.floor(Math.random() * colors.length)]};
 left: ${Math.random() * 100}vw;
 top: -10px;
 z-index: 10001;
 border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
 animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
 animation-delay: ${Math.random() * 0.5}s;
 `;
 document.body.appendChild(confetti);
 setTimeout(() => confetti.remove(), 4000);
 }
}

function initAchievements() {
 window.addEventListener('scroll', () => {
 const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
 const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
 const scrolled = (scrollTop / scrollHeight) * 100;

 if (scrolled >= 25 && scrollDepth < 25) {
 scrollDepth = 25;
 showAchievement('Theatre Explorer');
 } else if (scrolled >= 50 && scrollDepth < 50) {
 scrollDepth = 50;
 showAchievement('Dedicated Reader');
 } else if (scrolled >= 75 && scrollDepth < 75) {
 scrollDepth = 75;
 showAchievement('True Theatre Lover');
 } else if (scrolled >= 90 && scrollDepth < 90) {
 scrollDepth = 90;
 showAchievement('Renaissance Champion');
 triggerConfetti();
 }
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
document.addEventListener('DOMContentLoaded', () => {
 initProgressBar();
 initParticles();
 initHamburger();
 initBackToTop();
 initAchievements();
 initCookieConsent();
 initLightbox();
});
