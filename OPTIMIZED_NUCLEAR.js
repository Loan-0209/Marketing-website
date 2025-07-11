/**
 * HEART Technology Park - OPTIMIZED NUCLEAR GRADIENT REMOVAL
 * Enhanced nuclear mode with improved reliability and features
 * Version: 2.0 - Post-backup optimization
 */

class NuclearGradientRemoval {
    constructor() {
        this.isActive = false;
        this.styleId = 'nuclear-gradient-removal';
        this.debugMode = true;
        
        this.log('🔥 Nuclear Gradient Removal System Initialized');
        this.init();
    }
    
    log(message, type = 'info') {
        if (this.debugMode) {
            const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '🔧';
            console.log(`${prefix} [Nuclear] ${message}`);
        }
    }
    
    init() {
        // Auto-activation after page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.autoActivate());
        } else {
            this.autoActivate();
        }
        
        // Setup global functions
        this.setupGlobalFunctions();
        
        this.log('Nuclear system ready for activation');
    }
    
    autoActivate() {
        // Auto-activate after 1 second delay
        setTimeout(() => {
            this.activate();
            this.log('Auto-activation completed', 'success');
        }, 1000);
    }
    
    activate() {
        if (this.isActive) {
            this.log('Nuclear mode already active');
            return;
        }
        
        this.log('Activating nuclear gradient removal...');
        
        // Remove existing styles
        this.deactivate();
        
        // Create nuclear CSS
        const style = document.createElement('style');
        style.id = this.styleId;
        style.innerHTML = this.getNuclearCSS();
        
        // Inject into head
        document.head.appendChild(style);
        
        this.isActive = true;
        this.log('Nuclear mode activated - Pure white background applied', 'success');
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('nuclearActivated'));
    }
    
    deactivate() {
        const existingStyle = document.getElementById(this.styleId);
        if (existingStyle) {
            existingStyle.remove();
            this.isActive = false;
            this.log('Nuclear mode deactivated');
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('nuclearDeactivated'));
        }
    }
    
    toggle() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
        return this.isActive;
    }
    
    getNuclearCSS() {
        return `
            /* HEART Technology Park - Nuclear Gradient Removal CSS */
            /* Version 2.0 - Optimized for maximum compatibility */
            
            /* Global background reset */
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
            
            /* Body and HTML reset */
            html, body { 
                background: #ffffff !important; 
                background-color: #ffffff !important;
                background-image: none !important;
                animation: none !important;
            }
            
            /* Preserve header styling */
            .header {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%) !important;
                background-image: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%) !important;
            }
            
            /* Enhanced HEART building preservation */
            .heart-building,
            .building,
            [class*="building"][class*="heart"],
            [id*="building"][id*="heart"],
            .building-demo {
                background: linear-gradient(135deg, #4338ca 0%, #7c3aed 100%) !important;
                background-image: linear-gradient(135deg, #4338ca 0%, #7c3aed 100%) !important;
                background-color: #4338ca !important;
                filter: contrast(1.2) brightness(1.15) drop-shadow(0 0 20px rgba(79, 70, 229, 0.4)) !important;
                transform: scale(1.08) !important;
                box-shadow: 
                    0 15px 45px rgba(0, 0, 0, 0.3), 
                    0 0 30px rgba(67, 56, 202, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
                border: none !important;
                outline: none !important;
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
            }
            
            /* Building text elements */
            .heart-building .text,
            .heart-building div[style*="HEART TECHNOLOGY"],
            .building .technology-header,
            .building .card-header {
                background: rgba(255, 193, 7, 0.95) !important;
                background-color: rgba(255, 193, 7, 0.95) !important;
                color: #1e40af !important;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
                border: none !important;
                outline: none !important;
            }
            
            .heart-building div[style*="AI Innovation Hub"],
            .building .card-body,
            .building .innovation-section {
                background: rgba(255, 255, 255, 0.98) !important;
                background-color: rgba(255, 255, 255, 0.98) !important;
                color: #1e40af !important;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
                border: none !important;
                outline: none !important;
            }
            
            /* Preserve button styling */
            .btn,
            button,
            .cta-button,
            .nav a {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            }
            
            .nuclear-btn,
            .btn.nuclear-btn {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
            }
            
            .contact-btn,
            .login-btn {
                background: #f59e0b !important;
            }
            
            .campus-3d {
                background: #10b981 !important;
            }
            
            .active {
                background: #fbbf24 !important;
                color: #1e40af !important;
            }
            
            /* Container adjustments */
            .container,
            .about-container .content-section {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: none !important;
            }
            
            /* Status and feedback elements */
            .status.success {
                background: #d4edda !important;
                color: #155724 !important;
            }
            
            .status.warning {
                background: #fff3cd !important;
                color: #856404 !important;
            }
            
            .status.info {
                background: #d1ecf1 !important;
                color: #0c5460 !important;
            }
            
            /* Override pseudo-elements */
            *::before,
            *::after {
                background: transparent !important;
                background-color: transparent !important;
                background-image: none !important;
            }
            
            /* Special overrides for stubborn elements */
            [style*="background"]:not(.heart-building):not(.header):not([class*="btn"]) {
                background: #ffffff !important;
                background-color: #ffffff !important;
                background-image: none !important;
            }
        `;
    }
    
    setupGlobalFunctions() {
        // Primary nuclear function
        window.nuclearGradientRemoval = () => this.activate();
        
        // Manual activation
        window.manualNuclearMode = () => this.activate();
        
        // Toggle function
        window.toggleNuclearMode = () => this.toggle();
        
        // Debug function
        window.debugBuilding = () => this.getDebugInfo();
        
        // Enhanced debug
        window.debugNuclear = () => this.getDetailedDebug();
        
        this.log('Global functions registered');
    }
    
    getDebugInfo() {
        const info = {
            nuclearActive: this.isActive,
            styleExists: !!document.getElementById(this.styleId),
            buildingElements: document.querySelectorAll('.heart-building, .building, [class*="building"]').length,
            backgroundElements: this.analyzeBackgrounds(),
            functions: {
                nuclearGradientRemoval: typeof window.nuclearGradientRemoval,
                manualNuclearMode: typeof window.manualNuclearMode,
                toggleNuclearMode: typeof window.toggleNuclearMode,
                debugBuilding: typeof window.debugBuilding
            }
        };
        
        console.table(info);
        this.log('Debug information displayed');
        return info;
    }
    
    getDetailedDebug() {
        const detailed = {
            system: {
                version: '2.0',
                active: this.isActive,
                debugMode: this.debugMode
            },
            dom: {
                styleElement: !!document.getElementById(this.styleId),
                buildingElements: document.querySelectorAll('.heart-building, .building').length,
                totalElements: document.querySelectorAll('*').length
            },
            performance: {
                activationTime: this.lastActivationTime || 'Not measured',
                memoryUsage: this.getMemoryUsage()
            }
        };
        
        console.log('🔍 Detailed Nuclear Debug:', detailed);
        return detailed;
    }
    
    analyzeBackgrounds() {
        const elements = document.querySelectorAll('*');
        let gradientCount = 0;
        let whiteCount = 0;
        
        elements.forEach(el => {
            const bg = window.getComputedStyle(el).background;
            if (bg.includes('gradient')) gradientCount++;
            if (bg.includes('rgb(255, 255, 255)') || bg.includes('#ffffff')) whiteCount++;
        });
        
        return { gradientCount, whiteCount, total: elements.length };
    }
    
    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            return {
                used: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024)
            };
        }
        return 'Not available';
    }
    
    // Event listener setup
    addEventListener() {
        window.addEventListener('nuclearActivated', () => {
            this.log('Nuclear activation event fired', 'success');
        });
        
        window.addEventListener('nuclearDeactivated', () => {
            this.log('Nuclear deactivation event fired');
        });
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    window.nuclearSystem = new NuclearGradientRemoval();
    
    // Additional safety check for About page
    if (window.location.pathname.includes('about') || document.title.includes('About')) {
        console.log('🎯 About page detected - Nuclear system optimized for this page');
    }
    
    console.log('🚀 HEART Nuclear System 2.0 - Fully Loaded');
    console.log('Available commands:');
    console.log('  window.nuclearGradientRemoval() - Activate nuclear mode');
    console.log('  window.toggleNuclearMode() - Toggle on/off');
    console.log('  window.debugBuilding() - Basic debug info');
    console.log('  window.debugNuclear() - Detailed debug info');
}