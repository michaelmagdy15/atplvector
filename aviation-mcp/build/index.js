import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root is two levels up from src/index.ts
const PROJECT_ROOT = path.resolve(__dirname, "../../");
const server = new Server({
    name: "easa-regulation-ai",
    version: "2.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * List of regulation files present in the project root
 */
const REGULATION_FILES = [
    "040_Easy-Access-Rules-for-Aircrew-Regulation-EU-No-1178_2011-—-Revision-from-February-2022_extracted.txt",
    "062_Easy-Access-Rules-for-Aircrew-Regulation-EU-No-1178_2011-—-Revision-from-February-2022_extracted.txt",
    "ATPLSYLLABUS_extracted.txt",
    "pof081_extracted.txt"
];
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_easa_regulations",
                description: "Deep search through EASA Air-Ops, Part-FCL, and ATPL Syllabus text files for specific regulatory requirements or learning objectives.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Keyword, Syllabus ID (e.g. 040.01.03), or Regulatory item (e.g. CAT.OP.MPA.110)"
                        },
                        contextLines: {
                            type: "number",
                            description: "Number of lines of context to provide around matches (default 5)",
                            default: 5
                        }
                    },
                    required: ["query"],
                },
            },
            {
                name: "calculate_operational_minima",
                description: "Calculate Aerodrome Operating Minima (RVR/Visibility) based on approach type and equipment according to EASA SPA.LVO standards.",
                inputSchema: {
                    type: "object",
                    properties: {
                        approachType: { type: "string", enum: ["NPA", "CATI", "CATII", "CATIII"], description: "The type of approach" },
                        hial: { type: "boolean", description: "Whether High Intensity Approach Lighting is available" },
                        reportingRVR: { type: "boolean", description: "Whether RVR is reported or converted from visibility" }
                    },
                    required: ["approachType"],
                },
            }
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "search_easa_regulations") {
        const query = (args?.query).toLowerCase();
        const contextLines = args?.contextLines || 5;
        const results = [];
        for (const filename of REGULATION_FILES) {
            try {
                const filePath = path.join(PROJECT_ROOT, filename);
                const content = await fs.readFile(filePath, "utf-8");
                const lines = content.split("\n");
                lines.forEach((line, index) => {
                    if (line.toLowerCase().includes(query)) {
                        const start = Math.max(0, index - contextLines);
                        const end = Math.min(lines.length, index + contextLines + 1);
                        const snippet = lines.slice(start, end).join("\n");
                        results.push(`--- MATCH IN ${filename} (Line ${index + 1}) ---\n${snippet}\n`);
                    }
                });
            }
            catch (err) {
                console.error(`Error reading ${filename}:`, err);
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: results.length > 0
                        ? results.slice(0, 10).join("\n") + (results.length > 10 ? `\n... Total ${results.length} matches found.` : "")
                        : "No regulatory matches found for your query in the local EASA documentation.",
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
        else if (approachType === "NPA") {
            rvr = 800;
            dh = 250;
        }
        if (!hial && approachType === "CATI") {
            rvr = 1000; // Penalty for no HIAL in CAT I
        }
        return {
            content: [
                {
                    type: "text",
                    text: `[EASA SPA.LVO Verification] Calculated Minima for ${approachType}: RVR ${rvr}m, DH ${dh}ft. (Note: Performance-based values may vary by aircraft certification).`,
                },
            ],
        };
    }
    throw new Error(`Tool not found: ${name}`);
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("EASA Regulation AI MCP server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
