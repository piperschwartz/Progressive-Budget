console.log("Hello from your service worker");

const CACHE_NAME = "static-cache-v1",DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.html",
    "/index.js",
    "/style.css",
    "/manifest.webmanifest",
    "/images/icon-72x72.png",
    "/images/icon-96x96.png",
    "/images/icon-128x128.png",
    "/images/icon-144x144.png",
    "/images/icon-152x152.png",
    "/images/icon-192x192.png",
    "/images/icon-384x384.png",
    "/images/icon-512x512.png",
     "/favicon.ico"
    
];



self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Files successfully pre-cached.");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removes old cache", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", function(event){
    if(event.request.url.includes("/api")) {
        console.log("[Service Worker] Fetcha (data)", event.request.url);

        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if(response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(event.request);
                });
            // }).catch(err => {
            //     console.log(err)
            })
        );
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request);
            });
        })

    )});

