# Visual Direction — Subsidiary Board Management

This document describes the complete visual identity and design system of this prototype. Its purpose is to allow another agent or developer to faithfully recreate this look and feel in a new project.

---

## 1. Stack & Setup

- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS (utility-first, no component library)
- **Language**: TypeScript + React
- **Font loading**: `next/font/google`

---

## 2. Typography

### Typeface
**Plus Jakarta Sans** — a geometric sans-serif with a corporate-modern feel. Load at weights `300`, `400`, and `600` only. No bold (700) — rely on `600` for headings.

```tsx
import { Plus_Jakarta_Sans } from "next/font/google"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
})
```

Apply via `font-sans antialiased` on `<body>`.

### Size Scale
The project uses a **tight, dense type scale** — most UI is smaller than conventional defaults. All sizes are set directly in `text-[Npx]` Tailwind arbitrary values, not semantic classes like `text-sm`.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page hero headline | `text-[2.5rem]` | `font-light` (300) | Letter-spacing `tracking-[-0.02em]` |
| Card title | `text-[16px]` | `font-semibold` (600) | Line-height `leading-[1.35]` |
| Modal title | `text-[22px]` | `font-semibold` | |
| Body text | `text-[13px]` or `text-[14px]` | `font-normal` (400) | `leading-relaxed` |
| Secondary/meta | `text-[12px]` or `text-[11px]` | `font-normal` | Muted colour |
| Section labels | `text-[11px]` | `font-semibold` | `uppercase tracking-wide` |
| Micro labels | `text-[10px]` | `font-semibold` | `uppercase tracking-[0.18em]` — used for "AGENT WORKING", section group headers |
| Badge / pill text | `text-[11px]` | `font-semibold` | |
| Button text | `text-[14px]` | `font-normal` | Primary CTAs intentionally not bold |
| Nav / metadata | `text-sm` or `text-xs` | `font-medium` | |

### Key Principle
**Do not use bold.** `font-semibold` (600) is the heaviest weight used. Large headings use `font-light` (300) to contrast against dense surrounding content.

---

## 3. Colour Palette

### CSS Custom Properties (`:root`)
```css
:root {
  --background: #f0f0f1;   /* Warm near-white — key brand surface */
  --foreground: #171717;
  --card: #f5f5f5;
  --border: #e5e5e5;
  --muted: #737373;
}

.dark {
  --background: #09090b;   /* zinc-950 */
  --foreground: #fafafa;   /* zinc-50 */
  --card: #18181b;         /* zinc-900 */
  --border: #27272a;       /* zinc-800 */
  --muted: #a1a1aa;        /* zinc-400 */
}
```

### Semantic Status Colours
These are applied consistently across badges, glows, bars, and state indicators:

| State | Colour | Tailwind token | Usage |
|---|---|---|---|
| **High / Critical** | Red | `red-600 / red-400` + gradient `#D3222A → #f97316` | Gap detected, overdue, critical state |
| **Medium / Needs action** | Amber | `amber-500 / amber-400` | Assignment needed, busy state, in-progress steps |
| **Low / Info** | Slate | `slate-400 / zinc-500` | Approval, signature, neutral |
| **Done / Success** | Emerald | `emerald-400–600 / emerald-500` | Applied, completed, all steps done |
| **Regulation** | Rose | `rose-700 / rose-400` | Regulatory-sourced suggestions |
| **Market / Reorder** | Blue | `blue-700 / blue-400` | Market signals, reorder actions |
| **Source material** | Violet | `violet-700 / violet-400` | Document-sourced suggestions |
| **Personnel** | Teal | `teal-700 / teal-400` | People/presenter changes |
| **Geopolitical** | Orange | `orange-700 / orange-400` | Geopolitical events |

### Background
The page background is `#f0f0f1` — a very slightly warm off-white. Do **not** use pure white (`#ffffff`) for the page background; reserve white for cards and elevated surfaces.

---

## 4. Surfaces & Elevation

There are three levels of surface:

| Level | Light mode | Dark mode | Used for |
|---|---|---|---|
| **Page** | `#f0f0f1` | `zinc-950` | The canvas behind everything |
| **Card / Panel** | `bg-white` | `bg-zinc-900` | Action cards, nav, modals |
| **Inset / Nested** | `bg-slate-50` | `bg-zinc-800` | Code blocks, nested info, footer strip |

