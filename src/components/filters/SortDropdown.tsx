import { ChevronDownIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// API order_by format: "field.asc" or "field.desc"
export const SORT_OPTIONS = [
  { field: 'one_year_return', label: '1Y Return' },
  { field: 'five_year_return', label: '5Y Return' },
  { field: 'trailing_12m_dividend_yield', label: 'Yield' },
  { field: 'management_fee', label: 'Fee' },
  { field: 'fund_size', label: 'Fund Size' },
  { field: 'display_name', label: 'Name' },
]

export function parseOrderBy(orderBy: string): { field: string; direction: 'asc' | 'desc' } | null {
  if (!orderBy) return null
  const dot = orderBy.lastIndexOf('.')
  if (dot === -1) return null
  const field = orderBy.slice(0, dot)
  const dir = orderBy.slice(dot + 1)
  if (dir !== 'asc' && dir !== 'desc') return null
  return { field, direction: dir }
}

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SortDropdown({ value, onChange }: Props) {
  const active = parseOrderBy(value)
  const activeOption = active ? SORT_OPTIONS.find((o) => o.field === active.field) : null

  function handleSelect(field: string) {
    if (!active || active.field !== field) {
      onChange(`${field}.asc`)
    } else if (active.direction === 'asc') {
      onChange(`${field}.desc`)
    } else {
      onChange('')
    }
  }

  const triggerLabel = activeOption ? `Sort · ${activeOption.label}` : 'Sort'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={active ? 'default' : 'outline'}
          size="sm"
          className="h-8 px-2.5 text-xs gap-1"
        >
          {triggerLabel}
          {active?.direction === 'asc'
            ? <ArrowUpIcon className="size-3" />
            : active?.direction === 'desc'
            ? <ArrowDownIcon className="size-3" />
            : <ChevronDownIcon className="size-3 opacity-60" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {SORT_OPTIONS.map((opt) => {
          const isSelected = active?.field === opt.field
          const direction = isSelected ? active!.direction : null
          return (
            <DropdownMenuItem
              key={opt.field}
              onSelect={(e) => { e.preventDefault(); handleSelect(opt.field) }}
              className="flex items-center justify-between gap-6 cursor-pointer"
            >
              <span className={isSelected ? 'font-medium' : ''}>{opt.label}</span>
              {direction === 'asc' && <ArrowUpIcon className="size-3.5 text-primary" />}
              {direction === 'desc' && <ArrowDownIcon className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
