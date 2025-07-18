#!/bin/bash

# 🧹 CLEANUP DEBUG - Remove emergency debug styling after confirmation

echo "🧹 CLEANUP DEBUG STYLING"
echo "========================"

# Remove emergency-debug class from HTML
echo "Removing debug class from index.html..."
sed -i '' 's/location-map fade-in emergency-debug/location-map fade-in/g' index.html

echo "✅ Debug class removed from main website"

# Optional: Comment out debug CSS rules
echo "Would you like to disable debug CSS rules? (y/n)"
read -r response

if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    # Comment out debug rules in emergency CSS
    sed -i '' 's/.location-map.emergency-debug/\/\* .location-map.emergency-debug/g' emergency-map-recovery.css
    sed -i '' 's/.location-map.emergency-debug::before/\*\/ \/\* .location-map.emergency-debug::before/g' emergency-map-recovery.css
    sed -i '' '/z-index: 9999;/a\
*/' emergency-map-recovery.css
    
    echo "✅ Debug CSS rules commented out"
else
    echo "ℹ️  Debug CSS rules kept active (can be removed manually later)"
fi

echo ""
echo "🎯 CLEANUP COMPLETE!"
echo "==================="
echo "✅ Emergency debug styling removed"
echo "✅ Map should now display cleanly"
echo "✅ Ready for production use"
echo ""
echo "Next steps:"
echo "- Test the website one more time"
echo "- Commit changes if everything works"
echo "- Consider removing temporary CSS files when stable"