// ============================================
// SISTEMA PWA INSTALL - OTIMIZADO
// ============================================

class PWAInstallManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.isDesktop = !this.isIOS && !this.isAndroid;
    this.supportsPWA = false;
    this.debug = false; // Set to true for debugging

    this.init();
  }

  async init() {
    console.log(" Inicializando PWA Install Manager...");

    // 1. Verificar se já está instalado
    await this.checkInstallation();

    // 2. Configurar listeners
    this.setupEventListeners();

    // 3. Verificar suporte PWA
    this.checkSupport();

    // 4. Debug info
    if (this.debug) {
      this.logDebugInfo();
    }
  }

  async checkInstallation() {
    // Método 1: Display mode
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    // Método 2: Navigator standalone (iOS)
    const isInWebApp = window.navigator.standalone === true;

    // Método 3: Referrer (Android)
    const isReferrer = document.referrer.includes("android-app://");

    this.isInstalled = isStandalone || isInWebApp || isReferrer;

    if (this.isInstalled) {
      console.log(" PWA já está instalado");
      document.documentElement.classList.add("pwa-installed");
    }

    return this.isInstalled;
  }

  checkSupport() {
    // Verificar requisitos básicos
    const requirements = {
      https:
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost",
      manifest: !!document.querySelector('link[rel="manifest"]'),
      serviceWorker: "serviceWorker" in navigator,
      notInstalled: !this.isInstalled,
    };

    this.supportsPWA = Object.values(requirements).every((req) => req === true);

    console.log(" Suporte PWA:", {
      ...requirements,
      supported: this.supportsPWA,
      platform: this.isIOS ? "iOS" : this.isAndroid ? "Android" : "Desktop",
    });

    return this.supportsPWA;
  }

  setupEventListeners() {
    // Evento beforeinstallprompt (Chrome/Edge)
    window.addEventListener(
      "beforeinstallprompt",
      this.handleBeforeInstallPrompt.bind(this)
    );

    // Quando o app é instalado
    window.addEventListener("appinstalled", this.handleAppInstalled.bind(this));

    // Verificar quando o usuário sai da página (para mostrar botão novamente depois)
    document.addEventListener("visibilitychange", () => {
      if (
        !document.hidden &&
        this.supportsPWA &&
        !this.isInstalled &&
        this.deferredPrompt
      ) {
        setTimeout(() => this.showInstallButton(), 2000);
      }
    });
  }

  handleBeforeInstallPrompt(e) {
    console.log("📱 Evento beforeinstallprompt recebido (mobile)");

    // Prevenir o prompt automático
    e.preventDefault();
    this.deferredPrompt = e;
    this.supportsPWA = true;

    // PARA MOBILE: Mostrar botão IMEDIATAMENTE após interação
    if (this.isMobile()) {
      // Esperar pequena interação primeiro
      const showOnInteraction = () => {
        if (!this.isInstalled && this.deferredPrompt) {
          this.showInstallButton();
        }
        // Remover listeners após usar
        document.removeEventListener("click", showOnInteraction);
        document.removeEventListener("touchstart", showOnInteraction);
      };

      // Mostrar após primeira interação do usuário
      document.addEventListener("click", showOnInteraction, { once: true });
      document.addEventListener("touchstart", showOnInteraction, {
        once: true,
      });

      // Fallback: mostrar após 30 segundos mesmo sem interação
      setTimeout(() => {
        if (!this.isInstalled && this.deferredPrompt) {
          this.showInstallButton();
        }
      }, 30000);
    } else {
      // Para desktop: esperar 5 segundos
      setTimeout(() => {
        if (!this.isInstalled && this.deferredPrompt) {
          this.showInstallButton();
        }
      }, 5000);
    }
  }

  // Adicione este método para detectar mobile:
  isMobile() {
    return this.isIOS || this.isAndroid;
  }

  handleAppInstalled() {
    console.log(" PWA instalado com sucesso!");
    this.isInstalled = true;
    this.deferredPrompt = null;
    this.hideInstallButton();
    document.documentElement.classList.add("pwa-installed");

    // Mostrar confirmação
    this.showNotification(
      "Aplicativo instalado com sucesso! Encontre-o na sua tela inicial ou dock.",
      "success"
    );
  }

  // ========== UI METHODS ==========

  showInstallButton() {
    // Se já tem botão, não mostrar outro
    if (document.getElementById("pwaInstallBtn") || this.isInstalled) {
      return;
    }

    console.log(" Mostrando botão de instalação...");

    const installBtn = document.createElement("button");
    installBtn.id = "pwaInstallBtn";
    installBtn.className = "pwa-install-btn";
    installBtn.setAttribute("aria-label", "Instalar aplicativo");

    // Conteúdo do botão
    installBtn.innerHTML = `
      <i class="fas fa-download"></i>
      <span class="btn-text">Instalar App</span>
      <span class="btn-subtext">Offline &amp; Mais Rápido</span>
    `;

    // Event listeners
    installBtn.addEventListener("click", () => this.installApp());
    installBtn.addEventListener("mouseenter", () => {
      installBtn.classList.add("hover");
    });
    installBtn.addEventListener("mouseleave", () => {
      installBtn.classList.remove("hover");
    });

    // Touch feedback para mobile
    installBtn.addEventListener("touchstart", () => {
      installBtn.classList.add("active");
    });
    installBtn.addEventListener("touchend", () => {
      installBtn.classList.remove("active");
    });

    document.body.appendChild(installBtn);

    // Animação de entrada
    requestAnimationFrame(() => {
      installBtn.classList.add("show");
    });

    // Auto-esconder após 30 segundos (não spam)
    this.autoHideTimeout = setTimeout(() => {
      this.hideInstallButton();
    }, 30000);
  }

  hideInstallButton() {
    const installBtn = document.getElementById("pwaInstallBtn");
    if (!installBtn) return;

    installBtn.classList.remove("show");

    // Remover após animação
    setTimeout(() => {
      if (installBtn.parentNode) {
        installBtn.remove();
      }
    }, 300);

    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  async installApp() {
    if (!this.deferredPrompt) {
      console.log(" Nenhum prompt disponível, mostrando instruções...");
      this.showPlatformInstructions();
      return;
    }

    try {
      console.log(" Mostrando prompt de instalação...");

      // Mostrar o prompt nativo do navegador
      this.deferredPrompt.prompt();

      // Esperar a escolha do usuário
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log(" Usuário escolheu:", outcome);

      if (outcome === "accepted") {
        console.log(" Instalação iniciada...");
        // O evento appinstalled será disparado depois
      } else {
        console.log(" Instalação recusada");
        this.showNotification(
          "Instalação cancelada. Você pode instalar depois pelo botão ou menu do navegador.",
          "info"
        );
      }

      // Limpar o prompt
      this.deferredPrompt = null;
      this.hideInstallButton();
    } catch (error) {
      console.error(" Erro na instalação:", error);
      this.showPlatformInstructions();
    }
  }

  // ========== PLATFORM SPECIFIC ==========

  showPlatformInstructions() {
    let message = "";
    let title = "";

    if (this.isIOS) {
      title = '<i class="fas fa-mobile-alt"></i> Instalar no iPhone/iPad';
      message = `
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li>Toque no ícone <i class="fas fa-share"></i> (compartilhar)</li>
          <li>Desça e toque em "Adicionar à Tela de Início"</li>
          <li>Toque em "Adicionar" no canto superior direito</li>
        </ol>
        <small><i class="fas fa-info-circle"></i> Use o Safari para instalar</small>
      `;
    } else if (this.isAndroid) {
      title = '<i class="fas fa-android"></i> Instalar no Android';
      message = `
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li>Toque no menu (⋮) no Chrome</li>
          <li>Selecione "Adicionar à tela inicial"</li>
          <li>Confirme o nome e toque em "Adicionar"</li>
        </ol>
      `;
    } else {
      title = '<i class="fas fa-desktop"></i> Instalar no Computador';
      message = `
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li>Clique no ícone <i class="fas fa-download"></i> na barra de endereço</li>
          <li>Selecione "Instalar JMbenga Portfolio"</li>
          <li>Ou use o menu (⋮) → "Instalar JMbenga Portfolio"</li>
        </ol>
      `;
    }

    this.showNotification(`<strong>${title}</strong>${message}`, "info", 10000);
  }

  // ========== NOTIFICATION SYSTEM ==========

  showNotification(content, type = "info", duration = 8000) {
    // Remover notificações existentes
    const existing = document.querySelector(".pwa-notification");
    if (existing) {
      existing.classList.add("hiding");
      setTimeout(() => existing.remove(), 300);
    }

    // Criar notificação
    const notification = document.createElement("div");
    notification.className = `pwa-notification ${type}`;

    // Ícone baseado no tipo
    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    };

    notification.innerHTML = `
      <div class="notification-content">
        <i class="${icons[type] || icons.info}"></i>
        <div>${content}</div>
      </div>
      <button class="close-notification" aria-label="Fechar">
        <i class="fas fa-times"></i>
      </button>
    `;

    document.body.appendChild(notification);

    // Mostrar com animação
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    // Botão de fechar
    notification
      .querySelector(".close-notification")
      .addEventListener("click", () => {
        this.hideNotification(notification);
      });

    // Auto-remover
    const autoRemove = setTimeout(() => {
      this.hideNotification(notification);
    }, duration);

    // Pausar timeout no hover
    notification.addEventListener("mouseenter", () => {
      clearTimeout(autoRemove);
    });

    notification.addEventListener("mouseleave", () => {
      setTimeout(() => {
        this.hideNotification(notification);
      }, duration);
    });
  }

  hideNotification(notification) {
    if (!notification || !notification.parentNode) return;

    notification.classList.remove("show");
    notification.classList.add("hiding");

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }

  // ========== DEBUG & UTILITIES ==========

  logDebugInfo() {
    console.log("=== PWA DEBUG INFO ===");
    console.log(
      "Platform:",
      this.isIOS ? "iOS" : this.isAndroid ? "Android" : "Desktop"
    );
    console.log("Installed:", this.isInstalled);
    console.log("Supports PWA:", this.supportsPWA);
    console.log("Deferred Prompt:", !!this.deferredPrompt);
    console.log(
      "Manifest:",
      document.querySelector('link[rel="manifest"]')?.href
    );
    console.log("Service Worker:", "serviceWorker" in navigator);
    console.log("=====================");
  }

  getStatus() {
    return {
      platform: this.isIOS ? "iOS" : this.isAndroid ? "Android" : "Desktop",
      installed: this.isInstalled,
      supportsPWA: this.supportsPWA,
      deferredPrompt: !!this.deferredPrompt,
      canInstall: this.supportsPWA && !this.isInstalled && this.deferredPrompt,
      https:
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost",
      manifest: !!document.querySelector('link[rel="manifest"]'),
      serviceWorker: "serviceWorker" in navigator,
    };
  }

  // Método público para forçar mostrar o botão (útil para debug)
  forceShowButton() {
    if (!this.isInstalled) {
      this.showInstallButton();
    }
  }

  // Método público para verificar status
  checkStatus() {
    const status = this.getStatus();

    if (this.debug) {
      console.log(" PWA Status:", status);
    }

    return status;
  }
}

