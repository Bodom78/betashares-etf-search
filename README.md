# Betashares ETF Search

A self-contained web component for searching and filtering Betashares ETFs. Drop a single `<script>` tag into any page - no framework, no build step, no CSS conflicts. [Live demo](https://bodom78.github.io/betashares-etf-search/).

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://bodom78.github.io/betashares-etf-search/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-ff4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1-ff4154?logo=reactquery&logoColor=white)](https://tanstack.com/router)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com)

---

## Local Development

### Prerequisites

- **Node.js** 20 or later - [nodejs.org](https://nodejs.org)
- **npm** 10 or later (bundled with Node.js)
- **Git**

Verify your versions:

```bash
node --version   # v20.x or higher
npm --version    # 10.x or higher
```

### 1. Clone the repository

```bash
git clone https://github.com/bodom78/betashares-etf-search.git
cd betashares-etf-search
```

### 2. Install dependencies

```bash
npm install
```

### 3. Choose your workflow

#### Option A - Dev server (recommended for editing)

```bash
npm run dev
```

Opens a Vite dev server at `http://localhost:5173` with hot module replacement. The dev app renders all three component variants as a React app - not as a web component - which makes iteration fast and enables React DevTools.

Best for: editing components, debugging, and developing against the live API.

#### Option B - Build and preview the web component

```bash
npm run build:wc
```

Compiles everything into a single IIFE bundle at `docs/dist/etf-search.js` (~450 KB). To preview it:

```bash
# Using the serve package (no install required)
npx serve docs

# Or Python's built-in server
python3 -m http.server --directory docs 8080
```

Best for: verifying Shadow DOM behaviour, testing how the component embeds in a plain HTML page, and previewing the production bundle.

### Other commands

```bash
npm test                # run tests in interactive watch mode
npm run test:run        # run tests once and exit
npm run test:coverage   # run tests with coverage report
npm run lint            # run ESLint
```

Tests use **Vitest** + **Testing Library** + **MSW** for API mocking.

---

## Quick Start

```html
<script src="https://bodom78.github.io/betashares-etf-search/dist/etf-search.js"></script>

<betashares-etf-search api-url="https://betashares-search-proxy.betashares.workers.dev"></betashares-etf-search>
```

Press **Ctrl+K** (or **Cmd+K** on Mac) to open the search dialog.

---

## Features

- **Three variants** - search trigger (Ctrl/Cmd+K), button trigger, and inline panel
- **Shadow DOM isolation** - the component's styles never leak out, and the host page's styles never leak in
- **Filter bar** - asset category and management approach dropdowns, sort dropdown with 3-state cycling
- **Virtualised results** - TanStack Virtual renders only visible rows, handles large lists smoothly
- **Inline detail panel** - select any fund to expand a detail view with stats and top holdings
- **Debounced text search** - 300 ms debounce on text input; filter and sort changes query immediately
- **Keyboard accessible** - full Radix UI accessibility primitives (focus traps, ARIA roles, Escape to close)
- **Zero host-page dependencies** - single IIFE bundle; React and all UI code are bundled inside

---

## Variants

### `search` (default) - search trigger

Renders an input-style button. Clicking it, or pressing Ctrl+K anywhere on the page, opens the full search dialog.

```html
<betashares-etf-search api-url="https://betashares-search-proxy.betashares.workers.dev"></betashares-etf-search>
```

### `button` - button trigger

Renders a plain button. Useful when you want to pre-apply filters before the dialog opens.

```html
<betashares-etf-search
  variant="button"
  button-text="Browse Australian Equities"
  initial-categories="Australian Equities"
  initial-order-by="one_year_return.desc"
  auto-focus="false"
  api-url="https://betashares-search-proxy.betashares.workers.dev"
></betashares-etf-search>
```

### `inline` - inline panel

Renders the full search panel directly in the page flow - no trigger, no overlay. Ideal for dedicated search or fund-finder pages.

```html
<betashares-etf-search
  variant="inline"
  height="600px"
  api-url="https://betashares-search-proxy.betashares.workers.dev"
></betashares-etf-search>
```

---

## Configuration Reference

All attributes are optional. The component works with zero configuration.

| Attribute            | Type                               | Default                                     | Description                                                                                                    |
| -------------------- | ---------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `variant`            | `"search" \| "button" \| "inline"` | `"search"`                                  | Which surface to render                                                                                        |
| `api-url`            | `string`                           | Betashares API                              | Search endpoint. Required when embedding on external domains - point to a CORS-enabled proxy                   |
| `initial-query`      | `string`                           | -                                           | Pre-fills the search input when the dialog opens                                                               |
| `initial-categories` | `string`                           | -                                           | Comma-separated asset categories to pre-select. E.g. `"Australian Equities,Cash"`                              |
| `initial-approach`   | `string`                           | -                                           | Comma-separated management approaches to pre-select. E.g. `"Active"`                                           |
| `initial-order-by`   | `string`                           | -                                           | Pre-selected sort in dot notation. E.g. `"one_year_return.desc"`, `"management_fee.asc"`, `"display_name.asc"` |
| `auto-focus`         | `boolean`                          | `true`                                      | Whether to focus the search input when the dialog opens. Set to `false` when pre-applying filters so results are immediately scrollable |
| `placeholder`        | `string`                           | `"Search by ASX code, fund name or phrase"` | Placeholder for the search input and trigger button                                                            |
| `max-width`          | `string`                           | -                                           | Max width of the search trigger. Any valid CSS value. Only applies when `variant="search"`                     |
| `button-text`        | `string`                           | `"Search ETFs"`                             | Button label. Only applies when `variant="button"`                                                             |
| `height`             | `string`                           | `"550px"`                                   | Height of the inline panel. Any valid CSS value. Only applies when `variant="inline"`                          |

---

## Architecture Notes

### Shadow DOM isolation

The custom element attaches a shadow root on first connection. All CSS (Tailwind + ShadCN tokens) is injected as a `<style>` tag inside the shadow root, so the host page's CSS cannot affect the component and vice versa.

`:root` selectors in the Tailwind/ShadCN stylesheet are rewritten to `:host` so custom property definitions apply inside the shadow root.

Tailwind v4 registers `--tw-*` custom properties via `@property { inherits: false }`. These must be registered at the document level (not inside a shadow root) to take effect. The component extracts all `@property` blocks and injects them into `document.head` once via `ensureAtPropertyDeclarations()`.

### Radix UI portals

Radix Dialog and DropdownMenu portal their floating content to `document.body` by default, which is outside the shadow root and therefore unstyled. All Radix components are wired to a `PortalContext` that redirects portals into a dedicated `<div>` appended to the shadow root, keeping all DOM and styles inside the component.

### Ctrl+K singleton

When multiple `<betashares-etf-search>` elements exist on the same page, only one dialog should open per keypress. A module-level handler registry (`_ctrlKHandlers`) ensures a single `window` listener is added; only the first registered handler is invoked.

### CORS proxy

The Betashares search API (`search.betashares.services`) does not include CORS headers, so browsers block direct requests from any external origin. A minimal Cloudflare Worker (`proxy/worker.js`) sits in front of the API, forwards the request body unchanged, and attaches the required `Access-Control-Allow-Origin` header. This is what the `api-url` attribute points to when the component is embedded outside of betashares.com.au.

### Pagination

The API uses 0-based `from` offsets with a `size` page limit. TanStack Query's `useInfiniteQuery` handles pagination; a scroll listener on the results container triggers the next page fetch when the user scrolls near the end of the loaded results.

---

## AI Usage and Process

The development process breakdown:

- Read the Technical Assessment document
- Look at the funds search functionality on the Betashares website
- Research UI/UX search patterns and implementations taking notes along the way of what I may want to use.
- Decide on technology stack.
  - I decided on TanStack as I've never used and have been keen to for a while now and had features suitable for this project.
  - And ShadCN as I've used it before and love the ease in which you can extend, customize and combine elements.
- Fed the technical document into Claude in plan mode to get a stating point for the plan.
- Iterated heavily on the plan as I started to build a mental model the end result.
- Ensured the plan accounted for the recent npm supply chain attacks with checks on each lib install
- Broke the plan down into manageable chunks where:
  - Small update is made
  - I review, adjust and confirm it's good enough to proceed
  - Noted any issues to comeback to, ie: bugs, bad layout etc
  - Committed to git
  - Moved on to next phase.
- Once the plan was completed I moved to a iteration process of:
  - Focus on issues
  - Prompt fix
  - Manual editing where prompt would take longer
  - Test and commit
  - Repeat
- Once everything was looking good I moved to more superficial updates like wording updates, UI/UX tweaks, improving demo page.

Betashares has made it clear that the use of AI is of vital importance for the position so I opted to make use of it as much as possible during the development of this technical assessment. This initial plan has been included and can be viewed [here](PLAN.md).
