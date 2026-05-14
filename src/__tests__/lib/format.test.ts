import { describe, it, expect } from 'vitest'
import { formatReturn, returnColor, formatFee } from '@/lib/format'

describe('formatReturn', () => {
  it('positive string → "+N.NN%"', () => expect(formatReturn('12.34')).toBe('+12.34%'))
  it('negative string → "-N.NN%"', () => expect(formatReturn('-3.5')).toBe('-3.50%'))
  it('zero → "+0.00%"', () => expect(formatReturn('0')).toBe('+0.00%'))
  it('positive number → "+N.NN%"', () => expect(formatReturn(5.678)).toBe('+5.68%'))
  it('null → "—"', () => expect(formatReturn(null)).toBe('-'))
  it('undefined → "—"', () => expect(formatReturn(undefined)).toBe('-'))
})

describe('returnColor', () => {
  it('positive → text-green-500', () => expect(returnColor('12.34')).toBe('text-green-500'))
  it('negative → text-red-500', () => expect(returnColor('-3.50')).toBe('text-red-500'))
  it('zero → text-muted-foreground', () => expect(returnColor('0')).toBe('text-muted-foreground'))
  it('null → text-muted-foreground', () => expect(returnColor(null)).toBe('text-muted-foreground'))
  it('undefined → text-muted-foreground', () =>
    expect(returnColor(undefined)).toBe('text-muted-foreground'))
})

describe('formatFee', () => {
  it('fee string → "N.NN%"', () => expect(formatFee('0.48')).toBe('0.48%'))
  it('null → "—"', () => expect(formatFee(null)).toBe('-'))
})
