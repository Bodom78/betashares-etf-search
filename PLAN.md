# BetaShares ETF Search — Implementation Plan

## Context
Build a greenfield frontend ETF search app as a BetaShares technical assessment. Connects to `POST https://search.betashares.services/search`. Ships as a web component with three variants (search trigger, button trigger, inline panel), a GitHub Pages demo page, and a professional README.

UX: daily.dev-inspired overlay panel with `Ctrl+K` trigger, filter chip bar, virtual-scroll results list, primary-color tinted backdrop.

---

## Security Protocol (applies before every install)

Before any `npm install`:
1. Run `npm info <package> version` — confirm latest published version
2. Cross-check against https://github.com/advisories (GitHub Advisory Database)
3. Prefer exact versions (no `^` or `~`) in package.json for reproducible installs
4. Run `npm audit --audit-level=high` after each install batch
5. If any HIGH/CRITICAL advisory is found — stop, investigate, find an alternative

---

## Commit Flow (per step)

```
Claude completes step
  → Claude supplies short commit message
    → You review, test, make manual adjustments
      → You commit with the supplied message
        → You signal "move to next step"
```

Each phase below has a 📦 **COMMIT** marker with the suggested message.

---

## Phase 1 — Project Scaffold

**What:** Init Vite + React + TypeScript. No dependencies yet beyond what the template ships with.

```bash
npm create vite@latest . -- --template react-ts
```

Clean up template boilerplate:
- Delete `src/App.css`, `src/assets/react.svg`, placeholder content in `src/App.tsx`
- Update `index.html` title to "BetaShares ETF Search"

📦 **COMMIT:** `chore: scaffold Vite React TypeScript project`

---

## Phase 2 — Security Audit & Core Dependencies

**What:** Research and install core runtime deps. Each package is verified before install.

### 2a — Version + advisory checks (run before installing)

```bash
npm info zod version
npm info use-debounce version
npm info lucide-react version
npm info clsx version
npm info tailwind-merge version
npm info class-variance-authority version

# Check for known advisories at the time of install:
npx better-npm-audit check    # or: npm audit (after install)
```

Cross-check the recent TanStack supply chain incident:
- Verify `@tanstack/*` packages are published by the `tanstack` npm org
- Check https://github.com/advisories?query=tanstack for any open advisories
- Inspect package signatures if available: `npm info @tanstack/react-query --json | grep _shasum`

### 2b — Install core utilities

```bash
npm install --save-exact \
  zod \
  use-debounce \
  lucide-react \
  clsx \
  tailwind-merge \
  class-variance-authority \
  @radix-ui/react-slot
```

```bash
npm audit --audit-level=high
```

📦 **COMMIT:** `chore: install core utility dependencies (exact versions, audit clean)`

---

## Phase 3 — TanStack Dependencies

**What:** Install TanStack Query, Router, and Virtual separately so each can be audited individually.

### 3a — Security checks

```bash
# Verify latest versions
npm info @tanstack/react-query version
npm info @tanstack/react-query-devtools version
npm info @tanstack/react-router version
npm info @tanstack/react-router-devtools version
npm info @tanstack/react-virtual version
npm info @tanstack/router-plugin version

# Verify publisher identity (defense against typosquatting)
npm info @tanstack/react-query --json | grep '"_npmUser"'
npm info @tanstack/react-router --json | grep '"_npmUser"'
```

### 3b — Install

```bash
npm install --save-exact \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  @tanstack/react-router \
  @tanstack/react-router-devtools \
  @tanstack/react-virtual

npm install --save-exact --save-dev \
  @tanstack/router-plugin

npm audit --audit-level=high
```

📦 **COMMIT:** `chore: install TanStack Query, Router, and Virtual (exact versions, audit clean)`

---

## Phase 4 — Tailwind, Build Tools, and Test Dependencies

### 4a — Security checks

