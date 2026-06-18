<div align="center">

<img src="docs/designer-skill-mcp-logo.webp" alt="designer-skill" width="480" />


**Production-grade design skill for coding agents, delivered as an MCP server.**

[![npm version](https://img.shields.io/npm/v/designer-skill-mcp?style=flat-square&color=0ea5e9)](https://www.npmjs.com/package/designer-skill-mcp)
[![agents](https://img.shields.io/badge/agents-8-7c3aed?style=flat-square)](#mcp-setup--all-8-clients)
[![npm downloads](https://img.shields.io/npm/dt/designer-skill-mcp?style=flat-square&color=c9a84c&labelColor=111111)](https://www.npmjs.com/package/designer-skill-mcp)

[Architecture](#routing-map) · [Pythinker Integration](#pythinker-integration) · [Claude Code Plugin](#claude-code-plugin-recommended) · [Codex Plugin](#codex-plugin) · [Skill Setup](#skill-setup) · [Quick Setup](#quick-setup) · [Full MCP Configs](#mcp-setup--all-8-clients)

```bash
npm i designer-skill-mcp
```

</div>

---

## What this is

**designer-skill** is a composite design reference for coding agents — a lightweight router (`skills/designer-skill/SKILL.md`) that dispatches to thirteen specialist reference files covering visual fundamentals, aesthetic systems, motion and interaction, engineering and performance, anti-AI-slop discipline, refactor/redesign loops, interaction design, visual critique, design systems, project init, craft flow, live mode, and a verb-driven command playbook. Any coding agent that reads these files gains an opinionated, production-grade design vocabulary before touching a single line of UI code.

**designer-skill-mcp** is the [Model Context Protocol](https://modelcontextprotocol.io) server that exposes designer-skill to any MCP-compatible client — Claude Code, Codex CLI, Cursor, VS Code, Kilo Code, Open Code, Pi, and pythinker. It hands the skill to your agent via tools, resources, and a prompt — your agent does the design work, guided by the skill files.

---

## Routing Map

### The 13 Reference Files

> These are design surfaces, not client platforms. The 8 supported agent clients are listed separately in [MCP Setup](#mcp-setup).

| Open this | When the task is about |
|---|---|
| `reference/design-principles.md` | Visual fundamentals — typography, spacing & rhythm, color & contrast, layout & grid, hierarchy, depth. The aesthetic-neutral baseline. |
| `reference/aesthetic-systems.md` | Choosing or executing a specific look — 5 opinionated design languages (Minimalist, Brutalist, Soft, High-end-Stitch, Brand-identity) with concrete palettes, fonts, and shadow tokens. |
| `reference/motion-and-interaction.md` | What to animate, how fast, which curve; springs, micro-interactions, gestures, scroll, perceived performance, reduced-motion. |
| `reference/engineering-and-performance.md` | Component architecture, design tokens/CSS vars, hardware acceleration, responsive/fluid, accessibility, Core Web Vitals, framework-honest output, real-data hardening. |
| `reference/avoid-ai-slop.md` | Not looking "AI-made" — the cross-register ban-list, category-reflex checks, and the output-completeness contract. |
| `reference/refactor-and-redesign.md` | Improving existing UI without breaking it — audit, diagnose generic patterns, the redesign loop, image/reference-to-code. |
| `reference/command-playbook.md` | Which verb/move maps to the user's intent (build, polish, bolder, quieter, animate, harden, redesign, …). |
| `reference/interaction-design.md` | Cognitive laws (Fitts, Hick, Miller, Doherty), state machines, form design, navigation patterns, error UX, feedback loops, loading states, gestures, emotional timing. |
| `reference/visual-critique.md` | Seven-dimension critique instrument: visual hierarchy, composition, color, typography, affordance, information density, brand consistency. |
| `reference/design-systems.md` | Token architecture (global→semantic→component), motion system, component specs, naming conventions, theming, pattern library, color/type/spacing scales. |
| `reference/project-init.md` | One-time project setup: discovery interview, PRODUCT.md, optional DESIGN.md, live-mode pre-config, next-command routing. |
| `reference/craft-flow.md` | Full shape-then-build pipeline with user gates, framework detection, visual iteration loop. |
| `reference/live-mode.md` | Interactive browser variant mode: element selection, HMR hot-swap, poll/steer/accept contract. |

### Intent → Verb Dispatch

The `dispatch_intent` tool maps a natural-language request to the design verb(s) and reference files an agent should load before acting.

| Intent phrase | Verb(s) | Files to read |
|---|---|---|
| "make it pop" | `bolder` · `colorize` | `aesthetic-systems`, `design-principles` |
| "it feels off" | `audit` · `diagnose` | `refactor-and-redesign`, `avoid-ai-slop` |
| "production-ready" | `harden` · `a11y` | `engineering-and-performance` |
| "add some motion" | `animate` | `motion-and-interaction` |
| "it looks AI-made" | `de-slop` · `differentiate` | `avoid-ai-slop`, `aesthetic-systems` |
| "redesign this" | `audit` · `redesign` | `refactor-and-redesign`, `command-playbook` |

### Session Preflight Order

Run this sequence before writing any UI code:

1. **Scope the surface and register** — landing page, dashboard, component, form? Decide register: **brand** (distinctiveness is the bar) vs **product** (earned familiarity is the bar).
2. **Commit to one aesthetic system** from `reference/aesthetic-systems.md` — one language per surface, never mix two systems' signatures.
3. **Run the category-reflex check** in `reference/avoid-ai-slop.md` before committing to a palette or type direction.
4. **Build on the neutral baseline** (`design-principles.md`) + engineering layer (`engineering-and-performance.md`), add motion last.
5. **For existing UI**, follow the audit → diagnose → redesign loop in `reference/refactor-and-redesign.md` instead of rebuilding from scratch.
6. **Run the ship gate** (`anti_slop_checklist` tool or `reference/avoid-ai-slop.md`) before declaring work done.

---

## MCP Server

| What you get | Notes |
|---|---|
| `get_design_system`, `load_project_context`, `get_reference`, `list_commands`, `get_command`, `dispatch_intent`, `detect_antipatterns`, `get_palette_seed`, `anti_slop_checklist` | Core designer-skill guidance + deterministic detector |
| `designer://skill`, `designer://reference/{name}` resources | Fetch skill content by URI |
| `design` prompt | Bundles task + relevant skill context |

> **Zero config.** Add the server and your agent does the work.

---

## Pythinker Integration

> Full walkthrough with troubleshooting: [docs/blog/integrating-designer-skill-with-pythinker.md](docs/blog/integrating-designer-skill-with-pythinker.md)

### Prerequisites

- **Pythinker CLI v0.38.0+** — `pythinker --version` ([install](https://pythoughts-labs.github.io/pythinker-code/))
- **Node.js 18+** — the MCP server runs via `npx`

### Method 1 — one-liner (recommended)

```bash
pythinker mcp add --transport stdio designer-skill -- npx -y designer-skill-mcp
```

Restart Pythinker (or run `/mcp reconnect` in the TUI).

### Method 2 — edit `mcp.json` by hand

Pythinker v0.38.0+ stores MCP servers in `~/.pythinker/mcp.json` (confirm with `pythinker mcp list`):

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

### Verify

```bash
pythinker mcp list
pythinker mcp test designer-skill
```

Inside the TUI: `/mcp` should list `designer-skill`; `/tools` should show `mcp_designer-skill_*` tools.

### Invoke from Pythinker

No special command — ask in natural language:

```
Use the designer-skill to redesign this pricing page without breaking functionality.
```

```
Audit the homepage for accessibility and AI-slop tells. Report only — don't change code yet.
```

The agent calls `get_design_system` → `dispatch_intent` → `get_reference` → works → `anti_slop_checklist` before finishing.

### Disable / re-enable

```bash
pythinker mcp remove designer-skill
pythinker mcp add --transport stdio designer-skill -- npx -y designer-skill-mcp
```

---

## Claude Code Plugin (recommended)

This repo is a **plugin** and its own **marketplace** — for both Claude Code and Codex. One install gets you both the `designer-skill` skill and the `designer-skill` MCP server:

```
/plugin marketplace add Pythoughts-labs/designer-skill
/plugin install designer-skill@pythoughts-labs
```

What the plugin ships:

- **Skill** — `skills/designer-skill/` (router + 10 reference files), invocable as `designer-skill`.
- **MCP server** — `designer-skill-mcp` via `npx` (`.mcp.json`), zero config.

To verify after install: `/plugin` lists the plugin, `/mcp` shows the `designer-skill` server, and the skill appears in the Skill tool list.

## Codex Plugin

The same repo doubles as a Codex plugin (`.codex-plugin/plugin.json`); Codex reads `.claude-plugin/marketplace.json` as a legacy-compatible marketplace. In the Codex CLI:

```bash
codex plugin marketplace add Pythoughts-labs/designer-skill
```

Then open `/plugins` in Codex, select the **pythoughts-labs** marketplace, and install **designer-skill**. Plugin-installed skills are namespaced, so it appears as `designer-skill:designer-skill`.

**Skill-only alternative** — install just the skill into your local Codex setup:

```
Use $skill-installer to install the designer-skill skill from https://github.com/Pythoughts-labs/designer-skill (skills/designer-skill)
```

or copy it manually:

```bash
cp -r skills/designer-skill/ ~/.codex/skills/designer-skill/
```

Restart Codex after installing; invoke with `$designer-skill` or let it trigger on design tasks.

---

## Skill Setup

For agents that support native skill or prompt-file loading (not MCP).

### Claude Code (manual copy)

Prefer the [plugin install](#claude-code-plugin-recommended) above. To install just the skill by hand, copy `skills/designer-skill/` into your Claude Code skills directory:

```bash
# Option A — copy into project skills
cp -r skills/designer-skill/ .claude/skills/designer-skill/

# Option B — copy into global skills
cp -r skills/designer-skill/ ~/.claude/skills/designer-skill/
```

Claude Code picks up the skill via the `name: designer-skill` frontmatter in `SKILL.md`. Invoke it with the Skill tool:

```
Use the designer-skill to [your task]
```

### Pi (`@earendil-works/pi-coding-agent`)

Register the skill by pointing Pi at the `SKILL.md` entry point. Pi reads the `name` and `description` frontmatter for routing, so no additional config is needed beyond the file path:

```json
{
  "skills": [
    {
      "path": "/path/to/skills/designer-skill/SKILL.md"
    }
  ]
}
```

Pi will route design-intent prompts to the skill automatically based on the `description` field in the frontmatter.

---

## Quick Setup

> **For AI agents reading this repo:** All commands below are copy-paste ready.
> Package: `designer-skill-mcp` — <https://www.npmjs.com/package/designer-skill-mcp>
> Repo: <https://github.com/Pythoughts-labs/designer-skill>

The four configs below cover the most common agent runtimes. [Full reference for all 8 clients ↓](#mcp-setup--all-8-clients)

---

### Pythinker

See [Pythinker Integration](#pythinker-integration) for the full guide. Quick version:

```bash
pythinker mcp add --transport stdio designer-skill -- npx -y designer-skill-mcp
```

---

### Codex CLI

Same server definition as Pythinker above, managed via the `codex` CLI (or as TOML in `~/.codex/config.toml`):

```bash
codex mcp add designer-skill -- npx -y designer-skill-mcp
```

---

### Claude Code

```bash
claude mcp add designer-skill -- npx -y designer-skill-mcp
```

---

### Pi

Add to Pi's MCP server config:

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

---

<details>
<summary><strong>Structured config reference — all 4 agents (AI-readable)</strong></summary>

```yaml
# designer-skill-mcp — structured config reference
# Source: https://github.com/Pythoughts-labs/designer-skill
# Package: https://www.npmjs.com/package/designer-skill-mcp
# Command (all clients): npx -y designer-skill-mcp

agents:
  # pythinker and codex_cli share the same command/args/env server shape;
  # only the file format differs (YAML mcpServers vs TOML [mcp_servers.*]).
  pythinker:
    cli_command: "pythinker mcp add --transport stdio designer-skill -- npx -y designer-skill-mcp"
    config_file: ~/.pythinker/mcp.json
    format: json
    key: mcpServers
  codex_cli:
    cli_command: "codex mcp add designer-skill -- npx -y designer-skill-mcp"
    config_file: ~/.codex/config.toml
    format: toml
    key: mcp_servers
  claude_code:
    cli_command: "claude mcp add designer-skill -- npx -y designer-skill-mcp"
  pi:
    format: json
    key: mcpServers

server:
  command: npx
  args: ["-y", "designer-skill-mcp"]

```

</details>

---

## MCP Setup — All 8 Clients

Add the `designer-skill` server to your agent's MCP config.

> **Pythinker first** — use `pythinker mcp add` or edit `~/.pythinker/mcp.json`. Codex uses the same server shape in TOML under `[mcp_servers.*]`.

<details open>
<summary><strong>Pythinker</strong> — <code>~/.pythinker/mcp.json</code></summary>

**CLI (recommended):**

```bash
pythinker mcp add --transport stdio designer-skill -- npx -y designer-skill-mcp
```

**Or edit** `~/.pythinker/mcp.json` (path shown by `pythinker mcp list`):

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

Restart Pythinker or run `/mcp reconnect`. Verify with `pythinker mcp test designer-skill`.

Full guide: [integrating-designer-skill-with-pythinker.md](docs/blog/integrating-designer-skill-with-pythinker.md)

</details>

<details>
<summary><strong>Codex CLI</strong> — <code>~/.codex/config.toml</code></summary>

Config file: `~/.codex/config.toml` (or project-scoped `.codex/config.toml` in trusted projects). The fastest path is the CLI:

```bash
codex mcp add designer-skill -- npx -y designer-skill-mcp
```

```toml
[mcp_servers.designer-skill]
command = "npx"
args = ["-y", "designer-skill-mcp"]
```

Same server shape as Pythinker (above), in TOML. Restart Codex after editing `config.toml`; verify with `/mcp` inside the Codex TUI.

</details>

<details>
<summary><strong>Claude Code</strong> — <code>claude_desktop_config.json</code></summary>

Config file: `~/Library/Application Support/Claude/claude_desktop_config.json`

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

Restart Claude Desktop after saving. The server appears in the tools panel as `designer-skill`.

</details>

<details>
<summary><strong>Cursor</strong> — <code>.cursor/mcp.json</code></summary>

**Project-level** (`.cursor/mcp.json` at repo root):

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

**Global:** Open Cursor Settings → Features → MCP → **+ Add new MCP server**, then enter the command and args above. The global config is stored at `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/mcp.json` on macOS.

</details>

<details>
<summary><strong>VS Code</strong> — <code>.vscode/mcp.json</code></summary>

Config file: `.vscode/mcp.json` at workspace root. Requires VS Code 1.99+ (built-in MCP agent mode) or the MCP extension.

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

Note the VS Code-specific format: `servers` (not `mcpServers`) and the required `"type": "stdio"` field. Reload the VS Code window after saving.

</details>

<details>
<summary><strong>Kilo Code</strong> — MCP Settings panel</summary>

Kilo Code stores MCP servers at:
`~/Library/Application Support/Code/User/globalStorage/kilocode.kilo-code/settings/mcp_settings.json` (macOS)

The fastest path is via the UI: open the Kilo Code panel → **MCP Servers** → **Edit MCP Settings**, then add:

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

The server activates immediately — no VS Code restart needed.

</details>

<details>
<summary><strong>Open Code</strong> — <code>opencode.json</code></summary>

Config file: `opencode.json` at project root, or `~/.config/opencode/config.json` for global config.

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

Open Code uses `mcp` (not `mcpServers`) and `environment` (not `env`) for its MCP server definitions. Restart Open Code after saving.

</details>

<details>
<summary><strong>Pi</strong> (<code>@earendil-works/pi-coding-agent</code>) — MCP config</summary>

Pi can use the skill natively (see [Skill Setup](#skill-setup)) or via MCP. For MCP, add to Pi's server config:

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

See [`~/pi_setup.md`](~/pi_setup.md) for the full Pi config, extensions, and audit log.

</details>

---

## Tools Reference

| Tool | Purpose |
|---|---|
| `get_design_system` | Returns the `SKILL.md` router — call first (preflight order, precedence rule, routing map, ship gate). |
| `get_reference` | Returns one of the ten reference files by name (e.g. `"aesthetic-systems"`, `"avoid-ai-slop"`). |
| `dispatch_intent` | Maps a natural-language request phrase to design verb(s) and the reference files to read. |
| `anti_slop_checklist` | Returns the ship-gate checklist from `avoid-ai-slop.md` — run before declaring any UI work done. |

**Resources:** `designer://skill`, `designer://reference/{name}`.

**Prompt:** `design` — accepts `task` (required) and `aesthetic` (optional) arguments; bundles the relevant skill context with your task into a single ready-to-run prompt.

---

---

## Build & Dev

```bash
npm install
npm run build   # syncs skills/designer-skill/ → assets/skill/, compiles TypeScript to dist/
npm test        # unit tests — no API calls, no key required
```

**HTTP mode** (for hosting or remote clients):

```bash
node dist/index.js --http --port 3017             # binds 127.0.0.1 (safe default)
node dist/index.js --http --port 3017 --host 0.0.0.0  # expose publicly — add your own auth/proxy
```

Point HTTP clients at `http://127.0.0.1:3017/mcp` (Streamable HTTP transport). The HTTP server includes an Origin guard against DNS-rebinding; there is no built-in auth layer for public exposure.

**Local checkout** (instead of `npx`): replace `"command": "npx", "args": ["-y", "designer-skill-mcp"]` in any config block above with `"command": "node", "args": ["/abs/path/to/designer-skill-mcp/dist/index.js"]`.

---

MIT License · [designer-skill-mcp](designer-skill-mcp/) · [designer-skill](skills/designer-skill/)
