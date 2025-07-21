/**
 * Alignment Fix - Root Cause Analysis and Solution
 * 
 * IDENTIFIED ROOT CAUSE:
 * - SVG viewBox coordinate system (0-1000, 0-600) 
 * - CSS transform using pixel coordinates
 * - Missing coordinate conversion between systems
 */

function fixAlignment() {
    console.log('🔧 APPLYING ALIGNMENT FIX');
    console.log('==========================');
    
    const container = document.querySelector('.grid-background-map');
    const svg = document.querySelector('.svg-icon-overlay svg');
    const facilities = document.querySelectorAll('.facility-group');
    
    // Get actual container dimensions
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // SVG viewBox dimensions
    const viewBox = svg.getAttribute('viewBox').split(' ');
    const svgWidth = parseFloat(viewBox[2]);
    const svgHeight = parseFloat(viewBox[3]);
    
    // Calculate scale factors
    const scaleX = containerWidth / svgWidth;
    const scaleY = containerHeight / svgHeight;
    
    console.log('📐 Coordinate System Analysis:');
    console.log(`Container: ${containerWidth}x${containerHeight}`);
    console.log(`SVG ViewBox: ${svgWidth}x${svgHeight}`);
    console.log(`Scale factors: X=${scaleX.toFixed(4)}, Y=${scaleY.toFixed(4)}`);
    
    // Convert pixel coordinates to SVG coordinates
    const pixelCoordinates = {
        'hydro-plant': { x: 35, y: 251 },
        '500kv-substation': { x: 620, y: 254 },
        '110kv-substation': { x: 838, y: 123 },
        'data-center': { x: 632, y: 332 }
    };
    
    console.log('\n🎯 Converting coordinates:');
    
    facilities.forEach(facility => {
        const facilityType = facility.getAttribute('data-facility');
        const pixelCoords = pixelCoordinates[facilityType];
        
        if (pixelCoords) {
            // Convert pixel coordinates to SVG coordinate system
            const svgX = pixelCoords.x / scaleX;
            const svgY = pixelCoords.y / scaleY;
            
            console.log(`${facilityType}:`);
            console.log(`  Pixel: (${pixelCoords.x}, ${pixelCoords.y})`);
            console.log(`  SVG: (${svgX.toFixed(1)}, ${svgY.toFixed(1)})`);
            
            // Apply SVG coordinates to rect element
            const rect = facility.querySelector('.facility-rect');
            if (rect) {
                rect.setAttribute('x', svgX.toFixed(1));
                rect.setAttribute('y', svgY.toFixed(1));
            }
            
            // Remove CSS transform (no longer needed)
            facility.style.transform = 'none';
        }
    });
    
    console.log('✅ Alignment fix applied - using pure SVG coordinates');
}

// Alternative approach: Use consistent pixel-based transforms
function fixWithPixelTransforms() {
    console.log('🔧 APPLYING PIXEL-BASED TRANSFORM FIX');
    console.log('=====================================');
    
    // Reset all rect positions to origin
    const facilities = document.querySelectorAll('.facility-group');
    facilities.forEach(facility => {
        const rect = facility.querySelector('.facility-rect');
        if (rect) {
            rect.setAttribute('x', '0');
            rect.setAttribute('y', '0');
        }
    });
    
    // Apply precise pixel transforms (already done in CSS)
    console.log('✅ Using pixel-based transforms with origin rects');
}

// Hybrid approach: Account for SVG scaling
function fixWithScaledCoordinates() {
    console.log('🔧 APPLYING SCALED COORDINATE FIX');
    console.log('==================================');
    
    const container = document.querySelector('.grid-background-map');
    const svg = document.querySelector('.svg-icon-overlay svg');
    
    // Check for preserveAspectRatio effect
    const preserveAR = svg.getAttribute('preserveAspectRatio');
    console.log('PreserveAspectRatio:', preserveAR);
    
    if (preserveAR === 'xMidYMid slice') {
        console.log('⚠️ Slice mode may cause coordinate mismatch');
        console.log('💡 Recommendation: Change to "xMidYMid meet" for uniform scaling');
        
        // Apply fix
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        console.log('✅ Changed preserveAspectRatio to "meet"');
    }
}

// Master fix function
function applyAlignmentFix() {
    console.log('🎯 COMPREHENSIVE ALIGNMENT FIX');
    console.log('===============================');
    
    // Step 1: Fix SVG coordinate system
    fixWithScaledCoordinates();
    
    // Step 2: Use converted coordinates
    fixAlignment();
    
    // Step 3: Verify fix
    setTimeout(() => {
        verifyAlignment();
    }, 100);
}

function verifyAlignment() {
    console.log('\n🔍 VERIFICATION');
    console.log('================');
    
    const container = document.querySelector('.grid-background-map');
    const containerRect = container.getBoundingClientRect();
    const facilities = document.querySelectorAll('.facility-group');
    
    let alignedCount = 0;
    
    facilities.forEach(facility => {
        const facilityType = facility.getAttribute('data-facility');
        const rect = facility.querySelector('.facility-rect');
        
        if (rect) {
            const svgX = parseFloat(rect.getAttribute('x'));
            const svgY = parseFloat(rect.getAttribute('y'));
            
            const bbox = facility.getBoundingClientRect();
            const actualX = bbox.left - containerRect.left;
            const actualY = bbox.top - containerRect.top;
            
            console.log(`${facilityType}: SVG(${svgX.toFixed(1)}, ${svgY.toFixed(1)}) Screen(${actualX.toFixed(1)}, ${actualY.toFixed(1)})`);
            
            // Check alignment within 2px tolerance
            const deltaX = Math.abs(actualX - svgX);
            const deltaY = Math.abs(actualY - svgY);
            
            if (deltaX <= 2 && deltaY <= 2) {
                alignedCount++;
                console.log(`  ✅ Aligned (Δ${deltaX.toFixed(1)}, ${deltaY.toFixed(1)})`);
            } else {
                console.log(`  ❌ Misaligned (Δ${deltaX.toFixed(1)}, ${deltaY.toFixed(1)})`);
            }
        }
    });
    
    console.log(`\n📊 Result: ${alignedCount}/${facilities.length} facilities aligned`);
    
    if (alignedCount === facilities.length) {
        console.log('🎉 PERFECT ALIGNMENT ACHIEVED!');
    } else {
        console.log('⚠️ Further adjustment needed');
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.fixAlignment = fixAlignment;
    window.fixWithPixelTransforms = fixWithPixelTransforms;
    window.fixWithScaledCoordinates = fixWithScaledCoordinates;
    window.applyAlignmentFix = applyAlignmentFix;
    window.verifyAlignment = verifyAlignment;
    
    console.log('🔧 Alignment Fix Tools Loaded');
    console.log('📌 Run applyAlignmentFix() to apply comprehensive fix');
    console.log('📌 Run verifyAlignment() to check current alignment');
}