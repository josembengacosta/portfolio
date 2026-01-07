// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Sample Reviews Data
const reviewsData = [{
        id: 1,
        name: "Carlos Ribeiro",
        avatar: "CR",
        rating: 5,
        service: "web",
        title: "Excelente Desenvolvimento Web",
        content: "Contratei o José para desenvolver nosso e-commerce e fiquei impressionado com a qualidade do trabalho. O site é rápido, responsivo e as vendas aumentaram 40% após o lançamento. Comunicação excelente durante todo o projeto.",
        date: "2023-10-15",
        verified: true,
        project: "E-commerce Fashion",
        company: "Moda & Estilo LTDA",
        helpful: 12,
        featured: true,
        response: {
            content: "Obrigado, Carlos! Foi um prazer trabalhar no seu projeto. A dedicação da sua equipe foi fundamental para o sucesso.",
            date: "2023-10-16"
        }
    },
    {
        id: 2,
        name: "Ana Miguel",
        avatar: "AM",
        rating: 5,
        service: "mobile",
        title: "App Fintech Excepcional",
        content: "Como não-tech founder, estava apreensiva. O José não só desenvolveu um app incrível como me guiou em todas as decisões técnicas. Nosso app bancário tem avaliação 4.9 na App Store.",
        date: "2023-09-22",
        verified: true,
        project: "Fintech Banking App",
        company: "Banco Digital Angola",
        helpful: 8,
        featured: false
    },
    {
        id: 3,
        name: "Luís Santos",
        avatar: "LS",
        rating: 4,
        service: "design",
        title: "Redesign que Transformou",
        content: "O redesign do nosso dashboard fez toda diferença. A equipe agora é muito mais produtiva. O único ponto: poderia ter sido um pouco mais rápido nas entregas, mas a qualidade compensou.",
        date: "2023-08-30",
        verified: true,
        project: "HealthTech Dashboard",
        company: "Clínica Saúde Total",
        helpful: 5,
        featured: false
    },
    {
        id: 4,
        name: "Maria Fernandes",
        avatar: "MF",
        rating: 5,
        service: "consulting",
        title: "Consultoria que Salvou Nosso Projeto",
        content: "Estávamos perdidos com uma arquitetura complexa. A consultoria do José identificou os problemas e forneceu um plano claro. Economizamos meses de trabalho.",
        date: "2023-08-15",
        verified: true,
        project: "Sistema ERP",
        company: "Indústria Nacional",
        helpful: 10,
        featured: true
    },
    {
        id: 5,
        name: "Visitante Anônimo",
        avatar: "VA",
        rating: 5,
        service: "maintenance",
        title: "Suporte Rápido e Eficiente",
        content: "Contrato manutenção mensal há 6 meses. Nunca tive problemas sérios, mas quando precisei de suporte, foi resolvido em minutos. Vale cada centavo.",
        date: "2023-07-28",
        verified: false,
        helpful: 3,
        featured: false
    },
    {
        id: 6,
        name: "Pedro Costa",
        avatar: "PC",
        rating: 5,
        service: "web",
        title: "Site Corporativo Moderno",
        content: "Nosso site antigo estava ultrapassado. O José criou um site moderno, otimizado para SEO, e nossos leads aumentaram 60% em 3 meses.",
        date: "2023-07-10",
        verified: true,
        project: "Website Corporativo",
        company: "Tech Solutions SA",
        helpful: 7,
        featured: false,
        response: {
            content: "Obrigado pelo feedback, Pedro! A estratégia de conteúdo que implementamos junto com o design foi crucial para os resultados.",
            date: "2023-07-11"
        }
    },
    {
        id: 7,
        name: "Isabel Santos",
        avatar: "IS",
        rating: 4,
        service: "mobile",
        title: "App de Delivery Excelente",
        content: "O app funciona perfeitamente, os entregadores adoram a interface. Pequenos detalhes poderiam ser melhorados, mas no geral, excelente trabalho.",
        date: "2023-06-25",
        verified: true,
        project: "Delivery App",
        company: "FastDelivery Angola",
        helpful: 4,
        featured: false
    },
    {
        id: 8,
        name: "António Silva",
        avatar: "AS",
        rating: 5,
        service: "design",
        title: "Design System Perfeito",
        content: "O Design System que o José criou para nossa startup foi fundamental. Nossa equipe de desenvolvimento acelerou em 3x. Documentação impecável.",
        date: "2023-06-10",
        verified: true,
        project: "Design System Pro",
        company: "Startup Tech",
        helpful: 9,
        featured: true
    },
    {
        id: 9,
        name: "Cliente Satisfeito",
        avatar: "CS",
        rating: 5,
        service: "consulting",
        title: "Migração Cloud sem Traumas",
        content: "Migrar para cloud parecia assustador. O José planejou e executou tudo perfeitamente. Custos reduziram 40% e performance melhorou 70%.",
        date: "2023-05-30",
        verified: true,
        helpful: 6,
        featured: false
    },
    {
        id: 10,
        name: "Rui Mendes",
        avatar: "RM",
        rating: 3,
        service: "web",
        title: "Bom trabalho, mas poderia ser mais rápido",
        content: "A qualidade do código é excelente, mas o prazo se estendeu duas vezes. O resultado final é bom, mas o processo poderia ser mais eficiente.",
        date: "2023-05-15",
        verified: true,
        project: "Portal de Notícias",
        company: "Jornal Digital",
        helpful: 2,
        featured: false,
        response: {
            content: "Obrigado pelo feedback construtivo, Rui. Realmente enfrentamos desafios técnicos inesperados que atrasaram o projeto. Trabalhamos para melhorar nossos processos de estimativa.",
            date: "2023-05-16"
        }
    },
    {
        id: 11,
        name: "Sofia Pereira",
        avatar: "SP",
        rating: 5,
        service: "mobile",
        title: "App de Fitness Incrível",
        content: "O app que desenvolvemos juntos está com reviews excelentes. A integração com wearables funciona perfeitamente. Superou expectativas.",
        date: "2023-04-20",
        verified: true,
        project: "Fitness Tracking App",
        company: "FitLife Angola",
        helpful: 5,
        featured: false
    },
    {
        id: 12,
        name: "Visitante do Site",
        avatar: "VS",
        rating: 5,
        service: "design",
        title: "Portfólio Inspirador",
        content: "Visitei o portfólio e fiquei impressionado com a qualidade dos projetos. Decidi deixar uma avaliação mesmo sem ser cliente. Trabalho excelente!",
        date: "2023-04-10",
        verified: false,
        helpful: 1,
        featured: false
    },
    {
        id: 13,
        name: "Miguel Costa",
        avatar: "MC",
        rating: 4,
        service: "consulting",
        title: "Code Review Valioso",
        content: "A análise do nosso código identificou vulnerabilidades que não conhecíamos. Recomendo para qualquer equipe que queira melhorar qualidade.",
        date: "2023-03-28",
        verified: true,
        helpful: 4,
        featured: false
    },
    {
        id: 14,
        name: "Beatriz Lima",
        avatar: "BL",
        rating: 5,
        service: "web",
        title: "Plataforma de Cursos Perfeita",
        content: "Nossa plataforma de ensino online funciona perfeitamente. Os alunos adoram a interface e os recursos. Suporte excelente pós-lançamento.",
        date: "2023-03-15",
        verified: true,
        project: "Educational Platform",
        company: "EduTech Angola",
        helpful: 8,
        featured: true
    },
    {
        id: 15,
        name: "Hélder Martins",
        avatar: "HM",
        rating: 5,
        service: "maintenance",
        title: "Paz de Espírito Garantida",
        content: "Com a manutenção mensal, não preciso me preocupar com o site. Tudo é monitorado e resolvido rapidamente. Serviço essencial.",
        date: "2023-02-28",
        verified: true,
        helpful: 3,
        featured: false
    }
];

