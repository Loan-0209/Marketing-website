#!/bin/bash

echo "🔧 HEART Technology Park - DEBUG & FIX"
echo "======================================="

# Navigate to project directory
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/

echo "📁 Current directory: $(pwd)"
echo ""

echo "🔍 STEP 1: Running comprehensive debug check..."
python3 DEBUG_CHECK.py

echo ""
echo "🚀 STEP 2: Attempting to start minimal server..."
python3 MINIMAL_SERVER.py

echo ""
echo "Debug session complete. Press Enter to close..."
read