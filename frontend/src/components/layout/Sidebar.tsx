import { useEffect } from 'react'
import { FolderOpen, House, ListTodo, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth, useLogout } from '@/hooks/useAuth'
import { LogoutButton } from '@/components/layout/LogoutButton'
import type { User } from '@/types/api'

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

interface UserProfileProps {
  user: User
  isLoggingOut: boolean
  onLogout: () => void
  isCollapsed: boolean
}

function UserProfile({ user, isLoggingOut, onLogout, isCollapsed }: UserProfileProps) {
  return (
    <div className="border-t border-[var(--color-line)] p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(103,242,255,0.12)] font-semibold text-[var(--color-primary)]">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className={`min-w-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">{user.name}</p>
          <p className="truncate text-xs text-[var(--color-muted)]">{user.email}</p>
        </div>
      </div>
      <LogoutButton isLoading={isLoggingOut} onLogout={onLogout} compact={isCollapsed} />
    </div>
  )
}

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth()
  const logout = useLogout()

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && <button type="button" aria-label="Fechar menu" onClick={onClose} className="fixed inset-0 z-30 bg-[rgba(2,9,12,0.42)] lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[var(--color-line)] bg-[var(--color-sidebar)] backdrop-blur-xl transition-[width,transform] duration-200 lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : ''} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`flex h-20 items-center border-b border-[var(--color-line)] px-6 ${isCollapsed ? 'justify-center lg:px-3' : 'justify-between'}`}>
          <span className={`text-2xl font-bold tracking-tight text-[var(--color-primary-strong)] ${isCollapsed ? 'lg:sr-only' : ''}`}>Taskly</span>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-2 text-[var(--color-muted)] hover:bg-[var(--color-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] lg:inline-flex"
            aria-label={isCollapsed ? 'Exibir barra lateral' : 'Recolher barra lateral'}
            title={isCollapsed ? 'Exibir barra lateral' : 'Recolher barra lateral'}
          >
            {isCollapsed ? <PanelLeftOpen aria-hidden="true" className="h-5 w-5" /> : <PanelLeftClose aria-hidden="true" className="h-5 w-5" />}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface)] lg:hidden" aria-label="Fechar menu">
            <span aria-hidden="true" className="text-xl">×</span>
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Navegação principal">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${isCollapsed ? 'lg:justify-center lg:px-0' : ''} ${isActive ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(103,242,255,0.12)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]'}`}
          >
            <House aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className={isCollapsed ? 'lg:sr-only' : ''}>Visão geral</span>
          </NavLink>
          <NavLink
            to="/projects"
            onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${isCollapsed ? 'lg:justify-center lg:px-0' : ''} ${isActive ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(103,242,255,0.12)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]'}`}
          >
            <FolderOpen aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className={isCollapsed ? 'lg:sr-only' : ''}>Projetos</span>
          </NavLink>
          <NavLink
            to="/tasks"
            onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${isCollapsed ? 'lg:justify-center lg:px-0' : ''} ${isActive ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(103,242,255,0.12)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]'}`}
          >
            <ListTodo aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className={isCollapsed ? 'lg:sr-only' : ''}>Tarefas</span>
          </NavLink>
        </nav>
        <nav className={`pb-2 ${isCollapsed ? 'lg:px-3' : 'ps-4'}`} aria-label="Preferências">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${isCollapsed ? 'lg:justify-center lg:px-0' : ''} ${isActive ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(103,242,255,0.12)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]'}`}
          >
            <Settings aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className={isCollapsed ? 'lg:sr-only' : ''}>Configurações</span>
          </NavLink>
        </nav>
        {user && (
          <div className={isCollapsed ? 'lg:px-2' : ''}>
            <UserProfile user={user} isLoggingOut={logout.isPending} onLogout={() => void logout.mutateAsync()} isCollapsed={isCollapsed} />
          </div>
        )}
      </aside>
    </>
  )
}
