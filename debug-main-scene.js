// Debug script to find main scene initialization issues
console.log('=== MAIN SCENE FAILURE ANALYSIS ===');

// Check for failed resources
console.log('1. Checking failed resources...');
const failedResources = performance.getEntriesByType('resource').filter(
    resource => resource.transferSize === 0 && resource.decodedBodySize === 0
);
console.log('Failed resources:', failedResources);

// Check Three.js availability
console.log('2. Checking Three.js...');
console.log('THREE available:', typeof THREE !== 'undefined');
if (typeof THREE !== 'undefined') {
    console.log('THREE version:', THREE.REVISION);
    console.log('OrbitControls available:', typeof THREE.OrbitControls !== 'undefined');
} else {
    console.error('❌ THREE.js not loaded!');
}

// Check for main scene elements
console.log('3. Checking scene elements...');
console.log('window.scene:', window.scene ? '✅ Present' : '❌ Missing');
console.log('window.camera:', window.camera ? '✅ Present' : '❌ Missing');  
console.log('window.renderer:', window.renderer ? '✅ Present' : '❌ Missing');
console.log('window.controls:', window.controls ? '✅ Present' : '❌ Missing');

// Check canvas container
console.log('4. Checking canvas container...');
const container = document.getElementById('canvas-container');
console.log('Canvas container:', container ? '✅ Found' : '❌ Missing');
if (container) {
    console.log('Container styles:', getComputedStyle(container).display);
    console.log('Container children:', container.children.length);
}

// Check for canvases
console.log('5. Checking canvas elements...');
const canvases = document.querySelectorAll('canvas');
console.log('Canvas count:', canvases.length);
canvases.forEach((canvas, i) => {
    console.log(`Canvas ${i}:`, {
        width: canvas.width,
        height: canvas.height,
        parent: canvas.parentElement?.id || 'body',
        context: canvas.getContext('webgl') ? 'WebGL' : 'No WebGL'
    });
});

// Check loading state
console.log('6. Checking loading state...');
const loadingScreen = document.getElementById('loading-screen');
console.log('Loading screen:', loadingScreen ? 
    (loadingScreen.style.display === 'none' ? '✅ Hidden' : '⚠️ Still visible') : 
    '❌ Missing');

// Check for fallback scene
console.log('7. Checking fallback scene...');
console.log('Fallback scene:', window.fallbackScene ? '⚠️ Active' : '✅ Not active');
console.log('Fallback renderer:', window.fallbackRenderer ? '⚠️ Active' : '✅ Not active');

// Check initialization flags
console.log('8. Checking initialization flags...');
console.log('initInProgress:', window.initInProgress);
console.log('loadingStartTime:', window.loadingStartTime);
console.log('LoadingState:', window.LoadingState);

// Check for error messages in DOM
console.log('9. Checking for error messages...');
const errorElements = document.querySelectorAll('[data-error], .error-message');
console.log('Error elements found:', errorElements.length);
errorElements.forEach((el, i) => {
    console.log(`Error ${i}:`, el.textContent);
});

console.log('=== ANALYSIS COMPLETE ===');