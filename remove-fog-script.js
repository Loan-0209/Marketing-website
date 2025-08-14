/**
 * FOG REMOVAL SCRIPT - SMART CITY 3D
 * Automatically removes all fog effects for crystal clear view
 * 
 * Usage:
 * 1. Open Smart City 3D website
 * 2. Open Developer Console (F12)
 * 3. Copy and paste this entire script
 * 4. Run: removeFogCompletely()
 */

console.log('🌫️ FOG REMOVAL SCRIPT LOADED');
console.log('============================');

// ====================================
// COMPLETE FOG REMOVAL FUNCTION
// ====================================
window.removeFogCompletely = function() {
    console.log('🌫️ REMOVING ALL FOG EFFECTS...');
    
    let fogsRemoved = 0;
    
    // Remove from main scene
    if (window.scene) {
        if (window.scene.fog) {
            window.scene.fog = null;
            fogsRemoved++;
            console.log('✅ Main scene fog removed');
        }
    }
    
    // Remove from campus scene
    if (window.campus && window.campus.scene) {
        if (window.campus.scene.fog) {
            window.campus.scene.fog = null;
            fogsRemoved++;
            console.log('✅ Campus scene fog removed');
        }
    }
    
    // Override createScene to prevent fog creation
    if (window.campus && window.campus.createScene) {
        const originalCreateScene = window.campus.createScene;
        window.campus.createScene = function() {
            originalCreateScene.call(this);
            // Remove fog after scene creation
            if (this.scene && this.scene.fog) {
                this.scene.fog = null;
                console.log('✅ Fog prevented in createScene');
            }
        };
    }
    
    // Override day/night toggle to prevent fog re-creation
    const originalToggle = window.toggleDayNightMode;
    window.toggleDayNightMode = function(mode) {
        if (!window.campus || !window.campus.scene) {
            console.log('❌ Campus not ready for mode toggle');
            return;
        }
        
        if (mode === 'day') {
            window.campus.scene.background = new THREE.Color(0x87CEEB);
            window.campus.scene.fog = null; // FORCE NO FOG
            if (window.campus.renderer) {
                window.campus.renderer.setClearColor(0x87CEEB, 1.0);
            }
            console.log('☀️ Day mode - CRYSTAL CLEAR (no fog)');
        } else {
            window.campus.scene.background = new THREE.Color(0x001122);
            window.campus.scene.fog = null; // FORCE NO FOG
            if (window.campus.renderer) {
                window.campus.renderer.setClearColor(0x001122, 1.0);
            }
            console.log('🌙 Night mode - CRYSTAL CLEAR (no fog)');
        }
        
        // Show mode change feedback
        showModeChangeFeedback(mode);
    };
    
    // Function to show mode change feedback
    function showModeChangeFeedback(mode) {
        const existing = document.querySelector('.mode-feedback');
        if (existing) existing.remove();
        
        const feedback = document.createElement('div');
        feedback.className = 'mode-feedback';
        feedback.innerHTML = mode === 'day' 
            ? '☀️ Day Mode - Crystal Clear!' 
            : '🌙 Night Mode - Crystal Clear!';
        feedback.style.cssText = `
            position: fixed;
            top: 20%;
            right: 20px;
            background: ${mode === 'day' ? '#fbbf24' : '#1e293b'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: fadeInOut 3s ease;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 3000);
    }
    
    console.log(`🌞 FOG EFFECTS REMOVED: ${fogsRemoved} locations`);
    console.log('💎 CRYSTAL CLEAR VIEW ACTIVATED!');
    
    // Show main feedback
    showRemovalFeedback(fogsRemoved);
    
    return fogsRemoved;
};

// ====================================
// VISUAL FEEDBACK FUNCTION
// ====================================
function showRemovalFeedback(count) {
    if (!document.body) return;
    
    const feedback = document.createElement('div');
    feedback.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">🌞 FOG REMOVED!</div>
        <div style="font-size: 16px; opacity: 0.9;">
            Crystal Clear View Activated<br>
            ${count} fog effect${count !== 1 ? 's' : ''} removed
        </div>
    `;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
        color: white;
        padding: 25px 35px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 12px 40px rgba(16, 185, 129, 0.4);
        text-align: center;
        animation: fadeInOut 4s ease;
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 4000);
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

// Check fog status
window.checkFogStatus = function() {
    console.log('🌫️ FOG STATUS CHECK');
    console.log('==================');
    
    let totalFogs = 0;
    
    if (window.scene) {
        const hasFog = !!window.scene.fog;
        console.log(`Main Scene: ${hasFog ? '🌫️ HAS FOG' : '🌞 CLEAR'}`);
        if (hasFog) {
            console.log(`  Near: ${window.scene.fog.near}, Far: ${window.scene.fog.far}`);
            totalFogs++;
        }
    } else {
        console.log('Main Scene: ❌ NOT FOUND');
    }
    
    if (window.campus && window.campus.scene) {
        const hasFog = !!window.campus.scene.fog;
        console.log(`Campus Scene: ${hasFog ? '🌫️ HAS FOG' : '🌞 CLEAR'}`);
        if (hasFog) {
            console.log(`  Near: ${window.campus.scene.fog.near}, Far: ${window.campus.scene.fog.far}`);
            totalFogs++;
        }
    } else {
        console.log('Campus Scene: ❌ NOT FOUND');
    }
    
    console.log(`\nTotal Fog Effects: ${totalFogs}`);
    console.log(totalFogs === 0 ? '✅ CRYSTAL CLEAR!' : '⚠️ FOG DETECTED');
    
    return totalFogs;
};

// Restore fog (if needed)
window.restoreFog = function(intensity = 'light') {
    console.log(`🌫️ Restoring ${intensity} fog...`);
    
    const fogParams = {
        light: { near: 300, far: 800 },
        medium: { near: 200, far: 600 },
        heavy: { near: 100, far: 400 }
    };
    
    const params = fogParams[intensity] || fogParams.light;
    
    if (window.scene) {
        window.scene.fog = new THREE.Fog(0x87CEEB, params.near, params.far);
        console.log('✅ Main scene fog restored');
    }
    
    if (window.campus && window.campus.scene) {
        window.campus.scene.fog = new THREE.Fog(0x87CEEB, params.near, params.far);
        console.log('✅ Campus scene fog restored');
    }
    
    console.log(`🌫️ ${intensity.toUpperCase()} fog restored`);
};

// ====================================
// AUTO-EXECUTION
// ====================================

// Auto-remove fog after scene is ready
let autoRemovalAttempts = 0;
const maxAttempts = 10;

function attemptAutoRemoval() {
    autoRemovalAttempts++;
    
    if (window.scene || (window.campus && window.campus.scene)) {
        console.log('🚀 Auto-removing fog effects...');
        window.removeFogCompletely();
        return;
    }
    
    if (autoRemovalAttempts < maxAttempts) {
        console.log(`⏳ Waiting for scene... (${autoRemovalAttempts}/${maxAttempts})`);
        setTimeout(attemptAutoRemoval, 1000);
    } else {
        console.log('⚠️ Auto-removal timeout. Run removeFogCompletely() manually when ready.');
    }
}

// Start auto-removal after 2 seconds
setTimeout(attemptAutoRemoval, 2000);

// ====================================
// AVAILABLE COMMANDS
// ====================================
console.log('');
console.log('📋 AVAILABLE COMMANDS:');
console.log('  🚀 removeFogCompletely() - Remove all fog effects');
console.log('  📊 checkFogStatus() - Check current fog status');
console.log('  🔄 restoreFog("light"|"medium"|"heavy") - Restore fog if needed');
console.log('  🌞 toggleDayNightMode("day"|"night") - Switch mode (no fog)');
console.log('');
console.log('💡 Pro tip: Fog will be automatically removed when scene is ready!');
console.log('');

// Export for debugging
window.fogRemovalScript = {
    version: '1.0',
    loaded: true,
    commands: ['removeFogCompletely', 'checkFogStatus', 'restoreFog'],
    autoRemoval: true
};

console.log('✅ Fog Removal Script Ready!');
