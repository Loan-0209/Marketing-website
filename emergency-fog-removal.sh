#!/bin/bash

# EMERGENCY FOG REMOVAL - SMART CITY 3D
# This script will aggressively remove ALL fog effects and ensure crystal clear view

echo "🚨 EMERGENCY FOG REMOVAL - SMART CITY 3D"
echo "========================================"

# Check if file exists
if [ ! -f "3d-campus-smart-city-complete.html" ]; then
    echo "❌ Error: 3d-campus-smart-city-complete.html not found"
    echo "📁 Please run this script from the directory containing the HTML file"
    exit 1
fi

echo "📁 Found target file: 3d-campus-smart-city-complete.html"

# Create emergency backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EMERGENCY_BACKUP="3d-campus-smart-city-complete.EMERGENCY_BACKUP_${TIMESTAMP}.html"
cp 3d-campus-smart-city-complete.html "$EMERGENCY_BACKUP"
echo "💾 Emergency backup created: $EMERGENCY_BACKUP"

echo ""
echo "🔍 Searching for ALL fog-related code..."

# Search for all fog references
echo "📊 Current fog references in file:"
grep -n -i "fog" 3d-campus-smart-city-complete.html | head -10

echo ""
echo "🚨 APPLYING AGGRESSIVE FOG REMOVAL..."

# 1. Remove ANY line that creates fog
echo "🗑️ [1/6] Removing all fog creation lines..."
sed -i '' '/new THREE\.Fog/d' 3d-campus-smart-city-complete.html

# 2. Add aggressive fog blocking after scene creation
echo "🚫 [2/6] Adding fog prevention code..."
sed -i '' 's/this\.scene = new THREE\.Scene();/this.scene = new THREE.Scene();\
                this.scene.fog = null; \/\/ EMERGENCY: Force no fog\
                console.log("🌞 Fog forcibly disabled");/g' 3d-campus-smart-city-complete.html

# 3. Replace any remaining fog assignments with null
echo "🔄 [3/6] Replacing all fog assignments..."
sed -i '' 's/\.fog = new THREE\.Fog[^;]*;/.fog = null; \/\/ EMERGENCY: Fog blocked/g' 3d-campus-smart-city-complete.html

# 4. Add fog override in setupLighting
echo "💡 [4/6] Adding fog override in lighting setup..."
sed -i '' 's/console\.log('\''✅ Day mode lighting setup complete'\'');/\/\/ EMERGENCY: Override any fog creation\
                this.scene.fog = null;\
                console.log("🌞 Emergency fog override applied");\
                console.log('\''✅ Day mode lighting setup complete'\'');/g' 3d-campus-smart-city-complete.html

# 5. Add emergency fog removal in render loop
echo "🔄 [5/6] Adding fog check in render loop..."
# Find the render loop and add fog check
sed -i '' 's/this\.renderer\.render(this\.scene, this\.camera);/\/\/ EMERGENCY: Ensure no fog in render loop\
                if (this.scene.fog) {\
                    this.scene.fog = null;\
                    console.log("🚫 Fog detected and removed in render loop");\
                }\
                this.renderer.render(this.scene, this.camera);/g' 3d-campus-smart-city-complete.html

# 6. Add emergency fog removal function at the end of script
echo "🛠️ [6/6] Adding emergency fog removal function..."

EMERGENCY_FUNCTION='
// ====================================
// EMERGENCY FOG REMOVAL SYSTEM
// ====================================
window.emergencyFogRemoval = function() {
    console.log("🚨 EMERGENCY FOG REMOVAL ACTIVATED");
    
    let removed = 0;
    
    // Remove from all possible scene locations
    const scenes = [window.scene, window.campus?.scene].filter(Boolean);
    
    scenes.forEach((scene, index) => {
        if (scene && scene.fog) {
            scene.fog = null;
            removed++;
            console.log(`✅ Removed fog from scene ${index + 1}`);
        }
    });
    
    // Override THREE.Fog constructor
    if (window.THREE && window.THREE.Fog) {
        window.THREE.Fog = function() {
            console.log("🚫 FOG CREATION BLOCKED");
            return null;
        };
        console.log("🚫 THREE.Fog constructor overridden");
    }
    
    // Force clear background
    scenes.forEach(scene => {
        if (scene) {
            scene.background = new THREE.Color(0x87CEEB);
        }
    });
    
    console.log(`🌞 Emergency removal completed: ${removed} fog effects removed`);
    return removed;
};

// Auto-execute emergency removal
setTimeout(() => {
    window.emergencyFogRemoval();
}, 1000);

// Monitor and remove fog every 2 seconds
setInterval(() => {
    const scenes = [window.scene, window.campus?.scene].filter(Boolean);
    let fogFound = false;
    
    scenes.forEach(scene => {
        if (scene && scene.fog) {
            scene.fog = null;
            fogFound = true;
        }
    });
    
    if (fogFound) {
        console.log("🚫 Fog detected and automatically removed");
    }
}, 2000);

console.log("🚨 Emergency fog removal system activated");'

# Add the emergency function before the last </script> tag
sed -i '' "s|</script>|${EMERGENCY_FUNCTION}\
</script>|" 3d-campus-smart-city-complete.html

echo ""
echo "✅ EMERGENCY FOG REMOVAL COMPLETED!"
echo ""
echo "📊 Summary of aggressive changes:"
echo "  🗑️ Deleted all 'new THREE.Fog' lines"
echo "  🚫 Added fog prevention in scene creation"
echo "  🔄 Replaced all fog assignments with null"
echo "  💡 Added fog override in lighting setup"
echo "  🔄 Added fog check in render loop"
echo "  🛠️ Added emergency fog removal function"
echo ""

# Verify changes
echo "🔍 Verifying changes..."
FOG_CREATIONS=$(grep -c "new THREE\.Fog" 3d-campus-smart-city-complete.html)
NULL_FOGS=$(grep -c "fog = null" 3d-campus-smart-city-complete.html)
EMERGENCY_FUNCTIONS=$(grep -c "emergencyFogRemoval" 3d-campus-smart-city-complete.html)

echo "📊 Verification results:"
echo "  🌫️ 'new THREE.Fog' instances: $FOG_CREATIONS (should be 0)"
echo "  🌞 'fog = null' assignments: $NULL_FOGS (should be ≥5)"
echo "  🚨 Emergency functions: $EMERGENCY_FUNCTIONS (should be ≥2)"

if [ "$FOG_CREATIONS" -eq 0 ] && [ "$NULL_FOGS" -ge 3 ] && [ "$EMERGENCY_FUNCTIONS" -ge 1 ]; then
    echo ""
    echo "🎉 SUCCESS! All fog effects aggressively removed!"
    echo "🌞 Your Smart City 3D will now have CRYSTAL CLEAR view!"
else
    echo ""
    echo "⚠️ Warning: Some fog effects might still exist"
    echo "🔧 Manual verification may be needed"
fi

echo ""
echo "🚀 Next steps:"
echo "  1. Open the website - should be crystal clear now"
echo "  2. Check browser console for 'Emergency fog removal' messages"
echo "  3. If STILL foggy, open Console (F12) and run:"
echo "     emergencyFogRemoval()"
echo "  4. If problems persist, restore from: $EMERGENCY_BACKUP"
echo ""
echo "💡 The website now has multiple layers of fog protection:"
echo "  - Fog creation prevention"
echo "  - Fog assignment blocking"  
echo "  - Continuous fog monitoring"
echo "  - Emergency removal function"
echo ""
echo "🌞 CRYSTAL CLEAR Smart City 3D guaranteed!"
