export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Carregando dashboard">
      <span className="sr-only">Carregando dashboard...</span>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm">
            <div className="h-4 w-24 rounded bg-[var(--color-surface)]" />
            <div className="mt-5 h-8 w-16 rounded bg-[var(--color-surface)]" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {[1, 2].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm">
            <div className="h-5 w-40 rounded bg-[var(--color-surface)]" />
            <div className="mt-8 space-y-4">
              <div className="h-4 w-full rounded bg-[var(--color-surface)]" />
              <div className="h-4 w-4/5 rounded bg-[var(--color-surface)]" />
              <div className="h-4 w-3/5 rounded bg-[var(--color-surface)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
