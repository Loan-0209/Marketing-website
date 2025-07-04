/**
 * HEART Technology Park - 3D Master Plan Visualization
 * High-performance Three.js implementation with optimizations
 */

class MasterPlan3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.buildings = [];
        this.currentPhase = 'phase1';
        this.currentView = 'overview';
        this.isInitialized = false;
        this.animationId = null;
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        
        // Configuration
        this.config = {
            antialias: window.devicePixelRatio < 2,
            shadows: !this.isMobile(),
            maxPixelRatio: Math.min(window.devicePixelRatio, 2),
            targetFPS: 60
        };

        this.phases = {
            phase1: {
                buildings: ['admin', 'research', 'innovation', 'datacenter'],
                cameraPosition: { x: 150, y: 120, z: 150 },
                color: 0x3b82f6,
                label: 'Foundation Phase'
            },
            phase2: {
                buildings: ['admin', 'research', 'innovation', 'datacenter', 'startup1', 'startup2', 'demo', 'conference', 'commercial1'],
                cameraPosition: { x: 180, y: 150, z: 180 },
                color: 0xfbbf24,
                label: 'Expansion Phase'
            },
            phase3: {
                buildings: ['admin', 'research', 'innovation', 'datacenter', 'startup1', 'startup2', 'demo', 'conference', 'commercial1', 'commercial2', 'exhibition', 'residential', 'housing', 'transport', 'energy'],
                cameraPosition: { x: 220, y: 180, z: 220 },
                color: 0x10b981,
                label: 'Integration Phase'
            }
        };

        this.viewPositions = {
            overview: { x: 250, y: 180, z: 250, name: 'Overview' },
            aerial: { x: 0, y: 300, z: 0, name: 'Aerial View' },
            ground: { x: 150, y: 20, z: 80, name: 'Ground Level' }
        };
    }

    // Utility Methods
    isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance Monitoring
    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update performance indicator
            const indicator = document.querySelector('.performance-indicator');
            if (indicator) {
                indicator.textContent = `${this.fps} FPS`;
                indicator.style.color = this.fps >= 30 ? '#10b981' : this.fps >= 20 ? '#f59e0b' : '#ef4444';
            }
        }
    }

    // Initialization with comprehensive error handling
    async init() {
        try {
            if (this.isInitialized) return;

            console.log('🚀 Initializing HEART 3D Master Plan...');
            
            // Check if Three.js is available
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js library is not loaded');
            }
            
            console.log('📐 Three.js version:', THREE.REVISION);
            
            // Initialize Three.js components step by step
            console.log('🎬 Initializing Three.js scene...');
            await this.initThreeJS();
            
            console.log('🌍 Creating 3D environment...');
            await this.createScene();
            
            console.log('🏗️ Creating buildings...');
            await this.createBuildings();
            
            console.log('📷 Setting up camera...');
            this.setCameraView('overview');
            
            console.log('⏱️ Setting initial phase...');
            this.updatePhaseVisibility('phase1');
            
            console.log('🎮 Setting up event listeners...');
            this.setupEventListeners();
            
            console.log('🎞️ Starting animation loop...');
            this.startAnimation();
            
            this.isInitialized = true;
            console.log('✅ 3D Master Plan initialized successfully');
            
            // Hide loading overlay with delay to ensure everything is rendered
            setTimeout(() => {
                this.hideLoading();
            }, 500);
            
        } catch (error) {
            console.error('❌ Failed to initialize 3D Master Plan:', error);
            window.ThreeJSErrorHandler?.log(error, '3D Scene Initialization');
            this.showError(`Failed to load 3D visualization: ${error.message}`);
            throw error; // Re-throw for higher level handling
        }
    }

    async initThreeJS() {
        try {
            const container = document.getElementById('threejs-container');
            if (!container) {
                throw new Error('3D container element not found');
            }
            
            console.log('📦 Container dimensions:', container.clientWidth, 'x', container.clientHeight);

            // Scene creation with error handling
            try {
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x87ceeb);
                this.scene.fog = new THREE.Fog(0x87ceeb, 100, 300);
                console.log('✅ Scene created successfully');
            } catch (error) {
                throw new Error(`Failed to create scene: ${error.message}`);
            }

            // Camera creation
            try {
                const aspect = container.clientWidth / container.clientHeight;
                this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
                console.log('✅ Camera created successfully');
            } catch (error) {
                throw new Error(`Failed to create camera: ${error.message}`);
            }
            
            // Renderer creation with WebGL context check
            try {
                // Check WebGL context availability
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!gl) {
                    throw new Error('WebGL context not available');
                }
                
                this.renderer = new THREE.WebGLRenderer({ 
                    antialias: this.config.antialias,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                    alpha: false
                });
                
                console.log('🎮 WebGL Renderer created successfully');
                console.log('🖥️ Renderer info:', this.renderer.info);
                
            } catch (error) {
                throw new Error(`Failed to create WebGL renderer: ${error.message}`);
            }
            
            // Configure renderer
            try {
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                this.renderer.setPixelRatio(this.config.maxPixelRatio);
                
                // Use legacy encoding for compatibility
                if (this.renderer.outputColorSpace !== undefined) {
                    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
                } else {
                    this.renderer.outputEncoding = THREE.sRGBEncoding;
                }
                
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1.2;
                
                if (this.config.shadows) {
                    this.renderer.shadowMap.enabled = true;
                    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                }
                
                container.appendChild(this.renderer.domElement);
                console.log('✅ Renderer configured and added to DOM');
                
            } catch (error) {
                throw new Error(`Failed to configure renderer: ${error.message}`);
            }

            // Controls setup with fallback
            try {
                if (typeof THREE.OrbitControls !== 'undefined') {
                    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                    this.controls.enableDamping = true;
                    this.controls.dampingFactor = 0.05;
                    this.controls.maxPolarAngle = Math.PI / 2.2;
                    this.controls.minDistance = 30;
                    this.controls.maxDistance = 200;
                    this.controls.autoRotate = false;
                    this.controls.autoRotateSpeed = 0.5;
                    
                    // Throttle controls for performance
                    this.controls.addEventListener('change', this.debounce(() => {
                        this.render();
                    }, 16));
                    
                    console.log('✅ OrbitControls initialized');
                } else {
                    console.warn('⚠️ OrbitControls not available, using basic camera');
                    // Basic camera positioning as fallback
                    this.camera.position.set(150, 120, 150);
                    this.camera.lookAt(0, 0, 0);
                }
            } catch (error) {
                console.warn('⚠️ Failed to initialize controls:', error.message);
                // Continue without controls
            }
            
        } catch (error) {
            console.error('❌ Three.js initialization failed:', error);
            throw error;
        }
    }

    async createScene() {
        // Enhanced lighting setup for vibrant appearance
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(50, 150, 50);
        
        if (this.config.shadows) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = this.isMobile() ? 1024 : 2048;
            directionalLight.shadow.mapSize.height = this.isMobile() ? 1024 : 2048;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 300;
            directionalLight.shadow.camera.left = -200;
            directionalLight.shadow.camera.right = 200;
            directionalLight.shadow.camera.top = 200;
            directionalLight.shadow.camera.bottom = -200;
        }
        
        this.scene.add(directionalLight);

        // Additional fill lights for better color saturation
        const fillLight1 = new THREE.DirectionalLight(0x88DDFF, 0.4);
        fillLight1.position.set(-50, 100, -50);
        this.scene.add(fillLight1);

        const fillLight2 = new THREE.DirectionalLight(0xFFDD88, 0.3);
        fillLight2.position.set(50, 80, -50);
        this.scene.add(fillLight2);

        // Enhanced ground with pastel mint color
        const groundGeometry = new THREE.PlaneGeometry(400, 400, this.isMobile() ? 20 : 40, this.isMobile() ? 20 : 40);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x90EE90, // Light green/mint
            transparent: true,
            opacity: 0.9,
            shininess: 10
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = this.config.shadows;
        this.scene.add(ground);

        // Add environment elements
        this.createEnvironment();
    }

    createEnvironment() {
        // Sky gradient
        const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x87ceeb) },
                bottomColor: { value: new THREE.Color(0xe0f2fe) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);

        // Add some decorative elements if not mobile
        if (!this.isMobile()) {
            this.createTrees();
            this.createPaths();
        }
    }

    createTrees() {
        // Expanded tree distribution from -150 to +150 range
        const treePositions = [
            // Extreme perimeter trees
            [-150, 0, -150], [150, 0, -150], [-150, 0, 150], [150, 0, 150],
            [-150, 0, 0], [150, 0, 0], [0, 0, -150], [0, 0, 150],
            
            // Mid perimeter
            [-120, 0, -120], [120, 0, -120], [-120, 0, 120], [120, 0, 120],
            [-120, 0, 0], [120, 0, 0], [0, 0, -120], [0, 0, 120],
            
            // Between building clusters
            [-80, 0, -80], [80, 0, -80], [-80, 0, 80], [80, 0, 80],
            [-50, 0, -50], [50, 0, -50], [-50, 0, 50], [50, 0, 50],
            [-25, 0, -25], [25, 0, -25], [-25, 0, 25], [25, 0, 25],
            
            // Around central area
            [-35, 0, 0], [35, 0, 0], [0, 0, -35], [0, 0, 35],
            
            // Additional landscaping throughout campus
            [-100, 0, -60], [100, 0, -60], [-60, 0, -100], [60, 0, -100],
            [-100, 0, 60], [100, 0, 60], [-60, 0, 100], [60, 0, 100],
            [-75, 0, -30], [75, 0, -30], [-30, 0, -75], [30, 0, -75],
            [-75, 0, 30], [75, 0, 30], [-30, 0, 75], [30, 0, 75],
            
            // Random scattered trees for natural look
            [-130, 0, -45], [130, 0, -45], [-45, 0, -130], [45, 0, -130],
            [-130, 0, 45], [130, 0, 45], [-45, 0, 130], [45, 0, 130],
            [-110, 0, -80], [110, 0, -80], [-80, 0, -110], [80, 0, -110],
            [-110, 0, 80], [110, 0, 80], [-80, 0, 110], [80, 0, 110]
        ];

        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos[0], pos[1], pos[2]);
            this.scene.add(tree);
        });
    }

    createFountain() {
        // Central fountain with water effects
        const fountainGroup = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(12, 15, 3, 16);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7D6B });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 1.5;
        fountainGroup.add(base);
        
        // Water pool
        const poolGeometry = new THREE.CylinderGeometry(10, 10, 0.5, 16);
        const poolMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4FC3F7,
            transparent: true,
            opacity: 0.7
        });
        const pool = new THREE.Mesh(poolGeometry, poolMaterial);
        pool.position.y = 3.25;
        fountainGroup.add(pool);
        
        // Central spire
        const spireGeometry = new THREE.CylinderGeometry(0.5, 1, 8, 8);
        const spireMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7D6B });
        const spire = new THREE.Mesh(spireGeometry, spireMaterial);
        spire.position.y = 7;
        fountainGroup.add(spire);
        
        this.scene.add(fountainGroup);
    }

    createParkingLots() {
        const parkingMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x555555,
            shininess: 30
        });
        const parkingPositions = [
            [-170, 0, -170], // Northwest
            [170, 0, -170],  // Northeast
            [170, 0, 170],   // Southeast
            [-170, 0, 170]   // Southwest
        ];
        
        parkingPositions.forEach(pos => {
            const parkingGeometry = new THREE.PlaneGeometry(30, 20);
            const parking = new THREE.Mesh(parkingGeometry, parkingMaterial);
            parking.rotation.x = -Math.PI / 2;
            parking.position.set(pos[0], 0.05, pos[2]);
            this.scene.add(parking);
            
            // Enhanced parking lines
            const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
            for (let i = 0; i < 5; i++) {
                const lineGeometry = new THREE.PlaneGeometry(25, 0.4);
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.rotation.x = -Math.PI / 2;
                line.position.set(pos[0], 0.06, pos[2] - 8 + i * 4);
                this.scene.add(line);
            }
            
            // Add small cars for realism
            for (let i = 0; i < 3; i++) {
                const carGeometry = new THREE.BoxGeometry(3, 1.5, 6);
                const carColors = [0xff0066, 0x0066ff, 0xffdd00, 0x44aa44];
                const carMaterial = new THREE.MeshPhongMaterial({ 
                    color: carColors[Math.floor(Math.random() * carColors.length)]
                });
                const car = new THREE.Mesh(carGeometry, carMaterial);
                car.position.set(
                    pos[0] + (Math.random() - 0.5) * 20,
                    0.75,
                    pos[2] + (Math.random() - 0.5) * 15
                );
                this.scene.add(car);
            }
        });
    }

    createDecorativeElements() {
        // Add benches along pathways
        const benchPositions = [
            [-100, 0, 0], [100, 0, 0], [0, 0, -100], [0, 0, 100],
            [-70, 0, -70], [70, 0, -70], [-70, 0, 70], [70, 0, 70]
        ];
        
        benchPositions.forEach(pos => {
            const benchGroup = new THREE.Group();
            
            // Bench seat
            const seatGeometry = new THREE.BoxGeometry(4, 0.3, 1.2);
            const seatMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const seat = new THREE.Mesh(seatGeometry, seatMaterial);
            seat.position.y = 1;
            benchGroup.add(seat);
            
            // Bench back
            const backGeometry = new THREE.BoxGeometry(4, 1.5, 0.2);
            const back = new THREE.Mesh(backGeometry, seatMaterial);
            back.position.set(0, 1.5, -0.5);
            benchGroup.add(back);
            
            // Bench legs
            for (let i = 0; i < 2; i++) {
                const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
                const legMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(-1.5 + i * 3, 0.5, 0);
                benchGroup.add(leg);
            }
            
            benchGroup.position.set(pos[0], 0, pos[2]);
            this.scene.add(benchGroup);
        });
        
        // Add modern light poles
        const lightPositions = [
            [-50, 0, -50], [50, 0, -50], [-50, 0, 50], [50, 0, 50],
            [-25, 0, 0], [25, 0, 0], [0, 0, -25], [0, 0, 25]
        ];
        
        lightPositions.forEach(pos => {
            const poleGroup = new THREE.Group();
            
            // Pole
            const poleGeometry = new THREE.CylinderGeometry(0.2, 0.3, 8, 12);
            const poleMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x888888,
                shininess: 60
            });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.y = 4;
            poleGroup.add(pole);
            
            // Light fixture
            const lightGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            const lightMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFFACD,
                transparent: true,
                opacity: 0.9,
                emissive: 0x444422
            });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.y = 7.5;
            poleGroup.add(light);
            
            poleGroup.position.set(pos[0], 0, pos[2]);
            this.scene.add(poleGroup);
        });
        
        // Add decorative planters
        const planterPositions = [
            [-40, 0, -40], [40, 0, -40], [-40, 0, 40], [40, 0, 40]
        ];
        
        planterPositions.forEach(pos => {
            const planterGroup = new THREE.Group();
            
            // Planter box
            const planterGeometry = new THREE.CylinderGeometry(3, 2.5, 2, 12);
            const planterMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const planter = new THREE.Mesh(planterGeometry, planterMaterial);
            planter.position.y = 1;
            planterGroup.add(planter);
            
            // Plants
            for (let i = 0; i < 5; i++) {
                const plantGeometry = new THREE.SphereGeometry(0.5, 8, 8);
                const plantMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
                const plant = new THREE.Mesh(plantGeometry, plantMaterial);
                plant.position.set(
                    (Math.random() - 0.5) * 2,
                    2 + Math.random(),
                    (Math.random() - 0.5) * 2
                );
                planterGroup.add(plant);
            }
            
            planterGroup.position.set(pos[0], 0, pos[2]);
            this.scene.add(planterGroup);
        });
    }

    createTree() {
        const group = new THREE.Group();
        
        // Enhanced trunk with better material
        const trunkGeometry = new THREE.CylinderGeometry(0.6, 1, 10, 12);
        const trunkMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8b4513,
            shininess: 5
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 5;
        group.add(trunk);
        
        // Multiple layers of leaves for more organic look
        const leafColors = [0x228b22, 0x32cd32, 0x90EE90];
        for (let i = 0; i < 3; i++) {
            const leavesGeometry = new THREE.SphereGeometry(4 + i, 12, 12);
            const leavesMaterial = new THREE.MeshPhongMaterial({ 
                color: leafColors[i % leafColors.length],
                shininess: 10
            });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.set(
                (Math.random() - 0.5) * 2,
                11 + i,
                (Math.random() - 0.5) * 2
            );
            leaves.scale.setScalar(0.8 + Math.random() * 0.4);
            group.add(leaves);
        }
        
        return group;
    }

    createPaths() {
        const pathMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xDDDDDD,
            shininess: 20
        });
        
        // Main campus ring roads - multiple rings
        const rings = [
            { inner: 80, outer: 84 },
            { inner: 120, outer: 124 },
            { inner: 160, outer: 164 }
        ];
        
        rings.forEach(ring => {
            const ringGeometry = new THREE.RingGeometry(ring.inner, ring.outer, 48);
            const ringPath = new THREE.Mesh(ringGeometry, pathMaterial);
            ringPath.rotation.x = -Math.PI / 2;
            ringPath.position.y = 0.1;
            this.scene.add(ringPath);
        });
        
        // Extended main cross paths
        const mainPathGeometry = new THREE.PlaneGeometry(320, 6);
        const mainPath = new THREE.Mesh(mainPathGeometry, pathMaterial);
        mainPath.rotation.x = -Math.PI / 2;
        mainPath.position.y = 0.1;
        this.scene.add(mainPath);
        
        const crossPath = new THREE.Mesh(mainPathGeometry, pathMaterial);
        crossPath.rotation.x = -Math.PI / 2;
        crossPath.rotation.z = Math.PI / 2;
        crossPath.position.y = 0.1;
        this.scene.add(crossPath);
        
        // Extended diagonal connecting paths
        const diagonalGeometry = new THREE.PlaneGeometry(280, 5);
        
        // Northeast to Southwest diagonal
        const diagonal1 = new THREE.Mesh(diagonalGeometry, pathMaterial);
        diagonal1.rotation.x = -Math.PI / 2;
        diagonal1.rotation.z = Math.PI / 4;
        diagonal1.position.y = 0.1;
        this.scene.add(diagonal1);
        
        // Northwest to Southeast diagonal
        const diagonal2 = new THREE.Mesh(diagonalGeometry, pathMaterial);
        diagonal2.rotation.x = -Math.PI / 2;
        diagonal2.rotation.z = -Math.PI / 4;
        diagonal2.position.y = 0.1;
        this.scene.add(diagonal2);
        
        // Extended radial paths to corners
        const radialPaths = [
            { angle: Math.PI / 4, length: 180 },      // To northeast
            { angle: 3 * Math.PI / 4, length: 180 },  // To northwest
            { angle: 5 * Math.PI / 4, length: 180 },  // To southwest
            { angle: 7 * Math.PI / 4, length: 180 }   // To southeast
        ];
        
        radialPaths.forEach(path => {
            const radialGeometry = new THREE.PlaneGeometry(path.length, 4);
            const radialPath = new THREE.Mesh(radialGeometry, pathMaterial);
            radialPath.rotation.x = -Math.PI / 2;
            radialPath.rotation.z = path.angle;
            radialPath.position.set(
                Math.cos(path.angle) * path.length / 2,
                0.1,
                Math.sin(path.angle) * path.length / 2
            );
            this.scene.add(radialPath);
        });
        
        // Add central fountain
        this.createFountain();
        
        // Add parking lots at corners
        this.createParkingLots();
        
        // Add decorative elements
        this.createDecorativeElements();
    }

    async createBuildings() {
        const buildingConfigs = {
            admin: { 
                pos: [0, 0, 0], 
                size: [15, 20, 15], 
                color: 0xffffff,
                accentColor: 0xeeeeee,
                name: 'Administration Center',
                type: 'admin'
            },
            // Northeast corner - Tech buildings (Cyan/Turquoise)
            research: { 
                pos: [110, 0, -110], 
                size: [25, 35, 25], 
                color: 0x00dddd,
                accentColor: 0x00aaaa,
                name: 'AI Research Center',
                type: 'tech'
            },
            datacenter: {
                pos: [130, 0, -60],
                size: [20, 28, 20],
                color: 0x00aaaa,
                accentColor: 0x008888,
                name: 'Data Center',
                type: 'tech'
            },
            // Northwest corner - Innovation (Yellow/Orange)
            innovation: { 
                pos: [-120, 0, -120], 
                size: [22, 30, 22], 
                color: 0xffdd00,
                accentColor: 0xff9900,
                name: 'Innovation Hub',
                type: 'innovation'
            },
            demo: {
                pos: [-135, 0, -25],
                size: [18, 25, 18],
                color: 0xff9900,
                accentColor: 0xff6600,
                name: 'Demo Areas',
                type: 'innovation'
            },
            // Southeast corner - Commercial (Pink)
            conference: { 
                pos: [115, 0, 115], 
                size: [28, 18, 22], 
                color: 0xff66cc,
                accentColor: 0xff3399,
                name: 'Conference Center',
                type: 'commercial'
            },
            exhibition: {
                pos: [135, 0, 85],
                size: [25, 15, 20],
                color: 0xff3399,
                accentColor: 0xff0066,
                name: 'Exhibition Center',
                type: 'commercial'
            },
            // Southwest corner - Residential (Purple/Magenta)
            residential: { 
                pos: [-125, 0, 125], 
                size: [20, 40, 20], 
                color: 0xff00ff,
                accentColor: 0xcc00cc,
                name: 'Residential Area',
                type: 'residential'
            },
            housing: {
                pos: [-140, 0, 95],
                size: [18, 35, 18],
                color: 0xcc00cc,
                accentColor: 0x9900aa,
                name: 'Student Housing',
                type: 'residential'
            },
            // Central and mid-range buildings
            startup1: { 
                pos: [-60, 0, -30], 
                size: [15, 32, 15], 
                color: 0x00dddd,
                accentColor: 0x00aaaa,
                name: 'Startup Hub A',
                type: 'tech'
            },
            startup2: { 
                pos: [60, 0, -30], 
                size: [15, 30, 15], 
                color: 0x00aaaa,  
                accentColor: 0x008888,
                name: 'Startup Hub B',
                type: 'tech'
            },
            commercial1: { 
                pos: [-80, 0, 40], 
                size: [22, 20, 18], 
                color: 0xff66cc,
                accentColor: 0xff3399,
                name: 'Commercial Center',
                type: 'commercial'
            },
            commercial2: { 
                pos: [80, 0, 40], 
                size: [20, 18, 16], 
                color: 0xff3399,
                accentColor: 0xff0066,
                name: 'Business Plaza',
                type: 'commercial'
            },
            transport: { 
                pos: [0, 0, 140], 
                size: [35, 12, 15], 
                color: 0x44aa44,
                accentColor: 0x338833,
                name: 'Transportation Hub',
                type: 'utility'
            },
            energy: { 
                pos: [-20, 0, 110], 
                size: [12, 45, 12], 
                color: 0x44aa44,
                accentColor: 0x338833,
                name: 'Energy Center',
                type: 'utility'
            }
        };

        const buildingPromises = Object.entries(buildingConfigs).map(([id, config]) => {
            return this.createBuilding(id, config);
        });

        this.buildings = await Promise.all(buildingPromises);
    }

    async createBuilding(id, config) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`🏗️ Creating building: ${config.name}`);
                
                // Create sophisticated building group with detailed architecture
                const buildingGroup = new THREE.Group();
                
                // Create multi-level building structure based on type
                this.createArchitecturalStructure(buildingGroup, config);
                
                // Add type-specific architectural features
                try {
                    switch(config.type) {
                        case 'residential':
                            this.addResidentialFeatures(buildingGroup, config);
                            break;
                        case 'tech':
                            this.addTechFeatures(buildingGroup, config);
                            break;
                        case 'innovation':
                            this.addInnovationFeatures(buildingGroup, config);
                            break;
                        case 'commercial':
                            this.addCommercialFeatures(buildingGroup, config);
                            break;
                        default:
                            this.addGenericFeatures(buildingGroup, config);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to add features for ${config.name}:`, error.message);
                    // Continue with basic building
                }
                
                // Add common architectural elements
                try {
                    this.addStructuralElements(buildingGroup, config);
                    this.addAdvancedWindows(buildingGroup, config);
                    this.addEntranceFeatures(buildingGroup, config);
                } catch (error) {
                    console.warn(`⚠️ Failed to add architectural details for ${config.name}:`, error.message);
                    // Continue with basic building
                }
                
                // Position the entire building group
                buildingGroup.position.set(config.pos[0], 0, config.pos[2]);
                
                buildingGroup.userData = { 
                    id, 
                    name: config.name,
                    originalColor: config.color,
                    type: config.type,
                    material: null // Will be set by main structure
                };
                
                this.scene.add(buildingGroup);
                console.log(`✅ Building created: ${config.name}`);
                resolve(buildingGroup);
                
            } catch (error) {
                console.error(`❌ Failed to create building ${config.name}:`, error);
                window.ThreeJSErrorHandler?.log(error, `Building Creation - ${config.name}`);
                
                // Create a simple fallback building
                try {
                    const fallbackBuilding = this.createFallbackBuilding(id, config);
                    resolve(fallbackBuilding);
                } catch (fallbackError) {
                    console.error(`❌ Fallback building creation failed for ${config.name}:`, fallbackError);
                    reject(new Error(`Failed to create building ${config.name}: ${error.message}`));
                }
            }
        });
    }

    createFallbackBuilding(id, config) {
        console.log(`🔧 Creating fallback building for: ${config.name}`);
        
        const buildingGroup = new THREE.Group();
        
        // Simple box geometry as fallback
        const geometry = new THREE.BoxGeometry(config.size[0], config.size[1], config.size[2]);
        const material = new THREE.MeshBasicMaterial({ 
            color: config.color,
            transparent: true,
            opacity: 0.8
        });
        
        const building = new THREE.Mesh(geometry, material);
        building.position.y = config.size[1] / 2;
        
        buildingGroup.add(building);
        buildingGroup.position.set(config.pos[0], 0, config.pos[2]);
        
        buildingGroup.userData = { 
            id, 
            name: config.name + ' (Simplified)',
            originalColor: config.color,
            type: config.type,
            material: material
        };
        
        this.scene.add(buildingGroup);
        return buildingGroup;
    }

    createArchitecturalStructure(buildingGroup, config) {
        try {
            const materials = {
                main: new THREE.MeshPhongMaterial({ 
                    color: config.color,
                    transparent: true,
                    opacity: 0,
                    shininess: 30
                }),
                accent: new THREE.MeshPhongMaterial({ 
                    color: config.accentColor,
                    transparent: true,
                    opacity: 0,
                    shininess: 50
                }),
                structural: new THREE.MeshPhongMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0,
                    shininess: 80
                })
            };
            
            // Create stepped building profile with varying heights
            const levels = Math.max(2, Math.floor(config.size[1] / 8));
            let currentHeight = 0;
            
            for (let level = 0; level < levels; level++) {
                const levelHeight = config.size[1] / levels;
                const shrinkFactor = level * 0.1; // Each level gets slightly smaller
                const levelWidth = config.size[0] - shrinkFactor * 2;
                const levelDepth = config.size[2] - shrinkFactor * 2;
                
                // Main level structure
                const levelGeometry = new THREE.BoxGeometry(levelWidth, levelHeight, levelDepth);
                const levelMaterial = level % 2 === 0 ? materials.main : materials.accent;
                const levelMesh = new THREE.Mesh(levelGeometry, levelMaterial);
                
                levelMesh.position.y = currentHeight + levelHeight / 2;
                
                if (this.config.shadows) {
                    levelMesh.castShadow = true;
                    levelMesh.receiveShadow = true;
                }
                
                buildingGroup.add(levelMesh);
                
                // Add horizontal structural bands
                if (level > 0) {
                    const bandGeometry = new THREE.BoxGeometry(levelWidth + 1, 0.5, levelDepth + 1);
                    const band = new THREE.Mesh(bandGeometry, materials.structural);
                    band.position.y = currentHeight;
                    buildingGroup.add(band);
                }
                
                currentHeight += levelHeight;
            }
            
            // Store main material for animation
            buildingGroup.userData.material = materials.main;
            
        } catch (error) {
            console.error('❌ Failed to create architectural structure:', error);
            throw error;
        }
    }

    addResidentialFeatures(buildingGroup, config) {
        // Add balconies with railings like in Image 2
        const levels = Math.floor(config.size[1] / 8);
        for (let level = 1; level < levels; level++) {
            const balconyHeight = level * (config.size[1] / levels);
            
            // Front balconies
            const balconyGeometry = new THREE.BoxGeometry(config.size[0] * 0.8, 0.3, 2);
            const balconyMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0
            });
            const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
            balcony.position.set(0, balconyHeight, config.size[2]/2 + 1);
            buildingGroup.add(balcony);
            
            // Balcony railings
            for (let i = 0; i < 5; i++) {
                const railingGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 6);
                const railingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
                const railing = new THREE.Mesh(railingGeometry, railingMaterial);
                railing.position.set(
                    -config.size[0] * 0.3 + i * config.size[0] * 0.15,
                    balconyHeight + 0.6,
                    config.size[2]/2 + 1
                );
                buildingGroup.add(railing);
            }
        }
    }

    addTechFeatures(buildingGroup, config) {
        // Modern glass facades and tech elements
        const glassGeometry = new THREE.PlaneGeometry(config.size[0] * 0.9, config.size[1] * 0.8);
        const glassMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.3,
            reflectivity: 0.8
        });
        
        // Glass facade on front
        const glassFacade = new THREE.Mesh(glassGeometry, glassMaterial);
        glassFacade.position.set(0, config.size[1]/2, config.size[2]/2 + 0.1);
        buildingGroup.add(glassFacade);
        
        // Tech antennas
        for (let i = 0; i < 3; i++) {
            const antennaGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
            const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.set(
                -config.size[0]/3 + i * config.size[0]/3,
                config.size[1] + 2.5,
                0
            );
            buildingGroup.add(antenna);
        }
    }

    addInnovationFeatures(buildingGroup, config) {
        // Dynamic angular elements and creative shapes
        const levels = Math.floor(config.size[1] / 6);
        for (let level = 0; level < levels; level++) {
            const finHeight = level * (config.size[1] / levels);
            
            // Architectural fins
            const finGeometry = new THREE.BoxGeometry(0.5, config.size[1] / levels, 3);
            const finMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0
            });
            
            // Side fins
            const leftFin = new THREE.Mesh(finGeometry, finMaterial);
            leftFin.position.set(-config.size[0]/2 - 0.25, finHeight + (config.size[1] / levels)/2, 0);
            buildingGroup.add(leftFin);
            
            const rightFin = new THREE.Mesh(finGeometry, finMaterial);
            rightFin.position.set(config.size[0]/2 + 0.25, finHeight + (config.size[1] / levels)/2, 0);
            buildingGroup.add(rightFin);
        }
    }

    addCommercialFeatures(buildingGroup, config) {
        // Large signage areas and commercial elements
        const signageGeometry = new THREE.PlaneGeometry(config.size[0] * 0.6, 4);
        const signageMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0
        });
        
        const signage = new THREE.Mesh(signageGeometry, signageMaterial);
        signage.position.set(0, config.size[1] * 0.8, config.size[2]/2 + 0.2);
        buildingGroup.add(signage);
    }

    addGenericFeatures(buildingGroup, config) {
        // Standard architectural elements
        const capGeometry = new THREE.BoxGeometry(config.size[0] + 2, 1, config.size[2] + 2);
        const capMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xeeeeee,
            transparent: true,
            opacity: 0
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = config.size[1] + 0.5;
        buildingGroup.add(cap);
    }

    addStructuralElements(buildingGroup, config) {
        // White structural frames like in Image 2
        const frameWidth = 0.8;
        const frameMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            shininess: 100
        });
        
        // Vertical frames
        for (let i = 0; i <= 4; i++) {
            const frameGeometry = new THREE.BoxGeometry(frameWidth, config.size[1], frameWidth);
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(
                -config.size[0]/2 + i * (config.size[0]/4),
                config.size[1]/2,
                config.size[2]/2 + 0.5
            );
            buildingGroup.add(frame);
        }
        
        // Horizontal frames every few floors
        const floors = Math.floor(config.size[1] / 4);
        for (let floor = 1; floor < floors; floor++) {
            const floorHeight = floor * 4;
            const horizontalFrameGeometry = new THREE.BoxGeometry(config.size[0] + 1, frameWidth, frameWidth);
            const horizontalFrame = new THREE.Mesh(horizontalFrameGeometry, frameMaterial);
            horizontalFrame.position.set(0, floorHeight, config.size[2]/2 + 0.5);
            buildingGroup.add(horizontalFrame);
        }
    }

    addAdvancedWindows(buildingGroup, config) {
        // Horizontal window strips with white frames
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4A90E2,
            transparent: true,
            opacity: 0.4,
            reflectivity: 0.6
        });
        
        const frameMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0
        });
        
        const floors = Math.floor(config.size[1] / 4);
        for (let floor = 0; floor < floors; floor++) {
            const floorHeight = floor * 4 + 2;
            
            // Front window strip
            const windowGeometry = new THREE.PlaneGeometry(config.size[0] * 0.8, 1.5);
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(0, floorHeight, config.size[2]/2 + 0.05);
            buildingGroup.add(window);
            
            // Window frame
            const frameGeometry = new THREE.PlaneGeometry(config.size[0] * 0.82, 1.7);
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, floorHeight, config.size[2]/2 + 0.04);
            buildingGroup.add(frame);
            
            // Side windows
            const sideWindowGeometry = new THREE.PlaneGeometry(config.size[2] * 0.8, 1.5);
            
            const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
            leftWindow.rotation.y = Math.PI / 2;
            leftWindow.position.set(-config.size[0]/2 - 0.05, floorHeight, 0);
            buildingGroup.add(leftWindow);
            
            const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
            rightWindow.rotation.y = -Math.PI / 2;
            rightWindow.position.set(config.size[0]/2 + 0.05, floorHeight, 0);
            buildingGroup.add(rightWindow);
        }
    }

    addEntranceFeatures(buildingGroup, config) {
        // Modern entrance with stairs and canopy
        const stairsGeometry = new THREE.BoxGeometry(config.size[0] * 0.6, 1, 8);
        const stairsMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xcccccc,
            transparent: true,
            opacity: 0
        });
        const stairs = new THREE.Mesh(stairsGeometry, stairsMaterial);
        stairs.position.set(0, 0.5, config.size[2]/2 + 4);
        buildingGroup.add(stairs);
        
        // Entrance canopy
        const canopyGeometry = new THREE.BoxGeometry(config.size[0] * 0.8, 0.5, 6);
        const canopyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.set(0, 4, config.size[2]/2 + 3);
        buildingGroup.add(canopy);
        
        // Support pillars
        for (let i = 0; i < 3; i++) {
            const pillarGeometry = new THREE.CylinderGeometry(0.4, 0.4, 4, 12);
            const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(
                -config.size[0] * 0.3 + i * config.size[0] * 0.3,
                2,
                config.size[2]/2 + 3
            );
            buildingGroup.add(pillar);
        }
    }


    // Animation and Updates
    updatePhaseVisibility(phase) {
        if (!this.phases[phase] || this.currentPhase === phase) return;
        
        this.currentPhase = phase;
        const phaseData = this.phases[phase];
        
        console.log(`🔄 Switching to ${phaseData.label}`);
        
        this.buildings.forEach(building => {
            const shouldShow = phaseData.buildings.includes(building.userData.id);
            this.animateBuildingVisibility(building, shouldShow);
        });

        // Animate camera to phase position
        this.animateCamera(phaseData.cameraPosition);
        
        // Update UI
        this.updatePhaseIndicator(phase);
    }

    animateBuildingVisibility(building, show) {
        const targetOpacity = show ? 1 : 0.1;
        const material = building.userData.material;
        const startOpacity = material.opacity;
        
        if (startOpacity === targetOpacity) return;
        
        let progress = 0;
        const duration = 1000; // ms
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = this.easeInOutCubic(progress);
            
            const currentOpacity = THREE.MathUtils.lerp(startOpacity, targetOpacity, easeProgress);
            material.opacity = currentOpacity;
            
            // Also animate all child objects (windows, canopies, etc.)
            building.traverse((child) => {
                if (child.material && child.material.opacity !== undefined) {
                    child.material.opacity = currentOpacity * (child.material.userData?.baseOpacity || 1);
                }
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    setCameraView(view) {
        if (!this.viewPositions[view] || this.currentView === view) return;
        
        this.currentView = view;
        const position = this.viewPositions[view];
        this.animateCamera(position);
        
        console.log(`📷 Camera view: ${position.name}`);
        
        // Update active button
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
    }

    animateCamera(targetPosition) {
        const startPosition = this.camera.position.clone();
        const endPosition = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
        
        let progress = 0;
        const duration = 2000; // ms
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = this.easeInOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, endPosition, easeProgress);
            this.camera.lookAt(0, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Easing function
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Animation Loop
    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            
            this.updateFPS();
            this.controls.update();
            this.render();
        };
        
        animate();
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Event Handlers
    setupEventListeners() {
        // Resize handler
        const resizeHandler = this.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
        
        // Timeline interaction
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTimelineClick(item);
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTimelineClick(item);
                }
            });
        });

        // View controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.dataset.view;
                this.setCameraView(view);
            });
        });

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else {
                this.resumeAnimation();
            }
        });
    }

    handleTimelineClick(item) {
        // Remove active class from all items
        document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Update phase
        const phase = item.dataset.phase;
        this.updatePhaseVisibility(phase);
    }

    handleResize() {
        const container = document.getElementById('threejs-container');
        if (!container || !this.camera || !this.renderer) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        console.log(`📐 Resized: ${width}x${height}`);
    }

    updatePhaseIndicator(phase) {
        const phaseData = this.phases[phase];
        if (!phaseData) return;
        
        // Update any phase indicators in UI
        const indicator = document.querySelector('.phase-indicator');
        if (indicator) {
            indicator.textContent = phaseData.label;
        }
    }

    // Performance Management
    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resumeAnimation() {
        if (!this.animationId) {
            this.startAnimation();
        }
    }

    // Loading States
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 600);
        }
    }

    showError(message) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="loading-content">
                    <div style="color: #ef4444; font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <p style="color: white; text-align: center;">${message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
    }

    // Cleanup
    dispose() {
        this.pauseAnimation();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Clean up geometries and materials
        this.buildings.forEach(building => {
            if (building.geometry) building.geometry.dispose();
            if (building.material) building.material.dispose();
        });
        
        console.log('🧹 3D resources cleaned up');
    }
}

// Export for use
window.MasterPlan3D = MasterPlan3D;