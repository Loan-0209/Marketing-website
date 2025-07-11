/**
 * AI-Buildings.js - Tạo các tòa nhà hiện đại, sáng tạo mang đặc trưng AI
 * Được thiết kế để hoạt động với Three.js r128
 * Phiên bản đầy đủ với các chi tiết kiến trúc phức tạp
 */

// Hàm tạo nội thất chi tiết cho các tòa nhà AI
function createInterior(buildingGroup, width, height, depth, type) {
    // Tạo các tầng bên trong tòa nhà
    const floorCount = Math.floor(height / 4); // Mỗi tầng cao 4 đơn vị
    
    // Vật liệu sàn
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xEEEEEE,
        roughness: 0.1,
        metalness: 0.2
    });
    
    // Vật liệu nội thất
    const furnitureMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.5,
        metalness: 0.2
    });
    
    // Vật liệu màn hình
    const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.9
    });
    
    // Vật liệu đèn
    const lightMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.9
    });
    
    // Tạo nội thất cho từng tầng
    for (let i = 0; i < floorCount; i++) {
        // Vị trí của tầng
        const floorY = -height/2 + 2 + i * 4;
        
        // Tạo sàn cho mỗi tầng
        const floorGeometry = new THREE.BoxGeometry(width * 0.9, 0.2, depth * 0.9);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = floorY;
        buildingGroup.add(floor);
        
        // Tạo nội thất khác nhau cho từng loại tòa nhà
        switch(type) {
            case 'central':
                // Trung tâm điều khiển với màn hình lớn
                if (i === Math.floor(floorCount / 2)) { // Tầng giữa
                    // Tạo bàn điều khiển tròn
                    const controlDeskGeometry = new THREE.CylinderGeometry(width * 0.2, width * 0.25, 1, 16);
                    const controlDesk = new THREE.Mesh(controlDeskGeometry, furnitureMaterial);
                    controlDesk.position.y = floorY + 0.5;
                    buildingGroup.add(controlDesk);
                    
                    // Thêm màn hình hologram
                    const hologramGeometry = new THREE.SphereGeometry(width * 0.15, 16, 16);
                    const hologram = new THREE.Mesh(hologramGeometry, screenMaterial);
                    hologram.position.y = floorY + 2;
                    buildingGroup.add(hologram);
                    
                    // Thêm đèn chiếu sáng từ trần
                    for (let j = 0; j < 4; j++) {
                        const spotLightGeometry = new THREE.ConeGeometry(0.5, 0.5, 16);
                        const spotLight = new THREE.Mesh(spotLightGeometry, lightMaterial);
                        spotLight.position.set(
                            (j % 2 === 0 ? 1 : -1) * width * 0.3,
                            floorY + 3.5,
                            (j < 2 ? 1 : -1) * depth * 0.3
                        );
                        spotLight.rotation.x = Math.PI;
                        buildingGroup.add(spotLight);
                    }
                }
                break;
                
            case 'research':
                // Phòng thí nghiệm với bàn thí nghiệm và máy móc
                if (i % 2 === 0) { // Các tầng chẵn
                    // Tạo bàn thí nghiệm
                    const labTableGeometry = new THREE.BoxGeometry(width * 0.7, 0.8, depth * 0.4);
                    const labTable = new THREE.Mesh(labTableGeometry, furnitureMaterial);
                    labTable.position.y = floorY + 0.4;
                    buildingGroup.add(labTable);
                    
                    // Thêm thiết bị trên bàn
                    for (let j = 0; j < 3; j++) {
                        const equipmentGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const equipment = new THREE.Mesh(equipmentGeometry, new THREE.MeshStandardMaterial({
                            color: 0x666666,
                            roughness: 0.2,
                            metalness: 0.8
                        }));
                        equipment.position.set(
                            (j - 1) * width * 0.2,
                            floorY + 1.3,
                            0
                        );
                        buildingGroup.add(equipment);
                        
                        // Thêm màn hình nhỏ trên thiết bị
                        const screenGeometry = new THREE.PlaneGeometry(0.8, 0.5);
                        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
                        screen.position.set(
                            (j - 1) * width * 0.2,
                            floorY + 1.8,
                            0.51
                        );
                        screen.rotation.x = -0.2;
                        buildingGroup.add(screen);
                    }
                }
                break;
                
            case 'quantum':
                // Phòng máy tính lượng tử với thiết bị lạnh
                if (i === 0 || i === floorCount - 1) { // Tầng trên cùng và dưới cùng
                    // Tạo máy tính lượng tử ở giữa
                    const quantumComputerGeometry = new THREE.CylinderGeometry(width * 0.15, width * 0.15, 3, 16);
                    const quantumComputer = new THREE.Mesh(quantumComputerGeometry, new THREE.MeshStandardMaterial({
                        color: 0x111111,
                        roughness: 0.1,
                        metalness: 0.9
                    }));
                    quantumComputer.position.y = floorY + 1.5;
                    buildingGroup.add(quantumComputer);
                    
                    // Thêm các ống dẫn lạnh xung quanh
                    for (let j = 0; j < 8; j++) {
                        const angle = j * Math.PI / 4;
                        const pipeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
                        const pipe = new THREE.Mesh(pipeGeometry, new THREE.MeshStandardMaterial({
                            color: 0x999999,
                            roughness: 0.2,
                            metalness: 0.7
                        }));
                        pipe.position.set(
                            Math.cos(angle) * width * 0.3,
                            floorY + 1.5,
                            Math.sin(angle) * depth * 0.3
                        );
                        buildingGroup.add(pipe);
                    }
                    
                    // Thêm hiệu ứng lạnh
                    const coldEffectGeometry = new THREE.SphereGeometry(width * 0.25, 16, 16);
                    const coldEffect = new THREE.Mesh(coldEffectGeometry, new THREE.MeshBasicMaterial({
                        color: 0x00FFFF,
                        transparent: true,
                        opacity: 0.3
                    }));
                    coldEffect.position.y = floorY + 1.5;
                    buildingGroup.add(coldEffect);
                }
                break;
                
            case 'data':
                // Trung tâm dữ liệu với các kệ máy chủ
                // Tạo các kệ máy chủ cho mỗi tầng
                for (let j = 0; j < 2; j++) {
                    for (let k = 0; k < 2; k++) {
                        const serverRackGeometry = new THREE.BoxGeometry(width * 0.3, 3, depth * 0.3);
                        const serverRack = new THREE.Mesh(serverRackGeometry, new THREE.MeshStandardMaterial({
                            color: 0x333333,
                            roughness: 0.2,
                            metalness: 0.7
                        }));
                        serverRack.position.set(
                            (j === 0 ? -1 : 1) * width * 0.25,
                            floorY + 1.5,
                            (k === 0 ? -1 : 1) * depth * 0.25
                        );
                        buildingGroup.add(serverRack);
                        
                        // Thêm đèn LED trên kệ
                        for (let l = 0; l < 6; l++) {
                            const ledGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                            const ledColor = l % 3 === 0 ? 0xFF0000 : (l % 3 === 1 ? 0x00FF00 : 0x0000FF);
                            const led = new THREE.Mesh(ledGeometry, new THREE.MeshBasicMaterial({
                                color: ledColor,
                                transparent: false,
                                opacity: 1
                            }));
                            led.position.set(
                                (j === 0 ? -1 : 1) * width * 0.25 + 0.15,
                                floorY + 0.5 + l * 0.5,
                                (k === 0 ? -1 : 1) * depth * 0.25
                            );
                            buildingGroup.add(led);
                        }
                    }
                }
                break;
                
            case 'innovation':
                // Không gian làm việc mở với bàn và ghế
                if (i % 2 === 1) { // Các tầng lẻ
                    // Tạo bàn hội nghị tròn ở giữa
                    const tableGeometry = new THREE.CylinderGeometry(width * 0.3, width * 0.3, 0.2, 16);
                    const table = new THREE.Mesh(tableGeometry, new THREE.MeshStandardMaterial({
                        color: 0x8B4513, // Màu gỗ
                        roughness: 0.8,
                        metalness: 0.1
                    }));
                    table.position.y = floorY + 1;
                    buildingGroup.add(table);
                    
                    // Thêm ghế xung quanh bàn
                    for (let j = 0; j < 8; j++) {
                        const angle = j * Math.PI / 4;
                        const chairGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
                        const chair = new THREE.Mesh(chairGeometry, new THREE.MeshStandardMaterial({
                            color: 0x666666,
                            roughness: 0.5,
                            metalness: 0.2
                        }));
                        chair.position.set(
                            Math.cos(angle) * width * 0.4,
                            floorY + 0.6,
                            Math.sin(angle) * depth * 0.4
                        );
                        buildingGroup.add(chair);
                    }
                    
                    // Thêm màn hình trên tường
                    const wallScreenGeometry = new THREE.PlaneGeometry(width * 0.6, height * 0.15);
                    const wallScreen = new THREE.Mesh(wallScreenGeometry, screenMaterial);
                    wallScreen.position.set(0, floorY + 2, depth * 0.44);
                    wallScreen.rotation.x = -0.1;
                    buildingGroup.add(wallScreen);
                }
                break;
                
            default:
                // Nội thất mặc định đơn giản
                // Tạo vài bàn và ghế
                for (let j = 0; j < 2; j++) {
                    const deskGeometry = new THREE.BoxGeometry(width * 0.4, 0.1, depth * 0.2);
                    const desk = new THREE.Mesh(deskGeometry, furnitureMaterial);
                    desk.position.set(0, floorY + 0.5, (j === 0 ? -1 : 1) * depth * 0.2);
                    buildingGroup.add(desk);
                    
                    // Thêm ghế
                    const chairGeometry = new THREE.BoxGeometry(width * 0.1, 0.5, depth * 0.1);
                    const chair = new THREE.Mesh(chairGeometry, furnitureMaterial);
                    chair.position.set(0, floorY + 0.25, (j === 0 ? -1 : 1) * depth * 0.3);
                    buildingGroup.add(chair);
                }
        }
    }
}

