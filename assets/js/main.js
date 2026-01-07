// ============================================
// PORTFÓLIO JOSÉ MBENGA - JS OTIMIZADO
// ============================================

// Configurações globais
const CONFIG = {
  whatsappNumber: "244922030116",
  email: "josembengadacosta@gmail.com",
  github: "https://github.com/josembengacosta",
  linkedin: "https://linkedin.com/in/josembengadacosta",
  enableNotifications: true,
  enableServiceWorker: true,
  debugMode: false,
};

// Cache global de elementos
let DOM_CACHE = {};

// ============================================
// 1. INICIALIZAÇÃO PRINCIPAL
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // Cache de elementos DOM usados frequentemente
  cacheDOMElements();

  // Verificar modo PWA primeiro
  checkPWAMode();

  // Inicializar funcionalidades
  initCoreFeatures();

  // Inicializar funcionalidades secundárias (com delay para performance)
  setTimeout(() => {
    initSecondaryFeatures();
  }, 100);

  // Configurar analytics se disponível
  setupAnalytics();
});

// Cache elementos DOM
function cacheDOMElements() {
  DOM_CACHE = {
    // Header & Navigation
    header: document.getElementById("header"),
    mobileToggle: document.getElementById("mobileToggle"),
    offcanvas: document.getElementById("offcanvas"),
    closeCanvas: document.getElementById("closeCanvas"),

    // Theme
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.querySelector("#themeToggle i"),

    // Forms
    contactForm: document.getElementById("contactForm"),
    newsletterBtn: document.getElementById("newsletterBtn"),
    newsletterEmail: document.getElementById("newsletterEmail"),

    // UI Elements
    backToTop: document.getElementById("backToTop"),
    scrollProgress: document.getElementById("scrollProgress"),
    whatsappFloat: document.getElementById("whatsappFloat"),
    notificationContainer:
      document.getElementById("notificationContainer") ||
      createNotificationContainer(),

    // Stats
    counters: document.querySelectorAll("[data-count]"),
    skillBars: document.querySelectorAll(".skill-progress"),

    // Projects
    filterBtns: document.querySelectorAll(".filter-btn"),
    projectCards: document.querySelectorAll(".project-card"),
  };
}

// ============================================
// 2. SISTEMA PWA
// ============================================

function checkPWAMode() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;

  if (isStandalone) {
    document.documentElement.classList.add("pwa-installed", "pwa-standalone");

    // iOS specific fixes
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.documentElement.classList.add("pwa-ios");
      fixIOSViewport();
    }

    // Android specific fixes
    if (/Android/.test(navigator.userAgent)) {
      document.documentElement.classList.add("pwa-android");
    }

    console.log(" PWA Standalone Mode Detected");
  }
}

function fixIOSViewport() {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
  }
}

// ============================================
// 3. FUNCIONALIDADES CORE (carregam primeiro)
// ============================================

function initCoreFeatures() {
  initThemeSystem();
  initNavigation();
  initLoadingScreen();
  initHeroAnimations();
  initPerformanceOptimizations();

  // Iniciar Service Worker se habilitado
  if (CONFIG.enableServiceWorker) {
    initServiceWorker();
  }
}

function initSecondaryFeatures() {
  initSkillsAnimation();
  initProjectsFilter();
  initContactForm();
  initWhatsAppFloat();
  initScrollProgress();
  initBackToTop();
  initNewsletter();

  // Iniciar AOS se disponível
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.innerWidth < 768,
    });
  }

  // Notificação de boas-vindas
  if (CONFIG.enableNotifications) {
    setTimeout(() => {
      showNotification(
        'Bem-vindo ao meu portfólio! Explore meus projetos e habilidades. <i class="fas fa-hand-paper"></i>',
        "info",
        3000
      );
    }, 1500);
  }
}

// ============================================
// 4. LOADING SCREEN OTIMIZADA
// ============================================

