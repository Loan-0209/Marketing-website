/**
 * AI Campus Model Loader
 * Utility for loading 3D models in various formats (GLTF, GLB, OBJ, FBX)
 * ENHANCED VERSION WITH IMPROVED ERROR HANDLING AND DIAGNOSTICS
 */

console.log("💾 MODEL LOADER - Script loading");
console.log("Model loader time:", new Date().toLocaleTimeString());
console.log("THREE.js available in model-loader:", typeof THREE !== 'undefined');

// Emergency diagnostic function for model loading
function diagnosePotentialModelIssues() {
    console.log("🔧 MODEL LOADER DIAGNOSTIC");
    
    // Check if THREE loaders are available
    console.log("GLTFLoader available:", typeof THREE.GLTFLoader !== 'undefined');
    console.log("OBJLoader available:", typeof THREE.OBJLoader !== 'undefined');
    console.log("FBXLoader available:", typeof THREE.FBXLoader !== 'undefined');
    
    // Check if models directory exists and is accessible
    // Use absolute URL with port 9999 where the model is confirmed to be accessible
    fetch('http://localhost:9999/models/building1.gltf')
        .then(response => {
            console.log("Model file fetch status (port 9999):", response.status, response.statusText);
            if (!response.ok) {
                console.error("❌ Model file not accessible on port 9999. Status:", response.status);
                // Try port 8888 as fallback
                console.log("Attempting to load model from port 8888 as fallback...");
                fetch('http://localhost:8888/models/building1.gltf')
                    .then(fallbackResponse => {
                        console.log("Port 8888 model fetch status:", fallbackResponse.status);
                        if (fallbackResponse.ok) {
                            console.log("✅ Model file accessible on port 8888 as fallback");
                            return fallbackResponse.text();
                        } else {
                            // Try CDN as last resort
                            console.log("Attempting to load sample model from CDN as fallback...");
                            return fetch('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf');
                        }
                    })
                    .then(cdnResponse => {
                        if (cdnResponse && cdnResponse.ok) {
                            console.log("✅ CDN model accessible as fallback");
                        }
                    })
                    .catch(err => console.error("❌ All fallback attempts failed:", err));
            } else {
                console.log("✅ Model file accessible on port 9999");
                return response.text();
            }
        })
        .then(data => {
            if (data) {
                console.log("Model file content length:", data.length);
                console.log("Model file content preview:", data.substring(0, 100) + "...");
                
                // Validate GLTF content
                try {
                    const json = JSON.parse(data);
                    console.log("✅ Model file is valid JSON");
                    console.log("Model version:", json.asset?.version);
                    console.log("Model has meshes:", json.meshes?.length > 0);
                    console.log("Model has materials:", json.materials?.length > 0);
                } catch (e) {
                    console.error("❌ Model file is not valid JSON:", e);
                }
            }
        })
        .catch(error => {
            console.error("❌ Error fetching model file:", error);
        });
}

// Run diagnostic after a short delay
setTimeout(diagnosePotentialModelIssues, 500);

