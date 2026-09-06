interface ErrorStateProps {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-[rgba(255,127,127,0.22)] bg-[rgba(255,127,127,0.08)] p-6 text-[var(--color-ink)]" role="alert">
      <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
      <p className="mt-2 max-w-[32rem] text-sm leading-6 text-[var(--color-muted)]">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-full border border-[rgba(255,127,127,0.3)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[rgba(103,242,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
          Tentar novamente
        </button>
      )}
    </div>
  )
}
