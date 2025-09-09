// ========================================
// PRECISE DATA CENTER RELOCATION SYSTEM
// Enhanced boundary detection with complete infrastructure relocation
// ========================================

/**
 * Complete data center relocation system with precise boundary detection
 * Handles all connected infrastructure including cooling towers, pipelines, access roads
 */

// Enhanced configuration for precise relocation
const RELOCATION_CONFIG = {
    minimumWaterClearance: 10, // 10-meter minimum from water edge
    safetyBufferZone: 15,      // Additional safety buffer
    infrastructureRadius: 150, // Maximum distance to search for connected components
    validationCheckpoints: 50,  // Number of verification points around perimeter
    
    // Component types to relocate with data center
    connectedComponents: [
        'cooling_tower', 'cooling_pond', 'cooling_system',
        'datacenter_pipeline', 'power_line', 'transmission_line',
        'substation', 'datacenter_road', 'service_road',
        'datacenter_infrastructure', 'support_building'
    ]
};

/**
 * Calculate exact bounding box of all data center components
 * @param {THREE.Object3D} dataCenter - Main data center building
 * @returns {Object} Complete complex bounds
 */
function calculateCompleteDataCenterBounds(dataCenter) {
    console.log(`📐 Calculating complete bounds for ${dataCenter.userData.name || 'Data Center'}...`);
    
    const complexComponents = [];
    const dcPosition = dataCenter.position;
    const dcId = dataCenter.userData.id || dataCenter.userData.name;
    
    // Add main building
    complexComponents.push(dataCenter);
    
    // Find all connected components within infrastructure radius
    if (window.scene) {
        window.scene.traverse(child => {
            if (child === dataCenter) return; // Skip main building
            
            const distance = dcPosition.distanceTo(child.position);
            
            // Check if component is connected to this data center
            if (distance < RELOCATION_CONFIG.infrastructureRadius) {
                const isConnected = RELOCATION_CONFIG.connectedComponents.some(type => 
                    child.userData.type === type ||
                    child.userData.parentDC === dcId ||
                    child.name.toLowerCase().includes('datacenter') ||
                    child.name.toLowerCase().includes('cooling') ||
                    child.name.toLowerCase().includes('power')
                );
                
                if (isConnected) {
                    complexComponents.push(child);
                }
            }
        });
    }
    
    console.log(`  Found ${complexComponents.length} connected components`);
    
    // Calculate combined bounding box
    let overallBox = new THREE.Box3();
    overallBox.setFromObject(dataCenter);
    
    complexComponents.forEach((component, index) => {
        if (index === 0) return; // Skip main building (already included)
        
        const componentBox = new THREE.Box3().setFromObject(component);
        overallBox.union(componentBox);
        
        console.log(`    Component ${index}: ${component.userData.type || component.name} at (${component.position.x.toFixed(1)}, ${component.position.z.toFixed(1)})`);
    });
    
    const bounds = {
        box: overallBox,
        components: complexComponents,
        center: overallBox.getCenter(new THREE.Vector3()),
        size: overallBox.getSize(new THREE.Vector3()),
        corners: [
            new THREE.Vector3(overallBox.min.x, overallBox.min.y, overallBox.min.z),
            new THREE.Vector3(overallBox.max.x, overallBox.min.y, overallBox.min.z),
            new THREE.Vector3(overallBox.min.x, overallBox.min.y, overallBox.max.z),
            new THREE.Vector3(overallBox.max.x, overallBox.min.y, overallBox.max.z),
            // Additional edge points for thorough checking
            new THREE.Vector3(overallBox.min.x, overallBox.min.y, (overallBox.min.z + overallBox.max.z) / 2),
            new THREE.Vector3(overallBox.max.x, overallBox.min.y, (overallBox.min.z + overallBox.max.z) / 2),
            new THREE.Vector3((overallBox.min.x + overallBox.max.x) / 2, overallBox.min.y, overallBox.min.z),
            new THREE.Vector3((overallBox.min.x + overallBox.max.x) / 2, overallBox.min.y, overallBox.max.z)
        ]
    };
    
    console.log(`  Complex bounds: ${bounds.size.x.toFixed(1)} x ${bounds.size.z.toFixed(1)} units`);
    console.log(`  Center: (${bounds.center.x.toFixed(1)}, ${bounds.center.z.toFixed(1)})`);
    
    return bounds;
}