```bash
npm info tailwindcss version
npm info @tailwindcss/vite version
npm info vite-plugin-css-injected-by-js version

# Test tooling
npm info vitest version
npm info @vitest/coverage-v8 version
npm info @testing-library/react version
npm info @testing-library/user-event version
npm info @testing-library/jest-dom version
npm info msw version
npm info jsdom version
```

### 4b — Install

```bash
npm install --save-exact --save-dev \
  tailwindcss \
  @tailwindcss/vite \
  vite-plugin-css-injected-by-js \
  vitest \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/user-event \
  @testing-library/jest-dom \
  msw \
  jsdom

npm audit --audit-level=high
```

Add test scripts to `package.json`:
```json
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage"
```

📦 **COMMIT:** `chore: install Tailwind CSS, build tooling, and test dependencies (exact versions, audit clean)`

---

## Phase 5 — Vite Configuration

**What:** Configure `vite.config.ts` (main app) and `vite.wc.config.ts` (web component IIFE build). Add npm scripts.

### `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [TanStackRouterVite({ target: 'react' }), react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  base: process.env.VITE_BASE ?? '/',
})
```

### `vite.wc.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), cssInjectedByJs()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    outDir: 'docs/dist',
    lib: {
      entry: 'src/web-component.ts',
      name: 'BetasharesEtfSearch',
      formats: ['iife'],
      fileName: () => 'etf-search.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
```

### `package.json` scripts to add
```json
"build:wc": "tsc --noEmit && vite build --config vite.wc.config.ts"
```

Verify `npm run dev` starts without errors before committing.

📦 **COMMIT:** `chore: configure Vite for main app and web component builds`

---

## Phase 6 — ShadCN Init + AI Skills

### 6a — ShadCN init

```bash
npm info @shadcn/ui version    # verify latest
npx shadcn@latest init         # Style: New York, Color: Zinc, CSS variables: Yes
```

This writes `components.json`, `tailwind.config.ts`, `src/lib/utils.ts`, and `src/index.css`.

### 6b — Add ShadCN components (in two batches to keep diffs readable)

**Batch 1 — core UI primitives:**
```bash
npx shadcn@latest add button input badge skeleton separator scroll-area
```

**Batch 2 — overlay and layout:**
```bash
npx shadcn@latest add dialog select sheet
```

### 6c — Install AI skills (project-level context for AI-assisted development)

```bash
npx @tanstack/intent@latest install   # select CLAUDE.md as config target
pnpm dlx skills add shadcn/ui         # or: npx skills add shadcn/ui
```

📦 **COMMIT:** `chore: init ShadCN UI, add component library, install AI skills`

---

## Phase 7 — TypeScript Types

**What:** Define all interfaces in one file. Everything else imports from here. Keep `EtfResult` loose initially — tighten after inspecting the real API response in Phase 11.

File: `src/types/etf.ts`

Key types:
- `EtfVariant` — `'search' | 'button' | 'inline'`
- `EtfSearchConfig` — all web component attributes as typed props
- `EtfFilters` — runtime filter state
- `DEFAULT_FILTERS` — exported constant
- `SearchRequest` — POST body shape
- `EtfResult` — result row (loosely typed with `[key: string]: unknown` initially)
- `SearchResponse` — `{ total, from, size, results }`
- `IndexSearch` — TanStack Router URL search params

📦 **COMMIT:** `feat: add TypeScript interfaces for ETF search data model`

---

## Phase 8 — API Layer

**What:** Pure fetch functions, no React. Always uses the full API URL — no proxy.

File: `src/api/search.ts`
- `fetchEtfs(req: SearchRequest): Promise<SearchResponse>` — POST wrapper with error handling
- `buildSearchRequest(filters, page, size): SearchRequest` — maps filter state to API request body

Manually test the API responds by temporarily calling it from the browser console or a quick `curl`:
```bash
curl -X POST https://search.betashares.services/search \
  -H "Content-Type: application/json" \
  -d '{"from":1,"size":5,"kind":["etf"]}' | jq .
```
This confirms the response shape before writing types — update `EtfResult` to match real fields.

📦 **COMMIT:** `feat: add API layer with fetch wrapper and request builder`

---

## Phase 9 — TanStack Infinite Query Hook

**What:** `useInfiniteQuery` hook that powers the virtual scroll list. Separate from the API layer.

File: `src/hooks/useEtfSearch.ts`
- `useEtfSearch(filters: EtfFilters)` — returns TanStack infinite query result
- `flattenPages(data)` — helper to flatten all pages into a single array
- Query key encodes full `filters` object so cache invalidates correctly on any change
- `staleTime: 60_000` — treat results fresh for 1 minute
- `getNextPageParam` — returns `undefined` when all results loaded

📦 **COMMIT:** `feat: add useEtfSearch infinite query hook with page accumulation`

---

## Phase 10 — ETF Result Row Components

**What:** The visual building blocks for individual results and their loading state.

Files:
- `src/components/results/EtfResultRow.tsx` — compact result row: ticker badge, name + category, 1Y return, fee, approach badge. Metrics hidden on mobile (`hidden sm:flex`).
- `src/components/results/EtfRowSkeleton.tsx` — skeleton row matching the same layout

Helper functions (co-located or in `src/lib/format.ts`):
- `formatReturn(v: number | null | undefined): string` — `"+12.34%"` or `"—"`
- `returnColor(v: number | null | undefined): string` — Tailwind class `text-green-500` / `text-red-500` / `text-muted-foreground`

📦 **COMMIT:** `feat: add ETF result row and skeleton components`

---

## Phase 11 — Virtual Scroll Results List

**What:** `useVirtualizer` from TanStack Virtual wired to `useInfiniteQuery`. Triggers next-page fetch when approaching the bottom.

File: `src/components/results/ResultsList.tsx`
- Fixed row height estimate: `68px`
- Overscan: `5` rows
- Sentinel pattern: append 3 `'__skeleton__'` items when `isFetchingNextPage`
- `useEffect` watching last virtual item index → calls `fetchNextPage()` when within 5 of end
- Initial loading state: 6 `EtfRowSkeleton` rows (before first page arrives)

📦 **COMMIT:** `feat: add virtual scroll results list with infinite page loading`

---

## Phase 12 — Panel Inner Components

**What:** The non-results content that lives inside the search panel.

Files:
- `src/components/panel/SearchInputRow.tsx` — input field + clear (×) button, `autoFocus` when in dialog
- `src/components/panel/DefaultState.tsx` — centered search icon + "Search for ETFs by name, ticker, or category" — shown when no query and no filters active
- `src/components/panel/EmptyState.tsx` — centered icon + "No ETFs found for '{query}'" — shown when results.length === 0 and not loading
- `src/components/panel/FooterHints.tsx` — `↩ Select   esc Close   N ETFs found` — hidden on mobile

📦 **COMMIT:** `feat: add search panel inner components (input row, default state, empty state, footer)`

---

## Phase 13 — Filter Bar

**What:** Horizontal scrollable row of toggleable category chips and sort dropdown.

Files:
- `src/components/filters/FilterChip.tsx` — ShadCN `Badge` as toggle: `variant="default"` active, `variant="outline"` inactive. Min touch target `h-8 px-3`.
- `src/components/filters/SortSelect.tsx` — ShadCN `Select` with four options: 1Y Return ↓/↑, Fee ↑, Name A–Z
- `src/components/filters/FilterBar.tsx` — horizontal scroll container (`overflow-x-auto`, no wrap) with all chips + sort. Exports `ASSET_CATEGORIES` and `MANAGEMENT_APPROACHES` constants.

📦 **COMMIT:** `feat: add filter bar with category chips and sort control`

---

## Phase 14 — Shared SearchPanel

**What:** The inner content reused by both the dialog (Phases 15) and inline wrapper (Phase 17). Contains SearchInputRow → FilterBar → results area → FooterHints.

File: `src/components/search/SearchPanel.tsx`

Props: `{ filters, onFiltersChange, onClose?, showFooter? }`

Logic:
- Calls `useEtfSearch(filters)` to get data
- Derives `hasQuery = search_text.length > 0 || asset_categories.length > 0 || management_approach.length > 0`
- Renders: `DefaultState` (no query, no loading) → `EmptyState` (0 results, done loading) → `ResultsList` (has results or loading)

📦 **COMMIT:** `feat: add shared SearchPanel component wiring all inner pieces together`

---

## Phase 15 — Search Dialog

**What:** ShadCN `Dialog` wrapping `SearchPanel`. Custom overlay tint (primary-color, no blur).

Files:
- `src/components/search/SearchDialog.tsx` — Dialog + DialogContent + SearchPanel. Full-screen on mobile (`w-screen h-screen rounded-none`), centered `max-w-3xl max-h-[80vh] rounded-2xl` on desktop.
- Overlay CSS override in `src/index.css`:
  ```css
  [data-slot="dialog-overlay"] {
    background-color: hsl(var(--background) / 0.85);
    background-image: linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, transparent 60%);
    backdrop-filter: none;
  }
  ```

📦 **COMMIT:** `feat: add search dialog with primary-color tinted overlay`

---

## Phase 16 — Trigger Components

**What:** The two trigger surfaces that open the dialog.

Files:
- `src/components/search/SearchTrigger.tsx` — input-style button with search icon left and `Ctrl K` kbd badges right. Full-width on mobile, `w-72` on desktop.
- `src/components/search/ButtonTrigger.tsx` — ShadCN `Button` accepting `text` and `variant` props.

📦 **COMMIT:** `feat: add search input trigger and button trigger variants`

---

## Phase 17 — Inline Wrapper

**What:** Renders `SearchPanel` directly on the page in a bordered container (no dialog, no trigger).

File: `src/components/search/InlineWrapper.tsx`
- Props: `{ filters, onFiltersChange, height: string }`
- Styled `div` with `border border-border rounded-xl overflow-hidden flex flex-col bg-card`
- Inline `style={{ height }}` from the `height` prop
- Passes `showFooter={false}` to `SearchPanel`

📦 **COMMIT:** `feat: add inline panel variant wrapper`

---

## Phase 18 — Root EtfSearch Component

**What:** The single entry point. Reads `variant` and routes to the correct surface. Manages `open` state and `filters` state. Registers the `Ctrl+K` keyboard handler.

File: `src/components/EtfSearch.tsx`

Logic:
- `variant === 'inline'` → `InlineWrapper` (no dialog, no trigger)
- `variant === 'button'` → `ButtonTrigger` + `SearchDialog`; resets filters to `initialXxx` props on re-open
- `variant === 'search'` (default) → `SearchTrigger` + `SearchDialog`
- `Ctrl+K` listener: only registered for search + button variants
- Accepts `onFiltersChange?` and `onOpenChange?` callbacks for the full-app URL state layer

📦 **COMMIT:** `feat: add root EtfSearch component with variant routing and Ctrl+K shortcut`

---

## Phase 19 — Router + Full App Wiring

**What:** Wire TanStack Router for the full development app. URL search params act as the authoritative filter state.

Files:
- `src/router.ts` — `createRouter` instance
- `src/routes/__root.tsx` — layout shell: sticky header (BetaShares brand + `EtfSearch` trigger), minimal hero content in main, `TanStackRouterDevtools`
- `src/routes/index.tsx` — Zod `validateSearch` schema; reads URL params → passes as `initialFilters` to `EtfSearch`; `onFiltersChange` → `navigate`; `onOpenChange` → sets `?open=1`
- `src/main.tsx` — `QueryClientProvider` → `RouterProvider`; `ReactQueryDevtools`

Verify: `npm run dev` — change filters → URL updates → browser Back restores state.

📦 **COMMIT:** `feat: wire TanStack Router with URL state management for filters and search`

---

## Phase 20 — Tests

**What:** Unit and integration tests for key components and functions. Written after all components exist so tests can import real implementations without stubs.

### Test infrastructure setup

`vite.config.ts` — add `test` block:
```ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test-setup.ts'],
  coverage: { provider: 'v8', reporter: ['text', 'html'] },
}
```

`src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
import { server } from './mocks/server'
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