Cards use `border border-black/[0.09] dark:border-zinc-700` — a very subtle black-opacity border in light mode rather than a hard colour, so it adapts naturally.

---

## 5. Border Radius System

This project uses **large, modern radii** throughout — never less than `rounded-lg` on interactive elements.

| Element | Radius |
|---|---|
| Action cards | `rounded-[20px]` — custom large radius |
| Modals | `rounded-3xl` (24px) |
| Buttons (primary CTA) | `rounded-xl` (12px) |
| Buttons (secondary / outline) | `rounded-xl` (12px) |
| Badges / pills | `rounded-full` |
| Icon containers (square) | `rounded-lg` (8px) |
| Entity logos | `rounded-lg` (8px) |
| Nav buttons | `rounded-lg` or `rounded-full` |
| Metric stat boxes | `rounded-xl` |
| Inset code/quote blocks | `rounded-xl` or `rounded-2xl` |
| Dropdown menus | `rounded-2xl` |
| Close buttons | `rounded-lg` or `rounded-xl` |

---

## 6. Layout

### App Shell
```
┌──────────────────────────────────────┐
│  TopNav (bg-white, border-b)         │  ~48px, flex-shrink-0
├──────────────────────────────────────┤
│  Main content area                   │  flex-1, overflow-y-auto
│  px-6 py-4                           │
│  home-gradient background            │
└──────────────────────────────────────┘
```

The whole viewport is `h-screen overflow-hidden` on `<body>`, with the content area scrolling internally. This keeps the nav fixed without `position: fixed`.

### Home Page Column Layout
```
AgentActivityBanner   ← full-width hero with status, headline, metrics
QuickActionsBar       ← row of equal-width action tiles (flex, gap-2)
BookBuilding          ← section with stacked cards
PlanningSuggestions   ← section with stacked cards
AgentUsecaseHeroes    ← marketing-style feature highlights
Footer
```

Between sections: `mb-6` between banner/bar, `gap-6` inside the `flex flex-col` card container.

### Section Headers
Each card group uses a consistent two-line header above its cards:
```tsx
<h2 className="text-[11px] font-semibold text-slate-800 uppercase tracking-wide">
  Section Title
</h2>
<p className="text-xs text-slate-500 mt-0.5">
  One-line description of the section.
</p>
```

---

## 7. Cards (Action Cards)

This is the dominant UI pattern. Cards have a rich set of states.

### Structure (top to bottom)
1. **Radial glow** — absolute top overlay, `h-20`, `pointer-events-none`
2. **Entity row** — overlapping logos (`-space-x-2`), entity name, count, badge
3. **Title** — `text-[16px] font-semibold leading-[1.35]`
4. **Detail text** — `text-[13px] text-slate-500 leading-relaxed`
5. **Bottom area** — one of three states (see below)

### Card States

**Pending (default)**
- White background, subtle border
- Hover: slight lift (`hover:-translate-y-0.5`), stronger border, soft shadow
- Cursor: pointer; clicking opens detail modal
- Bottom: primary CTA button + "Details" outline button

**Applying (in progress)**
- Card stays fully readable — no opacity changes
- Bottom: `AgentProgressWidget` rendered inline (replaces CTA buttons)
- Card is `cursor-default`, click disabled

**Applied (done)**
- Green tinted card: `border-emerald-200 bg-emerald-50/40`
- Emerald radial glow at top
- Badge swaps to "Applied ✓" green pill
- Bottom: full-width emerald "Check in [Tool] ↗" button
- Cursor: `cursor-default`, click disabled

### Card CSS Classes (core)
```tsx
// Pending
"suggestion-card relative rounded-[20px] border border-black/[0.09] dark:border-zinc-700
 bg-white dark:bg-zinc-900 overflow-hidden cursor-pointer transition-all duration-300
 hover:bg-slate-50 hover:border-slate-200 hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]
 hover:-translate-y-0.5 [will-change:transform] [backface-visibility:hidden]"

// Applied
"border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/10 cursor-default"
```

### Card Glow
Each card has a top radial glow that breathes with CSS animation:
```tsx
<div
  className="suggestion-card-glow absolute top-0 left-0 right-0 h-20 pointer-events-none"
  style={{ background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${glowColor} 0%, transparent 100%)` }}
