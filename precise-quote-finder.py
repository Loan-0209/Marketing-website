#!/usr/bin/env python3
"""Precisely find unclosed single quote by analyzing character by character"""

def find_unclosed_quote(file_path):
    print("🎯 PRECISE QUOTE ANALYSIS")
    print("=" * 50)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        in_string = False
        string_char = None
        quote_positions = []
        
        for i, char in enumerate(content):
            if char in ["'", '"']:
                if not in_string:
                    # Starting a string
                    in_string = True
                    string_char = char
                    quote_positions.append((i, char, 'OPEN'))
                elif char == string_char:
                    # Ending the same type of string
                    in_string = False
                    string_char = None
                    quote_positions.append((i, char, 'CLOSE'))
                # If different quote type, it's inside the string, ignore
        
        # Find line numbers for positions
        lines = content.split('\n')
        char_count = 0
        line_positions = {}
        
        for line_num, line in enumerate(lines, 1):
            for char_pos in range(len(line) + 1):  # +1 for newline
                line_positions[char_count] = (line_num, char_pos)
                char_count += 1
        
        print(f"📊 QUOTE ANALYSIS:")
        print(f"   Total quotes found: {len(quote_positions)}")
        
        # Check for unclosed strings
        open_singles = [pos for pos in quote_positions if pos[1] == "'" and pos[2] == 'OPEN']
        close_singles = [pos for pos in quote_positions if pos[1] == "'" and pos[2] == 'CLOSE']
        
        print(f"   Single quotes: {len(open_singles)} opens, {len(close_singles)} closes")
        
        if len(open_singles) != len(close_singles):
            print(f"\n❌ MISMATCH FOUND!")
            print(f"   Difference: {abs(len(open_singles) - len(close_singles))}")
            
            # Show last few single quotes
            single_quotes = [pos for pos in quote_positions if pos[1] == "'"]
            print(f"\n🔍 LAST 10 SINGLE QUOTES:")
            
            for pos_info in single_quotes[-10:]:
                char_pos, quote_char, quote_type = pos_info
                if char_pos in line_positions:
                    line_num, col = line_positions[char_pos]
                    context_start = max(0, char_pos - 30)
                    context_end = min(len(content), char_pos + 30)
                    context = content[context_start:context_end].replace('\n', '\\n')
                    print(f"   Line {line_num}, Col {col}: {quote_type} - ...{context}...")
            
            # Find the unmatched quote
            if len(open_singles) > len(close_singles):
                # More opens than closes - find the last unmatched open
                print(f"\n🎯 LIKELY UNCLOSED QUOTE:")
                unmatched_open = open_singles[len(close_singles)]
                char_pos = unmatched_open[0]
                if char_pos in line_positions:
                    line_num, col = line_positions[char_pos]
                    print(f"   Position: Line {line_num}, Column {col}")
                    print(f"   Character position in file: {char_pos}")
                    
                    # Show context
                    context_start = max(0, char_pos - 50)
                    context_end = min(len(content), char_pos + 50)
                    context = content[context_start:context_end]
                    print(f"   Context: ...{context}...")
        else:
            print(f"\n✅ All single quotes are properly matched!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    find_unclosed_quote("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/3d-smart-city.html")