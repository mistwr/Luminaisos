// ═══════════════════════════════════════════════════════════════
// LUMIN AI · sw.js — Service Worker
// Cache-first strategy para funcionamento 100% offline
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'lumin-ai-v1';
const CACHE_STATIC = 'lumin-static-v1';

// Ficheiros da app para cache imediata
const STATIC_FILES = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // Leaflet (mapa)
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

// ── INSTALL ───────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[LUMIN SW] Instalar v1');
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[LUMIN SW] Cache estática a carregar...');
        // Adiciona um por um para não falhar tudo se um recurso falhar
        return Promise.allSettled(
          STATIC_FILES.map(url =>
            cache.add(url).catch(err => console.warn('[LUMIN SW] Falha ao adicionar ao cache:', url, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ──────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[LUMIN SW] Ativar');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_STATIC && key !== CACHE_NAME)
          .map(key => {
            console.log('[LUMIN SW] Apagar cache antigo:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora requests não-GET e extensões de browser
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // WebLLM e modelos de IA: deixa o browser gerir (têm cache próprio via IndexedDB)
  if (url.href.includes('mlc-ai') ||
      url.href.includes('web-llm') ||
      url.href.includes('huggingface') ||
      url.href.includes('esm.run') ||
      url.href.includes('cdn.jsdelivr')) {
    return; // Sem intercepção — WebLLM gere o seu próprio cache
  }

  // Overpass API (mapa de emergências): network-first, sem cache
  if (url.href.includes('overpass-api.de')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(
        JSON.stringify({ elements: [] }),
        { headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // OpenStreetMap tiles: cache de rede (guarda os tiles já vistos)
  if (url.href.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request)
            .then(response => {
              if (response.ok) cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => new Response('', { status: 503 }));
        })
      )
    );
    return;
  }

  // App estática: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Atualiza em background (stale-while-revalidate)
        const fetchPromise = fetch(event.request)
          .then(response => {
            if (response.ok) {
              caches.open(CACHE_STATIC).then(cache => cache.put(event.request, response));
            }
          })
          .catch(() => {});
        return cached;
      }
      // Não está em cache: tenta rede
      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Fallback: serve o index.html para navegação (SPA)
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('', { status: 503 });
        });
    })
  );
});

// ── PUSH NOTIFICATIONS (futuro) ───────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'LUMIN AI', {
    body: data.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'lumin-alert',
    renotify: true,
  });
});
