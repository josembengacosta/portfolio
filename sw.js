// ============================================
// SERVICE WORKER - PORTFÓLIO JOSÉ MBENDA (OTIMIZADO)
// ============================================

const APP_VERSION = "1.0.0";
const CACHE_NAME = `jmbenga-pwa-v${APP_VERSION.replace(/\./g, "-")}`;

// ========== CACHE STRATEGIES ==========

// 1. CACHE IMMEDIATELY - Recursos essenciais
const IMMEDIATE_CACHE = [
  // HTML Core
  "/portfolio/index.html",
  "/portfolio/offline.html",

  // Manifest & Icons
  "/portfolio/manifest.json",
  "/portfolio/assets/img/icons/icon-192x192.png",
  "/portfolio/assets/img/icons/icon-512x512.png",
  "/portfolio/assets/img/svg/favicon_jm.ico",

  // Core CSS
  "/portfolio/assets/css/main.css",
  "/portfolio/assets/css/improvements.css",
  "/portfolio/assets/css/particles.css",

  // Core JS
  "/portfolio/assets/js/main.js",
  "/portfolio/assets/js/improvements.js",

  // Fonts (Font Awesome)
  "/portfolio/assets/fontawesome-free/webfonts/fa-solid-900.woff2",
  "/portfolio/assets/fontawesome-free/webfonts/fa-brands-400.woff2",
];

// 2. CACHE LAZY - Recursos importantes (cache após instalação)
const LAZY_CACHE = [
  // Other HTML pages
  "/portfolio/pages/all-projects.html",
  "/portfolio/pages/project-demo.html",

  // Additional CSS
  "/portfolio/assets/css/particles.css",
  "/portfolio/assets/css/all-projects.css",

  // Additional JS
  "/portfolio/assets/js/pwa-install.js",
  "/portfolio/assets/js/pwa-native.js",
  "/portfolio/assets/js/project-demo.js",

  // Important images
  "/portfolio/assets/img/photo/josembengadacosta.png",
];

// 3. EXTERNAL RESOURCES
const EXTERNAL_RESOURCES = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  "https://unpkg.com/aos@2.3.1/dist/aos.css",
  "https://unpkg.com/aos@2.3.1/dist/aos.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js",
];

// 4. NETWORK ONLY - Nunca cache
const NETWORK_ONLY = [
  // Form submissions, APIs, etc
  /\/submit/i,
  /\/api\//i,
  /contact-form/i,
];

// 5. PATTERNS FOR DYNAMIC CACHING
const PATTERNS = {
  html: /\.html$/i,
  css: /\.css$/i,
  js: /\.js$/i,
  images: /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i,
  fonts: /\.(woff|woff2|ttf|eot)$/i,
  pdf: /\.pdf$/i,
};

// ========== INSTALL - Cache Immediate Resources ==========

self.addEventListener("install", (event) => {
  console.log(`⚙️ SW v${APP_VERSION} instalando...`);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log(" Cacheando recursos essenciais...");
        return cache
          .addAll(
            IMMEDIATE_CACHE.map((url) => {
              // Handle both local and GitHub Pages paths
              if (
                self.location.hostname === "localhost" ||
                self.location.hostname === "127.0.0.1"
              ) {
                return url.replace("/portfolio/", "./");
              }
              return url;
            })
          )
          .catch((err) => {
            console.warn(" Alguns recursos não puderam ser cacheados:", err);
            // Continue mesmo com erros
          });
      })
      .then(() => {
        console.log(" Instalação completa!");
        return self.skipWaiting();
      })
  );
});

// ========== ACTIVATE - Cleanup & Claim ==========

