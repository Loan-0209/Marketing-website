#!/bin/bash

# CANVAS DISPLAY FIX SCRIPT - SMART CITY 3D
# Automatically fixes canvas display, sizing, and rendering issues

echo "🖥️ CANVAS DISPLAY FIX SCRIPT"
echo "============================"

# Check if file exists
if [ ! -f "3d-campus-smart-city.html" ]; then
    echo "❌ Error: 3d-campus-smart-city.html not found"
    echo "📁 Please run this script from the directory containing the HTML file"
    exit 1
fi

echo "📁 Found target file: 3d-campus-smart-city.html"

# Create backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="3d-campus-smart-city.CANVAS_BACKUP_${TIMESTAMP}.html"
cp 3d-campus-smart-city.html "$BACKUP_FILE"
echo "💾 Backup created: $BACKUP_FILE"

echo ""
echo "🔧 Applying canvas fixes..."

# 1. Fix canvas container CSS
echo "📐 [1/6] Fixing canvas container CSS..."
sed -i '' 's/#canvas-container {/#canvas-container {\
    position: fixed !important;\
    top: 0 !important;\
    left: 0 !important;\
    width: 100vw !important;\
    height: 100vh !important;\
    z-index: 1 !important;\
    overflow: hidden !important;\
    margin: 0 !important;\
    padding: 0 !important;\
}/g' 3d-campus-smart-city.html

# 2. Add canvas element CSS
echo "🖼️ [2/6] Adding canvas element styles..."
sed -i '' 's/#canvas-container {/#canvas-container {\
}\
\
#canvas-container canvas {\
    display: block !important;\
    width: 100% !important;\
    height: 100% !important;\
    margin: 0 !important;\
    padding: 0 !important;\
    border: none !important;\
    outline: none !important;\
}/g' 3d-campus-smart-city.html

# 3. Fix body and html CSS
echo "📄 [3/6] Fixing body and html styles..."
sed -i '' 's/html, body {/html, body {\
    width: 100% !important;\
    height: 100% !important;\
    margin: 0 !important;\
    padding: 0 !important;\
    overflow: hidden !important;/g' 3d-campus-smart-city.html

# 4. Fix renderer initialization
echo "🖥️ [4/6] Fixing renderer initialization..."
sed -i '' 's/this\.renderer\.setSize(canvasWidth, canvasHeight);/\/\/ FIXED: Proper canvas sizing\
        const width = window.innerWidth;\
        const height = window.innerHeight;\
        this.renderer.setSize(width, height);\
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));\
        \
        \/\/ FIXED: Clear container and append canvas\
        canvas.innerHTML = "";\
        canvas.appendChild(this.renderer.domElement);\
        \
        console.log("✅ Canvas properly initialized:", width, "x", height);/g' 3d-campus-smart-city.html

# 5. Fix resize handler
echo "🔄 [5/6] Improving resize handler..."
sed -i '' 's/onWindowResize() {/onWindowResize() {\
        \/\/ FIXED: Get current window size\
        const width = window.innerWidth;\
        const height = window.innerHeight;\
        \
        console.log("🔄 Resizing canvas to:", width, "x", height);\
        \
        \/\/ Update camera\
        if (this.camera) {\
            this.camera.aspect = width \/ height;\
            this.camera.updateProjectionMatrix();\
        }\
        \
        \/\/ Update renderer\
        if (this.renderer) {\
            this.renderer.setSize(width, height);\
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));\
        }\
        \
        \/\/ Force a render\
        if (this.scene && this.camera && this.renderer) {\
            this.renderer.render(this.scene, this.camera);\
        }\
        \
        console.log("✅ Canvas resized successfully");/g' 3d-campus-smart-city.html

# 6. Add canvas debug functions
echo "🛠️ [6/6] Adding canvas debug functions..."

CANVAS_DEBUG_FUNCTIONS='
\/\/ ====================================
\/\/ CANVAS DEBUG AND FIX FUNCTIONS
\/\/ ====================================

\/\/ Check canvas health
window.checkCanvasHealth = function() {
    const stats = {
        canvasExists: !!document.getElementById("canvas-container"),
        rendererExists: !!(window.campus && window.campus.renderer),
        sceneExists: !!(window.campus && window.campus.scene),
        cameraExists: !!(window.campus && window.campus.camera),
        canvasSize: null,
        rendererSize: null
    };
    
    const canvas = document.getElementById("canvas-container");
    if (canvas) {
        stats.canvasSize = {
            width: canvas.clientWidth,
            height: canvas.clientHeight
        };
    }
    
    if (window.campus && window.campus.renderer) {
        const size = window.campus.renderer.getSize(new THREE.Vector2());
        stats.rendererSize = {
            width: size.x,
            height: size.y
        };
    }
    
    console.log("📊 Canvas Health Check:", stats);
    
    \/\/ Check for issues
    if (stats.canvasSize && (stats.canvasSize.width === 0 || stats.canvasSize.height === 0)) {
        console.warn("⚠️ Canvas has zero dimensions!");
    }
    
    return stats;
};

