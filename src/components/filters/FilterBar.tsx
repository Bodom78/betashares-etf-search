import type { EtfFilters } from '@/types/etf'
import { FilterChip } from './FilterChip'
import { SortSelect } from './SortSelect'

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

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto border-b border-border no-scrollbar">
      {ASSET_CATEGORIES.map((cat) => (
        <FilterChip
          key={cat}
          label={cat}
          active={filters.asset_categories.includes(cat)}
          onToggle={() =>
            onChange({ ...filters, asset_categories: toggle(filters.asset_categories, cat) })
          }
        />
      ))}

      <div className="w-px h-5 bg-border shrink-0 mx-1" />

      {MANAGEMENT_APPROACHES.map((approach) => (
        <FilterChip
          key={approach}
          label={approach}
          active={filters.management_approach.includes(approach)}
          onToggle={() =>
            onChange({
              ...filters,
              management_approach: toggle(filters.management_approach, approach),
            })
          }
        />
      ))}

      <div className="w-px h-5 bg-border shrink-0 mx-1" />

      <SortSelect
        value={filters.order_by}
        onChange={(order_by) => onChange({ ...filters, order_by })}
      />
    </div>
  )
}
