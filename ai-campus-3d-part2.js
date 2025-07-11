// Tạo hệ thống đèn LED
function createLEDSystem() {
    console.log('Creating LED lighting system...');
    
    // Tạo đèn đường
    createStreetLights();
    
    // Tạo đèn LED trang trí cho các tòa nhà
    createBuildingLEDs();
}

// Tạo đèn đường
function createStreetLights() {
    // Cấu hình lưới đèn đường
    const gridSize = 5;
    const spacing = 30;
    
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            // Bỏ qua khu vực trung tâm nơi có các tòa nhà
            if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
            
            // Tạo đèn đường
            const streetLight = createStreetLight();
            streetLight.position.set(x * spacing, 0, z * spacing);
            scene.add(streetLight);
            streetLights.push(streetLight);
        }
    }
}

// Tạo một đèn đường
function createStreetLight() {
    const group = new THREE.Group();
    
    // Tạo cột đèn
    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.5
    });
    
    const poleGeometry = new THREE.CylinderGeometry(0.3, 0.4, 10, 8);
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 5;
    pole.castShadow = true;
    group.add(pole);
    
    // Tạo đầu đèn
    const headGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.5
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 10.5, 0);
    head.castShadow = true;
    group.add(head);
    
    // Tạo nguồn sáng
    const lightGeometry = new THREE.PlaneGeometry(1.8, 0.8);
    const lightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        emissive: 0xffffaa,
        emissiveIntensity: 1,
        side: THREE.DoubleSide
    });
    const lightPanel = new THREE.Mesh(lightGeometry, lightMaterial);
    lightPanel.rotation.x = Math.PI / 2;
    lightPanel.position.set(0, 10.2, 0);
    group.add(lightPanel);
    
    // Thêm spotlight
    const spotlight = new THREE.SpotLight(0xffffaa, 1, 30, Math.PI / 6, 0.5, 1);
    spotlight.position.set(0, 10, 0);
    spotlight.target.position.set(0, 0, 0);
    spotlight.castShadow = true;
    
    // Cấu hình shadow cho spotlight
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.near = 0.5;
    spotlight.shadow.camera.far = 30;
    
    group.add(spotlight);
    group.add(spotlight.target);
    
    // Lưu tham chiếu đến các thành phần cần animation
    group.userData = {
        lightPanel: lightPanel,
        spotlight: spotlight,
        initialColor: new THREE.Color(0xffffaa),
        flickerSpeed: Math.random() * 0.1 + 0.05,
        flickerAmount: Math.random() * 0.2 + 0.1
    };
    
    return group;
}

// Tạo đèn LED trang trí cho các tòa nhà
function createBuildingLEDs() {
    buildings.forEach(building => {
        // Thêm dải đèn LED ở các cạnh và đỉnh tòa nhà
        const buildingBox = new THREE.Box3().setFromObject(building);
        const size = new THREE.Vector3();
        buildingBox.getSize(size);
        
        const width = size.x;
        const height = size.y;
        const depth = size.z;
        
        const position = new THREE.Vector3();
        buildingBox.getCenter(position);
        
        // Tạo dải đèn LED ở đỉnh tòa nhà
        createLEDStrip(
            position.x, position.y + height / 2, position.z,
            width, 0.2, depth,
            0x00ffff
        );
        
        // Tạo dải đèn LED ở các cạnh
        // Cạnh trên trước
        createLEDStrip(
            position.x + width / 2, position.y + height / 2 - 1, position.z,
            0.2, 2, depth,
            0x00ffff
        );
        
        createLEDStrip(
            position.x - width / 2, position.y + height / 2 - 1, position.z,
            0.2, 2, depth,
            0x00ffff
        );
        
        createLEDStrip(
            position.x, position.y + height / 2 - 1, position.z + depth / 2,
            width, 2, 0.2,
            0x00ffff
        );
        
        createLEDStrip(
            position.x, position.y + height / 2 - 1, position.z - depth / 2,
            width, 2, 0.2,
            0x00ffff
        );
    });
}