// ========== GLOBAL INITIALIZATION ==========

document.addEventListener("DOMContentLoaded", () => {
  // Aguardar um pouco para não atrapalhar o carregamento inicial
  setTimeout(() => {
    // Inicializar o manager
    window.pwaManager = new PWAInstallManager();

    // Expor métodos globais para debug
    window.checkPWAStatus = () => window.pwaManager?.checkStatus();
    window.forceShowPWAButton = () => window.pwaManager?.forceShowButton();

    console.log(" PWA Install Manager inicializado");
  }, 1000);
});

// ========== SERVICE WORKER REGISTRATION ==========

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Registrar com escopo correto
    const swUrl =
      window.location.hostname === "localhost" ? "./sw.js" : "/portfolio/sw.js";

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log(" Service Worker registrado:", registration.scope);

        // Verificar atualizações
        registration.addEventListener("updatefound", () => {
          console.log(" Nova versão do Service Worker encontrada!");

          // Notificar usuário sobre atualização
          if (window.pwaManager) {
            window.pwaManager.showNotification(
              'Nova versão disponível! <button onclick="location.reload()" style="background:white;color:#2563eb;border:none;padding:5px 10px;border-radius:4px;margin-left:10px;cursor:pointer;">Atualizar</button>',
              "info"
            );
          }
        });
      })
      .catch((error) => {
        console.error(" Erro no Service Worker:", error);
      });
  });
}

