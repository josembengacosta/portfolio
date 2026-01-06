// Sistema de Instalação PWA - SIMPLES E FUNCIONAL
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔧 Inicializando sistema PWA...");

  let deferredPrompt;
  let isInstalled = false;

  // Verificar se já está instalado
  function checkIfInstalled() {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebApp = window.navigator.standalone === true;
    isInstalled = isStandalone || isInWebApp;

    if (isInstalled) {
      console.log("📱 App já está instalado");
      document.body.classList.add("pwa-installed");
    }
  }

  // Verificar requisitos PWA
  function checkRequirements() {
    const isHTTPS = window.location.protocol === "https:";
    const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
    const hasSW = "serviceWorker" in navigator;

    console.log("📋 Requisitos PWA:", {
      https: isHTTPS,
      manifest: hasManifest,
      serviceWorker: hasSW,
      installed: isInstalled,
    });

    return isHTTPS && hasManifest && hasSW && !isInstalled;
  }

  // Mostrar botão de instalação
  function showInstallButton() {
    // Remover botão existente
    const existingBtn = document.getElementById("pwaInstallBtn");
    if (existingBtn) existingBtn.remove();

    // Criar novo botão
    const installBtn = document.createElement("button");
    installBtn.id = "pwaInstallBtn";
    installBtn.className = "pwa-install-btn";
    installBtn.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Instalar App</span>
        `;

    // Adicionar estilos
    installBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
            animation: pulse 2s infinite;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        `;

    // Animação de entrada
    setTimeout(() => {
      installBtn.style.opacity = "1";
      installBtn.style.transform = "translateY(0)";
      installBtn.classList.add("show");
    }, 100);

    // Evento de clique
    installBtn.addEventListener("click", installApp);

    // Efeitos hover
    installBtn.addEventListener("mouseenter", () => {
      installBtn.style.transform = "translateY(-2px)";
      installBtn.style.boxShadow = "0 12px 30px rgba(37, 99, 235, 0.6)";
    });

    installBtn.addEventListener("mouseleave", () => {
      installBtn.style.transform = "translateY(0)";
      installBtn.style.boxShadow = "0 8px 25px rgba(37, 99, 235, 0.4)";
    });

    document.body.appendChild(installBtn);
    console.log("🔼 Botão de instalação mostrado");
  }

  // Esconder botão
  function hideInstallButton() {
    const installBtn = document.getElementById("pwaInstallBtn");
    if (installBtn) {
      installBtn.style.opacity = "0";
      installBtn.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (installBtn.parentNode) {
          installBtn.remove();
        }
      }, 300);
    }
  }

  // Instalar app
  async function installApp() {
    if (!deferredPrompt) {
      console.log("❌ Nenhum prompt disponível");
      showInstructions();
      return;
    }

    try {
      console.log("🎪 Mostrando prompt de instalação...");

      // Mostrar prompt
      deferredPrompt.prompt();

      // Esperar resposta
      const { outcome } = await deferredPrompt.userChoice;
      console.log("👤 Usuário escolheu:", outcome);

      if (outcome === "accepted") {
        console.log("✅ App sendo instalado...");
        isInstalled = true;
        showNotification(
          " App instalado! Encontre-o na sua tela inicial.",
          "success"
        );
      } else {
        console.log("❌ Instalação cancelada");
        showNotification(
          "Instalação cancelada. Você pode instalar depois!",
          "info"
        );
      }

      deferredPrompt = null;
      hideInstallButton();
    } catch (error) {
      console.error("❌ Erro na instalação:", error);
      showInstructions();
    }
  }

  // Mostrar instruções manuais
  function showInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    let message = "";

    if (isIOS) {
      message = `
                <div style="background: #1e293b; color: white; padding: 20px; border-radius: 10px; max-width: 300px;">
                    <h4 style="margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fab fa-apple"></i> Instalar no iPhone/iPad
                    </h4>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li>Toque no ícone <i class="fas fa-share"></i> (compartilhar)</li>
                        <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                        <li>Toque em "Adicionar" no canto superior direito</li>
                    </ol>
                </div>
            `;
    } else if (isAndroid) {
      message =
        'No menu do Chrome (⋮), toque em "Adicionar à tela inicial" ou "Instalar app"';
    } else {
      message = "No Chrome Desktop: Clique no ícone 📥 na barra de endereço";
    }

    showNotification(message, "info");
  }

  // Mostrar notificação
  function showNotification(content, type = "info") {
    // Remover notificação existente
    const existing = document.querySelector(".pwa-notification");
    if (existing) existing.remove();

    // Criar notificação
    const notification = document.createElement("div");
    notification.className = `pwa-notification ${type}`;

    if (typeof content === "string" && content.includes("<")) {
      notification.innerHTML = content;
    } else {
      notification.textContent = content;
    }

    // Estilos
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "#10b981"
                : type === "error"
                ? "#ef4444"
                : type === "warning"
                ? "#f59e0b"
                : "#2563eb"
            };
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            border-left: 4px solid ${
              type === "success"
                ? "#059669"
                : type === "error"
                ? "#dc2626"
                : type === "warning"
                ? "#d97706"
                : "#1d4ed8"
            };
        `;

    // Botão de fechar
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
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
        `;
    closeBtn.onclick = () => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    };

    notification.appendChild(closeBtn);
    document.body.appendChild(notification);

    // Auto-remover após 8 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => notification.remove(), 300);
      }
    }, 8000);
  }

  // ========== EVENT LISTENERS ==========

  // Evento beforeinstallprompt (Chrome)
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("🎪 Evento beforeinstallprompt disparado!");

    // Prevenir prompt automático
    e.preventDefault();

    // Guardar o evento
    deferredPrompt = e;

    // Verificar se pode mostrar botão
    if (checkRequirements()) {
      console.log("✅ Pode instalar, mostrando botão em 3 segundos...");
      setTimeout(() => {
        if (!isInstalled && deferredPrompt) {
          showInstallButton();
        }
      }, 3000);
    }
  });

  // Quando o app é instalado
  window.addEventListener("appinstalled", (evt) => {
    console.log("✅ PWA instalado com sucesso!");
    isInstalled = true;
    deferredPrompt = null;
    hideInstallButton();
    document.body.classList.add("pwa-installed");
  });

  // ========== INICIALIZAÇÃO ==========

  // 1. Verificar instalação
  checkIfInstalled();

  // 2. Registrar Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registrado:", registration.scope);

        // Verificar se há atualizações
        registration.addEventListener("updatefound", () => {
          console.log("🔄 Nova versão do Service Worker encontrada!");
          showNotification(
            "Nova versão disponível! Recarregue para atualizar.",
            "info"
          );
        });
      })
      .catch((error) => {
        console.error("❌ Erro no Service Worker:", error);
      });
  }

  // 3. Verificar requisitos iniciais
  setTimeout(() => {
    if (checkRequirements() && !isInstalled && deferredPrompt) {
      console.log("🔼 Mostrando botão de instalação...");
      showInstallButton();
    }
  }, 2000);

  // 4. Debug no console
  console.log("=== PWA DEBUG INFO ===");
  console.log("URL:", window.location.href);
  console.log("HTTPS:", window.location.protocol === "https:");
  console.log(
    "Manifest:",
    document.querySelector('link[rel="manifest"]')?.href
  );
  console.log("Service Worker:", "serviceWorker" in navigator);
  console.log(
    "Display Mode:",
    window.matchMedia("(display-mode: standalone)").matches
  );

  // 5. Função global para debug
  window.checkPWAStatus = function () {
    const status = {
      https: window.location.protocol === "https:",
      manifest: !!document.querySelector('link[rel="manifest"]'),
      serviceWorker: "serviceWorker" in navigator,
      installed: isInstalled,
      deferredPrompt: !!deferredPrompt,
      displayMode: window.matchMedia("(display-mode: standalone)").matches,
    };

    console.log("📊 Status PWA:", status);
    alert(
      `PWA Status:\n- HTTPS: ${status.https ? "✅" : "❌"}\n- Manifest: ${
        status.manifest ? "✅" : "❌"
      }\n- Service Worker: ${
        status.serviceWorker ? "✅" : "❌"
      }\n- Instalado: ${status.installed ? "✅" : "❌"}`
    );

    return status;
  };
});
