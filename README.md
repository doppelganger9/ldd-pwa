# LDD PWA

Lighthouse Development Driven PWA

## Step 1

Run Audit from Chrome.

### Automation

- Run Chrome Headless (prerequiste: install it!),
- Add an npm script to run audit,
- Add dev dependency in package.json,
- check that audit result is the same as visually running it in Chrome.
- parse JSON results... not quite easy... pwa.auditChecks.score?

## Step 2: Fix the first issue

"Does not respond with a 200 when offline"
"If you're building a Progressive Web App, consider using a service worker so that your app can work offline."

So we are going to add a basic [Service Worker]()!

1. Add a service worker to your app.
2. Use the service worker to cache files locally.
3. When offline, use the service worker as a network proxy to return the locally cached version of the file.

### Adding a Service Worker to our App

We need to add this to our index.html before our script that generates the UI:
```html
<script>
if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/sw.js')
           .then(function(registration) { console.log("Service Worker Registered with scope: " + registration.scope); })
           .catch(function(error) { console.log("Service Worker Registration failed with error: "+ error); });
}
</script>
```

It checks if the [current browser supports Service Workers](https://caniuse.com/#search=service%20worker).
Then it registers a `sw.js` file as the code for our Service Worker.
Then it logs some success string in the console.

Now we need to add the `ws.js` file:

We can:
- get inspiration from existing PWAs
- code it [from scratch]()
- use a Library like [Workbox](https://developers.google.com/web/tools/workbox/)
- copy paste from [Service Worker Cookbook](https://serviceworke.rs/)

We will do it from scratch:
```js
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/',
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
```


### HTTPS Server

But a Service Worker will not load on a browser unless it is served from HTTPS.
So we need to have our website served from HTTPS

Follow the [instructions on local-web-server wiki to have a Green Padlock on Chrome](https://github.com/lwsjs/local-web-server/wiki/How-to-get-the-%22green-padlock%22-using-the-built-in-certificate)
Please note that it will only work for localhost or 127.0.0.1 at the time of writing this file. See the [related Issue](https://github.com/lwsjs/local-web-server/issues/103)

We updated our npm script to use this method.

### PWA Score: 27 to 58!

Wow. Just Adding SSL/TLS and using a basic Service Worker that caches resources for offline usage bumped up our PWA score from 27 to 58.

## Logo

From here: https://github.com/webmaxru/progressive-web-apps-logo/issues/4

## Favicons

http://favicons.fr/bfb48b598cc988e28990123d1cd81969.htm#Preview