/>
```
Glow colours are semi-transparent: e.g. `rgba(239,68,68,0.07)` for red, `rgba(16,185,129,0.07)` for emerald.

---

## 8. Badges & Pills

Used to label the category or source of each card action. Always `rounded-full`, small text, border included.

```tsx
// Pattern
<span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${badgeClasses}`}>
  {label}
</span>
```

Sample badge class sets:
```
// Red (gap/overdue)
bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400

// Amber (assignment)
bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400

// Emerald (applied/done)
bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400

// Slate (neutral/low)
bg-slate-100 border-slate-300 text-slate-600 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-400
```

The "Applied ✓" badge includes an inline checkmark SVG:
```tsx
<svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
  <path d="M2 6l3 3 5-5"/>
</svg>
```

---

## 9. Buttons

### Primary CTA (dark)
```tsx
className="flex-1 text-[14px] font-normal bg-slate-800 dark:bg-zinc-100
  text-white dark:text-zinc-900 rounded-xl py-[11px] px-4
  hover:bg-slate-900 dark:hover:bg-white active:bg-slate-950 transition-colors"
```

### Applied State CTA (emerald)
```tsx
className="w-full flex items-center justify-center gap-2 text-[14px] font-normal
  bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
  text-white rounded-xl py-[11px] px-4 transition-colors"
```

### Secondary / Outline
```tsx
className="text-[13px] font-normal text-slate-500 dark:text-zinc-400
  bg-white dark:bg-zinc-800 border border-black/[0.09] dark:border-zinc-700
  rounded-xl py-[11px] px-4
  hover:bg-slate-50 dark:hover:bg-zinc-700
  hover:border-slate-200 dark:hover:border-zinc-600 transition-colors"
```

### Text / Ghost (cancel, dismiss)
```tsx
className="text-[14px] text-slate-500 dark:text-zinc-400
  hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
```

### Modal Confirm (large)
```tsx
className="px-6 py-3 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900
  text-[14px] font-semibold rounded-xl
  hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 transition-colors"
```

**Key principle:** Button text is `font-normal` (400) on most CTAs. Reserve `font-semibold` for modal confirm actions only.

---

## 10. Modals

### Confirm Action Modal (large, scrollable)
- Max width: `max-w-2xl`
- Radius: `rounded-3xl`
- Shadow: `shadow-[0_32px_80px_-16px_rgba(0,0,0,0.25)]`
- Backdrop: `bg-slate-900/50 dark:bg-black/70 backdrop-blur-[3px]`
- Entrance animation: `confirmModalIn` (scale + translateY, 220ms)
- Header and footer separated by `border-t/b border-slate-100 dark:border-zinc-800`
- Footer has subtle bg: `bg-slate-50/50 dark:bg-zinc-800/30`

### Detail / Small Modal
- Max width: `max-w-md`
- Radius: `rounded-2xl`
- Same backdrop pattern
- Close button: `w-7 h-7 rounded-lg bg-slate-100` top-right

### Redirect / Security Modal
- Max width: `max-w-sm`
- Radius: `rounded-3xl`
- Has a top-edge progress bar (`h-1`) that fills left to right
- Step list with amber (active), emerald (done), slate (pending) dot indicators
- Shows SSO / TLS / OAuth steps as reassurance UI
- Auto-dismisses after 4s

---

## 11. Animations

All animations are defined in `globals.css`. Use `animation-delay` for staggered entrances.

