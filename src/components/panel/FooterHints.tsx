interface Props {
  total: number | null
  loaded?: number
  mode?: 'results' | 'detail'
  showEscClose?: boolean
}

export function FooterHints({ total, loaded, mode = 'results', showEscClose = true }: Props) {
  const countLabel =
    total !== null
      ? loaded !== undefined && loaded < total
        ? `${loaded.toLocaleString()} of ${total.toLocaleString()} funds`
        : `${total.toLocaleString()} funds found`
      : null

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
          {countLabel !== null && <span>{countLabel}</span>}
        </>
      )}
    </div>
  )
}