`src/mocks/handlers.ts` — MSW handler for the search API:
```ts
import { http, HttpResponse } from 'msw'
export const handlers = [
  http.post('https://search.betashares.services/search', async ({ request }) => {
    const body = await request.json()
    // Return a small fixture based on search_text for deterministic tests
    return HttpResponse.json(mockSearchResponse(body))
  }),
]
```

`src/mocks/server.ts`:
```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
export const server = setupServer(...handlers)
```

📦 **COMMIT:** `test: add test infrastructure (Vitest config, MSW handlers, test setup)`

---

### Unit tests — pure functions

`src/__tests__/api/search.test.ts` — tests `buildSearchRequest`:
- Empty filters → only `from`, `size`, `kind` in output
- `search_text` set → included in request
- `asset_categories` array → included; empty array → omitted
- Page 2 → `from` equals `pageSize + 1`
- `management_fee` with `fee_max` set → range object present

`src/__tests__/lib/format.test.ts` — tests `formatReturn` and `returnColor`:
- Positive number → `"+12.34%"` and `text-green-500`
- Negative number → `"-3.50%"` and `text-red-500`
- `null` / `undefined` → `"—"` and `text-muted-foreground`

`src/__tests__/hooks/useEtfSearch.test.ts` — integration test using MSW:
- Default filters → fires correct POST body; returns flattened results
- `flattenPages` with multi-page data → single flat array
- `getNextPageParam` returns `undefined` when all results loaded

