 // ============================================
        // INITIALIZATION
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize AOS
            AOS.init({
                duration: 600,
                once: true,
                offset: 100
            });

            // Initialize all features
            initThemeToggle();
            initBackButton();
            initProjects();
            initFilters();
            initSearch();
            initLoadMore();
            initToastSystem();
            
            // Initial render
            renderProjects();
        });

        // ============================================
        // PROJECTS DATA
        // ============================================
        const projectsData = [
            {
                id: 1,
                title: "Fintech Banking App",
                description: "Aplicativo bancário completo com transferências, pagamentos e investimentos. Design moderno com foco em segurança e UX.",
                category: "mobile",
                technologies: ["React Native", "Node.js", "MongoDB", "AWS", "Firebase"],
                date: "2023-10",
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=fintech",
                client: "Banco Digital Angola",
                featured: true
            },
            {
                id: 2,
                title: "E-commerce Fashion Platform",
                description: "Plataforma completa de e-commerce para moda com catálogo avançado, carrinho, checkout e dashboard administrativo.",
                category: "web",
                technologies: ["Vue.js", "Laravel", "MySQL", "Stripe", "Redis"],
                date: "2023-08",
                image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=fashion",
                client: "Moda & Estilo LTDA",
                featured: true
            },
            {
                id: 3,
                title: "HealthTech Dashboard",
                description: "Dashboard para gestão de clínicas médicas com agendamento, prontuários eletrônicos e telemedicina integrada.",
                category: "design",
                technologies: ["Figma", "React", "Chart.js", "Firebase", "WebSockets"],
                date: "2023-09",
                image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=healthtech",
                client: "Clínica Saúde Total",
                featured: false
            },
            {
                id: 4,
                title: "Educational Platform",
                description: "Plataforma de ensino online com cursos, quizzes, certificações automáticas e sistema de gamificação.",
                category: "web",
                technologies: ["React", "Express", "PostgreSQL", "AWS", "Docker"],
                date: "2023-07",
                image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=education",
                client: "EduTech Angola",
                featured: true
            },
            {
                id: 5,
                title: "Delivery App",
                description: "Aplicativo de delivery com tracking em tempo real, múltiplos restaurantes, pagamento online e sistema de avaliações.",
                category: "mobile",
                technologies: ["Flutter", "Node.js", "MongoDB", "Google Maps", "Stripe"],
                date: "2023-06",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=delivery",
                client: "FastDelivery Angola",
                featured: true
            },
            {
                id: 6,
                title: "Corporate Website Redesign",
                description: "Redesign completo do website corporativo com foco em conversão, performance e experiência do usuário.",
                category: "design",
                technologies: ["Figma", "Webflow", "GSAP", "SEO", "A/B Testing"],
                date: "2023-05",
                image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=corporate",
                client: "Tech Solutions SA",
                featured: false
            },
            {
                id: 7,
                title: "ERP System Migration",
                description: "Migração de sistema ERP legado para arquitetura moderna em microserviços com redução de custos em 40%.",
                category: "consulting",
                technologies: ["Node.js", "Docker", "Kubernetes", "AWS", "Terraform"],
                date: "2023-04",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: null,
                client: "Indústria Nacional",
                featured: true
            },
            {
                id: 8,
                title: "Real Estate Platform",
                description: "Plataforma imobiliária com busca avançada, tours virtuais 360°, agendamento de visitas e sistema de financiamento.",
                category: "web",
                technologies: ["Next.js", "Strapi", "PostgreSQL", "Mapbox", "Cloudinary"],
                date: "2023-03",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=realestate",
                client: "Imóveis Premium",
                featured: true
            },
            {
                id: 9,
                title: "Fitness Tracking App",
                description: "App de acompanhamento fitness com planos personalizados, progresso, comunidade e integração com wearables.",
                category: "mobile",
                technologies: ["React Native", "Firebase", "HealthKit", "Stripe", "GraphQL"],
                date: "2023-02",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=fitness",
                client: "FitLife Angola",
                featured: false
            },
            {
                id: 10,
                title: "Design System Pro",
                description: "Sistema de design completo com componentes reutilizáveis, tokens de design e documentação detalhada.",
                category: "design",
                technologies: ["Figma", "Storybook", "React", "TypeScript", "Jest"],
                date: "2023-01",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=designsystem",
                client: "Startup Tech",
                featured: true
            },
            // Adicionar mais 25 projetos para totalizar 35
            {
                id: 11,
                title: "Payment Gateway Integration",
                description: "Integração de gateway de pagamentos com múltiplos providers, antifraude e sistema de reconciliação.",
                category: "consulting",
                technologies: ["Node.js", "Redis", "PostgreSQL", "Docker", "RabbitMQ"],
                date: "2022-12",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: null,
                client: "Fintech Solutions",
                featured: false
            },
            {
                id: 12,
                title: "Travel Booking Platform",
                description: "Plataforma de reservas de viagens com hotéis, voos, pacotes turísticos e sistema de recomendações.",
                category: "web",
                technologies: ["React", "Node.js", "MongoDB", "AWS", "Elasticsearch"],
                date: "2022-11",
                image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=travel",
                client: "Viaje Fácil",
                featured: true
            },
            {
                id: 13,
                title: "Social Media App",
                description: "Aplicativo de rede social com feed, stories, mensagens, grupos e sistema de recomendações.",
                category: "mobile",
                technologies: ["Flutter", "Firebase", "WebRTC", "AWS", "Machine Learning"],
                date: "2022-10",
                image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=social",
                client: "Connect Angola",
                featured: false
            },
            {
                id: 14,
                title: "Brand Identity Redesign",
                description: "Redesign completo da identidade visual incluindo logo, cores, tipografia e sistema de iconografia.",
                category: "design",
                technologies: ["Illustrator", "Photoshop", "After Effects", "InDesign", "Lottie"],
                date: "2022-09",
                image: "https://images.unsplash.com/photo-1567446537710-0c5ff5a6ac32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: "project-demo.html?project=branding",
                client: "Nova Marca LTDA",
                featured: true
            },
            {
                id: 15,
                title: "Performance Optimization",
                description: "Otimização de performance de aplicação web crítica reduzindo load time em 70% e melhorando Core Web Vitals.",
                category: "consulting",
                technologies: ["Lighthouse", "Webpack", "Redis", "CDN", "Nginx"],
                date: "2022-08",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                liveDemo: null,
                client: "E-commerce Grande",
                featured: false
            },
            // Continuar com mais projetos até 35...
        ];

        // Adicionar mais projetos para chegar a 35
        for (let i = 16; i <= 35; i++) {
            const categories = ["web", "mobile", "design", "consulting"];
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            const techStacks = {
                web: ["React", "Vue.js", "Next.js", "Node.js", "MongoDB"],
                mobile: ["React Native", "Flutter", "Firebase", "GraphQL", "AWS"],
                design: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle"],
                consulting: ["Architecture", "DevOps", "Security", "Performance", "Migration"]
            };
            
            projectsData.push({
                id: i,
                title: `Projeto ${i} - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                description: `Descrição do projeto ${i} na categoria ${category} com tecnologias modernas e solução inovadora.`,
                category: category,
                technologies: techStacks[category].slice(0, 3),
                date: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
                image: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=${i}`,
                liveDemo: Math.random() > 0.3 ? "project-demo.html" : null,
                client: `Cliente ${i}`,
                featured: i % 3 === 0
            });
        }

        // ============================================
        // STATE MANAGEMENT
        // ============================================
        let currentFilter = 'all';
        let currentSearch = '';
        let currentPage = 1;
        const projectsPerPage = 8;
        let filteredProjects = [...projectsData];

        // ============================================
        // DOM ELEMENTS
        // ============================================
        const projectsGrid = document.getElementById('projectsGrid');
        const emptyState = document.getElementById('emptyState');
        const filterCount = document.getElementById('filterCount');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const loadMoreContainer = document.getElementById('loadMoreContainer');

        // ============================================
        // THEME TOGGLE
        // ============================================
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            const icon = themeToggle.querySelector('i');

            // Load saved theme
            const savedTheme = localStorage.getItem('jm-theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                icon.className = 'fas fa-sun';
            }

            // Toggle theme
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
                localStorage.setItem('jm-theme', isLight ? 'light' : 'dark');
            });
        }

        // ============================================
        // BACK BUTTON
        // ============================================
        function initBackButton() {
            document.getElementById('backButton').addEventListener('click', function() {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = 'index.html';
                }
            });
        }

        // ============================================
        // PROJECTS RENDERING
        // ============================================
        function renderProjects() {
            // Filter projects
            filterProjects();

            // Update count
            updateFilterCount();

            // Clear grid
            projectsGrid.innerHTML = '';

            // Calculate projects to show
            const startIndex = 0;
            const endIndex = currentPage * projectsPerPage;
            const projectsToShow = filteredProjects.slice(startIndex, endIndex);

            // Show/hide empty state
            if (filteredProjects.length === 0) {
                emptyState.classList.add('show');
                projectsGrid.style.display = 'none';
                loadMoreContainer.style.display = 'none';
                return;
            } else {
                emptyState.classList.remove('show');
                projectsGrid.style.display = 'grid';
            }

            // Render projects
            projectsToShow.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });

            // Show/hide load more
            if (endIndex >= filteredProjects.length) {
                loadMoreContainer.style.display = 'none';
            } else {
                loadMoreContainer.style.display = 'block';
            }

            // Re-initialize AOS for new elements
            AOS.refresh();
        }

        // ============================================
        // FILTER FUNCTIONS
        // ============================================
        function initFilters() {
            // Filter tags
            document.querySelectorAll('.filter-tag').forEach(tag => {
                tag.addEventListener('click', function() {
                    const filterType = this.dataset.filter ? 'category' : 'tech';
                    const filterValue = this.dataset.filter || this.dataset.tech;

                    // Update active state
                    if (filterType === 'category') {
                        document.querySelectorAll('[data-filter]').forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        currentFilter = filterValue;
                    } else {
                        // For tech tags, toggle active state
                        this.classList.toggle('active');
                        updateTechFilter();
                    }

                    currentPage = 1;
                    renderProjects();
                    showToast('Filtro atualizado', 'info');
                });
            });

            // Reset filters
            document.getElementById('resetFilters').addEventListener('click', resetFilters);
            document.getElementById('resetEmptyFilters').addEventListener('click', resetFilters);
        }

        function filterProjects() {
            filteredProjects = projectsData.filter(project => {
                // Category filter
                if (currentFilter !== 'all' && project.category !== currentFilter) return false;

                // Tech filter (check active tech tags)
                const activeTechTags = Array.from(document.querySelectorAll('[data-tech].active'))
                    .map(tag => tag.dataset.tech.toLowerCase());
                
                if (activeTechTags.length > 0) {
                    const projectTechs = project.technologies.map(t => t.toLowerCase());
                    const hasActiveTech = activeTechTags.some(tech => 
                        projectTechs.some(projectTech => projectTech.includes(tech))
                    );
                    if (!hasActiveTech) return false;
                }

                // Search filter
                if (currentSearch) {
                    const searchLower = currentSearch.toLowerCase();
                    const matchesTitle = project.title.toLowerCase().includes(searchLower);
                    const matchesDesc = project.description.toLowerCase().includes(searchLower);
                    const matchesTech = project.technologies.some(tech => 
                        tech.toLowerCase().includes(searchLower)
                    );
                    if (!matchesTitle && !matchesDesc && !matchesTech) return false;
                }

                return true;
            });
        }

        function updateTechFilter() {
            // This function is handled in filterProjects()
        }

        function resetFilters() {
            // Reset all filter tags
            document.querySelectorAll('.filter-tag').forEach(tag => {
                tag.classList.remove('active');
                if (tag.dataset.filter === 'all') {
                    tag.classList.add('active');
                }
            });

            // Reset search
            document.getElementById('searchInput').value = '';
            
            // Reset state
            currentFilter = 'all';
            currentSearch = '';
            currentPage = 1;

            // Re-render
            renderProjects();
            showToast('Filtros resetados', 'success');
        }

        function updateFilterCount() {
            const count = filteredProjects.length;
            filterCount.textContent = `${count} projeto${count !== 1 ? 's' : ''}`;
        }

        // ============================================
        // SEARCH FUNCTIONALITY
        // ============================================
        function initSearch() {
            const searchInput = document.getElementById('searchInput');
            let searchTimeout;

            searchInput.addEventListener('input', function(e) {
                clearTimeout(searchTimeout);
                
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value.trim();
                    currentPage = 1;
                    renderProjects();
                }, 300);
            });

            // Clear search on Escape
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    this.value = '';
                    currentSearch = '';
                    currentPage = 1;
                    renderProjects();
                }
            });
        }

        // ============================================
        // LOAD MORE FUNCTIONALITY
        // ============================================
        function initLoadMore() {
            loadMoreBtn.addEventListener('click', function() {
                currentPage++;
                renderProjects();
                
                // Smooth scroll to show new projects
                setTimeout(() => {
                    const newProjects = document.querySelectorAll('.project-card');
                    if (newProjects.length > 0) {
                        newProjects[newProjects.length - 1].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                }, 100);

                showToast(`Carregados mais ${projectsPerPage} projetos`, 'info');
            });
        }

        // ============================================
        // PROJECT CARD CREATION
        // ============================================
        function createProjectCard(project) {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.category = project.category;
            card.dataset.id = project.id;

            const categoryLabels = {
                'web': 'Web Development',
                'mobile': 'Mobile App',
                'design': 'UI/UX Design',
                'consulting': 'Tech Consulting'
            };

            const categoryIcons = {
                'web': 'fa-code',
                'mobile': 'fa-mobile-alt',
                'design': 'fa-paint-brush',
                'consulting': 'fa-brain'
            };

            const hasDemo = project.liveDemo !== null;

            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <span class="project-badge">
                        <i class="fas ${categoryIcons[project.category]}"></i>
                        ${categoryLabels[project.category]}
                    </span>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-tech">
                        ${project.technologies.map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                    
                    <div class="project-footer">
                        <span class="project-date">${formatDate(project.date)}</span>
                        <a href="${hasDemo ? project.liveDemo : '#'}" 
                           class="project-link ${!hasDemo ? 'disabled' : ''}" 
                           ${hasDemo ? '' : 'onclick="return false;"'}>
                            <i class="fas ${hasDemo ? 'fa-external-link-alt' : 'fa-eye-slash'}"></i>
                            ${hasDemo ? 'Ver Demo' : 'Sem Demo'}
                        </a>
                    </div>
                </div>
            `;

            return card;
        }

        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        function formatDate(dateString) {
            const [year, month] = dateString.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        }

        // ============================================
        // TOAST SYSTEM
        // ============================================
        function initToastSystem() {
            // Container is already in HTML
        }

        function showToast(message, type = 'info') {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            const icons = {
                success: 'fa-check-circle',
                info: 'fa-info-circle',
                warning: 'fa-exclamation-triangle',
                error: 'fa-exclamation-circle'
            };

            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas ${icons[type] || icons.info}"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close">&times;</button>
            `;

            toastContainer.appendChild(toast);

            // Show toast
            setTimeout(() => toast.classList.add('show'), 10);

            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 4000);

            // Close button
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            });
        }

        // ============================================
        // INITIALIZE PROJECTS
        // ============================================
        function initProjects() {
            renderProjects();
        }