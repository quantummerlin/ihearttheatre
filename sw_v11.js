/* iHeartTheatre — sw_v11.js
   Network-first for HTML, cache-first for static assets */

var CACHE_VERSION  = 'iht-v1';
var STATIC_CACHE   = 'iht-v1-static';
var PAGE_CACHE     = 'iht-v1-pages';

var PRECACHE_URLS = [
  '/css/style.css',
  '/js/main.js',
  '/manifest.json',
  '/data/ticker.json'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.addAll(PRECACHE_URLS.map(function (u) {
        return new Request(u, { cache: 'reload' });
      })).catch(function () {});
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== STATIC_CACHE && key !== PAGE_CACHE) {
          return caches.delete(key);
        }
      }));
    }).then(function () { return clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = new URL(req.url);

  // Only handle same-origin GET requests
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  var isHTML = req.headers.get('Accept') && req.headers.get('Accept').indexOf('text/html') !== -1;
  var isStatic = /\.(css|js|woff2?|svg|png|jpg|webp|ico|json)$/.test(url.pathname);

  if (isHTML) {
    // Network-first for HTML
    e.respondWith(
      fetch(req).then(function (res) {
        var clone = res.clone();
        caches.open(PAGE_CACHE).then(function (c) { c.put(req, clone); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match('/offline.html') || new Response('Offline', { headers: { 'Content-Type': 'text/plain' } });
        });
      })
    );
  } else if (isStatic) {
    // Cache-first for static assets
    e.respondWith(
      caches.match(req).then(function (cached) {
        if (cached) return cached;
        return fetch(req).then(function (res) {
          var clone = res.clone();
          caches.open(STATIC_CACHE).then(function (c) { c.put(req, clone); });
          return res;
        });
      })
    );
  }
});
