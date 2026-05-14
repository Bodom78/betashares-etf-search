import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterBar, ASSET_CATEGORIES } from '@/components/filters/FilterBar'
import { DEFAULT_FILTERS } from '@/types/etf'

describe('FilterBar', () => {
  it('renders all asset category chips', () => {
    render(<FilterBar filters={DEFAULT_FILTERS} onChange={vi.fn()} />)
    ASSET_CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument()
    })
  })

  it('clicking a chip calls onChange with toggled array', () => {
    const onChange = vi.fn()
    render(<FilterBar filters={DEFAULT_FILTERS} onChange={onChange} />)
    fireEvent.click(screen.getByText('Cash').closest('button')!)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ asset_categories: ['Cash'] }),
    )
  })

  it('clicking active chip removes it from array', () => {
    const onChange = vi.fn()
    const filters = { ...DEFAULT_FILTERS, asset_categories: ['Cash'] }
    render(<FilterBar filters={filters} onChange={onChange} />)
    fireEvent.click(screen.getByText('Cash').closest('button')!)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ asset_categories: [] }),
    )
  })
})
