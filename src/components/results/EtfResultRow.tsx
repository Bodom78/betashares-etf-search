import { Badge } from '@/components/ui/badge'
import { formatReturn, returnColor, formatFee } from '@/lib/format'
import type { EtfResult } from '@/types/etf'
import { cn } from '@/lib/utils'

interface Props {
  result: EtfResult
  onSelect?: (result: EtfResult) => void
}

export function EtfResultRow({ result, onSelect }: Props) {
  const category = result.asset_categories?.[0] ?? null
  const categoryLine = [category, result.management_approach].filter(Boolean).join(' · ')

  return (
    <button
      type="button"
      onClick={() => onSelect?.(result)}
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors cursor-pointer"
    >
      <Badge variant="outline" className="shrink-0 font-mono text-xs w-16 justify-center">
        {result.symbol}
      </Badge>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{result.display_name}</p>
        {categoryLine && (
          <p className="text-xs text-muted-foreground truncate">{categoryLine}</p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <p className={cn('text-sm font-medium text-right w-20', returnColor(result.one_year_return))}>
          {formatReturn(result.one_year_return)}
        </p>
        <p className={cn('text-sm font-medium text-right w-20', returnColor(result.five_year_return))}>
          {formatReturn(result.five_year_return)}
        </p>
        <p className="text-sm font-medium text-right w-16">
          {formatFee(result.management_fee)}
        </p>
      </div>
    </button>
  )
}
