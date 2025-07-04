// Các biến toàn cục
let scene, camera, renderer, controls;
let stats, diagnosticLoader;
let clock = new THREE.Clock();

// Biến cho phản chiếu và texture
let cubeCamera, cubeRenderTarget;
let windowTexture, emissiveTexture;

// Mảng chứa các đối tượng
let buildings = [];
let bridges = [];
let streetLights = [];
let buildingLEDs = [];
let particleSystems = [];
let animationMixers = [];
let lodObjects = [];

// Định nghĩa các loại tòa nhà
const BUILDING_TYPES = {
    CENTRAL_TOWER: {
        width: 20,
        height: 80,
        depth: 20,
        color: 0x0047AB // Cobalt Blue
    },
    OFFICE_TOWER: {
        width: 15,
        height: 60,
        depth: 15,
        color: 0x0055CC
    },
    RESIDENTIAL: {
        width: 18,
        height: 40,
        depth: 18,
        color: 0x0066DD
    },
    SHOPPING_COMPLEX: {
        width: 25,
        height: 30,
        depth: 25,
        color: 0x0077EE
    },
    RESEARCH_LAB: {
        width: 20,
        height: 35,
        depth: 20,
        color: 0x0088FF
    }
};

// Khởi tạo scene
function init() {
    // Tạo scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1a2a);
    scene.fog = new THREE.FogExp2(0x0a1a2a, 0.002);
    
    // Tạo camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 30, 50);
    camera.lookAt(0, 0, 0);
    
    // Tạo renderer với tính năng nâng cao
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Tạo cube camera cho environment reflections
    cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });
    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);
    
    // Tạo textures
    createTextures();
    
    // Thêm controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Giới hạn góc nhìn xuống
    
    // Thêm ánh sáng
    createLights();
    
    // Tạo hệ thống đèn LED
    createLEDSystem();
    
    // Tạo mặt đất
    createGround();
    
    // Tạo các tòa nhà
    createBuildings();
    
    // Tạo các cầu kết nối
    createBridges();
    
    // Xử lý sự kiện
    setupEventListeners();
    
    // Thiết lập tối ưu hóa hiệu suất
    setupPerformanceOptimization();
    
    // Ẩn loading screen
    document.getElementById('loading-screen').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 500);
    
    // Bắt đầu animation loop
    animate();
}

// Tạo textures cho cửa sổ và ánh sáng
function createTextures() {
    // Tạo window texture với pattern nhỏ
    const windowCanvas = document.createElement('canvas');
    windowCanvas.width = 512;
    windowCanvas.height = 512;
    const ctx = windowCanvas.getContext('2d');
    
    // Vẽ nền đen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 512);
    
    // Vẽ các cửa sổ sáng
    ctx.fillStyle = '#FFFFFF';
    const gridSize = 8;
    const cellSize = 512 / gridSize;
    const windowSize = cellSize * 0.7;
    const offset = (cellSize - windowSize) / 2;
    
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            // Ngẫu nhiên một số cửa sổ sáng, một số tối
            if (Math.random() > 0.3) {
                ctx.fillRect(
                    x * cellSize + offset,
                    y * cellSize + offset,
                    windowSize,
                    windowSize
                );
            }
        }
    }
    
    windowTexture = new THREE.CanvasTexture(windowCanvas);
    windowTexture.wrapS = THREE.RepeatWrapping;
    windowTexture.wrapT = THREE.RepeatWrapping;
    windowTexture.repeat.set(5, 10); // Lặp lại nhiều lần trên tòa nhà
    
    // Tạo emissive texture cho cửa sổ phát sáng
    const emissiveCanvas = document.createElement('canvas');
    emissiveCanvas.width = 512;
    emissiveCanvas.height = 512;
    const emissiveCtx = emissiveCanvas.getContext('2d');
    
    // Vẽ nền đen
    emissiveCtx.fillStyle = '#000000';
    emissiveCtx.fillRect(0, 0, 512, 512);
    
    // Vẽ các điểm sáng
    const colors = ['#FFA500', '#FFFF00', '#00FFFF', '#FFFFFF'];
    
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 5 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const gradient = emissiveCtx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        emissiveCtx.fillStyle = gradient;
        emissiveCtx.beginPath();
        emissiveCtx.arc(x, y, radius * 2, 0, Math.PI * 2);
        emissiveCtx.fill();
    }
    
    emissiveTexture = new THREE.CanvasTexture(emissiveCanvas);
    emissiveTexture.wrapS = THREE.RepeatWrapping;
    emissiveTexture.wrapT = THREE.RepeatWrapping;
}

