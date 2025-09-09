// ========================================
// APPLY BUILDING-RIVER COLLISION FIX TO 3D SMART CITY
// ========================================

/**
 * Integration script to apply collision detection and fixes to the existing 3D Smart City
 * This script modifies the building creation process to avoid river overlaps
 */

// Load the collision detection system first
if (typeof fixBuildingRiverCollisions === 'undefined') {
    console.error('Please load building-river-collision-fix.js first');
}

/**
 * Enhanced building creation function with collision avoidance
 * This replaces or enhances the original createBuildings function
 */
function createBuildingsWithCollisionAvoidance() {
    console.log('🏗️ Creating buildings with collision avoidance system...');
    
    if (!window.scene) {
        console.error('Scene not available');
        return;
    }
    
    // Original building positions from the 3D Smart City code
    const originalBuildingPositions = [
        // PHASE 1 - COMPLETED (Blue/Gray)
        { x: -150, z: -150, type: 'office_tower', phase: 'phase1' },
        { x: -120, z: -150, type: 'tech_campus', phase: 'phase1' },
        { x: 150, z: 150, type: 'residential_tower', phase: 'phase1' },
        { x: 120, z: 150, type: 'residential_tower', phase: 'phase1' },
        { x: -180, z: 100, type: 'commercial_center', phase: 'phase1' },
        { x: -150, z: 120, type: 'medical_center', phase: 'phase1' },
        
        // PHASE 2 - UNDER CONSTRUCTION (Orange)
        { x: -80, z: -120, type: 'office_tower', phase: 'phase2' },
        { x: -50, z: -100, type: 'residential_tower', phase: 'phase2' },
        { x: 80, z: -120, type: 'tech_campus', phase: 'phase2' },
        { x: 100, z: -80, type: 'commercial_center', phase: 'phase2' },
        { x: -120, z: 80, type: 'office_tower', phase: 'phase2' },
        { x: -80, z: 100, type: 'education_hub', phase: 'phase2' },
        { x: 50, z: 120, type: 'medical_center', phase: 'phase2' },
        { x: 80, z: 100, type: 'residential_tower', phase: 'phase2' },
        
        // PHASE 3 - PLANNED (Transparent wireframe)
        { x: -50, z: -50, type: 'tech_campus', phase: 'phase3' },
        { x: 20, z: -30, type: 'office_tower', phase: 'phase3' },
        { x: -20, z: 20, type: 'commercial_center', phase: 'phase3' },
        { x: 50, z: -150, type: 'office_tower', phase: 'phase3' },
        { x: -50, z: 150, type: 'commercial_center', phase: 'phase3' },
        { x: 180, z: 0, type: 'education_hub', phase: 'phase3' } // This one might overlap with river!
    ];
    
    // Building type configurations
    const buildingTypes = {
        office_tower: { 
            minHeight: 40, maxHeight: 80, 
            color: 0x4a90e2, 
            size: { width: 12, depth: 12 }
        },
        residential_tower: { 
            minHeight: 30, maxHeight: 60, 
            color: 0xf5a623,
            size: { width: 15, depth: 15 }
        },
        tech_campus: { 
            minHeight: 15, maxHeight: 25, 
            color: 0x7ed321,
            size: { width: 20, depth: 20 }
        },
        commercial_center: { 
            minHeight: 20, maxHeight: 35, 
            color: 0xbd10e0,
            size: { width: 18, depth: 18 }
        },
        medical_center: { 
            minHeight: 25, maxHeight: 40, 
            color: 0xff0000,
            size: { width: 16, depth: 16 }
        },
        education_hub: { 
            minHeight: 20, maxHeight: 30, 
            color: 0x50e3c2,
            size: { width: 22, depth: 22 }
        }
    };
    
    const validatedBuildings = [];
    const relocatedBuildings = [];
    
    // Process each building position
    for (const building of originalBuildingPositions) {
        const buildingConfig = buildingTypes[building.type];
        if (!buildingConfig) {
            console.warn(`Unknown building type: ${building.type}`);
            continue;
        }
        
        // Check if original position is safe
        const validation = validateBuildingPlacement(building.x, building.z, building);
        
        let finalPosition;
        if (validation.valid) {
            finalPosition = { x: building.x, z: building.z };
            console.log(`✅ Building ${building.type} at (${building.x}, ${building.z}) - Position is safe`);
        } else {
            // Find a safe alternative position
            console.warn(`⚠️ Building ${building.type} at (${building.x}, ${building.z}) - ${validation.reason}`);
            
            const safePosition = findSafeBuildingPosition(
                building, 
                validatedBuildings.map(b => ({ x: b.x, z: b.z }))
            );
            
            finalPosition = safePosition;
            relocatedBuildings.push({
                original: { x: building.x, z: building.z },
                relocated: finalPosition,
                type: building.type,
                reason: validation.reason
            });
            
            console.log(`🔄 Relocated ${building.type} from (${building.x}, ${building.z}) to (${finalPosition.x.toFixed(1)}, ${finalPosition.z.toFixed(1)})`);
        }
        
        // Create the building at the validated position
        const createdBuilding = createSingleBuilding(
            finalPosition.x, 
            finalPosition.z, 
            building.type, 
            building.phase, 
            buildingConfig
        );
        
        if (createdBuilding) {
            validatedBuildings.push({
                x: finalPosition.x,
                z: finalPosition.z,
                type: building.type,
                phase: building.phase,
                object: createdBuilding
            });
        }
    }
    
    console.log(`🎯 Building creation complete:`);
    console.log(`  - Total buildings: ${validatedBuildings.length}`);
    console.log(`  - Relocated buildings: ${relocatedBuildings.length}`);
    console.log(`  - Safe positions: ${validatedBuildings.length - relocatedBuildings.length}`);
    
    if (relocatedBuildings.length > 0) {
        console.log(`\n📍 Relocated buildings summary:`);
        relocatedBuildings.forEach((building, index) => {
            console.log(`  ${index + 1}. ${building.type}: (${building.original.x}, ${building.original.z}) → (${building.relocated.x.toFixed(1)}, ${building.relocated.z.toFixed(1)})`);
            console.log(`     Reason: ${building.reason}`);
        });
    }
    
    return {
        total: validatedBuildings.length,
        relocated: relocatedBuildings.length,
        buildings: validatedBuildings,
        relocations: relocatedBuildings
    };
}

