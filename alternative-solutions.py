#!/usr/bin/env python3
"""
Alternative Solutions for Map Cropping Issue
"""

from pathlib import Path
import time

def create_alternative_solutions():
    """Create alternative CSS solutions for map cropping"""
    
    print("🎯 CREATING ALTERNATIVE SOLUTIONS FOR MAP CROPPING")
    print("=" * 60)
    
    # Solution 1: Full Width Map
    solution1_css = """
/* 🌊 SOLUTION 1: FULL WIDTH MAP - Maximum Display */
.location-map.fullwidth-solution {
    grid-column: 1 / -1 !important;
    width: 100% !important;
    aspect-ratio: 2.5/1 !important; /* Ultra wide */
    max-height: 80vh !important;
    margin: 3rem 0 !important;
    position: static !important;
}

.location-grid.fullwidth-layout {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto auto auto !important;
    gap: 2rem !important;
}

.location-grid.fullwidth-layout .location-content {
    grid-row: 1 !important;
}

.location-grid.fullwidth-layout .location-map {
    grid-row: 2 !important;
}
"""
    
    # Solution 2: Tall Map Layout
    solution2_css = """
/* 📏 SOLUTION 2: TALL MAP LAYOUT - Show More Vertical Content */
.location-map.tall-solution {
    aspect-ratio: 1.2/1 !important; /* Taller ratio */
    max-height: 90vh !important;
    min-height: 700px !important;
}

.map-image.tall-solution {
    object-fit: contain !important; /* Show full image */
    object-position: center !important;
}
"""
    
    # Solution 3: Adaptive Height
    solution3_css = """
/* 🔄 SOLUTION 3: ADAPTIVE HEIGHT - Smart Viewport Usage */
.location-map.adaptive-solution {
    height: 80vh !important;
    max-height: none !important;
    aspect-ratio: unset !important;
}

.map-image.adaptive-solution {
    object-fit: cover !important;
    object-position: center 30% !important; /* Show more bottom content */
}
"""
    
    # Write solutions to files
    Path('solution1-fullwidth.css').write_text(solution1_css, encoding='utf-8')
    Path('solution2-tall.css').write_text(solution2_css, encoding='utf-8')
    Path('solution3-adaptive.css').write_text(solution3_css, encoding='utf-8')
    
    print("✅ ALTERNATIVE SOLUTIONS CREATED:")
    print("📁 solution1-fullwidth.css - Full width layout")
    print("📁 solution2-tall.css - Taller aspect ratio") 
    print("📁 solution3-adaptive.css - Adaptive height")
    print()
    print("🎯 USAGE INSTRUCTIONS:")
    print("If current fix doesn't fully resolve cropping:")
    print("1. Try Solution 1 for maximum map display")
    print("2. Try Solution 2 for showing more vertical content")
    print("3. Try Solution 3 for adaptive viewport usage")

def apply_solution(solution_number):
    """Apply specific solution based on user choice"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    solution_files = {
        1: 'solution1-fullwidth.css',
        2: 'solution2-tall.css', 
        3: 'solution3-adaptive.css'
    }
    
    if solution_number not in solution_files:
        print("❌ Invalid solution number!")
        return False
    
    solution_file = Path(solution_files[solution_number])
    
    if not solution_file.exists():
        print(f"❌ {solution_file} not found!")
        return False
    
    # Read files
    html_content = index_file.read_text(encoding='utf-8')
    css_content = solution_file.read_text(encoding='utf-8')
    
    # Create backup
    timestamp = int(time.time())
    backup_file = f'index.html.solution{solution_number}-backup-{timestamp}'
    Path(backup_file).write_text(html_content, encoding='utf-8')
    
    # Insert CSS before closing style tag
    if '</style>' in html_content:
        html_content = html_content.replace('</style>', f'\n{css_content}\n</style>')
        
        # Write updated content
        index_file.write_text(html_content, encoding='utf-8')
        
        print(f"✅ SOLUTION {solution_number} APPLIED!")
        print(f"📁 Backup created: {backup_file}")
        
        return True
    else:
        print("❌ Could not find </style> tag")
        return False

if __name__ == "__main__":
    create_alternative_solutions()
    print()
    print("🎯 TO APPLY A SOLUTION:")
    print("python3 alternative-solutions.py 1  # Full width")
    print("python3 alternative-solutions.py 2  # Tall layout") 
    print("python3 alternative-solutions.py 3  # Adaptive height")
