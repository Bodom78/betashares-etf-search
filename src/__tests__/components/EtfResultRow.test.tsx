import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EtfResultRow } from '@/components/results/EtfResultRow'
import type { EtfResult } from '@/types/etf'

const base: EtfResult = {
  symbol: 'NDQ',
  display_name: 'BetaShares NASDAQ 100 ETF',
  asset_categories: ['International Equities'],
  management_approach: 'Passive',
  management_fee: '0.48',
  one_year_return: '25.34',
}

describe('EtfResultRow', () => {
  it('renders ticker and fund name', () => {
    render(<EtfResultRow result={base} />)
    expect(screen.getByText('NDQ')).toBeInTheDocument()
    expect(screen.getByText('BetaShares NASDAQ 100 ETF')).toBeInTheDocument()
  })

  it('renders asset category', () => {
    render(<EtfResultRow result={base} />)
    expect(screen.getByText('International Equities')).toBeInTheDocument()
  })

  it('positive 1Y return has green color class', () => {
    render(<EtfResultRow result={base} />)
    const el = screen.getByText('+25.34%')
    expect(el).toHaveClass('text-green-500')
  })

  it('negative return has red color class', () => {
    render(<EtfResultRow result={{ ...base, one_year_return: '-3.50' }} />)
    const el = screen.getByText('-3.50%')
    expect(el).toHaveClass('text-red-500')
  })

  it('null return renders em dash', () => {
    render(<EtfResultRow result={{ ...base, one_year_return: null }} />)
    expect(screen.getAllByText('-').length).toBeGreaterThan(0)
  })

  it('management fee renders with % suffix', () => {
    render(<EtfResultRow result={base} />)
    expect(screen.getByText('0.48%')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn()
    render(<EtfResultRow result={base} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(base)
  })
})
