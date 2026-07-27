const STATIC_CACHE =
  "birthday-reminder-static-v5.3.0";

const ENHANCEMENT_SCRIPT =
  "./v530-enhancements.js?v=5.3.0";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  ENHANCEMENT_SCRIPT
];

function upgradeV530Html(html) {
  let text = String(html || "");

  // The repository can keep the large monolithic index.html unchanged.
  // The service worker upgrades version markers in the delivered HTML.
  text = text
    .replaceAll(
      "5.2.2",
      "5.3.0"
    )
    .replaceAll(
      "privacy-first-device-v5.3.0-privacy-notice-settings",
      "privacy-first-device-v5.3.0-dashboard-quick-actions"
    )
    .replaceAll(
      "Build: v5.3.0 · Privacy Notice in Settings",
      "Build: v5.3.0 · Dashboard & Quick Actions"
    );

  if (
    !text.includes(
      "v530-enhancements.js"
    )
  ) {
    const script =
      `<script src="${ENHANCEMENT_SCRIPT}"></script>`;

    if (
      text.includes(
        "</body>"
      )
    ) {
      text = text.replace(
        "</body>",
        `  ${script}\n</body>`
      );
    } else {
      text += `\n${script}`;
    }
  }

  return text;
}

async function upgradedHtmlResponse(
  response
) {
  if (!response) {
    return response;
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    !contentType.includes(
      "text/html"
    )
  ) {
    return response;
  }

  const html =
    await response.text();

  const headers =
    new Headers(
      response.headers
    );

  headers.delete(
    "content-length"
  );

  return new Response(
    upgradeV530Html(
      html
    ),
    {
      status:
        response.status,
      statusText:
        response.statusText,
      headers
    }
  );
}

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      caches
        .open(
          STATIC_CACHE
        )
        .then(
          (cache) =>
            cache.addAll(
              STATIC_ASSETS
            )
        )
        .then(
          () =>
            self.skipWaiting()
        )
    );
  }
);

self.addEventListener(
  "message",
  (event) => {
    if (
      event.data &&
      event.data.type ===
        "SKIP_WAITING"
    ) {
      self.skipWaiting();
    }
  }
);

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      caches
        .keys()
        .then(
          (keys) =>
            Promise.all(
              keys
                .filter(
                  (key) =>
                    key !==
                    STATIC_CACHE
                )
                .map(
                  (key) =>
                    caches.delete(
                      key
                    )
                )
            )
        )
        .then(
          () =>
            self.clients.claim()
        )
    );
  }
);

self.addEventListener(
  "fetch",
  (event) => {
    const request =
      event.request;

    const url =
      new URL(
        request.url
      );

    // Never intercept Google OAuth, People API,
    // or any other cross-origin request.
    if (
      url.origin !==
      self.location.origin
    ) {
      return;
    }

    if (
      request.method !==
      "GET"
    ) {
      return;
    }

    // Navigation stays network-first and is upgraded to v5.3.0.
    if (
      request.mode ===
      "navigate"
    ) {
      event.respondWith(
        fetch(request)
          .then(
            upgradedHtmlResponse
          )
          .catch(
            async () => {
              const cached =
                await caches.match(
                  "./index.html"
                );

              return cached
                ? upgradedHtmlResponse(
                    cached
                  )
                : cached;
            }
          )
      );

      return;
    }

    // Update checks may request index.html through fetch(), not navigation.
    // Transform those responses too so the built-in updater sees v5.3.0.
    if (
      url.pathname.endsWith(
        "/index.html"
      ) ||
      url.pathname.endsWith(
        "/"
      )
    ) {
      event.respondWith(
        fetch(request)
          .then(
            upgradedHtmlResponse
          )
          .catch(
            async () => {
              const cached =
                await caches.match(
                  "./index.html"
                );

              return cached
                ? upgradedHtmlResponse(
                    cached
                  )
                : cached;
            }
          )
      );

      return;
    }

    event.respondWith(
      caches
        .match(
          request
        )
        .then(
          (cached) => {
            if (cached) {
              return cached;
            }

            return fetch(
              request
            ).then(
              (response) => {
                const pathname =
                  url.pathname.toLowerCase();

                const isStatic =
                  pathname.endsWith(
                    ".png"
                  ) ||
                  pathname.endsWith(
                    ".webmanifest"
                  ) ||
                  pathname.endsWith(
                    ".html"
                  ) ||
                  pathname.endsWith(
                    ".js"
                  );

                if (
                  isStatic &&
                  response.ok
                ) {
                  const copy =
                    response.clone();

                  caches
                    .open(
                      STATIC_CACHE
                    )
                    .then(
                      (cache) =>
                        cache.put(
                          request,
                          copy
                        )
                    );
                }

                return response;
              }
            );
          }
        )
    );
  }
);