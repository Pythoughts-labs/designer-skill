// Command metadata and verb → reference routing for designer-skill MCP.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ReferenceName } from "./skill.js";

export interface CommandMeta {
  description: string;
  argumentHint: string;
}

/** Maps a design verb to the reference file(s) an agent should read. */
export const COMMAND_READS: Record<string, ReferenceName[]> = {
  init: ["project-init"],
  craft: ["craft-flow", "design-principles", "aesthetic-systems", "engineering-and-performance", "avoid-ai-slop"],
  live: ["live-mode"],
  shape: ["design-principles", "aesthetic-systems"],
  build: ["design-principles", "aesthetic-systems", "engineering-and-performance", "avoid-ai-slop"],
  audit: ["engineering-and-performance", "avoid-ai-slop", "refactor-and-redesign"],
  critique: ["design-principles", "avoid-ai-slop", "visual-critique"],
  polish: ["design-principles", "engineering-and-performance"],
  bolder: ["aesthetic-systems", "avoid-ai-slop"],
  quieter: ["design-principles", "aesthetic-systems"],
  overdrive: ["motion-and-interaction", "engineering-and-performance"],
  animate: ["motion-and-interaction"],
  delight: ["motion-and-interaction", "avoid-ai-slop"],
  layout: ["design-principles"],
  typeset: ["design-principles"],
  colorize: ["design-principles", "aesthetic-systems"],
  harden: ["engineering-and-performance"],
  optimize: ["engineering-and-performance"],
  distill: ["design-principles"],
  extract: ["engineering-and-performance", "design-systems"],
  brand: ["aesthetic-systems", "avoid-ai-slop"],
  adapt: ["engineering-and-performance", "refactor-and-redesign"],
  redesign: ["refactor-and-redesign", "avoid-ai-slop"],
  clarify: ["command-playbook", "avoid-ai-slop"],
  onboard: ["command-playbook", "engineering-and-performance"],
  document: ["refactor-and-redesign"],
  variants: ["refactor-and-redesign", "avoid-ai-slop"],
  form: ["interaction-design", "engineering-and-performance"],
  navigate: ["interaction-design", "design-principles"],
  states: ["interaction-design", "engineering-and-performance"],
  feel: ["interaction-design", "motion-and-interaction"],
  system: ["design-systems", "engineering-and-performance"],
  score: ["visual-critique", "avoid-ai-slop"],
};

function resolveScriptsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgRoot = resolve(here, "..");
  const bundled = join(pkgRoot, "assets", "skill", "scripts");
  if (existsSync(join(bundled, "command-metadata.json"))) return bundled;
  const dev = resolve(pkgRoot, "..", "skills", "designer-skill", "scripts");
  if (existsSync(join(dev, "command-metadata.json"))) return dev;
  throw new Error("command-metadata.json not found. Run npm run sync-skill.");
}

let metadataCache: Record<string, CommandMeta> | null = null;

export function getCommandMetadata(): Record<string, CommandMeta> {
  if (metadataCache) return metadataCache;
  const dir = resolveScriptsDir();
  metadataCache = JSON.parse(readFileSync(join(dir, "command-metadata.json"), "utf8")) as Record<
    string,
    CommandMeta
  >;
  return metadataCache;
}

export function listCommands(): { verb: string; description: string; argumentHint: string }[] {
  const meta = getCommandMetadata();
  return Object.entries(meta).map(([verb, m]) => ({
    verb,
    description: m.description,
    argumentHint: m.argumentHint,
  }));
}

export function getCommandReads(verb: string): ReferenceName[] {
  const reads = COMMAND_READS[verb.toLowerCase()];
  if (!reads) return ["command-playbook", "design-principles"];
  return reads;
}

export function formatCommandHelp(verb: string): string {
  const key = verb.toLowerCase();
  const meta = getCommandMetadata()[key];
  if (!meta) {
    return `Unknown command "${verb}". Call list_commands for all verbs, or dispatch_intent with a natural-language request.`;
  }
  const reads = getCommandReads(key);
  const lines = [
    `# designer-skill command: ${key}`,
    "",
    meta.description,
    meta.argumentHint ? `\nArgument hint: \`${meta.argumentHint}\`` : "",
    "",
    `Read before acting: ${reads.map((r) => `reference/${r}.md`).join(", ")}`,
    "",
    "Always run the anti-slop ship gate (`anti_slop_checklist` or `reference/avoid-ai-slop.md`) before declaring UI work done.",
  ];
  return lines.filter(Boolean).join("\n");
}
