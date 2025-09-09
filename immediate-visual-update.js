// ========================================
// IMMEDIATE VISUAL UPDATE - FORCE SCENE REFRESH
// ========================================

/**
 * EXECUTE IMMEDIATE VISUAL UPDATE AND SCENE REFRESH
 * Forces all pending position changes to be applied and re-rendered
 */

function executeImmediateVisualUpdate() {
    console.log('🚨 EXECUTING IMMEDIATE VISUAL UPDATE - FORCE SCENE REFRESH');
    
    if (!window.scene || !window.camera || !window.renderer) {
        console.error('❌ Required scene components not available');
        return { success: false, error: 'Missing scene components' };
    }
    
    const updateResults = {
        success: false,
        updatedObjects: [],
        rendersExecuted: 0,
        cacheCleared: false
    };
    
    // STEP 1: APPLY ALL PENDING POSITION CHANGES
    console.log('🔄 STEP 1: APPLYING ALL PENDING POSITION CHANGES...');
    
    // Force update transparent section to specific coordinates
    const transparentSection = window.scene.getObjectByName('phần_trong_suốt');
    if (transparentSection) {
        console.log('🎯 Updating transparent section position...');
        transparentSection.position.set(350.0, 0.0, 45.0);
        transparentSection.updateMatrixWorld(true);
        updateResults.updatedObjects.push('phần_trong_suốt');
        console.log('   ✅ Transparent section moved to (350.0, 0.0, 45.0)');
    }
    
    // Search for other transparent sections
    let transparentCount = 0;
    window.scene.traverse(child => {
        if (child.material && (child.material.transparent || (child.material.opacity && child.material.opacity < 1.0))) {
            // Check if in problematic water area
            if (child.position.x > 160 && child.position.x < 260) {
                const newX = 350.0 + (transparentCount * 20);
                const newZ = 45.0 + (transparentCount * 15);
                console.log(`🎯 Moving transparent object ${child.name || 'unnamed'} from (${child.position.x.toFixed(1)}, ${child.position.z.toFixed(1)}) to (${newX}, ${newZ})`);
                child.position.set(newX, child.position.y, newZ);
                child.updateMatrixWorld(true);
                updateResults.updatedObjects.push(child.name || `transparent_${transparentCount}`);
                transparentCount++;
            }
        }
    });
    
    // STEP 2: FORCE RE-RENDER DATA CENTERS AT NEW COORDINATES
    console.log('🔄 STEP 2: FORCE RE-RENDER DATA CENTERS...');
    
    const dataCenterPositions = [
        { name: 'DATA_CENTER_01', x: 400.0, y: 0.0, z: 0.0 },
        { name: 'DATA_CENTER_02', x: 420.0, y: 0.0, z: 60.0 },
        { name: 'DATA_CENTER_03', x: 450.0, y: 0.0, z: 70.0 }
    ];
    
    dataCenterPositions.forEach(dcPos => {
        const dataCenter = window.scene.getObjectByName(dcPos.name);
        if (dataCenter) {
            console.log(`🏭 Repositioning ${dcPos.name} to (${dcPos.x}, ${dcPos.z})`);
            dataCenter.position.set(dcPos.x, dcPos.y, dcPos.z);
            dataCenter.updateMatrixWorld(true);
            updateResults.updatedObjects.push(dcPos.name);
        } else {
            // Search by traversal if name not found
            window.scene.traverse(child => {
                if (child.userData && child.userData.type && child.userData.type.includes('DATA_CENTER')) {
                    if (!updateResults.updatedObjects.includes(child.name || 'unnamed_dc')) {
                        console.log(`🏭 Found data center component: ${child.name || 'unnamed'}`);
                        // Move to safe area if in water zone
                        if (child.position.x > 160 && child.position.x < 260) {
                            child.position.set(dcPos.x, dcPos.y, dcPos.z);
                            child.updateMatrixWorld(true);
                            updateResults.updatedObjects.push(child.name || 'unnamed_dc');
                        }
                    }
                }
            });
        }
    });
    
    // STEP 3: CLEAR CACHE AND RE-DISPLAY SCENE
    console.log('🔄 STEP 3: CLEARING CACHE AND RE-DISPLAYING SCENE...');
    
    // Force update all matrices in scene
    window.scene.updateMatrixWorld(true);
    
    // Clear renderer cache
    if (window.renderer.info) {
        window.renderer.info.reset();
    }
    
    // Clear geometry and material caches
    if (window.renderer.geometries) {
        window.renderer.geometries.dispose();
    }
    if (window.renderer.textures) {
        window.renderer.textures.dispose();
    }
    
    updateResults.cacheCleared = true;
    
    // STEP 4: FORCE MULTIPLE RE-RENDERS
    console.log('🔄 STEP 4: EXECUTING MULTIPLE FORCE RE-RENDERS...');
    
    // Execute multiple renders to ensure visual update
    for (let i = 0; i < 10; i++) {
        window.scene.updateMatrixWorld(true);
        window.renderer.render(window.scene, window.camera);
        updateResults.rendersExecuted++;
    }
    
    // STEP 5: VALIDATE VISUAL MATCHES COORDINATE DATA
    console.log('🔄 STEP 5: VALIDATING VISUAL-COORDINATE SYNC...');
    
    const validation = {
        transparentSectionPosition: null,
        dataCenterPositions: [],
        allOnLand: true
    };
    
    // Validate transparent section
    const finalTransparentSection = window.scene.getObjectByName('phần_trong_suốt');
    if (finalTransparentSection) {
        validation.transparentSectionPosition = {
            x: finalTransparentSection.position.x,
            y: finalTransparentSection.position.y, 
            z: finalTransparentSection.position.z
        };
        console.log(`✅ Transparent section final position: (${finalTransparentSection.position.x}, ${finalTransparentSection.position.z})`);
    }
    
    // Validate data centers
    window.scene.traverse(child => {
        if (child.userData && child.userData.type && child.userData.type.includes('DATA_CENTER')) {
            const pos = {
                name: child.name || 'unnamed',
                x: child.position.x,
                z: child.position.z,
                inWater: child.position.x > 160 && child.position.x < 260
            };
            validation.dataCenterPositions.push(pos);
            
            if (pos.inWater) {
                validation.allOnLand = false;
                console.warn(`⚠️ ${pos.name} still in water zone at (${pos.x.toFixed(1)}, ${pos.z.toFixed(1)})`);
            } else {
                console.log(`✅ ${pos.name} safely positioned at (${pos.x.toFixed(1)}, ${pos.z.toFixed(1)})`);
            }
        }
    });
    
    // STEP 6: FINAL RESULTS
    updateResults.success = validation.allOnLand;
    updateResults.validation = validation;
    
    console.log('\n🎉 IMMEDIATE VISUAL UPDATE COMPLETE!');
    console.log(`✅ Objects updated: ${updateResults.updatedObjects.length}`);
    console.log(`✅ Renders executed: ${updateResults.rendersExecuted}`);
    console.log(`✅ Cache cleared: ${updateResults.cacheCleared}`);
    console.log(`✅ All objects on land: ${validation.allOnLand}`);
    
    if (validation.transparentSectionPosition) {
        console.log(`✅ Transparent section at: (${validation.transparentSectionPosition.x}, ${validation.transparentSectionPosition.z})`);
    }
    
    return updateResults;
}

