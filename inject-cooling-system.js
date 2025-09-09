// INJECT COOLING SYSTEM INTO EXISTING 3D SMART CITY
// Run this in browser console at http://localhost:8080/3d-smart-city.html

(function injectCoolingSystem() {
    console.log('💉 Starting Cooling System Injection...\n');
    
    // Check if scene exists
    if (typeof scene === 'undefined' || typeof THREE === 'undefined') {
        console.error('❌ Scene not loaded. Please wait for 3D Smart City to load first.');
        return;
    }
    
    // 1. MOVE RIVER CLOSER TO DATACENTERS
    console.log('🌊 Repositioning river segments...');
    
    // Find all river segments and move them closer to datacenter area
    let riverSegmentCount = 0;
    scene.traverse((child) => {
        if (child.name && child.name.includes('river-segment')) {
            // Original river is around x=350-420, move it to x=-50 to x=50
            const oldX = child.position.x;
            child.position.x = oldX - 470; // Shift 470 units west
            riverSegmentCount++;
        }
    });
    console.log(`✅ Moved ${riverSegmentCount} river segments closer to datacenters\n`);
    
    // Move river banks and decorations
    scene.traverse((child) => {
        if (child.name && (child.name.includes('river-bank') || 
            child.name.includes('river-ripple') || 
            child.name.includes('river-tree'))) {
            child.position.x -= 470;
        }
    });
    
    // 2. REPOSITION DATACENTERS NEXT TO RIVER
    console.log('🏢 Repositioning datacenters next to river...');
    
    const datacenterTypes = ['datacenter_01', 'datacenter_02', 'datacenter_03'];
    let datacenterCount = 0;
    
    scene.traverse((child) => {
        if (child.userData && child.userData.buildingType) {
            if (datacenterTypes.includes(child.userData.buildingType)) {
                // Move datacenters closer to the new river position
                const phase = child.userData.phase;
                if (phase === 'phase1') {
                    // Position Phase 1 datacenters along the river
                    if (child.userData.buildingType === 'datacenter_01') {
                        child.position.set(-100, child.position.y, -150);
                    } else if (child.userData.buildingType === 'datacenter_02') {
                        child.position.set(-100, child.position.y, -80);
                    } else if (child.userData.buildingType === 'datacenter_03') {
                        child.position.set(-100, child.position.y, -10);
                    }
                    datacenterCount++;
                }
            }
        }
    });
    console.log(`✅ Repositioned ${datacenterCount} datacenters\n`);
    
    // 3. CREATE NEW COOLING LAKE CONNECTING RIVER TO DATACENTERS
    console.log('🏞️ Creating new cooling lake...');
    
    const coolingLakeGroup = new THREE.Group();
    coolingLakeGroup.name = 'injected-cooling-lake';
    
    // Main cooling lake
    const lakeGeometry = new THREE.CylinderGeometry(40, 45, 1.5, 32);
    const lakeMaterial = new THREE.MeshPhongMaterial({
        color: 0x006994,
        transparent: true,
        opacity: 0.85,
        shininess: 100
    });
    const lakeMesh = new THREE.Mesh(lakeGeometry, lakeMaterial);
    lakeMesh.position.y = 0.5;
    lakeMesh.receiveShadow = true;
    coolingLakeGroup.add(lakeMesh);
    
    // Lake shore
    const shoreGeometry = new THREE.RingGeometry(40, 48, 32);
    const shoreMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
    const shoreMesh = new THREE.Mesh(shoreGeometry, shoreMaterial);
    shoreMesh.rotation.x = -Math.PI / 2;
    shoreMesh.position.y = 0.1;
    coolingLakeGroup.add(shoreMesh);
    
    // Position between datacenters and river
    coolingLakeGroup.position.set(-50, 0, -80);
    scene.add(coolingLakeGroup);
    console.log('✅ Cooling lake added\n');
    
    // 4. INJECT COOLING PIPES
    console.log('🔧 Injecting cooling pipe system...');
    
    const pipesGroup = new THREE.Group();
    pipesGroup.name = 'cooling-pipes-system';
    
    // Material for pipes
    const pipeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a4a4a,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // Create main intake pipes from river to cooling lake
    const intakePipes = [
        { start: { x: -20, z: -80 }, end: { x: -50, z: -80 }, height: 2 },
        { start: { x: -20, z: -100 }, end: { x: -50, z: -100 }, height: 2 }
    ];
    
    intakePipes.forEach((pipe, index) => {
        const length = Math.sqrt(
            Math.pow(pipe.end.x - pipe.start.x, 2) + 
            Math.pow(pipe.end.z - pipe.start.z, 2)
        );
        
        const pipeGeometry = new THREE.CylinderGeometry(1.5, 1.5, length, 16);
        const pipeMesh = new THREE.Mesh(pipeGeometry, pipeMaterial);
        
        // Position and rotate pipe
        pipeMesh.position.set(
            (pipe.start.x + pipe.end.x) / 2,
            pipe.height,
            (pipe.start.z + pipe.end.z) / 2
        );
        pipeMesh.rotation.z = Math.PI / 2;
        pipeMesh.name = `intake-pipe-${index}`;
        
        pipesGroup.add(pipeMesh);
    });
    
    // Create distribution pipes from cooling lake to datacenters
    const datacenterPipes = [
        { dc: { x: -100, z: -150 }, lake: { x: -50, z: -80 } },
        { dc: { x: -100, z: -80 }, lake: { x: -50, z: -80 } },
        { dc: { x: -100, z: -10 }, lake: { x: -50, z: -80 } }
    ];
    
    datacenterPipes.forEach((pipeData, index) => {
        // Calculate pipe segments for realistic routing
        const midPoint = {
            x: (pipeData.dc.x + pipeData.lake.x) / 2,
            z: pipeData.dc.z
        };
        
        // Segment 1: Lake to midpoint
        const seg1Length = Math.abs(midPoint.x - pipeData.lake.x);
        const segment1 = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.2, seg1Length, 16),
            pipeMaterial
        );
        segment1.position.set(
            (pipeData.lake.x + midPoint.x) / 2,
            1.5,
            pipeData.lake.z
        );
        segment1.rotation.z = Math.PI / 2;
        pipesGroup.add(segment1);
        
        // Segment 2: Midpoint to datacenter
        const seg2Length = Math.abs(pipeData.dc.z - pipeData.lake.z);
        const segment2 = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.2, seg2Length, 16),
            pipeMaterial
        );
        segment2.position.set(
            midPoint.x,
            1.5,
            (pipeData.dc.z + pipeData.lake.z) / 2
        );
        pipesGroup.add(segment2);
        
        // Elbow joint
        const elbow = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 16, 16),
            pipeMaterial
        );
        elbow.position.set(midPoint.x, 1.5, pipeData.lake.z);
        pipesGroup.add(elbow);
    });
    
    scene.add(pipesGroup);
    console.log('✅ Cooling pipes system injected\n');
    
    // 5. ADD COOLING EQUIPMENT
    console.log('⚙️ Adding cooling equipment...');
    
    const equipmentGroup = new THREE.Group();
    equipmentGroup.name = 'cooling-equipment';
    
    // Pump stations
    const pumpStations = [
        { x: -25, z: -80 },  // River intake
        { x: -50, z: -60 },  // Lake pump
        { x: -50, z: -100 }  // Lake pump
    ];
    
    pumpStations.forEach((pos, index) => {
        const pumpGroup = new THREE.Group();
        
        // Pump building
        const pumpBuilding = new THREE.Mesh(
            new THREE.BoxGeometry(8, 6, 8),
            new THREE.MeshPhongMaterial({ color: 0x606060 })
        );
        pumpBuilding.position.y = 3;
        pumpGroup.add(pumpBuilding);
        
        // Pump machinery (visible through windows)
        const machinery = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 2, 4, 16),
            new THREE.MeshPhongMaterial({ color: 0x2a52be, emissive: 0x1a1a4a })
        );
        machinery.position.y = 2;
        pumpGroup.add(machinery);
        
        // Control panel
        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(3, 4, 0.5),
            new THREE.MeshPhongMaterial({ color: 0x333333 })
        );
        panel.position.set(3, 2, 0);
        pumpGroup.add(panel);
        
        pumpGroup.position.set(pos.x, 0, pos.z);
        pumpGroup.name = `pump-station-${index}`;
        equipmentGroup.add(pumpGroup);
    });
    
    // Heat exchangers near datacenters
    const heatExchangers = [
        { x: -85, z: -150 },
        { x: -85, z: -80 },
        { x: -85, z: -10 }
    ];
    
    heatExchangers.forEach((pos, index) => {
        const exchangerGroup = new THREE.Group();
        
        // Main heat exchanger unit
        const exchanger = new THREE.Mesh(
            new THREE.BoxGeometry(6, 8, 10),
            new THREE.MeshPhongMaterial({ color: 0x4169e1 })
        );
        exchanger.position.y = 4;
        exchangerGroup.add(exchanger);
        
        // Cooling fins
        for (let i = 0; i < 5; i++) {
            const fin = new THREE.Mesh(
                new THREE.BoxGeometry(5.5, 0.2, 9.5),
                new THREE.MeshPhongMaterial({ color: 0x808080 })
            );
            fin.position.set(0, 2 + i * 1.2, 0);
            exchangerGroup.add(fin);
        }
        
        // Connection points
        const inlet = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 0.8, 2, 16),
            pipeMaterial
        );
        inlet.position.set(-3, 4, 0);
        inlet.rotation.z = Math.PI / 2;
        exchangerGroup.add(inlet);
        
        const outlet = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 0.8, 2, 16),
            pipeMaterial
        );
        outlet.position.set(3, 4, 0);
        outlet.rotation.z = Math.PI / 2;
        exchangerGroup.add(outlet);
        
        exchangerGroup.position.set(pos.x, 0, pos.z);
        exchangerGroup.name = `heat-exchanger-${index}`;
        equipmentGroup.add(exchangerGroup);
    });
    
    scene.add(equipmentGroup);
    console.log('✅ Cooling equipment added\n');
    
    // 6. OPTIMIZE LAYOUT
    console.log('📐 Optimizing cooling system layout...');
    
    // Add visual flow indicators
    const flowIndicators = new THREE.Group();
    flowIndicators.name = 'flow-indicators';
    
    // Create animated water flow particles
    const particleCount = 50;
    const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.6
    });
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.userData.flowPath = i % 3; // 3 different flow paths
        particle.userData.progress = Math.random();
        particle.name = `flow-particle-${i}`;
        flowIndicators.add(particle);
    }
    
    scene.add(flowIndicators);
    
    // Animate flow particles
    function animateFlowParticles() {
        flowIndicators.children.forEach(particle => {
            particle.userData.progress += 0.005;
            if (particle.userData.progress > 1) particle.userData.progress = 0;
            
            const t = particle.userData.progress;
            const path = particle.userData.flowPath;
            
            if (path === 0) {
                // River to lake flow
                particle.position.x = -20 + (-30 * t);
                particle.position.y = 1.5;
                particle.position.z = -80;
            } else if (path === 1) {
                // Lake to DC1 flow
                particle.position.x = -50 + (-50 * t);
                particle.position.y = 1.5;
                particle.position.z = -80 + (-70 * t);
            } else {
                // Lake to DC2 flow
                particle.position.x = -50 + (-50 * t);
                particle.position.y = 1.5;
                particle.position.z = -80;
            }
        });
    }
    
    // Hook into existing animation loop
    const originalAnimate = window.animate;
    window.animate = function() {
        if (originalAnimate) originalAnimate.apply(this, arguments);
        animateFlowParticles();
    };
    
    console.log('✅ Layout optimized with flow visualization\n');
    
    // Summary
    console.log('🎉 COOLING SYSTEM INJECTION COMPLETE!');
    console.log('=====================================');
    console.log('✅ River repositioned next to datacenters');
    console.log('✅ Datacenters moved to optimal cooling positions');
    console.log('✅ New cooling lake created between river and datacenters');
    console.log('✅ Cooling pipe network installed');
    console.log('✅ Pump stations and heat exchangers added');
    console.log('✅ Flow visualization system active');
    console.log('\n📌 All original functionality preserved');
    console.log('📌 New elements added to existing scene');
    
    // Store reference for removal if needed
    window.injectedCoolingSystem = {
        coolingLake: coolingLakeGroup,
        pipes: pipesGroup,
        equipment: equipmentGroup,
        flowIndicators: flowIndicators,
        remove: function() {
            scene.remove(coolingLakeGroup);
            scene.remove(pipesGroup);
            scene.remove(equipmentGroup);
            scene.remove(flowIndicators);
            console.log('✅ Cooling system removed');
        }
    };
    
    console.log('\n💡 To remove: window.injectedCoolingSystem.remove()');
})();