/**
 * 3D Smart City Components Module
 * Contains all component creation functions and utilities
 */

// Global variables
let scene, camera, renderer, controls;
let raycaster, mouse;
let lights = [];

/**
 * Loading Progress Management
 */
function updateLoadingProgress(message, percentage) {
    const loadingText = document.querySelector('.loading-text');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const progressElement = document.getElementById('loading-progress');
    
    if (loadingText) loadingText.textContent = message;
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = message;
    if (progressElement) {
        const displayMessage = percentage ? `${message} (${percentage}%)` : message;
        progressElement.textContent = displayMessage;
    }
    
    console.log(`📱 Loading: ${message} (${percentage}%)`);
    
    // Add visual progress bar if percentage provided
    if (percentage !== null) {
        updateProgressBar(percentage);
    }
}

function updateProgressBar(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

/**
 * Scene Initialization
 */
function initScene() {
    updateLoadingProgress('Khởi tạo scene 3D...', 25);
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    console.log('✅ Scene initialized');
}

/**
 * Camera Initialization  
 */
function initCamera() {
    updateLoadingProgress('Thiết lập camera...', 35);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(150, 100, 150);
    camera.lookAt(0, 0, 0);
    
    console.log('✅ Camera initialized');
}

/**
 * WebGL Renderer Initialization
 */
async function initRenderer() {
    updateLoadingProgress('Khởi tạo WebGL renderer...', 30);
    
    try {
        const container = document.getElementById('canvas-container');
        if (!container) {
            throw new Error('Canvas container not found');
        }
        
        // Create WebGL renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Test renderer
        const gl = renderer.getContext();
        if (!gl || gl.isContextLost()) {
            renderer.dispose();
            throw new Error('WebGL context creation failed');
        }
        
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        // Store globally
        window.renderer = renderer;
        
        console.log('✅ WebGL renderer initialized');
        
    } catch (error) {
        console.error('❌ Renderer initialization failed:', error);
        throw error;
    }
}

/**
 * Lighting System Setup
 */
function initLights() {
    updateLoadingProgress('Tạo hệ thống ánh sáng...', 40);
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Hemisphere light for better ambient
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x545454, 0.4);
    scene.add(hemisphereLight);
    
    console.log('✅ Lighting setup completed');
}

/**
 * Controls Setup
 */
async function initControls() {
    try {
        // Load OrbitControls
        const controlsScript = document.createElement('script');
        controlsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/controls/OrbitControls.js';
        
        return new Promise((resolve, reject) => {
            controlsScript.onload = function() {
                if (typeof THREE.OrbitControls !== 'undefined') {
                    controls = new THREE.OrbitControls(camera, renderer.domElement);
                    controls.enableDamping = true;
                    controls.dampingFactor = 0.05;
                    controls.enableZoom = true;
                    controls.autoRotate = false;
                    console.log('✅ OrbitControls loaded');
                    resolve(controls);
                } else {
                    reject(new Error('OrbitControls not found'));
                }
            };
            controlsScript.onerror = () => reject(new Error('Failed to load OrbitControls'));
            document.head.appendChild(controlsScript);
        });
    } catch (error) {
        console.warn('⚠️ OrbitControls failed, using fallback:', error);
        setupFallbackControls();
    }
}

/**
 * Fallback Controls
 */
function setupFallbackControls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    renderer.domElement.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    });
    
    renderer.domElement.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;
            
            camera.position.x += deltaX * 0.5;
            camera.position.y -= deltaY * 0.5;
            camera.lookAt(0, 0, 0);
            
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    console.log('✅ Fallback controls activated');
}

/**
 * Animation Loop
 */
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    if (controls && controls.update) {
        controls.update();
    }
    
    // Render scene
    renderer.render(scene, camera);
}

/**
 * Window Resize Handler
 */
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Setup resize listener
window.addEventListener('resize', handleResize);

console.log('🧩 Smart City Components Module loaded');