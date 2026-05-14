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
        <div className="space-y-1.5 w-20">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-4 w-3/4 ml-auto" />
        </div>
        <div className="space-y-1.5 w-16">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-4 w-3/4 ml-auto" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}