📦 **COMMIT:** `test: add unit tests for API builder, formatters, and query hook`

---

### Component tests

`src/__tests__/components/FilterChip.test.tsx`:
- Renders label text
- Active state → `data-variant="default"` (or class check)
- Click → calls `onToggle`
- Inactive state → `data-variant="outline"`

`src/__tests__/components/FilterBar.test.tsx`:
- All asset category chips render
- Clicking a chip calls `onChange` with toggled array
- Sort select change calls `onChange` with new `order_by`

`src/__tests__/components/EtfResultRow.test.tsx`:
- Renders ticker, fund name, asset category
- Positive 1Y return → green color class applied
- Negative return → red color class applied
- `null` return → renders `"—"`
- `management_fee` renders with `%` suffix

`src/__tests__/components/SearchTrigger.test.tsx`:
- Renders search placeholder text
- Renders `Ctrl` and `K` keyboard hints
- Click → calls `onClick` prop

`src/__tests__/components/EtfSearch.test.tsx` — smoke tests for each variant:
- `variant="search"` → trigger button renders, dialog not visible
- `variant="button"` → button with custom text renders
- `variant="inline"` → no trigger button, panel content renders directly

Run all tests and confirm green before committing:
```bash
npm run test:run
```

📦 **COMMIT:** `test: add component tests for FilterBar, EtfResultRow, SearchTrigger, and EtfSearch variants`

