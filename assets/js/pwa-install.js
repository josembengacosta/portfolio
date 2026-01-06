// assets/js/pwa-install.js
// Sistema de Instalação PWA - José Mbenga Portfolio

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.hasShownPrompt = false;
        this.init();
    }

    init() {
        this.checkIfInstalled();
        this.setupEventListeners();
        this.initUI();
        this.checkInstallCriteria();
    }

    setupEventListeners() {
        // Evento antes do prompt de instalação
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 beforeinstallprompt disparado');
            e.preventDefault();
            this.deferredPrompt = e;
            this.updateInstallUI(true);
            
            if (!this.isIOS() && !this.hasShownPrompt && !this.isInstalled) {
                setTimeout(() => this.showCustomPrompt(), 3000);
            }
        });

        // Quando o app é instalado
        window.addEventListener('appinstalled', () => {
            console.log('PWA instalado com sucesso!');
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.hideAllPrompts();
            this.showSuccessMessage();
        });
    }

    initUI() {
        // Criar modal se não existir
        if (!document.getElementById('pwaInstallModal')) {
            this.createModal();
        }
        
        // Criar botão flutuante
        this.createFloatButton();
        
        // Event listeners
        document.addEventListener('click', (e) => {
            if (e.target.id === 'installPwaBtn') this.installApp();
            if (e.target.id === 'laterPwaBtn') this.hidePromptForWeek();
            if (e.target.id === 'closePwaModal') this.hideModal();
            if (e.target.id === 'pwaFloatBtn') this.showInstallPrompt();
        });
    }

    createModal() {
        const modalHTML = `
            <div id="pwaInstallModal" class="pwa-modal">
                <div class="pwa-modal-content">
                    <div class="pwa-modal-header">
                        <div class="pwa-icon">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <h3>Instalar App Premium</h3>
                        <button id="closePwaModal" class="pwa-close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="pwa-modal-body">
                        <div class="pwa-features">
                            <div class="feature-item">
                                <i class="fas fa-bolt"></i>
                                <span>Carregamento rápido</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-wifi-slash"></i>
                                <span>Funciona offline</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-mobile-alt"></i>
                                <span>Experiência nativa</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-bell"></i>
                                <span>Notificações</span>
                            </div>
                        </div>
                        
                        <div class="pwa-preview">
                            <div class="pwa-preview-mockup">
                                <div class="mockup-header">
                                    <span>JMbenga</span>
                                    <div class="mockup-battery">84%</div>
                                </div>
                                <div class="mockup-content">
                                    <div class="app-icon">
                                        <i class="fas fa-code"></i>
                                    </div>
                                    <h4>José Mbenga Dev</h4>
                                    <p>Acesso rápido ao portfólio</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pwa-benefits">
                            <p><i class="fas fa-check-circle"></i> Acesso da tela inicial</p>
                            <p><i class="fas fa-check-circle"></i> Sem barra de endereço</p>
                            <p><i class="fas fa-check-circle"></i> Atalhos rápidos</p>
                            <p><i class="fas fa-check-circle"></i> Segurança HTTPS</p>
                        </div>
                    </div>
                    
                    <div class="pwa-modal-footer">
                        <button id="installPwaBtn" class="btn-install">
                            <i class="fas fa-download"></i>
                            <span>Instalar App</span>
                        </button>
                        <button id="laterPwaBtn" class="btn-later">
                            <span>Lembrar depois</span>
                        </button>
                        <small class="pwa-note">
                            <i class="fas fa-info-circle"></i>
                            Gratuito • Sem downloads
                        </small>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    createFloatButton() {
        const floatBtnHTML = `
            <div id="pwaInstallFloat" class="pwa-float-btn">
                <button id="pwaFloatBtn">
                    <i class="fas fa-plus-circle"></i>
                    <span>Instalar App</span>
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', floatBtnHTML);
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    checkIfInstalled() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        this.isInstalled = isStandalone || window.navigator.standalone;
        
        if (this.isInstalled) {
            console.log('App já está instalado');
            this.hideAllPrompts();
        }
    }

    checkInstallCriteria() {
        const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
        const hasHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        const hasSW = 'serviceWorker' in navigator;
        
        console.log('Critérios PWA:', { hasManifest, hasHTTPS, hasSW });
    }

    updateInstallUI(canInstall) {
        if (canInstall && !this.isInstalled) {
            const logo = document.querySelector('.logo');
            if (logo && !logo.querySelector('.install-badge')) {
                const badge = document.createElement('span');
                badge.className = 'install-badge';
                badge.innerHTML = '<i class="fas fa-download"></i>';
                badge.title = 'Pode instalar como app';
                logo.appendChild(badge);
            }
        }
    }

    showCustomPrompt() {
        if (this.isInstalled || this.hasShownPrompt) return;
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            this.showModal();
        } else {
            this.showDesktopPrompt();
        }
        
        this.hasShownPrompt = true;
    }

    showModal() {
        const modal = document.getElementById('pwaInstallModal');
        if (!modal) return;
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hideModal();
        });
    }

    hideModal() {
        const modal = document.getElementById('pwaInstallModal');
        if (!modal) return;
        
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    showDesktopPrompt() {
        const floatBtn = document.getElementById('pwaInstallFloat');
        if (!floatBtn) return;
        
        floatBtn.classList.add('show');
        floatBtn.classList.add('pulse');
        
        setTimeout(() => floatBtn.classList.remove('pulse'), 2000);
    }

    hideDesktopPrompt() {
        const floatBtn = document.getElementById('pwaInstallFloat');
        if (floatBtn) floatBtn.classList.remove('show');
    }

    async installApp() {
        // Se tem deferredPrompt e é Android, usar prompt nativo
        if (this.deferredPrompt && this.isAndroid()) {
            try {
                this.deferredPrompt.prompt();
                const { outcome } = await this.deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('Usuário aceitou instalação');
                    this.isInstalled = true;
                    this.hideAllPrompts();
                } else {
                    this.hidePromptForMonth();
                }
                
                this.deferredPrompt = null;
                return;
            } catch (error) {
                console.error('Erro no prompt:', error);
            }
        }
        
        // Para iOS ou outros navegadores
        if (this.isIOS()) {
            this.showIOSInstructions();
        } else {
            this.showInstructions();
        }
    }

    showIOSInstructions() {
        const message = `
            <div style="background: #1e293b; color: white; padding: 20px; border-radius: 10px; max-width: 300px;">
                <h4><i class="fab fa-apple"></i> Instalar no iPhone/iPad</h4>
                <ol>
                    <li>Toque no ícone <i class="fas fa-share"></i></li>
                    <li>Toque em "Adicionar à Tela de Início"</li>
                    <li>Toque em "Adicionar"</li>
                </ol>
            </div>
        `;
        
        alert("Para instalar no iPhone:\n1. Toque no ícone de compartilhar (↑)\n2. Role para baixo\n3. Toque em 'Adicionar à Tela de Início'\n4. Toque em 'Adicionar'");
    }

    showInstructions() {
        const isChrome = /Chrome/.test(navigator.userAgent);
        
        let message = 'Clique no ícone de instalação na barra de endereço';
        if (!isChrome) {
            message = 'No menu do navegador (⋮ ou ☰), procure por "Instalar aplicativo"';
        }
        
        this.showNotification(message, 'info');
    }

    hidePromptForWeek() {
        localStorage.setItem('pwaPromptHidden', Date.now() + (7 * 24 * 60 * 60 * 1000));
        this.hideAllPrompts();
        this.showNotification('Lembraremos você em uma semana!', 'info');
    }

    hidePromptForMonth() {
        localStorage.setItem('pwaPromptHidden', Date.now() + (30 * 24 * 60 * 60 * 1000));
        this.hideAllPrompts();
    }

    hideAllPrompts() {
        this.hideModal();
        this.hideDesktopPrompt();
    }

    showSuccessMessage() {
        this.showNotification('App instalado! Encontre-o na sua tela inicial.', 'success');
    }

    showNotification(message, type = 'info') {
        // Usar sistema existente ou criar um simples
        const notification = document.createElement('div');
        notification.className = 'pwa-notification';
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#2563eb'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    showInstallPrompt() {
        if (this.modal && this.modal.style.display === 'flex') return;
        
        if (this.isAndroid() && this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            this.showModal();
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration.scope);
                
                // Inicializar instalador
                window.pwaInstaller = new PWAInstaller();
            })
            .catch(err => {
                console.error('Falha no Service Worker:', err);
            });
    }
});