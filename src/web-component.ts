import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EtfSearch } from './components/EtfSearch'
import type { EtfVariant } from './types/etf'
import './index.css'

const OBSERVED_ATTRIBUTES = [
  'variant',
  'initial-query',
  'initial-categories',
  'initial-approach',
  'initial-order-by',
  'placeholder',
  'button-text',
  'height',
] as const

class BetasharesEtfSearch extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null
  private queryClient = new QueryClient()

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  connectedCallback() {
    this.root = createRoot(this)
    this.render()
  }

  disconnectedCallback() {
    this.root?.unmount()
    this.root = null
  }

  attributeChangedCallback() {
    this.render()
  }

  private render() {
    if (!this.root) return

    const rawCategories = this.getAttribute('initial-categories')
    const rawApproach = this.getAttribute('initial-approach')

    this.root.render(
      createElement(
        QueryClientProvider,
        { client: this.queryClient },
        createElement(EtfSearch, {
          variant: (this.getAttribute('variant') as EtfVariant) || 'search',
          initialQuery: this.getAttribute('initial-query') ?? undefined,
          initialCategories: rawCategories ? rawCategories.split(',') : undefined,
          initialApproach: rawApproach ? rawApproach.split(',') : undefined,
          initialOrderBy: this.getAttribute('initial-order-by') ?? undefined,
          placeholder: this.getAttribute('placeholder') ?? undefined,
          buttonText: this.getAttribute('button-text') ?? undefined,
          height: this.getAttribute('height') ?? undefined,
        }),
      ),
    )
  }
}

if (!customElements.get('betashares-etf-search')) {
  customElements.define('betashares-etf-search', BetasharesEtfSearch)
}
