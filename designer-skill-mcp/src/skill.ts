// Loads the bundled designer-skill markdown (SKILL.md + 10 reference files) and
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
  "differentiation-playbook",
  "refactor-and-redesign",
  "command-playbook",
  "interaction-design",
  "visual-critique",
  "design-systems",
  "project-init",
  "craft-flow",
  "live-mode",
  "css-techniques",
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
  "differentiation-playbook":
    "Positive creativity guide: inverse test, layout menu, one weird thing, named references, physical scene. How to be distinctive.",
  "refactor-and-redesign":
    "Improving existing UI without breaking it: audit, diagnose generic patterns, the redesign loop, image/reference-to-code.",
  "command-playbook":
    "Intent-to-verb dispatch table mapping a request to the right design move and reference files.",
  "interaction-design":
    "Cognitive laws (Fitts, Hick, Miller, Doherty), state machines, form design, navigation patterns, error UX, feedback, loading, gestures, emotional timing.",
  "visual-critique":
    "Seven-dimension critique instrument: visual hierarchy, composition, color, typography, affordance, information density, brand consistency.",
  "design-systems":
    "Token architecture (global→semantic→component), motion system, component specs, naming conventions, theming, pattern library, color/type/spacing scales.",
  "project-init":
    "One-time project setup: discovery interview, PRODUCT.md, optional DESIGN.md, live-mode pre-config, and next-command routing.",
  "craft-flow":
    "Full shape-then-build pipeline with user gates, framework detection, visual iteration loop, and production-grade output.",
  "live-mode":
    "Interactive browser variant mode: element selection, hot-swapped HTML+CSS variants via HMR, poll/steer/accept contract.",
  "css-techniques":
    "Modern CSS implementation cookbook: resets, box-sizing, centering, aspect-ratio, :is()/:not(), logical properties, container queries, :has(), @layer, clamp(), Baseline-bucketed features. The how-to for applying CSS fixes.",
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
