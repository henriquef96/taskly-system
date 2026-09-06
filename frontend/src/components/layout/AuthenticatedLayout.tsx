import { useState, type PropsWithChildren } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

interface AuthenticatedLayoutProps extends PropsWithChildren {
  title: string
  description: string
  mainClassName?: string
}

export function AuthenticatedLayout({ children, title, description, mainClassName }: AuthenticatedLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-svh bg-[var(--color-background)] text-[var(--color-ink)]">
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />
      <div className={isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}>
        <Header
          title={title}
          description={description}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <main className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${mainClassName ?? ''}`}>{children}</main>
      </div>
    </div>
  )
}
