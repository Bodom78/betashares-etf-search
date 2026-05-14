import { useInfiniteQuery } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import { fetchEtfs, buildSearchRequest } from '@/api/search'
import type { EtfFilters, EtfResult, SearchResponse } from '@/types/etf'
import { useApiUrl } from '@/context/ApiUrlContext'

const PAGE_SIZE = 20

export function useEtfSearch(filters: EtfFilters) {
  const apiUrl = useApiUrl()
  return useInfiniteQuery({
    queryKey: ['etfs', filters, apiUrl],
    queryFn: ({ pageParam }) =>
      fetchEtfs(buildSearchRequest(filters, pageParam as number, PAGE_SIZE), apiUrl),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.results.length === 0) return undefined
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