// Variables
let currentService = 'all';
let currentSort = 'recent';
let currentPage = 1;
const reviewsPerPage = 6;
let filteredReviews = [...reviewsData];
let helpfulVotes = new Set();
let reportedReviews = new Set();

// DOM Elements
const reviewsGrid = document.getElementById('reviewsGrid');
const emptyState = document.getElementById('emptyState');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Carregar dados do usuário
    loadUserData();
    
    // Inicializar componentes
    renderReviews();
    setupEventListeners();
    setupThemeToggle();
    setupWhatsAppFloat();
    setupBackToTop();
    setupProgressBar();
    setupReviewForm();
    setupFAQ();
    setupModal();
    
    // Notificação inicial
    setTimeout(() => {
        showNotification(
            'Dê sua opinião! Sua avaliação ajuda a melhorar os serviços.',
            'info',
            3000
        );
    }, 2000);
});

// ============================================
// FUNÇÕES DE REVIEWS
// ============================================

function renderReviews() {
    // Filtrar reviews
    filteredReviews = reviewsData.filter(review => {
        if (currentService !== 'all' && review.service !== currentService) return false;
        return true;
    });

    // Ordenar reviews
    sortReviews();

    // Mostrar/ocultar estado vazio
    if (filteredReviews.length === 0) {
        emptyState.style.display = 'block';
        reviewsGrid.style.display = 'none';
        loadMoreContainer.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        reviewsGrid.style.display = 'grid';
    }

    // Calcular reviews para mostrar
    const startIndex = 0;
    const endIndex = currentPage * reviewsPerPage;
    const reviewsToShow = filteredReviews.slice(startIndex, endIndex);

    // Limpar container
    reviewsGrid.innerHTML = '';

    // Renderizar reviews
    reviewsToShow.forEach(review => {
        reviewsGrid.appendChild(createReviewCard(review));
    });

    // Mostrar/ocultar botão carregar mais
    if (endIndex >= filteredReviews.length) {
        loadMoreContainer.style.display = 'none';
    } else {
        loadMoreContainer.style.display = 'block';
    }
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = `review-card ${review.featured ? 'featured' : ''}`;
    card.dataset.id = review.id;
    card.dataset.service = review.service;
    card.dataset.rating = review.rating;

    // Service labels
    const serviceLabels = {
        'web': 'Desenvolvimento Web',
        'mobile': 'Aplicativo Mobile',
        'design': 'UI/UX Design',
        'consulting': 'Consultoria Tech',
        'maintenance': 'Manutenção',
        'other': 'Outro Serviço'
    };

    // Format date
    const formattedDate = new Date(review.date).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Generate stars
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    // Verificar se o usuário já votou
    const hasVoted = helpfulVotes.has(review.id);
    const voteText = hasVoted ? 'Você achou útil' : 'Útil';

    card.innerHTML = `
        ${review.featured ? '<span class="featured-badge">Destaque</span>' : ''}
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">${review.avatar}</div>
                <div class="reviewer-details">
                    <h5 class="mb-0">${review.name}</h5>
                    <div class="reviewer-meta">
                        ${review.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verificado</span>' : 'Visitante'}
                    </div>
                </div>
            </div>
            <div class="review-rating rating-${review.rating}">
                ${stars}
            </div>
        </div>

        <h6 class="mb-2">${review.title}</h6>
        <div class="review-content">
            ${review.content}
        </div>

        ${review.response ? `
        <div class="response-section">
            <div class="response-label">
                <i class="fas fa-reply me-1"></i> Resposta:
            </div>
            <div class="response-content">
                ${review.response.content}
            </div>
            <div class="response-date">
                ${new Date(review.response.date).toLocaleDateString('pt-BR')}
            </div>
        </div>
        ` : ''}

        <div class="review-footer">
            <div>
                <span class="review-service">${serviceLabels[review.service]}</span>
                ${review.project ? ` <span class="review-service">${review.project}</span>` : ''}
            </div>
            <div class="review-date">${formattedDate}</div>
        </div>

        <div class="review-actions">
            <button class="action-btn helpful-btn ${hasVoted ? 'voted' : ''}" 
                    data-id="${review.id}"
                    ${hasVoted ? 'disabled' : ''}>
                <i class="fas fa-thumbs-up me-1"></i> ${voteText} (${review.helpful})
            </button>
            <button class="action-btn report-btn" data-id="${review.id}">
                <i class="fas fa-flag me-1"></i> Reportar
            </button>
        </div>
    `;

    return card;
}

