#!/bin/bash

# Direct file opening - Master Plan 3D
echo "🏗️  OPENING MASTER PLAN 3D - PROFESSIONAL ARCHITECTURE"
echo "======================================================"

FILE_URL="file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/archive-3d/ai-campus-3d-structure.html"

echo "🎯 Target File: ai-campus-3d-structure.html"
echo "📁 Location: /archive-3d/"
echo "🔧 Architecture: Master Plan 3D Professional"
echo ""

# Check if file exists
if [ -f "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/archive-3d/ai-campus-3d-structure.html" ]; then
    echo "✅ File exists"
else
    echo "❌ File not found!"
    exit 1
fi

# Check if master plan JS exists
if [ -f "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/js/master-plan-3d.js" ]; then
    echo "✅ Master Plan 3D script exists"
else
    echo "❌ js/master-plan-3d.js not found!"
fi

echo ""
echo "🌐 Opening in default browser..."

# Open file directly
open "$FILE_URL"

echo "✅ Browser opened!"
echo ""
echo "🔍 EXPECTED RESULTS:"
echo "   1. Professional loading screen"
echo "   2. Console message: '🚀 Initializing Master Plan 3D...'"
echo "   3. Timeline controls (Phase 1, 2, 3)"
echo "   4. Camera view buttons"
echo "   5. FPS indicator"
echo "   6. 3D campus with multiple buildings"
echo ""
echo "🛠️  IF PROBLEMS:"
echo "   - Check Console (F12) for errors"
echo "   - Verify js/master-plan-3d.js loads"
echo "   - Try HTTP server version instead"
echo ""
echo "🎉 ENJOY YOUR PROFESSIONAL 3D CAMPUS!"

# Keep terminal open
read -p "Press Enter to close..."