---

## Phase 21 — Web Component

**What:** Custom Element wrapper that parses HTML attributes and re-renders on attribute changes. Light DOM only (no shadow DOM) so injected CSS applies normally.

File: `src/web-component.ts`

Key details:
- `static get observedAttributes()` — all 8 configurable attributes
- `attributeChangedCallback()` — calls `this.render()` with updated props
- `connectedCallback` / `disconnectedCallback` — mount / unmount React root
- Guard: `if (!customElements.get('betashares-etf-search'))` — safe for multiple script loads

📦 **COMMIT:** `feat: add web component custom element with attribute-driven configuration`

---

## Phase 22 — Web Component Build + Smoke Test

**What:** Verify the IIFE build is self-contained and the web component works in a plain HTML file before building the full demo page.

```bash
npm run build:wc
# Check output size and that docs/dist/etf-search.js exists
```

Create a temporary `test.html` at the repo root (not committed):
```html
<!DOCTYPE html>
<html><body>
  <script src="./docs/dist/etf-search.js"></script>
  <betashares-etf-search></betashares-etf-search>
</body></html>
```
Open with `npx serve .` or browser file:// and verify the component renders and the API call fires.

No commit for this phase — it's a verification step only.

---

## Phase 23 — GitHub Pages Demo Page

**What:** Professional library demo page showing all three variants working, with copyable code samples.

