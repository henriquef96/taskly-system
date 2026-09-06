interface LogoutButtonProps {
  isLoading: boolean
  onLogout: () => void
  compact?: boolean
}

export function LogoutButton({ isLoading, onLogout, compact = false }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={isLoading}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? 'lg:justify-center lg:px-0' : ''}`}
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" />
      </svg>
      <span className={compact ? 'lg:sr-only' : ''}>{isLoading ? 'Saindo...' : 'Sair da conta'}</span>
    </button>
  )
}
