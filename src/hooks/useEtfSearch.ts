import { useInfiniteQuery } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import { fetchEtfs, buildSearchRequest } from '@/api/search'
import type { EtfFilters, EtfResult, SearchResponse } from '@/types/etf'

const PAGE_SIZE = 20

export function useEtfSearch(filters: EtfFilters) {
  return useInfiniteQuery({
    queryKey: ['etfs', filters],
    queryFn: ({ pageParam }) =>
      fetchEtfs(buildSearchRequest(filters, pageParam as number, PAGE_SIZE)),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.reduce((acc, page) => acc + page.results.length, 0)
      return fetched < lastPage.count ? allPages.length + 1 : undefined
    },
    staleTime: 60_000,
  })
}

export function flattenPages(
  data: InfiniteData<SearchResponse> | undefined,
): EtfResult[] {
  return data?.pages.flatMap((page) => page.results) ?? []
}