File: `docs/index.html`

Structure:
1. Header — logo + nav links (Variants, Configuration, GitHub)
2. Hero — title, tagline, install snippet
3. Section: Variant 1 — search input + code sample
4. Section: Variant 2 — three button examples (default, outline pre-filtered by category, secondary pre-sorted) + code sample
5. Section: Variant 3 — inline panel at `height="550px"` + code sample
6. Section: Configuration — full attribute reference table
7. Footer

All styling done with minimal inline CSS (body background, layout, code blocks). The web component injects its own Tailwind CSS.

📦 **COMMIT:** `feat: add GitHub Pages demo page with all three variants and configuration docs`

---

## Phase 24 — README

**What:** Professional open-source library README.

Structure:
1. Title + badges (build status, demo link)
2. Features list
3. Live Demo link
4. Quick Start (script tag + npm)
5. Usage — one section per variant with HTML code examples
6. Configuration Reference — full attribute table with types, defaults, descriptions
7. Development — prerequisites, setup, project structure, build instructions
8. Architecture Notes — why TanStack Query/Router/Virtual, ShadCN, web component approach
9. AI Usage — honest note required by the assessment
10. License

📦 **COMMIT:** `docs: add professional README with usage guide and configuration reference`

---

## Phase 25 — GitHub Pages Deployment

**What:** Push everything and enable GitHub Pages.

```bash
# Confirm docs/ is committed and docs/dist/etf-search.js is present
git log --oneline docs/
```

In GitHub repo Settings → Pages → Source: branch `main`, folder `/docs`.

Verify live URL serves the demo with all three variants working.

📦 **COMMIT:** (none — just settings change in GitHub UI)

---

## File Dependency Map (build order matters)

```
types/etf.ts
  └─► api/search.ts
        └─► hooks/useEtfSearch.ts
              └─► results/EtfResultRow.tsx
              └─► results/EtfRowSkeleton.tsx
              └─► results/ResultsList.tsx          ← needs useEtfSearch + row components
              └─► panel/{SearchInputRow, DefaultState, EmptyState, FooterHints}.tsx
              └─► filters/{FilterChip, SortSelect, FilterBar}.tsx
                    └─► search/SearchPanel.tsx      ← needs all of the above
                          └─► search/SearchDialog.tsx
                          └─► search/InlineWrapper.tsx
                          └─► search/SearchTrigger.tsx
                          └─► search/ButtonTrigger.tsx
                                └─► EtfSearch.tsx   ← root component
                                      └─► routes/   ← full app wiring
                                      └─► web-component.ts
```

---

## Verification Checklist (final)

- [ ] `npm audit` clean at every install phase — no HIGH/CRITICAL advisories
- [ ] Variant 1: Ctrl+K opens dialog, input auto-focuses, ESC closes
- [ ] Variant 2: button opens dialog with `initial-categories`/`initial-query` pre-applied
- [ ] Variant 3: inline panel renders in page flow, no trigger, no overlay
- [ ] Virtual scroll: smooth infinite loading, skeletons at bottom, stops when all loaded
- [ ] Filter chips toggle, sort changes, URL updates (full app) — all without page reload
- [ ] Default state when empty; empty state when no results
- [ ] Mobile (375px): dialog full-screen, chips scroll horizontally, rows readable
- [ ] `npm run test:run` → all tests pass (unit + component + integration)
- [ ] `npm run build:wc` → single IIFE in `docs/dist/etf-search.js`
- [ ] `docs/index.html` → all three variants live, attribute changes work
- [ ] GitHub Pages URL serves demo
- [ ] Commit history: ~25 small, reviewable commits
