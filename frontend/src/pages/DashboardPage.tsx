import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { DashboardSkeleton } from '@/components/feedback/DashboardSkeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { useAuth } from '@/hooks/useAuth'
import { useCreateProject, useDashboardData, useDeleteProject } from '@/hooks/useProjects'
import { getTaskStatusLabel, TASK_STATUS_VALUES, type ProjectInput, type Task, type TaskStatus } from '@/types/api'

const STATUS_STYLES: Record<TaskStatus, { bar: string; text: string }> = {
  pending: { bar: 'bg-slate-400', text: 'text-slate-600' },
  in_progress: { bar: 'bg-blue-500', text: 'text-blue-700' },
  completed: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
  cancelled: { bar: 'bg-red-400', text: 'text-red-700' },
}

function formatDueDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(date))
}

function StatCard({ label, value, detail, accent }: { label: string; value: number; detail: string; accent: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  )
}

function TaskStatusSummary({ tasks }: { tasks: Task[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="status-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="status-title" className="font-semibold text-slate-950">Tarefas por status</h2>
          <p className="mt-1 text-sm text-slate-500">Acompanhe o andamento do seu trabalho.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{tasks.length} total</span>
      </div>
      <div className="mt-6 space-y-4">
        {TASK_STATUS_VALUES.map((status) => {
          const count = tasks.filter((task) => task.status === status).length
          const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0
          return (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className={`font-medium ${STATUS_STYLES[status].text}`}>{getTaskStatusLabel(status)}</span>
                <span className="text-slate-500">{count} ({percentage}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${getTaskStatusLabel(status)}: ${percentage}%`} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                <div className={`h-full rounded-full ${STATUS_STYLES[status].bar}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function UpcomingTasks({ tasks, projectNames }: { tasks: Task[]; projectNames: Map<number, string> }) {
  const upcomingTasks = useMemo(() => {
    const limit = new Date()
    limit.setDate(limit.getDate() + 7)
    return tasks
      .filter((task) => task.due_date && task.status !== 'completed' && task.status !== 'cancelled' && new Date(task.due_date) <= limit)
      .sort((a, b) => new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime())
      .slice(0, 5)
  }, [tasks])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="upcoming-title">
      <h2 id="upcoming-title" className="font-semibold text-slate-950">Próximos vencimentos</h2>
      <p className="mt-1 text-sm text-slate-500">Tarefas para os próximos 7 dias.</p>
      {upcomingTasks.length === 0 ? (
        <p className="mt-8 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">Nenhuma tarefa próxima do vencimento.</p>
      ) : (
        <ul className="mt-5 divide-y divide-slate-100">
          {upcomingTasks.map((task) => {
            const isOverdue = new Date(task.due_date ?? 0) < new Date()
            return (
              <li key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${isOverdue ? 'bg-red-500' : 'bg-amber-400'}`} />
                <div className="min-w-0 flex-1">
                  <Link to={`/projects/${task.project_id}`} className="block truncate text-sm font-medium text-slate-800 hover:text-indigo-600">{task.title}</Link>
                  <p className="truncate text-xs text-slate-500">{projectNames.get(task.project_id) ?? 'Projeto'}</p>
                </div>
                <time dateTime={task.due_date ?? undefined} className={`shrink-0 text-xs font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                  {isOverdue ? 'Vencida' : formatDueDate(task.due_date ?? '')}
                </time>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const dashboard = useDashboardData()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()
  const [isCreating, setIsCreating] = useState(false)
  const projects = dashboard.projectsQuery.data?.data ?? []
  const projectNames = new Map(projects.map((project) => [project.id, project.name]))
  const activeTasks = dashboard.tasks.filter((task) => task.status !== 'completed' && task.status !== 'cancelled').length
  const completedTasks = dashboard.tasks.filter((task) => task.status === 'completed').length
  const recentProjects = [...projects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4)

  const handleCreate = (input: ProjectInput) => {
    createProject.mutate(input, { onSuccess: () => setIsCreating(false) })
  }

  const handleDelete = (projectId: number, projectName: string) => {
    if (window.confirm(`Excluir o projeto "${projectName}"? Esta ação não pode ser desfeita.`)) deleteProject.mutate(projectId)
  }

  const retry = () => {
    void dashboard.projectsQuery.refetch()
    dashboard.taskQueries.forEach((query) => void query.refetch())
  }

  return (
    <AuthenticatedLayout title="Visão geral" description="Acompanhe seus projetos e mantenha o foco no que importa.">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-950">Olá, {user?.name.split(' ')[0] ?? 'por aqui'}!</p>
          <p className="text-sm text-slate-500">Veja como estão suas atividades hoje.</p>
        </div>
        <button type="button" onClick={() => setIsCreating((value) => !value)} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {isCreating ? 'Fechar formulário' : 'Novo projeto'}
        </button>
      </div>
      {isCreating && (
        <div className="mb-6">
          <ProjectForm isSubmitting={createProject.isPending} serverError={createProject.error instanceof ApiError ? createProject.error.message : undefined} onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </div>
      )}
      {dashboard.isLoading && <DashboardSkeleton />}
      {!dashboard.isLoading && dashboard.error && (
        <ErrorState title="Não foi possível carregar seu dashboard" message={dashboard.error instanceof ApiError ? dashboard.error.message : 'Tente novamente em alguns instantes.'} onRetry={retry} />
      )}
      {!dashboard.isLoading && !dashboard.error && projects.length === 0 && (
        <EmptyState title="Comece criando seu primeiro projeto" message="Organize suas tarefas por projetos e acompanhe seu progresso por aqui." />
      )}
      {!dashboard.isLoading && !dashboard.error && projects.length > 0 && (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo">
            <StatCard label="Projetos" value={projects.length} detail="projetos cadastrados" accent="bg-indigo-500" />
            <StatCard label="Tarefas" value={dashboard.tasks.length} detail="tarefas no total" accent="bg-blue-500" />
            <StatCard label="Em andamento" value={activeTasks} detail="tarefas para focar" accent="bg-amber-400" />
            <StatCard label="Concluídas" value={completedTasks} detail="tarefas finalizadas" accent="bg-emerald-500" />
          </section>
          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <TaskStatusSummary tasks={dashboard.tasks} />
            <UpcomingTasks tasks={dashboard.tasks} projectNames={projectNames} />
          </div>
          <section aria-labelledby="recent-projects-title">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="recent-projects-title" className="font-semibold text-slate-950">Projetos recentes</h2>
              <span className="text-sm text-slate-500">{recentProjects.length} exibidos</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recentProjects.map((project) => (
                <article key={project.id} className="flex min-h-36 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <Link to={`/projects/${project.id}`} className="font-semibold text-slate-950 hover:text-indigo-600">{project.name}</Link>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{project.description ?? 'Sem descrição'}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <Link to={`/projects/${project.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Abrir projeto</Link>
                    <button type="button" onClick={() => handleDelete(project.id, project.name)} disabled={deleteProject.isPending} className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-60">Excluir</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </AuthenticatedLayout>
  )
}