function initLoadingScreen() {
  const loading = document.getElementById("loading");
  if (!loading) return;

  // Usar requestAnimationFrame para animação suave
  requestAnimationFrame(() => {
    loading.classList.add("hidden");

    setTimeout(() => {
      loading.style.display = "none";
      document.body.classList.add("loaded");
    }, 500);
  });
}

// ============================================
// 5. SISTEMA DE TEMA MELHORADO
// ============================================

function initThemeSystem() {
  const { themeToggle, themeIcon } = DOM_CACHE;
  if (!themeToggle || !themeIcon) return;

  // Detectar tema preferido
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("theme");

  // Aplicar tema
  function applyTheme(theme, silent = false) {
    const isLight = theme === "light";

    if (isLight) {
      document.body.classList.add("light-theme");
      themeIcon.className = "fas fa-sun";
    } else {
      document.body.classList.remove("light-theme");
      themeIcon.className = "fas fa-moon";
    }

    localStorage.setItem("theme", theme);

    // Salvar também no sessionStorage para PWA
    sessionStorage.setItem("theme", theme);

    // Disparar evento customizado
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme } })
    );

    // Notificação
    if (!silent) {
      showNotification(
        `Tema ${isLight ? "claro" : "escuro"} ativado`,
        "success",
        2000
      );
    }
  }

  // Determinar tema inicial
  if (savedTheme) {
    applyTheme(savedTheme, true);
  } else {
    applyTheme(prefersDark.matches ? "dark" : "light", true);
  }

  // Alternar tema
  themeToggle.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });

  // Ouvir mudanças do sistema
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light", true);
    }
  });
}

// ============================================
// 6. NAVEGAÇÃO OTIMIZADA
// ============================================

function initNavigation() {
  const { mobileToggle, closeCanvas, offcanvas, header } = DOM_CACHE;

  if (!mobileToggle || !offcanvas) return;

  // Estado do menu
  let isMenuOpen = false;

  // Toggle menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileToggle.classList.toggle("active");
    offcanvas.classList.toggle("active");
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    // Adicionar/remover listener para fechar com ESC
    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.removeEventListener("keydown", handleEscapeKey);
    }
  }

  // Fechar com ESC
  function handleEscapeKey(e) {
    if (e.key === "Escape" && isMenuOpen) {
      toggleMenu();
    }
  }

  // Event listeners
  mobileToggle.addEventListener("click", toggleMenu);

  if (closeCanvas) {
    closeCanvas.addEventListener("click", toggleMenu);
  }

  // Fechar menu ao clicar fora
  offcanvas.addEventListener("click", (e) => {
    if (e.target === offcanvas) {
      toggleMenu();
    }
  });

  // Fechar menu ao clicar em link
  const navLinks = document.querySelectorAll(".offcanvas-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });

  // Header scroll effect
  function handleHeaderScroll() {
    if (window.scrollY > 100) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }

  // Debounced scroll handler
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleHeaderScroll, 10);
  });

  // Atualizar navegação ativa
  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document
          .querySelectorAll(".nav-link, .offcanvas-link")
          .forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
      }
    });
  }

  // Debounced scroll para atualizar navegação
  let navScrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(navScrollTimeout);
    navScrollTimeout = setTimeout(updateActiveNav, 50);
  });
}

// ============================================
// 7. ANIMAÇÕES DO HERO (Performance)
// ============================================

function initHeroAnimations() {
  const { counters } = DOM_CACHE;
  if (!counters.length) return;

  // Observer para contadores
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          if (!counter.classList.contains("animated")) {
            animateCounter(counter);
            counterObserver.unobserve(counter);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // Função de animação de contador
  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 1500;
    const startTime = Date.now();
    const startValue = 0;

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (target - startValue) * easeOutQuart
      );

      counter.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
        counter.classList.add("animated");
      }
    }

    requestAnimationFrame(update);
  }
}

// ============================================
// 8. SKILLS ANIMATION (Otimizado)
// ============================================

