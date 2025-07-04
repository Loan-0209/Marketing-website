#!/usr/bin/env node

// Context7 MCP Server Test
// Tests the documentation retrieval capabilities

const { spawn } = require('child_process');

console.log('📚 Context7 MCP Server Test');
console.log('============================');

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
                name: "context7-tester",
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
    
    // 3. Test documentation search (React example)
    {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
            name: "search_docs",
            arguments: {
                query: "React useState hook",
                library: "react"
            }
        }
    }
];

function runContext7Test() {
    console.log('🚀 Starting Context7 MCP server test...\n');
    
    const mcpProcess = spawn('npx', ['-y', '@upstash/context7-mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseCount = 0;
    
    mcpProcess.stdout.on('data', (data) => {
        const response = data.toString().trim();
        if (response) {
            try {
                const parsed = JSON.parse(response);
                console.log(`📨 Response ${++responseCount}:`);
                
                // Pretty print important responses
                if (parsed.result) {
                    if (parsed.result.serverInfo) {
                        console.log(`✅ Connected to ${parsed.result.serverInfo.name} v${parsed.result.serverInfo.version}`);
                    } else if (parsed.result.tools) {
                        console.log('🛠️ Available tools:');
                        parsed.result.tools.forEach(tool => {
                            console.log(`   - ${tool.name}: ${tool.description || 'No description'}`);
                        });
                    } else if (parsed.result.content) {
                        console.log('📄 Documentation content received');
                        console.log('📊 Content length:', JSON.stringify(parsed.result.content).length, 'characters');
                    } else {
                        console.log('✅ Success');
                    }
                } else if (parsed.error) {
                    console.log('❌ Error:', parsed.error.message);
                }
                console.log('');
            } catch (e) {
                console.log(`📨 Raw Response ${++responseCount}:`, response.substring(0, 200) + '...');
            }
        }
    });

    mcpProcess.stderr.on('data', (data) => {
        console.log('⚠️ Stderr:', data.toString());
    });

    // Send test commands with delays
    testCommands.forEach((command, index) => {
        setTimeout(() => {
            const actionName = command.params?.name || command.method;
            console.log(`📤 Step ${index + 1}: ${actionName}`);
            mcpProcess.stdin.write(JSON.stringify(command) + '\n');
        }, index * 3000);
    });

    // Summary and cleanup
    setTimeout(() => {
        console.log('\n🎉 Context7 Test Summary:');
        console.log('=========================');
        console.log('✅ Context7 MCP server connection tested');
        console.log('✅ Available tools queried');
        console.log('✅ Documentation search attempted');
        console.log('\n📚 Context7 provides real-time documentation access!');
        console.log('💡 Use "use context7" in prompts to fetch latest docs');
        
        mcpProcess.kill();
        process.exit(0);
    }, testCommands.length * 3000 + 3000);
}

// Start the test
runContext7Test();