function sortReviews() {
    filteredReviews.sort((a, b) => {
        switch (currentSort) {
            case 'recent':
                return new Date(b.date) - new Date(a.date);
            case 'rating':
                return b.rating - a.rating || new Date(b.date) - new Date(a.date);
            case 'helpful':
                return b.helpful - a.helpful || new Date(b.date) - new Date(a.date);
            default:
                return 0;
        }
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Service tabs
    document.querySelectorAll('.service-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentService = this.dataset.service;
            currentPage = 1;
            renderReviews();
        });
    });

    // Sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSort = this.dataset.sort;
            renderReviews();
        });
    });

    // Load more button
    loadMoreBtn.addEventListener('click', function () {
        currentPage++;
        renderReviews();
        showToast(`Carregadas mais ${reviewsPerPage} avaliações`, 'info', 2000);
    });

    // Delegar eventos para botões dinâmicos
    document.addEventListener('click', function (e) {
        // Botão "Útil"
        if (e.target.closest('.helpful-btn')) {
            const btn = e.target.closest('.helpful-btn');
            const reviewId = parseInt(btn.dataset.id);
            handleHelpfulVote(reviewId, btn);
        }

        // Botão "Reportar"
        if (e.target.closest('.report-btn')) {
            const btn = e.target.closest('.report-btn');
            const reviewId = parseInt(btn.dataset.id);
            showReportModal(reviewId);
        }
    });
}

