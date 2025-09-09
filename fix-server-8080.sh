#!/bin/bash
# Emergency fix for localhost:8080

echo "🚨 FIXING LOCALHOST:8080 CONNECTION..."

# Step 1: Kill any process on port 8080
echo "🔧 Step 1: Clearing port 8080..."
if lsof -i :8080 >/dev/null 2>&1; then
    echo "Found process on port 8080, killing it..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Step 2: Kill any hanging Python servers
echo "🔧 Step 2: Cleaning up Python processes..."
pkill -f "python.*http.server" 2>/dev/null || true
sleep 1

# Step 3: Change to project directory
echo "🔧 Step 3: Navigating to project..."
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18

# Step 4: Start new server
echo "🔧 Step 4: Starting fresh server on port 8080..."
echo "----------------------------------------"
echo "🌐 Server starting at: http://localhost:8080"
echo "📄 3D Smart City: http://localhost:8080/3d-smart-city.html"
echo "----------------------------------------"

# Start server
python3 -m http.server 8080