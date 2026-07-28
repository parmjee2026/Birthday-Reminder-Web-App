const STATIC_CACHE = "birthday-reminder-static-v5.3.0";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./embedded-suite.css?v=530",
  "./embedded-suite.js?v=530",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("message", (event) => {
  if (
    event.data &&
    event.data.type === "SKIP_WAITING"
  ) {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never intercept or cache Google OAuth, People API,
  // or any other cross-origin request.
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.method !== "GET") {
    return;
  }

  // Navigation stays network-first so deployed versions are preferred.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Same-origin public static app files only.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        const pathname = url.pathname.toLowerCase();
        const isStatic =
          pathname.endsWith(".png") ||
          pathname.endsWith(".webmanifest") ||
          pathname.endsWith(".html");

        if (
          isStatic &&
          response.ok
        ) {
          const copy = response.clone();

          caches
            .open(STATIC_CACHE)
            .then((cache) => cache.put(request, copy));
        }

        return response;
      });
    })
  );
});
