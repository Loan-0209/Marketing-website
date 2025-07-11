const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('./', {
    setHeaders: (res, path) => {
        // Set proper MIME types
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Routes for all pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/master-plan', (req, res) => {
    res.sendFile(path.join(__dirname, 'master-plan.html'));
});

app.get('/test-nuclear', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-nuclear-final.html'));
});

// Handle 404
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>Available pages:</p>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about.html">About (Nuclear Test)</a></li>
            <li><a href="/test-nuclear-final.html">Nuclear Test Page</a></li>
            <li><a href="/master-plan.html">Master Plan</a></li>
        </ul>
    `);
});

app.listen(PORT, () => {
    console.log('🚀 HEART Technology Park Server');
    console.log('=' .repeat(50));
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log('=' .repeat(50));
    console.log('🌐 Available URLs:');
    console.log(`   🏠 Home:      http://localhost:${PORT}/`);
    console.log(`   💥 About:     http://localhost:${PORT}/about.html`);
    console.log(`   🧪 Nuclear:   http://localhost:${PORT}/test-nuclear-final.html`);
    console.log(`   🏢 Master:    http://localhost:${PORT}/master-plan.html`);
    console.log('=' .repeat(50));
    console.log('💥 Nuclear Gradient Removal ready on About page!');
    console.log('🔧 Press Ctrl+C to stop');
    
    // Auto-open browser
    setTimeout(() => {
        exec(`open http://localhost:${PORT}/about.html`, (error) => {
            if (!error) {
                console.log('✅ Browser opened to About page');
            }
        });
    }, 1000);
});