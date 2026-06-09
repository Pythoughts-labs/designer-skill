# Command Playbook

This is the intent-to-action dispatch table for Designer-Skill. Find the verb whose intent cue matches what the user wants, then read the file(s) in its Read column before you touch anything. The Read column points only to sibling reference files in this skill; open them, do not guess from memory. One verb usually owns the task; if two fit, pick the dominant intent and let the other's file be a secondary read. Concrete values in the moves are starting points, not laws.

## Dispatch table

| Verb | When to invoke (intent cue) | What it does (concrete moves) | Read |
|---|---|---|---|
| build / craft | "build / make / create" a feature, page, or component end-to-end | Set baseline (type, spacing, contrast), commit to one aesthetic language, wire motion + tokens, ship production code with real content and all states | design-principles.md, aesthetic-systems.md, engineering-and-performance.md, avoid-ai-slop.md |
| shape | "plan / spec / think through" a feature before code | Run a short discovery pass, pick color strategy + a one-sentence physical scene + 2-3 named anchor references, produce a brief; write no code | design-principles.md, aesthetic-systems.md |
| audit | "check / review the implementation, a11y, perf, responsive" | Score accessibility, performance, theming, responsive, anti-patterns 0-4; tag findings P0-P3 with fix + suggested verb; fix nothing | engineering-and-performance.md, avoid-ai-slop.md, refactor-and-redesign.md |
| critique | "is this good? / design review / does this feel AI?" | Design-director read: hierarchy, IA, cognitive load, heuristics, emotional journey; lead with the AI-slop verdict; list 3-5 priority issues | design-principles.md, avoid-ai-slop.md |
| polish | "final pass / tighten before shipping" | Align to the design system, snap spacing to scale, complete every interaction state (hover/focus/active/disabled/loading/error), fix optical alignment, 150-300ms transitions | design-principles.md, engineering-and-performance.md |
| bolder | "too safe / bland / make it pop" | Amplify hierarchy: 3-5x scale jumps, weight 900 vs 200, one color owns ~60%, break the grid; reject gradient-text/glass/neon first | aesthetic-systems.md, avoid-ai-slop.md |
| quieter | "too loud / busy / aggressive" | Reduce intensity: desaturate to 70-85%, neutrals carry weight with accent ~10%, flatten cards, shorten motion to 10-20px; keep the POV | design-principles.md, aesthetic-systems.md |
| overdrive | "extraordinary / push past limits / wow" | Highest-ambition effects (View Transitions, scroll-driven, WebGL, virtual scroll). Propose 2-3 directions, get user pick, then build with graceful fallback at 60fps | motion-and-interaction.md, engineering-and-performance.md |
| animate | "add motion / it feels static / smooth this" | Add purposeful motion: 100/300/500ms by tier, ease-out-quart, sibling stagger (not section fade), reduced-motion alternative required | motion-and-interaction.md |
| delight | "personality / memorable / charm" | Earn specific moments (success, empty, error recovery) with custom copy + micro-interactions under ~1s; never on every interaction, never generic AI filler | motion-and-interaction.md, avoid-ai-slop.md |
| layout | "fix spacing / hierarchy / it feels off" | 4pt scale (4/8/12/16/24/32/48/64/96), tight grouping vs 48-96px section gaps, flex for 1D + grid for 2D, break card-grid monotony, pass the squint test | design-principles.md |
| typeset | "typography / fonts / hierarchy" | Replace invisible defaults, 5-size scale at >=1.25 ratio, weight + size + space hierarchy, 65-75ch measure, font-display: swap, cap 3 families | design-principles.md |
| colorize | "flat / grayscale / add color" | Pick a color strategy first, OKLCH ramp, 60-30-10 weight, tinted neutrals toward the brand hue, semantic meaning consistent, body text >=4.5:1 | design-principles.md, aesthetic-systems.md |
| harden | "production-ready / edge cases / real data" | Survive long/empty/CJK/RTL/emoji text, all API error states with recovery, 30-40% i18n space budget, no fixed text widths, server-side validation | engineering-and-performance.md |
| optimize | "slow / janky / perf" | Measure first, fix the actual bottleneck: LCP<2.5s, INP<200ms, CLS<0.1; image formats + lazy load, code split, transform/opacity over layout props | engineering-and-performance.md |
| distill | "too complex / cluttered / strip it back" | Remove elements that don't earn their place: one primary goal, progressive disclosure, 1-2 colors + neutrals, flatten nesting, halve the copy | design-principles.md |
| extract | "make reusable / tokens / design system" | Pull patterns used 3+ times with the same intent into tokens + components with a clear props API, migrate call sites, delete the old; avoid premature abstraction | engineering-and-performance.md |
| brand | "brand identity / distinctive look / not generic" | Choose an aesthetic language and a named reference, run the font-selection procedure (reject training-data defaults + saturated lanes), commit a palette strategy | aesthetic-systems.md, avoid-ai-slop.md |
| adapt | "mobile / tablet / different device or context" | Rethink the experience for the target (not scale pixels): single-column reflow, 44x44px touch targets, detect pointer/hover, content-driven breakpoints, safe-area insets | engineering-and-performance.md, refactor-and-redesign.md |
| redesign | "improve / fix this existing UI without breaking it" | Audit current state, diagnose generic AI patterns and drift, run the redesign loop preserving function; image-to-code when matching a visual target | refactor-and-redesign.md, avoid-ai-slop.md |

## The intensity dial

The toning verbs sit on one axis:

`quieter ← distill ← (polish / baseline) → bolder → overdrive`

Move **right** when the design is timid, low-contrast, generic, or forgettable: `bolder` for stronger hierarchy and committed color, `overdrive` when the brief wants a technically extraordinary moment (propose 2-3 directions and get user confirmation before building). Move **left** when the design is loud, noisy, or cluttered: `quieter` *reduces intensity* (desaturate, flatten, calm the motion) while keeping every element; `distill` goes further and *removes elements* down to the essence. `polish` is the neutral center: it refines what's there without shifting the volume in either direction.

## Always-run gate

Every verb ends by running the avoid-ai-slop.md Anti-Slop Checklist before declaring done; it is the universal ship gate even when it is not in a row's Read column. Partial, placeholder, or truncated output is a hard failure under the output-completeness contract in avoid-ai-slop.md.