/**
 * EMERGENCY VISUAL SYNC - Maximum force refresh
 */
function emergencyVisualSync() {
    console.log('🚨 EMERGENCY VISUAL SYNC - MAXIMUM FORCE REFRESH');
    
    // Execute immediate visual update
    const result = executeImmediateVisualUpdate();
    
    // Additional force measures
    if (window.controls) {
        window.controls.update();
    }
    
    // Force camera update
    window.camera.updateProjectionMatrix();
    
    // Additional renders with different settings
    for (let i = 0; i < 5; i++) {
        if (window.renderer.shadowMap) {
            window.renderer.shadowMap.needsUpdate = true;
        }
        window.renderer.render(window.scene, window.camera);
    }
    
    console.log('🎉 EMERGENCY VISUAL SYNC COMPLETE!');
    return result;
}

/**
 * VISUAL SYNC WITH PAGE REFRESH OPTION
 */
function visualSyncWithRefresh() {
    console.log('🔄 VISUAL SYNC WITH PAGE REFRESH OPTION');
    
    const result = executeImmediateVisualUpdate();
    
    if (result.success) {
        console.log('✅ Visual sync successful - changes should be visible');
    } else {
        console.log('⚠️ Visual sync had issues - executing page refresh in 2 seconds...');
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
    
    return result;
}

// Export functions for immediate use
window.executeImmediateVisualUpdate = executeImmediateVisualUpdate;
window.emergencyVisualSync = emergencyVisualSync;
window.visualSyncWithRefresh = visualSyncWithRefresh;

console.log('🚨 IMMEDIATE VISUAL UPDATE SYSTEM LOADED');
console.log('🚨 VISUAL SYNC FUNCTIONS AVAILABLE:');
console.log('   - executeImmediateVisualUpdate() - Standard immediate visual update');
console.log('   - emergencyVisualSync() - Maximum force visual refresh');
console.log('   - visualSyncWithRefresh() - Visual sync with page refresh option');
console.log('\n⚡ READY FOR IMMEDIATE VISUAL UPDATE AND SCENE REFRESH');