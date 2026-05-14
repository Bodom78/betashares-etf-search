import { useDebounce } from 'use-debounce'
import { useEtfSearch, flattenPages } from '@/hooks/useEtfSearch'
import type { EtfFilters, EtfResult } from '@/types/etf'
import { SearchInputRow } from '@/components/panel/SearchInputRow'
import { FilterBar } from '@/components/filters/FilterBar'
import { ResultsList } from '@/components/results/ResultsList'
import { DefaultState } from '@/components/panel/DefaultState'
import { EmptyState } from '@/components/panel/EmptyState'
import { FooterHints } from '@/components/panel/FooterHints'

interface Props {
  filters: EtfFilters
  onFiltersChange: (filters: EtfFilters) => void
  onClose?: () => void
  onSelect?: (result: EtfResult) => void
  showFooter?: boolean
  autoFocus?: boolean
  placeholder?: string
}

export function SearchPanel({
  filters,
  onFiltersChange,
  onClose: _onClose,
  onSelect,
  showFooter = true,
  autoFocus = false,
  placeholder,
}: Props) {
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

  return (
    <div className="flex flex-col h-full">
      <SearchInputRow
        value={filters.search_text}
        onChange={(search_text) => onFiltersChange({ ...filters, search_text })}
        autoFocus={autoFocus}
        placeholder={placeholder}
      />

      <FilterBar filters={filters} onChange={onFiltersChange} />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {!hasQuery && !isLoading ? (
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
            onSelect={onSelect}
          />
        )}
      </div>

      {showFooter && hasQuery && !isEmpty && (
        <FooterHints total={total} />
      )}
    </div>
  )
}
