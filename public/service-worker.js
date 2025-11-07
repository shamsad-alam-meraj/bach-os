// service-worker.js
const CACHE_NAME = 'bach-os-v1';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];
const API_CACHE = 'bach-os-api-v1';
const OFFLINE_PAGE = '/offline.html';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.log('Some static assets could not be cached:', error);
        });
      }),
      caches.open(API_CACHE),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip service worker and manifest requests from being cached
  if (url.pathname.includes('/service-worker.js') || url.pathname.includes('/manifest.json')) {
    event.respondWith(fetch(request));
    return;
  }

  // API calls - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({
                error: 'Offline - cached data may be outdated',
                offline: true,
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });
        })
    );
    return;
  }

  // Static assets - cache first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(request)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_PAGE);
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  if (event.tag === 'sync-meals') {
    event.waitUntil(syncOfflineData('meals'));
  } else if (event.tag === 'sync-expenses') {
    event.waitUntil(syncOfflineData('expenses'));
  }
});

async function syncOfflineData(type) {
  try {
    const db = await openIndexedDB();
    const data = await getOfflineData(db, type);

    if (data && data.length > 0) {
      for (const item of data) {
        const response = await fetch(`/api/${type}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getStoredToken()}`,
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          await deleteOfflineData(db, type, item.id);
        }
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bachOSDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineData')) {
        const store = db.createObjectStore('offlineData', { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
}

function getOfflineData(db, type) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineData'], 'readonly');
    const store = transaction.objectStore('offlineData');
    const index = store.index('type');
    const request = index.getAll(type);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteOfflineData(db, type, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineData'], 'readwrite');
    const store = transaction.objectStore('offlineData');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

function getStoredToken() {
  return new Promise((resolve) => {
    const request = indexedDB.open('bachOSDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const tokenRequest = store.get('auth_token');

      tokenRequest.onsuccess = () => {
        resolve(tokenRequest.result?.value || '');
      };
      tokenRequest.onerror = () => resolve('');
    };
    request.onerror = () => resolve('');
  });
}
