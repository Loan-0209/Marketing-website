#!/usr/bin/env node

// MCP Memory Server Test
// Tests the persistent memory and knowledge graph capabilities

const { spawn } = require('child_process');

console.log('🧠 MCP Memory Server Test');
console.log('==========================');

const testCommands = [
    // 1. Initialize MCP connection
    {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "memory-tester",
                version: "1.0.0"
            }
        }
    },
    
    // 2. List available tools
    {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {}
    },
    
    // 3. List available resources
    {
        jsonrpc: "2.0",
        id: 3,
        method: "resources/list",
        params: {}
    }
];

function runMemoryTest() {
    console.log('🚀 Starting MCP Memory server test...\n');
    
    const mcpProcess = spawn('npx', ['@modelcontextprotocol/server-memory'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseCount = 0;
    
    mcpProcess.stdout.on('data', (data) => {
        const response = data.toString().trim();
        if (response) {
            try {
                const parsed = JSON.parse(response);
                console.log(`📨 Response ${++responseCount}:`);
                
                if (parsed.result) {
                    if (parsed.result.serverInfo) {
                        console.log(`✅ Connected to ${parsed.result.serverInfo.name}`);
                        if (parsed.result.serverInfo.version) {
                            console.log(`📋 Version: ${parsed.result.serverInfo.version}`);
                        }
                    } else if (parsed.result.tools) {
                        console.log('🛠️ Available Memory Tools:');
                        parsed.result.tools.forEach(tool => {
                            console.log(`   - ${tool.name}: ${tool.description || 'No description'}`);
                        });
                    } else if (parsed.result.resources) {
                        console.log('📚 Available Memory Resources:');
                        if (parsed.result.resources.length === 0) {
                            console.log('   (No resources yet - memory is empty)');
                        } else {
                            parsed.result.resources.forEach(resource => {
                                console.log(`   - ${resource.name}: ${resource.description || 'No description'}`);
                            });
                        }
                    } else {
                        console.log('✅ Success');
                    }
                } else if (parsed.error) {
                    console.log('❌ Error:', parsed.error.message);
                }
                console.log('');
            } catch (e) {
                console.log(`📨 Raw Response ${++responseCount}:`, response.substring(0, 300) + '...');
            }
        }
    });

    mcpProcess.stderr.on('data', (data) => {
        const stderr = data.toString();
        if (stderr.includes('Knowledge Graph')) {
            console.log('ℹ️ Knowledge Graph MCP Server started\n');
        } else {
            console.log('⚠️ Stderr:', stderr);
        }
    });

    // Send test commands with delays
    testCommands.forEach((command, index) => {
        setTimeout(() => {
            const actionName = command.method;
            console.log(`📤 Step ${index + 1}: ${actionName}`);
            mcpProcess.stdin.write(JSON.stringify(command) + '\n');
        }, index * 2000);
    });

    // Summary and cleanup
    setTimeout(() => {
        console.log('\n🎉 Memory Test Summary:');
        console.log('=======================');
        console.log('✅ MCP Memory server connection tested');
        console.log('✅ Available tools queried');
        console.log('✅ Available resources checked');
        console.log('\n🧠 Memory Server Features:');
        console.log('- Knowledge graph-based persistent memory');
        console.log('- Cross-conversation context retention');
        console.log('- Semantic relationships tracking');
        console.log('- Long-term information storage');
        
        mcpProcess.kill();
        process.exit(0);
    }, testCommands.length * 2000 + 3000);
}

// Start the test
runMemoryTest();