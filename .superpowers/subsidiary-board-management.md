---
name: subsidiary-board-management
description: Full project save-game for the Subsidiary Board Management prototype — architecture, component inventory, design decisions, patterns, and current feature state. Load this at the start of any new session to resume with complete context.
---

# Save Game — Subsidiary Board Management

## What This Is

A **Next.js 14 prototype** for a corporate governance tool. It simulates a multi-entity board pack management workspace used by a company secretary overseeing 8 subsidiary entities. The core value proposition is **AI-agent-driven bulk actions across multiple entities simultaneously**.

Deployed on VibeSharing (Vercel). Push to `main` → auto-deploys in ~30–60s. Never use `vercel deploy` or the VibeSharing MCP `deploy_files` tool (it corrupts binary files). Only `git push origin main`.

**Deployment notes:**
- `out/` is gitignored — Vercel builds it via `npm run build` (do NOT commit `out/`)
- `vercel.json` must explicitly declare `"buildCommand": "npm run build"` and `"outputDirectory": "out"` or Vercel serves a 404
- When creating a new VibeSharing prototype, push to the new repo remote, then push `vercel.json` with those two fields to trigger the first successful build
- `import_repo` fails for repos already inside `vibesharing-prototypes` org — use `git remote add` + `git push` instead

---

## Tech Stack

- **Next.js 14** App Router, TypeScript, Tailwind CSS
- **Font**: Plus Jakarta Sans (weights 300/400/600 only via `next/font/google`)
- **No component library** — all UI is custom Tailwind + inline SVGs
- **No external APIs** — all data is inline mock data in `components/data.ts`
- For full visual spec, see `visual_direction.md` in the project root

---

## App Shell

```
TopNav (fixed, bg-white, ~48px)
└── Main content area (flex-1, overflow-y-auto, px-6 py-4)
    └── HomeContent (the only real page — app/page.tsx → HomeContent.tsx)
```

`<body>` is `h-screen overflow-hidden`. Scrolling happens inside the content area, not the page. The entity detail view (`/entity/[id]`) and edit view (`/entity/[id]/edit/[section]`) also exist but are secondary — the homepage is the primary canvas.

---

## Context Providers (wrap HomeContent)

| Provider | File | Purpose |
|---|---|---|
| `ProtoStateProvider` | `ProtoStateContext.tsx` | Global demo state: `'calm' \| 'busy' \| 'critical'`. A floating panel (injected via `proto-panel.js` script) lets the user switch states. Controls which cards/suggestions render. |
| `AgentActivityProvider` | `AgentActivityContext.tsx` | Global job registry. Cards `addJob()` when an action starts, `completeJob()` when done (after 30s timeout). Jobs carry `type`, `entityId`, `entityShortName`, `title`, `workflowSteps[]`, `destination?`. |

---

## Component Inventory

### Home Page Layout (`HomeContent.tsx`)
```
AgentActivityBanner    ← hero: status pill + headline + 3 metric boxes
QuickActionsBar        ← row of bulk-action tiles (mb-4)
BookBuilding           ← stacked action cards  ┐ flex-col gap-6
PlanningSuggestions    ← stacked action cards  ┘
AgentUsecaseHeroes     ← marketing-style feature highlights
Footer
```

---

### `AgentActivityBanner.tsx`
Status hero at the top. Three states driven by `useProtoState()`:
- **calm**: emerald pill, "Nothing urgent — but plenty you can get ahead on."
- **busy**: amber pill, `{total}` items pending
- **critical**: red pill, risks require disclosure review

Shows: status pill → large light headline → subtext → 3 metric boxes.
No longer shows any agent progress widget (removed — progress now lives inside individual cards).

---

### `QuickActionsBar.tsx`
Three equal-width tiles in a row. Overflow collapses to `+N ▾` dropdown via `ResizeObserver` (min tile width: 140px).

| Tile | Entities | Destination |
|---|---|---|
| Create Q3 Plan | All 8 | `forward-planner` |
| Create 2027 Plan | All 8 | `forward-planner` |
| Sync All Presenters | 3 (Apex, Nordic, Meridian) | `smart-book-builder` |

Clicking → `ConfirmActionModal` → on confirm → `addJob()` with 30s timeout → `completeJob()`.

