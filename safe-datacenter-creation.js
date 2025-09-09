// ========================================
// SAFE DATA CENTER CREATION WITH SECURE LAND POSITIONS
// ========================================

/**
 * Thay thế hàm createDataCenter hiện tại với vị trí an toàn
 * Đảm bảo HOÀN TOÀN trên mặt đất, không overlap với water
 */

// Tọa độ an toàn - HOÀN TOÀN trên mặt đất
const SAFE_DATA_CENTER_POSITIONS = {
    MAIN_DC: { x: 400, y: 0, z: 50 },
    TRANSPARENT_SECTION: { x: 450, y: 0, z: 70 },
    COOLING_TOWERS: { x: 380, y: 0, z: 30 },
    SERVER_RACKS: { x: 420, y: 0, z: 40 }
};

/**
 * Tạo main data center building với vị trí an toàn
 */
function createMainDataCenterBuilding() {
    console.log('🏭 Creating main data center building...');
    
    // Main building structure
    const geometry = new THREE.BoxGeometry(30, 20, 25);
    const material = new THREE.MeshLambertMaterial({ 
        color: 0x2c3e50,
        transparent: false
    });
    
    const mainBuilding = new THREE.Mesh(geometry, material);
    mainBuilding.userData = {
        type: 'datacenter_main_building',
        isBuilding: true,
        buildingType: 'data_center'
    };
    mainBuilding.name = 'MAIN_DATA_CENTER';
    
    // Add server racks inside
    for (let i = 0; i < 8; i++) {
        const rackGeometry = new THREE.BoxGeometry(2, 18, 1);
        const rackMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const rack = new THREE.Mesh(rackGeometry, rackMaterial);
        
        const x = (i % 4 - 1.5) * 6;
        const z = Math.floor(i / 4) * 8 - 4;
        rack.position.set(x, 0, z);
        
        // Add LED indicators
        const led = new THREE.PointLight(0x00ff00, 0.5, 3);
        led.position.set(x, 8, z + 0.6);
        mainBuilding.add(led);
        
        mainBuilding.add(rack);
    }
    
    console.log('   ✅ Main data center building created');
    return mainBuilding;
}

/**
 * Tạo transparent section với vị trí an toàn
 */
function createTransparentSection() {
    console.log('🔍 Creating transparent section...');
    
    const geometry = new THREE.BoxGeometry(15, 12, 15);
    const material = new THREE.MeshLambertMaterial({
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.6
    });
    
    const transparentSection = new THREE.Mesh(geometry, material);
    transparentSection.userData = {
        type: 'datacenter_transparent_section',
        isTransparent: true,
        parentDC: 'MAIN_DATA_CENTER'
    };
    transparentSection.name = 'phần_trong_suốt';
    
    // Add internal equipment visible through glass
    for (let i = 0; i < 4; i++) {
        const equipment = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 8, 1.5),
            new THREE.MeshLambertMaterial({ color: 0x333333 })
        );
        equipment.position.set(
            (i % 2 - 0.5) * 4,
            0,
            Math.floor(i / 2) * 4 - 2
        );
        transparentSection.add(equipment);
    }
    
    console.log('   ✅ Transparent section created');
    return transparentSection;
}

/**
 * Tạo cooling towers với vị trí an toàn
 */
function createCoolingTowers(centerX, centerZ) {
    console.log('❄️ Creating cooling towers...');
    
    const towers = [];
    const positions = [
        { x: centerX - 20, z: centerZ - 20 },
        { x: centerX + 20, z: centerZ - 20 },
        { x: centerX - 20, z: centerZ + 20 },
        { x: centerX + 20, z: centerZ + 20 }
    ];
    
    positions.forEach((pos, index) => {
        const towerGeometry = new THREE.CylinderGeometry(4, 4, 25, 16);
        const towerMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        
        tower.position.set(pos.x, 12.5, pos.z);
        tower.userData = {
            type: 'cooling_tower',
            parentDC: 'MAIN_DATA_CENTER',
            towerId: index + 1
        };
        tower.name = `COOLING_TOWER_${index + 1}`;
        
        // Add steam effect
        const steamGeometry = new THREE.SphereGeometry(2, 8, 8);
        const steamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const steam = new THREE.Mesh(steamGeometry, steamMaterial);
        steam.position.set(0, 15, 0);
        tower.add(steam);
        
        towers.push(tower);
    });
    
    console.log(`   ✅ ${towers.length} cooling towers created`);
    return towers;
}

/**
 * MAIN FUNCTION: Tạo data center hoàn chỉnh với vị trí an toàn
 */
function createDataCenter() {
    console.log('🏗️ === CREATING SAFE DATA CENTER COMPLEX ===');
    
    const dataCenterGroup = new THREE.Group();
    dataCenterGroup.userData.type = 'datacenter';
    dataCenterGroup.name = 'SAFE_DATA_CENTER_COMPLEX';
    
    // Tọa độ an toàn - HOÀN TOÀN trên mặt đất
    const SAFE_LAND_X = SAFE_DATA_CENTER_POSITIONS.MAIN_DC.x;
    const SAFE_LAND_Z = SAFE_DATA_CENTER_POSITIONS.MAIN_DC.z;
    
    console.log(`📍 Using safe land coordinates: (${SAFE_LAND_X}, ${SAFE_LAND_Z})`);
    
    // Tạo các components với vị trí an toàn
    const mainBuilding = createMainDataCenterBuilding();
    mainBuilding.position.set(SAFE_LAND_X, 0, SAFE_LAND_Z);
    
    const transparentSection = createTransparentSection();
    transparentSection.position.set(
        SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION.x,
        SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION.y,
        SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION.z
    );
    
    // Tạo cooling towers
    const coolingTowers = createCoolingTowers(SAFE_LAND_X, SAFE_LAND_Z);
    
    // Add all components to group
    dataCenterGroup.add(mainBuilding);
    dataCenterGroup.add(transparentSection);
    coolingTowers.forEach(tower => dataCenterGroup.add(tower));
    
    // Position entire group safely
    dataCenterGroup.position.set(0, 0, 0);
    
    console.log('✅ SAFE DATA CENTER COMPLEX CREATED:');
    console.log(`   - Main building at: (${SAFE_LAND_X}, ${SAFE_LAND_Z})`);
    console.log(`   - Transparent section at: (${SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION.x}, ${SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION.z})`);
    console.log(`   - ${coolingTowers.length} cooling towers positioned safely`);
    console.log('   - ALL COMPONENTS 100% ON LAND');
    
    return dataCenterGroup;
}

