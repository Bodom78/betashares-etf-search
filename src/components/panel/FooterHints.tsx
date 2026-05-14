interface Props {
  total: number | null
  mode?: 'results' | 'detail'
  showEscClose?: boolean
}

export function FooterHints({ total, mode = 'results', showEscClose = true }: Props) {
  return (
    <div className="hidden sm:flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground shrink-0">
      {mode === 'detail' ? (
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">esc</kbd>
          Close
        </span>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">↩</kbd>
              Select
            </span>
            {showEscClose && (
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">esc</kbd>
                Close
              </span>
            )}
          </div>
          {total !== null && (
            <span>{total.toLocaleString()} funds found</span>
          )}
        </>
      )}
    </div>
  )
}
