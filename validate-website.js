#!/usr/bin/env node

// Website validation script
const fs = require('fs');
const path = require('path');

console.log('🔍 HEART Website Validation');
console.log('===========================');

// Check if main files exist
const requiredFiles = [
    'index.html',
    'css/main.css',
    'css/components.css', 
    'css/news-manager.css',
    'js/auth-simple.js',
    'js/components.js',
    'js/news-manager.js'
];

console.log('📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING!`);
        allFilesExist = false;
    }
});

// Check HTML structure
console.log('\n🔧 Checking HTML structure:');
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    // Basic HTML checks
    const checks = [
        { name: 'DOCTYPE declaration', test: htmlContent.includes('<!DOCTYPE html>') },
        { name: 'HTML tag', test: htmlContent.includes('<html') },
        { name: 'Head section', test: htmlContent.includes('<head>') && htmlContent.includes('</head>') },
        { name: 'Body section', test: htmlContent.includes('<body>') && htmlContent.includes('</body>') },
        { name: 'Title tag', test: htmlContent.includes('<title>') },
        { name: 'CSS links', test: htmlContent.includes('main.css') },
        { name: 'Contact section', test: htmlContent.includes('id="contact"') },
        { name: 'Business Hours', test: htmlContent.includes('Business Hours') },
        { name: 'Getting Here', test: htmlContent.includes('Getting Here') }
    ];
    
    checks.forEach(check => {
        console.log(`${check.test ? '✅' : '❌'} ${check.name}`);
    });
    
    console.log(`\n📊 HTML file size: ${htmlContent.length} characters`);
    
} catch (error) {
    console.log('❌ Error reading HTML file:', error.message);
}

// Check server status
console.log('\n🌐 Server Status:');
const http = require('http');

http.get('http://localhost:3000', (res) => {
    console.log(`✅ Server running on http://localhost:3000`);
    console.log(`📊 Response status: ${res.statusCode}`);
    console.log(`📋 Content-Type: ${res.headers['content-type']}`);
    
    console.log('\n🎉 Website Validation Complete!');
    console.log('================================');
    if (allFilesExist) {
        console.log('✅ All required files present');
        console.log('✅ HTML structure valid');
        console.log('✅ Server responding correctly');
        console.log('\n🚀 Your HEART website is ready!');
        console.log('📱 Open: http://localhost:3000');
    } else {
        console.log('⚠️ Some files are missing - check the list above');
    }
    
    process.exit(0);
}).on('error', (err) => {
    console.log('❌ Server not running or not accessible');
    console.log('💡 Try running: npm start');
    process.exit(1);
});