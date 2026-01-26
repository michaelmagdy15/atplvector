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
