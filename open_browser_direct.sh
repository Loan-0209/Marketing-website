#!/bin/bash

# Mở HEART Standalone Website
osascript -e 'tell application "Safari" to open location "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/heart_standalone.html"'

# Đợi 2 giây
sleep 2

# Mở 3D Campus Interactive
osascript -e 'tell application "Safari" to open location "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/3d-campus-interactive.html"'

echo "✅ Đã mở cả hai trang trong Safari"
echo "1. HEART Standalone Website"
echo "2. 3D Campus Interactive"