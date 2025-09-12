// Disable Blinking Effects in External System Files
// This script patches the external system files to remove blinking effects

const fs = require('fs');
const path = require('path');

const systemFiles = [
    'ai-intelligence-simulation-system.js',
    'holographic-display-system.js',
    'led-system.js',
    'quantum-computing-effects-system.js'
];

console.log('🚫 Disabling blinking effects in system files...');

systemFiles.forEach(filename => {
    const filepath = path.join(__dirname, filename);
    
    if (!fs.existsSync(filepath)) {
        console.log(`⚠️ File not found: ${filename}`);
        return;
    }
    
    try {
        let content = fs.readFileSync(filepath, 'utf8');
        let modified = false;
        
        // Replace blinking patterns with static values
        const replacements = [
            // LED System blinking patterns
            {
                pattern: /Math\.sin\(time \* [^)]+\) \* [^;]+/g,
                replacement: '0.5',
                description: 'LED sine wave blinking → static 0.5'
            },
            
            // Opacity pulsing patterns  
            {
                pattern: /opacity = [^;]*Math\.sin[^;]+;/g,
                replacement: 'opacity = 0.8;',
                description: 'Opacity pulsing → static 0.8'
            },
            
            // Emissive intensity pulsing
            {
                pattern: /emissiveIntensity = [^;]*Math\.sin[^;]+;/g,
                replacement: 'emissiveIntensity = 0.5;',
                description: 'Emissive pulsing → static 0.5'
            },
            
            // Random visibility flickering
            {
                pattern: /if \(Math\.random\(\) < [^}]+visible[^}]+}/g,
                replacement: '// Blinking disabled',
                description: 'Random visibility flickering → disabled'
            },
            
            // Timeout-based flashing
            {
                pattern: /setTimeout\([^}]+emissiveIntensity[^}]+\}/g,
                replacement: '// Flash effect disabled',
                description: 'Timeout flashing → disabled'
            },
            
            // HSL color cycling
            {
                pattern: /setHSL\([^)]*time[^)]*\)/g,
                replacement: 'setHSL(0.5, 1, 0.5)',
                description: 'Color cycling → static cyan'
            }
        ];
        
        replacements.forEach(({pattern, replacement, description}) => {
            const originalContent = content;
            content = content.replace(pattern, replacement);
            if (content !== originalContent) {
                console.log(`  ✅ ${filename}: ${description}`);
                modified = true;
            }
        });
        
        // Write back the modified file
        if (modified) {
            const backupPath = filepath + '.blinking-backup';
            fs.writeFileSync(backupPath, fs.readFileSync(filepath));
            fs.writeFileSync(filepath, content);
            console.log(`  📁 ${filename}: Backed up and modified`);
        } else {
            console.log(`  ℹ️ ${filename}: No blinking patterns found`);
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
});

console.log('🎉 Blinking removal process complete!');
console.log('💡 Original files backed up with .blinking-backup extension');