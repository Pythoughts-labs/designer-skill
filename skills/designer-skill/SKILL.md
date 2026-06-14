---
name: designer-skill
description: Use when building, designing, redesigning, refactoring, polishing, auditing, or enhancing any web or app user interface — landing pages, marketing sites, dashboards, product UI, components, forms, or design systems. Use when an interface looks generic or "AI-made", or needs better typography, color, spacing, layout, hierarchy, motion, accessibility, or performance, or when adapting or hardening UI for production. For any coding agent doing frontend visual work. Not for backend logic, data pipelines, CLI tools, or non-UI code.
---

# designer-skill

A composite design skill: one consolidated, framework-agnostic reference any coding agent can use to **design, refactor, and enhance** UI — spanning visual fundamentals, opinionated aesthetic systems, motion and interaction, engineering and performance, anti-AI-slop discipline, and a verb-driven command playbook.

This file is the router. It is intentionally short. The substance lives in ten reference files under `reference/`; read this, then open the file(s) the task needs. Do not work from memory — open the owner file and use its concrete values.

## How to use it (session preflight)

Run this order before writing UI code:

0. **Check for project context files.** If `PRODUCT.md` / `DESIGN.md` exist at the project root, they are authoritative: `DESIGN.md` wins visual decisions, `PRODUCT.md` wins strategic/voice decisions, and `PRODUCT.md` anti-references beat the user's one-off prompt (they are the brand's standing position; the prompt is one moment). On greenfield work, offer to create them.
1. **Scope the surface and register.** What is it — landing page, marketing site, dashboard, product UI, component, form? Decide the register: **brand** (design *is* the product: marketing, landing, campaign, portfolio — distinctiveness is the bar) vs **product** (design *serves* the product: app, admin, dashboard, tool — earned familiarity is the bar). Infer from concrete signals — brand: routes like `/`, `/about`, `/pricing`, `/blog/*`, hero sections, big typography, scroll-driven sections; product: `/app/*`, `/dashboard`, `/settings`, auth routes, forms, data tables, app-shell components. Pick by first match: task cue → the surface in focus → the persisted register; the project default can be overridden per task (a product can still have a brand-register landing page). Write one sentence of physical scene (who uses this, where, under what light, in what mood) and let it force light-vs-dark and tone.
2. **Read at least one representative project file** (tokens, theme, global CSS, or a core component) before any UI code — even on net-new work, and even after loading a reference file. Learn the system that's already there; don't reinvent it.
3. **Commit to ONE aesthetic system** from `reference/aesthetic-systems.md` (Minimalist / Brutalist / Soft / High-end-Stitch / Brand-identity). One language per surface — never mix two systems' signatures.
4. **Run the category-reflex check** in `reference/avoid-ai-slop.md` (first-order + second-order) before committing to a palette/type direction.
5. **Build on the neutral baseline** (`reference/design-principles.md`) + the engineering layer (`reference/engineering-and-performance.md`), add motion last (`reference/motion-and-interaction.md`).
6. **For existing UI**, follow the audit → diagnose → redesign loop in `reference/refactor-and-redesign.md` instead of building from scratch — preserve functionality, change presentation surgically.
7. **Verify before done** (see the ship gate below).

To map a specific user request ("make it pop", "it feels off", "production-ready") to the right move, read `reference/command-playbook.md` — the intent→verb dispatch table. If the request clearly matches one verb ("fix the spacing" → layout, "rewrite this error" → clarify), load that verb's guidance and proceed as if it were invoked; if two verbs plausibly fit, ask once which one; with no clear match, run the general preflight above.

## Project context files

`PRODUCT.md` and `DESIGN.md` at the project root persist design decisions across sessions — read them in preflight step 0, offer to create them on greenfield work:

- **PRODUCT.md** — strategy: register (`brand`|`product`), users, product purpose, a 3-word brand personality, anti-references (named bad examples), 3-5 strategic design principles (strategic, never visual rules), accessibility commitments.
- **DESIGN.md** — the visual system: design tokens plus named rules. The full authoring recipe lives in `reference/refactor-and-redesign.md`.

## The reference files (routing map)