function handleHelpfulVote(reviewId, button) {
    if (helpfulVotes.has(reviewId)) {
        showNotification('Você já marcou esta avaliação como útil', 'info');
        return;
    }
    
    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) return;

    // Atualizar contador
    review.helpful = (review.helpful || 0) + 1;
    helpfulVotes.add(reviewId);
    
    // Salvar votos
    saveUserData();

    // Atualizar UI
    button.classList.add('voted');
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-thumbs-up me-1"></i> Você achou útil (${review.helpful})`;
    
    showNotification('Obrigado pelo seu feedback!', 'success');
}

// ============================================
// FORMULÁRIO DE REVIEW COM VALIDAÇÃO
// ============================================

function setupReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    // Inicializar sistema de estrelas
    initStarRating();

    // Adicionar validação em tempo real
    const fields = ['reviewerName', 'reviewerEmail', 'reviewContent'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId, field));
            field.addEventListener('input', () => clearFieldError(field));
        }
    });

    // Evento de submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleReviewSubmit();
    });
}

function initStarRating() {
    const starLabels = document.querySelectorAll('.star-label');
    
    starLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', () => highlightStars(index));
        
        label.addEventListener('click', () => {
            // Remover seleção anterior
            const starInputs = document.querySelectorAll('.star-input');
            starInputs.forEach(input => input.checked = false);
            
            // Selecionar esta estrela e todas anteriores
            for (let i = 0; i <= index; i++) {
                starInputs[i].checked = true;
            }
        });
    });
    
    // Resetar hover ao sair do container
    const starContainer = document.getElementById('starRating');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', resetStarHover);
    }
}

