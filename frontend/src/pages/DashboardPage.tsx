import { ApiError } from '@/api/ApiError'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { useProjects } from '@/hooks/useProjects'

export function DashboardPage() {
  const { data, error, isLoading } = useProjects()

  return (
    <AuthenticatedLayout title="Visão geral" description="Acompanhe seus projetos e mantenha o foco no que importa.">
      {isLoading && <LoadingState label="Carregando seus projetos..." />}
      {error && (
        <ErrorState
          title="Não foi possível carregar seus projetos"
          message={error instanceof ApiError ? error.message : 'Tente novamente em alguns instantes.'}
        />
      )}
      {!isLoading && !error && data?.data.length === 0 && (
        <EmptyState title="Nenhum projeto por aqui" message="Quando você criar um projeto, ele aparecerá nesta área." />
      )}
      {!isLoading && !error && data && data.data.length > 0 && (
        <section aria-label="Projetos" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.data.map((project) => (
            <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">{project.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{project.description ?? 'Sem descrição'}</p>
            </article>
          ))}
        </section>
      )}
    </AuthenticatedLayout>
  )
}
