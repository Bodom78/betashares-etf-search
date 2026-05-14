import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../test-utils'
import { EtfSearch } from '@/components/EtfSearch'
import { DEFAULT_FILTERS } from '@/types/etf'

describe('EtfSearch variants — smoke tests', () => {
  it('variant="search" renders trigger, dialog not visible', () => {
    render(<EtfSearch variant="search" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('variant="button" renders button with default text', () => {
    render(<EtfSearch variant="button" />)
    expect(screen.getByRole('button', { name: /search etfs/i })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('variant="button" renders custom text', () => {
    render(<EtfSearch variant="button" buttonText="Browse ETFs" />)
    expect(screen.getByRole('button', { name: /browse etfs/i })).toBeInTheDocument()
  })

  it('variant="inline" renders search input directly, no trigger button', async () => {
    render(
      <EtfSearch
        variant="inline"
        open={false}
        filters={DEFAULT_FILTERS}
        onFiltersChange={() => {}}
      />,
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
