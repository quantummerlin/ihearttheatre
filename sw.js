// iHeartTheatre Service Worker v2.2
const CACHE_NAME = 'ihearttheatre-v10';
const OFFLINE_URL = '/404.html';

// ── Bump CACHE_NAME (e.g. v6, v7) on every deploy to ensure everyone gets fresh assets ──

// Core pages to pre-cache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/shows.html',
  '/auditions.html',
  '/services.html',
  '/musicals.html',
  '/data/musicals-index.json',
  '/data/audition-songs.json',
  '/reviews.html',
  '/reviewers.html',
  '/about.html',
  '/contact.html',
  '/junior-kids-schools.html',
  '/holiday-programs.html',
  '/manifest.json',
  '/css/shared.css',
  '/js/shared.js',
  '/404.html',
  '/data/noticeboard/submissions.json',
  '/data/providers/providers.json',
  '/data/calendar.json',
  '/companies.html',
  '/whats-on.html',
  '/actors.html',
  '/venues.html',
  '/submit-actor.html',
  '/submit-show.html',
  '/promote-show.html'
];

// Install - pre-cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching core assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches, then notify all open tabs an update is live
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' })))
  );
});

// Fetch strategies:
//  /data/*.json  → network-first  (always fresh content; cache only for offline)
//  HTML pages    → network-first
//  Images        → cache-first with network fallback
//  CSS/JS/Fonts  → stale-while-revalidate
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin)) return;

  const url = new URL(request.url);

  // JSON data files — network-first (critical: always serve latest data)
  if (url.pathname.startsWith('/data/') && url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(cached =>
          cached || new Response('[]', { headers: { 'Content-Type': 'application/json' } })
        ))
    );
    return;
  }

  // HTML pages — network-first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Images — cache-first with network fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // CSS / JS / Fonts — stale-while-revalidate
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
