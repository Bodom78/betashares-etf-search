import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { flattenPages, useEtfSearch } from '@/hooks/useEtfSearch'
import type { EtfFilters, EtfResult } from '@/types/etf'
import { EtfResultRow } from './EtfResultRow'
import { EtfRowSkeleton } from './EtfRowSkeleton'

const ROW_HEIGHT = 68
const OVERSCAN = 5
const SKELETON_COUNT = 6
const PREFETCH_THRESHOLD = 5

type RowItem = EtfResult | '__skeleton__'

interface Props {
  filters: EtfFilters
  onSelect?: (result: EtfResult) => void
}

export function ResultsList({ filters, onSelect }: Props) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } =
    useEtfSearch(filters)

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
      <div className="flex flex-col">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <EtfRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div ref={parentRef} className="overflow-y-auto flex-1">
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
