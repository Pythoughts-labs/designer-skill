// Copies the canonical skills/designer-skill/ folder into assets/skill so the published
// npm package is self-contained. skills/designer-skill/ remains the single source of truth.
import { existsSync, rmSync, mkdirSync, cpSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const src = resolve(pkgRoot, "..", "skills", "designer-skill");
const dest = join(pkgRoot, "assets", "skill");

if (!existsSync(join(src, "SKILL.md"))) {
  if (existsSync(join(dest, "SKILL.md"))) {
    console.log(`[sync-skill] source not found at ${src}; using bundled assets/skill.`);
    process.exit(0);
  }
  console.error(`[sync-skill] ERROR: no designer-skill source at ${src} and no bundled copy at ${dest}.`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(join(dest, "reference"), { recursive: true });
cpSync(join(src, "SKILL.md"), join(dest, "SKILL.md"));

const refDir = join(src, "reference");
let count = 0;
for (const f of readdirSync(refDir)) {
  if (f.endsWith(".md")) {
    cpSync(join(refDir, f), join(dest, "reference", f));
    count++;
  }
}
console.log(`[sync-skill] synced SKILL.md + ${count} reference files → ${dest}`);
