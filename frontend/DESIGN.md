# CloudHost Design Spec: "Calm Cloud"

Calm, soft, trustworthy. Warm paper background, deep-teal primary, sand/clay accent, slate ink.
No dark-navy blocks, no photo heroes. Generous whitespace, large radii, soft layered shadows.
All data is frontend-only: mock data in local state / localStorage, shapes API-ready (see Types).

## 1. Tokens (installed in `tailwind.config.js` + `src/app/globals.css`)

Use ONLY semantic classes. Never hard-code hex. Tokens are RGB-channel CSS vars, so `bg-primary/10` works.

| Token (Tailwind)            | Light     | Dark      | Use |
|-----------------------------|-----------|-----------|-----|
| `bg-bg`                     | #FAF8F4   | #12171A   | page |
| `bg-surface` / `bg-surface-2` | #FFF / #F3EFE8 | #1A2125 / #222B30 | cards / wells, inputs, hover rows |
| `border-border`             | #E6E0D5   | #2D383E   | hairlines |
| `text-ink` / `-soft` / `-muted` | #1F2A33 / #4A5863 / #647079 | #ECE9E2 / #B7C0C4 / #8F9BA1 | headings+body / secondary / hints (all >=4.7:1 on bg) |
| `bg-primary` + `text-primary-fg` | #2F6F6B + white (5.8:1) | #6FB5AE + #0E2422 | CTA |
| `bg-primary-soft` `text-primary-ink` | #E3EFEC / #245552 | #1E3633 / #A9D8D2 | selected, chips, tints |
| `bg-accent-soft` `text-accent-ink` | sand #F1E4D6 / clay #8A4A30 | #342821 / #E2B296 | highlights, "popular" badge. `bg-accent` (clay) is fill/decor only, never text |
| `ok` / `warn` / `crit` (+ `-soft`) | #25663F, #8A5A00, #A53248 on soft tints | light tints on dark tints | status. Always `text-ok` on `bg-ok-soft` (>=5:1) |
| `ring-ring`                 | teal      | light teal| focus (global `:focus-visible` already set) |

Shadows: `shadow-soft` (cards), `shadow-lift` (hover, popovers), `shadow-float` (dialogs, palette).
Radii: `rounded-lg` 16px (inputs/buttons), `rounded-card` 20px (cards), `rounded-2xl` 24px (hero panels, dialogs), `rounded-pill`.
Motion: `animate-fade-up`, `animate-pop-in`; global reduced-motion rule exists. Status is never colour-only: always icon + label.
Legacy `brand`/`navy`/`page` aliases are remapped to the new palette; delete them as components migrate.

### Typography
`next/font/google` in `src/app/layout.tsx`:
```ts
import { Fraunces, DM_Sans } from 'next/font/google'
const display = Fraunces({ subsets:['latin'], variable:'--font-display', axes:['opsz'] })
const body = DM_Sans({ subsets:['latin'], variable:'--font-body' })
// <html className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
```
- Headings: `font-display font-medium tracking-tight text-ink` (h1 `text-4xl sm:text-5xl lg:text-6xl leading-[1.08]`, h2 `text-3xl sm:text-4xl`, h3 `text-xl`).
- Body `font-sans text-base text-ink-soft leading-relaxed`; small `text-sm`; numerals in tables/price `tabular-nums`.
- Eyebrow: `text-xs font-semibold uppercase tracking-[.14em] text-primary-ink`.

### Layout primitives
- Container `mx-auto max-w-6xl px-5 sm:px-8`; section rhythm `py-20 sm:py-28`; card padding `p-6 sm:p-8`; grid gap `gap-6`.
- Breakpoints: mobile-first, `sm 640 / md 768 / lg 1024`. Touch targets >= 44px (`min-h-11`).

