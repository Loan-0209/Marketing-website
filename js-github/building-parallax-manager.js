/**
 * HEART Building Parallax Manager - FIXED VERSION
 * Solved duplicate building issue with enhanced cleanup
 */

class FixedBuildingParallaxManager {
    constructor(options = {}) {
        this.options = {
            buildingWidth: 450,
            buildingHeight: 350,
            parallaxSpeed: 0.3,
            fadeDistance: 1.5,
            triggerSelector: 'h1, h2, h3, h4, h5, h6',
            triggerText: 'our mission',
            debug: true,
            ...options
        };
        
        this.state = {
            initialized: false,
            building: null,
            container: null,
            missionElement: null,
            isVisible: false,
            observer: null,
            instanceId: 'building-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        };
        
        this.debug('FixedBuildingParallaxManager initialized with ID:', this.state.instanceId);
        
        // Bind methods
        this.handleIntersection = this.handleIntersection.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Prevent multiple instances
        if (window.activeBuildingManager) {
            this.debug('Destroying existing building manager');
            window.activeBuildingManager.destroy();
        }
        window.activeBuildingManager = this;
        
        // Initialize with delay
        setTimeout(() => this.initialize(), 100);
    }
    
    debug(...args) {
        if (this.options.debug) {
            console.log(`[FixedBuildingManager:${this.state.instanceId.slice(-6)}]`, ...args);
        }
    }
    
    error(...args) {
        console.error(`[FixedBuildingManager:${this.state.instanceId.slice(-6)} ERROR]`, ...args);
    }
    
    async initialize() {
        try {
            this.debug('Starting initialization...');
            
            // Wait for DOM
            await this.waitForDOM();
            
            // ENHANCED CLEANUP - Remove ALL building-related elements
            this.nuclearCleanup();
            
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
            this.debug('Initialization complete successfully');
            
        } catch (error) {
            this.error('Initialization failed:', error);
        }
    }
    
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                setTimeout(resolve, 50);
            }
        });
    }
    
    nuclearCleanup() {
        this.debug('🧹 NUCLEAR CLEANUP - Removing all building-related elements');
        
        // Step 1: Remove by specific IDs that might exist
        const specificIds = [
            'heart-building-parallax-manager',
            'building-parallax-container',
            'immediate-building-container',
            'about-parallax-only',
            'nuclear-reset-building',
            'mission-triggered-building',
            'new-heart-building'
        ];
        
        specificIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.remove();
                this.debug('Removed by ID:', id);
            }
        });
        
        // Step 2: Remove by attribute patterns
        const attributeSelectors = [
            '[id*="building"]',
            '[id*="parallax"]',
            '[class*="building"]', 
            '[class*="parallax"]',
            '[data-building]',
            '[data-building-trigger]'
        ];
        
        attributeSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Skip elements we want to keep (main containers)
                if (el.classList.contains('building-section') || 
                    el.id === 'building-parallax-container') {
                    return;
                }
                
                // Remove if it looks like a building element
                if (el.style.position === 'fixed' || 
                    el.style.position === 'absolute' || 
                    el.textContent.includes('HEART TECHNOLOGY') ||
                    el.style.right === '0px' || el.style.right === '0') {
                    el.remove();
                    this.debug('Removed by attribute:', selector, el.id || el.className);
                }
            });
        });
        
        // Step 3: Remove by content - any element containing building text
        document.querySelectorAll('*').forEach(el => {
            if (el.textContent && 
                el.textContent.includes('HEART TECHNOLOGY') && 
                el.textContent.includes('AI Innovation Hub') &&
                (el.style.position === 'fixed' || el.style.position === 'absolute')) {
                el.remove();
                this.debug('Removed by content:', el.tagName, el.id || el.className);
            }
        });
        
        // Step 4: Remove debugging borders/outlines
        document.querySelectorAll('[style*="border"], [style*="outline"]').forEach(el => {
            if ((el.style.position === 'fixed' || el.style.position === 'absolute') &&
                (el.style.right === '0px' || el.style.right === '0' || 
                 el.textContent.includes('HEART'))) {
                el.remove();
                this.debug('Removed border element:', el.id || el.className);
            }
        });
        
        // Step 5: Disconnect any existing observers
        if (this.state.observer) {
            this.state.observer.disconnect();
        }
        
        // Step 6: Clear any window references
        if (window.buildingManager && window.buildingManager !== this) {
            try {
                window.buildingManager.destroy();
            } catch (e) {
                this.debug('Error destroying old manager:', e);
            }
        }
        
        this.debug('✅ Nuclear cleanup completed');
    }    
    findMissionElement() {
        const headings = document.querySelectorAll(this.options.triggerSelector);
        
        for (const heading of headings) {
            if (heading.textContent.toLowerCase().includes(this.options.triggerText)) {
                this.state.missionElement = heading;
                this.debug('Found mission element:', heading.tagName, heading.textContent.slice(0, 30));
                return heading;
            }
        }
        
        this.debug('Mission element not found, using fallback');
        return null;
    }
    
    createFallbackTrigger() {
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
        trigger.id = 'fallback-trigger-' + this.state.instanceId.slice(-6);
        document.body.appendChild(trigger);
        this.state.missionElement = trigger;
        this.debug('Created fallback trigger with ID:', trigger.id);
    }
    
    createBuilding() {
        this.debug('Creating building structure...');
        
        // Main container with unique ID
        this.state.container = document.createElement('div');
        this.state.container.id = 'heart-building-' + this.state.instanceId.slice(-6);
        this.state.container.setAttribute('data-building-instance', this.state.instanceId);
        
        // Try to find the building section
        const buildingSection = document.getElementById('building-parallax-container') || 
                              document.querySelector('.building-section');
        
        if (buildingSection) {
            // Position within existing building section
            this.state.container.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 10 !important;
                pointer-events: none !important;
                overflow: hidden !important;
                opacity: 0 !important;
                transform: translateY(50px) !important;
                transition: opacity 0.8s ease, transform 0.8s ease !important;
            `;
            buildingSection.appendChild(this.state.container);
            this.debug('Building added to building-section');
        } else {
            // Fallback to fixed positioning
            this.state.container.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                width: ${this.options.buildingWidth}px !important;
                height: 100vh !important;
                z-index: 10 !important;
                pointer-events: none !important;
                overflow: hidden !important;
                opacity: 0 !important;
                transform: translateY(100px) !important;
                transition: opacity 0.8s ease, transform 0.8s ease !important;
            `;
            document.body.appendChild(this.state.container);
            this.debug('Building added to body (fallback)');
        }
        
        // Sky background (transparent)
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
            border: none !important;
            outline: none !important;
        `;
        
        // Main building
        this.state.building = document.createElement('div');
        this.state.building.className = 'heart-building';
        this.state.building.setAttribute('data-building-id', this.state.instanceId);
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
        
        this.debug('Building structure created with ID:', this.state.container.id);
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
                border: none !important;
                outline: none !important;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial Black, Arial;
                font-size: 14px;
                font-weight: 900;
                color: #1e40af;
                text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                box-shadow: 0 5px 20px rgba(251, 191, 36, 0.6);
            ">HEART TECHNOLOGY</div>
            
            <div style="
                position: absolute;
                top: 85px;
                left: 30px;
                right: 30px;
                height: 32px;
                background: rgba(255,255,255,0.98);
                border-radius: 10px;
                border: none !important;
                outline: none !important;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial;
                font-size: 12px;
                font-weight: bold;
                color: #1e40af;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
                        border: none !important;
                        outline: none !important;
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
                border: none !important;
                outline: none !important;
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
            border: none !important;
            outline: none !important;
            opacity: 0.6;
            box-shadow: 0 20px 45px rgba(0,0,0,0.2);
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
        this.handleScroll();
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            const isIntersecting = entry.isIntersecting;
            
            this.debug('Intersection change:', {
                isIntersecting,
                intersectionRatio: entry.intersectionRatio.toFixed(2)
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
        
        this.startParallaxAnimation();
    }
    
    hideBuilding() {
        if (!this.state.container) return;
        
        this.debug('Hiding building');
        this.state.isVisible = false;
        
        this.state.container.style.opacity = '0';
        this.state.container.style.transform = 'translateY(100px)';
        
        this.stopParallaxAnimation();
    }
    
    startParallaxAnimation() {
        if (this.animations && this.animations.parallax) return;
        
        this.animations = this.animations || {};
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
        if (this.animations && this.animations.parallax) {
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
        
        const relativeScroll = scrolled - missionTop + window.innerHeight;
        const parallaxOffset = relativeScroll * -this.options.parallaxSpeed;
        
        this.state.building.style.transform = `translateX(-50%) translateY(${parallaxOffset}px)`;
        
        const fadeDistance = window.innerHeight * this.options.fadeDistance;
        const opacity = Math.max(0.2, 1 - (relativeScroll / fadeDistance));
        
        if (this.state.container) {
            this.state.container.style.opacity = opacity;
        }
    }
    
    handleScroll() {
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
            
            if (window.innerWidth < 480) {
                this.state.container.style.display = 'none';
            } else if (window.innerWidth < 768) {
                this.state.container.style.display = 'block';
                if (this.state.building) {
                    this.state.building.style.width = '200px';
                    this.state.building.style.height = '160px';
                    this.state.building.style.transform = 'translateX(-50%) scale(0.8)';
                }
            } else if (window.innerWidth < 1024) {
                this.state.container.style.display = 'block';
                if (this.state.building) {
                    this.state.building.style.width = '240px';
                    this.state.building.style.height = '190px';
                    this.state.building.style.transform = 'translateX(-50%) scale(0.9)';
                }
            } else {
                this.state.container.style.display = 'block';
                if (this.state.building) {
                    this.state.building.style.width = '280px';
                    this.state.building.style.height = '220px';
                    this.state.building.style.transform = 'translateX(-50%)';
                }
            }
        };
        
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
    }
    
    handleResize() {
        this.setupResizeListener();
    }
    
    // Public API methods
    destroy() {
        this.debug('Destroying building parallax manager');
        
        if (this.state.observer) {
            this.state.observer.disconnect();
        }
        
        this.stopParallaxAnimation();
        
        if (this.state.container) {
            this.state.container.remove();
        }
        
        // Clean up fallback trigger if created
        const fallbackTrigger = document.getElementById('fallback-trigger-' + this.state.instanceId.slice(-6));
        if (fallbackTrigger) {
            fallbackTrigger.remove();
        }
        
        this.state = {
            initialized: false,
            building: null,
            container: null,
            missionElement: null,
            isVisible: false,
            observer: null,
            instanceId: null
        };
        
        if (window.activeBuildingManager === this) {
            window.activeBuildingManager = null;
        }
    }
    
    recreate() {
        this.destroy();
        setTimeout(() => this.initialize(), 100);
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
}

// SINGLE INITIALIZATION - Prevent duplicates
function initializeFixedBuildingManager() {
    try {
        // Check if we're on the about page
        const isAboutPage = window.location.pathname.includes('about') || 
                           window.location.hash.includes('about') ||
                           document.title.toLowerCase().includes('about');
        
        if (!isAboutPage) {
            console.log('[FixedBuildingManager] Not on about page, skipping initialization');
            return;
        }
        
        // Prevent multiple initializations
        if (window.buildingManagerInitialized) {
            console.log('[FixedBuildingManager] Already initialized, skipping');
            return;
        }
        
        window.buildingManagerInitialized = true;
        
        // Create manager instance
        window.buildingManager = new FixedBuildingParallaxManager({
            debug: true
        });
        
        console.log('[FixedBuildingManager] ✅ Initialized successfully - No more duplicates!');
        
        // Expose utility functions
        window.debugBuilding = () => {
            if (window.buildingManager) {
                return window.buildingManager.getState();
            }
            return { error: 'No building manager found' };
        };
        
        window.recreateBuilding = () => {
            if (window.buildingManager) {
                window.buildingManager.recreate();
                console.log('🔄 Building recreated');
            }
        };
        
        window.countBuildings = () => {
            const buildingElements = document.querySelectorAll(`
                [id*="building"], 
                [class*="building"], 
                [data-building-instance],
                [style*="HEART TECHNOLOGY"]
            `);
            console.log('Total building elements found:', buildingElements.length);
            buildingElements.forEach((el, i) => {
                console.log(`Building ${i+1}:`, {
                    id: el.id,
                    className: el.className,
                    hasHeartText: el.textContent.includes('HEART TECHNOLOGY')
                });
            });
            return buildingElements.length;
        };
        
        window.cleanupAllBuildings = () => {
            if (window.buildingManager) {
                window.buildingManager.nuclearCleanup();
                console.log('🧹 All buildings cleaned up');
            }
        };
        
    } catch (error) {
        console.error('[FixedBuildingManager] Initialization failed:', error);
        window.buildingManagerInitialized = false;
    }
}

// SINGLE initialization point
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFixedBuildingManager);
} else {
    // DOM already loaded
    setTimeout(initializeFixedBuildingManager, 100);
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FixedBuildingParallaxManager;
}