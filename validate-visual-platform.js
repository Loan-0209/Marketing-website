// Visual Platform Coverage Validation Script
// Usage: Copy paste into browser console after loading 3D Smart City

(function validateVisualPlatform() {
    console.log('👁️ VISUAL PLATFORM COVERAGE VALIDATION');
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
        console.error('❌ Gray ground platform not found');
        return;
    }
    
    // Get platform specs
    const width = ground.geometry.parameters.width;
    const height = ground.geometry.parameters.height;
    const centerX = ground.position.x;
    const centerZ = ground.position.z;
    
    console.log('🏗️ PLATFORM SPECIFICATIONS:');
    console.log(`   Size: ${width}x${height} units`);
    console.log(`   Center: (${centerX}, ${centerZ})`);
    
    // Calculate boundaries  
    const xMin = centerX - width/2;
    const xMax = centerX + width/2;
    const zMin = centerZ - height/2;
    const zMax = centerZ + height/2;
    
    console.log(`   Boundaries: X(${xMin} to ${xMax}), Z(${zMin} to ${zMax})`);
    
    // Check if this is the massive platform
    const isMassive = width >= 1400 && height >= 1000;
    console.log(`\n🎯 Platform Status: ${isMassive ? '✅ MASSIVE PLATFORM ACTIVE' : '⚠️ STANDARD/SMALL PLATFORM'}`);
    
    // Find all cooling towers
    let coolingTowers = [];
    
    scene.traverse((object) => {
        // Look for cooling towers by geometry and material
        if (object.geometry && object.geometry.type === 'CylinderGeometry') {
            // Check if it's white/gray colored (cooling tower material)
            if (object.material && object.material.color) {
                const color = object.material.color.getHex();
                if (color === 0xC0C0C0 || color === 0xffffff) {
                    // Get world position
                    const worldPos = new THREE.Vector3();
                    object.getWorldPosition(worldPos);
                    coolingTowers.push({
                        position: worldPos,
                        color: '0x' + color.toString(16).toUpperCase()
                    });
                }
            }
        }
    });
    
    console.log(`\n💨 COOLING TOWERS FOUND: ${coolingTowers.length}`);
    
    if (coolingTowers.length === 0) {
        console.log('⚠️ No cooling towers detected. They may not be loaded yet or have different materials.');
        return;
    }
    
    // Analyze each tower's position relative to platform
    let towersOnPlatform = 0;
    let towersOffPlatform = 0;
    
    console.log('\n📍 TOWER COVERAGE ANALYSIS:');
    coolingTowers.forEach((tower, index) => {
        const x = tower.position.x;
        const z = tower.position.z;
        
        const withinX = (x >= xMin) && (x <= xMax);
        const withinZ = (z >= zMin) && (z <= zMax);
        const onPlatform = withinX && withinZ;
        
        if (onPlatform) {
            towersOnPlatform++;
        } else {
            towersOffPlatform++;
        }
        
        console.log(`   Tower ${index + 1}: (${x.toFixed(1)}, ${z.toFixed(1)}) [${tower.color}] - ${onPlatform ? '✅ ON PLATFORM' : '❌ OFF PLATFORM'}`);
        
        if (!onPlatform) {
            // Calculate how far off
            let offByX = 0, offByZ = 0;
            if (x < xMin) offByX = xMin - x;
            if (x > xMax) offByX = x - xMax;
            if (z < zMin) offByZ = zMin - z;
            if (z > zMax) offByZ = z - zMax;
            
            if (offByX > 0) console.log(`     X overhang: ${offByX.toFixed(1)} units`);
            if (offByZ > 0) console.log(`     Z overhang: ${offByZ.toFixed(1)} units`);
        }
    });
    
    // Summary
    console.log(`\n📊 COVERAGE SUMMARY:`);
    console.log(`   Towers on platform: ${towersOnPlatform}/${coolingTowers.length}`);
    console.log(`   Towers off platform: ${towersOffPlatform}/${coolingTowers.length}`);
    
    const coveragePercent = (towersOnPlatform / coolingTowers.length * 100).toFixed(1);
    console.log(`   Coverage: ${coveragePercent}%`);
    
    // Final assessment
    if (towersOffPlatform === 0) {
        console.log('\n🎉 SUCCESS: ALL cooling towers are positioned on the gray platform!');
        console.log('   ✅ No blue water should be visible under any white towers');
        console.log('   ✅ Platform extension is working correctly');
    } else {
        console.log(`\n⚠️ ISSUE: ${towersOffPlatform} towers are still off-platform`);
        console.log('   Recommendations:');
        if (!isMassive) {
            console.log('   🔧 Platform needs to be expanded to 1400x1000 units');
            console.log('   🔧 Center should be at (350, 0)');
        } else {
            console.log('   🔧 Towers may be positioned differently than expected');
            console.log('   🔧 Check data center positions in code');
        }
    }
    
    // Platform size assessment
    const area = width * height;
    console.log(`\n📐 Platform size: ${area.toLocaleString()} sq units`);
    
    if (area >= 1400000) {
        console.log('   ✅ Platform is adequately sized for full coverage');
    } else {
        console.log('   ⚠️ Platform may be too small for complete coverage');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🏁 VISUAL VALIDATION COMPLETE');
    
    // Return data for further inspection if needed
    return {
        platform: { width, height, centerX, centerZ, area },
        towers: coolingTowers,
        coverage: { onPlatform: towersOnPlatform, offPlatform: towersOffPlatform, percent: coveragePercent }
    };
})();