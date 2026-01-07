// ============================================
// IMPROVEMENTS JS - PORTFÓLIO JOSÉ MBENGA (OTIMIZADO)
// ============================================

// Configurações de performance
const IMPROVEMENTS_CONFIG = {
  typingSpeed: {
    normal: 100,
    deleting: 50,
    pauseEnd: 2000,
    pauseBeforeDelete: 500,
  },
  particles: {
    mobile: { number: 30, size: 2 },
    tablet: { number: 45, size: 2.5 },
    desktop: { number: 60, size: 3 },
  },
  slider: {
    autoSlideInterval: 5000,
    resizeDebounce: 250,
  },
  debug: false,
};

// Cache de elementos
let IMPROVEMENTS_CACHE = {};

// ============================================
// 1. INICIALIZAÇÃO PRINCIPAL
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // Carregar apenas após o DOM estar pronto
  setTimeout(() => {
    cacheImprovementsElements();
    initAllImprovements();
    setupResizeHandlers();

    if (IMPROVEMENTS_CONFIG.debug) {
      console.log(" Improvements.js carregado com sucesso");
    }
  }, 100);
});

function cacheImprovementsElements() {
  IMPROVEMENTS_CACHE = {
    // Typing
    typingElement: document.querySelector(".typing"),

    // Particles
    particlesContainer: document.getElementById("particles-js"),
    testimonialsParticles: document.getElementById("testimonials-particles"),

    // Slider
    sliderTrack: document.querySelector(".testimonial-track"),
    sliderCards: document.querySelectorAll(".testimonial-card"),
    sliderPrev: document.querySelector(".testimonial-prev"),
    sliderNext: document.querySelector(".testimonial-next"),
    sliderDots: document.querySelectorAll(".testimonial-dot"),

    // Timeline
    timelineItems: document.querySelectorAll(".timeline-item"),

    // Tech Stack
    techItems: document.querySelectorAll(".tech-item"),

    // CTA
    ctaSection: document.querySelector(".cta-section"),

    // Lazy Images
    lazyImages: document.querySelectorAll(".testimonial-author img[data-src]"),
  };
}

function initAllImprovements() {
  // Inicializar em ordem de prioridade
  initTypingAnimation();
  initParticles();
  initTestimonialsSlider();
  initTimelineAnimation();
  initFloatingTechStack();
  initCTASection();
  initLazyLoading();
  initResponsiveHero();
}

// ============================================
// 2. ANIMAÇÃO DE TYPING (OTIMIZADA)
// ============================================

function initTypingAnimation() {
  const { typingElement } = IMPROVEMENTS_CACHE;
  if (!typingElement) return;

  const wordsJSON = typingElement.getAttribute("data-words");
  if (!wordsJSON) return;

  let words;
  try {
    words = JSON.parse(wordsJSON);
  } catch (e) {
    console.error("Erro ao parsear palavras do typing:", e);
    return;
  }

  if (!Array.isArray(words) || words.length === 0) return;

  let animationState = {
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    isEnd: false,
    timeoutId: null,
  };

  function type() {
    const currentWord = words[animationState.wordIndex];

    // Update text content
    if (animationState.isDeleting) {
      typingElement.textContent = currentWord.substring(
        0,
        animationState.charIndex - 1
      );
      animationState.charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(
        0,
        animationState.charIndex + 1
      );
      animationState.charIndex++;
    }

    // Calculate speed
    let speed = IMPROVEMENTS_CONFIG.typingSpeed.normal;

    if (animationState.isDeleting) {
      speed = IMPROVEMENTS_CONFIG.typingSpeed.deleting;
    }

    // Handle word completion
    if (
      !animationState.isDeleting &&
      animationState.charIndex === currentWord.length
    ) {
      animationState.isEnd = true;
      speed = IMPROVEMENTS_CONFIG.typingSpeed.pauseEnd;
      animationState.isDeleting = true;
    } else if (animationState.isDeleting && animationState.charIndex === 0) {
      animationState.isDeleting = false;
      animationState.wordIndex = (animationState.wordIndex + 1) % words.length;
    } else if (animationState.isEnd) {
      speed = IMPROVEMENTS_CONFIG.typingSpeed.pauseBeforeDelete;
      animationState.isEnd = false;
    }

    // Schedule next frame
    animationState.timeoutId = setTimeout(type, speed);
  }

  // Start animation with delay
  animationState.timeoutId = setTimeout(type, 500);

  // Cleanup function
  function cleanupTyping() {
    if (animationState.timeoutId) {
      clearTimeout(animationState.timeoutId);
    }
  }

  // Pause on tab visibility change
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      cleanupTyping();
    } else {
      animationState.timeoutId = setTimeout(type, 100);
    }
  });

  // Expose cleanup
  window._typingCleanup = cleanupTyping;
}

