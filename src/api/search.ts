import type { EtfFilters, SearchRequest, SearchResponse } from '@/types/etf'

const SEARCH_URL = 'https://search.betashares.services/search'

export async function fetchEtfs(req: SearchRequest): Promise<SearchResponse> {
  const res = await fetch(SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    throw new Error(`Search API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<SearchResponse>
}

export function buildSearchRequest(
  filters: EtfFilters,
  page: number,
  size: number,
): SearchRequest {
  const from = (page - 1) * size + 1

  const req: SearchRequest = {
    from,
    size,
    kind: ['etf'],
  }

  if (filters.search_text.trim()) {
    req.search_text = filters.search_text.trim()
  }

  if (filters.asset_categories.length > 0) {
    req.asset_categories = filters.asset_categories
  }

  if (filters.management_approach.length > 0) {
    req.management_approach = filters.management_approach
  }

  if (filters.order_by) {
    req.order_by = filters.order_by
  }

  return req
}
