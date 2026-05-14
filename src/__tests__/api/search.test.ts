import { describe, it, expect } from 'vitest'
import { buildSearchRequest } from '@/api/search'
import { DEFAULT_FILTERS } from '@/types/etf'

describe('buildSearchRequest', () => {
  it('empty filters → only from, size, kind', () => {
    const req = buildSearchRequest(DEFAULT_FILTERS, 1, 20)
    expect(req).toEqual({ from: 1, size: 20, kind: ['etf'] })
  })

  it('search_text set → included in request', () => {
    const req = buildSearchRequest({ ...DEFAULT_FILTERS, search_text: 'nasdaq' }, 1, 20)
    expect(req.search_text).toBe('nasdaq')
    expect(req.kind).toEqual(['etf'])
  })

  it('whitespace-only search_text → omitted', () => {
    const req = buildSearchRequest({ ...DEFAULT_FILTERS, search_text: '   ' }, 1, 20)
    expect(req.search_text).toBeUndefined()
  })

  it('asset_categories non-empty → included', () => {
    const req = buildSearchRequest(
      { ...DEFAULT_FILTERS, asset_categories: ['Australian Equities'] },
      1,
      20,
    )
    expect(req.asset_categories).toEqual(['Australian Equities'])
  })

  it('asset_categories empty array → omitted', () => {
    const req = buildSearchRequest({ ...DEFAULT_FILTERS, asset_categories: [] }, 1, 20)
    expect(req.asset_categories).toBeUndefined()
  })

  it('page 2 → from equals pageSize + 1', () => {
    const req = buildSearchRequest(DEFAULT_FILTERS, 2, 20)
    expect(req.from).toBe(21)
  })

  it('page 3 → from equals 2 * pageSize + 1', () => {
    const req = buildSearchRequest(DEFAULT_FILTERS, 3, 20)
    expect(req.from).toBe(41)
  })

  it('order_by set → included', () => {
    const req = buildSearchRequest(
      { ...DEFAULT_FILTERS, order_by: 'one_year_return_desc' },
      1,
      20,
    )
    expect(req.order_by).toBe('one_year_return_desc')
  })

  it('order_by empty → omitted', () => {
    const req = buildSearchRequest({ ...DEFAULT_FILTERS, order_by: '' }, 1, 20)
    expect(req.order_by).toBeUndefined()
  })
})
