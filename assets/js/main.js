  // ============================================
        // PORTFÓLIO JOSÉ MBENGA 
        // ============================================

        // Configurações globais
        const CONFIG = {
            whatsappNumber: '244922030116',
            email: 'josembengadacosta@gmail.com',
            github: 'https://github.com/josembengacosta',
            linkedin: 'https://linkedin.com/in/josembengadacosta',
            projects: {
                perPage: 6,
                categories: ['all', 'web', 'mobile', 'fullstack']
            }
        };

        // ============================================
        // 1. INICIALIZAÇÃO
        // ============================================

        document.addEventListener('DOMContentLoaded', function () {
            // Inicializar todas as funcionalidades
            initLoadingScreen();
            initThemeSystem();
            initNavigation();
            initHeroAnimations();
            initSkillsAnimation();
            initProjectsFilter();
            initContactForm();
            initWhatsAppFloat();
            initScrollProgress();
            initBackToTop();
            initNotifications();
            initNewsletter();
            initPerformanceOptimizations();
            initPWASystem();

            // Inicializar AOS (Animate On Scroll)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 100
                });
            }

            // Mostrar notificação de boas-vindas
            setTimeout(() => {
                showNotification('Bem-vindo ao meu portfólio! <i class="fas fa-hand fs-4 text-gradient"></i> ', 'info');
            }, 2000);
        });

        // ============================================
        // 2. LOADING SCREEN
        // ============================================

        function initLoadingScreen() {
            const loading = document.getElementById('loading');
            if (!loading) return;

            // Simular loading
            setTimeout(() => {
                loading.classList.add('hidden');
                document.body.classList.add('loaded');
            }, 1000);
        }

        // ============================================
        // 3. SISTEMA DE TEMA (DARK/LIGHT)
        // ============================================

        function initThemeSystem() {
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle?.querySelector('i');

            if (!themeToggle || !themeIcon) return;

            // Detectar preferência do sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            const savedTheme = localStorage.getItem('theme');

            // Aplicar tema salvo ou detectar do sistema
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                themeIcon.className = 'fas fa-sun';
            } else if (savedTheme === 'dark') {
                document.body.classList.remove('light-theme');
                themeIcon.className = 'fas fa-moon';
            } else if (prefersDark.matches) {
                document.body.classList.remove('light-theme');
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.add('light-theme');
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'light');
            }

            // Alternar tema
            themeToggle.addEventListener('click', function () {
                const isLightTheme = document.body.classList.toggle('light-theme');

                if (isLightTheme) {
                    themeIcon.className = 'fas fa-sun';
                    localStorage.setItem('theme', 'light');
                    showNotification('Tema claro ativado <i class="fas fa-sun"></i> ', 'success');
                } else {
                    themeIcon.className = 'fas fa-moon';
                    localStorage.setItem('theme', 'dark');
                    showNotification('Tema escuro ativado <i class="fas fa-moon"></i>', 'success');
                }
            });

            // Observar mudanças no sistema
            prefersDark.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        document.body.classList.remove('light-theme');
                        themeIcon.className = 'fas fa-moon';
                    } else {
                        document.body.classList.add('light-theme');
                        themeIcon.className = 'fas fa-sun';
                    }
                }
            });
        }

        // ============================================
        // 4. NAVEGAÇÃO E MENU MOBILE
        // ============================================

        function initNavigation() {
            const mobileToggle = document.getElementById('mobileToggle');
            const closeCanvas = document.getElementById('closeCanvas');
            const offcanvas = document.getElementById('offcanvas');
            const navLinks = document.querySelectorAll('.nav-link, .offcanvas-link');
            const header = document.getElementById('header');

            // Menu Mobile Toggle
            if (mobileToggle) {
                mobileToggle.addEventListener('click', function () {
                    this.classList.toggle('active');
                    offcanvas.classList.toggle('active');
                    document.body.style.overflow = offcanvas.classList.contains('active') ? 'hidden' : '';
                });
            }

            // Fechar Menu
            if (closeCanvas) {
                closeCanvas.addEventListener('click', function () {
                    mobileToggle?.classList.remove('active');
                    offcanvas.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            // Fechar menu ao clicar em link
            navLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    // Fechar menu mobile se aberto
                    if (offcanvas.classList.contains('active')) {
                        mobileToggle?.classList.remove('active');
                        offcanvas.classList.remove('active');
                        document.body.style.overflow = '';
                    }

                    // Atualizar link ativo
                    if (this.hash && !this.classList.contains('btn')) {
                        e.preventDefault();
                        const target = document.querySelector(this.hash);
                        if (target) {
                            window.scrollTo({
                                top: target.offsetTop - 80,
                                behavior: 'smooth'
                            });

                            // Atualizar navegação ativa
                            updateActiveNav(this.hash);
                        }
                    }
                });
            });

            // Header scroll effect
            window.addEventListener('scroll', function () {
                if (window.scrollY > 100) {
                    header?.classList.add('scrolled');
                } else {
                    header?.classList.remove('scrolled');
                }
            });

            // Atualizar navegação ativa no scroll
            window.addEventListener('scroll', updateActiveNavOnScroll);
        }

        function updateActiveNav(hash) {
            document.querySelectorAll('.nav-link, .offcanvas-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active');
                }
            });
        }

        function updateActiveNavOnScroll() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    updateActiveNav('#' + sectionId);
                }
            });
        }

        // ============================================
        // 5. ANIMAÇÕES DO HERO
        // ============================================

        function initHeroAnimations() {
            // Animar contadores
            const counters = document.querySelectorAll('[data-count]');

            function animateCounters() {
                counters.forEach(counter => {
                    const rect = counter.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

                    if (isVisible && !counter.classList.contains('animated')) {
                        const target = parseInt(counter.getAttribute('data-count'));
                        const duration = 2000;
                        const increment = target / (duration / 16);
                        let current = 0;

                        const updateCounter = () => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target;
                                counter.classList.add('animated');
                            } else {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            }
                        };

                        updateCounter();
                    }
                });
            }

            // Observador de interseção para os contadores
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                    }
                });
            }, {
                threshold: 0.5
            });

            counters.forEach(counter => observer.observe(counter));
        }

        // ============================================
        // 6. ANIMAÇÃO DE SKILLS
        // ============================================

        function initSkillsAnimation() {
            const skillBars = document.querySelectorAll('.skill-progress');

            function animateSkillBars() {
                skillBars.forEach(bar => {
                    const rect = bar.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

                    if (isVisible && !bar.classList.contains('animated')) {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                        bar.classList.add('animated');
                    }
                });
            }

            // Observador de interseção para as barras de skill
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                    }
                });
            }, {
                threshold: 0.3
            });

            skillBars.forEach(bar => observer.observe(bar.parentElement.parentElement));
        }

        // ============================================
        // 7. FILTRO DE PROJETOS
        // ============================================

        function initProjectsFilter() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');

            if (filterBtns.length === 0) return;

            filterBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    // Remove active de todos os botões
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // Adiciona active ao botão clicado
                    this.classList.add('active');

                    const filterValue = this.getAttribute('data-filter');

                    // Filtra projetos
                    projectCards.forEach(card => {
                        const category = card.getAttribute('data-category');

                        if (filterValue === 'all' || category === filterValue) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 10);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }

        // ============================================
        // 8. FORMULÁRIO DE CONTATO
        // ============================================

        function initContactForm() {
            const contactForm = document.getElementById('contactForm');
            if (!contactForm) return;

            // Elementos do formulário
            const formInputs = {
                name: contactForm.querySelector('#name'),
                email: contactForm.querySelector('#email'),
                phone: contactForm.querySelector('#phone'),
                subject: contactForm.querySelector('#subject'),
                message: contactForm.querySelector('#message')
            };

            // Validação em tempo real
            Object.values(formInputs).forEach(input => {
                if (input) {
                    input.addEventListener('blur', validateField);
                    input.addEventListener('input', clearFieldError);
                }
            });

            // Validação de campo específico
            function validateField(e) {
                const field = e.target;
                const value = field.value.trim();
                const fieldName = field.id;

                let isValid = true;
                let message = '';

                switch (fieldName) {
                    case 'name':
                        if (value === '') return;
                        isValid = value.length >= 3;
                        message = 'Nome precisa ter pelo menos 3 caracteres';
                        break;
                    case 'email':
                        if (value === '') return;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        isValid = emailRegex.test(value);
                        message = 'Por favor, insira um email válido';
                        break;
                    case 'phone':
                        if (value === '') return;
                        const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
                        isValid = phoneRegex.test(value);
                        message = 'Formato inválido. Use (XX) XXXXX-XXXX';
                        break;
                    case 'subject':
                        isValid = value !== '';
                        message = 'Por favor, selecione um assunto';
                        break;
                    case 'message':
                        if (value === '') return;
                        isValid = value.length >= 10;
                        message = 'Mensagem muito curta (mínimo 10 caracteres)';
                        break;
                }

                if (!isValid) {
                    showFieldError(field, message);
                } else {
                    clearFieldError(field);
                }
            }

            // Mostrar erro no campo
            function showFieldError(field, message) {
                field.classList.add('error');
                field.classList.remove('success');

                // Criar ou atualizar mensagem de erro
                let errorElement = field.parentNode.querySelector('.error-message');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    field.parentNode.appendChild(errorElement);
                }

                errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                errorElement.classList.add('show');
            }

            // Limpar erro do campo
            function clearFieldError(field) {
                field.classList.remove('error');
                const errorElement = field.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            }

            // Envio do formulário
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Validar todos os campos
                let isValid = true;
                const errors = [];

                if (!formInputs.name.value.trim() || formInputs.name.value.trim().length < 3) {
                    showFieldError(formInputs.name, 'Nome precisa ter pelo menos 3 caracteres');
                    isValid = false;
                    errors.push('name');
                }

                if (!formInputs.email.value.trim()) {
                    showFieldError(formInputs.email, 'Email é obrigatório');
                    isValid = false;
                    errors.push('email');
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(formInputs.email.value.trim())) {
                        showFieldError(formInputs.email, 'Email inválido');
                        isValid = false;
                        errors.push('email');
                    }
                }

                if (!formInputs.subject.value) {
                    showFieldError(formInputs.subject, 'Assunto é obrigatório');
                    isValid = false;
                    errors.push('subject');
                }

                if (!formInputs.message.value.trim() || formInputs.message.value.trim().length < 10) {
                    showFieldError(formInputs.message, 'Mensagem precisa ter pelo menos 10 caracteres');
                    isValid = false;
                    errors.push('message');
                }

                if (!isValid) {
                    showNotification('Por favor, corrija os erros no formulário <i class="fas fa-x"></i>', 'error');

                    // Scroll para primeiro erro
                    if (errors.length > 0) {
                        const firstErrorField = formInputs[errors[0]];
                        if (firstErrorField) {
                            firstErrorField.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                            firstErrorField.focus();
                        }
                    }

                    return;
                }

                // Preparar dados do formulário
                const formData = {
                    name: formInputs.name.value.trim(),
                    email: formInputs.email.value.trim(),
                    phone: formInputs.phone?.value.trim() || '',
                    subject: formInputs.subject.value,
                    message: formInputs.message.value.trim(),
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };

                // Simular envio (substituir por API real)
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;

                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;

                try {
                    // Simular chamada API
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // Sucesso
                    showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve. <i class="fas fa-check"></i>',
                        'success');

                    // Resetar formulário
                    contactForm.reset();
                    Object.values(formInputs).forEach(input => {
                        if (input) clearFieldError(input);
                    });

                    // Log para desenvolvimento (remover em produção)
                    console.log('Dados do formulário:', formData);

                } catch (error) {
                    showNotification(
                        'Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente por email. <i class="fas fa-x"></i>',
                        'error');
                    console.error('Erro no formulário:', error);
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });

            // Download de CV
            const downloadCV = document.querySelector('a[download]');
            if (downloadCV) {
                downloadCV.addEventListener('click', function (e) {
                    e.preventDefault();

                    showNotification('Iniciando download do currículo...<i class="fas fa-file"></i>', 'info');

                    // Simular download
                    setTimeout(() => {
                        // Em produção, este seria o link real do PDF
                        const link = document.createElement('a');
                        link.href = '../../descarregar/descarregar_jmbenga.pdf'; // Arquivo fictício
                        link.download = '../../descarregar/descarregar_jmbenga.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        showNotification('Currículo baixado com sucesso! <i class="fas fa-file"></i>', 'success');
                    }, 1000);
                });
            }
        }

        // ============================================
        // 9. WHATSAPP FLUTUANTE
        // ============================================

        function initWhatsAppFloat() {
            const whatsappFloat = document.getElementById('whatsappFloat');
            if (!whatsappFloat) return;

            // Mostrar após 3 segundos
            setTimeout(() => {
                whatsappFloat.classList.add('show');
            }, 3000);

            // Esconder ao rolar para baixo
            let lastScroll = 0;
            window.addEventListener('scroll', function () {
                const currentScroll = window.pageYOffset;

                if (currentScroll > lastScroll && currentScroll > 300) {
                    whatsappFloat.classList.remove('show');
                } else if (currentScroll < lastScroll) {
                    whatsappFloat.classList.add('show');
                }

                lastScroll = currentScroll;
            });

            // Botão de fechar
            const closeBtn = whatsappFloat.querySelector('.close-whatsapp');
            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    whatsappFloat.classList.remove('show');
                    showNotification('WhatsApp minimizado. Clique no ícone para abrir novamente.', 'info');
                });
            }
        }

        // ============================================
        // 10. SCROLL PROGRESS
        // ============================================

        function initScrollProgress() {
            const scrollProgress = document.getElementById('scrollProgress');
            if (!scrollProgress) return;

            window.addEventListener('scroll', function () {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;

                scrollProgress.style.width = scrolled + '%';
            });
        }

        // ============================================
        // 11. BACK TO TOP
        // ============================================

        function initBackToTop() {
            const backToTop = document.getElementById('backToTop');
            if (!backToTop) return;

            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });

            backToTop.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // ============================================
        // 12. SISTEMA DE NOTIFICAÇÕES
        // ============================================

        function initNotifications() {
            const notificationContainer = document.getElementById('notificationContainer');

            // Criar container se não existir
            if (!notificationContainer) {
                const container = document.createElement('div');
                container.id = 'notificationContainer';
                container.className = 'notification-container';
                document.body.appendChild(container);
            }
        }

        function showNotification(message, type = 'info') {
            const container = document.getElementById('notificationContainer') ||
                document.querySelector('.notification-container');

            if (!container) {
                console.log(`[${type.toUpperCase()}] ${message}`);
                return;
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;

            // Ícone baseado no tipo
            let icon = 'fa-info-circle';
            switch (type) {
                case 'success':
                    icon = 'fa-check-circle';
                    break;
                case 'error':
                    icon = 'fa-exclamation-circle';
                    break;
                case 'warning':
                    icon = 'fa-exclamation-triangle';
                    break;
                case 'info':
                    icon = 'fa-info-circle';
                    break;
            }

            notification.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${message}</span>
                <button class="close-notification" aria-label="Fechar">
                    <i class="fas fa-times"></i>
                </button>
            `;

            container.appendChild(notification);

            // Animar entrada
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });

            // Botão de fechar
            const closeBtn = notification.querySelector('.close-notification');
            closeBtn.addEventListener('click', () => {
                removeNotification(notification);
            });

            // Auto-remover após 5 segundos
            setTimeout(() => {
                if (notification.parentNode) {
                    removeNotification(notification);
                }
            }, 5000);
        }

        function removeNotification(notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }

        // ============================================
        // 13. NEWSLETTER
        // ============================================

        function initNewsletter() {
            const newsletterBtn = document.getElementById('newsletterBtn');
            const newsletterEmail = document.getElementById('newsletterEmail');

            if (!newsletterBtn || !newsletterEmail) return;

            newsletterBtn.addEventListener('click', function () {
                const email = newsletterEmail.value.trim();

                if (!email) {
                    showNotification('Por favor, insira seu email', 'warning');
                    newsletterEmail.focus();
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Email inválido', 'error');
                    newsletterEmail.focus();
                    return;
                }

                // Simular inscrição
                newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                newsletterBtn.disabled = true;

                setTimeout(() => {
                    showNotification('Inscrição realizada com sucesso! Obrigado! <i class="fas fa-user"></i>', 'success');
                    newsletterEmail.value = '';
                    newsletterBtn.innerHTML = 'Inscrever';
                    newsletterBtn.disabled = false;
                }, 1500);
            });

            // Permitir Enter para enviar
            newsletterEmail.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    newsletterBtn.click();
                }
            });
        }


        // ============================================
        // 15. OTIMIZAÇÕES DE PERFORMANCE
        // ============================================

        function initPerformanceOptimizations() {
            // Lazy loading para imagens
            if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img[loading="lazy"]');

                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.style.opacity = '1';
                            imageObserver.unobserve(img);
                        }
                    });
                });

                lazyImages.forEach(img => {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    imageObserver.observe(img);
                });
            }

            // Debounce para eventos de scroll
            function debounce(func, wait = 100) {
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
            const optimizableEvents = ['scroll', 'resize'];
            optimizableEvents.forEach(event => {
                window.addEventListener(event, debounce(() => {
                    // Recalcular elementos visíveis
                }, 50));
            });
        }

        // ============================================
        // 16. SERVICE WORKER (PWA)
        // ============================================

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('../../sw.js').then(
                    function (registration) {
                        console.log('ServiceWorker registration successful');
                    },
                    function (err) {
                        console.log('ServiceWorker registration failed: ', err);
                    }
                );
            });
        }

        // ============================================
        // 17. FUNÇÕES UTILITÁRIAS
        // ============================================

        // Formatar telefone
        function formatPhoneNumber(phone) {
            const cleaned = ('' + phone).replace(/\D/g, '');
            const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
            if (match) {
                return '(' + match[1] + ') ' + match[2] + '-' + match[3];
            }
            return phone;
        }

        // Copiar email para clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copiado para a área de transferência!', 'success');
            }).catch(err => {
                showNotification('Erro ao copiar texto', 'error');
            });
        }

        // Validar email
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // ============================================
// 18. SISTEMA PWA PREMIUM (adicionar ao main.js)
// ============================================

function initPWASystem() {
    // Verificar se já instalado
    const isPWAInstalled = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    };
    
    // Se já instalado, adicionar classe
    if (isPWAInstalled()) {
        document.body.classList.add('pwa-installed');
        console.log('PWA detectado como instalado');
    }
    
    // Verificar Service Worker
    if ('serviceWorker' in navigator) {
        // Registrar SW
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado:', registration.scope);
                
                // Verificar atualizações
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('Nova versão disponível!');
                                showUpdateNotification();
                            }
                        }
                    };
                };
            })
            .catch(err => console.error('SW erro:', err));
    }
    
    // Mostrar notificação de atualização
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>Nova versão disponível!</span>
                <button onclick="location.reload()" class="btn-update">
                    Atualizar
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Estilos inline
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        `;
        
        const updateContent = notification.querySelector('.update-content');
        updateContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
        `;
        
        const btnUpdate = notification.querySelector('.btn-update');
        btnUpdate.style.cssText = `
            background: white;
            color: #d97706;
            border: none;
            padding: 6px 15px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        `;
        
        btnUpdate.addEventListener('mouseenter', () => {
            btnUpdate.style.transform = 'translateY(-2px)';
        });
        
        btnUpdate.addEventListener('mouseleave', () => {
            btnUpdate.style.transform = 'translateY(0)';
        });
    }
}

        // ============================================
        // EXPORT PARA USO GLOBAL (se necessário)
        // ============================================

        window.Portfolio = {
            showNotification,
            formatPhoneNumber,
            copyToClipboard,
            isValidEmail,
            CONFIG
        };

        // ============================================
        // INICIALIZAR QUANDO A PÁGINA CARREGAR
        // ============================================

        window.addEventListener('load', function () {
            // Verificar se todos os scripts carregaram
            console.log('Portfólio José Mbenga carregado com sucesso!');

            // Adicionar classe loaded para CSS
            document.body.classList.add('page-loaded');

            // Inicializar analytics se configurado
            if (typeof gtag !== 'undefined') {
                // Inicializar Google Analytics
            }
        });

        // ============================================
        // FIM DO SCRIPT PRINCIPAL
        // ============================================