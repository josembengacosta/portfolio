// ============================================
// JOSÉ MBENGA PORTFOLIO - SERVICE WORKER PREMIUM
// ============================================

const APP_VERSION = '3.0.0';
const CACHE_NAME = `jmbenga-portfolio-v${APP_VERSION}`;

// URLs para cache (estratégia: Cache First)
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/dashboard/home.html',
    '/pages/all-projects.html',
    '/pages/reviews-feedback.html',
    '/pages/project-demo.html',
    
    // Páginas de autenticação
    '/auth/signup.html',
    '/auth/login.html',
    '/auth/recovery.html',
    '/auth/reset-password.html',
    
    // Páginas de serviços
    '/pages/services/web-development.html',
    '/pages/services/mobile-apps.html',
    '/pages/services/maintenance1.html',
    '/pages/services/ui-ux-design.html',
    '/pages/services/tech-consulting.html',
    
    // Assets principais
    '/manifest.json',
    '/assets/img/svg/favicon_jm.png',
    '/assets/img/icons/icon-192x192.png',
    '/assets/img/icons/icon-512x512.png',
    
    // CSS e JS principais
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/assets/js/auth.js',
    '/assets/js/all-projects.js',
      '/assets/css/all-projects.css',
    '/assets/js/improvements.js',
    '/assets/css/improvements.css',
    '/assets/js/project-demo.js',
    '/assets/css/project-demo.css',
    
    // Fontes
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    
    // Libraries
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Estratégias de cache
const CACHE_STRATEGIES = {
    STATIC: 'cache-first',    // Arquivos estáticos
    API: 'network-first',     // Dados de API
    IMAGES: 'cache-first',    // Imagens
    FONTS: 'cache-first'      // Fontes
};

// ============================================
// INSTALAÇÃO
// ============================================

self.addEventListener('install', event => {
    console.log(`[Service Worker ${APP_VERSION}] Instalando...`);
    
    event.waitUntil(
        Promise.all([
            // Cache de recursos críticos
            caches.open(CACHE_NAME)
                .then(cache => {
                    console.log('[Service Worker] Cache aberto:', CACHE_NAME);
                    return cache.addAll(PRECACHE_URLS);
                }),
                
            // Pular espera para ativação imediata
            self.skipWaiting()
        ])
    );
});

// ============================================
// ATIVAÇÃO
// ============================================

self.addEventListener('activate', event => {
    console.log(`[Service Worker ${APP_VERSION}] Ativando...`);
    
    event.waitUntil(
        Promise.all([
            // Limpar caches antigos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Tomar controle de todas as abas
            self.clients.claim(),
            
            // Enviar mensagem para todos os clients
            sendMessageToAllClients({ type: 'SW_ACTIVATED', version: APP_VERSION })
        ])
    );
});

// ============================================
// FETCH - ESTRATÉGIAS INTELIGENTES
// ============================================

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Ignorar navegador e extensões
    if (requestUrl.protocol === 'chrome-extension:') {
        return;
    }
    
    // Estratégia baseada no tipo de recurso
    if (isStaticAsset(requestUrl)) {
        event.respondWith(cacheFirstStrategy(event.request));
    } else if (isApiRequest(requestUrl)) {
        event.respondWith(networkFirstStrategy(event.request));
    } else if (isImageRequest(requestUrl)) {
        event.respondWith(imageCacheStrategy(event.request));
    } else {
        event.respondWith(networkFirstStrategy(event.request));
    }
});

// ============================================
// ESTRATÉGIAS DE CACHE
// ============================================

