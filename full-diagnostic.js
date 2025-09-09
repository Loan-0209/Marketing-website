// COMPREHENSIVE 3D SMART CITY DIAGNOSTIC
function fullDiagnostic() {
    console.log('🔍 === 3D SMART CITY COMPREHENSIVE DIAGNOSTIC ===');
    
    const results = {
        dependencies: {},
        assets: {},
        dom: {},
        webgl: {},
        scene: {},
        issues: []
    };
    
    // 1. Check JavaScript Dependencies
    console.log('\n1️⃣ JAVASCRIPT DEPENDENCIES:');
    results.dependencies.three = typeof THREE !== 'undefined';
    results.dependencies.controls = typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined';
    
    console.log(`  Three.js: ${results.dependencies.three ? '✅ Loaded' : '❌ Missing'}`);
    if (results.dependencies.three) {
        console.log(`    Version: r${THREE.REVISION}`);
    } else {
        results.issues.push('Three.js not loaded');
    }
    
    console.log(`  OrbitControls: ${results.dependencies.controls ? '✅ Loaded' : '❌ Missing'}`);
    if (!results.dependencies.controls) {
        results.issues.push('OrbitControls not loaded');
    }
    
    // 2. Check Network Resources
    console.log('\n2️⃣ NETWORK RESOURCES:');
    const resources = performance.getEntriesByType('resource');
    const failedResources = resources.filter(r => 
        r.transferSize === 0 && r.decodedBodySize === 0 && r.name.includes('.')
    );
    
    results.assets.totalResources = resources.length;
    results.assets.failedResources = failedResources.length;
    results.assets.failed = failedResources.map(r => r.name);
    
    console.log(`  Total resources: ${resources.length}`);
    console.log(`  Failed resources: ${failedResources.length}`);
    
    if (failedResources.length > 0) {
        console.log('  ❌ Failed to load:');
        failedResources.forEach(r => console.log(`    - ${r.name}`));
        results.issues.push(`${failedResources.length} network failures`);
    }
    
    // 3. Check CSS Files
    console.log('\n3️⃣ CSS FILES:');
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    results.assets.cssCount = cssLinks.length;
    console.log(`  CSS links found: ${cssLinks.length}`);
    
    const requiredCSS = ['main.css', 'components.css', 'animations.css', 'responsive.css'];
    requiredCSS.forEach(css => {
        const found = Array.from(cssLinks).some(link => link.href.includes(css));
        console.log(`    ${css}: ${found ? '✅ Found' : '❌ Missing'}`);
        if (!found) results.issues.push(`Missing CSS: ${css}`);
    });
    
    // 4. Check DOM Elements
    console.log('\n4️⃣ DOM ELEMENTS:');
    results.dom.loadingScreen = !!document.getElementById('loading-screen');
    results.dom.canvasContainer = !!document.getElementById('canvas-container');
    results.dom.canvasCount = document.querySelectorAll('canvas').length;
    
    console.log(`  Loading screen: ${results.dom.loadingScreen ? '✅ Found' : '❌ Missing'}`);
    console.log(`  Canvas container: ${results.dom.canvasContainer ? '✅ Found' : '❌ Missing'}`);
    console.log(`  Canvas elements: ${results.dom.canvasCount}`);
    
    if (!results.dom.canvasContainer) {
        results.issues.push('Canvas container missing');
    }
    
    // 5. Check WebGL Support
    console.log('\n5️⃣ WEBGL SUPPORT:');
    const canvas = document.createElement('canvas');
    const webgl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const webgl2 = canvas.getContext('webgl2');
    
    results.webgl.webgl1 = !!webgl1;
    results.webgl.webgl2 = !!webgl2;
    
    console.log(`  WebGL 1.0: ${webgl1 ? '✅ Supported' : '❌ Not supported'}`);
    console.log(`  WebGL 2.0: ${webgl2 ? '✅ Supported' : '❌ Not supported'}`);
    
    if (webgl1) {
        const debugInfo = webgl1.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const gpu = webgl1.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            const vendor = webgl1.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            console.log(`    GPU: ${gpu}`);
            console.log(`    Vendor: ${vendor}`);
        }
        const maxTexSize = webgl1.getParameter(webgl1.MAX_TEXTURE_SIZE);
        console.log(`    Max Texture Size: ${maxTexSize}x${maxTexSize}`);
    } else {
        results.issues.push('WebGL not supported');
    }
    canvas.remove();
    
    // 6. Check Scene Objects
    console.log('\n6️⃣ SCENE OBJECTS:');
    results.scene.scene = !!window.scene;
    results.scene.camera = !!window.camera;
    results.scene.renderer = !!window.renderer;
    results.scene.controls = !!window.controls;
    results.scene.fallbackActive = !!window.fallbackScene;
    
    console.log(`  Main Scene: ${results.scene.scene ? '✅ Created' : '❌ Missing'}`);
    console.log(`  Camera: ${results.scene.camera ? '✅ Created' : '❌ Missing'}`);
    console.log(`  Renderer: ${results.scene.renderer ? '✅ Created' : '❌ Missing'}`);
    console.log(`  Controls: ${results.scene.controls ? '✅ Created' : '❌ Missing'}`);
    console.log(`  Fallback Scene: ${results.scene.fallbackActive ? '⚠️ Active' : '✅ Not active'}`);
    
    // 7. Check Initialization Flags
    console.log('\n7️⃣ INITIALIZATION STATUS:');
    console.log(`  initInProgress: ${window.initInProgress || false}`);
    console.log(`  DEPENDENCIES_READY: ${window.DEPENDENCIES_READY || false}`);
    console.log(`  THREE_LOADED: ${window.THREE_LOADED || false}`);
    console.log(`  CONTROLS_LOADED: ${window.CONTROLS_LOADED || false}`);
    
    // 8. Performance Analysis
    console.log('\n8️⃣ PERFORMANCE:');
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    const domTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    
    console.log(`  Page Load Time: ${loadTime.toFixed(2)}ms`);
    console.log(`  DOM Load Time: ${domTime.toFixed(2)}ms`);
    
    // 9. Overall Assessment
    console.log('\n🎯 === DIAGNOSTIC SUMMARY ===');
    const criticalIssues = results.issues.length;
    const readyForMain = results.dependencies.three && 
                        results.dependencies.controls && 
                        results.webgl.webgl1 && 
                        results.dom.canvasContainer &&
                        failedResources.length === 0;
    
    console.log(`Critical Issues: ${criticalIssues}`);
    console.log(`Ready for Main Scene: ${readyForMain ? '✅ YES' : '❌ NO'}`);
    
    if (criticalIssues > 0) {
        console.log('\n🔧 ISSUES TO RESOLVE:');
        results.issues.forEach((issue, i) => {
            console.log(`  ${i + 1}. ${issue}`);
        });
    }
    
    // 10. Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (!readyForMain) {
        if (!results.dependencies.three || !results.dependencies.controls) {
            console.log('  - Check CDN connectivity for Three.js libraries');
            console.log('  - Try refreshing the page to reload dependencies');
        }
        if (!results.webgl.webgl1) {
            console.log('  - Update graphics drivers or try a different browser');
        }
        if (failedResources.length > 0) {
            console.log('  - Check internet connection and CDN availability');
        }
        if (!results.dom.canvasContainer) {
            console.log('  - DOM structure issue - reload page or check HTML integrity');
        }
    } else if (results.scene.fallbackActive) {
        console.log('  - Main scene ready but fallback is active');
        console.log('  - Use retryMainScene() to force main scene initialization');
    } else if (!results.scene.scene) {
        console.log('  - Dependencies ready but scene not initialized');
        console.log('  - Call init() function to start main scene');
    } else {
        console.log('  - Everything looks good! Main scene should be working');
    }
    
    return results;
}

// Execute the full diagnostic
const diagnosticResults = fullDiagnostic();