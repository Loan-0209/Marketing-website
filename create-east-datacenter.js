// Script tạo data center mới tại vị trí chính xác phía ĐÔNG
// Paste vào console sau khi đã xóa data center cũ

function createNewDataCenterEast() {
    console.log("🏗️ Creating NEW Data Centers at EAST side...");
    
    // Vị trí phía ĐÔNG rõ ràng
    const dataCenters = [
        { 
            x: 180, z: 0, 
            width: 15, height: 25, depth: 12, 
            color: 0x00CED1, 
            name: "EAST-DC-01" 
        },
        { 
            x: 200, z: 20, 
            width: 18, height: 30, depth: 15, 
            color: 0x40E0D0, 
            name: "EAST-DC-02" 
        },
        { 
            x: 190, z: -25, 
            width: 16, height: 28, depth: 13, 
            color: 0x48D1CC, 
            name: "EAST-DC-03" 
        }
    ];
    
    dataCenters.forEach((dc, index) => {
        // Main building
        const dcGeometry = new THREE.BoxGeometry(dc.width, dc.height, dc.depth);
        const dcMaterial = new THREE.MeshLambertMaterial({ 
            color: dc.color,
            transparent: true,
            opacity: 0.9
        });
        const dcBuilding = new THREE.Mesh(dcGeometry, dcMaterial);
        
        // Position
        dcBuilding.position.set(dc.x, dc.height/2, dc.z);
        dcBuilding.castShadow = true;
        dcBuilding.receiveShadow = true;
        dcBuilding.userData = { 
            type: 'data_center_complex', 
            name: dc.name,
            id: `east_dc_${index}` 
        };
        
        scene.add(dcBuilding);
        
        // Add glowing effect
        const glowGeometry = new THREE.BoxGeometry(dc.width + 2, dc.height + 2, dc.depth + 2);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: dc.color,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.set(dc.x, dc.height/2, dc.z);
        glowMesh.userData = { type: 'data_center_glow' };
        scene.add(glowMesh);
        
        // Add label/sign
        const labelGeometry = new THREE.PlaneGeometry(10, 3);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(dc.x, dc.height + 3, dc.z);
        label.userData = { type: 'data_center_label' };
        scene.add(label);
        
        console.log(`✅ CREATED: ${dc.name} at (${dc.x}, ${dc.height/2}, ${dc.z})`);
    });
    
    // Create platform base
    const platformGeometry = new THREE.PlaneGeometry(60, 80);
    const platformMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x90EE90,
        transparent: true,
        opacity: 0.4
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.rotation.x = -Math.PI / 2;
    platform.position.set(190, 0.1, 0);
    platform.userData = { type: 'east_platform' };
    scene.add(platform);
    
    console.log("🎯 Data Centers created at EAST coordinates (x: 180-200)");
    console.log("📹 Use mouse to pan camera to the RIGHT (EAST) to see them");
    
    // Auto-focus camera on data centers
    if (typeof camera !== 'undefined') {
        camera.position.set(250, 50, 50);
        camera.lookAt(190, 15, 0);
        console.log("📷 Camera auto-focused on EAST data centers");
    }
}

createNewDataCenterEast();
