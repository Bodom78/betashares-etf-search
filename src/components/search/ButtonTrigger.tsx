import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'

type ButtonVariant = ComponentProps<typeof Button>['variant']

interface Props {
  onClick: () => void
  text?: string
  variant?: ButtonVariant
}

export function ButtonTrigger({
  onClick,
  text = 'Search ETFs',
  variant = 'default',
}: Props) {
  return (
    <Button variant={variant} onClick={onClick}>
      {text}
    </Button>
  )
}
