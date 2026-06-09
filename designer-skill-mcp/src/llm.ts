// Active tier: run Claude loaded with the Designer-Skill. Gated behind
// ANTHROPIC_API_KEY; the guidance tools work without it.
import Anthropic from "@anthropic-ai/sdk";
import { getSkillRouter, getReferenceDoc, type ReferenceName } from "./skill.js";
import { dispatchIntent } from "./dispatch.js";

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      "apply_designer needs an Anthropic API key. Set ANTHROPIC_API_KEY in the server environment. " +
        "The guidance tools (get_design_system, get_reference, dispatch_intent, anti_slop_checklist) work without a key.",
    );
    this.name = "MissingApiKeyError";
  }
}

const DEFAULT_MODEL = "claude-opus-4-8";

export interface ApplyDesignerArgs {
  request: string;
  code?: string;
  aesthetic?: string;
}

function buildSystemPrompt(request: string): string {
  const dispatch = dispatchIntent(request);
  const picked = new Set<ReferenceName>(dispatch.recommendedReads);
  picked.add("design-principles"); // always include the neutral baseline
  picked.add("avoid-ai-slop"); // always include the ship gate

  const parts = [getSkillRouter()];
  for (const ref of picked) {
    parts.push(`# Reference: ${ref}.md\n\n${getReferenceDoc(ref)}`);
  }
  parts.push(
    "You are the Designer-Skill agent. Apply the rules above to the user's request. " +
      "Commit to ONE aesthetic system, preserve functionality and DOM/ARIA contracts when refactoring, " +
      "and run the anti-slop checklist before finishing. Output complete, production-ready code or a " +
      "structured review — never placeholders, truncation, or '// rest of code'.",
  );
  return parts.join("\n\n---\n\n");
}

export async function applyDesigner(args: ApplyDesignerArgs): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) throw new MissingApiKeyError();

  const model = process.env.DESIGNER_MCP_MODEL || DEFAULT_MODEL;
  const system = buildSystemPrompt(args.request);

  const userParts: string[] = [args.request];
  if (args.aesthetic) userParts.push(`Aesthetic direction: ${args.aesthetic}`);
  if (args.code) userParts.push("Current code:\n\n```\n" + args.code + "\n```");

  const client = new Anthropic();
  const stream = client.messages.stream({
    model,
    max_tokens: 32000,
    system,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    messages: [{ role: "user", content: userParts.join("\n\n") }],
  });

  const message = await stream.finalMessage();
  const text = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();
  return text || "(model returned no text)";
}
