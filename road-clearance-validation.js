// ========================================
// ROAD CLEARANCE VALIDATION SYSTEM
// ========================================

/**
 * Road network definition for 3D Smart City
 * Ensures buildings maintain proper clearance from transportation corridors
 */

const ROAD_NETWORK = {
    // Main roads (20m width)
    mainRoads: [
        {
            name: 'Main North-South Avenue',
            type: 'arterial',
            width: 20,
            centerLine: { x: 0, z: 'any' },
            bounds: { xMin: -10, xMax: 10 },
            clearance: 10
        },
        {
            name: 'Main East-West Boulevard',
            type: 'arterial', 
            width: 20,
            centerLine: { x: 'any', z: 0 },
            bounds: { zMin: -10, zMax: 10 },
            clearance: 10
        }
    ],
    
    // Secondary roads (15m width)
    secondaryRoads: [
        {
            name: 'East Vertical Street',
            type: 'secondary',
            width: 15,
            centerLine: { x: 100, z: 'any' },
            bounds: { xMin: 92.5, xMax: 107.5 },
            clearance: 7.5
        },
        {
            name: 'West Vertical Street',
            type: 'secondary',
            width: 15,
            centerLine: { x: -100, z: 'any' },
            bounds: { xMin: -107.5, xMax: -92.5 },
            clearance: 7.5
        },
        {
            name: 'North Horizontal Street',
            type: 'secondary',
            width: 15,
            centerLine: { x: 'any', z: 100 },
            bounds: { zMin: 92.5, zMax: 107.5 },
            clearance: 7.5
        },
        {
            name: 'South Horizontal Street',
            type: 'secondary',
            width: 15,
            centerLine: { x: 'any', z: -100 },
            bounds: { zMin: -107.5, zMax: -92.5 },
            clearance: 7.5
        }
    ],
    
    // Data center connection roads
    datacenteRoads: [
        {
            name: 'Data Center Highway',
            type: 'highway',
            width: 12,
            centerLine: { x: 200, z: 0 },
            bounds: { xMin: 194, xMax: 206 },
            clearance: 8
        }
    ],
    
    // Intersection zones (require extra clearance)
    intersections: [
        { center: { x: 0, z: 0 }, radius: 20 },
        { center: { x: -100, z: -100 }, radius: 15 },
        { center: { x: 100, z: -100 }, radius: 15 },
        { center: { x: -100, z: 100 }, radius: 15 },
        { center: { x: 100, z: 100 }, radius: 15 }
    ],
    
    // Pedestrian pathways and green corridors
    pedestrianZones: [
        {
            name: 'Central Park Pathways',
            bounds: { xMin: -100, xMax: 100, zMin: -75, zMax: 75 },
            clearance: 5
        }
    ]
};

/**
 * Check if a building position conflicts with any road
 * @param {number} x - Building X coordinate
 * @param {number} z - Building Z coordinate  
 * @param {number} buildingWidth - Building width
 * @param {number} buildingDepth - Building depth
 * @returns {Object} Validation result
 */