| Open this | When the task is about |
|---|---|
| `reference/design-principles.md` | Visual fundamentals — typography, spacing & rhythm, color & contrast, layout & grid, hierarchy, depth. The aesthetic-neutral baseline. |
| `reference/aesthetic-systems.md` | Choosing or executing a specific look — the 5 opinionated design languages and when to use which. Concrete palettes, fonts, shadow tokens. |
| `reference/motion-and-interaction.md` | What to animate, how fast, which curve; springs, micro-interactions, gestures, scroll, perceived performance, reduced-motion. |
| `reference/engineering-and-performance.md` | Component architecture, design tokens/CSS vars, hardware acceleration, responsive/fluid, accessibility, Core Web Vitals, framework-honest output, real-data hardening. |
| `reference/avoid-ai-slop.md` | Not looking "AI-made" — the cross-register ban-list, category-reflex checks, and the output-completeness contract. |
| `reference/refactor-and-redesign.md` | Improving existing UI without breaking it — audit, diagnose generic patterns, the redesign loop, image/reference-to-code. |
| `reference/command-playbook.md` | Which verb/move maps to the user's intent (build, polish, bolder, quieter, animate, harden, redesign, …). |
| `reference/interaction-design.md` | Cognitive laws (Fitts, Hick, Miller, Doherty), state machines, form design, navigation patterns, error UX, feedback loops, loading states, gestures, emotional timing. |
| `reference/visual-critique.md` | Seven-dimension critique instrument: visual hierarchy, composition, color, typography, affordance, information density, brand consistency. |
| `reference/design-systems.md` | Token architecture (global→semantic→component), motion system, component specs, naming conventions, theming, pattern library, color/type/spacing scales. |

## Precedence rule (read before treating any rule as absolute)

`reference/design-principles.md` is the **aesthetic-neutral baseline — the default lean**. When you commit to an aesthetic system, its scoped rules in `reference/aesthetic-systems.md` **override** the baseline. Examples: Inter is discouraged by default but **required** for Brutalist macro-type; pure white is discouraged by default but **is** the Minimalist canvas; blanket shadows are a cheap default but Soft **requires** diffused ambient shadows. Never treat a baseline "expensive vs cheap" verdict as law once a system is chosen — the system wins within its own surface.

There is a second axis: the aesthetic system beats the baseline, and **existing brand identity beats both**. Every reflex-reject list (fonts, lanes, palettes) governs *new* design choices only — on a variant or edit of a shipped surface, never second-guess the committed font, lane, or palette; identity preservation wins.

## Cross-file ownership (don't re-derive, read the owner)

Each fact has one home; cross-reference instead of duplicating.

- Contrast ratios, type ramp, spacing scale, layout model → `design-principles.md`
- Concrete palettes, fonts, shadow tokens, per-system rules → `aesthetic-systems.md`
- Easing curves, durations, spring config → `motion-and-interaction.md`
- GPU/hardware-accel, `will-change`, tokens, responsive, a11y engineering, CWV → `engineering-and-performance.md`
- Cognitive laws, state machines, form/nav patterns, error UX, loading states, emotional timing → `interaction-design.md`
- Dimensional critique scoring (7 dimensions) → `visual-critique.md`
- Token architecture, component specs, naming conventions, theming, color/type/spacing scales → `design-systems.md`

## The always-run ship gate

`reference/avoid-ai-slop.md` is the gate every task passes before you declare it done:

- Run its **Anti-Slop Checklist** (category-reflex, color, layout, type, eyebrows, fake content, copy, emoji, completeness, and the register-matched slop test: brand = "could a viewer say AI made that?", product = "would a user fluent in Linear/Figma/Notion trust this?").
- The **output-completeness contract** is binding for all code generation: deliver the full file/all components/all sections. No `// rest of code`, no placeholders, no "for brevity", no skeleton when a full implementation was asked for. Partial, placeholder, or truncated output is a hard failure.
- Verify accessibility and responsiveness against real values: text ≥4.5:1 (AA), focus-visible rings, reduced-motion alternative, no horizontal scroll, touch targets ≥44×44px, tested at 375/768/1440px.
