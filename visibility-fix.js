// SOLUTION 5: Visibility Control (Preserve objects, hide problematic parts)
function hideWaterOverlap() {
    const WATER_BOUNDARY = 300;
    
    scene.traverse((obj) => {
        if (obj.position && obj.position.x < WATER_BOUNDARY) {
            
            // Hide objects trong vùng nước
            if (obj.material && obj.material.transparent === true) {
                obj.material.opacity = 0; // Làm trong suốt hoàn toàn
                obj.visible = false; // Hoặc ẩn hoàn toàn
                console.log(`Hidden object in water area: ${obj.name}`);
            }
        }
    });
}

// Duplicate safe objects trên mặt đất
function duplicateOnLand() {
    const SAFE_X = 400;
    const SAFE_Z = 50;
    
    scene.traverse((obj) => {
        if (obj.position && obj.position.x < 300 && 
            obj.material && obj.material.transparent === true) {
            
            // Clone object
            const clone = obj.clone();
            clone.position.set(SAFE_X, 0, SAFE_Z);
            
            // Add clone to scene
            scene.add(clone);
            
            // Hide original
            obj.visible = false;
            
            console.log(`Duplicated and repositioned: ${obj.name}`);
        }
    });
}
