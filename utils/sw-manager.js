// utils/sw-manager.js
class ServiceWorkerManager {
    constructor() {
        this.registration = null;
    }
    
    async register() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker não suportado');
            return false;
        }
        
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registrado:', this.registration);
            
            this.setupUpdateListener();
            this.checkForUpdates();
            
            return true;
        } catch (error) {
            console.error('Falha ao registrar Service Worker:', error);
            return false;
        }
    }
    
    setupUpdateListener() {
        this.registration.addEventListener('updatefound', () => {
            const newWorker = this.registration.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nova versão disponível
                    this.showUpdateNotification();
                }
            });
        });
    }
    
    showUpdateNotification() {
        if (confirm('Nova versão disponível! Recarregar página para atualizar?')) {
            window.location.reload();
        }
    }
    
    async checkForUpdates() {
        try {
            await this.registration.update();
        } catch (error) {
            console.log('Erro ao verificar atualizações:', error);
        }
    }
    
    async getVersion() {
        return new Promise((resolve) => {
            const channel = new MessageChannel();
            
            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_VERSION' },
                [channel.port2]
            );
            
            channel.port1.onmessage = (event) => {
                resolve(event.data.version);
            };
            
            // Timeout
            setTimeout(() => resolve('unknown'), 1000);
        });
    }
    
    async clearCache() {
        return new Promise((resolve) => {
            const channel = new MessageChannel();
            
            navigator.serviceWorker.controller.postMessage(
                { type: 'CLEAR_CACHE' },
                [channel.port2]
            );
            
            channel.port1.onmessage = (event) => {
                resolve(event.data.success);
            };
        });
    }
}

// Exportar para uso global
window.SWManager = new ServiceWorkerManager();