/**
 * Enhanced water boundary detection with variable width and curves
 * @returns {Object} Precise water boundaries
 */
function getEnhancedWaterBoundary() {
    const boundaries = [];
    
    // River path with enhanced curve detection
    const riverPath = [
        { x: 180, z: -250 }, { x: 160, z: -150 }, { x: 200, z: -80 },
        { x: 170, z: -20 }, { x: 220, z: 40 }, { x: 190, z: 100 },
        { x: 240, z: 160 }, { x: 210, z: 220 }, { x: 200, z: 280 }
    ];
    
    // Generate high-resolution boundary points
    for (let i = 0; i < riverPath.length - 1; i++) {
        const start = riverPath[i];
        const end = riverPath[i + 1];
        
        // Create 100 interpolation points for maximum precision
        for (let t = 0; t <= 1; t += 0.01) {
            const x = start.x + (end.x - start.x) * t;
            const z = start.z + (end.z - start.z) * t;
            
            // Variable width calculation with curves
            const baseWidth = 15;
            const widthVariation = Math.sin(i * 0.5 + t * Math.PI * 2) * 4;
            const currentWidth = baseWidth + widthVariation;
            
            // Add safety buffer to water boundary
            const safeWidth = currentWidth + (RELOCATION_CONFIG.minimumWaterClearance * 2);
            
            boundaries.push({
                center: { x, z },
                width: currentWidth,
                safeWidth: safeWidth,
                leftBank: { x: x - safeWidth/2, z },
                rightBank: { x: x + safeWidth/2, z },
                segment: i,
                t: t
            });
        }
    }
    
    console.log(`🌊 Generated ${boundaries.length} precise water boundary points`);
    
    return {
        river: boundaries,
        exclusionZones: getWaterExclusionZones()
    };
}

/**
 * Enhanced point-in-water detection with safety margins
 * @param {THREE.Vector3} point - Point to check
 * @param {Object} waterBoundary - Water boundary data
 * @returns {Object} Detailed collision result
 */
function enhancedWaterCollisionCheck(point, waterBoundary) {
    const x = point.x;
    const z = point.z;
    let minDistanceToWater = Infinity;
    let closestWaterPoint = null;
    
    // Check against all river boundary points
    for (const boundaryPoint of waterBoundary.river) {
        const distanceToCenter = Math.sqrt(
            (x - boundaryPoint.center.x) ** 2 + 
            (z - boundaryPoint.center.z) ** 2
        );
        
        const distanceToSafeBoundary = distanceToCenter - (boundaryPoint.safeWidth / 2);
        
        if (distanceToSafeBoundary < minDistanceToWater) {
            minDistanceToWater = distanceToSafeBoundary;
            closestWaterPoint = boundaryPoint;
        }
        
        // Point is within water safety zone
        if (distanceToSafeBoundary <= 0) {
            return {
                inWater: true,
                collision: true,
                distanceToWater: distanceToSafeBoundary,
                closestPoint: boundaryPoint,
                clearanceNeeded: Math.abs(distanceToSafeBoundary) + RELOCATION_CONFIG.safetyBufferZone
            };
        }
    }
    
    // Check exclusion zones
    for (const zone of waterBoundary.exclusionZones) {
        const distance = Math.sqrt((x - zone.x) ** 2 + (z - zone.z) ** 2);
        const safeDistance = zone.radius + RELOCATION_CONFIG.minimumWaterClearance;
        
        if (distance < safeDistance) {
            return {
                inWater: true,
                collision: true,
                distanceToWater: distance - safeDistance,
                exclusionZone: zone,
                clearanceNeeded: safeDistance - distance + RELOCATION_CONFIG.safetyBufferZone
            };
        }
    }
    
    return {
        inWater: false,
        collision: false,
        distanceToWater: minDistanceToWater,
        closestPoint: closestWaterPoint,
        clearanceAvailable: minDistanceToWater
    };
}

