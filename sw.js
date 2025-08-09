/* Basic Service Worker for SpeedCarma */
const CACHE_VERSION = 'v1';
const PRECACHE = `precache-${CACHE_VERSION}`;
const RUNTIME_TILE = `tiles-${CACHE_VERSION}`;

// Core assets to precache (add more if needed)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/manifest.json',
  '/img/SpeedCamGlyph-smallest.png',
  '/img/SpeedCamGlyph-small.png',
  '/img/SpeedCamGlyph-med.png',
  '/img/SpeedCamGlyph-large.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => ![PRECACHE, RUNTIME_TILE].includes(k)).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch handler: precache first, runtime caching for map tiles
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Runtime caching for OpenStreetMap tiles (avoid unlimited growth)
  if (url.hostname.match(/tile\.openstreetmap\.org$/)) {
    event.respondWith(
      caches.open(RUNTIME_TILE).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const resp = await fetch(request);
        // Clone & store if OK and limit entries
        if (resp.ok) {
          cache.put(request, resp.clone());
          trimCache(cache, 300); // keep at most 300 tiles
        }
        return resp;
      })
    );
    return;
  }

  // Precache match
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).catch(() => offlineFallback(request)))
  );
});

async function offlineFallback(request) {
  if (request.destination === 'document') {
    // Could return a lightweight offline page here.
    return new Response('<!DOCTYPE html><title>Offline</title><body><h1>Offline</h1><p>The app is not available offline yet for this resource.</p></body>', { headers: { 'Content-Type': 'text/html' } });
  }
  return Response.error();
}

async function trimCache(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  const toDelete = keys.slice(0, keys.length - maxItems);
  await Promise.all(toDelete.map(k => cache.delete(k)));
}

// Placeholder push handler (ready for future push integration)
self.addEventListener('push', event => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: 'SpeedCarma', body: event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || 'SpeedCarma', {
      body: data.body || '',
      icon: 'img/SpeedCamGlyph-small.png',
      badge: 'img/SpeedCamGlyph-smallest.png'
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = '/';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) {
      if (client.url.endsWith('/') || client.url.includes(url)) {
        return client.focus();
      }
    }
    return clients.openWindow(url);
  }));
});
