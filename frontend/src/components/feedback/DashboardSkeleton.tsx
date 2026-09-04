export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Carregando dashboard">
      <span className="sr-only">Carregando dashboard...</span>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="mt-5 h-8 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {[1, 2].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="mt-8 space-y-4">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
              <div className="h-4 w-3/5 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
