#!/bin/bash

# REMOVE FOG EFFECTS - SMART CITY 3D
# Permanently removes all fog effects from source code

echo "🌫️ SMART CITY 3D - FOG REMOVAL SCRIPT"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "3d-campus-smart-city-complete.html" ]; then
    echo "❌ Error: 3d-campus-smart-city-complete.html not found"
    echo "📁 Please run this script from the directory containing the HTML file"
    exit 1
fi

echo "📁 Found target file: 3d-campus-smart-city-complete.html"
echo "💾 Creating backup..."

# Create backup with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="3d-campus-smart-city-complete.backup_${TIMESTAMP}.html"
cp 3d-campus-smart-city-complete.html "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"

echo ""
echo "🌫️ Removing fog effects..."

# 1. Comment out main fog creation (line ~495)
echo "🔧 [1/3] Removing main scene fog..."
sed -i '' 's/this\.scene\.fog = new THREE\.Fog(0x87CEEB, 100, 400);/\/\/ REMOVED: this.scene.fog = new THREE.Fog(0x87CEEB, 100, 400); \/\/ Fog effect disabled for crystal clear view/g' 3d-campus-smart-city-complete.html

# 2. Remove day mode fog (line ~2070)
echo "🌞 [2/3] Removing day mode fog..."
sed -i '' 's/window\.campus\.scene\.fog = new THREE\.Fog(0x87CEEB, 100, 400);/window.campus.scene.fog = null; \/\/ FIXED: No fog in day mode - crystal clear view/g' 3d-campus-smart-city-complete.html

# 3. Remove night mode fog (line ~2076)
echo "🌙 [3/3] Removing night mode fog..."
sed -i '' 's/window\.campus\.scene\.fog = new THREE\.Fog(0x001122, 50, 300);/window.campus.scene.fog = null; \/\/ FIXED: No fog in night mode - crystal clear view/g' 3d-campus-smart-city-complete.html

# 4. Add fog removal verification function
echo "🔍 Adding fog verification function..."

# Find the line with console.log and add verification function after it
FOG_VERIFICATION_FUNCTION='
// ====================================
// FOG VERIFICATION SYSTEM
// ====================================
window.verifyNoFog = function() {
    console.log("🌫️ VERIFYING FOG REMOVAL...");
    
    let fogFound = 0;
    
    if (window.scene && window.scene.fog) {
        console.log("⚠️ Main scene still has fog");
        window.scene.fog = null;
        fogFound++;
    }
    
    if (window.campus && window.campus.scene && window.campus.scene.fog) {
        console.log("⚠️ Campus scene still has fog");
        window.campus.scene.fog = null;
        fogFound++;
    }
    
    if (fogFound === 0) {
        console.log("✅ VERIFICATION PASSED - No fog detected");
        console.log("🌞 Crystal clear view confirmed!");
    } else {
        console.log(`🔧 Fixed ${fogFound} remaining fog effects`);
    }
    
    return fogFound === 0;
};

// Auto-verify after 3 seconds
setTimeout(() => {
    if (window.verifyNoFog) {
        window.verifyNoFog();
    }
}, 3000);'

# Add the verification function before the last </script> tag
sed -i '' "s|console\.log('🎉 Smart City 3D optimization complete!');|console.log('🎉 Smart City 3D optimization complete!');${FOG_VERIFICATION_FUNCTION}|" 3d-campus-smart-city-complete.html

echo ""
echo "✅ FOG REMOVAL COMPLETED!"
echo ""
echo "📊 Summary of changes:"
echo "  🌫️ Main scene fog: REMOVED"
echo "  🌞 Day mode fog: REMOVED" 
echo "  🌙 Night mode fog: REMOVED"
echo "  🔍 Verification function: ADDED"
echo ""
echo "🎯 Expected results:"
echo "  ✅ Crystal clear view (no fog blur)"
echo "  ✅ More vibrant colors"
echo "  ✅ Better object visibility"
echo "  ✅ Cleaner rendering"
echo ""
echo "🚀 Next steps:"
echo "  1. Open the website to see crystal clear view"
echo "  2. Check browser console - should see 'No fog detected'"
echo "  3. Test day/night mode toggle - no fog in either mode"
echo "  4. If any issues, restore from: $BACKUP_FILE"
echo ""
echo "💡 Debug commands (in browser console):"
echo "     verifyNoFog() // Verify no fog effects remain"
echo "     checkFogStatus() // If you have the fog removal script loaded"
echo ""
echo "🌞 Crystal clear Smart City 3D is ready!"

# Verify the changes were made
echo ""
echo "🔍 Verifying changes in file..."

FOG_COUNT=$(grep -c "new THREE\.Fog" 3d-campus-smart-city-complete.html)
REMOVED_COUNT=$(grep -c "REMOVED.*fog" 3d-campus-smart-city-complete.html)
NULL_FOG_COUNT=$(grep -c "\.fog = null" 3d-campus-smart-city-complete.html)

echo "📊 Change verification:"
echo "  🌫️ Remaining 'new THREE.Fog': $FOG_COUNT (should be 0)"
echo "  ✅ REMOVED comments: $REMOVED_COUNT (should be ≥1)"
echo "  🌞 '.fog = null' lines: $NULL_FOG_COUNT (should be ≥2)"

if [ "$FOG_COUNT" -eq 0 ] && [ "$NULL_FOG_COUNT" -ge 2 ]; then
    echo ""
    echo "🎉 SUCCESS! All fog effects successfully removed!"
    echo "🌞 Your Smart City 3D now has crystal clear view!"
else
    echo ""
    echo "⚠️ Warning: Some fog effects might still remain"
    echo "🔧 You may need to manually check the file"
fi

echo ""
echo "✨ Fog removal script completed!"
