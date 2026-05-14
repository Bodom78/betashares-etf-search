import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchTrigger } from '@/components/search/SearchTrigger'

describe('SearchTrigger', () => {
  it('renders placeholder text', () => {
    render(<SearchTrigger onClick={vi.fn()} />)
    expect(screen.getByText('Search ETFs…')).toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    render(<SearchTrigger onClick={vi.fn()} placeholder="Find an ETF" />)
    expect(screen.getByText('Find an ETF')).toBeInTheDocument()
  })

  it('renders Ctrl and K keyboard hints', () => {
    render(<SearchTrigger onClick={vi.fn()} />)
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<SearchTrigger onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