// Tạo ánh sáng
function createLights() {
    // Ánh sáng môi trường
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Ánh sáng định hướng (mặt trời)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 10;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    
    // Thêm ánh sáng điểm cho hiệu ứng đêm
    const pointLight1 = new THREE.PointLight(0x4fc3f7, 1, 50);
    pointLight1.position.set(20, 15, 20);
    pointLight1.castShadow = true;
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4fc3f7, 1, 50);
    pointLight2.position.set(-20, 15, -20);
    pointLight2.castShadow = true;
    scene.add(pointLight2);
    
    // Thêm ánh sáng spotlight cho hiệu ứng rực rỡ
    const spotLight = new THREE.SpotLight(0xffffff, 0.8, 100, Math.PI / 6, 0.5, 1);
    spotLight.position.set(0, 50, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
}

// Tạo mặt đất
function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2,
        wireframe: false
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Thêm grid helper
    const gridHelper = new THREE.GridHelper(200, 50, 0x555555, 0x333333);
    scene.add(gridHelper);
}

// Tạo các cầu kết nối
function createBridges() {
    console.log('Creating glass bridges...');
    
    // Cấu hình các cầu kết nối
    const bridgeConfigs = [
        // Kết nối từ trung tâm đến các tòa nhà xung quanh
        { start: { x: 0, y: 30, z: 0 }, end: { x: -40, y: 25, z: -40 }, color: 0x0088FF },
        { start: { x: 0, y: 30, z: 0 }, end: { x: -40, y: 25, z: 0 }, color: 0x0088FF },
        { start: { x: 0, y: 30, z: 0 }, end: { x: -40, y: 25, z: 40 }, color: 0x0088FF },
        { start: { x: 0, y: 30, z: 0 }, end: { x: 0, y: 25, z: -40 }, color: 0x0088FF },
        { start: { x: 0, y: 30, z: 0 }, end: { x: 0, y: 25, z: 40 }, color: 0x0088FF },
        { start: { x: 0, y: 30, z: 0 }, end: { x: 40, y: 25, z: -40 }, color: 0x0088FF },
        { start: { x: 0, y: 30, z: 0 }, end: { x: 40, y: 25, z: 0 }, color: 0x0088FF },
        { start: { x: 0, y: 30, z: 0 }, end: { x: 40, y: 25, z: 40 }, color: 0x0088FF }
    ];
    
    // Tạo các cầu
    bridgeConfigs.forEach((config, index) => {
        createGlassBridge(config.start, config.end, config.color, `bridge_${index}`);
    });
}

// Tạo cầu kính
function createGlassBridge(start, end, color, name) {
    // Tính toán hướng và độ dài của cầu
    const direction = new THREE.Vector3().subVectors(
        new THREE.Vector3(end.x, end.y, end.z),
        new THREE.Vector3(start.x, start.y, start.z)
    );
    
    const length = direction.length();
    const bridgeRadius = 3; // Bán kính của cầu
    
    // Tạo group cho cầu
    const bridgeGroup = new THREE.Group();
    bridgeGroup.name = name;
    
    // Vật liệu kính cho cầu
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.95,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMap: cubeRenderTarget.texture,
        side: THREE.DoubleSide
    });
    
    // Tạo ống kính cho cầu
    const bridgeGeometry = new THREE.CylinderGeometry(bridgeRadius, bridgeRadius, length, 16, 1, true);
    const bridge = new THREE.Mesh(bridgeGeometry, glassMaterial);
    
    // Xoay và định vị cầu
    bridge.rotation.x = Math.PI / 2;
    
    // Tính toán góc xoay để hướng cầu
    const axis = new THREE.Vector3(0, 0, 1);
    const directionNorm = direction.clone().normalize();
    bridge.quaternion.setFromUnitVectors(axis, directionNorm);
    
    // Đặt vị trí của cầu ở giữa điểm đầu và điểm cuối
    const midPoint = new THREE.Vector3().addVectors(
        new THREE.Vector3(start.x, start.y, start.z),
        new THREE.Vector3(end.x, end.y, end.z)
    ).multiplyScalar(0.5);
    
    bridge.position.copy(midPoint);
    bridgeGroup.add(bridge);
    
    // Thêm dải đèn LED dọc theo cầu
    addBridgeLighting(bridgeGroup, length, bridgeRadius);
    
    // Thêm hệ thống hạt cho cầu
    addBridgeParticles(bridgeGroup, length, bridgeRadius, color);
    
    // Thêm vào scene
    scene.add(bridgeGroup);
    bridges.push(bridgeGroup);
    
    return bridgeGroup;
}