## 2. Theme toggle (F)
- `src/components/ui/ThemeProvider.tsx` + `ThemeToggle.tsx`. State `'light'|'dark'|'system'` in `localStorage['ch-theme']`; toggles `document.documentElement.classList` `dark`.
- Avoid flash: inline `<script>` in `<head>` of layout reads storage / `prefers-color-scheme` before paint (`dangerouslySetInnerHTML`; `suppressHydrationWarning` on `<html>`).
- UI: icon button (sun/moon from Heroicons), `aria-label="Switch to dark theme"` (label reflects next state), `aria-pressed` not used. Lives in Navbar, Dashboard header, auth top-right, and as palette action.
- Recipe: `h-10 w-10 grid place-items-center rounded-pill border border-border bg-surface text-ink-soft hover:bg-surface-2`.

## 3. Shared component set (`frontend/src/components/ui/`)
Each file is standalone, props typed, no data fetching. Dev A = primitives + landing + auth; Dev B = dashboard + wizard + alerts; the split below avoids file overlap.

| File | Owner | Props (key) | Notes |
|------|-------|-------------|-------|
| `Button.tsx` | A | `variant: 'primary'\|'secondary'\|'ghost'\|'danger'`, `size:'sm'\|'md'\|'lg'`, `loading`, `leftIcon`, `asChild/href` | primary `bg-primary text-primary-fg hover:bg-primary-hover rounded-lg px-5 min-h-11 font-medium shadow-soft transition`; secondary `bg-surface border border-border text-ink hover:bg-surface-2`; ghost `text-ink-soft hover:bg-surface-2`; danger `bg-crit-soft text-crit hover:brightness-95`. Disabled `opacity-50 cursor-not-allowed`. `loading` shows spinner + `aria-busy`. |
| `Card.tsx` | A | `as`, `padding`, `interactive`, `tone:'default'\|'sand'\|'tint'` | `rounded-card border border-border bg-surface shadow-soft`; interactive adds `transition hover:shadow-lift hover:-translate-y-0.5`; sand `bg-accent-soft`; tint `bg-primary-soft`. |
| `Badge.tsx` | A | `tone:'ok'\|'warn'\|'crit'\|'info'\|'neutral'`, `icon`, `dot` | `inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium bg-ok-soft text-ok` (swap per tone; info = primary-soft/primary-ink; neutral = surface-2/ink-soft). |
| `Toast.tsx` (+ `useToast`) | B | `toast({title, description, tone, action?, duration=4000})` | Provider mounted in root layout. Container `fixed bottom-4 right-4 z-[60] flex flex-col gap-2` (mobile: `inset-x-4`). Item `rounded-2xl bg-surface border border-border shadow-float p-4 animate-pop-in`. `role="status" aria-live="polite"` (crit uses `role="alert"`). Pause on hover; Esc/close button; optional Undo action. |
| `Dialog.tsx` | B | `open, onClose, title, description, children, footer, tone` | Headless UI `Dialog`. Backdrop `bg-ink/40 backdrop-blur-sm`; panel `w-full max-w-md rounded-2xl bg-surface p-6 shadow-float animate-pop-in`; mobile becomes bottom sheet (`items-end sm:items-center`). Focus trapped, initial focus on the safe button, Esc closes. |
| `Slider.tsx` | A | `label, value, min, max, step, unit, marks?, onChange, format?` | Native `<input type="range">` styled (not custom div) so keyboard/AT work. Track `h-2 rounded-pill bg-surface-2`, filled part via CSS gradient on `--pct` var using `rgb(var(--primary))`; thumb 24px `bg-surface border-2 border-primary shadow-lift`. Linked `<label>`, `aria-valuetext={format(value)}`, value shown in `tabular-nums` pill at right. Tick marks below. |
| `Stepper.tsx` | B | `steps: {id,label}[]`, `current`, `onStepClick?` | `<ol aria-label="Progress">`, current `aria-current="step"`. Circle 32px: done `bg-primary text-primary-fg` + check, current `border-2 border-primary text-primary-ink`, todo `border border-border text-ink-muted`; connector `h-0.5 bg-border` (done = `bg-primary`). Mobile: show only "Step 2 of 4 · Size" text + progress bar. |
| `Sparkline.tsx` | B | `data:number[]`, `tone`, `height=32`, `ariaLabel`, `fill` | Pure inline SVG polyline + area (no Recharts). `stroke="rgb(var(--primary))"` via `currentColor` and `text-primary`/`text-warn`/`text-crit`. Last point dot. `role="img"` with ariaLabel like "CPU last 7 days, average 34%, peak 71%". |
| `RingGauge.tsx` | B | `value 0-100`, `size=64`, `stroke=7`, `label`, `tone?` (auto: >=80 ok, 50-79 warn, <50 crit when used as health) | SVG circle with `stroke-dasharray`; track `text-surface-2`, arc `text-ok/warn/crit`, centre number `font-display`. `role="img" aria-label="Health score 86 out of 100"`. Animate arc 600ms (disabled under reduced motion). |
| `Input.tsx`, `Select.tsx`, `Chip.tsx`, `Segmented.tsx`, `Skeleton.tsx`, `EmptyState.tsx` | A | standard | Input `h-11 rounded-lg border border-border bg-surface px-3.5 text-ink placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-ring/30`; error `border-crit` + `aria-invalid` + message `text-crit text-sm` with icon. Segmented = `role="radiogroup"` pills (used for OS toggle). Chip = filter toggle `aria-pressed`. Skeleton `animate-pulse rounded-lg bg-surface-2`. EmptyState = inline-SVG motif + title + action. |
| `ThemeProvider.tsx`, `ThemeToggle.tsx` | A | see section 2 | |
| `CommandPalette.tsx` | B | see section 5 | |
| `Illustration.tsx` | A | `name:'hills'\|'clouds'\|'rack'` | inline SVG, fills use token vars (`fill-primary-soft`, `fill-accent-soft`, `stroke-primary`). |

