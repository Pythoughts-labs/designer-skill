<div align="center">

<img src="docs/designer-skill-mcp-logo.webp" alt="designer-skill" width="400" />

**Plug-and-play MCP. UI superpowers for your agent.**

<br />

[![plug_and_play](https://img.shields.io/badge/plug_&_play-zero_config-10b981?style=for-the-badge)](#setup)
[![npm](https://img.shields.io/npm/v/designer-skill-mcp?style=for-the-badge&logo=npm&logoColor=white&color=0ea5e9)](https://www.npmjs.com/package/designer-skill-mcp)
[![downloads](https://img.shields.io/npm/dt/designer-skill-mcp?style=for-the-badge&logo=npm&logoColor=white&color=c9a84c&label=DOWNLOADS)](https://www.npmjs.com/package/designer-skill-mcp)
[![license](https://img.shields.io/badge/license-MIT-10b981?style=for-the-badge)](LICENSE)

<br />

[![agents](https://img.shields.io/badge/agents-8-7c3aed?style=for-the-badge)](#setup)
[![references](https://img.shields.io/badge/references-13-e11d48?style=for-the-badge)](#reference)
[![tools](https://img.shields.io/badge/MCP_tools-10-0ea5e9?style=for-the-badge)](#tools)
[![detector](https://img.shields.io/badge/detector-44_rules-f59e0b?style=for-the-badge)](#tools)

<br />

[Overview](#overview) · [Setup](#setup) · [Reference](#reference) · [Tools](#tools) · [Development](#development)

```bash
npm i designer-skill-mcp
```

</div>

<br />

<div align="center">

[![overview](https://img.shields.io/badge/Overview-18181b?style=for-the-badge)](#overview)

</div>

**designer-skill-mcp** is a small [MCP](https://modelcontextprotocol.io) server you add in one line. Your agent gets design tools, reference docs, and a ship gate so UI work stops looking generic.

**What your agent gains:**

| Superpower | What it does |
|---|---|
| **Route** | `dispatch_intent` maps "make it pop" or "it feels off" to the right move |
| **Know** | 13 reference files: type, color, motion, a11y, anti-slop, redesign loops |
| **Check** | 44-rule detector + `anti_slop_checklist` before shipping |

Add the server. Ask in plain language. The agent handles the rest.

<div align="center">

[![skill](https://img.shields.io/badge/design_skill-13_refs-7c3aed?style=flat-square)](skills/designer-skill/)
[![mcp](https://img.shields.io/badge/MCP-10_tools-0ea5e9?style=flat-square)](designer-skill-mcp/)

</div>

<br />

<div align="center">

[![setup](https://img.shields.io/badge/Setup-0ea5e9?style=for-the-badge)](#setup)

</div>

### Plugin (recommended)

<div align="center">

[![claude](https://img.shields.io/badge/Claude_Code-plugin-7c3aed?style=flat-square)](#setup)
[![codex](https://img.shields.io/badge/Codex-plugin-10b981?style=flat-square)](#setup)

</div>

One install gets both the skill and the MCP server:

```
/plugin marketplace add Pythoughts-labs/designer-skill
/plugin install designer-skill@pythoughts-labs
```

Codex CLI:

```bash
codex plugin marketplace add Pythoughts-labs/designer-skill
```

Then install **designer-skill** from the **pythoughts-labs** marketplace in `/plugins`. The skill appears as `designer-skill:designer-skill`.

### Plug in (any client)

Same one-liner everywhere. No API key. No config files to write by hand:

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

<div align="center">

[![pythinker](https://img.shields.io/badge/Pythinker-0ea5e9?style=flat-square)](docs/blog/integrating-designer-skill-with-pythinker.md)
[![codex](https://img.shields.io/badge/Codex_CLI-10b981?style=flat-square)](https://github.com/openai/codex)
[![claude](https://img.shields.io/badge/Claude_Code-c15a3c?style=flat-square)](https://claude.ai/code)
[![cursor](https://img.shields.io/badge/Cursor-18181b?style=flat-square)](https://cursor.com)
[![vscode](https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com)
[![kilo](https://img.shields.io/badge/Kilo_Code-7c3aed?style=flat-square)](https://kilocode.ai)
[![opencode](https://img.shields.io/badge/Open_Code-e11d48?style=flat-square)](https://opencode.ai)
[![pi](https://img.shields.io/badge/Pi-f59e0b?style=flat-square)](https://github.com/earendil-works/pi-coding-agent)

</div>

| Client | Quick install |
|---|---|
| **Pythinker** | `pythinker mcp add --transport stdio designer-skill -- npx -y designer-skill-mcp` · [guide](docs/blog/integrating-designer-skill-with-pythinker.md) |
| **Codex CLI** | `codex mcp add designer-skill -- npx -y designer-skill-mcp` |
| **Claude Code** | `claude mcp add designer-skill -- npx -y designer-skill-mcp` |
| **Cursor** | `.cursor/mcp.json` or Settings → MCP |
| **VS Code** | `.vscode/mcp.json` (`"servers"` + `"type": "stdio"`) |
| **Kilo Code** | MCP Settings → `mcp_settings.json` |
| **Open Code** | `opencode.json` (key `"mcp"`) |
| **Pi** | MCP config or native skill path |

<details>
<summary><strong>Per-client config snippets</strong></summary>

**Pythinker** (`~/.pythinker/mcp.json`)

```json
{ "mcpServers": { "designer-skill": { "command": "npx", "args": ["-y", "designer-skill-mcp"] } } }
```

Verify: `pythinker mcp test designer-skill` · TUI: `/mcp` lists the server, `/tools` shows `mcp_designer-skill_*`.

**Codex CLI** (`~/.codex/config.toml`)

```toml
[mcp_servers.designer-skill]
command = "npx"
args = ["-y", "designer-skill-mcp"]
```

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`)

```json
{ "mcpServers": { "designer-skill": { "command": "npx", "args": ["-y", "designer-skill-mcp"] } } }
```

**Cursor** (`.cursor/mcp.json` at repo root, same JSON shape as Pythinker)

**VS Code** (`.vscode/mcp.json`, requires 1.99+ or MCP extension)

```json
{
  "servers": {
    "designer-skill": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"]
    }
  }
}
```

**Kilo Code** (MCP Settings → Edit MCP Settings)

```json
{
  "mcpServers": {
    "designer-skill": {
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

**Open Code** (`opencode.json` or `~/.config/opencode/config.json`)

```json
{
  "mcp": {
    "designer-skill": {
      "type": "local",
      "command": ["npx", "-y", "designer-skill-mcp"]
    }
  }
}
```

**Pi** (MCP config, same JSON as Pythinker, or register the skill natively):

```json
{ "skills": [{ "path": "/path/to/skills/designer-skill/SKILL.md" }] }
```

</details>

### Skill-only

<div align="center">

[![skill_copy](https://img.shields.io/badge/skill--only-no_MCP-71717a?style=flat-square)](#setup)

</div>

```bash
cp -r skills/designer-skill/ ~/.claude/skills/designer-skill/   # Claude Code
cp -r skills/designer-skill/ ~/.codex/skills/designer-skill/     # Codex
```

Invoke with the Skill tool or `$designer-skill` on design tasks.

### Invoke

<div align="center">

```
Use designer-skill to redesign this pricing page without breaking functionality.
```

`get_design_system` → `dispatch_intent` → `get_reference` → work → `anti_slop_checklist`

</div>

<br />

<div align="center">

[![reference](https://img.shields.io/badge/Reference-e11d48?style=for-the-badge)](#reference)

</div>

### Files

| File | Use when |
|---|---|
| `design-principles.md` | Typography, spacing, color, layout, hierarchy (neutral baseline) |
| `aesthetic-systems.md` | Picking a look: 5 systems with palettes, fonts, shadows |
| `motion-and-interaction.md` | Animation timing, springs, scroll, reduced-motion |
| `engineering-and-performance.md` | Tokens, a11y, responsive, Core Web Vitals, real-data hardening |
| `avoid-ai-slop.md` | Ban-list, category-reflex checks, output-completeness contract |
| `refactor-and-redesign.md` | Audit → diagnose → redesign without breaking behavior |
| `command-playbook.md` | Intent → verb dispatch (build, polish, bolder, harden, …) |
| `interaction-design.md` | Fitts/Hick/Miller, forms, navigation, errors, loading states |
| `visual-critique.md` | Seven-dimension critique instrument |
| `design-systems.md` | Token architecture, component specs, theming |
| `project-init.md` | Discovery interview, PRODUCT.md, DESIGN.md setup |
| `craft-flow.md` | Shape-then-build pipeline with user gates |
| `live-mode.md` | Browser variant mode: element select, HMR, poll/steer/accept |

<div align="center">

[![core](https://img.shields.io/badge/core-7-0ea5e9?style=flat-square)](#reference)
[![extended](https://img.shields.io/badge/extended-6-e11d48?style=flat-square)](#reference)

</div>

### Intent → verb

| Phrase | Verb(s) | Read |
|---|---|---|
| "make it pop" | `bolder` · `colorize` | `aesthetic-systems`, `design-principles` |
| "it feels off" | `audit` · `diagnose` | `refactor-and-redesign`, `avoid-ai-slop` |
| "production-ready" | `harden` · `a11y` | `engineering-and-performance` |
| "add some motion" | `animate` | `motion-and-interaction` |
| "it looks AI-made" | `de-slop` · `differentiate` | `avoid-ai-slop`, `aesthetic-systems` |
| "redesign this" | `audit` · `redesign` | `refactor-and-redesign`, `command-playbook` |

### Preflight

1. Scope the surface: **brand** register (distinctiveness) vs **product** register (earned familiarity).
2. Commit to one aesthetic system; never mix two signatures on one surface.
3. Run the category-reflex check in `avoid-ai-slop.md`.
4. Build on `design-principles.md` + `engineering-and-performance.md`; add motion last.
5. For existing UI, audit → diagnose → redesign. Do not rebuild from scratch.
6. Run the ship gate (`anti_slop_checklist`) before declaring done.

<br />

<div align="center">

[![tools](https://img.shields.io/badge/MCP_Tools-0ea5e9?style=for-the-badge)](#tools)

</div>

| Tool | Purpose |
|---|---|
| `get_design_system` | SKILL.md router (call first) |
| `load_project_context` | Read PRODUCT.md / DESIGN.md from the project |
| `get_reference` | One of thirteen reference files by name |
| `list_commands` | All design verbs with descriptions |
| `get_command` | Full guidance + references for a specific verb |
| `dispatch_intent` | Map a request → verb(s) + files to read |
| `detect_antipatterns` | Deterministic scan (44 rules), no LLM, no API key |
| `get_palette_seed` | OKLCH brand-seed for greenfield palette work |
| `anti_slop_checklist` | Ship gate: run before finishing any UI work |

<div align="center">

[![resources](https://img.shields.io/badge/resources-designer://skill-7c3aed?style=flat-square)](#tools)
[![prompt](https://img.shields.io/badge/prompt-design-10b981?style=flat-square)](#tools)

</div>

**Resources:** `designer://skill` · `designer://reference/{name}`

**Prompt:** `design` (args: `task` required, `aesthetic` optional)

<br />

<div align="center">

[![development](https://img.shields.io/badge/Development-f59e0b?style=for-the-badge)](#development)

</div>

```bash
cd designer-skill-mcp
npm install
npm run build   # syncs skills/designer-skill/ → assets/skill/, compiles TypeScript
npm test
```

**HTTP mode** (remote clients):

```bash
node dist/index.js --http --port 3017             # 127.0.0.1 (default)
node dist/index.js --http --port 3017 --host 0.0.0.0  # public: add auth/proxy
```

Endpoint: `http://127.0.0.1:3017/mcp` (Streamable HTTP). Includes Origin guard against DNS-rebinding; no built-in auth for public exposure.

**Local checkout:** replace `npx` with `"command": "node", "args": ["/abs/path/to/designer-skill-mcp/dist/index.js"]` in any config above.

<br />

<div align="center">

[![MIT](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)](LICENSE)
[![package](https://img.shields.io/badge/designer--skill--mcp-0ea5e9?style=flat-square)](designer-skill-mcp/)
[![skill](https://img.shields.io/badge/designer--skill-7c3aed?style=flat-square)](skills/designer-skill/)

</div>
