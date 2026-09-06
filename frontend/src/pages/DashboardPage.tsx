import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { DashboardSkeleton } from '@/components/feedback/DashboardSkeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { useAuth } from '@/hooks/useAuth'
import { useCreateProject, useDashboardData, useUploadProjectAttachment } from '@/hooks/useProjects'
import { getTaskStatusLabel, TASK_STATUS_VALUES, type DashboardTask, type ProjectInput, type TaskStatus } from '@/types/api'

const STATUS_STYLES: Record<TaskStatus, { bar: string; text: string }> = {
  pending: { bar: 'bg-[var(--color-muted)]', text: 'text-[var(--color-muted)]' },
  in_progress: { bar: 'bg-[var(--color-primary)]', text: 'text-[var(--color-primary)]' },
  completed: { bar: 'bg-[var(--color-success)]', text: 'text-[var(--color-success)]' },
  cancelled: { bar: 'bg-[var(--color-danger)]', text: 'text-[var(--color-danger)]' },
}

function formatDueDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(date))
}

function StatCard({ label, value, detail, accent }: { label: string; value: number; detail: string; accent: string }) {
  return (
  <article className="brand-panel rounded-[1.5rem] p-5">
      <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
    <p className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-ink)]">{value}</p>
    <p className="mt-1 text-xs text-[var(--color-muted)]">{detail}</p>
    </article>
  )
}

