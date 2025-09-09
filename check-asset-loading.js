// Check for missing 3D models, textures, and dependencies:
function checkAssetLoading() {
    console.log('=== ASSET LOADING CHECK ===');
    
    // Check Three.js and dependencies
    const requiredLibraries = [
        'THREE',
        'GLTFLoader', 
        'OrbitControls',
        'Stats'
    ];
    
    console.log('1. Checking JavaScript Libraries:');
    requiredLibraries.forEach(lib => {
        let status = '❌ Missing';
        let details = '';
        
        if (lib === 'THREE') {
            if (typeof THREE !== 'undefined') {
                status = '✅ Loaded';
                details = `(v${THREE.REVISION})`;
            }
        } else if (lib === 'OrbitControls') {
            if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined') {
                status = '✅ Loaded';
            }
        } else if (lib === 'GLTFLoader') {
            if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
                status = '✅ Loaded';
            }
        } else if (lib === 'Stats') {
            if (typeof Stats !== 'undefined') {
                status = '✅ Loaded';
            }
        }
        
        console.log(`  ${lib}: ${status} ${details}`);
    });
    
    console.log('\n2. Checking Script and Link Assets:');
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const links = Array.from(document.querySelectorAll('link[href]'));
    
    console.log(`  Scripts with src: ${scripts.length}`);
    console.log(`  Links with href: ${links.length}`);
    
    // Check for model files
    console.log('\n3. Checking 3D Model Files:');
    const modelExtensions = ['.gltf', '.glb', '.fbx', '.obj', '.dae', '.3ds'];
    const allAssets = [...scripts, ...links];
    const modelAssets = allAssets.filter(asset => 
        modelExtensions.some(ext => (asset.src || asset.href).toLowerCase().includes(ext))
    );
    
    console.log(`  Model assets found: ${modelAssets.length}`);
    modelAssets.forEach((asset, i) => {
        console.log(`  Model ${i+1}:`, asset.src || asset.href);
    });
    
    if (modelAssets.length === 0) {
        console.log('  ⚠️ No 3D model files detected - using procedural geometry only');
    }
    
    // Check for texture files
    console.log('\n4. Checking Texture Files:');
    const textureExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.hdr', '.exr', '.webp'];
    const textureAssets = allAssets.filter(asset => 
        textureExtensions.some(ext => (asset.src || asset.href).toLowerCase().includes(ext))
    );
    
    console.log(`  Texture assets found: ${textureAssets.length}`);
    textureAssets.forEach((asset, i) => {
        console.log(`  Texture ${i+1}:`, asset.src || asset.href);
    });
    
    if (textureAssets.length === 0) {
        console.log('  ℹ️ No external textures detected - using solid colors/procedural textures');
    }
    
    // Check for failed network requests
    console.log('\n5. Checking Network Request Failures:');
    const resources = performance.getEntriesByType('resource');
    const failedResources = resources.filter(resource => 
        resource.transferSize === 0 && resource.decodedBodySize === 0 && resource.name.includes('.')
    );
    
    console.log(`  Total resources: ${resources.length}`);
    console.log(`  Failed resources: ${failedResources.length}`);
    
    if (failedResources.length > 0) {
        console.log('  ❌ Failed to load:');
        failedResources.forEach(resource => {
            console.log(`    - ${resource.name}`);
        });
    } else {
        console.log('  ✅ All resources loaded successfully');
    }
    
    // Check WebGL context
    console.log('\n6. Checking WebGL Support:');
    const canvas = document.createElement('canvas');
    const webglContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const webgl2Context = canvas.getContext('webgl2');
    
    console.log(`  WebGL 1.0: ${webglContext ? '✅ Supported' : '❌ Not supported'}`);
    console.log(`  WebGL 2.0: ${webgl2Context ? '✅ Supported' : '❌ Not supported'}`);
    
    if (webglContext) {
        const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            console.log(`  GPU: ${webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`);
            console.log(`  Vendor: ${webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}`);
        }
        console.log(`  Max Texture Size: ${webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE)}`);
        console.log(`  Max Vertex Attributes: ${webglContext.getParameter(webglContext.MAX_VERTEX_ATTRIBS)}`);
    }
    
    canvas.remove();
    
    // Summary
    console.log('\n=== ASSET LOADING SUMMARY ===');
    const threeLoaded = typeof THREE !== 'undefined';
    const controlsLoaded = typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined';
    const webglSupported = !!webglContext;
    
    console.log(`Three.js: ${threeLoaded ? '✅' : '❌'}`);
    console.log(`OrbitControls: ${controlsLoaded ? '✅' : '❌'}`);
    console.log(`WebGL Support: ${webglSupported ? '✅' : '❌'}`);
    console.log(`3D Models: ${modelAssets.length} files`);
    console.log(`Textures: ${textureAssets.length} files`);
    console.log(`Failed Requests: ${failedResources.length} failures`);
    
    const readyForMain = threeLoaded && controlsLoaded && webglSupported && failedResources.length === 0;
    console.log(`\n🎯 Ready for Main Scene: ${readyForMain ? '✅ YES' : '❌ NO'}`);
    
    if (!readyForMain) {
        console.log('\n🔧 Issues to resolve:');
        if (!threeLoaded) console.log('  - Three.js not loaded');
        if (!controlsLoaded) console.log('  - OrbitControls not loaded');
        if (!webglSupported) console.log('  - WebGL not supported');
        if (failedResources.length > 0) console.log(`  - ${failedResources.length} network request failures`);
    }
    
    return {
        threeLoaded,
        controlsLoaded,
        webglSupported,
        modelCount: modelAssets.length,
        textureCount: textureAssets.length,
        failedCount: failedResources.length,
        readyForMain
    };
}

// Execute the check
const assetStatus = checkAssetLoading();