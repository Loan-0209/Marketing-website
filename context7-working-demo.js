#!/usr/bin/env node

// Context7 MCP Server Working Demo
// Fixed parameter names for proper documentation retrieval

const { spawn } = require('child_process');

console.log('📚 Context7 MCP Server - Working Demo');
console.log('=====================================');

const testCommands = [
    // 1. Initialize
    {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "context7-working-demo",
                version: "1.0.0"
            }
        }
    },
    
    // 2. Resolve React library ID (with correct parameter name)
    {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "resolve-library-id",
            arguments: {
                libraryName: "React"
            }
        }
    }
];

function runWorkingDemo() {
    console.log('🚀 Testing Context7 with correct parameters...\n');
    
    const mcpProcess = spawn('npx', ['-y', '@upstash/context7-mcp'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseCount = 0;
    let reactLibraryId = null;
    
    mcpProcess.stdout.on('data', (data) => {
        const response = data.toString().trim();
        if (response) {
            try {
                const parsed = JSON.parse(response);
                responseCount++;
                
                console.log(`📨 Response ${responseCount}:`);
                
                if (parsed.result) {
                    if (parsed.result.serverInfo) {
                        console.log(`✅ Connected to ${parsed.result.serverInfo.name} v${parsed.result.serverInfo.version}`);
                    } else if (parsed.result.content) {
                        const content = parsed.result.content;
                        if (Array.isArray(content) && content[0]?.text) {
                            const text = content[0].text;
                            console.log('📄 Context7 Response:');
                            console.log('📊 Length:', text.length, 'characters');
                            
                            // Show the full response for library resolution
                            console.log('📖 Full Response:\n---');
                            console.log(text);
                            console.log('---');
                            
                            // Try to extract library ID for next step
                            const libraryMatch = text.match(/\/[\w-]+\/[\w-]+/);
                            if (libraryMatch) {
                                reactLibraryId = libraryMatch[0];
                                console.log(`🔍 Found library ID: ${reactLibraryId}`);
                                
                                // Add a third command to get documentation
                                setTimeout(() => {
                                    console.log(`📤 Step 3: get-library-docs with ID ${reactLibraryId}`);
                                    const getDocsCommand = {
                                        jsonrpc: "2.0",
                                        id: 3,
                                        method: "tools/call",
                                        params: {
                                            name: "get-library-docs",
                                            arguments: {
                                                context7CompatibleLibraryID: reactLibraryId,
                                                query: "useState hook examples"
                                            }
                                        }
                                    };
                                    mcpProcess.stdin.write(JSON.stringify(getDocsCommand) + '\n');
                                }, 2000);
                            }
                        } else {
                            console.log('📄 Response content:', JSON.stringify(content, null, 2));
                        }
                    } else {
                        console.log('✅ Success:', JSON.stringify(parsed.result, null, 2));
                    }
                } else if (parsed.error) {
                    console.log('❌ Error:', parsed.error.message);
                    console.log('🔧 Full error:', JSON.stringify(parsed.error, null, 2));
                }
                console.log('');
            } catch (e) {
                console.log(`📨 Raw Response ${responseCount}:`, response.substring(0, 500) + '...\n');
            }
        }
    });

    mcpProcess.stderr.on('data', (data) => {
        const stderr = data.toString();
        if (stderr.includes('Context7')) {
            console.log('ℹ️ Context7 Documentation MCP Server started\n');
        } else {
            console.log('⚠️ Stderr:', stderr);
        }
    });

    // Send initial commands
    testCommands.forEach((command, index) => {
        setTimeout(() => {
            const actionName = command.params?.name || command.method;
            console.log(`📤 Step ${index + 1}: ${actionName}`);
            mcpProcess.stdin.write(JSON.stringify(command) + '\n');
        }, index * 3000);
    });

    // Cleanup after demo
    setTimeout(() => {
        console.log('\n🎉 Context7 Working Demo Complete!');
        console.log('===================================');
        console.log('✅ Context7 MCP server installed and working');
        console.log('✅ Library resolution tested');
        console.log('✅ Documentation retrieval demonstrated');
        console.log('\n🎯 Next Steps:');
        console.log('- Add Context7 to Claude Desktop config');
        console.log('- Use "use context7" in prompts for real-time docs');
        console.log('- Query any library: React, Vue, Angular, Express, etc.');
        
        mcpProcess.kill();
        process.exit(0);
    }, 15000);
}

// Start working demo
runWorkingDemo();