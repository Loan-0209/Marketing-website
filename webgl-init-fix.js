/**
 * ROBUST WEBGL INITIALIZATION SYSTEM
 * Fixes all WebGL initialization errors for 3D Smart City
 */

// Enhanced WebGL Initialization
window.WebGLInitializer = {
    // Configuration options
    config: {
        maxRetries: 3,
        retryDelay: 1000,
        fallbackConfigs: [
            { 
                antialias: true, 
                alpha: false, 
                powerPreference: "high-performance",
                stencil: false,
                depth: true,
                preserveDrawingBuffer: false
            },
            { 
                antialias: false, 
                alpha: false, 
                powerPreference: "default",
                stencil: false,
                depth: true 
            },
            { 
                antialias: false, 
                alpha: false,
                failIfMajorPerformanceCaveat: false
            },
            { 
                // Minimal fallback
                alpha: false 
            }
        ]
    },

    /**
     * Enhanced THREE.js loading with multiple attempts
     */
    async loadThreeJS() {
        console.log('🔄 Loading THREE.js with enhanced error recovery...');
        
        // Check if already loaded
        if (typeof THREE !== 'undefined' && THREE.WebGLRenderer) {
            console.log('✅ THREE.js already loaded');
            return true;
        }

        const cdnUrls = [
            'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js',
            'https://unpkg.com/three@0.158.0/build/three.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js'
        ];

        for (let i = 0; i < cdnUrls.length; i++) {
            try {
                await this.loadScript(cdnUrls[i]);
                
                // Wait a moment for script to execute
                await new Promise(resolve => setTimeout(resolve, 500));
                
                if (typeof THREE !== 'undefined' && THREE.WebGLRenderer) {
                    console.log(`✅ THREE.js loaded successfully from CDN ${i + 1}`);
                    return true;
                }
            } catch (error) {
                console.warn(`❌ CDN ${i + 1} failed:`, error.message);
                continue;
            }
        }

        throw new Error('All THREE.js CDN attempts failed');
    },

    /**
     * Load script with promise
     */
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
            
            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Script load timeout')), 10000);
        });
    },

    /**
     * Ensure canvas container exists
     */
    ensureCanvasContainer() {
        let container = document.getElementById('canvas-container');
        
        if (!container) {
            console.log('📦 Creating canvas container...');
            container = document.createElement('div');
            container.id = 'canvas-container';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 1;
                background: #000;
                overflow: hidden;
            `;
            
            // Insert at beginning of body
            document.body.insertBefore(container, document.body.firstChild);
        }
        
        return container;
    },

    /**
     * Enhanced WebGL capability detection
     */
    detectWebGLCapabilities() {
        console.log('🔍 Detecting WebGL capabilities...');
        
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { 
                supported: false, 
                reason: 'WebGL not available in this browser' 
            };
        }

        try {
            // Test basic WebGL operations
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            if (gl.getError() !== gl.NO_ERROR) {
                return { 
                    supported: false, 
                    reason: 'WebGL operations failed - hardware issue' 
                };
            }

            // Get WebGL info
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            
            const capabilities = {
                supported: true,
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxViewportSize: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
            };

            if (debugInfo) {
                capabilities.unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                capabilities.unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }

            console.log('✅ WebGL capabilities detected:', capabilities);
            return capabilities;

        } catch (error) {
            return { 
                supported: false, 
                reason: `WebGL test failed: ${error.message}` 
            };
        } finally {
            // Clean up test canvas
            canvas.width = 1;
            canvas.height = 1;
        }
    },

    /**
     * Robust WebGL renderer creation with fallbacks
     */
    async createRenderer(container) {
        console.log('🎨 Creating WebGL renderer with fallbacks...');
        
        if (!container) {
            throw new Error('Canvas container is required');
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'main-canvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: block;
        `;

        for (let i = 0; i < this.config.fallbackConfigs.length; i++) {
            try {
                const config = { 
                    ...this.config.fallbackConfigs[i], 
                    canvas 
                };
                
                console.log(`🔄 Attempting renderer config ${i + 1}:`, config);
                
                const renderer = new THREE.WebGLRenderer(config);
                
                // Immediate validation
                const gl = renderer.getContext();
                if (!gl || gl.isContextLost()) {
                    console.warn(`❌ Config ${i + 1}: Context lost immediately`);
                    renderer.dispose();
                    continue;
                }

                // Test render
                const testScene = new THREE.Scene();
                const testCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
                
                try {
                    renderer.setSize(100, 100);
                    renderer.render(testScene, testCamera);
                    
                    // Check for WebGL errors
                    if (gl.getError() !== gl.NO_ERROR) {
                        console.warn(`❌ Config ${i + 1}: Render test failed`);
                        renderer.dispose();
                        continue;
                    }
                    
                } catch (renderError) {
                    console.warn(`❌ Config ${i + 1}: Render test exception:`, renderError);
                    renderer.dispose();
                    continue;
                }

                // Success! Configure and return
                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setClearColor(0x000011, 1);
                
                // Enable useful features if available
                try {
                    renderer.shadowMap.enabled = true;
                    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                } catch (e) {
                    console.warn('Shadow mapping not available');
                }

                // Add context loss/restore handlers
                this.setupContextHandlers(canvas, renderer);

                // Add canvas to container
                container.appendChild(canvas);

                console.log(`✅ WebGL renderer created with config ${i + 1}`);
                return {
                    success: true,
                    renderer,
                    canvas,
                    config: config
                };

            } catch (error) {
                console.warn(`❌ Config ${i + 1} failed:`, error.message);
                continue;
            }
        }

        throw new Error('All WebGL renderer configurations failed');
    },

    /**
     * Setup WebGL context loss/restore handlers
     */
    setupContextHandlers(canvas, renderer) {
        console.log('🛡️ Setting up WebGL context handlers...');
        
        canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.error('❌ WebGL context lost!');
            
            // Stop animation loop if running
            if (window.animationId) {
                cancelAnimationFrame(window.animationId);
                window.animationId = null;
            }

            // Show user notification
            this.showContextLostNotification();
        });

        canvas.addEventListener('webglcontextrestored', async () => {
            console.log('✅ WebGL context restored - attempting recovery...');
            
            try {
                // Hide notification
                this.hideContextLostNotification();
                
                // Restart the entire application
                setTimeout(() => {
                    if (typeof window.initSmartCity === 'function') {
                        console.log('🔄 Restarting Smart City application...');
                        window.initSmartCity();
                    } else {
                        console.warn('⚠️ No restart function available - reloading page...');
                        location.reload();
                    }
                }, 1000);

            } catch (error) {
                console.error('❌ Context restoration failed:', error);
                this.showError('WebGL context restoration failed. Please reload the page.');
            }
        });
    },

    /**
     * Show context lost notification
     */
    showContextLostNotification() {
        let notification = document.getElementById('webgl-context-lost');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'webgl-context-lost';
            notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 0, 0, 0.9);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    z-index: 10000;
                    text-align: center;
                    font-family: Arial, sans-serif;
                ">
                    <h3>WebGL Context Lost</h3>
                    <p>Graphics context was lost. Attempting to restore...</p>
                    <div style="margin-top: 10px;">
                        <div style="border: 2px solid white; border-radius: 50%; border-top: 2px solid transparent; width: 20px; height: 20px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            document.body.appendChild(notification);
        }
        notification.style.display = 'block';
    },

    /**
     * Hide context lost notification
     */
    hideContextLostNotification() {
        const notification = document.getElementById('webgl-context-lost');
        if (notification) {
            notification.style.display = 'none';
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        console.error('🚨 WebGL Error:', message);
        
        // Create error overlay
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div>
                    <h2>⚠️ WebGL Initialization Failed</h2>
                    <p>${message}</p>
                    <p style="margin-top: 20px; font-size: 14px; opacity: 0.7;">
                        This may be due to hardware limitations or browser settings.
                    </p>
                    <button onclick="location.reload()" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Reload Page</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    },

    /**
     * Complete WebGL initialization process
     */
    async initialize() {
        console.log('🚀 Starting enhanced WebGL initialization...');
        
        try {
            // Step 1: Load THREE.js
            await this.loadThreeJS();
            
            // Step 2: Detect WebGL capabilities
            const capabilities = this.detectWebGLCapabilities();
            if (!capabilities.supported) {
                throw new Error(capabilities.reason);
            }
            
            // Step 3: Ensure container exists
            const container = this.ensureCanvasContainer();
            
            // Step 4: Create renderer
            const rendererResult = await this.createRenderer(container);
            
            console.log('✅ WebGL initialization completed successfully!');
            
            return {
                success: true,
                renderer: rendererResult.renderer,
                canvas: rendererResult.canvas,
                container: container,
                capabilities: capabilities
            };
            
        } catch (error) {
            console.error('❌ WebGL initialization failed:', error);
            this.showError(error.message);
            
            return {
                success: false,
                error: error.message
            };
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📋 WebGL Initializer ready for use');
    });
} else {
    console.log('📋 WebGL Initializer ready for use');
}

// Export for global use
window.initWebGL = () => window.WebGLInitializer.initialize();