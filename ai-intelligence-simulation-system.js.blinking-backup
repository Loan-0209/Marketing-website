/**
 * AI Intelligence Simulation System for Smart City Buildings
 * Makes buildings respond dynamically to simulate AI intelligence
 * Includes smart windows, LED strips, adaptive architecture, and environmental responses
 */

class AIIntelligenceSimulationSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.intelligentBuildings = new Map(); // Store AI-enhanced buildings
        this.activeIntelligence = [];
        this.ledStrips = [];
        this.rooftopElements = [];
        this.performanceMonitor = new PerformanceMonitor();
        
        // Performance settings
        this.maxIntelligentBuildings = 50; // Up to 50 of 146+ buildings
        this.proximityDistance = 120; // Distance for camera interaction
        this.syncDistance = 80; // Distance for building synchronization
        this.updateInterval = 16; // ~60 FPS target
        
        // Day/night cycle settings
        this.dayNightCycle = {
            duration: 120000, // 2 minutes for full cycle
            currentTime: 0,
            isDay: true,
            sunriseStart: 0.2,   // 20% of cycle
            dayStart: 0.3,       // 30% of cycle
            sunsetStart: 0.7,    // 70% of cycle
            nightStart: 0.8      // 80% of cycle
        };
        
        // AI activity patterns
        this.activityPatterns = {
            residential: {
                baseActivity: 0.3,
                peakHours: [7, 8, 18, 19, 20],
                windowOpacity: [0.2, 0.8],
                ledIntensity: [0.5, 1.5],
                adaptiveScale: [0.98, 1.02]
            },
            office: {
                baseActivity: 0.6,
                peakHours: [9, 10, 11, 14, 15, 16],
                windowOpacity: [0.4, 0.9],
                ledIntensity: [0.8, 2.0],
                adaptiveScale: [0.99, 1.03]
            },
            commercial: {
                baseActivity: 0.8,
                peakHours: [10, 11, 12, 13, 19, 20, 21],
                windowOpacity: [0.6, 1.0],
                ledIntensity: [1.0, 2.5],
                adaptiveScale: [0.97, 1.05]
            },
            industrial: {
                baseActivity: 0.9,
                peakHours: [6, 7, 8, 9, 10, 22, 23, 0],
                windowOpacity: [0.8, 1.0],
                ledIntensity: [1.2, 3.0],
                adaptiveScale: [0.95, 1.08]
            }
        };
        
        // Color temperature presets
        this.colorTemperatures = {
            warmWhite: { r: 1.0, g: 0.9, b: 0.7, temp: 3000 },
            coolWhite: { r: 0.9, g: 0.95, b: 1.0, temp: 5000 },
            daylight: { r: 1.0, g: 1.0, b: 1.0, temp: 6500 },
            coolDaylight: { r: 0.8, g: 0.9, b: 1.0, temp: 7500 },
            sunrise: { r: 1.0, g: 0.7, b: 0.4, temp: 2500 },
            sunset: { r: 1.0, g: 0.6, b: 0.3, temp: 2200 }
        };
        
        // Materials cache
        this.materials = this.createIntelligenceMaterials();
        
        // Geometries cache
        this.geometries = this.createIntelligenceGeometries();
        
        console.log('🤖 AI Intelligence Simulation System initialized');
    }
    
    /**
     * Create materials for AI intelligence effects
     */
    createIntelligenceMaterials() {
        const materials = {};
        
        // Smart window materials
        materials.smartWindow = new THREE.MeshStandardMaterial({
            color: 0xAADDFF,
            emissive: 0x002244,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6,
            metalness: 0.1,
            roughness: 0.1
        });
        
        // LED strip materials (different colors)
        const ledColors = {
            blue: 0x0088FF,
            green: 0x00FF88,
            red: 0xFF4400,
            white: 0xFFFFFF,
            cyan: 0x00FFFF,
            purple: 0x8800FF
        };
        
        Object.keys(ledColors).forEach(color => {
            materials[`led_${color}`] = new THREE.MeshStandardMaterial({
                color: ledColors[color],
                emissive: ledColors[color],
                emissiveIntensity: 1.5,
                transparent: true,
                opacity: 0.9
            });
        });
        
        // Rooftop element materials
        materials.rooftopElement = new THREE.MeshStandardMaterial({
            color: 0x444444,
            emissive: 0x002200,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.3
        });
        
        // Adaptive architecture materials
        materials.adaptiveSection = new THREE.MeshStandardMaterial({
            color: 0x666666,
            emissive: 0x111111,
            emissiveIntensity: 0.4,
            metalness: 0.6,
            roughness: 0.4,
            transparent: true,
            opacity: 0.8
        });
        
        return materials;
    }
    
    /**
     * Create geometries for AI intelligence elements
     */
    createIntelligenceGeometries() {
        const geometries = {};
        
        // Smart window geometries
        geometries.window_small = new THREE.PlaneGeometry(2, 1.5);
        geometries.window_medium = new THREE.PlaneGeometry(3, 2);
        geometries.window_large = new THREE.PlaneGeometry(4, 2.5);
        
        // LED strip geometries
        geometries.led_strip = new THREE.BoxGeometry(0.2, 0.1, 2);
        geometries.led_point = new THREE.SphereGeometry(0.15, 8, 6);
        
        // Rooftop element geometries
        geometries.antenna = new THREE.CylinderGeometry(0.1, 0.1, 5);
        geometries.satellite = new THREE.BoxGeometry(2, 0.5, 2);
        geometries.solar_panel = new THREE.BoxGeometry(3, 0.1, 2);
        
        // Adaptive section geometries
        geometries.adaptive_panel = new THREE.BoxGeometry(1, 3, 0.2);
        geometries.adaptive_wing = new THREE.BoxGeometry(2, 1, 0.5);
        
        return geometries;
    }
    
    /**
     * Initialize AI intelligence for selected buildings
     */
    initializeAIIntelligence() {
        console.log('🤖 Đang khởi tạo AI Intelligence Simulation...');
        
        const buildings = this.findAllBuildings();
        console.log(`🏗️ Tìm thấy ${buildings.length} tòa nhà`);
        
        if (buildings.length === 0) {
            console.warn('⚠️ Không tìm thấy tòa nhà nào');
            return;
        }
        
        // Select buildings for AI intelligence (prioritize variety)
        const selectedBuildings = this.selectIntelligentBuildings(buildings, this.maxIntelligentBuildings);
        console.log(`🧠 Đã chọn ${selectedBuildings.length} tòa nhà cho AI intelligence`);
        
        let totalEnhancements = 0;
        const activityTypes = Object.keys(this.activityPatterns);
        
        selectedBuildings.forEach((building, index) => {
            const activityType = activityTypes[index % activityTypes.length];
            this.enhanceBuildingWithAI(building, activityType, index);
            totalEnhancements++;
        });
        
        console.log(`✅ Đã tạo ${totalEnhancements} AI-enhanced buildings`);
        this.startIntelligenceSystem();
    }
    
    /**
     * Find all buildings in the scene
     */
    findAllBuildings() {
        const buildings = [];
        
        this.scene.traverse((child) => {
            if (child.isMesh && child.geometry && child.geometry.type === 'BoxGeometry') {
                if (!child.userData.type || child.userData.type === 'building') {
                    buildings.push(child);
                }
            }
        });
        
        return buildings;
    }
    
    /**
     * Select buildings for AI intelligence (ensure good distribution)
     */
    selectIntelligentBuildings(buildings, maxCount) {
        const selectedCount = Math.min(maxCount, buildings.length);
        const selected = [];
        
        // Sort by position to ensure good spatial distribution
        const sortedBuildings = buildings.sort((a, b) => {
            const aPos = a.position.x + a.position.z;
            const bPos = b.position.x + b.position.z;
            return aPos - bPos;
        });
        
        // Select every Nth building for even distribution
        const step = Math.floor(buildings.length / selectedCount);
        for (let i = 0; i < selectedCount; i++) {
            const index = (i * step) % buildings.length;
            selected.push(sortedBuildings[index]);
        }
        
        return selected;
    }
    
    /**
     * Enhance a building with AI intelligence features
     */
    enhanceBuildingWithAI(building, activityType, buildingIndex) {
        const activityConfig = this.activityPatterns[activityType];
        
        // Get building properties
        const buildingBox = new THREE.Box3().setFromObject(building);
        const buildingCenter = buildingBox.getCenter(new THREE.Vector3());
        const buildingSize = buildingBox.getSize(new THREE.Vector3());
        
        // Create AI intelligence group
        const aiGroup = new THREE.Group();
        aiGroup.name = `ai_intelligence_${buildingIndex}`;
        
        // Add smart windows
        const windows = this.createSmartWindows(building, buildingSize, activityConfig);
        windows.forEach(window => aiGroup.add(window));
        
        // Add LED strips
        const ledStrips = this.createLEDStrips(building, buildingSize, activityConfig);
        ledStrips.forEach(strip => aiGroup.add(strip));
        
        // Add rooftop elements
        const rooftopElements = this.createRooftopElements(building, buildingSize, buildingCenter);
        rooftopElements.forEach(element => aiGroup.add(element));
        
        // Add adaptive architecture elements
        const adaptiveElements = this.createAdaptiveElements(building, buildingSize, activityConfig);
        adaptiveElements.forEach(element => aiGroup.add(element));
        
        // Position AI group at building center
        aiGroup.position.copy(buildingCenter);
        
        // Add to scene
        this.scene.add(aiGroup);
        
        // Store AI intelligence data
        const aiData = {
            id: buildingIndex,
            building: building,
            group: aiGroup,
            activityType: activityType,
            config: activityConfig,
            windows: windows,
            ledStrips: ledStrips,
            rooftopElements: rooftopElements,
            adaptiveElements: adaptiveElements,
            buildingCenter: buildingCenter,
            buildingSize: buildingSize,
            currentActivity: activityConfig.baseActivity,
            occupancyLevel: Math.random() * 0.8 + 0.2, // 20-100%
            lastUpdate: 0,
            syncNeighbors: [],
            proximityGlow: 0
        };
        
        this.intelligentBuildings.set(building.uuid, aiData);
        this.activeIntelligence.push(aiData);
        
        return aiGroup;
    }
    
    /**
     * Create smart windows for a building
     */
    createSmartWindows(building, buildingSize, activityConfig) {
        const windows = [];
        const windowCount = Math.floor(buildingSize.y / 8) * 2; // 2 windows per floor-like section
        
        for (let i = 0; i < windowCount; i++) {
            const windowSize = Math.random() > 0.5 ? 'window_medium' : 'window_small';
            const geometry = this.geometries[windowSize];
            const material = this.materials.smartWindow.clone();
            
            const window = new THREE.Mesh(geometry, material);
            
            // Position windows on building faces
            const face = Math.floor(Math.random() * 4); // 4 faces
            const height = (i / windowCount) * buildingSize.y - buildingSize.y * 0.4;
            
            switch (face) {
                case 0: // Front
                    window.position.set(
                        (Math.random() - 0.5) * buildingSize.x * 0.6,
                        height,
                        buildingSize.z * 0.51
                    );
                    break;
                case 1: // Back
                    window.position.set(
                        (Math.random() - 0.5) * buildingSize.x * 0.6,
                        height,
                        -buildingSize.z * 0.51
                    );
                    window.rotation.y = Math.PI;
                    break;
                case 2: // Right
                    window.position.set(
                        buildingSize.x * 0.51,
                        height,
                        (Math.random() - 0.5) * buildingSize.z * 0.6
                    );
                    window.rotation.y = Math.PI / 2;
                    break;
                case 3: // Left
                    window.position.set(
                        -buildingSize.x * 0.51,
                        height,
                        (Math.random() - 0.5) * buildingSize.z * 0.6
                    );
                    window.rotation.y = -Math.PI / 2;
                    break;
            }
            
            window.userData = {
                type: 'smart_window',
                face: face,
                baseOpacity: material.opacity,
                occupancyFactor: Math.random() * 0.8 + 0.2,
                blinkPhase: Math.random() * Math.PI * 2
            };
            
            windows.push(window);
        }
        
        return windows;
    }
    
    /**
     * Create LED strips for a building
     */
    createLEDStrips(building, buildingSize, activityConfig) {
        const ledStrips = [];
        const stripCount = Math.floor(buildingSize.y / 15) + 2; // At least 2 strips
        const ledColors = ['blue', 'green', 'cyan', 'white'];
        
        for (let i = 0; i < stripCount; i++) {
            const color = ledColors[Math.floor(Math.random() * ledColors.length)];
            const geometry = this.geometries.led_strip;
            const material = this.materials[`led_${color}`].clone();
            
            const strip = new THREE.Mesh(geometry, material);
            
            // Position strips around building edges
            const position = i / stripCount;
            const height = (position - 0.5) * buildingSize.y;
            const edge = Math.floor(Math.random() * 4);
            
            switch (edge) {
                case 0: // Front edge
                    strip.position.set(buildingSize.x * 0.52, height, 0);
                    strip.rotation.y = Math.PI / 2;
                    break;
                case 1: // Back edge
                    strip.position.set(-buildingSize.x * 0.52, height, 0);
                    strip.rotation.y = -Math.PI / 2;
                    break;
                case 2: // Right edge
                    strip.position.set(0, height, buildingSize.z * 0.52);
                    break;
                case 3: // Left edge
                    strip.position.set(0, height, -buildingSize.z * 0.52);
                    break;
            }
            
            strip.userData = {
                type: 'led_strip',
                color: color,
                baseIntensity: material.emissiveIntensity,
                pulseSpeed: 1 + Math.random() * 2,
                pulsePhase: Math.random() * Math.PI * 2,
                activitySensitivity: 0.5 + Math.random() * 0.5
            };
            
            ledStrips.push(strip);
        }
        
        return ledStrips;
    }
    
    /**
     * Create rooftop elements for environmental tracking
     */
    createRooftopElements(building, buildingSize, buildingCenter) {
        const elements = [];
        const elementCount = Math.floor(Math.random() * 3) + 1; // 1-3 elements
        const elementTypes = ['antenna', 'satellite', 'solar_panel'];
        
        for (let i = 0; i < elementCount; i++) {
            const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
            const geometry = this.geometries[type];
            const material = this.materials.rooftopElement.clone();
            
            const element = new THREE.Mesh(geometry, material);
            
            // Position on rooftop
            element.position.set(
                (Math.random() - 0.5) * buildingSize.x * 0.6,
                buildingSize.y * 0.5 + 2,
                (Math.random() - 0.5) * buildingSize.z * 0.6
            );
            
            element.userData = {
                type: 'rooftop_element',
                elementType: type,
                rotationSpeed: 0.2 + Math.random() * 0.8,
                trackingTarget: {
                    x: Math.random() * 200 - 100,
                    y: 50 + Math.random() * 50,
                    z: Math.random() * 200 - 100
                },
                environmentalFactor: Math.random()
            };
            
            elements.push(element);
        }
        
        return elements;
    }
    
    /**
     * Create adaptive architecture elements
     */
    createAdaptiveElements(building, buildingSize, activityConfig) {
        const elements = [];
        const elementCount = Math.floor(Math.random() * 4) + 2; // 2-5 elements
        const elementTypes = ['adaptive_panel', 'adaptive_wing'];
        
        for (let i = 0; i < elementCount; i++) {
            const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
            const geometry = this.geometries[type];
            const material = this.materials.adaptiveSection.clone();
            
            const element = new THREE.Mesh(geometry, material);
            
            // Position on building surfaces
            const face = Math.floor(Math.random() * 4);
            const height = (Math.random() - 0.3) * buildingSize.y;
            
            switch (face) {
                case 0:
                    element.position.set(
                        (Math.random() - 0.5) * buildingSize.x * 0.8,
                        height,
                        buildingSize.z * 0.52
                    );
                    break;
                case 1:
                    element.position.set(
                        (Math.random() - 0.5) * buildingSize.x * 0.8,
                        height,
                        -buildingSize.z * 0.52
                    );
                    break;
                case 2:
                    element.position.set(
                        buildingSize.x * 0.52,
                        height,
                        (Math.random() - 0.5) * buildingSize.z * 0.8
                    );
                    break;
                case 3:
                    element.position.set(
                        -buildingSize.x * 0.52,
                        height,
                        (Math.random() - 0.5) * buildingSize.z * 0.8
                    );
                    break;
            }
            
            element.userData = {
                type: 'adaptive_element',
                elementType: type,
                baseScale: { x: 1, y: 1, z: 1 },
                adaptiveRange: activityConfig.adaptiveScale,
                adaptationSpeed: 0.5 + Math.random() * 1.0,
                adaptationPhase: Math.random() * Math.PI * 2
            };
            
            elements.push(element);
        }
        
        return elements;
    }
    
    /**
     * Start the AI intelligence system
     */
    startIntelligenceSystem() {
        console.log('🎬 Khởi động hệ thống AI Intelligence Simulation...');
        
        // Find neighboring buildings for synchronization
        this.findSyncNeighbors();
        
        // Start main animation loop
        const animate = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - (this.lastUpdateTime || currentTime);
            this.lastUpdateTime = currentTime;
            
            // Update day/night cycle
            this.updateDayNightCycle(deltaTime);
            
            // Update performance monitoring
            this.performanceMonitor.update(deltaTime);
            
            // Only update if performance is good
            if (this.performanceMonitor.canUpdate()) {
                this.updateIntelligentBuildings(currentTime * 0.001, deltaTime);
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Find neighboring buildings for synchronization effects
     */
    findSyncNeighbors() {
        this.activeIntelligence.forEach(aiData => {
            aiData.syncNeighbors = [];
            
            this.activeIntelligence.forEach(otherData => {
                if (otherData !== aiData) {
                    const distance = aiData.buildingCenter.distanceTo(otherData.buildingCenter);
                    if (distance < this.syncDistance) {
                        aiData.syncNeighbors.push(otherData);
                    }
                }
            });
        });
    }
    
    /**
     * Update day/night cycle
     */
    updateDayNightCycle(deltaTime) {
        this.dayNightCycle.currentTime += deltaTime;
        const cycleProgress = (this.dayNightCycle.currentTime % this.dayNightCycle.duration) / this.dayNightCycle.duration;
        
        // Determine current phase
        let currentPhase;
        let phaseProgress;
        
        if (cycleProgress < this.dayNightCycle.sunriseStart) {
            currentPhase = 'night';
            phaseProgress = cycleProgress / this.dayNightCycle.sunriseStart;
        } else if (cycleProgress < this.dayNightCycle.dayStart) {
            currentPhase = 'sunrise';
            phaseProgress = (cycleProgress - this.dayNightCycle.sunriseStart) / (this.dayNightCycle.dayStart - this.dayNightCycle.sunriseStart);
        } else if (cycleProgress < this.dayNightCycle.sunsetStart) {
            currentPhase = 'day';
            phaseProgress = (cycleProgress - this.dayNightCycle.dayStart) / (this.dayNightCycle.sunsetStart - this.dayNightCycle.dayStart);
        } else if (cycleProgress < this.dayNightCycle.nightStart) {
            currentPhase = 'sunset';
            phaseProgress = (cycleProgress - this.dayNightCycle.sunsetStart) / (this.dayNightCycle.nightStart - this.dayNightCycle.sunsetStart);
        } else {
            currentPhase = 'night';
            phaseProgress = (cycleProgress - this.dayNightCycle.nightStart) / (1 - this.dayNightCycle.nightStart);
        }
        
        this.dayNightCycle.currentPhase = currentPhase;
        this.dayNightCycle.phaseProgress = phaseProgress;
        this.dayNightCycle.isDay = (currentPhase === 'day' || currentPhase === 'sunrise');
    }
    
    /**
     * Update all intelligent buildings
     */
    updateIntelligentBuildings(time, deltaTime) {
        const cameraPos = this.camera.position;
        const currentHour = Math.floor((time * 0.1) % 24); // Simulate 24-hour cycle
        
        this.activeIntelligence.forEach(aiData => {
            const distance = cameraPos.distanceTo(aiData.buildingCenter);
            
            // Update activity level based on time and building type
            this.updateActivityLevel(aiData, currentHour, time);
            
            // Update proximity glow
            this.updateProximityGlow(aiData, distance);
            
            // Update smart windows
            this.updateSmartWindows(aiData, time);
            
            // Update LED strips
            this.updateLEDStrips(aiData, time);
            
            // Update rooftop elements
            this.updateRooftopElements(aiData, time);
            
            // Update adaptive architecture
            this.updateAdaptiveElements(aiData, time);
            
            // Update building color temperature
            this.updateColorTemperature(aiData);
            
            // Handle synchronization with neighbors
            this.updateSynchronization(aiData, time);
        });
    }
    
    /**
     * Update building activity level
     */
    updateActivityLevel(aiData, currentHour, time) {
        const config = aiData.config;
        let activityMultiplier = 1.0;
        
        // Check if current hour is peak hour
        if (config.peakHours.includes(currentHour)) {
            activityMultiplier = 1.5 + Math.sin(time * 2) * 0.3;
        } else {
            activityMultiplier = 0.6 + Math.sin(time * 0.5) * 0.2;
        }
        
        // Add random fluctuations
        activityMultiplier += (Math.random() - 0.5) * 0.2;
        
        aiData.currentActivity = config.baseActivity * activityMultiplier;
        aiData.currentActivity = Math.max(0.1, Math.min(2.0, aiData.currentActivity));
    }
    
    /**
     * Update proximity glow effect
     */
    updateProximityGlow(aiData, distance) {
        if (distance < this.proximityDistance) {
            const glowIntensity = Math.max(0, 1 - (distance / this.proximityDistance));
            aiData.proximityGlow = glowIntensity;
            
            // Apply glow to building material
            if (aiData.building.material) {
                aiData.building.material.emissiveIntensity = 0.2 + glowIntensity * 0.8;
            }
        } else {
            aiData.proximityGlow = 0;
            if (aiData.building.material) {
                aiData.building.material.emissiveIntensity = 0.2;
            }
        }
    }
    
    /**
     * Update smart windows
     */
    updateSmartWindows(aiData, time) {
        aiData.windows.forEach(window => {
            const userData = window.userData;
            
            // Simulate occupancy changes
            const occupancyFluctuation = Math.sin(time * 0.3 + userData.blinkPhase) * 0.3;
            const currentOccupancy = aiData.occupancyLevel + occupancyFluctuation;
            
            // Calculate window opacity based on occupancy and activity
            const targetOpacity = aiData.config.windowOpacity[0] + 
                                (aiData.config.windowOpacity[1] - aiData.config.windowOpacity[0]) * 
                                currentOccupancy * aiData.currentActivity;
            
            // Smooth transition
            window.material.opacity = THREE.MathUtils.lerp(window.material.opacity, targetOpacity, 0.02);
            
            // Random window "blinking" for realism
            if (Math.random() < 0.001) { // 0.1% chance per frame
                window.material.opacity *= 0.3;
                setTimeout(() => {
                    window.material.opacity = targetOpacity;
                }, 100 + Math.random() * 500);
            }
        });
    }
    
    /**
     * Update LED strips
     */
    updateLEDStrips(aiData, time) {
        aiData.ledStrips.forEach(strip => {
            const userData = strip.userData;
            
            // Pulse based on building activity
            const pulseIntensity = Math.sin(time * userData.pulseSpeed + userData.pulsePhase) * 0.5 + 0.5;
            const activityBoost = aiData.currentActivity * userData.activitySensitivity;
            
            strip.material.emissiveIntensity = userData.baseIntensity * (0.5 + pulseIntensity * 0.5 + activityBoost);
            
            // Sync with nearby buildings
            if (aiData.syncNeighbors.length > 0) {
                const syncIntensity = Math.sin(time * 1.5) * 0.3;
                strip.material.emissiveIntensity += syncIntensity;
            }
        });
    }
    
    /**
     * Update rooftop elements
     */
    updateRooftopElements(aiData, time) {
        aiData.rooftopElements.forEach(element => {
            const userData = element.userData;
            
            // Rotate to track environmental conditions
            const targetRotationY = Math.atan2(
                userData.trackingTarget.x - element.position.x,
                userData.trackingTarget.z - element.position.z
            ) + Math.sin(time * 0.2) * userData.environmentalFactor;
            
            // Smooth rotation
            element.rotation.y = THREE.MathUtils.lerp(element.rotation.y, targetRotationY, userData.rotationSpeed * 0.01);
            
            // Additional movement based on element type
            if (userData.elementType === 'antenna') {
                element.rotation.z = Math.sin(time * 0.5) * 0.1;
            } else if (userData.elementType === 'satellite') {
                element.rotation.x = Math.sin(time * 0.3) * 0.2;
            }
        });
    }
    
    /**
     * Update adaptive architecture elements
     */
    updateAdaptiveElements(aiData, time) {
        aiData.adaptiveElements.forEach(element => {
            const userData = element.userData;
            
            // Calculate adaptive scaling based on activity
            const adaptationFactor = Math.sin(time * userData.adaptationSpeed + userData.adaptationPhase) * 0.5 + 0.5;
            const activityInfluence = aiData.currentActivity * 0.3;
            
            const scaleRange = userData.adaptiveRange;
            const targetScale = scaleRange[0] + (scaleRange[1] - scaleRange[0]) * (adaptationFactor + activityInfluence);
            
            // Apply scaling
            if (userData.elementType === 'adaptive_panel') {
                element.scale.y = THREE.MathUtils.lerp(element.scale.y, targetScale, 0.01);
            } else if (userData.elementType === 'adaptive_wing') {
                element.scale.x = THREE.MathUtils.lerp(element.scale.x, targetScale, 0.01);
                element.scale.z = THREE.MathUtils.lerp(element.scale.z, targetScale * 0.8, 0.01);
            }
        });
    }
    
    /**
     * Update color temperature based on day/night cycle
     */
    updateColorTemperature(aiData) {
        let targetColor;
        
        switch (this.dayNightCycle.currentPhase) {
            case 'sunrise':
                targetColor = this.colorTemperatures.sunrise;
                break;
            case 'day':
                targetColor = this.colorTemperatures.daylight;
                break;
            case 'sunset':
                targetColor = this.colorTemperatures.sunset;
                break;
            case 'night':
                targetColor = this.colorTemperatures.warmWhite;
                break;
            default:
                targetColor = this.colorTemperatures.coolWhite;
        }
        
        // Apply color temperature to building material
        if (aiData.building.material) {
            const currentColor = aiData.building.material.color;
            currentColor.r = THREE.MathUtils.lerp(currentColor.r, targetColor.r, 0.005);
            currentColor.g = THREE.MathUtils.lerp(currentColor.g, targetColor.g, 0.005);
            currentColor.b = THREE.MathUtils.lerp(currentColor.b, targetColor.b, 0.005);
        }
        
        // Apply to LED strips
        aiData.ledStrips.forEach(strip => {
            const stripColor = strip.material.emissive;
            stripColor.r = THREE.MathUtils.lerp(stripColor.r, targetColor.r * 0.8, 0.01);
            stripColor.g = THREE.MathUtils.lerp(stripColor.g, targetColor.g * 0.8, 0.01);
            stripColor.b = THREE.MathUtils.lerp(stripColor.b, targetColor.b * 0.8, 0.01);
        });
    }
    
    /**
     * Update synchronization effects
     */
    updateSynchronization(aiData, time) {
        if (aiData.syncNeighbors.length === 0) return;
        
        // Calculate average activity of neighbors
        let avgNeighborActivity = 0;
        aiData.syncNeighbors.forEach(neighbor => {
            avgNeighborActivity += neighbor.currentActivity;
        });
        avgNeighborActivity /= aiData.syncNeighbors.length;
        
        // Influence current building's activity
        const syncInfluence = 0.1; // 10% influence from neighbors
        aiData.currentActivity = THREE.MathUtils.lerp(
            aiData.currentActivity,
            avgNeighborActivity,
            syncInfluence
        );
        
        // Synchronized LED pulsing
        const syncPulse = Math.sin(time * 2) * 0.2;
        aiData.ledStrips.forEach(strip => {
            strip.material.emissiveIntensity += syncPulse;
        });
    }
    
    /**
     * Remove all AI intelligence effects
     */
    removeAllAIIntelligence() {
        this.activeIntelligence.forEach(aiData => {
            this.scene.remove(aiData.group);
            
            // Dispose geometries and materials
            aiData.group.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material && child.material.dispose) child.material.dispose();
            });
            
            // Reset building material
            if (aiData.building.material) {
                aiData.building.material.emissiveIntensity = 0.2;
            }
        });
        
        this.activeIntelligence = [];
        this.intelligentBuildings.clear();
        
        console.log('🧹 Đã xóa tất cả AI intelligence effects');
    }
    
    /**
     * Get AI intelligence statistics
     */
    getStats() {
        const activityStats = {};
        let totalWindows = 0;
        let totalLEDs = 0;
        let totalRooftopElements = 0;
        let totalAdaptiveElements = 0;
        
        this.activeIntelligence.forEach(aiData => {
            const type = aiData.activityType;
            activityStats[type] = (activityStats[type] || 0) + 1;
            
            totalWindows += aiData.windows.length;
            totalLEDs += aiData.ledStrips.length;
            totalRooftopElements += aiData.rooftopElements.length;
            totalAdaptiveElements += aiData.adaptiveElements.length;
        });
        
        return {
            totalIntelligentBuildings: this.activeIntelligence.length,
            totalSmartWindows: totalWindows,
            totalLEDStrips: totalLEDs,
            totalRooftopElements: totalRooftopElements,
            totalAdaptiveElements: totalAdaptiveElements,
            activityTypeBreakdown: activityStats,
            currentPhase: this.dayNightCycle.currentPhase,
            averageFPS: this.performanceMonitor.getAverageFPS(),
            maxIntelligentBuildings: this.maxIntelligentBuildings
        };
    }
}

