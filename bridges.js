// Tạo các cầu kính kết nối giữa các tòa nhà
function createGlassBridges(scene, buildings) {
    const bridges = [];
    
    // Vật liệu kính cho cầu
    const bridgeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88CCFF,
        transparent: true,
        opacity: 0.6,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.95,
        reflectivity: 1.0,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });
    
    // Kết nối các tòa nhà với nhau bằng cầu kính
    if (buildings && buildings.length >= 2) {
        // Kết nối tòa nhà chính với các tòa nhà xung quanh
        for (let i = 1; i < buildings.length; i++) {
            const startBuilding = buildings[0];
            const endBuilding = buildings[i];
            
            const startPos = startBuilding.position.clone();
            const endPos = endBuilding.position.clone();
            
            // Tính toán vị trí và hướng của cầu
            const bridgePos = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
            const bridgeLength = startPos.distanceTo(endPos) * 0.8;
            const bridgeHeight = Math.min(startPos.y, endPos.y) + 10;
            
            // Điều chỉnh vị trí theo chiều cao
            bridgePos.y = bridgeHeight;
            
            // Tính góc quay của cầu
            const angle = Math.atan2(endPos.z - startPos.z, endPos.x - startPos.x);
            
            // Tạo cầu kính
            const bridge = createGlassBridge(
                bridgePos.x, bridgePos.y, bridgePos.z,
                bridgeLength, 3, 3,
                angle,
                bridgeMaterial, scene
            );
            
            bridges.push(bridge);
        }
    }
    
    return bridges;
}

// Tạo một cầu kính
function createGlassBridge(x, y, z, length, height, width, rotation, material, scene) {
    // Tạo khối chính của cầu
    const bridgeGeometry = new THREE.BoxGeometry(length, height, width);
    const bridge = new THREE.Mesh(bridgeGeometry, material);
    bridge.position.set(x, y, z);
    bridge.rotation.y = rotation;
    bridge.castShadow = true;
    scene.add(bridge);
    
    // Tạo lan can cho cầu
    const railingMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // Lan can bên trái
    const leftRailingGeometry = new THREE.BoxGeometry(length, 0.5, 0.2);
    const leftRailing = new THREE.Mesh(leftRailingGeometry, railingMaterial);
    leftRailing.position.set(0, height / 2 + 0.25, width / 2 - 0.1);
    bridge.add(leftRailing);
    
    // Lan can bên phải
    const rightRailingGeometry = new THREE.BoxGeometry(length, 0.5, 0.2);
    const rightRailing = new THREE.Mesh(rightRailingGeometry, railingMaterial);
    rightRailing.position.set(0, height / 2 + 0.25, -width / 2 + 0.1);
    bridge.add(rightRailing);
    
    // Thêm các trụ đỡ
    const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const pillarCount = 5;
    const pillarSpacing = length / (pillarCount - 1);
    
    for (let i = 0; i < pillarCount; i++) {
        const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, height * 2, 8);
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.set(-length / 2 + i * pillarSpacing, -height / 2, 0);
        bridge.add(pillar);
    }
    
    return bridge;
}