// ============================================
// 3. PARTICLES.JS (CARREGAMENTO OTIMIZADO)
// ============================================

function initParticles() {
  const { particlesContainer, testimonialsParticles } = IMPROVEMENTS_CACHE;

  // Only load particles if containers exist and screen is not too small
  if (
    (!particlesContainer && !testimonialsParticles) ||
    window.innerWidth < 480
  ) {
    return;
  }

  // Load particles.js if not already loaded
  if (typeof particlesJS === "undefined") {
    loadParticlesJS();
  } else {
    setupParticles();
  }
}

function loadParticlesJS() {
  // Only load if user has good connection and not on mobile data saver
  const connection = navigator.connection;
  if (
    connection &&
    (connection.saveData === true || connection.effectiveType === "slow-2g")
  ) {
    console.log("📱 Skipping particles.js due to slow connection");
    return;
  }

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
  script.async = true;
  script.onload = setupParticles;
  script.onerror = () => {
    console.warn("❌ Failed to load particles.js");
    // Fallback: add CSS effects
    addParticlesFallback();
  };
  document.head.appendChild(script);
}

function setupParticles() {
  if (typeof particlesJS === "undefined") return;

  // Hero particles with responsive settings
  const particlesConfig = getParticlesConfig();

  if (IMPROVEMENTS_CACHE.particlesContainer) {
    particlesJS("particles-js", particlesConfig.hero);
  }

  if (IMPROVEMENTS_CACHE.testimonialsParticles) {
    particlesJS("testimonials-particles", particlesConfig.testimonials);
  }

  // Store reference for responsive updates
  if (!window._particlesInstances) {
    window._particlesInstances = [];
  }
}

function getParticlesConfig() {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;

  const baseNumber = isMobile
    ? IMPROVEMENTS_CONFIG.particles.mobile.number
    : isTablet
    ? IMPROVEMENTS_CONFIG.particles.tablet.number
    : IMPROVEMENTS_CONFIG.particles.desktop.number;

  const baseSize = isMobile
    ? IMPROVEMENTS_CONFIG.particles.mobile.size
    : isTablet
    ? IMPROVEMENTS_CONFIG.particles.tablet.size
    : IMPROVEMENTS_CONFIG.particles.desktop.size;

  return {
    hero: {
      particles: {
        number: {
          value: baseNumber,
          density: { enable: true, value_area: 800 },
        },
        color: { value: "#2563eb" },
        shape: { type: "circle" },
        opacity: {
          value: 0.3,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1 },
        },
        size: {
          value: baseSize,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1 },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#8b5cf6",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: isMobile ? 1 : 2,
          direction: "none",
          random: true,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: !isMobile, mode: "repulse" },
          onclick: { enable: !isMobile, mode: "push" },
          resize: true,
        },
        modes: {
          repulse: { distance: isMobile ? 50 : 100, duration: 0.4 },
          push: { particles_nb: isMobile ? 2 : 4 },
        },
      },
      retina_detect: true,
    },
    testimonials: {
      particles: {
        number: {
          value: Math.floor(baseNumber / 2),
          density: { enable: true, value_area: 800 },
        },
        color: { value: "#10b981" },
        shape: { type: "circle" },
        opacity: { value: 0.1, random: true },
        size: { value: Math.max(1, baseSize - 1), random: true },
        line_linked: { enable: false },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          random: true,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false },
          onclick: { enable: false },
          resize: true,
        },
      },
      retina_detect: true,
    },
  };
}

function addParticlesFallback() {
  // Add CSS fallback for particles
  const style = document.createElement("style");
  style.textContent = `
        .particles-fallback::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 70%),
                       radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
            animation: float 20s infinite ease-in-out;
        }
        
        .testimonials-section::before {
            background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
        }
    `;
  document.head.appendChild(style);

  // Apply fallback classes
  if (IMPROVEMENTS_CACHE.particlesContainer) {
    IMPROVEMENTS_CACHE.particlesContainer.classList.add("particles-fallback");
  }
}

// ============================================
// 4. SLIDER DE TESTEMUNHOS (OTIMIZADO)
// ============================================

