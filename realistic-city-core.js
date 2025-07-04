console.clear();
console.log("🚀 DIAGNOSTIC START - Script is running");
console.log("Current time:", new Date().toLocaleTimeString());
console.log("THREE.js available:", typeof THREE !== 'undefined');

// Test basic scene population
function emergencyTest() {
    console.log("🧪 EMERGENCY TEST: Adding red test cube");
    
    // Create scene, camera, renderer if not exists
    if (typeof scene === 'undefined') {
        window.scene = new THREE.Scene();
        window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        window.renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        camera.position.z = 30;
    }
    
    // Force add test object
    const testCube = new THREE.Mesh(
        new THREE.BoxGeometry(5, 15, 5),
        new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false})
    );
    testCube.position.set(0, 7.5, 0);
    scene.add(testCube);
    
    console.log("✅ Test cube added. Scene children:", scene.children.length);
    renderer.render(scene, camera);
    
    return testCube;
}

// Run test immediately
setTimeout(emergencyTest, 100);

/**
 * RealisticModernCity Core Class
 * Extracted from realistic-modern-city.html
 */

class RealisticModernCity {
    constructor(containerId = 'city-canvas') {
        this.containerId = containerId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.buildings = [];
        this.environmentCube = null;
        this.cityFeatures = null;
        this.modelLoader = null;
        this.loadingModels = false;
        this.modelsLoaded = false;
        
        this.modes = {
            interior: false,
            wireframe: false,
            buildingInfo: false
        };
        
        this.timeOfDay = 'noon';
        this.stats = {
            buildingCount: 0,
            floorCount: 0,
            glassArea: 0,
            fps: 0,
            objectCount: 0,
            triangleCount: 0
        };
        
        this.time = 0;
        this.fpsCounter = 0;
        this.lastTime = performance.now();
        this.selectedBuilding = null;
        
        // Initialize the scene
        this.init();
    }

