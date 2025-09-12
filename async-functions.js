// ASYNC FUNCTION COMPONENTS FOR initSmartCity()

// Lights initialization
function initLights() {
    updateLoadingProgress('Tạo ánh sáng...', 40);
    setupLighting();
    console.log('✅ Lighting setup completed');
}

// Terrain creation (includes ground, roads, parks)
function createTerrain() {
    updateLoadingProgress('Xây dựng nền và đường...', 45);
    
    // Create city elements (with progress tracking)
    createGround();
    console.log('✅ Ground created');
    
    createRoads();
    console.log('✅ Roads created');
    
    updateLoadingProgress('Tạo công viên và cây xanh...', 55);
    createParks();
    console.log('✅ Parks created');
    
    createTrees();
    console.log('✅ Trees created');
    
    updateLoadingProgress('Tạo trung tâm dữ liệu...', 75);
    createDataCenterCluster();
    console.log('✅ Data center cluster created');
    
    updateLoadingProgress('Hoàn thiện hệ thống...', 85);
    
    updateLoadingProgress('Tạo bãi đỗ xe...', 88);
    createParkingInfrastructure();
    console.log('✅ Parking infrastructure created');
    
    updateLoadingProgress('Thêm nội thất đường phố...', 92);
    createStreetFurniture();
    createInfrastructure();
    console.log('✅ Street furniture and infrastructure created');
    
    updateLoadingProgress('Tạo tính năng nước...', 95);
    createWaterFeatures();
    console.log('✅ Water features created');
    
    createRiver();
    console.log('✅ River created');
}

// Hide loading screen and finalize
function hideLoadingScreen() {
    updateLoadingProgress('Thiết lập event listeners...', 98);
    
    // Setup event listeners
    setupEventListeners();
    console.log('✅ Event listeners setup completed');
    
    updateLoadingProgress('Bật Anti-Blinking...', 99);
    
    // Initialize anti-blinking system
    initAntiBlinkingSystem();
    console.log('✅ Anti-blinking system activated');
    
    // Complete loading
    updateLoadingProgress('Hoàn tất!', 100);
    
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

// Error message display
function showErrorMessage(message) {
    console.error('❌ Error:', message);
    
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const progressText = loadingScreen.querySelector('.progress-text');
        if (progressText) {
            progressText.innerHTML = `❌ Error: ${message}<br><button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Reload Page</button>`;
        }
    }
}