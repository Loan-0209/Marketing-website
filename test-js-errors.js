#!/usr/bin/env node

/**
 * JavaScript Error Detector for 3D Smart City
 * This script checks for common JS errors that could cause "Error response"
 */

const fs = require('fs');
const path = require('path');

const filePath = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/3d-campus-smart-city.html';

console.log('🔍 Checking JavaScript errors in 3D Smart City file...');

try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract JavaScript content between <script> tags
    const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    
    if (!scriptMatches) {
        console.log('❌ No JavaScript found in file');
        process.exit(1);
    }
    
    let jsCode = '';
    scriptMatches.forEach((script, index) => {
        // Remove <script> tags and extract content
        const jsContent = script.replace(/<\/?script[^>]*>/gi, '');
        jsCode += `\n// ===== SCRIPT BLOCK ${index + 1} =====\n${jsContent}\n`;
    });
    
    // Common error patterns to check
    const errorPatterns = [
        { pattern: /\bundefined\s*\(/g, message: 'Calling undefined function' },
        { pattern: /\.\s*undefined/g, message: 'Accessing undefined property' },
        { pattern: /\bnull\s*\(/g, message: 'Calling null function' },
        { pattern: /\.\s*null/g, message: 'Accessing null property' },
        { pattern: /\bthrow\s+new\s+Error/g, message: 'Explicit error throwing' },
        { pattern: /console\.error/g, message: 'Console error logging' },
        { pattern: /catch\s*\([^)]*\)\s*\{[^}]*\}/g, message: 'Error handling blocks' },
        { pattern: /\btypeof\s+\w+\s*===\s*['"]undefined['"]/g, message: 'Undefined checks' },
        { pattern: /\bif\s*\(\s*!\w+\)/g, message: 'Falsy checks' }
    ];
    
    console.log('\n📊 JavaScript Analysis Results:');
    console.log('================================');
    
    let totalIssues = 0;
    let lineNumber = 1;
    
    // Split by lines to get line numbers
    const lines = jsCode.split('\n');
    
    errorPatterns.forEach(({ pattern, message }) => {
        const matches = jsCode.match(pattern);
        if (matches) {
            console.log(`⚠️  ${message}: ${matches.length} occurrences`);
            totalIssues += matches.length;
            
            // Show first few matches with line numbers
            matches.slice(0, 3).forEach(match => {
                const lineIndex = lines.findIndex(line => line.includes(match));
                if (lineIndex !== -1) {
                    console.log(`   Line ~${lineIndex + 1}: ${match.trim()}`);
                }
            });
        }
    });
    
    // Check for specific problematic patterns
    console.log('\n🔍 Specific Checks:');
    console.log('==================');
    
    // Check for THREE.js usage
    const threeUsage = jsCode.match(/THREE\./g);
    console.log(`✅ THREE.js references: ${threeUsage ? threeUsage.length : 0}`);
    
    // Check for async/await
    const asyncUsage = jsCode.match(/async|await/g);
    console.log(`✅ Async/await usage: ${asyncUsage ? asyncUsage.length : 0}`);
    
    // Check for DOM element access
    const domAccess = jsCode.match(/document\.|getElementById|querySelector/g);
    console.log(`✅ DOM access patterns: ${domAccess ? domAccess.length : 0}`);
    
    // Check for undefined function calls
    const functionCalls = jsCode.match(/\w+\s*\(/g);
    console.log(`✅ Function calls found: ${functionCalls ? functionCalls.length : 0}`);
    
    // Check for missing semicolons (common cause)
    const missingSemicolons = jsCode.match(/\n\s*[^;}\s][^;]*[^;}\s]\s*\n/g);
    if (missingSemicolons && missingSemicolons.length > 0) {
        console.log(`⚠️  Potential missing semicolons: ${missingSemicolons.length}`);
    }
    
    // Check for console usage
    const consoleUsage = jsCode.match(/console\.\w+/g);
    console.log(`✅ Console statements: ${consoleUsage ? consoleUsage.length : 0}`);
    
    console.log('\n🎯 Summary:');
    console.log('===========');
    console.log(`Total potential issues: ${totalIssues}`);
    console.log(`JavaScript lines: ${lines.length}`);
    console.log(`File size: ${Math.round(content.length / 1024)} KB`);
    
    if (totalIssues === 0) {
        console.log('✅ No major JavaScript issues detected!');
    } else if (totalIssues < 10) {
        console.log('⚠️  Some issues found, but likely manageable');
    } else {
        console.log('❌ Multiple issues detected, may need attention');
    }
    
    console.log('\n💡 Recommendations:');
    console.log('===================');
    console.log('1. Open browser console (F12) to see actual runtime errors');
    console.log('2. Check Network tab for failed resource loading');
    console.log('3. Verify Three.js CDN is loading properly');
    console.log('4. Test WebGL support in browser');
    
} catch (error) {
    console.error('❌ Error analyzing file:', error.message);
    process.exit(1);
}