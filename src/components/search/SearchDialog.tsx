import { useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { SearchPanel } from './SearchPanel'
import type { EtfFilters, EtfResult } from '@/types/etf'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: EtfFilters
  onFiltersChange: (filters: EtfFilters) => void
  onSelect?: (result: EtfResult) => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onSelect,
  placeholder,
  autoFocus = true,
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
        <VisuallyHidden>
          <DialogTitle>Search ETFs</DialogTitle>
          <DialogDescription>Search and filter Betashares ETFs by name, ASX code, category or management approach.</DialogDescription>
        </VisuallyHidden>
        <SearchPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClose={() => onOpenChange(false)}
          onSelect={onSelect}
          showFooter
          autoFocus={autoFocus}
          placeholder={placeholder}
        />
      </DialogContent>
    </Dialog>
  )
}
