import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/api/errorMessage'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { useDashboardData, useDeleteTask, useUpdateTaskStatus } from '@/hooks/useProjects'
import { TaskCard } from '@/components/tasks/TaskCard'
import { getTaskStatusLabel, TASK_STATUS_VALUES, type TaskStatus } from '@/types/api'

const COLUMN_STYLES: Record<TaskStatus, string> = {
  pending: 'border-slate-200 bg-slate-50',
  in_progress: 'border-blue-200 bg-blue-50',
  completed: 'border-green-200 bg-green-50',
  cancelled: 'border-red-200 bg-red-50',
}

export function TasksPage() {
  const navigate = useNavigate()
  const dashboard = useDashboardData()
  const updateStatus = useUpdateTaskStatus(0)
  const deleteTask = useDeleteTask(0)
  const tasks = dashboard.data?.tasks ?? []

  return (
    <AuthenticatedLayout title="Tarefas" description="Acompanhe todas as tarefas em um único quadro.">
      {dashboard.isLoading && <LoadingState label="Carregando tarefas..." />}
      {dashboard.error && <ErrorState title="Não foi possível carregar as tarefas" message={getApiErrorMessage(dashboard.error, 'Tente novamente em alguns instantes.')} onRetry={() => void dashboard.refetch()} />}
      {!dashboard.isLoading && !dashboard.error && tasks.length === 0 && <EmptyState title="Nenhuma tarefa por aqui" message="Crie uma tarefa dentro de um projeto para vê-la neste quadro." />}
      {!dashboard.isLoading && !dashboard.error && tasks.length > 0 && (
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TASK_STATUS_VALUES.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status)
            return (
              <section key={status} className={`min-w-0 rounded-xl border p-3 ${COLUMN_STYLES[status]}`} aria-labelledby={`tasks-${status}`}>
                <h2 id={`tasks-${status}`} className="mb-3 text-sm font-semibold">{getTaskStatusLabel(status)} <span className="font-normal text-slate-500">({statusTasks.length})</span></h2>
                <div className="max-h-[calc(100vh-15rem)] min-h-24 space-y-3 overflow-y-auto pr-1">
                  {statusTasks.map((task) => <TaskCard key={task.id} task={task} projectId={task.project_id} onStatusChange={(taskId, status) => updateStatus.mutate({ taskId, status })} onEdit={(selectedTask) => navigate(`/projects/${selectedTask.project_id}`)} onDelete={(selectedTask) => { if (window.confirm(`Excluir a tarefa "${selectedTask.title}"?`)) deleteTask.mutate(selectedTask.id) }} isStatusUpdating={updateStatus.isPending} isDeleting={deleteTask.isPending} />)}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </AuthenticatedLayout>
  )
}
