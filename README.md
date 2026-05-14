# Betashares ETF Search

A self-contained web component for searching and filtering Betashares ETFs. Drop a single `<script>` tag into any page — no framework, no build step, no CSS conflicts.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://Bodom78.github.io/betashares-etf-search/)
[![Built with React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript)](https://www.typescriptlang.org)

---

## Features

- **Three variants** — search trigger (Cmd/Ctrl+K), button trigger, and inline panel
- **Shadow DOM isolation** — the component's styles never leak out, and the host page's styles never leak in
- **Filter bar** — asset category chips, management approach chips, sort order select
- **Virtualised results** — TanStack Virtual renders only visible rows, handles large lists smoothly
- **Debounced search** — 300 ms debounce on text input; single query client shared across all instances
- **Keyboard accessible** — full Radix UI accessibility primitives (focus traps, ARIA roles, Escape to close)
- **Zero dependencies on the host page** — single IIFE bundle; React and all UI code are bundled inside

---

## Live Demo

[https://Bodom78.github.io/betashares-etf-search/](https://Bodom78.github.io/betashares-etf-search/)

---

## Quick Start

```html
<script src="https://Bodom78.github.io/betashares-etf-search/dist/etf-search.js"></script>

<!-- Default search trigger -->
<betashares-etf-search
  api-url="https://betashares-search-proxy.betashares.workers.dev"
></betashares-etf-search>
```

That's it. Press **Ctrl+K** (or **Cmd+K** on Mac) to open the search dialog.

---

## Variants

### `search` (default) — search trigger

Renders an input-style button. Clicking it, or pressing Ctrl+K anywhere on the page, opens the full search dialog.

```html
<betashares-etf-search
  api-url="https://betashares-search-proxy.betashares.workers.dev"
  placeholder="Search ETFs…"
></betashares-etf-search>
```

### `button` — button trigger

Renders a plain button. Useful when you want to pre-apply filters before the dialog opens.

```html
<betashares-etf-search
  variant="button"
  button-text="Browse Australian Equities"
  initial-categories="Australian Equities"
  initial-order-by="one_year_return_desc"
  api-url="https://betashares-search-proxy.betashares.workers.dev"
></betashares-etf-search>
```

### `inline` — inline panel

Renders the full search panel directly in the page flow — no trigger, no overlay. Ideal for dedicated search or fund-finder pages.

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

| Attribute | Type | Default | Description |
|---|---|---|---|
| `variant` | `"search" \| "button" \| "inline"` | `"search"` | Which surface to render |
| `api-url` | `string` | Betashares API | Search endpoint. Required when embedding on external domains — point to a CORS-enabled proxy |
| `initial-query` | `string` | — | Pre-fills the search input when the dialog opens |
| `initial-categories` | `string` | — | Comma-separated asset categories to pre-activate. E.g. `"Australian Equities,Cash"` |
| `initial-approach` | `string` | — | Comma-separated management approaches to pre-activate. E.g. `"Active"` |
| `initial-order-by` | `string` | — | Pre-selected sort. One of `one_year_return_desc`, `one_year_return_asc`, `management_fee_asc`, `display_name_asc` |
| `placeholder` | `string` | `"Search ETFs…"` | Placeholder text for the search input |
| `button-text` | `string` | `"Search ETFs"` | Button label. Only applies when `variant="button"` |
| `height` | `string` | `"550px"` | Height of the inline panel. Any valid CSS value. Only applies when `variant="inline"` |

---

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Dev server

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173`. The dev app (`index.html`) uses `<EtfSearch>` as a React component with TanStack Router — not as a web component — which makes iteration faster.

### Test web component locally

```bash
npm run build:wc
```

Then open `docs/index.html` in a browser (or serve it with any static server). This is the same page deployed to GitHub Pages.

```bash
npx serve docs
```

### Run tests

```bash
npm test          # watch mode
npm run test:run  # single run
npm run test:coverage
```

Tests use Vitest + Testing Library + MSW for API mocking.

### Lint

```bash
npm run lint
```

### Build web component bundle

```bash
npm run build:wc
```

Outputs a single IIFE to `docs/dist/etf-search.js` (~500 KB, includes React + all dependencies).

---

## Architecture

### Component structure

```
src/
├── web-component.ts        # Custom element registration + Shadow DOM setup
├── components/
│   ├── EtfSearch.tsx       # Root component — variant routing, Ctrl+K singleton
│   ├── search/
│   │   ├── SearchDialog.tsx    # Radix Dialog wrapper
│   │   ├── SearchPanel.tsx     # Filter bar + results list
│   │   ├── SearchTrigger.tsx   # Input-style trigger button
│   │   ├── ButtonTrigger.tsx   # Plain button trigger
│   │   └── InlineWrapper.tsx   # Inline panel without overlay
│   ├── filters/            # Category chips, approach chips, sort select
│   ├── results/            # Virtualised result rows
│   └── ui/                 # ShadCN component primitives
├── context/
│   ├── ApiUrlContext.ts    # Provides api-url down the tree
│   └── PortalContext.ts    # Provides the shadow-root portal container to Radix portals
├── hooks/                  # useEtfSearch (TanStack Query), useCategories, etc.
└── types/etf.ts            # Shared TypeScript types
```

### Shadow DOM isolation

The custom element attaches a shadow root on first connection. All CSS (Tailwind + ShadCN tokens) is injected as a `<style>` tag inside the shadow root, so:

- The host page's CSS cannot affect the component.
- The component's CSS cannot affect the host page.

`:root` selectors in the Tailwind/ShadCN stylesheet are rewritten to `:host` so custom property definitions apply inside the shadow root.

Tailwind v4 registers `--tw-*` custom properties via `@property { inherits: false }`. These must be registered at the document level (not inside a shadow root) to take effect. The component extracts all `@property` blocks and injects them into `document.head` once, via `ensureAtPropertyDeclarations()`.

### Radix UI portals

Radix Dialog and Select portal their floating content. By default they target `document.body`, which is outside the shadow root and therefore unstyled. Both components are wired to a `PortalContext` that redirects portals into a dedicated `<div>` appended to the shadow root, keeping all DOM and styles isolated.

### Ctrl+K singleton

When multiple `<betashares-etf-search>` elements exist on the same page, only one dialog should open per keypress. A module-level handler registry (`_ctrlKHandlers`) ensures a single `window` listener is added; only the first registered handler is invoked.

---

## AI Usage Disclosure

This project was built as a technical assessment with substantial assistance from Claude (Anthropic). AI was used throughout the development process — architecture design, component implementation, test authorship, debugging, and documentation. All code was reviewed and validated by the author.
