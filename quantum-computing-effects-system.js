/**
 * Quantum Computing Visual Effects System for AI Smart City
 * Creates quantum-themed effects around buildings including energy rings,
 * orbital particles, field distortions, and quantum state visualizations
 */

class QuantumComputingEffectsSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.quantumBuildings = new Map(); // Store quantum effects per building
        this.activeEffects = [];
        this.quantumParticles = [];
        this.energyBeams = [];
        this.quantumCores = [];
        
        // Performance settings
        this.maxQuantumBuildings = 30;
        this.maxParticlesPerBuilding = 50;
        this.animationDistance = 250; // Distance for effect animations
        
        // Quantum state colors (cycling through quantum energy levels)
        this.quantumStates = {
            ground: { color: 0x0033FF, emissive: 0x001188, name: 'Ground State' },
            excited1: { color: 0x00AAFF, emissive: 0x004488, name: 'Excited Level 1' },
            excited2: { color: 0x00FFAA, emissive: 0x008844, name: 'Excited Level 2' },
            excited3: { color: 0xAAFF00, emissive: 0x448800, name: 'Excited Level 3' },
            superposition: { color: 0xFF00AA, emissive: 0x880044, name: 'Superposition' },
            entangled: { color: 0xAA00FF, emissive: 0x440088, name: 'Entangled State' }
        };
        
        // Quantum effect configurations
        this.effectTypes = {
            basic: {
                ringCount: 3,
                particleCount: 20,
                coreSize: 3,
                fieldIntensity: 0.8,
                priority: 'low'
            },
            advanced: {
                ringCount: 5,
                particleCount: 35,
                coreSize: 5,
                fieldIntensity: 1.2,
                priority: 'medium'
            },
            quantum: {
                ringCount: 7,
                particleCount: 50,
                coreSize: 8,
                fieldIntensity: 1.8,
                priority: 'high'
            }
        };
        
        // Materials cache
        this.materials = this.createQuantumMaterials();
        
        // Geometries cache
        this.geometries = this.createQuantumGeometries();
        
        console.log('⚛️ Quantum Computing Effects System initialized');
    }
    
    /**
     * Create materials for quantum effects
     */
    createQuantumMaterials() {
        const materials = {};
        
        // Create materials for each quantum state
        Object.keys(this.quantumStates).forEach(state => {
            const config = this.quantumStates[state];
            
            // Ring materials
            materials[`ring_${state}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 1.5,
                transparent: true,
                opacity: 0.7,
                metalness: 0.9,
                roughness: 0.1,
                side: THREE.DoubleSide
            });
            
            // Particle materials
            materials[`particle_${state}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.color,
                emissiveIntensity: 2.0,
                transparent: true,
                opacity: 0.9
            });
            
            // Core materials
            materials[`core_${state}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 2.5,
                transparent: true,
                opacity: 0.8,
                metalness: 0.8,
                roughness: 0.2
            });
            
            // Field distortion materials
            materials[`field_${state}`] = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.3,
                metalness: 0.1,
                roughness: 0.9,
                side: THREE.DoubleSide
            });
        });
        
        // Energy beam material
        materials.energyBeam = new THREE.LineBasicMaterial({
            color: 0x00FFFF,
            transparent: true,
            opacity: 0.8,
            linewidth: 3
        });
        
        return materials;
    }
    
    /**
     * Create geometries for quantum effects
     */
    createQuantumGeometries() {
        const geometries = {};
        
        // Ring geometries (different sizes)
        geometries.ring_small = new THREE.RingGeometry(8, 10, 32);
        geometries.ring_medium = new THREE.RingGeometry(15, 17, 32);
        geometries.ring_large = new THREE.RingGeometry(25, 27, 32);
        geometries.ring_xlarge = new THREE.RingGeometry(35, 37, 32);
        
        // Particle geometry
        geometries.particle = new THREE.SphereGeometry(0.3, 8, 6);
        
        // Core geometries
        geometries.core_small = new THREE.SphereGeometry(3, 16, 12);
        geometries.core_medium = new THREE.SphereGeometry(5, 20, 16);
        geometries.core_large = new THREE.SphereGeometry(8, 24, 20);
        
        // Field distortion geometries
        geometries.field_sphere = new THREE.SphereGeometry(50, 16, 12);
        geometries.field_torus = new THREE.TorusGeometry(30, 8, 8, 16);
        
        return geometries;
    }
    
    /**
     * Initialize quantum effects for selected buildings
     */
    initializeQuantumEffects() {
        console.log('⚛️ Đang khởi tạo quantum computing effects...');
        
        const buildings = this.findAllBuildings();
        console.log(`🏗️ Tìm thấy ${buildings.length} tòa nhà`);
        
        if (buildings.length === 0) {
            console.warn('⚠️ Không tìm thấy tòa nhà nào');
            return;
        }
        
        // Select 20-30 buildings randomly for quantum effects
        const selectedBuildings = this.selectQuantumBuildings(buildings, this.maxQuantumBuildings);
        console.log(`🎯 Đã chọn ${selectedBuildings.length} tòa nhà cho quantum effects`);
        
        let totalEffects = 0;
        const effectTypeKeys = Object.keys(this.effectTypes);
        const quantumStateKeys = Object.keys(this.quantumStates);
        
        selectedBuildings.forEach((building, index) => {
            const effectType = effectTypeKeys[Math.floor(Math.random() * effectTypeKeys.length)];
            const quantumState = quantumStateKeys[Math.floor(Math.random() * quantumStateKeys.length)];
            
            this.createQuantumEffect(building, effectType, quantumState, index);
            totalEffects++;
        });
        
        console.log(`✅ Đã tạo ${totalEffects} quantum effects`);
        this.startAnimationSystem();
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
     * Select buildings for quantum effects (prefer taller buildings)
     */
    selectQuantumBuildings(buildings, maxCount) {
        // Sort buildings by height (prefer taller ones for quantum effects)
        const sortedBuildings = buildings.sort((a, b) => {
            const aBox = new THREE.Box3().setFromObject(a);
            const bBox = new THREE.Box3().setFromObject(b);
            const aHeight = aBox.getSize(new THREE.Vector3()).y;
            const bHeight = bBox.getSize(new THREE.Vector3()).y;
            return bHeight - aHeight; // Descending order
        });
        
        // Select top buildings with some randomization
        const selectedCount = Math.min(maxCount, buildings.length);
        const selected = [];
        
        // Take top 70% of tall buildings
        const guaranteedCount = Math.floor(selectedCount * 0.7);
        for (let i = 0; i < guaranteedCount; i++) {
            selected.push(sortedBuildings[i]);
        }
        
        // Random selection for remaining 30%
        const remainingBuildings = sortedBuildings.slice(guaranteedCount);
        const remainingCount = selectedCount - guaranteedCount;
        
        for (let i = 0; i < remainingCount && remainingBuildings.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * remainingBuildings.length);
            selected.push(remainingBuildings.splice(randomIndex, 1)[0]);
        }
        
        return selected;
    }
    
    /**
     * Create quantum effect for a specific building
     */
    createQuantumEffect(building, effectType, quantumState, buildingIndex) {
        const config = this.effectTypes[effectType];
        
        // Get building properties
        const buildingBox = new THREE.Box3().setFromObject(building);
        const buildingCenter = buildingBox.getCenter(new THREE.Vector3());
        const buildingSize = buildingBox.getSize(new THREE.Vector3());
        
        // Create quantum effect group
        const quantumGroup = new THREE.Group();
        quantumGroup.name = `quantum_${buildingIndex}`;
        
        // Create concentric energy rings
        const rings = this.createEnergyRings(config, quantumState, buildingSize);
        rings.forEach(ring => quantumGroup.add(ring));
        
        // Create quantum core
        const core = this.createQuantumCore(config, quantumState, buildingCenter);
        quantumGroup.add(core);
        
        // Create orbital particles
        const particles = this.createOrbitalParticles(config, quantumState, buildingSize);
        particles.forEach(particle => quantumGroup.add(particle));
        
        // Create field distortion
        const fieldDistortion = this.createFieldDistortion(config, quantumState, buildingSize);
        quantumGroup.add(fieldDistortion);
        
        // Position quantum group at building center
        quantumGroup.position.copy(buildingCenter);
        
        // Add to scene
        this.scene.add(quantumGroup);
        
        // Store quantum effect data
        const quantumData = {
            id: buildingIndex,
            building: building,
            group: quantumGroup,
            effectType: effectType,
            quantumState: quantumState,
            config: config,
            rings: rings,
            core: core,
            particles: particles,
            fieldDistortion: fieldDistortion,
            buildingCenter: buildingCenter,
            buildingSize: buildingSize,
            stateChangeTimer: 0,
            uncertaintyPhase: Math.random() * Math.PI * 2,
            orbitalPhases: particles.map(() => Math.random() * Math.PI * 2)
        };
        
        this.quantumBuildings.set(building.uuid, quantumData);
        this.activeEffects.push(quantumData);
        
        return quantumGroup;
    }
    
    /**
     * Create concentric energy rings
     */
    createEnergyRings(config, quantumState, buildingSize) {
        const rings = [];
        const ringSizes = ['ring_small', 'ring_medium', 'ring_large', 'ring_xlarge'];
        
        for (let i = 0; i < config.ringCount; i++) {
            const sizeIndex = Math.min(i, ringSizes.length - 1);
            const geometry = this.geometries[ringSizes[sizeIndex]];
            const material = this.materials[`ring_${quantumState}`].clone();
            
            const ring = new THREE.Mesh(geometry, material);
            
            // Position rings at different heights
            ring.position.y = (i - config.ringCount / 2) * 8;
            
            // Rotate rings for variety
            ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
            ring.rotation.z = Math.random() * Math.PI * 2;
            
            // Ring metadata
            ring.userData = {
                type: 'quantum_ring',
                ringIndex: i,
                baseY: ring.position.y,
                rotationSpeed: 0.3 + Math.random() * 0.7,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            rings.push(ring);
        }
        
        return rings;
    }
    
    /**
     * Create pulsing quantum core
     */
    createQuantumCore(config, quantumState, buildingCenter) {
        const coreSize = config.coreSize > 6 ? 'core_large' : 
                        config.coreSize > 4 ? 'core_medium' : 'core_small';
        
        const geometry = this.geometries[coreSize];
        const material = this.materials[`core_${quantumState}`].clone();
        
        const core = new THREE.Mesh(geometry, material);
        core.position.set(0, 0, 0); // Center of building
        
        core.userData = {
            type: 'quantum_core',
            pulseSpeed: 2 + Math.random() * 2,
            pulsePhase: Math.random() * Math.PI * 2,
            baseScale: 1.0
        };
        
        return core;
    }
    
    /**
     * Create orbital particles
     */
    createOrbitalParticles(config, quantumState, buildingSize) {
        const particles = [];
        const particleGeometry = this.geometries.particle;
        const particleMaterial = this.materials[`particle_${quantumState}`].clone();
        
        for (let i = 0; i < config.particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            
            // Calculate orbital parameters
            const orbitRadius = 20 + Math.random() * 40;
            const orbitInclination = Math.random() * Math.PI;
            const orbitSpeed = 0.5 + Math.random() * 1.5;
            const initialPhase = (i / config.particleCount) * Math.PI * 2;
            
            particle.userData = {
                type: 'quantum_particle',
                orbitRadius: orbitRadius,
                orbitInclination: orbitInclination,
                orbitSpeed: orbitSpeed,
                orbitPhase: initialPhase,
                uncertaintyFactor: 0.2 + Math.random() * 0.3
            };
            
            particles.push(particle);
        }
        
        return particles;
    }
    
    /**
     * Create quantum field distortion
     */
    createFieldDistortion(config, quantumState, buildingSize) {
        const fieldType = Math.random() > 0.5 ? 'field_sphere' : 'field_torus';
        const geometry = this.geometries[fieldType];
        const material = this.materials[`field_${quantumState}`].clone();
        
        const field = new THREE.Mesh(geometry, material);
        field.scale.setScalar(config.fieldIntensity);
        
        field.userData = {
            type: 'quantum_field',
            fieldType: fieldType,
            distortionSpeed: 0.1 + Math.random() * 0.2,
            distortionPhase: Math.random() * Math.PI * 2
        };
        
        return field;
    }
    
    /**
     * Start animation system for quantum effects
     */
    startAnimationSystem() {
        console.log('🎬 Khởi động hệ thống animation quantum effects...');
        
        const animate = () => {
            const time = performance.now() * 0.001;
            const cameraPos = this.camera.position;
            
            this.activeEffects.forEach(quantumData => {
                const distance = cameraPos.distanceTo(quantumData.buildingCenter);
                
                // Only animate quantum effects within distance
                if (distance < this.animationDistance) {
                    this.animateQuantumEffect(quantumData, time);
                }
            });
            
            // Update energy beams between quantum buildings
            this.updateEnergyBeams(time);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate a single quantum effect
     */
    animateQuantumEffect(quantumData, time) {
        const { rings, core, particles, fieldDistortion, quantumState } = quantumData;
        
        // Animate energy rings
        rings.forEach(ring => {
            const userData = ring.userData;
            
            // Ring rotation
            ring.rotation.z += userData.rotationSpeed * 0.01;
            
            // Ring floating
            const floatOffset = Math.sin(time * 1.5 + userData.pulsePhase) * 3;
            ring.position.y = userData.baseY + floatOffset;
            
            // Ring pulsing
            const pulseIntensity = 0.8 + Math.sin(time * 2 + userData.pulsePhase) * 0.4;
            ring.material.emissiveIntensity = pulseIntensity * 1.5;
        });
        
        // Animate quantum core
        const coreUserData = core.userData;
        const corePulse = 0.8 + Math.sin(time * coreUserData.pulseSpeed + coreUserData.pulsePhase) * 0.4;
        core.scale.setScalar(coreUserData.baseScale * (0.9 + corePulse * 0.3));
        core.material.emissiveIntensity = 2.0 + corePulse * 1.0;
        
        // Animate orbital particles
        particles.forEach((particle, index) => {
            const userData = particle.userData;
            
            // Update orbital position with uncertainty principle
            userData.orbitPhase += userData.orbitSpeed * 0.01;
            
            // Add uncertainty/flickering
            const uncertainty = Math.sin(time * 5 + index) * userData.uncertaintyFactor;
            const actualRadius = userData.orbitRadius * (1 + uncertainty);
            
            // Calculate 3D orbital position
            const x = Math.cos(userData.orbitPhase) * actualRadius;
            const z = Math.sin(userData.orbitPhase) * actualRadius;
            const y = Math.sin(userData.orbitPhase + userData.orbitInclination) * 20;
            
            particle.position.set(x, y, z);
            
            // Uncertainty principle - flickering visibility
            const flickerChance = 0.05; // 5% chance per frame
            if (Math.random() < flickerChance) {
                particle.visible = !particle.visible;
                setTimeout(() => {
                    particle.visible = true;
                }, 50 + Math.random() * 200);
            }
            
            // Particle pulsing
            const particlePulse = 0.7 + Math.sin(time * 3 + index) * 0.3;
            particle.material.emissiveIntensity = particlePulse * 2.5;
        });
        
        // Animate field distortion
        const fieldUserData = fieldDistortion.userData;
        fieldDistortion.rotation.x += fieldUserData.distortionSpeed * 0.01;
        fieldDistortion.rotation.y += fieldUserData.distortionSpeed * 0.015;
        
        const fieldPulse = 0.5 + Math.sin(time * 1.2 + fieldUserData.distortionPhase) * 0.3;
        fieldDistortion.material.opacity = 0.2 + fieldPulse * 0.2;
        
        // Quantum state transitions
        quantumData.stateChangeTimer += 0.016; // ~60fps
        if (quantumData.stateChangeTimer > 5 + Math.random() * 10) { // 5-15 second intervals
            this.transitionQuantumState(quantumData);
            quantumData.stateChangeTimer = 0;
        }
    }
    
    /**
     * Transition quantum effect to new state
     */
    transitionQuantumState(quantumData) {
        const stateKeys = Object.keys(this.quantumStates);
        let newState = stateKeys[Math.floor(Math.random() * stateKeys.length)];
        
        // Avoid same state
        while (newState === quantumData.quantumState && stateKeys.length > 1) {
            newState = stateKeys[Math.floor(Math.random() * stateKeys.length)];
        }
        
        quantumData.quantumState = newState;
        
        // Update materials to new quantum state
        quantumData.rings.forEach(ring => {
            ring.material = this.materials[`ring_${newState}`].clone();
        });
        
        quantumData.core.material = this.materials[`core_${newState}`].clone();
        
        quantumData.particles.forEach(particle => {
            particle.material = this.materials[`particle_${newState}`].clone();
        });
        
        quantumData.fieldDistortion.material = this.materials[`field_${newState}`].clone();
        
        console.log(`⚛️ Quantum building ${quantumData.id} transioned to ${this.quantumStates[newState].name}`);
    }
    
    /**
     * Update energy beams between quantum buildings
     */
    updateEnergyBeams(time) {
        // Create/update energy beams between nearby quantum buildings
        if (this.activeEffects.length < 2) return;
        
        // Update existing beams or create new ones occasionally
        if (Math.random() < 0.005) { // 0.5% chance per frame
            this.createEnergyBeam();
        }
        
        // Update existing beams
        this.energyBeams.forEach((beam, index) => {
            beam.material.opacity = 0.5 + Math.sin(time * 3 + index) * 0.3;
            
            // Remove beam after some time
            if (time - beam.userData.createdAt > beam.userData.duration) {
                this.scene.remove(beam);
                this.energyBeams.splice(index, 1);
            }
        });
    }
    
    /**
     * Create energy beam between two quantum buildings
     */
    createEnergyBeam() {
        if (this.activeEffects.length < 2) return;
        
        const building1 = this.activeEffects[Math.floor(Math.random() * this.activeEffects.length)];
        let building2 = this.activeEffects[Math.floor(Math.random() * this.activeEffects.length)];
        
        // Ensure different buildings
        while (building2 === building1 && this.activeEffects.length > 1) {
            building2 = this.activeEffects[Math.floor(Math.random() * this.activeEffects.length)];
        }
        
        const points = [
            building1.buildingCenter.clone(),
            building2.buildingCenter.clone()
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = this.materials.energyBeam.clone();
        const beam = new THREE.Line(geometry, material);
        
        beam.userData = {
            type: 'energy_beam',
            createdAt: performance.now() * 0.001,
            duration: 2 + Math.random() * 3 // 2-5 seconds
        };
        
        this.scene.add(beam);
        this.energyBeams.push(beam);
    }
    
    /**
     * Remove all quantum effects
     */
    removeAllQuantumEffects() {
        this.activeEffects.forEach(quantumData => {
            this.scene.remove(quantumData.group);
            
            // Dispose geometries and materials
            quantumData.group.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material && child.material.dispose) child.material.dispose();
            });
        });
        
        // Remove energy beams
        this.energyBeams.forEach(beam => {
            this.scene.remove(beam);
            if (beam.geometry) beam.geometry.dispose();
            if (beam.material) beam.material.dispose();
        });
        
        this.activeEffects = [];
        this.quantumBuildings.clear();
        this.energyBeams = [];
        
        console.log('🧹 Đã xóa tất cả quantum effects');
    }
    
    /**
     * Get quantum effects statistics
     */
    getStats() {
        const stateStats = {};
        const effectTypeStats = {};
        
        this.activeEffects.forEach(effect => {
            const state = effect.quantumState;
            const type = effect.effectType;
            
            stateStats[state] = (stateStats[state] || 0) + 1;
            effectTypeStats[type] = (effectTypeStats[type] || 0) + 1;
        });
        
        return {
            totalQuantumBuildings: this.activeEffects.length,
            totalEnergyBeams: this.energyBeams.length,
            totalParticles: this.activeEffects.reduce((sum, effect) => sum + effect.particles.length, 0),
            totalRings: this.activeEffects.reduce((sum, effect) => sum + effect.rings.length, 0),
            quantumStateBreakdown: stateStats,
            effectTypeBreakdown: effectTypeStats,
            maxQuantumBuildings: this.maxQuantumBuildings
        };
    }
}

// Global functions for easy integration
window.initQuantumEffects = function() {
    console.log('⚛️ Khởi tạo Quantum Computing Effects System...');
    
    if (!window.scene || !window.camera) {
        console.error('❌ Không tìm thấy THREE.js scene hoặc camera!');
        return null;
    }
    
    // Create quantum effects system
    window.quantumSystem = new QuantumComputingEffectsSystem(window.scene, window.camera);
    
    // Initialize quantum effects
    window.quantumSystem.initializeQuantumEffects();
    
    // Show stats
    const stats = window.quantumSystem.getStats();
    console.log('📊 Quantum Effects Stats:', stats);
    
    // Show success notification
    const feedback = document.createElement('div');
    feedback.innerHTML = `
        <div>⚛️ QUANTUM EFFECTS ĐÃ KÍCH HOẠT!</div>
        <div style="font-size: 14px; margin-top: 8px;">
            🏗️ Quantum Buildings: ${stats.totalQuantumBuildings}<br>
            ⭐ Energy Rings: ${stats.totalRings}<br>
            ⚡ Orbital Particles: ${stats.totalParticles}<br>
            🔗 Energy Beams: ${stats.totalEnergyBeams}<br>
            🎭 Ground State: ${stats.quantumStateBreakdown.ground || 0}<br>
            🌟 Superposition: ${stats.quantumStateBreakdown.superposition || 0}<br>
            🔮 Entangled: ${stats.quantumStateBreakdown.entangled || 0}
        </div>
    `;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 51, 255, 0.95);
        color: white;
        padding: 25px 45px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        animation: fadeInOut 4s ease;
        text-align: center;
        border: 2px solid #0033ff;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 4000);
    
    return window.quantumSystem;
};

window.removeQuantumEffects = function() {
    if (window.quantumSystem) {
        window.quantumSystem.removeAllQuantumEffects();
        window.quantumSystem = null;
        console.log('🧹 Quantum effects removed');
    }
};

window.getQuantumStats = function() {
    if (window.quantumSystem) {
        const stats = window.quantumSystem.getStats();
        console.log('📊 Quantum Effects Statistics:', stats);
        return stats;
    }
    return null;
};

console.log('✅ Quantum Computing Effects System loaded! Sử dụng initQuantumEffects() để kích hoạt.');