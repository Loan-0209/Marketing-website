/* HEART Technology Park - Main JavaScript */

// Global HEART object for namespace
window.HEART = {
    // Configuration
    config: {
        parallaxSpeed: 0.3,
        animationDuration: 1000,
        observerThreshold: 0.1,
        headerHeight: 80
    },
    
    // State
    state: {
        isLoaded: false,
        activeSection: null,
        buildingParallax: null,
        observers: []
    },
    
    // Utility functions
    utils: {
        // Debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle function for scroll events
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Smooth scroll to element
        smoothScrollTo: function(element, offset = 0) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },
        
        // Get current page name
        getCurrentPage: function() {
            return window.location.pathname.split('/').pop() || 'index.html';
        },
        
        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }
};

// Navigation Management
HEART.navigation = {
    init: function() {
        this.setupActiveStates();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        
        console.log('🚀 Navigation system initialized');
    },
    
    setupActiveStates: function() {
        const navLinks = document.querySelectorAll('.nav a');
        const currentPage = HEART.utils.getCurrentPage();
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },
    
    setupSmoothScrolling: function() {
        document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    HEART.utils.smoothScrollTo(target, HEART.config.headerHeight);
                }
            });
        });
    },
    
    setupMobileMenu: function() {
        // Add mobile menu toggle if needed
        const nav = document.querySelector('.nav');
        const header = document.querySelector('.header');
        
        if (window.innerWidth <= 768) {
            // Mobile menu logic can be added here
            console.log('📱 Mobile navigation ready');
        }
    }
};

// Animation System
HEART.animations = {
    observers: [],
    
    init: function() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        
        console.log('✨ Animation system initialized');
    },
    
    setupIntersectionObserver: function() {
        const observerOptions = {
            threshold: HEART.config.observerThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0s';
                    entry.target.classList.add('fade-in');
                    
                    // Trigger specific animations based on element class
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.push(observer);
    },
    
    setupScrollAnimations: function() {
        // Header scroll effect
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        const handleScroll = HEART.utils.throttle(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        }, 10);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    },
    
    setupCounterAnimations: function() {
        // Counter animation is handled by intersection observer
        console.log('🔢 Counter animations ready');
    },
    
    animateCounter: function(counter) {
        const target = parseInt(counter.textContent.replace(/\\D/g, '')) || 0;
        const suffix = counter.textContent.replace(/\\d/g, '');
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                setTimeout(updateCounter, stepTime);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    }
};

// Parallax System
HEART.parallax = {
    building: null,
    isActive: false,
    
    init: function() {
        this.building = document.querySelector('.building-parallax');
        
        if (this.building) {
            this.setupBuildingParallax();
            this.isActive = true;
            console.log('🏢 Building parallax system initialized');
        }
    },
    
    setupBuildingParallax: function() {
        let ticking = false;
        
        const updateParallax = () => {
            if (!this.isActive) return;
            
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Calculate scroll progress (0 to 1)
            const scrollProgress = scrolled / (documentHeight - windowHeight);
            
            // Building parallax movement - slower than content scroll
            const buildingTranslateY = scrolled * HEART.config.parallaxSpeed;
            
            // Subtle effects
            const rotationAngle = scrollProgress * 3; // Max 3 degrees
            const scaleEffect = 1 + (scrollProgress * 0.05); // 1 to 1.05
            
            // Apply transform
            this.building.style.transform = `
                translateY(-${buildingTranslateY}px) 
                rotate(${rotationAngle}deg) 
                scale(${scaleEffect})
            `;
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        // Event listeners
        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', requestTick, { passive: true });
        
        // Initial setup
        this.animateEntrance();
    },
    
    animateEntrance: function() {
        if (!this.building) return;
        
        this.building.style.opacity = '0';
        this.building.style.transform = 'translateY(50px) scale(0.9)';
        
        setTimeout(() => {
            this.building.style.transition = 'opacity 1s ease, transform 1s ease';
            this.building.style.opacity = '1';
            
            // Clear transition after animation
            setTimeout(() => {
                this.building.style.transition = '';
            }, 1000);
        }, 100);
    }
};

// Performance Monitor
HEART.performance = {
    metrics: {
        loadTime: 0,
        firstPaint: 0,
        domReady: 0
    },
    
    init: function() {
        this.measureLoadTime();
        this.setupPerformanceObserver();
        
        console.log('📊 Performance monitoring initialized');
    },
    
    measureLoadTime: function() {
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            this.logMetrics();
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.domReady = performance.now();
        });
    },
    
    setupPerformanceObserver: function() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    },
    
    logMetrics: function() {
        console.log('🎯 HEART Performance Metrics:', {
            'Load Time': `${this.metrics.loadTime.toFixed(2)}ms`,
            'DOM Ready': `${this.metrics.domReady.toFixed(2)}ms`,
            'First Paint': `${this.metrics.firstPaint.toFixed(2)}ms`
        });
    }
};

// Error Handling
HEART.errorHandler = {
    init: function() {
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handlePromiseRejection);
        
        console.log('🛡️ Error handling initialized');
    },
    
    handleError: function(event) {
        console.error('HEART Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    },
    
    handlePromiseRejection: function(event) {
        console.error('HEART Promise Rejection:', event.reason);
    }
};

// Accessibility Features
HEART.accessibility = {
    init: function() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
        
        console.log('♿ Accessibility features initialized');
    },
    
    setupKeyboardNavigation: function() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // ESC key closes modals/menus
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    },
    
    setupFocusManagement: function() {
        // Focus management for better accessibility
        const focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex=\"-1\"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableContent = document.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    },
    
    setupReducedMotion: function() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            HEART.parallax.isActive = false;
            document.body.classList.add('reduced-motion');
            console.log('🔇 Reduced motion enabled');
        }
    },
    
    closeAllModals: function() {
        // Close any open modals or overlays
        document.querySelectorAll('.modal, .overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    }
};

// Main Initialization
HEART.init = function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
        this.initialize();
    }
};

HEART.initialize = function() {
    console.log('🚀 Initializing HEART Technology Park website...');
    
    // Initialize all systems
    this.errorHandler.init();
    this.navigation.init();
    this.animations.init();
    this.parallax.init();
    this.performance.init();
    this.accessibility.init();
    
    // Mark as loaded
    this.state.isLoaded = true;
    
    // Final setup
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log('✅ HEART website fully loaded and ready!');
    }, 100);
};

// Debug functions (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.HEART_DEBUG = {
        getState: () => HEART.state,
        getConfig: () => HEART.config,
        getPerformance: () => HEART.performance.metrics,
        toggleParallax: () => {
            HEART.parallax.isActive = !HEART.parallax.isActive;
            console.log('Parallax:', HEART.parallax.isActive ? 'Enabled' : 'Disabled');
        }
    };
    
    console.log('🔧 Debug mode enabled. Use window.HEART_DEBUG for debugging.');
}

// Initialize when script loads
HEART.init();