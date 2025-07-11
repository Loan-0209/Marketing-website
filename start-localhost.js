const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Handle query parameters
    if (req.url.includes('?')) {
        filePath = path.join(__dirname, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
    }
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end(`File not found: ${req.url}`);
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            const contentType = getContentType(filePath);
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log('🚀 HEART Technology Park - Localhost Server Started!');
    console.log('=' .repeat(60));
    console.log(`📍 Server running at: http://${HOST}:${PORT}/`);
    console.log('=' .repeat(60));
    console.log('🌐 Available Pages:');
    console.log(`   🏠 Home Page:        http://${HOST}:${PORT}/`);
    console.log(`   ℹ️  About Page:       http://${HOST}:${PORT}/about.html`);
    console.log(`   🏢 Master Plan:      http://${HOST}:${PORT}/master-plan.html`);
    console.log(`   🎯 3D Campus:        http://${HOST}:${PORT}/ai-campus-3d-structure.html`);
    console.log(`   📰 News:             http://${HOST}:${PORT}/news.html`);
    console.log(`   📞 Contact:          http://${HOST}:${PORT}/contact.html`);
    console.log(`   🔐 Login:            http://${HOST}:${PORT}/login.html`);
    console.log(`   💰 Investment:       http://${HOST}:${PORT}/investment.html`);
    console.log(`   🔬 Technology:       http://${HOST}:${PORT}/technology.html`);
    console.log(`   🏗️  Facilities:       http://${HOST}:${PORT}/facilities.html`);
    console.log('=' .repeat(60));
    console.log('🧪 Test Pages:');
    console.log(`   💥 Nuclear Test:     http://${HOST}:${PORT}/test-nuclear-final.html`);
    console.log('=' .repeat(60));
    console.log('💡 Features:');
    console.log('   ✅ Auto CORS headers for local development');
    console.log('   ✅ Proper MIME types for all assets');
    console.log('   ✅ No cache for live development');
    console.log('   ✅ Security protection against directory traversal');
    console.log('=' .repeat(60));
    console.log('🎯 About Page - Nuclear Gradient Removal:');
    console.log('   💥 Auto-activates after 1 second');
    console.log('   🎨 Pure white background');
    console.log('   🏢 Enhanced HEART building with 8% scale');
    console.log('   ✨ Glow effects and enhanced contrast');
    console.log('=' .repeat(60));
    
    // Auto-open browser after 2 seconds
    setTimeout(() => {
        console.log('🌐 Auto-opening browser...');
        
        // Open About page to showcase nuclear gradient removal
        exec(`open http://${HOST}:${PORT}/about.html`, (error) => {
            if (error) {
                console.log('❌ Could not auto-open browser. Please manually visit:');
                console.log(`   👉 http://${HOST}:${PORT}/about.html`);
            } else {
                console.log('✅ Browser opened - About page with nuclear gradient removal');
            }
        });
        
        // Also open test page
        setTimeout(() => {
            exec(`open http://${HOST}:${PORT}/test-nuclear-final.html`, (error) => {
                if (!error) {
                    console.log('✅ Test page also opened for comparison');
                }
            });
        }, 1000);
        
    }, 2000);
    
    console.log('\n🔧 Press Ctrl+C to stop the server');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
        server.listen(PORT + 1, HOST);
    } else {
        console.error('Server error:', err);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped. Goodbye!');
        process.exit(0);
    });
});