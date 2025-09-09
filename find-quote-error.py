#!/usr/bin/env python3
"""Find unclosed single quotes in JavaScript file"""

def find_quote_errors(file_path):
    print("🔍 SEARCHING FOR UNCLOSED SINGLE QUOTES")
    print("=" * 50)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        total_quotes = 0
        line_quotes = []
        
        for line_num, line in enumerate(lines, 1):
            # Count single quotes in this line
            quotes_in_line = line.count("'")
            total_quotes += quotes_in_line
            
            if quotes_in_line > 0:
                line_quotes.append((line_num, quotes_in_line, line.strip()))
        
        print(f"📊 ANALYSIS RESULTS:")
        print(f"   Total single quotes: {total_quotes}")
        print(f"   Is odd (unclosed): {'YES' if total_quotes % 2 == 1 else 'NO'}")
        
        if total_quotes % 2 == 1:
            print(f"\n❌ FOUND UNCLOSED QUOTE!")
            print(f"   Lines with single quotes:")
            
            # Look for suspicious patterns
            for line_num, count, content in line_quotes[-20:]:  # Last 20 lines with quotes
                odd_marker = " ⚠️ ODD" if count % 2 == 1 else ""
                print(f"   Line {line_num}: {count} quotes{odd_marker}")
                if "console.log" in content or "'" in content:
                    print(f"      Content: {content[:100]}...")
                    
            # Check last few lines specifically
            print(f"\n🔍 FOCUSING ON END OF FILE:")
            for line_num, count, content in line_quotes[-5:]:
                print(f"   Line {line_num}: {content}")
        else:
            print(f"\n✅ All single quotes are properly closed")
            
    except Exception as e:
        print(f"❌ Error reading file: {e}")

if __name__ == "__main__":
    find_quote_errors("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/3d-smart-city.html")