// Service Worker PARA SUA ESTRUTURA - José Mbenga Portfolio
const APP_VERSION = "6.0.0";
const CACHE_NAME = `jmbenga-v6-${APP_VERSION}`;

// ========== CATEGORIAS DE CACHE ==========

// 1. CORE: Arquivos essenciais que SEMPRE devem estar em cache
const CORE_CACHE = [
  // Raiz
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "./sw.js",
  "./assets/img/icons/file-graph.svg",
  "./assets/img/icons/file-cv.svg",
  "./assets/img/icons/contact.svg",
  "./assets/img/icons/skills.svg",
  "./assets/img/icons/about.svg",
  "./assets/img/icons/feedback.svg",

  // Páginas principais
  "./pages/all-projects.html",
  "./pages/project-demo.html",
  "./pages/reviews-feedback.html",

  // CSS Principal
  "./assets/css/main.css",
  "./assets/css/improvements.css",
  "./assets/css/particles.css",

  // JS Principal
  "./assets/js/main.js",
  "./assets/js/improvements.js",
  "./assets/js/pwa-install.js",
  "./assets/js/pwa-native.js",

  // Ícones essenciais
  "./assets/img/icons/icon-192x192.png",
  "./assets/img/icons/icon-512x512.png",
  "./assets/img/svg/favicon_jm.ico",
  "./assets/img/photo/josembengadacosta.png",
];

// 2. CSS: Todos os arquivos CSS
const CSS_CACHE = [
  "./assets/css/all-projects.css",
  "./assets/css/project-demo.css",
  "./assets/fontawesome-free/css/all.min.css",
  "./assets/fontawesome-free/css/brands.min.css",
  "./assets/fontawesome-free/css/fontawesome.min.css",
  "./assets/fontawesome-free/css/regular.min.css",
  "./assets/fontawesome-free/css/solid.min.css",
  "./assets/fontawesome-free/css/v4-shims.min.css",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  "https://unpkg.com/aos@2.3.1/dist/aos.css",
];

// 3. JS: Todos os arquivos JavaScript
const JS_CACHE = [
  "./assets/js/all-projects.js",
  "./assets/js/project-demo.js",
  "https://unpkg.com/aos@2.3.1/dist/aos.js",
  "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js",
];

// 4. FONTES: Webfonts do FontAwesome
const FONT_CACHE = [
  "./assets/fontawesome-free/webfonts/fa-brands-400.woff2",
  "./assets/fontawesome-free/webfonts/fa-regular-400.woff2",
  "./assets/fontawesome-free/webfonts/fa-solid-900.woff2",
];

// 5. IMAGES: Imagens importantes (cache sob demanda)
const IMAGE_CACHE_PATTERNS = [
  /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i,
  /\/assets\/img\//i,
  /\/icons\//i,
];

// 6. PAGES: Outras páginas (cache sob demanda)
const PAGE_CACHE = [
  "./auth/login.html",
  "./auth/recovery.html",
  "./auth/signup.html",
  "./pages/services/web-development.html",
  "./pages/services/mobile-apps.html",
  "./pages/services/ui-ux-design.html",
  "./pages/error/404.html",
];

// ========== INSTALAÇÃO INTELIGENTE ==========
self.addEventListener("install", (event) => {
  console.log(`SW v${APP_VERSION} instalando...`);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache apenas CORE imediatamente (rápido)
        console.log(`Cacheando ${CORE_CACHE.length} recursos essenciais...`);
        return cache.addAll(CORE_CACHE);
      })
      .then(() => {
        console.log("Cache essencial pronto!");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Erro na instalação:", error);
        // Continua mesmo com erro
        return self.skipWaiting();
      })
  );
});