function initTestimonialsSlider() {
  const { sliderTrack, sliderCards, sliderPrev, sliderNext, sliderDots } =
    IMPROVEMENTS_CACHE;

  if (!sliderTrack || sliderCards.length === 0) return;

  const sliderState = {
    currentIndex: 0,
    isAnimating: false,
    autoSlideInterval: null,
    cardWidth: sliderCards[0].offsetWidth,
    gap: 32, // 2rem
  };

  function getVisibleCards() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateSlider(animate = true) {
    if (sliderState.isAnimating) return;

    sliderState.isAnimating = true;
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, sliderCards.length - visibleCards);
    sliderState.currentIndex = Math.min(sliderState.currentIndex, maxIndex);

    const translateX = -(
      sliderState.currentIndex *
      (sliderState.cardWidth + sliderState.gap)
    );

    if (animate) {
      sliderTrack.style.transition =
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      requestAnimationFrame(() => {
        sliderTrack.style.transform = `translateX(${translateX}px)`;
      });
    } else {
      sliderTrack.style.transition = "none";
      sliderTrack.style.transform = `translateX(${translateX}px)`;
    }

    // Update dots
    if (sliderDots.length > 0) {
      sliderDots.forEach((dot, index) => {
        dot.classList.toggle("active", index === sliderState.currentIndex);
      });
    }

    // Update button states
    if (sliderPrev) {
      sliderPrev.disabled = sliderState.currentIndex === 0;
      sliderPrev.style.opacity = sliderState.currentIndex === 0 ? "0.5" : "1";
    }

    if (sliderNext) {
      sliderNext.disabled = sliderState.currentIndex >= maxIndex;
      sliderNext.style.opacity =
        sliderState.currentIndex >= maxIndex ? "0.5" : "1";
    }

    // Reset animation flag
    setTimeout(() => {
      sliderState.isAnimating = false;
    }, 300);
  }

  // Next button
  if (sliderNext) {
    sliderNext.addEventListener("click", () => {
      const visibleCards = getVisibleCards();
      if (sliderState.currentIndex < sliderCards.length - visibleCards) {
        sliderState.currentIndex++;
        updateSlider();
      }
    });
  }

  // Previous button
  if (sliderPrev) {
    sliderPrev.addEventListener("click", () => {
      if (sliderState.currentIndex > 0) {
        sliderState.currentIndex--;
        updateSlider();
      }
    });
  }

  // Dots navigation
  if (sliderDots.length > 0) {
    sliderDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        sliderState.currentIndex = index;
        updateSlider();
      });
    });
  }

  // Auto slide
  function startAutoSlide() {
    if (sliderState.autoSlideInterval) {
      clearInterval(sliderState.autoSlideInterval);
    }

    sliderState.autoSlideInterval = setInterval(() => {
      const visibleCards = getVisibleCards();
      if (sliderState.currentIndex >= sliderCards.length - visibleCards) {
        sliderState.currentIndex = 0;
      } else {
        sliderState.currentIndex++;
      }
      updateSlider();
    }, IMPROVEMENTS_CONFIG.slider.autoSlideInterval);
  }

  function stopAutoSlide() {
    if (sliderState.autoSlideInterval) {
      clearInterval(sliderState.autoSlideInterval);
      sliderState.autoSlideInterval = null;
    }
  }

  // Pause on hover
  sliderTrack.addEventListener("mouseenter", stopAutoSlide);
  sliderTrack.addEventListener("touchstart", stopAutoSlide);

  sliderTrack.addEventListener("mouseleave", startAutoSlide);
  sliderTrack.addEventListener("touchend", startAutoSlide);

  // Initialize
  updateSlider(false);
  startAutoSlide();

  // Handle resize
  function handleResize() {
    sliderState.cardWidth = sliderCards[0].offsetWidth;
    updateSlider(false);
  }

  // Store for cleanup
  window._sliderResizeHandler = handleResize;
  window._sliderCleanup = stopAutoSlide;
}

// ============================================
// 5. ANIMAÇÃO DA TIMELINE (OTIMIZADA)
// ============================================

