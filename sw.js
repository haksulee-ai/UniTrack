/* UniTrack V140 PWA shell helper. No app data, API or iframe responses are cached. */
const CACHE = 'unitrack-pwa-shell-v144';
const SHELL = ['./icon-192.png', './icon-512.png', './manifest.json'];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => Promise.allSettled(SHELL.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('unitrack-pwa-shell-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || req.method !== 'GET') return;
  // Keep navigation, deployment manifest and scanner/app connectivity online-first.
  if (req.mode === 'navigate' || url.pathname.endsWith('latest-deployment.json')) return;
  if (!SHELL.some(path => url.pathname.endsWith(path.slice(1)))) return;
  event.respondWith(fetch(req).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(req, copy)));
    }
    return response;
  }).catch(() => caches.match(req)));
});
