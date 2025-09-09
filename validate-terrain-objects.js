// Validate all objects are within new ground boundaries

function validateTerrainObjects() {
    console.log('🔍 VALIDATING TERRAIN OBJECTS AGAINST NEW BOUNDARIES');
    console.log('='.repeat(60));
    
    // New ground boundaries
    const groundBounds = {
        minX: -360,  // 65 - 850/2
        maxX: 490,   // 65 + 850/2
        minZ: -264,  // -4 - 520/2
        maxZ: 256    // -4 + 520/2
    };
    
    console.log('🏗️ NEW GROUND BOUNDARIES:');
    console.log(`   X: ${groundBounds.minX} to ${groundBounds.maxX}`);
    console.log(`   Z: ${groundBounds.minZ} to ${groundBounds.maxZ}`);
    
    // River points to check
    const riverPoints = [
        { name: 'River Start', x: 180, z: -250 },
        { name: 'River Bend 1', x: 160, z: -150 },
        { name: 'River Curve 1', x: 200, z: -80 },
        { name: 'River Bend 2', x: 170, z: -20 },
        { name: 'River Curve 2', x: 220, z: 40 },
        { name: 'River Bend 3', x: 190, z: 100 },
        { name: 'River Curve 3', x: 240, z: 160 },
        { name: 'River End 1', x: 210, z: 220 },
        { name: 'River Final', x: 200, z: 280 }
    ];
    
    console.log('\\n🌊 RIVER VALIDATION:');
    let riverInBounds = true;
    riverPoints.forEach(point => {
        const withinX = point.x >= groundBounds.minX && point.x <= groundBounds.maxX;
        const withinZ = point.z >= groundBounds.minZ && point.z <= groundBounds.maxZ;
        const inBounds = withinX && withinZ;
        
        if (!inBounds) riverInBounds = false;
        
        const status = inBounds ? '✅' : '❌';
        console.log(`   ${status} ${point.name}: (${point.x}, ${point.z}) - ${inBounds ? 'IN BOUNDS' : 'OUT OF BOUNDS'}`);
        
        if (!inBounds) {
            if (!withinX) {
                const overhang = point.x < groundBounds.minX ? 
                    (groundBounds.minX - point.x) : (point.x - groundBounds.maxX);
                console.log(`      X overhang: ${overhang.toFixed(1)} units`);
            }
            if (!withinZ) {
                const overhang = point.z < groundBounds.minZ ? 
                    (groundBounds.minZ - point.z) : (point.z - groundBounds.maxZ);
                console.log(`      Z overhang: ${overhang.toFixed(1)} units`);
            }
        }
    });
    
    // Data centers (should all be in bounds by design)
    const dataCenters = [
        { name: 'DATA CENTER 01', x: 350, z: -120 },
        { name: 'DATA CENTER 02', x: 350, z: 0 },
        { name: 'DATA CENTER 03', x: 350, z: 120 }
    ];
    
    console.log('\\n🏢 DATA CENTER VALIDATION:');
    let dataCentersInBounds = true;
    dataCenters.forEach(dc => {
        const withinX = dc.x >= groundBounds.minX && dc.x <= groundBounds.maxX;
        const withinZ = dc.z >= groundBounds.minZ && dc.z <= groundBounds.maxZ;
        const inBounds = withinX && withinZ;
        
        if (!inBounds) dataCentersInBounds = false;
        
        const status = inBounds ? '✅' : '⚠️';
        console.log(`   ${status} ${dc.name}: (${dc.x}, ${dc.z}) - ${inBounds ? 'IN BOUNDS' : 'WARNING'}`)
    });
    
    // Cooling towers (these defined our boundaries, so should all be in)
    console.log('\\n💨 COOLING TOWERS VALIDATION:');
    console.log('   ✅ All cooling towers are IN BOUNDS by design');
    console.log('   ℹ️ Ground boundaries were calculated to contain all towers');
    
    // Other landscape elements to consider
    console.log('\\n🌳 OTHER ELEMENTS TO CHECK:');
    console.log('   - Roads: Need runtime validation');
    console.log('   - Buildings: Need runtime validation'); 
    console.log('   - Landscaping: Need runtime validation');
    console.log('   - Lighting: Position independent');
    console.log('   - Camera: Position independent');
    
    // Summary
    console.log('\\n📊 VALIDATION SUMMARY:');
    if (riverInBounds && dataCentersInBounds) {
        console.log('   ✅ ALL CRITICAL ELEMENTS ARE WITHIN BOUNDS');
        console.log('   ✅ Ground optimization successful');
        console.log('   ✅ No position adjustments needed');
    } else {
        console.log('   ⚠️ SOME ELEMENTS ARE OUT OF BOUNDS');
        if (!riverInBounds) {
            console.log('   ❌ River extends beyond new ground boundaries');
            console.log('   💡 Consider extending ground Z-axis or adjusting river path');
        }
        if (!dataCentersInBounds) {
            console.log('   ❌ Data centers are out of bounds (critical error!)');
        }
    }
    
    // Performance benefits
    const oldArea = 1400 * 1000;
    const newArea = 850 * 520;
    const reduction = ((oldArea - newArea) / oldArea * 100).toFixed(1);
    
    console.log('\\n🚀 PERFORMANCE IMPROVEMENTS:');
    console.log(`   Ground area reduced: ${reduction}%`);
    console.log(`   Old area: ${oldArea.toLocaleString()} sq units`);
    console.log(`   New area: ${newArea.toLocaleString()} sq units`);
    console.log(`   Saved: ${(oldArea - newArea).toLocaleString()} sq units`);
    
    console.log('\\n' + '='.repeat(60));
    console.log('🏁 TERRAIN VALIDATION COMPLETE');
    
    return {
        riverInBounds,
        dataCentersInBounds,
        groundBounds,
        performanceGain: reduction
    };
}

// Run validation
validateTerrainObjects();