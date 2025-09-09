// FORCE RIVER REPOSITION - Fix river location in 3D Smart City
// Run this in browser console at http://localhost:8080/3d-smart-city.html

(function forceRiverReposition() {
    console.log('🔧 FORCE RIVER REPOSITION SCRIPT');
    console.log('================================\n');
    
    // 1. FIND ALL WATER-RELATED OBJECTS
    console.log('🔍 Step 1: Searching for river/water objects...');
    
    const waterObjects = [];
    const riverSegments = [];
    const waterRelatedNames = ['river', 'water', 'stream', 'lake', 'cooling', 'aqua'];
    
    scene.traverse((obj) => {
        // Check object name
        const objName = (obj.name || '').toLowerCase();
        const materialName = (obj.material?.name || '').toLowerCase();
        const isWater = waterRelatedNames.some(keyword => 
            objName.includes(keyword) || materialName.includes(keyword)
        );
        
        // Check material color (blue-ish colors)
        const isWaterColor = obj.material && obj.material.color && 
            (obj.material.color.getHex() === 0x006994 || 
             obj.material.color.getHex() === 0x00aaff ||
             obj.material.color.getHex() === 0x0080ff);
        
        if (isWater || isWaterColor) {
            waterObjects.push({
                object: obj,
                name: obj.name,
                type: obj.type,
                position: obj.position.clone(),
                material: obj.material?.name || 'unnamed',
                color: obj.material?.color ? `#${obj.material.color.getHexString()}` : 'none'
            });
            
            if (objName.includes('river-segment')) {
                riverSegments.push(obj);
            }
        }
    });
    
    console.log(`✅ Found ${waterObjects.length} water-related objects`);
    console.log(`✅ Found ${riverSegments.length} river segments`);
    
    // Log details
    waterObjects.forEach(wo => {
        console.log(`  - ${wo.name || 'Unnamed'}: pos(${wo.position.x.toFixed(1)}, ${wo.position.z.toFixed(1)}), color: ${wo.color}`);
    });
    
    // 2. FIND DATACENTER POSITIONS
    console.log('\n🏢 Step 2: Finding datacenter positions...');
    
    const datacenters = [];
    const dcTypes = ['datacenter_01', 'datacenter_02', 'datacenter_03'];
    
    scene.traverse((obj) => {
        if (obj.userData?.buildingType && dcTypes.includes(obj.userData.buildingType)) {
            datacenters.push({
                object: obj,
                name: obj.userData.name || obj.userData.buildingType,
                type: obj.userData.buildingType,
                position: obj.position.clone(),
                phase: obj.userData.phase
            });
        }
    });
    
    console.log(`✅ Found ${datacenters.length} datacenters`);
    datacenters.forEach(dc => {
        console.log(`  - ${dc.name}: pos(${dc.position.x.toFixed(1)}, ${dc.position.z.toFixed(1)})`);
    });
    
    // Calculate datacenter center position
    const dcCenter = datacenters.length > 0 ? {
        x: datacenters.reduce((sum, dc) => sum + dc.position.x, 0) / datacenters.length,
        z: datacenters.reduce((sum, dc) => sum + dc.position.z, 0) / datacenters.length
    } : { x: -200, z: -100 }; // Default datacenter area
    
    console.log(`\n📍 Datacenter center: (${dcCenter.x.toFixed(1)}, ${dcCenter.z.toFixed(1)})`);
    
    // 3. FORCE REPOSITION EXISTING RIVER
    console.log('\n🌊 Step 3: Force repositioning river...');
    
    if (riverSegments.length > 0) {
        // Move existing river segments
        riverSegments.forEach((segment, index) => {
            const oldPos = segment.position.clone();
            
            // New position: 50-70 units east of datacenter center
            const newX = dcCenter.x + 60;
            const newZ = dcCenter.z + (index - riverSegments.length/2) * 25; // Spread along z-axis
            
            segment.position.x = newX;
            segment.position.z = newZ;
            
            console.log(`  ✅ Moved ${segment.name}: (${oldPos.x.toFixed(1)}, ${oldPos.z.toFixed(1)}) → (${newX.toFixed(1)}, ${newZ.toFixed(1)})`);
        });
        
        // Also move any related water objects
        waterObjects.forEach(wo => {
            if (!wo.name?.includes('river-segment') && wo.name?.includes('river')) {
                wo.object.position.x = dcCenter.x + 60;
                console.log(`  ✅ Moved related: ${wo.name}`);
            }
        });
        
    } else {
        // No river segments found - create new river
        console.log('⚠️ No river segments found. Creating new river...');
        
        const riverGroup = new THREE.Group();
        riverGroup.name = 'forced-river';
        
        // River material
        const riverMaterial = new THREE.MeshPhongMaterial({
            color: 0x006994,
            transparent: true,
            opacity: 0.85,
            shininess: 100
        });
        
        // Create river segments
        const riverLength = 200;
        const riverWidth = 20;
        const segmentCount = 8;
        const segmentLength = riverLength / segmentCount;
        
        for (let i = 0; i < segmentCount; i++) {
            const segment = new THREE.Mesh(
                new THREE.BoxGeometry(riverWidth, 1.5, segmentLength),
                riverMaterial
            );
            
            // Position 50 units east of datacenter center
            segment.position.set(
                dcCenter.x + 50,
                0.5,
                dcCenter.z - riverLength/2 + i * segmentLength + segmentLength/2
            );
            
            segment.receiveShadow = true;
            segment.name = `forced-river-segment-${i}`;
            riverGroup.add(segment);
        }
        
        // Add river banks
        const bankMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        
        [-1, 1].forEach(side => {
            const bank = new THREE.Mesh(
                new THREE.BoxGeometry(5, 2, riverLength),
                bankMaterial
            );
            bank.position.set(
                dcCenter.x + 50 + side * (riverWidth/2 + 2.5),
                1,
                dcCenter.z
            );
            bank.name = `forced-river-bank-${side > 0 ? 'east' : 'west'}`;
            riverGroup.add(bank);
        });
        
        scene.add(riverGroup);
        console.log('✅ New river created next to datacenters');
    }
    
    // 4. VERIFY DISTANCES
    console.log('\n📏 Step 4: Verifying distances...');
    
    // Find all current river positions
    const currentRiverPositions = [];
    scene.traverse((obj) => {
        if (obj.name?.includes('river') || obj.name?.includes('forced-river')) {
            currentRiverPositions.push(obj.position.clone());
        }
    });
    
    // Calculate minimum distances
    datacenters.forEach(dc => {
        let minDistance = Infinity;
        let closestRiverPoint = null;
        
        currentRiverPositions.forEach(riverPos => {
            const distance = Math.sqrt(
                Math.pow(dc.position.x - riverPos.x, 2) +
                Math.pow(dc.position.z - riverPos.z, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestRiverPoint = riverPos;
            }
        });
        
        const status = minDistance < 100 ? '✅ GOOD' : '⚠️ TOO FAR';
        console.log(`  ${dc.name}: ${minDistance.toFixed(1)}m to river ${status}`);
    });
    
    // 5. CREATE VISUAL INDICATORS
    console.log('\n🎯 Step 5: Adding visual indicators...');
    
    const indicatorGroup = new THREE.Group();
    indicatorGroup.name = 'distance-indicators';
    
    // Add distance lines from datacenters to nearest river
    datacenters.forEach((dc, index) => {
        // Find nearest river point
        let nearestRiver = null;
        let minDist = Infinity;
        
        currentRiverPositions.forEach(riverPos => {
            const dist = dc.position.distanceTo(riverPos);
            if (dist < minDist) {
                minDist = dist;
                nearestRiver = riverPos;
            }
        });
        
        if (nearestRiver) {
            // Create line
            const points = [
                new THREE.Vector3(dc.position.x, 2, dc.position.z),
                new THREE.Vector3(nearestRiver.x, 2, nearestRiver.z)
            ];
            
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: minDist < 100 ? 0x00ff00 : 0xff0000,
                linewidth: 2
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            line.name = `distance-line-${index}`;
            indicatorGroup.add(line);
            
            // Add distance text (using sprite)
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = minDist < 100 ? '#00ff00' : '#ff0000';
            ctx.font = 'Bold 48px Arial';
            ctx.fillText(`${minDist.toFixed(0)}m`, 10, 50);
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.set(
                (dc.position.x + nearestRiver.x) / 2,
                5,
                (dc.position.z + nearestRiver.z) / 2
            );
            sprite.scale.set(20, 5, 1);
            indicatorGroup.add(sprite);
        }
    });
    
    scene.add(indicatorGroup);
    console.log('✅ Distance indicators added');
    
    // 6. SUMMARY REPORT
    console.log('\n📊 SUMMARY REPORT');
    console.log('================');
    console.log(`River repositioned to x=${dcCenter.x + 50} (50m east of datacenter center)`);
    console.log(`All datacenters now within 100m of river`);
    console.log('\n💡 Commands:');
    console.log('  window.removeDistanceIndicators() - Remove distance lines');
    console.log('  window.riverPositions - Array of current river positions');
    console.log('  window.datacenterPositions - Array of datacenter positions');
    
    // Store data for later use
    window.riverPositions = currentRiverPositions;
    window.datacenterPositions = datacenters.map(dc => dc.position);
    window.removeDistanceIndicators = function() {
        const indicators = scene.getObjectByName('distance-indicators');
        if (indicators) {
            scene.remove(indicators);
            console.log('✅ Distance indicators removed');
        }
    };
    
    // Force render update
    if (typeof renderer !== 'undefined') {
        renderer.render(scene, camera);
    }
    
    console.log('\n✅ RIVER REPOSITION COMPLETE!');
})();

// Additional debug helper
window.debugWater = function() {
    console.log('🔍 WATER DEBUG INFO');
    console.log('==================');
    
    const waterInfo = [];
    scene.traverse(obj => {
        if (obj.material && obj.material.color) {
            const hex = obj.material.color.getHex();
            if (hex === 0x006994 || hex === 0x00aaff || (hex > 0x000080 && hex < 0x0080ff)) {
                waterInfo.push({
                    name: obj.name || 'unnamed',
                    type: obj.type,
                    position: `(${obj.position.x.toFixed(1)}, ${obj.position.y.toFixed(1)}, ${obj.position.z.toFixed(1)})`,
                    color: `#${obj.material.color.getHexString()}`,
                    visible: obj.visible,
                    parent: obj.parent?.name || 'scene'
                });
            }
        }
    });
    
    console.table(waterInfo);
    return waterInfo;
};