function initTimelineAnimation() {
  const { timelineItems } = IMPROVEMENTS_CACHE;
  if (timelineItems.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Add stagger effect
          const index = Array.from(timelineItems).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  timelineItems.forEach((item) => {
    observer.observe(item);
  });
}

// ============================================
// 6. TECH STACK INTERATIVO
// ============================================

function initFloatingTechStack() {
  const { techItems } = IMPROVEMENTS_CACHE;
  if (techItems.length === 0) return;

  const techInfo = {
    React:
      "Biblioteca JavaScript para interfaces de usuário. Experiência em React Hooks, Context API e Redux.",
    "Vue.js":
      "Framework progressivo para construção de UIs. Domínio em Vue 3 Composition API e Vuex.",
    "Node.js":
      "JavaScript runtime para backend. Experiência em Express.js, APIs REST e autenticação JWT.",
    JavaScript:
      "Linguagem de programação principal. Domínio em ES6+, async/await, Promises e Web APIs.",
    HTML5:
      "Estrutura semântica e APIs modernas. SEO otimizado e acessibilidade.",
    CSS3: "Estilização avançada com Flexbox, Grid, animações CSS e design responsivo.",
    PHP: "Backend com Laravel. APIs RESTful, MySQL e arquitetura MVC.",
    MySQL:
      "Banco de dados relacional. Otimização de queries, índices e procedures.",
    Git: "Controle de versão. Git Flow, branches, pull requests e CI/CD.",
  };

  techItems.forEach((item) => {
    // Add hover effects
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.05)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });

    // Click for info
    item.addEventListener("click", function () {
      const techName = this.querySelector("span").textContent.trim();
      const info =
        techInfo[techName] ||
        `Tecnologia: ${techName}. Habilidade dominada com experiência prática em projetos reais.`;

      // Show notification if available
      if (window.Portfolio && window.Portfolio.showNotification) {
        window.Portfolio.showNotification(
          `<strong>${techName}</strong>: ${info}`,
          "info",
          4000
        );
      } else {
        // Fallback: show in console
        console.log(`${techName}: ${info}`);
      }

      // Add visual feedback
      this.style.animation = "pulse 0.5s ease";
      setTimeout(() => {
        this.style.animation = "";
      }, 500);
    });

    // Touch feedback for mobile
    item.addEventListener("touchstart", function () {
      this.style.transform = "translateY(-5px) scale(1.03)";
    });

    item.addEventListener("touchend", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// ============================================
// 7. ANIMAÇÃO DA CTA SECTION
// ============================================

function initCTASection() {
  const { ctaSection } = IMPROVEMENTS_CACHE;
  if (!ctaSection) return;

  // Animate stats when visible
  const stats = ctaSection.querySelectorAll(".cta-stat");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stats.forEach((stat, index) => {
            // Add stagger animation
            setTimeout(() => {
              stat.style.animation = "pulse 1s ease";
              setTimeout(() => {
                stat.style.animation = "";
              }, 1000);
            }, index * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(ctaSection);
}

// ============================================
// 8. LAZY LOADING OTIMIZADO
// ============================================

function initLazyLoading() {
  const { lazyImages } = IMPROVEMENTS_CACHE;
  if (lazyImages.length === 0) return;

  // Use native lazy loading if supported
  if ("loading" in HTMLImageElement.prototype) {
    lazyImages.forEach((img) => {
      img.loading = "lazy";
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      }
    });
    return;
  }

  // Fallback to IntersectionObserver
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);

          // Add fade-in effect
          img.style.opacity = "0";
          img.style.transition = "opacity 0.3s ease";
          requestAnimationFrame(() => {
            img.style.opacity = "1";
          });
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.1,
    }
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
}

// ============================================
// 9. RESPONSIVE HERO AJUSTMENTS
// ============================================

function initResponsiveHero() {
  // Ajustar partículas baseado no tamanho da tela
  if (
    typeof particlesJS !== "undefined" &&
    window.pJSDom &&
    window.pJSDom.length > 0
  ) {
    updateParticlesResponsive();
  }

  // Ajustar velocidade de typing para mobile
  const { typingElement } = IMPROVEMENTS_CACHE;
  if (typingElement && window.innerWidth < 768) {
    // Store original config
    if (!typingElement.dataset.originalSpeed) {
      typingElement.dataset.originalSpeed = JSON.stringify(
        IMPROVEMENTS_CONFIG.typingSpeed
      );

      // Speed up for mobile
      IMPROVEMENTS_CONFIG.typingSpeed.normal = 80;
      IMPROVEMENTS_CONFIG.typingSpeed.deleting = 40;

      // Restart typing animation with new speed
      if (window._typingCleanup) {
        window._typingCleanup();
        setTimeout(initTypingAnimation, 100);
      }
    }
  }
}

function updateParticlesResponsive() {
  if (!window.pJSDom || !window.pJSDom[0]) return;

  const pJS = window.pJSDom[0].pJS;
  const config = getParticlesConfig().hero;

  pJS.particles.number.value = config.particles.number.value;
  pJS.particles.size.value = config.particles.size.value;
  pJS.particles.move.speed = config.particles.move.speed;
  pJS.interactivity.events.onhover.enable =
    config.interactivity.events.onhover.enable;
  pJS.interactivity.events.onclick.enable =
    config.interactivity.events.onclick.enable;

  pJS.fn.particlesRefresh();
}

// ============================================
// 10. RESIZE HANDLERS OTIMIZADOS
// ============================================

function setupResizeHandlers() {
  let resizeTimeout;

  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Update slider
      if (window._sliderResizeHandler) {
        window._sliderResizeHandler();
      }

      // Update particles
      if (typeof particlesJS !== "undefined") {
        updateParticlesResponsive();
      }

      // Update hero responsive settings
      initResponsiveHero();

      if (IMPROVEMENTS_CONFIG.debug) {
        console.log("🔄 Resize handled");
      }
    }, IMPROVEMENTS_CONFIG.slider.resizeDebounce);
  }

  // Debounced resize
  window.addEventListener("resize", handleResize, { passive: true });

  // Handle orientation change
  window.addEventListener("orientationchange", function () {
    setTimeout(handleResize, 100);
  });
}

