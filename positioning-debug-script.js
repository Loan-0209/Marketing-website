/**
 * Positioning Debug Script - Analyze icon-boundary misalignment
 * Run this in browser console on facilities.html page
 */

function debugPositioning() {
    console.log('🔍 POSITIONING DEBUG ANALYSIS');
    console.log('==============================');
    
    // 1. Check coordinate systems
    analyzeCoordinateSystems();
    
    // 2. Inspect CSS conflicts
    analyzeCSSConflicts();
    
    // 3. Analyze container hierarchy
    analyzeContainerHierarchy();
    
    // 4. Check responsive behavior
    analyzeResponsiveBehavior();
    
    // 5. Output debug info
    outputDebugInfo();
}

function analyzeCoordinateSystems() {
    console.log('\n📐 1. COORDINATE SYSTEMS ANALYSIS');
    console.log('==================================');
    
    const facilities = document.querySelectorAll('.facility-group');
    const svgOverlay = document.querySelector('.svg-icon-overlay svg');
    const container = document.querySelector('.grid-background-map');
    
    console.log('SVG ViewBox:', svgOverlay.getAttribute('viewBox'));
    console.log('SVG preserveAspectRatio:', svgOverlay.getAttribute('preserveAspectRatio'));
    
    const containerRect = container.getBoundingClientRect();
    console.log('Container dimensions:', {
        width: containerRect.width,
        height: containerRect.height,
        top: containerRect.top,
        left: containerRect.left
    });
    
    facilities.forEach(facility => {
        const name = facility.getAttribute('data-name');
        const rect = facility.querySelector('.facility-rect');
        
        if (rect) {
            console.log(`\n📍 ${name}:`);
            console.log('  SVG rect attributes:', {
                x: rect.getAttribute('x'),
                y: rect.getAttribute('y'),
                width: rect.getAttribute('width'),
                height: rect.getAttribute('height')
            });
            
            // Get computed transform
            const computedStyle = getComputedStyle(facility);
            console.log('  Computed transform:', computedStyle.transform);
            console.log('  Transform origin:', computedStyle.transformOrigin);
            
            // Get bounding box
            const facilityRect = facility.getBoundingClientRect();
            console.log('  Screen position:', {
                x: facilityRect.left - containerRect.left,
                y: facilityRect.top - containerRect.top,
                width: facilityRect.width,
                height: facilityRect.height
            });
        }
    });
}

function analyzeCSSConflicts() {
    console.log('\n🎨 2. CSS CONFLICTS ANALYSIS');
    console.log('=============================');
    
    const facilities = document.querySelectorAll('.facility-group');
    
    facilities.forEach(facility => {
        const name = facility.getAttribute('data-name');
        const computedStyle = getComputedStyle(facility);
        
        console.log(`\n📋 ${name} CSS Properties:`);
        
        // Check positioning related properties
        const positionProps = [
            'position', 'top', 'left', 'right', 'bottom',
            'transform', 'transformOrigin', 'willChange',
            'margin', 'padding', 'border',
            'width', 'height', 'boxSizing'
        ];
        
        positionProps.forEach(prop => {
            const value = computedStyle[prop];
            if (value && value !== 'none' && value !== 'auto' && value !== '0px') {
                console.log(`  ${prop}: ${value}`);
            }
        });
        
        // Check for !important rules
        const styles = facility.style;
        if (styles.length > 0) {
            console.log('  Inline styles:');
            for (let i = 0; i < styles.length; i++) {
                const prop = styles[i];
                const priority = styles.getPropertyPriority(prop);
                console.log(`    ${prop}: ${styles.getPropertyValue(prop)}${priority ? ' !important' : ''}`);
            }
        }
    });
}

function analyzeContainerHierarchy() {
    console.log('\n🏗️ 3. CONTAINER HIERARCHY ANALYSIS');
    console.log('===================================');
    
    const hierarchy = [
        '.grid-background-map',
        '.svg-icon-overlay',
        '.facility-group'
    ];
    
    hierarchy.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            const computedStyle = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            console.log(`\n📦 ${selector}:`);
            console.log('  Position:', computedStyle.position);
            console.log('  Dimensions:', {
                width: computedStyle.width,
                height: computedStyle.height
            });
            console.log('  Box model:', {
                margin: computedStyle.margin,
                padding: computedStyle.padding,
                border: computedStyle.border
            });
            console.log('  Screen rect:', {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            });
            console.log('  Transform:', computedStyle.transform);
            console.log('  Z-index:', computedStyle.zIndex);
        }
    });
}

function analyzeResponsiveBehavior() {
    console.log('\n📱 4. RESPONSIVE BEHAVIOR ANALYSIS');
    console.log('==================================');
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio;
    
    console.log('Screen info:', {
        width: screenWidth,
        height: screenHeight,
        devicePixelRatio: devicePixelRatio,
        zoom: Math.round(devicePixelRatio * 100) + '%'
    });
    
    // Check for active media queries
    const mediaQueries = [
        '(max-width: 768px)',
        '(max-width: 1024px)',
        '(min-width: 769px)',
        '(orientation: portrait)',
        '(orientation: landscape)'
    ];
    
    console.log('\nActive media queries:');
    mediaQueries.forEach(query => {
        if (window.matchMedia(query).matches) {
            console.log(`  ✅ ${query}`);
        } else {
            console.log(`  ❌ ${query}`);
        }
    });
    
    // Check for zoom-related issues
    const container = document.querySelector('.grid-background-map');
    const containerRect = container.getBoundingClientRect();
    const containerStyle = getComputedStyle(container);
    
    console.log('\nContainer scaling analysis:');
    console.log('  Natural size vs computed:', {
        natural: { width: container.offsetWidth, height: container.offsetHeight },
        computed: { width: parseFloat(containerStyle.width), height: parseFloat(containerStyle.height) },
        bounding: { width: containerRect.width, height: containerRect.height }
    });
}

