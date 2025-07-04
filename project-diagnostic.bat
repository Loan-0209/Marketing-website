@echo off
REM ====================================
REM AI CAMPUS PROJECT VERIFICATION COMMANDS
REM ====================================

echo 🎯 AI CAMPUS PROJECT DIAGNOSTIC
echo ===============================
echo Current directory:
cd
dir /b *.html *.js *.css *.json

echo.
echo 📁 Project structure:
dir /b /s /ad

REM 2. CRITICAL FILES VERIFICATION  
echo.
echo 📋 CRITICAL FILES CHECK:
if exist "master-plan.html" (
    echo ✅ master-plan.html exists
) else (
    echo ❌ Missing master-plan.html
)

if exist "realistic-city-core.js" (
    echo ✅ realistic-city-core.js exists
) else (
    echo ❌ Missing realistic-city-core.js
)

if exist "package.json" (
    echo ✅ package.json exists
) else (
    echo ❌ Missing package.json
)

REM 3. SERVER STATUS CHECK
echo.
echo 🖥️ SERVER STATUS:
curl -I http://localhost:9999 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Server running on :9999
) else (
    echo ❌ Server not running
)

curl -I http://localhost:8080 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Alt server on :8080
) else (
    echo ⚠️ No alt server
)

REM 4. ASSET ACCESSIBILITY 
echo.
echo 📡 ASSET ACCESSIBILITY:
curl -s -o nul -w "%%{http_code}" http://localhost:9999/master-plan.html 2>nul | findstr "200" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ HTML accessible
) else (
    echo ❌ HTML not accessible
)

curl -s -o nul -w "%%{http_code}" http://localhost:9999/realistic-city-core.js 2>nul | findstr "200" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ JS accessible
) else (
    echo ❌ JS not accessible
)

REM 5. MODELS & ASSETS CHECK
echo.
echo 🎮 3D MODELS ^& ASSETS:
dir /b /s *.gltf *.glb *.obj 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ No 3D model files found - using procedural generation
)

REM 6. JAVASCRIPT SYNTAX CHECK
echo.
echo 📝 JAVASCRIPT SYNTAX VALIDATION:
node -c realistic-city-core.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ JS syntax valid
) else (
    echo ❌ JS syntax errors found
)

REM 7. MCP SERVER STATUS
echo.
echo 🔧 MCP SERVER STATUS:
if exist ".vscode\settings.json" (
    echo ✅ Workspace settings exist
    findstr "mcp.enabled.*false" .vscode\settings.json >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MCP properly disabled
    ) else (
        echo ⚠️ MCP status unclear
    )
) else (
    echo ⚠️ No workspace settings
)

tasklist | findstr /i "mcp" >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️ MCP processes running
) else (
    echo ✅ No MCP processes
)

REM 8. GIT STATUS CHECK
echo.
echo 📚 VERSION CONTROL:
git status --porcelain 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ No git repository
) else (
    git log --oneline -3
)

REM 9. DEPENDENCY CHECK
echo.
echo 📦 DEPENDENCIES:
if exist "package.json" (
    npm list --depth=0 2>nul
) else (
    echo ⚠️ No npm dependencies
)

REM 10. FINAL HEALTH SCORE
echo.
echo 🏆 PROJECT HEALTH SUMMARY:
echo ==========================
echo Completed at: %TIME%
echo ===============================

pause