    // Hàm đảm bảo wireframe luôn tắt
    ensureWireframeOff() {
        console.log('Ensuring wireframe mode is OFF for all materials...');
        // Đảm bảo wireframe luôn tắt
        this.modes.wireframe = false;
        
        // Fix for buildings
        this.buildings.forEach(building => {
            if (building.mesh && building.mesh.material) {
                building.mesh.material.wireframe = false;
                building.mesh.material.transparent = true;
                building.mesh.material.opacity = 0.8; // Slightly more opaque
                building.mesh.material.side = THREE.DoubleSide;
                building.mesh.material.needsUpdate = true;
            }
        });
        
        // Ensure all scene objects have wireframe off
        this.scene.traverse(object => {
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => {
                        material.wireframe = false;
                        material.transparent = true;
                        material.opacity = 0.8;
                        material.side = THREE.DoubleSide;
                        material.needsUpdate = true;
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
        
        // Update renderer to ensure changes take effect
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        console.log('WIREFRAME FIX COMPLETE');
    }

    /**
     * Update scene statistics (object count, triangle count)
     */
    updateSceneStats() {
        if (!this.scene) return;
        
        let objectCount = 0;
        let triangleCount = 0;
        
        this.scene.traverse(object => {
            if (object.isMesh) {
                objectCount++;
                
                // Count triangles if geometry exists
                if (object.geometry) {
                    if (object.geometry.index) {
                        triangleCount += object.geometry.index.count / 3;
                    } else if (object.geometry.attributes && object.geometry.attributes.position) {
                        triangleCount += object.geometry.attributes.position.count / 3;
                    }
                }
            }
        });
        
        this.stats.objectCount = objectCount;
        this.stats.triangleCount = Math.round(triangleCount);
        
        // Update UI if available
        if (typeof updatePerformanceStats === 'function') {
            updatePerformanceStats(this.stats);
        }
    }
    
    /**
     * Run comprehensive diagnostic on the scene
     */
    runDiagnostic() {
        console.log('\n🔍 RUNNING COMPREHENSIVE DIAGNOSTIC');
        console.log('Current time:', new Date().toLocaleTimeString());
        
        // Check if scene exists
        if (!this.scene) {
            console.error('❌ CRITICAL ERROR: Scene is undefined');
            return;
        }
        
        // Check scene children
        console.log(`Scene has ${this.scene.children.length} children`);
        
        // Count meshes and other object types
        let meshCount = 0;
        let lightCount = 0;
        let cameraCount = 0;
        let otherCount = 0;
        let wireframeCount = 0;
        let solidCount = 0;
        
        this.scene.traverse(object => {
            if (object.isMesh) {
                meshCount++;
                
                // Check material
                if (object.material) {
                    if (object.material.wireframe) {
                        wireframeCount++;
                        console.warn(`⚠️ Wireframe material found on: ${object.name || 'unnamed'} (id: ${object.id})`);
                    } else {
                        solidCount++;
                    }
                }
            } else if (object.isLight) {
                lightCount++;
            } else if (object.isCamera) {
                cameraCount++;
            } else {
                otherCount++;
            }
        });
        
        console.log(`📊 Scene composition: ${meshCount} meshes, ${lightCount} lights, ${cameraCount} cameras, ${otherCount} other objects`);
        console.log(`📊 Material status: ${solidCount} solid objects, ${wireframeCount} wireframe objects`);
        
        // Check buildings array
        console.log(`📊 Buildings array has ${this.buildings.length} buildings`);
        
        // Check if buildings are in scene
        let buildingsInScene = 0;
        this.buildings.forEach((building, index) => {
            if (building.mesh && this.scene.children.includes(building.mesh)) {
                buildingsInScene++;
            } else if (building.mesh) {
                console.warn(`⚠️ Building ${index} exists but is not in scene`);
            } else {
                console.warn(`⚠️ Building ${index} has no mesh`);
            }
        });
        
        console.log(`📊 Buildings in scene: ${buildingsInScene} out of ${this.buildings.length}`);
        
        // Update stats
        this.updateSceneStats();
        console.log(`📊 Stats: ${this.stats.objectCount} objects, ${this.stats.triangleCount} triangles`);
        
        // Force render
        if (this.renderer && this.camera) {
            this.renderer.render(this.scene, this.camera);
            console.log('✅ Forced render complete');
        }
        
        // Emergency fix if no objects are visible
        if (meshCount === 0 || this.stats.objectCount === 0) {
            console.warn('⚠️ NO OBJECTS DETECTED - ATTEMPTING EMERGENCY FIX');
            this.emergencyAddTestObject();
        }
    }
    
    /**
     * Emergency function to add a test object to the scene
     */
    emergencyAddTestObject() {
        console.log('🚨 EMERGENCY: Adding test objects to scene');
        
        // Create a red cube
        const geometry = new THREE.BoxGeometry(10, 20, 10);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 10, 0);
        cube.name = 'EMERGENCY_TEST_CUBE';
        
        // Add to scene
        this.scene.add(cube);
        console.log(`✅ Emergency test cube added. Scene now has ${this.scene.children.length} children`);
        
        // Create a blue sphere
        const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(15, 5, 15);
        sphere.name = 'EMERGENCY_TEST_SPHERE';
        
        // Add to scene
        this.scene.add(sphere);
        
        // Force render
        if (this.renderer && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        // Update stats
        this.updateSceneStats();
    }

    init() {
        console.log('Initializing RealisticModernCity...');
        
        try {
            // Create scene
            this.scene = new THREE.Scene();
            
            // Get container and its dimensions
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container with ID ${this.containerId} not found`);
                return;
            }
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            console.log(`Container dimensions: ${width}x${height}`);
            
            if (width === 0 || height === 0) {
                console.warn('Container has zero width or height, using default values');
                container.style.width = '100%';
                container.style.height = '500px';
            }
            
            // Create camera with correct aspect ratio
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.set(30, 30, 30);
            this.camera.lookAt(0, 0, 0);
            
            // Create renderer with correct size and enable high quality rendering
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                preserveDrawingBuffer: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.physicallyCorrectLights = true;
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            
            // Append renderer to container
            container.appendChild(this.renderer.domElement);
            
            // Initialize model loader
            this.initModelLoader();
            console.log('Model loader initialized');
            
            // Setup lighting
            this.setupLighting();
            console.log('Lighting setup complete');
            
            // Setup controls
            this.setupControls();
            console.log('Controls setup complete');
            
            // Create environment
            this.createEnvironment();
            console.log('Environment created');
            
            // Generate city district
            this.generateCityDistrict();
            console.log('City district generated');
            
            // Initialize additional city features
            this.initializeAdditionalFeatures();
            console.log('Additional features initialized');
            
            // Setup event listeners
            this.setupEventListeners();
            console.log('Event listeners setup complete');
            
            // Setup raycasting
            this.setupRaycasting();
            console.log('Raycasting setup complete');
            
            // Start animation loop
            this.animate();
            console.log('Animation loop started');
            
            return true;
        } catch (error) {
            console.error('Error initializing RealisticModernCity:', error);
        }
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 200, 100);
        directionalLight.castShadow = true;
        
        // Cấu hình shadow
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        
        this.scene.add(directionalLight);
        
        // Hemisphere light (sky and ground)
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x444444, 0.5);
        this.scene.add(hemisphereLight);
    }

    setupControls() {
        // Tạo OrbitControls để điều khiển camera
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        
        // Mảng lưu vị trí đã sử dụng để tránh chồng chéo
        const usedPositions = [];
        
        // Tạo các tòa nhà
        for (let i = 0; i < buildingCount; i++) {
            let x, z, width, depth;
            let attempts = 0;
            let validPosition = false;
            
            // Tìm vị trí hợp lệ không chồng chéo
            while (!validPosition && attempts < 20) {
                // Vị trí ngẫu nhiên trong khu vực thành phố
                x = Math.random() * citySize - halfCitySize;
                z = Math.random() * citySize - halfCitySize;
                
                // Kích thước ngẫu nhiên cho tòa nhà
                width = 2 + Math.random() * 6;
                const height = 5 + Math.random() * 35;
                depth = 2 + Math.random() * 6;
                
                // Kiểm tra chồng chéo
                validPosition = true;
                for (const pos of usedPositions) {
                    const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(z - pos.z, 2));
                    if (distance < (width/2 + pos.width/2 + 1)) {
                        validPosition = false;
                        break;
                    }
                }
                
                attempts++;
            }
            
            if (validPosition) {
                // Tạo tòa nhà
                this.createBuilding(x, 0, z, width, Math.random() * 35 + 5, depth);
                
                // Lưu vị trí đã sử dụng
                usedPositions.push({x, z, width, depth});
            }
        }
        
        // Tạo một số tòa nhà cao tầng ở trung tâm
        for (let i = 0; i < 5; i++) {
            const angle = i * Math.PI * 2 / 5;
            const distance = 15;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const width = 4 + Math.random() * 4;
            const height = 40 + Math.random() * 20;
            const depth = 4 + Math.random() * 4;
            
            this.createBuilding(x, 0, z, width, height, depth);
        }
        
        // Tạo tòa nhà cao nhất ở trung tâm
        this.createBuilding(0, 0, 0, 8, 60, 8);
        
        // Cập nhật thống kê
        this.stats.buildingCount = this.buildings.length;
        console.log(`Generated ${this.buildings.length} buildings`);
    }
    
    createBuilding(x, y, z, width, height, depth) {
        try {
            console.log(`🏢 DIAGNOSTIC: Creating building at (${x}, ${y}, ${z}) with dimensions ${width}x${height}x${depth}`);
            
            // Tạo geometry cho tòa nhà
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            console.log('✅ Geometry created:', buildingGeometry);
            
            // Tạo material cho tòa nhà (kính màu xanh trong suốt)
            const buildingMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x0066aa, // Darker blue for better visibility
                metalness: 0.9,
                roughness: 0.1,
                transparent: true,
                opacity: 0.8, // More opaque
                reflectivity: 1.0,
                transmission: 0.5,
                wireframe: false, // Explicitly set wireframe to false
                side: THREE.DoubleSide // Render both sides
            });
            
            // Ensure material is properly configured
            buildingMaterial.needsUpdate = true;
            console.log('✅ Material created with wireframe:', buildingMaterial.wireframe);
            
            // Tạo mesh cho tòa nhà
            const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
            buildingMesh.position.set(x, y + height/2, z);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            buildingMesh.name = `Building_${this.buildings.length}`; // Add name for easier debugging
            
            console.log('✅ Building mesh created:', buildingMesh);
            
            // CRITICAL: Check if scene exists before adding
            if (!this.scene) {
                console.error('❌ CRITICAL ERROR: Scene is undefined, cannot add building');
                return null;
            }
            
            // Thêm vào scene
            this.scene.add(buildingMesh);
            
            // Verify the mesh was added to the scene
            const isMeshInScene = this.scene.children.includes(buildingMesh);
            console.log(`✅ Building added to scene: ${isMeshInScene}. Scene now has ${this.scene.children.length} children`);
            
            // Tính số tầng dựa trên chiều cao
            const floors = Math.floor(height / 3);
            
            // Tính diện tích kính
            const glassArea = 2 * (width * height + depth * height);
            
            // Cập nhật thống kê
            this.stats.floorCount += floors;
            this.stats.glassArea += glassArea;
            
            // Lưu thông tin tòa nhà
            const building = {
                mesh: buildingMesh,
                components: [buildingMesh],
                position: { x, y, z },
                dimensions: { width, height, depth },
                floors: floors
            };
            
            this.buildings.push(building);
            
            // Update scene statistics
            this.updateSceneStats();
            
            return building;
        } catch (error) {
            console.error('❌ Error creating building:', error);
            return null;
        }
    }

    setupEventListeners() {
        // Xử lý sự kiện resize cửa sổ
        window.addEventListener('resize', () => this.handleResize());
        
        // Xử lý sự kiện click chuột để chọn tòa nhà
        const canvas = document.getElementById(this.containerId);
        if (canvas) {
            canvas.addEventListener('click', (event) => this.handleClick(event));
        }
    }

    setupRaycasting() {
        // Khởi tạo raycaster để chọn tòa nhà
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    toggleWireframe() {
        this.modes.wireframe = !this.modes.wireframe;
        console.log('Toggling wireframe mode:', this.modes.wireframe ? 'ON' : 'OFF');
        
        this.buildings.forEach(building => {
            if (building.mesh && building.mesh.material) {
                building.mesh.material.wireframe = this.modes.wireframe;
                building.mesh.material.needsUpdate = true;
                
                // If turning wireframe off, ensure other properties are set correctly
                if (!this.modes.wireframe) {
                    building.mesh.material.transparent = true;
                    building.mesh.material.opacity = 0.8;
                    building.mesh.material.side = THREE.DoubleSide;
                }
            }
        });
        
        // Also apply to environment objects
        this.scene.traverse(object => {
            if (object.isMesh && object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => {
                        mat.wireframe = this.modes.wireframe;
                        mat.needsUpdate = true;
                    });
                } else {
                    object.material.wireframe = this.modes.wireframe;
                    object.material.needsUpdate = true;
                }
            }
        });
        
        return this.modes.wireframe;
    }
    
    toggleAutoRotate() {
        if (this.controls) {
            this.controls.autoRotate = !this.controls.autoRotate;
            return this.controls.autoRotate;
        }
        return false;
    }
    
    setView(viewName) {
        switch (viewName) {
            case 'top':
                this.camera.position.set(0, 100, 0);
                this.camera.lookAt(0, 0, 0);
                break;
            case 'front':
                this.camera.position.set(0, 20, 100);
                this.camera.lookAt(0, 20, 0);
                break;
            case 'side':
                this.camera.position.set(100, 20, 0);
                this.camera.lookAt(0, 20, 0);
                break;
            case 'isometric':
                this.camera.position.set(50, 50, 50);
                this.camera.lookAt(0, 0, 0);
                break;
            default:
                return false;
        }
        return true;
    }
    
    updateTimeOfDay(time) {
        this.timeOfDay = time;
        
        // Adjust lighting based on time of day
        switch (time) {
            case 'dawn':
                // Warm, soft light from low angle
                break;
            case 'noon':
                // Bright, direct light from above
                break;
            case 'dusk':
                // Warm, orange light from low angle
                break;
            case 'night':
                // Low blue light, mostly ambient
                break;
            default:
                return false;
        }
        
        return true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update FPS counter
        const now = performance.now();
        const delta = now - this.lastTime;
        this.fpsCounter++;
        
        if (delta >= 1000) {
            this.stats.fps = Math.round((this.fpsCounter * 1000) / delta);
            this.fpsCounter = 0;
            this.lastTime = now;
            
            // Run diagnostic every second
            this.runDiagnostic();
            
            // Periodically check and fix any wireframe issues
            if (this.modes.wireframe === false) {
                // Check if any buildings are incorrectly in wireframe mode
                let needsFix = false;
                this.buildings.forEach(building => {
                    if (building.mesh && building.mesh.material && building.mesh.material.wireframe === true) {
                        needsFix = true;
                    }
                });
                
                if (needsFix) {
                    console.log('Fixing wireframe issues...');
                    this.ensureWireframeOff();
                }
            }
        }
        
        // Animation logic - xoay nhẹ các tòa nhà nếu đang ở chế độ auto-rotate
        if (this.controls && this.controls.autoRotate) {
            this.time += 0.01;
            this.buildings.forEach((building, index) => {
                building.mesh.rotation.y = Math.sin(this.time + index) * 0.01;
            });
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    getStats() {
        return {
            buildingCount: this.buildings.length,
            floorCount: this.stats.floorCount,
            glassArea: Math.round(this.stats.glassArea),
            fps: this.stats.fps,
            objectCount: this.stats.objectCount || 0,
            triangleCount: this.stats.triangleCount || 0
        };
    }
    
    /**
     * Initialize the model loader
     */
    initModelLoader() {
        try {
            // Check if ModelLoader is available
            if (typeof ModelLoader === 'undefined') {
                console.warn('ModelLoader not found, loading script...');
                
                // Create and load the script
                const script = document.createElement('script');
                script.src = 'model-loader.js';
                script.async = true;
                
                script.onload = () => {
                    console.log('ModelLoader script loaded successfully');
                    if (typeof ModelLoader !== 'undefined') {
                        this.modelLoader = new ModelLoader(this.scene);
                        this.loadBuildingModels();
                    } else {
                        console.error('ModelLoader still undefined after loading script');
                    }
                };
                
                script.onerror = (err) => {
                    console.error('Failed to load ModelLoader script:', err);
                };
                
                document.head.appendChild(script);
            } else {
                // ModelLoader is already available
                this.modelLoader = new ModelLoader(this.scene);
                this.loadBuildingModels();
            }
        } catch (error) {
            console.error('Error initializing model loader:', error);
        }
    }
    
    /**
     * Load building models using DiagnosticModelLoader
     */
    loadBuildingModels() {
        console.log('🏢 Loading building models with DiagnosticModelLoader...');
        
        // Check if we already have models loaded
        if (this.loadingModels || this.modelsLoaded) {
            console.log('Models already loading or loaded, skipping loadBuildingModels');
            return;
        }
        
        this.loadingModels = true;
        
        // Initialize DiagnosticModelLoader if available
        if (typeof DiagnosticModelLoader !== 'undefined') {
            console.log('✅ Using DiagnosticModelLoader for enhanced model loading');
            this.diagnosticLoader = new DiagnosticModelLoader(this.scene);
        } else {
            console.warn('⚠️ DiagnosticModelLoader not available, falling back to standard loader');
            if (!this.modelLoader) {
                console.error('❌ ModelLoader also not available - cannot load building models');
                // Create emergency buildings instead
                this.createEmergencyBuildings();
                return;
            }
        }
        
        // Define building models to load with positions and options
        const buildingModels = [
            // Main buildings using confirmed working model
            { url: 'models/building1.gltf', position: {x: 0, y: 0, z: 0}, options: {scale: 2.0, name: 'building_center'} },
            { url: 'models/building1.gltf', position: {x: 20, y: 0, z: 20}, options: {scale: 3.0, name: 'building_ne'} },
            { url: 'models/building1.gltf', position: {x: -20, y: 0, z: 20}, options: {scale: 2.5, name: 'building_nw'} },
            { url: 'models/building1.gltf', position: {x: 20, y: 0, z: -20}, options: {scale: 1.8, name: 'building_se'} },
            { url: 'models/building1.gltf', position: {x: -20, y: 0, z: -20}, options: {scale: 2.2, name: 'building_sw'} },
            
            // Add some procedural buildings by using non-existent models (will trigger fallback)
            { url: 'models/building_nonexistent.gltf', position: {x: 10, y: 0, z: 10}, options: {color: 0xcc0000, name: 'fallback_1'} },
            { url: 'models/building_nonexistent.gltf', position: {x: -10, y: 0, z: 10}, options: {color: 0x00cc00, name: 'fallback_2'} },
            { url: 'models/building_nonexistent.gltf', position: {x: 10, y: 0, z: -10}, options: {color: 0x0000cc, name: 'fallback_3'} },
            { url: 'models/building_nonexistent.gltf', position: {x: -10, y: 0, z: -10}, options: {color: 0xcccc00, name: 'fallback_4'} }
        ];
        
        // Use DiagnosticModelLoader if available
        if (this.diagnosticLoader) {
            this.loadWithDiagnosticLoader(buildingModels);
        } else {
            this.loadWithStandardLoader(buildingModels);
        }
    },
    
    /**
     * Load models using the enhanced DiagnosticModelLoader
     */
    async loadWithDiagnosticLoader(buildingModels) {
        console.log(`Loading ${buildingModels.length} models with DiagnosticModelLoader...`);
        
        try {
            // Load all models with automatic fallback
            await this.diagnosticLoader.loadMultipleModels(buildingModels);
            
            // Log scene statistics
            const sceneInfo = this.diagnosticLoader.logSceneInfo();
            console.log(`Total meshes: ${sceneInfo.meshCount}`);
            console.log(`Total triangles: ${sceneInfo.triangleCount}`);
            
            // Update scene stats
            this.updateSceneStats();
            
            // Mark as loaded
            this.loadingModels = false;
            this.modelsLoaded = true;
            
            // Force a render update
            if (this.renderer) {
                this.renderer.render(this.scene, this.camera);
            }
            
            console.log('✅ All building models loaded successfully with DiagnosticModelLoader');
        } catch (error) {
            console.error('❌ Error loading models with DiagnosticModelLoader:', error);
            
            // Create emergency buildings as last resort
            this.createEmergencyBuildings();
            
            // Mark as loaded despite errors
            this.loadingModels = false;
            this.modelsLoaded = true;
        }
    },
    
    /**
     * Load models using the standard ModelLoader (fallback)
     */
    loadWithStandardLoader(buildingModels) {
        console.log(`Loading ${buildingModels.length} models with standard ModelLoader...`);
        
        // Load each building model
        let loadedCount = 0;
        let failedCount = 0;
        
        buildingModels.forEach((model, index) => {
            console.log(`Loading building model ${index + 1}/${buildingModels.length}: ${model.url}`);
            
            this.modelLoader.loadGLTF(model.url, (gltf) => {
                console.log(`✅ Successfully loaded building model: ${model.url}`);
                loadedCount++;
                
                // Position and scale the model
                gltf.scene.position.set(model.position.x, model.position.y, model.position.z);
                gltf.scene.scale.set(model.options.scale, model.options.scale, model.options.scale);
                
                // Add to scene
                this.scene.add(gltf.scene);
                console.log(`Added model to scene at position: ${model.position.x}, ${model.position.y}, ${model.position.z}`);
                
                // Check if we've loaded all models
                this.checkAllModelsLoaded(loadedCount, failedCount, buildingModels.length);
                
            }, (error) => {
                console.error(`❌ Failed to load building model: ${model.url}`, error);
                failedCount++;
                
                // Create a fallback building at this position
                const building = this.createBuilding(
                    model.position.x, 
                    model.position.y, 
                    model.position.z, 
                    5 + Math.random() * 5, 
                    10 + Math.random() * 20, 
                    5 + Math.random() * 5
                );
                
                console.log(`Created fallback building at position: ${model.position.x}, ${model.position.y}, ${model.position.z}`);
                
                // Check if we've loaded all models
                this.checkAllModelsLoaded(loadedCount, failedCount, buildingModels.length);
            });
        });
        
        // If no models were attempted to be loaded, create emergency buildings
        if (buildingModels.length === 0) {
            console.warn('No building models defined, creating emergency buildings');
            this.createEmergencyBuildings();
            this.loadingModels = false;
            this.modelsLoaded = true;
        }
    }    
                // Force update stats
                this.updateSceneStats();
                
                // Force render
                if (this.renderer && this.scene && this.camera) {
                    this.renderer.render(this.scene, this.camera);
                }
                
                // If no objects were added, create emergency buildings
                if (this.stats.objectCount === 0) {
                    console.warn('⚠️ No objects detected after model loading - creating emergency buildings');
                    this.createEmergencyBuildings();
                }
            })
            .catch(error => {
                console.error('❌ Error in model loading process:', error);
                this.loadingModels = false;
                
                // Create emergency buildings as fallback
                this.createEmergencyBuildings();
            });
    }
    
    /**
     * Create emergency buildings when model loading fails
     */
    createEmergencyBuildings() {
        console.log('🚨 CREATING EMERGENCY BUILDINGS');
        
        // Create several colorful buildings in different positions
        const positions = [
            { x: 0, z: 0, color: 0xff0000 },      // Red building in center
            { x: 20, z: 20, color: 0x00ff00 },     // Green building
            { x: -20, z: -20, color: 0x0000ff },   // Blue building
            { x: 20, z: -20, color: 0xffff00 },    // Yellow building
            { x: -20, z: 20, color: 0xff00ff }     // Purple building
        ];
        
        positions.forEach((pos, index) => {
            // Create geometry
            const width = 8;
            const height = 15 + (index * 5);
            const depth = 8;
            
            // Create material with distinct color
            const material = new THREE.MeshPhysicalMaterial({
                color: pos.color,
                metalness: 0.2,
                roughness: 0.1,
                transparent: true,
                opacity: 0.9,
                reflectivity: 1.0,
                side: THREE.DoubleSide,
                wireframe: false
            });
            
            // Create mesh
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(pos.x, height/2, pos.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.name = `EmergencyBuilding_${index}`;
            
            // Add to scene
            this.scene.add(mesh);
            console.log(`✅ Added emergency building ${index} at (${pos.x}, ${height/2}, ${pos.z})`);
            
            // Add to buildings array
            const building = {
                mesh: mesh,
                components: [mesh],
                position: { x: pos.x, y: 0, z: pos.z },
                dimensions: { width, height, depth },
                floors: Math.floor(height / 3)
            };
            
            this.buildings.push(building);
        });
        
        // Update stats
        this.updateSceneStats();
        
        // Force render
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    /**
     * Update scene statistics (object count, triangle count)
     */
    updateSceneStats() {
        if (!this.scene) return;
        
        let objectCount = 0;
        let triangleCount = 0;
        
        // Count objects and triangles in the scene
        this.scene.traverse(object => {
            if (object.isMesh) {
                objectCount++;
                
                // Count triangles
                if (object.geometry) {
                    if (object.geometry.index !== null) {
                        triangleCount += object.geometry.index.count / 3;
                    } else if (object.geometry.attributes && object.geometry.attributes.position) {
                        triangleCount += object.geometry.attributes.position.count / 3;
                    }
                }
            }
        });
        
        // Update stats
        this.stats.objectCount = objectCount;
        this.stats.triangleCount = Math.round(triangleCount);
        
        console.log(`Scene stats: ${objectCount} objects, ${Math.round(triangleCount)} triangles`);
    }
    
    /**
     * Initialize additional city features
     */
    initializeAdditionalFeatures() {
        try {
            // Load the RealisticCityFeatures class if available
            if (typeof RealisticCityFeatures !== 'undefined') {
                console.log('Initializing RealisticCityFeatures...');
                this.cityFeatures = new RealisticCityFeatures(this);
                this.cityFeatures.init();
                console.log('RealisticCityFeatures initialized successfully');
            } else {
                console.warn('RealisticCityFeatures class not found, skipping additional features');
            }
        } catch (error) {
            console.error('Error initializing additional features:', error);
        }
    }

    handleResize() {
        if (this.camera && this.renderer) {
            const container = document.getElementById(this.containerId);
            if (container) {
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(width, height);
                console.log('Resized renderer to:', width, height);
            } else {
                console.warn('Container element not found for resize');
            }
        }
    }
    
    handleClick(event) {
        // Tính toán vị trí chuột chuẩn hóa
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        
        this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        // Cập nhật raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Tìm các đối tượng giao với tia
        const buildingMeshes = this.buildings.map(building => building.mesh);
        const intersects = this.raycaster.intersectObjects(buildingMeshes);
        
        if (intersects.length > 0) {
            // Tìm tòa nhà được chọn
            const selectedMesh = intersects[0].object;
            const selectedBuilding = this.buildings.find(building => building.mesh === selectedMesh);
            
            if (selectedBuilding) {
                this.selectBuilding(selectedBuilding);
            }
        } else {
            // Bỏ chọn nếu click vào khoảng trống
            this.deselectBuilding();
        }
    }
    
    selectBuilding(building) {
        // Bỏ chọn tòa nhà hiện tại nếu có
        this.deselectBuilding();
        
        // Đánh dấu tòa nhà được chọn
        this.selectedBuilding = building;
        
        // Highlight tòa nhà được chọn
        const originalMaterial = building.mesh.material;
        building.originalMaterial = originalMaterial;
        
        building.mesh.material = new THREE.MeshPhysicalMaterial({
            color: 0xffcc00,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8,
            reflectivity: 1.0,
            transmission: 0.5
        });
        
        console.log('Selected building:', building);
    }
    
    deselectBuilding() {
        if (this.selectedBuilding && this.selectedBuilding.originalMaterial) {
            // Khôi phục material ban đầu
            this.selectedBuilding.mesh.material = this.selectedBuilding.originalMaterial;
            this.selectedBuilding = null;
        }
    }
}
