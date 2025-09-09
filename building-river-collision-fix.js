// ========================================
// BUILDING-RIVER COLLISION DETECTION AND FIX SYSTEM
// ========================================

/**
 * Comprehensive collision detection system for preventing buildings from overlapping with water
 * This system includes:
 * 1. River boundary detection
 * 2. Building collision checking
 * 3. Automatic relocation of conflicting buildings
 * 4. Prevention system for future placements
 */

// River path coordinates from the analysis
const RIVER_PATH = [
    { x: 180, z: -250 },  // Start north
    { x: 160, z: -150 },  // Bend west
    { x: 200, z: -80 },   // Curve east
    { x: 170, z: -20 },   // Bend west
    { x: 220, z: 40 },    // Wide curve east
    { x: 190, z: 100 },   // Bend west
    { x: 240, z: 160 },   // Curve east
    { x: 210, z: 220 },   // End south
    { x: 200, z: 280 }    // Final point
];

// River configuration
const RIVER_CONFIG = {
    baseWidth: 12,
    widthVariation: 3,
    safetyBuffer: 20,  // Minimum distance buildings should maintain from river
    segments: 100      // Number of segments for accurate collision detection
};

// Water exclusion zones (other water bodies like ponds, fountains)
const WATER_EXCLUSION_ZONES = [
    // Park fountains
    { x: 0, z: 50, radius: 15, type: 'fountain' },
    { x: -100, z: -100, radius: 12, type: 'fountain' },
    { x: 100, z: 100, radius: 12, type: 'fountain' },
    // Data center cooling ponds
    { x: 400, z: 0, radius: 25, type: 'cooling_pond' },
    { x: 350, z: 60, radius: 20, type: 'cooling_pond' },
    { x: 440, z: 70, radius: 18, type: 'cooling_pond' }
];

/**
 * Creates detailed river boundary points for accurate collision detection
 * @returns {Array} Array of boundary points with buffer zones
 */
function generateRiverBoundary() {
    const boundaryPoints = [];
    
    // Generate interpolated points along the river path
    for (let i = 0; i < RIVER_PATH.length - 1; i++) {
        const start = RIVER_PATH[i];
        const end = RIVER_PATH[i + 1];
        
        // Interpolate between path points
        for (let t = 0; t <= 1; t += 1 / RIVER_CONFIG.segments) {
            const x = start.x + (end.x - start.x) * t;
            const z = start.z + (end.z - start.z) * t;
            
            // Calculate river width at this point (varies along the path)
            const widthVariation = Math.sin(i * 0.5 + t * Math.PI) * RIVER_CONFIG.widthVariation;
            const currentWidth = RIVER_CONFIG.baseWidth + widthVariation;
            const bufferWidth = currentWidth + RIVER_CONFIG.safetyBuffer;
            
            boundaryPoints.push({
                center: { x, z },
                width: currentWidth,
                bufferWidth: bufferWidth,
                leftBank: { x: x - bufferWidth / 2, z },
                rightBank: { x: x + bufferWidth / 2, z }
            });
        }
    }
    
    return boundaryPoints;
}

/**
 * Checks if a point is inside any water exclusion zone
 * @param {number} x - X coordinate
 * @param {number} z - Z coordinate
 * @param {number} buildingSize - Size of the building (for buffer calculation)
 * @returns {Object|null} Exclusion zone if overlapping, null otherwise
 */
function checkWaterExclusionZones(x, z, buildingSize = 10) {
    for (const zone of WATER_EXCLUSION_ZONES) {
        const distance = Math.sqrt((x - zone.x) ** 2 + (z - zone.z) ** 2);
        const requiredDistance = zone.radius + buildingSize / 2 + 5; // 5 unit buffer
        
        if (distance < requiredDistance) {
            return {
                zone: zone,
                overlap: requiredDistance - distance,
                distance: distance
            };
        }
    }
    return null;
}