### Card Entrance
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.suggestion-card {
  animation: fadeSlideUp 0.5s ease-out both;
}
```
Stagger cards with `animationDelay: ${i * 120}ms`.

### Card Top Glow (breathing)
```css
@keyframes glowBreath {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}
.suggestion-card-glow {
  animation: glowBreath 3.5s ease-in-out infinite;
}
```

### Priority Bar Fill
```css
@keyframes barFill {
  from { width: 0%; }
  to   { width: var(--bar-target); }
}
.suggestion-bar-fill {
  animation: barFill 1.2s ease-out forwards;
}
```
The fill target is set via CSS custom property `--bar-target`.

### Bar Shimmer
```css
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}
.suggestion-bar-shimmer {
  animation: shimmer 2.5s 1.5s infinite;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
}
```

### Agent Step Completion Pop
```css
@keyframes step-pop {
  0%   { transform: scale(1); }
  28%  { transform: scale(1.52); }
  55%  { transform: scale(0.86); }
  76%  { transform: scale(1.14); }
  100% { transform: scale(1); }
}
.step-pop {
  animation: step-pop 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```
Applied to a stepper dot when its step completes.

### Modal Entrance
```css
@keyframes confirmModalIn {
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
```
Apply inline via `style={{ animation: 'confirmModalIn 220ms cubic-bezier(0.22,1,0.36,1) both' }}`.

### Easing Function
The signature easing throughout the project is **`cubic-bezier(0.22, 1, 0.36, 1)`** — a fast ease-out that overshoots slightly. Use it for modals, pop animations, and dropdowns.

### Tailwind Transitions
Most interactive elements use `transition-colors` with the default 150ms. Cards and action tiles use `transition-[transform,box-shadow,border-color,background-color] duration-[250ms] ease-out` for smooth hover lifts. Add `[will-change:transform] [backface-visibility:hidden]` to any element using `hover:-translate-y-*` to prevent text jumping during GPU layer promotion. The stepper line fill uses `duration-700 ease-out`.

---

## 12. Hero Banner

The top status banner uses three states: `calm`, `busy`, `critical`.

- State-dependent top glow overlay (`radial-gradient`, 180px height, `pointer-events-none`)
- Centred status pill (rounded-full, colour matches state)
- Large light headline: `text-[2.5rem] font-light tracking-[-0.02em]`
- 13px subtext, max-width `max-w-2xl mx-auto`
- Row of 3 metric boxes: `w-28 h-20 rounded-xl border` with a large bold number + small label

```css
.hero-glow-calm     { background: radial-gradient(ellipse 90% 100% at 50% 0%, rgba(16,185,129,0.05) ...); }
.hero-glow-busy     { background: radial-gradient(ellipse 90% 100% at 50% 0%, rgba(245,158,11,0.06) ...); }
.hero-glow-critical { background: radial-gradient(ellipse 90% 100% at 50% 0%, rgba(220,38,38,0.07) ...); }
/* Dark mode values are 2-3× stronger opacity */
```

---

## 13. Quick Actions Bar

A horizontal row of equal-width tiles, collapsing overflow into a `+N ▾` dropdown.

- Each tile: `flex-1 h-[64px] px-4` with icon box + label + sublabel
- Icon box: `w-9 h-9 rounded-lg bg-slate-50 dark:bg-zinc-700`
- Icons: `w-5 h-5` custom SVG
- Labels: `text-[13px] font-semibold` + `text-[11px] text-slate-400` sublabel
- Minimum tile width before overflow: `140px` (measured via `ResizeObserver`)
- Overflow button: `w-[52px] h-[64px]` with count + chevron

---

## 14. Agent Progress Widget

An inline step-by-step progress indicator that lives inside action cards while a job is running.

### Structure
- **Status label**: `text-[10px] font-semibold tracking-[0.18em] uppercase` — "AGENT WORKING" / "PROCESS INTERRUPTED" / "TASK COMPLETE"
- **Milestone stepper**: row of circles connected by thin lines
  - Incomplete: `w-7 h-7 rounded-full bg-white border border-slate-300` with grey dot
  - Active: amber fill (`bg-amber-400`) with pulsing ring (`animate-ping opacity-40`)
  - Complete: emerald fill (`bg-emerald-500`) with white checkmark SVG + `step-pop` animation
  - Stopped: rose outline border with X icon
  - Connector lines fill emerald as steps complete (`transition-all duration-700 ease-out`)
- **Running footer**: current step label (truncated) + Stop button + N/total counter
- **Stopped footer**: "Interrupted at: [step]" in rose + Resume / Restart links
- **Done footer**: "All steps complete" in emerald + "Check in [tool] ↗" link (if destination set)

---

## 15. Icons

All icons are **custom inline SVGs** — no icon library. They follow a consistent grammar:

- `viewBox="0 0 16 16"` or `0 0 20 20` or `0 0 12 12` depending on context
- `fill="none" stroke="currentColor"`
- `strokeWidth="1.5"` for most UI icons; `strokeWidth="2"` for small (12px) icons; `strokeWidth="2.5"` for checkmarks
- `strokeLinecap="round" strokeLinejoin="round"` always
- Sized via Tailwind: `w-3 h-3`, `w-3.5 h-3.5`, `w-4 h-4`, `w-5 h-5`

### External link indicator
```tsx
<svg className="w-3.5 h-3.5 opacity-80" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M3 7h8M7 3l4 4-4 4"/><path d="M11 3h2v2"/>
</svg>
```

### Checkmark (small, badges)
```tsx
<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
  <path d="M2 6l3 3 5-5"/>
</svg>
```

### Close / X
```tsx
<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
  <path d="M4 4l8 8M12 4l-8 8" />
</svg>
```

### Spinner (applying state)
Tailwind `animate-spin` on a standard SVG circle arc:
```tsx
<svg className="w-4 h-4 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
</svg>
```

---

## 16. Entity Logos

Entities have logo images loaded from `/logos/{slug}.png`. On error, fall back to a coloured rounded square with initials.

```
Sizes:
  sm → w-7 h-7 text-[10px]
  md → w-9 h-9 text-xs
  lg → w-12 h-12 text-sm
```

Fallback colour sequence (by entity ID mod 8):
```
blue-600 → amber-500 → teal-600 → indigo-600 → emerald-600 → rose-600 → orange-500 → violet-600
```

Multiple entity logos are stacked with `flex -space-x-2` (overlapping). For more than one entity in a card header, a `+N` badge appears bottom-right of the primary logo.

---

## 17. Dividers

A consistent decorative divider is used between sections:
```tsx
<div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-zinc-700" />
```
This fades out at both edges — never a hard rule.

---

## 18. Home Page Gradient

The scrollable content area has a very subtle radial gradient at the top edge:
```css
.home-gradient {
  background: radial-gradient(ellipse 70% 40% at 50% 0%, #bfdbfe55 0%, transparent 100%);
}
.dark .home-gradient {
  background: radial-gradient(ellipse 70% 40% at 50% 0%, #1e3a6040 0%, transparent 100%);
}
```
Blue-tinted in light mode, dark-blue in dark mode. Barely perceptible — adds depth.

---

## 19. Navigation

- `bg-white dark:bg-zinc-900`, `border-b border-slate-200 dark:border-zinc-800`
- Height approximately 48px (`py-3.5`)
- Left: logo SVG + app name (`text-xs font-semibold tracking-tight`)
- Right: pill button ("Recent activity"), icon buttons (bell, three-dot), thin divider, avatar + name
- Nav icon buttons use `rounded-lg`, `w-8 h-8`, `bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700`
- Notification dot: `w-2 h-2 bg-red-500 rounded-full ring-1 ring-white dark:ring-zinc-900`

---

## 20. Dark Mode

Dark mode is enabled via the `.dark` class on `<html>`. All components use Tailwind's `dark:` variant consistently.

Key dark mode principles:
- Page background: `zinc-950` (near-black, slightly warm)
- Cards: `zinc-900`
- Inset surfaces: `zinc-800`
- Borders: `zinc-700` or `zinc-800`
- Body text: `zinc-100`
- Secondary text: `zinc-400` or `zinc-500`
- Status colours: use the `400`-level tokens (e.g. `emerald-400`, `red-400`) instead of `600-700` for legibility on dark backgrounds
- Glow intensities are `2–3×` stronger in dark mode (opacities multiplied)

---

## 21. Design Principles (Summary)

1. **Dense but airy** — small type and tight spacing, but generous padding within cards (`p-[22px_24px]`) and generous radius.
2. **Colour is functional** — never decorative. Every colour communicates status. Neutral interactions stay slate/zinc.
3. **No bold text** — `semibold` (600) is the ceiling. `light` (300) for large headlines.
4. **Cards own their state** — each card manages its own pending/applying/applied state independently, enabling parallel processes.
5. **Glows, not shadows** — top-edge radial gradients replace box-shadows on cards. Shadows reserved for floating elements (modals).
6. **Inline feedback** — progress indicators live inside the triggering card, not in a global toast or header.
7. **Animations are purposeful** — card entrance (fadeSlideUp), breathing glow, step pop, modal scale-in. Nothing decorative for its own sake.
8. **Opacity is reserved for truly disabled states** — in-progress cards do not fade. Only deeply disabled/non-interactive content uses reduced opacity.