class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loadingManager = new THREE.LoadingManager();
        this.modelCache = {};
        this.defaultMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0066aa,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8,
            reflectivity: 1.0,
            transmission: 0.5,
            side: THREE.DoubleSide,
            wireframe: false
        });
        
        // Setup loading manager callbacks
        this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log(`Started loading model: ${url} (${itemsLoaded}/${itemsTotal})`);
        };
        
        this.loadingManager.onLoad = () => {
            console.log('All models loaded successfully');
        };
        
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal * 100).toFixed(2);
            console.log(`Loading model: ${url} - ${progress}% (${itemsLoaded}/${itemsTotal})`);
        };
        
        this.loadingManager.onError = (url) => {
            console.error(`Error loading model: ${url}`);
        };
        
        // Initialize loaders
        this.initLoaders();
    }
    
    /**
     * Initialize all model loaders
     */
    initLoaders() {
        // Check if required loaders are available
        if (!THREE.GLTFLoader) {
            console.warn('GLTFLoader not available, loading from CDN...');
            this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.min.js')
                .then(() => console.log('GLTFLoader loaded successfully'))
                .catch(err => console.error('Failed to load GLTFLoader:', err));
        }
        
        if (!THREE.OBJLoader) {
            console.warn('OBJLoader not available, loading from CDN...');
            this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.min.js')
                .then(() => console.log('OBJLoader loaded successfully'))
                .catch(err => console.error('Failed to load OBJLoader:', err));
        }
        
        if (!THREE.FBXLoader) {
            console.warn('FBXLoader not available, loading from CDN...');
            this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.min.js')
                .then(() => console.log('FBXLoader loaded successfully'))
                .catch(err => console.error('Failed to load FBXLoader:', err));
        }
        
        if (!THREE.MTLLoader) {
            console.warn('MTLLoader not available, loading from CDN...');
            this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/MTLLoader.min.js')
                .then(() => console.log('MTLLoader loaded successfully'))
                .catch(err => console.error('Failed to load MTLLoader:', err));
        }
        
        if (!THREE.DRACOLoader) {
            console.warn('DRACOLoader not available, loading from CDN...');
            this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.min.js')
                .then(() => console.log('DRACOLoader loaded successfully'))
                .catch(err => console.error('Failed to load DRACOLoader:', err));
        }
    }
    
    /**
     * Load a script dynamically
     * @param {string} url - URL of the script to load
     */
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * Load a 3D model based on file extension
     * @param {string} url - Path to the model file
     * @param {Object} options - Additional options for loading
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<THREE.Object3D>} - The loaded model
     */
    loadModel(url, options = {}, onProgress = null) {
        console.log(`🔄 Starting to load model: ${url}`);
        
        // Check if model is already cached
        if (this.modelCache[url]) {
            console.log(`Using cached model: ${url}`);
            return Promise.resolve(this.modelCache[url].clone());
        }
        
        // Determine file extension
        const extension = url.split('.').pop().toLowerCase();
        
        // Choose appropriate loader based on extension
        switch (extension) {
            case 'gltf':
            case 'glb':
                return this.loadGLTF(url, options, onProgress);
            case 'obj':
                return this.loadOBJ(url, options, onProgress);
            case 'fbx':
                return this.loadFBX(url, options, onProgress);
            default:
                return Promise.reject(new Error(`Unsupported file format: ${extension}`));
        }
    }
    
    /**
     * Load a GLTF/GLB model
     * @param {string} url - Path to the model file
     * @param {Object} options - Additional options for loading
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<THREE.Object3D>} - The loaded model
     */
    loadGLTF(url, options = {}, onProgress = null) {
        console.log(`💾 Attempting to load GLTF model: ${url}`);
        
        return new Promise((resolve, reject) => {
            // Ensure GLTFLoader is available
            if (typeof THREE.GLTFLoader === 'undefined') {
                console.error('❌ GLTFLoader not available - attempting to load dynamically');
                
                // Try to load GLTFLoader dynamically
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
                script.onload = () => {
                    console.log('✅ GLTFLoader loaded dynamically - retrying model load');
                    this.loadGLTF(url, options, onProgress).then(resolve).catch(reject);
                };
                script.onerror = () => {
                    const error = new Error('Failed to load GLTFLoader dynamically');
                    console.error(error);
                    reject(error);
                };
                document.head.appendChild(script);
                return;
            }
            
            console.log('✅ GLTFLoader is available, creating loader instance');
            const loader = new THREE.GLTFLoader(this.loadingManager);
            
            // Setup DRACO decoder if available
            if (typeof THREE.DRACOLoader !== 'undefined') {
                console.log('✅ DRACOLoader is available, setting up decoder');
                const dracoLoader = new THREE.DRACOLoader();
                dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');
                loader.setDRACOLoader(dracoLoader);
            }
            
            // First check if the file exists and is accessible
            // Convert relative URL to absolute URL with port 9999
            const absoluteUrl = url.startsWith('http') ? url : `http://localhost:9999/${url}`;
            console.log(`Checking accessibility of model at: ${absoluteUrl}`);
            
            fetch(absoluteUrl)
                .then(response => {
                    if (!response.ok) {
                        console.warn(`Model not accessible at ${absoluteUrl}: ${response.status} ${response.statusText}`);
                        // Try port 8888 as fallback
                        const fallbackUrl = `http://localhost:8888/${url}`;
                        console.log(`Trying fallback URL: ${fallbackUrl}`);
                        return fetch(fallbackUrl).then(fallbackResponse => {
                            if (!fallbackResponse.ok) {
                                throw new Error(`Model file not accessible on either port: ${response.status} ${response.statusText}`);
                            }
                            console.log(`✅ Model file accessible on fallback port 8888, proceeding with load`);
                            return fallbackResponse;
                        });
                    }
                    console.log(`✅ Model file ${absoluteUrl} is accessible, proceeding with load`);
                    
                    // Now load the model with GLTFLoader
                    loader.load(
                        url,
                        (gltf) => {
                            console.log(`✅ GLTF model loaded successfully: ${url}`);
                            
                            if (!gltf.scene) {
                                console.error('❌ Loaded GLTF has no scene!');
                                reject(new Error('Loaded GLTF has no scene'));
                                return;
                            }
                            
                            const model = gltf.scene;
                            
                            // Log model details
                            let meshCount = 0;
                            model.traverse(child => {
                                if (child.isMesh) meshCount++;
                            });
                            console.log(`Model contains ${meshCount} meshes`);
                            
                            // Apply default material settings to ensure no wireframe
                            model.traverse(child => {
                                if (child.isMesh) {
                                    console.log(`Processing mesh: ${child.name || 'unnamed'}`);
                                    
                                    if (options.useMaterial) {
                                        child.material = this.defaultMaterial.clone();
                                    } else if (child.material) {
                                        // Force disable wireframe
                                        child.material.wireframe = false;
                                        child.material.transparent = true;
                                        child.material.opacity = 0.8;
                                        child.material.side = THREE.DoubleSide;
                                        child.material.needsUpdate = true;
                                    }
                                    
                                    // Enable shadows
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            });
                            
                            // Apply transformations
                            if (options.scale) {
                                model.scale.set(options.scale, options.scale, options.scale);
                                console.log(`Applied scale: ${options.scale}`);
                            }
                            
                            if (options.position) {
                                model.position.copy(options.position);
                                console.log(`Applied position: (${options.position.x}, ${options.position.y}, ${options.position.z})`);
                            }
                            
                            if (options.rotation) {
                                model.rotation.set(
                                    options.rotation.x || 0,
                                    options.rotation.y || 0,
                                    options.rotation.z || 0
                                );
                            }
                            
                            // Add to scene if requested
                            if (options.addToScene !== false && this.scene) {
                                console.log(`Adding model to scene`);
                                this.scene.add(model);
                                
                                // Verify model was added to scene
                                const isInScene = this.scene.children.includes(model);
                                console.log(`Model added to scene: ${isInScene}`);
                            }
                            
                            // Cache the model
                            this.modelCache[url] = model.clone();
                            
                            resolve(model);
                        },
                        (progressEvent) => {
                            if (onProgress) {
                                onProgress(progressEvent);
                            }
                            
                            if (progressEvent.lengthComputable) {
                                const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                console.log(`Loading model ${url}: ${percent}% complete`);
                            }
                        },
                        (error) => {
                            console.error(`❌ Error loading GLTF model ${url}:`, error);
                            reject(error);
                        }
                    );
                })
                .catch(error => {
                    console.error(`❌ Error accessing model file ${url}:`, error);
                    reject(error);
                });
        });
    }
    
    /**
     * Load an OBJ model
     * @param {string} url - Path to the model file
     * @param {Object} options - Additional options for loading
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<THREE.Object3D>} - The loaded model
     */
    loadOBJ(url, options = {}, onProgress = null) {
        return new Promise((resolve, reject) => {
            // Ensure OBJLoader is available
            if (!THREE.OBJLoader) {
                reject(new Error('OBJLoader not available'));
                return;
            }
            
            const loader = new THREE.OBJLoader(this.loadingManager);
            
            // Load MTL file if specified
            if (options.mtlUrl && THREE.MTLLoader) {
                const mtlLoader = new THREE.MTLLoader(this.loadingManager);
                mtlLoader.load(
                    options.mtlUrl,
                    (materials) => {
                        materials.preload();
                        loader.setMaterials(materials);
                        this.loadOBJModel(loader, url, options, onProgress, resolve, reject);
                    },
                    onProgress,
                    (error) => {
                        console.warn(`Error loading MTL file ${options.mtlUrl}:`, error);
                        // Continue loading OBJ without materials
                        this.loadOBJModel(loader, url, options, onProgress, resolve, reject);
                    }
                );
            } else {
                this.loadOBJModel(loader, url, options, onProgress, resolve, reject);
            }
        });
    }
    
    /**
     * Helper method to load OBJ model
     */
    loadOBJModel(loader, url, options, onProgress, resolve, reject) {
        loader.load(
            url,
            (object) => {
                // Apply default material settings to ensure no wireframe
                object.traverse(child => {
                    if (child.isMesh) {
                        if (options.useMaterial) {
                            child.material = this.defaultMaterial.clone();
                        } else if (child.material) {
                            child.material.wireframe = false;
                            child.material.transparent = true;
                            child.material.opacity = 0.8;
                            child.material.side = THREE.DoubleSide;
                            child.material.needsUpdate = true;
                        }
                        
                        // Enable shadows
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                // Apply transformations
                if (options.scale) {
                    object.scale.set(options.scale, options.scale, options.scale);
                }
                
                if (options.position) {
                    object.position.copy(options.position);
                }
                
                if (options.rotation) {
                    object.rotation.set(
                        options.rotation.x || 0,
                        options.rotation.y || 0,
                        options.rotation.z || 0
                    );
                }
                
                // Add to scene if requested
                if (options.addToScene !== false && this.scene) {
                    this.scene.add(object);
                }
                
                // Cache the model
                this.modelCache[url] = object.clone();
                
                resolve(object);
            },
            onProgress,
            (error) => {
                console.error(`Error loading OBJ model ${url}:`, error);
                reject(error);
            }
        );
    }
    
    /**
     * Load an FBX model
     * @param {string} url - Path to the model file
     * @param {Object} options - Additional options for loading
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<THREE.Object3D>} - The loaded model
     */
    loadFBX(url, options = {}, onProgress = null) {
        return new Promise((resolve, reject) => {
            // Ensure FBXLoader is available
            if (!THREE.FBXLoader) {
                reject(new Error('FBXLoader not available'));
                return;
            }
            
            const loader = new THREE.FBXLoader(this.loadingManager);
            
            loader.load(
                url,
                (object) => {
                    // Apply default material settings to ensure no wireframe
                    object.traverse(child => {
                        if (child.isMesh) {
                            if (options.useMaterial) {
                                child.material = this.defaultMaterial.clone();
                            } else if (child.material) {
                                child.material.wireframe = false;
                                child.material.transparent = true;
                                child.material.opacity = 0.8;
                                child.material.side = THREE.DoubleSide;
                                child.material.needsUpdate = true;
                            }
                            
                            // Enable shadows
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    // Apply transformations
                    if (options.scale) {
                        object.scale.set(options.scale, options.scale, options.scale);
                    }
                    
                    if (options.position) {
                        object.position.copy(options.position);
                    }
                    
                    if (options.rotation) {
                        object.rotation.set(
                            options.rotation.x || 0,
                            options.rotation.y || 0,
                            options.rotation.z || 0
                        );
                    }
                    
                    // Add to scene if requested
                    if (options.addToScene !== false && this.scene) {
                        this.scene.add(object);
                    }
                    
                    // Cache the model
                    this.modelCache[url] = object.clone();
                    
                    resolve(object);
                },
                onProgress,
                (error) => {
                    console.error(`Error loading FBX model ${url}:`, error);
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Create a fallback building model if loading fails
     * @param {number} width - Building width
     * @param {number} height - Building height
     * @param {number} depth - Building depth
     * @param {THREE.Vector3} position - Building position
     * @returns {THREE.Mesh} - The created building mesh
     */
    createFallbackBuilding(width, height, depth, position) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = this.defaultMaterial.clone();
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        if (this.scene) {
            this.scene.add(mesh);
        }
        
        return mesh;
    }
    
    /**
     * Load a building model or create a fallback
     * @param {string} modelUrl - URL to the model file
     * @param {number} width - Building width
     * @param {number} height - Building height
     * @param {number} depth - Building depth
     * @param {THREE.Vector3} position - Building position
     * @returns {Promise<THREE.Object3D>} - The loaded or created building
     */
    loadBuildingModel(modelUrl, width, height, depth, position) {
        const options = {
            position: position,
            scale: 1.0,
            useMaterial: false
        };
        
        return this.loadModel(modelUrl, options)
            .catch(error => {
                console.warn(`Failed to load building model ${modelUrl}, using fallback:`, error);
                return this.createFallbackBuilding(width, height, depth, position);
            });
    }
    
    /**
     * Load multiple models in parallel
     * @param {Array<Object>} modelConfigs - Array of model configurations
     * @returns {Promise<Array<THREE.Object3D>>} - The loaded models
     */
    loadModels(modelConfigs) {
        const promises = modelConfigs.map(config => {
            return this.loadModel(config.url, config.options)
                .catch(error => {
                    console.warn(`Failed to load model ${config.url}:`, error);
                    return null;
                });
        });
        
        return Promise.all(promises);
    }
}