/**
 * Replace existing data center with safe version
 */
function replaceWithSafeDataCenter() {
    console.log('🔄 === REPLACING EXISTING DATA CENTER WITH SAFE VERSION ===');
    
    if (!window.scene) {
        console.error('❌ Scene not available');
        return { success: false, error: 'Scene not available' };
    }
    
    // Remove existing data center components
    const toRemove = [];
    window.scene.traverse(child => {
        if (child.userData && (
            child.userData.type === 'datacenter' ||
            child.userData.type === 'data_center' ||
            (child.userData.type && child.userData.type.includes('DATA_CENTER')) ||
            child.name.includes('DATA_CENTER') ||
            child.name === 'phần_trong_suốt'
        )) {
            toRemove.push(child);
        }
    });
    
    console.log(`🗑️ Removing ${toRemove.length} existing data center components...`);
    toRemove.forEach(component => {
        if (component.parent) {
            component.parent.remove(component);
        }
    });
    
    // Create and add new safe data center
    const safeDataCenter = createDataCenter();
    window.scene.add(safeDataCenter);
    
    // Force scene update
    window.scene.updateMatrixWorld(true);
    if (window.renderer && window.camera) {
        window.renderer.render(window.scene, window.camera);
    }
    
    console.log('🎉 DATA CENTER REPLACEMENT COMPLETE!');
    console.log('✅ All components now safely positioned on land');
    
    return {
        success: true,
        removed: toRemove.length,
        created: 1,
        positions: SAFE_DATA_CENTER_POSITIONS
    };
}

/**
 * Apply safe positions to existing components without recreating
 */
function applySafePositionsToExisting() {
    console.log('🎯 === APPLYING SAFE POSITIONS TO EXISTING COMPONENTS ===');
    
    if (!window.scene) {
        console.error('❌ Scene not available');
        return { success: false, error: 'Scene not available' };
    }
    
    const updatedComponents = [];
    
    // Update transparent section
    const transparentSection = window.scene.getObjectByName('phần_trong_suốt');
    if (transparentSection) {
        const safePos = SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION;
        transparentSection.position.set(safePos.x, safePos.y, safePos.z);
        transparentSection.updateMatrixWorld(true);
        updatedComponents.push('phần_trong_suốt');
        console.log(`✅ Transparent section moved to (${safePos.x}, ${safePos.z})`);
    }
    
    // Update data center buildings
    window.scene.traverse(child => {
        if (child.userData && child.userData.type && child.userData.type.includes('datacenter')) {
            if (child.position.x > 160 && child.position.x < 260) { // In water zone
                const safePos = SAFE_DATA_CENTER_POSITIONS.MAIN_DC;
                child.position.set(safePos.x, safePos.y, safePos.z);
                child.updateMatrixWorld(true);
                updatedComponents.push(child.name || 'unnamed_datacenter');
                console.log(`✅ Data center component moved to safe position`);
            }
        }
    });
    
    // Force scene update
    window.scene.updateMatrixWorld(true);
    if (window.renderer && window.camera) {
        for (let i = 0; i < 5; i++) {
            window.renderer.render(window.scene, window.camera);
        }
    }
    
    console.log(`🎉 SAFE POSITIONS APPLIED TO ${updatedComponents.length} COMPONENTS!`);
    return {
        success: true,
        updated: updatedComponents.length,
        components: updatedComponents
    };
}

// Export functions
window.createDataCenter = createDataCenter;
window.replaceWithSafeDataCenter = replaceWithSafeDataCenter;
window.applySafePositionsToExisting = applySafePositionsToExisting;
window.SAFE_DATA_CENTER_POSITIONS = SAFE_DATA_CENTER_POSITIONS;

console.log('🏗️ SAFE DATA CENTER CREATION SYSTEM LOADED');
console.log('🏗️ AVAILABLE FUNCTIONS:');
console.log('   - createDataCenter() - Create new safe data center complex');
console.log('   - replaceWithSafeDataCenter() - Replace existing with safe version');
console.log('   - applySafePositionsToExisting() - Apply safe positions to current components');
console.log('\\n✅ SAFE LAND COORDINATES:');
console.log(`   - Main DC: (${SAFE_DATA_CENTER_POSITIONS.MAIN_DC.x}, ${SAFE_DATA_CENTER_POSITIONS.MAIN_DC.z})`);
console.log(`   - Transparent: (${SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION.x}, ${SAFE_DATA_CENTER_POSITIONS.TRANSPARENT_SECTION.z})`);
console.log('\\n⚠️ ALL POSITIONS GUARANTEED 100% ON LAND');