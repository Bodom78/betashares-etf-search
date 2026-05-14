import { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Props {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  placeholder?: string
}

export function SearchInputRow({
  value,
  onChange,
  autoFocus = false,
  placeholder = 'Search by ASX code, fund name or phrase',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoFocus) return
    const raf = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(raf)
  }, [autoFocus])

  return (
    <div className="relative flex items-center border-b border-border px-3">
      <Search className="shrink-0 h-4 w-4 text-muted-foreground mr-2" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 shadow-none focus-visible:ring-0 px-0 h-12 bg-transparent text-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
