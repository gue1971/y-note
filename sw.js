const CACHE_VERSION = 'y-note-v1';
const PRECACHE_NAME = `precache-${CACHE_VERSION}`;
const RUNTIME_NAME = `runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './icon.png',
  './bgm.mp3',
  './image/01.png',
  './image/02.png',
  './image/03.png',
  './image/04.png',
  './image/05.png',
  './image/06.png',
  './image/07.png',
  './image/08.png',
  './image/09.png',
  './image/10.png',
  './image/11.png',
  './image/12.png',
  './image/13.png',
  './image/14.png',
  './image/15.png',
  './image/16.png',
  './image/17.png',
  './image/18.png',
  './image/19.png',
  './image/20.png',
  './image/21.png',
  './image/22.png',
  './image/23.png',
  './image/24.png',
  './image/25.png',
  './image/26.png',
  './image/27.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== PRECACHE_NAME && name !== RUNTIME_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          return caches.open(RUNTIME_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
