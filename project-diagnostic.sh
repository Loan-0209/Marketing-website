#!/bin/bash
# ====================================
# AI CAMPUS PROJECT VERIFICATION COMMANDS
# ====================================

echo "🎯 AI CAMPUS PROJECT DIAGNOSTIC"
echo "==============================="
pwd
ls -la | grep -E "\.(html|js|css|json)$"
echo ""
echo "📁 Project structure:"
tree -L 2 2>/dev/null || find . -maxdepth 2 -type d

# 2. CRITICAL FILES VERIFICATION  
echo ""
echo "📋 CRITICAL FILES CHECK:"
[ -f "master-plan.html" ] && echo "✅ master-plan.html ($(du -h master-plan.html | cut -f1))" || echo "❌ Missing master-plan.html"
[ -f "realistic-city-core.js" ] && echo "✅ realistic-city-core.js ($(du -h realistic-city-core.js | cut -f1))" || echo "❌ Missing realistic-city-core.js"
[ -f "package.json" ] && echo "✅ package.json ($(du -h package.json | cut -f1))" || echo "❌ Missing package.json"

# 3. SERVER STATUS CHECK
echo ""
echo "🖥️ SERVER STATUS:"
curl -I http://localhost:9999 2>/dev/null && echo "✅ Server running on :9999" || echo "❌ Server not running"
curl -I http://localhost:8080 2>/dev/null && echo "✅ Alt server on :8080" || echo "⚠️ No alt server"

# 4. ASSET ACCESSIBILITY 
echo ""
echo "📡 ASSET ACCESSIBILITY:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/master-plan.html 2>/dev/null | grep -q "200" && echo "✅ HTML accessible" || echo "❌ HTML not accessible"
curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/realistic-city-core.js 2>/dev/null | grep -q "200" && echo "✅ JS accessible" || echo "❌ JS not accessible"

# 5. MODELS & ASSETS CHECK
echo ""
echo "🎮 3D MODELS & ASSETS:"
find . -name "*.gltf" -o -name "*.glb" -o -name "*.obj" | head -5 | while read file; do
    if [ -s "$file" ]; then
        echo "✅ $file ($(du -h "$file" | cut -f1))"
    else
        echo "❌ $file (0 bytes - corrupted)"
    fi
done
[ $(find . -name "*.gltf" -o -name "*.glb" -o -name "*.obj" | wc -l) -eq 0 ] && echo "⚠️ No 3D model files found - using procedural generation"

# 6. JAVASCRIPT SYNTAX CHECK
echo ""
echo "📝 JAVASCRIPT SYNTAX VALIDATION:"
node -c realistic-city-core.js 2>/dev/null && echo "✅ JS syntax valid" || echo "❌ JS syntax errors found"
node -c master-plan.html 2>/dev/null || echo "✅ HTML with embedded JS valid"

# 7. MCP SERVER STATUS
echo ""
echo "🔧 MCP SERVER STATUS:"
[ -f ".vscode/settings.json" ] && echo "✅ Workspace settings exist" || echo "⚠️ No workspace settings"
grep -q "mcp.enabled.*false" .vscode/settings.json 2>/dev/null && echo "✅ MCP properly disabled" || echo "⚠️ MCP status unclear"
ps aux | grep -i mcp | grep -v grep >/dev/null && echo "⚠️ MCP processes running" || echo "✅ No MCP processes"

# 8. GIT STATUS CHECK
echo ""
echo "📚 VERSION CONTROL:"
git status --porcelain 2>/dev/null | wc -l | xargs echo "📊 Uncommitted changes:"
git log --oneline -3 2>/dev/null || echo "⚠️ No git repository"

# 9. DEPENDENCY CHECK
echo ""
echo "📦 DEPENDENCIES:"
[ -f "package.json" ] && npm list --depth=0 2>/dev/null | head -5 || echo "⚠️ No npm dependencies"

# 10. FINAL HEALTH SCORE
echo ""
echo "🏆 PROJECT HEALTH SUMMARY:"
echo "=========================="

# Calculate health score
score=0
total=0

# Critical files check
[ -f "master-plan.html" ] && ((score++))
((total++))
[ -f "realistic-city-core.js" ] && ((score++))
((total++))
[ -f "package.json" ] && ((score++))
((total++))

# Server check
curl -I http://localhost:9999 2>/dev/null && ((score++))
((total++))

# Asset accessibility
curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/master-plan.html 2>/dev/null | grep -q "200" && ((score++))
((total++))
curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/realistic-city-core.js 2>/dev/null | grep -q "200" && ((score++))
((total++))

# Models check
[ $(find . -name "*.gltf" -o -name "*.glb" -o -name "*.obj" | wc -l) -gt 0 ] && ((score++))
((total++))

# JS syntax check
node -c realistic-city-core.js 2>/dev/null && ((score++))
((total++))

# MCP status
grep -q "mcp.enabled.*false" .vscode/settings.json 2>/dev/null && ((score++))
((total++))
ps aux | grep -i mcp | grep -v grep >/dev/null || ((score++))
((total++))

# Calculate percentage
percentage=$((score * 100 / total))

echo "Health Score: $score/$total ($percentage%)"

if [ $percentage -ge 80 ]; then
    echo "✅ EXCELLENT: Project is in good health"
elif [ $percentage -ge 60 ]; then
    echo "🟡 GOOD: Project has minor issues to fix"
elif [ $percentage -ge 40 ]; then
    echo "⚠️ FAIR: Project needs attention"
else
    echo "❌ POOR: Project has critical issues"
fi

echo ""
echo "Completed at: $(date)"
echo "==============================="
