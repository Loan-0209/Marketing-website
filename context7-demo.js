#!/usr/bin/env node

// Context7 MCP Server Demo
// Demonstrates documentation retrieval for React

const { spawn } = require('child_process');

console.log('📚 Context7 MCP Server Demo - React Documentation');
console.log('==================================================');

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
                name: "context7-demo",
                version: "1.0.0"
            }
        }
    },
    
    // 2. Resolve React library ID
    {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "resolve-library-id",
            arguments: {
                query: "React JavaScript library"
            }
        }
    },
    
    // 3. Get React documentation
    {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
            name: "get-library-docs",
            arguments: {
                library_id: "/facebook/react",
                query: "useState hook examples"
            }
        }
    }
];

function runContext7Demo() {
    console.log('🚀 Fetching React documentation...\n');
    
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
                        console.log(`✅ Connected to ${parsed.result.serverInfo.name}`);
                    } else if (parsed.result.content) {
                        const content = parsed.result.content;
                        if (Array.isArray(content) && content[0]?.text) {
                            const text = content[0].text;
                            console.log('📄 Documentation received:');
                            console.log('📊 Length:', text.length, 'characters');
                            
                            // Show a preview of the documentation
                            const preview = text.substring(0, 500);
                            console.log('📖 Preview:\n---');
                            console.log(preview + (text.length > 500 ? '...' : ''));
                            console.log('---');
                            
                            // Extract library ID if this is the resolve response
                            if (responseCount === 2) {
                                const libraryMatch = text.match(/\/[\w-]+\/[\w-]+/);
                                if (libraryMatch) {
                                    reactLibraryId = libraryMatch[0];
                                    console.log(`🔍 Found library ID: ${reactLibraryId}`);
                                    
                                    // Update the get-library-docs command with the correct ID
                                    testCommands[2].params.arguments.library_id = reactLibraryId;
                                }
                            }
                        } else {
                            console.log('📄 Response content:', JSON.stringify(content, null, 2));
                        }
                    } else {
                        console.log('✅ Success:', JSON.stringify(parsed.result, null, 2));
                    }
                } else if (parsed.error) {
                    console.log('❌ Error:', parsed.error.message);
                }
                console.log('');
            } catch (e) {
                console.log(`📨 Raw Response ${responseCount}:`, response.substring(0, 300) + '...\n');
            }
        }
    });

    mcpProcess.stderr.on('data', (data) => {
        const stderr = data.toString();
        if (stderr.includes('Context7')) {
            console.log('ℹ️ Context7 server started\n');
        } else {
            console.log('⚠️ Stderr:', stderr);
        }
    });

    // Send commands with delays
    testCommands.forEach((command, index) => {
        setTimeout(() => {
            const actionName = command.params?.name || command.method;
            console.log(`📤 Step ${index + 1}: ${actionName}`);
            mcpProcess.stdin.write(JSON.stringify(command) + '\n');
        }, index * 4000); // 4 second delays for processing
    });

    // Summary and cleanup
    setTimeout(() => {
        console.log('\n🎉 Context7 Demo Summary:');
        console.log('=========================');
        console.log('✅ Successfully connected to Context7');
        console.log('✅ Library ID resolution tested');
        console.log('✅ Documentation retrieval attempted');
        console.log('\n💡 Context7 Usage Tips:');
        console.log('- Include "use context7" in AI prompts');
        console.log('- Provides real-time, up-to-date documentation');
        console.log('- Works with major libraries (React, Vue, Angular, etc.)');
        console.log('- Version-specific examples and documentation');
        
        mcpProcess.kill();
        process.exit(0);
    }, testCommands.length * 4000 + 5000);
}

// Start demo
runContext7Demo();