// Hàm tạo tòa nhà AI hiện đại
function createAIBuilding(scene, position, options = {}) {
    console.log("Creating AI building at position:", position, "with type:", options.type);
    
    // Tạo nhóm chứa tòa nhà
    const buildingGroup = new THREE.Group();
    buildingGroup.name = options.name || `ai_building_${Math.floor(Math.random() * 1000)}`;
    
    // Lấy kích thước từ options
    const width = options.width || 10;
    const height = options.height || 20;
    const depth = options.depth || 10;
    
    // Xác định màu sắc sinh động và sáng hơn cho từng loại tòa nhà
    let glassColor, glowColor;
    switch (options.type) {
        case 'central':
            glassColor = 0x00BFFF; // Xanh da trời sáng (Deep Sky Blue)
            glowColor = 0x00FFFF; // Cyan sáng
            break;
        case 'research':
            glassColor = 0x4169E1; // Xanh dương đậm (Royal Blue)
            glowColor = 0x1E90FF; // Xanh dương sáng (Dodger Blue)
            break;
        case 'quantum':
            glassColor = 0x9932CC; // Tím đậm (Dark Orchid)
            glowColor = 0xDA70D6; // Tím sáng (Orchid)
            break;
        case 'data':
            glassColor = 0x32CD32; // Xanh lá sáng (Lime Green)
            glowColor = 0x7FFF00; // Xanh lá néon (Chartreuse)
            break;
        case 'innovation':
            glassColor = 0xFF4500; // Đỏ cam (Orange Red)
            glowColor = 0xFFA500; // Cam sáng (Orange)
            break;
        default:
            glassColor = 0x00CED1; // Xanh ngọc sáng (Dark Turquoise)
            glowColor = 0x40E0D0; // Xanh ngọc (Turquoise)
    }
    
    // Vật liệu kính sinh động và sáng hơn
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: options.color || glassColor,
        transparent: true,
        opacity: 0.7,
        metalness: 0.3,
        roughness: 0.05,
        reflectivity: 1.0,
        transmission: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        emissive: new THREE.Color(glassColor).multiplyScalar(0.2), // Thêm hiệu ứng phát sáng nhẹ
        side: THREE.DoubleSide
    });
    
    // Vật liệu phát sáng mạnh hơn
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.9
    });
    
    // Tạo tòa nhà dựa trên loại
    switch(options.type) {
        case 'central':
            createCentralTower(buildingGroup, width, height, depth, glassMaterial, glowMaterial);
            // Thêm nội thất cho tháp trung tâm
            createInterior(buildingGroup, width, height, depth, 'central');
            break;
        case 'research':
            createResearchFacility(buildingGroup, width, height, depth, glassMaterial, glowMaterial);
            // Thêm nội thất cho cơ sở nghiên cứu
            createInterior(buildingGroup, width, height, depth, 'research');
            break;
        case 'quantum':
            createQuantumCenter(buildingGroup, width, height, depth, glassMaterial, glowMaterial);
            // Thêm nội thất cho trung tâm lượng tử
            createInterior(buildingGroup, width, height, depth, 'quantum');
            break;
        case 'data':
            createDataCenter(buildingGroup, width, height, depth, glassMaterial, glowMaterial);
            // Thêm nội thất cho trung tâm dữ liệu
            createInterior(buildingGroup, width, height, depth, 'data');
            break;
        case 'innovation':
            createInnovationHub(buildingGroup, width, height, depth, glassMaterial, glowMaterial);
            // Thêm nội thất cho trung tâm đổi mới
            createInterior(buildingGroup, width, height, depth, 'innovation');
            break;
        default:
            createDefaultBuilding(buildingGroup, width, height, depth, glassMaterial, glowMaterial);
            // Thêm nội thất mặc định
            createInterior(buildingGroup, width, height, depth, 'default');
    }
    
    // Thêm cửa sổ cho tất cả các mặt của tòa nhà
    addWindows(buildingGroup, width, height, depth, options.type);
    
    // Đặt vị trí cho tòa nhà
    buildingGroup.position.set(position.x, position.y, position.z);
    
    // Thêm vào scene
    scene.add(buildingGroup);
    
    return buildingGroup;
}

