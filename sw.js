const CACHE_NAME = 'ddt-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/images/sofa.png',
  '/images/another_sofa.png',
  '/images/bed.png',
  '/images/dressing_table.png',
  '/images/tv_cabinet.png',
  '/images/shoe_rack.png',
  '/images/tea_table.png',
  '/images/modular_kitchen.png',
  '/images/daraz.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
      return response;
    }).catch(() => caches.match('/offline.html')))
  );
});
