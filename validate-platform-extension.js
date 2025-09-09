// Platform Extension Validation Script
// Usage: Copy paste into browser console after loading 3D Smart City

(function validatePlatformExtension() {
    console.log('🏗️ PLATFORM EXTENSION VALIDATION');
    console.log('='.repeat(50));
    
    if (typeof scene === 'undefined') {
        console.error('❌ Scene not found. Make sure you are on the 3D Smart City page');
        return;
    }
    
    // Find the ground platform
    let ground = null;
    scene.traverse((object) => {
        if (object.geometry && object.geometry.type === 'PlaneGeometry') {
            if (object.material && object.material.color && object.material.color.getHex() === 0x3a3a3a) {
                ground = object;
            }
        }
    });
    
    if (!ground) {
        console.error('❌ Ground platform not found');
        return;
    }
    
    console.log('✅ Ground platform found\n');
    
    // Get platform dimensions
    const width = ground.geometry.parameters.width;
    const height = ground.geometry.parameters.height;
    const centerX = ground.position.x;
    const centerZ = ground.position.z;
    
    console.log('📐 PLATFORM SPECIFICATIONS:');
    console.log(`   Size: ${width}x${height} units`);
    console.log(`   Center: (${centerX}, ${centerZ})`);
    
    // Calculate platform boundaries
    const xMin = centerX - width/2;
    const xMax = centerX + width/2;
    const zMin = centerZ - height/2;
    const zMax = centerZ + height/2;
    
    console.log(`   Boundaries: X(${xMin} to ${xMax}), Z(${zMin} to ${zMax})\n`);
    
    // Check if this is the extended platform
    const isExtended = width >= 1000 && height >= 700;
    console.log(`🔧 Platform Status: ${isExtended ? '✅ EXTENDED' : '⚠️ STANDARD'}`);
    
    if (isExtended) {
        console.log('   ✅ Platform has been successfully extended to accommodate cooling towers');
    } else {
        console.log('   ⚠️ Platform may not be extended yet');
    }
    
    // Find data centers and cooling towers
    let dataCenters = [];
    let coolingTowers = [];
    
    scene.traverse((object) => {
        if (object.name) {
            if (object.name.includes('DATA CENTER')) {
                dataCenters.push({
                    name: object.name,
                    position: object.position.clone()
                });
            }
            if (object.name.toLowerCase().includes('cooling') || 
                (object.geometry && object.geometry.type === 'CylinderGeometry' && 
                 object.material && object.material.color && 
                 object.material.color.getHex() === 0xC0C0C0)) {
                coolingTowers.push({
                    position: object.position.clone()
                });
            }
        }
    });
    
    console.log(`\n🏢 INFRASTRUCTURE FOUND:`);
    console.log(`   Data Centers: ${dataCenters.length}`);
    console.log(`   Cooling Towers: ${coolingTowers.length}`);
    
    // Validate coverage for each cooling tower
    if (coolingTowers.length > 0) {
        console.log('\n💨 COOLING TOWER COVERAGE ANALYSIS:');
        
        let allCovered = true;
        coolingTowers.forEach((tower, index) => {
            const x = tower.position.x;
            const z = tower.position.z;
            
            const withinX = (x >= xMin) && (x <= xMax);
            const withinZ = (z >= zMin) && (z <= zMax);
            const covered = withinX && withinZ;
            
            console.log(`   Tower ${index + 1}: (${x.toFixed(1)}, ${z.toFixed(1)}) - ${covered ? '✅ ON PLATFORM' : '❌ OFF PLATFORM'}`);
            
            if (!covered) {
                allCovered = false;
                if (!withinX) {
                    const overhang = x < xMin ? (xMin - x).toFixed(1) : (x - xMax).toFixed(1);
                    console.log(`     X overhang: ${overhang} units`);
                }
                if (!withinZ) {
                    const overhang = z < zMin ? (zMin - z).toFixed(1) : (z - zMax).toFixed(1);
                    console.log(`     Z overhang: ${overhang} units`);
                }
            }
        });
        
        console.log(`\n🎯 COVERAGE RESULT: ${allCovered ? '✅ ALL TOWERS ON PLATFORM' : '❌ SOME TOWERS OFF PLATFORM'}`);
    }
    
    // Calculate platform area and compare to standard
    const currentArea = width * height;
    const standardArea = 800 * 600;
    const expansion = currentArea - standardArea;
    const expansionPercent = (expansion / standardArea * 100).toFixed(1);
    
    console.log(`\n📊 PLATFORM EXPANSION SUMMARY:`);
    console.log(`   Current area: ${currentArea.toLocaleString()} sq units`);
    console.log(`   Standard area: ${standardArea.toLocaleString()} sq units`);
    if (expansion > 0) {
        console.log(`   Expansion: +${expansion.toLocaleString()} sq units (+${expansionPercent}%)`);
    } else {
        console.log(`   No expansion detected`);
    }
    
    // Recommendations
    console.log(`\n💡 RECOMMENDATIONS:`);
    if (isExtended && allCovered) {
        console.log('   ✅ Platform extension is successful - all infrastructure properly supported');
        console.log('   ✅ No further modifications needed');
    } else if (!isExtended) {
        console.log('   🔧 Platform should be extended to 1000x700 units');
        console.log('   🔧 Center should be shifted to (150, 0) for optimal coverage');
    } else if (isExtended && !allCovered) {
        console.log('   🔧 Platform is extended but some towers still off-platform');
        console.log('   🔧 Consider further extension or tower repositioning');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🏁 VALIDATION COMPLETE');
})();