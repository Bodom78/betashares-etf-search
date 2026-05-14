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
          flex flex-col p-0 gap-0 overflow-hidden
          w-screen h-screen max-w-none rounded-none shadow-none
          sm:w-full sm:h-[min(700px,85vh)] sm:max-w-3xl sm:rounded-md sm:shadow-lg
        "
      >
        <SearchPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClose={() => onOpenChange(false)}
          onSelect={onSelect}
          showFooter
          autoFocus
          placeholder={placeholder}
        />
      </DialogContent>
    </Dialog>
  )
}
