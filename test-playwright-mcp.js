#!/usr/bin/env node

// Simple test script to demonstrate Playwright MCP capabilities
// This script will test the HEART website authentication system

const { spawn } = require('child_process');
const readline = require('readline');

console.log('🎭 HEART Website - Playwright MCP Test');
console.log('=====================================');

// Test data
const testCommands = [
    // Initialize MCP connection
    {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "heart-test-client",
                version: "1.0.0"
            }
        }
    },
    // Navigate to website
    {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "browser_action",
            arguments: {
                action: "navigate",
                url: "http://localhost:3000"
            }
        }
    },
    // Take screenshot
    {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call", 
        params: {
            name: "browser_action",
            arguments: {
                action: "screenshot"
            }
        }
    },
    // Click login button
    {
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: {
            name: "browser_action", 
            arguments: {
                action: "click",
                selector: "text=Login"
            }
        }
    }
];

function runMCPTest() {
    console.log('🚀 Starting MCP Playwright server...');
    console.log('📝 Testing HEART website authentication...\n');
    
    const mcpProcess = spawn('npx', ['@playwright/mcp@latest'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseCount = 0;
    
    mcpProcess.stdout.on('data', (data) => {
        const response = data.toString().trim();
        if (response) {
            console.log(`📨 Response ${++responseCount}:`, response);
        }
    });

    mcpProcess.stderr.on('data', (data) => {
        console.log('❌ Error:', data.toString());
    });

    // Send test commands with delays
    testCommands.forEach((command, index) => {
        setTimeout(() => {
            console.log(`📤 Sending command ${index + 1}:`, JSON.stringify(command, null, 2));
            mcpProcess.stdin.write(JSON.stringify(command) + '\n');
        }, index * 2000);
    });

    // Clean exit after tests
    setTimeout(() => {
        console.log('\n✅ Test completed. Closing MCP server...');
        mcpProcess.kill();
        process.exit(0);
    }, testCommands.length * 2000 + 3000);
}

// Check if HEART website is running first
const http = require('http');
const checkWebsite = http.get('http://localhost:3000', (res) => {
    console.log('✅ HEART website is running on http://localhost:3000\n');
    runMCPTest();
}).on('error', (err) => {
    console.log('❌ HEART website is not running!');
    console.log('   Please run: npm start');
    console.log('   Then try this test again.\n');
    process.exit(1);
});