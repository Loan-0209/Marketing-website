const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    // Handle root path
    if (req.url === '/') {
        req.url = '/index.html';
    }
    
    const filePath = path.join(__dirname, req.url);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>404 - File Not Found</h1>
            <p>Requested: ${req.url}</p>
            <p>Path: ${filePath}</p>
            <p><a href="/index.html">Home</a> | <a href="/master-plan.html">3D Campus</a></p>
        `);
        return;
    }
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';
    
    // Read and serve file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Error reading file: ${err.message}`);
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Access links:`);
    console.log(`   - Main Page: http://localhost:${PORT}/index.html`);
    console.log(`   - 3D Campus: http://localhost:${PORT}/master-plan.html`);
});

server.on('error', (err) => {
    console.error(`❌ Server error: ${err.message}`);
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use. Trying port ${PORT + 1}...`);
        server.listen(PORT + 1);
    }
});