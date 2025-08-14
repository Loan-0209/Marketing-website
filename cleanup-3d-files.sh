#!/bin/bash

# 3D Smart City Cleanup Script
# This script will safely remove duplicate/broken 3D Smart City files
# Keeping only: 3d-campus-smart-city-fixed.html

echo "🧹 3D Smart City Cleanup Script"
echo "========================================"
echo ""
echo "📋 Working File to KEEP:"
echo "  ✅ 3d-campus-smart-city-fixed.html (54KB)"
echo ""
echo "📋 Files to DELETE (24 files):"
echo ""

# List of files to delete
files_to_delete=(
    "3d-campus-emergency-working.html"
    "3d-campus-fixed.html"
    "3d-campus-interactive.html"
    "3d-campus-restored.html"
    "3d-campus-smart-city-backup-old.html"
    "3d-campus-smart-city-backup.html"
    "3d-campus-smart-city-complete.html"
    "3d-campus-smart-city-complex.html"
    "3d-campus-smart-city-old.html"
    "3d-campus-smart-city.html"
    "3d-campus-with-navigation.html"
    "3d-campus-working.html"
    "basic-ai-campus-3d.html"
    "daytime-ai-campus-3d.html"
    "emergency-smart-city-fix.html"
    "enhanced-ai-campus-3d-fixed.html"
    "enhanced-ai-campus-3d.html"
    "fix-3d-campus-now.html"
    "force-smart-city-debug.html"
    "integrated-city.html"
    "minimal-ai-campus-3d.html"
    "perfect-ai-campus-3d.html"
    "perfect-daytime-ai-campus-3d.html"
    "simple-3d-test.html"
    "simple-ai-campus-3d.html"
    "simple-ai-campus.html"
    "simple-city.html"
    "verify-grid-campus.html"
)

# Display files to delete with sizes
for file in "${files_to_delete[@]}"; do
    if [ -f "$file" ]; then
        size=$(ls -lh "$file" | awk '{print $5}')
        echo "  ❌ $file ($size)"
    fi
done

echo ""
echo "💾 Backup Information:"
echo "  - Location: backup-3d-cleanup-20250812_105057/"
echo "  - Archive: backup-3d-cleanup-20250812_105057.tar.gz (181KB)"
echo "  - Contains: 25 files"
echo ""
echo "⚠️  WARNING: This will move 24 files to trash!"
echo ""
read -p "Do you want to proceed with cleanup? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cleanup cancelled by user"
    exit 0
fi

echo ""
echo "🚀 Starting cleanup..."
echo ""

# Create archive directory for deleted files
archive_dir="deleted-3d-files-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$archive_dir"

# Move files to archive (safer than immediate deletion)
moved_count=0
for file in "${files_to_delete[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" "$archive_dir/"
        echo "  ✓ Moved: $file"
        ((moved_count++))
    fi
done

echo ""
echo "✅ Cleanup Complete!"
echo "  - Files moved: $moved_count"
echo "  - Archive location: $archive_dir/"
echo "  - Working file preserved: 3d-campus-smart-city-fixed.html"
echo ""
echo "🔄 To UNDO this operation, run:"
echo "  mv $archive_dir/* ."
echo ""
echo "🗑️  To permanently delete archived files:"
echo "  rm -rf $archive_dir/"
echo ""