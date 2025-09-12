/* HEART Technology Park - Advanced Navigation System */

window.HEARTNavigation = {
    // Configuration
    config: {
        mobileBreakpoint: 768,
        scrollThreshold: 100,
        smoothScrollDuration: 800,
        headerHeight: 80
    },
    
    // State
    state: {
        isMenuOpen: false,
        isMobile: false,
        currentPage: '',
        lastScrollY: 0,
        isScrollingUp: false
    },
    
    // Elements
    elements: {
        header: null,
        nav: null,
        navLinks: [],
        logo: null,
        mobileToggle: null
    },
    
    // Initialize navigation system
    init: function() {
        this.findElements();
        this.detectCurrentPage();
        this.setupActiveStates();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupMobileNavigation();
        this.setupKeyboardNavigation();
        this.setupResizeHandler();
        
        console.log('🧭 Advanced Navigation System initialized');
    },
    
    // Find navigation elements
    findElements: function() {
        this.elements.header = document.querySelector('.header');
        this.elements.nav = document.querySelector('.nav');
        this.elements.navLinks = document.querySelectorAll('.nav a');
        this.elements.logo = document.querySelector('.logo');
        
        if (!this.elements.header || !this.elements.nav) {
            console.warn('⚠️ Navigation elements not found');
            return;
        }
        
        console.log(`✅ Found navigation with ${this.elements.navLinks.length} links`);
    },
    
    // Detect current page
    detectCurrentPage: function() {
        this.state.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log(`📍 Current page: ${this.state.currentPage}`);
    },
    
    // Setup active navigation states
    setupActiveStates: function() {
        this.elements.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove existing active classes
            link.classList.remove('active');
            
            // Add active class for current page
            if (href === this.state.currentPage) {
                link.classList.add('active');
                this.setPageTitle(link.textContent);
            }
            
            // Add hover effects
            this.addHoverEffects(link);
        });
    },
    
    // Set page title in header
    setPageTitle: function(title) {
        if (title && title.trim() !== '') {
            document.title = `${title} - HEART Technology Park`;
        }
    },
    
    // Add enhanced hover effects
    addHoverEffects: function(link) {
        let hoverTimeout;
        
        link.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            link.style.transform = 'translateY(-2px)';
            
            // Add subtle glow effect
            if (!link.classList.contains('active')) {
                link.style.boxShadow = '0 4px 15px rgba(255, 167, 38, 0.3)';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                link.style.transform = '';
                if (!link.classList.contains('active')) {
                    link.style.boxShadow = '';
                }
            }, 150);
        });
    },
    
    // Setup scroll effects
    setupScrollEffects: function() {
        let ticking = false;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Determine scroll direction
            this.state.isScrollingUp = currentScrollY < this.state.lastScrollY;
            this.state.lastScrollY = currentScrollY;
            
            // Update header appearance
            this.updateHeaderAppearance(currentScrollY);
            
            // Update navigation visibility
            this.updateNavigationVisibility(currentScrollY);
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
    },
    
    // Update header appearance based on scroll
    updateHeaderAppearance: function(scrollY) {
        if (!this.elements.header) return;
        
        if (scrollY > this.config.scrollThreshold) {
            this.elements.header.classList.add('scrolled');
            this.elements.header.style.backgroundColor = 'rgba(30, 64, 175, 0.95)';
            this.elements.header.style.backdropFilter = 'blur(10px)';
        } else {
            this.elements.header.classList.remove('scrolled');
            this.elements.header.style.backgroundColor = '';
            this.elements.header.style.backdropFilter = '';
        }
    },
    
    // Update navigation visibility
    updateNavigationVisibility: function(scrollY) {
        if (!this.elements.header) return;
        
        // Hide navigation when scrolling down, show when scrolling up
        if (scrollY > this.config.scrollThreshold * 2) {
            if (this.state.isScrollingUp) {
                this.elements.header.style.transform = 'translateY(0)';
            } else {
                this.elements.header.style.transform = 'translateY(-100%)';
            }
        } else {
            this.elements.header.style.transform = 'translateY(0)';
        }
    },
    
    // Setup smooth scrolling
    setupSmoothScrolling: function() {
        this.elements.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Handle anchor links
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.smoothScrollToAnchor(href);
                });
            }
            
            // Handle page navigation with loading animation
            else if (href && !href.startsWith('http')) {
                link.addEventListener('click', (e) => {
                    if (href !== this.state.currentPage) {
                        this.animatePageTransition(href);
                    }
                });
            }
        });\n    },\n    \n    // Smooth scroll to anchor\n    smoothScrollToAnchor: function(anchor) {\n        const target = document.querySelector(anchor);\n        if (!target) return;\n        \n        const targetPosition = target.offsetTop - this.config.headerHeight;\n        \n        window.scrollTo({\n            top: targetPosition,\n            behavior: 'smooth'\n        });\n        \n        // Update URL without page reload\n        history.pushState(null, null, anchor);\n    },\n    \n    // Animate page transition\n    animatePageTransition: function(href) {\n        // Add loading state\n        document.body.classList.add('page-transitioning');\n        \n        // Fade out current content\n        const mainContent = document.querySelector('main, .main-content');\n        if (mainContent) {\n            mainContent.style.opacity = '0.5';\n            mainContent.style.transform = 'translateY(20px)';\n        }\n        \n        // Navigate after short delay\n        setTimeout(() => {\n            window.location.href = href;\n        }, 300);\n    },\n    \n    // Setup mobile navigation\n    setupMobileNavigation: function() {\n        this.checkMobileState();\n        this.createMobileToggle();\n        this.setupMobileMenu();\n    },\n    \n    // Check if in mobile state\n    checkMobileState: function() {\n        this.state.isMobile = window.innerWidth <= this.config.mobileBreakpoint;\n    },\n    \n    // Create mobile toggle button\n    createMobileToggle: function() {\n        if (!this.state.isMobile) return;\n        \n        // Check if toggle already exists\n        this.elements.mobileToggle = document.querySelector('.mobile-nav-toggle');\n        \n        if (!this.elements.mobileToggle) {\n            this.elements.mobileToggle = document.createElement('button');\n            this.elements.mobileToggle.className = 'mobile-nav-toggle';\n            this.elements.mobileToggle.innerHTML = `\n                <span></span>\n                <span></span>\n                <span></span>\n            `;\n            this.elements.mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');\n            \n            // Insert after logo\n            this.elements.logo.parentNode.insertBefore(\n                this.elements.mobileToggle, \n                this.elements.nav\n            );\n        }\n        \n        // Add click handler\n        this.elements.mobileToggle.addEventListener('click', () => {\n            this.toggleMobileMenu();\n        });\n    },\n    \n    // Setup mobile menu behavior\n    setupMobileMenu: function() {\n        if (!this.state.isMobile || !this.elements.nav) return;\n        \n        // Add mobile menu classes\n        this.elements.nav.classList.add('mobile-nav');\n        \n        // Close menu when clicking nav links\n        this.elements.navLinks.forEach(link => {\n            link.addEventListener('click', () => {\n                if (this.state.isMobile && this.state.isMenuOpen) {\n                    this.closeMobileMenu();\n                }\n            });\n        });\n        \n        // Close menu when clicking outside\n        document.addEventListener('click', (e) => {\n            if (this.state.isMenuOpen && \n                !this.elements.nav.contains(e.target) && \n                !this.elements.mobileToggle.contains(e.target)) {\n                this.closeMobileMenu();\n            }\n        });\n    },\n    \n    // Toggle mobile menu\n    toggleMobileMenu: function() {\n        if (this.state.isMenuOpen) {\n            this.closeMobileMenu();\n        } else {\n            this.openMobileMenu();\n        }\n    },\n    \n    // Open mobile menu\n    openMobileMenu: function() {\n        this.state.isMenuOpen = true;\n        this.elements.nav.classList.add('open');\n        this.elements.mobileToggle.classList.add('active');\n        document.body.classList.add('menu-open');\n        \n        // Animate menu items\n        this.elements.navLinks.forEach((link, index) => {\n            setTimeout(() => {\n                link.style.opacity = '1';\n                link.style.transform = 'translateX(0)';\n            }, index * 50);\n        });\n    },\n    \n    // Close mobile menu\n    closeMobileMenu: function() {\n        this.state.isMenuOpen = false;\n        this.elements.nav.classList.remove('open');\n        this.elements.mobileToggle.classList.remove('active');\n        document.body.classList.remove('menu-open');\n        \n        // Reset menu items\n        this.elements.navLinks.forEach(link => {\n            link.style.opacity = '';\n            link.style.transform = '';\n        });\n    },\n    \n    // Setup keyboard navigation\n    setupKeyboardNavigation: function() {\n        document.addEventListener('keydown', (e) => {\n            // ESC key closes mobile menu\n            if (e.key === 'Escape' && this.state.isMenuOpen) {\n                this.closeMobileMenu();\n            }\n            \n            // Tab navigation enhancement\n            if (e.key === 'Tab') {\n                this.handleTabNavigation(e);\n            }\n        });\n    },\n    \n    // Handle tab navigation\n    handleTabNavigation: function(e) {\n        const focusableElements = this.elements.nav.querySelectorAll(\n            'a, button, [tabindex]:not([tabindex=\"-1\"])'\n        );\n        \n        const firstElement = focusableElements[0];\n        const lastElement = focusableElements[focusableElements.length - 1];\n        \n        // Trap focus within navigation when menu is open\n        if (this.state.isMenuOpen) {\n            if (e.shiftKey) {\n                if (document.activeElement === firstElement) {\n                    lastElement.focus();\n                    e.preventDefault();\n                }\n            } else {\n                if (document.activeElement === lastElement) {\n                    firstElement.focus();\n                    e.preventDefault();\n                }\n            }\n        }\n    },\n    \n    // Setup resize handler\n    setupResizeHandler: function() {\n        const handleResize = this.debounce(() => {\n            const wasMobile = this.state.isMobile;\n            this.checkMobileState();\n            \n            // If switching between mobile and desktop\n            if (wasMobile !== this.state.isMobile) {\n                this.handleViewportChange();\n            }\n        }, 250);\n        \n        window.addEventListener('resize', handleResize);\n    },\n    \n    // Handle viewport changes\n    handleViewportChange: function() {\n        if (this.state.isMobile) {\n            // Switching to mobile\n            this.createMobileToggle();\n            this.setupMobileMenu();\n        } else {\n            // Switching to desktop\n            this.closeMobileMenu();\n            if (this.elements.mobileToggle) {\n                this.elements.mobileToggle.remove();\n                this.elements.mobileToggle = null;\n            }\n            this.elements.nav.classList.remove('mobile-nav');\n        }\n    },\n    \n    // Utility: Debounce function\n    debounce: function(func, wait) {\n        let timeout;\n        return function executedFunction(...args) {\n            const later = () => {\n                clearTimeout(timeout);\n                func(...args);\n            };\n            clearTimeout(timeout);\n            timeout = setTimeout(later, wait);\n        };\n    },\n    \n    // Get current navigation state\n    getState: function() {\n        return {\n            currentPage: this.state.currentPage,\n            isMenuOpen: this.state.isMenuOpen,\n            isMobile: this.state.isMobile,\n            isScrollingUp: this.state.isScrollingUp\n        };\n    }\n};\n\n// Auto-initialize when DOM is ready\ndocument.addEventListener('DOMContentLoaded', function() {\n    HEARTNavigation.init();\n});\n\n// Handle page visibility changes\ndocument.addEventListener('visibilitychange', function() {\n    if (document.visibilityState === 'visible') {\n        // Refresh navigation state when returning to page\n        HEARTNavigation.setupActiveStates();\n    }\n});\n\n// Export for debugging\nif (typeof window !== 'undefined') {\n    window.HEARTNavigation = HEARTNavigation;\n}