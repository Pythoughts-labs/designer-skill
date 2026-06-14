// Builds the designer-skill MCP server: resources, guidance tools, the active
// (Claude-backed) tool, and a `design` prompt. Transport-agnostic.
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
import { applyDesigner, MissingApiKeyError } from "./llm.js";

export const SERVER_NAME = "designer-skill-mcp";
export const SERVER_VERSION = "0.4.0";

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
      description: "One of the seven designer-skill reference files.",
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

  // ---- Guidance tools (no API key) ----------------------------------------
  server.registerTool(
    "get_design_system",
    {
      title: "Get the designer-skill router",
      description:
        "Call this FIRST. Returns the designer-skill SKILL.md: the session preflight, the precedence rule, the routing map to the seven reference files, and the always-run anti-slop ship gate.",
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

  // ---- Active tool (needs ANTHROPIC_API_KEY) ------------------------------
  server.registerTool(
    "apply_designer",
    {
      title: "Apply the designer-skill with Claude (needs ANTHROPIC_API_KEY)",
      description:
        "Runs Claude loaded with the designer-skill to design, refactor, audit, critique, or enhance UI, and returns the result. Requires ANTHROPIC_API_KEY in the server environment; without it, the four guidance tools still work. Use when you want the server to do the work rather than guide your own agent.",
      inputSchema: {
        request: z.string().min(1).describe("The UI task: build / redesign / audit / critique / polish / harden, etc."),
        code: z.string().optional().describe("Existing markup / CSS / component code to work on, if any."),
        aesthetic: z
          .string()
          .optional()
          .describe("Optional aesthetic direction, e.g. 'minimalist editorial' or 'brutalist dashboard'."),
      },
    },
    async ({ request, code, aesthetic }) => {
      try {
        const out = await applyDesigner({ request, code, aesthetic });
        return { content: [{ type: "text", text: out }] };
      } catch (err) {
        const message =
          err instanceof MissingApiKeyError
            ? err.message
            : `apply_designer failed: ${err instanceof Error ? err.message : String(err)}`;
        return { content: [{ type: "text", text: message }], isError: true };
      }
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
