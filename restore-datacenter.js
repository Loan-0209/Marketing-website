// Chạy trong console để tạo function bị mất:
function restoreOriginalDataCenters() {
    console.log('Creating original data centers...');
    
    if (!window.scene) {
        console.error('Scene not available');
        return;
    }
    
    // Tạo data center cluster ở phía đông thành phố
    const dataCenterGroup = new THREE.Group();
    dataCenterGroup.name = 'DataCenterCluster';
    
    // Tạo 4 data center buildings (DATA_CENTER_01-04)
    for (let i = 0; i < 4; i++) {
        const dataCenterBuilding = new THREE.Group();
        dataCenterBuilding.name = `DATA_CENTER_0${i + 1}`;
        
        // Main building structure
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(8, 6, 12),
            new THREE.MeshLambertMaterial({ color: 0x2c3e50 })
        );
        building.position.set(20 + i * 10, 3, -15);
        
        // Server racks inside
        const serverGroup = new THREE.Group();
        for (let j = 0; j < 12; j++) {
            const server = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 1.8, 0.8),
                new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
            );
            server.position.set(
                (j % 4) * 1.5 - 2.25,
                0.9,
                Math.floor(j / 4) * 1.2 - 1.2
            );
            
            // Server status lights
            const light = new THREE.PointLight(
                Math.random() > 0.5 ? 0x00ff00 : 0x0066ff,
                0.3,
                2
            );
            light.position.copy(server.position);
            light.position.y += 0.8;
            
            serverGroup.add(server);
            serverGroup.add(light);
        }
        
        dataCenterBuilding.add(building);
        dataCenterBuilding.add(serverGroup);
        dataCenterGroup.add(dataCenterBuilding);
    }
    
    window.scene.add(dataCenterGroup);
    
    console.log('Data centers restored successfully');
    return dataCenterGroup;
}

// Tạo function để recreate toàn bộ Smart City
function recreateCompleteSmartCity() {
    console.log('Recreating complete Smart City...');
    
    if (!window.scene) {
        console.error('Scene not available');
        return;
    }
    
    // Clear current scene
    while (window.scene.children.length > 0) {
        window.scene.remove(window.scene.children[0]);
    }
    
    // 1. Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    window.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 25);
    directionalLight.castShadow = true;
    window.scene.add(directionalLight);
    
    // 2. Create ground/streets
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshLambertMaterial({ color: 0x555555 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    window.scene.add(ground);
    
    // 3. Create street grid
    for (let x = -80; x <= 80; x += 20) {
        const street = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 160),
            new THREE.MeshLambertMaterial({ color: 0x333333 })
        );
        street.rotation.x = -Math.PI / 2;
        street.position.set(x, 0, 0);
        window.scene.add(street);
    }
    
    for (let z = -80; z <= 80; z += 20) {
        const street = new THREE.Mesh(
            new THREE.PlaneGeometry(160, 2),
            new THREE.MeshLambertMaterial({ color: 0x333333 })
        );
        street.rotation.x = -Math.PI / 2;
        street.position.set(0, 0, z);
        window.scene.add(street);
    }
    
    // 4. Create buildings
    const buildingColors = [0x8e44ad, 0x3498db, 0xe67e22, 0x2ecc71, 0xe74c3c];
    for (let i = 0; i < 25; i++) {
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(
                4 + Math.random() * 4,
                5 + Math.random() * 15,
                4 + Math.random() * 4
            ),
            new THREE.MeshLambertMaterial({ 
                color: buildingColors[Math.floor(Math.random() * buildingColors.length)] 
            })
        );
        
        let x, z;
        do {
            x = (Math.random() - 0.5) * 140;
            z = (Math.random() - 0.5) * 140;
        } while (x > 15 && x < 55 && z > -25 && z < -5); // Avoid data center area
        
        building.position.set(x, building.geometry.parameters.height / 2, z);
        window.scene.add(building);
    }
    
    // 5. Create parks (green areas)
    for (let i = 0; i < 12; i++) {
        const park = new THREE.Mesh(
            new THREE.CircleGeometry(3 + Math.random() * 3, 8),
            new THREE.MeshLambertMaterial({ color: 0x27ae60 })
        );
        park.rotation.x = -Math.PI / 2;
        park.position.set(
            (Math.random() - 0.5) * 120,
            0.1,
            (Math.random() - 0.5) * 120
        );
        window.scene.add(park);
    }
    
    // 6. Restore data centers
    restoreOriginalDataCenters();
    
    // 7. Setup camera
    if (window.camera) {
        window.camera.position.set(30, 25, 30);
        window.camera.lookAt(0, 0, 0);
    }
    
    console.log('Complete Smart City recreated!');
    console.log('Scene children:', window.scene.children.length);
    
    // Force render
    if (window.renderer) {
        window.renderer.render(window.scene, window.camera);
    }
}

// Override the missing function
window.restoreOriginalDataCenters = restoreOriginalDataCenters;

// Execute the complete recreation
recreateCompleteSmartCity();