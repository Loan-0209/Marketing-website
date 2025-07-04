/**
 * AI Campus Integration Module
 * Integrates the RealisticModernCity with the AI Campus web page
 */

console.log(" AI CAMPUS INTEGRATION - Script loading");
console.log("Integration time:", new Date().toLocaleTimeString());

// Diagnostic function to check scene state
function diagnosticCheckScene() {
    console.log(" DIAGNOSTIC: Checking scene state");
    
    if (window.cityInstance && cityInstance.scene) {
        console.log("Scene exists:", cityInstance.scene);
        console.log("Scene children count:", cityInstance.scene.children.length);
        console.log("Buildings array length:", cityInstance.buildings.length);
        
        // Log all objects in the scene
        console.log("Scene hierarchy:");
        cityInstance.scene.traverse(object => {
            console.log(`- ${object.type}: ${object.name || 'unnamed'} (id: ${object.id})`);
            if (object.isMesh) {
                console.log(`  Material: ${object.material.type}, wireframe: ${object.material.wireframe}`);
                if (object.geometry) {
                    const vertexCount = object.geometry.attributes.position ? object.geometry.attributes.position.count : 'unknown';
                    console.log(`  Geometry: vertices=${vertexCount}`);
                }
            }
        });
    } else {
        console.warn(" City instance or scene not available");
    }
}

// Run diagnostic after a delay
setTimeout(diagnosticCheckScene, 2000);

/**
 * AI Campus Integration Module
 * This module integrates the RealisticModernCity class from realistic-city-core.js
 * into the HEART AI Campus website.
 */

class RealisticCityIntegration {
    constructor(containerId = 'threejs-container') {
        this.containerId = containerId;
        this.city = null;
        this.initialized = false;
        this.loadingElement = document.getElementById('loadingOverlay');
    }

    /**
     * Initialize the realistic city scene
     */
    async init() {
        try {
            // Kiểm tra container
            const container = document.getElementById(this.containerId);
            if (!container) {
                throw new Error(`Container with id ${this.containerId} not found`);
            }
            
            // Đảm bảo container có kích thước
            if (container.clientWidth === 0 || container.clientHeight === 0) {
                container.style.width = '100%';
                container.style.height = '500px';
                console.log('Set container dimensions to default values');
            }
            
            // Show loading overlay
            if (this.loadingElement) {
                this.loadingElement.style.display = 'flex';
            } else {
                // Tạo loading overlay nếu chưa có
                this.createLoadingOverlay();
            }
            
            // Kiểm tra và tải Three.js nếu cần
            if (typeof THREE === 'undefined') {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
            }
            
            // Kiểm tra và tải OrbitControls nếu cần
            if (typeof THREE.OrbitControls === 'undefined') {
                await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js');
            }
            
            // Create a new instance of RealisticModernCity
            this.city = new RealisticModernCity(this.containerId);
            
            // Ensure wireframe is off by default
            console.log('Integration: Ensuring wireframe mode is OFF');
            this.city.ensureWireframeOff();
            
            // Double-check all materials
            setTimeout(() => {
                console.log('Integration: Double-checking all materials...');
                this.city.ensureWireframeOff();
                console.log('Integration: Material verification complete');
            }, 500);
            
            // Cập nhật thống kê hiệu suất
            this.startPerformanceUpdates();
            
            // Hide loading overlay
            if (this.loadingElement) {
                setTimeout(() => {
                    this.loadingElement.style.display = 'none';
                }, 1000);
            }
            
            // Set up window resize handler
            window.addEventListener('resize', () => this.handleResize());
            
            // Return success
            this.initialized = true;
            console.log('RealisticCityIntegration initialized successfully');
            return { success: true };
        } catch (error) {
            console.error("Failed to initialize realistic city:", error);
            
            // Hide loading overlay on error
            if (this.loadingElement) {
                this.loadingElement.style.display = 'none';
            }
            
            return { success: false, error: error.message };
        }
    }

    /**
     * Handle window resize event
     */
    handleResize() {
        if (this.initialized && this.city) {
            this.city.handleResize();
            console.log('RealisticCityIntegration: Resize handled');
        }
    }
    
