// Parallax Control - Only enable on About page
class ParallaxController {
    constructor() {
        this.isAboutPage = false;
        this.parallaxElements = [];
        this.scrollHandlers = [];
        this.init();
    }

    init() {
        // Check if we're on About page
        this.checkAboutPage();
        
        // Listen for navigation changes
        this.setupNavigationListeners();
        
        // Setup parallax if on About page
        if (this.isAboutPage) {
            this.enableParallax();
        } else {
            this.disableParallax();
        }
    }

    checkAboutPage() {
        // Multiple ways to detect About page
        const url = window.location.href.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const activeSection = document.querySelector('#about.active');
        const aboutSection = document.querySelector('#about');
        
        // More aggressive detection
        this.isAboutPage = url.includes('about') || 
                          hash.includes('about') || 
                          activeSection !== null ||
                          (aboutSection && window.getComputedStyle(aboutSection).display !== 'none');
        
        console.log('🔍 About page detected:', this.isAboutPage);
        console.log('- URL:', url);
        console.log('- Hash:', hash);
        console.log('- Active section:', !!activeSection);
        console.log('- About section visible:', aboutSection && window.getComputedStyle(aboutSection).display !== 'none');
    }

    setupNavigationListeners() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            const wasAboutPage = this.isAboutPage;
            this.checkAboutPage();
            
            if (wasAboutPage !== this.isAboutPage) {
                if (this.isAboutPage) {
                    this.enableParallax();
                } else {
                    this.disableParallax();
                }
            }
        });

        // Listen for section changes (if using section navigation)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class') {
                    const wasAboutPage = this.isAboutPage;
                    this.checkAboutPage();
                    
                    if (wasAboutPage !== this.isAboutPage) {
                        if (this.isAboutPage) {
                            this.enableParallax();
                        } else {
                            this.disableParallax();
                        }
                    }
                }
            });
        });

        // Observe section changes
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            observer.observe(aboutSection, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    enableParallax() {
        console.log('🎯 Enabling parallax for About page');
        
        // Don't remove existing parallax, just add if needed
        const existing = document.querySelector('#about-parallax-only');
        if (!existing) {
            this.createAboutParallax();
        }
        
        // Always ensure scroll handlers are active
        this.addScrollHandlers();
        
        // Also trigger building creation
        if (window.createBuildingNow) {
            window.createBuildingNow();
        }
    }

    disableParallax() {
        console.log('❌ Disabling parallax for non-About pages');
        
        // Remove all parallax elements
        document.querySelectorAll('[class*="parallax"], [id*="parallax"]').forEach(el => {
            if (!el.closest('#about')) {
                el.remove();
            }
        });

        // Remove scroll handlers
        this.scrollHandlers.forEach(handler => {
            window.removeEventListener('scroll', handler);
        });
        this.scrollHandlers = [];
    }

    createAboutParallax() {
        // Only create if About section exists and is active
        const aboutSection = document.querySelector('#about');
        if (!aboutSection || !this.isAboutPage) {
            return;
        }

        // Create parallax container
        const container = document.createElement('div');
        container.className = 'about-parallax-container';
        container.id = 'about-parallax-only';
        container.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 350px;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
            overflow: hidden;
            display: block;
        `;

        // Create parallax image
        const image = document.createElement('div');
        image.className = 'about-parallax-image';
        image.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 120%;
            background: white;
            will-change: transform;
            transition: transform 0.1s ease-out;
        `;

        container.appendChild(image);
        document.body.appendChild(container);

        console.log('✅ About parallax created');
    }

    addScrollHandlers() {
        if (!this.isAboutPage) return;

        // About page specific scroll handler
        const aboutScrollHandler = () => {
            if (!this.isAboutPage) return;

            const container = document.querySelector('#about-parallax-only');
            const image = container?.querySelector('.about-parallax-image');
            
            if (!container || !image) return;

            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.3;
                const yOffset = scrolled * parallaxSpeed;
                
                image.style.transform = `translateY(${yOffset}px)`;
                
                // Fade effect
                const opacity = Math.max(0.3, 1 - (scrolled / window.innerHeight) * 0.5);
                container.style.opacity = opacity;
            });
        };

        // Add scroll handler
        window.addEventListener('scroll', aboutScrollHandler, { passive: true });
        this.scrollHandlers.push(aboutScrollHandler);

        console.log('✅ About parallax scroll handlers added');
    }
}

// Initialize parallax control
window.addEventListener('DOMContentLoaded', () => {
    window.parallaxController = new ParallaxController();
});

// Also expose manual controls
window.enableAboutParallax = () => {
    if (window.parallaxController) {
        window.parallaxController.isAboutPage = true;
        window.parallaxController.enableParallax();
    }
};

window.disableAllParallax = () => {
    if (window.parallaxController) {
        window.parallaxController.isAboutPage = false;
        window.parallaxController.disableParallax();
    }
};