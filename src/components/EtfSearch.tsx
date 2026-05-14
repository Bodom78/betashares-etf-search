import { useState, useEffect, useCallback, useRef } from 'react'
import type { EtfFilters, EtfResult, EtfVariant } from '@/types/etf'
import { DEFAULT_FILTERS } from '@/types/etf'
import { ApiUrlContext } from '@/context/ApiUrlContext'
import { PortalContext } from '@/context/PortalContext'
import { SEARCH_API_URL } from '@/config'
import { SearchDialog } from './search/SearchDialog'
import { SearchTrigger } from './search/SearchTrigger'
import { ButtonTrigger } from './search/ButtonTrigger'
import { InlineWrapper } from './search/InlineWrapper'

// Module-level singleton so only one dialog opens per Ctrl+K press,
// regardless of how many component instances exist on the page.
type KHandler = () => void
const _ctrlKHandlers: KHandler[] = []
let _ctrlKListenerAdded = false

function addCtrlKHandler(fn: KHandler): () => void {
  if (!_ctrlKListenerAdded) {
    _ctrlKListenerAdded = true
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        _ctrlKHandlers[0]?.()
      }
    })
  }
  _ctrlKHandlers.push(fn)
  return () => {
    const i = _ctrlKHandlers.indexOf(fn)
    if (i !== -1) _ctrlKHandlers.splice(i, 1)
  }
}

interface Props {
  variant?: EtfVariant
  apiUrl?: string
  initialQuery?: string
  initialCategories?: string[]
  initialApproach?: string[]
  initialOrderBy?: string
  placeholder?: string
  maxWidth?: string
  buttonText?: string
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost'
  height?: string
  onFiltersChange?: (filters: EtfFilters) => void
  onOpenChange?: (open: boolean) => void
  onSelect?: (result: EtfResult) => void
  open?: boolean
  filters?: EtfFilters
  portalContainer?: HTMLElement | null
}

function buildInitialFilters(props: Props): EtfFilters {
  return {
    search_text: props.initialQuery ?? DEFAULT_FILTERS.search_text,
    asset_categories: props.initialCategories ?? DEFAULT_FILTERS.asset_categories,
    management_approach: props.initialApproach ?? DEFAULT_FILTERS.management_approach,
    order_by: props.initialOrderBy ?? DEFAULT_FILTERS.order_by,
  }
}

export function EtfSearch(props: Props) {
  const {
    variant = 'search',
    apiUrl = SEARCH_API_URL,
    placeholder,
    maxWidth,
    buttonText,
    buttonVariant,
    height,
    onFiltersChange,
    onOpenChange,
    onSelect,
    portalContainer = null,
  } = props

  const isControlled = props.open !== undefined && props.filters !== undefined

  const [internalOpen, setInternalOpen] = useState(false)
  const [internalFilters, setInternalFilters] = useState<EtfFilters>(
    buildInitialFilters(props),
  )

  const open = isControlled ? props.open! : internalOpen
  const filters = isControlled ? props.filters! : internalFilters

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next)
        if (next) setInternalFilters(buildInitialFilters(props))
      }
      onOpenChange?.(next)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isControlled, onOpenChange, props.initialQuery, props.initialCategories, props.initialApproach, props.initialOrderBy],
  )

  const handleFiltersChange = useCallback(
    (next: EtfFilters) => {
      if (!isControlled) setInternalFilters(next)
      onFiltersChange?.(next)
    },
    [isControlled, onFiltersChange],
  )

  const handleOpenChangeRef = useRef(handleOpenChange)
  handleOpenChangeRef.current = handleOpenChange

  useEffect(() => {
    if (variant === 'inline') return
    return addCtrlKHandler(() => handleOpenChangeRef.current(true))
  }, [variant])

  const inner =
    variant === 'inline' ? (
      <InlineWrapper
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSelect={onSelect}
        height={height}
        placeholder={placeholder}
      />
    ) : (
      <>
        {variant === 'button' ? (
          <ButtonTrigger
            onClick={() => handleOpenChange(true)}
            text={buttonText}
            variant={buttonVariant}
          />
        ) : (
          <SearchTrigger
            onClick={() => handleOpenChange(true)}
            placeholder={placeholder}
            maxWidth={maxWidth}
          />
        )}
        <SearchDialog
          open={open}
          onOpenChange={handleOpenChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSelect={onSelect}
          placeholder={placeholder}
        />
      </>
    )

  return (
    <ApiUrlContext.Provider value={apiUrl}>
      <PortalContext.Provider value={portalContainer}>
        {inner}
      </PortalContext.Provider>
    </ApiUrlContext.Provider>
  )
}