// Cache First (para estáticos)
async function cacheFirstStrategy(request) {
    try {
        // Tentar cache primeiro
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[Cache First] Servindo do cache:', request.url);
            
            // Buscar atualização em background
            fetchAndUpdateCache(request);
            
            return cachedResponse;
        }
        
        // Se não tem no cache, buscar na rede
        console.log('[Cache First] Buscando da rede:', request.url);
        const networkResponse = await fetch(request);
        
        // Adicionar ao cache (exceto se for navegação)
        if (networkResponse.ok && request.method === 'GET') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[Cache First] Erro:', error);
        
        // Fallback para página offline
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        
        // Fallback genérico
        return new Response('Recurso offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Network First (para dados dinâmicos)
async function networkFirstStrategy(request) {
    try {
        // Tentar rede primeiro
        console.log('[Network First] Buscando da rede:', request.url);
        const networkResponse = await fetch(request);
        
        // Atualizar cache se sucesso
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[Network First] Rede falhou, tentando cache:', request.url);
        
        // Fallback para cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Se é uma página, mostrar offline page
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        
        throw error;
    }
}

// Estratégia para imagens
async function imageCacheStrategy(request) {
    const cache = await caches.open('images-cache');
    
    // Verificar cache primeiro
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        // Atualizar cache em background
        fetchAndUpdateCache(request, 'images-cache');
        return cachedResponse;
    }
    
    // Buscar da rede
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Armazenar no cache
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Fallback para imagem placeholder
        return fetch('/images/placeholder.jpg');
    }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function isStaticAsset(url) {
    return url.pathname.endsWith('.html') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.includes('/css/') ||
           url.pathname.includes('/js/') ||
           url.pathname.includes('/assets/img/icons/');
}

function isApiRequest(url) {
    return url.pathname.includes('/api/') ||
           url.hostname === 'api.jmbenga.com';
}

function isImageRequest(url) {
    return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

async function fetchAndUpdateCache(request, cacheName = CACHE_NAME) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            await cache.put(request, response);
            console.log('[Background] Cache atualizado:', request.url);
        }
    } catch (error) {
        console.log('[Background] Falha ao atualizar cache:', error);
    }
}

// ============================================
// MENSAGENS (COMMUNICATION API)
// ============================================

self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: APP_VERSION });
            break;
            
        case 'CLEAR_CACHE':
            caches.delete(CACHE_NAME).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'GET_CACHE_STATS':
            caches.open(CACHE_NAME).then(cache => {
                cache.keys().then(keys => {
                    event.ports[0].postMessage({
                        cacheName: CACHE_NAME,
                        cacheSize: keys.length,
                        urls: keys.map(req => req.url)
                    });
                });
            });
            break;
            
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
    }
});

async function sendMessageToAllClients(message) {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage(message);
    });
}

// ============================================
// SYNC BACKGROUND (PARA DADOS OFFLINE)
// ============================================

self.addEventListener('sync', event => {
    console.log('[Background Sync] Sincronizando:', event.tag);
    
    if (event.tag === 'sync-contact-form') {
        event.waitUntil(syncContactForms());
    }
});

async function syncContactForms() {
    // Implementar sync de formulários offline
    console.log('[Sync] Sincronizando formulários...');
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================

self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    
    const options = {
        body: data.body || 'Nova notificação do portfólio',
        icon: '/assets/img/icons/icon-192x192.png',
        badge: '/assets/img/icons/badge-72x72.png',
        image: data.image,
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now()
        },
        actions: [
            {
                action: 'open',
                title: 'Abrir'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'José Mbenga', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// ============================================
// MANIFEST DINÂMICO
// ============================================

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Interceptar requests do manifest para versão dinâmica
    if (url.pathname.endsWith('/manifest.json')) {
        event.respondWith(
            fetch(event.request).then(response => {
                if (response.ok) {
                    return response.json().then(manifest => {
                        // Adicionar versão dinâmica
                        manifest.version = APP_VERSION;
                        
                        return new Response(JSON.stringify(manifest, null, 2), {
                            headers: response.headers
                        });
                    });
                }
                return response;
            })
        );
    }
});

// ============================================
// HEALTH CHECK
// ============================================

// Endpoint para verificar status do service worker
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    if (url.pathname === '/sw-health') {
        event.respondWith(
            new Response(JSON.stringify({
                status: 'active',
                version: APP_VERSION,
                timestamp: new Date().toISOString(),
                cacheSize: 'N/A'
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        );
    }
});

console.log(`[Service Worker ${APP_VERSION}] Carregado e pronto!`);