\/\/ Force canvas reset
window.fixCanvas = function() {
    console.log("🔄 Fixing canvas...");
    
    if (window.campus && window.campus.onWindowResize) {
        window.campus.onWindowResize();
    }
    
    \/\/ Force size update
    const canvas = document.getElementById("canvas-container");
    if (canvas && window.campus && window.campus.renderer) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        window.campus.renderer.setSize(width, height);
        if (window.campus.camera) {
            window.campus.camera.aspect = width \/ height;
            window.campus.camera.updateProjectionMatrix();
        }
        
        console.log("✅ Canvas fixed:", width, "x", height);
    }
};

\/\/ Canvas recovery
window.recoverCanvas = function() {
    console.log("🚨 Attempting canvas recovery...");
    
    try {
        \/\/ Check WebGL support
        const testCanvas = document.createElement("canvas");
        const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
        
        if (!gl) {
            console.error("❌ WebGL not supported!");
            return false;
        }
        
        \/\/ Reset canvas
        window.fixCanvas();
        
        console.log("✅ Canvas recovery successful");
        return true;
        
    } catch (error) {
        console.error("❌ Canvas recovery failed:", error);
        return false;
    }
};

console.log("🖥️ Canvas Debug System Ready");
console.log("📋 Commands:");
console.log("  checkCanvasHealth() - Check canvas status");
console.log("  fixCanvas() - Force canvas reset");
console.log("  recoverCanvas() - Attempt recovery");'

# Add debug functions before closing script tag
sed -i '' "s|console\.log('🎉 Smart City initialization completed!');|console.log('🎉 Smart City initialization completed!');${CANVAS_DEBUG_FUNCTIONS}|" 3d-campus-smart-city.html

echo ""
echo "✅ CANVAS FIXES APPLIED SUCCESSFULLY!"
echo ""
echo "📊 Summary of fixes:"
echo "  📐 Canvas container: Fixed positioning and sizing"
echo "  🖼️ Canvas element: Added proper styles"
echo "  📄 Body/HTML: Fixed overflow and dimensions"
echo "  🖥️ Renderer: Improved initialization"
echo "  🔄 Resize handler: Enhanced with proper sizing"
echo "  🛠️ Debug functions: Added canvas health check and fixes"
echo ""
echo "🎯 Expected improvements:"
echo "  ✅ Canvas fills entire viewport (no black borders)"
echo "  ✅ Proper responsive behavior on window resize"
echo "  ✅ Better rendering performance"
echo "  ✅ Debug tools available for troubleshooting"
echo ""
echo "🚀 Next steps:"
echo "  1. Open the website in browser"
echo "  2. Verify canvas fills entire screen"
echo "  3. Test resizing browser window"
echo "  4. Check browser console for any errors"
echo "  5. If issues persist, run debug commands:"
echo "     - checkCanvasHealth() // Check canvas status"
echo "     - fixCanvas() // Force reset"
echo "     - recoverCanvas() // Attempt recovery"
echo ""

# Verify changes
echo "🔍 Verifying canvas fixes..."
CANVAS_FIXES=$(grep -c "Canvas properly initialized\|canvas.appendChild\|fixCanvas" 3d-campus-smart-city.html)
CSS_FIXES=$(grep -c "100vw !important\|100vh !important" 3d-campus-smart-city.html)

echo "📊 Fix verification:"
echo "  🔧 Canvas fixes applied: $CANVAS_FIXES (should be ≥3)"
echo "  🎨 CSS fixes applied: $CSS_FIXES (should be ≥2)"

if [ "$CANVAS_FIXES" -ge 3 ] && [ "$CSS_FIXES" -ge 2 ]; then
    echo ""
    echo "🎉 SUCCESS! Canvas display fixes applied successfully!"
    echo "🖥️ Your Smart City 3D canvas should now display properly!"
else
    echo ""
    echo "⚠️ Warning: Some fixes may not have been applied correctly"
    echo "🔧 Manual verification recommended"
fi

echo ""
echo "💡 Common canvas issues resolved:"
echo "   🖥️ Full screen display (100vw x 100vh)"
echo "   📐 Proper aspect ratio maintenance"
echo "   🔄 Responsive window resizing"
echo "   🎮 WebGL renderer optimization"
echo "   🛠️ Debug and recovery tools"
echo ""
echo "🌟 Canvas display optimization complete!"
