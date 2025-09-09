// Calculate exact positions of cooling towers for ground boundary analysis

function calculateCoolingTowerPositions() {
    console.log('🧮 CALCULATING COOLING TOWER POSITIONS');
    console.log('='.repeat(50));
    
    // Data centers configuration from code
    const dataCenters = [
        { name: 'DATA CENTER 01', x: 350, z: -120, width: 60, height: 25, depth: 40 },
        { name: 'DATA CENTER 02', x: 350, z: 0, width: 55, height: 22, depth: 35 },
        { name: 'DATA CENTER 03', x: 350, z: 120, width: 45, height: 20, depth: 30 }
    ];
    
    let allTowerPositions = [];
    let maxX = -Infinity;
    let minX = Infinity;
    let maxZ = -Infinity;
    let minZ = Infinity;
    
    dataCenters.forEach((dc, dcIndex) => {
        console.log(`\\n📊 ${dc.name}:`);
        console.log(`   Center: (${dc.x}, ${dc.z})`);
        console.log(`   Dimensions: ${dc.width}×${dc.depth}`);
        
        // Calculate radius for cooling tower placement
        const radius = Math.max(dc.width, dc.depth) / 2 + 80;
        console.log(`   Tower radius: ${radius} units`);
        
        // Calculate 4 tower positions around this data center
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const towerX = dc.x + Math.cos(angle) * radius;
            const towerZ = dc.z + Math.sin(angle) * radius;
            
            allTowerPositions.push({
                dataCenter: dc.name,
                towerId: i + 1,
                x: towerX,
                z: towerZ,
                angle: angle * 180 / Math.PI
            });
            
            // Track boundaries
            maxX = Math.max(maxX, towerX);
            minX = Math.min(minX, towerX);
            maxZ = Math.max(maxZ, towerZ);
            minZ = Math.min(minZ, towerZ);
            
            console.log(`   Tower ${i + 1}: (${towerX.toFixed(1)}, ${towerZ.toFixed(1)}) @ ${(angle * 180 / Math.PI).toFixed(0)}°`);
        }
    });
    
    console.log('\\n🎯 BOUNDARY ANALYSIS:');
    console.log(`   X range: ${minX.toFixed(1)} to ${maxX.toFixed(1)} (width: ${(maxX - minX).toFixed(1)})`);
    console.log(`   Z range: ${minZ.toFixed(1)} to ${maxZ.toFixed(1)} (height: ${(maxZ - minZ).toFixed(1)})`);
    
    // Current ground dimensions for comparison
    const currentGroundWidth = 1400;
    const currentGroundHeight = 1000;
    const currentGroundX = 350;
    const currentGroundZ = 0;
    
    console.log('\\n📏 CURRENT GROUND PLATFORM:');
    console.log(`   Size: ${currentGroundWidth}×${currentGroundHeight}`);
    console.log(`   Center: (${currentGroundX}, ${currentGroundZ})`);
    console.log(`   X boundaries: ${currentGroundX - currentGroundWidth/2} to ${currentGroundX + currentGroundWidth/2}`);
    console.log(`   Z boundaries: ${currentGroundZ - currentGroundHeight/2} to ${currentGroundZ + currentGroundHeight/2}`);
    
    // Recommendations for new ground size
    console.log('\\n💡 RECOMMENDED NEW GROUND DIMENSIONS:');
    
    // Add some padding around the rightmost towers
    const padding = 20;
    const newMaxX = maxX + padding;
    const newMinX = Math.min(minX - padding, currentGroundX - currentGroundWidth/2); // Keep left side
    const newMaxZ = maxZ + padding;
    const newMinZ = minZ - padding;
    
    const newWidth = newMaxX - newMinX;
    const newHeight = newMaxZ - newMinZ;
    const newCenterX = (newMaxX + newMinX) / 2;
    const newCenterZ = (newMaxZ + newMinZ) / 2;
    
    console.log(`   Optimal size: ${newWidth.toFixed(1)}×${newHeight.toFixed(1)}`);
    console.log(`   New center: (${newCenterX.toFixed(1)}, ${newCenterZ.toFixed(1)})`);
    console.log(`   X boundaries: ${newMinX.toFixed(1)} to ${newMaxX.toFixed(1)}`);
    console.log(`   Z boundaries: ${newMinZ.toFixed(1)} to ${newMaxZ.toFixed(1)}`);
    
    // Size reduction analysis
    const sizereductionWidth = ((currentGroundWidth - newWidth) / currentGroundWidth * 100).toFixed(1);
    const sizeReductionHeight = ((currentGroundHeight - newHeight) / currentGroundHeight * 100).toFixed(1);
    
    console.log('\\n📉 SIZE REDUCTION:');
    console.log(`   Width reduction: ${sizereductionWidth}%`);
    console.log(`   Height change: ${sizeReductionHeight}%`);
    
    return {
        towers: allTowerPositions,
        boundaries: { minX, maxX, minZ, maxZ },
        recommendations: {
            width: newWidth,
            height: newHeight,
            centerX: newCenterX,
            centerZ: newCenterZ,
            minX: newMinX,
            maxX: newMaxX,
            minZ: newMinZ,
            maxZ: newMaxZ
        }
    };
}

// Run calculation
calculateCoolingTowerPositions();