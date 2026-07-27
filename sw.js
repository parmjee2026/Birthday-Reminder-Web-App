const CACHE_NAME = "naam-jaap-counter-v2-9-14-mobile-header-sync-fix";
const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css?v=2914",
    "./mala-goal.css?v=2914",
    "./background-music.css?v=2914",
    "./config.js?v=2914",
    "./offline.js?v=2914",
    "./api.js?v=2914",
    "./auth.js?v=2914",
    "./trusted-device.js?v=2914",
    "./profile.js?v=2914",
    "./settings.js?v=2914",
    "./history.js?v=2914",
    "./ui.js?v=2914",
    "./reminder.js?v=2914",
    "./app.js?v=2914",
    "./custom-mantras.js?v=2914",
    "./ecosystem.js?v=2914",
    "./app-updates.js?v=2914",
    "./dashboard-polish.js?v=2914",
    "./mobile-ui-fix.js?v=2914",
    "./background-music.js?v=2914",
    "./temple-music.mp3?v=2914",
    "./reminder-temple-bell.wav?v=2914",
    "./reminder-morning-chime.wav?v=2914",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});


self.addEventListener("message", event => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const requestUrl = new URL(event.request.url);

    if (event.request.method !== "GET") return;

    if (requestUrl.origin !== self.location.origin) {
        event.respondWith(fetch(event.request));
        return;
    }

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put("./index.html", clone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match("./index.html"))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                return networkResponse;
            });
        })
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    const targetUrl = new URL(event.notification.data?.url || "./", self.location.href).href;

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
            for (const client of windowClients) {
                if (client.url.startsWith(self.location.origin) && "focus" in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            return clients.openWindow ? clients.openWindow(targetUrl) : undefined;
        })
    );
});
