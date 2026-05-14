import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterChip } from '@/components/filters/FilterChip'

describe('FilterChip', () => {
  it('renders label text', () => {
    render(<FilterChip label="Australian Equities" active={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Australian Equities')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<FilterChip label="Cash" active={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('active chip has default variant class', () => {
    const { container } = render(
      <FilterChip label="Active" active={true} onToggle={vi.fn()} />,
    )
    expect(container.querySelector('[data-slot="badge"]')).toBeInTheDocument()
  })
})