// Thêm ánh sáng cho cầu
function addBridgeLighting(bridgeGroup, length, radius) {
    // Tạo dải đèn LED dọc theo cầu
    const lightStripGeometry = new THREE.BoxGeometry(length * 0.98, 0.3, 0.1);
    const lightStripMaterial = new THREE.MeshBasicMaterial({
        color: 0x4fc3f7,
        emissive: 0x4fc3f7,
        emissiveIntensity: 0.8
    });
    
    // Dải đèn trên
    const topLightStrip = new THREE.Mesh(lightStripGeometry, lightStripMaterial);
    topLightStrip.position.set(0, radius * 0.8, 0);
    topLightStrip.rotation.z = Math.PI / 2;
    bridgeGroup.add(topLightStrip);
    
    // Dải đèn dưới
    const bottomLightStrip = new THREE.Mesh(lightStripGeometry, lightStripMaterial);
    bottomLightStrip.position.set(0, -radius * 0.8, 0);
    bottomLightStrip.rotation.z = Math.PI / 2;
    bridgeGroup.add(bottomLightStrip);
    
    // Thêm ánh sáng điểm dọc theo cầu
    const numLights = 5;
    const lightSpacing = length / (numLights + 1);
    
    for (let i = 1; i <= numLights; i++) {
        const pointLight = new THREE.PointLight(0x4fc3f7, 0.5, 10);
        pointLight.position.set((i * lightSpacing) - length / 2, 0, 0);
        bridgeGroup.add(pointLight);
    }
}

