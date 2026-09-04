import { ApiError } from '@/api/ApiError'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { useCreateProject, useDeleteProject, useProjects } from '@/hooks/useProjects'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { ProjectInput } from '@/types/api'

export function DashboardPage() {
  const { data, error, isLoading } = useProjects()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = (input: ProjectInput) => {
    createProject.mutate(input, { onSuccess: () => setIsCreating(false) })
  }

  const handleDelete = (projectId: number, projectName: string) => {
    if (window.confirm(`Excluir o projeto "${projectName}"? Esta ação não pode ser desfeita.`)) {
      deleteProject.mutate(projectId)
    }
  }

  return (
    <AuthenticatedLayout title="Visão geral" description="Acompanhe seus projetos e mantenha o foco no que importa.">
      <div className="mb-6 flex justify-end">
        <button type="button" onClick={() => setIsCreating((value) => !value)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          {isCreating ? 'Fechar formulário' : 'Novo projeto'}
        </button>
      </div>
      {isCreating && (
        <div className="mb-6">
          <ProjectForm
            isSubmitting={createProject.isPending}
            serverError={createProject.error instanceof ApiError ? createProject.error.message : undefined}
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}
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
              <Link to={`/projects/${project.id}`} className="font-semibold text-slate-950 hover:text-indigo-600">{project.name}</Link>
              <p className="mt-2 text-sm leading-6 text-slate-500">{project.description ?? 'Sem descrição'}</p>
              <div className="mt-5 flex items-center justify-between">
                <Link to={`/projects/${project.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Abrir projeto</Link>
                <button type="button" onClick={() => handleDelete(project.id, project.name)} disabled={deleteProject.isPending} className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60">Excluir</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </AuthenticatedLayout>
  )
}
