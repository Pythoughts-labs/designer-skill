// Deterministic intent -> verb -> reference-file routing. Mirrors the
// command-playbook dispatch table. No LLM; pure keyword scoring.
import type { ReferenceName } from "./skill.js";

interface Verb {
  verb: string;
  cues: string[];
  files: ReferenceName[];
  note: string;
}

const VERBS: Verb[] = [
  {
    verb: "build",
    cues: ["build", "make a", "create", "scaffold", "implement", "from scratch", "new page", "new component", "landing page", "build me"],
    files: ["design-principles", "aesthetic-systems", "engineering-and-performance", "avoid-ai-slop"],
    note: "Build a feature/page/component end-to-end: set the baseline, commit to one aesthetic, wire motion + tokens, ship real content.",
  },
  {
    verb: "shape",
    cues: ["plan", "spec", "think through", "before code", "brief", "approach", "wireframe"],
    files: ["design-principles", "aesthetic-systems"],
    note: "Plan UX/UI before writing code: pick a color strategy, a physical-scene sentence, and named references.",
  },
  {
    verb: "audit",
    cues: ["audit", "review the", "review my", "check the", "a11y", "accessibility", "performance review", "responsive check", "lighthouse"],
    files: ["engineering-and-performance", "avoid-ai-slop", "refactor-and-redesign"],
    note: "Score the implementation (a11y, perf, responsive, anti-patterns) and report findings; fix nothing yet.",
  },
  {
    verb: "critique",
    cues: ["critique", "is this good", "design review", "feels ai", "looks ai", "feel ai", "feedback on", "does this feel", "thoughts on the design"],
    files: ["design-principles", "avoid-ai-slop"],
    note: "Design-director read: hierarchy, IA, cognitive load; lead with the AI-slop verdict, list priority issues.",
  },
  {
    verb: "polish",
    cues: ["polish", "final pass", "tighten", "before shipping", "ship ready", "refine", "clean up the ui"],
    files: ["design-principles", "engineering-and-performance"],
    note: "Final quality pass: snap spacing to scale, complete every interaction state, fix optical alignment.",
  },
  {
    verb: "bolder",
    cues: ["bolder", "too safe", "bland", "make it pop", "boring", "more striking", "amplify", "stand out", "needs energy"],
    files: ["aesthetic-systems", "avoid-ai-slop"],
    note: "Amplify a timid design: bigger scale jumps, weight contrast, one color owning the surface, break the grid.",
  },
  {
    verb: "quieter",
    cues: ["quieter", "too loud", "too busy", "aggressive", "overstimulating", "tone down", "calmer", "too much"],
    files: ["design-principles", "aesthetic-systems"],
    note: "Reduce intensity: desaturate, let neutrals carry weight, flatten, calm the motion — keep the point of view.",
  },
  {
    verb: "overdrive",
    cues: ["overdrive", "extraordinary", "wow", "push past", "cinematic", "award", "go crazy", "showstopper"],
    files: ["motion-and-interaction", "engineering-and-performance"],
    note: "Highest-ambition effects (View Transitions, scroll-driven, WebGL). Propose directions, confirm, build with fallback.",
  },
  {
    verb: "animate",
    cues: ["animate", "animation", "motion", "transition", "feels static", "smooth this", "hover effect", "scroll effect", "micro-interaction"],
    files: ["motion-and-interaction"],
    note: "Add purposeful motion: right duration tier, ease-out curves, sibling stagger, a reduced-motion alternative.",
  },
  {
    verb: "delight",
    cues: ["delight", "personality", "memorable", "charm", "easter egg", "playful", "fun touch"],
    files: ["motion-and-interaction", "avoid-ai-slop"],
    note: "Earn specific delight moments (success, empty, error recovery) under ~1s; never generic filler, never on every interaction.",
  },
  {
    verb: "layout",
    cues: ["layout", "spacing", "feels off", "alignment", "hierarchy", "grid", "whitespace", "cramped", "looks off"],
    files: ["design-principles"],
    note: "Fix spacing, rhythm, and visual hierarchy: 4pt scale, tight-vs-loose grouping, flex/grid, the squint test.",
  },
  {
    verb: "typeset",
    cues: ["typography", "font", "typeface", "type scale", "headings", "text hierarchy", "fonts"],
    files: ["design-principles"],
    note: "Improve type: replace invisible defaults, commit to a scale and weights, set measure and tracking.",
  },
  {
    verb: "colorize",
    cues: ["color", "colour", "palette", "flat", "grayscale", "greyscale", "monochrome", "add color", "color scheme"],
    files: ["design-principles", "aesthetic-systems"],
    note: "Add strategic color: a color strategy first, an OKLCH ramp, 60-30-10 weighting, tinted neutrals.",
  },
  {
    verb: "harden",
    cues: ["harden", "production-ready", "production ready", "edge case", "real data", "empty state", "error state", "i18n", "loading state", "rtl"],
    files: ["engineering-and-performance"],
    note: "Make it survive real data: long/empty/RTL text, every API error state, no fixed text widths, server-side validation.",
  },
  {
    verb: "optimize",
    cues: ["optimize", "optimise", "slow", "janky", "jank", "lag", "fps", "bundle size", "performance issue", "core web vitals"],
    files: ["engineering-and-performance"],
    note: "Diagnose and fix UI performance: measure first, fix the real bottleneck (LCP/INP/CLS), images, code-split.",
  },
  {
    verb: "distill",
    cues: ["distill", "too complex", "cluttered", "strip", "simplify", "minimal", "reduce complexity", "declutter"],
    files: ["design-principles"],
    note: "Strip to essence: one primary goal, progressive disclosure, fewer colors, flatten nesting, halve the copy.",
  },
  {
    verb: "extract",
    cues: ["extract", "reusable", "tokens", "design system", "componentize", "dedupe", "shared component"],
    files: ["engineering-and-performance"],
    note: "Pull repeated patterns (3+ same-intent uses) into tokens + components with a clear API; avoid premature abstraction.",
  },
  {
    verb: "brand",
    cues: ["brand", "identity", "distinctive", "not generic", "logo", "brand voice", "make it unique"],
    files: ["aesthetic-systems", "avoid-ai-slop"],
    note: "Build a distinctive identity: choose an aesthetic + a named reference, run the font-selection procedure, commit a palette.",
  },
  {
    verb: "adapt",
    cues: ["adapt", "mobile", "tablet", "responsive for", "different device", "breakpoint", "small screen", "touch"],
    files: ["engineering-and-performance", "refactor-and-redesign"],
    note: "Rethink for the target device (not pixel-scale): single-column reflow, 44x44 touch targets, input detection, safe areas.",
  },
  {
    verb: "redesign",
    cues: ["redesign", "improve existing", "fix this ui", "without breaking", "revamp", "modernize", "modernise", "existing site", "existing app", "existing page", "upgrade the design"],
    files: ["refactor-and-redesign", "avoid-ai-slop"],
    note: "Improve existing UI without breaking it: audit, diagnose generic patterns, run the redesign loop preserving function.",
  },
  {
    verb: "clarify",
    cues: ["microcopy", "ux copy", "ux writing", "rewrite this error", "error message", "error copy", "button label", "labels are confusing", "confusing copy", "wording", "rewrite the copy"],
    files: ["command-playbook", "avoid-ai-slop"],
    note: "Fix UX copy: verb+object button labels, what-happened/why/how-to-fix errors, one term per concept, instructions before the field.",
  },
  {
    verb: "onboard",
    cues: ["onboard", "onboarding", "first run", "first-run", "first-time", "first time user", "product tour", "activation", "getting started", "welcome screen", "empty states"],
    files: ["command-playbook", "engineering-and-performance"],
    note: "Shortest path to first value: 5-part empty-state anatomy, the five empty-state types, skippable 3-7-step tours.",
  },
  {
    verb: "document",
    cues: ["design.md", "document the design", "write design", "capture the design system", "refresh design.md", "design system doc", "document tokens"],
    files: ["refactor-and-redesign"],
    note: "Scan tokens + components and generate or refresh DESIGN.md so later work stays on-brand; never overwrite without asking.",
  },
  {
    verb: "variants",
    cues: ["variants", "variations", "show me options", "show me 3", "3 versions", "three versions", "different versions", "alternatives", "options for this", "a few directions"],
    files: ["refactor-and-redesign", "avoid-ai-slop"],
    note: "Variation within identity, never three different brands: lock the identity, pick default vs departure mode, vary each option on a different axis.",
  },
  {
    verb: "form",
    cues: ["form", "form design", "input fields", "form validation", "multi-step form", "form layout", "form ux", "checkout form", "sign up form", "registration form"],
    files: ["interaction-design", "engineering-and-performance"],
    note: "Single-column layout, top-aligned labels, blur validation, inline errors below the field, multi-step when >7 fields with named step indicator.",
  },
  {
    verb: "navigate",
    cues: ["navigation", "nav menu", "sidebar nav", "tab bar", "breadcrumb", "menu structure", "top nav", "bottom nav", "nav pattern", "drawer navigation"],
    files: ["interaction-design", "design-principles"],
    note: "Match pattern to IA depth and platform (tab bar mobile / sidebar desktop / top nav simple / breadcrumbs deep); active states beyond color alone; never hamburger for primary nav on desktop.",
  },
  {
    verb: "states",
    cues: ["state machine", "ui states", "all states", "impossible state", "model behavior", "loading state", "error state", "empty state", "define all states", "every state"],
    files: ["interaction-design", "engineering-and-performance"],
    note: "Map the UI as finite states (idle/loading/success/error/empty); every state has one visual representation and at least one exit; no impossible combinations.",
  },
  {
    verb: "feel",
    cues: ["feels flat", "feels lifeless", "no personality", "feels cold", "humanize", "feels robotic", "feels dead", "feels clinical", "emotionally", "too sterile"],
    files: ["interaction-design", "motion-and-interaction"],
    note: "Name the felt state → find the physical analogue → extract the behavioral property → apply to easing, delay, copy tone, or duration.",
  },
  {
    verb: "system",
    cues: ["design system", "token system", "naming convention", "theming", "design tokens", "dark mode system", "component library", "token architecture", "color scale", "spacing scale"],
    files: ["design-systems", "engineering-and-performance"],
    note: "Two-layer token architecture: global (raw values) → semantic (role-named); component specs with all states; naming {category}-{property}-{concept}; themes override semantic tokens.",
  },
  {
    verb: "score",
    cues: ["score the design", "visual critique", "dimensional critique", "critique dimensions", "rate the design", "critique the ui", "seven dimensions", "critique framework"],
    files: ["visual-critique", "avoid-ai-slop"],
    note: "7-dimension critique: hierarchy, composition, color, typography, affordance, information density, brand consistency — rate each pass/minor/major; lead with AI-slop verdict.",
  },
];