---

### `BookBuilding.tsx`
Cards showing gaps/missing items in board packs. 7 items total across 3 proto states (VISIBLE_COUNT = 3, "Show N more" expander).

**Card categories**: `gap` | `overdue` | `assignment` | `signature` | `approval`

**State tracking per card**: `Record<number, { status: 'applying' | 'applied'; jobId?: string }>`

**Card lifecycle**:
1. **Pending** — white card, action + details buttons, card click opens `BookBuildingModal`
2. **Applying** — card stays readable, `AgentProgressWidget` inline (no CTA), `cursor-default`
3. **Applied** — green tinted card (`border-emerald-200 bg-emerald-50/40`), "Applied ✓" badge, "Check in Smart Book Builder ↗" emerald button → opens `RedirectModal`

All BookBuilding items route to `destination: 'smart-book-builder'`.

---

### `PlanningSuggestions.tsx`
Cards showing agenda/presenter changes driven by external events. 7 suggestions across 3 states.

**Source types**: `regulation` | `geopolitical` | `market` | `source-material` | `personnel` | `reorder`

Same card lifecycle as BookBuilding. Destination logic:
- `sourceType === 'reorder'` → `'forward-planner'`
- All other types → `'smart-book-builder'`

Has a **hover-reveal block** (hidden by default, slides in on hover): shows affected section + proposed edit text. Hidden when card is in applied state.

---

### `AgentProgressWidget.tsx` (shared component)
The milestone stepper widget. Used inline inside cards during the `applying` state.

Props: `job: AgentJob`, `onDismiss?: () => void` (optional — hides dismiss button when absent).

Features: step dots (pending/active/complete/stopped), animated ping on active step, `step-pop` animation on completion, Stop / Resume from here / Restart from beginning controls, "Check in [tool] ↗" link in done state.

The widget manages its own step-timing schedule (random weighted distribution across 30s total). Schedule is generated once on mount and never changes.

---

### `ConfirmActionModal.tsx`
Large centered modal (max-w-2xl, rounded-3xl) shown before any action starts.

Props: `entityIds[]`, `title`, `description`, `affectedSection?`, `proposedEdit?`, `actionLabel`, `badgeLabel`, `badgeClasses`, `onConfirm`, `onClose`.

Shows: badge + "N board packs will be updated" → large title → scrollable entity list (logo + name + country + next board date) → description → optional section chip + proposed edit block → footer with Cancel + confirm button.

Entrance: `confirmModalIn` keyframe (scale 0.96→1 + translateY 12→0, 220ms).

---

### `RedirectModal.tsx`
Small security-theatre interstitial (max-w-sm, rounded-3xl) shown when user clicks "Check in [tool]".

Props: `destination: 'smart-book-builder' | 'forward-planner'`, `onClose`.

Shows animated SSO → TLS → OAuth steps with top-edge progress bar. Auto-closes at 4s. `DEST_CONFIG` maps destination to `{ toolName, module }`.

---

### `AgentActivityContext.tsx`
```ts
export type AgentJobType = 'edit' | 'action'
export type RedirectDestination = 'smart-book-builder' | 'forward-planner'

export interface AgentJob {
  id: string
  type: AgentJobType
  entityId: number
  entityShortName: string
  title: string
  sectionTitle?: string
  sectionIndex?: number
  status: 'running' | 'done'
  startedAt: number
  workflowSteps?: string[]
  destination?: RedirectDestination
}
```

Methods: `addJob()` → returns id, `completeJob(id)`, `removeJob(id)`.

---

### `EntityLogo.tsx`
Tries to load `/logos/{slug}.png`. Falls back to coloured rounded square with initials.
Sizes: `sm` (w-7), `md` (w-9), `lg` (w-12). All `rounded-lg`.

---

### `data.ts`
The single source of truth for all mock data.
- `ENTITIES` — 8 entities (Meridian Capital UK, Apex Ventures DE, Horizon Digital FR, Nordvik Solutions SE, Iberian Partners ES, Alpine Holdings CH, Caledonian Trust SC, Pacific Rim SG)
- `BOOK_BUILDING_ITEMS` — 7 items, each with `entityIds: number[]`, `category`, `states: ProtoState[]`
- `PLANNING_SUGGESTIONS` — 7 suggestions, each with `entities: Array<{ entityId: number }>`, `sourceType`, `states: ProtoState[]`

