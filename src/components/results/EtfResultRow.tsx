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
        {category && (
          <p className="text-xs text-muted-foreground truncate">{category}</p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <div className="text-right w-20">
          <p className="text-xs text-muted-foreground">1Y Return</p>
          <p className={cn('text-sm font-medium', returnColor(result.one_year_return))}>
            {formatReturn(result.one_year_return)}
          </p>
        </div>

        <div className="text-right w-16">
          <p className="text-xs text-muted-foreground">Fee</p>
          <p className="text-sm font-medium">{formatFee(result.management_fee)}</p>
        </div>

        {result.management_approach && (
          <Badge variant="secondary" className="text-xs shrink-0">
            {result.management_approach}
          </Badge>
        )}
      </div>
    </button>
  )
}
