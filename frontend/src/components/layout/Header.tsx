import { Menu, Moon, SunMedium } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'

interface HeaderProps {
  title: string
  description: string
  onMenuOpen: () => void
}

export function Header({
  title,
  description,
  onMenuOpen,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-panel)]/85 backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuOpen}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2 text-[var(--color-muted)] hover:bg-[var(--color-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-[50rem] text-sm text-[var(--color-muted)]">{description}</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
