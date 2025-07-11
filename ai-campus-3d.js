// Các biến toàn cục
let scene, camera, renderer, controls;
let stats, diagnosticLoader;
let clock;

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
    // Khởi tạo clock
    clock = new THREE.Clock();
    
    // Tạo scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 50, 200);
    
    // Tạo camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    
    // Tạo renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Tạo controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Tạo stats
    stats = new Stats();
    document.getElementById('container').appendChild(stats.dom);
    
    // Tạo cube camera cho phản chiếu
    cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });
    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);
    
    // Tạo texture cho cửa sổ
    windowTexture = createWindowTexture();
    emissiveTexture = createEmissiveTexture();
    
    // Thêm ánh sáng
    createLights();
    
    // Tạo mặt đất
    createGround();
    
    // Tạo các tòa nhà
    createBuildings();
    
    // Tạo các cầu kết nối
    createBridges();
    
    // Tạo hệ thống đèn LED
    createLEDSystem();
    
    // Xử lý sự kiện
    setupEventListeners();
    
    // Bắt đầu animation loop
    animate();
    
    // Ẩn màn hình loading
    document.getElementById('loading-screen').style.display = 'none';
}

// Tạo texture cho cửa sổ
function createWindowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Tạo nền đen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tạo lưới cửa sổ
    const windowSize = 32;
    const gap = 4;
    const rows = Math.floor(canvas.height / (windowSize + gap));
    const cols = Math.floor(canvas.width / (windowSize + gap));
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Tạo cửa sổ với màu ngẫu nhiên
            const brightness = Math.random() * 0.5 + 0.5; // 0.5 - 1.0
            const r = Math.floor(brightness * 255);
            const g = Math.floor(brightness * 255);
            const b = Math.floor(brightness * 255);
            
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(
                col * (windowSize + gap) + gap,
                row * (windowSize + gap) + gap,
                windowSize,
                windowSize
            );
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
}

// Tạo texture phát sáng cho cửa sổ
function createEmissiveTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Tạo nền đen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tạo lưới cửa sổ phát sáng
    const windowSize = 32;
    const gap = 4;
    const rows = Math.floor(canvas.height / (windowSize + gap));
    const cols = Math.floor(canvas.width / (windowSize + gap));
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Một số cửa sổ sáng hơn
            if (Math.random() > 0.3) {
                const brightness = Math.random() * 0.7 + 0.3; // 0.3 - 1.0
                const r = Math.floor(brightness * 255);
                const g = Math.floor(brightness * 255);
                const b = Math.floor(brightness * 255);
                
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(
                    col * (windowSize + gap) + gap,
                    row * (windowSize + gap) + gap,
                    windowSize,
                    windowSize
                );
            }
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
}

// Tạo ánh sáng
function createLights() {
    // Ánh sáng môi trường
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Ánh sáng định hướng chính
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    
    // Cấu hình shadow cho directionalLight
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 10;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    
    scene.add(directionalLight);
    
    // Thêm ánh sáng điểm
    const pointLight1 = new THREE.PointLight(0x4fc3f7, 1, 50);
    pointLight1.position.set(0, 30, 0);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4fc3f7, 0.5, 100);
    pointLight2.position.set(-50, 20, -50);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x4fc3f7, 0.5, 100);
    pointLight3.position.set(50, 20, 50);
    scene.add(pointLight3);
    
    // Thêm ánh sáng spot
    const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 1);
    spotLight.position.set(0, 50, 0);
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);
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
