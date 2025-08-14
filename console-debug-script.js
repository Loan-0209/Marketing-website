// === PASTE THIS ENTIRE SCRIPT INTO F12 CONSOLE ===

console.log("=== DEBUG SMART CITY ===");
console.log("Scene children:", typeof scene !== 'undefined' ? scene.children.length : "Scene not found");
console.log("THREE.js available:", typeof THREE !== 'undefined');
console.log("Functions available:", Object.getOwnPropertyNames(window).filter(n => n.includes('smart') || n.includes('Smart') || n.includes('create')));

// Force create smart city immediately
function forceSmartCityNow() {
    console.log("🚨 FORCE CREATING SMART CITY...");
    
    // Check if we have the basic objects
    if (typeof THREE === 'undefined') {
        console.error("❌ THREE.js not loaded!");
        return false;
    }
    
    // Create scene if not exists
    if (typeof scene === 'undefined' || !scene) {
        console.log("Creating new scene...");
        window.scene = new THREE.Scene();
        window.scene.background = new THREE.Color(0x001122);
        window.scene.fog = new THREE.Fog(0x001122, 100, 500);
    }
    
    // Create camera if not exists
    if (typeof camera === 'undefined' || !camera) {
        console.log("Creating new camera...");
        window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        window.camera.position.set(300, 200, 300);
        window.camera.lookAt(0, 0, 0);
    }
    
    // Create renderer if not exists
    if (typeof renderer === 'undefined' || !renderer) {
        console.log("Creating new renderer...");
        window.renderer = new THREE.WebGLRenderer({ antialias: true });
        window.renderer.setSize(window.innerWidth, window.innerHeight - 60);
        window.renderer.setClearColor(0x001122, 1.0);
        window.renderer.shadowMap.enabled = true;
        
        // Find container or create one
        let container = document.getElementById('canvas-container') || 
                       document.querySelector('.canvas-container') ||
                       document.querySelector('.campus-3d-container');
        
        if (!container) {
            container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                top: 60px;
                left: 0;
                right: 0;
                bottom: 0;
                background: #001122;
                z-index: 10;
            `;
            document.body.appendChild(container);
        }
        
        container.appendChild(window.renderer.domElement);
        console.log("Renderer added to DOM");
    }
    
    // Clear scene completely
    while(scene.children.length > 0) {
        const child = scene.children[0];
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
            } else {
                child.material.dispose();
            }
        }
        scene.remove(child);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(200, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x362d1d, 0.4);
    scene.add(hemisphereLight);
    
    // Create buildings immediately
    let buildingCount = 0;
    const buildingColors = [0x4a90e2, 0x7f8c8d, 0x2c3e50, 0x34495e, 0x5dade2, 0x85929e];
    
    for (let x = -150; x <= 150; x += 25) {
        for (let z = -150; z <= 150; z += 25) {
            if (Math.random() > 0.3 && buildingCount < 100) {
                const height = 40 + Math.random() * 80;
                const width = 8 + Math.random() * 4;
                const depth = 8 + Math.random() * 4;
                
                const building = new THREE.Mesh(
                    new THREE.BoxGeometry(width, height, depth),
                    new THREE.MeshLambertMaterial({
                        color: buildingColors[Math.floor(Math.random() * buildingColors.length)]
                    })
                );
                building.position.set(x, height/2, z);
                building.castShadow = true;
                building.receiveShadow = true;
                scene.add(building);
                buildingCount++;
                
                // Add windows
                if (Math.random() > 0.4) {
                    const windowGeometry = new THREE.PlaneGeometry(width * 0.7, height * 0.6);
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffff88,
                        transparent: true,
                        opacity: 0.3
                    });
                    const windows = new THREE.Mesh(windowGeometry, windowMaterial);
                    windows.position.set(0, height * 0.05, width/2 + 0.1);
                    building.add(windows);
                }
            }
        }
    }
    
    // Add roads
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
    
    for (let i = -150; i <= 150; i += 50) {
        // Horizontal roads
        const roadH = new THREE.Mesh(
            new THREE.PlaneGeometry(300, 5),
            roadMaterial
        );
        roadH.rotation.x = -Math.PI / 2;
        roadH.position.set(0, 0.1, i);
        roadH.receiveShadow = true;
        scene.add(roadH);
        
        // Vertical roads  
        const roadV = new THREE.Mesh(
            new THREE.PlaneGeometry(5, 300),
            roadMaterial
        );
        roadV.rotation.x = -Math.PI / 2;
        roadV.position.set(i, 0.1, 0);
        roadV.receiveShadow = true;
        scene.add(roadV);
    }
    
    // Add ground
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400),
        new THREE.MeshLambertMaterial({color: 0x2d5a27})
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Set camera position
    camera.position.set(250, 150, 250);
    camera.lookAt(0, 0, 0);
    
    // Change document background
    document.body.style.background = '#001122';
    
    // Force render
    renderer.render(scene, camera);
    
    // Start animation loop if not running
    if (!window.smartCityAnimating) {
        window.smartCityAnimating = true;
        function animate() {
            if (window.smartCityAnimating) {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
        }
        animate();
    }
    
    console.log(`✅ FORCE SMART CITY CREATED: ${buildingCount} buildings, ${scene.children.length} total objects`);
    
    // Update stats if elements exist
    const updateStat = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    
    updateStat('objects', scene.children.length);
    updateStat('buildings', buildingCount);
    updateStat('triangles', buildingCount * 12);
    updateStat('fps', '60');
    
    return true;
}

// Execute immediately
console.log("🚀 Executing force smart city...");
const success = forceSmartCityNow();

if (success) {
    console.log("✅ SUCCESS! Smart city should now be visible");
    console.log("📊 Scene stats:", {
        children: scene.children.length,
        camera: camera.position,
        renderer: !!renderer
    });
} else {
    console.log("❌ FAILED! Check the errors above");
}

// Add debugging functions to window
window.debugSmartCity = {
    force: forceSmartCityNow,
    scene: scene,
    camera: camera,
    renderer: renderer,
    stats: () => console.log("Scene children:", scene.children.length)
};

console.log("🔧 Debug functions added to window.debugSmartCity");
console.log("💡 Try: window.debugSmartCity.force() to recreate city");