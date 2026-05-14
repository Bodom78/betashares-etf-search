import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { EtfSearch } from '@/components/EtfSearch'
import type { EtfFilters } from '@/types/etf'

const searchSchema = z.object({
  q: z.string().optional(),
  categories: z.string().optional(),
  approach: z.string().optional(),
  order_by: z.string().optional(),
  open: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: IndexPage,
})

function IndexPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const filters: EtfFilters = {
    search_text: search.q ?? '',
    asset_categories: search.categories ? search.categories.split(',') : [],
    management_approach: search.approach ? search.approach.split(',') : [],
    order_by: search.order_by ?? '',
  }

  const open = search.open === '1'

  function handleFiltersChange(next: EtfFilters) {
    void navigate({
      search: (prev) => ({
        ...prev,
        q: next.search_text || undefined,
        categories: next.asset_categories.length
          ? next.asset_categories.join(',')
          : undefined,
        approach: next.management_approach.length
          ? next.management_approach.join(',')
          : undefined,
        order_by: next.order_by || undefined,
      }),
      replace: true,
    })
  }

  function handleOpenChange(next: boolean) {
    void navigate({
      search: (prev) => ({ ...prev, open: next ? '1' : undefined }),
      replace: true,
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="flex flex-col items-center gap-6 text-center mb-16">
        <h1 className="text-4xl font-heading font-semibold tracking-tight">
          Find the right ETF
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Search and filter BetaShares ETFs by name, ticker, category, or performance.
        </p>
        <EtfSearch
          variant="search"
          open={open}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onOpenChange={handleOpenChange}
        />
      </div>
    </div>
  )
}
