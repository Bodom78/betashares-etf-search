import type { EtfFilters } from '@/types/etf'
import { FilterDropdown } from './FilterDropdown'
import { SortDropdown } from './SortDropdown'

export const ASSET_CATEGORIES = [
  'Australian Equities',
  'International Equities',
  'Australian Bonds',
  'International Bonds',
  'Cash',
  'Commodities',
  'Property',
  'Multi-Asset',
  'Alternatives',
  'Currency',
]

export const MANAGEMENT_APPROACHES = ['Active', 'Passive']

interface Props {
  filters: EtfFilters
  onChange: (filters: EtfFilters) => void
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
      <FilterDropdown
        label="Category"
        options={ASSET_CATEGORIES}
        selected={filters.asset_categories}
        onChange={(asset_categories) => onChange({ ...filters, asset_categories })}
      />
      <FilterDropdown
        label="Approach"
        options={MANAGEMENT_APPROACHES}
        selected={filters.management_approach}
        onChange={(management_approach) => onChange({ ...filters, management_approach })}
      />
      <div className="ml-auto">
        <SortDropdown
          value={filters.order_by}
          onChange={(order_by) => onChange({ ...filters, order_by })}
        />
      </div>
    </div>
  )
}
