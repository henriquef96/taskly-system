import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/api/errorMessage'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { useDashboardData, useDeleteTask, useUpdateTaskStatus } from '@/hooks/useProjects'
import { useTaskViewPreference } from '@/hooks/useTaskViewPreference'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskListView } from '@/components/tasks/TaskListView'
import { TaskViewToggle } from '@/components/tasks/TaskViewToggle'
import { getTaskStatusLabel, TASK_STATUS_VALUES, type Task, type TaskStatus } from '@/types/api'

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
  const [view, setView] = useTaskViewPreference()
  const tasks = dashboard.data?.tasks ?? []

  const handleStatusChange = (taskId: number, status: Task['status']) => updateStatus.mutate({ taskId, status })
  const handleEdit = (selectedTask: Task) => navigate(`/projects/${selectedTask.project_id}`)
  const handleDelete = (selectedTask: Task) => { if (window.confirm(`Excluir a tarefa "${selectedTask.title}"?`)) deleteTask.mutate(selectedTask.id) }

  return (
    <AuthenticatedLayout title="Tarefas" description="Acompanhe todas as tarefas em um único quadro.">
      {!dashboard.isLoading && !dashboard.error && tasks.length > 0 && (
        <div className="mb-4 flex justify-end">
          <TaskViewToggle view={view} onChange={setView} />
        </div>
      )}
      {dashboard.isLoading && <LoadingState label="Carregando tarefas..." />}
      {dashboard.error && <ErrorState title="Não foi possível carregar as tarefas" message={getApiErrorMessage(dashboard.error, 'Tente novamente em alguns instantes.')} onRetry={() => void dashboard.refetch()} />}
      {!dashboard.isLoading && !dashboard.error && tasks.length === 0 && <EmptyState title="Nenhuma tarefa por aqui" message="Crie uma tarefa dentro de um projeto para vê-la neste quadro." />}
      {!dashboard.isLoading && !dashboard.error && tasks.length > 0 && view === 'list' && (
        <TaskListView
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isStatusUpdating={updateStatus.isPending}
          isDeleting={deleteTask.isPending}
        />
      )}
      {!dashboard.isLoading && !dashboard.error && tasks.length > 0 && view === 'kanban' && (
        <div className="grid h-[calc(100%-3.5rem)] min-h-0 min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TASK_STATUS_VALUES.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status)
            return (
              <section key={status} className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border p-3 ${COLUMN_STYLES[status]}`} aria-labelledby={`tasks-${status}`}>
                <h2 id={`tasks-${status}`} className="mb-3 shrink-0 text-sm font-semibold">{getTaskStatusLabel(status)} <span className="font-normal text-slate-500">({statusTasks.length})</span></h2>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                  {statusTasks.map((task) => <TaskCard key={task.id} task={task} projectId={task.project_id} onStatusChange={handleStatusChange} onEdit={handleEdit} onDelete={handleDelete} isStatusUpdating={updateStatus.isPending} isDeleting={deleteTask.isPending} />)}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </AuthenticatedLayout>
  )
}