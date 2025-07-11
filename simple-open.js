const { exec } = require('child_process');
const path = require('path');

console.log('🌐 Opening HEART Technology Park website...');

// Get absolute paths
const aboutPath = path.resolve(__dirname, 'about.html');
const testPath = path.resolve(__dirname, 'test-nuclear-final.html');

// Open About page
exec(`open "${aboutPath}"`, (error) => {
    if (error) {
        console.error('Error opening about.html:', error);
    } else {
        console.log('✅ About page opened in default browser');
        console.log('💥 Nuclear gradient removal will auto-activate after 1 second');
        console.log('🎯 Expected result: Pure white background with enhanced building');
    }
});

// Open test page
setTimeout(() => {
    exec(`open "${testPath}"`, (error) => {
        if (error) {
            console.error('Error opening test page:', error);
        } else {
            console.log('✅ Nuclear test page also opened for comparison');
            console.log('🔥 Use buttons on test page to toggle nuclear mode');
        }
    });
}, 1000);

console.log('\n🎉 Browser tabs opening...');
console.log('📱 Two tabs will open:');
console.log('   1. about.html - HEART About page with auto nuclear mode');
console.log('   2. test-nuclear-final.html - Interactive test page');
console.log('\n💡 On the About page you should see:');
console.log('   ✅ Pure white background (no gradients)');
console.log('   ✅ Enhanced HEART building with purple gradient');
console.log('   ✅ Building 8% larger with glow effects');
console.log('   ✅ Crystal clear visibility on white background');