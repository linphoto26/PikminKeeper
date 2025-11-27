
const CACHE_NAME = 'pikmin-keeper-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  'https://cdn.tailwindcss.com'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // We try to cache core assets. 
        // Note: In a dev environment like this, dynamic imports might be tricky to cache perfectly upfront,
        // so we use a Stale-While-Revalidate strategy in fetch mostly.
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  // Skip non-http requests (like chrome-extension://)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(() => {
            // Fallback logic if network fails and no cache could go here
        });

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
  );
});
