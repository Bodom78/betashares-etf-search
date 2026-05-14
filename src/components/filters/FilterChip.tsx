import { Badge } from '@/components/ui/badge'

interface Props {
  label: string
  active: boolean
  onToggle: () => void
}

export function FilterChip({ label, active, onToggle }: Props) {
  return (
    <button type="button" onClick={onToggle} className="shrink-0">
      <Badge
        variant={active ? 'default' : 'outline'}
        className="h-8 px-3 cursor-pointer select-none transition-colors"
      >
        {label}
      </Badge>
    </button>
  )
}
