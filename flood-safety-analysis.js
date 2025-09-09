// Flood Safety Analysis for 3D Smart City
// Run this in browser console at http://localhost:8080/3d-smart-city.html

function analyzeFloodSafety() {
    console.log('🔍 Starting Flood Safety Analysis...\n');
    
    // Check if scene is loaded
    if (typeof scene === 'undefined') {
        console.error('❌ Scene not loaded. Please wait for the 3D Smart City to fully load.');
        return;
    }
    
    // 1. Find all datacenter buildings
    const datacenters = [];
    const datacenterTypes = ['datacenter_01', 'datacenter_02', 'datacenter_03', 'substation_500kv'];
    
    scene.traverse((child) => {
        if (child.userData && child.userData.buildingType) {
            if (datacenterTypes.includes(child.userData.buildingType)) {
                datacenters.push({
                    name: child.userData.name || child.userData.buildingType,
                    type: child.userData.buildingType,
                    position: {
                        x: child.position.x,
                        z: child.position.z
                    },
                    phase: child.userData.phase
                });
            }
        }
    });
    
    console.log(`📊 Found ${datacenters.length} datacenter buildings\n`);
    
    // 2. Find river segments
    const riverSegments = [];
    scene.traverse((child) => {
        if (child.name && child.name.includes('river-segment')) {
            riverSegments.push({
                name: child.name,
                position: {
                    x: child.position.x,
                    z: child.position.z
                }
            });
        }
    });
    
    console.log(`🌊 Found ${riverSegments.length} river segments\n`);
    
    // 3. Calculate minimum distances
    const floodSafetyReport = {
        timestamp: new Date().toISOString(),
        analysis: 'Flood Safety Distance Analysis',
        safeDistance: 100, // meters
        datacenters: [],
        summary: {
            totalDatacenters: datacenters.length,
            safeDatacenters: 0,
            atRiskDatacenters: 0
        }
    };
    
    datacenters.forEach(datacenter => {
        let minDistance = Infinity;
        let closestRiverPoint = null;
        
        // Find closest river segment
        riverSegments.forEach(segment => {
            const distance = Math.sqrt(
                Math.pow(datacenter.position.x - segment.position.x, 2) +
                Math.pow(datacenter.position.z - segment.position.z, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestRiverPoint = segment.position;
            }
        });
        
        const isSafe = minDistance > floodSafetyReport.safeDistance;
        
        const datacenterInfo = {
            name: datacenter.name,
            type: datacenter.type,
            phase: datacenter.phase,
            position: datacenter.position,
            closestRiverPoint: closestRiverPoint,
            distanceToRiver: Math.round(minDistance),
            floodSafetyStatus: isSafe ? '✅ SAFE' : '⚠️ AT RISK',
            safetyMargin: Math.round(minDistance - floodSafetyReport.safeDistance)
        };
        
        floodSafetyReport.datacenters.push(datacenterInfo);
        
        if (isSafe) {
            floodSafetyReport.summary.safeDatacenters++;
        } else {
            floodSafetyReport.summary.atRiskDatacenters++;
        }
        
        // Console output
        console.log(`🏢 ${datacenter.name}`);
        console.log(`   Position: (${datacenter.position.x}, ${datacenter.position.z})`);
        console.log(`   Distance to river: ${Math.round(minDistance)}m`);
        console.log(`   Status: ${datacenterInfo.floodSafetyStatus}`);
        console.log(`   Safety margin: ${datacenterInfo.safetyMargin}m\n`);
    });
    
    // 4. Additional analysis - check cooling lake
    let coolingLake = null;
    scene.traverse((child) => {
        if (child.name === 'cooling-lake') {
            coolingLake = {
                position: {
                    x: child.position.x,
                    z: child.position.z
                }
            };
        }
    });
    
    if (coolingLake) {
        console.log('🏞️ Cooling Lake Analysis:');
        console.log(`   Position: (${coolingLake.position.x}, ${coolingLake.position.z})`);
        
        // Check distance from datacenters to cooling lake
        datacenters.forEach(dc => {
            const distance = Math.sqrt(
                Math.pow(dc.position.x - coolingLake.position.x, 2) +
                Math.pow(dc.position.z - coolingLake.position.z, 2)
            );
            console.log(`   Distance from ${dc.name}: ${Math.round(distance)}m`);
        });
        console.log('');
    }
    
    // 5. Generate summary
    console.log('📊 SUMMARY REPORT:');
    console.log('==================');
    console.log(`Total Datacenters: ${floodSafetyReport.summary.totalDatacenters}`);
    console.log(`Safe from flooding (>100m): ${floodSafetyReport.summary.safeDatacenters}`);
    console.log(`At risk (<100m): ${floodSafetyReport.summary.atRiskDatacenters}`);
    console.log(`Safety Rate: ${(floodSafetyReport.summary.safeDatacenters / floodSafetyReport.summary.totalDatacenters * 100).toFixed(1)}%`);
    
    // 6. Export JSON report
    console.log('\n📄 JSON Report (copy below):');
    console.log(JSON.stringify(floodSafetyReport, null, 2));
    
    // Also save to window for easy access
    window.floodSafetyReport = floodSafetyReport;
    console.log('\n💾 Report saved to window.floodSafetyReport');
    
    // 7. Visual helper - highlight at-risk datacenters
    let atRiskCount = 0;
    scene.traverse((child) => {
        if (child.userData && child.userData.buildingType && datacenterTypes.includes(child.userData.buildingType)) {
            const dcInfo = floodSafetyReport.datacenters.find(dc => 
                dc.position.x === child.position.x && dc.position.z === child.position.z
            );
            
            if (dcInfo && dcInfo.floodSafetyStatus.includes('AT RISK')) {
                // Store original color
                if (child.material) {
                    child.userData.originalColor = child.material.color.getHex();
                    // Highlight in red
                    child.material.color.setHex(0xff0000);
                    atRiskCount++;
                }
            }
        }
    });
    
    if (atRiskCount > 0) {
        console.log(`\n⚠️ ${atRiskCount} at-risk datacenters highlighted in RED`);
        console.log('Run resetDatacenterColors() to restore original colors');
    }
    
    return floodSafetyReport;
}

// Function to reset datacenter colors
function resetDatacenterColors() {
    let resetCount = 0;
    scene.traverse((child) => {
        if (child.userData && child.userData.originalColor && child.material) {
            child.material.color.setHex(child.userData.originalColor);
            delete child.userData.originalColor;
            resetCount++;
        }
    });
    console.log(`✅ Reset ${resetCount} datacenter colors to original`);
}

// Function to visualize safety zones
function visualizeSafetyZones() {
    console.log('🎨 Creating safety zone visualization...');
    
    // Create transparent cylinders around each datacenter
    const datacenterTypes = ['datacenter_01', 'datacenter_02', 'datacenter_03', 'substation_500kv'];
    
    scene.traverse((child) => {
        if (child.userData && child.userData.buildingType && datacenterTypes.includes(child.userData.buildingType)) {
            // Create safety zone indicator
            const geometry = new THREE.RingGeometry(95, 105, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const safetyRing = new THREE.Mesh(geometry, material);
            safetyRing.rotation.x = -Math.PI / 2;
            safetyRing.position.set(child.position.x, 0.1, child.position.z);
            safetyRing.name = 'safety-zone-indicator';
            
            scene.add(safetyRing);
        }
    });
    
    console.log('✅ Safety zones added (100m radius green rings)');
    console.log('Run removeSafetyZones() to remove visualization');
}

// Function to remove safety zone visualization
function removeSafetyZones() {
    const toRemove = [];
    scene.traverse((child) => {
        if (child.name === 'safety-zone-indicator') {
            toRemove.push(child);
        }
    });
    
    toRemove.forEach(child => scene.remove(child));
    console.log(`✅ Removed ${toRemove.length} safety zone indicators`);
}

// Auto-run analysis when this script is loaded
console.log('🚀 Flood Safety Analysis Ready!');
console.log('Commands available:');
console.log('  - analyzeFloodSafety() : Run full analysis');
console.log('  - visualizeSafetyZones() : Show 100m safety zones');
console.log('  - removeSafetyZones() : Remove safety zones');
console.log('  - resetDatacenterColors() : Reset datacenter colors');
console.log('\nRunning initial analysis...\n');

// Run analysis
analyzeFloodSafety();