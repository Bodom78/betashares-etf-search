import { Search } from 'lucide-react'

interface Props {
  onClick: () => void
  placeholder?: string
  maxWidth?: string
}

export function SearchTrigger({
  onClick,
  placeholder = 'Search by ASX code, fund name or phrase',
  maxWidth,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={maxWidth ? { maxWidth } : undefined}
      className="
        flex items-center gap-2 w-full
        h-9 rounded-md border border-input bg-background
        px-3 text-sm text-muted-foreground
        hover:bg-accent hover:text-accent-foreground
        transition-colors
      "
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left truncate">{placeholder}</span>
      <span className="hidden sm:flex items-center gap-1 shrink-0">
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs leading-none">
          Ctrl
        </kbd>
        <span className="text-xs">+</span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs leading-none">
          K
        </kbd>
      </span>
    </button>
  )
}
