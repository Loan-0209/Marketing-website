const { exec } = require('child_process');
const path = require('path');

const filePath = path.join(__dirname, 'about.html');
const command = `open "${filePath}"`;

console.log('🚀 Opening HEART Technology Park - About Page');
console.log('📄 File:', filePath);
console.log('🔄 Command:', command);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    console.log('✅ Browser opened successfully!');
});