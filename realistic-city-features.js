/**
 * RealisticCityFeatures
 * Additional features for the AI Campus 3D visualization
 */

class RealisticCityFeatures {
    constructor(city) {
        this.city = city;
        this.features = {
            bridges: [],
            parkingGarage: null,
            garden: null,
            lighting: [],
            furniture: []
        };
    }

    /**
     * Initialize all additional features
     */
    init() {
        console.log('Initializing additional city features...');
        this.createGlassBridges();
        this.createParkingGarage();
        this.createHexagonalGarden();
        this.createSmartLighting();
        this.createUrbanFurniture();
        console.log('All additional features created successfully');
    }

    /**
     * Create glass bridges connecting buildings
     */
    createGlassBridges() {
        console.log('Creating glass bridges...');
        
        const buildings = this.city.buildings;
        const bridgeCount = 5;
        let bridgesCreated = 0;
        
        for (let i = 0; i < buildings.length && bridgesCreated < bridgeCount; i++) {
            for (let j = i + 1; j < buildings.length && bridgesCreated < bridgeCount; j++) {
                const b1 = buildings[i];
                const b2 = buildings[j];
                
                // Calculate distance between buildings
                const dx = b2.position.x - b1.position.x;
                const dz = b2.position.z - b1.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // Only create bridges between buildings that are close enough
                if (distance < 20 && distance > 5) {
                    const bridgeHeight = Math.min(b1.dimensions.height, b2.dimensions.height) * 0.7;
                    this.createBridge(b1, b2, bridgeHeight);
                    bridgesCreated++;
                }
            }
        }
        
        console.log(`Created ${bridgesCreated} glass bridges`);
    }
    
