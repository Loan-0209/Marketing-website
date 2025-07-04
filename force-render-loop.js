// Ensure continuous rendering
function forceRenderLoop() {
    if (typeof renderer === 'undefined' || typeof scene === 'undefined' || typeof camera === 'undefined') {
        console.error('❌ Missing required 3D objects (renderer, scene, or camera)');
        console.log('🔍 Attempting to find global Three.js objects...');
        
        // Try to find renderer, scene, and camera in global scope
        const foundRenderer = window.renderer || window.THREE_RENDERER;
        const foundScene = window.scene || window.THREE_SCENE;
        const foundCamera = window.camera || window.THREE_CAMERA;
        
        if (foundRenderer && foundScene && foundCamera) {
            console.log('✅ Found global Three.js objects, using them');
            window.renderer = foundRenderer;
            window.scene = foundScene;
            window.camera = foundCamera;
        } else {
            console.error('❌ Could not find Three.js objects, creating emergency objects');
            
            // Create emergency objects if they don't exist
            if (!window.scene) {
                window.scene = new THREE.Scene();
                console.log('🆕 Created emergency scene');
            }
            
            if (!window.camera) {
                window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                window.camera.position.set(0, 20, 30);
                console.log('🆕 Created emergency camera');
            }
            
            if (!window.renderer) {
                window.renderer = new THREE.WebGLRenderer({ antialias: true });
                window.renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(window.renderer.domElement);
                console.log('🆕 Created emergency renderer');
            }
        }
    }
    
    // Add a test cube if scene is empty
    if (window.scene.children.length === 0) {
        console.log('⚠️ Scene is empty, adding test cube');
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        window.scene.add(cube);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        window.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        window.scene.add(directionalLight);
    }
    
    // Render the scene
    try {
        window.renderer.render(window.scene, window.camera);
        console.log(`🎬 Rendered frame. Objects: ${window.scene.children.length}`);
        
        // Log scene hierarchy every 100 frames
        if (window.frameCount === undefined) {
            window.frameCount = 0;
        }
        window.frameCount++;
        
        if (window.frameCount % 100 === 0) {
            console.log('📊 Scene hierarchy:');
            logSceneHierarchy(window.scene);
        }
    } catch (error) {
        console.error('❌ Render error:', error);
    }
    
    // Continue the render loop
    requestAnimationFrame(forceRenderLoop);
}

// Helper function to log scene hierarchy
function logSceneHierarchy(scene, indent = '') {
    if (!scene) return;
    
    scene.children.forEach((child, index) => {
        const type = child.type || 'Unknown';
        const name = child.name || `[${type}_${index}]`;
        const position = child.position ? `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})` : '';
        
        console.log(`${indent}├─ ${name} [${type}] ${position}`);
        
        if (child.children && child.children.length > 0) {
            logSceneHierarchy(child, indent + '│  ');
        }
    });
}

// Start render loop
console.log('🚀 Starting force render loop...');
forceRenderLoop();