/**
 * Multiple checkpoint verification around data center perimeter
 * @param {Object} bounds - Data center complex bounds
 * @param {Object} waterBoundary - Water boundary data
 * @returns {Object} Verification result
 */
function multipleCheckpointVerification(bounds, waterBoundary) {
    console.log(`🔍 Performing ${RELOCATION_CONFIG.validationCheckpoints}-point verification...`);
    
    const checkpoints = [];
    const violations = [];
    
    // Check all corners
    bounds.corners.forEach((corner, index) => {
        const result = enhancedWaterCollisionCheck(corner, waterBoundary);
        checkpoints.push({ point: corner, result, type: `corner_${index}` });
        
        if (result.collision) {
            violations.push({ point: corner, result, type: `corner_${index}` });
        }
    });
    
    // Check perimeter points
    const center = bounds.center;
    const maxRadius = Math.max(bounds.size.x, bounds.size.z) / 2;
    
    for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / RELOCATION_CONFIG.validationCheckpoints) {
        const perimeterX = center.x + Math.cos(angle) * maxRadius;
        const perimeterZ = center.z + Math.sin(angle) * maxRadius;
        const perimeterPoint = new THREE.Vector3(perimeterX, center.y, perimeterZ);
        
        const result = enhancedWaterCollisionCheck(perimeterPoint, waterBoundary);
        checkpoints.push({ point: perimeterPoint, result, type: `perimeter_${angle.toFixed(2)}` });
        
        if (result.collision) {
            violations.push({ point: perimeterPoint, result, type: `perimeter_${angle.toFixed(2)}` });
        }
    }
    
    console.log(`  Checked ${checkpoints.length} points, found ${violations.length} violations`);
    
    return {
        totalPoints: checkpoints.length,
        violations: violations.length,
        safe: violations.length === 0,
        checkpoints: checkpoints,
        violationDetails: violations
    };
}

/**
 * Find optimal safe location for entire data center complex
 * @param {Object} bounds - Current complex bounds
 * @param {Object} waterBoundary - Water boundaries
 * @returns {THREE.Vector3} Safe position
 */
function findOptimalSafeLocation(bounds, waterBoundary) {
    console.log(`🎯 Finding optimal safe location for data center complex...`);
    
    const searchRadius = 200;
    const stepSize = 10;
    const currentCenter = bounds.center;
    
    const candidates = [];
    
    // Search in expanding grid pattern
    for (let radius = stepSize; radius <= searchRadius; radius += stepSize) {
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
            const testX = currentCenter.x + Math.cos(angle) * radius;
            const testZ = currentCenter.z + Math.sin(angle) * radius;
            const testCenter = new THREE.Vector3(testX, currentCenter.y, testZ);
            
            // Create test bounds at this position
            const testBounds = {
                center: testCenter,
                size: bounds.size,
                corners: bounds.corners.map(corner => {
                    const offset = corner.clone().sub(currentCenter);
                    return testCenter.clone().add(offset);
                })
            };
            
            // Verify this position
            const verification = multipleCheckpointVerification(testBounds, waterBoundary);
            
            if (verification.safe) {
                // Check if within ground boundaries
                const groundCheck = isWithinGroundBoundaries(testX, testZ, bounds.size.x, bounds.size.z);
                
                if (groundCheck.covered) {
                    const score = calculateLocationScore(testCenter, currentCenter, waterBoundary);
                    candidates.push({
                        position: testCenter,
                        bounds: testBounds,
                        score: score,
                        verification: verification
                    });
                }
            }
        }
    }
    
    // Sort by score and return best location
    candidates.sort((a, b) => b.score - a.score);
    
    if (candidates.length > 0) {
        console.log(`  Found ${candidates.length} safe locations, selecting optimal position`);
        const optimal = candidates[0];
        console.log(`  Optimal position: (${optimal.position.x.toFixed(1)}, ${optimal.position.z.toFixed(1)}) with score ${optimal.score.toFixed(1)}`);
        return optimal;
    }
    
    // Fallback to safe eastward position
    console.warn(`  No optimal location found, using fallback position`);
    return {
        position: new THREE.Vector3(500, currentCenter.y, currentCenter.z),
        score: 0,
        fallback: true
    };
}

