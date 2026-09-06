interface LoadingStateProps {
  label: string
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-8 text-sm text-[var(--color-muted)] shadow-[var(--shadow-soft)] backdrop-blur-sm" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(103,242,255,0.2)] border-t-[var(--color-primary)]" />
      {label}
    </div>
  )
}
