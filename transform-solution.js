// SOLUTION 3: Transform Matrix Override
function applyTransformMatrix() {
    const SAFE_X = 400;
    const SAFE_Z = 50;
    
    scene.traverse((obj) => {
        if (obj.material && obj.material.transparent === true) {
            
            // Tạo transform matrix để di chuyển
            const translateMatrix = new THREE.Matrix4();
            translateMatrix.makeTranslation(SAFE_X, 0, SAFE_Z);
            
            // Apply transform
            obj.matrix.copy(translateMatrix);
            obj.matrixAutoUpdate = false; // Prevent auto-update từ position
            
            console.log(`Applied transform matrix to transparent object`);
        }
    });
}
