import { http, HttpResponse } from 'msw'
import type { SearchResponse } from '@/types/etf'

export const mockResults: SearchResponse['results'] = [
  {
    symbol: 'NDQ',
    display_name: 'BetaShares NASDAQ 100 ETF',
    asset_categories: ['International Equities'],
    management_approach: 'Passive',
    management_fee: '0.48',
    one_year_return: '25.34',
    five_year_return: '18.21',
  },
  {
    symbol: 'A200',
    display_name: 'BetaShares Australia 200 ETF',
    asset_categories: ['Australian Equities'],
    management_approach: 'Passive',
    management_fee: '0.07',
    one_year_return: '-3.50',
    five_year_return: null,
  },
  {
    symbol: 'CASH',
    display_name: 'BetaShares High Interest Cash ETF',
    asset_categories: ['Cash'],
    management_approach: 'Active',
    management_fee: '0.18',
    one_year_return: null,
    five_year_return: null,
  },
]

export const handlers = [
  http.post('https://search.betashares.services/search', () =>
    HttpResponse.json({
      results: mockResults,
      count: mockResults.length,
      indexed_at: 1_700_000_000_000,
    } satisfies SearchResponse),
  ),
]
