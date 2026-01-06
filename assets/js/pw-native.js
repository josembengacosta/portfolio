// assets/js/pwa-native.js - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está em modo app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isPWA = window.navigator.standalone || isStandalone;
    
    if (isPWA) {
        console.log('Executando como PWA instalado');
        document.body.classList.add('pwa-installed');
        
        // Apenas adicionar classe, sem splash screen complexa
        createSimpleSplashScreen();
        
        // Adicionar comportamentos nativos simples
        initSimpleNativeFeatures();
    }
    
    // 1. Splash Screen SIMPLES e FUNCIONAL
    function createSimpleSplashScreen() {
        // Remover splash existente
        const existingSplash = document.querySelector('.app-splash');
        if (existingSplash) existingSplash.remove();
        
        // Criar splash minimalista
        const splash = document.createElement('div');
        splash.className = 'app-splash';
        
        // CSS INLINE (não depende de arquivo externo)
        splash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f172a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        // Conteúdo centralizado CORRETAMENTE
        splash.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-code" style="
                    font-size: 3rem;
                    color: #2563eb;
                    margin-bottom: 20px;
                    display: block;
                "></i>
                
                <h2 style="
                    color: white;
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                    font-family: 'Inter', sans-serif;
                ">JMbenga</h2>
                
                <p style="
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-bottom: 30px;
                ">Portfólio Full Stack</p>
                
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(37, 99, 235, 0.3);
                    border-top-color: #2563eb;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
                
                <p style="
                    color: #64748b;
                    font-size: 0.8rem;
                    margin-top: 20px;
                ">Carregando...</p>
            </div>
        `;
        
        document.body.appendChild(splash);
        
        // Adicionar animação CSS inline
        const spinAnimation = document.createElement('style');
        spinAnimation.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinAnimation);
        
        // Remover após 2 segundos OU quando a página carregar
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                if (splash.parentNode) {
                    splash.remove();
                    spinAnimation.remove();
                }
            }, 500);
        }, 2000);
        
        // Remover também quando a página terminar de carregar
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (splash.parentNode) {
                    splash.style.opacity = '0';
                    setTimeout(() => {
                        if (splash.parentNode) splash.remove();
                        if (spinAnimation.parentNode) spinAnimation.remove();
                    }, 300);
                }
            }, 500);
        });
    }
    
    // 2. Features nativas SIMPLES
    function initSimpleNativeFeatures() {
        // Apenas adicionar classes CSS úteis
        document.documentElement.style.setProperty('--pwa-installed', 'true');
        
        // Detectar se é iOS para ajustes específicos
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            document.body.classList.add('ios-pwa');
        }
        
        // Ajustar header para PWA
        const header = document.querySelector('.header');
        if (header) {
            header.style.paddingTop = 'env(safe-area-inset-top)';
        }
    }
});

// Comportamento offline simples
window.addEventListener('online', () => {
    if (document.body.classList.contains('pwa-installed')) {
        showSimpleToast('Online', 2000);
    }
});

window.addEventListener('offline', () => {
    if (document.body.classList.contains('pwa-installed')) {
        showSimpleToast('Offline', 3000);
    }
});

// Toast simples
function showSimpleToast(message, duration = 3000) {
    const existing = document.querySelector('.simple-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'simple-toast';
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(30, 41, 59, 0.9);
        backdrop-filter: blur(10px);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        z-index: 9998;
        font-size: 14px;
        font-weight: 500;
        animation: toastFadeIn 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    document.body.appendChild(toast);
    
    // Animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastFadeIn {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes toastFadeOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, 20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Remover
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 300);
    }, duration);
}