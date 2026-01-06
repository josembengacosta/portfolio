// sw.js - PWA Premium com Instalação Avançada
const APP_VERSION = '3.0.0';
const CACHE_NAME = `jmbenga-premium-${APP_VERSION}`;

// URLs para cache com prioridades
const ESSENTIAL_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    
    // Assets críticos
    '/assets/css/main.css',
    '/assets/css/improvements.css',
    '/assets/css/particles.css',
    '/assets/js/main.js',
    '/assets/js/improvements.js',
    
    // Ícones
    '/assets/img/svg/favicon_jm.png',
    '/assets/img/photo/josembengadacosta.png'
];

const OPTIONAL_CACHE = [
    // Páginas principais
    '/pages/all-projects.html',
    '/pages/reviews-feedback.html',
    '/pages/project-demo.html',
    '/dashboard/home.html',
    
    // Auth pages
    '/auth/login.html',
    '/auth/signup.html',
    '/auth/recovery.html',
    '/auth/reset-password.html'
];

// ============================================
// INSTALAÇÃO
// ============================================

self.addEventListener('install', event => {
    console.log('🚀 Instalando PWA Premium v' + APP_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Cache aberto:', CACHE_NAME);
                
                // Cache apenas essenciais primeiro
                return cache.addAll(ESSENTIAL_CACHE)
                    .then(() => {
                        console.log('✅ Cache essencial completo');
                        
                        // Cache opcional em background
                        return Promise.all(
                            OPTIONAL_CACHE.map(url => 
                                fetch(url).then(response => {
                                    if (response.ok) {
                                        return cache.put(url, response);
                                    }
                                }).catch(() => {})
                            )
                        );
                    });
            })
            .then(() => {
                console.log('⚡ Pular espera ativado');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('❌ Erro na instalação:', err);
            })
    );
});

// ============================================
// ATIVAÇÃO
// ============================================

self.addEventListener('activate', event => {
    console.log('🎯 Service Worker ativado');
    
    event.waitUntil(
        Promise.all([
            // Limpar caches antigos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Tomar controle imediato
            self.clients.claim(),
            
            // Enviar mensagem para todos os clients
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: APP_VERSION,
                        installed: true
                    });
                });
            })
        ])
        .then(() => {
            console.log('✅ SW ativado com sucesso');
        })
    );
});

// ============================================
// FETCH - Estratégia inteligente
// ============================================

self.addEventListener('fetch', event => {
    // Ignorar requests não-GET
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    
    // Ignorar chrome extensions
    if (url.protocol === 'chrome-extension:') return;
    
    // Estratégia: Cache First para assets, Network First para API
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(event.request));
    } else {
        event.respondWith(networkFirst(event.request));
    }
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    
    if (cached) {
        // Atualizar cache em background
        updateCache(request);
        return cached;
    }
    
    try {
        const response = await fetch(request);
        
        // Cache se for sucesso
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        // Fallback para offline
        if (request.mode === 'navigate') {
            return caches.match('/offline.html') || 
                   caches.match('/index.html');
        }
        
        return new Response('Conecte-se à internet', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        
        throw error;
    }
}

async function updateCache(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response);
        }
    } catch (error) {
        // Silenciar erros de atualização
    }
}

function isStaticAsset(url) {
    return url.pathname.match(/\.(html|css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i) ||
           url.pathname.includes('/assets/') ||
           url.pathname === '/' ||
           url.pathname === '/index.html';
}

// ============================================
// MANIFEST DINÂMICO
// ============================================

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Interceptar manifest para adicionar versão dinâmica
    if (url.pathname.endsWith('/manifest.json')) {
        event.respondWith(
            fetch(event.request)
                .then(response => response.json())
                .then(manifest => {
                    // Adicionar versão dinâmica
                    manifest.version = APP_VERSION;
                    
                    return new Response(JSON.stringify(manifest, null, 2), {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-PWA-Version': APP_VERSION
                        }
                    });
                })
                .catch(() => {
                    // Fallback para manifest básico
                    const basicManifest = {
                        name: "José Mbenga",
                        short_name: "JMbenga",
                        start_url: "/",
                        display: "standalone",
                        background_color: "#0f172a",
                        theme_color: "#2563eb",
                        version: APP_VERSION
                    };
                    
                    return new Response(JSON.stringify(basicManifest), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
    }
});

// ============================================
// MENSAGENS DO APP
// ============================================

self.addEventListener('message', event => {
    const { type, data } = event.data || {};
    
    switch (type) {
        case 'GET_VERSION':
            event.ports?.[0]?.postMessage({ version: APP_VERSION });
            break;
            
        case 'CHECK_INSTALLATION':
            event.ports?.[0]?.postMessage({ 
                installed: true,
                version: APP_VERSION,
                canPrompt: true
            });
            break;
            
        case 'CLEAR_CACHE':
            caches.delete(CACHE_NAME).then(() => {
                event.ports?.[0]?.postMessage({ success: true });
            });
            break;
            
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
    }
});

console.log('🎯 Service Worker Premium v' + APP_VERSION + ' carregado!');