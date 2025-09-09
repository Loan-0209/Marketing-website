// ========================================
// PERMANENT FIX - VALIDATION SYSTEM
// Đảm bảo tất cả objects luôn ở trên đất liền
// ========================================

/**
 * PERMANENT FIX - Validation function
 * Force tất cả data center components ra khỏi vùng nước
 */
function ensureAllObjectsOnLand() {
    const WATER_BOUNDARY_X = 300; // Adjust theo layout của bạn
    const MIN_SAFE_DISTANCE = 20;
    
    if (!window.scene) {
        console.error('❌ Scene not available for validation');
        return { success: false, error: 'Scene not available' };
    }
    
    console.log('🛡️ === PERMANENT FIX VALIDATION ===');
    console.log(`⚠️ Water boundary: x < ${WATER_BOUNDARY_X}`);
    console.log(`✅ Safe zone: x >= ${WATER_BOUNDARY_X + MIN_SAFE_DISTANCE}`);
    
    let fixedCount = 0;
    const fixedObjects = [];
    
    scene.traverse((object) => {
        if (object.userData.type === 'datacenter' || 
            object.userData.type === 'data_center' ||
            object.userData.type?.includes('datacenter') ||
            object.name?.includes('transparent') ||
            object.name?.includes('data') ||
            object.name?.includes('DATA_CENTER') ||
            object.name === 'phần_trong_suốt') {
            
            const originalX = object.position.x;
            
            // Force position to safe land
            if (object.position.x < WATER_BOUNDARY_X + MIN_SAFE_DISTANCE) {
                object.position.x = WATER_BOUNDARY_X + MIN_SAFE_DISTANCE;
                object.updateMatrixWorld(true);
                
                fixedCount++;
                fixedObjects.push({
                    name: object.name || object.userData.type || 'unnamed',
                    originalPosition: { x: originalX, z: object.position.z },
                    newPosition: { x: object.position.x, z: object.position.z }
                });
                
                console.log(`🔧 Fixed ${object.name} position:`, object.position);
                console.log(`   Moved from x=${originalX} to x=${object.position.x}`);
            } else {
                console.log(`✅ ${object.name || 'Object'} already safe at x=${object.position.x}`);
            }
        }
    });
    
    // Force scene update
    if (window.scene) {
        window.scene.updateMatrixWorld(true);
    }
    
    // Force render
    if (window.renderer && window.camera) {
        window.renderer.render(window.scene, window.camera);
    }
    
    console.log(`\\n📊 PERMANENT FIX SUMMARY:`);
    console.log(`   Total objects fixed: ${fixedCount}`);
    console.log(`   Safe boundary: x >= ${WATER_BOUNDARY_X + MIN_SAFE_DISTANCE}`);
    
    return {
        success: true,
        fixedCount: fixedCount,
        fixedObjects: fixedObjects,
        safeBoundary: WATER_BOUNDARY_X + MIN_SAFE_DISTANCE
    };
}

/**
 * Enhanced permanent fix với multiple water boundaries
 */
