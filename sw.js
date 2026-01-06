// sw.js - Service Worker MÍNIMO
const CACHE_NAME = 'jmbenga-v1';

self.addEventListener('install', event => {
    console.log('SW instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll([
                '/',
                '/index.html',
                '/manifest.json'
            ]))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});