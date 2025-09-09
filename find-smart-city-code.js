// Look for Smart City specific initialization:
function findSmartCityCode() {
    console.log('=== SMART CITY CODE SEARCH ===');
    
    // Search in global scope for Smart City related functions
    console.log('1️⃣ GLOBAL FUNCTIONS SEARCH:');
    const smartCityFunctions = Object.keys(window).filter(key => 
        key.toLowerCase().includes('smart') || 
        key.toLowerCase().includes('city') ||
        key.toLowerCase().includes('building') ||
        key.toLowerCase().includes('urban') ||
        key.toLowerCase().includes('datacenter') ||
        key.toLowerCase().includes('data') ||
        key.toLowerCase().includes('center')
    );
    
    console.log('Smart City related functions:', smartCityFunctions);
    smartCityFunctions.forEach(func => {
        console.log(`  ${func}:`, typeof window[func]);
        if (typeof window[func] === 'function') {
            console.log(`    - Function signature: ${window[func].toString().substring(0, 100)}...`);
        }
    });
    
    // Check for specific Smart City objects
    console.log('\n2️⃣ SMART CITY OBJECTS CHECK:');
    const checkObjects = [
        'smartCity',
        'cityScene', 
        'urbanModel',
        'buildings',
        'cityRenderer',
        'mainScene',
        'dataCenter',
        'dataCenters',
        'buildingTypes',
        'cityBuildings'
    ];
    
    checkObjects.forEach(obj => {
        const exists = window[obj];
        console.log(`  ${obj}:`, exists ? '✅ Found' : '❌ Missing');
        if (exists) {
            console.log(`    - Type: ${typeof exists}`);
            if (typeof exists === 'object' && exists !== null) {
                if (Array.isArray(exists)) {
                    console.log(`    - Array length: ${exists.length}`);
                } else {
                    console.log(`    - Object keys: ${Object.keys(exists).slice(0, 5).join(', ')}`);
                }
            }
        }
    });
    
    // Search for initialization functions
    console.log('\n3️⃣ INITIALIZATION FUNCTIONS:');
    const initFunctions = Object.keys(window).filter(key => 
        key.toLowerCase().includes('init') && typeof window[key] === 'function'
    );
    
    console.log('All init functions found:', initFunctions);
    initFunctions.forEach(func => {
        const funcStr = window[func].toString();
        const hasSmartCity = funcStr.toLowerCase().includes('smart') || 
                           funcStr.toLowerCase().includes('city') ||
                           funcStr.toLowerCase().includes('building') ||
                           funcStr.toLowerCase().includes('datacenter');
        console.log(`  ${func}: ${hasSmartCity ? '🏙️ Smart City related' : 'ℹ️ General'}`);
        
        if (hasSmartCity) {
            console.log(`    - Contains: ${funcStr.match(/(smart|city|building|datacenter)/gi)?.join(', ')}`);
        }
    });
    
    // Check Three.js scene content
    console.log('\n4️⃣ THREE.JS SCENE ANALYSIS:');
    if (window.scene) {
        console.log('Main scene exists with', window.scene.children.length, 'children');
        
        const sceneObjectTypes = {};
        window.scene.traverse((child) => {
            const type = child.userData?.type || child.type || 'Unknown';
            sceneObjectTypes[type] = (sceneObjectTypes[type] || 0) + 1;
        });
        
        console.log('Scene object types:');
        Object.entries(sceneObjectTypes).forEach(([type, count]) => {
            console.log(`  - ${type}: ${count} objects`);
        });
        
        // Look for Smart City specific objects
        const smartCityObjects = [];
        window.scene.traverse((child) => {
            if (child.userData?.type) {
                const type = child.userData.type.toLowerCase();
                if (type.includes('building') || type.includes('datacenter') || 
                    type.includes('road') || type.includes('park') || 
                    type.includes('city') || type.includes('urban')) {
                    smartCityObjects.push(child.userData.type);
                }
            }
        });
        
        if (smartCityObjects.length > 0) {
            console.log('✅ Smart City objects found in scene:');
            const uniqueTypes = [...new Set(smartCityObjects)];
            uniqueTypes.forEach(type => {
                const count = smartCityObjects.filter(t => t === type).length;
                console.log(`  - ${type}: ${count} instances`);
            });
        } else {
            console.log('❌ No Smart City specific objects found in scene');
        }
        
    } else {
        console.log('❌ No main scene found');
    }
    
    // Check fallback scene
    if (window.fallbackScene) {
        console.log('\n⚠️ FALLBACK SCENE ACTIVE:');
        console.log('Fallback scene has', window.fallbackScene.children.length, 'children');
        window.fallbackScene.children.forEach((child, i) => {
            console.log(`  Child ${i}: ${child.type} ${child.geometry?.type || ''}`);
        });
    }
    
    // Look in localStorage for scene data
    console.log('\n5️⃣ LOCAL STORAGE CHECK:');
    const relevantStorageKeys = [];
    Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('smart') || 
            key.toLowerCase().includes('city') || 
            key.toLowerCase().includes('scene') ||
            key.toLowerCase().includes('3d') ||
            key.toLowerCase().includes('building')) {
            relevantStorageKeys.push(key);
        }
    });
    
    if (relevantStorageKeys.length > 0) {
        console.log('Relevant localStorage keys found:');
        relevantStorageKeys.forEach(key => {
            const value = localStorage.getItem(key);
            console.log(`  ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
        });
    } else {
        console.log('No relevant localStorage entries found');
    }
    
    // Check for building creation functions
    console.log('\n6️⃣ BUILDING CREATION FUNCTIONS:');
    const buildingFunctions = Object.keys(window).filter(key => 
        (key.toLowerCase().includes('building') || 
         key.toLowerCase().includes('create') ||
         key.toLowerCase().includes('datacenter')) && 
        typeof window[key] === 'function'
    );
    
    console.log('Building/creation functions:', buildingFunctions);
    buildingFunctions.forEach(func => {
        console.log(`  ${func}: Available`);
    });
    
    // Check DOM for scene containers
    console.log('\n7️⃣ DOM SCENE CONTAINERS:');
    const containers = document.querySelectorAll('[id*="canvas"], [id*="scene"], [id*="3d"], [class*="scene"]');
    console.log(`Found ${containers.length} potential scene containers:`);
    containers.forEach(container => {
        console.log(`  - ${container.tagName}#${container.id || 'no-id'}.${container.className || 'no-class'}`);
        console.log(`    Size: ${container.offsetWidth}x${container.offsetHeight}`);
        console.log(`    Children: ${container.children.length}`);
    });
    
    // Summary and recommendations
    console.log('\n🎯 === SMART CITY CODE ANALYSIS SUMMARY ===');
    
    const hasInitFunction = initFunctions.length > 0;
    const hasSmartCityObjects = window.scene && window.scene.children.length > 0;
    const hasFallback = !!window.fallbackScene;
    const hasBuildingFunctions = buildingFunctions.length > 0;
    
    console.log(`Init functions available: ${hasInitFunction ? '✅' : '❌'}`);
    console.log(`Smart City objects in scene: ${hasSmartCityObjects ? '✅' : '❌'}`);
    console.log(`Building creation functions: ${hasBuildingFunctions ? '✅' : '❌'}`);
    console.log(`Fallback scene active: ${hasFallback ? '⚠️ YES' : '✅ NO'}`);
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (hasFallback) {
        console.log('1. Fallback scene is active - main Smart City scene failed to load');
        console.log('   → Try: forceMainSceneLoad() or retryMainScene()');
    }
    
    if (hasInitFunction && !hasSmartCityObjects) {
        console.log('2. Init functions exist but no Smart City objects in scene');
        console.log('   → Try calling the main init function manually');
        const mainInit = initFunctions.find(f => f === 'init') || initFunctions[0];
        if (mainInit) {
            console.log(`   → Suggested: ${mainInit}()`);
        }
    }
    
    if (hasBuildingFunctions && !hasSmartCityObjects) {
        console.log('3. Building functions exist but scene is empty');
        console.log('   → Scene initialization may have failed partway through');
        console.log('   → Try: Clear scene and reinitialize');
    }
    
    if (!hasInitFunction) {
        console.log('4. No initialization functions found');
        console.log('   → Check if JavaScript loaded correctly');
        console.log('   → Try refreshing the page');
    }
    
    return {
        initFunctions,
        smartCityFunctions,
        buildingFunctions,
        hasScene: !!window.scene,
        sceneChildren: window.scene?.children.length || 0,
        hasFallback,
        containers: containers.length
    };
}

// Execute the Smart City code search
const smartCityAnalysis = findSmartCityCode();