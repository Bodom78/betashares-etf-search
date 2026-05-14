import { useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { SearchPanel } from './SearchPanel'
import type { EtfFilters, EtfResult } from '@/types/etf'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: EtfFilters
  onFiltersChange: (filters: EtfFilters) => void
  onSelect?: (result: EtfResult) => void
  placeholder?: string
}

export function SearchDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onSelect,
  placeholder,
}: Props) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          p-0 gap-0 overflow-hidden
          w-screen h-screen max-w-none rounded-none
          sm:w-full sm:h-auto sm:max-w-3xl sm:max-h-[80vh] sm:rounded-2xl
        "
      >
        <SearchPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClose={() => onOpenChange(false)}
          onSelect={(result) => {
            onSelect?.(result)
            onOpenChange(false)
          }}
          showFooter
          autoFocus
          placeholder={placeholder}
        />
      </DialogContent>
    </Dialog>
  )
}
