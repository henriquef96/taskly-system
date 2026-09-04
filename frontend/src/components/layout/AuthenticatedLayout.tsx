import { useState, type PropsWithChildren } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

interface AuthenticatedLayoutProps extends PropsWithChildren {
  title: string
  description: string
}

export function AuthenticatedLayout({ children, title, description }: AuthenticatedLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-svh bg-slate-50 text-slate-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Header title={title} description={description} onMenuOpen={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