export interface DispatchMatch {
  verb: string;
  files: ReferenceName[];
  note: string;
  score: number;
}

export interface DispatchResult {
  matched: DispatchMatch[];
  recommendedReads: ReferenceName[];
  text: string;
}

export function dispatchIntent(request: string): DispatchResult {
  const q = request.toLowerCase();
  const scored: DispatchMatch[] = VERBS.map((v) => ({
    verb: v.verb,
    files: v.files,
    note: v.note,
    score: v.cues.reduce((n, cue) => (q.includes(cue) ? n + 1 : n), 0),
  }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const reads = new Set<ReferenceName>();
  for (const m of scored) for (const f of m.files) reads.add(f);
  // The anti-slop checklist is the always-run ship gate.
  reads.add("avoid-ai-slop");
  if (scored.length === 0) {
    reads.add("command-playbook");
    reads.add("design-principles");
  }
  const recommendedReads = [...reads];

  const lines: string[] = [];
  if (scored.length === 0) {
    lines.push(
      `No specific verb matched "${request}". Read command-playbook.md to map the intent, then design-principles.md for fundamentals.`,
    );
  } else {
    lines.push(`Matched verb(s) for "${request}":`);
    for (const m of scored) {
      lines.push(`\n- **${m.verb}** — ${m.note}\n  Read: ${m.files.join(", ")}`);
    }
  }
  lines.push(
    `\nThen run the anti-slop checklist in avoid-ai-slop.md before declaring done (always-run ship gate).`,
  );
  lines.push(`\nRecommended reads: ${recommendedReads.join(", ")}.`);

  return { matched: scored, recommendedReads, text: lines.join("\n") };
}