function initSkillsAnimation() {
  const { skillBars } = DOM_CACHE;
  if (!skillBars.length) return;

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillContainer = entry.target;
          const bars = skillContainer.querySelectorAll(".skill-progress");

          bars.forEach((bar) => {
            if (!bar.classList.contains("animated")) {
              const width = bar.getAttribute("data-width");
              bar.style.width = width + "%";
              bar.classList.add("animated");
            }
          });

          skillObserver.unobserve(skillContainer);
        }
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
  );

  // Observar containers de skills
  document.querySelectorAll(".skill-category").forEach((container) => {
    skillObserver.observe(container);
  });
}

// ============================================
// 9. FILTRO DE PROJETOS (Performance)
// ============================================

function initProjectsFilter() {
  const { filterBtns, projectCards } = DOM_CACHE;
  if (!filterBtns.length || !projectCards.length) return;

  let activeFilter = "all";

  function filterProjects(filter) {
    if (filter === activeFilter) return;

    activeFilter = filter;

    // Animar saída
    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const shouldShow = filter === "all" || category === filter;

      if (!shouldShow) {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
      }
    });

    // Animar entrada após delay
    setTimeout(() => {
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const shouldShow = filter === "all" || category === filter;

        if (shouldShow) {
          card.style.display = "block";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
        } else {
          card.style.display = "none";
        }
      });
    }, 200);
  }

  // Event listeners para botões
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterProjects(btn.getAttribute("data-filter"));
    });
  });
}

// ============================================
// 10. FORMULÁRIO DE CONTATO (Melhorado)
// ============================================

function initContactForm() {
  const { contactForm } = DOM_CACHE;
  if (!contactForm) return;

  // Cache de elementos do formulário
  const formElements = {
    name: contactForm.querySelector("#name"),
    email: contactForm.querySelector("#email"),
    phone: contactForm.querySelector("#phone"),
    subject: contactForm.querySelector("#subject"),
    message: contactForm.querySelector("#message"),
    submitBtn: contactForm.querySelector('button[type="submit"]'),
  };

  // Validação em tempo real
  Object.entries(formElements).forEach(([key, element]) => {
    if (element && key !== "submitBtn") {
      element.addEventListener("blur", () => validateField(key, element));
      element.addEventListener("input", () => clearFieldError(element));
    }
  });

  // Validação de campo
  function validateField(fieldName, element) {
    const value = element.value.trim();
    let isValid = true;
    let message = "";

    switch (fieldName) {
      case "name":
        if (value && value.length < 3) {
          isValid = false;
          message = "Nome precisa ter pelo menos 3 caracteres";
        }
        break;
      case "email":
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            message = "Por favor, insira um email válido";
          }
        }
        break;
      case "phone":
        if (value) {
          const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
          if (!phoneRegex.test(value)) {
            isValid = false;
            message = "Formato inválido. Use (XX) XXXXX-XXXX";
          }
        }
        break;
      case "message":
        if (value && value.length < 10) {
          isValid = false;
          message = "Mensagem muito curta (mínimo 10 caracteres)";
        }
        break;
    }

    if (!isValid && value) {
      showFieldError(element, message);
    } else {
      clearFieldError(element);
    }
  }

  // Mostrar erro no campo
  function showFieldError(field, message) {
    field.classList.add("error");
    field.classList.remove("success");

    let errorElement = field.parentNode.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      field.parentNode.appendChild(errorElement);
    }

    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.classList.add("show");
  }

  // Limpar erro do campo
  function clearFieldError(field) {
    field.classList.remove("error");
    const errorElement = field.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.classList.remove("show");
    }
  }

  // Envio do formulário
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos os campos obrigatórios
    const requiredFields = ["name", "email", "subject", "message"];
    let isValid = true;

    requiredFields.forEach((fieldName) => {
      const element = formElements[fieldName];
      if (element) {
        const value = element.value.trim();
        if (!value) {
          showFieldError(element, "Este campo é obrigatório");
          isValid = false;
        } else if (fieldName === "name" && value.length < 3) {
          showFieldError(element, "Nome precisa ter pelo menos 3 caracteres");
          isValid = false;
        } else if (fieldName === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            showFieldError(element, "Email inválido");
            isValid = false;
          }
        } else if (fieldName === "message" && value.length < 10) {
          showFieldError(
            element,
            "Mensagem muito curta (mínimo 10 caracteres)"
          );
          isValid = false;
        }
      }
    });

    if (!isValid) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }

    // Preparar dados
    const formData = {
      name: formElements.name.value.trim(),
      email: formElements.email.value.trim(),
      phone: formElements.phone?.value.trim() || "",
      subject: formElements.subject.value,
      message: formElements.message.value.trim(),
      timestamp: new Date().toISOString(),
    };

    // Simular envio
    const originalText = formElements.submitBtn.innerHTML;
    formElements.submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    formElements.submitBtn.disabled = true;

    try {
      // Aqui você substituiria por uma chamada API real
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Sucesso
      showNotification(
        "Mensagem enviada com sucesso! Entrarei em contato em breve.",
        "success"
      );
      contactForm.reset();

      // Limpar erros
      Object.values(formElements).forEach((element) => {
        if (element && element !== formElements.submitBtn) {
          clearFieldError(element);
        }
      });

      // Log para desenvolvimento
      if (CONFIG.debugMode) {
        console.log("Form data:", formData);
      }
    } catch (error) {
      showNotification("Erro ao enviar mensagem. Tente novamente.", "error");
      console.error("Form error:", error);
    } finally {
      formElements.submitBtn.innerHTML = originalText;
      formElements.submitBtn.disabled = false;
    }
  });
}

