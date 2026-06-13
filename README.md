<div align="center">

<img src="docs/designer-skill-mcp-logo.webp" alt="designer-skill" width="480" />


**Production-grade design skill for coding agents, delivered as an MCP server.**

[![npm version](https://img.shields.io/npm/v/designer-skill-mcp?style=flat-square&color=0ea5e9)](https://www.npmjs.com/package/designer-skill-mcp)
[![license](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](designer-skill-mcp/LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A520-6b7280?style=flat-square)](#build--dev)
[![tiers](https://img.shields.io/badge/tiers-guidance%20%2B%20active-6366f1?style=flat-square)](#two-tier-model)
[![agents](https://img.shields.io/badge/agents-8-7c3aed?style=flat-square)](#mcp-setup--all-8-clients)

[Architecture](#routing-map) · [Claude Code Plugin](#claude-code-plugin-recommended) · [Codex Plugin](#codex-plugin) · [Skill Setup](#skill-setup) · [Quick Setup](#quick-setup) · [Full MCP Configs](#mcp-setup--all-8-clients) · [Env Vars](#environment-variables)

```bash
npm i designer-skill-mcp
```

</div>

---

## What this is

**designer-skill** is a composite design reference for coding agents — a lightweight router (`skills/designer-skill/SKILL.md`) that dispatches to seven specialist reference files covering visual fundamentals, aesthetic systems, motion and interaction, engineering and performance, anti-AI-slop discipline, refactor/redesign loops, and a verb-driven command playbook. Any coding agent that reads these files gains an opinionated, production-grade design vocabulary before touching a single line of UI code.

**designer-skill-mcp** is the [Model Context Protocol](https://modelcontextprotocol.io) server that exposes designer-skill to any MCP-compatible client — Claude Code, Codex CLI, Cursor, VS Code, Kilo Code, Open Code, Pi, and pythinker. It ships in two tiers: a **Guidance tier** (no API key required) that hands the skill to your agent via tools, resources, and a prompt; and an **Active tier** (requires `ANTHROPIC_API_KEY`) that adds `apply_designer` — a Claude-backed tool that runs the full skill and returns a streamed audit, redesign, or build result.

---

## Routing Map

### The 7 Reference Files

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

## Two-Tier Model

| Guidance tier — no API key needed | Active tier — requires `ANTHROPIC_API_KEY` |
|---|---|
| `get_design_system` — returns the SKILL.md router | All guidance tools, plus: |
| `get_reference` — returns any of the 7 reference files | `apply_designer` — runs Claude loaded with the full skill |
| `dispatch_intent` — maps intent phrase → verbs + files | Streams a complete audit, redesign, critique, or build result |
| `anti_slop_checklist` — ship-gate checklist | Model override via `DESIGNER_MCP_MODEL` env var |
| `designer://skill` and `designer://reference/{name}` resources | No partial output — bound by the output-completeness contract |
| `design` prompt (bundles task + relevant skill context) | Default model: `claude-opus-4-8` |

> **Zero config to start.** Omit the `env` block from any MCP config below to run guidance-only. Your agent does the design work; the skill files guide it. Add `ANTHROPIC_API_KEY` only when you want Claude to do the work directly via `apply_designer`.

---

## Claude Code Plugin (recommended)

This repo is a **plugin** and its own **marketplace** — for both Claude Code and Codex. One install gets you both the `designer-skill` skill and the `designer-skill` MCP server:

```
/plugin marketplace add Pythoughts-labs/designer-skill
/plugin install designer-skill@pythoughts-labs
```

What the plugin ships:

- **Skill** — `skills/designer-skill/` (router + 7 reference files), invocable as `designer-skill`.
- **MCP server** — `designer-skill-mcp` via `npx` (`.mcp.json`), guidance tier with zero config. Add `ANTHROPIC_API_KEY` to your environment to unlock the `apply_designer` active tier.

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

No API key required for skill-only use — your Claude Code session supplies the model.

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

> **Pythinker and Codex CLI use the same setup** — an identical `command` / `args` / `env` server definition. Pythinker writes it as YAML (`mcpServers:`), Codex as TOML (`[mcp_servers.*]`). Configure Pythinker once and the Codex config below is the same thing in a different file format.

Add to `~/.pythinker/config.yaml`:

**Guidance-only:**
```yaml
mcpServers:
  designer-skill:
    command: npx
    args: ["-y", "designer-skill-mcp"]
```

<details>
<summary>Active tier — adds <code>apply_designer</code> (requires <code>ANTHROPIC_API_KEY</code>)</summary>

```yaml
mcpServers:
  designer-skill:
    command: npx
    args: ["-y", "designer-skill-mcp"]
    env:
      ANTHROPIC_API_KEY: sk-ant-...
```

</details>

---

### Codex CLI

Same server definition as Pythinker above, managed via the `codex` CLI (or as TOML in `~/.codex/config.toml`):

**Guidance-only:**
```bash
codex mcp add designer-skill -- npx -y designer-skill-mcp
```

<details>
<summary>Active tier — adds <code>apply_designer</code> (requires <code>ANTHROPIC_API_KEY</code>)</summary>

```bash
codex mcp add designer-skill --env ANTHROPIC_API_KEY=sk-ant-... -- npx -y designer-skill-mcp
```

Or edit `~/.codex/config.toml` directly:

```toml
[mcp_servers.designer-skill]
command = "npx"
args = ["-y", "designer-skill-mcp"]
env = { ANTHROPIC_API_KEY = "sk-ant-..." }
```

</details>

---

### Claude Code

**Guidance-only:**
```bash
claude mcp add designer-skill -- npx -y designer-skill-mcp
```

**Active tier:**
```bash
claude mcp add designer-skill -e ANTHROPIC_API_KEY=sk-ant-... -- npx -y designer-skill-mcp
```

---

### Pi

Add to Pi's MCP server config:

**Guidance-only:**
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

<details>
<summary>Active tier — adds <code>apply_designer</code> (requires <code>ANTHROPIC_API_KEY</code>)</summary>

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

</details>

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
    config_file: ~/.pythinker/config.yaml
    format: yaml
    key: mcpServers
  codex_cli:
    cli_command: "codex mcp add designer-skill -- npx -y designer-skill-mcp"
    config_file: ~/.codex/config.toml
    format: toml
    key: mcp_servers
  claude_code:
    cli_command: "claude mcp add designer-skill -- npx -y designer-skill-mcp"
    active_tier: "claude mcp add designer-skill -e ANTHROPIC_API_KEY=<key> -- npx -y designer-skill-mcp"
  pi:
    format: json
    key: mcpServers

guidance_only:
  command: npx
  args: ["-y", "designer-skill-mcp"]

active_tier:
  command: npx
  args: ["-y", "designer-skill-mcp"]
  env:
    ANTHROPIC_API_KEY: "<your-anthropic-api-key>"
```

</details>

---

## MCP Setup — All 8 Clients

Add the `designer-skill` server to your agent's MCP config. Each block below shows two variants:

- **Guidance-only** — no `env` block, no API key required.
- **Active** — adds `ANTHROPIC_API_KEY` to enable `apply_designer`.

> **Pythinker first, Codex right behind** — both use the same server definition (`command` / `args` / `env`). Pythinker writes it as YAML under `mcpServers:`; Codex writes the identical shape as TOML under `[mcp_servers.*]`. Learn one, you know both.

<details open>
<summary><strong>Pythinker</strong> — <code>~/.pythinker/config.yaml</code></summary>

Config file: `~/.pythinker/config.yaml`

**Guidance-only:**
```yaml
mcpServers:
  designer-skill:
    command: npx
    args:
      - "-y"
      - designer-skill-mcp
```

**Active (with `apply_designer`):**
```yaml
mcpServers:
  designer-skill:
    command: npx
    args:
      - "-y"
      - designer-skill-mcp
    env:
      ANTHROPIC_API_KEY: sk-ant-...
```

Same server shape as Codex CLI (below) — only the file format differs. Restart pythinker after saving.

</details>

<details>
<summary><strong>Codex CLI</strong> — <code>~/.codex/config.toml</code></summary>

Config file: `~/.codex/config.toml` (or project-scoped `.codex/config.toml` in trusted projects). The fastest path is the CLI:

```bash
codex mcp add designer-skill -- npx -y designer-skill-mcp
```

**Guidance-only:**
```toml
[mcp_servers.designer-skill]
command = "npx"
args = ["-y", "designer-skill-mcp"]
```

**Active (with `apply_designer`):**
```toml
[mcp_servers.designer-skill]
command = "npx"
args = ["-y", "designer-skill-mcp"]
env = { ANTHROPIC_API_KEY = "sk-ant-..." }
```

Same server shape as Pythinker (above), in TOML. Restart Codex after editing `config.toml`; verify with `/mcp` inside the Codex TUI.

</details>

<details>
<summary><strong>Claude Code</strong> — <code>claude_desktop_config.json</code></summary>

Config file: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Guidance-only:**
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

**Active (with `apply_designer`):**
```json
{
  "mcpServers": {
    "designer-skill": {
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

Restart Claude Desktop after saving. The server appears in the tools panel as `designer-skill`.

</details>

<details>
<summary><strong>Cursor</strong> — <code>.cursor/mcp.json</code></summary>

**Project-level** (`.cursor/mcp.json` at repo root):

**Guidance-only:**
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

**Active (with `apply_designer`):**
```json
{
  "mcpServers": {
    "designer-skill": {
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

**Global:** Open Cursor Settings → Features → MCP → **+ Add new MCP server**, then enter the command and args above. The global config is stored at `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/mcp.json` on macOS.

</details>

<details>
<summary><strong>VS Code</strong> — <code>.vscode/mcp.json</code></summary>

Config file: `.vscode/mcp.json` at workspace root. Requires VS Code 1.99+ (built-in MCP agent mode) or the MCP extension.

**Guidance-only:**
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

**Active (with `apply_designer`):**
```json
{
  "servers": {
    "designer-skill": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
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

**Guidance-only:**
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

**Active (with `apply_designer`):**
```json
{
  "mcpServers": {
    "designer-skill": {
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"],
      "disabled": false,
      "alwaysAllow": [],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

The server activates immediately — no VS Code restart needed.

</details>

<details>
<summary><strong>Open Code</strong> — <code>opencode.json</code></summary>

Config file: `opencode.json` at project root, or `~/.config/opencode/config.json` for global config.

**Guidance-only:**
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

**Active (with `apply_designer`):**
```json
{
  "mcp": {
    "designer-skill": {
      "type": "local",
      "command": ["npx", "-y", "designer-skill-mcp"],
      "environment": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

Open Code uses `mcp` (not `mcpServers`) and `environment` (not `env`) for its MCP server definitions. Restart Open Code after saving.

</details>

<details>
<summary><strong>Pi</strong> (<code>@earendil-works/pi-coding-agent</code>) — MCP config</summary>

Pi can use the skill natively (see [Skill Setup](#skill-setup)) or via MCP. For MCP, add to Pi's server config:

**Guidance-only:**
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

**Active (with `apply_designer`):**
```json
{
  "mcpServers": {
    "designer-skill": {
      "command": "npx",
      "args": ["-y", "designer-skill-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

See [`~/pi_setup.md`](~/pi_setup.md) for the full Pi config, extensions, and audit log.

</details>

---

## Tools Reference

| Tool | Requires key? | Purpose |
|---|---|---|
| `get_design_system` | no | Returns the `SKILL.md` router — call first (preflight order, precedence rule, routing map, ship gate). |
| `get_reference` | no | Returns one of the 7 reference files by name (e.g. `"aesthetic-systems"`, `"avoid-ai-slop"`). |
| `dispatch_intent` | no | Maps a natural-language request phrase to design verb(s) and the reference files to read. |
| `anti_slop_checklist` | no | Returns the ship-gate checklist from `avoid-ai-slop.md` — run before declaring any UI work done. |
| `apply_designer` | **yes** | Runs Claude loaded with the full designer-skill and streams a complete audit, redesign, or build result. |

**Resources:** `designer://skill` (the full SKILL.md) and `designer://reference/{name}` (any of the 7 reference files).

**Prompt:** `design` — accepts `task` (required) and `aesthetic` (optional) arguments; bundles the relevant skill context with your task into a single ready-to-run prompt.

---

## Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Active tier only | — | Enables the `apply_designer` tool. Omit to run guidance-only. |
| `DESIGNER_MCP_MODEL` | No | `claude-opus-4-8` | Override the model used by `apply_designer`. |

---

## Build & Dev

```bash
npm install
npm run build   # syncs skills/designer-skill/ → assets/skill/, compiles TypeScript to dist/
npm test        # 20 unit tests — no API calls, no key required
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
