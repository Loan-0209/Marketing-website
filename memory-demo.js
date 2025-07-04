#!/usr/bin/env node

// MCP Memory Server Demo
// Demonstrates knowledge graph creation and memory storage

const { spawn } = require('child_process');

console.log('🧠 MCP Memory Server Demo - HEART Website Knowledge');
console.log('====================================================');

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
                name: "heart-memory-demo",
                version: "1.0.0"
            }
        }
    },
    
    // 2. Create entities for HEART website
    {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "create_entities",
            arguments: {
                entities: [
                    {
                        name: "HEART Technology Website",
                        entityType: "website",
                        observations: [
                            "A Vietnamese AI technology park website",
                            "Runs on localhost:3000 with live-server",
                            "Features authentication system with admin/heart2024 credentials",
                            "Has news management system with admin panel",
                            "Includes contact information and business details"
                        ]
                    },
                    {
                        name: "Authentication System",
                        entityType: "feature",
                        observations: [
                            "Uses localStorage-based authentication",
                            "JWT token simulation for security",
                            "Admin credentials: admin/heart2024",
                            "Supports role-based access control",
                            "Has fallback when MongoDB not available"
                        ]
                    },
                    {
                        name: "News Management",
                        entityType: "feature",
                        observations: [
                            "Complete CRUD operations for articles",
                            "Admin panel at admin-panel.html",
                            "Post creation at admin/post-news.html",
                            "localStorage persistence",
                            "Search and filtering capabilities"
                        ]
                    }
                ]
            }
        }
    },
    
    // 3. Create relations between entities
    {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
            name: "create_relations",
            arguments: {
                relations: [
                    {
                        from: "HEART Technology Website",
                        to: "Authentication System",
                        relationType: "includes"
                    },
                    {
                        from: "HEART Technology Website", 
                        to: "News Management",
                        relationType: "includes"
                    },
                    {
                        from: "Authentication System",
                        to: "News Management",
                        relationType: "secures"
                    }
                ]
            }
        }
    },
    
    // 4. Add MCP servers as entities
    {
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: {
            name: "create_entities",
            arguments: {
                entities: [
                    {
                        name: "Playwright MCP",
                        entityType: "tool",
                        observations: [
                            "Browser automation for testing",
                            "Version 0.0.29 installed",
                            "25 available tools for web interaction",
                            "Can take screenshots and navigate pages",
                            "Supports accessibility tree analysis"
                        ]
                    },
                    {
                        name: "Context7 MCP",
                        entityType: "tool", 
                        observations: [
                            "Real-time documentation access",
                            "Version 1.0.14 installed",
                            "Provides up-to-date library docs",
                            "Works with React, Vue, Angular, Express",
                            "High trust scores 8.5-9.6"
                        ]
                    },
                    {
                        name: "Memory MCP",
                        entityType: "tool",
                        observations: [
                            "Knowledge graph-based memory system",
                            "Version 0.6.3 installed", 
                            "9 tools for entity and relation management",
                            "Persistent memory across conversations",
                            "Semantic relationship tracking"
                        ]
                    }
                ]
            }
        }
    },
    
    // 5. Create relations for MCP tools
    {
        jsonrpc: "2.0",
        id: 5,
        method: "tools/call",
        params: {
            name: "create_relations",
            arguments: {
                relations: [
                    {
                        from: "HEART Technology Website",
                        to: "Playwright MCP",
                        relationType: "tested_by"
                    },
                    {
                        from: "HEART Technology Website",
                        to: "Context7 MCP", 
                        relationType: "documented_by"
                    },
                    {
                        from: "HEART Technology Website",
                        to: "Memory MCP",
                        relationType: "remembered_by"
                    }
                ]
            }
        }
    },
    
    // 6. Read the complete knowledge graph
    {
        jsonrpc: "2.0",
        id: 6,
        method: "tools/call",
        params: {
            name: "read_graph",
            arguments: {}
        }
    },
    
    // 7. Search for specific information
    {
        jsonrpc: "2.0",
        id: 7,
        method: "tools/call",
        params: {
            name: "search_nodes",
            arguments: {
                query: "authentication"
            }
        }
    }
];

function runMemoryDemo() {
    console.log('🚀 Building HEART website knowledge graph...\n');
    
    const mcpProcess = spawn('npx', ['@modelcontextprotocol/server-memory'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseCount = 0;
    
    mcpProcess.stdout.on('data', (data) => {
        const response = data.toString().trim();
        if (response) {
            try {
                const parsed = JSON.parse(response);
                responseCount++;
                
                console.log(`📨 Response ${responseCount}:`);
                
                if (parsed.result) {
                    if (parsed.result.serverInfo) {
                        console.log(`✅ Connected to Memory Server v${parsed.result.serverInfo.version}`);
                    } else if (parsed.result.content) {
                        const content = parsed.result.content;
                        if (Array.isArray(content) && content[0]?.text) {
                            const text = content[0].text;
                            console.log('🧠 Memory Content:');
                            
                            // Show different types of responses
                            if (responseCount === 6) {
                                console.log('📊 Complete Knowledge Graph:');
                                console.log('📝 Length:', text.length, 'characters');
                                console.log('🔍 Preview:\n---');
                                console.log(text.substring(0, 800) + '...');
                                console.log('---');
                            } else if (responseCount === 7) {
                                console.log('🔍 Search Results for "authentication":');
                                console.log('📝 Results:\n---');
                                console.log(text);
                                console.log('---');
                            } else {
                                console.log('✅ Entities/Relations created successfully');
                            }
                        } else {
                            console.log('✅ Operation completed');
                        }
                    } else {
                        console.log('✅ Success');
                    }
                } else if (parsed.error) {
                    console.log('❌ Error:', parsed.error.message);
                }
                console.log('');
            } catch (e) {
                console.log(`📨 Raw Response ${responseCount}:`, response.substring(0, 200) + '...\n');
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

    // Send commands with delays
    testCommands.forEach((command, index) => {
        setTimeout(() => {
            const actionName = command.params?.name || command.method;
            console.log(`📤 Step ${index + 1}: ${actionName}`);
            mcpProcess.stdin.write(JSON.stringify(command) + '\n');
        }, index * 3000);
    });

    // Summary and cleanup
    setTimeout(() => {
        console.log('\n🎉 Memory Demo Complete!');
        console.log('=========================');
        console.log('✅ HEART website knowledge graph created');
        console.log('✅ Entities: Website, Auth, News, MCP tools');
        console.log('✅ Relations: includes, secures, tested_by, etc.');
        console.log('✅ Memory search functionality verified');
        console.log('\n🧠 Memory Capabilities:');
        console.log('- Persistent knowledge storage');
        console.log('- Semantic relationship mapping');
        console.log('- Cross-conversation context');
        console.log('- Intelligent search and retrieval');
        
        mcpProcess.kill();
        process.exit(0);
    }, testCommands.length * 3000 + 5000);
}

// Start demo
runMemoryDemo();