
#!/bin/bash

echo "=== 3D FILES AUDIT REPORT ==="
echo "Generated on: $(date)"
echo ""

echo "1. SCANNING FOR 3D MODEL FILES..."
echo "=================================="
find . -name "*.gltf" -o -name "*.glb" -o -name "*.fbx" -o -name "*.obj" -o -name "*.blend" -o -name "*.3ds" 2>/dev/null | while read file; do
    if [[ -f "$file" ]]; then
        echo "📂 FOUND: $file"
        ls -la "$file" 2>/dev/null || echo "   Unable to get file details"
        echo "   Size: $(stat -f%z "$file" 2>/dev/null || echo "Unknown") bytes"
        echo "   Modified: $(stat -f%Sm "$file" 2>/dev/null || echo "Unknown")"
        echo ""
    fi
done

echo ""
echo "2. CHECKING MODEL DIRECTORY CONTENTS..."
echo "======================================="
if [[ -d "./models" ]]; then
    echo "📁 Models directory exists:"
    ls -la ./models/
else
    echo "❌ No 'models' directory found"
fi

echo ""
echo "3. SEARCHING FOR 3D REFERENCES IN CODE..."
echo "========================================="
echo "Files referencing GLTF/GLB:"
grep -r -l "\\.gltf\|\\.glb" . --include="*.html" --include="*.js" --include="*.css" 2>/dev/null | head -20

echo ""
echo "Files referencing GLTFLoader:"
grep -r -l "GLTFLoader" . --include="*.html" --include="*.js" 2>/dev/null | head -20

echo ""
echo "Files referencing models/ directory:"
grep -r -l "models/" . --include="*.html" --include="*.js" 2>/dev/null | head -20

echo ""
echo "4. CHECKING FOR BACKUP/ALTERNATIVE VERSIONS..."
echo "=============================================="
find . -name "*backup*" -o -name "*old*" -o -name "*new*" -o -name "*version*" 2>/dev/null | grep -i model

echo ""
echo "5. LATEST MODIFIED FILES ANALYSIS..."
echo "==================================="
echo "Most recently modified HTML files with 3D references:"
grep -r -l "three\|gltf\|3d" . --include="*.html" 2>/dev/null | xargs ls -lt 2>/dev/null | head -10

echo ""
echo "Most recently modified JS files with 3D references:"
grep -r -l "three\|gltf\|3d" . --include="*.js" 2>/dev/null | xargs ls -lt 2>/dev/null | head -10

echo ""
echo "=== END OF AUDIT REPORT ==="