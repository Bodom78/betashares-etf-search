import type { EtfFilters, EtfResult } from '@/types/etf'
import { SearchPanel } from './SearchPanel'

interface Props {
  filters: EtfFilters
  onFiltersChange: (filters: EtfFilters) => void
  onSelect?: (result: EtfResult) => void
  height?: string
  placeholder?: string
}

export function InlineWrapper({
  filters,
  onFiltersChange,
  onSelect,
  height = '550px',
  placeholder,
}: Props) {
  return (
    <div
      className="border border-border rounded-md overflow-hidden flex flex-col bg-card shadow-none"
      style={{ height }}
    >
      <SearchPanel
        filters={filters}
        onFiltersChange={onFiltersChange}
        onSelect={onSelect}
        showFooter
        showEscClose={false}
        placeholder={placeholder}
      />
    </div>
  )
}
