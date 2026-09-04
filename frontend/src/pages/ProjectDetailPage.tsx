import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { TaskManager } from '@/components/tasks/TaskManager'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { useDeleteProject, useProject, useUpdateProject } from '@/hooks/useProjects'
import type { ProjectInput } from '@/types/api'

export function ProjectDetailPage() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const parsedProjectId = Number(projectId)
  const projectQuery = useProject(parsedProjectId)
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const project = projectQuery.data

  if (!Number.isInteger(parsedProjectId) || parsedProjectId <= 0) {
    return <ErrorState title="Projeto inválido" message="O projeto solicitado não foi encontrado." />
  }

  const handleUpdate = (input: ProjectInput) => {
    updateProject.mutate({ projectId: parsedProjectId, input })
  }

  const handleDelete = () => {
    if (!project || !window.confirm(`Excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) return
    deleteProject.mutate(parsedProjectId, { onSuccess: () => navigate('/dashboard') })
  }

  return (
    <AuthenticatedLayout title={project?.name ?? 'Projeto'} description="Gerencie as informações e tarefas deste projeto.">
      <div className="mb-5 flex items-center justify-between">
        <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← Voltar aos projetos</Link>
        {project && <button type="button" onClick={handleDelete} disabled={deleteProject.isPending} className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">Excluir projeto</button>}
      </div>
      {projectQuery.isLoading && <LoadingState label="Carregando projeto..." />}
      {projectQuery.error && <ErrorState title="Não foi possível carregar o projeto" message={projectQuery.error instanceof ApiError ? projectQuery.error.message : 'Tente novamente em alguns instantes.'} />}
      {project && (
        <ProjectForm
          project={project}
          isSubmitting={updateProject.isPending}
          serverError={updateProject.error instanceof ApiError ? updateProject.error.message : undefined}
          onSubmit={handleUpdate}
        />
      )}
      {project && <TaskManager projectId={project.id} />}
    </AuthenticatedLayout>
  )
}
