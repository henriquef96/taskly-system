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
  const hasDeleteError = Boolean(deleteProject.error)

  const handleCreate = (input: ProjectInput, attachment?: File) => {
    createProject.mutate(input, { onSuccess: (project) => {
      if (attachment) uploadAttachment.mutate({ projectId: project.id, file: attachment }, { onSuccess: () => setIsCreating(false) })
      else setIsCreating(false)
    } })
  }

  return (
    <AuthenticatedLayout title="Projetos" description="Organize por sprint, campanha ou cliente.">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-[var(--color-ink)]">Olá, {user?.name.split(' ')[0] ?? 'por aqui'}!</p>
          <p className="text-sm text-[var(--color-muted)]">Escolha um projeto para acompanhar entregas e pendências.</p>
        </div>
        <button type="button" onClick={() => setIsCreating((value) => !value)} className="brand-button px-5 py-3 text-sm">
          {isCreating ? 'Fechar formulário' : 'Criar projeto'}
        </button>
      </div>
      {isCreating && <div className="mb-6"><ProjectForm isSubmitting={createProject.isPending || uploadAttachment.isPending} serverError={createProject.error ? getApiErrorMessage(createProject.error, 'Não foi possível criar o projeto.') : uploadAttachment.error ? getApiErrorMessage(uploadAttachment.error, 'Não foi possível enviar o anexo.') : undefined} serverErrors={createProject.error instanceof ApiError ? createProject.error.errors : undefined} onSubmit={handleCreate} onCancel={() => setIsCreating(false)} /></div>}
      {projectsQuery.isLoading && <LoadingState label="Carregando projetos..." />}
      {projectsQuery.error && <ErrorState title="Não foi possível carregar os projetos" message={getApiErrorMessage(projectsQuery.error, 'Tente novamente em alguns instantes.')} onRetry={() => void projectsQuery.refetch()} />}
      {hasDeleteError && <p className="mb-4 text-sm text-[var(--color-danger)]" role="alert">{getApiErrorMessage(deleteProject.error, 'Não foi possível excluir o projeto.')}</p>}
      {!projectsQuery.isLoading && !projectsQuery.error && projects.length === 0 && <EmptyState title="Nenhum projeto em andamento" message="Crie o primeiro projeto para organizar o trabalho e manter a equipe alinhada." />}
      {!projectsQuery.isLoading && !projectsQuery.error && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <article key={project.id} className="project-card brand-panel flex min-h-36 flex-col rounded-[1.5rem] p-5">
              <Link to={`/projects/${project.id}`} className="font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary-strong)]">
                <span className="mr-2 text-sm font-normal text-[var(--color-muted)]">{formatProjectTicket(project.ticket_number)}</span>{project.name}
              </Link>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-muted)]">{project.description ?? 'Sem descrição'}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <Link to={`/projects/${project.id}`} className="text-sm font-medium text-[var(--color-primary-strong)] hover:text-[var(--color-primary)]">Abrir projeto</Link>
                <button type="button" onClick={() => { if (window.confirm(`Excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) deleteProject.mutate(project.id) }} disabled={deleteProject.isPending} className="text-xs font-medium text-[var(--color-danger)] disabled:opacity-60">Excluir</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AuthenticatedLayout>
  )
}