function outputDebugInfo() {
    console.log('\n🐛 5. DEBUG INFO OUTPUT');
    console.log('=======================');
    
    const facilities = document.querySelectorAll('.facility-group');
    const container = document.querySelector('.grid-background-map');
    const containerRect = container.getBoundingClientRect();
    
    console.log('\nPixel-perfect positioning analysis:');
    
    facilities.forEach(facility => {
        const name = facility.getAttribute('data-name');
        const facilityType = facility.getAttribute('data-facility');
        const rect = facility.querySelector('.facility-rect');
        
        if (rect) {
            // SVG coordinates
            const svgX = parseFloat(rect.getAttribute('x'));
            const svgY = parseFloat(rect.getAttribute('y'));
            
            // Computed screen position
            const facilityRect = facility.getBoundingClientRect();
            const screenX = facilityRect.left - containerRect.left;
            const screenY = facilityRect.top - containerRect.top;
            
            // Expected position from transform
            const computedStyle = getComputedStyle(facility);
            const transform = computedStyle.transform;
            
            let expectedX = 0, expectedY = 0;
            if (transform && transform !== 'none') {
                const matrix = transform.match(/matrix.*\((.+)\)/);
                if (matrix) {
                    const values = matrix[1].split(', ').map(parseFloat);
                    expectedX = values[4] || 0; // translateX
                    expectedY = values[5] || 0; // translateY
                }
            }
            
            console.log(`\n🎯 ${name} (${facilityType}):`);
            console.log(`  SVG position: (${svgX}, ${svgY})`);
            console.log(`  Expected transform: (${expectedX}, ${expectedY})`);
            console.log(`  Actual screen: (${screenX.toFixed(1)}, ${screenY.toFixed(1)})`);
            console.log(`  Difference: (${(screenX - expectedX).toFixed(1)}, ${(screenY - expectedY).toFixed(1)})`);
            
            // Check if misalignment exists
            const deltaX = Math.abs(screenX - expectedX);
            const deltaY = Math.abs(screenY - expectedY);
            
            if (deltaX > 1 || deltaY > 1) {
                console.log(`  ⚠️ MISALIGNMENT DETECTED: ΔX=${deltaX.toFixed(1)}px, ΔY=${deltaY.toFixed(1)}px`);
                
                // Analyze potential causes
                const causes = [];
                
                if (transform === 'none') {
                    causes.push('No transform applied');
                }
                
                const parent = facility.parentElement;
                const parentTransform = getComputedStyle(parent).transform;
                if (parentTransform !== 'none') {
                    causes.push('Parent container has transform');
                }
                
                const position = computedStyle.position;
                if (position !== 'static') {
                    causes.push(`Element has position: ${position}`);
                }
                
                if (causes.length > 0) {
                    console.log(`    Potential causes: ${causes.join(', ')}`);
                }
            } else {
                console.log(`  ✅ ALIGNED: Within 1px tolerance`);
            }
        }
    });
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('============');
    
    const misalignedCount = Array.from(facilities).filter(facility => {
        const rect = facility.querySelector('.facility-rect');
        if (!rect) return false;
        
        const facilityRect = facility.getBoundingClientRect();
        const screenX = facilityRect.left - containerRect.left;
        const screenY = facilityRect.top - containerRect.top;
        
        const computedStyle = getComputedStyle(facility);
        const transform = computedStyle.transform;
        
        let expectedX = 0, expectedY = 0;
        if (transform && transform !== 'none') {
            const matrix = transform.match(/matrix.*\((.+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ').map(parseFloat);
                expectedX = values[4] || 0;
                expectedY = values[5] || 0;
            }
        }
        
        const deltaX = Math.abs(screenX - expectedX);
        const deltaY = Math.abs(screenY - expectedY);
        
        return deltaX > 1 || deltaY > 1;
    }).length;
    
    console.log(`Total facilities: ${facilities.length}`);
    console.log(`Misaligned facilities: ${misalignedCount}`);
    console.log(`Alignment accuracy: ${((facilities.length - misalignedCount) / facilities.length * 100).toFixed(1)}%`);
    
    if (misalignedCount > 0) {
        console.log('\n🔧 RECOMMENDED FIXES:');
        console.log('1. Check for parent container transforms');
        console.log('2. Verify SVG viewBox scaling');
        console.log('3. Check for CSS positioning conflicts');
        console.log('4. Ensure consistent coordinate systems');
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Positioning Debug Script Loaded');
    console.log('📌 Run debugPositioning() to start analysis');
    
    // Provide convenient access
    window.debugPositioning = debugPositioning;
    window.analyzeCoordinateSystems = analyzeCoordinateSystems;
    window.analyzeCSSConflicts = analyzeCSSConflicts;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debugPositioning, analyzeCoordinateSystems, analyzeCSSConflicts };
}