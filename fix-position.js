// SOLUTION 1: Move existing objects without deleting
function forceRepositionDataCenter() {
    const SAFE_X = 400;
    const SAFE_Z = 50;
    const WATER_BOUNDARY = 300; // Adjust theo layout thực tế
    
    // Tìm và di chuyển TẤT CẢ objects hiện có
    scene.traverse((obj) => {
        // Kiểm tra nếu object nằm trong vùng nước
        if (obj.position && obj.position.x < WATER_BOUNDARY) {
            
            // Chỉ di chuyển objects liên quan đến data center
            if (obj.userData.type === 'datacenter' ||
                obj.name?.toLowerCase().includes('data') ||
                obj.name?.toLowerCase().includes('transparent') ||
                (obj.material && obj.material.transparent === true && obj.material.opacity < 1)) {
                
                // Tính toán vị trí mới an toàn
                const offsetX = SAFE_X - obj.position.x;
                const offsetZ = SAFE_Z - obj.position.z;
                
                // Di chuyển object
                obj.position.x = SAFE_X + (Math.random() * 20 - 10); // Random small offset
                obj.position.z = SAFE_Z + (Math.random() * 20 - 10);
                
                // Nếu là group, di chuyển tất cả children
                if (obj.children && obj.children.length > 0) {
                    obj.children.forEach(child => {
                        if (child.position) {
                            child.position.x += offsetX;
                            child.position.z += offsetZ;
                        }
                    });
                }
                
                console.log(`Moved ${obj.name || 'unnamed object'} to safe position`);
            }
        }
    });
    
    // Force update
    scene.updateMatrixWorld(true);
    renderer.render(scene, camera);
}
