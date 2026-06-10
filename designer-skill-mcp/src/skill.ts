// Loads the bundled designer-skill markdown (SKILL.md + 7 reference files) and
// caches it. Resolves to the packaged copy (assets/skill) first, falling back to
// the sibling skills/designer-skill/ folder in local development.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REFERENCE_NAMES = [
  "design-principles",
  "aesthetic-systems",
  "motion-and-interaction",
  "engineering-and-performance",
  "avoid-ai-slop",
  "refactor-and-redesign",
  "command-playbook",
] as const;

export type ReferenceName = (typeof REFERENCE_NAMES)[number];

export const REFERENCE_DESCRIPTIONS: Record<ReferenceName, string> = {
  "design-principles":
    "Aesthetic-neutral visual baseline: typography, spacing & rhythm, color & contrast, layout & grid, hierarchy, depth.",
  "aesthetic-systems":
    "Five opinionated design languages (Minimalist, Brutalist, Soft, High-end, Brand-identity) and when to use which.",
  "motion-and-interaction":
    "What to animate, how fast, which curve; springs, micro-interactions, gestures, scroll, perceived performance, reduced-motion.",
  "engineering-and-performance":
    "Component architecture, design tokens, hardware acceleration, responsive/fluid, accessibility, Core Web Vitals, framework-honest output.",
  "avoid-ai-slop":
    "The AI-tell ban-list, category-reflex checks, and the output-completeness contract. The always-run ship gate.",
  "refactor-and-redesign":
    "Improving existing UI without breaking it: audit, diagnose generic patterns, the redesign loop, image/reference-to-code.",
  "command-playbook":
    "Intent-to-verb dispatch table mapping a request to the right design move and reference files.",
};

function resolveSkillDir(): string {
  const here = dirname(fileURLToPath(import.meta.url)); // dist/ (built) or src/ (tsx/vitest)
  const pkgRoot = resolve(here, "..");
  const bundled = join(pkgRoot, "assets", "skill");
  if (existsSync(join(bundled, "SKILL.md"))) return bundled;
  const dev = resolve(pkgRoot, "..", "skills", "designer-skill");
  if (existsSync(join(dev, "SKILL.md"))) return dev;
  throw new Error(
    `designer-skill content not found. Looked in:\n  ${bundled}\n  ${dev}\nRun "npm run sync-skill" to bundle it.`,
  );
}

interface SkillCache {
  router: string;
  refs: Map<ReferenceName, string>;
}

let cache: SkillCache | null = null;

function load(): SkillCache {
  if (cache) return cache;
  const dir = resolveSkillDir();
  const router = readFileSync(join(dir, "SKILL.md"), "utf8");
  const refs = new Map<ReferenceName, string>();
  for (const name of REFERENCE_NAMES) {
    const p = join(dir, "reference", `${name}.md`);
    if (!existsSync(p)) throw new Error(`Missing designer-skill reference file: ${p}`);
    refs.set(name, readFileSync(p, "utf8"));
  }
  cache = { router, refs };
  return cache;
}

export function getSkillRouter(): string {
  return load().router;
}

export function getReferenceDoc(name: ReferenceName): string {
  const doc = load().refs.get(name);
  if (doc === undefined) throw new Error(`Unknown reference "${name}".`);
  return doc;
}

export function isReferenceName(value: string): value is ReferenceName {
  return (REFERENCE_NAMES as readonly string[]).includes(value);
}