/**
 * Performance monitoring class
 */
class PerformanceMonitor {
    constructor() {
        this.frameTimes = [];
        this.maxFrames = 60;
        this.lastFrameTime = performance.now();
        this.targetFPS = 30;
        this.canUpdateBuildings = true;
    }
    
    update(deltaTime) {
        const currentTime = performance.now();
        const frameTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > this.maxFrames) {
            this.frameTimes.shift();
        }
        
        // Calculate average FPS
        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        const currentFPS = 1000 / avgFrameTime;
        
        // Adjust update frequency based on performance
        this.canUpdateBuildings = currentFPS >= this.targetFPS;
    }
    
    canUpdate() {
        return this.canUpdateBuildings;
    }
    
    getAverageFPS() {
        if (this.frameTimes.length === 0) return 60;
        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        return Math.round(1000 / avgFrameTime);
    }
}

// Global functions for easy integration
window.initAIIntelligence = function() {
    console.log('🤖 Khởi tạo AI Intelligence Simulation System...');
    
    if (!window.scene || !window.camera) {
        console.error('❌ Không tìm thấy THREE.js scene hoặc camera!');
        return null;
    }
    
    // Create AI intelligence system
    window.aiIntelligenceSystem = new AIIntelligenceSimulationSystem(window.scene, window.camera);
    
    // Initialize AI intelligence
    window.aiIntelligenceSystem.initializeAIIntelligence();
    
    // Show stats
    const stats = window.aiIntelligenceSystem.getStats();
    console.log('📊 AI Intelligence Stats:', stats);
    
    // Show success notification
    const feedback = document.createElement('div');
    feedback.innerHTML = `
        <div>🤖 AI INTELLIGENCE ĐÃ KÍCH HOẠT!</div>
        <div style="font-size: 14px; margin-top: 8px;">
            🏢 Smart Buildings: ${stats.totalIntelligentBuildings}<br>
            🪟 Smart Windows: ${stats.totalSmartWindows}<br>
            💡 LED Strips: ${stats.totalLEDStrips}<br>
            📡 Rooftop Elements: ${stats.totalRooftopElements}<br>
            🔧 Adaptive Elements: ${stats.totalAdaptiveElements}<br>
            🌅 Phase: ${stats.currentPhase}<br>
            📊 FPS: ${stats.averageFPS}
        </div>
    `;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(34, 197, 94, 0.95);
        color: white;
        padding: 25px 45px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        animation: fadeInOut 4s ease;
        text-align: center;
        border: 2px solid #22c55e;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 4000);
    
    return window.aiIntelligenceSystem;
};

window.removeAIIntelligence = function() {
    if (window.aiIntelligenceSystem) {
        window.aiIntelligenceSystem.removeAllAIIntelligence();
        window.aiIntelligenceSystem = null;
        console.log('🧹 AI intelligence effects removed');
    }
};

window.getAIIntelligenceStats = function() {
    if (window.aiIntelligenceSystem) {
        const stats = window.aiIntelligenceSystem.getStats();
        console.log('📊 AI Intelligence Statistics:', stats);
        return stats;
    }
    return null;
};

console.log('✅ AI Intelligence Simulation System loaded! Sử dụng initAIIntelligence() để kích hoạt.');