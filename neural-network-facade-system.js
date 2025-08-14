/**
 * AI Neural Network Facade System for 3D Smart City
 * Creates hexagonal node grids and glowing connections on building surfaces
 * Compatible with existing THREE.js scene and emissive materials
 */

class NeuralNetworkFacadeSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.neuralGroups = new Map(); // Store neural networks per building
        this.animationMixers = [];
        this.connectionLines = [];
        this.activeAnimations = [];
        
        // Performance settings
        this.maxNodesPerBuilding = 50;
        this.maxConnectionsPerNode = 4;
        this.updateDistance = 200; // Only animate networks within this distance
        
        // Network density presets
        this.densityPresets = {
            sparse: { nodeSpacing: 8, connectionChance: 0.3, pulseFreq: 0.8 },
            medium: { nodeSpacing: 6, connectionChance: 0.5, pulseFreq: 1.2 },
            dense: { nodeSpacing: 4, connectionChance: 0.7, pulseFreq: 1.8 },
            ultra: { nodeSpacing: 3, connectionChance: 0.9, pulseFreq: 2.5 }
        };
        
        // Materials cache for performance
        this.materials = this.createNeuralMaterials();
        
        console.log('🧠 Neural Network Facade System initialized');
    }
    
    /**
     * Create optimized materials for neural network elements
     */
    createNeuralMaterials() {
        return {
            node: new THREE.MeshStandardMaterial({
                color: 0x00FFFF,
                emissive: 0x004488,
                emissiveIntensity: 1.0,
                metalness: 0.8,
                roughness: 0.2,
                transparent: true,
                opacity: 0.9
            }),
            
            nodeActive: new THREE.MeshStandardMaterial({
                color: 0x00FFFF,
                emissive: 0x0088FF,
                emissiveIntensity: 2.0,
                metalness: 0.9,
                roughness: 0.1,
                transparent: true,
                opacity: 1.0
            }),
            
            connection: new THREE.LineBasicMaterial({
                color: 0x00AAFF,
                transparent: true,
                opacity: 0.6,
                linewidth: 2
            }),
            
            connectionActive: new THREE.LineBasicMaterial({
                color: 0x00FFFF,
                transparent: true,
                opacity: 1.0,
                linewidth: 3
            })
        };
    }
    
    /**
     * Apply neural network to all buildings in the scene
     */
    applyToAllBuildings() {
        console.log('🏗️ Applying neural networks to all buildings...');
        
        let buildingCount = 0;
        const densityTypes = Object.keys(this.densityPresets);
        
        this.scene.traverse((child) => {
            if (child.isMesh && child.geometry && child.geometry.type === 'BoxGeometry') {
                // Skip if already has neural network
                if (this.neuralGroups.has(child.uuid)) return;
                
                // Randomly assign density type for variety
                const densityType = densityTypes[buildingCount % 4];
                
                try {
                    this.addNeuralNetwork(child, densityType);
                    buildingCount++;
                } catch (error) {
                    console.warn(`⚠️ Failed to add neural network to building: ${error.message}`);
                }
            }
        });
        
        console.log(`✅ Applied neural networks to ${buildingCount} buildings`);
        this.startAnimationSystem();
    }
    
    /**
     * Add neural network to a specific building
     */
    addNeuralNetwork(building, densityType = 'medium') {
        const preset = this.densityPresets[densityType];
        const neuralGroup = new THREE.Group();
        neuralGroup.name = `neural_${building.uuid}`;
        
        // Get building dimensions
        const box = new THREE.Box3().setFromObject(building);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Create nodes on multiple faces
        const nodes = this.createHexagonalNodes(building, size, center, preset);
        const connections = this.createConnections(nodes, preset);
        
        // Add nodes to group
        nodes.forEach(node => neuralGroup.add(node));
        connections.forEach(connection => neuralGroup.add(connection));
        
        // Position group relative to building
        neuralGroup.position.copy(center);
        neuralGroup.position.y = building.position.y;
        
        // Add to scene and track
        this.scene.add(neuralGroup);
        this.neuralGroups.set(building.uuid, {
            group: neuralGroup,
            nodes: nodes,
            connections: connections,
            densityType: densityType,
            building: building,
            lastUpdate: 0
        });
        
        return neuralGroup;
    }
    
    /**
     * Create hexagonal node pattern on building facades
     */
    createHexagonalNodes(building, size, center, preset) {
        const nodes = [];
        const nodeGeometry = new THREE.SphereGeometry(0.3, 8, 6);
        const spacing = preset.nodeSpacing;
        
        // Define faces (front, back, left, right)
        const faces = [
            { normal: [0, 0, 1], offset: size.z * 0.51 },   // Front
            { normal: [0, 0, -1], offset: -size.z * 0.51 }, // Back  
            { normal: [1, 0, 0], offset: size.x * 0.51 },   // Right
            { normal: [-1, 0, 0], offset: -size.x * 0.51 }  // Left
        ];
        
        faces.forEach((face, faceIndex) => {
            const faceNodes = this.createHexGridOnFace(
                nodeGeometry, 
                face, 
                size, 
                spacing,
                faceIndex
            );
            nodes.push(...faceNodes);
        });
        
        // Limit nodes for performance
        return nodes.slice(0, this.maxNodesPerBuilding);
    }
    
    /**
     * Create hexagonal grid on a specific building face
     */
    createHexGridOnFace(geometry, face, size, spacing, faceIndex) {
        const nodes = [];
        const [nx, ny, nz] = face.normal;
        
        // Calculate face dimensions
        const width = nx === 0 ? size.x : size.z;
        const height = size.y;
        
        // Hexagonal grid parameters
        const hexRadius = spacing * 0.5;
        const rowHeight = hexRadius * Math.sqrt(3);
        
        // Grid bounds
        const cols = Math.floor(width / spacing);
        const rows = Math.floor(height / rowHeight);
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Hexagonal offset pattern
                const offsetX = (row % 2) * hexRadius;
                const x = (col * spacing + offsetX) - width * 0.5;
                const y = (row * rowHeight) - height * 0.5;
                
                // Skip if outside bounds
                if (Math.abs(x) > width * 0.4 || Math.abs(y) > height * 0.4) continue;
                
                // Create node
                const node = new THREE.Mesh(geometry, this.materials.node.clone());
                
                // Position on face
                if (nx !== 0) {
                    node.position.set(face.offset, y, x);
                } else {
                    node.position.set(x, y, face.offset);
                }
                
                // Node metadata
                node.userData = {
                    type: 'neural_node',
                    faceIndex: faceIndex,
                    gridPos: [row, col],
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.5 + Math.random() * 1.5,
                    connections: []
                };
                
                nodes.push(node);
            }
        }
        
        return nodes;
    }
    
    /**
     * Create glowing connections between nodes
     */
    createConnections(nodes, preset) {
        const connections = [];
        const maxConnections = Math.min(nodes.length * preset.connectionChance, 200);
        
        for (let i = 0; i < maxConnections; i++) {
            const nodeA = nodes[Math.floor(Math.random() * nodes.length)];
            const nodeB = nodes[Math.floor(Math.random() * nodes.length)];
            
            if (nodeA === nodeB) continue;
            
            // Check if connection already exists
            const hasConnection = nodeA.userData.connections.some(conn => 
                conn.target === nodeB || conn.source === nodeB
            );
            if (hasConnection) continue;
            
            // Distance check for realistic connections
            const distance = nodeA.position.distanceTo(nodeB.position);
            if (distance > preset.nodeSpacing * 3) continue;
            
            // Create connection line
            const connection = this.createConnectionLine(nodeA, nodeB);
            if (connection) {
                connections.push(connection);
                
                // Update node connections
                nodeA.userData.connections.push({ target: nodeB, line: connection });
                nodeB.userData.connections.push({ source: nodeA, line: connection });
            }
        }
        
        return connections;
    }
    
    /**
     * Create a single connection line between two nodes
     */
    createConnectionLine(nodeA, nodeB) {
        const points = [
            nodeA.position.clone(),
            nodeB.position.clone()
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, this.materials.connection.clone());
        
        line.userData = {
            type: 'neural_connection',
            nodeA: nodeA,
            nodeB: nodeB,
            flowPhase: Math.random() * Math.PI * 2,
            flowSpeed: 1.0 + Math.random() * 2.0,
            isActive: false
        };
        
        return line;
    }
    
    /**
     * Start the animation system for all neural networks
     */
    startAnimationSystem() {
        console.log('🎬 Starting neural network animation system...');
        
        const animate = () => {
            const time = performance.now() * 0.001;
            const cameraPos = this.camera.position;
            
            this.neuralGroups.forEach((networkData, buildingId) => {
                const building = networkData.building;
                const distance = cameraPos.distanceTo(building.position);
                
                // Only animate networks within view distance for performance
                if (distance < this.updateDistance) {
                    this.animateNetwork(networkData, time);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate a single neural network
     */
    animateNetwork(networkData, time) {
        const { nodes, connections, densityType } = networkData;
        const preset = this.densityPresets[densityType];
        
        // Animate nodes - pulsing effect
        nodes.forEach(node => {
            const phase = node.userData.pulsePhase + time * node.userData.pulseSpeed * preset.pulseFreq;
            const intensity = 0.5 + Math.sin(phase) * 0.5; // 0.5 to 1.0 range
            
            // Update emissive intensity
            node.material.emissiveIntensity = 0.5 + intensity * 1.5; // 0.5 to 2.0 range
            
            // Occasional "activation" burst
            if (Math.random() < 0.002) { // 0.2% chance per frame
                node.material = this.materials.nodeActive.clone();
                setTimeout(() => {
                    node.material = this.materials.node.clone();
                }, 200 + Math.random() * 800);
            }
        });
        
        // Animate connections - flowing data effect
        connections.forEach(connection => {
            const userData = connection.userData;
            const flowPhase = userData.flowPhase + time * userData.flowSpeed;
            
            // Flowing opacity effect
            const flowIntensity = 0.3 + Math.sin(flowPhase) * 0.3; // 0.0 to 0.6
            connection.material.opacity = flowIntensity;
            
            // Occasional data burst
            if (Math.random() < 0.001) { // 0.1% chance per frame
                userData.isActive = true;
                connection.material = this.materials.connectionActive.clone();
                
                setTimeout(() => {
                    userData.isActive = false;
                    connection.material = this.materials.connection.clone();
                }, 300 + Math.random() * 700);
            }
        });
    }
    
    /**
     * Update neural networks (call this in main render loop)
     */
    update(deltaTime) {
        // This can be used for additional per-frame updates if needed
        // Currently animations are handled by the internal animation system
    }
    
    /**
     * Remove neural network from a building
     */
    removeNeuralNetwork(building) {
        const networkData = this.neuralGroups.get(building.uuid);
        if (networkData) {
            this.scene.remove(networkData.group);
            
            // Dispose of geometries and materials
            networkData.group.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
            
            this.neuralGroups.delete(building.uuid);
            console.log(`🗑️ Neural network removed from building ${building.uuid}`);
        }
    }
    
    /**
     * Remove all neural networks
     */
    removeAllNetworks() {
        this.neuralGroups.forEach((networkData, buildingId) => {
            this.scene.remove(networkData.group);
            
            // Dispose resources
            networkData.group.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        
        this.neuralGroups.clear();
        console.log('🧹 All neural networks removed');
    }
    
    /**
     * Get performance statistics
     */
    getStats() {
        let totalNodes = 0;
        let totalConnections = 0;
        
        this.neuralGroups.forEach(networkData => {
            totalNodes += networkData.nodes.length;
            totalConnections += networkData.connections.length;
        });
        
        return {
            buildings: this.neuralGroups.size,
            totalNodes: totalNodes,
            totalConnections: totalConnections,
            avgNodesPerBuilding: Math.round(totalNodes / this.neuralGroups.size) || 0,
            avgConnectionsPerBuilding: Math.round(totalConnections / this.neuralGroups.size) || 0
        };
    }
}

// Global functions for easy integration
window.initNeuralNetworks = function() {
    console.log('🧠 Initializing Neural Network Facade System...');
    
    if (!window.scene || !window.camera) {
        console.error('❌ THREE.js scene or camera not found! Make sure 3D campus is loaded.');
        return null;
    }
    
    // Create neural network system
    window.neuralSystem = new NeuralNetworkFacadeSystem(window.scene, window.camera);
    
    // Apply to all buildings
    window.neuralSystem.applyToAllBuildings();
    
    // Show stats
    const stats = window.neuralSystem.getStats();
    console.log('📊 Neural Network Stats:', stats);
    
    // Show success notification
    const feedback = document.createElement('div');
    feedback.innerHTML = `
        <div>🧠 NEURAL NETWORKS ACTIVATED!</div>
        <div style="font-size: 14px; margin-top: 8px;">
            🏗️ Buildings: ${stats.buildings}<br>
            🔵 Nodes: ${stats.totalNodes}<br>
            ⚡ Connections: ${stats.totalConnections}<br>
            🎬 Animations: Active
        </div>
    `;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(16, 185, 129, 0.95);
        color: white;
        padding: 25px 45px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        animation: fadeInOut 4s ease;
        text-align: center;
        border: 2px solid #10b981;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 4000);
    
    return window.neuralSystem;
};

window.removeNeuralNetworks = function() {
    if (window.neuralSystem) {
        window.neuralSystem.removeAllNetworks();
        window.neuralSystem = null;
        console.log('🧹 Neural networks removed');
    }
};

window.getNeuralStats = function() {
    if (window.neuralSystem) {
        const stats = window.neuralSystem.getStats();
        console.log('📊 Neural Network Statistics:', stats);
        return stats;
    }
    return null;
};

console.log('✅ Neural Network Facade System loaded! Use initNeuralNetworks() to activate.');