Feature components live in `components/marketing/*` (A), `components/auth/*` (A), `components/fleet/*`, `components/deploy/*`, `components/alerts/*` (B). Pages: `app/page.tsx`, `app/auth/*` (A); `app/dashboard/*` (B).

## 4. Shared types and mock data (`src/lib/mock/types.ts`, `src/lib/mock/store.ts`)
```ts
type ServerStatus = 'running'|'stopped'|'restarting'
interface Server { id:string; name:string; os:'ubuntu'|'debian'|'windows'|'rocky'; region:'mumbai'|'chennai'|'delhi';
  vcpu:number; ramGb:number; storageGb:number; ip:string; status:ServerStatus; priceInrMonth:number;
  usage:{cpu:number[]; ram:number[]; storage:number[]}; // 7 daily values, percent
  storageUsedGb:number; storageGrowthGbPerDay:number; createdAt:string }
type AlertState = 'open'|'acknowledged'|'snoozed'|'resolved'
interface Alert { id:string; serverId:string; severity:'ok'|'warn'|'crit'; title:string; detail:string;
  createdAt:string; state:AlertState; snoozedUntil?:string }
interface Activity { id:string; at:string; serverId?:string; kind:'power'|'alert'|'deploy'|'billing'; text:string }
```
`store.ts`: `useFleet()` hook, persists to `localStorage['ch-fleet-v1']`, seeded with 4 servers/5 alerts on first load, exposes `servers, alerts, activity, startServer, stopServer, restartServer (status -> 'restarting' 2.5s then 'running'), deployServer, ackAlert, snoozeAlert(id,'1h'|'24h'), resolveAlert`. Each call returns a Promise with ~600ms delay so loading/error states are real; swapping for `fetch` later changes only this file.
`src/lib/pricing.ts` (single source for landing + wizard):
`price = vcpu*₹350 + ramGb*₹160 + storageGb*₹4 + (os==='windows' ? ₹800 : 0)`, formatted `Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0})`. Ranges: vCPU 1-16, RAM 1-64 GB, storage 20-1000 GB (step 10; non-linear marks fine). Presets: Starter 1/2/40 ≈ ₹1,010; Standard 2/4/80 ≈ ₹1,660; Pro 4/16/200 ≈ ₹4,760 (recompute from formula, do not hard-code).
Forecast: `daysLeft = (storageGb - storageUsedGb) / storageGrowthGbPerDay` -> copy "Storage full in ~18 days" (warn tone if <30, crit if <7, "Plenty of room" if >90 or growth <=0).

