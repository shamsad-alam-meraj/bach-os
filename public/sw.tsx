/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'bach-os-v2';
const urlsToCache = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/auth/login',
  '/auth/signup',
  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/deposits',
  '/dashboard/deposits/add',
  '/dashboard/deposits/stats',
  '/dashboard/expenses',
  '/dashboard/expenses/add',
  '/dashboard/meals',
  '/dashboard/meals/add',
  '/dashboard/members',
  '/dashboard/members/add',
  '/dashboard/profile',
  '/dashboard/reports',
  '/dashboard/settings',
  '/dashboard/users'
];

// Install event
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event: ExtendableEvent) => {
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
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline - Page not available', { status: 503 });
        });
      })
  );
});
