// DEBUG & FIX MARKERS VISIBILITY - 3D Smart City
// Copy and paste into browser console at http://localhost:8080/3d-smart-city.html

(function debugAndFixMarkers() {
    console.log('🔍 DEBUG MARKERS VISIBILITY v3.0');
    console.log('=================================\n');
    
    // 1. CHẨN ĐOÁN MARKERS HIỆN TẠI
    console.log('1️⃣ Diagnosing existing markers...');
    
    const existingMarkers = [];
    scene.traverse(obj => {
        if (obj.name && (obj.name.includes('marker') || obj.name.includes('datacenter'))) {
            existingMarkers.push({
                name: obj.name,
                type: obj.type,
                position: obj.position.clone(),
                visible: obj.visible,
                parent: obj.parent?.name || 'scene',
                material: obj.material ? {
                    color: obj.material.color ? `#${obj.material.color.getHexString()}` : 'none',
                    emissive: obj.material.emissive ? `#${obj.material.emissive.getHexString()}` : 'none',
                    opacity: obj.material.opacity || 1
                } : null
            });
        }
    });
    
    console.log(`Found ${existingMarkers.length} existing markers:`);
    existingMarkers.forEach(marker => {
        console.log(`  - ${marker.name}: visible=${marker.visible}, pos=(${marker.position.x.toFixed(1)}, ${marker.position.y.toFixed(1)}, ${marker.position.z.toFixed(1)})`);
    });
    
    // 2. XÓA TẤT CẢ MARKERS CŨ
    console.log('\n2️⃣ Removing all old markers...');
    
    const markersToRemove = [];
    scene.traverse(obj => {
        if (obj.name && (obj.name.includes('marker') || 
                        obj.name.includes('datacenter-') || 
                        obj.name.includes('river-') ||
                        obj.name.includes('cooling-') ||
                        obj.name.includes('debug-'))) {
            markersToRemove.push(obj);
        }
    });
    
    markersToRemove.forEach(marker => {
        scene.remove(marker);
        console.log(`  ✅ Removed: ${marker.name}`);
    });
    
    // 3. TẠO MARKERS LỚN VÀ SÁNG MỚI
    console.log('\n3️⃣ Creating large, bright markers...');
    
    const markersGroup = new THREE.Group();
    markersGroup.name = 'visibility-test-markers';
    
    // DATACENTER MARKER - RED SPHERE
    console.log('Creating datacenter marker...');
    const datacenterMarker = new THREE.Mesh(
        new THREE.SphereGeometry(50, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.8,
            transparent: false,
            opacity: 1.0
        })
    );
    datacenterMarker.position.set(-205, 100, -125);
    datacenterMarker.name = 'datacenter-marker-red';
    datacenterMarker.visible = true;
    markersGroup.add(datacenterMarker);
    
    // RIVER MARKER - GREEN SPHERE
    console.log('Creating river marker...');
    const riverMarker = new THREE.Mesh(
        new THREE.SphereGeometry(40, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.8,
            transparent: false,
            opacity: 1.0
        })
    );
    riverMarker.position.set(-145, 80, -125);
    riverMarker.name = 'river-marker-green';
    riverMarker.visible = true;
    markersGroup.add(riverMarker);
    
    // COOLING LAKE - BLUE RECTANGLE
    console.log('Creating cooling lake marker...');
    const coolingLake = new THREE.Mesh(
        new THREE.BoxGeometry(80, 10, 120),
        new THREE.MeshBasicMaterial({
            color: 0x0080ff,
            emissive: 0x0080ff,
            emissiveIntensity: 0.6,
            transparent: false,
            opacity: 1.0
        })
    );
    coolingLake.position.set(-175, 5, -125);
    coolingLake.name = 'cooling-lake-blue';
    coolingLake.visible = true;
    markersGroup.add(coolingLake);
    
    // GIANT REFERENCE MARKER AT ORIGIN
    console.log('Creating giant reference marker at origin...');
    const originMarker = new THREE.Mesh(
        new THREE.SphereGeometry(100, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1.0,
            transparent: false,
            opacity: 1.0
        })
    );
    originMarker.position.set(0, 200, 0);
    originMarker.name = 'origin-marker-yellow';
    originMarker.visible = true;
    markersGroup.add(originMarker);
    
    // Add markers to scene
    markersGroup.visible = true;
    scene.add(markersGroup);
    
    console.log('✅ All markers created and added to scene');
    
    // 4. CAMERA DIAGNOSTICS
    console.log('\n4️⃣ Camera diagnostics...');
    
    console.log('Camera type:', camera.type);
    console.log('Camera position:', camera.position);
    console.log('Camera rotation:', camera.rotation);
    if (camera.fov) console.log('Camera FOV:', camera.fov);
    if (camera.near) console.log('Camera near:', camera.near);
    if (camera.far) console.log('Camera far:', camera.far);
    
    // Check if camera can see markers
    const frustum = new THREE.Frustum();
    const cameraMatrix = new THREE.Matrix4();
    cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraMatrix);
    
    markersGroup.children.forEach(marker => {
        const inFrustum = frustum.containsPoint(marker.position);
        const distance = camera.position.distanceTo(marker.position);
        console.log(`${marker.name}: distance=${distance.toFixed(1)}m, in frustum=${inFrustum}`);
    });
    
    // 5. CAMERA CONTROL - TOP DOWN VIEW
    console.log('\n5️⃣ Setting camera for top-down view...');
    
    // Store original camera position
    window.originalCameraPos = camera.position.clone();
    window.originalCameraRot = camera.rotation.clone();
    
    // Move camera to top-down view
    camera.position.set(0, 300, 0);
    camera.lookAt(0, 0, 0);
    
    if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
    }
    
    console.log('📹 Camera moved to top-down view (0, 300, 0)');
    
    // 6. FORCE MULTIPLE RENDERS
    console.log('\n6️⃣ Force rendering...');
    
    for (let i = 0; i < 5; i++) {
        renderer.render(scene, camera);
    }
    
    console.log('✅ Multiple renders completed');
    
    // 7. TEST DIFFERENT CAMERA POSITIONS
    console.log('\n7️⃣ Testing camera positions...');
    
    const testPositions = [
        { pos: [0, 300, 0], target: [0, 0, 0], name: 'Top-down' },
        { pos: [-175, 200, 100], target: [-175, 0, -125], name: 'Markers area' },
        { pos: [200, 150, 200], target: [0, 0, 0], name: 'Diagonal view' },
        { pos: [-400, 100, -125], target: [-175, 0, -125], name: 'Side view' },
        { pos: [0, 100, 400], target: [0, 0, 0], name: 'Front view' }
    ];
    
    let testIndex = 0;
    
    function testCameraPosition() {
        if (testIndex < testPositions.length) {
            const test = testPositions[testIndex];
            
            camera.position.set(...test.pos);
            camera.lookAt(...test.target);
            
            if (controls) {
                controls.target.set(...test.target);
                controls.update();
            }
            
            renderer.render(scene, camera);
            
            console.log(`📹 ${test.name}: Camera at (${test.pos.join(', ')}) looking at (${test.target.join(', ')})`);
            
            // Check visibility from this position
            const cameraMatrix = new THREE.Matrix4();
            cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromProjectionMatrix(cameraMatrix);
            
            let visibleCount = 0;
            markersGroup.children.forEach(marker => {
                if (frustum.containsPoint(marker.position)) {
                    visibleCount++;
                }
            });
            
            console.log(`   Markers in view: ${visibleCount}/${markersGroup.children.length}`);
            
            testIndex++;
            setTimeout(testCameraPosition, 2000); // 2 seconds between tests
        } else {
            // Return to best view
            camera.position.set(-175, 200, 100);
            camera.lookAt(-175, 0, -125);
            if (controls) {
                controls.target.set(-175, 0, -125);
                controls.update();
            }
            renderer.render(scene, camera);
            console.log('🎯 Final position: Focused on markers area');
        }
    }
    
    // Start camera testing after 3 seconds
    setTimeout(testCameraPosition, 3000);
    
    // 8. LIGHTING DIAGNOSTICS
    console.log('\n8️⃣ Lighting diagnostics...');
    
    const lights = [];
    scene.traverse(obj => {
        if (obj.type.includes('Light')) {
            lights.push({
                type: obj.type,
                intensity: obj.intensity,
                color: obj.color ? `#${obj.color.getHexString()}` : 'none',
                position: obj.position.clone()
            });
        }
    });
    
    console.log(`Found ${lights.length} lights:`);
    lights.forEach((light, index) => {
        console.log(`  ${index + 1}. ${light.type}: intensity=${light.intensity}, color=${light.color}`);
    });
    
    // 9. SCENE TREE VERIFICATION
    console.log('\n9️⃣ Scene tree verification...');
    
    const findMarkers = (obj, depth = 0) => {
        const indent = '  '.repeat(depth);
        if (obj.name && obj.name.includes('marker')) {
            console.log(`${indent}✅ ${obj.name}: visible=${obj.visible}, pos=(${obj.position.x.toFixed(1)}, ${obj.position.y.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
        }
        
        obj.children.forEach(child => findMarkers(child, depth + 1));
    };
    
    findMarkers(scene);
    
    // 10. HELPER FUNCTIONS
    window.markerDebug = {
        toggleMarkers: function() {
            markersGroup.visible = !markersGroup.visible;
            renderer.render(scene, camera);
            console.log('Markers visibility:', markersGroup.visible);
        },
        
        makeMarkersHuge: function() {
            markersGroup.children.forEach(marker => {
                marker.scale.set(2, 2, 2);
                marker.material.emissiveIntensity = 1.0;
            });
            renderer.render(scene, camera);
            console.log('✅ Markers made huge');
        },
        
        moveMarkersToCamera: function() {
            const cameraPos = camera.position.clone();
            markersGroup.children.forEach((marker, index) => {
                marker.position.set(
                    cameraPos.x + index * 50,
                    cameraPos.y - 50,
                    cameraPos.z - 100
                );
            });
            renderer.render(scene, camera);
            console.log('✅ Markers moved in front of camera');
        },
        
        restoreCamera: function() {
            if (window.originalCameraPos) {
                camera.position.copy(window.originalCameraPos);
                camera.rotation.copy(window.originalCameraRot);
                if (controls) controls.update();
                renderer.render(scene, camera);
                console.log('✅ Camera restored');
            }
        },
        
        logStats: function() {
            console.log('MARKERS STATS:');
            console.log('=============');
            console.log('Total markers:', markersGroup.children.length);
            console.log('Group visible:', markersGroup.visible);
            console.log('Camera position:', camera.position);
            console.log('Camera looking at:', controls ? controls.target : 'unknown');
            
            markersGroup.children.forEach(marker => {
                const distance = camera.position.distanceTo(marker.position);
                console.log(`${marker.name}: ${distance.toFixed(1)}m, visible=${marker.visible}`);
            });
        }
    };
    
    // 11. FINAL SUMMARY
    console.log('\n📊 FINAL SUMMARY');
    console.log('================');
    console.log('✅ Created 4 large, bright markers');
    console.log('✅ Red sphere (datacenter): (-205, 100, -125)');
    console.log('✅ Green sphere (river): (-145, 80, -125)');
    console.log('✅ Blue box (cooling lake): (-175, 5, -125)');
    console.log('✅ Yellow sphere (origin): (0, 200, 0)');
    console.log('');
    console.log('💡 TROUBLESHOOTING COMMANDS:');
    console.log('window.markerDebug.toggleMarkers() - Toggle visibility');
    console.log('window.markerDebug.makeMarkersHuge() - Make markers 2x larger');
    console.log('window.markerDebug.moveMarkersToCamera() - Move markers to camera');
    console.log('window.markerDebug.logStats() - Log detailed stats');
    console.log('window.markerDebug.restoreCamera() - Restore original camera');
    console.log('');
    
    // Auto-check after setup
    setTimeout(() => {
        console.log('\n🔍 AUTO-CHECK AFTER 10 SECONDS:');
        window.markerDebug.logStats();
        
        if (markersGroup.children.length === 0) {
            console.log('❌ ERROR: No markers found in group!');
        } else {
            console.log('✅ Markers exist in scene');
            
            // Check if any marker is visible to camera
            const frustum = new THREE.Frustum();
            const cameraMatrix = new THREE.Matrix4();
            cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromProjectionMatrix(cameraMatrix);
            
            let visibleCount = 0;
            markersGroup.children.forEach(marker => {
                if (frustum.containsPoint(marker.position)) {
                    visibleCount++;
                }
            });
            
            if (visibleCount === 0) {
                console.log('⚠️ WARNING: No markers in camera view - try window.markerDebug.moveMarkersToCamera()');
            } else {
                console.log(`✅ ${visibleCount} markers should be visible`);
            }
        }
    }, 10000);
    
    console.log('\n🎯 Watch for camera position tests starting in 3 seconds...');
    console.log('🎯 Auto-check will run in 10 seconds...');
})();