// ============================================
// 11. WHATSAPP FLUTUANTE (Melhorado)
// ============================================

function initWhatsAppFloat() {
  const { whatsappFloat } = DOM_CACHE;
  if (!whatsappFloat) return;

  let isVisible = false;
  let lastScrollY = 0;
  let scrollTimeout;

  function toggleWhatsApp(show) {
    if (show === isVisible) return;

    isVisible = show;
    if (show) {
      whatsappFloat.classList.add("show");
    } else {
      whatsappFloat.classList.remove("show");
    }
  }

  // Mostrar após 3 segundos
  setTimeout(() => toggleWhatsApp(true), 3000);

  // Esconder ao rolar para baixo
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        toggleWhatsApp(false);
      } else if (currentScrollY < lastScrollY) {
        toggleWhatsApp(true);
      }
      lastScrollY = currentScrollY;
    }, 100);
  });

  // Botão de fechar
  const closeBtn = whatsappFloat.querySelector(".close-whatsapp");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      toggleWhatsApp(false);
      showNotification(
        "WhatsApp minimizado. Clique no ícone flutuante para abrir novamente.",
        "info",
        2000
      );
    });
  }
}

// ============================================
// 12. SCROLL PROGRESS (Otimizado)
// ============================================

function initScrollProgress() {
  const { scrollProgress } = DOM_CACHE;
  if (!scrollProgress) return;

  let rafId = null;

  function updateProgress() {
    const winScroll =
      document.documentElement.scrollTop || document.body.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    scrollProgress.style.width = scrolled + "%";
    rafId = null;
  }

  function onScroll() {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateProgress);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

// ============================================
// 13. BACK TO TOP (Melhorado)
// ============================================

function initBackToTop() {
  const { backToTop } = DOM_CACHE;
  if (!backToTop) return;

  let isVisible = false;

  function toggleBackToTop(show) {
    if (show === isVisible) return;

    isVisible = show;
    if (show) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", () => {
    toggleBackToTop(window.pageYOffset > 300);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ============================================
// 14. NEWSLETTER (Simples)
// ============================================

function initNewsletter() {
  const { newsletterBtn, newsletterEmail } = DOM_CACHE;
  if (!newsletterBtn || !newsletterEmail) return;

  newsletterBtn.addEventListener("click", () => {
    const email = newsletterEmail.value.trim();

    if (!email) {
      showNotification("Por favor, insira seu email", "warning");
      newsletterEmail.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Email inválido", "error");
      newsletterEmail.focus();
      return;
    }

    // Simular inscrição
    const originalText = newsletterBtn.innerHTML;
    newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    newsletterBtn.disabled = true;

    setTimeout(() => {
      showNotification("Inscrição realizada com sucesso! Obrigado!", "success");
      newsletterEmail.value = "";
      newsletterBtn.innerHTML = originalText;
      newsletterBtn.disabled = false;
    }, 1500);
  });

  newsletterEmail.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      newsletterBtn.click();
    }
  });
}

