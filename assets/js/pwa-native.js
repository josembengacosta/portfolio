// assets/js/pwa-native.js
// Comportamento de app nativo para PWA

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está em modo app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isPWA = window.navigator.standalone || isStandalone;
    
    if (isPWA) {
        console.log('📱 Executando como app nativo');
        
        // Adicionar classe ao body
        document.body.classList.add('pwa-native', 'pwa-installed');
        
        // 1. Splash screen personalizada
        createSplashScreen();
        
        // 2. Navegação tipo app
        initNativeNavigation();
        
        // 3. Gestos como app
        initTouchGestures();
        
        // 4. Comportamento offline
        initOfflineBehavior();
        
        // 5. Atualizações em background
        initBackgroundSync();
    }
    
    // Função para criar splash screen
    function createSplashScreen() {
        const splash = document.createElement('div');
        splash.className = 'app-splash';
        splash.innerHTML = `
            <div class="splash-content">
                <div class="splash-logo">
                    <i class="fas fa-code fa-3x" style="color: #2563eb;"></i>
                    <h2 style="color: white; margin-top: 20px;">JMbenga</h2>
                    <p style="color: #94a3b8; font-size: 14px;">Carregando...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(splash);
        
        // Remover após 2 segundos
        setTimeout(() => {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 500);
        }, 2000);
    }
    
    // Navegação tipo app
    function initNativeNavigation() {
        // História de navegação
        let history = [];
        
        // Botão voltar personalizado (opcional)
        if ('navigation' in window) {
            window.navigation.addEventListener('navigate', (event) => {
                history.push({
                    url: window.location.href,
                    timestamp: Date.now()
                });
            });
        }
        
        // Prevenir saída acidental
        window.addEventListener('beforeunload', (e) => {
            if (history.length > 1) {
                e.preventDefault();
                e.returnValue = '';
                return 'Deseja sair do app?';
            }
        });
    }
    
    // Gestos touch como app nativo
    function initTouchGestures() {
        let startX, startY, distX, distY;
        const threshold = 100; // Mínimo de 100px para gesto
        const allowedTime = 500; // Máximo 500ms
        
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            startTime = new Date().getTime();
            e.preventDefault();
        }, false);
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevenir scroll nativo
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            distX = touch.pageX - startX;
            distY = touch.pageY - startY;
            const elapsedTime = new Date().getTime() - startTime;
            
            // Swipe direito para voltar (como iOS)
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= 100 && elapsedTime <= allowedTime) {
                if (distX > 0) {
                    // Swipe direito - voltar
                    if (window.history.length > 1) {
                        window.history.back();
                    }
                }
            }
        }, false);
    }
    
    // Comportamento offline
    function initOfflineBehavior() {
        // Verificar conexão
        window.addEventListener('online', () => {
            showNativeToast('✅ Conectado à internet', 'success');
        });
        
        window.addEventListener('offline', () => {
            showNativeToast('📶 Modo offline ativado', 'warning');
        });
    }
    
    // Sincronização em background
    function initBackgroundSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('sync-data');
            });
        }
    }
    
    // Toast nativo
    function showNativeToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `native-toast ${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : 
                        type === 'error' ? '#ef4444' : 
                        type === 'warning' ? '#f59e0b' : '#2563eb'};
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: toastIn 0.3s ease;
            font-size: 14px;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        // Animação CSS
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes toastIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes toastOut {
                    from { opacity: 1; transform: translate(-50%, 0); }
                    to { opacity: 0; transform: translate(-50%, 20px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Expor funções globalmente
    window.PWANative = {
        showToast: showNativeToast,
        isNativeApp: isPWA
    };
});