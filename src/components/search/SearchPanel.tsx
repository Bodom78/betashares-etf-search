import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { useEtfSearch, flattenPages } from '@/hooks/useEtfSearch'
import type { EtfFilters, EtfResult } from '@/types/etf'
import { SearchInputRow } from '@/components/panel/SearchInputRow'
import { FilterBar } from '@/components/filters/FilterBar'
import { ResultsList } from '@/components/results/ResultsList'
import { EtfDetailPanel } from '@/components/results/EtfDetailPanel'
import { DefaultState } from '@/components/panel/DefaultState'
import { EmptyState } from '@/components/panel/EmptyState'
import { FooterHints } from '@/components/panel/FooterHints'

interface Props {
  filters: EtfFilters
  onFiltersChange: (filters: EtfFilters) => void
  onClose?: () => void
  onSelect?: (result: EtfResult) => void
  showFooter?: boolean
  showEscClose?: boolean
  autoFocus?: boolean
  placeholder?: string
}

export function SearchPanel({
  filters,
  onFiltersChange,
  onClose: _onClose,
  onSelect,
  showFooter = true,
  showEscClose = true,
  autoFocus = false,
  placeholder,
}: Props) {
  const [selectedResult, setSelectedResult] = useState<EtfResult | null>(null)
  const [debouncedFilters] = useDebounce(filters, 300)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useEtfSearch(debouncedFilters)

  const results = flattenPages(data)
  const total = data?.pages[0]?.count ?? 0

  const hasQuery =
    filters.search_text.length > 0 ||
    filters.asset_categories.length > 0 ||
    filters.management_approach.length > 0

  const isDone = !isLoading && !isFetchingNextPage
  const isEmpty = isDone && hasQuery && results.length === 0

  // Intercept Escape in capture phase so it closes the detail panel
  // instead of propagating to the dialog's close handler.
  useEffect(() => {
    if (!selectedResult) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        setSelectedResult(null)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [selectedResult])

  function handleSelect(result: EtfResult) {
    setSelectedResult(result)
    onSelect?.(result)
  }

  return (
    <div className="flex flex-col h-full">
      {!selectedResult && (
        <>
          <SearchInputRow
            value={filters.search_text}
            onChange={(search_text) => onFiltersChange({ ...filters, search_text })}
            autoFocus={autoFocus}
            placeholder={placeholder}
          />
          <FilterBar filters={filters} onChange={onFiltersChange} />
        </>
      )}

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {selectedResult ? (
          <EtfDetailPanel
            result={selectedResult}
            onBack={() => setSelectedResult(null)}
          />
        ) : !hasQuery && !isLoading ? (
          <DefaultState />
        ) : isEmpty ? (
          <EmptyState query={filters.search_text} />
        ) : (
          <ResultsList
            data={data}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            onSelect={handleSelect}
          />
        )}
      </div>

      {showFooter && (
        selectedResult
          ? <FooterHints total={null} mode="detail" />
          : <FooterHints total={hasQuery && !isEmpty ? total : null} showEscClose={showEscClose} />
      )}
    </div>
  )
}
