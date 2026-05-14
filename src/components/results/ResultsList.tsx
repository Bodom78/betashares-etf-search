import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { flattenPages } from '@/hooks/useEtfSearch'
import type { EtfResult, SearchResponse } from '@/types/etf'
import type { InfiniteData } from '@tanstack/react-query'
import { EtfResultRow } from './EtfResultRow'
import { EtfRowSkeleton } from './EtfRowSkeleton'

const ROW_HEIGHT = 68
const OVERSCAN = 5
const SKELETON_COUNT = 6
const PREFETCH_THRESHOLD = 5

const HEADER_CLASSES =
  'flex items-center gap-3 px-4 py-1.5 border-b border-border text-xs text-muted-foreground'

function StickyHeader() {
  return (
    <div className={`sticky top-0 z-10 bg-background ${HEADER_CLASSES}`}>
      <div className="w-16 shrink-0">ASX Code</div>
      <div className="flex-1 min-w-0">Fund</div>
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <div className="text-right w-20">1Y Return</div>
        <div className="text-right w-20">5Y Return</div>
        <div className="text-right w-16">Fee</div>
      </div>
    </div>
  )
}

function StaticHeader() {
  return (
    <div className={`shrink-0 ${HEADER_CLASSES}`}>
      <div className="w-16 shrink-0">ASX Code</div>
      <div className="flex-1 min-w-0">Fund</div>
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <div className="text-right w-20">1Y Return</div>
        <div className="text-right w-20">5Y Return</div>
        <div className="text-right w-16">Fee</div>
      </div>
    </div>
  )
}

type RowItem = EtfResult | '__skeleton__'

interface Props {
  data: InfiniteData<SearchResponse> | undefined
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  onSelect?: (result: EtfResult) => void
}

export function ResultsList({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onSelect,
}: Props) {
  const results = flattenPages(data)

  const items: RowItem[] = isFetchingNextPage
    ? [...results, '__skeleton__', '__skeleton__', '__skeleton__']
    : results

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || virtualItems.length === 0) return
    const last = virtualItems[virtualItems.length - 1]
    if (last.index >= items.length - PREFETCH_THRESHOLD) {
      fetchNextPage()
    }
  }, [virtualItems, items.length, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <StaticHeader />
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <EtfRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div ref={parentRef} className="overflow-y-auto flex-1">
      <StickyHeader />
      <div
        style={{ height: virtualizer.getTotalSize() }}
        className="relative w-full"
      >
        {virtualItems.map((vItem) => {
          const item = items[vItem.index]
          return (
            <div
              key={vItem.key}
              style={{
                position: 'absolute',
                top: vItem.start,
                left: 0,
                right: 0,
                height: `${vItem.size}px`,
              }}
            >
              {item === '__skeleton__' ? (
                <EtfRowSkeleton />
              ) : (
                <EtfResultRow result={item} onSelect={onSelect} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
