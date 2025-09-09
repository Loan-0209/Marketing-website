// Script để di chuyển các tòa nhà khỏi dòng sông
// =============================================

console.log('🏗️ === BẮT ĐẦU DI CHUYỂN TÒA NHÀ KHỎI SÔNG ===');

// Kiểm tra scene
if (!window.scene) {
    console.error('❌ Không tìm thấy scene!');
} else {
    // Vị trí sông (thường ở x = 210)
    const RIVER_X = 210;
    const SAFE_DISTANCE = 50; // Khoảng cách an toàn từ sông
    
    let movedCount = 0;
    const buildingsToMove = [];
    
    // Tìm tất cả các tòa nhà
    scene.traverse((object) => {
        if (object.type === 'Mesh' || object.type === 'Group') {
            // Kiểm tra nếu là tòa nhà (không phải ground, river, tree, etc.)
            if (object.userData && (
                object.userData.type === 'building' ||
                object.userData.type === 'datacenter' ||
                object.userData.buildingType ||
                object.name?.includes('building') ||
                object.name?.includes('Building') ||
                object.name?.includes('DATA_CENTER') ||
                object.name?.includes('tower') ||
                object.name?.includes('Tower')
            )) {
                // Kiểm tra nếu đang nằm gần sông
                if (Math.abs(object.position.x - RIVER_X) < SAFE_DISTANCE) {
                    buildingsToMove.push({
                        object: object,
                        oldPosition: object.position.clone(),
                        name: object.name || 'Unnamed Building'
                    });
                }
            }
            
            // Kiểm tra các tòa nhà dựa trên màu sắc và hình dạng
            if (object.geometry && 
                object.geometry.type === 'BoxGeometry' && 
                object.position.y > 5) { // Tòa nhà thường cao hơn 5 units
                
                if (Math.abs(object.position.x - RIVER_X) < SAFE_DISTANCE) {
                    buildingsToMove.push({
                        object: object,
                        oldPosition: object.position.clone(),
                        name: 'Building (detected by shape)'
                    });
                }
            }
        }
    });
    
    console.log(`📊 Tìm thấy ${buildingsToMove.length} tòa nhà cần di chuyển`);
    
    // Di chuyển các tòa nhà
    buildingsToMove.forEach((building, index) => {
        const oldX = building.object.position.x;
        let newX;
        
        // Nếu tòa nhà ở bên trái sông, di chuyển sang trái
        // Nếu ở bên phải sông, di chuyển sang phải
        if (oldX < RIVER_X) {
            newX = RIVER_X - SAFE_DISTANCE - 20 - (index * 30); // Di chuyển sang trái
        } else {
            newX = RIVER_X + SAFE_DISTANCE + 20 + (index * 30); // Di chuyển sang phải
        }
        
        // Nếu là data center, di chuyển đến vị trí đặc biệt
        if (building.name.includes('DATA_CENTER')) {
            newX = 400 + (index * 50); // Vị trí an toàn cho data center
        }
        
        building.object.position.x = newX;
        movedCount++;
        
        console.log(`✅ Di chuyển "${building.name}": x=${oldX} → x=${newX}`);
    });
    
    // Cập nhật ma trận và render lại
    scene.updateMatrixWorld(true);
    if (window.renderer && window.camera) {
        renderer.render(scene, camera);
    }
    
    console.log(`\n🎉 === HOÀN THÀNH DI CHUYỂN ===`);
    console.log(`📊 Tổng cộng: ${movedCount} tòa nhà đã được di chuyển`);
    
    // Kiểm tra lại xem còn tòa nhà nào trên sông không
    let remainingCount = 0;
    scene.traverse((object) => {
        if (object.position && Math.abs(object.position.x - RIVER_X) < 30 && 
            object.position.y > 5) {
            remainingCount++;
        }
    });
    
    if (remainingCount > 0) {
        console.warn(`⚠️ Vẫn còn ${remainingCount} đối tượng gần sông. Có thể cần kiểm tra thủ công.`);
    } else {
        console.log('✅ Không còn tòa nhà nào trên sông!');
    }
}

// Hàm helper để di chuyển một tòa nhà cụ thể
window.moveBuilding = function(buildingName, newX, newZ) {
    const building = scene.getObjectByName(buildingName);
    if (building) {
        const oldPos = building.position.clone();
        building.position.x = newX;
        if (newZ !== undefined) building.position.z = newZ;
        scene.updateMatrixWorld(true);
        renderer.render(scene, camera);
        console.log(`✅ Moved ${buildingName}: (${oldPos.x}, ${oldPos.z}) → (${newX}, ${newZ || building.position.z})`);
    } else {
        console.error(`❌ Building "${buildingName}" not found`);
    }
};

// Hàm để liệt kê tất cả tòa nhà
window.listAllBuildings = function() {
    console.log('📋 === DANH SÁCH TẤT CẢ TÒA NHÀ ===');
    let count = 0;
    scene.traverse((object) => {
        if (object.position && object.position.y > 5 && 
            (object.type === 'Mesh' || object.type === 'Group')) {
            count++;
            console.log(`${count}. ${object.name || 'Unnamed'} - Position: (${Math.round(object.position.x)}, ${Math.round(object.position.z)})`);
        }
    });
    console.log(`Tổng cộng: ${count} tòa nhà`);
};

console.log('\n💡 Các lệnh hữu ích:');
console.log('- moveBuilding("tên_tòa_nhà", x_mới, z_mới) - Di chuyển một tòa nhà cụ thể');
console.log('- listAllBuildings() - Liệt kê tất cả tòa nhà');