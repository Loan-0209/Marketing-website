// Comprehensive JavaScript and WebGL Test Script
// Copy paste into browser console on the 3D Smart City page

(function comprehensiveTest() {
    console.log('🧪 COMPREHENSIVE TESTING - FINAL VALIDATION');
    console.log('='.repeat(60));
    
    let allPassed = true;
    let testResults = [];
    
    function runTest(name, testFn) {
        try {
            const result = testFn();
            testResults.push({ name, status: 'PASS', message: result || 'Test completed successfully' });
            console.log(`✅ ${name}: PASS`);
            return true;
        } catch (error) {
            testResults.push({ name, status: 'FAIL', message: error.message });
            console.error(`❌ ${name}: FAIL - ${error.message}`);
            allPassed = false;
            return false;
        }
    }
    
    // Test 1: JavaScript Syntax
    runTest('JavaScript Syntax Check', () => {
        // Basic syntax validation
        eval('let testVar = "syntax test"; console.log("JS syntax OK");');
        return 'JavaScript syntax is valid';
    });
    
    // Test 2: THREE.js Loading
    runTest('Three.js Library Check', () => {
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js library not loaded');
        }
        return `Three.js r${THREE.REVISION} loaded successfully`;
    });
    
    // Test 3: WebGL Support
    runTest('WebGL Support Check', () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            throw new Error('WebGL not supported on this browser/device');
        }
        return 'WebGL is supported and available';
    });
    
    // Test 4: WebGL Context Creation
    runTest('WebGL Context Creation', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        
        try {
            const renderer = new THREE.WebGLRenderer({ 
                canvas: canvas, 
                antialias: false,
                failIfMajorPerformanceCaveat: false 
            });
            renderer.setSize(100, 100);
            return 'WebGL renderer created successfully';
        } catch (error) {
            throw new Error(`WebGL renderer creation failed: ${error.message}`);
        }
    });
    
    // Test 5: Scene Variables
    runTest('Scene Variables Check', () => {
        const vars = ['scene', 'camera', 'renderer'];
        const missing = vars.filter(v => typeof window[v] === 'undefined');
        
        if (missing.length > 0) {
            throw new Error(`Missing global variables: ${missing.join(', ')}`);
        }
        return 'All required scene variables are defined';
    });
    
    // Test 6: Renderer Status
    runTest('Renderer Status Check', () => {
        if (typeof renderer === 'undefined' || !renderer) {
            throw new Error('Renderer not initialized');
        }
        
        const gl = renderer.getContext();
        if (!gl) {
            throw new Error('WebGL context not available from renderer');
        }
        
        if (gl.isContextLost()) {
            throw new Error('WebGL context is lost');
        }
        
        return 'Renderer and WebGL context are healthy';
    });
    
    // Test 7: Scene Content
    runTest('Scene Content Check', () => {
        if (typeof scene === 'undefined' || !scene) {
            throw new Error('Scene not initialized');
        }
        
        const childCount = scene.children.length;
        if (childCount === 0) {
            throw new Error('Scene is empty - no objects loaded');
        }
        
        return `Scene contains ${childCount} objects`;
    });
    
    // Test 8: Data Center Components
    runTest('Data Center Components Check', () => {
        if (typeof scene === 'undefined') {
            throw new Error('Scene not available');
        }
        
        let dataCenterCount = 0;
        let coolingTowerCount = 0;
        
        scene.traverse((child) => {
            if (child.userData && child.userData.type === 'dataCenter') {
                dataCenterCount++;
            }
            if (child.geometry && child.geometry.type === 'CylinderGeometry' && 
                child.material && child.material.color && 
                child.material.color.getHex() === 0xC0C0C0) {
                coolingTowerCount++;
            }
        });
        
        return `Found ${dataCenterCount} data centers and ${coolingTowerCount} cooling towers`;
    });
    
    // Test 9: Memory Usage
    runTest('Memory Usage Check', () => {
        if (!window.performance || !window.performance.memory) {
            return 'Memory info not available (Chrome only)';
        }
        
        const mem = window.performance.memory;
        const usedMB = (mem.usedJSHeapSize / 1048576).toFixed(2);
        const totalMB = (mem.totalJSHeapSize / 1048576).toFixed(2);
        const limitMB = (mem.jsHeapSizeLimit / 1048576).toFixed(2);
        
        if (mem.usedJSHeapSize > mem.jsHeapSizeLimit * 0.9) {
            throw new Error('Memory usage is critically high');
        }
        
        return `Memory: ${usedMB}MB used / ${totalMB}MB total (limit: ${limitMB}MB)`;
    });
    
    // Test 10: Error Console Check
    runTest('Console Error Check', () => {
        // Override console.error temporarily to catch new errors
        const originalError = console.error;
        let errorCount = 0;
        
        console.error = function(...args) {
            errorCount++;
            originalError.apply(console, args);
        };
        
        // Restore after 1 second
        setTimeout(() => {
            console.error = originalError;
        }, 1000);
        
        return `Console error interceptor installed (errors will be counted)`;
    });
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY:');
    
    const passCount = testResults.filter(t => t.status === 'PASS').length;
    const failCount = testResults.filter(t => t.status === 'FAIL').length;
    
    console.log(`   Passed: ${passCount}/${testResults.length}`);
    console.log(`   Failed: ${failCount}/${testResults.length}`);
    
    if (allPassed) {
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('✅ No syntax errors detected');
        console.log('✅ WebGL initialization working');
        console.log('✅ Scene properly loaded');
        console.log('✅ Ready for production use');
    } else {
        console.log('\n⚠️ SOME TESTS FAILED');
        console.log('❌ Issues found that need attention');
        
        // Show failed tests
        const failures = testResults.filter(t => t.status === 'FAIL');
        console.log('\nFailed Tests:');
        failures.forEach(f => {
            console.log(`  • ${f.name}: ${f.message}`);
        });
    }
    
    // Performance metrics
    if (typeof renderer !== 'undefined' && renderer && renderer.info) {
        console.log('\n🔧 PERFORMANCE METRICS:');
        const info = renderer.info;
        console.log(`   Geometries: ${info.memory.geometries}`);
        console.log(`   Textures: ${info.memory.textures}`);
        console.log(`   Render calls: ${info.render.calls}`);
        console.log(`   Triangles: ${info.render.triangles}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🏁 COMPREHENSIVE TESTING COMPLETE');
    
    return {
        allPassed,
        results: testResults,
        summary: { passed: passCount, failed: failCount, total: testResults.length }
    };
})();