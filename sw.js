/**
 * Basic Service Worker implementation.
 * Just caches index.html
 */
// When the SW is installed, it will populate the Browser's cache with some files.
// To check this, use the Developer Console / Application / cache.
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/',
        // now that we also have the manifest using icons...
        '/manifest.webmanifest',
        '/index.html?pwa=true',
        '/favicon.ico',
        '/favicons/favicon-144.png',
        '/favicons/favicon-196.png',
        '/favicons/favicon-96.png',
        '/favicons/favicon-64.png',
        '/favicons/favicon-32.png',
        '/favicons/pwa-logo.png',
      ]);
    })
  );
});

// SW intercepts "fetch" events, and as a Proxy can intercept a network request.
// thus we can use the cache to return cached stuff instead of making the request.
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .catch(function() {
        // if CACHE MISSES, then let the request pass.
        return fetch(event.request).
          then(function(response) {
            // And cache this new response
            return caches.open('v1').then(function(cache) {
              cache.put(event.request, response.clone());
              return response;
            });
          }).catch(function() {
            // if fetch is in error, we can here provide a default resource file.
            // TODO
          });
      })
  );
});
