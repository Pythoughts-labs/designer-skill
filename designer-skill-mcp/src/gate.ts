// Composite ship gate: detector + checklist summary + score + fix list.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { detectAntipatterns, formatDetectionResults, type DetectionFinding } from "./detect.js";
import { getReferenceDoc } from "./skill.js";

export interface GateResult {
  status: "PASS" | "FAIL";
  score: number;
  findingCount: number;
  blockingCount: number;
  warningCount: number;
  findings: DetectionFinding[];
  fixes: string[];
  summary: string;
}

const PASS_SCORE = 85;

let slopIds: Set<string> | null = null;

async function loadSlopIds(): Promise<Set<string>> {
  if (slopIds) return slopIds;
  const here = dirname(fileURLToPath(import.meta.url));
  const registry = resolve(here, "..", "assets", "engine", "registry", "antipatterns.mjs");
  if (!existsSync(registry)) {
    slopIds = new Set();
    return slopIds;
  }
  const mod = (await import(pathToFileURL(registry).href)) as {
    ANTIPATTERNS?: Array<{ id: string; category?: string }>;
  };
  slopIds = new Set((mod.ANTIPATTERNS ?? []).filter((r) => r.category === "slop").map((r) => r.id));
  return slopIds;
}

function scoreFindings(findings: DetectionFinding[], slop: Set<string>): { score: number; blocking: number; warnings: number } {
  let score = 100;
  let blocking = 0;
  let warnings = 0;
  for (const f of findings) {
    const isSlop = slop.has(f.antipattern);
    if (isSlop) {
      score -= 8;
      blocking += 1;
    } else {
      score -= 3;
      warnings += 1;
    }
  }
  return { score: Math.max(0, score), blocking, warnings };
}

function buildFixList(findings: DetectionFinding[], slop: Set<string>): string[] {
  const seen = new Set<string>();
  const fixes: string[] = [];
  for (const f of findings) {
    const key = `${f.antipattern}:${f.snippet}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const tag = slop.has(f.antipattern) ? "BLOCKING" : "warning";
    fixes.push(`[${tag}] ${f.file}${f.line ? `:${f.line}` : ""} — ${f.description}`);
  }
  return fixes;
}

const CHECKLIST_REMINDER = [
  "Category-reflex: neither first- nor second-order guess is obvious",
  "No em-dash (—) in visible copy",
  "Eyebrow uppercase-tracking count ≤ ceil(sections / 3)",
  "Full output — no // rest of code or placeholder sections",
  "a11y: focus-visible rings, 4.5:1 text contrast, reduced-motion alt, 44px touch targets",
];

export async function reviewAndGate(
  target: string,
  options: { cwd?: string } = {},
): Promise<GateResult> {
  const cwd = options.cwd ?? process.cwd();
  const slop = await loadSlopIds();
  const findings = await detectAntipatterns(target, { cwd });
  const { score, blocking, warnings } = scoreFindings(findings, slop);
  const fixes = buildFixList(findings, slop);
  const status = score >= PASS_SCORE && blocking === 0 ? "PASS" : "FAIL";

  const summaryLines = [
    `## review_and_gate: ${status}`,
    "",
    `**Score:** ${score}/100 (pass threshold: ${PASS_SCORE}, blocking slop findings must be 0)`,
    `**Findings:** ${findings.length} total (${blocking} blocking slop, ${warnings} quality warnings)`,
    "",
    formatDetectionResults(findings),
  ];

  if (status === "FAIL") {
    summaryLines.push("", "### Blocking fixes required");
    if (fixes.length === 0) {
      summaryLines.push(`- Score ${score} is below ${PASS_SCORE} — resolve detected issues and re-run review_and_gate.`);
    } else {
      for (const fix of fixes.slice(0, 20)) summaryLines.push(`- ${fix}`);
      if (fixes.length > 20) summaryLines.push(`- … and ${fixes.length - 20} more`);
    }
  }

  summaryLines.push("", "### Manual checklist (agent must verify)");
  for (const item of CHECKLIST_REMINDER) summaryLines.push(`- [ ] ${item}`);

  return {
    status,
    score,
    findingCount: findings.length,
    blockingCount: blocking,
    warningCount: warnings,
    findings,
    fixes,
    summary: summaryLines.join("\n"),
  };
}

export function formatGateResult(result: GateResult, includeChecklist = false): string {
  const parts = [result.summary];
  if (includeChecklist) {
    parts.push("", "---", "", "## Anti-slop reference (excerpt)", "", getReferenceDoc("avoid-ai-slop").split("\n").slice(0, 40).join("\n"), "…");
  }
  parts.push(
    "",
    "```json",
    JSON.stringify(
      {
        status: result.status,
        score: result.score,
        passThreshold: PASS_SCORE,
        findingCount: result.findingCount,
        blockingCount: result.blockingCount,
        warningCount: result.warningCount,
      },
      null,
      2,
    ),
    "```",
  );
  return parts.join("\n");
}
