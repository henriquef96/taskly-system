import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const { data, isLoading } = useProjects()

  return (
    <main className="min-h-svh bg-neutral-100 p-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <div><h1 className="text-3xl font-semibold">Olá, {user?.name}</h1><p className="text-neutral-600">Seus projetos</p></div>
        <button onClick={() => void logout()} className="rounded border px-4 py-2">Sair</button>
      </header>
      <section className="mx-auto mt-8 max-w-5xl rounded-xl bg-white p-6 shadow">
        {isLoading ? <p>Carregando projetos...</p> : data?.data.length ? <ul className="space-y-3">{data.data.map((project) => <li key={project.id} className="rounded border p-4"><strong>{project.name}</strong><p className="text-sm text-neutral-600">{project.description ?? 'Sem descrição'}</p></li>)}</ul> : <p>Nenhum projeto cadastrado.</p>}
      </section>
    </main>
  )
}
