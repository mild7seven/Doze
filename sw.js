const CACHE_NAME = 'sleep-analyzer-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Cache CDN Chart.js agar grafik tetap muncul saat offline
  'https://cdn.jsdelivr.net/npm/chart.js' 
];

// Event Install: Menyimpan file ke dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event Fetch: Mengambil data dari cache jika offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, kembalikan response cache
        if (response) {
          return response;
        }
        // Jika tidak, lakukan request jaringan normal
        return fetch(event.request);
      })
  );
});

// Event Activate: Membersihkan cache versi lama jika ada pembaruan
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
