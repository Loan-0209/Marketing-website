/**
 * DiagnosticModelLoader - Enhanced model loader with fallback mechanisms
 * Provides detailed diagnostics and automatic fallback to procedural buildings
 */
class DiagnosticModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loadedCount = 0;
        this.failedCount = 0;
        this.modelCache = {};
        
        console.log("🔧 DiagnosticModelLoader initialized");
        
        // Check if THREE.js is available
        if (typeof THREE === 'undefined') {
            console.error("❌ THREE.js not available - DiagnosticModelLoader cannot function");
            return;
        }
        
        // Check if GLTFLoader is available, load if not
        this.ensureLoader();
    }
    
    /**
     * Ensure GLTFLoader is available
     */
    async ensureLoader() {
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.log("⚠️ GLTFLoader not found, attempting to load dynamically");
            
            try {
                await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js');
                console.log("✅ GLTFLoader loaded dynamically");
            } catch (error) {
                console.error("❌ Failed to load GLTFLoader:", error);
            }
        } else {
            console.log("✅ GLTFLoader already available");
        }
    }
    
    /**
     * Dynamically load a script
     */
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Load model with automatic fallback to procedural building
     * @param {string} modelPath - Path to the model file
     * @param {Object} position - Position {x, y, z} for the model
     * @param {Object} options - Additional options (scale, rotation, etc.)
     */
    async loadWithFallback(modelPath, position = {x: 0, y: 0, z: 0}, options = {}) {
        // Default options
        const config = {
            scale: options.scale || 1.0,
            rotation: options.rotation || {x: 0, y: 0, z: 0},
            color: options.color || 0x4682B4,
            name: options.name || `model_${this.loadedCount + this.failedCount}`,
            ...options
        };
        
        console.log(`🔄 Attempting to load: ${modelPath} at position:`, position);
        
        // Check if model is in cache
        if (this.modelCache[modelPath]) {
            console.log(`📦 Using cached model: ${modelPath}`);
            const cachedModel = this.modelCache[modelPath].clone();
            cachedModel.position.set(position.x, position.y, position.z);
            this.scene.add(cachedModel);
            this.loadedCount++;
            return cachedModel;
        }
        
        // Try different ports for the model
        const modelUrls = [
            modelPath,
            `http://localhost:9999/${modelPath}`,
            `http://localhost:8888/${modelPath}`,
            // Try with building1.gltf if the path contains "building"
            modelPath.includes('building') ? 'models/building1.gltf' : null,
            modelPath.includes('building') ? 'http://localhost:9999/models/building1.gltf' : null
        ].filter(url => url !== null);
        
        // Try each URL until one works
        for (const url of modelUrls) {
            try {
                // Check if file is accessible
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    if (!response.ok) {
                        console.warn(`⚠️ Model file not accessible: ${url} (${response.status})`);
                        continue; // Try next URL
                    }
                    console.log(`✅ Model file accessible: ${url}`);
                } catch (fetchError) {
                    console.warn(`⚠️ Fetch check failed for ${url}:`, fetchError);
                    continue; // Try next URL
                }
                
                // Try GLTF loader
                const loader = new THREE.GLTFLoader();
                const gltf = await new Promise((resolve, reject) => {
                    loader.load(url, resolve, 
                        // Progress callback
                        (xhr) => {
                            const percent = xhr.loaded / xhr.total * 100;
                            console.log(`📊 Loading ${url}: ${percent.toFixed(1)}%`);
                        },
                        reject
                    );
                });
                
                // Set position, rotation, and scale
                gltf.scene.position.set(position.x, position.y, position.z);
                gltf.scene.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
                gltf.scene.scale.set(config.scale, config.scale, config.scale);
                gltf.scene.name = config.name;
                
                // Fix materials
                gltf.scene.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        
                        if (node.material) {
                            node.material.wireframe = false;
                            node.material.transparent = true;
                            node.material.opacity = 0.9;
                            node.material.side = THREE.DoubleSide;
                            node.material.needsUpdate = true;
                        }
                    }
                });
                
                // Add to scene
                this.scene.add(gltf.scene);
                this.loadedCount++;
                
                // Cache the model
                this.modelCache[modelPath] = gltf.scene.clone();
                
                console.log(`✅ Model loaded: ${url}`);
                console.log(`📊 Scene objects: ${this.scene.children.length}`);
                
                return gltf.scene;
                
            } catch (error) {
                console.warn(`❌ Failed to load model from ${url}:`, error);
                // Continue to next URL
            }
        }
        
        // All URLs failed, create fallback building
        console.warn(`❌ All loading attempts failed for ${modelPath}, creating fallback`);
        const fallbackBuilding = this.createFallbackBuilding(position, config);
        this.scene.add(fallbackBuilding);
        this.failedCount++;
        
        console.log(`🏗️ Fallback building created at position:`, position);
        return fallbackBuilding;
    }
    
    /**
     * Create a fallback procedural building
     */
    createFallbackBuilding(position, options = {}) {
        console.log(`Creating fallback building at position:`, position);
        
        // Default options
        const config = {
            width: options.width || 10,
            height: options.height || 15,
            depth: options.depth || 10,
            color: options.color || 0x006699, // Màu xanh đậm mặc định
            name: options.name || `fallback_building_${Math.floor(Math.random() * 1000)}`,
            type: options.type || 'building',
            transparent: options.transparent !== undefined ? options.transparent : false,
            opacity: options.opacity !== undefined ? options.opacity : 1.0,
            emissive: options.emissive || 0x000000,
            ...options
        };
        
        const buildingGroup = new THREE.Group();
        buildingGroup.name = config.name;
        
        // Main building body
        const width = config.width;
        const height = config.height;
        const depth = config.depth;
        
        // Tạo hình dạng khác nhau dựa trên loại đối tượng
        let geometry;
        
        switch(config.type) {
            case 'bridge':
                // Cầu kính kết nối
                geometry = new THREE.BoxGeometry(width * 3, height * 0.2, depth * 0.5);
                break;
            case 'parking':
                // Nhà để xe kính
                geometry = new THREE.BoxGeometry(width * 1.5, height * 0.5, depth * 1.5);
                break;
            case 'garden':
                // Vườn hình lục giác
                geometry = new THREE.CylinderGeometry(width * 0.8, width * 0.8, height * 0.1, 6);
                break;
            case 'light':
                // Hệ thống LED
                geometry = new THREE.SphereGeometry(width * 0.3, 16, 16);
                break;
            case 'furniture':
                // Nội thất đô thị
                geometry = new THREE.BoxGeometry(width * 0.5, height * 0.3, depth * 0.5);
                break;
            default:
                // Tòa nhà mặc định
                geometry = new THREE.BoxGeometry(width, height, depth);
        }
        
        // Create material for the building
        let material;
        
        if (config.type === 'building' || !config.type) {
            // Vật liệu kính màu xanh dương đậm cho tòa nhà
            material = new THREE.MeshPhysicalMaterial({
                color: 0x0047AB, // Cobalt blue color
                metalness: 0.9,
                roughness: 0.05,
                transparent: true,
                opacity: 0.8,
                reflectivity: 1.0,
                transmission: 0.5,
                side: THREE.DoubleSide,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            });
            console.log(`✓ GLASS material created for building with color: #0047AB`);
        } else {
            // Vật liệu cho các đối tượng khác
            material = new THREE.MeshPhysicalMaterial({
                color: config.color,
                metalness: 0.5,
                roughness: 0.2,
                transparent: config.transparent || (config.type === 'bridge'),
                opacity: config.type === 'bridge' ? 0.7 : config.opacity,
                reflectivity: 1.0,
                emissive: config.emissive,
                emissiveIntensity: config.type === 'light' ? 0.5 : 0
            });
            console.log(`✓ Material created for ${config.type} with color: ${config.color.toString(16)}`);
        }

        const building = new THREE.Mesh(geometry, material);
        buildingGroup.add(building);
        
        // Add windows
        const windowSize = 0.5;
        const windowSpacing = 1.5;
        
        // Add windows for buildings only
        if (config.type === 'building' || !config.type) {
            const windowCount = 5;
            const windowSpacing = height / (windowCount + 1);
            const windowGeometry = new THREE.PlaneGeometry(1, 1);
            const windowMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x4682B4, // Màu xanh kính
                metalness: 0.9,
                roughness: 0.1,
                transparent: true,
                opacity: 0.8,
                reflectivity: 1.0,
                transmission: 0.5,
                side: THREE.DoubleSide
            });
            
            // Thêm cửa sổ cho các mặt của tòa nhà
            // Mặt trước
            for (let i = 0; i < windowCount; i++) {
                for (let j = 0; j < 3; j++) {
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        -width/2 + width/(3+1) * (j+1),
                        -height/2 + windowSpacing * (i+1),
                        depth/2 + 0.1
                    );
                    buildingGroup.add(window);
                }
            }
            
            // Mặt sau
            for (let i = 0; i < windowCount; i++) {
                for (let j = 0; j < 3; j++) {
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        -width/2 + width/(3+1) * (j+1),
                        -height/2 + windowSpacing * (i+1),
                        -depth/2 - 0.1
                    );
                    buildingGroup.add(window);
                }
            }
            
            // Mặt bên trái
            for (let i = 0; i < windowCount; i++) {
                for (let j = 0; j < 2; j++) {
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.rotation.y = Math.PI/2;
                    window.position.set(
                        -width/2 - 0.1,
                        -height/2 + windowSpacing * (i+1),
                        -depth/2 + depth/(2+1) * (j+1)
                    );
                    buildingGroup.add(window);
                }
            }
            
            // Mặt bên phải
            for (let i = 0; i < windowCount; i++) {
                for (let j = 0; j < 2; j++) {
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.rotation.y = Math.PI/2;
                    window.position.set(
                        width/2 + 0.1,
                        -height/2 + windowSpacing * (i+1),
                        -depth/2 + depth/(2+1) * (j+1)
                    );
                    buildingGroup.add(window);
                }
            }
        }
        
        // Add special features based on type
        if (config.type === 'building' || !config.type) {
            // Add roof features for buildings
            const roofGeometry = new THREE.BoxGeometry(width * 0.7, height * 0.1, depth * 0.7);
            const roofMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x333333,
                metalness: 0.7,
                roughness: 0.2
            });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.y = height/2 + height * 0.05;
            buildingGroup.add(roof);
            
            // Add antenna on top
            const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, height * 0.2, 8);
            const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.y = height/2 + height * 0.2;
            buildingGroup.add(antenna);
            
        } else if (config.type === 'garden') {
            // Add plants for garden
            for (let i = 0; i < 5; i++) {
                const plantGeometry = new THREE.ConeGeometry(0.5, 2, 8);
                const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
                const plant = new THREE.Mesh(plantGeometry, plantMaterial);
                plant.position.set(
                    (Math.random() - 0.5) * width * 0.6,
                    height * 0.1,
                    (Math.random() - 0.5) * depth * 0.6
                );
                buildingGroup.add(plant);
            }
        } else if (config.type === 'light') {
            // Add light beam
            const lightBeamGeometry = new THREE.CylinderGeometry(0.2, 2, 5, 16, 1, true);
            const lightBeamMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFF99,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const lightBeam = new THREE.Mesh(lightBeamGeometry, lightBeamMaterial);
            lightBeam.position.y = -2.5;
            buildingGroup.add(lightBeam);
            
            // Add actual light source
            const light = new THREE.PointLight(0xFFFF99, 1, 10);
            buildingGroup.add(light);
        } else if (config.type === 'furniture') {
            // Add bench details
            const benchLegGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
            const benchLegMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
            
            // Add 4 legs
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    const leg = new THREE.Mesh(benchLegGeometry, benchLegMaterial);
                    leg.position.set(
                        (i === 0 ? -1 : 1),
                        -0.5,
                        (j === 0 ? -1 : 1)
                    );
                    buildingGroup.add(leg);
                }
            }
        }
        
        // Position the entire building group
        if (config.type === 'bridge') {
            // Position bridge higher up
            buildingGroup.position.set(position.x, position.y + height * 2, position.z);
        } else {
            buildingGroup.position.set(position.x, position.y + height/2, position.z);
        }
        
        // Apply rotation if specified
        if (options.rotation) {
            buildingGroup.rotation.set(
                options.rotation.x || 0,
                options.rotation.y || 0,
                options.rotation.z || 0
            );
        }
        
        // Log success message
        console.log(`✓ Created ${config.type || 'building'}: ${config.name} with color: ${config.color.toString(16)}`);
        if (!config.transparent) {
            console.log(`✓ WIREFRAME FIX COMPLETE`);
        }
        
        return buildingGroup;
    }
    
    /**
     * Load multiple models at specified positions
     */
    async loadMultipleModels(modelConfigs) {
        console.log(`🔄 Loading ${modelConfigs.length} models...`);
        
        const promises = modelConfigs.map(config => 
            this.loadWithFallback(config.url, config.position, config.options)
        );
        
        const results = await Promise.allSettled(promises);
        
        console.log(`✅ Finished loading ${modelConfigs.length} models`);
        console.log(`📊 Success: ${results.filter(r => r.status === 'fulfilled').length}`);
        console.log(`❌ Failed: ${results.filter(r => r.status === 'rejected').length}`);
        
        return results;
    }
    
    /**
     * Get statistics about loaded models
     */
    getStats() {
        return {
            loaded: this.loadedCount,
            failed: this.failedCount,
            total: this.loadedCount + this.failedCount,
            sceneObjects: this.scene.children.length,
            cachedModels: Object.keys(this.modelCache).length
        };
    }
    
    /**
     * Log detailed scene information
     */
    logSceneInfo() {
        console.log("📊 SCENE DIAGNOSTIC INFORMATION:");
        console.log(`Total scene children: ${this.scene.children.length}`);
        
        let meshCount = 0;
        let triangleCount = 0;
        let materialTypes = {};
        
        this.scene.traverse(object => {
            if (object.isMesh) {
                meshCount++;
                
                // Count triangles
                if (object.geometry) {
                    if (object.geometry.index !== null) {
                        triangleCount += object.geometry.index.count / 3;
                    } else if (object.geometry.attributes.position) {
                        triangleCount += object.geometry.attributes.position.count / 3;
                    }
                }
                
                // Count material types
                if (object.material) {
                    const matType = object.material.type;
                    materialTypes[matType] = (materialTypes[matType] || 0) + 1;
                }
            }
        });
        
        console.log(`Mesh count: ${meshCount}`);
        console.log(`Triangle count: ${Math.round(triangleCount)}`);
        console.log("Material types:", materialTypes);
        
        return {
            meshCount,
            triangleCount: Math.round(triangleCount),
            materialTypes
        };
    }
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DiagnosticModelLoader };
}
