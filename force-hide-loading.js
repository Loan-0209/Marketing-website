// === FORCE HIDE LOADING SCREEN ===
// Paste this into F12 Console if loading screen is stuck

console.log('🔧 Force hiding loading screen...');

// Method 1: Find and hide loading screen
const loadingScreen = document.getElementById('loadingScreen');
if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    loadingScreen.style.opacity = '0';
    loadingScreen.style.pointerEvents = 'none';
    loadingScreen.style.visibility = 'hidden';
    console.log('✅ Loading screen hidden via classList');
} else {
    console.log('❌ Loading screen element not found');
}

// Method 2: Find by class name
const loadingScreenByClass = document.querySelector('.loading-screen');
if (loadingScreenByClass) {
    loadingScreenByClass.classList.add('hidden');
    loadingScreenByClass.style.display = 'none';
    console.log('✅ Loading screen hidden via querySelector');
}

// Method 3: Remove all loading screens
document.querySelectorAll('.loading-screen, #loadingScreen').forEach(screen => {
    screen.style.display = 'none';
    screen.remove();
});

console.log('✅ All loading screens removed');

// Method 4: Force show 3D content
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer) {
    canvasContainer.style.display = 'block';
    canvasContainer.style.visibility = 'visible';
    canvasContainer.style.opacity = '1';
    console.log('✅ Canvas container forced visible');
}

// Method 5: Trigger initialization if not started
if (typeof window.aiCampus3D === 'undefined' && typeof AI3DCampusWithNav !== 'undefined') {
    console.log('🚀 Force initializing 3D Campus...');
    window.aiCampus3D = new AI3DCampusWithNav();
    window.aiCampus3D.init();
    console.log('✅ 3D Campus force initialized');
}

console.log('🎉 Loading screen force hide complete!');