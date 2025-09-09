// DEBUG SCRIPT - Tìm tất cả data center objects
function debugDataCenterPositions() {
    console.log("=== DATA CENTER DEBUG ANALYSIS ===");
    
    let foundObjects = [];
    
    // Tìm tất cả objects có liên quan đến data center
    scene.traverse((obj) => {
        if (obj.name && (
            obj.name.toLowerCase().includes('data') ||
            obj.name.toLowerCase().includes('center') ||
            obj.name.toLowerCase().includes('transparent') ||
            obj.userData.type === 'datacenter'
        )) {
            foundObjects.push({
                name: obj.name,
                type: obj.type,
                position: obj.position.clone(),
                worldPosition: obj.getWorldPosition(new THREE.Vector3()),
                parent: obj.parent?.name || 'scene',
                userData: obj.userData,
                visible: obj.visible,
                material: obj.material?.type,
                transparent: obj.material?.transparent
            });
        }
    });
    
    console.log(`Found ${foundObjects.length} data center related objects:`);
    foundObjects.forEach((obj, i) => {
        console.log(`${i+1}. ${obj.name}`);
        console.log(`   Position: (${obj.position.x}, ${obj.position.y}, ${obj.position.z})`);
        console.log(`   World Pos: (${obj.worldPosition.x}, ${obj.worldPosition.y}, ${obj.worldPosition.z})`);
        console.log(`   Parent: ${obj.parent}`);
        console.log(`   Material: ${obj.material} | Transparent: ${obj.transparent}`);
        console.log("---");
    });
    
    return foundObjects;
}

// Kiểm tra water boundary
function checkWaterBoundary() {
    console.log("=== WATER BOUNDARY ANALYSIS ===");
    
    // Tìm các objects có màu xanh (water)
    scene.traverse((obj) => {
        if (obj.material && 
            obj.material.color && 
            (obj.material.color.b > 0.8 && obj.material.color.g > 0.8)) {
            
            const box = new THREE.Box3().setFromObject(obj);
            console.log("Water object found:");
            console.log(`Min: (${box.min.x}, ${box.min.z})`);
            console.log(`Max: (${box.max.x}, ${box.max.z})`);
        }
    });
}

// Chạy debug
debugDataCenterPositions();
checkWaterBoundary();
