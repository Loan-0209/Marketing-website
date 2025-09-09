// DEBUG SCRIPT - Tại sao vị trí không thay đổi
// Run in console at http://localhost:8080/3d-smart-city.html

(function debugPositionIssue() {
    console.log('🔍 DEBUG: POSITION CHANGE ISSUES');
    console.log('================================\n');
    
    // 1. CHECK SCENE EXISTS
    console.log('1️⃣ Checking scene existence...');
    if (typeof scene === 'undefined') {
        console.error('❌ SCENE NOT FOUND! Wait for page to load.');
        return;
    }
    console.log('✅ Scene exists:', scene);
    console.log('   Total children:', scene.children.length);
    
    // 2. CHECK RENDERER & ANIMATION
    console.log('\n2️⃣ Checking renderer & animation...');
    console.log('Renderer exists:', typeof renderer !== 'undefined');
    console.log('Camera exists:', typeof camera !== 'undefined');
    console.log('Animate function:', typeof animate !== 'undefined');
    
    // 3. FIND ALL RIVER-RELATED OBJECTS
    console.log('\n3️⃣ Finding river objects...');
    const riverObjects = [];
    const allWaterObjects = [];
    
    scene.traverse((obj) => {
        // Check for river in name
        if (obj.name && obj.name.toLowerCase().includes('river')) {
            riverObjects.push({
                object: obj,
                name: obj.name,
                position: obj.position.clone(),
                parent: obj.parent?.name || 'scene',
                visible: obj.visible,
                matrixAutoUpdate: obj.matrixAutoUpdate
            });
        }
        
        // Check for water-colored materials
        if (obj.material && obj.material.color) {
            const color = obj.material.color.getHex();
            if (color === 0x006994 || color === 0x00aaff || (color >= 0x000080 && color <= 0x0080ff)) {
                allWaterObjects.push({
                    object: obj,
                    name: obj.name || 'unnamed',
                    color: `#${obj.material.color.getHexString()}`,
                    position: obj.position.clone()
                });
            }
        }
    });
    
    console.log(`Found ${riverObjects.length} river objects`);
    console.log(`Found ${allWaterObjects.length} water-colored objects`);
    
    // 4. TEST POSITION CHANGES
    console.log('\n4️⃣ Testing position changes...');
    
    if (riverObjects.length > 0) {
        const testObj = riverObjects[0].object;
        const oldPos = testObj.position.clone();
        console.log(`Testing object: ${testObj.name}`);
        console.log(`Original position: (${oldPos.x}, ${oldPos.y}, ${oldPos.z})`);
        
        // Method 1: Direct position change
        testObj.position.x = -100;
        console.log(`After position.x = -100: (${testObj.position.x}, ${testObj.position.y}, ${testObj.position.z})`);
        
        // Method 2: Using set()
        testObj.position.set(-150, oldPos.y, oldPos.z);
        console.log(`After position.set(): (${testObj.position.x}, ${testObj.position.y}, ${testObj.position.z})`);
        
        // Method 3: Update matrix
        testObj.updateMatrix();
        testObj.updateMatrixWorld(true);
        console.log(`After matrix update: (${testObj.position.x}, ${testObj.position.y}, ${testObj.position.z})`);
        
        // Check if position actually changed
        if (testObj.position.x === -150) {
            console.log('✅ Position change successful!');
        } else {
            console.log('❌ Position did not change!');
        }
    }
    
    // 5. CHECK FOR ANIMATION OVERRIDES
    console.log('\n5️⃣ Checking for animation overrides...');
    
    // Look for animation functions that might reset positions
    const animateFunctionStr = animate.toString();
    const hasRiverAnimation = animateFunctionStr.includes('river');
    console.log('Animation contains river code:', hasRiverAnimation);
    
    // 6. CHECK PARENT TRANSFORMS
    console.log('\n6️⃣ Checking parent transforms...');
    
    riverObjects.forEach(ro => {
        let parent = ro.object.parent;
        let depth = 0;
        console.log(`\n${ro.name} parent chain:`);
        
        while (parent && parent !== scene && depth < 5) {
            console.log(`  Level ${depth}: ${parent.name || 'unnamed'} at (${parent.position.x}, ${parent.position.z})`);
            parent = parent.parent;
            depth++;
        }
    });
    
    // 7. FORCE CREATE NEW RIVER (GUARANTEED METHOD)
    console.log('\n7️⃣ Force creating new river (guaranteed method)...');
    
    // Remove old river objects to avoid confusion
    const toRemove = [];
    scene.traverse(obj => {
        if (obj.name && obj.name.includes('debug-river')) {
            toRemove.push(obj);
        }
    });
    toRemove.forEach(obj => scene.remove(obj));
    
    // Create new river with unique name
    const debugRiver = new THREE.Group();
    debugRiver.name = 'debug-river-group';
    
    // River segments
    for (let i = 0; i < 8; i++) {
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(30, 2, 30),
            new THREE.MeshPhongMaterial({ 
                color: 0x00ffff, // Cyan for visibility
                emissive: 0x004444,
                emissiveIntensity: 0.3
            })
        );
        
        segment.position.set(-150, 1, -150 + i * 35);
        segment.name = `debug-river-segment-${i}`;
        segment.castShadow = true;
        segment.receiveShadow = true;
        debugRiver.add(segment);
    }
    
    // Add to scene at root level
    scene.add(debugRiver);
    console.log('✅ Debug river created at x=-150');
    
    // 8. FIND AND LOG DATACENTER POSITIONS
    console.log('\n8️⃣ Finding datacenters...');
    
    const datacenters = [];
    scene.traverse(obj => {
        if (obj.userData?.buildingType?.includes('datacenter')) {
            datacenters.push({
                name: obj.userData.buildingType,
                position: obj.position.clone()
            });
            console.log(`DC: ${obj.userData.buildingType} at (${obj.position.x}, ${obj.position.z})`);
        }
    });
    
    // 9. MANUAL RIVER POSITIONING FUNCTION
    window.moveRiverTo = function(x) {
        let moved = 0;
        scene.traverse(obj => {
            if (obj.name && (obj.name.includes('river-segment') || obj.name.includes('debug-river'))) {
                const oldX = obj.position.x;
                obj.position.x = x;
                obj.updateMatrix();
                obj.updateMatrixWorld(true);
                console.log(`Moved ${obj.name}: ${oldX} → ${x}`);
                moved++;
            }
        });
        
        // Force render update
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
        
        console.log(`✅ Moved ${moved} river objects to x=${x}`);
        return moved;
    };
    
    // 10. VISIBILITY CHECK
    console.log('\n🔟 Checking visibility...');
    
    allWaterObjects.forEach(wo => {
        const obj = wo.object;
        let visible = obj.visible;
        let parent = obj.parent;
        
        // Check parent visibility chain
        while (parent && parent !== scene) {
            visible = visible && parent.visible;
            parent = parent.parent;
        }
        
        console.log(`${wo.name}: visible=${visible}, rendered=${obj.visible}`);
    });
    
    // SUMMARY & SOLUTIONS
    console.log('\n📊 SUMMARY & SOLUTIONS');
    console.log('=====================');
    console.log(`Rivers found: ${riverObjects.length}`);
    console.log(`Water objects found: ${allWaterObjects.length}`);
    console.log(`Datacenters found: ${datacenters.length}`);
    
    console.log('\n💡 TRY THESE COMMANDS:');
    console.log('1. window.moveRiverTo(-150)  // Move river to x=-150');
    console.log('2. scene.getObjectByName("debug-river-group").position.x = -100');
    console.log('3. renderer.render(scene, camera)  // Force re-render');
    
    console.log('\n🔧 POSSIBLE ISSUES:');
    if (riverObjects.length === 0) {
        console.log('❌ No river objects found - they might be named differently');
    }
    if (hasRiverAnimation) {
        console.log('⚠️ Animation function contains river code - positions might be reset each frame');
    }
    
    // Store debug data
    window.debugData = {
        riverObjects: riverObjects,
        waterObjects: allWaterObjects,
        datacenters: datacenters
    };
    
    console.log('\n📌 Debug data saved to window.debugData');
})();

// Additional helper to force update all positions
window.forceUpdatePositions = function() {
    scene.traverse(obj => {
        if (obj.position) {
            obj.updateMatrix();
            obj.updateMatrixWorld(true);
        }
    });
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
    
    console.log('✅ Force updated all positions and rendered');
};