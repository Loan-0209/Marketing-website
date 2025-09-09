// ========================================
// APPLY NEW DATA CENTER CODE - DIRECT REPLACEMENT
// ========================================

/**
 * Thay thế đoạn code hiện tại với hàm createDataCenter mới
 * Sử dụng chính xác code do user cung cấp
 */

// Helper functions để support createDataCenter
function createMainDataCenterBuilding() {
    console.log('🏭 Creating main data center building...');
    
    const geometry = new THREE.BoxGeometry(30, 20, 25);
    const material = new THREE.MeshLambertMaterial({ 
        color: 0x2c3e50 // Dark blue-gray
    });
    
    const mainBuilding = new THREE.Mesh(geometry, material);
    mainBuilding.userData = {
        type: 'datacenter_main_building',
        isBuilding: true,
        buildingType: 'data_center'
    };
    mainBuilding.name = 'MAIN_DATA_CENTER_BUILDING';
    
    // Add server racks inside
    for (let i = 0; i < 8; i++) {
        const rackGeometry = new THREE.BoxGeometry(2, 18, 1);
        const rackMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const rack = new THREE.Mesh(rackGeometry, rackMaterial);
        
        const x = (i % 4 - 1.5) * 6;
        const z = Math.floor(i / 4) * 8 - 4;
        rack.position.set(x, 0, z);
        mainBuilding.add(rack);
        
        // LED indicators
        const led = new THREE.PointLight(0x00ff00, 0.5, 3);
        led.position.set(x, 8, z + 0.6);
        mainBuilding.add(led);
    }
    
    return mainBuilding;
}

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
    
    // Add visible equipment inside
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
    
    return transparentSection;
}

/**
 * CODE CHÍNH XÁC THEO YÊU CẦU CỦA USER:
 * Thay thế đoạn code hiện tại bằng hàm createDataCenter mới
 */
function createDataCenter() {
    const dataCenterGroup = new THREE.Group();
    dataCenterGroup.userData.type = 'datacenter';
    
    // Tọa độ an toàn - HOÀN TOÀN trên mặt đất
    const SAFE_LAND_X = 400;
    const SAFE_LAND_Z = 50;
    
    // Tạo các components với vị trí an toàn
    const mainBuilding = createMainDataCenterBuilding();
    mainBuilding.position.set(SAFE_LAND_X, 0, SAFE_LAND_Z);
    
    const transparentSection = createTransparentSection();
    transparentSection.position.set(SAFE_LAND_X + 50, 0, SAFE_LAND_Z + 20);
    
    dataCenterGroup.add(mainBuilding);
    dataCenterGroup.add(transparentSection);
    
    return dataCenterGroup;
}

/**
 * Apply the new createDataCenter code to current scene
 */
function applyNewDataCenterCode() {
    console.log('🔄 === APPLYING NEW DATA CENTER CODE ===');
    console.log('📝 Using exact code provided by user...');
    
    if (!window.scene) {
        console.error('❌ Scene not available');
        return { success: false, error: 'Scene not available' };
    }
    
    // Step 1: Remove existing data center components
    console.log('🗑️ Removing existing data center components...');
    const toRemove = [];
    
    window.scene.traverse(child => {
        if (child.userData && (
            child.userData.type === 'datacenter' ||
            child.userData.type === 'data_center' ||
            (child.userData.type && child.userData.type.includes('DATA_CENTER')) ||
            (child.name && (
                child.name.includes('DATA_CENTER') ||
                child.name.includes('datacenter') ||
                child.name === 'phần_trong_suốt'
            ))
        )) {
            toRemove.push(child);
        }
    });
    
    console.log(`   Found ${toRemove.length} components to remove`);
    toRemove.forEach(component => {
        if (component.parent) {
            component.parent.remove(component);
        }
    });
    
    // Step 2: Create new data center using the new code
    console.log('🏗️ Creating new data center with provided code...');
    const newDataCenter = createDataCenter();
    
    // Step 3: Add to scene
    window.scene.add(newDataCenter);
    
    // Step 4: Verify positions
    console.log('📍 VERIFYING POSITIONS:');
    newDataCenter.traverse(child => {
        if (child.position) {
            console.log(`   ${child.name || child.userData.type || 'component'}: (${child.position.x}, ${child.position.y}, ${child.position.z})`);
        }
    });
    
    // Step 5: Force scene update and render
    console.log('🔄 Updating scene and rendering...');
    window.scene.updateMatrixWorld(true);
    
    if (window.renderer && window.camera) {
        // Multiple renders to ensure visual update
        for (let i = 0; i < 5; i++) {
            window.renderer.render(window.scene, window.camera);
        }
    }
    
    // Step 6: Final validation
    const validation = {
        mainBuildingPosition: null,
        transparentSectionPosition: null,
        allOnLand: true
    };
    
    newDataCenter.traverse(child => {
        if (child.name === 'MAIN_DATA_CENTER_BUILDING') {
            validation.mainBuildingPosition = {
                x: child.position.x,
                z: child.position.z
            };
        }
        if (child.name === 'phần_trong_suốt') {
            validation.transparentSectionPosition = {
                x: child.position.x,
                z: child.position.z
            };
        }
        
        // Check if any component is in water zone
        if (child.position.x > 160 && child.position.x < 260) {
            validation.allOnLand = false;
        }
    });
    
    console.log('✅ NEW DATA CENTER CODE APPLIED SUCCESSFULLY!');
    console.log('📋 FINAL POSITIONS:');
    if (validation.mainBuildingPosition) {
        console.log(`   Main Building: (${validation.mainBuildingPosition.x}, ${validation.mainBuildingPosition.z}) ✅`);
    }
    if (validation.transparentSectionPosition) {
        console.log(`   Transparent Section: (${validation.transparentSectionPosition.x}, ${validation.transparentSectionPosition.z}) ✅`);
    }
    console.log(`   All components on land: ${validation.allOnLand ? '✅ YES' : '❌ NO'}`);
    
    return {
        success: true,
        removed: toRemove.length,
        created: 'New data center complex',
        positions: {
            mainBuilding: validation.mainBuildingPosition,
            transparentSection: validation.transparentSectionPosition
        },
        validation: validation
    };
}

/**
 * Quick execution function
 */
function executeNewDataCenterCode() {
    console.log('🚀 EXECUTING NEW DATA CENTER CODE...');
    return applyNewDataCenterCode();
}

// Override the existing createDataCenter function globally
window.createDataCenter = createDataCenter;
window.applyNewDataCenterCode = applyNewDataCenterCode;
window.executeNewDataCenterCode = executeNewDataCenterCode;
window.createMainDataCenterBuilding = createMainDataCenterBuilding;
window.createTransparentSection = createTransparentSection;

console.log('🔄 NEW DATA CENTER CODE LOADED');
console.log('📝 USING EXACT CODE PROVIDED BY USER:');
console.log('   - SAFE_LAND_X = 400');
console.log('   - SAFE_LAND_Z = 50'); 
console.log('   - Transparent section at (450, 70)');
console.log('\\n🚀 AVAILABLE FUNCTIONS:');
console.log('   - executeNewDataCenterCode() - Apply new code to scene');
console.log('   - createDataCenter() - New createDataCenter function');
console.log('\\n⚡ READY TO EXECUTE NEW DATA CENTER CODE');