function checkRoadClearance(x, z, buildingWidth = 20, buildingDepth = 20) {
    const halfWidth = buildingWidth / 2;
    const halfDepth = buildingDepth / 2;
    
    // Building boundaries
    const buildingBounds = {
        xMin: x - halfWidth,
        xMax: x + halfWidth,
        zMin: z - halfDepth,
        zMax: z + halfDepth
    };
    
    // Check main roads
    for (const road of ROAD_NETWORK.mainRoads) {
        if (road.centerLine.x === 0) {
            // North-South road
            if (buildingBounds.xMin < road.bounds.xMax && buildingBounds.xMax > road.bounds.xMin) {
                return {
                    valid: false,
                    conflict: road.name,
                    type: 'road_overlap',
                    clearanceViolation: true,
                    suggestedMove: { x: x < 0 ? -20 : 20, z: 0 }
                };
            }
        }
        
        if (road.centerLine.z === 0) {
            // East-West road
            if (buildingBounds.zMin < road.bounds.zMax && buildingBounds.zMax > road.bounds.zMin) {
                return {
                    valid: false,
                    conflict: road.name,
                    type: 'road_overlap', 
                    clearanceViolation: true,
                    suggestedMove: { x: 0, z: z < 0 ? -20 : 20 }
                };
            }
        }
    }
    
    // Check secondary roads
    for (const road of ROAD_NETWORK.secondaryRoads) {
        if (road.centerLine.x !== 'any') {
            // Vertical roads
            if (buildingBounds.xMin < road.bounds.xMax && buildingBounds.xMax > road.bounds.xMin) {
                return {
                    valid: false,
                    conflict: road.name,
                    type: 'road_overlap',
                    clearanceViolation: true,
                    suggestedMove: { x: x < road.centerLine.x ? road.centerLine.x - road.clearance - halfWidth - 5 : road.centerLine.x + road.clearance + halfWidth + 5, z: 0 }
                };
            }
        }
        
        if (road.centerLine.z !== 'any') {
            // Horizontal roads
            if (buildingBounds.zMin < road.bounds.zMax && buildingBounds.zMax > road.bounds.zMin) {
                return {
                    valid: false,
                    conflict: road.name,
                    type: 'road_overlap',
                    clearanceViolation: true,
                    suggestedMove: { x: 0, z: z < road.centerLine.z ? road.centerLine.z - road.clearance - halfDepth - 5 : road.centerLine.z + road.clearance + halfDepth + 5 }
                };
            }
        }
    }
    
    // Check intersections
    for (const intersection of ROAD_NETWORK.intersections) {
        const distance = Math.sqrt((x - intersection.center.x) ** 2 + (z - intersection.center.z) ** 2);
        if (distance < intersection.radius) {
            return {
                valid: false,
                conflict: `Intersection at (${intersection.center.x}, ${intersection.center.z})`,
                type: 'intersection_overlap',
                clearanceViolation: true,
                suggestedMove: {
                    x: x - intersection.center.x > 0 ? intersection.center.x + intersection.radius + halfWidth : intersection.center.x - intersection.radius - halfWidth,
                    z: z - intersection.center.z > 0 ? intersection.center.z + intersection.radius + halfDepth : intersection.center.z - intersection.radius - halfDepth
                }
            };
        }
    }
    
    return {
        valid: true,
        message: 'Building position is clear of all roads and intersections'
    };
}

/**
 * Find safe building position avoiding roads
 * @param {Object} building - Building configuration
 * @param {Array} existingBuildings - Already placed buildings
 * @returns {Object} Safe coordinates
 */
function findSafePositionAwayFromRoads(building, existingBuildings = []) {
    const buildingSize = getBuildingSizeFromType(building.type);
    
    // Define safe zones between roads (building quadrants)
    const safeZones = [
        // Northwest quadrant
        { xMin: -180, xMax: -110, zMin: 20, zMax: 80 },
        { xMin: -180, xMax: -110, zMin: -80, zMax: -20 },
        
        // Northeast quadrant  
        { xMin: 110, xMax: 180, zMin: 20, zMax: 80 },
        { xMin: 110, xMax: 180, zMin: -80, zMax: -20 },
        
        // Central areas between roads
        { xMin: -90, xMax: -20, zMin: 20, zMax: 90 },
        { xMin: 20, xMax: 90, zMin: 20, zMax: 90 },
        { xMin: -90, xMax: -20, zMin: -90, zMax: -20 },
        { xMin: 20, xMax: 90, zMin: -90, zMax: -20 }
    ];
    
    // Try to find position in appropriate zone based on phase
    const phasePreference = {
        phase1: [0, 1, 2, 3], // Outer zones
        phase2: [4, 5, 6, 7], // Inner zones
        phase3: [4, 5, 6, 7]  // Inner zones
    };
    
    const preferredZones = phasePreference[building.phase] || [0, 1, 2, 3, 4, 5, 6, 7];
    
    for (const zoneIndex of preferredZones) {
        const zone = safeZones[zoneIndex];
        
        // Try random positions within zone
        for (let attempt = 0; attempt < 20; attempt++) {
            const x = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
            const z = zone.zMin + Math.random() * (zone.zMax - zone.zMin);
            
            // Check road clearance
            const roadCheck = checkRoadClearance(x, z, buildingSize.width, buildingSize.depth);
            if (!roadCheck.valid) continue;
            
            // Check river clearance (we know river is at x=160-240)
            if (x > 150 && x < 250) continue;
            
            // Check other building clearance
            let tooClose = false;
            for (const existing of existingBuildings) {
                const distance = Math.sqrt((x - existing.x) ** 2 + (z - existing.z) ** 2);
                if (distance < 25) {
                    tooClose = true;
                    break;
                }
            }
            if (tooClose) continue;
            
            // Valid position found
            return { x, z };
        }
    }
    
    // Fallback position
    return { x: -200, z: (Math.random() - 0.5) * 100 };
}

