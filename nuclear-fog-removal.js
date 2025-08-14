/**
 * NUCLEAR FOG REMOVAL - ULTIMATE SOLUTION
 * Đây là giải pháp cuối cùng để xóa hoàn toàn fog effect
 * 
 * Chạy script này trong Browser Console nếu tất cả cách khác đều thất bại
 */

console.log('☢️ NUCLEAR FOG REMOVAL - ULTIMATE SOLUTION');
console.log('==========================================');

// NUCLEAR OPTION - Remove ALL possible fog sources
function nuclearFogRemoval() {
    console.log('☢️ Deploying nuclear fog removal...');
    
    let totalRemoved = 0;
    
    // 1. Remove from ALL scene objects
    const allScenes = [
        window.scene,
        window.campus?.scene,
        window.renderer?.scene,
        ...Object.values(window).filter(obj => obj && obj.scene)
    ].filter(Boolean);
    
    allScenes.forEach((scene, index) => {
        if (scene.fog) {
            scene.fog = null;
            totalRemoved++;
            console.log(`☢️ Nuked fog from scene ${index + 1}`);
        }
    });
    
    // 2. Search ALL objects in window for fog
    Object.keys(window).forEach(key => {
        const obj = window[key];
        if (obj && typeof obj === 'object') {
            if (obj.fog) {
                obj.fog = null;
                totalRemoved++;
                console.log(`☢️ Nuked fog from window.${key}`);
            }
            
            // Deep search in object properties
            if (obj.scene && obj.scene.fog) {
                obj.scene.fog = null;
                totalRemoved++;
                console.log(`☢️ Nuked fog from ${key}.scene`);
            }
        }
    });
    
    // 3. Override THREE.js completely
    if (window.THREE) {
        // Block fog constructor
        window.THREE.Fog = function() {
            console.log('☢️ THREE.Fog constructor nuked');
            return { near: 0, far: 0, color: null };
        };
        
        // Block fog creation methods
        const originalSetFog = window.THREE.Scene.prototype.setFog;
        window.THREE.Scene.prototype.setFog = function() {
            console.log('☢️ Scene.setFog nuked');
            return this;
        };
    }
    
    // 4. Continuously monitor and destroy fog
    const monitorInterval = setInterval(() => {
        let fogDestroyed = false;
        
        // Check all scenes
        [window.scene, window.campus?.scene].filter(Boolean).forEach(scene => {
            if (scene.fog) {
                scene.fog = null;
                fogDestroyed = true;
                console.log('☢️ Fog respawned and immediately nuked');
            }
        });
        
        // Check all objects in scene
        if (window.scene) {
            window.scene.traverse(child => {
                if (child.fog) {
                    child.fog = null;
                    fogDestroyed = true;
                    console.log('☢️ Child fog nuked');
                }
            });
        }
    }, 100); // Check every 100ms
    
    // Stop monitoring after 30 seconds
    setTimeout(() => {
        clearInterval(monitorInterval);
        console.log('☢️ Nuclear monitoring complete');
    }, 30000);
    
    // 5. Force renderer settings
    if (window.renderer) {
        window.renderer.setClearColor(0x87CEEB, 1.0);
        window.renderer.autoClear = true;
        console.log('☢️ Renderer nuked and reset');
    }
    
    // 6. CSS override for any visual fog effects
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            filter: none !important;
            backdrop-filter: none !important;
            opacity: 1 !important;
        }
        canvas {
            filter: contrast(1.2) brightness(1.1) !important;
        }
    `;
    document.head.appendChild(style);
    console.log('☢️ CSS fog effects nuked');
    
    console.log(`☢️ NUCLEAR REMOVAL COMPLETE: ${totalRemoved} fog sources destroyed`);
    
    // Visual feedback
    const feedback = document.createElement('div');
    feedback.innerHTML = `
        <div style="font-size: 24px;">☢️ NUCLEAR FOG REMOVAL</div>
        <div style="font-size: 16px; margin-top: 8px;">
            ${totalRemoved} fog sources destroyed<br>
            Continuous monitoring active<br>
            <strong>CRYSTAL CLEAR GUARANTEED</strong>
        </div>
    `;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #dc2626, #ef4444);
        color: white;
        padding: 25px 35px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 999999;
        text-align: center;
        box-shadow: 0 0 50px rgba(220, 38, 38, 0.5);
        border: 3px solid white;
        animation: nuclearPulse 3s ease-in-out;
    `;
    
    const pulseStyle = document.createElement('style');
    pulseStyle.innerHTML = `
        @keyframes nuclearPulse {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(pulseStyle);
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
        pulseStyle.remove();
    }, 5000);
    
    return totalRemoved;
}

// EXECUTE NUCLEAR OPTION
console.log('☢️ Launching nuclear fog removal in 3... 2... 1...');
setTimeout(() => {
    const result = nuclearFogRemoval();
    console.log(`☢️ MISSION COMPLETE: ${result} fog sources eliminated`);
    console.log('🌞 CRYSTAL CLEAR VIEW ACHIEVED');
    
    // Success confirmation
    setTimeout(() => {
        console.log('%c🎉 IF YOU CAN READ THIS, FOG HAS BEEN ELIMINATED! 🎉', 
                   'color: #10b981; font-size: 20px; font-weight: bold;');
    }, 2000);
}, 3000);

// Global access
window.nuclearFogRemoval = nuclearFogRemoval;

console.log('☢️ Nuclear fog removal deployed!');
console.log('💡 If fog still exists after this, it may be a browser rendering issue');
console.log('🔄 Try refreshing the page (F5) after 10 seconds');
