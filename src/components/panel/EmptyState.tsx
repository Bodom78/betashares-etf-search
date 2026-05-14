import { SearchX } from 'lucide-react'

interface Props {
  query: string
}

export function EmptyState({ query }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-muted-foreground">
      <div className="rounded-full bg-muted p-4">
        <SearchX className="h-6 w-6" />
      </div>
      <p className="text-sm">
        No ETFs found{query ? ` for "${query}"` : ''}
      </p>
    </div>
  )
}