/**
 * Checks if a building position overlaps with the river
 * @param {number} x - Building X coordinate
 * @param {number} z - Building Z coordinate
 * @param {number} buildingWidth - Building width
 * @param {number} buildingDepth - Building depth
 * @returns {Object} Collision result with details
 */
function checkBuildingRiverCollision(x, z, buildingWidth = 10, buildingDepth = 10) {
    const riverBoundary = generateRiverBoundary();
    
    // Check building corners against river boundary
    const buildingCorners = [
        { x: x - buildingWidth / 2, z: z - buildingDepth / 2 }, // Bottom-left
        { x: x + buildingWidth / 2, z: z - buildingDepth / 2 }, // Bottom-right
        { x: x - buildingWidth / 2, z: z + buildingDepth / 2 }, // Top-left
        { x: x + buildingWidth / 2, z: z + buildingDepth / 2 }  // Top-right
    ];
    
    for (const corner of buildingCorners) {
        // Check against river boundary
        for (const boundaryPoint of riverBoundary) {
            const distanceToRiverCenter = Math.sqrt(
                (corner.x - boundaryPoint.center.x) ** 2 + 
                (corner.z - boundaryPoint.center.z) ** 2
            );
            
            if (distanceToRiverCenter < boundaryPoint.bufferWidth / 2) {
                return {
                    hasCollision: true,
                    type: 'river',
                    collisionPoint: boundaryPoint,
                    buildingCorner: corner,
                    overlap: boundaryPoint.bufferWidth / 2 - distanceToRiverCenter
                };
            }
        }
        
        // Check against water exclusion zones
        const exclusionCollision = checkWaterExclusionZones(corner.x, corner.z, Math.max(buildingWidth, buildingDepth));
        if (exclusionCollision) {
            return {
                hasCollision: true,
                type: 'exclusion_zone',
                exclusionZone: exclusionCollision.zone,
                buildingCorner: corner,
                overlap: exclusionCollision.overlap
            };
        }
    }
    
    return { hasCollision: false };
}

/**
 * Finds a safe position for a building, avoiding all water bodies
 * @param {Object} building - Building configuration
 * @param {Array} existingBuildings - Array of existing building positions
 * @returns {Object} Safe position coordinates
 */
function findSafeBuildingPosition(building, existingBuildings = []) {
    const { type, phase } = building;
    const buildingSize = getBuildingSizeFromType(type);
    
    // Define search zones based on building phase to maintain city planning
    const searchZones = {
        phase1: { xRange: [-200, -50], zRange: [-200, 200], priority: 1 },
        phase2: { xRange: [-50, 50], zRange: [-200, 200], priority: 2 },
        phase3: { xRange: [50, 150], zRange: [-200, 200], priority: 3 }
    };
    
    const zone = searchZones[phase] || searchZones.phase2;
    
    // Grid search for safe position
    const gridSize = 20;
    const attempts = [];
    
    for (let x = zone.xRange[0]; x <= zone.xRange[1]; x += gridSize) {
        for (let z = zone.zRange[0]; z <= zone.zRange[1]; z += gridSize) {
            // Add some randomization to avoid perfect grid alignment
            const randomX = x + (Math.random() - 0.5) * gridSize * 0.5;
            const randomZ = z + (Math.random() - 0.5) * gridSize * 0.5;
            
            // Check river collision
            const riverCollision = checkBuildingRiverCollision(randomX, randomZ, buildingSize.width, buildingSize.depth);
            if (riverCollision.hasCollision) continue;
            
            // Check collision with existing buildings
            const buildingCollision = checkBuildingCollisionWithOthers(
                randomX, randomZ, buildingSize.width, buildingSize.depth, existingBuildings
            );
            if (buildingCollision.hasCollision) continue;
            
            // Valid position found
            attempts.push({
                x: randomX,
                z: randomZ,
                score: calculatePositionScore(randomX, randomZ, zone)
            });
        }
    }
    
    // Sort by score and return best position
    attempts.sort((a, b) => b.score - a.score);
    
    if (attempts.length > 0) {
        return { x: attempts[0].x, z: attempts[0].z };
    }
    
    // Fallback: place far from river and other buildings
    console.warn(`Could not find safe position for building ${type}. Using fallback position.`);
    return findFallbackPosition(existingBuildings);
}

