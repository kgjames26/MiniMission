const CACHE_NAME = 'mini-mission-v126';
const CORE = ['./', './index.html', './i18n.js', './lang-en.js', './lang-es.js', './lang-de.js', './lang-ja.js', './lang-ko.js', './styles.css', './app.js', './levels.js', './cities.js', './fx.js', './stickers.js', './stickers-cities.js', './assets/friend-flame.webp', './assets/farfouille.webp', './minigames.js', './version.json', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './assets/heroes-atlas.webp', './assets/heroes-hd.webp', './assets/hero-moves.webp', './assets/monsters.webp', './assets/sprites2.webp', './assets/sprites2.json', './assets/music.mp3', './story.js', './story-en.js', './story-es.js', './story-de.js', './story-ja.js', './story-ko.js', './book-art.js', './book.js', './rose-world.html', './rose-engine.js', './rose-worlds.js', './rose-final.js', './rose-lune.html', './rose-mars.html', './rose-mars.html', './assets/rose.webp', './assets/rose.json', './assets/aliens.webp', './assets/aliens.json', './assets/rose-card.webp'];
// Le code passe d'abord par le réseau pour que les mises à jour arrivent sans attendre ; les images et la musique
// restent servies depuis le cache. Hors ligne, tout vient du cache.
const NETWORK_FIRST = /\.(?:html|js|css|json|webmanifest)$/;
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
function store(request, response) {
  if (response.ok && response.status === 200) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); }
  return response;
}
// Les lecteurs audio demandent des morceaux du fichier (en-tête Range) : on répond avec un 206 découpé depuis le cache.
async function rangeResponse(request) {
  const cache = await caches.open(CACHE_NAME);
  let cached = await cache.match(request.url);
  if (!cached) { const net = await fetch(request.url); if (net.ok) cache.put(request.url, net.clone()); cached = net; }
  const buffer = await cached.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(request.headers.get('range') || '');
  const start = m && m[1] ? Number(m[1]) : 0, end = m && m[2] ? Math.min(Number(m[2]), buffer.byteLength - 1) : buffer.byteLength - 1;
  return new Response(buffer.slice(start, end + 1), { status: 206, headers: { 'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg', 'Content-Range': `bytes ${start}-${end}/${buffer.byteLength}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.headers.has('range')) { event.respondWith(rangeResponse(event.request).catch(() => fetch(event.request))); return; }
  const networkFirst = event.request.mode === 'navigate' || NETWORK_FIRST.test(url.pathname);
  if (networkFirst) {
    // Réseau d'abord, mais sans attendre indéfiniment : avec une connexion très lente (ou « Wi-Fi sans Internet »),
    // la version en cache s'affiche après 3 secondes ; la version réseau sera prise la fois suivante.
    const fromCache = () => caches.match(event.request).then((cached) => cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
    const network = fetch(event.request).then((response) => store(event.request, response));
    const slow = new Promise((resolve) => setTimeout(resolve, 3000)).then(fromCache).then((cached) => cached || network);
    event.respondWith(Promise.race([network, slow]).catch(() => fromCache().then((cached) => cached || Response.error())));
    return;
  }
  // images : cache d'abord ; les noms changent à chaque version (?v=…), donc une nouvelle version va chercher la nouvelle image.
  // Hors ligne, on se rabat sur la même image sans le ?v=… (copie mise en cache à l'installation).
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => store(event.request, response))
    .catch(() => caches.match(event.request, { ignoreSearch: true }).then((c) => c || Response.error()))));
});
