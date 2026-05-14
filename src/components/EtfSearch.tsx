import { useState, useEffect, useCallback } from 'react'
import type { EtfFilters, EtfResult, EtfVariant } from '@/types/etf'
import { DEFAULT_FILTERS } from '@/types/etf'
import { SearchDialog } from './search/SearchDialog'
import { SearchTrigger } from './search/SearchTrigger'
import { ButtonTrigger } from './search/ButtonTrigger'
import { InlineWrapper } from './search/InlineWrapper'

interface Props {
  variant?: EtfVariant
  initialQuery?: string
  initialCategories?: string[]
  initialApproach?: string[]
  initialOrderBy?: string
  placeholder?: string
  buttonText?: string
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost'
  height?: string
  onFiltersChange?: (filters: EtfFilters) => void
  onOpenChange?: (open: boolean) => void
  onSelect?: (result: EtfResult) => void
  open?: boolean
  filters?: EtfFilters
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
    placeholder,
    buttonText,
    buttonVariant,
    height,
    onFiltersChange,
    onOpenChange,
    onSelect,
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

  useEffect(() => {
    if (variant === 'inline') return
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        handleOpenChange(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [variant, handleOpenChange])

  if (variant === 'inline') {
    return (
      <InlineWrapper
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSelect={onSelect}
        height={height}
        placeholder={placeholder}
      />
    )
  }

  return (
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
}