    /**
     * Tải script từ URL
     */
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            
            script.onload = () => {
                console.log(`Loaded script: ${url}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`Error loading script: ${url}`);
                reject(new Error(`Failed to load script: ${url}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * Tạo loading overlay nếu chưa có
     */
    createLoadingOverlay() {
        // Kiểm tra xem đã có loading overlay chưa
        if (!document.getElementById('cityLoadingOverlay')) {
            // Tạo loading overlay
            const overlay = document.createElement('div');
            overlay.id = 'cityLoadingOverlay';
            overlay.className = 'city-loading-overlay';
            overlay.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div class="city-loading-spinner"></div>
                    <div style="margin-top: 15px;">Loading Smart City...</div>
                </div>
            `;
            
            // Thêm vào container
            const container = document.getElementById(this.containerId);
            if (container) {
                container.style.position = 'relative';
                container.appendChild(overlay);
                this.loadingElement = overlay;
            }
        }
    }
    
    /**
     * Cập nhật thống kê hiệu suất
     */
    startPerformanceUpdates() {
        if (!this.initialized || !this.city) return;
        
        // Cập nhật thống kê mỗi giây
        this.statsInterval = setInterval(() => {
            if (!this.city) {
                clearInterval(this.statsInterval);
                return;
            }
            
            // Cập nhật UI thống kê nếu có
            const fpsElement = document.querySelector('.fps-value');
            const objectsElement = document.querySelector('.objects-value');
            const trianglesElement = document.querySelector('.triangles-value');
            
            if (fpsElement) fpsElement.textContent = this.city.stats.fps || 0;
            if (objectsElement) objectsElement.textContent = this.city.buildings.length || 0;
            
            // Tính tổng số tam giác
            let triangleCount = 0;
            this.city.buildings.forEach(building => {
                if (building.mesh && building.mesh.geometry) {
                    triangleCount += building.mesh.geometry.attributes.position.count / 3;
                }
            });
            
            if (trianglesElement) trianglesElement.textContent = Math.round(triangleCount);
        }, 1000);
    }

    /**
     * Toggle wireframe mode
     */
    toggleWireframe() {
        if (this.city) {
            const result = this.city.toggleWireframe();
            console.log('Integration: Wireframe toggled to:', result ? 'ON' : 'OFF');
            
            // If turning wireframe off, ensure it's really off
            if (!result) {
                setTimeout(() => this.city.ensureWireframeOff(), 100);
            }
            
            return result;
        }
        return false;
    }

    /**
     * Update time of day
     * @param {string} timeOfDay - 'morning', 'noon', 'evening', or 'night'
     */
    updateTimeOfDay(timeOfDay) {
        if (this.city && this.initialized) {
            this.city.timeOfDay = timeOfDay;
            this.city.updateTimeOfDay();
        }
    }

    /**
     * Toggle auto-rotation
     */
    toggleAutoRotate() {
        if (this.city && this.initialized && this.city.controls) {
            this.city.controls.autoRotate = !this.city.controls.autoRotate;
            return this.city.controls.autoRotate;
        }
        return false;
    }

    /**
     * Set camera view
     * @param {string} view - 'overview', 'aerial', 'ground'
     */
    setView(view) {
        if (!this.city || !this.initialized) return;
        
        switch(view) {
            case 'overview':
                this.city.camera.position.set(30, 30, 30);
                break;
            case 'aerial':
                this.city.camera.position.set(0, 50, 0);
                break;
            case 'ground':
                this.city.camera.position.set(5, 2, 5);
                break;
        }
        
        this.city.camera.lookAt(0, 0, 0);
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.initialized) {
            // Xóa interval cập nhật thống kê
            if (this.statsInterval) {
                clearInterval(this.statsInterval);
                this.statsInterval = null;
            }
            
            // Remove event listeners
            window.removeEventListener('resize', () => this.handleResize());
            
            // Dispose of city resources
            if (this.city) {
                // Xóa các đối tượng trong scene
                if (this.city.scene) {
                    while(this.city.scene.children.length > 0){ 
                        const object = this.city.scene.children[0];
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach(material => material.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                        this.city.scene.remove(object);
                    }
                }
                
                // Xóa renderer
                if (this.city.renderer) {
                    this.city.renderer.dispose();
                    this.city.renderer.forceContextLoss();
                    this.city.renderer.domElement = null;
                    this.city.renderer = null;
                }
                
                this.city = null;
            }
            
            this.initialized = false;
            console.log('RealisticCityIntegration disposed');
        }
    }

    /**
     * Helper to dispose of scene objects
     */
    disposeScene(scene) {
        scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}
