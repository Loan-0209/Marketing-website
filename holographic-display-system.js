/**
 * Holographic Display System for 3D Smart City
 * Creates floating transparent screens, 3D text, and AR interface elements
 * Simulates futuristic holographic displays around buildings
 */

class HolographicDisplaySystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.hologramGroups = new Map(); // Store hologram groups per building
        this.activeHolograms = [];
        this.textGeometries = new Map(); // Cache for text geometries
        
        // Performance settings
        this.maxHologramsPerBuilding = 3;
        this.interactionDistance = 150; // Distance for glow effects
        this.animationDistance = 200; // Distance for animations
        
        // Hologram size configurations
        this.sizes = {
            small: {
                width: 8,
                height: 6,
                textScale: 0.8,
                offsetRange: [15, 25],
                priority: 'info'
            },
            medium: {
                width: 12,
                height: 9,
                textScale: 1.2,
                offsetRange: [20, 35],
                priority: 'ads'
            },
            large: {
                width: 18,
                height: 14,
                textScale: 1.8,
                offsetRange: [30, 50],
                priority: 'central'
            }
        };
        
        // Display type configurations
        this.displayTypes = {
            dataChart: {
                color: 0x00FFFF,
                emissive: 0x004488,
                symbols: ['📊', '📈', '📉', '🔢'],
                texts: ['CPU: 78%', 'RAM: 65%', 'NET: 1.2GB/s', 'AI LOAD: 92%']
            },
            aiStatus: {
                color: 0x00FF88,
                emissive: 0x004422,
                symbols: ['🧠', '⚡', '🔮', '🎯'],
                texts: ['AI ONLINE', 'LEARNING', 'PROCESSING', 'OPTIMIZING']
            },
            cityMetrics: {
                color: 0xFF6600,
                emissive: 0x662200,
                symbols: ['🏙️', '🚦', '⚡', '🌡️'],
                texts: ['TRAFFIC: 67%', 'ENERGY: 834MW', 'TEMP: 24°C', 'AIR: GOOD']
            },
            security: {
                color: 0xFF0044,
                emissive: 0x440011,
                symbols: ['🛡️', '👁️', '🔒', '⚠️'],
                texts: ['SECURE', 'MONITORING', 'ACCESS OK', 'ALERT: NONE']
            },
            network: {
                color: 0x8844FF,
                emissive: 0x221144,
                symbols: ['🌐', '📡', '🔗', '📶'],
                texts: ['5G ACTIVE', 'SIGNAL: 98%', 'PING: 1ms', 'NODES: 847']
            }
        };
        
        // Materials cache
        this.materials = this.createHologramMaterials();
        
        // Geometries cache
        this.geometries = this.createHologramGeometries();
        
        console.log('🎭 Holographic Display System initialized');
    }
    
    /**
     * Create materials for holographic displays
     */
    createHologramMaterials() {
        const materials = {};
        
        // Create materials for each display type
        Object.keys(this.displayTypes).forEach(type => {
            const config = this.displayTypes[type];
            
            // Base hologram material
            materials[`screen_${type}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.6,
                metalness: 0.1,
                roughness: 0.4,
                side: THREE.DoubleSide
            });
            
            // Active/glow material
            materials[`screen_glow_${type}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 1.8,
                transparent: true,
                opacity: 0.9,
                metalness: 0.2,
                roughness: 0.2,
                side: THREE.DoubleSide
            });
            
            // Text material
            materials[`text_${type}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.color,
                emissiveIntensity: 2.0,
                transparent: true,
                opacity: 0.95
            });
            
            // Frame material
            materials[`frame_${type}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 1.2,
                transparent: true,
                opacity: 0.8,
                metalness: 0.8,
                roughness: 0.2
            });
        });
        
        return materials;
    }
    
    /**
     * Create geometries for holographic displays
     */
    createHologramGeometries() {
        const geometries = {};
        
        // Screen geometries for each size
        Object.keys(this.sizes).forEach(size => {
            const config = this.sizes[size];
            geometries[`screen_${size}`] = new THREE.PlaneGeometry(config.width, config.height);
        });
        
        // Frame geometries
        geometries.frame = new THREE.BoxGeometry(0.2, 1, 0.2);
        
        // Symbol geometries
        geometries.symbol = new THREE.PlaneGeometry(2, 2);
        
        return geometries;
    }
    
    /**
     * Initialize holograms for all buildings
     */
    initializeHolograms() {
        console.log('🎭 Đang khởi tạo holographic displays cho tất cả tòa nhà...');
        
        const buildings = this.findAllBuildings();
        console.log(`🏗️ Tìm thấy ${buildings.length} tòa nhà`);
        
        if (buildings.length === 0) {
            console.warn('⚠️ Không tìm thấy tòa nhà nào');
            return;
        }
        
        let totalHolograms = 0;
        const displayTypeKeys = Object.keys(this.displayTypes);
        const sizeKeys = Object.keys(this.sizes);
        
        buildings.forEach((building, index) => {
            const hologramCount = Math.floor(Math.random() * this.maxHologramsPerBuilding) + 1; // 1-3 holograms per building
            
            for (let i = 0; i < hologramCount; i++) {
                const displayType = displayTypeKeys[Math.floor(Math.random() * displayTypeKeys.length)];
                const size = sizeKeys[Math.floor(Math.random() * sizeKeys.length)];
                
                this.createHologram(building, displayType, size, `${index}_${i}`);
                totalHolograms++;
            }
        });
        
        console.log(`✅ Đã tạo ${totalHolograms} holographic displays`);
        this.startAnimationSystem();
    }
    
    /**
     * Find all buildings in the scene
     */
    findAllBuildings() {
        const buildings = [];
        
        this.scene.traverse((child) => {
            if (child.isMesh && child.geometry && child.geometry.type === 'BoxGeometry') {
                // Skip neural network and data flow elements
                if (!child.userData.type || child.userData.type === 'building') {
                    buildings.push(child);
                }
            }
        });
        
        return buildings;
    }
    
    /**
     * Create a hologram near a building
     */
    createHologram(building, displayType, size, hologramId) {
        const sizeConfig = this.sizes[size];
        const displayConfig = this.displayTypes[displayType];
        
        // Get building position and size
        const buildingBox = new THREE.Box3().setFromObject(building);
        const buildingCenter = buildingBox.getCenter(new THREE.Vector3());
        const buildingSize = buildingBox.getSize(new THREE.Vector3());
        
        // Create hologram group
        const hologramGroup = new THREE.Group();
        hologramGroup.name = `hologram_${hologramId}`;
        
        // Calculate hologram position
        const angle = Math.random() * Math.PI * 2;
        const distance = sizeConfig.offsetRange[0] + Math.random() * (sizeConfig.offsetRange[1] - sizeConfig.offsetRange[0]);
        const height = buildingCenter.y + buildingSize.y * 0.3 + Math.random() * buildingSize.y * 0.4;
        
        const hologramPos = new THREE.Vector3(
            buildingCenter.x + Math.cos(angle) * distance,
            height,
            buildingCenter.z + Math.sin(angle) * distance
        );
        
        // Create main screen
        const screen = this.createScreen(displayType, size);
        screen.position.set(0, 0, 0);
        screen.lookAt(buildingCenter); // Face the building
        hologramGroup.add(screen);
        
        // Create frame
        const frame = this.createFrame(displayType, sizeConfig);
        hologramGroup.add(frame);
        
        // Create floating text
        const text = this.createHolographicText(displayType, displayConfig, sizeConfig);
        text.position.y = sizeConfig.height * 0.6;
        hologramGroup.add(text);
        
        // Create floating symbols
        const symbols = this.createHolographicSymbols(displayType, displayConfig, sizeConfig);
        symbols.forEach((symbol, i) => {
            symbol.position.set(
                (i - 1) * 3,
                -sizeConfig.height * 0.6,
                0.5
            );
            hologramGroup.add(symbol);
        });
        
        // Position hologram group
        hologramGroup.position.copy(hologramPos);
        
        // Add to scene
        this.scene.add(hologramGroup);
        
        // Store hologram data
        const hologramData = {
            id: hologramId,
            building: building,
            group: hologramGroup,
            screen: screen,
            frame: frame,
            text: text,
            symbols: symbols,
            displayType: displayType,
            size: size,
            basePosition: hologramPos.clone(),
            floatPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.2 + Math.random() * 0.3,
            isGlowing: false,
            lastUpdate: 0
        };
        
        this.activeHolograms.push(hologramData);
        
        // Track per building
        if (!this.hologramGroups.has(building.uuid)) {
            this.hologramGroups.set(building.uuid, []);
        }
        this.hologramGroups.get(building.uuid).push(hologramData);
        
        return hologramGroup;
    }
    
    /**
     * Create main holographic screen
     */
    createScreen(displayType, size) {
        const geometry = this.geometries[`screen_${size}`];
        const material = this.materials[`screen_${displayType}`].clone();
        
        const screen = new THREE.Mesh(geometry, material);
        screen.userData = {
            type: 'hologram_screen',
            displayType: displayType,
            size: size
        };
        
        return screen;
    }
    
    /**
     * Create hologram frame
     */
    createFrame(displayType, sizeConfig) {
        const frameGroup = new THREE.Group();
        const frameMaterial = this.materials[`frame_${displayType}`].clone();
        
        // Create frame bars
        const positions = [
            [-sizeConfig.width/2, 0, 0], [sizeConfig.width/2, 0, 0], // Left, Right
            [0, -sizeConfig.height/2, 0], [0, sizeConfig.height/2, 0] // Bottom, Top
        ];
        
        positions.forEach((pos, i) => {
            const bar = new THREE.Mesh(this.geometries.frame, frameMaterial);
            bar.position.set(pos[0], pos[1], pos[2]);
            if (i < 2) bar.rotation.z = Math.PI / 2; // Rotate vertical bars
            frameGroup.add(bar);
        });
        
        return frameGroup;
    }
    
    /**
     * Create holographic text
     */
    createHolographicText(displayType, displayConfig, sizeConfig) {
        const textGroup = new THREE.Group();
        const textMaterial = this.materials[`text_${displayType}`].clone();
        
        // Select random text from display config
        const textContent = displayConfig.texts[Math.floor(Math.random() * displayConfig.texts.length)];
        
        // Create text geometry (simplified - in real implementation would use TextGeometry)
        const textPlane = new THREE.PlaneGeometry(sizeConfig.width * 0.8, 1);
        const textMesh = new THREE.Mesh(textPlane, textMaterial);
        
        // Add text metadata
        textMesh.userData = {
            type: 'hologram_text',
            content: textContent,
            displayType: displayType
        };
        
        textGroup.add(textMesh);
        return textGroup;
    }
    
    /**
     * Create holographic symbols
     */
    createHolographicSymbols(displayType, displayConfig, sizeConfig) {
        const symbols = [];
        const symbolMaterial = this.materials[`text_${displayType}`].clone();
        
        // Create 2-3 symbols
        const symbolCount = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < symbolCount; i++) {
            const symbol = displayConfig.symbols[i % displayConfig.symbols.length];
            
            const symbolMesh = new THREE.Mesh(this.geometries.symbol, symbolMaterial);
            symbolMesh.userData = {
                type: 'hologram_symbol',
                symbol: symbol,
                displayType: displayType,
                rotationSpeed: 0.5 + Math.random() * 1.0
            };
            
            symbols.push(symbolMesh);
        }
        
        return symbols;
    }
    
    /**
     * Start animation system for all holograms
     */
    startAnimationSystem() {
        console.log('🎬 Khởi động hệ thống animation holographic displays...');
        
        const animate = () => {
            const time = performance.now() * 0.001;
            const cameraPos = this.camera.position;
            
            this.activeHolograms.forEach(hologramData => {
                const distance = cameraPos.distanceTo(hologramData.group.position);
                
                // Only animate holograms within distance
                if (distance < this.animationDistance) {
                    this.animateHologram(hologramData, time, distance);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate a single hologram
     */
    animateHologram(hologramData, time, cameraDistance) {
        const { group, screen, frame, text, symbols, basePosition, floatPhase, rotationSpeed } = hologramData;
        
        // Floating animation (up/down movement)
        const floatOffset = Math.sin(time * 0.8 + floatPhase) * 2; // ±2 units
        group.position.y = basePosition.y + floatOffset;
        
        // Gentle rotation
        group.rotation.y += rotationSpeed * 0.01;
        
        // Screen pulsing
        const screenPulse = 0.6 + Math.sin(time * 1.5) * 0.3; // 0.3 to 0.9
        screen.material.opacity = screenPulse;
        
        // Text pulsing (different phase)
        const textPulse = 0.8 + Math.sin(time * 2 + Math.PI) * 0.4; // 0.4 to 1.2
        text.children.forEach(textMesh => {
            textMesh.material.emissiveIntensity = textPulse * 2;
        });
        
        // Symbol rotation
        symbols.forEach(symbol => {
            symbol.rotation.z += symbol.userData.rotationSpeed * 0.01;
        });
        
        // Interactive glow based on camera distance
        this.updateInteractiveGlow(hologramData, cameraDistance);
        
        // Random data updates
        if (Math.random() < 0.002) { // 0.2% chance per frame
            this.updateHologramData(hologramData);
        }
    }
    
    /**
     * Update interactive glow based on camera distance
     */
    updateInteractiveGlow(hologramData, distance) {
        const { screen, frame, displayType } = hologramData;
        const glowThreshold = this.interactionDistance;
        
        if (distance < glowThreshold && !hologramData.isGlowing) {
            // Start glowing
            screen.material = this.materials[`screen_glow_${displayType}`];
            frame.children.forEach(bar => {
                bar.material.emissiveIntensity = 2.0;
            });
            hologramData.isGlowing = true;
            
        } else if (distance >= glowThreshold && hologramData.isGlowing) {
            // Stop glowing
            screen.material = this.materials[`screen_${displayType}`];
            frame.children.forEach(bar => {
                bar.material.emissiveIntensity = 1.2;
            });
            hologramData.isGlowing = false;
        }
        
        // Smooth glow intensity based on distance
        if (hologramData.isGlowing) {
            const glowIntensity = Math.max(0.5, 1.0 - (distance / glowThreshold));
            screen.material.emissiveIntensity = 1.8 * glowIntensity;
        }
    }
    
    /**
     * Update hologram data content
     */
    updateHologramData(hologramData) {
        const { displayType, text } = hologramData;
        const displayConfig = this.displayTypes[displayType];
        
        // Update text content
        const newText = displayConfig.texts[Math.floor(Math.random() * displayConfig.texts.length)];
        text.children.forEach(textMesh => {
            textMesh.userData.content = newText;
            // In real implementation, would update text geometry
        });
        
        // Brief flash effect
        text.children.forEach(textMesh => {
            textMesh.material.emissiveIntensity = 4.0;
            setTimeout(() => {
                textMesh.material.emissiveIntensity = 2.0;
            }, 200);
        });
    }
    
    /**
     * Remove all holograms
     */
    removeAllHolograms() {
        this.activeHolograms.forEach(hologramData => {
            this.scene.remove(hologramData.group);
            
            // Dispose geometries and materials
            hologramData.group.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material && child.material.dispose) child.material.dispose();
            });
        });
        
        this.activeHolograms = [];
        this.hologramGroups.clear();
        console.log('🧹 Đã xóa tất cả holographic displays');
    }
    
    /**
     * Get hologram statistics
     */
    getStats() {
        const typeStats = {};
        const sizeStats = {};
        
        this.activeHolograms.forEach(hologram => {
            const type = hologram.displayType;
            const size = hologram.size;
            
            typeStats[type] = (typeStats[type] || 0) + 1;
            sizeStats[size] = (sizeStats[size] || 0) + 1;
        });
        
        return {
            totalHolograms: this.activeHolograms.length,
            buildings: this.hologramGroups.size,
            avgHologramsPerBuilding: Math.round(this.activeHolograms.length / this.hologramGroups.size) || 0,
            typeBreakdown: typeStats,
            sizeBreakdown: sizeStats,
            maxHologramsPerBuilding: this.maxHologramsPerBuilding
        };
    }
    
    /**
     * Toggle hologram visibility
     */
    toggleVisibility(visible = null) {
        const isVisible = visible !== null ? visible : !this.activeHolograms[0]?.group.visible;
        
        this.activeHolograms.forEach(hologramData => {
            hologramData.group.visible = isVisible;
        });
        
        console.log(`👁️ Holograms ${isVisible ? 'shown' : 'hidden'}`);
    }
}

// Global functions for easy integration
window.initHolograms = function() {
    console.log('🎭 Khởi tạo Holographic Display System...');
    
    if (!window.scene || !window.camera) {
        console.error('❌ Không tìm thấy THREE.js scene hoặc camera!');
        return null;
    }
    
    // Create holographic system
    window.hologramSystem = new HolographicDisplaySystem(window.scene, window.camera);
    
    // Initialize holograms
    window.hologramSystem.initializeHolograms();
    
    // Show stats
    const stats = window.hologramSystem.getStats();
    console.log('📊 Hologram Stats:', stats);
    
    // Show success notification
    const feedback = document.createElement('div');
    feedback.innerHTML = `
        <div>🎭 HOLOGRAPHIC DISPLAYS ĐÃ KÍCH HOẠT!</div>
        <div style="font-size: 14px; margin-top: 8px;">
            🏗️ Buildings: ${stats.buildings}<br>
            📺 Holograms: ${stats.totalHolograms}<br>
            📊 Data Charts: ${stats.typeBreakdown.dataChart || 0}<br>
            🧠 AI Status: ${stats.typeBreakdown.aiStatus || 0}<br>
            🏙️ City Metrics: ${stats.typeBreakdown.cityMetrics || 0}<br>
            🛡️ Security: ${stats.typeBreakdown.security || 0}<br>
            🌐 Network: ${stats.typeBreakdown.network || 0}
        </div>
    `;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(138, 43, 226, 0.95);
        color: white;
        padding: 25px 45px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        animation: fadeInOut 4s ease;
        text-align: center;
        border: 2px solid #8a2be2;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 4000);
    
    return window.hologramSystem;
};

window.removeHolograms = function() {
    if (window.hologramSystem) {
        window.hologramSystem.removeAllHolograms();
        window.hologramSystem = null;
        console.log('🧹 Holographic displays removed');
    }
};

window.getHologramStats = function() {
    if (window.hologramSystem) {
        const stats = window.hologramSystem.getStats();
        console.log('📊 Hologram Statistics:', stats);
        return stats;
    }
    return null;
};

window.toggleHolograms = function() {
    if (window.hologramSystem) {
        window.hologramSystem.toggleVisibility();
    }
};

console.log('✅ Holographic Display System loaded! Sử dụng initHolograms() để kích hoạt.');