self.addEventListener("activate", (event) => {
  console.log(` SW v${APP_VERSION} ativado`);

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith("jmbenga-")) {
              console.log(`🗑️ Removendo cache antigo: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Take control immediately
      self.clients.claim(),

      // Cache lazy resources in background
      cacheLazyResources(),
    ])
  );
});

// ========== FETCH - Intelligent Caching Strategy ==========

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip browser extensions and chrome:// URLs
  if (url.protocol === "chrome-extension:" || url.protocol === "chrome:")
    return;

  // Skip data URLs
  if (url.protocol === "data:") return;

  // Determine strategy based on URL
  const strategy = getStrategy(url, request);

  // Apply strategy
  switch (strategy) {
    case "network-only":
      event.respondWith(networkOnly(request));
      break;

    case "cache-first":
      event.respondWith(cacheFirst(request));
      break;

    case "stale-while-revalidate":
      event.respondWith(staleWhileRevalidate(request));
      break;

    case "network-first":
    default:
      event.respondWith(networkFirst(request));
      break;
  }
});

// ========== STRATEGY DETECTION ==========

function getStrategy(url, request) {
  // Network only patterns
  for (const pattern of NETWORK_ONLY) {
    if (pattern.test(url.pathname)) {
      return "network-only";
    }
  }

  // External resources
  if (url.hostname !== self.location.hostname) {
    return "stale-while-revalidate";
  }

  // Navigation (HTML pages)
  if (request.mode === "navigate") {
    return "network-first";
  }

  // Static assets
  if (PATTERNS.images.test(url.pathname)) {
    return "cache-first";
  }

  if (PATTERNS.css.test(url.pathname)) {
    return "stale-while-revalidate";
  }

  if (PATTERNS.js.test(url.pathname)) {
    return "cache-first";
  }

  if (PATTERNS.fonts.test(url.pathname)) {
    return "cache-first";
  }

  if (PATTERNS.pdf.test(url.pathname)) {
    return "network-first";
  }

  // Default: network first
  return "network-first";
}

// ========== CACHING STRATEGIES IMPLEMENTATION ==========

// 1. NETWORK ONLY
async function networkOnly(request) {
  return fetch(request);
}

// 2. NETWORK FIRST (with offline fallback)
async function networkFirst(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch((err) => {
        console.warn(" Não pude cachear resposta:", err);
      });
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log(" Offline, buscando no cache:", request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a page request and no cache, show offline page
    if (request.mode === "navigate") {
      return getOfflinePage();
    }

    // For other requests, return error
    return new Response("Offline", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// 3. CACHE FIRST (for static assets)
async function cacheFirst(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }

  // Not in cache, try network
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch((err) => {
        console.warn(" Não pude cachear asset:", err);
      });
    }

    return networkResponse;
  } catch (error) {
    // Network failed, no cache
    if (PATTERNS.images.test(request.url)) {
      // Return placeholder for images
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#f1f5f9"/>
          <text x="50" y="50" text-anchor="middle" fill="#64748b">Image</text>
        </svg>`,
        {
          headers: { "Content-Type": "image/svg+xml" },
        }
      );
    }

    return new Response("", { status: 404 });
  }
}

// 4. STALE WHILE REVALIDATE (for CSS, external resources)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Return cached response immediately
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Ignore fetch errors
    });

  return cachedResponse || fetchPromise || fetch(request);
}

// ========== HELPER FUNCTIONS ==========

async function cacheLazyResources() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const alreadyCached = await cache.keys();
    const cachedUrls = alreadyCached.map((req) => req.url);

    const resourcesToCache = LAZY_CACHE.map((url) => {
      if (
        self.location.hostname === "localhost" ||
        self.location.hostname === "127.0.0.1"
      ) {
        return url.replace("/portfolio/", "./");
      }
      return url;
    });

    const batchSize = 5;
    for (let i = 0; i < resourcesToCache.length; i += batchSize) {
      const batch = resourcesToCache.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map((url) =>
          cache.add(url).catch((err) => {
            console.log(` Não cacheado: ${url}`, err.message);
          })
        )
      );
    }

    console.log(" Cache lazy completo!");
  } catch (error) {
    console.error(" Erro no cache lazy:", error);
  }
}

async function updateCacheInBackground(request) {
  // Don't wait for this to complete
  fetch(request)
    .then((response) => {
      if (response.ok) {
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(request, response))
          .catch(() => {});
      }
    })
    .catch(() => {});
}

async function getOfflinePage() {
  const cache = await caches.open(CACHE_NAME);
  const offlinePage = await cache.match(
    self.location.hostname === "localhost"
      ? "./offline.html"
      : "/portfolio/offline.html"
  );

  if (offlinePage) {
    return offlinePage;
  }

  // Create a simple offline page
  return new Response(
    `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline | JMbenga Portfolio</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background: #0f172a;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        .container {
          max-width: 500px;
        }
        h1 {
          color: #2563eb;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 20px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📡</div>
        <h1>Você está offline</h1>
        <p>Conecte-se à internet para acessar o conteúdo completo do portfólio.</p>
        <p>Algumas funcionalidades podem não estar disponíveis.</p>
      </div>
    </body>
    </html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Offline-Mode": "true",
      },
    }
  );
}

// ========== MESSAGE HANDLING ==========

self.addEventListener("message", (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case "GET_VERSION":
      event.source.postMessage({
        type: "VERSION_INFO",
        version: APP_VERSION,
        cacheName: CACHE_NAME,
      });
      break;

    case "CLEAR_CACHE":
      caches
        .delete(CACHE_NAME)
        .then(() => {
          event.source.postMessage({
            type: "CACHE_CLEARED",
            success: true,
          });
        })
        .catch((error) => {
          event.source.postMessage({
            type: "CACHE_CLEARED",
            success: false,
            error: error.message,
          });
        });
      break;

    case "UPDATE_SW":
      self.skipWaiting();
      event.source.postMessage({
        type: "SW_UPDATED",
        success: true,
      });
      break;
  }
});

// ========== PUSH NOTIFICATIONS (Optional) ==========

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || "Novo conteúdo disponível no meu portfólio!",
    icon: "/portfolio/assets/img/icons/icon-192x192.png",
    badge: "/portfolio/assets/img/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/portfolio/",
      date: new Date().toISOString(),
    },
    actions: [
      {
        action: "open",
        title: "Abrir",
      },
      {
        action: "close",
        title: "Fechar",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("JMbenga Portfolio", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

// ========== CONSOLE LOG ==========

console.log(` Service Worker v${APP_VERSION} carregado e pronto!`);
console.log(` Cache: ${CACHE_NAME}`);
console.log(` Host: ${self.location.hostname}`);
