const CACHE_NAME = 'mini-mission-v14';
const CORE = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './assets/home-art.jpg', './assets/hero-select-art.jpg', './assets/controls-art.jpg', './assets/heroes-atlas.webp'];
// Le code (HTML, JS, CSS, manifeste) passe d'abord par le réseau pour que les mises à jour
// arrivent sans attendre ; les images restent servies depuis le cache. Hors ligne, tout vient du cache.
const NETWORK_FIRST = /\.(?:html|js|css|webmanifest)$/;
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
function store(request, response) {
  if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); }
  return response;
}
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const networkFirst = event.request.mode === 'navigate' || NETWORK_FIRST.test(url.pathname);
  if (networkFirst) {
    event.respondWith(fetch(event.request).then((response) => store(event.request, response)).catch(() => caches.match(event.request).then((cached) => cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => store(event.request, response))));
});
