#!/bin/bash

echo "🎯 PHÂN TÍCH VÀ RECOMMENDATION 3D FILES"
echo "======================================="

# Find all GLTF files and analyze
echo "📁 SCANNING FOR 3D MODEL FILES..."
gltf_files=$(find . -name "*.gltf" 2>/dev/null)
glb_files=$(find . -name "*.glb" 2>/dev/null)

if [ -n "$gltf_files" ]; then
    echo "✅ GLTF Files found:"
    for file in $gltf_files; do
        size=$(wc -c < "$file" 2>/dev/null || echo "0")
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        modified=$(date -r "$file" 2>/dev/null || echo "Unknown")
        
        echo "  📄 $file"
        echo "     Size: $(du -h "$file" 2>/dev/null | cut -f1 || echo "0B")"
        echo "     Lines: $lines"
        echo "     Modified: $modified"
        
        # Check for complexity indicators in GLTF
        meshes=$(grep -o '"meshes"' "$file" 2>/dev/null | wc -l || echo "0")
        materials=$(grep -o '"materials"' "$file" 2>/dev/null | wc -l || echo "0")
        nodes=$(grep -o '"nodes"' "$file" 2>/dev/null | wc -l || echo "0")
        
        echo "     Meshes: $meshes, Materials: $materials, Nodes: $nodes"
        echo "     ---"
    done
else
    echo "❌ No GLTF files found"
fi

if [ -n "$glb_files" ]; then
    echo "✅ GLB Files found:"
    for file in $glb_files; do
        echo "  📦 $file (Binary format)"
        echo "     Size: $(du -h "$file" 2>/dev/null | cut -f1 || echo "0B")"
        echo "     ---"
    done
else
    echo "❌ No GLB files found"
fi

echo ""
echo "📄 SCANNING FOR 3D JAVASCRIPT FILES..."

# Find JavaScript files with 3D content
js_3d_files=""
for file in $(find . -name "*.js" 2>/dev/null | grep -v node_modules | head -20); do
    if [ -f "$file" ]; then
        # Check for 3D-related keywords
        three_count=$(grep -c "THREE\." "$file" 2>/dev/null || echo "0")
        gltf_count=$(grep -c -i "gltf\|GLTFLoader" "$file" 2>/dev/null || echo "0")
        campus_count=$(grep -c -i "campus\|building" "$file" 2>/dev/null || echo "0")
        
        total_3d_score=$((three_count + gltf_count * 2 + campus_count))
        
        if [ $total_3d_score -gt 5 ]; then
            echo "🎮 $file"
            echo "   THREE.js usage: $three_count"
            echo "   GLTF references: $gltf_count"
            echo "   Campus content: $campus_count"
            echo "   3D Score: $total_3d_score"
            echo "   Size: $(du -h "$file" 2>/dev/null | cut -f1 || echo "0B")"
            echo "   Lines: $(wc -l < "$file" 2>/dev/null || echo "0")"
            echo "   Modified: $(date -r "$file" 2>/dev/null || echo "Unknown")"
            echo "   ---"
            
            js_3d_files="$js_3d_files $file:$total_3d_score"
        fi
    fi
done

echo ""
echo "🏆 RECOMMENDATIONS:"
echo "==================="

# Find best JavaScript file
best_js=""
best_score=0
for entry in $js_3d_files; do
    file=$(echo "$entry" | cut -d':' -f1)
    score=$(echo "$entry" | cut -d':' -f2)
    if [ $score -gt $best_score ]; then
        best_score=$score
        best_js=$file
    fi
done

if [ -n "$best_js" ]; then
    echo "🥇 BEST JAVASCRIPT 3D IMPLEMENTATION:"
    echo "   File: $best_js"
    echo "   Score: $best_score"
    echo "   Size: $(du -h "$best_js" 2>/dev/null | cut -f1 || echo "0B")"
    echo ""
    echo "🔧 TO USE THIS IMPLEMENTATION:"
    echo "   Include this file in your HTML: <script src=\"$best_js\"></script>"
else
    echo "❌ No high-quality JavaScript 3D implementations found"
fi

# Recommend best GLTF if available
if [ -n "$gltf_files" ]; then
    # Find largest GLTF (likely most complex)
    largest_gltf=""
    largest_size=0
    for file in $gltf_files; do
        size=$(wc -c < "$file" 2>/dev/null || echo "0")
        if [ $size -gt $largest_size ]; then
            largest_size=$size
            largest_gltf=$file
        fi
    done
    
    echo "🥈 BEST 3D MODEL FILE:"
    echo "   File: $largest_gltf"
    echo "   Size: $(du -h "$largest_gltf" 2>/dev/null | cut -f1 || echo "0B")"
    echo ""
    echo "🔧 TO USE THIS MODEL:"
    echo "   Update loader path: const modelPath = '$largest_gltf';"
fi

echo ""
echo "💡 OVERALL STRATEGY:"
echo "   1. Use the best JavaScript implementation for your 3D engine"
echo "   2. Load the available 3D model as content"
echo "   3. Implement fallback procedural generation if model fails"
echo "   4. Consider creating more detailed 3D models for better visuals"

echo ""
echo "🔍 FOR DETAILED ANALYSIS, RUN:"
echo "   python3 analyze_3d_files.py"