// ============================================
// 15. SISTEMA DE NOTIFICAÇÕES
// ============================================

function createNotificationContainer() {
  const container = document.createElement("div");
  container.id = "notificationContainer";
  container.className = "notification-container";
  document.body.appendChild(container);
  return container;
}

function showNotification(message, type = "info", duration = 5000) {
  if (!CONFIG.enableNotifications) return;

  const { notificationContainer } = DOM_CACHE;
  if (!notificationContainer) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // Ícones por tipo
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  notification.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${message}</span>
    <button class="close-notification" aria-label="Fechar">
      <i class="fas fa-times"></i>
    </button>
  `;

  notificationContainer.appendChild(notification);

  // Animar entrada
  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  // Botão de fechar
  notification
    .querySelector(".close-notification")
    .addEventListener("click", () => {
      removeNotification(notification);
    });

  // Auto-remover
  const autoRemove = setTimeout(() => {
    if (notification.parentNode) {
      removeNotification(notification);
    }
  }, duration);

  // Pausar timeout ao passar mouse
  notification.addEventListener("mouseenter", () => {
    clearTimeout(autoRemove);
  });

  notification.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (notification.parentNode) {
        removeNotification(notification);
      }
    }, duration);
  });
}

function removeNotification(notification) {
  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 300);
}

// ============================================
// 16. SERVICE WORKER (Otimizado)
// ============================================

function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const swUrl = "/sw.js";

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        if (CONFIG.debugMode) {
          console.log(
            " Service Worker registrado com sucesso:",
            registration.scope
          );
        }

        // Verificar atualizações
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error(" Service Worker falhou:", error);
      });
  });
}

function showUpdateNotification() {
  if (!CONFIG.enableNotifications) return;

  showNotification("Nova versão disponível! Clique para atualizar.", "warning");

  // Adicionar listener para atualizar ao clicar
  const lastNotification = document.querySelector(
    ".notification.warning:last-child"
  );
  if (lastNotification) {
    lastNotification.style.cursor = "pointer";
    lastNotification.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

// ============================================
// 17. OTIMIZAÇÕES DE PERFORMANCE
// ============================================

function initPerformanceOptimizations() {
  // Lazy loading otimizado
  if ("IntersectionObserver" in window) {
    const lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = "1";
            lazyObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      }
    );

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.style.opacity = "0";
      img.style.transition = "opacity 0.3s ease";
      lazyObserver.observe(img);
    });
  }

  // Debounce helper
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Otimizar eventos de scroll
  const optimizations = debounce(() => {
    // Recalcular elementos visíveis se necessário
  }, 100);

  window.addEventListener("scroll", optimizations, { passive: true });
  window.addEventListener("resize", optimizations, { passive: true });
}

// ============================================
// 18. ANALYTICS (Opcional)
// ============================================

function setupAnalytics() {
  // Google Analytics (opcional)
  if (typeof gtag !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-XXXXXXXXXX"); // Substituir pelo seu ID
  }
}

// ============================================
// 19. UTILITÁRIOS
// ============================================

function formatPhoneNumber(phone) {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() =>
      showNotification("Copiado para área de transferência!", "success")
    )
    .catch(() => showNotification("Erro ao copiar", "error"));
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ============================================
// 20. EXPORT PARA USO GLOBAL
// ============================================

window.Portfolio = {
  showNotification,
  formatPhoneNumber,
  copyToClipboard,
  isValidEmail,
  CONFIG,
};

// ============================================
// 21. FINALIZAÇÃO
// ============================================

window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");

  if (CONFIG.debugMode) {
    console.log(" Portfólio carregado com sucesso!");
    console.log("📊 Configurações:", CONFIG);
  }
});

// ============================================
// FIM DO SCRIPT
// ============================================
