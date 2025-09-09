// EMERGENCY SKIP BUTTON - Simple and Direct
// Copy and paste this EXACT code into browser console

console.log('🚨 Creating emergency skip button...');

// Create skip button immediately
const emergencyBtn = document.createElement('div');
emergencyBtn.innerHTML = '🚨 SKIP LOADING';
emergencyBtn.style.cssText = `
    position: fixed !important;
    top: 50px !important;
    right: 50px !important;
    width: 200px !important;
    height: 60px !important;
    background: red !important;
    color: white !important;
    font-size: 20px !important;
    font-weight: bold !important;
    text-align: center !important;
    line-height: 60px !important;
    cursor: pointer !important;
    z-index: 999999999 !important;
    border: 3px solid white !important;
    border-radius: 10px !important;
    box-shadow: 0 0 20px rgba(0,0,0,0.8) !important;
`;

// Add click handler
emergencyBtn.onclick = function() {
    console.log('🔧 FORCE FIXING...');
    
    // Method 1: Remove loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.remove();
        console.log('✅ Loading screen removed');
    }
    
    // Method 2: Hide all loading elements
    document.querySelectorAll('[id*="loading"], [class*="loading"]').forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
    });
    
    // Method 3: Show all canvas elements
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.style.display = 'block';
        canvas.style.visibility = 'visible';
        canvas.style.opacity = '1';
        canvas.style.position = 'relative';
        canvas.style.zIndex = '1';
    });
    
    // Method 4: Force render if possible
    if (typeof renderer !== 'undefined' && typeof scene !== 'undefined' && typeof camera !== 'undefined') {
        renderer.render(scene, camera);
        console.log('✅ Forced render');
    }
    
    // Method 5: Call animate if exists
    if (typeof animate === 'function') {
        animate();
        console.log('✅ Animation started');
    }
    
    // Method 6: Remove all overlays
    document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'absolute') {
            if (parseInt(style.zIndex) > 10 && el !== emergencyBtn) {
                el.style.display = 'none';
            }
        }
    });
    
    emergencyBtn.innerHTML = '✅ FIXED!';
    emergencyBtn.style.background = 'green';
    
    setTimeout(() => {
        emergencyBtn.remove();
    }, 3000);
    
    console.log('🎉 LOADING FIXED!');
};

// Add to page with multiple methods
try {
    document.body.appendChild(emergencyBtn);
} catch (e) {
    try {
        document.documentElement.appendChild(emergencyBtn);
    } catch (e2) {
        console.error('Could not add button to page');
    }
}

console.log('✅ Emergency skip button created!');
console.log('🎯 Look for RED button in top-right corner');

// Auto-click after 3 seconds if user doesn't click
setTimeout(() => {
    if (emergencyBtn.innerHTML === '🚨 SKIP LOADING') {
        console.log('⚡ Auto-clicking skip button...');
        emergencyBtn.click();
    }
}, 3000);

// Also try immediate fixes
console.log('🔧 Trying immediate fixes...');

// Hide loading screen immediately
setTimeout(() => {
    const loading = document.getElementById('loadingScreen');
    if (loading) loading.style.display = 'none';
    
    document.querySelectorAll('[id*="loading"]').forEach(el => {
        el.style.display = 'none';
    });
}, 100);