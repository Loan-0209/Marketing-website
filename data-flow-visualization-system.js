/**
 * Data Flow Visualization System for 3D Smart City
 * Creates curved light beams and moving particle streams between buildings
 * Simulates living AI data network with different data types and urgency levels
 */

class DataFlowVisualizationSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.dataStreams = new Map(); // Store active data streams
        this.particleSystems = [];
        this.beamGroups = new Map(); // Store beam geometries
        this.activeAnimations = [];
        
        // Performance settings
        this.maxStreams = 30;
        this.maxParticlesPerStream = 50;
        this.updateDistance = 300; // Only animate streams within camera distance
        
        // Data type configurations
        this.dataTypes = {
            processing: {
                color: 0x00FFFF,      // Cyan
                emissive: 0x0088AA,
                particleColor: 0x00CCFF,
                speed: 1.0,
                urgency: 'normal',
                tubeRadius: 0.8
            },
            completed: {
                color: 0x00FF88,      // Green
                emissive: 0x008844,
                particleColor: 0x44FF88,
                speed: 0.6,
                urgency: 'low',
                tubeRadius: 0.6
            },
            priority: {
                color: 0xFF6600,      // Orange
                emissive: 0xCC4400,
                particleColor: 0xFF8844,
                speed: 2.0,
                urgency: 'high',
                tubeRadius: 1.2
            },
            critical: {
                color: 0xFF0044,      // Red
                emissive: 0xAA0022,
                particleColor: 0xFF4466,
                speed: 3.0,
                urgency: 'critical',
                tubeRadius: 1.5
            }
        };
        
        // Speed multipliers based on urgency
        this.urgencyMultipliers = {
            low: 0.5,
            normal: 1.0,
            high: 1.8,
            critical: 2.5
        };
        
        // Materials cache for performance
        this.materials = this.createDataFlowMaterials();
        this.particleGeometry = new THREE.SphereGeometry(0.15, 6, 4);
        
        console.log('📊 Data Flow Visualization System initialized');
    }
    
    /**
     * Create optimized materials for data flow elements
     */
    createDataFlowMaterials() {
        const materials = {};
        
        // Create beam materials for each data type
        Object.keys(this.dataTypes).forEach(type => {
            const config = this.dataTypes[type];
            materials[`beam_${type}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 1.2,
                transparent: true,
                opacity: 0.8,
                metalness: 0.1,
                roughness: 0.4
            });
            
            materials[`particle_${type}`] = new THREE.MeshStandardMaterial({
                color: config.particleColor,
                emissive: config.particleColor,
                emissiveIntensity: 2.0,
                transparent: true,
                opacity: 0.9
            });
            
            materials[`beam_active_${type}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 2.5,
                transparent: true,
                opacity: 1.0,
                metalness: 0.2,
                roughness: 0.2
            });
        });
        
        return materials;
    }
    
    /**
     * Initialize data flows between all buildings
     */
    initializeDataFlows() {
        console.log('🌐 Initializing data flows between buildings...');
        
        // Find all buildings in the scene
        const buildings = this.findAllBuildings();
        console.log(`🏗️ Found ${buildings.length} buildings`);
        
        if (buildings.length < 2) {
            console.warn('⚠️ Need at least 2 buildings for data flows');
            return;
        }
        
        // Create data streams between random building pairs
        const streamCount = Math.min(this.maxStreams, buildings.length * 2);
        const dataTypeKeys = Object.keys(this.dataTypes);
        
        for (let i = 0; i < streamCount; i++) {
            const sourceBuilding = buildings[Math.floor(Math.random() * buildings.length)];
            let targetBuilding = buildings[Math.floor(Math.random() * buildings.length)];
            
            // Ensure different buildings
            while (targetBuilding === sourceBuilding && buildings.length > 1) {
                targetBuilding = buildings[Math.floor(Math.random() * buildings.length)];
            }
            
            // Random data type
            const dataType = dataTypeKeys[Math.floor(Math.random() * dataTypeKeys.length)];
            
            // Create data stream
            this.createDataStream(sourceBuilding, targetBuilding, dataType, i);
        }
        
        console.log(`✅ Created ${streamCount} data streams`);
        this.startAnimationSystem();
    }
    
    /**
     * Find all buildings in the scene
     */
    findAllBuildings() {
        const buildings = [];
        
        this.scene.traverse((child) => {
            if (child.isMesh && child.geometry && child.geometry.type === 'BoxGeometry') {
                // Skip if it's part of neural network or other systems
                if (!child.userData.type || child.userData.type === 'building') {
                    buildings.push(child);
                }
            }
        });
        
        return buildings;
    }
    
    /**
     * Create a single data stream between two buildings
     */
    createDataStream(sourceBuilding, targetBuilding, dataType, streamId) {
        const config = this.dataTypes[dataType];
        
        // Get building positions (top centers)
        const sourcePos = this.getBuildingTopCenter(sourceBuilding);
        const targetPos = this.getBuildingTopCenter(targetBuilding);
        
        // Create curved path between buildings
        const curvePath = this.createCurvedPath(sourcePos, targetPos);
        
        // Create tube geometry for the beam
        const tubeGeometry = new THREE.TubeGeometry(curvePath, 64, config.tubeRadius, 8, false);
        const beamMesh = new THREE.Mesh(tubeGeometry, this.materials[`beam_${dataType}`]);
        
        // Create particle system for this stream
        const particleSystem = this.createParticleSystem(curvePath, dataType, config);
        
        // Group beam and particles
        const streamGroup = new THREE.Group();
        streamGroup.name = `datastream_${streamId}`;
        streamGroup.add(beamMesh);
        streamGroup.add(particleSystem.group);
        
        this.scene.add(streamGroup);
        
        // Store stream data
        this.dataStreams.set(streamId, {
            id: streamId,
            sourceBuilding: sourceBuilding,
            targetBuilding: targetBuilding,
            dataType: dataType,
            config: config,
            curvePath: curvePath,
            beamMesh: beamMesh,
            particleSystem: particleSystem,
            group: streamGroup,
            isActive: true,
            lastUpdate: 0,
            flowDirection: 1 // 1 = source to target, -1 = target to source
        });
        
        return streamGroup;
    }
    
    /**
     * Get the top center position of a building
     */
    getBuildingTopCenter(building) {
        const box = new THREE.Box3().setFromObject(building);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        return new THREE.Vector3(
            center.x,
            center.y + size.y * 0.5 + 2, // Slightly above building top
            center.z
        );
    }
    
    /**
     * Create curved path between two points
     */
    createCurvedPath(startPos, endPos) {
        const distance = startPos.distanceTo(endPos);
        const midPoint = new THREE.Vector3().lerpVectors(startPos, endPos, 0.5);
        
        // Add curved height based on distance
        const curveHeight = Math.min(distance * 0.3, 50);
        midPoint.y += curveHeight;
        
        // Add some random curve variation
        const randomOffset = (Math.random() - 0.5) * distance * 0.2;
        midPoint.x += randomOffset;
        midPoint.z += randomOffset;
        
        // Create quadratic bezier curve
        const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
        
        return curve;
    }
    
    /**
     * Create particle system for a data stream
     */
    createParticleSystem(curvePath, dataType, config) {
        const particleGroup = new THREE.Group();
        const particles = [];
        const particleCount = Math.floor(Math.random() * 20) + 10; // 10-30 particles
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                this.particleGeometry,
                this.materials[`particle_${dataType}`].clone()
            );
            
            // Random starting position along curve
            const t = Math.random();
            const position = curvePath.getPoint(t);
            particle.position.copy(position);
            
            // Particle metadata
            particle.userData = {
                type: 'data_particle',
                dataType: dataType,
                curvePosition: t,
                baseSpeed: config.speed * this.urgencyMultipliers[config.urgency],
                speed: config.speed * this.urgencyMultipliers[config.urgency] * (0.8 + Math.random() * 0.4),
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 2 + Math.random() * 3
            };
            
            particles.push(particle);
            particleGroup.add(particle);
        }
        
        return {
            group: particleGroup,
            particles: particles,
            curvePath: curvePath
        };
    }
    
    /**
     * Start the animation system for all data flows
     */
    startAnimationSystem() {
        console.log('🎬 Starting data flow animation system...');
        
        const animate = () => {
            const time = performance.now() * 0.001;
            const cameraPos = this.camera.position;
            
            this.dataStreams.forEach((streamData, streamId) => {
                // Distance-based optimization
                const streamCenter = new THREE.Vector3().lerpVectors(
                    streamData.sourceBuilding.position,
                    streamData.targetBuilding.position,
                    0.5
                );
                
                const distance = cameraPos.distanceTo(streamCenter);
                
                if (distance < this.updateDistance) {
                    this.animateDataStream(streamData, time);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate a single data stream
     */
    animateDataStream(streamData, time) {
        const { particleSystem, beamMesh, config, dataType } = streamData;
        
        // Animate beam pulsing
        const beamPulse = 0.8 + Math.sin(time * 2) * 0.4; // 0.4 to 1.2
        beamMesh.material.emissiveIntensity = 1.2 + beamPulse * 0.8;
        
        // Animate particles moving along curve
        particleSystem.particles.forEach(particle => {
            const userData = particle.userData;
            
            // Update position along curve
            userData.curvePosition += userData.speed * 0.01; // Adjust speed scaling
            
            // Loop particles
            if (userData.curvePosition >= 1.0) {
                userData.curvePosition = 0.0;
                
                // Occasional direction change for variety
                if (Math.random() < 0.1) {
                    streamData.flowDirection *= -1;
                }
            }
            
            // Handle reverse flow
            let actualPosition = userData.curvePosition;
            if (streamData.flowDirection === -1) {
                actualPosition = 1.0 - userData.curvePosition;
            }
            
            // Get position on curve
            const newPosition = particleSystem.curvePath.getPoint(actualPosition);
            particle.position.copy(newPosition);
            
            // Particle pulsing effect
            const pulsePhase = userData.pulsePhase + time * userData.pulseSpeed;
            const pulseIntensity = 1.5 + Math.sin(pulsePhase) * 0.8; // 0.7 to 2.3
            particle.material.emissiveIntensity = pulseIntensity;
            
            // Scale particles based on speed (faster = larger)
            const speedScale = 0.8 + (userData.speed / 3.0) * 0.4; // 0.8 to 1.2
            particle.scale.setScalar(speedScale);
        });
        
        // Occasional data burst effects
        if (Math.random() < 0.005) { // 0.5% chance per frame
            this.triggerDataBurst(streamData);
        }
        
        // Random stream direction changes
        if (Math.random() < 0.002) { // 0.2% chance per frame
            streamData.flowDirection *= -1;
        }
    }
    
    /**
     * Trigger a data burst effect on a stream
     */
    triggerDataBurst(streamData) {
        const { beamMesh, particleSystem, dataType } = streamData;
        
        // Temporarily boost beam intensity
        beamMesh.material = this.materials[`beam_active_${dataType}`];
        
        // Boost particle speeds temporarily
        particleSystem.particles.forEach(particle => {
            particle.userData.speed *= 2.0;
            particle.material.emissiveIntensity = 3.0;
        });
        
        // Reset after burst duration
        setTimeout(() => {
            beamMesh.material = this.materials[`beam_${dataType}`];
            
            particleSystem.particles.forEach(particle => {
                particle.userData.speed = particle.userData.baseSpeed;
            });
        }, 500 + Math.random() * 1000);
    }
    
    /**
     * Add a new data stream between random buildings
     */
    addRandomDataStream() {
        const buildings = this.findAllBuildings();
        if (buildings.length < 2) return;
        
        const sourceBuilding = buildings[Math.floor(Math.random() * buildings.length)];
        let targetBuilding = buildings[Math.floor(Math.random() * buildings.length)];
        
        while (targetBuilding === sourceBuilding && buildings.length > 1) {
            targetBuilding = buildings[Math.floor(Math.random() * buildings.length)];
        }
        
        const dataTypes = Object.keys(this.dataTypes);
        const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
        
        const newId = Date.now(); // Simple unique ID
        this.createDataStream(sourceBuilding, targetBuilding, dataType, newId);
        
        console.log(`➕ Added new ${dataType} data stream: #${newId}`);
    }
    
    /**
     * Remove a random data stream
     */
    removeRandomDataStream() {
        const streamIds = Array.from(this.dataStreams.keys());
        if (streamIds.length === 0) return;
        
        const randomId = streamIds[Math.floor(Math.random() * streamIds.length)];
        this.removeDataStream(randomId);
    }
    
    /**
     * Remove a specific data stream
     */
    removeDataStream(streamId) {
        const streamData = this.dataStreams.get(streamId);
        if (!streamData) return;
        
        // Remove from scene
        this.scene.remove(streamData.group);
        
        // Dispose of geometries and materials
        streamData.group.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material && child.material.dispose) child.material.dispose();
        });
        
        // Remove from tracking
        this.dataStreams.delete(streamId);
        
        console.log(`🗑️ Removed data stream: #${streamId}`);
    }
    
    /**
     * Remove all data streams
     */
    removeAllDataStreams() {
        this.dataStreams.forEach((streamData, streamId) => {
            this.scene.remove(streamData.group);
            
            streamData.group.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material && child.material.dispose) child.material.dispose();
            });
        });
        
        this.dataStreams.clear();
        console.log('🧹 All data streams removed');
    }
    
    /**
     * Get performance and usage statistics
     */
    getStats() {
        let totalParticles = 0;
        let totalBeams = 0;
        const typeStats = {};
        
        this.dataStreams.forEach(streamData => {
            totalBeams++;
            totalParticles += streamData.particleSystem.particles.length;
            
            const type = streamData.dataType;
            typeStats[type] = (typeStats[type] || 0) + 1;
        });
        
        return {
            totalStreams: this.dataStreams.size,
            totalBeams: totalBeams,
            totalParticles: totalParticles,
            avgParticlesPerStream: Math.round(totalParticles / totalBeams) || 0,
            typeBreakdown: typeStats,
            maxStreams: this.maxStreams
        };
    }
    
    /**
     * Toggle data stream visibility
     */
    toggleVisibility(visible = null) {
        const isVisible = visible !== null ? visible : !this.dataStreams.values().next().value?.group.visible;
        
        this.dataStreams.forEach(streamData => {
            streamData.group.visible = isVisible;
        });
        
        console.log(`👁️ Data streams ${isVisible ? 'shown' : 'hidden'}`);
    }
}