/**
 * Creates a single building with proper materials and positioning
 */
function createSingleBuilding(x, z, type, phase, config) {
    if (!window.scene) return null;
    
    // Calculate building height
    const height = config.minHeight + Math.random() * (config.maxHeight - config.minHeight);
    
    // Create building geometry
    const geometry = new THREE.BoxGeometry(config.size.width, height, config.size.depth);
    
    // Create material based on phase
    let material;
    switch (phase) {
        case 'phase1': // Completed - solid colors
            material = new THREE.MeshLambertMaterial({ 
                color: config.color,
                transparent: false
            });
            break;
            
        case 'phase2': // Under construction - orange with construction elements
            material = new THREE.MeshLambertMaterial({ 
                color: 0xff8c00, // Orange for construction
                transparent: false
            });
            break;
            
        case 'phase3': // Planned - transparent wireframe
            material = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00, // Green for planned
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            break;
            
        default:
            material = new THREE.MeshLambertMaterial({ color: config.color });
    }
    
    // Create building mesh
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height / 2, z);
    
    // Add metadata for identification
    building.userData = {
        type: `building_${type}`,
        buildingType: type,
        phase: phase,
        originalPosition: { x, z },
        height: height,
        isBuilding: true
    };
    
    // Add construction elements for phase 2 buildings
    if (phase === 'phase2') {
        addConstructionElements(building, height);
    }
    
    window.scene.add(building);
    return building;
}

/**
 * Adds construction elements to phase 2 buildings
 */
function addConstructionElements(building, height) {
    // Add crane
    const craneGroup = new THREE.Group();
    
    // Crane base
    const craneBase = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 2, 3, 8),
        new THREE.MeshLambertMaterial({ color: 0x444444 })
    );
    craneBase.position.set(0, height / 2 + 1.5, 0);
    
    // Crane arm
    const craneArm = new THREE.Mesh(
        new THREE.BoxGeometry(15, 0.5, 1),
        new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    craneArm.position.set(5, height / 2 + 4, 0);
    
    craneGroup.add(craneBase);
    craneGroup.add(craneArm);
    
    building.add(craneGroup);
}

/**
 * Quick fix function - applies collision detection to existing scene
 */
function quickFixExistingBuildings() {
    console.log('🚀 Quick Fix: Applying collision detection to existing buildings...');
    
    if (typeof fixBuildingRiverCollisions === 'undefined') {
        console.error('Collision system not loaded. Please load building-river-collision-fix.js first');
        return;
    }
    
    // Apply fixes to existing buildings
    const result = fixBuildingRiverCollisions();
    
    console.log('📊 Quick Fix Results:');
    console.log(`  - Total buildings processed: ${result.totalBuildings}`);
    console.log(`  - Buildings relocated: ${result.relocatedBuildings}`);
    console.log(`  - Buildings in safe positions: ${result.safeBuildings}`);
    
    return result;
}

/**
 * Complete rebuild function - removes existing buildings and creates new ones with collision avoidance
 */
function rebuildCityWithCollisionAvoidance() {
    console.log('🏗️ Complete Rebuild: Creating new city with collision avoidance...');
    
    if (!window.scene) {
        console.error('Scene not available');
        return;
    }
    
    // Remove existing buildings
    const buildingsToRemove = [];
    window.scene.traverse((child) => {
        if (child.userData && (child.userData.isBuilding || 
            (child.userData.type && child.userData.type.includes('building')))) {
            buildingsToRemove.push(child);
        }
    });
    
    buildingsToRemove.forEach(building => {
        window.scene.remove(building);
    });
    
    console.log(`Removed ${buildingsToRemove.length} existing buildings`);
    
    // Create new buildings with collision avoidance
    const result = createBuildingsWithCollisionAvoidance();
    
    console.log('🎉 City rebuild complete!');
    return result;
}

// Make functions globally available
window.createBuildingsWithCollisionAvoidance = createBuildingsWithCollisionAvoidance;
window.quickFixExistingBuildings = quickFixExistingBuildings;
window.rebuildCityWithCollisionAvoidance = rebuildCityWithCollisionAvoidance;

console.log('🏗️ Building-River Collision Fix Integration loaded');
console.log('Available functions:');
console.log('  - quickFixExistingBuildings() - Fix existing buildings without rebuilding');
console.log('  - rebuildCityWithCollisionAvoidance() - Complete rebuild with collision avoidance');
console.log('  - createBuildingsWithCollisionAvoidance() - Create new buildings safely');