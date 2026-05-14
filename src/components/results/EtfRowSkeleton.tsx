import { Skeleton } from '@/components/ui/skeleton'

export function EtfRowSkeleton() {
  return (
    <div className="w-full flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-6 w-16 shrink-0 rounded-md" />

      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>

      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <Skeleton className="h-4 w-12 ml-auto" />
        <Skeleton className="h-4 w-12 ml-auto" />
        <Skeleton className="h-4 w-10 ml-auto" />
      </div>
    </div>
  )
}