// Tạo dải đèn LED
function createLEDStrip(x, y, z, width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
    });
    
    const ledStrip = new THREE.Mesh(geometry, material);
    ledStrip.position.set(x, y, z);
    
    // Lưu thông tin cho animation
    ledStrip.userData = {
        baseColor: new THREE.Color(color),
        pulseSpeed: Math.random() * 0.5 + 0.5,
        pulseAmount: Math.random() * 0.3 + 0.2,
        hueShift: Math.random() * 0.1
    };
    
    scene.add(ledStrip);
    buildingLEDs.push(ledStrip);
    
    return ledStrip;
}

// Tạo các tòa nhà
function createBuildings() {
    console.log('Creating enhanced glass buildings...');
    
    // Tạo tòa tháp trung tâm
    const centralTower = createEnhancedGlassBuilding(
        BUILDING_TYPES.CENTRAL_TOWER.width,
        BUILDING_TYPES.CENTRAL_TOWER.height,
        BUILDING_TYPES.CENTRAL_TOWER.depth,
        BUILDING_TYPES.CENTRAL_TOWER.color,
        'central_tower'
    );
    centralTower.position.set(0, BUILDING_TYPES.CENTRAL_TOWER.height / 2, 0);
    scene.add(centralTower);
    buildings.push(centralTower);
    
    // Tạo các tòa nhà xung quanh
    const buildingPositions = [
        { type: BUILDING_TYPES.OFFICE_TOWER, x: -40, z: -40, name: 'office_tower_1' },
        { type: BUILDING_TYPES.RESIDENTIAL, x: -40, z: 0, name: 'residential_1' },
        { type: BUILDING_TYPES.SHOPPING_COMPLEX, x: -40, z: 40, name: 'shopping_complex_1' },
        { type: BUILDING_TYPES.RESEARCH_LAB, x: 0, z: -40, name: 'research_lab_1' },
        { type: BUILDING_TYPES.OFFICE_TOWER, x: 0, z: 40, name: 'office_tower_2' },
        { type: BUILDING_TYPES.RESIDENTIAL, x: 40, z: -40, name: 'residential_2' },
        { type: BUILDING_TYPES.SHOPPING_COMPLEX, x: 40, z: 0, name: 'shopping_complex_2' },
        { type: BUILDING_TYPES.RESEARCH_LAB, x: 40, z: 40, name: 'research_lab_2' }
    ];
    
    buildingPositions.forEach(pos => {
        const building = createEnhancedGlassBuilding(
            pos.type.width,
            pos.type.height,
            pos.type.depth,
            pos.type.color,
            pos.name
        );
        building.position.set(pos.x, pos.type.height / 2, pos.z);
        scene.add(building);
        buildings.push(building);
    });
}