## 5. Features

### A. Landing (`app/page.tsx`, `components/marketing/*`)
Order: Navbar -> Hero -> TrustStrip -> Calculator -> Plans -> Story/Features (3 cards) -> FAQ -> Contact -> Footer.
- **Navbar**: sticky `bg-bg/80 backdrop-blur border-b border-border/60`; logo (font-display), links, ThemeToggle, `Ctrl K` hint chip (hidden on mobile), Sign in (ghost), Get started (primary). Mobile: hamburger -> full-width sheet; links `min-h-11`.
- **Hero** (story-led): left column eyebrow "Hosting that stays out of your way", h1 e.g. "A server for every idea, priced the way you build it.", 2 sentences of story, CTAs "Build your server" (anchors `#build`) + "See plans"; below, 3 micro-proof points with icons. Right: `Illustration name="hills"` inside `rounded-2xl bg-primary-soft` with a floating mini status card ("api-server · running · health 94") `shadow-lift`. Mobile: illustration under copy, reduced height. Background: subtle radial `bg-[radial-gradient(60%_50%_at_80%_0%,rgb(var(--accent-soft)),transparent)]`.
- **TrustStrip**: `<ul>` of 4 stats/claims ("99.95% uptime SLA", "Data in India", "24/7 human support", "Pay monthly, cancel anytime") in `flex flex-wrap gap-x-10 gap-y-4 text-ink-soft`, icons `text-primary`. Never invent customer logos.
- **Calculator** (`BuildServer.tsx`, id `build`): `Card tone default p-6 sm:p-10`, `grid lg:grid-cols-[1.3fr_1fr] gap-10`. Left: three `Slider`s (vCPU, RAM, Storage) + `Segmented` OS toggle (Linux / Windows; Windows shows "+₹800 licence" hint). Right: sticky summary panel `rounded-2xl bg-primary-soft p-6`: big price `font-display text-5xl tabular-nums text-primary-ink` + "/month", line-item breakdown (vCPU, RAM, storage, OS) in `text-sm`, "Starts at 1 vCPU / 1 GB" note, CTA "Deploy this server" -> `/auth/register?cpu=..&ram=..&disk=..&os=..` (prefill read later by wizard). Price wrapper `aria-live="polite" aria-atomic="true"` (debounce announcements 400ms). Preset chips above sliders set values. States: no loading; error N/A; clamp values; reduced motion = no number tween (otherwise 200ms tween).
- **Plans**: 3 `Card interactive`, middle "Most chosen" `Badge` accent (`bg-accent-soft text-accent-ink`) and `ring-2 ring-primary/40`. Each: name, price, spec list with check icons, button "Choose" (loads preset into calculator + scroll). Stack on mobile (popular first).
- **FAQ**: Headless UI `Disclosure`, `divide-y divide-border`, button `min-h-14 text-left font-medium`, chevron rotates, answers `text-ink-soft`. 6 questions (billing, regions, backups, scaling, refunds, Windows licences).
- **Contact**: two columns: left reassurance copy + email/phone; right form card (name, email, message). Validation inline (`aria-describedby`), submit -> button loading -> success panel "Thanks, we reply within one working day" (stored in localStorage `ch-contacts`). Error: inline `Badge crit` + retry.

