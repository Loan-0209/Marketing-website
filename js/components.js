// HEART Technology Website - Component JavaScript

class HeartUI {
    constructor() {
        this.currentSection = 'hero';
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.checkInitialAuth();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const sectionId = href.substring(1);
                    this.showSection(sectionId);
                }
            });
        });

        // Window scroll event
        window.addEventListener('scroll', () => this.handleScroll());

        // Window resize event
        window.addEventListener('resize', () => this.handleResize());

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal[style*="block"]');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.facility-card, .tech-item, .stat-card, .timeline-item, .news-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    setupSmoothScrolling() {
        // Enable smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (navMenu) {
            navMenu.classList.toggle('active', this.mobileMenuOpen);
        }
        
        if (toggle) {
            toggle.innerHTML = this.mobileMenuOpen ? '✕' : '☰';
        }
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.section, .hero');
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            setTimeout(() => {
                targetSection.classList.add('active');
            }, 10);
        }

        // Update navigation
        this.updateNavigation(sectionId);
        
        // Close mobile menu if open
        if (this.mobileMenuOpen) {
            this.toggleMobileMenu();
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.currentSection = sectionId;
    }

    updateNavigation(activeSection) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}` || 
                (activeSection === 'hero' && link.getAttribute('onclick') && link.getAttribute('onclick').includes('hero'))) {
                link.classList.add('active');
            }
        });
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    handleResize() {
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    animateOnScroll(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    // Modal methods
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // News methods
    createNewsCard(article) {
        const newsCard = document.createElement('div');
        newsCard.className = `news-card ${article.featured ? 'featured' : ''}`;
        
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        newsCard.innerHTML = `
            ${article.featured ? '<div class="featured-badge">Featured</div>' : ''}
            <div class="news-image">${article.icon}</div>
            <div class="news-content">
                <div class="news-title">${this.escapeHtml(article.title)}</div>
                <div class="news-date">${publishedDate}</div>
                <div class="news-excerpt">${this.escapeHtml(article.excerpt)}</div>
                <div class="news-meta">
                    <a href="#" class="read-more" onclick="heartUI.showNewsDetail('${article._id}')">Read more</a>
                    <div class="news-stats">
                        <span class="news-stat">👁 ${article.views || 0}</span>
                        <span class="news-stat likeable" onclick="heartUI.likeArticle('${article._id}', this)">❤️ ${article.likes || 0}</span>
                    </div>
                </div>
            </div>
        `;
        
        return newsCard;
    }

    async showNewsDetail(articleId) {
        try {
            const response = await api.getNewsById(articleId);
            if (response.success) {
                const article = response.data.news;
                this.createNewsModal(article);
            }
        } catch (error) {
            console.error('Error loading article details:', error);
            Toast.error('Failed to load article details');
        }
    }

    createNewsModal(article) {
        // Remove existing modal if present
        const existingModal = document.getElementById('newsModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'newsModal';
        modal.className = 'modal';
        modal.style.display = 'block';
        
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>${this.escapeHtml(article.title)}</h2>
                    <span class="close" onclick="heartUI.closeModal('newsModal')">&times;</span>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; font-size: 4rem; margin-bottom: 2rem;">${article.icon}</div>
                    <div style="color: var(--gray); margin-bottom: 2rem; text-align: center;">
                        <span>📅 ${publishedDate}</span>
                        ${article.author ? ` • ✍️ ${article.author.firstName} ${article.author.lastName}` : ''}
                        <br>
                        <div style="margin-top: 1rem; display: flex; justify-content: center; gap: 2rem; font-size: 0.9rem;">
                            <span>👁 ${article.views || 0} views</span>
                            <span>❤️ ${article.likes || 0} likes</span>
                            <span>📖 ${article.readTime || 1} min read</span>
                        </div>
                    </div>
                    <div style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem; text-align: justify;">
                        ${this.formatContent(article.content || article.excerpt)}
                    </div>
                    ${article.tags && article.tags.length ? `
                        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--light-gray);">
                            <h4 style="margin-bottom: 1rem; color: var(--primary-blue);">Tags:</h4>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${article.tags.map(tag => `<span style="background: var(--light-blue); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">${this.escapeHtml(tag)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    <div style="margin-top: 2rem; text-align: center;">
                        <button class="btn btn-primary" onclick="heartUI.likeArticleFromModal('${article._id}')">
                            ❤️ Like this article
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    async likeArticle(articleId, element) {
        try {
            await api.likeNews(articleId);
            const currentLikes = parseInt(element.textContent.split(' ')[1]);
            element.textContent = `❤️ ${currentLikes + 1}`;
            
            // Add animation
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
            
            Toast.success('Article liked!');
        } catch (error) {
            console.error('Error liking article:', error);
            Toast.error('Failed to like article');
        }
    }

    async likeArticleFromModal(articleId) {
        try {
            await api.likeNews(articleId);
            Toast.success('Thank you for liking this article!');
            this.closeModal('newsModal');
        } catch (error) {
            console.error('Error liking article:', error);
            Toast.error('Failed to like article');
        }
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatContent(content) {
        if (!content) return '';
        
        // Simple formatting: convert line breaks to paragraphs
        return content
            .split('\n\n')
            .map(paragraph => `<p>${this.escapeHtml(paragraph.trim())}</p>`)
            .join('');
    }

    checkInitialAuth() {
        if (api.isAuthenticated()) {
            this.updateUIForAuth();
        }
    }

    updateUIForAuth() {
        const addNewsBtn = document.getElementById('addNewsBtn');
        const loginBtn = document.querySelector('[onclick*="showLogin"]');
        
        if (api.canManageNews() && addNewsBtn) {
            addNewsBtn.style.display = 'block';
        }
        
        if (loginBtn) {
            loginBtn.textContent = `Logout (${api.user.username})`;
            loginBtn.onclick = () => this.logout();
            loginBtn.style.background = 'var(--gray)';
        }
    }

    async logout() {
        try {
            await api.logout();
            
            const addNewsBtn = document.getElementById('addNewsBtn');
            const loginBtn = document.querySelector('[onclick*="logout"]');
            
            if (addNewsBtn) {
                addNewsBtn.style.display = 'none';
            }
            
            if (loginBtn) {
                loginBtn.textContent = 'Login';
                loginBtn.onclick = () => this.showModal('loginModal');
                loginBtn.style.background = 'var(--primary-yellow)';
            }
            
            Toast.info('You have been logged out');
            
            // Reload news
            if (typeof loadNewsFromAPI === 'function') {
                await loadNewsFromAPI();
            }
        } catch (error) {
            console.error('Logout error:', error);
            Toast.error('Logout failed');
        }
    }

    // Form validation
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: var(--error);
            font-size: 0.8rem;
            margin-top: 0.3rem;
            animation: fadeInUp 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        field.style.borderColor = 'var(--error)';
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Loading states
    showLoading(element) {
        const originalContent = element.innerHTML;
        element.innerHTML = '<span style="display: inline-block; width: 20px; height: 20px; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>';
        element.disabled = true;
        
        return () => {
            element.innerHTML = originalContent;
            element.disabled = false;
        };
    }

    // Initialize particles effect (optional)
    initParticles() {
        // Add floating particles to hero section
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(251, 191, 36, 0.6);
                border-radius: 50%;
                animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            hero.appendChild(particle);
        }

        // Add CSS for particle animation
        if (!document.getElementById('particleStyles')) {
            const style = document.createElement('style');
            style.id = 'particleStyles';
            style.textContent = `
                @keyframes floatParticle {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize HeartUI when DOM is loaded
let heartUI;
document.addEventListener('DOMContentLoaded', () => {
    heartUI = new HeartUI();
});

// Legacy function support for existing HTML
function showSection(sectionId) {
    if (heartUI) {
        heartUI.showSection(sectionId);
    }
}

function showLogin() {
    if (heartUI) {
        heartUI.showModal('loginModal');
    }
}

function hideLogin() {
    if (heartUI) {
        heartUI.closeModal('loginModal');
    }
}