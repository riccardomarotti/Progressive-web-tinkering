export const CACHE_NAME = "gih-cache-v2";
const CACHED_URLS = ["/", "/bundle.js", "/index.html", "/index-offline.html"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request, {ignoreSearch: true}).then(response => {
        if(response) {
          return response;
        } else {
          return caches.match("/index-offline.html");
        }
      });
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("gih-cach")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
