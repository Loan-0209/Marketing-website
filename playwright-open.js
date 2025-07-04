const { chromium } = require('playwright');
const path = require('path');

async function openCampusInPlaywright() {
    console.log('🚀 Launching Playwright browser for HEART AI Campus...');
    
    try {
        // Launch browser
        const browser = await chromium.launch({
            headless: false, // Show browser window
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--allow-file-access-from-files'
            ]
        });
        
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        
        const page = await context.newPage();
        
        // Enable console logging
        page.on('console', msg => console.log('Browser Console:', msg.text()));
        page.on('pageerror', error => console.log('Page Error:', error.message));
        
        // Get absolute path to the standalone file
        const filePath = path.join(__dirname, 'master-plan-standalone.html');
        const fileUrl = `file://${filePath}`;
        
        console.log(`📁 Opening file: ${fileUrl}`);
        
        // Navigate to the standalone file
        await page.goto(fileUrl, { waitUntil: 'networkidle' });
        
        console.log('✅ AI Campus loaded successfully in Playwright!');
        console.log('🎮 Use mouse to navigate the 3D campus');
        console.log('📱 Browser window will stay open for interaction');
        
        // Wait for 3D scene to load
        await page.waitForTimeout(3000);
        
        // Check if Three.js loaded
        const threeLoaded = await page.evaluate(() => {
            return typeof THREE !== 'undefined';
        });
        
        if (threeLoaded) {
            console.log('✅ Three.js loaded successfully');
        } else {
            console.log('❌ Three.js failed to load');
        }
        
        // Keep browser open
        console.log('Browser will remain open. Close manually when done.');
        
        // Don't close browser - let user interact
        // await browser.close();
        
    } catch (error) {
        console.error('❌ Error launching Playwright:', error.message);
        process.exit(1);
    }
}

// Run the function
openCampusInPlaywright();