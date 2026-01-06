// Service Worker para GitHub Pages
const CACHE_NAME = 'jmbenga-portfolio-v4';
const APP_VERSION = '4.0.0';

// URLs para cache (usando caminhos relativos)
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  
  // CSS
  './assets/css/main.css',
  './assets/css/improvements.css',
  './assets/css/particles.css',
  
  // JS
  './assets/js/main.js',
  './assets/js/improvements.js',
  './assets/js/pwa-install.js',
  
  // Ícones principais
  './assets/img/icons/icon-192x192.png',
  './assets/img/icons/icon-512x512.png',
  './assets/img/svg/favicon_jm.ico'
];

// ========== INSTALAÇÃO ==========
self.addEventListener('install', event => {
  console.log(`📦 SW v${APP_VERSION} instalando...`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto:', CACHE_NAME);
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log(' Todos os recursos em cache');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Erro no cache:', error);
      })
  );
});

// ========== ATIVAÇÃO ==========
self.addEventListener('activate', event => {
  console.log(` SW v${APP_VERSION} ativado`);
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log(' Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar controle de todas as abas
      self.clients.claim(),
      
      // Enviar mensagem para todos os clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: APP_VERSION,
            cacheName: CACHE_NAME
          });
        });
      })
    ])
  );
});

// ========== FETCH ==========
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Ignorar navegador e extensões
  if (url.protocol === 'chrome-extension:') return;
  
  // Para HTML, usar Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(event.request));
  } 
  // Para assets, usar Cache First
  else if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(event.request));
  }
  // Para o resto, usar Network First
  else {
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// ========== ESTRATÉGIAS ==========
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache First error:', error);
    
    // Se for navegação, retornar página offline
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    
    return new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network First error, usando cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página principal
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    
    throw error;
  }
}

function isStaticAsset(url) {
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i) ||
         url.pathname.includes('/assets/');
}

// ========== MENSAGENS ==========
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: APP_VERSION,
        cacheName: CACHE_NAME
      });
      break;
      
    case 'SKIP_WAITING':
      self.skipWaiting();
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
            version: APP_VERSION,
            cacheSize: keys.length,
            urls: keys.map(req => req.url)
          });
        });
      });
      break;
  }
});

console.log(`Service Worker v${APP_VERSION} carregado!`);