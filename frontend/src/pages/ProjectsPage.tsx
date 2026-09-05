import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { useAuth } from '@/hooks/useAuth'
import { useCreateProject, useDeleteProject, useProjects, useUploadProjectAttachment } from '@/hooks/useProjects'
import { formatProjectTicket, type ProjectInput } from '@/types/api'

export function ProjectsPage() {
  const { user } = useAuth()
  const projectsQuery = useProjects()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()
  const uploadAttachment = useUploadProjectAttachment()
  const [isCreating, setIsCreating] = useState(false)
  const projects = projectsQuery.data?.data ?? []

  const handleCreate = (input: ProjectInput, attachment?: File) => {
    createProject.mutate(input, { onSuccess: (project) => {
      if (attachment) uploadAttachment.mutate({ projectId: project.id, file: attachment }, { onSuccess: () => setIsCreating(false) })
      else setIsCreating(false)
    } })
  }

  return (
    <AuthenticatedLayout title="Projetos" description="Organize seu trabalho em projetos.">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-950">Olá, {user?.name.split(' ')[0] ?? 'por aqui'}!</p>
          <p className="text-sm text-slate-500">Escolha um projeto para visualizar suas tarefas.</p>
        </div>
        <button type="button" onClick={() => setIsCreating((value) => !value)} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          {isCreating ? 'Fechar formulário' : 'Novo projeto'}
        </button>
      </div>
      {isCreating && <div className="mb-6"><ProjectForm isSubmitting={createProject.isPending || uploadAttachment.isPending} serverError={createProject.error ? getApiErrorMessage(createProject.error, 'Não foi possível criar o projeto.') : uploadAttachment.error ? getApiErrorMessage(uploadAttachment.error, 'Não foi possível enviar o anexo.') : undefined} serverErrors={createProject.error instanceof ApiError ? createProject.error.errors : undefined} onSubmit={handleCreate} onCancel={() => setIsCreating(false)} /></div>}
      {projectsQuery.isLoading && <LoadingState label="Carregando projetos..." />}
      {projectsQuery.error && <ErrorState title="Não foi possível carregar os projetos" message={getApiErrorMessage(projectsQuery.error, 'Tente novamente em alguns instantes.')} onRetry={() => void projectsQuery.refetch()} />}
      {deleteProject.error && <p className="mb-4 text-sm text-red-600" role="alert">{getApiErrorMessage(deleteProject.error, 'Não foi possível excluir o projeto.')}</p>}
      {!projectsQuery.isLoading && !projectsQuery.error && projects.length === 0 && <EmptyState title="Nenhum projeto por aqui" message="Crie seu primeiro projeto para começar." />}
      {!projectsQuery.isLoading && !projectsQuery.error && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <article key={project.id} className="flex min-h-36 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Link to={`/projects/${project.id}`} className="font-semibold text-slate-950 hover:text-indigo-600">
                <span className="mr-2 text-sm font-normal text-slate-500">{formatProjectTicket(project.ticket_number)}</span>{project.name}
              </Link>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{project.description ?? 'Sem descrição'}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <Link to={`/projects/${project.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Abrir projeto</Link>
                <button type="button" onClick={() => { if (window.confirm(`Excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) deleteProject.mutate(project.id) }} disabled={deleteProject.isPending} className="text-xs font-medium text-red-600 disabled:opacity-60">Excluir</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AuthenticatedLayout>
  )
}
