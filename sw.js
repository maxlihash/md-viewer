// MD Viewer — service worker (offline cache)
const CACHE = 'md-viewer-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/assets/app.js',
  '/about',
  '/privacy',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