---

### Other Components

| Component | Role |
|---|---|
| `TopNav.tsx` | App chrome. Logo SVG (Diligent red) + "Subsidiary Board Management" (`text-xs font-semibold`) + nav buttons + avatar |
| `Footer.tsx` | Footer with gradient divider + app name + copyright |
| `AgentUsecaseHeroes.tsx` | 3 marketing-style feature highlight cards below the action sections |
| `EntitySidebar.tsx` | Entity-specific sidebar on detail pages — filters book building items by `item.entityIds.includes(entity.id)` |
| `HomeSidePanel.tsx` | Right-side panel on home (entity list) |
| `ThemeSync.tsx` | Syncs dark/light mode from localStorage |
| `ProtoStateContext.tsx` | Provides `useProtoState()` hook |

---

## Key Patterns

### Parallel Progress
Multiple cards can be "applying" simultaneously — each tracks its own `jobId` in local `Record<number, { status, jobId }>` state. They independently look up their `AgentJob` from context via `agentActivity.jobs.find(j => j.id === entry.jobId)`.

### No Priority Bars
Priority bars were intentionally removed. Cards show: entity row → title → detail text → [widget or CTA]. No visual priority meter.

### Multi-Entity Per Card
`BookBuildingItem.entityIds: number[]` (not singular). Entity logos stack with `flex -space-x-2`. Badge shows entity count. All actions affect multiple entities at once.

### Applied State
Cards do NOT fade or disable when applied. They:
- Get green border + bg tint
- Badge swaps to "Applied ✓"
- Bottom area shows emerald "Check in [tool] ↗" button
- Card becomes `cursor-default` (non-clickable)

### Destination Routing
Every job carries a `destination?: RedirectDestination`. Clicking "Check in" opens `RedirectModal` with that destination. Mapping:
- Board pack editing → `smart-book-builder`
- Scheduling / planning → `forward-planner`

---

## Deployment

```bash
git add .
git commit -m "describe change"
git push origin main
# Vercel auto-deploys in ~30-60s
```

**Never**: `vercel deploy`, `vercel CLI`, VibeSharing MCP `deploy_files` (corrupts binary PNG files).

The `out/` directory is the static export — it gets regenerated by `npm run build`. Always commit it alongside source changes.

---

## Files to Know

```
app/
  layout.tsx          ← font, metadata ("Subsidiary Board Management"), body classes
  globals.css         ← all keyframe animations, CSS custom properties, utility classes
  page.tsx            ← thin wrapper, renders HomeContent

components/
  data.ts             ← ALL mock data (entities, book building items, planning suggestions)
  HomeContent.tsx     ← home page layout + provider wrappers
  AgentActivityContext.tsx  ← job registry (AgentJob type, addJob/completeJob/removeJob)
  AgentActivityBanner.tsx   ← hero banner (status-driven)
  QuickActionsBar.tsx       ← bulk action tiles row
  BookBuilding.tsx           ← book building action cards
  PlanningSuggestions.tsx    ← planning suggestion cards
  AgentProgressWidget.tsx    ← shared inline progress stepper
  ConfirmActionModal.tsx     ← pre-action confirmation modal
  RedirectModal.tsx          ← post-action SSO redirect interstitial
  EntityLogo.tsx             ← logo with fallback initials
  TopNav.tsx                 ← navigation bar

visual_direction.md   ← full visual identity spec (fonts, colours, animations, patterns)
```

---

## Session History (what was built)

1. Multi-entity cards — `entityId` → `entityIds[]` across all items
2. `ConfirmActionModal` — pre-action confirmation with entity list
3. `QuickActionsBar` — bulk action row with overflow handling
4. Applied state redesign — green tint, "Applied ✓" badge, "Check in" CTA button
5. `RedirectModal` — animated SSO/TLS/OAuth redirect interstitial
6. `AgentProgressWidget` — extracted to shared component, shown inline in cards
7. Priority bars removed — progress widget replaces them during applying state
8. Agent progress removed from hero banner — lives only in cards now
9. App renamed to "Subsidiary Board Management"
10. `visual_direction.md` — full visual identity document written