### B. Command palette (`ui/CommandPalette.tsx`, mounted in root layout via `PaletteProvider`)
- Open: `Ctrl/Cmd+K`, also Navbar/Header button; `/` when not typing. Close: Esc / backdrop.
- Headless UI `Combobox` inside `Dialog`. Panel `fixed top-[12vh] left-1/2 -translate-x-1/2 w-[min(92vw,40rem)] rounded-2xl bg-surface border border-border shadow-float`; input `h-14 px-5 text-base bg-transparent`; list `max-h-80 overflow-auto p-2`; item `flex items-center gap-3 rounded-lg px-3 py-2.5 data-[headlessui-state~=active]:bg-primary-soft`; right-aligned `kbd` hint `text-xs text-ink-muted`.
- Groups: **Go to** (Home, Fleet, Deploy, Alerts, Billing, Support, Sign in), **Actions** (Deploy a server, Toggle theme, Start/Stop/Restart `<server>` (one per server, routes through the same confirm Dialog), Resolve all acknowledged alerts), **Servers** (jump to card). Context-aware: dashboard-only items hidden when logged out.
- Fuzzy match: simple lowercase subsequence scorer in the component, no dependency. Recent items (last 3) in `localStorage['ch-palette-recent']`.
- States: empty query = Recents + Suggested; no match = "Nothing for 'xyz'. Try 'deploy' or 'alerts'"; loading N/A.
- A11y: `role="combobox"`, results `role="listbox"`, `aria-activedescendant`, results count announced via `aria-live="polite"` ("5 results"), focus returns to trigger on close. Mobile: opens from a search icon, full-width.

### C. Dashboard "Fleet" (`app/dashboard/page.tsx`, `components/fleet/*`)
Layout: Dashboard shell = left nav (`w-64`, `bg-surface border-r border-border`, collapses to bottom tab bar on `<md` with 4 items + "More") and main `max-w-6xl p-5 sm:p-8`. Page header: greeting `font-display text-3xl` ("Good evening, Vineeth"), summary line ("3 of 4 servers healthy · 1 needs attention"), buttons "Deploy a server" (primary), palette hint.
- **FleetSummary**: 3 small `Card`s: Servers running, Monthly spend (INR), Open alerts. `grid sm:grid-cols-3 gap-4`.
- **ServerCard** (`ServerCard.tsx`, props `server, onPower(action), busyAction?`): `Card interactive p-6`; header: name (`font-medium`), `Badge` status (running ok / stopped neutral / restarting warn with spinner), spec line "2 vCPU · 4 GB · 80 GB · Mumbai" `text-sm text-ink-muted`; `RingGauge` health (computed: 100 - penalties for cpu>85, ram>85, storage>85, open alerts) at right; middle: three rows (CPU, RAM, Storage) each label + `Sparkline` 7-day + current % `tabular-nums`; forecast line with icon `text-sm` (tone by days left); footer: power buttons as `Button size=sm variant=secondary`: Start (disabled when running), Stop (disabled when stopped), Restart; menu `...` for Details. Grid `grid md:grid-cols-2 xl:grid-cols-3 gap-6`.
- **Power flow**: click -> `ConfirmPowerDialog` (title "Stop api-server?", description states impact "Running apps go offline until you start it again.", buttons Cancel (initial focus) / Stop server (danger; Start & Restart use primary)). Confirm -> card shows `busyAction` spinner, buttons disabled, `aria-busy` -> success `toast({tone:'ok', title:'api-server stopped', action:{label:'Undo'}})` (Undo only for stop) / failure toast crit with Retry. Mock failure 1 in 10 to exercise errors. Activity entry appended.
- **ActivityTimeline** (replaces alerts table): `<ol>` `relative border-l border-border ml-3`; item `pl-6 pb-6`, dot `absolute -left-1.5 h-3 w-3 rounded-full ring-4 ring-bg` coloured by kind (power=primary, alert=warn/crit, deploy=accent, billing=ink-muted), text `text-sm text-ink`, time `text-xs text-ink-muted` via `<time dateTime>`; grouped by day heading ("Today", "Yesterday"); "Show more" after 8. Sits right of cards at `xl` (`xl:grid-cols-[1fr_320px]`), below on smaller.
- States: **loading** 3 `Skeleton` cards (`aria-busy`); **empty** `EmptyState` (hills motif, "No servers yet. Your first one takes about a minute." + Deploy button); **error** inline `Card tone` crit-soft "Couldn't load your fleet" + Retry; stopped card dims sparkline to `text-ink-muted`, ring shows "-".
- A11y: cards are `<article aria-labelledby>`, status text not colour-only, sparkline text alternative, dialog focus management, toasts polite, buttons have names that include the server ("Restart api-server" via `aria-label`).

