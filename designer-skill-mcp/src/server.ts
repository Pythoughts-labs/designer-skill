// Builds the designer-skill MCP server: resources, guidance tools, and a
// `design` prompt. Transport-agnostic. No API key required.
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getSkillRouter,
  getReferenceDoc,
  isReferenceName,
  REFERENCE_NAMES,
  REFERENCE_DESCRIPTIONS,
  type ReferenceName,
} from "./skill.js";
import { dispatchIntent } from "./dispatch.js";
import { listCommands, formatCommandHelp, getCommandReads } from "./commands.js";
import { loadProjectContext, formatProjectContext } from "./context.js";
import { detectAntipatterns, formatDetectionResults } from "./detect.js";
import { getPaletteSeed } from "./palette.js";

export const SERVER_NAME = "designer-skill-mcp";
export const SERVER_VERSION = "0.9.0";

export function createServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  // ---- Resources -----------------------------------------------------------
  server.registerResource(
    "designer-skill",
    "designer://skill",
    {
      title: "designer-skill (router)",
      description: "SKILL.md — the entry point: session preflight, precedence rule, routing map, ship gate.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: getSkillRouter() }],
    }),
  );

  server.registerResource(
    "designer-reference",
    new ResourceTemplate("designer://reference/{name}", {
      list: async () => ({
        resources: REFERENCE_NAMES.map((name) => ({
          uri: `designer://reference/${name}`,
          name,
          description: REFERENCE_DESCRIPTIONS[name],
          mimeType: "text/markdown",
        })),
      }),
    }),
    {
      title: "designer-skill reference",
      description: "One of the thirteen designer-skill reference files.",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const name = String(variables.name);
      if (!isReferenceName(name)) {
        throw new Error(`Unknown reference "${name}". Valid: ${REFERENCE_NAMES.join(", ")}.`);
      }
      return {
        contents: [{ uri: uri.href, mimeType: "text/markdown", text: getReferenceDoc(name) }],
      };
    },
  );

  // ---- Tools ---------------------------------------------------------------
  server.registerTool(
    "get_design_system",
    {
      title: "Get the designer-skill router",
      description:
        "Call this FIRST on skill load. Returns the designer-skill SKILL.md router (session preflight, MCP bootstrap, precedence rule, routing map, ship gate). After loading, call dispatch_intent with the user's request, then get_reference for the recommended files.",
    },
    async () => ({ content: [{ type: "text", text: getSkillRouter() }] }),
  );

  server.registerTool(
    "get_reference",
    {
      title: "Get a designer-skill reference file",
      description: `Returns the full text of one designer-skill reference file. Valid names: ${REFERENCE_NAMES.join(", ")}.`,
      inputSchema: { name: z.enum(REFERENCE_NAMES) },
    },
    async ({ name }) => ({ content: [{ type: "text", text: getReferenceDoc(name as ReferenceName) }] }),
  );

  server.registerTool(
    "dispatch_intent",
    {
      title: "Map a UI request to design moves + files to read",
      description:
        "Given a natural-language UI request (e.g. 'make it pop', 'the spacing feels off', 'make it production-ready'), returns the matching design verb(s) and which designer-skill reference files to read. Use it to route a vague request to concrete guidance before acting.",
      inputSchema: { request: z.string().min(1).describe("What the user wants done to the UI.") },
    },
    async ({ request }) => ({ content: [{ type: "text", text: dispatchIntent(request).text }] }),
  );

  server.registerTool(
    "anti_slop_checklist",
    {
      title: "Anti-slop ship gate",
      description:
        "Returns the designer-skill anti-AI-slop reference: the tell ban-list, category-reflex checks, the output-completeness contract, and the final checklist. Run before declaring any UI work done.",
    },
    async () => ({ content: [{ type: "text", text: getReferenceDoc("avoid-ai-slop") }] }),
  );

  server.registerTool(
    "list_commands",
    {
      title: "List all designer-skill design commands",
      description:
        "Returns all design verbs (init, craft, live, audit, polish, bolder, …) with descriptions and argument hints. Use to discover the command vocabulary before calling get_command.",
    },
    async () => {
      const cmds = listCommands();
      const lines = cmds.map((c) => `- **${c.verb}** — ${c.description}${c.argumentHint ? ` \`${c.argumentHint}\`` : ""}`);
      return { content: [{ type: "text", text: `# designer-skill commands\n\n${lines.join("\n")}` }] };
    },
  );

  server.registerTool(
    "get_command",
    {
      title: "Get guidance for a specific design command",
      description:
        "Returns the description, argument hint, and reference files to read for a design verb (e.g. init, craft, audit, polish). Call list_commands first if unsure which verb applies.",
      inputSchema: { verb: z.string().min(1).describe("Design command verb, e.g. init, craft, audit, polish.") },
    },
    async ({ verb }) => {
      const help = formatCommandHelp(verb);
      const reads = getCommandReads(verb);
      const refTexts = reads.map((name) => `## reference/${name}.md\n\n${getReferenceDoc(name)}`);
      return { content: [{ type: "text", text: [help, ...refTexts].join("\n\n---\n\n") }] };
    },
  );

  server.registerTool(
    "load_project_context",
    {
      title: "Load PRODUCT.md and DESIGN.md from the project",
      description:
        "Reads PRODUCT.md (and DESIGN.md when present) from the project root or .agents/context/ or docs/. Returns NO_PRODUCT_MD when missing — then run get_command({ verb: \"init\" }) before any UI work.",
      inputSchema: {
        cwd: z.string().optional().describe("Project root directory. Defaults to the MCP server's working directory."),
      },
    },
    async ({ cwd }) => {
      const ctx = loadProjectContext(cwd ?? process.cwd());
      return { content: [{ type: "text", text: formatProjectContext(ctx) }] };
    },
  );

  server.registerTool(
    "get_palette_seed",
    {
      title: "Get an OKLCH brand-seed color for greenfield projects",
      description:
        "Returns one curated OKLCH seed color + mood + composition strategy for composing a full palette on greenfield work. Skip when committed brand colors already exist in the project.",
      inputSchema: {
        id: z.string().optional().describe("Specific seed id, e.g. seed-021."),
        from: z.string().optional().describe("Deterministic seed key (hashed to a seed)."),
      },
    },
    async ({ id, from }) => ({ content: [{ type: "text", text: getPaletteSeed({ id, from }) }] }),
  );

  server.registerTool(
    "detect_antipatterns",
    {
      title: "Scan files for UI anti-patterns (deterministic)",
      description:
        "Runs 44 deterministic detector rules against a file or directory. No LLM, no API key. Respects .designer-skill/config.json ignore rules. Use during audit/critique before declaring work done.",
      inputSchema: {
        target: z.string().min(1).describe("File or directory path to scan (relative to cwd or absolute)."),
        cwd: z.string().optional().describe("Project root for config resolution. Defaults to process.cwd()."),
      },
    },
    async ({ target, cwd }) => {
      const findings = await detectAntipatterns(target, { cwd: cwd ?? process.cwd() });
      const json = JSON.stringify(findings, null, 2);
      const summary = formatDetectionResults(findings);
      return { content: [{ type: "text", text: `${summary}\n\n\`\`\`json\n${json}\n\`\`\`` }] };
    },
  );

  // ---- Prompt --------------------------------------------------------------
  server.registerPrompt(
    "design",
    {
      title: "Design with the designer-skill",
      description:
        "Loads the designer-skill (router + the references relevant to your task) as context and asks you to design, refactor, or enhance the given UI.",
      argsSchema: {
        task: z.string().describe("What to design, refactor, or improve."),
        aesthetic: z.string().optional().describe("Optional aesthetic direction."),
      },
    },
    ({ task, aesthetic }) => {
      const reads = new Set<ReferenceName>(dispatchIntent(task).recommendedReads);
      reads.add("design-principles");
      reads.add("avoid-ai-slop");
      const context = [getSkillRouter(), ...[...reads].map((r) => getReferenceDoc(r))].join("\n\n---\n\n");
      const ask = aesthetic ? `${task}\n\nAesthetic direction: ${aesthetic}` : task;
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text:
                "Use the designer-skill below to design, refactor, and enhance UI. Commit to one aesthetic system, " +
                "preserve functionality on refactors, and run the anti-slop checklist before finishing.\n\n" +
                `${context}\n\n---\n\nTask: ${ask}`,
            },
          },
        ],
      };
    },
  );

  return server;
}
