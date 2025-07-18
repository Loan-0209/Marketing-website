// 🎯 MAP SCROLL EFFECT JAVASCRIPT FIX
// File: map-scroll-fix.js
// Purpose: Backup solution to ensure map sticky effect works

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Map Scroll Fix - JavaScript backup initializing...');
    
    function fixMapScrollEffect() {
        const map = document.querySelector('.location-map');
        const grid = document.querySelector('.location-grid');
        const content = document.querySelector('.location-content');
        
        if (!map) {
            console.log('❌ Map element not found');
            return false;
        }
        
        console.log('✅ Map element found, applying fixes...');
        
        // Force sticky positioning
        map.style.position = 'sticky';
        map.style.top = '20px';
        map.style.alignSelf = 'start';
        map.style.zIndex = '2';
        
        // Fix container height for sticky to work
        if (grid) {
            grid.style.minHeight = '120vh';
            grid.style.alignItems = 'start';
        }
        
        // Add content padding for scroll space
        if (content) {
            content.style.paddingBottom = '300px';
        }
        
        // Add debug class for testing
        map.classList.add('map-fixed');
        
        console.log('✅ Map scroll fix applied successfully');
        return true;
    }
    
    function checkStickySupport() {
        // Check if browser supports position: sticky
        const testElement = document.createElement('div');
        testElement.style.position = 'sticky';
        
        if (testElement.style.position === 'sticky') {
            console.log('✅ Browser supports position: sticky');
            return true;
        } else {
            console.log('❌ Browser does not support position: sticky');
            return false;
        }
    }
    
    function fallbackScrollEffect() {
        console.log('🔄 Applying fallback scroll effect...');
        
        const map = document.querySelector('.location-map');
        if (!map) return;
        
        let ticking = false;
        
        function updateMapPosition() {
            const scrollY = window.pageYOffset;
            const mapSection = map.closest('.location-section');
            
            if (mapSection) {
                const sectionTop = mapSection.offsetTop;
                const sectionHeight = mapSection.offsetHeight;
                const windowHeight = window.innerHeight;
                
                if (scrollY >= sectionTop && scrollY <= (sectionTop + sectionHeight - windowHeight)) {
                    // Map should stick
                    map.style.position = 'fixed';
                    map.style.top = '20px';
                    map.style.left = '50%';
                    map.style.transform = 'translateX(-50%)';
                    map.style.width = '45%';
                    map.style.zIndex = '100';
                } else {
                    // Reset to normal
                    map.style.position = 'relative';
                    map.style.top = 'auto';
                    map.style.left = 'auto';
                    map.style.transform = 'none';
                    map.style.width = '100%';
                    map.style.zIndex = '1';
                }
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateMapPosition);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
        console.log('✅ Fallback scroll effect initialized');
    }
    
    // Test sticky support and apply appropriate fix
    if (checkStickySupport()) {
        // Apply CSS-based fix
        const fixApplied = fixMapScrollEffect();
        
        // Verify fix is working after a short delay
        setTimeout(function() {
            const map = document.querySelector('.location-map');
            if (map) {
                const computedStyle = window.getComputedStyle(map);
                if (computedStyle.position !== 'sticky') {
                    console.log('⚠️ CSS fix not working, applying JavaScript fallback...');
                    fallbackScrollEffect();
                }
            }
        }, 1000);
        
    } else {
        // Browser doesn't support sticky, use fallback
        fallbackScrollEffect();
    }
    
    // Re-apply fix on window resize
    window.addEventListener('resize', function() {
        setTimeout(fixMapScrollEffect, 100);
    });
    
    // Debug function (call in console: debugMapScroll())
    window.debugMapScroll = function() {
        const map = document.querySelector('.location-map');
        if (map) {
            console.log('Map element:', map);
            console.log('Position:', window.getComputedStyle(map).position);
            console.log('Top:', window.getComputedStyle(map).top);
            console.log('Z-index:', window.getComputedStyle(map).zIndex);
            
            // Toggle debug mode
            document.body.classList.toggle('debug-mode');
            console.log('Debug mode toggled');
        }
    };
    
    console.log('🎯 Map Scroll Fix initialized successfully!');
    console.log('💡 Type debugMapScroll() in console to debug');
});

// Additional fix for dynamic content loading
window.addEventListener('load', function() {
    // Re-apply fix after everything loads
    setTimeout(function() {
        const map = document.querySelector('.location-map');
        if (map && window.getComputedStyle(map).position !== 'sticky') {
            console.log('🔄 Re-applying map fix after page load...');
            map.style.position = 'sticky';
            map.style.top = '20px';
            map.style.alignSelf = 'start';
        }
    }, 500);
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fixMapScrollEffect, checkStickySupport };
}