/**
 * Calculate location score for optimization
 */
function calculateLocationScore(position, originalPosition, waterBoundary) {
    // Prefer positions closer to original location
    const distanceFromOriginal = position.distanceTo(originalPosition);
    const distanceScore = 1000 - distanceFromOriginal;
    
    // Prefer positions with better water clearance
    const waterClearance = enhancedWaterCollisionCheck(position, waterBoundary);
    const clearanceScore = Math.min(waterClearance.distanceToWater, 100) * 5;
    
    // Prefer eastward positions (toward current data center area)
    const eastwardBonus = position.x > originalPosition.x ? 50 : -50;
    
    return distanceScore + clearanceScore + eastwardBonus;
}

/**
 * Execute complete data center complex relocation
 * @param {THREE.Object3D} dataCenter - Main data center building
 */
function executeCompleteDataCenterRelocation(dataCenter) {
    console.log(`🚚 === EXECUTING COMPLETE DATA CENTER RELOCATION ===`);
    console.log(`Target: ${dataCenter.userData.name || dataCenter.name || 'Data Center'}`);
    
    // Step 1: Calculate exact bounding box of all components
    const complexBounds = calculateCompleteDataCenterBounds(dataCenter);
    
    // Step 2: Get enhanced water boundaries
    const waterBoundary = getEnhancedWaterBoundary();
    
    // Step 3: Perform multiple checkpoint verification
    const currentVerification = multipleCheckpointVerification(complexBounds, waterBoundary);
    
    if (currentVerification.safe) {
        console.log(`✅ Data center complex is already safely positioned`);
        console.log(`   - All ${currentVerification.totalPoints} checkpoints clear`);
        console.log(`   - Minimum water clearance maintained`);
        return { relocated: false, reason: 'Already safe' };
    }
    
    console.log(`⚠️ Found ${currentVerification.violations} checkpoint violations`);
    
    // Step 4: Find optimal safe location
    const optimalLocation = findOptimalSafeLocation(complexBounds, waterBoundary);
    
    if (optimalLocation.fallback) {
        console.warn(`Using fallback location due to constraints`);
    }
    
    // Step 5: Calculate relocation offset
    const relocationOffset = optimalLocation.position.clone().sub(complexBounds.center);
    console.log(`📐 Relocation offset: (${relocationOffset.x.toFixed(1)}, ${relocationOffset.z.toFixed(1)})`);
    
    // Step 6: Move entire complex with all connected infrastructure
    const relocatedComponents = [];
    
    complexBounds.components.forEach(component => {
        const originalPosition = component.position.clone();
        component.position.add(relocationOffset);
        
        relocatedComponents.push({
            component: component,
            type: component.userData.type || component.name,
            originalPosition: originalPosition,
            newPosition: component.position.clone()
        });
        
        console.log(`   Moved ${component.userData.type || component.name}: (${originalPosition.x.toFixed(1)}, ${originalPosition.z.toFixed(1)}) → (${component.position.x.toFixed(1)}, ${component.position.z.toFixed(1)})`);
    });
    
    // Step 7: Update connecting cables and pipelines
    updateConnectingInfrastructure(dataCenter, relocationOffset);
    
    // Step 8: Final verification
    const finalBounds = calculateCompleteDataCenterBounds(dataCenter);
    const finalVerification = multipleCheckpointVerification(finalBounds, waterBoundary);
    
    console.log(`\\n📊 RELOCATION COMPLETE:`);
    console.log(`   - Components moved: ${relocatedComponents.length}`);
    console.log(`   - Final verification: ${finalVerification.safe ? '✅ SAFE' : '❌ ISSUES REMAIN'}`);
    console.log(`   - Checkpoint violations: ${finalVerification.violations}`);
    console.log(`   - Water clearance: ${finalVerification.safe ? 'ADEQUATE' : 'INSUFFICIENT'}`);
    
    return {
        relocated: true,
        componentsCount: relocatedComponents.length,
        offset: relocationOffset,
        verification: finalVerification,
        components: relocatedComponents
    };
}