// Tạo tòa nhà kính nâng cao
function createEnhancedGlassBuilding(width, height, depth, color, name) {
    // Tạo group cho tòa nhà
    const buildingGroup = new THREE.Group();
    buildingGroup.name = name;
    
    // Tạo vật liệu kính cobalt blue
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.95,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMap: cubeRenderTarget.texture
    });
    
    // Tạo vật liệu cho cửa sổ
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        metalness: 0.3,
        roughness: 0.1,
        transmission: 0.9,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMap: cubeRenderTarget.texture,
        map: windowTexture,
        emissive: 0xffffff,
        emissiveMap: emissiveTexture,
        emissiveIntensity: 0.2
    });
    
    // Tạo khối chính của tòa nhà
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(buildingGeometry, glassMaterial);
    building.castShadow = true;
    building.receiveShadow = true;
    buildingGroup.add(building);
    
    // Thêm chi tiết kiến trúc
    
    // Thêm các mặt cửa sổ
    const windowThickness = 0.1;
    
    // Mặt trước
    const frontWindowGeometry = new THREE.BoxGeometry(width * 0.98, height * 0.98, windowThickness);
    const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
    frontWindow.position.z = depth / 2 + windowThickness / 2;
    buildingGroup.add(frontWindow);
    
    // Mặt sau
    const backWindowGeometry = new THREE.BoxGeometry(width * 0.98, height * 0.98, windowThickness);
    const backWindow = new THREE.Mesh(backWindowGeometry, windowMaterial);
    backWindow.position.z = -depth / 2 - windowThickness / 2;
    buildingGroup.add(backWindow);
    
    // Mặt trái
    const leftWindowGeometry = new THREE.BoxGeometry(windowThickness, height * 0.98, depth * 0.98);
    const leftWindow = new THREE.Mesh(leftWindowGeometry, windowMaterial);
    leftWindow.position.x = -width / 2 - windowThickness / 2;
    buildingGroup.add(leftWindow);
    
    // Mặt phải
    const rightWindowGeometry = new THREE.BoxGeometry(windowThickness, height * 0.98, depth * 0.98);
    const rightWindow = new THREE.Mesh(rightWindowGeometry, windowMaterial);
    rightWindow.position.x = width / 2 + windowThickness / 2;
    buildingGroup.add(rightWindow);
    
    // Thêm mái nhà
    const roofGeometry = new THREE.BoxGeometry(width * 1.1, height * 0.05, depth * 1.1);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.5
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = height / 2 + height * 0.025;
    roof.castShadow = true;
    buildingGroup.add(roof);
    
    // Thêm ăng-ten hoặc cột trên mái nhà
    if (Math.random() > 0.5) {
        const antennaGeometry = new THREE.CylinderGeometry(0.2, 0.2, height * 0.2, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.5,
            metalness: 0.8
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = height / 2 + height * 0.1;
        antenna.castShadow = true;
        buildingGroup.add(antenna);
        
        // Thêm đèn nhấp nháy trên đỉnh ăng-ten
        const blinkLightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const blinkLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 1
        });
        const blinkLight = new THREE.Mesh(blinkLightGeometry, blinkLightMaterial);
        blinkLight.position.y = height / 2 + height * 0.2;
        
        // Lưu thông tin cho animation
        blinkLight.userData = {
            blinkSpeed: 1.0,
            initialIntensity: 1
        };
        
        buildingGroup.add(blinkLight);
    }
    
    // Thêm animation cho tòa nhà (nhấp nhô nhẹ)
    addBuildingAnimation(buildingGroup);
    
    // Tạo các phiên bản LOD (Level of Detail)
    createBuildingLOD(buildingGroup, width, height, depth, color, name);
    
    return buildingGroup;
}

// Thêm animation cho tòa nhà
function addBuildingAnimation(buildingGroup) {
    // Tạo animation mixer
    const mixer = new THREE.AnimationMixer(buildingGroup);
    
    // Tạo keyframe track cho animation nhấp nhô
    const times = [0, 5, 10];
    const values = [
        0, 0, 0, // Vị trí ban đầu
        0, 0.2, 0, // Vị trí cao hơn một chút
        0, 0, 0 // Trở về vị trí ban đầu
    ];
    
    const positionKF = new THREE.KeyframeTrack(
        '.position[y]',
        times,
        values
    );
    
    // Tạo animation clip
    const clip = new THREE.AnimationClip('float', 10, [positionKF]);
    
    // Chạy animation
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat);
    action.play();
    
    // Lưu mixer để cập nhật trong animation loop
    animationMixers.push(mixer);
}

// Tạo LOD (Level of Detail) cho tòa nhà
function createBuildingLOD(buildingGroup, width, height, depth, color, name) {
    // Tạo đối tượng LOD
    const lod = new THREE.LOD();
    lod.name = name + '_lod';
    
    // Thêm chi tiết cao (tòa nhà gốc)
    lod.addLevel(buildingGroup, 0);
    
    // Tạo chi tiết trung bình
    const mediumDetailGroup = createMediumDetailBuilding(width, height, depth, color);
    lod.addLevel(mediumDetailGroup, 100);
    
    // Tạo chi tiết thấp
    const lowDetailGroup = createLowDetailBuilding(width, height, depth, color);
    lod.addLevel(lowDetailGroup, 200);
    
    // Thêm vào danh sách LOD để quản lý
    lodObjects.push(lod);
    
    return lod;
}

