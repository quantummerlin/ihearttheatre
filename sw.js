/* iHeartTheatre — sw.js (registration shim) */
if ('serviceWorker' in navigator) {
  self.addEventListener('install', function () { self.skipWaiting(); });
  self.addEventListener('activate', function (e) { e.waitUntil(clients.claim()); });
}
// Delegate to versioned service worker
importScripts('/sw_v11.js');
