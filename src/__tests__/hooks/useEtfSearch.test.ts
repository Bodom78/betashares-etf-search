import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useEtfSearch, flattenPages } from '@/hooks/useEtfSearch'
import { DEFAULT_FILTERS } from '@/types/etf'
import { mockResults } from '@/mocks/handlers'
import type { InfiniteData } from '@tanstack/react-query'
import type { SearchResponse } from '@/types/etf'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useEtfSearch', () => {
  it('fires correct POST and returns results', async () => {
    const { result } = renderHook(() => useEtfSearch(DEFAULT_FILTERS), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const results = flattenPages(result.current.data)
    expect(results).toHaveLength(mockResults.length)
    expect(results[0].symbol).toBe('NDQ')
  })

  it('getNextPageParam returns undefined when all results loaded', async () => {
    const { result } = renderHook(() => useEtfSearch(DEFAULT_FILTERS), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.hasNextPage).toBe(false)
  })
})

describe('flattenPages', () => {
  it('returns empty array for undefined', () => {
    expect(flattenPages(undefined)).toEqual([])
  })

  it('flattens multi-page data into single array', () => {
    const page1 = { results: [mockResults[0]], count: 3, indexed_at: 0 }
    const page2 = { results: [mockResults[1], mockResults[2]], count: 3, indexed_at: 0 }
    const data: InfiniteData<SearchResponse> = {
      pages: [page1, page2],
      pageParams: [1, 2],
    }
    expect(flattenPages(data)).toHaveLength(3)
    expect(flattenPages(data)[0].symbol).toBe('NDQ')
    expect(flattenPages(data)[2].symbol).toBe('CASH')
  })
})
