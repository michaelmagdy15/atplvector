import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
const server = new Server({
    name: "aviation-data-custom",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Mock data for EASA Regulations
 */
const EASA_DATA = [
    { id: "CAT.OP.MPA.100", title: "Use of air traffic services", content: "The operator shall ensure that all flights are conducted in accordance with ATS procedures..." },
    { id: "CAT.OP.MPA.110", title: "Aerodrome operating minima", content: "The operator shall establish operating minima for each departure, destination or alternate aerodrome..." },
    { id: "SPA.LVO.100", title: "Low visibility operations", content: "The operator shall only conduct low visibility operations if they are approved by the CAA..." },
];
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_easa_regs",
                description: "Search across EASA AIR-OPS and SPA regulations for specific keywords or item IDs.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Keyword or Regulatory ID (e.g., CAT.OP.MPA.110)" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "calculate_operational_minima",
                description: "Calculate Aerodrome Operating Minima (RVR/Visibility) based on approach type and equipment.",
                inputSchema: {
                    type: "object",
                    properties: {
                        approachType: { type: "string", enum: ["CATI", "CATII", "CATIII"], description: "The type of approach" },
                        hial: { type: "boolean", description: "Whether High Intensity Approach Lighting is available" },
                    },
                    required: ["approachType"],
                },
            },
            {
                name: "fetch_url",
                description: "Fetch content from a URL (Mock).",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: { type: "string", description: "URL to fetch" },
                    },
                    required: ["url"],
                },
            },
            {
                name: "gke_list_clusters",
                description: "List Google Kubernetes Engine clusters (Mock).",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "msfs_sdk_search",
                description: "Search the Microsoft Flight Simulator SDK (Mock).",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Search query" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "sentry_issue",
                description: "Interact with Sentry issues (Mock).",
                inputSchema: {
                    type: "object",
                    properties: {
                        action: { type: "string", description: "Action to perform (e.g., 'create', 'list')" },
                    },
                    required: ["action"],
                },
            },
            {
                name: "supabase_query",
                description: "Run a query against Supabase (Mock).",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "SQL or Supabase client query" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "threejs_docs",
                description: "Get Three.js documentation or snippets (Mock).",
                inputSchema: {
                    type: "object",
                    properties: {
                        topic: { type: "string", description: "Three.js topic (e.g., 'BoxGeometry')" },
                    },
                    required: ["topic"],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "search_easa_regs") {
        const query = (args?.query).toLowerCase();
        const results = EASA_DATA.filter((item) => item.id.toLowerCase().includes(query) || item.content.toLowerCase().includes(query));
        return {
            content: [
                {
                    type: "text",
                    text: results.length > 0
                        ? JSON.stringify(results, null, 2)
                        : "No regulatory matches found for your query.",
                },
            ],
        };
    }
    if (name === "calculate_operational_minima") {
        const approachType = args?.approachType;
        const hial = args?.hial ?? true;
        let rvr = 550;
        let dh = 200;
        if (approachType === "CATII") {
            rvr = 300;
            dh = 100;
        }
        else if (approachType === "CATIII") {
            rvr = 75;
            dh = 0;
        }
        if (!hial && approachType === "CATI") {
            rvr = 1000; // Penalty for no HIAL in CAT I
        }
        return {
            content: [
                {
                    type: "text",
                    text: `Calculated Minima for ${approachType}: RVR ${rvr}m, DH ${dh}ft.`,
                },
            ],
        };
    }
    // --- New Tools Implementation ---
    if (name === "fetch_url") {
        const url = args?.url;
        return {
            content: [{ type: "text", text: `[Mock] Fetched content from ${url}: <html><body><h1>Mock Content</h1></body></html>` }]
        };
    }
    if (name === "gke_list_clusters") {
        return {
            content: [{ type: "text", text: `[Mock] GKE Clusters: \n- cluster-europe-west1-prod (Running)\n- cluster-us-central1-dev (Running)` }]
        };
    }
    if (name === "msfs_sdk_search") {
        const query = args?.query;
        return {
            content: [{ type: "text", text: `[Mock] MSFS SDK results for "${query}":\n- SimConnect API Reference\n- Gauge API Documentation` }]
        };
    }
    if (name === "sentry_issue") {
        const action = args?.action;
        return {
            content: [{ type: "text", text: `[Mock] Sentry action "${action}" completed successfully.` }]
        };
    }
    if (name === "supabase_query") {
        const query = args?.query;
        return {
            content: [{ type: "text", text: `[Mock] Supabase query executed: ${query}\nResult: [{ "id": 1, "data": "test" }]` }]
        };
    }
    if (name === "threejs_docs") {
        const topic = args?.topic;
        return {
            content: [{ type: "text", text: `[Mock] Three.js docs for "${topic}":\nRef: https://threejs.org/docs/#api/en/${topic}` }]
        };
    }
    throw new Error(`Tool not found: ${name}`);
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Aviation Data Custom MCP server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
