#!/bin/bash

# 🚨 MAP RECOVERY SCRIPT - Emergency Fix Implementation
# Run this script to test and finalize the map recovery

echo "🚨 MAP RECOVERY EMERGENCY PROTOCOL"
echo "=================================="

# Step 1: Verify files exist
echo "Step 1: Checking recovery files..."
if [ -f "emergency-map-recovery.css" ]; then
    echo "✅ Emergency CSS loaded"
else
    echo "❌ Emergency CSS missing!"
    exit 1
fi

if [ -f "test-map-recovery.html" ]; then
    echo "✅ Test page available"
else
    echo "❌ Test page missing!"
    exit 1
fi

# Step 2: Start server if not running
echo "Step 2: Starting server..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "🚀 Starting cache server..."
    python3 maintenance.py server 3000 > /dev/null 2>&1 &
    sleep 3
else
    echo "✅ Server already running"
fi

# Step 3: Open test pages
echo "Step 3: Opening test pages..."
echo "🔗 Opening main website..."
open "http://localhost:3000"

echo "🔗 Opening recovery test page..."
open "http://localhost:3000/test-map-recovery.html"

# Step 4: Run diagnostics
echo "Step 4: Running diagnostics..."
python3 maintenance.py test

echo ""
echo "📋 TESTING CHECKLIST:"
echo "====================="
echo "1. ✅ Check main website - map should be visible with green debug border"
echo "2. ✅ Check test page - both maps should load properly"
echo "3. ✅ Scroll test - maps should stay visible during scroll"
echo "4. ✅ Responsive test - resize browser window"
echo "5. ✅ Performance test - check for layout shifts"
echo ""

echo "🎯 NEXT STEPS:"
echo "=============="
echo "If maps are working:"
echo "  → Run: ./cleanup-debug.sh (removes debug styling)"
echo "  → Commit changes when satisfied"
echo ""
echo "If maps still broken:"
echo "  → Check browser console for errors"
echo "  → Try force refresh (Cmd+Shift+R)"
echo "  → Check assets/images/ folder for map files"
echo "  → Contact support with error details"
echo ""

echo "📞 Emergency completed! Maps should now be visible."