### D. Deploy a server wizard (`app/dashboard/deploy/page.tsx`, `components/deploy/*`)
- Layout: `lg:grid-cols-[1fr_340px] gap-8`; left = `Stepper` + step panel `Card p-6 sm:p-8`; right = sticky **LiveCost** panel (`rounded-2xl bg-primary-soft p-6`) showing selected OS, size, region, monthly + hourly (`/730`) price, updates on every choice (`aria-live="polite"`). Mobile: LiveCost becomes a fixed bottom bar `fixed inset-x-0 bottom-0 bg-surface/95 backdrop-blur border-t border-border p-4` with price + Next button.
- Steps: 1 **OS**: radio-card grid (`role="radiogroup"`; card `rounded-card border-2 border-border p-5 has-[:checked]:border-primary has-[:checked]:bg-primary-soft`, visually hidden radio input kept focusable, ring on `focus-within`). 2 **Size**: 3 preset cards + "Custom" revealing the same `Slider`s as the landing page (shared `pricing.ts`). 3 **Region**: Mumbai / Chennai / Delhi radio-cards with latency hint ("~12 ms from you", static mock) and a simple inline-SVG dot map. 4 **Review**: summary `dl`, name `Input` (default generated "calm-otter-42", validate `^[a-z0-9-]{3,32}$`), checkbox "I understand billing starts now", primary "Deploy server".
- Nav: Back (ghost) / Next (primary, disabled until step valid). Prefill from query string (landing calculator). Keep progress in `sessionStorage['ch-deploy-draft']`; beforeunload nothing.
- Submit: button loading -> mock 2.5s provisioning panel (progress bar `role="progressbar"`, text steps "Allocating... Installing OS... Ready") -> redirect to `/dashboard` with success toast and the new card highlighted (`ring-2 ring-primary` 3s). Error: panel crit-soft with "Try again" (draft preserved).
- A11y: step heading receives focus on change (`tabIndex={-1}`), `Stepper` current step announced, errors linked with `aria-describedby`.

### E. Alerts (`app/dashboard/alerts/page.tsx`, `components/alerts/*`)
- Header + filter chips row (`Chip` with counts, `role="group" aria-label="Filter alerts"`): All, Open, Acknowledged, Snoozed, Resolved; second group by severity: Critical, Warning. Default = Open. Chip `rounded-pill px-3.5 min-h-9 border border-border text-ink-soft aria-pressed:bg-primary-soft aria-pressed:text-primary-ink aria-pressed:border-primary/40`. Persist filter in `localStorage['ch-alert-filter']`.
- **AlertCard** (list, not table): `Card p-5` with left severity rail `border-l-4 border-ok/warn/crit`, icon + `Badge` severity, title, detail, server name link, relative time, state badge. Actions row: **Acknowledge** (secondary), **Snooze** (Headless UI `Menu`: "1 hour", "24 hours"), **Resolve** (primary). Rules: acknowledge -> state `acknowledged`; snooze sets `snoozedUntil`, card shows "Snoozed until 6:40 pm", auto-returns to `open` when expired (checked on load + 30s interval); resolve -> `resolved` with toast + Undo (5s). Actions are optimistic with rollback + crit toast on mock failure.
- Mobile: actions collapse into a full-width `...` menu; chips scroll horizontally (`overflow-x-auto snap-x`).
- States: **loading** 4 skeleton cards; **empty** (per filter) EmptyState: Open -> "All quiet. Nothing needs you right now."; others "No <state> alerts."; **error** retry card. Bulk: "Resolve all acknowledged" (confirm Dialog).
- A11y: list `<ul>`, state changes announced via toast (polite live region), menu keyboard-operable, don't remove focus: after action focus moves to next card's first button or the list heading.

