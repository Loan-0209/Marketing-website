// SOLUTION 2: Hide/mask parts without deleting
function maskWaterOverlap() {
    const WATER_BOUNDARY = 300;
    
    scene.traverse((obj) => {
        if (obj.material && obj.position && obj.position.x < WATER_BOUNDARY) {
            
            // Kiểm tra nếu là phần data center trong vùng nước
            if (obj.userData.type === 'datacenter' ||
                (obj.material.transparent && obj.material.opacity < 1)) {
                
                // Tạo clipping plane để ẩn phần nằm trên nước
                const clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -WATER_BOUNDARY);
                
                // Apply clipping plane to material
                if (obj.material.clippingPlanes) {
                    obj.material.clippingPlanes.push(clippingPlane);
                } else {
                    obj.material.clippingPlanes = [clippingPlane];
                }
                
                obj.material.clipShadows = true;
                
                console.log(`Applied clipping to ${obj.name || 'unnamed'}`);
            }
        }
    });
    
    // Enable global clipping
    renderer.localClippingEnabled = true;
}