// Tạo tòa nhà với chi tiết trung bình
function createMediumDetailBuilding(width, height, depth, color) {
    const group = new THREE.Group();
    
    // Vật liệu đơn giản hơn
    const material = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9,
        reflectivity: 0.8
    });
    
    // Khối chính
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(buildingGeometry, material);
    building.castShadow = true;
    group.add(building);
    
    // Mái nhà đơn giản
    const roofGeometry = new THREE.BoxGeometry(width * 1.1, height * 0.05, depth * 1.1);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = height / 2 + height * 0.025;
    group.add(roof);
    
    return group;
}

// Tạo tòa nhà với chi tiết thấp
function createLowDetailBuilding(width, height, depth, color) {
    const group = new THREE.Group();
    
    // Vật liệu đơn giản nhất
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6
    });
    
    // Khối đơn giản
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(buildingGeometry, material);
    group.add(building);
    
    return group;
}

// Cập nhật hệ thống hạt
function updateParticleSystems(delta) {
    particleSystems.forEach(system => {
        const positions = system.geometry.attributes.position.array;
        const halfLength = system.length / 2;
        
        for (let i = 0; i < positions.length / 3; i++) {
            // Cập nhật vị trí dựa trên vận tốc
            positions[i * 3] += system.velocities[i].x;
            positions[i * 3 + 1] += system.velocities[i].y;
            positions[i * 3 + 2] += system.velocities[i].z;
            
            // Kiểm tra nếu hạt đi ra ngoài cầu, quay lại đầu bên kia
            if (positions[i * 3] > halfLength) {
                positions[i * 3] = -halfLength;
            } else if (positions[i * 3] < -halfLength) {
                positions[i * 3] = halfLength;
            }
        }
        
        // Cập nhật buffer
        system.geometry.attributes.position.needsUpdate = true;
    });
}

// Cập nhật đèn LED
function updateLEDLights(time) {
    // Cập nhật đèn đường
    streetLights.forEach(light => {
        const userData = light.userData;
        
        // Tạo hiệu ứng nhấp nháy
        const flicker = Math.sin(time * userData.flickerSpeed) * userData.flickerAmount;
        const intensity = 1.0 + flicker;
        
        // Cập nhật màu và cường độ
        const color = userData.initialColor.clone();
        color.offsetHSL(Math.sin(time * 0.1) * 0.05, 0, 0); // Thay đổi màu nhẹ
        
        // Áp dụng cho đèn
        userData.lightPanel.material.color.copy(color);
        userData.lightPanel.material.emissive.copy(color);
        userData.lightPanel.material.emissiveIntensity = intensity;
        
        // Cập nhật spotlight
        userData.spotlight.color.copy(color);
        userData.spotlight.intensity = intensity;
    });
    
    // Cập nhật đèn LED trang trí tòa nhà
    buildingLEDs.forEach(led => {
        const userData = led.userData;
        
        // Tạo hiệu ứng nhịp đập
        const pulse = Math.sin(time * userData.pulseSpeed) * userData.pulseAmount + 1.0;
        
        // Thay đổi màu theo thời gian
        const hue = (time * userData.hueShift) % 1.0;
        const color = new THREE.Color().setHSL(hue, 1.0, 0.5);
        
        // Áp dụng cho đèn LED
        led.material.color.copy(color);
        led.material.opacity = 0.6 + pulse * 0.4;
    });
}

// Xử lý sự kiện
function setupEventListeners() {
    // Xử lý sự kiện thay đổi kích thước cửa sổ
    window.addEventListener('resize', onWindowResize, false);
    
    // Thêm các sự kiện khác nếu cần
}

// Xử lý sự kiện thay đổi kích thước cửa sổ
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Cập nhật hàm animate
function animate() {
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    // Cập nhật controls
    controls.update();
    
    // Cập nhật animation mixers
    animationMixers.forEach(mixer => mixer.update(delta));
    
    // Cập nhật hệ thống hạt trong cầu kính
    updateParticleSystems(delta);
    
    // Cập nhật ánh sáng LED
    updateLEDLights(elapsedTime);
    
    // Cập nhật cube camera cho phản chiếu
    if (cubeCamera) {
        cubeCamera.update(renderer, scene);
    }
    
    // Cập nhật thống kê
    stats.update();
    
    // Render scene
    renderer.render(scene, camera);
    
    // Yêu cầu frame tiếp theo
    requestAnimationFrame(animate);
}
