export function formatReturn(v: string | number | null | undefined): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n == null || isNaN(n)) return '—'
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
}

export function returnColor(v: string | number | null | undefined): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n == null || isNaN(n)) return 'text-muted-foreground'
  if (n > 0) return 'text-green-500'
  if (n < 0) return 'text-red-500'
  return 'text-muted-foreground'
}

export function formatFee(v: string | number | null | undefined): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n == null || isNaN(n)) return '—'
  return n.toFixed(2) + '%'
}

export function formatFundSize(v: string | number | null | undefined): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n == null || isNaN(n)) return '—'
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}b`
  if (n >= 1) return `$${Math.round(n)}m`
  return `$${(n * 1000).toFixed(0)}k`
}

export function formatInceptionDate(v: string | null | undefined): string {
  if (!v) return '—'
  const parts = v.split('-')
  if (parts.length !== 3) return v
  const [day, month, year] = parts
  const d = new Date(Number(year), Number(month) - 1, Number(day))
  if (isNaN(d.getTime())) return v
  return d.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
}

export function cleanHoldings(raw: string[]): string[] {
  if (!raw.length) return []
  // Some API results alternate name/ticker (e.g. "NVIDIA CORP", "NVDA", "APPLE INC", "AAPL")
  // Detect by checking if second element is a short all-caps code
  const isAlternating = raw.length > 1 && /^[A-Z0-9]{1,6}$/.test(raw[1])
  const names = isAlternating ? raw.filter((_, i) => i % 2 === 0) : raw
  return names.slice(0, 10)
}
