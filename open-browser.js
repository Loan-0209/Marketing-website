const { chromium } = require('playwright');
const path = require('path');

async function openProjectInBrowser() {
    console.log('🌐 Mở web browser để xem dự án HEART AI Campus...');
    
    try {
        // Launch browser với giao diện đầy đủ
        const browser = await chromium.launch({
            headless: false,
            args: [
                '--start-maximized',
                '--disable-web-security',
                '--allow-file-access-from-files',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        
        const context = await browser.newContext({
            viewport: null // Sử dụng kích thước cửa sổ đầy đủ
        });
        
        // Mở nhiều tab để xem toàn bộ dự án
        
        // Tab 1: Trang chủ HEART
        const page1 = await context.newPage();
        const indexPath = path.join(__dirname, 'index.html');
        await page1.goto(`file://${indexPath}`);
        await page1.waitForLoadState('networkidle');
        console.log('✅ Tab 1: Trang chủ HEART đã tải');
        
        // Tab 2: 3D AI Campus (standalone)
        const page2 = await context.newPage();
        const campusPath = path.join(__dirname, 'master-plan-standalone.html');
        await page2.goto(`file://${campusPath}`);
        await page2.waitForLoadState('networkidle');
        console.log('✅ Tab 2: 3D AI Campus đã tải');
        
        // Tab 3: Test page để kiểm tra
        const page3 = await context.newPage();
        const testPath = path.join(__dirname, 'simple-test.html');
        await page3.goto(`file://${testPath}`);
        await page3.waitForLoadState('networkidle');
        console.log('✅ Tab 3: Test page đã tải');
        
        // Tab 4: About page
        const page4 = await context.newPage();
        const aboutPath = path.join(__dirname, 'about.html');
        await page4.goto(`file://${aboutPath}`);
        await page4.waitForLoadState('networkidle');
        console.log('✅ Tab 4: About page đã tải');
        
        // Chuyển về tab 3D Campus để xem đầu tiên
        await page2.bringToFront();
        
        console.log('\n🎉 DỰ ÁN HEART AI CAMPUS ĐÃ MỞ THÀNH CÔNG!');
        console.log('📱 4 tab đã được mở:');
        console.log('   🏠 Tab 1: Trang chủ HEART');
        console.log('   🏢 Tab 2: 3D AI Campus (đang hiển thị)');
        console.log('   🔧 Tab 3: Test page');
        console.log('   ℹ️  Tab 4: About page');
        console.log('\n🎮 Hướng dẫn sử dụng 3D Campus:');
        console.log('   • Chuột trái + kéo: Xoay camera');
        console.log('   • Chuột phải + kéo: Di chuyển camera');
        console.log('   • Scroll: Zoom in/out');
        console.log('\n📍 Các điểm nổi bật trong campus:');
        console.log('   🏗️  Twin spiral towers (màu mint & pastel blue)');
        console.log('   🌊 Waterfront setting với crystal ocean');
        console.log('   🏢 Buildings với pastel colors');
        console.log('   🌴 Palm trees và tropical gardens');
        console.log('   🛥️  Marina với boats & yachts');
        console.log('\n⚡ Browser sẽ ở lại mở để bạn khám phá dự án!');
        
        // Enable console logging cho tất cả các tab
        [page1, page2, page3, page4].forEach((page, index) => {
            page.on('console', msg => console.log(`Tab ${index + 1} Console:`, msg.text()));
            page.on('pageerror', error => console.log(`Tab ${index + 1} Error:`, error.message));
        });
        
        // Kiểm tra 3D scene đã load chưa
        setTimeout(async () => {
            try {
                const threeLoaded = await page2.evaluate(() => {
                    return typeof THREE !== 'undefined' && document.querySelector('#threejs-container canvas');
                });
                
                if (threeLoaded) {
                    console.log('🎊 3D Scene đã render thành công!');
                } else {
                    console.log('⏳ 3D Scene đang loading...');
                }
            } catch (e) {
                console.log('ℹ️  Đang kiểm tra 3D scene...');
            }
        }, 3000);
        
    } catch (error) {
        console.error('❌ Lỗi khi mở browser:', error.message);
        process.exit(1);
    }
}

// Chạy function
openProjectInBrowser();