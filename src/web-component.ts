import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EtfSearch } from './components/EtfSearch'
import type { EtfVariant } from './types/etf'
import cssText from './index.css?inline'

// Compute both derived strings from a single reference to cssText.
// _atPropertyDecls is derived from _shadowCss (same content, @property blocks
// don't contain :root so the replacement doesn't affect them) so cssText is
// only accessed once — preventing Rollup from emitting a second copy.
const _shadowCss = cssText.replace(/:root\b/g, ':host')
const _atPropertyDecls = _shadowCss.match(/@property\s+[^{]+\{[^}]+\}/g)?.join('\n') ?? ''

const OBSERVED_ATTRIBUTES = [
  'variant',
  'api-url',
  'initial-query',
  'initial-categories',
  'initial-approach',
  'initial-order-by',
  'placeholder',
  'max-width',
  'button-text',
  'height',
] as const

// Tailwind v4 uses @property to register --tw-* variables with inherits:false
// and specific initial-values (e.g. --tw-border-style: solid). @property inside
// a shadow root stylesheet is NOT registered at the document level, so shadow DOM
// elements never see the initial-values → border-style resolves to "none", etc.
// Injecting @property into document.head registers them globally for all shadow roots.
let atPropsInjected = false
function ensureAtPropertyDeclarations() {
  if (atPropsInjected || !_atPropertyDecls) return
  atPropsInjected = true
  const style = document.createElement('style')
  style.setAttribute('data-bs-etf-props', '')
  style.textContent = _atPropertyDecls
  document.head.appendChild(style)
}

// font-family inherits into shadow DOM, so loading Figtree at the document level
// makes it available to all component instances without bundling font files.
let fontInjected = false
function ensureFontLoaded() {
  if (fontInjected) return
  fontInjected = true
  if (!document.querySelector('link[data-bs-etf-font]')) {
    const preconnect1 = document.createElement('link')
    preconnect1.rel = 'preconnect'
    preconnect1.href = 'https://fonts.googleapis.com'
    document.head.appendChild(preconnect1)

    const preconnect2 = document.createElement('link')
    preconnect2.rel = 'preconnect'
    preconnect2.href = 'https://fonts.gstatic.com'
    preconnect2.crossOrigin = 'anonymous'
    document.head.appendChild(preconnect2)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap'
    link.setAttribute('data-bs-etf-font', '')
    document.head.appendChild(link)
  }
}

class BetasharesEtfSearch extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null
  private queryClient = new QueryClient()
  private container: HTMLDivElement | null = null
  private portalContainer: HTMLDivElement | null = null

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  connectedCallback() {
    ensureAtPropertyDeclarations()
    ensureFontLoaded()

    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' })

      const style = document.createElement('style')
      style.textContent = _shadowCss
      shadow.appendChild(style)

      this.container = document.createElement('div')
      shadow.appendChild(this.container)

      // Separate container for Radix dialog portals — keeps all DOM and styles
      // inside the shadow root so the host page's CSS cannot interfere.
      this.portalContainer = document.createElement('div')
      shadow.appendChild(this.portalContainer)
    }

    this.root = createRoot(this.container!)
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
          apiUrl: this.getAttribute('api-url') ?? undefined,
          initialQuery: this.getAttribute('initial-query') ?? undefined,
          initialCategories: rawCategories ? rawCategories.split(',') : undefined,
          initialApproach: rawApproach ? rawApproach.split(',') : undefined,
          initialOrderBy: this.getAttribute('initial-order-by') ?? undefined,
          placeholder: this.getAttribute('placeholder') ?? undefined,
          maxWidth: this.getAttribute('max-width') ?? undefined,
          buttonText: this.getAttribute('button-text') ?? undefined,
          height: this.getAttribute('height') ?? undefined,
          portalContainer: this.portalContainer,
        }),
      ),
    )
  }
}

if (!customElements.get('betashares-etf-search')) {
  customElements.define('betashares-etf-search', BetasharesEtfSearch)
}
