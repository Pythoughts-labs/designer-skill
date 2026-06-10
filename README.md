<div align="center">

<img src="docs/banner.svg" alt="Designer-Skill" width="720" />


**Production-grade design guidance for coding agents — delivered as an MCP server.**

[![npm version](https://img.shields.io/npm/v/designer-skill-mcp?style=flat-square\&color=0ea5e9)](https://www.npmjs.com/package/designer-skill-mcp)
[![license](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](designer-skill-mcp/LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A520-6b7280?style=flat-square)](#build--dev)
[![tiers](https://img.shields.io/badge/tiers-guidance%20%2B%20active-6366f1?style=flat-square)](#two-tier-model)
[![clients](https://img.shields.io/badge/clients-8-7c3aed?style=flat-square)](#mcp-setup--all-clients)

[Overview](#overview) · [Quick Start](#quick-start) · [Routing Map](#routing-map) · [Skill Setup](#skill-setup) · [MCP Setup](#mcp-setup--all-clients) · [Tools](#tools-reference) · [Env Vars](#environment-variables)

</div>

---

## Overview

**designer-skill** is a structured design system for coding agents.

It gives agents a production-grade design vocabulary before they write UI code: typography, spacing, layout, visual hierarchy, aesthetic systems, motion, accessibility, performance, anti-AI-slop checks, and redesign/refactor workflows.

The repo contains two connected parts:

| Package              | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `Designer-Skill/`    | The skill source: a router file plus seven specialist design references. |
| `designer-skill-mcp` | An MCP server that exposes the skill to MCP-compatible coding agents.    |

The MCP server works in two modes:

| Mode              |        API key required? | What it does                                                                                                                                     |
| ----------------- | -----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Guidance tier** |                       No | Exposes the skill through MCP tools, resources, and prompts. Your agent uses the references to do the design work.                               |
| **Active tier**   | Yes, `ANTHROPIC_API_KEY` | Adds `apply_designer`, a Claude-backed tool that runs the full skill directly and streams a complete audit, redesign, critique, or build result. |

Supported clients include Claude Code, Codex CLI, Cursor, VS Code, Kilo Code, Open Code, Pi, and pythinker.

---

## Quick Start

### Use with `npx`

No global install is required:

```bash
npx -y designer-skill-mcp
```

### Add to an MCP client

Most MCP clients use this basic shape:

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

### Enable the active tier

Add `ANTHROPIC_API_KEY` only when you want the server to run `apply_designer` directly:

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

> Omit the `env` block for guidance-only mode. The server still exposes the skill files, routing tools, checklist, resources, and prompt.

---

## What Designer-Skill Gives an Agent

Designer-Skill helps coding agents avoid generic UI output by forcing a stronger design workflow:

1. **Scope the surface** — landing page, dashboard, form, component, marketing site, internal tool.
2. **Choose a register** — brand surface or product surface.
3. **Select one aesthetic system** — avoid mixing incompatible visual languages.
4. **Apply design fundamentals** — typography, spacing, layout, contrast, hierarchy, depth.
5. **Harden the implementation** — accessibility, responsive behavior, real data, performance.
6. **Add motion intentionally** — transitions, springs, gestures, reduced-motion support.
7. **Run an anti-slop ship gate** — check for generic AI patterns before declaring the work done.

---

## Routing Map

Designer-Skill is organized around one router and seven focused reference files.

| File                                       | Use it for                                                                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Designer-Skill/SKILL.md`                  | Main router, precedence rules, preflight order, routing map, and ship gate.                                                         |
| `reference/design-principles.md`           | Typography, spacing, rhythm, color, contrast, layout, grid, hierarchy, and depth.                                                   |
| `reference/aesthetic-systems.md`           | Five opinionated design languages: Minimalist, Brutalist, Soft, High-end-Stitch, and Brand Identity.                                |
| `reference/motion-and-interaction.md`      | Motion timing, easing, springs, micro-interactions, gestures, scrolling, perceived performance, and reduced motion.                 |
| `reference/engineering-and-performance.md` | Component architecture, design tokens, CSS variables, responsive behavior, accessibility, Core Web Vitals, and real-data hardening. |
| `reference/avoid-ai-slop.md`               | Anti-generic checks, category-reflex rules, cross-register ban list, and output-completeness contract.                              |
| `reference/refactor-and-redesign.md`       | Existing UI audits, diagnosis, redesign loops, and image/reference-to-code workflows.                                               |
| `reference/command-playbook.md`            | Verb-driven design actions such as build, polish, bolder, quieter, animate, harden, redesign, de-slop, and differentiate.           |

---

## Intent Dispatch

The `dispatch_intent` tool maps natural-language design requests to the right design verbs and reference files.

| User intent                 | Design verbs               | Reference files                             |
| --------------------------- | -------------------------- | ------------------------------------------- |
| “Make it pop.”              | `bolder`, `colorize`       | `aesthetic-systems`, `design-principles`    |
| “It feels off.”             | `audit`, `diagnose`        | `refactor-and-redesign`, `avoid-ai-slop`    |
| “Make it production-ready.” | `harden`, `a11y`           | `engineering-and-performance`               |
| “Add some motion.”          | `animate`                  | `motion-and-interaction`                    |
| “It looks AI-made.”         | `de-slop`, `differentiate` | `avoid-ai-slop`, `aesthetic-systems`        |
| “Redesign this.”            | `audit`, `redesign`        | `refactor-and-redesign`, `command-playbook` |

---

## Recommended Agent Preflight

Before writing or modifying UI code, the agent should run this sequence:

1. **Identify the surface**

   * Landing page, dashboard, component, form, marketing page, app shell, or internal tool.

2. **Choose the register**

   * **Brand surface:** distinctiveness is the bar.
   * **Product surface:** clarity, usability, and earned familiarity are the bar.

3. **Commit to one aesthetic system**

   * Use one visual language per surface.
   * Do not mix multiple systems’ signature patterns.

4. **Run the category-reflex check**

   * Avoid default palettes, default gradients, predictable cards, generic SaaS spacing, and AI-looking decoration.

5. **Build from the neutral baseline**

   * Use `design-principles.md` and `engineering-and-performance.md` first.
   * Add motion only after the static design works.

6. **For existing UI, audit before rebuilding**

   * Follow the audit → diagnose → redesign loop from `refactor-and-redesign.md`.

7. **Run the ship gate**

   * Use `anti_slop_checklist` or `avoid-ai-slop.md` before calling the design complete.

---

## Two-Tier Model

| Guidance tier — no API key required                          | Active tier — requires `ANTHROPIC_API_KEY`                     |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| `get_design_system` returns the main `SKILL.md` router.      | Includes all guidance-tier tools.                              |
| `get_reference` returns any of the seven reference files.    | Adds `apply_designer`.                                         |
| `dispatch_intent` maps a request to design verbs and files.  | Runs Claude with the full Designer-Skill context.              |
| `anti_slop_checklist` returns the ship-gate checklist.       | Streams a complete audit, critique, redesign, or build result. |
| `designer://skill` exposes the full skill router.            | Supports model override with `DESIGNER_MCP_MODEL`.             |
| `designer://reference/{name}` exposes individual references. | Follows the output-completeness contract.                      |
| `design` prompt bundles task context with the skill.         | Default model: `claude-opus-4-8`.                              |

Or edit `~/.codex/config.toml` directly:

## Skill Setup

Use this section for agents that support native skill or prompt-file loading without MCP.

### Claude Code

Copy or symlink `Designer-Skill/` into a Claude Code skills directory:

```bash
# Project-level skill
cp -r Designer-Skill/ .claude/skills/designer-skill/

# Global skill
cp -r Designer-Skill/ ~/.claude/skills/designer-skill/
```

Claude Code reads the skill through the frontmatter in `SKILL.md`.

Invoke it with:

```text
Use the Designer-Skill to redesign this dashboard.
```

No API key is required for native skill usage. Your Claude Code session supplies the model.

---

### Pi (`@earendil-works/pi-coding-agent`)

Register the skill by pointing Pi to the `SKILL.md` entry point:

```json
{
  "skills": [
    {
      "path": "/path/to/Designer-Skill/SKILL.md"
    }
  ]
}
```

Pi can route design-related tasks to the skill using the `name` and `description` frontmatter.

---

## MCP Setup — All Clients

Add the `designer-skill` server to your MCP client.

Each setup includes:

* **Guidance-only:** no API key.
* **Active tier:** adds `ANTHROPIC_API_KEY` to enable `apply_designer`.

---

### Claude Code

Guidance-only:

```bash
claude mcp add designer-skill -- npx -y designer-skill-mcp
```

Active tier:

```bash
claude mcp add designer-skill \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -- npx -y designer-skill-mcp
```

---

### Codex CLI

Config file:

```text
~/.codex/config.yaml
```

Guidance-only:

```yaml
mcpServers:
  designer-skill:
    command: npx
    args:
      - "-y"
      - designer-skill-mcp
```

Active tier:

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

Codex CLI reads the config on each invocation.

---

### pythinker

Config file:

```text
~/.pythinker/config.yaml
```

Guidance-only:

```yaml
mcpServers:
  designer-skill:
    command: npx
    args:
      - "-y"
      - designer-skill-mcp
```

Active tier:

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

Restart pythinker after saving the config.

---

### Cursor

Project-level config file:

```text
.cursor/mcp.json
```

Guidance-only:

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

Active tier:

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

For global setup, open Cursor Settings → Features → MCP → Add new MCP server.

---

### VS Code

Workspace config file:

```text
.vscode/mcp.json
```

VS Code uses `servers`, not `mcpServers`, and requires `"type": "stdio"`.

Guidance-only:

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

Active tier:

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

Reload the VS Code window after saving.

---

### Kilo Code

Kilo Code MCP settings are stored at:

```text
~/Library/Application Support/Code/User/globalStorage/kilocode.kilo-code/settings/mcp_settings.json
```

The recommended path is through the UI:

```text
Kilo Code panel → MCP Servers → Edit MCP Settings
```

Guidance-only:

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

Active tier:

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

The server should activate immediately after saving.

---

### Open Code

Project config file:

```text
opencode.json
```

Global config file:

```text
~/.config/opencode/config.json
```

Open Code uses `mcp`, not `mcpServers`, and `environment`, not `env`.

Guidance-only:

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

Active tier:

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

Restart Open Code after saving.

---

### Pi

Pi can use Designer-Skill natively or through MCP.

Guidance-only:

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

Active tier:

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

---

## AI-Readable Config Reference

```yaml
# designer-skill-mcp
# Package: designer-skill-mcp
# Command: npx -y designer-skill-mcp

guidance_only:
  command: npx
  args:
    - "-y"
    - designer-skill-mcp

active_tier:
  command: npx
  args:
    - "-y"
    - designer-skill-mcp
  env:
    ANTHROPIC_API_KEY: "<your-anthropic-api-key>"

clients:
  claude_code:
    setup: "claude mcp add designer-skill -- npx -y designer-skill-mcp"

  codex_cli:
    config_file: "~/.codex/config.yaml"
    root_key: mcpServers
    format: yaml

  pythinker:
    config_file: "~/.pythinker/config.yaml"
    root_key: mcpServers
    format: yaml

  cursor:
    config_file: ".cursor/mcp.json"
    root_key: mcpServers
    format: json

  vscode:
    config_file: ".vscode/mcp.json"
    root_key: servers
    required_type: stdio
    format: json

  kilo_code:
    config_file: "~/Library/Application Support/Code/User/globalStorage/kilocode.kilo-code/settings/mcp_settings.json"
    root_key: mcpServers
    format: json

  open_code:
    config_file: "opencode.json or ~/.config/opencode/config.json"
    root_key: mcp
    env_key: environment
    format: json

  pi:
    root_key: mcpServers
    format: json
```

---

## Tools Reference

| Tool                  | Requires key? | Purpose                                                                                                             |
| --------------------- | ------------: | ------------------------------------------------------------------------------------------------------------------- |
| `get_design_system`   |            No | Returns the main `SKILL.md` router. Call this first for routing, preflight order, precedence rules, and ship gate.  |
| `get_reference`       |            No | Returns one of the seven reference files by name.                                                                   |
| `dispatch_intent`     |            No | Maps a natural-language design request to design verbs and reference files.                                         |
| `anti_slop_checklist` |            No | Returns the anti-slop ship-gate checklist.                                                                          |
| `apply_designer`      |           Yes | Runs Claude with the full Designer-Skill context and streams a complete audit, redesign, critique, or build result. |

---

## Resources

| Resource                      | Purpose                        |
| ----------------------------- | ------------------------------ |
| `designer://skill`            | Full `SKILL.md` router.        |
| `designer://reference/{name}` | Any individual reference file. |

Available reference names:

```text
design-principles
aesthetic-systems
motion-and-interaction
engineering-and-performance
avoid-ai-slop
refactor-and-redesign
command-playbook
```

---

## Prompt

The server exposes a `design` prompt.

Arguments:

| Argument    | Required | Purpose                                              |
| ----------- | -------: | ---------------------------------------------------- |
| `task`      |      Yes | The design, redesign, audit, or implementation task. |
| `aesthetic` |       No | Optional aesthetic direction to bias the response.   |

Example:

```text
design(
  task: "Redesign this pricing page to feel more premium and less generic.",
  aesthetic: "High-end-Stitch"
)
```

---

## Environment Variables

| Variable             |         Required | Default           | Purpose                                                         |
| -------------------- | ---------------: | ----------------- | --------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`  | Active tier only | —                 | Enables the `apply_designer` tool. Omit for guidance-only mode. |
| `DESIGNER_MCP_MODEL` |               No | `claude-opus-4-8` | Overrides the model used by `apply_designer`.                   |

---

## Build & Dev

Install dependencies:

```bash
npm install
```

Build the MCP server:

```bash
npm run build
```

The build syncs:

```text
Designer-Skill/ → assets/skill/
```

Then compiles TypeScript to:

```text
dist/
```

Run tests:

```bash
npm test
```

The test suite requires no API calls and no API key.

---

## HTTP Mode

Run the server over Streamable HTTP transport:

```bash
node dist/index.js --http --port 3017
```

By default, the HTTP server binds to:

```text
127.0.0.1
```

Expose it publicly only behind your own authentication and proxy layer:

```bash
node dist/index.js --http --port 3017 --host 0.0.0.0
```

HTTP endpoint:

```text
http://127.0.0.1:3017/mcp
```

The HTTP server includes an Origin guard against DNS rebinding. It does not include a built-in public authentication layer.

---

## Local Checkout Usage

To run from a local checkout instead of `npx`, replace:

```json
{
  "command": "npx",
  "args": ["-y", "designer-skill-mcp"]
}
```

with:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/designer-skill-mcp/dist/index.js"]
}
```

---

## Security Notes

* Do not commit API keys to your repo.
* Use guidance-only mode when you only need skill references.
* Add `ANTHROPIC_API_KEY` only when you need `apply_designer`.
* Public HTTP exposure should be protected by your own auth, proxy, and network controls.
* Treat generated design/code output as a draft until reviewed, tested, and checked for accessibility.

---

## License

MIT License.

---

<div align="center">

**designer-skill-mcp** · **Designer-Skill**

</div>
