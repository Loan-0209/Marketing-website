const fs = require('fs');

// Read the HTML file
const content = fs.readFileSync('3d-smart-city.html', 'utf-8');

// Extract JavaScript from script tags
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
let combinedJS = '';
let scriptCount = 0;

while ((match = scriptRegex.exec(content)) !== null) {
    scriptCount++;
    combinedJS += '\n// SCRIPT BLOCK ' + scriptCount + '\n';
    combinedJS += match[1];
}

// Try to parse the JavaScript
try {
    // Use Function constructor to check syntax
    new Function(combinedJS);
    console.log('✅ JavaScript syntax is valid!');
} catch (error) {
    console.error('❌ Syntax error found:');
    console.error('Error:', error.message);
    
    // Try to get more specific location
    const errorMatch = error.message.match(/at position (\d+)/);
    if (errorMatch) {
        const position = parseInt(errorMatch[1]);
        const lines = combinedJS.substring(0, position).split('\n');
        console.error('Approximate line in combined JS:', lines.length);
        console.error('Context:', combinedJS.substring(position - 50, position + 50));
    }
}

// Also check for common issues
console.log('\n🔍 Additional checks:');

// Check for console statements
const consoleCount = (combinedJS.match(/console\./g) || []).length;
console.log(`Console statements: ${consoleCount}`);

// Check for arrow functions
const arrowCount = (combinedJS.match(/=>/g) || []).length;
console.log(`Arrow functions: ${arrowCount}`);

// Check for template literals
const templateCount = (combinedJS.match(/`/g) || []).length;
console.log(`Template literal backticks: ${templateCount} (should be even)`);

// Check for specific patterns that might cause issues
const patterns = [
    { regex: /}\s*\)}\s*;/, desc: 'Double closing braces with semicolon' },
    { regex: /{\s*}/, desc: 'Empty object literals' },
    { regex: /\[\s*\]/, desc: 'Empty array literals' },
    { regex: /=>\s*{[^}]*$/, desc: 'Unclosed arrow function' }
];

patterns.forEach(({ regex, desc }) => {
    const matches = combinedJS.match(regex);
    if (matches) {
        console.log(`Found ${matches.length} instances of: ${desc}`);
    }
});