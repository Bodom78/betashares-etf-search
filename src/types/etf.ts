export type EtfVariant = 'search' | 'button' | 'inline'

export interface EtfSearchConfig {
  variant?: EtfVariant
  initialQuery?: string
  initialCategories?: string[]
  initialApproach?: string[]
  initialOrderBy?: string
  placeholder?: string
  buttonText?: string
  height?: string
}

export interface EtfFilters {
  search_text: string
  asset_categories: string[]
  management_approach: string[]
  order_by: string
}

export const DEFAULT_FILTERS: EtfFilters = {
  search_text: '',
  asset_categories: [],
  management_approach: [],
  order_by: '',
}

export interface ManagementFeeRange {
  fee_max?: number
  fee_min?: number
}

export interface SearchRequest {
  from: number
  size: number
  kind: string[]
  search_text?: string
  asset_categories?: string[]
  management_approach?: string[]
  management_fee?: ManagementFeeRange
  order_by?: string
}

export interface EtfResult {
  symbol: string
  display_name: string
  asset_categories: string[]
  management_approach?: string
  management_fee?: string
  one_year_return?: string | null
  five_year_return?: string | null
  logo?: string
  fund_size?: string
  classification?: string
  dividend_frequency?: string
  [key: string]: unknown
}

export interface SearchResponse {
  count: number
  results: EtfResult[]
  indexed_at: number
}

export interface IndexSearch {
  q?: string
  categories?: string
  approach?: string
  order_by?: string
  open?: string
}