/**
 * Checks collision with other buildings
 */
function checkBuildingCollisionWithOthers(x, z, width, depth, existingBuildings) {
    const minDistance = 15; // Minimum distance between buildings
    
    for (const building of existingBuildings) {
        const distance = Math.sqrt((x - building.x) ** 2 + (z - building.z) ** 2);
        if (distance < minDistance) {
            return {
                hasCollision: true,
                conflictingBuilding: building,
                distance: distance
            };
        }
    }
    
    return { hasCollision: false };
}

/**
 * Gets building size based on type
 */
function getBuildingSizeFromType(type) {
    const buildingSizes = {
        office_tower: { width: 12, depth: 12, height: 60 },
        residential_tower: { width: 15, depth: 15, height: 45 },
        tech_campus: { width: 20, depth: 20, height: 20 },
        commercial_center: { width: 18, depth: 18, height: 30 },
        medical_center: { width: 16, depth: 16, height: 35 },
        education_hub: { width: 22, depth: 22, height: 25 }
    };
    
    return buildingSizes[type] || { width: 10, depth: 10, height: 20 };
}

/**
 * Calculates position score for optimization
 */
function calculatePositionScore(x, z, zone) {
    // Prefer positions closer to zone center
    const centerX = (zone.xRange[0] + zone.xRange[1]) / 2;
    const centerZ = (zone.zRange[0] + zone.zRange[1]) / 2;
    const distanceToCenter = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
    
    // Higher score for positions closer to center
    return 1000 - distanceToCenter;
}

/**
 * Fallback position finder
 */
function findFallbackPosition(existingBuildings) {
    // Place in safe area far from river
    let x = -300 - Math.random() * 100;
    let z = (Math.random() - 0.5) * 200;
    
    // Ensure no overlap with existing buildings
    let attempts = 0;
    while (attempts < 50) {
        const collision = checkBuildingCollisionWithOthers(x, z, 10, 10, existingBuildings);
        if (!collision.hasCollision) break;
        
        x -= 20;
        z += (Math.random() - 0.5) * 40;
        attempts++;
    }
    
    return { x, z };
}

/**
 * Main function to fix all building-river collisions
 * This should be called after buildings are created to relocate conflicting ones
 */
function fixBuildingRiverCollisions() {
    console.log('🔍 Starting building-river collision detection and fix...');
    
    if (!window.scene) {
        console.error('Scene not available');
        return;
    }
    
    const collidingBuildings = [];
    const safeBuildings = [];
    
    // Find all building objects in the scene
    window.scene.traverse((child) => {
        if (child.userData && child.userData.type && 
            (child.userData.type.includes('building') || 
             child.userData.type.includes('tower') ||
             child.userData.type.includes('campus') ||
             child.userData.type.includes('center') ||
             child.userData.type.includes('hub'))) {
            
            const position = child.position;
            const size = getBuildingSizeFromGeometry(child.geometry);
            
            const collision = checkBuildingRiverCollision(
                position.x, position.z, size.width, size.depth
            );
            
            if (collision.hasCollision) {
                collidingBuildings.push({
                    object: child,
                    collision: collision,
                    originalPosition: { x: position.x, z: position.z }
                });
                console.warn(`Building at (${position.x.toFixed(1)}, ${position.z.toFixed(1)}) overlaps with ${collision.type}`);
            } else {
                safeBuildings.push({
                    x: position.x,
                    z: position.z,
                    object: child
                });
            }
        }
    });
    
    console.log(`Found ${collidingBuildings.length} buildings overlapping with water`);
    console.log(`Found ${safeBuildings.length} buildings in safe positions`);
    
    // Relocate colliding buildings
    let relocatedCount = 0;
    for (const collidingBuilding of collidingBuildings) {
        const buildingType = collidingBuilding.object.userData.buildingType || 'office_tower';
        const buildingPhase = collidingBuilding.object.userData.phase || 'phase2';
        
        const safePosition = findSafeBuildingPosition(
            { type: buildingType, phase: buildingPhase },
            safeBuildings.map(b => ({ x: b.x, z: b.z }))
        );
        
        // Update building position
        collidingBuilding.object.position.x = safePosition.x;
        collidingBuilding.object.position.z = safePosition.z;
        
        // Add to safe buildings list
        safeBuildings.push({
            x: safePosition.x,
            z: safePosition.z,
            object: collidingBuilding.object
        });
        
        console.log(`✅ Relocated building from (${collidingBuilding.originalPosition.x.toFixed(1)}, ${collidingBuilding.originalPosition.z.toFixed(1)}) to (${safePosition.x.toFixed(1)}, ${safePosition.z.toFixed(1)})`);
        relocatedCount++;
    }
    
    console.log(`🎯 Successfully relocated ${relocatedCount} buildings away from water areas`);
    
    // Add visual indicators for water boundaries (optional)
    if (window.DEBUG_MODE) {
        addWaterBoundaryVisualization();
    }
    
    return {
        totalBuildings: collidingBuildings.length + safeBuildings.length,
        collidingBuildings: collidingBuildings.length,
        relocatedBuildings: relocatedCount,
        safeBuildings: safeBuildings.length
    };
}