function highlightStars(upToIndex) {
    const starLabels = document.querySelectorAll('.star-label');
    starLabels.forEach((label, index) => {
        label.style.color = index <= upToIndex ? '#fbbf24' : 'var(--text-muted)';
    });
}

function resetStarHover() {
    const starLabels = document.querySelectorAll('.star-label');
    const checkedInput = document.querySelector('.star-input:checked');
    
    if (checkedInput) {
        const starInputs = document.querySelectorAll('.star-input');
        const checkedIndex = Array.from(starInputs).indexOf(checkedInput);
        highlightStars(checkedIndex);
    } else {
        starLabels.forEach(label => {
            label.style.color = 'var(--text-muted)';
        });
    }
}

function validateField(fieldId, element) {
    const value = element.value.trim();
    let isValid = true;
    let message = '';

    switch (fieldId) {
        case 'reviewerName':
            if (!value) {
                isValid = false;
                message = 'Nome é obrigatório';
            } else if (value.length < 3) {
                isValid = false;
                message = 'Nome precisa ter pelo menos 3 caracteres';
            }
            break;
            
        case 'reviewerEmail':
            if (value && !isValidEmail(value)) {
                isValid = false;
                message = 'Por favor, insira um email válido';
            }
            break;
            
        case 'reviewContent':
            if (!value) {
                isValid = false;
                message = 'Avaliação é obrigatória';
            } else if (value.length < 10) {
                isValid = false;
                message = 'Avaliação deve ter pelo menos 10 caracteres';
            }
            break;
            
        case 'reviewService':
            if (!value) {
                isValid = false;
                message = 'Selecione um serviço';
            }
            break;
    }

    if (!isValid) {
        showFieldError(element, message);
        return false;
    } else {
        clearFieldError(element);
        return true;
    }
}

function showFieldError(element, message) {
    element.classList.add('error');
    
    let errorElement = element.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        element.parentNode.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.style.display = 'block';
}

function clearFieldError(element) {
    element.classList.remove('error');
    const errorElement = element.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function handleReviewSubmit() {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    // Elementos do formulário
    const nameField = document.getElementById('reviewerName');
    const emailField = document.getElementById('reviewerEmail');
    const serviceField = document.getElementById('reviewService');
    const titleField = document.getElementById('reviewTitle');
    const contentField = document.getElementById('reviewContent');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validar campos obrigatórios
    let isValid = true;
    
    // Validar nome
    if (!validateField('reviewerName', nameField)) isValid = false;
    
    // Validar email se preenchido
    if (emailField.value.trim() && !validateField('reviewerEmail', emailField)) isValid = false;
    
    // Validar serviço
    if (!serviceField.value) {
        showFieldError(serviceField, 'Selecione um serviço');
        isValid = false;
    } else {
        clearFieldError(serviceField);
    }
    
    // Validar conteúdo
    if (!validateField('reviewContent', contentField)) isValid = false;
    
    // Validar rating
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    if (!ratingInput) {
        showNotification('Por favor, selecione uma avaliação com estrelas', 'error');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Por favor, corrija os erros no formulário', 'error');
        return;
    }

    // Obter valores
    const anonymous = document.getElementById('anonymousReview')?.checked || false;
    const recommend = document.getElementById('recommendService')?.checked || false;
    const allowContact = document.getElementById('allowContact')?.checked || false;
    const project = document.getElementById('reviewProject')?.value.trim() || null;
    const company = document.getElementById('reviewCompany')?.value.trim() || null;

    // Criar nova review
    const newReview = {
        id: Date.now(),
        name: anonymous ? 'Visitante Anônimo' : nameField.value.trim(),
        avatar: anonymous ? 'VA' : getInitials(nameField.value.trim()),
        rating: parseInt(ratingInput.value),
        service: serviceField.value,
        title: titleField?.value.trim() || 'Sem título',
        content: contentField.value.trim(),
        date: new Date().toISOString().split('T')[0],
        verified: false,
        project: project,
        company: company,
        helpful: 0,
        featured: false,
        recommend: recommend,
        anonymous: anonymous
    };

    // Simular envio
    try {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Adicionar review
        reviewsData.unshift(newReview);

        // Resetar formulário
        form.reset();
        resetStarHover();

        // Limpar erros
        clearAllFieldErrors();

        // Mostrar sucesso
        showNotification(
            'Avaliação enviada com sucesso! Ela será moderada antes de aparecer publicamente.',
            'success',
            4000
        );

        // Atualizar reviews
        currentPage = 1;
        renderReviews();

        // Scroll para as reviews
        setTimeout(() => {
            document.querySelector('.reviews-section')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 500);

    } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        showNotification('Erro ao enviar avaliação. Tente novamente.', 'error');
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Avaliação';
            submitBtn.disabled = false;
        }
    }
}

