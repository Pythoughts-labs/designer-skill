// Project context loader — PRODUCT.md / DESIGN.md resolution for designer-skill MCP.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PRODUCT_NAMES = ["PRODUCT.md", "Product.md", "product.md"];
const DESIGN_NAMES = ["DESIGN.md", "Design.md", "design.md"];
const FALLBACK_DIRS = [".agents/context", "docs"];

export interface ProjectContext {
  hasProduct: boolean;
  product: string | null;
  productPath: string | null;
  hasDesign: boolean;
  design: string | null;
  designPath: string | null;
  contextDir: string;
  register: "brand" | "product" | null;
}

function firstExisting(dir: string, names: string[]): string | null {
  for (const name of names) {
    const abs = join(dir, name);
    if (existsSync(abs)) return abs;
  }
  return null;
}

function safeRead(p: string): string | null {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

export function resolveContextDir(cwd: string): string {
  if (firstExisting(cwd, [...PRODUCT_NAMES, ...DESIGN_NAMES])) return cwd;
  for (const rel of FALLBACK_DIRS) {
    const candidate = join(cwd, rel);
    if (firstExisting(candidate, [...PRODUCT_NAMES, ...DESIGN_NAMES])) return candidate;
  }
  const envDir = process.env.DESIGNER_SKILL_CONTEXT_DIR?.trim();
  if (envDir) return envDir.startsWith("/") ? envDir : join(cwd, envDir);
  return cwd;
}

export function extractRegister(product: string | null): "brand" | "product" | null {
  if (!product) return null;
  const lines = product.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+Register\b/i.test(lines[i].trim())) {
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j].trim();
        if (!next) continue;
        const word = next.toLowerCase();
        if (word === "brand" || word === "product") return word;
        return null;
      }
    }
  }
  return null;
}

export function loadProjectContext(cwd = process.cwd()): ProjectContext {
  const contextDir = resolveContextDir(cwd);
  const productPath = firstExisting(contextDir, PRODUCT_NAMES);
  const designPath = firstExisting(contextDir, DESIGN_NAMES);
  const product = productPath ? safeRead(productPath) : null;
  const design = designPath ? safeRead(designPath) : null;
  return {
    hasProduct: !!product,
    product,
    productPath: productPath ? productPath.replace(`${cwd}/`, "") : null,
    hasDesign: !!design,
    design,
    designPath: designPath ? designPath.replace(`${cwd}/`, "") : null,
    contextDir,
    register: extractRegister(product),
  };
}

export function formatProjectContext(ctx: ProjectContext): string {
  if (!ctx.hasProduct) {
    return (
      "NO_PRODUCT_MD: This project has no PRODUCT.md yet. " +
      "Stop the current UI task, call get_command({ verb: \"init\" }) or get_reference({ name: \"project-init\" }), " +
      "and follow the init flow to write PRODUCT.md before resuming."
    );
  }
  const parts = [`# PRODUCT.md\n\n${ctx.product!.trim()}`];
  if (ctx.hasDesign) parts.push(`# DESIGN.md\n\n${ctx.design!.trim()}`);
  const register = ctx.register;
  parts.push(
    register
      ? `NEXT STEP: This project's register is \`${register}\`. Commit to the matching register tone from SKILL.md preflight before producing design output.`
      : "NEXT STEP: Infer register (brand vs product) from PRODUCT.md and SKILL.md preflight before producing design output.",
  );
  return parts.join("\n\n---\n\n");
}