// ========== ATIVAÇÃO ==========
self.addEventListener("activate", (event) => {
  console.log(`SW v${APP_VERSION} ativado`);

  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith("jmbenga-")) {
              console.log(`Removendo cache antigo: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Tomar controle imediato
      self.clients.claim(),

      // Cachear recursos secundários em background
      cacheSecondaryResources(),
    ])
  );
});


// ========== FETCH INTELIGENTE ==========
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const request = event.request;
  
  // Ignorar requisições não-GET e não-HTTP
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }
  
  // Ignorar navegador e extensões
  if (url.protocol === 'chrome-extension:') return;
  
  // FUNÇÃO PARA HTML COM TEMA DINÂMICO
  async function serveWithTheme(req) {
    try {
      const response = await fetch(req);
      const contentType = response.headers.get('content-type');
      
      // HTML NUNCA em cache (para temas funcionarem)
      if (contentType && contentType.includes('text/html')) {
        return response;
      }
      
      // Outros recursos podem ser cacheados
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, response.clone()).catch(() => {});
      }
      
      return response;
    } catch (error) {
      console.log('🌐 Offline - usando cache para:', req.url);
      const cached = await caches.match(req);
      if (cached) return cached;
      
      // Fallback para offline.html
      if (req.mode === 'navigate') {
        const offlinePage = await caches.match('./offline.html');
        if (offlinePage) return offlinePage;
      }
      
      throw error;
    }
  }
  
  // Estratégia baseada no tipo de recurso
  if (request.mode === 'navigate') {
    // Navegação: serveWithTheme (HTML sem cache)
    event.respondWith(serveWithTheme(request));
  } else if (isStaticAsset(url)) {
    // Assets estáticos: Cache First
    event.respondWith(cacheFirst(request));
  } else if (isExternalAsset(url)) {
    // Recursos externos: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Demais: Network First
    event.respondWith(networkFirst(request));
  }
});

// ========== ESTRATÉGIAS POR TIPO ==========
async function handleFetch(request, url) {
  // 1. NAVEGAÇÃO (páginas HTML)
  if (request.mode === "navigate") {
    return networkFirstWithOffline(request);
  }

  // 2. API/Dados (sempre network)
  if (url.pathname.includes("/api/") || url.pathname.includes("/submit")) {
    return fetch(request);
  }

  // 3. CSS
  if (
    url.pathname.match(/\.css$/i) ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("unpkg.com")
  ) {
    return staleWhileRevalidate(request);
  }

  // 4. JS
  if (
    url.pathname.match(/\.js$/i) ||
    url.hostname.includes("cdn.jsdelivr.net")
  ) {
    return cacheFirst(request);
  }

  // 5. FONTES
  if (
    url.pathname.match(/\.(woff|woff2|ttf|eot)$/i) ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    return cacheFirst(request);
  }

  // 6. IMAGENS
  if (
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i) ||
    IMAGE_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))
  ) {
    return cacheFirstWithExpiration(request, 7 * 24 * 60 * 60 * 1000); // 7 dias
  }

  // 7. PDF
  if (url.pathname.match(/\.pdf$/i)) {
    return networkFirst(request);
  }

  // 8. DEFAULT: Cache First
  return cacheFirst(request);
}

// ========== ESTRATÉGIAS IMPLEMENTADAS ==========

// A. Network First com fallback offline
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);

    // Se for HTML, verificar se é erro 404/500
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const text = await response.clone().text();
      if (
        text.includes("error-") ||
        text.includes("404") ||
        text.includes("500") ||
        response.status >= 400
      ) {
        throw new Error("Page error");
      }
    }

    // Cachear resposta bem-sucedida
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(() => {});
    }

    return response;
  } catch (error) {
    console.log("Offline - Tentando cache:", request.url);

    // 1. Tentar cache da página solicitada
    const cached = await caches.match(request);
    if (cached) return cached;

    // 2. Para páginas de erro específicas
    const path = new URL(request.url).pathname;
    if (path.includes("/error/") || path.includes("/404")) {
      const errorPage = await caches.match("./pages/error/404.html");
      if (errorPage) return errorPage;
    }

    // 3. Offline page customizada
    const offlinePage = await caches.match("./offline.html");
    if (offlinePage) {
      return new Response(offlinePage.body, {
        status: 200,
        statusText: "OK (Offline)",
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Offline-Mode": "true",
        },
      });
    }

    // 4. Fallback para index.html
    const indexPage = await caches.match("./index.html");
    if (indexPage) return indexPage;

    // 5. Fallback genérico
    return new Response(
      `
      <!DOCTYPE html>
      <html><body>
        <h1>Offline</h1>
        <p>Conecte-se à internet para acessar ${
          new URL(request.url).pathname
        }</p>
      </body></html>
    `,
      {
        status: 503,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}

// B. Cache First (para assets estáticos)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Atualizar cache em background
    updateCacheInBackground(request);
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

// C. Cache First com expiração (para imagens)
async function cacheFirstWithExpiration(request, maxAge) {
  const cached = await caches.match(request);
  const now = Date.now();

  if (cached) {
    const cachedDate = new Date(cached.headers.get("date") || now);
    const age = now - cachedDate.getTime();

    if (age < maxAge) {
      return cached;
    }
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    const headers = new Headers(response.headers);
    headers.set("date", new Date().toUTCString());

    const cacheResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });

    cache.put(request, cacheResponse).catch(() => {});
  }
  return response;
}

// D. Stale While Revalidate (para CSS, fonts)
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  // Buscar atualização em background
  fetch(request)
    .then((response) => {
      if (response.ok) {
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(request, response))
          .catch(() => {});
      }
    })
    .catch(() => {}); // Ignorar erros

  return cached || fetch(request);
}

// E. Network First (para PDFs, dados)
async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch {
    return await caches.match(request);
  }
}

// ========== FUNÇÕES AUXILIARES ==========

async function cacheSecondaryResources() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const alreadyCached = await cache.keys();
    const cachedUrls = alreadyCached.map((req) => req.url);

    // Combinar todos os recursos secundários
    const allSecondary = [
      ...CSS_CACHE,
      ...JS_CACHE,
      ...FONT_CACHE,
      ...PAGE_CACHE,
    ];

    // Filtrar apenas os que não estão em cache
    const toCache = allSecondary.filter((url) => {
      const fullUrl = new URL(url, self.location.origin).href;
      return !cachedUrls.includes(fullUrl);
    });

    if (toCache.length > 0) {
      console.log(
        ` Cacheando ${toCache.length} recursos secundários em background...`
      );

      // Cachear em lotes para não bloquear
      const batchSize = 10;
      for (let i = 0; i < toCache.length; i += batchSize) {
        const batch = toCache.slice(i, i + batchSize);
        await Promise.allSettled(
          batch.map((url) =>
            cache
              .add(url)
              .catch((err) =>
                console.log(`⚠️ Não pude cachear ${url}:`, err.message)
              )
          )
        );
      }

      console.log("Cache secundário completo!");
    }
  } catch (error) {
    console.error("Erro no cache secundário:", error);
  }
}

async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response);
    }
  } catch (error) {
    // Silenciosamente falhar
  }
}

async function offlineFallback(request) {
  // Para HTML, retornar offline page
  if (request.mode === "navigate") {
    const offlinePage = await caches.match("./offline.html");
    if (offlinePage) return offlinePage;
  }

  // Para outros recursos, retornar resposta vazia
  return new Response("", {
    status: 408,
    statusText: "Offline",
  });
}

// ========== BACKGROUND SYNC ==========
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-forms") {
    console.log("Background sync para formulários");
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  // Aqui você sincronizaria dados pendentes (formulários, etc.)
  console.log("📡 Sincronizando dados...");
}

// ========== PUSH NOTIFICATIONS ==========
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "Novo conteúdo disponível!",
    icon: "./assets/img/icons/icon-192x192.png",
    badge: "./assets/img/icons/icon-72x72.png",
    data: { url: data.url || "./" },
    actions: [
      { action: "open", title: "Abrir" },
      { action: "close", title: "Fechar" },
    ],
    tag: "portfolio-update",
    renotify: true,
    requireInteraction: false,
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

// ========== MENSAGENS ==========
self.addEventListener("message", (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case "GET_CACHE_INFO":
      caches
        .open(CACHE_NAME)
        .then((cache) => cache.keys())
        .then((keys) => {
          event.source.postMessage({
            type: "CACHE_INFO",
            version: APP_VERSION,
            totalCached: keys.length,
            categories: {
              html: keys.filter((k) => k.url.includes(".html")).length,
              css: keys.filter((k) => k.url.includes(".css")).length,
              js: keys.filter((k) => k.url.includes(".js")).length,
              images: keys.filter((k) =>
                k.url.match(/\.(png|jpg|jpeg|gif|svg|ico)$/i)
              ).length,
              fonts: keys.filter((k) => k.url.match(/\.(woff|woff2|ttf|eot)$/i))
                .length,
            },
          });
        });
      break;

    case "CLEAR_CACHE":
      caches.delete(CACHE_NAME).then(() => {
        event.source.postMessage({
          type: "CACHE_CLEARED",
          success: true,
        });
      });
      break;

    case "UPDATE_SW":
      self.skipWaiting();
      break;

    case "TEST_OFFLINE":
      // Simular offline para testes
      console.log("Teste offline solicitado");
      event.source.postMessage({
        type: "OFFLINE_TEST_READY",
        offlinePage: "./offline.html",
      });
      break;
  }
});

console.log(
  `Service Worker v${APP_VERSION} carregado para estrutura complexa!`
);