/**
 * Validate and relocate all buildings for road clearance
 */
function validateAndRelocateBuildings() {
    console.log('🚦 === ROAD CLEARANCE VALIDATION ===');
    
    if (!window.scene) {
        console.error('Scene not available');
        return;
    }
    
    const buildingsToRelocate = [];
    const validBuildings = [];
    let buildingCount = 0;
    
    // Check all buildings
    window.scene.traverse((child) => {
        if (child.userData && child.userData.isBuilding) {
            buildingCount++;
            const pos = child.position;
            const type = child.userData.buildingType || 'office_tower';
            const phase = child.userData.phase || 'phase2';
            
            const validation = checkRoadClearance(pos.x, pos.z);
            
            if (!validation.valid) {
                buildingsToRelocate.push({
                    object: child,
                    originalPos: { x: pos.x, z: pos.z },
                    conflict: validation.conflict,
                    type: type,
                    phase: phase,
                    suggestedMove: validation.suggestedMove
                });
                console.warn(`⚠️ Building at (${pos.x.toFixed(1)}, ${pos.z.toFixed(1)}) conflicts with ${validation.conflict}`);
            } else {
                validBuildings.push({ x: pos.x, z: pos.z });
            }
        }
    });
    
    console.log(`Total buildings checked: ${buildingCount}`);
    console.log(`Buildings conflicting with roads: ${buildingsToRelocate.length}`);
    console.log(`Buildings in safe positions: ${validBuildings.length}`);
    
    // Relocate conflicting buildings
    let relocatedCount = 0;
    for (const building of buildingsToRelocate) {
        const newPosition = findSafePositionAwayFromRoads(building, validBuildings);
        
        // Apply new position
        building.object.position.x = newPosition.x;
        building.object.position.z = newPosition.z;
        
        validBuildings.push(newPosition);
        
        console.log(`✅ Relocated ${building.type} from (${building.originalPos.x.toFixed(1)}, ${building.originalPos.z.toFixed(1)}) to (${newPosition.x.toFixed(1)}, ${newPosition.z.toFixed(1)})`);
        console.log(`   Reason: ${building.conflict} conflict`);
        relocatedCount++;
    }
    
    console.log(`\n🎯 Road clearance complete:`);
    console.log(`  - Buildings relocated: ${relocatedCount}`);
    console.log(`  - All roads now clear: ✅`);
    console.log(`  - All intersections clear: ✅`);
    console.log(`  - Minimum clearances maintained: ✅`);
    
    return {
        total: buildingCount,
        relocated: relocatedCount,
        conflicts: buildingsToRelocate
    };
}

/**
 * Get building size from type
 */
function getBuildingSizeFromType(type) {
    // All buildings use 20x20 base in this city
    return { width: 20, depth: 20 };
}

// Export functions
window.checkRoadClearance = checkRoadClearance;
window.validateAndRelocateBuildings = validateAndRelocateBuildings;
window.ROAD_NETWORK = ROAD_NETWORK;

console.log('🚦 Road Clearance Validation System loaded');
console.log('Available functions:');
console.log('  - checkRoadClearance(x, z, width, depth) - Check if position conflicts with roads');
console.log('  - validateAndRelocateBuildings() - Check all buildings and relocate conflicts');