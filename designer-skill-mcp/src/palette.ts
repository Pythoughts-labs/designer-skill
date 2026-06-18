// Brand-seed palette picker — delegates to bundled palette.mjs logic.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function resolvePaletteScript(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgRoot = resolve(here, "..");
  const bundled = join(pkgRoot, "assets", "skill", "scripts", "palette.mjs");
  if (existsSync(bundled)) return bundled;
  const dev = resolve(pkgRoot, "..", "skills", "designer-skill", "scripts", "palette.mjs");
  if (existsSync(dev)) return dev;
  throw new Error("palette.mjs not found. Run npm run sync-skill.");
}

export function getPaletteSeed(options: { id?: string; from?: string } = {}): string {
  const script = resolvePaletteScript();
  const args = ["--experimental-vm-modules", script];
  if (options.id) args.push("--id", options.id);
  else if (options.from) args.push("--from", options.from);

  const result = spawnSync(process.execPath, args, { encoding: "utf8", maxBuffer: 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(result.stderr || "palette.mjs failed");
  }
  return result.stdout.trim();
}
