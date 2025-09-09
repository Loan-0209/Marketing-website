// DEBUG & FIX LOADING ISSUES - 3D Smart City
// Copy and paste into browser console at http://localhost:8000/3d-smart-city.html

(function debugLoadingIssue() {
    console.log('🔍 DEBUGGING LOADING ISSUE');
    console.log('==========================\n');
    
    // 1. CHECK LOADING STATE
    console.log('1️⃣ Checking loading state...');
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const errorMessage = document.getElementById('errorMessage');
    
    console.log('Loading screen:', loadingScreen ? 'EXISTS' : 'NOT FOUND');
    console.log('Loading screen display:', loadingScreen ? loadingScreen.style.display : 'N/A');
    console.log('Loading progress:', loadingProgress ? loadingProgress.textContent : 'N/A');
    console.log('Error message:', errorMessage ? errorMessage.textContent : 'N/A');
    
    // 2. CHECK GLOBAL VARIABLES
    console.log('\n2️⃣ Checking global variables...');
    console.log('THREE.js loaded:', typeof THREE !== 'undefined');
    console.log('Scene exists:', typeof scene !== 'undefined');
    console.log('Camera exists:', typeof camera !== 'undefined');
    console.log('Renderer exists:', typeof renderer !== 'undefined');
    console.log('Controls exist:', typeof controls !== 'undefined');
    
    // 3. CHECK FOR ERRORS
    console.log('\n3️⃣ Checking for errors...');
    
    // Add error listener
    window.addEventListener('error', function(e) {
        console.error('❌ Global error:', e.message, e.filename, e.lineno, e.colno);
    });
    
    // 4. FORCE REMOVE LOADING SCREEN
    console.log('\n4️⃣ Force removing loading screen...');
    
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        loadingScreen.style.visibility = 'hidden';
        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';
        loadingScreen.style.zIndex = '-9999';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
                console.log('✅ Loading screen removed from DOM');
            }
        }, 500);
    }
    
    // 5. CHECK WEBGL SUPPORT
    console.log('\n5️⃣ Checking WebGL support...');
    
    function checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl && gl instanceof WebGLRenderingContext) {
                console.log('✅ WebGL is supported');
                return true;
            } else {
                console.log('❌ WebGL is NOT supported');
                return false;
            }
        } catch (e) {
            console.log('❌ WebGL check failed:', e);
            return false;
        }
    }
    
    checkWebGL();
    
    // 6. RESTART INITIALIZATION
    console.log('\n6️⃣ Attempting to restart initialization...');
    
    // Check if init function exists
    if (typeof init === 'function') {
        console.log('Found init function, calling it...');
        try {
            init();
            console.log('✅ Init function called successfully');
        } catch (e) {
            console.error('❌ Init function error:', e);
        }
    }
    
    // Check if animate function exists
    if (typeof animate === 'function') {
        console.log('Found animate function, calling it...');
        try {
            animate();
            console.log('✅ Animate function called successfully');
        } catch (e) {
            console.error('❌ Animate function error:', e);
        }
    }
    
    // 7. CREATE SKIP BUTTON
    console.log('\n7️⃣ Creating skip button...');
    
    const skipButton = document.createElement('button');
    skipButton.innerHTML = 'SKIP LOADING';
    skipButton.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        font-size: 20px;
        background: #ff0000;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        z-index: 999999;
        font-weight: bold;
    `;
    
    skipButton.onclick = function() {
        // Force hide all loading elements
        const allLoadingElements = document.querySelectorAll('[id*="loading"], [class*="loading"]');
        allLoadingElements.forEach(el => {
            el.style.display = 'none';
        });
        
        // Remove skip button
        skipButton.remove();
        
        console.log('✅ Forced skip completed');
    };
    
    document.body.appendChild(skipButton);
    
    // 8. CHECK SCENE CONTENT
    console.log('\n8️⃣ Checking scene content...');
    
    if (typeof scene !== 'undefined') {
        console.log('Scene children count:', scene.children.length);
        console.log('Scene background:', scene.background);
        console.log('Scene fog:', scene.fog);
        
        // List first 5 objects
        console.log('First 5 scene objects:');
        scene.children.slice(0, 5).forEach((child, i) => {
            console.log(`  ${i + 1}. ${child.type}: ${child.name || 'unnamed'}`);
        });
    }
    
    // 9. MANUAL RENDER
    console.log('\n9️⃣ Attempting manual render...');
    
    if (typeof renderer !== 'undefined' && typeof scene !== 'undefined' && typeof camera !== 'undefined') {
        try {
            renderer.render(scene, camera);
            console.log('✅ Manual render successful');
        } catch (e) {
            console.error('❌ Manual render failed:', e);
        }
    }
    
    // 10. FINAL DIAGNOSTICS
    console.log('\n🔟 Final diagnostics...');
    console.log('Page loaded:', document.readyState === 'complete');
    console.log('DOM content loaded:', document.readyState !== 'loading');
    console.log('Window size:', window.innerWidth, 'x', window.innerHeight);
    console.log('Canvas elements:', document.getElementsByTagName('canvas').length);
    
    // Auto-fix after 3 seconds
    setTimeout(() => {
        console.log('\n⚡ AUTO-FIX: Forcing scene visibility...');
        
        // Show canvas
        const canvases = document.getElementsByTagName('canvas');
        for (let canvas of canvases) {
            canvas.style.display = 'block';
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
        }
        
        // Hide all loading elements
        const loadingElements = document.querySelectorAll('[id*="loading"], [class*="loading"], [id*="Loading"], [class*="Loading"]');
        loadingElements.forEach(el => {
            el.style.display = 'none';
        });
        
        // Force render
        if (typeof renderer !== 'undefined' && typeof scene !== 'undefined' && typeof camera !== 'undefined') {
            renderer.render(scene, camera);
        }
        
        console.log('✅ AUTO-FIX completed!');
    }, 3000);
    
    console.log('\n✅ Debug script loaded. Check console for issues.');
    console.log('💡 Click the red SKIP LOADING button to force skip.');
    console.log('⏱️ Auto-fix will run in 3 seconds...');
})();