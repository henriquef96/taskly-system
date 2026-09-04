import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth, useLogout } from '@/hooks/useAuth'
import { LogoutButton } from '@/components/layout/LogoutButton'
import type { User } from '@/types/api'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface UserProfileProps {
  user: User
  isLoggingOut: boolean
  onLogout: () => void
}

function UserProfile({ user, isLoggingOut, onLogout }: UserProfileProps) {
  return (
    <div className="border-t border-slate-200 p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
      <LogoutButton isLoading={isLoggingOut} onLogout={onLogout} />
    </div>
  )
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
      {isOpen && <button type="button" aria-label="Fechar menu" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <span className="text-2xl font-bold tracking-tight text-indigo-600">Taskly</span>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Fechar menu">
            <span aria-hidden="true" className="text-xl">×</span>
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Navegação principal">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10h14V10" />
            </svg>
            Visão geral
          </NavLink>
        </nav>
        {user && <UserProfile user={user} isLoggingOut={logout.isPending} onLogout={() => void logout.mutateAsync()} />}
      </aside>
    </>
  )
}
