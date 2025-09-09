// Force reload main scene with error handling:
function forceMainSceneLoad() {
    console.log('=== FORCE MAIN SCENE LOAD ===');
    
    try {
        console.log('🔄 Step 1: Clearing existing WebGL context...');
        
        // Clear existing scene
        const canvas = document.querySelector('canvas');
        if (canvas) {
            console.log('Found canvas:', canvas.width + 'x' + canvas.height);
            const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (context) {
                console.log('WebGL context found, forcing context loss...');
                const loseContext = context.getExtension('WEBGL_lose_context');
                if (loseContext) {
                    loseContext.loseContext();
                    console.log('✅ WebGL context lost');
                } else {
                    console.log('⚠️ WEBGL_lose_context extension not available');
                }
            } else {
                console.log('⚠️ No WebGL context found on canvas');
            }
            
            // Remove the canvas entirely
            canvas.remove();
            console.log('✅ Canvas removed from DOM');
        } else {
            console.log('ℹ️ No canvas found to clear');
        }
        
        console.log('🔄 Step 2: Removing fallback elements...');
        
        // Remove fallback notification
        const notification = document.querySelector('[data-fallback-notification]');
        if (notification) {
            notification.remove();
            console.log('✅ Fallback notification removed');
        }
        
        // Remove any retry buttons
        const retryButtons = document.querySelectorAll('button');
        retryButtons.forEach(btn => {
            if (btn.textContent && btn.textContent.includes('Retry')) {
                btn.remove();
                console.log('✅ Retry button removed');
            }
        });
        
        console.log('🔄 Step 3: Clearing Three.js scene objects...');
        
        // Reinitialize Three.js scene
        if (window.scene) {
            console.log('Found existing scene with', window.scene.children.length, 'children');
            while(window.scene.children.length > 0) {
                const child = window.scene.children[0];
                console.log('Removing child:', child.type || child.constructor.name);
                window.scene.remove(child);
                
                // Clean up geometry and materials
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            }
            console.log('✅ Scene cleared');
        } else {
            console.log('ℹ️ No existing scene to clear');
        }
        
        // Clear renderer
        if (window.renderer) {
            console.log('Disposing existing renderer...');
            window.renderer.dispose();
            delete window.renderer;
            console.log('✅ Renderer disposed');
        }
        
        // Clear other Three.js objects
        if (window.camera) {
            delete window.camera;
            console.log('✅ Camera reference cleared');
        }
        
        if (window.controls) {
            if (window.controls.dispose) window.controls.dispose();
            delete window.controls;
            console.log('✅ Controls disposed');
        }
        
        // Clear fallback references
        delete window.fallbackScene;
        delete window.fallbackCamera;
        delete window.fallbackRenderer;
        
        // Reset initialization flag
        window.initInProgress = false;
        
        console.log('🔄 Step 4: Finding main initialization function...');
        
        // Call main initialization
        const initFunctionPriority = [
            'init',           // Most common main init function
            'initSmartCity',
            'createMainScene',
            'initMainScene',
            'init3DScene',
            'initScene'
        ];
        
        let foundInitFunction = null;
        
        for (let funcName of initFunctionPriority) {
            if (window[funcName] && typeof window[funcName] === 'function') {
                foundInitFunction = funcName;
                console.log('🎯 Found priority init function:', funcName);
                break;
            }
        }
        
        if (!foundInitFunction) {
            // Try to find any init function
            const initFunctions = Object.keys(window).filter(key => 
                key.toLowerCase().includes('init') && typeof window[key] === 'function'
            );
            console.log('Available init functions:', initFunctions);
            
            if (initFunctions.length > 0) {
                foundInitFunction = initFunctions[0];
                console.log('🔍 Using first available init function:', foundInitFunction);
            }
        }
        
        if (foundInitFunction) {
            console.log('🚀 Step 5: Calling', foundInitFunction + '()...');
            
            try {
                // Call the init function
                const result = window[foundInitFunction]();
                
                // If it returns a promise, handle it
                if (result && typeof result.then === 'function') {
                    console.log('Init function returned a promise, waiting...');
                    result.then(() => {
                        console.log('✅ Async initialization completed successfully');
                    }).catch(initError => {
                        console.error('❌ Async initialization failed:', initError);
                        console.error('Stack trace:', initError.stack);
                    });
                } else {
                    console.log('✅ Synchronous initialization completed');
                }
                
            } catch (initError) {
                console.error('❌ Init function failed:', initError);
                console.error('Function name:', foundInitFunction);
                console.error('Error details:', {
                    name: initError.name,
                    message: initError.message,
                    stack: initError.stack
                });
                
                // Try a different init function if available
                const remainingFunctions = initFunctionPriority.filter(f => 
                    f !== foundInitFunction && window[f] && typeof window[f] === 'function'
                );
                
                if (remainingFunctions.length > 0) {
                    console.log('🔄 Trying alternative init function:', remainingFunctions[0]);
                    try {
                        window[remainingFunctions[0]]();
                        console.log('✅ Alternative init function succeeded');
                    } catch (altError) {
                        console.error('❌ Alternative init also failed:', altError);
                    }
                }
            }
            
        } else {
            console.error('❌ No main scene init function found!');
            console.log('💡 Available window functions:', 
                Object.keys(window).filter(key => typeof window[key] === 'function').slice(0, 20)
            );
        }
        
        console.log('🔄 Step 6: Verifying scene state...');
        
        // Verify the scene was created
        setTimeout(() => {
            const newCanvas = document.querySelector('canvas');
            const hasScene = !!window.scene;
            const hasRenderer = !!window.renderer;
            
            console.log('Post-initialization check:');
            console.log('  Canvas present:', !!newCanvas);
            console.log('  Scene created:', hasScene);
            console.log('  Renderer created:', hasRenderer);
            console.log('  Fallback active:', !!window.fallbackScene);
            
            if (newCanvas && hasScene && hasRenderer) {
                console.log('🎉 SUCCESS: Main scene appears to be loaded!');
            } else {
                console.log('⚠️ WARNING: Main scene may not have loaded completely');
                if (!newCanvas) console.log('   - No canvas found');
                if (!hasScene) console.log('   - No scene object');
                if (!hasRenderer) console.log('   - No renderer object');
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ CRITICAL ERROR during main scene load:', error);
        
        // Show detailed error info
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            line: error.lineno,
            column: error.colno
        });
        
        console.log('🛡️ Attempting emergency fallback...');
        if (typeof createFallbackScene === 'function') {
            createFallbackScene();
            console.log('Emergency fallback scene created');
        }
    }
}

// Execute the force load
forceMainSceneLoad();