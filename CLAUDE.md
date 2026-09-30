# Portfolio — David Centeno Pedrido

Personal portfolio site for a senior data professional (10+ yrs: analytics engineering,
ML, product/business analytics). Goal: a page that reads as built by a very experienced
frontend engineer — restrained, precise, fast, with purposeful motion.

## Where things live

| Path | Purpose |
|---|---|
| `CLAUDE.md` | This file. Rules + orientation. Keep it short. |
| `docs/PLAN.md` | Phased build plan, architecture, section list, decision log. **Update as work progresses.** |
| `docs/DESIGN.md` | Design system: type, color, spacing, motion principles, signature interactions. |
| `docs/QUESTIONS.md` | Open questions for David, with the default we assume until answered. |
| `content/profile.md` | Public-facing content source of truth (derived from the CV). Site copy comes from here. |
| `content/positioning.md` | **Internal, local only (gitignored).** Framing rules from the CV. Guides tone/ordering. Never render or commit. |
| `assets/source/` | Raw inputs (photo from CV, project imagery). Optimised copies go into the app's `public/`. |
| `David Centeno CV_full.docx` | Original CV. Read-only reference. |

## Hard rules

1. **Never modify the personal project repos.** `../resumatch` and `../reversegram-game`
   are read-only references. Copy assets out of them; never write into them.
2. **No invented facts.** Every employer, title, date, metric, and skill on the site must
   trace to `content/profile.md`. If a claim needs a number we don't have, leave it
   qualitative or add an entry to `docs/QUESTIONS.md`.
3. **Never publish the internal positioning section** (target roles, "what to avoid", etc.).
4. **Do not publish the phone number** unless David confirms it in `docs/QUESTIONS.md`.
5. **No em dashes ("—") anywhere in site copy** (David's request). Use commas, colons, parentheses
   or full stops instead; year ranges use an en dash with no spaces ("2022–2024").
6. Ask David (via `docs/QUESTIONS.md` + chat) instead of guessing on anything personal:
   photos, links, dates, wording of achievements.

## Positioning

Read `content/positioning.md` before writing or reordering any copy. It is **local only**
(gitignored, because this repo is public) and must never be committed or rendered on the site.

## Live projects (showcase)

- **ResuMatch** — https://www.tryresumatch.app/ (landing in Spanish). Next.js 14, Supabase
  (Postgres/Auth/Storage), Stripe, Anthropic API w/ forced tool calls, Turnstile, Vercel.
  Source: `../resumatch` (see its README for architecture detail).
- **UnDictionary** — https://undictionarygame.com/ . FastAPI (Python) backend on Railway,
  vanilla JS frontend on Vercel, LLM as semantic judge, GA event analytics.
  Source: `../reversegram-game/reversegram-game`.

## Commands

```bash
npm run dev      # http://localhost:3000 (also: .claude/launch.json → "portfolio")
npm run build    # production build — all routes static
npm run lint     # eslint (must be clean)
npx tsc --noEmit # typecheck
node scripts/capture-screens.mjs [rm|ud]  # re-shoot live-site screenshots (uses local Chrome)
node scripts/process-photo.mjs            # re-crop portrait from assets/source/
```

## Code map

- `src/content/site.ts` — all copy & data (edit here, not in components)
- `src/components/chrome.tsx` — Lenis smooth scroll, nav, theme, ⌘K palette, toast, scroll progress
- `src/components/LineageGraph.tsx` — hero DAG (desktop + mobile layouts)
- `src/components/primitives.tsx` — Reveal, Scramble, Magnetic, Spotlight, SectionHeading, Tag
- One file per section: `Hero`, `About`, `Experience`, `Projects`, `Skills`, `Contact`

## Engineering conventions

- Stack & rationale: see `docs/PLAN.md` → Architecture. Don't add deps without noting why there.
- TypeScript strict. Content lives in typed data files, not hard-coded in components.
- Motion must respect `prefers-reduced-motion` — every animation needs a reduced path.
- Performance budget: Lighthouse ≥ 95 on all four categories, LCP < 2.0s, CLS < 0.05,
  JS for first load kept lean (no heavy 3D libs unless justified in PLAN.md).
- Accessibility: semantic landmarks, visible focus states, AA contrast in both themes,
  keyboard-reachable everything.
- Responsive from 360px up; no horizontal scroll at any width.
- Verify visually in the browser pane (desktop + mobile preset) before calling a phase done.

## Workflow

1. Check `docs/QUESTIONS.md` for answered/unanswered items before starting a phase.
2. Work the current phase in `docs/PLAN.md`; tick items off and log decisions there.
3. New unknowns → add to `docs/QUESTIONS.md` with a proposed default, then ask in chat.