function ensureAllObjectsOnLandEnhanced() {
    // Multiple water zones để check
    const WATER_ZONES = [
        { name: 'Main River', xMin: 160, xMax: 260, safeDistance: 20 },
        { name: 'West Water', xMin: -300, xMax: 0, safeDistance: 15 },
        { name: 'Fountains', centers: [
            { x: 0, z: 50, radius: 15 },
            { x: -100, z: -100, radius: 12 },
            { x: 100, z: 100, radius: 12 }
        ]}
    ];
    
    const SAFE_LAND_ZONE = {
        xMin: 320,
        xMax: 480,
        zMin: -200,
        zMax: 200
    };
    
    console.log('🛡️ === ENHANCED PERMANENT FIX VALIDATION ===');
    
    if (!window.scene) {
        console.error('❌ Scene not available');
        return { success: false };
    }
    
    let fixedCount = 0;
    const results = [];
    
    window.scene.traverse((object) => {
        // Check if object is data center related
        const isDataCenterComponent = (
            object.userData.type === 'datacenter' || 
            object.userData.type === 'data_center' ||
            object.userData.type?.includes('datacenter') ||
            object.name?.includes('transparent') ||
            object.name?.includes('data') ||
            object.name?.includes('DATA_CENTER') ||
            object.name === 'phần_trong_suốt' ||
            (object.material && object.material.transparent && object.position.x < 300)
        );
        
        if (isDataCenterComponent) {
            const originalPos = object.position.clone();
            let needsFix = false;
            let reason = '';
            
            // Check main river zone
            if (object.position.x >= WATER_ZONES[0].xMin && 
                object.position.x <= WATER_ZONES[0].xMax) {
                needsFix = true;
                reason = 'In main river zone';
            }
            
            // Check fountain zones
            for (const fountain of WATER_ZONES[2].centers) {
                const distance = Math.sqrt(
                    Math.pow(object.position.x - fountain.x, 2) + 
                    Math.pow(object.position.z - fountain.z, 2)
                );
                if (distance < fountain.radius + 10) {
                    needsFix = true;
                    reason = 'Too close to fountain';
                    break;
                }
            }
            
            if (needsFix) {
                // Calculate safe position in safe land zone
                const safeX = SAFE_LAND_ZONE.xMin + 20 + (fixedCount * 30);
                const safeZ = originalPos.z;
                
                // Ensure within safe zone bounds
                if (safeZ < SAFE_LAND_ZONE.zMin) {
                    object.position.z = SAFE_LAND_ZONE.zMin + 20;
                } else if (safeZ > SAFE_LAND_ZONE.zMax) {
                    object.position.z = SAFE_LAND_ZONE.zMax - 20;
                }
                
                object.position.x = safeX;
                object.updateMatrixWorld(true);
                
                fixedCount++;
                results.push({
                    object: object.name || 'unnamed',
                    reason: reason,
                    from: { x: originalPos.x.toFixed(1), z: originalPos.z.toFixed(1) },
                    to: { x: object.position.x.toFixed(1), z: object.position.z.toFixed(1) }
                });
                
                console.log(`🔧 FIXED: ${object.name || 'Object'}`);
                console.log(`   Reason: ${reason}`);
                console.log(`   From: (${originalPos.x.toFixed(1)}, ${originalPos.z.toFixed(1)})`);
                console.log(`   To: (${object.position.x.toFixed(1)}, ${object.position.z.toFixed(1)})`);
            }
        }
    });
    
    // Force multiple renders
    if (window.scene && window.renderer && window.camera) {
        window.scene.updateMatrixWorld(true);
        for (let i = 0; i < 5; i++) {
            window.renderer.render(window.scene, window.camera);
        }
    }
    
    console.log(`\\n🎯 ENHANCED PERMANENT FIX COMPLETE:`);
    console.log(`   Objects fixed: ${fixedCount}`);
    console.log(`   Safe zone: x=${SAFE_LAND_ZONE.xMin}-${SAFE_LAND_ZONE.xMax}`);
    
    return {
        success: true,
        fixedCount: fixedCount,
        results: results,
        safeZone: SAFE_LAND_ZONE
    };
}

/**
 * Continuous monitoring and auto-fix
 */
function startPermanentFixMonitoring() {
    console.log('👁️ Starting permanent fix monitoring...');
    
    // Initial fix
    ensureAllObjectsOnLandEnhanced();
    
    // Set up interval to check every 2 seconds
    const monitoringInterval = setInterval(() => {
        const result = ensureAllObjectsOnLand();
        if (result.fixedCount > 0) {
            console.log(`⚠️ Auto-fixed ${result.fixedCount} objects that moved into water zone`);
        }
    }, 2000);
    
    // Store interval ID for stopping if needed
    window.permanentFixMonitoringInterval = monitoringInterval;
    
    console.log('✅ Permanent fix monitoring active');
    console.log('   Checking every 2 seconds');
    console.log('   To stop: stopPermanentFixMonitoring()');
    
    return {
        success: true,
        intervalId: monitoringInterval
    };
}

/**
 * Stop monitoring
 */
function stopPermanentFixMonitoring() {
    if (window.permanentFixMonitoringInterval) {
        clearInterval(window.permanentFixMonitoringInterval);
        console.log('⏹️ Permanent fix monitoring stopped');
        return true;
    }
    return false;
}

/**
 * Immediate execution wrapper
 */
function executePermanentFix() {
    console.log('🚀 EXECUTING PERMANENT FIX VALIDATION...');
    
    // Run basic permanent fix
    const basicResult = ensureAllObjectsOnLand();
    
    // Run enhanced permanent fix
    const enhancedResult = ensureAllObjectsOnLandEnhanced();
    
    return {
        basic: basicResult,
        enhanced: enhancedResult,
        totalFixed: basicResult.fixedCount + enhancedResult.fixedCount
    };
}

// Export functions
window.ensureAllObjectsOnLand = ensureAllObjectsOnLand;
window.ensureAllObjectsOnLandEnhanced = ensureAllObjectsOnLandEnhanced;
window.startPermanentFixMonitoring = startPermanentFixMonitoring;
window.stopPermanentFixMonitoring = stopPermanentFixMonitoring;
window.executePermanentFix = executePermanentFix;

console.log('🛡️ PERMANENT FIX VALIDATION SYSTEM LOADED');
console.log('🛡️ AVAILABLE FUNCTIONS:');
console.log('   - ensureAllObjectsOnLand() - Basic permanent fix');
console.log('   - ensureAllObjectsOnLandEnhanced() - Enhanced fix with multiple zones');
console.log('   - startPermanentFixMonitoring() - Auto-fix every 2 seconds');
console.log('   - executePermanentFix() - Run all fixes immediately');
console.log('\\n⚠️ WATER BOUNDARY: x < 300');
console.log('✅ SAFE BOUNDARY: x >= 320');
console.log('\\n🚀 READY FOR PERMANENT FIX VALIDATION');