# designer-skill-mcp

An [MCP](https://modelcontextprotocol.io) server that exposes **designer-skill** — a consolidated reference for designing, refactoring, and enhancing UI.

The server hands skill content to your coding agent via tools, resources, and a `design` prompt. Includes a deterministic anti-pattern detector (44 rules).

## What it exposes

| Tool | Purpose |
|---|---|
| `get_design_system` | The `SKILL.md` router — call first (preflight, precedence rule, routing map, ship gate). |
| `load_project_context` | Read PRODUCT.md / DESIGN.md from the project; gates on missing PRODUCT.md → init. |
| `get_reference` | One of the thirteen reference files by name. |
| `list_commands` | All design verbs (init, craft, live, audit, polish, …) with descriptions. |
| `get_command` | Full guidance + reference files for a specific verb. |
| `dispatch_intent` | Maps a request ("make it pop", "it feels off") → design verb(s) + files to read. |
| `detect_antipatterns` | Deterministic scan of a file/dir for UI anti-patterns (44 rules). |
| `get_palette_seed` | OKLCH brand-seed color for greenfield palette composition. |
| `anti_slop_checklist` | The anti-AI-slop ship gate to run before declaring work done. |

**Resources:** `designer://skill`, `designer://reference/{name}`

**Prompts:** `design` (args: `task`, optional `aesthetic`)

## Install & build

```bash
npm install
npm run build
npm test
```

Canonical content: `skills/designer-skill/` (synced to `assets/skill/` on build). Detector engine: `assets/engine/`.

## Run

```bash
node dist/index.js
# or: npx -y designer-skill-mcp

# HTTP
node dist/index.js --http --port 3017
```

## Client configuration

```json
{
  "mcpServers": {
    "designer-skill": {
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"]
    }
  }
}
```

## License

MIT
