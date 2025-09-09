// Force disable fallback and retry main scene:
function retryMainScene() {
    console.log('🔄 Disabling fallback scene...');
    
    // Remove fallback elements
    const fallbackElements = document.querySelectorAll('[data-fallback], .fallback-scene');
    console.log('Found fallback elements:', fallbackElements.length);
    fallbackElements.forEach(el => {
        console.log('Removing fallback element:', el);
        el.remove();
    });
    
    // Clear fallback canvas
    const canvases = document.querySelectorAll('canvas');
    console.log('Found canvases:', canvases.length);
    canvases.forEach(canvas => {
        console.log('Clearing canvas:', canvas.width, 'x', canvas.height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Also remove WebGL canvases
        canvas.remove();
    });
    
    // Clear fallback references
    delete window.fallbackScene;
    delete window.fallbackCamera;
    delete window.fallbackRenderer;
    
    // Remove retry button
    const retryButtons = document.querySelectorAll('button');
    retryButtons.forEach(btn => {
        if (btn.textContent.includes('Retry')) {
            btn.remove();
        }
    });
    
    console.log('✅ Fallback cleared, attempting main scene reload...');
    
    // Reset initialization flag
    window.initInProgress = false;
    
    // Check available init functions
    const availableInitFunctions = [
        'initMainScene',
        'init3DScene', 
        'init',
        'initScene',
        'createMainScene',
        'initSmartCity'
    ];
    
    let foundInitFunction = null;
    for (let funcName of availableInitFunctions) {
        if (window[funcName] && typeof window[funcName] === 'function') {
            foundInitFunction = funcName;
            break;
        }
    }
    
    if (foundInitFunction) {
        console.log(`🚀 Found init function: ${foundInitFunction}`);
        try {
            window[foundInitFunction]();
        } catch (error) {
            console.error(`❌ ${foundInitFunction} failed:`, error);
        }
    } else {
        console.error('❌ No main scene init function found!');
        console.log('Available functions:', Object.keys(window).filter(key => 
            key.toLowerCase().includes('init') && typeof window[key] === 'function'
        ));
    }
}

// Execute immediately
retryMainScene();