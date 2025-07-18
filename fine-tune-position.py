#!/usr/bin/env python3
"""
Fine-tune HEART Button Position - Adjust positioning if needed
"""

import re
from pathlib import Path
import sys

def fine_tune_position(left_percent=None, top_percent=None):
    """Fine-tune HEART button position with custom percentages"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    print("🔧 FINE-TUNING HEART BUTTON POSITION...")
    print("=" * 50)
    
    # Read current content
    html_content = index_file.read_text(encoding='utf-8')
    
    # Default values if not provided
    if left_percent is None:
        left_percent = 35  # Default 35%
    if top_percent is None:
        top_percent = 45   # Default 45%
    
    print(f"📍 New position: {left_percent}% from left, {top_percent}% from top")
    
    # Update CSS positioning
    # Find and replace the positioning values
    updated_content = html_content
    
    # Update left position
    updated_content = re.sub(
        r'left: \d+% !important;',
        f'left: {left_percent}% !important;',
        updated_content
    )
    
    # Update top position  
    updated_content = re.sub(
        r'top: \d+% !important;',
        f'top: {top_percent}% !important;',
        updated_content
    )
    
    # Also update JavaScript positioning
    updated_content = re.sub(
        r'const relativeX = 0\.\d+;',
        f'const relativeX = {left_percent/100};',
        updated_content
    )
    
    updated_content = re.sub(
        r'const relativeY = 0\.\d+;',
        f'const relativeY = {top_percent/100};',
        updated_content
    )
    
    # Write updated content
    index_file.write_text(updated_content, encoding='utf-8')
    
    print("✅ POSITION UPDATED!")
    print(f"📍 Left: {left_percent}%")
    print(f"📍 Top: {top_percent}%")
    print()
    print("🔄 Refresh browser để thấy thay đổi")
    
    return True

def provide_position_options():
    """Provide common position options"""
    
    print("🎯 COMMON POSITION PRESETS:")
    print("=" * 40)
    print()
    print("1️⃣ CENTER-LEFT (Default):")
    print("   Left: 35%, Top: 45%")
    print("   python3 fine-tune-position.py 35 45")
    print()
    print("2️⃣ UPPER-CENTER:")
    print("   Left: 40%, Top: 35%")
    print("   python3 fine-tune-position.py 40 35")
    print()
    print("3️⃣ LOWER-LEFT:")
    print("   Left: 30%, Top: 55%")
    print("   python3 fine-tune-position.py 30 55")
    print()
    print("4️⃣ CENTER-CENTER:")
    print("   Left: 45%, Top: 50%")
    print("   python3 fine-tune-position.py 45 50")
    print()
    print("5️⃣ CUSTOM POSITION:")
    print("   python3 fine-tune-position.py [LEFT%] [TOP%]")
    print("   Example: python3 fine-tune-position.py 38 42")
    print()
    print("📏 COORDINATE REFERENCE:")
    print("   • Left: 0% = Far left, 100% = Far right")
    print("   • Top: 0% = Top edge, 100% = Bottom edge") 
    print("   • Hue Hi Tech Park area: roughly 30-40% left, 40-50% top")
    print()
    print("💡 TIPS:")
    print("   • Start with small adjustments (±5%)")
    print("   • Test on different screen sizes")
    print("   • Check positioning relative to map landmarks")

if __name__ == "__main__":
    # Check command line arguments
    if len(sys.argv) == 3:
        try:
            left = int(sys.argv[1])
            top = int(sys.argv[2])
            
            if 0 <= left <= 100 and 0 <= top <= 100:
                fine_tune_position(left, top)
            else:
                print("❌ Percentages must be between 0 and 100")
        except ValueError:
            print("❌ Please provide valid numbers")
            provide_position_options()
    elif len(sys.argv) == 1:
        # No arguments, show options
        provide_position_options()
    else:
        print("❌ Usage: python3 fine-tune-position.py [LEFT%] [TOP%]")
        provide_position_options()
