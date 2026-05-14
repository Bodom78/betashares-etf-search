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
