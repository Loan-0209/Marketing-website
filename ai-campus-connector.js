/**
 * AI Campus Connector
 * Kết nối class RealisticModernCity với CampusVisualizationApp trong master-plan.html
 */

class RealisticCityConnector {
    constructor() {
        this.cityIntegration = null;
        this.initialized = false;
    }

    /**
     * Khởi tạo kết nối
     * @param {CampusVisualizationApp} app - Instance của ứng dụng chính
     */
    async init(app) {
        try {
            console.log('Initializing RealisticCityConnector...');
            
            // Thêm script Three.js nếu chưa có
            if (!window.THREE) {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
            }
            
            // Thêm script RealisticModernCity nếu chưa có
            if (typeof RealisticModernCity === 'undefined') {
                await this.loadScript('realistic-city-core.js');
            }
            
            // Thêm script RealisticCityIntegration nếu chưa có
            if (typeof RealisticCityIntegration === 'undefined') {
                await this.loadScript('ai-campus-integration.js');
            }
            
            // Đảm bảo container tồn tại
            const container = document.getElementById('threejs-container');
            if (!container) {
                console.error('Container #threejs-container not found');
                return { success: false, error: 'Container #threejs-container not found' };
            }
            
            // Khởi tạo cityIntegration
            this.cityIntegration = new RealisticCityIntegration('threejs-container');
            const result = await this.cityIntegration.init();
            
            if (!result.success) {
                console.error('Failed to initialize city:', result.error);
                return { success: false, error: result.error };
            }
            
            // Đảm bảo wireframe luôn tắt
            console.log('Connector: Forcing wireframe mode OFF');
            this.cityIntegration.city.ensureWireframeOff();
            
            // Force update all materials
            this.cityIntegration.city.scene.traverse(object => {
                if (object.isMesh && object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(mat => {
                            mat.wireframe = false;
                            mat.transparent = true;
                            mat.opacity = 0.8;
                            mat.side = THREE.DoubleSide;
                            mat.needsUpdate = true;
                        });
                    } else {
                        object.material.wireframe = false;
                        object.material.transparent = true;
                        object.material.opacity = 0.8;
                        object.material.side = THREE.DoubleSide;
                        object.material.needsUpdate = true;
                    }
                }
            });
            
            console.log('Connector: Material updates complete');
            
            this.initialized = true;
            console.log('RealisticCityConnector initialized successfully');
            return { success: true };
        } catch (error) {
            console.error('Error initializing RealisticCityConnector:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Hàm trợ giúp để tải script động
     * @param {string} url - URL của script cần tải
     */
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = (err) => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
        });
    }
    
    /**
     * Kết nối với các hàm của CampusVisualizationApp
     * @param {CampusVisualizationApp} app - Instance của ứng dụng chính
     */
    connectToApp(app) {
        if (!this.initialized || !this.cityIntegration) {
            console.error('RealisticCityConnector not initialized');
            return false;
        }
        
        // Lưu trữ scene3D hiện tại nếu có
        if (app.scene3D) {
            this._originalScene3D = app.scene3D;
        }
        
        // Ghi đè các phương thức của scene3D trong app
        app.scene3D = {
            // Các phương thức cần thiết cho CampusVisualizationApp
            toggleAutoRotate: () => this.cityIntegration.toggleAutoRotate(),
            toggleLabels: () => console.log('Labels not implemented in RealisticModernCity'),
            toggleDayNight: () => {
                const currentTime = this.cityIntegration.city.timeOfDay;
                const newTime = (currentTime === 'noon' || currentTime === 'morning') ? 'night' : 'noon';
                this.cityIntegration.updateTimeOfDay(newTime);
                return newTime === 'noon' || newTime === 'morning';
            },
            toggleWireframe: () => this.cityIntegration.toggleWireframe(),
            setView: (view) => this.cityIntegration.setView(view),
            
            // Thuộc tính cần thiết
            isDayMode: true,
            
            // Các phương thức bổ sung cho renderer và camera
            renderer: this.cityIntegration.city.renderer,
            camera: this.cityIntegration.city.camera
        };
        
        // Cập nhật thống kê hiệu suất
        setInterval(() => {
            if (this.cityIntegration && this.cityIntegration.city) {
                const stats = this.cityIntegration.city.stats;
                
                // Cập nhật UI thống kê
                const buildingCountElement = document.getElementById('stat-buildings');
                const floorCountElement = document.getElementById('stat-floors');
                const glassAreaElement = document.getElementById('stat-glass');
                const fpsElement = document.getElementById('stat-fps');
                
                if (buildingCountElement) buildingCountElement.textContent = stats.buildingCount;
                if (floorCountElement) floorCountElement.textContent = stats.floorCount;
                if (glassAreaElement) glassAreaElement.textContent = `${Math.round(stats.glassArea)} m²`;
                if (fpsElement) fpsElement.textContent = `${stats.fps} FPS`;
            }
        }, 1000);
        
        return true;
    }
    
    /**
     * Xử lý sự kiện resize
     */
    handleResize() {
        if (this.initialized && this.cityIntegration) {
            this.cityIntegration.handleResize();
        }
    }
    
    /**
     * Giải phóng tài nguyên
     */
    dispose() {
        if (this.initialized && this.cityIntegration) {
            this.cityIntegration.dispose();
            this.cityIntegration = null;
            this.initialized = false;
            
            // Khôi phục scene3D ban đầu nếu có
            if (this._originalScene3D && window.app) {
                window.app.scene3D = this._originalScene3D;
                this._originalScene3D = null;
            }
        }
    }
}
