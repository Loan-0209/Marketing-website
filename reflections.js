// Hệ thống phản chiếu và hiệu ứng môi trường cho AI Campus 3D
function createReflectionSystem(scene, renderer, camera) {
    const reflectionSystem = {
        cubeCamera: null,
        cubeRenderTarget: null,
        update: null
    };
    
    // Tạo cube render target với độ phân giải cao
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });
    
    // Tạo cube camera
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);
    
    // Lưu trữ các tham chiếu
    reflectionSystem.cubeCamera = cubeCamera;
    reflectionSystem.cubeRenderTarget = cubeRenderTarget;
    
    // Hàm cập nhật phản chiếu
    reflectionSystem.update = function(deltaTime) {
        // Cập nhật vị trí của cube camera
        this.cubeCamera.position.set(0, 10, 0);
        
        // Ẩn tạm thời các đối tượng không cần phản chiếu
        const objectsToHide = findObjectsByType(scene, 'Mesh', ['LED', 'Ground']);
        objectsToHide.forEach(obj => {
            obj.visible = false;
        });
        
        // Cập nhật cube camera
        this.cubeCamera.update(renderer, scene);
        
        // Hiện lại các đối tượng đã ẩn
        objectsToHide.forEach(obj => {
            obj.visible = true;
        });
        
        // Áp dụng environment map cho tất cả các vật liệu kính
        const glassMaterials = findMaterialsByType(scene, 'MeshPhysicalMaterial');
        glassMaterials.forEach(material => {
            material.envMap = this.cubeRenderTarget.texture;
            material.envMapIntensity = 1.0;
            material.needsUpdate = true;
        });
    };
    
    return reflectionSystem;
}

// Tìm các đối tượng theo loại
function findObjectsByType(scene, type, excludeNames = []) {
    const objects = [];
    
    scene.traverse(function(object) {
        if (object.type === type) {
            // Kiểm tra xem tên đối tượng có nằm trong danh sách loại trừ không
            let exclude = false;
            for (const name of excludeNames) {
                if (object.name.includes(name)) {
                    exclude = true;
                    break;
                }
            }
            
            if (!exclude) {
                objects.push(object);
            }
        }
    });
    
    return objects;
}

// Tìm các vật liệu theo loại
function findMaterialsByType(scene, materialType) {
    const materials = [];
    
    scene.traverse(function(object) {
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => {
                    if (mat.type === materialType) {
                        materials.push(mat);
                    }
                });
            } else if (object.material.type === materialType) {
                materials.push(object.material);
            }
        }
    });
    
    return materials;
}
