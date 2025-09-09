/**
 * HEART Building Parallax Manager
 * Production-ready building animation system for GitHub Pages
 * Uses Intersection Observer API for reliable performance
 */

class BuildingParallaxManager {
    constructor(options = {}) {
        this.options = {
            buildingWidth: 450,
            buildingHeight: 350,
            parallaxSpeed: 0.3,
            fadeDistance: 1.5, // viewport heights
            triggerSelector: 'h1, h2, h3, h4, h5, h6',
            triggerText: 'our mission',
            debug: false,
            ...options
        };
        
        this.state = {
            initialized: false,
            building: null,
            container: null,
            missionElement: null,
            isVisible: false,
            observer: null
        };
        
        this.animations = {
            parallax: null,
            fade: null
        };
        
        this.debug('BuildingParallaxManager initialized', this.options);
        
        // Bind methods
        this.handleIntersection = this.handleIntersection.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Auto-initialize with delay for GitHub Pages
        this.initialize();
    }
    
    debug(...args) {
        if (this.options.debug) {
            console.log('[BuildingManager]', ...args);
        }
    }
    
    error(...args) {
        console.error('[BuildingManager ERROR]', ...args);
    }
    
    async initialize() {
        try {
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Clean up any existing buildings
            this.cleanup();
            
            // Find mission element
            this.findMissionElement();
            
            if (!this.state.missionElement) {
                this.error('Mission element not found - using fallback positioning');
                this.createFallbackTrigger();
            }
            
            // Create building structure
            this.createBuilding();
            
            // Setup observers
            this.setupIntersectionObserver();
            this.setupScrollListener();
            this.setupResizeListener();
            
            this.state.initialized = true;
            this.debug('Initialization complete');
            
        } catch (error) {
            this.error('Initialization failed:', error);
            this.createFallbackBuilding();
        }
    }
    
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                // DOM already loaded, wait a bit more for GitHub Pages
                setTimeout(resolve, 100);
            }
        });
    }
    
    cleanup() {
        this.debug('Cleaning up existing buildings');
        
        // Remove existing buildings by various selectors - more comprehensive cleanup
        const selectors = [
            '[id*="building"]',
            '[id*="parallax"]',
            '[class*="building"]',
            '[class*="parallax"]',
            '[style*="HEART TECHNOLOGY"]',
            '[id="immediate-building-container"]',
            '[id="about-parallax-only"]',
            '[id="nuclear-reset-building"]',
            '[id="mission-triggered-building"]',
            '[id="new-heart-building"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // More aggressive cleanup - remove any element that might be a building
                if (el.style.position === 'fixed' || 
                    el.style.position === 'absolute' || 
                    el.style.right === '0px' || 
                    el.style.right === '0' ||
                    el.textContent.includes('HEART TECHNOLOGY')) {
                    el.remove();
                    this.debug('Removed existing element:', el.id || el.className);
                }
            });
        });
        
        // Remove any elements with borders (debugging elements and legacy styles)
        const borderSelectors = [
            '[style*="border: 3px solid"]',
            '[style*="border:3px solid"]', 
            '[style*="border: 2px solid"]',
            '[style*="border:2px solid"]',
            '[style*="border: 1px solid"]',
            '[style*="border:1px solid"]',
            '[style*="border-left"]',
            '[style*="border-right"]',
            '[style*="border-top"]',
            '[style*="border-bottom"]',
            '[style*="outline: "]',
            '[style*="outline:"]'
        ];
        
        borderSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if ((el.style.position === 'fixed' || el.style.position === 'absolute') && 
                    (el.style.right === '0px' || el.style.right === '0' || el.textContent.includes('HEART'))) {
                    el.remove();
                    this.debug('Removed border element:', el.id || el.className);
                }
            });
        });
        
        // Disconnect existing observer
        if (this.state.observer) {
            this.state.observer.disconnect();
        }
    }
    
    findMissionElement() {
        const headings = document.querySelectorAll(this.options.triggerSelector);
        
        for (const heading of headings) {
            if (heading.textContent.toLowerCase().includes(this.options.triggerText)) {
                this.state.missionElement = heading;
                this.debug('Found mission element:', heading);
                return heading;
            }
        }
        
        return null;
    }
    
    createFallbackTrigger() {
        // Create invisible trigger element as fallback
        const trigger = document.createElement('div');
        trigger.style.cssText = `
            position: absolute;
            top: 50vh;
            left: 0;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
        `;
        trigger.setAttribute('data-building-trigger', 'fallback');
        document.body.appendChild(trigger);
        this.state.missionElement = trigger;
        this.debug('Created fallback trigger');
    }
    
    createBuilding() {
        this.debug('Creating building structure');
        
        // Main container - position within the building-section instead of fixed
        this.state.container = document.createElement('div');
        this.state.container.id = 'heart-building-parallax-manager';
        
        // Try to find the building-section container first
        const buildingSection = document.getElementById('building-parallax-container') || 
                              document.querySelector('.building-section') ||
                              document.querySelector('[id*="building-section"]');
        
        if (buildingSection) {
            // Position within the existing building section
            this.state.container.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 5 !important;
                pointer-events: none !important;
                overflow: hidden !important;
                opacity: 0 !important;
                transform: translateY(50px) !important;
                transition: opacity 0.8s ease, transform 0.8s ease !important;
            `;
        } else {
            // Fallback to fixed positioning
            this.state.container.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                width: ${this.options.buildingWidth}px !important;
                height: 100vh !important;
                z-index: 5 !important;
                pointer-events: none !important;
                overflow: hidden !important;
                opacity: 0 !important;
                transform: translateY(100px) !important;
                transition: opacity 0.8s ease, transform 0.8s ease !important;
            `;
        }
        
        // Transparent background container (no sky gradient)
        const skyBackground = document.createElement('div');
        skyBackground.className = 'building-sky transparent-bg';
        skyBackground.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            border-radius: 0 !important;
            border: none !important;
            backdrop-filter: none !important;
        `;
        
        // Main building - enhanced for transparent background
        this.state.building = document.createElement('div');
        this.state.building.className = 'heart-building';
        this.state.building.style.cssText = `
            position: absolute !important;
            top: 38% !important;
            left: 50% !important;
            transform: translateX(-50%) translateZ(0) !important;
            width: 280px !important;
            height: 220px !important;
            background: linear-gradient(145deg, #4f46e5, #7c3aed) !important;
            border-radius: 18px !important;
            border: none !important;
            outline: none !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 40px rgba(79, 70, 229, 0.3) !important;
            filter: drop-shadow(0 0 20px rgba(79, 70, 229, 0.3)) !important;
            -webkit-font-smoothing: antialiased !important;
            backface-visibility: hidden !important;
            will-change: transform !important;
        `;
        
        // Building details
        this.state.building.innerHTML = this.getBuildingHTML();
        
        // Background buildings
        const leftBuilding = this.createBackgroundBuilding('left', '#6b7280');
        const rightBuilding = this.createBackgroundBuilding('right', '#374151');
        
        // Assemble structure
        skyBackground.appendChild(leftBuilding);
        skyBackground.appendChild(rightBuilding);
        skyBackground.appendChild(this.state.building);
        this.state.container.appendChild(skyBackground);
        
        // Add to DOM - prefer building section if available
        if (buildingSection) {
            buildingSection.appendChild(this.state.container);
            this.debug('Building added to building-section container');
        } else {
            document.body.appendChild(this.state.container);
            this.debug('Building added to document body (fallback)');
        }
        
        this.debug('Building structure created');
    }
    
    getBuildingHTML() {
        return `
            <div style="
                position: absolute;
                top: 30px;
                left: 30px;
                right: 30px;
                height: 38px;
                background: rgba(255, 193, 7, 0.95);
                border-radius: 12px;
                border: none;
                outline: none;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial Black, Arial;
                font-size: 14px;
                font-weight: 900;
                color: #1e40af;
                text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                box-shadow: 0 5px 20px rgba(251, 191, 36, 0.6);
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            ">HEART TECHNOLOGY</div>
            
            <div style="
                position: absolute;
                top: 85px;
                left: 30px;
                right: 30px;
                height: 32px;
                background: rgba(255,255,255,0.98);
                border-radius: 10px;
                border: none;
                outline: none;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial;
                font-size: 12px;
                font-weight: bold;
                color: #1e40af;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            ">AI Innovation Hub</div>
            
            <div style="
                position: absolute;
                top: 135px;
                left: 35px;
                right: 35px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                height: 60px;
            ">
                ${Array(16).fill().map(() => `
                    <div style="
                        background: ${Math.random() > 0.2 ? 'rgba(255,255,120,0.95)' : 'rgba(255,255,255,0.4)'};
                        border-radius: 4px;
                        border: none;
                        outline: none;
                        box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
                    "></div>
                `).join('')}
            </div>
            
            <div style="
                position: absolute;
                bottom: 25px;
                left: 50%;
                transform: translateX(-50%);
                width: 45px;
                height: 18px;
                background: linear-gradient(90deg, #fbbf24, #f59e0b);
                border-radius: 10px;
                border: none;
                outline: none;
                box-shadow: 0 4px 15px rgba(251, 191, 36, 0.6);
            "></div>
        `;
    }
    
    createBackgroundBuilding(side, color) {
        const building = document.createElement('div');
        building.style.cssText = `
            position: absolute;
            ${side}: 12%;
            top: ${side === 'left' ? '42%' : '47%'};
            width: ${side === 'left' ? '100px' : '90px'};
            height: ${side === 'left' ? '160px' : '140px'};
            background: linear-gradient(145deg, ${color}, ${color}AA);
            border-radius: 12px;
            border: none;
            outline: none;
            opacity: 0.6;
            box-shadow: 0 20px 45px rgba(0,0,0,0.2);
            filter: drop-shadow(0 0 10px rgba(0,0,0,0.1));
            transform: translateZ(0);
            backface-visibility: hidden;
        `;
        return building;
    }
    
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) {
            this.debug('IntersectionObserver not supported, using fallback');
            this.setupFallbackObserver();
            return;
        }
        
        const options = {
            root: null,
            rootMargin: '0px 0px -20% 0px',
            threshold: [0, 0.1, 0.5, 1.0]
        };
        
        this.state.observer = new IntersectionObserver(this.handleIntersection, options);
        this.state.observer.observe(this.state.missionElement);
        
        this.debug('Intersection observer setup complete');
    }
    
    setupFallbackObserver() {
        // Fallback for older browsers
        this.handleScroll();
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            const isIntersecting = entry.isIntersecting;
            
            this.debug('Intersection change:', {
                isIntersecting,
                intersectionRatio: entry.intersectionRatio,
                boundingClientRect: entry.boundingClientRect
            });
            
            if (isIntersecting && !this.state.isVisible) {
                this.showBuilding();
            } else if (!isIntersecting && this.state.isVisible) {
                this.hideBuilding();
            }
        });
    }
    
    showBuilding() {
        if (!this.state.container) return;
        
        this.debug('Showing building');
        this.state.isVisible = true;
        
        this.state.container.style.opacity = '1';
        this.state.container.style.transform = 'translateY(0)';
        
        // Start parallax animation
        this.startParallaxAnimation();
    }
    
    hideBuilding() {
        if (!this.state.container) return;
        
        this.debug('Hiding building');
        this.state.isVisible = false;
        
        this.state.container.style.opacity = '0';
        this.state.container.style.transform = 'translateY(100px)';
        
        // Stop parallax animation
        this.stopParallaxAnimation();
    }
    
    startParallaxAnimation() {
        if (this.animations.parallax) return;
        
        let ticking = false;
        
        this.animations.parallax = () => {
            if (!ticking && this.state.isVisible) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', this.animations.parallax, { passive: true });
        this.debug('Parallax animation started');
    }
    
    stopParallaxAnimation() {
        if (this.animations.parallax) {
            window.removeEventListener('scroll', this.animations.parallax);
            this.animations.parallax = null;
            this.debug('Parallax animation stopped');
        }
    }
    
    updateParallax() {
        if (!this.state.building || !this.state.missionElement) return;
        
        const scrolled = window.pageYOffset;
        const missionRect = this.state.missionElement.getBoundingClientRect();
        const missionTop = scrolled + missionRect.top;
        
        // Calculate parallax offset
        const relativeScroll = scrolled - missionTop + window.innerHeight;
        const parallaxOffset = relativeScroll * -this.options.parallaxSpeed;
        
        // Apply parallax transform
        this.state.building.style.transform = `translateX(-50%) translateY(${parallaxOffset}px)`;
        
        // Apply fade effect
        const fadeDistance = window.innerHeight * this.options.fadeDistance;
        const opacity = Math.max(0.2, 1 - (relativeScroll / fadeDistance));
        
        if (this.state.container) {
            this.state.container.style.opacity = opacity;
        }
    }
    
    handleScroll() {
        // Fallback scroll handler for browsers without IntersectionObserver
        if (!this.state.missionElement) return;
        
        const rect = this.state.missionElement.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !this.state.isVisible) {
            this.showBuilding();
        } else if (!isVisible && this.state.isVisible) {
            this.hideBuilding();
        }
    }
    
    setupScrollListener() {
        // Throttled scroll listener for performance
        let ticking = false;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (this.state.isVisible) {
                        this.updateParallax();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
    
    setupResizeListener() {
        const resizeHandler = () => {
            if (!this.state.container) return;
            
            // Responsive sizing for different screen sizes
            if (window.innerWidth < 480) {
                // Very small screens - hide completely
                this.state.container.style.display = 'none';
            } else if (window.innerWidth < 768) {
                // Mobile - smaller building
                this.state.container.style.display = 'block';
                if (this.state.building) {
                    this.state.building.style.width = '200px';
                    this.state.building.style.height = '160px';
                    this.state.building.style.transform = 'translateX(-50%) scale(0.8)';
                }
            } else if (window.innerWidth < 1024) {
                // Tablet - medium building
                this.state.container.style.display = 'block';
                if (this.state.building) {
                    this.state.building.style.width = '240px';
                    this.state.building.style.height = '190px';
                    this.state.building.style.transform = 'translateX(-50%) scale(0.9)';
                }
            } else {
                // Desktop - full size
                this.state.container.style.display = 'block';
                if (this.state.building) {
                    this.state.building.style.width = '280px';
                    this.state.building.style.height = '220px';
                    this.state.building.style.transform = 'translateX(-50%)';
                }
            }
        };
        
        window.addEventListener('resize', resizeHandler);
        resizeHandler(); // Initial check
    }
    
    handleResize() {
        this.setupResizeListener();
    }
    
    // Public API methods
    destroy() {
        this.debug('Destroying building parallax manager');
        
        // Clean up observers
        if (this.state.observer) {
            this.state.observer.disconnect();
        }
        
        // Remove event listeners
        this.stopParallaxAnimation();
        
        // Remove DOM elements
        if (this.state.container) {
            this.state.container.remove();
        }
        
        // Reset state
        this.state = {
            initialized: false,
            building: null,
            container: null,
            missionElement: null,
            isVisible: false,
            observer: null
        };
    }
    
    recreate() {
        this.destroy();
        this.initialize();
    }
    
    getState() {
        return {
            ...this.state,
            isInitialized: this.state.initialized,
            hasBuilding: !!this.state.building,
            hasContainer: !!this.state.container,
            hasMissionElement: !!this.state.missionElement
        };
    }
    
    // Debug methods
    highlight() {
        if (this.state.container) {
            this.state.container.style.border = '3px solid red';
            this.state.container.style.background = 'rgba(255,0,0,0.1)';
        }
        if (this.state.missionElement) {
            this.state.missionElement.style.border = '3px solid blue';
            this.state.missionElement.style.background = 'rgba(0,0,255,0.1)';
        }
    }
    
    removeHighlight() {
        if (this.state.container) {
            this.state.container.style.border = 'none';
            this.state.container.style.background = 'transparent';
        }
        if (this.state.missionElement) {
            this.state.missionElement.style.border = 'none';
            this.state.missionElement.style.background = 'transparent';
        }
    }
}

// Auto-initialize for About page with error handling
function initializeBuildingManager() {
    try {
        // Check if we're on the about page
        const isAboutPage = window.location.pathname.includes('about') || 
                           window.location.hash.includes('about') ||
                           document.title.toLowerCase().includes('about');
        
        if (!isAboutPage) {
            console.log('[BuildingManager] Not on about page, skipping initialization');
            return;
        }
        
        // Create manager instance
        window.buildingManager = new BuildingParallaxManager({
            debug: true // Enable debug for production troubleshooting
        });
        
        // Auto-apply transparent background
        setTimeout(() => {
            if (typeof window.makeBackgroundTransparent === 'function') {
                window.makeBackgroundTransparent();
            }
        }, 500);
        
        console.log('[BuildingManager] Initialized successfully with transparent background');
        
        // Expose debug functions globally
        window.debugBuilding = () => window.buildingManager.getState();
        window.recreateBuilding = () => window.buildingManager.recreate();
        window.highlightBuilding = () => window.buildingManager.highlight();
        window.removeHighlightBuilding = () => window.buildingManager.removeHighlight();
        
        // Enhanced transparency controls
        window.toggleNuclearMode = () => {
            const existing = document.getElementById('nuclear-transparency');
            if (existing) {
                existing.remove();
                console.log('🔄 Nuclear mode disabled');
            } else {
                window.nuclearGradientRemoval();
                console.log('💥 Nuclear mode enabled');
            }
        };
        window.cleanupDuplicateBuildings = () => {
            console.log('🧹 Manual cleanup of duplicate buildings...');
            // Find and remove all building-related elements
            const allBuildings = document.querySelectorAll(`
                [id*="building"], 
                [id*="parallax"], 
                [class*="building"], 
                [class*="parallax"],
                [style*="HEART TECHNOLOGY"],
                [style*="position: fixed"][style*="right: 0"]
            `);
            allBuildings.forEach(el => {
                if (el.id !== 'heart-building-parallax-manager') {
                    el.remove();
                    console.log('Removed duplicate:', el.id || el.className);
                }
            });
            console.log(`✅ Cleaned up ${allBuildings.length} duplicate elements`);
        };
        
        window.removeBuildingBorders = () => {
            console.log('🎯 Removing all building borders...');
            // Remove borders from all building-related elements
            const buildingElements = document.querySelectorAll(`
                [id*="building"] *, 
                [class*="building"] *,
                [id*="heart"] *,
                .heart-building *,
                [style*="HEART TECHNOLOGY"]
            `);
            
            buildingElements.forEach(el => {
                el.style.border = 'none';
                el.style.borderWidth = '0';
                el.style.borderStyle = 'none';
                el.style.borderColor = 'transparent';
                el.style.outline = 'none';
                el.style.outlineWidth = '0';
                el.style.outlineStyle = 'none';
            });
            
            // Also apply to parent containers
            document.querySelectorAll('[id*="building"], [class*="building"], [id*="heart"]').forEach(el => {
                el.style.border = 'none';
                el.style.outline = 'none';
            });
            
            console.log(`✅ Removed borders from ${buildingElements.length} elements`);
        };
        
        window.makeBackgroundTransparent = () => {
            console.log('✨ Making background transparent...');
            
            // Force transparent backgrounds on all potential background elements
            const backgroundSelectors = [
                'body', 'html', '.page-content', '.main-content', '.about-page', 
                '.container', '.building-section', '.building-container', 
                '.building-wrapper', '.building-parallax-container', 
                '.parallax-container', '.about-content', '.building-area', 
                '.building-zone', '.hero-section', '.mission-section',
                '.bg-gradient', '.gradient-bg', '.background-overlay', '.bg-overlay',
                'section', '.section', '.content-section'
            ];
            
            backgroundSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.background = 'transparent';
                    el.style.backgroundColor = 'transparent';
                    el.style.backgroundImage = 'none';
                    el.style.backdropFilter = 'none';
                });
            });
            
            // Remove any gradient backgrounds specifically
            document.querySelectorAll('[style*="gradient"]').forEach(el => {
                if (!el.classList.contains('heart-building') && 
                    !el.textContent.includes('HEART TECHNOLOGY')) {
                    el.style.background = 'transparent';
                    el.style.backgroundImage = 'none';
                }
            });
            
            console.log('✅ Background made transparent');
        };
        
        window.nuclearGradientRemoval = () => {
            console.log('💥 NUCLEAR GRADIENT REMOVAL - Complete background override...');
            
            // Inject nuclear CSS override
            const nuclearStyle = document.createElement('style');
            nuclearStyle.id = 'nuclear-transparency';
            nuclearStyle.innerHTML = `
                /* NUCLEAR GRADIENT REMOVAL - COMPLETE OVERRIDE */
                *, *::before, *::after { 
                    background: #ffffff !important; 
                    background-image: none !important; 
                    background-color: #ffffff !important;
                    background-attachment: initial !important;
                    background-origin: initial !important;
                    background-clip: initial !important;
                    background-size: initial !important;
                    background-repeat: initial !important;
                    background-position: initial !important;
                }
                
                body { 
                    background: #ffffff !important; 
                    background-color: #ffffff !important;
                    background-image: none !important;
                }
                
                html {
                    background: #ffffff !important;
                    background-color: #ffffff !important;
                    background-image: none !important;
                }
                
                /* Force white background on all containers */
                .header,
                .content-section,
                .about-container,
                section,
                .section,
                div,
                main,
                article {
                    background: #ffffff !important;
                    background-color: #ffffff !important;
                    background-image: none !important;
                }
                
                /* Only building-related sections get transparency */
                .building-section,
                .building-container,
                .building-parallax-container,
                #building-parallax-container,
                .building-sky,
                .sky-background,
                .parallax-bg,
                .transparent-bg {
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                    backdrop-filter: none !important;
                }
                
                /* Enhanced building visibility with preserved gradient */
                .heart-building,
                .building,
                [class*="building"][class*="heart"],
                [id*="building"][id*="heart"] {
                    background: linear-gradient(135deg, #4338ca 0%, #7c3aed 100%) !important;
                    background-color: #4338ca !important;
                    filter: contrast(1.2) brightness(1.15) !important;
                    box-shadow: 0 15px 45px rgba(0,0,0,0.3), 0 0 30px rgba(67, 56, 202, 0.4) !important;
                    transform: scale(1.08) !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: block !important;
                    border: none !important;
                    outline: none !important;
                }
                
                /* Enhanced building text elements */
                .heart-building .text,
                .heart-building div[style*="HEART TECHNOLOGY"],
                .building .technology-header,
                .building .card-header {
                    background: rgba(255, 193, 7, 0.95) !important;
                    background-color: rgba(255, 193, 7, 0.95) !important;
                    color: #1e40af !important;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5) !important;
                    border: none !important;
                    outline: none !important;
                }
                
                .heart-building div[style*="AI Innovation Hub"],
                .building .card-body,
                .building .innovation-section {
                    background: rgba(255, 255, 255, 0.98) !important;
                    background-color: rgba(255, 255, 255, 0.98) !important;
                    color: #1e40af !important;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
                    border: none !important;
                    outline: none !important;
                }
                
                /* Remove gradient from header but preserve styling */
                .header {
                    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%) !important;
                    background-color: #1e40af !important;
                }
                
                /* Override any remaining gradient backgrounds */
                [style*="gradient"]:not(.heart-building):not(.header):not([class*="building"]) {
                    background: #ffffff !important;
                    background-color: #ffffff !important;
                    background-image: none !important;
                }
            `;
            
            // Remove existing nuclear style if present
            const existingNuclear = document.getElementById('nuclear-transparency');
            if (existingNuclear) {
                existingNuclear.remove();
            }
            
            // Inject new style
            document.head.appendChild(nuclearStyle);
            
            console.log('💥 Nuclear override applied - All backgrounds transparent, building enhanced');
            console.log('🎯 Building scale: 1.08x, Enhanced contrast and brightness');
            console.log('✨ Deep shadows and glow effects applied');
        };
        
    } catch (error) {
        console.error('[BuildingManager] Initialization failed:', error);
    }
}

// Multiple initialization strategies for GitHub Pages reliability
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBuildingManager);
} else {
    initializeBuildingManager();
}

// Backup initialization
window.addEventListener('load', () => {
    if (!window.buildingManager) {
        setTimeout(initializeBuildingManager, 500);
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuildingParallaxManager;
}