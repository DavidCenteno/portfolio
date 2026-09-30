# Design direction (confirmed 2026-09-29: dark technical/editorial)

## Concept: "From raw data to decisions"

The whole page is structured like a data pipeline — the thing David actually does. Sections
are *layers*: `raw → staging → models → marts → decisions`. It's a quiet, credible metaphor
that a hiring manager in data will recognise instantly, without being a gimmick.

## Signature moments

1. **Hero lineage graph** — an SVG/canvas DAG (sources → dbt-style models → dashboards/ML →
   "decision") that draws itself on load; particles travel along edges. Nodes react to the
   cursor. Reduced-motion: static graph.
2. **Scroll-driven career timeline** — a vertical "commit log / lineage" line that fills as you
   scroll; each role snaps in with its promotion path shown as branching nodes
   (Senior → Lead → Interim Head).
3. **Project showcases** — large device-framed screenshots of ResuMatch & UnDictionary with a
   subtle 3D tilt on hover, plus an "architecture" toggle that reveals the system diagram
   (e.g. Next.js → Claude tool call → Supabase → Stripe webhook).
4. **Skills as a query** — a monospace "SQL" block that types out
   `select skill, years from david where ...` and resolves into a grouped result table.
5. **Command palette (⌘K)** — jump to sections, copy email, open LinkedIn/CV. A senior-dev tell.
6. Small craft details: magnetic buttons, cursor-follow spotlight on cards, text-scramble on
   section labels, smooth scrolling, page-load stagger, view transitions for theme toggle.

## Visual language

- **Theme:** dark-first (near-black, slightly warm) with a light theme toggle.
- **Accent:** one signal color used sparingly (proposal: electric lime `#C6F432` or
  cyan `#5EE6FF`) — for live data, active nodes, links.
- **Type:** display — *Instrument Serif* or *Fraunces* (editorial contrast) for big headings;
  UI/body — *Inter* / *Geist*; data/labels — *JetBrains Mono* / *Geist Mono*.
- **Grid:** 12-col, generous whitespace, thin 1px hairlines, subtle dot/grid background.
- **Texture:** faint noise overlay, soft radial glows behind focal elements. No stock illustrations.

## Motion principles

- Motion explains structure (flow, hierarchy, causality) — never decoration for its own sake.
- Easing: custom `cubic-bezier(0.22, 1, 0.36, 1)`; durations 200–700ms; stagger 40–80ms.
- Transform/opacity only; no layout-thrashing animations. 60fps on a mid-range laptop.
- Full `prefers-reduced-motion` fallback for every effect.
