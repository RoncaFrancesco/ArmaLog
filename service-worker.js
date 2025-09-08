
const VERSION = 'v5';
const CACHE_NAME = `armalog-${VERSION}`;
// Compute base path from SW scope (works at / or /subpath/)
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const P = (p) => `${BASE}${p}`;

const APP_SHELL = [
  P('/index.html'),
  P('/offline.html'),
  P('/manifest.webmanifest'),
  P('/icon-192.png'),
  P('/icon-512.png'),
  P('/maskable-512.png'),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL.map(u => new Request(u, {cache: 'reload'}))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Robust navigation handling (offline first for index)
  const isNav = req.mode === 'navigate' ||
                (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'));

  if (isNav) {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        const copy = net.clone();
        caches.open(CACHE_NAME).then(c => c.put(P('/index.html'), copy));
        return net;
      } catch (err) {
        return (await caches.match(P('/index.html'))) || (await caches.match(P('/offline.html')));
      }
    })());
    return;
  }

  // Same-origin GET assets: cache-first, revalidate in background
  if (req.method === 'GET' && url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) {
        fetch(req).then(res => caches.open(CACHE_NAME).then(c => c.put(req, res)));
        return cached;
      }
      try {
        const res = await fetch(req);
        caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
        return res;
      } catch (err) {
        return new Response('', {status: 504, statusText: 'Offline'});
      }
    })());
  }
});
