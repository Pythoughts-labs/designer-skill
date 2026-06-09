# designer-skill-mcp

An [MCP](https://modelcontextprotocol.io) server that exposes the **Designer-Skill** — a consolidated reference for designing, refactoring, and enhancing UI — to any MCP client (Claude Desktop, Cursor, Cline, Windsurf, …).

Two tiers:

- **Guidance tier (no API key):** tools and resources that hand the skill to *your* coding agent, plus a `design` prompt and an intent→file dispatcher. Your agent does the work, guided by the skill.
- **Active tier (needs `ANTHROPIC_API_KEY`):** an `apply_designer` tool that runs Claude loaded with the skill and returns the generated audit / redesign / critique / build.

## What it exposes

**Tools**
| Tool | Key? | Purpose |
|---|---|---|
| `get_design_system` | no | The `SKILL.md` router — call first (preflight, precedence rule, routing map, ship gate). |
| `get_reference` | no | One of the seven reference files by name. |
| `dispatch_intent` | no | Maps a request ("make it pop", "it feels off") → design verb(s) + files to read. |
| `anti_slop_checklist` | no | The anti-AI-slop ship gate to run before declaring work done. |
| `apply_designer` | **yes** | Runs Claude with the skill to do the work and return the result. |

**Resources:** `designer://skill` and `designer://reference/{name}` (the 7 reference files).
**Prompts:** `design` (args: `task`, optional `aesthetic`) — bundles the relevant skill context + your task.

## Install & build

```bash
npm install
npm run build        # syncs Designer-Skill → assets/skill, compiles to dist/
npm test             # in-memory transport + dispatch tests (no API calls)
```

The canonical content lives in the sibling `Designer-Skill/` folder; `npm run build` copies it into `assets/skill/` so the published package is self-contained.

## Run

```bash
# stdio (default) — for desktop/editor MCP clients
node dist/index.js
# or, once published:  npx -y designer-skill-mcp

# Streamable HTTP — for hosting
node dist/index.js --http --port 3017            # binds 127.0.0.1
node dist/index.js --http --port 3017 --host 0.0.0.0   # expose (add your own auth/proxy)
```

Set `ANTHROPIC_API_KEY` to enable `apply_designer`; override the model with `DESIGNER_MCP_MODEL` (default `claude-opus-4-8`).

## Client configuration

**Claude Desktop / Cursor / Cline / Windsurf** (`mcpServers` block), stdio:

```json
{
  "mcpServers": {
    "designer-skill": {
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"],
      "env": { "ANTHROPIC_API_KEY": "sk-ant-..." }
    }
  }
}
```

(Omit `env` to run guidance-only with no key. For a local checkout, use `"command": "node", "args": ["/abs/path/designer-skill-mcp/dist/index.js"]`.)

**HTTP client:** point it at `http://127.0.0.1:3017/mcp` (Streamable HTTP).

## Notes / scope

- HTTP is **stateless** and binds `127.0.0.1` with an Origin guard against DNS-rebinding. Exposing it publicly (`--host 0.0.0.0`) means you supply auth/a reverse proxy — there is no built-in auth layer.
- The active tier streams the model response and asks for complete, production-ready output (no placeholders), per the skill's output-completeness contract.

## License

MIT
