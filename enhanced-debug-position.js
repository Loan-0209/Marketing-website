// ENHANCED DEBUG - Find why positions don't change
// Copy and paste into browser console at http://localhost:8080/3d-smart-city.html

(function enhancedDebugPosition() {
    console.log('🔍 ENHANCED POSITION DEBUG v2.0');
    console.log('=================================\n');
    
    // 1. CHECK SCENE & ANIMATION STATE
    console.log('1️⃣ Checking scene state...');
    console.log('Scene exists:', typeof scene !== 'undefined');
    console.log('THREE exists:', typeof THREE !== 'undefined');
    console.log('Renderer exists:', typeof renderer !== 'undefined');
    console.log('Camera exists:', typeof camera !== 'undefined');
    console.log('Controls exist:', typeof controls !== 'undefined');
    
    // 2. CHECK IF ANIMATION IS OVERRIDING POSITIONS
    console.log('\n2️⃣ Checking animation loop...');
    
    // Store original animate function
    if (typeof animate !== 'undefined') {
        const animateStr = animate.toString();
        console.log('Animate function length:', animateStr.length);
        
        // Check for position-related code in animation
        const hasPositionCode = animateStr.includes('position.x') || 
                               animateStr.includes('position.set') ||
                               animateStr.includes('position =');
        console.log('Animation modifies positions:', hasPositionCode);
        
        // Check for river-specific animations
        const hasRiverCode = animateStr.includes('river');
        console.log('Animation has river code:', hasRiverCode);
    }
    
    // 3. FIND ALL RIVER OBJECTS WITH DETAILED INFO
    console.log('\n3️⃣ Finding all river objects...');
    
    const riverObjects = [];
    const waterMaterials = new Set();
    
    scene.traverse((obj) => {
        // Check for river in name
        if (obj.name && obj.name.toLowerCase().includes('river')) {
            riverObjects.push({
                object: obj,
                name: obj.name,
                type: obj.type,
                position: obj.position.clone(),
                worldPosition: obj.getWorldPosition(new THREE.Vector3()),
                parent: obj.parent?.name || 'scene',
                visible: obj.visible,
                matrixAutoUpdate: obj.matrixAutoUpdate,
                userData: obj.userData
            });
        }
        
        // Collect water materials
        if (obj.material && obj.material.color) {
            const hex = obj.material.color.getHex();
            if (hex === 0x006994 || hex === 0x00aaff || (hex >= 0x000080 && hex <= 0x0080ff)) {
                waterMaterials.add(hex);
            }
        }
    });
    
    console.log(`Found ${riverObjects.length} river objects`);
    console.log('Water material colors:', Array.from(waterMaterials).map(h => '#' + h.toString(16).padStart(6, '0')));
    
    // 4. TEST POSITION MODIFICATION METHODS
    console.log('\n4️⃣ Testing position modification...');
    
    if (riverObjects.length > 0) {
        const testObj = riverObjects[0].object;
        console.log(`\nTesting on: ${testObj.name}`);
        
        // Save original state
        const originalX = testObj.position.x;
        const originalWorldPos = testObj.getWorldPosition(new THREE.Vector3());
        
        console.log('Original position:', testObj.position);
        console.log('Original world position:', originalWorldPos);
        
        // Method 1: Direct modification
        testObj.position.x = -100;
        console.log('\nAfter position.x = -100:');
        console.log('Local position:', testObj.position);
        console.log('World position:', testObj.getWorldPosition(new THREE.Vector3()));
        
        // Method 2: Force matrix update
        testObj.updateMatrix();
        testObj.updateMatrixWorld(true);
        console.log('\nAfter matrix update:');
        console.log('Local position:', testObj.position);
        console.log('World position:', testObj.getWorldPosition(new THREE.Vector3()));
        
        // Check if change persisted
        const newWorldPos = testObj.getWorldPosition(new THREE.Vector3());
        const didChange = Math.abs(newWorldPos.x - originalWorldPos.x) > 0.1;
        console.log('\n✅ Position changed:', didChange);
        
        // Restore original position
        testObj.position.x = originalX;
    }
    
    // 5. CHECK FOR POSITION CONSTRAINTS
    console.log('\n5️⃣ Checking for position constraints...');
    
    // Look for physics or constraint systems
    const hasPhysics = typeof CANNON !== 'undefined' || typeof Ammo !== 'undefined';
    console.log('Physics engine detected:', hasPhysics);
    
    // Check for custom constraints in userData
    riverObjects.forEach(ro => {
        if (ro.userData && Object.keys(ro.userData).length > 0) {
            console.log(`${ro.name} userData:`, ro.userData);
        }
    });
    
    // 6. MONITOR POSITION CHANGES IN REAL-TIME
    console.log('\n6️⃣ Setting up position monitor...');
    
    window.positionMonitor = {
        targets: [],
        interval: null,
        
        start: function() {
            // Clear existing monitor
            if (this.interval) clearInterval(this.interval);
            
            // Find river objects to monitor
            this.targets = [];
            scene.traverse(obj => {
                if (obj.name && obj.name.includes('river-segment')) {
                    this.targets.push({
                        object: obj,
                        lastX: obj.position.x,
                        changeCount: 0
                    });
                }
            });
            
            console.log(`Monitoring ${this.targets.length} objects...`);
            
            // Monitor every 100ms
            this.interval = setInterval(() => {
                this.targets.forEach(target => {
                    if (Math.abs(target.object.position.x - target.lastX) > 0.01) {
                        target.changeCount++;
                        console.log(`⚠️ ${target.object.name} moved: ${target.lastX.toFixed(2)} → ${target.object.position.x.toFixed(2)}`);
                        target.lastX = target.object.position.x;
                    }
                });
            }, 100);
            
            console.log('Monitor started. Run window.positionMonitor.stop() to stop.');
        },
        
        stop: function() {
            if (this.interval) {
                clearInterval(this.interval);
                console.log('Monitor stopped.');
                
                // Report findings
                console.log('\nMonitor summary:');
                this.targets.forEach(target => {
                    console.log(`${target.object.name}: ${target.changeCount} position changes detected`);
                });
            }
        }
    };
    
    // 7. CREATE TEST RIVER WITH FORCED POSITION
    console.log('\n7️⃣ Creating test river with forced position...');
    
    // Remove any existing test rivers
    const existingTest = scene.getObjectByName('debug-test-river');
    if (existingTest) scene.remove(existingTest);
    
    const testRiver = new THREE.Group();
    testRiver.name = 'debug-test-river';
    
    // Create highly visible test segments
    for (let i = 0; i < 5; i++) {
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(20, 3, 20),
            new THREE.MeshBasicMaterial({ 
                color: 0xff00ff, // Magenta for visibility
                emissive: 0xff00ff,
                emissiveIntensity: 0.5
            })
        );
        
        segment.position.set(-150, 2, -100 + i * 25);
        segment.name = `test-river-segment-${i}`;
        testRiver.add(segment);
    }
    
    scene.add(testRiver);
    console.log('✅ Test river created at x=-150 (magenta color)');
    
    // 8. DISABLE POTENTIAL ANIMATION OVERRIDES
    console.log('\n8️⃣ Creating animation override...');
    
    // Store original animate
    window.originalAnimate = window.animate;
    
    // Create override that preserves river positions
    window.animateWithRiverLock = function() {
        // Save river positions
        const riverPositions = new Map();
        scene.traverse(obj => {
            if (obj.name && (obj.name.includes('river') || obj.name.includes('test-river'))) {
                riverPositions.set(obj, obj.position.clone());
            }
        });
        
        // Call original animate
        if (window.originalAnimate) {
            window.originalAnimate();
        }
        
        // Restore river positions
        riverPositions.forEach((pos, obj) => {
            obj.position.copy(pos);
        });
    };
    
    console.log('Created window.animateWithRiverLock()');
    console.log('To use: window.animate = window.animateWithRiverLock');
    
    // 9. DIRECT MANIPULATION FUNCTIONS
    console.log('\n9️⃣ Creating direct manipulation functions...');
    
    window.riverControl = {
        moveAllRivers: function(x) {
            let count = 0;
            scene.traverse(obj => {
                if (obj.name && obj.name.includes('river')) {
                    obj.position.x = x;
                    obj.updateMatrixWorld(true);
                    count++;
                }
            });
            console.log(`Moved ${count} river objects to x=${x}`);
            return count;
        },
        
        lockRiverPositions: function() {
            window.animate = window.animateWithRiverLock;
            console.log('✅ River positions locked');
        },
        
        unlockRiverPositions: function() {
            window.animate = window.originalAnimate;
            console.log('✅ River positions unlocked');
        },
        
        findAndMoveRiver: function(targetX) {
            const rivers = [];
            scene.traverse(obj => {
                if (obj.name && obj.name.includes('river-segment')) {
                    rivers.push(obj);
                }
            });
            
            if (rivers.length === 0) {
                console.log('❌ No river segments found');
                return;
            }
            
            rivers.forEach(river => {
                const oldX = river.position.x;
                river.position.x = targetX;
                river.updateMatrixWorld(true);
                console.log(`${river.name}: ${oldX} → ${targetX}`);
            });
            
            // Force render
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        }
    };
    
    // 10. DIAGNOSTIC SUMMARY
    console.log('\n📊 DIAGNOSTIC SUMMARY');
    console.log('===================');
    console.log(`River objects found: ${riverObjects.length}`);
    console.log(`Animation modifies positions: ${typeof animate !== 'undefined' && animate.toString().includes('position')}`);
    console.log(`Test river visible: Check for magenta blocks at x=-150`);
    
    console.log('\n💡 SOLUTIONS TO TRY:');
    console.log('1. window.riverControl.moveAllRivers(-100)  // Move all rivers');
    console.log('2. window.riverControl.lockRiverPositions()  // Prevent animation override');
    console.log('3. window.positionMonitor.start()  // Monitor position changes');
    console.log('4. window.riverControl.findAndMoveRiver(-150)  // Direct river move');
    
    console.log('\n🔍 LIKELY ISSUES:');
    if (riverObjects.length === 0) {
        console.log('❌ No river objects found - check naming convention');
    }
    if (typeof animate !== 'undefined' && animate.toString().includes('position')) {
        console.log('⚠️ Animation function modifies positions - use lockRiverPositions()');
    }
    
    // Store debug data
    window.debugData = {
        riverObjects: riverObjects,
        testRiver: testRiver,
        waterMaterials: Array.from(waterMaterials)
    };
    
    console.log('\n✅ Debug complete. Data saved to window.debugData');
})();