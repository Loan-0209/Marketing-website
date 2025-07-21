// Quick Debug - Run this directly in browser console
// Copy and paste into browser console on facilities.html page

console.log('🔍 QUICK POSITIONING DEBUG');
console.log('==========================');

// Check container setup
const container = document.querySelector('.grid-background-map');
const svgOverlay = document.querySelector('.svg-icon-overlay');
const svg = document.querySelector('.svg-icon-overlay svg');

console.log('\n📦 Container Analysis:');
console.log('Grid container:', getComputedStyle(container).position);
console.log('SVG overlay:', getComputedStyle(svgOverlay).position);
console.log('SVG viewBox:', svg.getAttribute('viewBox'));

const containerRect = container.getBoundingClientRect();
console.log('Container size:', containerRect.width + 'x' + containerRect.height);

// Check each facility
const facilities = document.querySelectorAll('.facility-group');
console.log('\n🎯 Facility Positioning:');

facilities.forEach(facility => {
    const name = facility.getAttribute('data-facility');
    const rect = facility.querySelector('.facility-rect');
    
    if (rect) {
        // SVG coordinates
        const svgX = rect.getAttribute('x');
        const svgY = rect.getAttribute('y');
        
        // Applied transform
        const transform = getComputedStyle(facility).transform;
        console.log(`\n📍 ${name}:`);
        console.log(`  SVG rect: (${svgX}, ${svgY})`);
        console.log(`  Transform: ${transform}`);
        
        // Actual position
        const bbox = facility.getBoundingClientRect();
        const relativeX = bbox.left - containerRect.left;
        const relativeY = bbox.top - containerRect.top;
        console.log(`  Actual pos: (${relativeX.toFixed(1)}, ${relativeY.toFixed(1)})`);
        
        // Extract transform values
        if (transform !== 'none') {
            const matrix = transform.match(/matrix.*\((.+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ').map(parseFloat);
                const expectedX = values[4];
                const expectedY = values[5];
                console.log(`  Expected: (${expectedX}, ${expectedY})`);
                
                const deltaX = relativeX - expectedX;
                const deltaY = relativeY - expectedY;
                console.log(`  Delta: (${deltaX.toFixed(1)}, ${deltaY.toFixed(1)})`);
                
                if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                    console.log(`  ⚠️ MISALIGNED!`);
                } else {
                    console.log(`  ✅ Aligned`);
                }
            }
        }
    }
});

// Check for parent transforms
console.log('\n🔍 Parent Transform Chain:');
let element = document.querySelector('.facility-group');
while (element) {
    const transform = getComputedStyle(element).transform;
    if (transform !== 'none') {
        console.log(`${element.className}: ${transform}`);
    }
    element = element.parentElement;
    if (element === document.body) break;
}

// Check viewport and scaling
console.log('\n📱 Viewport Info:');
console.log('Window size:', window.innerWidth + 'x' + window.innerHeight);
console.log('Device pixel ratio:', window.devicePixelRatio);
console.log('Zoom level:', Math.round(window.devicePixelRatio * 100) + '%');

console.log('\n💡 Run this script in browser console for live analysis');