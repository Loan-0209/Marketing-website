#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🔍 Checking available MCP Playwright tools...\n');

const mcpProcess = spawn('npx', ['@playwright/mcp@latest'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

const commands = [
    // Initialize
    {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "tool-checker",
                version: "1.0.0"
            }
        }
    },
    // List available tools
    {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {}
    }
];

let responseCount = 0;

mcpProcess.stdout.on('data', (data) => {
    const response = data.toString().trim();
    if (response) {
        try {
            const parsed = JSON.parse(response);
            console.log(`📨 Response ${++responseCount}:`);
            console.log(JSON.stringify(parsed, null, 2));
            console.log('\n');
            
            // If this is the tools list response, show available tools
            if (parsed.result && parsed.result.tools) {
                console.log('🛠️ Available Tools:');
                parsed.result.tools.forEach(tool => {
                    console.log(`   - ${tool.name}: ${tool.description || 'No description'}`);
                });
                console.log('\n');
            }
        } catch (e) {
            console.log(`📨 Raw Response ${++responseCount}:`, response);
        }
    }
});

mcpProcess.stderr.on('data', (data) => {
    console.log('❌ Error:', data.toString());
});

// Send commands
commands.forEach((command, index) => {
    setTimeout(() => {
        console.log(`📤 Sending: ${command.method}`);
        mcpProcess.stdin.write(JSON.stringify(command) + '\n');
    }, index * 1000);
});

// Exit after a few seconds
setTimeout(() => {
    mcpProcess.kill();
    process.exit(0);
}, 5000);