import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SORT_OPTIONS = [
  { value: 'one_year_return_desc', label: '1Y Return ↓' },
  { value: 'one_year_return_asc', label: '1Y Return ↑' },
  { value: 'management_fee_asc', label: 'Fee ↑' },
  { value: 'display_name_asc', label: 'Name A–Z' },
]

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SortSelect({ value, onChange }: Props) {
  return (
    <Select value={value || '_none'} onValueChange={(v) => onChange(v === '_none' ? '' : v)}>
      <SelectTrigger className="h-8 shrink-0 w-36 text-xs">
        <SelectValue placeholder="Sort by…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_none" className="text-xs text-muted-foreground">
          Sort by…
        </SelectItem>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
