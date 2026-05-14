import { useEffect, useRef } from 'react'
import { flattenPages } from '@/hooks/useEtfSearch'
import type { EtfResult, SearchResponse } from '@/types/etf'
import type { InfiniteData } from '@tanstack/react-query'
import { EtfResultRow } from './EtfResultRow'
import { EtfRowSkeleton } from './EtfRowSkeleton'

const SKELETON_COUNT = 6

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

  const scrollRef = useRef<HTMLDivElement>(null)
  const hasNextPageRef = useRef(hasNextPage)
  const isFetchingNextPageRef = useRef(isFetchingNextPage)
  const fetchNextPageRef = useRef(fetchNextPage)
  hasNextPageRef.current = hasNextPage
  isFetchingNextPageRef.current = isFetchingNextPage
  fetchNextPageRef.current = fetchNextPage

  // Attach once — scroll container is always mounted so the ref is set on
  // first effect run. Refs keep values current without re-attaching.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => {
      if (!hasNextPageRef.current || isFetchingNextPageRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight - scrollTop - clientHeight < 300) fetchNextPageRef.current()
    }
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  return (
    <div ref={scrollRef} className="overflow-y-auto flex-1">
      <StickyHeader />
      {isLoading ? (
        Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <EtfRowSkeleton key={i} />
        ))
      ) : (
        <>
          {results.map((result) => (
            <EtfResultRow key={result.symbol} result={result} onSelect={onSelect} />
          ))}
          {isFetchingNextPage && (
            <>
              <EtfRowSkeleton />
              <EtfRowSkeleton />
              <EtfRowSkeleton />
            </>
          )}
        </>
      )}
    </div>
  )
}
