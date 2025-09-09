// WebGL Debug Helper Script
// Usage: Copy paste into browser console if WebGL errors occur

(function debugWebGL() {
    console.log('🔍 WEBGL DEBUG DIAGNOSTICS');
    console.log('='.repeat(40));
    
    // Check WebGL availability
    const canvas = document.createElement('canvas');
    let gl = null;
    let webglVersion = 'None';
    
    // Try WebGL 2
    gl = canvas.getContext('webgl2');
    if (gl) {
        webglVersion = 'WebGL 2';
    } else {
        // Try WebGL 1
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            webglVersion = 'WebGL 1';
        }
    }
    
    console.log(`✅ WebGL Support: ${webglVersion}`);
    
    if (!gl) {
        console.error('❌ NO WEBGL SUPPORT DETECTED!');
        console.log('Possible reasons:');
        console.log('1. Browser too old');
        console.log('2. Graphics drivers outdated');
        console.log('3. Hardware acceleration disabled');
        console.log('4. GPU blacklisted');
        return;
    }
    
    // Get WebGL info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log(`GPU Vendor: ${vendor}`);
        console.log(`GPU Renderer: ${renderer}`);
    }
    
    // Check max texture size
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    console.log(`Max Texture Size: ${maxTextureSize}x${maxTextureSize}`);
    
    // Check extensions
    const extensions = gl.getSupportedExtensions();
    console.log(`\nSupported Extensions: ${extensions.length}`);
    
    // Check critical extensions
    const criticalExt = [
        'OES_texture_float',
        'OES_standard_derivatives',
        'OES_element_index_uint',
        'ANGLE_instanced_arrays'
    ];
    
    console.log('\nCritical Extensions:');
    criticalExt.forEach(ext => {
        const supported = extensions.includes(ext);
        console.log(`  ${ext}: ${supported ? '✅' : '❌'}`);
    });
    
    // Check Three.js
    console.log('\nThree.js Status:');
    if (typeof THREE !== 'undefined') {
        console.log(`✅ Three.js loaded: r${THREE.REVISION}`);
        
        // Check renderer
        if (typeof renderer !== 'undefined' && renderer) {
            console.log('✅ Renderer created');
            const info = renderer.info;
            if (info) {
                console.log(`  Memory - Geometries: ${info.memory.geometries}`);
                console.log(`  Memory - Textures: ${info.memory.textures}`);
                console.log(`  Render - Calls: ${info.render.calls}`);
                console.log(`  Render - Triangles: ${info.render.triangles}`);
            }
        } else {
            console.log('❌ Renderer not found');
        }
        
        // Check scene
        if (typeof scene !== 'undefined' && scene) {
            console.log(`✅ Scene created with ${scene.children.length} objects`);
        } else {
            console.log('❌ Scene not found');
        }
    } else {
        console.log('❌ Three.js not loaded!');
    }
    
    // Browser info
    console.log('\nBrowser Info:');
    console.log(`User Agent: ${navigator.userAgent}`);
    console.log(`Platform: ${navigator.platform}`);
    console.log(`Memory: ${navigator.deviceMemory || 'Unknown'} GB`);
    console.log(`Cores: ${navigator.hardwareConcurrency || 'Unknown'}`);
    
    // Performance check
    if (window.performance && window.performance.memory) {
        const mem = window.performance.memory;
        console.log(`\nMemory Usage:`);
        console.log(`  Used: ${(mem.usedJSHeapSize / 1048576).toFixed(2)} MB`);
        console.log(`  Total: ${(mem.totalJSHeapSize / 1048576).toFixed(2)} MB`);
        console.log(`  Limit: ${(mem.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
    }
    
    console.log('\n' + '='.repeat(40));
    console.log('Debug complete. Check console for errors.');
})();