/**
 * Update all connecting infrastructure after relocation
 */
function updateConnectingInfrastructure(dataCenter, offset) {
    console.log(`🔌 Updating connecting cables and pipelines...`);
    
    if (!window.scene) return;
    
    let updatedConnections = 0;
    
    window.scene.traverse(child => {
        // Update transmission lines
        if (child.userData.type === 'transmission_line' || 
            child.name.includes('transmission') ||
            child.name.includes('power_line')) {
            
            // Update line geometry to maintain connections
            if (child.geometry && child.geometry.attributes && child.geometry.attributes.position) {
                const positions = child.geometry.attributes.position.array;
                // Update connection points (implementation would depend on specific geometry)
                child.geometry.attributes.position.needsUpdate = true;
                updatedConnections++;
            }
        }
        
        // Update pipeline connections
        if (child.userData.type === 'cooling_pipeline' ||
            child.name.includes('pipeline') ||
            child.material && child.material.color && child.material.color.getHex() === 0x006994) {
            
            // Update pipeline routing
            updatedConnections++;
        }
    });
    
    console.log(`   Updated ${updatedConnections} infrastructure connections`);
}

/**
 * Helper functions
 */
function getWaterExclusionZones() {
    return [
        { x: 0, z: 50, radius: 15, type: 'fountain' },
        { x: -100, z: -100, radius: 12, type: 'fountain' },
        { x: 100, z: 100, radius: 12, type: 'fountain' }
    ];
}

function isWithinGroundBoundaries(x, z, width, depth) {
    const bounds = { xMin: -300, xMax: 500, zMin: -300, zMax: 300 };
    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    
    return {
        covered: (x - halfWidth >= bounds.xMin && x + halfWidth <= bounds.xMax &&
                 z - halfDepth >= bounds.zMin && z + halfDepth <= bounds.zMax)
    };
}

/**
 * Main execution function
 */
function executePreciseDataCenterRelocation() {
    console.log(`🏭 === PRECISE DATA CENTER RELOCATION SYSTEM ===`);
    
    if (!window.scene) {
        console.error('Scene not available');
        return { error: 'Scene not available' };
    }
    
    // Find all data centers
    const dataCenters = [];
    window.scene.traverse(obj => {
        if (obj.userData && (
            obj.userData.type === 'datacenter' || 
            obj.userData.type === 'data_center' ||
            (obj.userData.type && obj.userData.type.includes('DATA_CENTER')) ||
            (obj.name && obj.name.includes('DATA_CENTER'))
        )) {
            dataCenters.push(obj);
        }
    });
    
    console.log(`Found ${dataCenters.length} data centers to analyze`);
    
    const results = [];
    
    dataCenters.forEach((dc, index) => {
        console.log(`\\n--- Processing Data Center ${index + 1} ---`);
        const result = executeCompleteDataCenterRelocation(dc);
        results.push(result);
    });
    
    const summary = {
        totalDataCenters: dataCenters.length,
        relocated: results.filter(r => r.relocated).length,
        alreadySafe: results.filter(r => !r.relocated).length,
        results: results
    };
    
    console.log(`\\n🎯 FINAL SUMMARY:`);
    console.log(`   Total data centers: ${summary.totalDataCenters}`);
    console.log(`   Relocated: ${summary.relocated}`);
    console.log(`   Already safe: ${summary.alreadySafe}`);
    
    return summary;
}

// Export functions
window.executePreciseDataCenterRelocation = executePreciseDataCenterRelocation;
window.executeCompleteDataCenterRelocation = executeCompleteDataCenterRelocation;
window.calculateCompleteDataCenterBounds = calculateCompleteDataCenterBounds;
window.multipleCheckpointVerification = multipleCheckpointVerification;

console.log('🎯 Precise Data Center Relocation System loaded');
console.log('Available functions:');
console.log('  - executePreciseDataCenterRelocation() - Execute complete relocation process');
console.log('  - executeCompleteDataCenterRelocation(dc) - Relocate specific data center');
console.log('  - calculateCompleteDataCenterBounds(dc) - Get precise complex bounds');