function TaskStatusSummary({ tasks }: { tasks: DashboardTask[] }) {
  return (
  <section className="brand-panel rounded-[1.75rem] p-5 sm:p-6" aria-labelledby="status-title">
      <div className="flex items-center justify-between gap-4">
        <div>
        <h2 id="status-title" className="text-2xl text-[var(--color-ink)]">Tarefas por status</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Acompanhe o andamento do seu trabalho.</p>
        </div>
      <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)]">{tasks.length} total</span>
      </div>
      <div className="mt-6 space-y-4">
        {TASK_STATUS_VALUES.map((status) => {
          const count = tasks.filter((task) => task.status === status).length
          const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0
          return (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className={`font-medium ${STATUS_STYLES[status].text}`}>{getTaskStatusLabel(status)}</span>
              <span className="text-[var(--color-muted)]">{count} ({percentage}%)</span>
              </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]" role="progressbar" aria-label={`${getTaskStatusLabel(status)}: ${percentage}%`} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                <div className={`h-full rounded-full ${STATUS_STYLES[status].bar}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function UpcomingTasks({ tasks, projectNames }: { tasks: DashboardTask[]; projectNames: Map<number, string> }) {
  const upcomingTasks = useMemo(() => {
    const limit = new Date()
    limit.setDate(limit.getDate() + 7)
    return tasks
      .filter((task) => task.due_date && task.status !== 'completed' && task.status !== 'cancelled' && new Date(task.due_date) <= limit)
      .sort((a, b) => new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime())
      .slice(0, 5)
  }, [tasks])

  return (
    <section className="brand-panel rounded-[1.75rem] p-5 sm:p-6" aria-labelledby="upcoming-title">
      <h2 id="upcoming-title" className="text-2xl text-[var(--color-ink)]">Próximos vencimentos</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Tarefas para os próximos 7 dias.</p>
      {upcomingTasks.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-center text-sm text-[var(--color-muted)]">Nenhuma entrega urgente nos próximos 7 dias.</p>
      ) : (
        <ul className="mt-5 divide-y divide-[var(--color-line)]">
          {upcomingTasks.map((task) => {
            const isOverdue = new Date(task.due_date ?? 0) < new Date()
            return (
              <li key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${isOverdue ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-accent)]'}`} />
                <div className="min-w-0 flex-1">
                  <Link to={`/projects/${task.project_id}`} className="block truncate text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-primary-strong)]">{task.title}</Link>
                  <p className="truncate text-xs text-[var(--color-muted)]">{projectNames.get(task.project_id) ?? 'Projeto'}</p>
                </div>
                <time dateTime={task.due_date ?? undefined} className={`shrink-0 text-xs font-semibold ${isOverdue ? 'text-[var(--color-danger)]' : 'text-[var(--color-muted)]'}`}>
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
  const uploadAttachment = useUploadProjectAttachment()
  const [isCreating, setIsCreating] = useState(false)
  const projects = dashboard.data?.projects ?? []
  const tasks = dashboard.data?.tasks ?? []
  const projectNames = new Map(projects.map((project) => [project.id, project.name]))
  const activeTasks = tasks.filter((task) => task.status !== 'completed' && task.status !== 'cancelled').length
  const completedTasks = tasks.filter((task) => task.status === 'completed').length
  const handleCreate = (input: ProjectInput, attachment?: File) => {
    createProject.mutate(input, { onSuccess: (project) => {
      if (attachment) uploadAttachment.mutate({ projectId: project.id, file: attachment }, { onSuccess: () => setIsCreating(false) })
      else setIsCreating(false)
    } })
  }

  const retry = () => {
    void dashboard.refetch()
  }

  return (
    <AuthenticatedLayout title="Visão geral" description="Acompanhe a operação e mantenha o trabalho alinhado.">
      <section className="brand-panel brand-hero-rail mb-6 rounded-[2rem] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="brand-kicker">Seu próximo passo</span>
            <h2 className="mt-3 max-w-[22rem] text-3xl leading-tight text-[var(--color-ink)] sm:text-4xl">
              {user?.name ? `Olá, ${user.name.split(' ')[0]}` : 'Olá, por aqui'}
            </h2>
            <p className="mt-2 max-w-[30rem] text-sm leading-6 text-[var(--color-muted)]">
              Você tem {tasks.filter((task) => task.status !== 'completed' && task.status !== 'cancelled').length} tarefas em movimento hoje.
            </p>
          </div>
          <button type="button" onClick={() => setIsCreating((value) => !value)} className="brand-button px-5 py-3 text-sm">
            {isCreating ? 'Fechar formulário' : 'Criar projeto'}
          </button>
        </div>
      </section>

      {isCreating && (
        <div className="mb-6">
          <ProjectForm isSubmitting={createProject.isPending || uploadAttachment.isPending} serverError={createProject.error ? getApiErrorMessage(createProject.error, 'Não foi possível criar o projeto.') : uploadAttachment.error ? getApiErrorMessage(uploadAttachment.error, 'Não foi possível enviar o anexo.') : undefined} serverErrors={createProject.error instanceof ApiError ? createProject.error.errors : undefined} onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </div>
      )}
      {dashboard.isLoading && <DashboardSkeleton />}
      {!dashboard.isLoading && dashboard.error && (
        <ErrorState title="Não foi possível carregar seu dashboard" message={getApiErrorMessage(dashboard.error, 'Tente novamente em alguns instantes.')} onRetry={retry} />
      )}
      {!dashboard.isLoading && !dashboard.error && projects.length === 0 && (
        <EmptyState title="Ainda não há projetos" message="Crie o primeiro projeto para organizar prazos, tarefas e entregas em um lugar só." />
      )}
      {!dashboard.isLoading && !dashboard.error && projects.length > 0 && (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo">
            <StatCard label="Projetos" value={projects.length} detail="em andamento" accent="bg-[var(--color-primary)]" />
            <StatCard label="Tarefas" value={tasks.length} detail="no total" accent="bg-[var(--color-accent)]" />
            <StatCard label="Em andamento" value={activeTasks} detail="precisam de foco" accent="bg-[var(--color-primary)]" />
            <StatCard label="Concluídas" value={completedTasks} detail="entregues" accent="bg-[var(--color-success)]" />
          </section>
          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <TaskStatusSummary tasks={tasks} />
            <UpcomingTasks tasks={tasks} projectNames={projectNames} />
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  )
}
