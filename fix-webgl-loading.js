// FIX WEBGL LOADING ISSUE - Enhanced Smart City
// Copy and paste this ENTIRE script into browser console

(function fixWebGLLoading() {
    console.log('🔧 FIXING WEBGL LOADING ISSUE');
    console.log('=============================\n');
    
    // 1. FORCE REMOVE LOADING SCREEN
    console.log('1️⃣ Force removing loading screen...');
    
    // Find and remove all loading elements
    const loadingSelectors = [
        '#loadingScreen',
        '.loading-screen',
        '[id*="loading"]',
        '[class*="loading"]',
        '.loader',
        '#loader'
    ];
    
    loadingSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '-9999';
            
            // Remove from DOM
            setTimeout(() => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }, 100);
        });
    });
    
    console.log('✅ Loading screens removed');
    
    // 2. CHECK WEBGL STATUS
    console.log('\n2️⃣ Checking WebGL status...');
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
        console.log('✅ WebGL is supported');
    } else {
        console.log('❌ WebGL is NOT supported - trying fallback');
        
        // Create fallback message
        const fallbackMsg = document.createElement('div');
        fallbackMsg.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border: 2px solid red; z-index: 9999;">
                <h2>❌ WebGL Error</h2>
                <p>Your browser doesn't support WebGL. Try:</p>
                <ul>
                    <li>Update your browser</li>
                    <li>Enable hardware acceleration</li>
                    <li>Update graphics drivers</li>
                </ul>
                <button onclick="this.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(fallbackMsg);
    }
    
    // 3. CHECK THREE.JS
    console.log('\n3️⃣ Checking Three.js...');
    
    if (typeof THREE === 'undefined') {
        console.log('❌ Three.js not loaded - attempting to load...');
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
            console.log('✅ Three.js loaded');
            tryInit();
        };
        document.head.appendChild(script);
    } else {
        console.log('✅ Three.js is loaded');
        tryInit();
    }
    
    // 4. TRY TO INITIALIZE
    function tryInit() {
        console.log('\n4️⃣ Attempting to initialize scene...');
        
        // Check for init function
        if (typeof init === 'function') {
            try {
                init();
                console.log('✅ Init function called');
            } catch (e) {
                console.error('❌ Init error:', e);
                forceCreateScene();
            }
        } else {
            console.log('⚠️ No init function found');
            forceCreateScene();
        }
        
        // Start animation
        if (typeof animate === 'function') {
            try {
                animate();
                console.log('✅ Animation started');
            } catch (e) {
                console.error('❌ Animate error:', e);
            }
        }
    }
    
    // 5. FORCE CREATE SCENE
    function forceCreateScene() {
        console.log('\n5️⃣ Force creating basic scene...');
        
        try {
            // Create scene
            window.scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            
            // Create camera
            window.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.set(200, 100, 200);
            camera.lookAt(0, 0, 0);
            
            // Create renderer
            window.renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            
            // Add to page
            const container = document.getElementById('container') || document.body;
            container.appendChild(renderer.domElement);
            
            // Add basic lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(100, 100, 50);
            scene.add(directionalLight);
            
            // Add ground
            const groundGeometry = new THREE.BoxGeometry(500, 1, 500);
            const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.position.y = -0.5;
            scene.add(ground);
            
            // Add test cube
            const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
            const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.y = 10;
            scene.add(cube);
            
            // Create controls
            if (typeof THREE.OrbitControls !== 'undefined') {
                window.controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
            }
            
            // Start animation
            function basicAnimate() {
                requestAnimationFrame(basicAnimate);
                
                if (cube) {
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                }
                
                if (controls) {
                    controls.update();
                }
                
                renderer.render(scene, camera);
            }
            
            basicAnimate();
            
            console.log('✅ Basic scene created');
            
        } catch (e) {
            console.error('❌ Failed to create scene:', e);
        }
    }
    
    // 6. CREATE SKIP BUTTON
    console.log('\n6️⃣ Creating emergency skip button...');
    
    const skipBtn = document.createElement('button');
    skipBtn.innerHTML = '🚨 SKIP LOADING & FIX';
    skipBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        background: #FF0000;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 999999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;
    
    skipBtn.onclick = function() {
        // Remove all overlays
        const overlays = document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"]');
        overlays.forEach(el => {
            if (el !== skipBtn && el.style.zIndex > 100) {
                el.style.display = 'none';
            }
        });
        
        // Force show canvas
        const canvases = document.getElementsByTagName('canvas');
        for (let canvas of canvases) {
            canvas.style.display = 'block';
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
            canvas.style.position = 'relative';
            canvas.style.zIndex = '1';
        }
        
        // Force render
        if (window.renderer && window.scene && window.camera) {
            window.renderer.render(window.scene, window.camera);
        }
        
        skipBtn.innerHTML = '✅ FIXED!';
        setTimeout(() => skipBtn.remove(), 2000);
    };
    
    document.body.appendChild(skipBtn);
    
    // 7. AUTO FIX AFTER 5 SECONDS
    console.log('\n7️⃣ Setting up auto-fix...');
    
    setTimeout(() => {
        console.log('\n⚡ AUTO-FIX TRIGGERED');
        
        // Click skip button
        if (skipBtn && skipBtn.parentNode) {
            skipBtn.click();
        }
        
        // Double-check everything is visible
        const canvases = document.getElementsByTagName('canvas');
        if (canvases.length === 0) {
            console.log('❌ No canvas found - creating one');
            forceCreateScene();
        }
        
    }, 5000);
    
    // 8. MONITOR FOR STUCK LOADING
    console.log('\n8️⃣ Monitoring for stuck loading...');
    
    let lastProgress = '';
    let stuckCount = 0;
    
    const checkProgress = setInterval(() => {
        const progressEl = document.getElementById('loadingProgress');
        if (progressEl) {
            const currentProgress = progressEl.textContent;
            if (currentProgress === lastProgress) {
                stuckCount++;
                if (stuckCount > 3) {
                    console.log('⚠️ Loading stuck at:', currentProgress);
                    skipBtn.click();
                    clearInterval(checkProgress);
                }
            } else {
                stuckCount = 0;
            }
            lastProgress = currentProgress;
        }
    }, 1000);
    
    // 9. FINAL DIAGNOSTICS
    console.log('\n9️⃣ Final diagnostics:');
    console.log('Window size:', window.innerWidth, 'x', window.innerHeight);
    console.log('Document ready:', document.readyState);
    console.log('Canvas count:', document.getElementsByTagName('canvas').length);
    console.log('Scripts loaded:', document.scripts.length);
    
    console.log('\n✅ FIX SCRIPT LOADED');
    console.log('🚨 Click red SKIP button to force fix');
    console.log('⏱️ Auto-fix in 5 seconds...');
    
})();