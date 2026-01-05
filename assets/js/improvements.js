// ============================================
// IMPROVEMENTS JS - PORTFÓLIO JOSÉ MBENGA
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // 1. INITIALIZE ALL IMPROVEMENTS
    // ============================================
    
    initTypingAnimation();
    initParticles();
    initTestimonialsSlider();
    initTimelineAnimation();
    initFloatingTechStack();
    
    // ============================================
    // 2. TYPING ANIMATION FOR HERO
    // ============================================
    
    function initTypingAnimation() {
        const typingElement = document.querySelector('.typing');
        if (!typingElement) return;
        
        const words = JSON.parse(typingElement.getAttribute('data-words') || '[]');
        if (words.length === 0) return;
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isEnd = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Deleting chars
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Typing chars
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Typing speed
            let typeSpeed = 100;
            
            if (isDeleting) {
                typeSpeed /= 2; // Faster when deleting
            }
            
            // If word is complete
            if (!isDeleting && charIndex === currentWord.length) {
                isEnd = true;
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex++;
                if (wordIndex === words.length) {
                    wordIndex = 0;
                }
            } else if (isEnd) {
                typeSpeed = 500; // Pause before deleting
                isEnd = false;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        // Start typing animation
        setTimeout(type, 500);
    }
    
    // ============================================
    // 2. PARTICLES.JS INITIALIZATION
    // ============================================
    
    function initParticles() {
        if (typeof particlesJS === 'undefined') {
            console.warn('Particles.js não carregado. Carregando via CDN...');
            loadParticlesJS();
            return;
        }
        
        // Hero particles
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#2563eb"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#8b5cf6",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
        
        // Testimonials particles (simpler)
        particlesJS('testimonials-particles', {
            particles: {
                number: {
                    value: 30,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#10b981"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.1,
                    random: true
                },
                size: {
                    value: 2,
                    random: true
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
    
    function loadParticlesJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = initParticles;
        document.head.appendChild(script);
    }
    
    // ============================================
    // 3. TESTIMONIALS SLIDER
    // ============================================
    
    function initTestimonialsSlider() {
        const track = document.querySelector('.testimonial-track');
        const cards = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const dots = document.querySelectorAll('.testimonial-dot');
        
        if (!track || cards.length === 0) return;
        
        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // 2rem em pixels
        
        function updateSlider() {
            const translateX = -(currentIndex * (cardWidth + gap));
            track.style.transform = `translateX(${translateX}px)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Update button states
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= cards.length - getVisibleCards();
        }
        
        function getVisibleCards() {
            if (window.innerWidth >= 992) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < cards.length - getVisibleCards()) {
                    currentIndex++;
                    updateSlider();
                }
            });
        }
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });
        }
        
        // Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });
        
        // Auto slide
        let autoSlideInterval = setInterval(() => {
            if (currentIndex >= cards.length - getVisibleCards()) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSlider();
        }, 5000);
        
        // Pause on hover
        track.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        track.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(() => {
                if (currentIndex >= cards.length - getVisibleCards()) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updateSlider();
            }, 5000);
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            updateSlider();
        });
        
        // Initialize
        updateSlider();
    }
    
    // ============================================
    // 4. TIMELINE ANIMATION
    // ============================================
    
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (timelineItems.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // ============================================
    // 5. FLOATING TECH STACK INTERACTION
    // ============================================
    
    function initFloatingTechStack() {
        const techItems = document.querySelectorAll('.tech-item');
        
        techItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Add pulse animation
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = 'float 6s ease-in-out infinite';
                }, 10);
            });
            
            // Click to show more info
            item.addEventListener('click', function () {
                const tech = this.querySelector('span').textContent;
                const messages = {
                    'React': 'Biblioteca JavaScript para interfaces de usuário',
                    'Vue.js': 'Framework progressivo para construção de UIs',
                    'Node.js': 'JavaScript runtime para backend',
                    'JavaScript': 'Linguagem de programação principal'
                };
                
                if (window.Portfolio && window.Portfolio.showNotification) {
                    window.Portfolio.showNotification(`${tech}: ${messages[tech] || 'Tecnologia dominada'}`, 'info');
                }
            });
        });
    }
    
    // ============================================
    // 6. CTA SECTION ANIMATION
    // ============================================
    
    function initCTASection() {
        const ctaSection = document.querySelector('.cta-section');
        if (!ctaSection) return;
        
        // Animate stats on scroll
        const stats = ctaSection.querySelectorAll('.cta-stat .number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(stat => {
                        // Add counting animation if needed
                        stat.style.animation = 'pulse 1s ease';
                        setTimeout(() => {
                            stat.style.animation = '';
                        }, 1000);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(ctaSection);
    }
    
    // Initialize CTA animations
    initCTASection();
    
    // ============================================
    // 7. LAZY LOADING FOR TESTIMONIAL IMAGES
    // ============================================
    
    function lazyLoadTestimonialImages() {
        const images = document.querySelectorAll('.testimonial-author img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    lazyLoadTestimonialImages();
    
    // ============================================
    // 8. EXPORT FUNCTIONS FOR GLOBAL USE
    // ============================================
    
    window.PortfolioImprovements = {
        initTypingAnimation,
        initParticles,
        initTestimonialsSlider,
        initTimelineAnimation,
        initFloatingTechStack
    };
});

// Handle page transitions
document.addEventListener('page:load', function () {
    if (window.PortfolioImprovements) {
        window.PortfolioImprovements.initTypingAnimation();
        window.PortfolioImprovements.initTestimonialsSlider();
    }
});

// Re-initialize on window resize
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        if (window.PortfolioImprovements) {
            window.PortfolioImprovements.initTestimonialsSlider();
        }
    }, 250);
});

// Adicione esta função ao seu improvements.js
function initResponsiveHero() {
    // Ajustar número de partículas baseado na tela
    if (typeof particlesJS !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
        
        // Atualizar configuração de partículas
        if (window.pJSDom && window.pJSDom.length > 0) {
            const pJS = window.pJSDom[0].pJS;
            
            if (isMobile) {
                pJS.particles.number.value = 30;
                pJS.particles.size.value = 2;
            } else if (isTablet) {
                pJS.particles.number.value = 45;
                pJS.particles.size.value = 2.5;
            } else {
                pJS.particles.number.value = 60;
                pJS.particles.size.value = 3;
            }
            
            pJS.fn.particlesRefresh();
        }
    }
    
    // Ajustar velocidade da animação de typing em mobile
    const typingElement = document.querySelector('.typing');
    if (typingElement && window.innerWidth < 768) {
        // Armazenar configuração original
        if (!typingElement.dataset.originalWords) {
            typingElement.dataset.originalWords = typingElement.getAttribute('data-words');
        }
    }
}

// Chamar na inicialização
document.addEventListener('DOMContentLoaded', function() {
    initResponsiveHero();
    
    // Recalcular em redimensionamento
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initResponsiveHero();
        }, 250);
    });
});