function getInitials(name) {
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function clearAllFieldErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// ============================================
// MODAL DE REPORT
// ============================================

function showReportModal(reviewId) {
    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) return;

    const reviewModal = document.getElementById('reviewModal');
    const modalContent = document.getElementById('modalContent');
    if (!reviewModal || !modalContent) return;

    // Verificar se já reportou
    if (reportedReviews.has(reviewId)) {
        showNotification('Você já reportou esta avaliação', 'info');
        return;
    }

    modalContent.innerHTML = `
        <h4 class="mb-3">Reportar Avaliação</h4>
        <p class="text-muted mb-4">Por favor, selecione o motivo do report:</p>
        
        <div class="form-group">
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="reportReason" id="reason1" value="spam">
                <label class="form-check-label" for="reason1">
                    Spam ou conteúdo promocional
                </label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="reportReason" id="reason2" value="offensive">
                <label class="form-check-label" for="reason2">
                    Conteúdo ofensivo ou inapropriado
                </label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="reportReason" id="reason3" value="fake">
                <label class="form-check-label" for="reason3">
                    Avaliação falsa ou enganosa
                </label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="reportReason" id="reason4" value="other">
                <label class="form-check-label" for="reason4">
                    Outro motivo
                </label>
            </div>
        </div>
        
        <div class="form-group mb-4">
            <label class="form-label">Detalhes adicionais (opcional)</label>
            <textarea class="form-control form-textarea" id="reportDetails" 
                      placeholder="Forneça mais informações sobre o problema..." 
                      rows="3"></textarea>
        </div>
        
        <button class="btn btn-primary w-100" id="submitReport">
            <i class="fas fa-paper-plane me-2"></i>Enviar Report
        </button>
    `;

    reviewModal.classList.add('active');

    // Event listener para submit
    document.getElementById('submitReport').addEventListener('click', function() {
        const reason = document.querySelector('input[name="reportReason"]:checked');
        const details = document.getElementById('reportDetails')?.value.trim() || '';

        if (!reason) {
            showNotification('Selecione um motivo para o report', 'error');
            return;
        }

        // Salvar report
        reportedReviews.add(reviewId);
        saveUserData();

        showNotification(
            'Report enviado com sucesso. Obrigado por ajudar a manter as avaliações de qualidade!',
            'success'
        );

        reviewModal.classList.remove('active');
    });
}

// ============================================
// TEMA
// ============================================

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Carregar tema salvo
    const savedTheme = localStorage.getItem('jm-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon('light');
    } else if (!savedTheme && !prefersDark) {
        document.body.classList.add('light-theme');
        updateThemeIcon('light');
    }

    // Alternar tema
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');

        if (isLight) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('jm-theme', 'dark');
            updateThemeIcon('dark');
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('jm-theme', 'light');
            updateThemeIcon('light');
        }

        showNotification(
            `Tema ${isLight ? 'escuro' : 'claro'} ativado`,
            'success',
            2000
        );
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ============================================
// WHATSAPP FLOAT
// ============================================

