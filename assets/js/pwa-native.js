// assets/js/pwa-native.js - VERSÃO CORRIGIDA (SCROLL FUNCIONAL)
// Comportamento de app nativo para PWA - SEM BLOQUEAR SCROLL

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está em modo app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isPWA = window.navigator.standalone || isStandalone;
    
    if (isPWA) {
        console.log('📱 Executando como app nativo (scroll corrigido)');
        
        // Adicionar classe ao body
        document.body.classList.add('pwa-native', 'pwa-installed');
        
        // 1. Splash screen personalizada (opcional)
        createSplashScreen();
        
        // 2. Navegação tipo app
        initNativeNavigation();
        
        // 3. Gestos como app (SEM BLOQUEAR SCROLL)
        initTouchGestures();
        
        // 4. Comportamento offline
        initOfflineBehavior();
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
        
        // Estilos inline para garantir funcionamento
        splash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
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
        // História de navegação (opcional)
        let history = [];
        
        if ('navigation' in window) {
            window.navigation.addEventListener('navigate', (event) => {
                history.push({
                    url: window.location.href,
                    timestamp: Date.now()
                });
            });
        }
    }
    
    // Gestos touch como app nativo - VERSÃO CORRIGIDA (NÃO BLOQUEIA SCROLL)
    function initTouchGestures() {
        let startX, startY, startTime;
        const threshold = 100; // Mínimo de 100px para gesto
        const allowedTime = 500; // Máximo 500ms
        
        // Usar passive: true para melhor performance
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            startTime = new Date().getTime();
        }, { passive: true });
        
        // REMOVI O EVENTO TOUCHMOVE QUE BLOQUEAVA SCROLL
        
        document.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const distX = touch.pageX - startX;
            const distY = touch.pageY - startY;
            const elapsedTime = new Date().getTime() - startTime;
            
            // Swipe direito para voltar (como iOS) - apenas se horizontal
            if (Math.abs(distX) >= threshold && 
                Math.abs(distY) <= 100 && // Garante que é movimento horizontal
                elapsedTime <= allowedTime) {
                
                if (distX > 0) {
                    // Swipe direito - voltar
                    if (window.history.length > 1) {
                        window.history.back();
                    }
                }
            }
        }, { passive: true });
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
        
        // Adicionar animação CSS se não existir
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
        
        document.body.appendChild(toast);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Expor funções globalmente (opcional)
    window.PWANative = {
        showToast: showNativeToast,
        isNativeApp: isPWA
    };
});