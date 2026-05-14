import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
            <span className="font-heading font-semibold text-sm">BetaShares</span>
            <span className="text-muted-foreground text-xs">ETF Search</span>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  )
}