function setupWhatsAppFloat() {
    const whatsappFloat = document.getElementById('whatsappFloat');
    if (!whatsappFloat) return;

    // Mostrar após delay
    setTimeout(() => {
        whatsappFloat.classList.add('show');
    }, 3000);

    // Esconder ao rolar para baixo
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY + 50 && currentScrollY > 300) {
            whatsappFloat.classList.remove('show');
        } else if (currentScrollY < lastScrollY) {
            whatsappFloat.classList.add('show');
        }

        lastScrollY = currentScrollY;
    });

    // Botão de fechar
    const closeFloatBtn = document.getElementById('closeFloat');
    if (closeFloatBtn) {
        closeFloatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            whatsappFloat.classList.remove('show');
            localStorage.setItem('whatsappFloatClosed', 'true');
            showNotification(
                'WhatsApp minimizado. Clique no ícone flutuante para abrir novamente.',
                'info',
                2000
            );
        });
    }
}

// ============================================
// BACK TO TOP
// ============================================

function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// PROGRESS BAR
// ============================================

function setupProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ============================================
// FAQ
// ============================================

function setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function () {
            const item = this.parentElement;
            item.classList.toggle('active');
        });
    });
}

// ============================================
// MODAL
// ============================================

function setupModal() {
    const reviewModal = document.getElementById('reviewModal');
    const modalClose = document.getElementById('modalClose');
    if (!reviewModal || !modalClose) return;

    // Fechar com botão
    modalClose.addEventListener('click', () => {
        reviewModal.classList.remove('active');
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reviewModal.classList.contains('active')) {
            reviewModal.classList.remove('active');
        }
    });

    // Fechar ao clicar fora
    reviewModal.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            reviewModal.classList.remove('active');
        }
    });
}

// ============================================
// NOTIFICAÇÕES (STYLE DO MAIN.JS)
// ============================================

function showNotification(message, type = 'info', duration = 5000) {
    // Criar container se não existir
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Ícones por tipo
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="close-notification" aria-label="Fechar">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Botão de fechar
    notification.querySelector('.close-notification').addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto-remover
    const autoRemove = setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, duration);

    // Pausar timeout ao passar mouse
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoRemove);
    });

    notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (notification.parentNode) {
                removeNotification(notification);
            }
        }, duration);
    });
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
// STORAGE
// ============================================

function loadUserData() {
    try {
        const savedData = localStorage.getItem('jm-reviews-data');
        if (savedData) {
            const data = JSON.parse(savedData);
            helpfulVotes = new Set(data.helpfulVotes || []);
            reportedReviews = new Set(data.reportedReviews || []);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

function saveUserData() {
    try {
        const data = {
            helpfulVotes: Array.from(helpfulVotes),
            reportedReviews: Array.from(reportedReviews),
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('jm-reviews-data', JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
    }
}

// ============================================
// TOAST ALIAS (para compatibilidade)
// ============================================

function showToast(message, type = 'info', duration = 5000) {
    showNotification(message, type, duration);
}

// ============================================
// CSS ADICIONAL PARA VALIDAÇÃO
// ============================================

const style = document.createElement('style');
style.textContent = `
    .error-message {
        font-size: 0.875rem;
        color: #ef4444;
        margin-top: 0.25rem;
        display: none;
    }
    
    .form-control.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .helpful-btn.voted {
        background: #10b981;
        color: white;
        border-color: #10b981;
    }
    
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 350px;
    }
    
    .notification {
        background: var(--bg-secondary);
        border-left: 4px solid #2563eb;
        border-radius: 0.75rem;
        padding: 1rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid var(--border);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification.success {
        border-left-color: #10b981;
    }
    
    .notification.error {
        border-left-color: #ef4444;
    }
    
    .notification.warning {
        border-left-color: #f59e0b;
    }
    
    .notification.info {
        border-left-color: #2563eb;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary);
    }
    
    .close-notification {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.25rem;
        line-height: 1;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }
    
    .close-notification:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(style);