    /**
     * Create a glass bridge between two buildings
     */
    createBridge(building1, building2, height) {
        // Calculate bridge position and dimensions
        const midX = (building1.position.x + building2.position.x) / 2;
        const midZ = (building1.position.z + building2.position.z) / 2;
        const y = height;
        
        const dx = building2.position.x - building1.position.x;
        const dz = building2.position.z - building1.position.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        const width = 3;
        const depth = 2;
        
        // Calculate rotation angle
        const angle = Math.atan2(dz, dx);
        
        // Create bridge geometry
        const bridgeGeometry = new THREE.BoxGeometry(length, depth, width);
        const bridgeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.2,
            roughness: 0.05,
            transparent: true,
            opacity: 0.7,
            transmission: 0.95,
            side: THREE.DoubleSide,
            wireframe: false
        });
        
        // Create bridge mesh
        const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        bridge.position.set(midX, y, midZ);
        bridge.rotation.y = angle;
        bridge.castShadow = true;
        bridge.receiveShadow = true;
        
        // Add to scene
        this.city.scene.add(bridge);
        this.features.bridges.push(bridge);
        
        return bridge;
    }

    /**
     * Create a modern glass parking garage
     */
    createParkingGarage() {
        console.log('Creating parking garage...');
        
        // Position the garage at the edge of the city
        const x = -30;
        const z = 30;
        
        // Create main structure
        const baseGeometry = new THREE.BoxGeometry(20, 15, 25);
        const baseMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.4,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, 7.5, z);
        base.castShadow = true;
        base.receiveShadow = true;
        
        // Create parking levels
        const levels = 5;
        const levelHeight = 3;
        
        for (let i = 0; i < levels; i++) {
            const levelGeometry = new THREE.BoxGeometry(19, 0.5, 24);
            const levelMaterial = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                roughness: 0.7,
                wireframe: false
            });
            
            const level = new THREE.Mesh(levelGeometry, levelMaterial);
            level.position.set(x, i * levelHeight, z);
            level.castShadow = true;
            level.receiveShadow = true;
            
            this.city.scene.add(level);
        }
        
        // Add to scene
        this.city.scene.add(base);
        this.features.parkingGarage = base;
        
        console.log('Parking garage created');
    }

    /**
     * Create hexagonal garden with AI design
     */
    createHexagonalGarden() {
        console.log('Creating hexagonal garden...');
        
        // Position the garden in the city center
        const x = 0;
        const z = 0;
        
        // Create hexagonal base
        const hexRadius = 15;
        const hexGeometry = new THREE.CylinderGeometry(hexRadius, hexRadius, 0.5, 6);
        const hexMaterial = new THREE.MeshStandardMaterial({
            color: 0x88aa44,
            roughness: 0.8,
            wireframe: false
        });
        
        const hexBase = new THREE.Mesh(hexGeometry, hexMaterial);
        hexBase.position.set(x, 0.25, z);
        hexBase.castShadow = false;
        hexBase.receiveShadow = true;
        
        // Create AI pattern on the garden
        const patternGeometry = new THREE.TorusGeometry(10, 0.5, 16, 6);
        const patternMaterial = new THREE.MeshStandardMaterial({
            color: 0x44aaff,
            emissive: 0x1133aa,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            wireframe: false
        });
        
        const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
        pattern.position.set(x, 0.6, z);
        pattern.rotation.x = Math.PI / 2;
        
        // Add trees around the garden
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const treeX = x + Math.cos(angle) * (hexRadius - 2);
            const treeZ = z + Math.sin(angle) * (hexRadius - 2);
            
            this.createTree(treeX, treeZ);
        }
        
        // Add to scene
        this.city.scene.add(hexBase);
        this.city.scene.add(pattern);
        this.features.garden = hexBase;
        
        console.log('Hexagonal garden created');
    }
    
    /**
     * Create a tree
     */
    createTree(x, z) {
        // Create trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 3, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9,
            wireframe: false
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 1.5, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        // Create foliage
        const foliageGeometry = new THREE.SphereGeometry(2, 8, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x228833,
            roughness: 0.8,
            wireframe: false
        });
        
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, 4, z);
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        
        // Add to scene
        this.city.scene.add(trunk);
        this.city.scene.add(foliage);
    }

    /**
     * Create smart LED lighting system
     */
    createSmartLighting() {
        console.log('Creating smart LED lighting system...');
        
        // Create street lights around the city
        const lightCount = 12;
        const radius = 40;
        
        for (let i = 0; i < lightCount; i++) {
            const angle = i * Math.PI * 2 / lightCount;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            this.createStreetLight(x, z);
        }
        
        console.log('Smart lighting system created');
    }
    
    /**
     * Create a street light
     */
    createStreetLight(x, z) {
        // Create pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.3, 8, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7,
            wireframe: false
        });
        
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, 4, z);
        pole.castShadow = true;
        pole.receiveShadow = true;
        
        // Create light fixture
        const fixtureGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 8);
        const fixtureMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.5,
            wireframe: false
        });
        
        const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
        fixture.position.set(x, 8, z);
        fixture.castShadow = true;
        fixture.receiveShadow = true;
        
        // Create light
        const light = new THREE.PointLight(0xffffaa, 1, 20);
        light.position.set(x, 8, z);
        light.castShadow = true;
        
        // Add to scene
        this.city.scene.add(pole);
        this.city.scene.add(fixture);
        this.city.scene.add(light);
        this.features.lighting.push(light);
    }

    /**
     * Create urban furniture (benches, kiosks, bus stops)
     */
    createUrbanFurniture() {
        console.log('Creating urban furniture...');
        
        // Create benches
        this.createBench(-15, 15);
        this.createBench(15, 15);
        this.createBench(15, -15);
        this.createBench(-15, -15);
        
        // Create kiosk
        this.createKiosk(25, 0);
        
        // Create bus stop
        this.createBusStop(-25, 0);
        
        console.log('Urban furniture created');
    }
    
    /**
     * Create a bench
     */
    createBench(x, z) {
        // Create seat
        const seatGeometry = new THREE.BoxGeometry(3, 0.3, 1);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8,
            wireframe: false
        });
        
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.set(x, 0.6, z);
        seat.castShadow = true;
        seat.receiveShadow = true;
        
        // Create legs
        for (let i = -1; i <= 1; i += 2) {
            const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 1);
            const legMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.7,
                wireframe: false
            });
            
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(x + i, 0.3, z);
            leg.castShadow = true;
            leg.receiveShadow = true;
            
            this.city.scene.add(leg);
        }
        
        // Add to scene
        this.city.scene.add(seat);
        this.features.furniture.push(seat);
    }
    
    /**
     * Create a kiosk
     */
    createKiosk(x, z) {
        // Create kiosk base
        const baseGeometry = new THREE.BoxGeometry(3, 3, 3);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x2288cc,
            roughness: 0.5,
            wireframe: false
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, 1.5, z);
        base.castShadow = true;
        base.receiveShadow = true;
        
        // Create kiosk roof
        const roofGeometry = new THREE.ConeGeometry(2.5, 1, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7,
            wireframe: false
        });
        
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(x, 3.5, z);
        roof.castShadow = true;
        roof.receiveShadow = true;
        
        // Add to scene
        this.city.scene.add(base);
        this.city.scene.add(roof);
        this.features.furniture.push(base);
    }
    
    /**
     * Create a bus stop
     */
    createBusStop(x, z) {
        // Create bus stop base
        const baseGeometry = new THREE.BoxGeometry(5, 0.2, 2);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.7,
            wireframe: false
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, 0.1, z);
        base.castShadow = true;
        base.receiveShadow = true;
        
        // Create bus stop roof
        const roofGeometry = new THREE.BoxGeometry(5, 0.2, 2);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7,
            wireframe: false
        });
        
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(x, 2.5, z);
        roof.castShadow = true;
        roof.receiveShadow = true;
        
        // Create supports
        for (let i = -1; i <= 1; i += 2) {
            const supportGeometry = new THREE.BoxGeometry(0.2, 2.5, 0.2);
            const supportMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.7,
                wireframe: false
            });
            
            const support = new THREE.Mesh(supportGeometry, supportMaterial);
            support.position.set(x + i * 2, 1.25, z - 0.8);
            support.castShadow = true;
            support.receiveShadow = true;
            
            this.city.scene.add(support);
        }
        
        // Create back panel
        const panelGeometry = new THREE.BoxGeometry(5, 2, 0.1);
        const panelMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.2,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7,
            transmission: 0.5,
            wireframe: false
        });
        
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(x, 1.3, z - 0.9);
        panel.castShadow = true;
        panel.receiveShadow = true;
        
        // Add to scene
        this.city.scene.add(base);
        this.city.scene.add(roof);
        this.city.scene.add(panel);
        this.features.furniture.push(base);
    }
}
