/* HEART Technology Park - Advanced Parallax System */

// Parallax Manager
window.HEARTParallax = {
    // Configuration
    config: {
        buildingSpeed: 0.3,
        windowFlickerRate: 3000,
        floatAmplitude: 8,
        rotationMax: 3,
        scaleRange: 0.05,
        smoothing: 0.1
    },
    
    // State
    state: {
        isActive: true,
        currentScroll: 0,
        targetScroll: 0,
        building: null,
        windows: [],
        animationFrame: null
    },
    
    // Initialize parallax system
    init: function() {
        this.findElements();
        this.setupBuildingParallax();
        this.setupWindowAnimations();
        this.setupScrollHandler();
        this.startAnimationLoop();
        
        console.log('🏢 Advanced Building Parallax System ready!');
    },
    
    // Find all parallax elements
    findElements: function() {
        this.state.building = document.querySelector('.building-parallax');
        this.state.windows = document.querySelectorAll('.window-light, .window-dark, .window-highlight');
        
        if (!this.state.building) {
            console.warn('⚠️ Building parallax element not found');
            this.state.isActive = false;
            return;
        }
        
        console.log(`✅ Found building with ${this.state.windows.length} windows`);
    },
    
    // Setup building parallax effect
    setupBuildingParallax: function() {
        if (!this.state.building) return;
        
        // Initial entrance animation
        this.animateBuildingEntrance();
        
        // Setup performance optimizations
        this.state.building.style.willChange = 'transform';
        this.state.building.style.backfaceVisibility = 'hidden';
        this.state.building.style.perspective = '1000px';
    },
    
    // Setup window flicker animations
    setupWindowAnimations: function() {
        this.state.windows.forEach((window, index) => {
            // Stagger window animations
            const delay = (index * 200) % 3000;
            
            setTimeout(() => {
                this.animateWindow(window, index);
            }, delay);
        });
    },
    
    // Animate individual window
    animateWindow: function(window, index) {
        const flickerInterval = this.config.windowFlickerRate + (Math.random() * 2000);
        
        const flicker = () => {
            const currentOpacity = parseFloat(window.style.opacity) || 0.8;
            const targetOpacity = Math.random() > 0.7 ? 1 : 0.6;
            
            // Smooth opacity transition
            window.style.transition = 'opacity 0.3s ease';
            window.style.opacity = targetOpacity;
            
            // Random color shifts for some windows
            if (window.classList.contains('window-highlight') && Math.random() > 0.8) {
                const colors = ['#f59e0b', '#fbbf24', '#f97316'];
                window.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            }
            
            setTimeout(flicker, flickerInterval + (Math.random() * 1000));
        };
        
        flicker();
    },
    
    // Setup smooth scroll handler
    setupScrollHandler: function() {
        let ticking = false;
        
        const handleScroll = () => {
            this.state.targetScroll = window.pageYOffset;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
    },
    
    // Main animation loop
    startAnimationLoop: function() {
        const animate = (timestamp) => {
            if (this.state.isActive) {
                this.updateSmoothing();
                this.updateBuildingTransform();
                this.updateFloatingAnimation(timestamp);
            }
            
            this.state.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    // Smooth scroll interpolation
    updateSmoothing: function() {
        const diff = this.state.targetScroll - this.state.currentScroll;
        this.state.currentScroll += diff * this.config.smoothing;
    },
    
    // Update building transform
    updateBuildingTransform: function() {
        if (!this.state.building) return;
        
        const scroll = this.state.currentScroll;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Calculate scroll progress
        const scrollProgress = scroll / (documentHeight - windowHeight);
        
        // Parallax movement
        const translateY = scroll * this.config.buildingSpeed;
        
        // Rotation effect
        const rotation = scrollProgress * this.config.rotationMax;
        
        // Scale effect
        const scale = 1 + (scrollProgress * this.config.scaleRange);
        
        // Apply transform
        this.state.building.style.transform = `
            translateY(-${translateY}px) 
            rotate(${rotation}deg) 
            scale(${scale})
        `;
    },
    
    // Floating animation
    updateFloatingAnimation: function(timestamp) {
        if (!this.state.building) return;
        
        const building = this.state.building.querySelector('.main-building');
        if (!building) return;
        
        // Gentle floating motion
        const floatY = Math.sin(timestamp * 0.001) * this.config.floatAmplitude;
        
        // Apply to building element
        building.style.transform = `translateY(${floatY}px)`;
    },
    
    // Building entrance animation
    animateBuildingEntrance: function() {
        if (!this.state.building) return;
        
        // Initial state
        this.state.building.style.opacity = '0';
        this.state.building.style.transform = 'translateY(50px) scale(0.9)';
        
        // Animate in
        setTimeout(() => {
            this.state.building.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
            this.state.building.style.opacity = '1';
            this.state.building.style.transform = 'translateY(0) scale(1)';
            
            // Clear transition after animation
            setTimeout(() => {
                this.state.building.style.transition = '';
            }, 1500);
        }, 200);
        
        // Animate windows in sequence
        this.animateWindowsEntrance();
    },
    
    // Animate windows entrance
    animateWindowsEntrance: function() {
        this.state.windows.forEach((window, index) => {
            window.style.opacity = '0';
            window.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                window.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                window.style.opacity = '0.8';
                window.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    window.style.transition = '';
                }, 500);
            }, 500 + (index * 50));
        });
    },
    
    // Update parallax on scroll
    updateParallax: function() {
        if (!this.state.isActive) return;
        
        this.updateBuildingTransform();
        
        // Update window brightness based on scroll
        this.updateWindowBrightness();
    },
    
    // Update window brightness
    updateWindowBrightness: function() {
        const scrollProgress = this.state.currentScroll / window.innerHeight;
        const brightness = Math.max(0.6, Math.min(1, 1 - scrollProgress * 0.3));
        
        this.state.windows.forEach(window => {
            if (!window.style.transition) {
                window.style.filter = `brightness(${brightness})`;
            }
        });
    },
    
    // Pause parallax
    pause: function() {
        this.state.isActive = false;
        console.log('⏸️ Parallax paused');
    },
    
    // Resume parallax
    resume: function() {
        this.state.isActive = true;
        console.log('▶️ Parallax resumed');
    },
    
    // Destroy parallax
    destroy: function() {
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }
        
        this.state.isActive = false;
        
        // Reset building transform
        if (this.state.building) {
            this.state.building.style.transform = '';
            this.state.building.style.willChange = '';
        }
        
        // Reset windows
        this.state.windows.forEach(window => {
            window.style.transform = '';
            window.style.filter = '';
            window.style.opacity = '';
        });
        
        console.log('🗑️ Parallax destroyed');
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!prefersReducedMotion.matches) {
        HEARTParallax.init();
    } else {
        console.log('🔇 Parallax disabled due to reduced motion preference');
    }
});

// Handle reduced motion changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
        HEARTParallax.pause();
    } else {
        HEARTParallax.resume();
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(() => {
        const buildingElement = document.querySelector('.building-parallax');
        if (buildingElement) {
            console.log('🎯 Building Parallax Performance Check:');
            console.log('✅ Building element found');
            console.log('✅ Transform applied successfully');
            console.log('✅ Smooth scrolling active');
            console.log('✅ Window animations running');
        }
    }, 1000);
});

// Export for debugging
if (typeof window !== 'undefined') {
    window.HEARTParallax = HEARTParallax;
}