### F. Light/Dark: see section 2. Verify every component in both themes; charts/SVG use `currentColor` or `rgb(var(--token))` only.

### G. Auth pages (`app/auth/login`, `app/auth/register`, `components/auth/*`)
- Split layout (`AuthShell.tsx`): `min-h-screen grid lg:grid-cols-2`. Left (form): `flex flex-col justify-center px-6 sm:px-12 py-10`, logo top-left, ThemeToggle top-right, `max-w-sm w-full mx-auto`, h1 `font-display text-3xl`, subtitle, form, alt link. Right (art, `hidden lg:flex`): `bg-primary-soft` with `Illustration name="clouds"` (inline SVG: layered soft hills in primary/accent-soft tones, a few rounded clouds, a small server-rack glyph, gentle 12s float animation disabled for reduced motion) and a short reassuring quote card. No photos. Mobile: art hidden; a slim 96px illustration strip under logo optional.
- Fields: Input with visible `<label>`, show/hide password button (`aria-label`, `aria-pressed`), `autoComplete` (`email`, `current-password`/`new-password`), "Remember me" checkbox, forgot link.
- **Register** extras: name, email, password, confirm; `PasswordStrength.tsx` meter beneath password: 4 segments `h-1.5 rounded-pill` (`bg-surface-2`; filled `bg-crit` / `bg-warn` / `bg-warn` / `bg-ok` for levels weak/fair/good/strong), label text "Weak / Fair / Good / Strong" in `text-xs`, plus checklist (8+ chars, upper+lower, number, symbol) with check icons; `role="progressbar"` replaced by `aria-live="polite"` text so it is announced; `aria-describedby` from the input. Score = count of: length>=8, length>=12, mixed case, digit, symbol (cap 4); block submit below "Fair". Terms checkbox required.
- States: submitting (button loading, fields `aria-disabled`), field errors inline (`text-crit text-sm` + icon, `aria-invalid`), form-level error banner `rounded-lg bg-crit-soft text-crit p-3 role="alert"`, success -> redirect to dashboard (existing `useAuth`). Keep existing `authService` calls untouched.

## 6. Accessibility checklist (all features)
- Contrast: every text/background pair above is >=4.5:1 (body) or >=3:1 (large/UI); clay `accent` is non-text only.
- Keyboard: every interactive control reachable, logical order, visible `:focus-visible` ring (global), dialogs trap + restore focus, palette and menus fully operable by arrows/Enter/Esc.
- Semantics: landmarks (`header nav main footer`), one `h1` per page, skip link `Skip to content` first in body (`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 bg-surface rounded-lg px-4 py-2 shadow-lift`).
- Live regions: price (polite), toasts (polite/alert), strength label, search result count.
- Motion: respect `prefers-reduced-motion` (global rule; also skip number tweens and ring animation).
- Never colour-only status; sparklines/rings have text alternatives; touch targets >=44px; zoom to 200% without horizontal scroll.

## 7. Build order and parallel split
1. (A) Tokens done -> `layout.tsx` fonts + ThemeProvider + skip link; `ui/Button, Card, Badge, Input, Segmented, Chip, Skeleton, EmptyState, Slider, Illustration`, `lib/pricing.ts`.
2. (B) in parallel: `ui/Toast, Dialog, Stepper, Sparkline, RingGauge`, `lib/mock/*`, then `CommandPalette`.
3. (A) Landing + Auth. (B) Fleet, Deploy, Alerts, DashboardShell restyle.
4. Both: dark-mode pass, a11y pass (keyboard only, 200% zoom), delete legacy `brand/navy/page` aliases.
Rule: A never edits `components/{fleet,deploy,alerts}` or `app/dashboard/**`; B never edits `components/{marketing,auth}` or `app/{page,auth}`; shared `ui/*` files only by their owner, other dev requests changes.
