import { ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  formatReturn,
  returnColor,
  formatFee,
  formatFundSize,
  formatInceptionDate,
  cleanHoldings,
} from '@/lib/format'
import type { EtfResult } from '@/types/etf'
import { cn } from '@/lib/utils'

interface StatProps {
  label: string
  value: string
  className?: string
}

function Stat({ label, value, className }: StatProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-medium', className)}>{value}</span>
    </div>
  )
}

interface Props {
  result: EtfResult
  onBack: () => void
}

export function EtfDetailPanel({ result, onBack }: Props) {
  const subtitle = [result.asset_categories?.[0], result.management_approach]
    .filter(Boolean)
    .join(' · ')

  const holdings = cleanHoldings(
    (result.composition_holdings as string[] | undefined) ?? [],
  )

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Back to results"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <Badge variant="outline" className="shrink-0 font-mono text-xs w-16 justify-center">
          {result.symbol}
        </Badge>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{result.display_name}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-5 px-4 py-5 border-b border-border">
        <Stat label="Fund Size" value={formatFundSize(result.fund_size as string | undefined)} />
        <Stat label="Mgmt Fee" value={formatFee(result.management_fee)} />
        <Stat
          label="1Y Return"
          value={formatReturn(result.one_year_return)}
          className={returnColor(result.one_year_return)}
        />
        <Stat
          label="5Y Return (ann.)"
          value={formatReturn(result.five_year_return)}
          className={returnColor(result.five_year_return)}
        />
        <Stat
          label="Dist. Yield"
          value={formatFee(result.trailing_12m_dividend_yield as string | undefined)}
        />
        <Stat
          label="Frequency"
          value={(result.dividend_frequency as string | undefined) ?? '—'}
        />
        <Stat
          label="Inception"
          value={formatInceptionDate(result.inception_date as string | undefined)}
        />
        <Stat label="Issuer" value={(result.issuer as string | undefined) ?? '—'} />
        {result.investment_suitability && (
          <Stat
            label="Suitable for"
            value={result.investment_suitability as string}
          />
        )}
      </div>

      {holdings.length > 0 && (
        <div className="px-4 py-4">
          <p className="text-xs text-muted-foreground mb-2.5">Top Holdings</p>
          <div className="flex flex-wrap gap-1.5">
            {holdings.map((name, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