// Tạo tháp trung tâm
function createCentralTower(group, width, height, depth, glassMaterial, glowMaterial) {
    // Thân chính
    const baseGeometry = new THREE.BoxGeometry(width, height, depth);
    const base = new THREE.Mesh(baseGeometry, glassMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    // Đỉnh xoắn ốc
    const spiralSegments = 8;
    const spiralRadius = width / 3;
    const spiralHeight = height / 3;
    
    for (let i = 0; i < spiralSegments; i++) {
        const angle = (i / spiralSegments) * Math.PI * 2;
        const segmentHeight = spiralHeight / spiralSegments;
        const segmentGeometry = new THREE.CylinderGeometry(spiralRadius * 0.5, spiralRadius * 0.3, segmentHeight, 8);
        const segment = new THREE.Mesh(segmentGeometry, glassMaterial);
        
        segment.position.x = Math.sin(angle) * (spiralRadius * 0.8);
        segment.position.z = Math.cos(angle) * (spiralRadius * 0.8);
        segment.position.y = height/2 + (i * segmentHeight) + segmentHeight/2;
        segment.castShadow = true;
        
        group.add(segment);
    }
    
    // Vòng phát sáng ở giữa tòa nhà
    const ringGeometry = new THREE.TorusGeometry(width/2, 0.5, 16, 32);
    const ring = new THREE.Mesh(ringGeometry, glowMaterial);
    ring.position.y = height/4;
    ring.rotation.x = Math.PI/2;
    group.add(ring);
    
    // Vòng phát sáng ở đỉnh tòa nhà
    const topRingGeometry = new THREE.TorusGeometry(width/4, 0.3, 16, 32);
    const topRing = new THREE.Mesh(topRingGeometry, glowMaterial);
    topRing.position.y = height/2 + spiralHeight/2;
    topRing.rotation.x = Math.PI/2;
    group.add(topRing);
}

// Tạo cơ sở nghiên cứu
function createResearchFacility(group, width, height, depth, glassMaterial, glowMaterial) {
    // Thân chính
    const baseGeometry = new THREE.BoxGeometry(width, height * 0.8, depth);
    const base = new THREE.Mesh(baseGeometry, glassMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    // Phần trên
    const topGeometry = new THREE.CylinderGeometry(width/2, width/1.5, height * 0.3, 8);
    const top = new THREE.Mesh(topGeometry, glassMaterial);
    top.position.y = height * 0.4 + height * 0.15;
    top.castShadow = true;
    group.add(top);
    
    // Cầu nối
    const bridgeGeometry = new THREE.BoxGeometry(width/3, height/10, depth * 1.5);
    const bridge = new THREE.Mesh(bridgeGeometry, glassMaterial);
    bridge.position.y = height/4;
    bridge.position.z = depth;
    bridge.castShadow = true;
    group.add(bridge);
    
    // Đèn phát sáng
    const lightGeometry = new THREE.SphereGeometry(width/6, 16, 16);
    const light = new THREE.Mesh(lightGeometry, glowMaterial);
    light.position.y = height * 0.4 + height * 0.15 + height * 0.15;
    group.add(light);
    
    // Vòng phát sáng
    const ringGeometry = new THREE.TorusGeometry(width/2.5, 0.3, 16, 32);
    const ring = new THREE.Mesh(ringGeometry, glowMaterial);
    ring.position.y = height/3;
    ring.rotation.x = Math.PI/2;
    group.add(ring);
}

// Tạo trung tâm điện toán lượng tử
function createQuantumCenter(group, width, height, depth, glassMaterial, glowMaterial) {
    // Thân chính
    const baseGeometry = new THREE.BoxGeometry(width, height * 0.6, depth);
    const base = new THREE.Mesh(baseGeometry, glassMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    // Cấu trúc lượng tử
    const quantumStructure = new THREE.Group();
    const sphereCount = 8;
    const sphereRadius = width/8;
    const orbitRadius = width/2;
    
    for (let i = 0; i < sphereCount; i++) {
        const angle = (i / sphereCount) * Math.PI * 2;
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
        const sphere = new THREE.Mesh(sphereGeometry, glowMaterial);
        
        sphere.position.x = Math.sin(angle) * orbitRadius;
        sphere.position.z = Math.cos(angle) * orbitRadius;
        quantumStructure.add(sphere);
        
        // Tạo đường kết nối
        const connectionGeometry = new THREE.CylinderGeometry(0.1, 0.1, orbitRadius * 2, 8);
        const connection = new THREE.Mesh(connectionGeometry, glowMaterial);
        connection.position.x = Math.sin(angle) * orbitRadius/2;
        connection.position.z = Math.cos(angle) * orbitRadius/2;
        connection.rotation.x = Math.PI/2;
        connection.rotation.z = angle;
        quantumStructure.add(connection);
    }
    
    quantumStructure.position.y = height * 0.3 + height * 0.3;
    group.add(quantumStructure);
    
    // Đỉnh
    const topGeometry = new THREE.ConeGeometry(width/3, height * 0.2, 8);
    const top = new THREE.Mesh(topGeometry, glassMaterial);
    top.position.y = height * 0.3 + height * 0.6;
    top.castShadow = true;
    group.add(top);
    
    // Vòng phát sáng
    const ringGeometry = new THREE.TorusGeometry(width/2, 0.3, 16, 32);
    const ring = new THREE.Mesh(ringGeometry, glowMaterial);
    ring.position.y = height * 0.3;
    ring.rotation.x = Math.PI/2;
    group.add(ring);
}

// Tạo trung tâm dữ liệu
function createDataCenter(group, width, height, depth, glassMaterial, glowMaterial) {
    // Thân chính
    const baseGeometry = new THREE.BoxGeometry(width, height, depth);
    const base = new THREE.Mesh(baseGeometry, glassMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    // Các tầng dữ liệu
    const layerCount = 5;
    const layerHeight = height / (layerCount * 1.5);
    
    for (let i = 0; i < layerCount; i++) {
        const layerGeometry = new THREE.BoxGeometry(width * 1.1, layerHeight, depth * 1.1);
        const layer = new THREE.Mesh(layerGeometry, glassMaterial);
        layer.position.y = -height/2 + (i + 0.5) * layerHeight * 1.5;
        layer.castShadow = true;
        group.add(layer);
        
        // Đèn báo hiệu
        const lightGeometry = new THREE.BoxGeometry(width * 1.1, layerHeight/5, 0.1);
        const light = new THREE.Mesh(lightGeometry, glowMaterial);
        light.position.y = -height/2 + (i + 0.5) * layerHeight * 1.5;
        light.position.z = depth/2 + 0.1;
        group.add(light);
    }
    
    // Antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.2, 0.2, height/3, 8);
    const antenna = new THREE.Mesh(antennaGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    antenna.position.y = height/2 + height/6;
    antenna.position.x = width/4;
    group.add(antenna);
    
    // Đỉnh antenna
    const antennaTopGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const antennaTop = new THREE.Mesh(antennaTopGeometry, glowMaterial);
    antennaTop.position.y = height/2 + height/3;
    antennaTop.position.x = width/4;
    group.add(antennaTop);
}

// Tạo trung tâm đổi mới
function createInnovationHub(group, width, height, depth, glassMaterial, glowMaterial) {
    // Tạo hình trụ cơ sở
    const baseRadius = Math.min(width, depth) / 2;
    const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius * 1.2, height * 0.7, 16);
    const base = new THREE.Mesh(baseGeometry, glassMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    // Tạo phần trên có hình dạng đặc biệt
    const topGeometry = new THREE.OctahedronGeometry(baseRadius * 0.8, 1);
    const top = new THREE.Mesh(topGeometry, glassMaterial);
    top.position.y = height * 0.35 + baseRadius * 0.8;
    top.castShadow = true;
    group.add(top);
    
    // Tạo các vòng xoay
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
        const ringGeometry = new THREE.TorusGeometry(baseRadius * (1 - i * 0.2), 0.3, 16, 32);
        const ring = new THREE.Mesh(ringGeometry, glowMaterial);
        ring.position.y = height * 0.35 - height * 0.1 * i;
        ring.rotation.x = Math.PI/2;
        group.add(ring);
    }
    
    // Tạo các cầu nối
    const bridgeCount = 4;
    for (let i = 0; i < bridgeCount; i++) {
        const angle = (i / bridgeCount) * Math.PI * 2;
        const bridgeGeometry = new THREE.BoxGeometry(baseRadius * 0.3, height * 0.1, baseRadius * 1.5);
        const bridge = new THREE.Mesh(bridgeGeometry, glassMaterial);
        
        bridge.position.x = Math.sin(angle) * baseRadius * 0.8;
        bridge.position.z = Math.cos(angle) * baseRadius * 0.8;
        bridge.position.y = -height * 0.2;
        bridge.rotation.y = angle;
        bridge.castShadow = true;
        
        group.add(bridge);
    }
    
    // Đèn phát sáng ở đỉnh
    const lightGeometry = new THREE.SphereGeometry(baseRadius * 0.3, 16, 16);
    const light = new THREE.Mesh(lightGeometry, glowMaterial);
    light.position.y = height * 0.35 + baseRadius * 1.6;
    group.add(light);
}

// Tạo tòa nhà mặc định
function createDefaultBuilding(group, width, height, depth, glassMaterial, glowMaterial) {
    // Thân chính
    const baseGeometry = new THREE.BoxGeometry(width, height, depth);
    const base = new THREE.Mesh(baseGeometry, glassMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    // Đỉnh tòa nhà
    const spireGeometry = new THREE.ConeGeometry(width/4, height/5, 8);
    const spire = new THREE.Mesh(spireGeometry, glassMaterial);
    spire.position.y = height/2 + height/10;
    spire.castShadow = true;
    group.add(spire);
    
    // Vòng phát sáng
    const ringGeometry = new THREE.TorusGeometry(width/2.5, 0.3, 16, 32);
    const ring = new THREE.Mesh(ringGeometry, glowMaterial);
    ring.position.y = 0;
    ring.rotation.x = Math.PI/2;
    group.add(ring);
}

// Thêm cửa sổ cho tòa nhà
function addWindows(group, width, height, depth, type) {
    // Xác định màu cửa sổ dựa trên loại tòa nhà
    let windowColor;
    switch (type) {
        case 'central':
            windowColor = 0x80DFFF; // Xanh da trời sáng hơn
            break;
        case 'research':
            windowColor = 0x87CEFA; // Xanh dương nhạt
            break;
        case 'quantum':
            windowColor = 0xE6A8D7; // Tím hồng sáng
            break;
        case 'data':
            windowColor = 0xADFF2F; // Xanh lá sáng
            break;
        case 'innovation':
            windowColor = 0xFFD700; // Vàng sáng
            break;
        default:
            windowColor = 0xFFFFFF; // Trắng sáng
    }
    
    // Vật liệu cửa sổ sinh động và sáng hơn
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: windowColor,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.03,
        reflectivity: 1.0,
        transmission: 0.95,
        clearcoat: 0.8,
        clearcoatRoughness: 0.05,
        emissive: new THREE.Color(windowColor).multiplyScalar(0.3) // Thêm hiệu ứng phát sáng
    });
    
    const windowWidth = 0.8;
    const windowHeight = 1.2;
    
    // Số cửa sổ trên mỗi mặt
    const windowsPerWidth = Math.floor(width / 2);
    const windowsPerHeight = Math.floor(height / 3);
    
    // Tạo cửa sổ trên các mặt của tòa nhà
    for (let i = 0; i < windowsPerWidth; i++) {
        for (let j = 0; j < windowsPerHeight; j++) {
            // Mặt trước
            const frontWindow = new THREE.Mesh(
                new THREE.PlaneGeometry(windowWidth, windowHeight),
                windowMaterial
            );
            frontWindow.position.set(
                -width/2 + i * 2 + 1,
                -height/2 + j * 3 + 2,
                depth/2 + 0.01
            );
            group.add(frontWindow);
            
            // Mặt sau
            const backWindow = new THREE.Mesh(
                new THREE.PlaneGeometry(windowWidth, windowHeight),
                windowMaterial
            );
            backWindow.position.set(
                -width/2 + i * 2 + 1,
                -height/2 + j * 3 + 2,
                -depth/2 - 0.01
            );
            backWindow.rotation.y = Math.PI;
            group.add(backWindow);
            
            // Mặt trái và phải (nếu đủ rộng)
            if (i < windowsPerWidth / 2) {
                // Mặt trái
                const leftWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowWidth, windowHeight),
                    windowMaterial
                );
                leftWindow.position.set(
                    -width/2 - 0.01,
                    -height/2 + j * 3 + 2,
                    -depth/2 + i * 2 + 1
                );
                leftWindow.rotation.y = -Math.PI/2;
                group.add(leftWindow);
                
                // Mặt phải
                const rightWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowWidth, windowHeight),
                    windowMaterial
                );
                rightWindow.position.set(
                    width/2 + 0.01,
                    -height/2 + j * 3 + 2,
                    -depth/2 + i * 2 + 1
                );
                rightWindow.rotation.y = Math.PI/2;
                group.add(rightWindow);
            }
        }
    }
}
