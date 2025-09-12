/**
 * 3D Smart City Main Application
 * Main initialization and application logic
 */

/**
 * Enhanced Error Handling
 */
function handleInitializationError(error) {
    console.error('Smart City Init Error:', error);
    
    // Hide loading spinner
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.style.display = 'none';
    
    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <h3>🚫 Không thể khởi tạo 3D Smart City</h3>
        <p><strong>Chi tiết lỗi:</strong> ${error.message}</p>
        <div class="error-actions">
            <button onclick="location.reload()" class="retry-button">🔄 Thử lại</button>
            <button onclick="window.history.back()" class="back-button">⬅️ Quay lại</button>
        </div>
    `;
    
    // Add error styling
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff4444, #cc3333);
        color: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        text-align: center;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
        max-width: 500px;
        min-width: 350px;
    `;
    
    // Style buttons
    const style = document.createElement('style');
    style.textContent = `
        .error-message h3 {
            margin: 0 0 15px 0;
            font-size: 24px;
        }
        .error-message p {
            margin: 10px 0 20px 0;
            font-size: 16px;
            background: rgba(0,0,0,0.2);
            padding: 10px;
            border-radius: 8px;
        }
        .error-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .retry-button, .back-button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .retry-button {
            background: #28a745;
            color: white;
        }
        .retry-button:hover {
            background: #218838;
            transform: translateY(-2px);
        }
        .back-button {
            background: #6c757d;
            color: white;
        }
        .back-button:hover {
            background: #545b62;
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(errorDiv);
    
    // Auto-hide after 30 seconds with countdown
    let countdown = 30;
    const countdownInterval = setInterval(() => {
        countdown--;
        const retryButton = errorDiv.querySelector('.retry-button');
        if (retryButton && countdown > 0) {
            retryButton.textContent = `🔄 Thử lại (${countdown}s)`;
        } else if (countdown <= 0) {
            clearInterval(countdownInterval);
            location.reload();
        }
    }, 1000);
}

/**
 * Main Smart City Initialization Function
 */
async function initSmartCity() {
    try {
        // Step 1: Ensure THREE.js is loaded
        updateLoadingProgress('Đang tải THREE.js...', 10);
        await ensureThreeJSLoaded();
        console.log('THREE.js loaded successfully:', THREE.REVISION);
        updateLoadingProgress('THREE.js đã tải thành công!', 20);
        
        // Step 2: Initialize core components
        updateLoadingProgress('Khởi tạo scene 3D...', 25);
        initScene();
        
        updateLoadingProgress('Khởi tạo WebGL renderer...', 30);
        await initRenderer();
        
        updateLoadingProgress('Thiết lập camera...', 35);
        initCamera();
        
        updateLoadingProgress('Tạo hệ thống ánh sáng...', 40);
        initLights();
        
        // Step 3: Setup controls
        updateLoadingProgress('Thiết lập điều khiển...', 45);
        await initControls();
        
        // Step 4: Create city elements
        updateLoadingProgress('Xây dựng tòa nhà...', 50);
        createBuildings();
        
        updateLoadingProgress('Tạo địa hình và cơ sở hạ tầng...', 60);
        createTerrain();
        
        // Step 5: Start animation
        updateLoadingProgress('Khởi động hệ thống render...', 90);
        animate();
        
        // Step 6: Finalize
        updateLoadingProgress('Hoàn tất khởi tạo...', 95);
        hideLoadingScreen();
        
    } catch (error) {
        handleInitializationError(error);
    }
}

/**
 * Hide loading screen and finalize
 */
function hideLoadingScreen() {
    // Setup event listeners
    setupEventListeners();
    console.log('✅ Event listeners setup completed');
    
    // Initialize anti-blinking system
    if (typeof initAntiBlinkingSystem === 'function') {
        initAntiBlinkingSystem();
        console.log('✅ Anti-blinking system activated');
    }
    
    // Hide loading screen with delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.transition = 'opacity 1s ease-out';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('🎉 3D Smart City loaded successfully!');
            }, 1000);
        }
    }, 500);
}

/**
 * Create Buildings (placeholder - will use existing functions)
 */
function createBuildings() {
    // This will use the existing createBuildings function from the main HTML file
    if (typeof window.createBuildings === 'function') {
        window.createBuildings();
    } else {
        console.log('📦 Buildings creation deferred to main implementation');
    }
}

/**
 * Create Terrain (placeholder - will use existing functions)
 */
function createTerrain() {
    // This will use the existing terrain creation functions
    const terrainFunctions = [
        'createGround',
        'createRoads', 
        'createParks',
        'createTrees',
        'createDataCenterCluster',
        'createParkingInfrastructure',
        'createStreetFurniture',
        'createInfrastructure',
        'createWaterFeatures',
        'createRiver'
    ];
    
    terrainFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            try {
                window[funcName]();
                console.log(`✅ ${funcName} completed`);
            } catch (error) {
                console.warn(`⚠️ ${funcName} failed:`, error);
            }
        }
    });
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Mouse interaction handlers
    if (renderer && renderer.domElement) {
        renderer.domElement.addEventListener('click', onMouseClick);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
    }
    
    // Popup close button
    const popupCloseBtn = document.getElementById('popupCloseBtn');
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', hideBuildingInfo);
    }
    
    // Close popup when clicking outside
    document.addEventListener('click', (event) => {
        const popup = document.getElementById('buildingInfoPopup');
        const isClickOnBuilding = event.target.tagName === 'CANVAS';
        const isClickInsidePopup = popup && popup.contains(event.target);
        
        if (!isClickOnBuilding && !isClickInsidePopup && popup && popup.classList.contains('show')) {
            hideBuildingInfo();
        }
    });
}

/**
 * Mouse Click Handler
 */
function onMouseClick(event) {
    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Raycast to find intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData && clickedObject.userData.buildingInfo) {
            showBuildingInfo(clickedObject.userData.buildingInfo, event.clientX, event.clientY);
        }
    }
}

/**
 * Mouse Move Handler
 */
function onMouseMove(event) {
    // Update mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

/**
 * Building Info Functions (placeholder)
 */
function showBuildingInfo(info, x, y) {
    if (typeof window.showBuildingInfo === 'function') {
        window.showBuildingInfo(info, x, y);
    }
}

function hideBuildingInfo() {
    if (typeof window.hideBuildingInfo === 'function') {
        window.hideBuildingInfo();
    }
}

console.log('🚀 Smart City Main Module loaded');