// Thêm hệ thống hạt cho cầu
function addBridgeParticles(bridgeGroup, length, radius, color) {
    // Tạo hệ thống hạt
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    // Tạo vị trí ngẫu nhiên cho các hạt trong ống
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Vị trí ban đầu - dọc theo chiều dài của cầu
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * radius * 0.7;
        
        positions[i * 3] = (Math.random() - 0.5) * length; // Vị trí dọc theo cầu
        positions[i * 3 + 1] = r * Math.cos(theta); // Vị trí theo bán kính
        positions[i * 3 + 2] = r * Math.sin(theta); // Vị trí theo bán kính
        
        // Tốc độ - chỉ di chuyển dọc theo cầu
        velocities.push({
            x: (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
            y: 0,
            z: 0
        });
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    bridgeGroup.add(particles);
    
    // Lưu hệ thống hạt và thông tin cần thiết để animation
    particleSystems.push({
        particles: particles,
        geometry: particleGeometry,
        velocities: velocities,
        length: length
    });
}

// Tạo các tòa nhà
function createBuildings() {
    // Sử dụng DiagnosticModelLoader để tạo các tòa nhà
    diagnosticLoader = new DiagnosticModelLoader(scene, renderer);
    
    // Tạo tòa nhà trung tâm (Central Tower)
    createEnhancedGlassBuilding(
        0, 0, 0, 
        BUILDING_TYPES.CENTRAL_TOWER.width,
        BUILDING_TYPES.CENTRAL_TOWER.height,
        BUILDING_TYPES.CENTRAL_TOWER.depth,
        BUILDING_TYPES.CENTRAL_TOWER.color,
        'central_tower'
    );
    
    // Các vị trí và loại tòa nhà
    const buildingConfigs = [
        { x: -40, z: -40, type: 'OFFICE_TOWER', name: 'office_tower_1' },
        { x: -40, z: 0, type: 'RESIDENTIAL', name: 'residential_1' },
        { x: -40, z: 40, type: 'SHOPPING_COMPLEX', name: 'shopping_1' },
        { x: 0, z: -40, type: 'RESEARCH_LAB', name: 'research_1' },
        { x: 0, z: 40, type: 'OFFICE_TOWER', name: 'office_tower_2' },
        { x: 40, z: -40, type: 'RESIDENTIAL', name: 'residential_2' },
        { x: 40, z: 0, type: 'RESEARCH_LAB', name: 'research_2' },
        { x: 40, z: 40, type: 'SHOPPING_COMPLEX', name: 'shopping_2' }
    ];
    
    // Tạo các tòa nhà xung quanh với các loại khác nhau
    buildingConfigs.forEach(config => {
        const buildingType = BUILDING_TYPES[config.type];
        createEnhancedGlassBuilding(
            config.x, 0, config.z,
            buildingType.width,
            buildingType.height,
            buildingType.depth,
            buildingType.color,
            config.name
        );
    });
    
    // Cập nhật số lượng đối tượng
    updateStats();
}

// Tạo tòa nhà kính nâng cao
function createEnhancedGlassBuilding(x, y, z, width, height, depth, color, name) {
    // Tạo group cho tòa nhà
    const buildingGroup = new THREE.Group();
    buildingGroup.name = name;
    
    // Tạo vật liệu kính cobalt blue nâng cao
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.8, // Tăng tính trong suốt
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMap: cubeRenderTarget.texture,
        side: THREE.DoubleSide
    });
    
    // Tạo vật liệu cho cửa sổ phát sáng
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.5,
        map: windowTexture,
        emissive: 0x4fc3f7,
        emissiveMap: emissiveTexture,
        emissiveIntensity: 0.5
    });
    
    // Tạo hình hộp cho tòa nhà
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(geometry, glassMaterial);
    building.position.set(0, height / 2, 0);
    building.castShadow = true;
    building.receiveShadow = true;
    buildingGroup.add(building);
    
    // Thêm chi tiết kiến trúc
    addEnhancedArchitecturalDetails(buildingGroup, width, height, depth, windowMaterial);
    
    // Thêm animation cho tòa nhà
    addBuildingAnimation(buildingGroup, name);
    
    // Đặt vị trí cho cả group
    buildingGroup.position.set(x, y, z);
    
    // Thêm vào scene và mảng buildings
    scene.add(buildingGroup);
    buildings.push(buildingGroup);
    
    // Tạo LOD (Level of Detail) cho tòa nhà
    createBuildingLOD(x, y, z, width, height, depth, color, name);
    
    return buildingGroup;
}

// Thêm chi tiết kiến trúc nâng cao cho tòa nhà
function addEnhancedArchitecturalDetails(buildingGroup, width, height, depth, windowMaterial) {
    // Tạo mái nhà
    const roofGeometry = new THREE.ConeGeometry(width * 0.6, height * 0.2, 4);
    const roofMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0066CC,
        metalness: 0.8,
        roughness: 0.2,
        reflectivity: 1.0,
        envMap: cubeRenderTarget.texture
    });
    
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, height + height * 0.1, 0);
    roof.rotation.y = Math.PI / 4; // Xoay 45 độ
    roof.castShadow = true;
    buildingGroup.add(roof);
    
    // Tạo antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.5, 0.5, height * 0.3, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, height + height * 0.3, 0);
    antenna.castShadow = true;
    buildingGroup.add(antenna);
    
    // Tạo đỉnh antenna
    const antennaTipGeometry = new THREE.SphereGeometry(1, 16, 16);
    const antennaTipMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });
    
    const antennaTip = new THREE.Mesh(antennaTipGeometry, antennaTipMaterial);
    antennaTip.position.set(0, height + height * 0.45, 0);
    buildingGroup.add(antennaTip);
    
    // Thêm cửa sổ trên các mặt của tòa nhà
    const windowSize = Math.min(width, depth) * 0.15;
    const windowGeometry = new THREE.PlaneGeometry(width * 0.8, height * 0.8);
    
    // Mặt trước và sau
    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    frontWindow.position.set(0, height * 0.5, depth / 2 + 0.05);
    buildingGroup.add(frontWindow);
    
    const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    backWindow.position.set(0, height * 0.5, -depth / 2 - 0.05);
    backWindow.rotation.y = Math.PI;
    buildingGroup.add(backWindow);
    
    // Mặt trái và phải
    const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    leftWindow.position.set(-width / 2 - 0.05, height * 0.5, 0);
    leftWindow.rotation.y = -Math.PI / 2;
    buildingGroup.add(leftWindow);
    
    const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    rightWindow.position.set(width / 2 + 0.05, height * 0.5, 0);
    rightWindow.rotation.y = Math.PI / 2;
    buildingGroup.add(rightWindow);
}

