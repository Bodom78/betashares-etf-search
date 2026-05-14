import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { EtfSearch } from "@/components/EtfSearch"
import type { EtfFilters } from "@/types/etf"

const searchSchema = z.object({
  q: z.string().optional(),
  categories: z.string().optional(),
  approach: z.string().optional(),
  order_by: z.string().optional(),
  open: z.string().optional(),
})

export const Route = createFileRoute("/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: IndexPage,
})

function IndexPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const filters: EtfFilters = {
    search_text: search.q ?? "",
    asset_categories: search.categories ? search.categories.split(",") : [],
    management_approach: search.approach ? search.approach.split(",") : [],
    order_by: search.order_by ?? "",
  }

  const open = search.open === "1"

  function handleFiltersChange(next: EtfFilters) {
    void navigate({
      search: (prev) => ({
        ...prev,
        q: next.search_text || undefined,
        categories: next.asset_categories.length ? next.asset_categories.join(",") : undefined,
        approach: next.management_approach.length ? next.management_approach.join(",") : undefined,
        order_by: next.order_by || undefined,
      }),
      replace: true,
    })
  }

  function handleOpenChange(next: boolean) {
    void navigate({
      search: (prev) => ({ ...prev, open: next ? "1" : undefined }),
      replace: true,
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 flex flex-col gap-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-heading font-semibold tracking-tight">Betashares ETF Search</h1>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Variant: default</h2>
          <p className="text-sm text-muted-foreground">
            Input-style trigger that opens a dialog. Press Ctrl+K from anywhere or click to activate. Features URL state
            management for shareability.
          </p>
        </div>
        <EtfSearch
          variant="search"
          open={open}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onOpenChange={handleOpenChange}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Variant: button</h2>
          <p className="text-sm text-muted-foreground">
            Button trigger that can prefill filters, categories or search terms.
          </p>
        </div>
        <EtfSearch
          variant="button"
          buttonText="Browse Australian Equities"
          initialCategories={["Australian Equities"]}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Variant: inline</h2>
          <p className="text-sm text-muted-foreground">Full panel rendered inline.</p>
        </div>
        <EtfSearch variant="inline" height="550px" />
      </section>
    </div>
  )
}