// ========== DETECT PWA LAUNCH ==========

// Adicionar classe ao body quando for lançado como PWA
if (window.matchMedia("(display-mode: standalone)").matches) {
  document.documentElement.classList.add("pwa-launched");
  console.log(" Aplicativo lançado como PWA standalone");
}

// ========== FALLBACK STYLES (se o CSS não carregar) ==========

const fallbackStyles = `
  .pwa-install-btn {
    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 9999;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
  }
  
  .pwa-install-btn.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .pwa-install-btn.hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.6);
  }
  
  .pwa-install-btn.active {
    transform: scale(0.95);
  }
  
  .pwa-install-btn .btn-text {
    font-size: 14px;
  }
  
  .pwa-install-btn .btn-subtext {
    font-size: 11px;
    opacity: 0.8;
  }
  
  .pwa-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2563eb;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 10000;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    max-width: 350px;
    border-left: 4px solid #1d4ed8;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  }
  
  .pwa-notification.show {
    opacity: 1;
    transform: translateX(0);
  }
  
  .pwa-notification.hiding {
    opacity: 0;
    transform: translateX(100%);
  }
  
  .pwa-notification.success {
    background: #10b981;
    border-left-color: #059669;
  }
  
  .pwa-notification.error {
    background: #ef4444;
    border-left-color: #dc2626;
  }
  
  .pwa-notification.warning {
    background: #f59e0b;
    border-left-color: #d97706;
  }
  
  .pwa-notification .notification-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .pwa-notification .close-notification {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    cursor: pointer;
    font-size: 14px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Injetar estilos fallback apenas se necessário
if (!document.querySelector("style[pwa-fallback]")) {
  const style = document.createElement("style");
  style.setAttribute("pwa-fallback", "true");
  style.textContent = fallbackStyles;
  document.head.appendChild(style);
}

console.log(" PWA Install System carregado!");