// Thêm animation cho tòa nhà
function addBuildingAnimation(buildingGroup, name) {
    // Tạo animation cho tòa nhà - subtle floating motion
    const mixer = new THREE.AnimationMixer(buildingGroup);
    
    // Tạo keyframe track cho animation
    const times = [0, 5, 10]; // Thời gian theo giây
    const values = [
        0, 0, 0, // Vị trí ban đầu
        0, 0.5, 0, // Vị trí giữa
        0, 0, 0 // Vị trí cuối
    ];
    
    const positionKF = new THREE.KeyframeTrack(
        '.position[y]', // Tên thuộc tính
        times, // Thời gian
        values // Giá trị
    );
    
    // Tạo animation clip
    const clip = new THREE.AnimationClip(name + '_float', 10, [positionKF]);
    
    // Tạo action và chạy animation
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat);
    action.play();
    
    // Lưu mixer vào mảng để cập nhật trong animation loop
    animationMixers.push(mixer);
}

// Tạo LOD (Level of Detail) cho tòa nhà
function createBuildingLOD(x, y, z, width, height, depth, color, name) {
    // Tạo LOD object
    const lod = new THREE.LOD();
    lod.position.set(x, y, z);
    
    // Level 0 - Chi tiết cao (sử dụng tòa nhà hiện tại)
    // Level 1 - Chi tiết trung bình
    const mediumDetailGeometry = new THREE.BoxGeometry(width, height, depth);
    const mediumDetailMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.5
    });
    
    const mediumDetailMesh = new THREE.Mesh(mediumDetailGeometry, mediumDetailMaterial);
    mediumDetailMesh.position.set(0, height / 2, 0);
    mediumDetailMesh.castShadow = true;
    
    // Level 2 - Chi tiết thấp
    const lowDetailGeometry = new THREE.BoxGeometry(width, height, depth);
    const lowDetailMaterial = new THREE.MeshBasicMaterial({ color: color });
    
    const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, lowDetailMaterial);
    lowDetailMesh.position.set(0, height / 2, 0);
    
    // Thêm các level vào LOD
    // Không thêm level 0 vì đã có trong scene
    const mediumDetail = new THREE.Group();
    mediumDetail.add(mediumDetailMesh);
    lod.addLevel(mediumDetail, 100);
    
    const lowDetail = new THREE.Group();
    lowDetail.add(lowDetailMesh);
    lod.addLevel(lowDetail, 200);
    
    // Lưu LOD để quản lý sau này
    lodObjects.push(lod);
}

// Tạo tòa nhà kính
function createGlassBuilding(x, y, z, width, height, depth, color) {
    const group = new THREE.Group();
    
    // Tạo khối chính của tòa nhà
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        metalness: 0.2,
        roughness: 0.1,
        reflectivity: 1.0,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    
    const building = new THREE.Mesh(geometry, material);
    building.position.set(0, height / 2, 0);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);
    
    // Thêm chi tiết kiến trúc
    addArchitecturalDetails(group, width, height, depth);
    
    // Đặt vị trí của nhóm
    group.position.set(x, y, z);
    scene.add(group);
    
    return group;
}