// Global functions for easy integration
window.initDataFlow = function() {
    console.log('📊 Initializing Data Flow Visualization System...');
    
    if (!window.scene || !window.camera) {
        console.error('❌ THREE.js scene or camera not found! Make sure 3D campus is loaded.');
        return null;
    }
    
    // Create data flow system
    window.dataFlowSystem = new DataFlowVisualizationSystem(window.scene, window.camera);
    
    // Initialize data flows
    window.dataFlowSystem.initializeDataFlows();
    
    // Show stats
    const stats = window.dataFlowSystem.getStats();
    console.log('📊 Data Flow Stats:', stats);
    
    // Show success notification
    const feedback = document.createElement('div');
    feedback.innerHTML = `
        <div>📊 DATA FLOWS ACTIVATED!</div>
        <div style="font-size: 14px; margin-top: 8px;">
            🌐 Streams: ${stats.totalStreams}<br>
            ⚡ Particles: ${stats.totalParticles}<br>
            🔵 Processing: ${stats.typeBreakdown.processing || 0}<br>
            🟢 Completed: ${stats.typeBreakdown.completed || 0}<br>
            🟠 Priority: ${stats.typeBreakdown.priority || 0}<br>
            🔴 Critical: ${stats.typeBreakdown.critical || 0}
        </div>
    `;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(59, 130, 246, 0.95);
        color: white;
        padding: 25px 45px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        animation: fadeInOut 4s ease;
        text-align: center;
        border: 2px solid #3b82f6;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 4000);
    
    return window.dataFlowSystem;
};

window.removeDataFlow = function() {
    if (window.dataFlowSystem) {
        window.dataFlowSystem.removeAllDataStreams();
        window.dataFlowSystem = null;
        console.log('🧹 Data flows removed');
    }
};

window.getDataFlowStats = function() {
    if (window.dataFlowSystem) {
        const stats = window.dataFlowSystem.getStats();
        console.log('📊 Data Flow Statistics:', stats);
        return stats;
    }
    return null;
};

window.addDataStream = function() {
    if (window.dataFlowSystem) {
        window.dataFlowSystem.addRandomDataStream();
    }
};

window.removeDataStream = function() {
    if (window.dataFlowSystem) {
        window.dataFlowSystem.removeRandomDataStream();
    }
};

window.toggleDataFlow = function() {
    if (window.dataFlowSystem) {
        window.dataFlowSystem.toggleVisibility();
    }
};

console.log('✅ Data Flow Visualization System loaded! Use initDataFlow() to activate.');