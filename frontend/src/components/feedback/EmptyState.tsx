interface EmptyStateProps {
  title: string
  message: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)]/80 p-8 text-center shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(103,242,255,0.2)] bg-[rgba(103,242,255,0.08)] text-[var(--color-primary)]">
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m0 0h4a2 2 0 012 2v2" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[var(--color-ink)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[30rem] text-sm leading-6 text-[var(--color-muted)]">{message}</p>
    </div>
  )
}