// ============================================
// 11. CLEANUP FUNCTIONS
// ============================================

function cleanupImprovements() {
  // Cleanup typing animation
  if (window._typingCleanup) {
    window._typingCleanup();
  }

  // Cleanup slider
  if (window._sliderCleanup) {
    window._sliderCleanup();
  }

  // Cleanup particles if they exist
  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom.forEach((instance) => {
      if (instance.pJS && instance.pJS.fn) {
        instance.pJS.fn.vendors.destroypJS();
      }
    });
    window.pJSDom = [];
  }

  if (IMPROVEMENTS_CONFIG.debug) {
    console.log("🧹 Improvements cleanup completed");
  }
}

// ============================================
// 12. EXPORT FUNCTIONS
// ============================================

window.PortfolioImprovements = {
  initTypingAnimation,
  initParticles,
  initTestimonialsSlider,
  initTimelineAnimation,
  initFloatingTechStack,
  initResponsiveHero,
  cleanupImprovements,
  IMPROVEMENTS_CONFIG,
};

// ============================================
// 13. PWA OPTIMIZATIONS
// ============================================

// Detect PWA mode and adjust settings
if (
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone
) {
  // Reduce animations in PWA for better battery life
  IMPROVEMENTS_CONFIG.typingSpeed.normal = 120;
  IMPROVEMENTS_CONFIG.slider.autoSlideInterval = 7000;

  // Reduce particles for PWA
  IMPROVEMENTS_CONFIG.particles.mobile.number = 20;
  IMPROVEMENTS_CONFIG.particles.tablet.number = 30;
  IMPROVEMENTS_CONFIG.particles.desktop.number = 45;

  // Disable some interactive features on low-end devices
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // Reduce interactivity on mobile PWA
    if (typeof particlesJS !== "undefined") {
      setTimeout(() => {
        if (window.pJSDom && window.pJSDom[0]) {
          window.pJSDom[0].pJS.interactivity.events.onhover.enable = false;
          window.pJSDom[0].pJS.interactivity.events.onclick.enable = false;
        }
      }, 1000);
    }
  }
}

// ============================================
// 14. PERFORMANCE MONITORING (DEBUG ONLY)
// ============================================

if (IMPROVEMENTS_CONFIG.debug) {
  // Monitor FPS
  let frameCount = 0;
  let lastTime = performance.now();

  function monitorFPS() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      if (fps < 50) {
        console.warn(` Low FPS detected: ${fps}`);
      }
      frameCount = 0;
      lastTime = currentTime;
    }
    requestAnimationFrame(monitorFPS);
  }

  // Start monitoring after page load
  setTimeout(monitorFPS, 3000);
}

// ============================================
// 15. ERROR HANDLING
// ============================================

window.addEventListener("error", function (e) {
  if (IMPROVEMENTS_CONFIG.debug) {
    console.error("❌ Improvements.js error:", e.error);
  }
});

// Graceful degradation for older browsers
if (!("IntersectionObserver" in window)) {
  console.warn("IntersectionObserver not supported - using fallbacks");

  // Fallback for timeline
  setTimeout(() => {
    const { timelineItems } = IMPROVEMENTS_CACHE;
    if (timelineItems.length > 0) {
      timelineItems.forEach((item) => {
        item.classList.add("visible");
      });
    }
  }, 500);
}

// ============================================
// FIM DO SCRIPT
// ============================================
