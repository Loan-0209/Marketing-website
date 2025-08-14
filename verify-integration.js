/**
 * Master Plan 3D Integration Verification Script
 * Run this in browser console to verify integration status
 */

console.log('🔍 MASTER PLAN 3D INTEGRATION VERIFICATION');
console.log('='.repeat(50));

// Check 1: Three.js availability
console.log('\n📦 1. THREE.JS CHECK:');
if (typeof THREE !== 'undefined') {
    console.log('✅ Three.js loaded - Version:', THREE.REVISION);
    console.log('   WebGL Renderer:', typeof THREE.WebGLRenderer !== 'undefined' ? '✅' : '❌');
    console.log('   Orbit Controls:', typeof THREE.OrbitControls !== 'undefined' ? '✅' : '❌');
} else {
    console.log('❌ Three.js not loaded');
}

// Check 2: Master Plan 3D class
console.log('\n🏗️  2. MASTER PLAN 3D CLASS:');
if (typeof MasterPlan3D !== 'undefined') {
    console.log('✅ MasterPlan3D class available');
    const methods = Object.getOwnPropertyNames(MasterPlan3D.prototype);
    console.log('   Methods:', methods.length, '-', methods.slice(0, 5).join(', ') + '...');
} else {
    console.log('❌ MasterPlan3D class not found');
    console.log('   Check if js/master-plan-3d.js is loaded properly');
}

// Check 3: Master Plan instance
console.log('\n🎯 3. MASTER PLAN INSTANCE:');
if (typeof masterPlanInstance !== 'undefined' && masterPlanInstance) {
    console.log('✅ Master Plan instance exists');
    console.log('   Type:', typeof masterPlanInstance);
    console.log('   Initialized:', masterPlanInstance.isInitialized || false);
    console.log('   Scene:', masterPlanInstance.scene ? '✅' : '❌');
    console.log('   Camera:', masterPlanInstance.camera ? '✅' : '❌');
    console.log('   Renderer:', masterPlanInstance.renderer ? '✅' : '❌');
} else {
    console.log('❌ Master Plan instance not found');
    console.log('   Instance variable:', typeof masterPlanInstance);
}

// Check 4: HTML structure
console.log('\n🖼️  4. HTML STRUCTURE:');
const requiredElements = {
    'threejs-container': 'Main container',
    'loadingOverlay': 'Loading overlay',
    'timeline-item': 'Timeline controls (should be 3)',
    'control-btn[data-view]': 'View controls (should be 3)',
    'performance-indicator': 'FPS indicator'
};

Object.entries(requiredElements).forEach(([selector, description]) => {
    const elements = document.querySelectorAll(selector.includes('[') ? selector : `#${selector}`);
    if (elements.length > 0) {
        console.log(`✅ ${description}: ${elements.length} found`);
    } else {
        console.log(`❌ ${description}: Not found`);
    }
});

// Check 5: Container dimensions
console.log('\n📐 5. CONTAINER DIMENSIONS:');
const container = document.getElementById('threejs-container');
if (container) {
    const rect = container.getBoundingClientRect();
    console.log('✅ Container found');
    console.log(`   Dimensions: ${rect.width}x${rect.height}px`);
    console.log(`   Position: ${rect.left}, ${rect.top}`);
    console.log(`   Visible: ${rect.width > 0 && rect.height > 0 ? '✅' : '❌'}`);
} else {
    console.log('❌ Container not found');
}

// Check 6: WebGL context
console.log('\n🎮 6. WEBGL CONTEXT:');
try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        console.log('✅ WebGL context available');
        console.log('   Renderer:', gl.getParameter(gl.RENDERER));
        console.log('   Version:', gl.getParameter(gl.VERSION));
        console.log('   Max texture size:', gl.getParameter(gl.MAX_TEXTURE_SIZE));
    } else {
        console.log('❌ WebGL context not available');
    }
} catch (e) {
    console.log('❌ WebGL check failed:', e.message);
}

// Check 7: Event listeners
console.log('\n🎮 7. EVENT LISTENERS:');
const timelineItems = document.querySelectorAll('.timeline-item');
const viewButtons = document.querySelectorAll('.control-btn[data-view]');

console.log(`   Timeline items: ${timelineItems.length} ${timelineItems.length === 3 ? '✅' : '❌'}`);
console.log(`   View buttons: ${viewButtons.length} ${viewButtons.length === 3 ? '✅' : '❌'}`);

// Test event listeners
if (timelineItems.length > 0) {
    const hasClickListener = timelineItems[0].onclick || 
                           getEventListeners && getEventListeners(timelineItems[0]).click;
    console.log(`   Timeline click handlers: ${hasClickListener ? '✅' : '❌'}`);
}

// Check 8: Performance monitoring
console.log('\n⚡ 8. PERFORMANCE:');
const perfIndicator = document.querySelector('.performance-indicator');
if (perfIndicator) {
    console.log('✅ Performance indicator found');
    console.log('   Current text:', perfIndicator.textContent);
} else {
    console.log('❌ Performance indicator not found');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 INTEGRATION STATUS SUMMARY:');

const checks = [
    typeof THREE !== 'undefined',
    typeof MasterPlan3D !== 'undefined', 
    typeof masterPlanInstance !== 'undefined' && masterPlanInstance,
    document.getElementById('threejs-container'),
    document.querySelectorAll('.timeline-item').length === 3,
    document.querySelectorAll('.control-btn[data-view]').length === 3
];

const passedChecks = checks.filter(Boolean).length;
const totalChecks = checks.length;

console.log(`Overall: ${passedChecks}/${totalChecks} checks passed`);

if (passedChecks === totalChecks) {
    console.log('🎉 INTEGRATION SUCCESSFUL - Ready to use!');
} else if (passedChecks >= totalChecks * 0.8) {
    console.log('⚠️  MOSTLY WORKING - Minor issues to fix');
} else {
    console.log('❌ INTEGRATION ISSUES - Need troubleshooting');
}

console.log('\n🔧 Next steps:');
if (typeof MasterPlan3D === 'undefined') {
    console.log('   - Check js/master-plan-3d.js file path');
}
if (!masterPlanInstance) {
    console.log('   - Call initializeMasterPlan() function');
}
if (passedChecks < totalChecks) {
    console.log('   - Fix HTML structure issues');
    console.log('   - Verify file dependencies');
}

console.log('='.repeat(50));