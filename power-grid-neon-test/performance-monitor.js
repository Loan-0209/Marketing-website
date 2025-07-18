/**
 * Performance Monitor cho Power Grid Neon Icons
 * Thu thập và phân tích metrics hiệu suất real-time
 */

class PowerGridPerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memoryUsage: 0,
            renderTime: 0,
            animationPerformance: 'unknown',
            responsiveness: 'unknown',
            browserSupport: {},
            testResults: []
        };
        
        this.startTime = performance.now();
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        
        this.init();
    }
    
    init() {
        this.detectBrowserCapabilities();
        this.startFPSMonitoring();
        this.startMemoryMonitoring();
        this.testAnimationPerformance();
        this.testResponsiveness();
        
        console.log('🚀 Performance Monitor khởi tạo thành công');
    }
    
    // Phát hiện khả năng trình duyệt
    detectBrowserCapabilities() {
        const support = {
            boxShadow: CSS.supports('box-shadow', '0 0 20px rgba(255,0,0,0.8)'),
            animation: CSS.supports('animation', 'neonPulse 2s ease-in-out infinite'),
            transform: CSS.supports('transform', 'scale(1.2)'),
            borderRadius: CSS.supports('border-radius', '50%'),
            gradients: CSS.supports('background', 'linear-gradient(45deg, red, blue)'),
            flexbox: CSS.supports('display', 'flex'),
            grid: CSS.supports('display', 'grid'),
            customProperties: CSS.supports('--custom-property', 'value'),
            webGL: !!window.WebGLRenderingContext,
            canvas: !!window.CanvasRenderingContext2D,
            requestAnimationFrame: !!window.requestAnimationFrame,
            performanceAPI: !!window.performance,
            intersectionObserver: !!window.IntersectionObserver
        };
        
        this.metrics.browserSupport = support;
        
        const supportedFeatures = Object.values(support).filter(Boolean).length;
        const totalFeatures = Object.keys(support).length;
        const supportPercentage = Math.round((supportedFeatures / totalFeatures) * 100);
        
        console.log(`🌐 Hỗ trợ trình duyệt: ${supportedFeatures}/${totalFeatures} tính năng (${supportPercentage}%)`);
        
        return support;
    }
    
    // Giám sát FPS
    startFPSMonitoring() {
        const measureFPS = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= this.lastFrameTime + 1000) {
                this.metrics.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
                
                // Đánh giá hiệu suất FPS
                if (this.metrics.fps >= 55) {
                    this.metrics.animationPerformance = 'excellent';
                } else if (this.metrics.fps >= 30) {
                    this.metrics.animationPerformance = 'good';
                } else if (this.metrics.fps >= 15) {
                    this.metrics.animationPerformance = 'poor';
                } else {
                    this.metrics.animationPerformance = 'very-poor';
                }
                
                this.frameCount = 0;
                this.lastFrameTime = currentTime;
                
                // Cập nhật UI nếu có element hiển thị
                const fpsDisplay = document.getElementById('fps-counter');
                if (fpsDisplay) {
                    fpsDisplay.textContent = `${this.metrics.fps} FPS`;
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
    }
    
    // Giám sát bộ nhớ
    startMemoryMonitoring() {
        if (!performance.memory) {
            console.warn('⚠️ Memory API không khả dụng');
            return;
        }
        
        const measureMemory = () => {
            const memory = performance.memory;
            this.metrics.memoryUsage = {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
            };
            
            // Cảnh báo nếu sử dụng bộ nhớ cao
            const usagePercentage = (this.metrics.memoryUsage.used / this.metrics.memoryUsage.limit) * 100;
            if (usagePercentage > 80) {
                console.warn(`⚠️ Sử dụng bộ nhớ cao: ${usagePercentage.toFixed(1)}%`);
            }
            
            setTimeout(measureMemory, 5000); // Kiểm tra mỗi 5 giây
        };
        
        measureMemory();
    }
    
    // Kiểm tra hiệu suất animation
    testAnimationPerformance() {
        const icons = document.querySelectorAll('.substation-500kv, .hydro-plant, .data-center');
        if (icons.length === 0) {
            console.warn('⚠️ Không tìm thấy biểu tượng để kiểm tra');
            return;
        }
        
        const startTime = performance.now();
        let animationTestCount = 0;
        
        icons.forEach(icon => {
            // Kiểm tra CSS animation
            const computedStyle = getComputedStyle(icon);
            const hasAnimation = computedStyle.animationName !== 'none';
            const hasTransform = computedStyle.transform !== 'none';
            const hasBoxShadow = computedStyle.boxShadow !== 'none';
            
            animationTestCount++;
            
            this.metrics.testResults.push({
                element: icon.className,
                hasAnimation,
                hasTransform,
                hasBoxShadow,
                status: hasAnimation && hasBoxShadow ? 'pass' : 'fail'
            });
        });
        
        const endTime = performance.now();
        this.metrics.renderTime = endTime - startTime;
        
        console.log(`🎭 Kiểm tra animation hoàn thành: ${this.metrics.renderTime.toFixed(2)}ms`);
    }
    
    // Kiểm tra tính responsive
    testResponsiveness() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let deviceType = 'unknown';
        let expectedIconSize = 'unknown';
        
        if (viewportWidth <= 768) {
            deviceType = 'mobile';
            expectedIconSize = '25-40px';
        } else if (viewportWidth <= 1024) {
            deviceType = 'tablet';
            expectedIconSize = '30-45px';
        } else if (viewportWidth >= 1920) {
            deviceType = 'large-desktop';
            expectedIconSize = '40-60px';
        } else {
            deviceType = 'desktop';
            expectedIconSize = '35-50px';
        }
        
        this.metrics.responsiveness = {
            viewport: `${viewportWidth}x${viewportHeight}`,
            deviceType,
            expectedIconSize,
            pixelRatio: window.devicePixelRatio || 1,
            orientation: viewportWidth > viewportHeight ? 'landscape' : 'portrait'
        };
        
        console.log(`📱 Responsive test: ${deviceType} (${viewportWidth}x${viewportHeight})`);
    }
    
    // Kiểm tra accessibility
    testAccessibility() {
        const accessibilityFeatures = {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            forcedColors: window.matchMedia('(forced-colors: active)').matches
        };
        
        this.metrics.accessibility = accessibilityFeatures;
        
        console.log('♿ Accessibility preferences:', accessibilityFeatures);
        
        // Áp dụng tối ưu hóa accessibility nếu cần
        if (accessibilityFeatures.reducedMotion) {
            document.body.style.setProperty('--animation-duration', '0s');
            console.log('✅ Đã tắt animation cho accessibility');
        }
        
        return accessibilityFeatures;
    }
    
    // Tạo báo cáo chi tiết
    generateDetailedReport() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            devicePixelRatio: window.devicePixelRatio,
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            
            performance: {
                fps: this.metrics.fps,
                animationPerformance: this.metrics.animationPerformance,
                memoryUsage: this.metrics.memoryUsage,
                renderTime: this.metrics.renderTime,
                loadTime: performance.now() - this.startTime
            },
            
            browserSupport: this.metrics.browserSupport,
            responsiveness: this.metrics.responsiveness,
            accessibility: this.metrics.accessibility,
            
            testResults: this.metrics.testResults,
            
            recommendations: this.generateRecommendations()
        };
        
        console.log('📊 Báo cáo chi tiết:', report);
        return report;
    }
    
    // Tạo khuyến nghị
    generateRecommendations() {
        const recommendations = [];
        
        // Khuyến nghị về FPS
        if (this.metrics.fps < 30) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                message: 'FPS thấp - Cân nhắc giảm số lượng animation hoặc tối ưu CSS'
            });
        }
        
        // Khuyến nghị về bộ nhớ
        if (this.metrics.memoryUsage && this.metrics.memoryUsage.used > 100) {
            recommendations.push({
                type: 'memory',
                priority: 'medium',
                message: 'Sử dụng bộ nhớ cao - Kiểm tra memory leaks'
            });
        }
        
        // Khuyến nghị về trình duyệt
        const browserSupport = this.metrics.browserSupport;
        if (!browserSupport.animation) {
            recommendations.push({
                type: 'compatibility',
                priority: 'high',
                message: 'Trình duyệt không hỗ trợ CSS animation - Cần fallback'
            });
        }
        
        // Khuyến nghị về responsive
        if (this.metrics.responsiveness.deviceType === 'mobile' && this.metrics.fps < 45) {
            recommendations.push({
                type: 'mobile',
                priority: 'medium',
                message: 'Hiệu suất mobile có thể cải thiện - Tối ưu cho thiết bị di động'
            });
        }
        
        return recommendations;
    }
    
    // Export dữ liệu để sử dụng external
    exportMetrics() {
        return {
            getCurrentMetrics: () => this.metrics,
            generateReport: () => this.generateDetailedReport(),
            getFPS: () => this.metrics.fps,
            getMemoryUsage: () => this.metrics.memoryUsage,
            getResponsiveness: () => this.metrics.responsiveness,
            getBrowserSupport: () => this.metrics.browserSupport
        };
    }
}

// Khởi tạo monitor khi DOM ready
let performanceMonitor;

document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor = new PowerGridPerformanceMonitor();
    
    // Export global để truy cập từ console
    window.PowerGridMonitor = performanceMonitor.exportMetrics();
    
    console.log('✅ Performance Monitor sẵn sàng');
    console.log('💡 Sử dụng window.PowerGridMonitor.generateReport() để xem báo cáo');
});

// Auto-report sau 30 giây
setTimeout(() => {
    if (performanceMonitor) {
        const report = performanceMonitor.generateDetailedReport();
        console.log('📈 Báo cáo tự động sau 30 giây:', report);
    }
}, 30000);