/**
 * Gets building size from Three.js geometry
 */
function getBuildingSizeFromGeometry(geometry) {
    if (geometry && geometry.parameters) {
        return {
            width: geometry.parameters.width || 10,
            depth: geometry.parameters.depth || 10,
            height: geometry.parameters.height || 20
        };
    }
    return { width: 10, depth: 10, height: 20 };
}

/**
 * Adds visual indicators for debugging (optional)
 */
function addWaterBoundaryVisualization() {
    if (!window.scene) return;
    
    // Create river boundary visualization
    const riverBoundary = generateRiverBoundary();
    const boundaryGroup = new THREE.Group();
    boundaryGroup.name = 'RiverBoundaryVisualization';
    
    for (let i = 0; i < riverBoundary.length; i += 5) { // Show every 5th point
        const point = riverBoundary[i];
        
        // Create boundary marker
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshBasicMaterial({ 
                color: 0xff0000, 
                transparent: true, 
                opacity: 0.5 
            })
        );
        marker.position.set(point.center.x, 5, point.center.z);
        boundaryGroup.add(marker);
    }
    
    window.scene.add(boundaryGroup);
    console.log('Added river boundary visualization');
}

/**
 * Prevention system: Validates building placement before creation
 * @param {number} x - Proposed X coordinate
 * @param {number} z - Proposed Z coordinate
 * @param {Object} buildingConfig - Building configuration
 * @returns {Object} Validation result
 */
function validateBuildingPlacement(x, z, buildingConfig) {
    const size = getBuildingSizeFromType(buildingConfig.type);
    
    // Check river collision
    const riverCollision = checkBuildingRiverCollision(x, z, size.width, size.depth);
    if (riverCollision.hasCollision) {
        return {
            valid: false,
            reason: `Building would overlap with ${riverCollision.type}`,
            suggestion: 'Try placing the building further from water areas',
            collision: riverCollision
        };
    }
    
    return {
        valid: true,
        position: { x, z },
        message: 'Position is safe for building placement'
    };
}

// Export functions for global use
window.fixBuildingRiverCollisions = fixBuildingRiverCollisions;
window.validateBuildingPlacement = validateBuildingPlacement;
window.checkBuildingRiverCollision = checkBuildingRiverCollision;
window.findSafeBuildingPosition = findSafeBuildingPosition;

console.log('🌊 Building-River Collision Detection System loaded');
console.log('Available functions:');
console.log('  - fixBuildingRiverCollisions() - Fix existing overlaps');
console.log('  - validateBuildingPlacement(x, z, config) - Validate new positions');
console.log('  - checkBuildingRiverCollision(x, z, width, depth) - Check specific position');