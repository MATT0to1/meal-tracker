const CACHE = 'meal-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './react.js',
  './react-dom.js',
  './babel.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS.filter(a => {
        try { new URL(a, location.href); return true; } catch { return false; }
      })))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
