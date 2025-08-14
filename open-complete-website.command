#!/bin/bash

echo "🚀 OPENING HEART DATA CENTER WEBSITE"
echo "==================================="
echo ""

# Project info
echo "📊 Project: HEART - Vietnam's First 300MW AI-Optimized Data Center"
echo "🌐 Complete multi-page website with navigation"
echo ""

# Check if index.html exists
if [ -f "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html" ]; then
    echo "✅ Homepage found: index.html"
    
    # Open main website
    open "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"
    echo "✅ HEART website opened in browser!"
    
    echo ""
    echo "📊 Website Navigation:"
    echo "   🏠 Home → About Us → Master Plan → 3D Campus"
    echo "   🏗️ Facilities → Investment → Technology → News → Contact"
    
    echo ""
    echo "🏛️ Direct Links to Key Pages:"
    echo "   - 3D Campus: archive-3d/ai-campus-3d-structure.html"
    echo "   - Facilities: facilities.html"
    echo "   - About: about.html"
    echo "   - Master Plan: master-plan.html"
    
else
    echo "⚠️ Homepage not found at expected location"
    echo "Opening project dashboard instead..."
    
    if [ -f "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/project-dashboard.html" ]; then
        open "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/project-dashboard.html"
        echo "✅ Project dashboard opened!"
    else
        echo "❌ Could not find website files"
    fi
fi

echo ""
echo "🌐 For full functionality, start HTTP server:"
echo "   cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/"
echo "   python3 -m http.server 8080"
echo "   Then open: http://localhost:8080/"
echo ""
echo "Press Enter to close..."
read