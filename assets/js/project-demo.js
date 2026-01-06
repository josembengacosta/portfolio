// Configuração do Projeto
        const PROJECT_CONFIG = {
            id: 1,
            type: 'fullstack',
            demoUrl: 'https://www.facebook.com/joaopedromiguelj',
            githubUrl: 'https://github.com/josembenga/ecommerce-platform',
            technologies: [
                { name: 'React.js', icon: 'fab fa-react', color: '#61DAFB' },
                { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
                { name: 'MongoDB', icon: 'fas fa-database', color: '#47A248' },
                { name: 'Express.js', icon: 'fas fa-server', color: '#000000' },
                { name: 'TypeScript', icon: 'fab fa-js', color: '#3178C6' },
                { name: 'Redux', icon: 'fas fa-code-branch', color: '#764ABC' },
                { name: 'Sass', icon: 'fab fa-sass', color: '#CC6699' },
                { name: 'Stripe', icon: 'fas fa-credit-card', color: '#008CDD' }
            ],
            galleryImages: [
                {
                    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    title: 'Dashboard Principal'
                },
                {
                    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    title: 'Página de Produtos'
                },
                {
                    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    title: 'Carrinho de Compras'
                },
                {
                    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    title: 'Processo de Checkout'
                }
            ],
            relatedProjects: [
                {
                    id: 2,
                    title: 'Analytics Dashboard',
                    category: 'dashboard',
                    description: 'Dashboard interativo para visualização de dados empresariais',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    link: '#',
                    rating: 4.7
                },
                {
                    id: 3,
                    title: 'Task Manager Pro',
                    category: 'web-app',
                    description: 'Sistema de gerenciamento de tarefas com equipes',
                    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    link: '#',
                    rating: 4.9
                },
                {
                    id: 4,
                    title: 'Fitness Tracker App',
                    category: 'mobile',
                    description: 'Aplicativo móvel para acompanhamento de exercícios',
                    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    link: '#',
                    rating: 4.8
                }
            ]
        };

        // 1. INICIALIZAÇÃO
        document.addEventListener('DOMContentLoaded', function () {
            console.log('Inicializando página de demo...');
            initThemeSystem();
            initProjectData();
            initRatingStars();
            initSkillsDisplay();
            initGallery();
            initContactForm();
            initRelatedProjects();
            initShareFunctionality();
            initAnimations();
            initDemoFrame(); // Carregar iframe por último
        });

        // 2. SISTEMA DE TEMA
        function initThemeSystem() {
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle.querySelector('i');

            // Verificar tema salvo
            const savedTheme = localStorage.getItem('jm-theme') || 'dark';
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                themeIcon.className = 'fas fa-sun';
            }

            // Alternar tema
            themeToggle.addEventListener('click', function () {
                const isLight = document.body.classList.toggle('light-theme');
                
                if (isLight) {
                    themeIcon.className = 'fas fa-sun';
                    localStorage.setItem('jm-theme', 'light');
                } else {
                    themeIcon.className = 'fas fa-moon';
                    localStorage.setItem('jm-theme', 'dark');
                }
            });
        }

        // 3. CARREGAR DADOS DO PROJETO
        function initProjectData() {
            const projectData = {
                title: "Plataforma de E-commerce Moderna",
                category: "E-commerce",
                description: "Plataforma completa de e-commerce com carrinho inteligente, checkout seguro, dashboard administrativo e sistema de recomendação baseado em IA.",
                fullDescription: "Esta plataforma de e-commerce foi desenvolvida para oferecer uma experiência de compra moderna e intuitiva. O sistema inclui funcionalidades avançadas como carrinho inteligente que salva itens entre sessões, checkout seguro com múltiplas opções de pagamento, dashboard administrativo completo e sistema de recomendação baseado em machine learning que aumenta as conversões em até 35%.",
                rating: 4.8,
                ratingCount: 128,
                commits: 248,
                commitActivity: "+12 esta semana",
                time: 6,
                timeline: "Out 15 - Nov 30",
                lines: "15.2K",
                client: "TechStore Inc.",
                delivery: "30 de Novembro, 2023",
                budget: "$5,000 - $7,000",
                status: "Concluído",
                pages: 24,
                components: 48,
                apis: 12,
                tests: 156
            };

            // Preencher dados
            document.getElementById('projectTitle').innerHTML = 
                `Plataforma de <span class="text-gradient">E-commerce</span> Moderna`;
            document.getElementById('projectCategory').textContent = projectData.category;
            document.getElementById('projectDescription').textContent = projectData.description;
            document.getElementById('projectFullDescription').textContent = projectData.fullDescription;
            document.getElementById('projectRating').textContent = projectData.rating;
            document.getElementById('ratingCount').textContent = projectData.ratingCount;
            document.getElementById('projectCommits').textContent = projectData.commits;
            document.getElementById('commitActivity').textContent = projectData.commitActivity;
            document.getElementById('projectTime').textContent = projectData.time;
            document.getElementById('projectTimeline').textContent = projectData.timeline;
            document.getElementById('projectLines').textContent = projectData.lines;
            document.getElementById('projectClient').textContent = projectData.client;
            document.getElementById('projectDelivery').textContent = projectData.delivery;
            document.getElementById('projectBudget').textContent = projectData.budget;
            document.getElementById('projectStatus').textContent = projectData.status;
            document.getElementById('pagesCount').textContent = projectData.pages;
            document.getElementById('componentsCount').textContent = projectData.components;
            document.getElementById('apiCount').textContent = projectData.apis;
            document.getElementById('testsCount').textContent = projectData.tests;
        }

        // 4. DEMO FRAME (IFRAME)
        function initDemoFrame() {
            const demoFrame = document.getElementById('demoFrame');
            const demoUrl = PROJECT_CONFIG.demoUrl;

            // Simular carregamento
            setTimeout(() => {
                try {
                    const iframe = document.createElement('iframe');
                    iframe.src = demoUrl;
                    iframe.title = "Live Demo - E-commerce Platform";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;
                    
                    demoFrame.innerHTML = '';
                    demoFrame.appendChild(iframe);

                    iframe.onerror = function() {
                        demoFrame.innerHTML = `
                            <div class="demo-placeholder">
                                <div class="text-center">
                                    <i class="fas fa-exclamation-triangle fa-2x mb-3 text-warning"></i>
                                    <p>Demo não disponível no momento</p>
                                    <button class="btn btn-outline btn-sm mt-2" onclick="initDemoFrame()">
                                        Tentar Novamente
                                    </button>
                                </div>
                            </div>
                        `;
                    };
                } catch (error) {
                    console.error('Erro ao carregar iframe:', error);
                }
            }, 1000);
        }

        // 5. ESTRELAS DE AVALIAÇÃO
        function initRatingStars() {
            const rating = 4.8;
            const starsContainer = document.getElementById('ratingStars');
            if (!starsContainer) return;

            starsContainer.innerHTML = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;

            // Adicionar estrelas cheias
            for (let i = 0; i < fullStars; i++) {
                const star = document.createElement('i');
                star.className = 'star filled fas fa-star';
                starsContainer.appendChild(star);
            }

            // Adicionar meia estrela se necessário
            if (hasHalfStar) {
                const star = document.createElement('i');
                star.className = 'star half-filled fas fa-star';
                starsContainer.appendChild(star);
            }

            // Adicionar estrelas vazias
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                const star = document.createElement('i');
                star.className = 'star far fa-star';
                starsContainer.appendChild(star);
            }
        }

        // 6. SKILLS/TECNOLOGIAS
        function initSkillsDisplay() {
            const skillsContainer = document.getElementById('technologiesList');
            if (!skillsContainer) return;

            skillsContainer.innerHTML = '';
            PROJECT_CONFIG.technologies.forEach(tech => {
                const skillTag = document.createElement('div');
                skillTag.className = 'skill-tag';
                skillTag.innerHTML = `
                    <i class="${tech.icon}" style="color: ${tech.color}"></i>
                    ${tech.name}
                `;
                skillsContainer.appendChild(skillTag);
            });
        }

        // 7. GALERIA DE IMAGENS
        function initGallery() {
            const galleryContainer = document.getElementById('projectGallery');
            if (!galleryContainer) return;

            galleryContainer.innerHTML = '';
            PROJECT_CONFIG.galleryImages.forEach((image, index) => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-3';

                const galleryItem = `
                    <div class="gallery-item">
                        <img src="${image.src}" alt="${image.title}" loading="lazy">
                        <div class="gallery-overlay">
                            <a href="${image.src}" data-lightbox="project-gallery" 
                               data-title="${image.title}" class="btn btn-primary btn-sm">
                                <i class="fas fa-expand"></i>
                            </a>
                        </div>
                    </div>
                `;

                col.innerHTML = galleryItem;
                galleryContainer.appendChild(col);
            });

            // Inicializar lightbox
            if (typeof lightbox !== 'undefined') {
                lightbox.option({
                    'resizeDuration': 200,
                    'wrapAround': true,
                    'albumLabel': 'Imagem %1 de %2'
                });
            }
        }

        // 8. FORMULÁRIO DE CONTATO
        function initContactForm() {
            const form = document.getElementById('projectInquiryForm');
            const submitBtn = document.getElementById('submitInquiry');
            
            if (!form || !submitBtn) return;

            // Validação em tempo real
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearValidation);
            });

            // Envio do formulário
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                if (!validateForm()) {
                    showNotification('Por favor, corrija os erros no formulário. <i class="fas fa-circle-exclamation"></i>', 'error');
                    return;
                }

                // Preparar dados
                const formData = {
                    name: document.getElementById('inquiryName').value,
                    email: document.getElementById('inquiryEmail').value,
                    company: document.getElementById('inquiryCompany').value || '',
                    phone: document.getElementById('inquiryPhone').value || '',
                    projectType: document.getElementById('inquiryProjectType').value,
                    budget: document.getElementById('inquiryBudget').value,
                    timeline: document.getElementById('inquiryTimeline').value,
                    description: document.getElementById('inquiryDescription').value,
                    features: {
                        design: document.getElementById('featureDesign').checked,
                        responsive: document.getElementById('featureResponsive').checked,
                        backend: document.getElementById('featureBackend').checked,
                        database: document.getElementById('featureDatabase').checked,
                        hosting: document.getElementById('featureHosting').checked,
                        maintenance: document.getElementById('featureMaintenance').checked
                    },
                    projectId: PROJECT_CONFIG.id,
                    timestamp: new Date().toISOString()
                };

                // Simular envio
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
                submitBtn.disabled = true;

                try {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    showNotification('Solicitação enviada com sucesso! Entrarei em contato em até 24 horas. <i class="fas fa-gift"></i>', 'success');
                    form.reset();
                    document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    showNotification('Erro ao enviar solicitação. Tente novamente ou entre em contato diretamente. <i class="fas fa-circle-exclamation"></i>', 'error');
                    console.error('Erro no formulário:', error);
                } finally {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Solicitação';
                    submitBtn.disabled = false;
                }
            });

            // Botão de download de assets
            const downloadBtn = document.getElementById('downloadAssets');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function() {
                    showNotification('Iniciando download dos assets do projeto... <i class="fas fa-download"></i>', 'info');
                    setTimeout(() => {
                        showNotification('Assets baixados com sucesso! <i class="fas fa-check"></i>', 'success');
                    }, 1500);
                });
            }
        }

        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            const errorElement = document.getElementById(field.id + 'Error') || 
                                field.parentNode.querySelector('.invalid-feedback');

            if (field.hasAttribute('required') && !value) {
                field.classList.add('is-invalid');
                if (errorElement) errorElement.style.display = 'block';
                return false;
            }

            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.classList.add('is-invalid');
                    if (errorElement) errorElement.style.display = 'block';
                    return false;
                }
            }

            field.classList.remove('is-invalid');
            if (errorElement) errorElement.style.display = 'none';
            return true;
        }

        function clearValidation(e) {
            const field = e.target;
            field.classList.remove('is-invalid');
            const errorElement = document.getElementById(field.id + 'Error') || 
                                field.parentNode.querySelector('.invalid-feedback');
            if (errorElement) errorElement.style.display = 'none';
        }

        function validateForm() {
            let isValid = true;
            const requiredFields = document.querySelectorAll('#projectInquiryForm [required]');

            requiredFields.forEach(field => {
                if (!validateField({ target: field })) {
                    isValid = false;
                    if (isValid === false) {
                        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        field.focus();
                        isValid = null;
                    }
                }
            });

            return isValid;
        }

        // 9. PROJETOS RELACIONADOS
        function initRelatedProjects() {
            const container = document.getElementById('relatedProjects');
            if (!container) return;

            container.innerHTML = '';
            PROJECT_CONFIG.relatedProjects.forEach(project => {
                const col = document.createElement('div');
                col.className = 'col-md-4';

                const projectCard = `
                    <div class="card border-0 h-100 demo-preview">
                        <div class="card-img-top" style="height: 200px; overflow: hidden;">
                            <img src="${project.image}" class="w-100 h-100 object-fit-cover" alt="${project.title}">
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-primary">${project.category}</span>
                                <div class="rating-container">
                                    <div class="stars">
                                        ${generateStarsHTML(project.rating)}
                                    </div>
                                    <small class="text-muted">${project.rating}</small>
                                </div>
                            </div>
                            <h5 class="card-title">${project.title}</h5>
                            <p class="card-text text-muted">${project.description}</p>
                            <a href="${project.link}" class="btn btn-outline btn-sm">
                                Ver Demo <i class="fas fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                `;

                col.innerHTML = projectCard;
                container.appendChild(col);
            });
        }

        function generateStarsHTML(rating) {
            let starsHTML = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;

            for (let i = 0; i < fullStars; i++) {
                starsHTML += '<i class="star filled fas fa-star" style="font-size: 0.875rem;"></i>';
            }

            if (hasHalfStar) {
                starsHTML += '<i class="star half-filled fas fa-star" style="font-size: 0.875rem;"></i>';
            }

            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                starsHTML += '<i class="star far fa-star" style="font-size: 0.875rem;"></i>';
            }

            return starsHTML;
        }

        // 10. COMPARTILHAMENTO
        function initShareFunctionality() {
            const shareBtn = document.getElementById('shareProject');
            if (!shareBtn) return;
            
            shareBtn.addEventListener('click', function() {
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        text: 'Confira este incrível projeto de e-commerce desenvolvido por José Mbenga!',
                        url: window.location.href
                    });
                } else {
                    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Confira este projeto incrível!')}&url=${encodeURIComponent(window.location.href)}`;
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                    showNotification('Link copiado para compartilhamento! <i class="fas fa-share-alt"></i>', 'success');
                }
            });
        }

        // 11. ANIMAÇÕES
        function initAnimations() {
            // Inicializar AOS
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 100,
                    delay: 100
                });
            }

            // Animar números
            const statNumbers = document.querySelectorAll('.stats-number');
            statNumbers.forEach(number => {
                const text = number.textContent;
                if (text.includes('K')) {
                    return;
                }
                
                const finalValue = parseInt(text);
                if (isNaN(finalValue)) return;
                
                let current = 0;
                const increment = finalValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalValue) {
                        number.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        number.textContent = Math.floor(current);
                    }
                }, 30);
            });
        }

        // 12. NOTIFICAÇÕES
        function showNotification(message, type = 'info') {
            // Remover notificações existentes
            document.querySelectorAll('.jm-notification').forEach(n => n.remove());

            const notification = document.createElement('div');
            notification.className = `jm-notification alert alert-${type} alert-dismissible fade show`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                max-width: 400px;
                box-shadow: var(--shadow-xl);
                border-radius: 0.75rem;
            `;

            let icon = 'fa-info-circle';
            switch (type) {
                case 'success': icon = 'fa-check-circle'; break;
                case 'error': icon = 'fa-exclamation-circle'; break;
                case 'warning': icon = 'fa-exclamation-triangle'; break;
            }

            notification.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas ${icon} me-3"></i>
                    <div class="flex-grow-1">${message}</div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;

            document.body.appendChild(notification);

            // Auto-remover após 5 segundos
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        }

        // Utilitários
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copiado para a área de transferência! <i class="fas fa-clipboard"></i>', 'success');
            });
        }

        // Exportar funções globais
        window.ProjectDemo = {
            reloadDemo: initDemoFrame,
            shareProject: initShareFunctionality,
            showNotification,
            PROJECT_CONFIG
        };