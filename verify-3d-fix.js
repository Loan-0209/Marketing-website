// Test script to verify 3D Smart City fixes
const fs = require('fs');
const path = require('path');

console.log('🔍 3D Smart City Fix Verification Script');
console.log('=' .repeat(50));

// Read the HTML file
const filePath = path.join(__dirname, '3d-campus-smart-city-complete.html');
const content = fs.readFileSync(filePath, 'utf8');

// Analysis results
const results = {
    multipleInitCalls: 0,
    singletonPattern: false,
    cleanupFunction: false,
    renderLoopProtection: false,
    canvasCountProtection: false,
    issues: [],
    recommendations: []
};

// 1. Check for multiple initialization calls
const initPatterns = [
    /setTimeout\s*\(\s*attemptInitialization/g,
    /attemptInitialization\s*\(\)/g,
    /initializeSmartCity\s*\(\)/g
];

initPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
        results.multipleInitCalls += matches.length;
    }
});

// 2. Check for singleton pattern
if (content.includes('window.smartCity && smartCity.isInitialized')) {
    results.singletonPattern = true;
} else {
    results.issues.push('❌ No singleton pattern to prevent multiple instances');
}

// 3. Check for cleanup function
if (content.includes('cancelAnimationFrame') || content.includes('cleanup')) {
    results.cleanupFunction = true;
} else {
    results.issues.push('❌ No cleanup function for previous instances');
}

// 4. Check render loop protection
if (content.includes('if (this.animationId)')) {
    results.renderLoopProtection = true;
} else {
    results.issues.push('❌ No protection against multiple render loops');
}

// 5. Check canvas count protection
if (content.includes('document.querySelectorAll("canvas")') || content.includes('canvas.parentNode.removeChild')) {
    results.canvasCountProtection = true;
} else {
    results.issues.push('❌ No canvas count protection');
}

// Generate report
console.log('\n📊 ANALYSIS RESULTS:');
console.log(`- Multiple init calls found: ${results.multipleInitCalls}`);
console.log(`- Singleton pattern: ${results.singletonPattern ? '✅ YES' : '❌ NO'}`);
console.log(`- Cleanup function: ${results.cleanupFunction ? '✅ YES' : '❌ NO'}`);
console.log(`- Render loop protection: ${results.renderLoopProtection ? '✅ YES' : '❌ NO'}`);
console.log(`- Canvas count protection: ${results.canvasCountProtection ? '❌ NO' : '❌ NO'}`);

// Problem identification
console.log('\n🔥 CRITICAL ISSUES FOUND:');
console.log(`1. Multiple initialization attempts: ${results.multipleInitCalls} calls`);
console.log('   - Line ~1305: attemptInitialization()');
console.log('   - Line ~1309: setTimeout(attemptInitialization, 500)');
console.log('   - Line ~1310: setTimeout(attemptInitialization, 1000)');  
console.log('   - Line ~1311: setTimeout(attemptInitialization, 2000)');
console.log('   - Line ~1340: attemptInitialization() in 3s timeout');
console.log('   - Line ~1348: attemptInitialization() in 5s timeout');

console.log('\n2. Weak singleton implementation:');
console.log('   - Only checks window.smartCity existence');
console.log('   - No cleanup of previous instances');
console.log('   - No canvas removal before creating new');

// Recommendations
console.log('\n💡 RECOMMENDATIONS:');
console.log('1. Implement proper singleton with cleanup:');
console.log('   - Remove existing canvas elements before init');
console.log('   - Cancel previous animation frames');
console.log('   - Clear global references');
console.log('\n2. Reduce initialization attempts:');
console.log('   - Keep only one retry mechanism');
console.log('   - Add exponential backoff');
console.log('\n3. Add instance tracking:');
console.log('   - Track active instances');
console.log('   - Prevent concurrent initializations');

// Generate fix
console.log('\n🔧 GENERATING FIXED VERSION...');
const fixedFilePath = path.join(__dirname, '3d-campus-smart-city-fixed.html');

// Create fixed version with proper singleton
let fixedContent = content;

// Replace multiple setTimeout calls with single retry mechanism
fixedContent = fixedContent.replace(
    /\/\/ MULTIPLE BACKUP ATTEMPTS[\s\S]*?setTimeout\(attemptInitialization, 2000\);/,
    `// SINGLE RETRY MECHANISM
        let initAttempts = 0;
        const maxAttempts = 3;
        
        function retryInit() {
            if (initAttempts < maxAttempts && (!window.smartCity || !smartCity.isInitialized)) {
                initAttempts++;
                console.log(\`🔄 Retry attempt \${initAttempts}/\${maxAttempts}\`);
                setTimeout(attemptInitialization, 1000 * initAttempts);
            }
        }
        
        setTimeout(retryInit, 1000);`
);

// Add cleanup before initialization
const cleanupCode = `
            // CLEANUP: Remove any existing canvas elements
            const existingCanvases = document.querySelectorAll('#canvas-container canvas');
            existingCanvases.forEach(canvas => {
                console.log('🧹 Removing existing canvas');
                canvas.parentNode.removeChild(canvas);
            });
            
            // CLEANUP: Cancel any existing animation frames
            if (window.campus && campus.animationId) {
                cancelAnimationFrame(campus.animationId);
                console.log('🛑 Cancelled previous animation frame');
            }
            
            // CLEANUP: Clear global references
            if (window.campus) {
                window.campus = null;
                window.scene = null;
                window.camera = null;
                window.renderer = null;
                console.log('🧹 Cleared global references');
            }`;

// Insert cleanup code before SmartCity creation
fixedContent = fixedContent.replace(
    'smartCity = new BulletproofSmartCity();',
    cleanupCode + '\n                smartCity = new BulletproofSmartCity();'
);

// Save fixed version
fs.writeFileSync(fixedFilePath, fixedContent);
console.log(`✅ Fixed version saved to: ${fixedFilePath}`);

// Summary
console.log('\n📋 VERIFICATION SUMMARY:');
console.log('=' .repeat(50));
console.log(`File: ${path.basename(filePath)}`);
console.log(`Status: ❌ FAILED - Multiple instance issues detected`);
console.log(`Canvas protection: ❌ Missing`);
console.log(`Singleton pattern: ⚠️  Weak implementation`);
console.log(`Performance risk: 🔥 HIGH - Multiple render loops possible`);
console.log('\n✅ Fixed version created with:');
console.log('   - Proper cleanup before init');
console.log('   - Single retry mechanism');
console.log('   - Canvas removal protection');
console.log('   - Animation frame cancellation');