// Thêm chi tiết kiến trúc cho tòa nhà
function addArchitecturalDetails(buildingGroup, width, height, depth) {
    // Thêm mái nhà
    const roofGeometry = new THREE.BoxGeometry(width * 0.8, height * 0.05, depth * 0.8);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.5
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = height + height * 0.025;
    roof.castShadow = true;
    buildingGroup.add(roof);
    
    // Thêm ăng-ten
    const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, height * 0.2, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.5,
        metalness: 0.8
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = height + height * 0.1;
    antenna.castShadow = true;
    buildingGroup.add(antenna);
    
    // Thêm cửa sổ
    const windowSize = Math.min(width, depth) * 0.15;
    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xADD8E6,
        transparent: true,
        opacity: 0.9,
        metalness: 0.2,
        roughness: 0.05,
        reflectivity: 1.0,
        side: THREE.DoubleSide
    });
    
    // Mặt trước và sau
    for (let y = height * 0.2; y < height * 0.9; y += height * 0.15) {
        for (let x = -width * 0.3; x <= width * 0.3; x += width * 0.3) {
            // Mặt trước
            const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
            frontWindow.position.set(x, y, depth / 2 + 0.01);
            frontWindow.castShadow = false;
            frontWindow.receiveShadow = false;
            buildingGroup.add(frontWindow);
            
            // Mặt sau
            const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
            backWindow.position.set(x, y, -depth / 2 - 0.01);
            backWindow.rotation.y = Math.PI;
            backWindow.castShadow = false;
            backWindow.receiveShadow = false;
            buildingGroup.add(backWindow);
        }
    }
}

// Xử lý sự kiện
function setupEventListeners() {
    // Xử lý resize cửa sổ
    window.addEventListener('resize', onWindowResize);
    
    // Xử lý nút điều khiển
    document.getElementById('toggle-animation').addEventListener('click', toggleAnimation);
    document.getElementById('change-view').addEventListener('click', changeView);
    document.getElementById('toggle-lights').addEventListener('click', toggleLights);
    document.getElementById('reset-camera').addEventListener('click', resetCamera);
}

// Xử lý resize cửa sổ
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Bật/tắt animation
function toggleAnimation() {
    animationEnabled = !animationEnabled;
    document.getElementById('toggle-animation').textContent = animationEnabled ? 'Pause Animation' : 'Start Animation';
}

// Thay đổi góc nhìn
function changeView() {
    const views = [
        { x: 50, y: 30, z: 50 },
        { x: 0, y: 50, z: 0 },
        { x: -50, y: 30, z: -50 },
        { x: 0, y: 10, z: 50 }
    ];
    
    // Đơn giản hóa thay đổi view
    camera.position.set(0, 50, 0);
    camera.lookAt(0, 0, 0);
}

// Bật/tắt đèn
function toggleLights() {
    lightsEnabled = !lightsEnabled;
    document.getElementById('toggle-lights').textContent = lightsEnabled ? 'Turn Off Lights' : 'Turn On Lights';
}

// Reset camera
function resetCamera() {
    camera.position.set(50, 30, 50);
    camera.lookAt(0, 0, 0);
}

// Cập nhật thống kê
function updateStats() {
    let objectCount = 0;
    let triangleCount = 0;
    
    scene.traverse(object => {
        if (object.isMesh) {
            objectCount++;
            if (object.geometry.index !== null) {
                triangleCount += object.geometry.index.count / 3;
            } else if (object.geometry.attributes.position !== undefined) {
                triangleCount += object.geometry.attributes.position.count / 3;
            }
        }
    });
    
    document.getElementById('objects-counter').textContent = objectCount;
    document.getElementById('triangles-counter').textContent = Math.round(triangleCount);
}

// Animation loop
function animate() {
    // Sử dụng force-render-loop.js để đảm bảo việc render liên tục
    // Không cần gọi requestAnimationFrame ở đây vì force-render-loop.js sẽ lo
    
    // Cập nhật FPS
    const delta = clock.getDelta();
    document.getElementById('fps-counter').textContent = Math.round(1 / delta);
    
    // Cập nhật controls
    if (controls) controls.update();
    
    // Không cần gọi renderer.render() vì force-render-loop.js sẽ lo
}

// Khởi tạo khi trang tải xong
window.addEventListener('load', init);
