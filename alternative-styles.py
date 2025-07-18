#!/usr/bin/env python3
"""
Alternative Styling Options for HEART Button
"""

from pathlib import Path
import time

def create_style_options():
    """Create alternative styling options for HEART button"""
    
    print("🎨 CREATING ALTERNATIVE STYLING OPTIONS...")
    print("=" * 50)
    
    # Style Option 1: Red Heart Style
    style1_css = """
/* 🔴 STYLE 1: RED HEART STYLE */
.heart-button-relocated.style-red {
    background: linear-gradient(135deg, #E74C3C, #C0392B) !important;
    color: white !important;
}

.heart-button-relocated.style-red::before {
    content: "❤️" !important;
}

.heart-button-relocated.style-red:hover {
    background: linear-gradient(135deg, #C0392B, #A93226) !important;
}
"""
    
    # Style Option 2: Orange Tech Style  
    style2_css = """
/* 🟠 STYLE 2: ORANGE TECH STYLE */
.heart-button-relocated.style-orange {
    background: linear-gradient(135deg, #FF6B35, #E55722) !important;
    color: white !important;
}

.heart-button-relocated.style-orange::before {
    content: "⚡" !important;
}

.heart-button-relocated.style-orange:hover {
    background: linear-gradient(135deg, #E55722, #CC4A1C) !important;
}
"""
    
    # Style Option 3: Green Success Style
    style3_css = """
/* 🟢 STYLE 3: GREEN SUCCESS STYLE */
.heart-button-relocated.style-green {
    background: linear-gradient(135deg, #27AE60, #229954) !important;
    color: white !important;
}

.heart-button-relocated.style-green::before {
    content: "🌟" !important;
}

.heart-button-relocated.style-green:hover {
    background: linear-gradient(135deg, #229954, #1E8449) !important;
}
"""
    
    # Style Option 4: Purple Premium Style
    style4_css = """
/* 🟣 STYLE 4: PURPLE PREMIUM STYLE */
.heart-button-relocated.style-purple {
    background: linear-gradient(135deg, #8E44AD, #7D3C98) !important;
    color: white !important;
}

.heart-button-relocated.style-purple::before {
    content: "💎" !important;
}

.heart-button-relocated.style-purple:hover {
    background: linear-gradient(135deg, #7D3C98, #6C3483) !important;
}
"""
    
    # Style Option 5: Dark Mode Style
    style5_css = """
/* ⚫ STYLE 5: DARK MODE STYLE */
.heart-button-relocated.style-dark {
    background: linear-gradient(135deg, #2C3E50, #34495E) !important;
    color: #ECF0F1 !important;
    border: 2px solid #BDC3C7 !important;
}

.heart-button-relocated.style-dark::before {
    content: "🏢" !important;
}

.heart-button-relocated.style-dark:hover {
    background: linear-gradient(135deg, #34495E, #2C3E50) !important;
    border-color: #ECF0F1 !important;
}
"""
    
    # Write style options to files
    Path('style1-red.css').write_text(style1_css, encoding='utf-8')
    Path('style2-orange.css').write_text(style2_css, encoding='utf-8')
    Path('style3-green.css').write_text(style3_css, encoding='utf-8')
    Path('style4-purple.css').write_text(style4_css, encoding='utf-8')
    Path('style5-dark.css').write_text(style5_css, encoding='utf-8')
    
    print("✅ STYLING OPTIONS CREATED:")
    print("📁 style1-red.css - Red heart style")
    print("📁 style2-orange.css - Orange tech style")
    print("📁 style3-green.css - Green success style")
    print("📁 style4-purple.css - Purple premium style")
    print("📁 style5-dark.css - Dark mode style")
    print()
    print("🎨 STYLE PREVIEWS:")
    print("1️⃣ Red: ❤️ HEART (Red gradient)")
    print("2️⃣ Orange: ⚡ HEART (Orange tech)")
    print("3️⃣ Green: 🌟 HEART (Green success)")
    print("4️⃣ Purple: 💎 HEART (Purple premium)")
    print("5️⃣ Dark: 🏢 HEART (Dark professional)")

def apply_style(style_number):
    """Apply specific style to HEART button"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    style_files = {
        1: 'style1-red.css',
        2: 'style2-orange.css',
        3: 'style3-green.css', 
        4: 'style4-purple.css',
        5: 'style5-dark.css'
    }
    
    style_classes = {
        1: 'style-red',
        2: 'style-orange',
        3: 'style-green',
        4: 'style-purple', 
        5: 'style-dark'
    }
    
    if style_number not in style_files:
        print("❌ Invalid style number!")
        return False
    
    style_file = Path(style_files[style_number])
    
    if not style_file.exists():
        print(f"❌ {style_file} not found!")
        return False
    
    # Read files
    html_content = index_file.read_text(encoding='utf-8')
    css_content = style_file.read_text(encoding='utf-8')
    
    # Create backup
    timestamp = int(time.time())
    backup_file = f'index.html.style{style_number}-backup-{timestamp}'
    Path(backup_file).write_text(html_content, encoding='utf-8')
    
    # Insert CSS before closing style tag
    if '</style>' in html_content:
        html_content = html_content.replace('</style>', f'\n{css_content}\n</style>')
        
        # Update JavaScript to add style class
        style_class = style_classes[style_number]
        html_content = html_content.replace(
            "heartButton.className = 'heart-button-relocated';",
            f"heartButton.className = 'heart-button-relocated {style_class}';"
        )
        
        # Write updated content
        index_file.write_text(html_content, encoding='utf-8')
        
        print(f"✅ STYLE {style_number} APPLIED!")
        print(f"📁 Backup created: {backup_file}")
        print(f"🎨 Style: {style_files[style_number].replace('.css', '').replace('style', 'Style ')}")
        
        return True
    else:
        print("❌ Could not find </style> tag")
        return False

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) == 2:
        try:
            style_num = int(sys.argv[1])
            if 1 <= style_num <= 5:
                # Create options first if they don't exist
                create_style_options()
                # Apply the style
                apply_style(style_num)
            else:
                print("❌ Style number must be between 1 and 5")
        except ValueError:
            print("❌ Please provide a valid style number")
    else:
        # Show available options
        create_style_options()
        print()
        print("🎯 TO APPLY A STYLE:")
        print("python3 alternative-styles.py 1  # Red heart")
        print("python3 alternative-styles.py 2  # Orange tech") 
        print("python3 alternative-styles.py 3  # Green success")
        print("python3 alternative-styles.py 4  # Purple premium")
        print("python3 alternative-styles.py 5  # Dark professional")
