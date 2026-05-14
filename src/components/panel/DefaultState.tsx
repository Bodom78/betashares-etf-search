import { Search } from 'lucide-react'

export function DefaultState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-muted-foreground">
      <div className="rounded-full bg-muted p-4">
        <Search className="h-6 w-6" />
      </div>
      <p className="text-sm">Compare ETFs by category, performance and fees</p>
    </div>
  )
}
