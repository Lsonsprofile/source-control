const CACHE_NAME = 'my-cache-v1';

// List of files to cache
const urlsToCache = [
  './index.html',
  'styles/alarm.css',
  './alarm.js',
  './favicon.ico',
  './manifest.json',
  'images/favicon-32x32.png',
  'icon-152.png'
];

// Install event: cache files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting(); // activates worker immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Wrap addAll in try/catch to prevent failing on missing files
      try {
        await cache.addAll(urlsToCache);
        console.log('[Service Worker] All files cached');
      } catch (err) {
        console.error('[Service Worker] Cache failed:', err);
      }
    })
  );
});

// Activate event: clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event: serve cached files first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file or fetch from network
      return cachedResponse || fetch(event.request);
    }).catch(err => {
      console.error('[Service Worker] Fetch failed:', err);
    })
  );
});
