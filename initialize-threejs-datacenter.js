// Kiểm tra và khởi tạo Three.js components
function initializeThreeJS() {
    console.log('Checking Three.js setup...');
    
    // Check if THREE exists
    if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded');
        return false;
    }
    
    // Find or create canvas
    let canvas = document.querySelector('canvas');
    if (!canvas) {
        console.log('Creating new canvas...');
        canvas = document.createElement('canvas');
        canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;';
        document.body.appendChild(canvas);
    }
    
    // Initialize renderer
    if (!window.renderer) {
        console.log('Creating renderer...');
        window.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        window.renderer.setSize(window.innerWidth, window.innerHeight);
        window.renderer.setClearColor(0x87CEEB);
    }
    
    // Initialize scene
    if (!window.scene) {
        console.log('Creating scene...');
        window.scene = new THREE.Scene();
    }
    
    // Initialize camera
    if (!window.camera) {
        console.log('Creating camera...');
        window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        window.camera.position.set(30, 25, 30);
    }
    
    // Initialize controls if OrbitControls available
    if (typeof THREE.OrbitControls !== 'undefined' && !window.controls) {
        console.log('Creating controls...');
        window.controls = new THREE.OrbitControls(window.camera, window.renderer.domElement);
    }
    
    console.log('Three.js setup complete');
    return true;
}

// Modified restore function với scene initialization
function restoreOriginalDataCenters() {
    console.log('Starting data center restoration...');
    
    // Initialize Three.js if needed
    if (!initializeThreeJS()) {
        console.error('Failed to initialize Three.js');
        return;
    }
    
    // Clear existing scene
    while (window.scene.children.length > 0) {
        window.scene.remove(window.scene.children[0]);
    }
    
    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    window.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 25);
    window.scene.add(directionalLight);
    
    // Add ground
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshLambertMaterial({ color: 0x555555 })
    );
    ground.rotation.x = -Math.PI / 2;
    window.scene.add(ground);
    
    // Create data center cluster
    const dataCenterGroup = new THREE.Group();
    dataCenterGroup.name = 'DataCenterCluster';
    
    for (let i = 0; i < 4; i++) {
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(8, 6, 12),
            new THREE.MeshLambertMaterial({ color: 0x2c3e50 })
        );
        building.position.set(20 + i * 10, 3, -15);
        building.name = `DATA_CENTER_0${i + 1}`;
        
        // Add server racks
        for (let j = 0; j < 12; j++) {
            const server = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 1.8, 0.8),
                new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
            );
            server.position.set(
                20 + i * 10 + (j % 4) * 1.5 - 2.25,
                0.9,
                -15 + Math.floor(j / 4) * 1.2 - 1.2
            );
            window.scene.add(server);
            
            // Server lights
            const light = new THREE.PointLight(0x00ff00, 0.3, 2);
            light.position.copy(server.position);
            light.position.y += 0.8;
            window.scene.add(light);
        }
        
        dataCenterGroup.add(building);
    }
    window.scene.add(dataCenterGroup);
    
    // Add buildings around the city
    const colors = [0x8e44ad, 0x3498db, 0xe67e22, 0x2ecc71, 0xe74c3c];
    for (let i = 0; i < 25; i++) {
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(4 + Math.random() * 4, 5 + Math.random() * 15, 4 + Math.random() * 4),
            new THREE.MeshLambertMaterial({ color: colors[Math.floor(Math.random() * colors.length)] })
        );
        
        let x, z;
        do {
            x = (Math.random() - 0.5) * 140;
            z = (Math.random() - 0.5) * 140;
        } while (x > 15 && x < 55 && z > -25 && z < -5);
        
        building.position.set(x, building.geometry.parameters.height / 2, z);
        window.scene.add(building);
    }
    
    // Set camera position
    window.camera.position.set(30, 25, 30);
    window.camera.lookAt(0, 0, 0);
    
    // Remove fallback notification
    const notification = document.querySelector('[data-fallback-notification]');
    if (notification) notification.remove();
    
    console.log('Data centers restored successfully!');
    console.log('Scene children:', window.scene.children.length);
    
    // Start render loop
    function animate() {
        requestAnimationFrame(animate);
        if (window.controls) window.controls.update();
        window.renderer.render(window.scene, window.camera);
    }
    animate();
    
    return true;
}

// Execute the restore
restoreOriginalDataCenters();