// Tạo các tòa nhà kính cobalt blue
function createGlassBuildings(scene) {
    const buildings = [];
    
    // Tạo vật liệu kính cobalt blue
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0047AB,
        transparent: true,
        opacity: 0.8,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.95,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });
    
    // Tạo các tòa nhà với kích thước và vị trí khác nhau
    const buildingConfigs = [
        { x: 0, y: 0, z: 0, width: 10, height: 20, depth: 10 },
        { x: -15, y: 0, z: -15, width: 8, height: 15, depth: 8 },
        { x: 15, y: 0, z: -15, width: 8, height: 25, depth: 8 },
        { x: -15, y: 0, z: 15, width: 8, height: 18, depth: 8 },
        { x: 15, y: 0, z: 15, width: 8, height: 12, depth: 8 }
    ];
    
    buildingConfigs.forEach(config => {
        const building = createGlassBuilding(
            config.x, config.y, config.z,
            config.width, config.height, config.depth,
            glassMaterial, scene
        );
        buildings.push(building);
    });
    
    return buildings;
}

// Tạo một tòa nhà kính
function createGlassBuilding(x, y, z, width, height, depth, material, scene) {
    // Tạo khối chính của tòa nhà
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(buildingGeometry, material);
    building.position.set(x, y + height / 2, z);
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);
    
    // Tạo mái nhà
    const roofGeometry = new THREE.BoxGeometry(width + 2, 1, depth + 2);
    const roofMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, y + height + 0.5, z);
    roof.castShadow = true;
    scene.add(roof);
    
    // Tạo ăng-ten trên mái nhà
    const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(x, y + height + 3, z);
    antenna.castShadow = true;
    scene.add(antenna);
    
    // Tạo cửa sổ
    createWindows(x, y, z, width, height, depth, scene);
    
    return building;
}

// Tạo cửa sổ cho tòa nhà
function createWindows(x, y, z, buildingWidth, buildingHeight, buildingDepth, scene) {
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88CCFF,
        transparent: true,
        opacity: 0.9,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.95,
        reflectivity: 1.0
    });
    
    const windowWidth = 1;
    const windowHeight = 1.5;
    const windowDepth = 0.1;
    
    // Số cửa sổ trên mỗi mặt
    const windowsPerWidth = Math.floor(buildingWidth / 2);
    const windowsPerHeight = Math.floor(buildingHeight / 3);
    
    // Tạo cửa sổ trên các mặt của tòa nhà
    for (let i = 0; i < windowsPerWidth; i++) {
        for (let j = 0; j < windowsPerHeight; j++) {
            // Mặt trước
            createWindow(
                x - buildingWidth / 2 + i * 2 + 1,
                y + j * 3 + 2,
                z + buildingDepth / 2 + 0.1,
                windowWidth, windowHeight, windowDepth,
                windowMaterial, scene
            );
            
            // Mặt sau
            createWindow(
                x - buildingWidth / 2 + i * 2 + 1,
                y + j * 3 + 2,
                z - buildingDepth / 2 - 0.1,
                windowWidth, windowHeight, windowDepth,
                windowMaterial, scene
            );
            
            // Mặt trái
            createWindow(
                x - buildingWidth / 2 - 0.1,
                y + j * 3 + 2,
                z - buildingDepth / 2 + i * 2 + 1,
                windowDepth, windowHeight, windowWidth,
                windowMaterial, scene
            );
            
            // Mặt phải
            createWindow(
                x + buildingWidth / 2 + 0.1,
                y + j * 3 + 2,
                z - buildingDepth / 2 + i * 2 + 1,
                windowDepth, windowHeight, windowWidth,
                windowMaterial, scene
            );
        }
    }
}

// Tạo một cửa sổ
function createWindow(x, y, z, width, height, depth, material, scene) {
    const windowGeometry = new THREE.BoxGeometry(width, height, depth);
    const window = new THREE.Mesh(windowGeometry, material);
    window.position.set(x, y, z);
    scene.add(window);
    return window;
}
