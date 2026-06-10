# designer-skill

Production-grade design skill for coding agents, plus the `designer-skill-mcp` MCP server that serves it to any MCP client.

## Layout

- `skills/designer-skill/` — the canonical skill: `SKILL.md` router + 7 reference files under `reference/`. Open `SKILL.md` first; it routes to the reference file each design task needs.
- `designer-skill-mcp/` — TypeScript MCP server (npm: `designer-skill-mcp`). `npm run build` copies the skill into `assets/skill/` so the package is self-contained.
- `.claude-plugin/` — Claude Code plugin manifest + marketplace (also read by Codex as a legacy-compatible marketplace).
- `.codex-plugin/` — Codex plugin manifest.
- `.mcp.json` — plugin-bundled MCP server config (shared by Claude Code and Codex plugins).

## For design tasks in any project

Read `skills/designer-skill/SKILL.md` and follow its session preflight before writing UI code. Run its anti-slop ship gate before declaring UI work done.

## Build & test (designer-skill-mcp/)

```bash
npm install
npm run build   # syncs skills/designer-skill/ → assets/skill/, compiles to dist/
npm test        # vitest, no API key needed
```

Editing the skill content means editing `skills/designer-skill/` only — `designer-skill-mcp/assets/skill/` is generated, never edit it by hand.
