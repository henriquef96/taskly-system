import { useState } from 'react'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskCard } from '@/components/tasks/TaskCard'
import { useCreateTask, useDeleteTask, useProjectTasks, useTags, useUpdateTask, useUpdateTaskStatus } from '@/hooks/useProjects'
import type { Task, TaskInput } from '@/types/api'
import { TASK_STATUS_VALUES, getTaskStatusLabel } from '@/types/api'

interface TaskManagerProps { projectId: number }

const STATUS_STYLES: Record<(typeof TASK_STATUS_VALUES)[number], string> = {
  pending: 'border-slate-200 bg-slate-50',
  in_progress: 'border-blue-200 bg-blue-50',
  completed: 'border-green-200 bg-green-50',
  cancelled: 'border-red-200 bg-red-50',
}

export function TaskManager({ projectId }: TaskManagerProps) {
  const query = useProjectTasks(projectId)
  const tagsQuery = useTags()
  const createTask = useCreateTask(projectId)
  const updateTask = useUpdateTask(projectId)
  const deleteTask = useDeleteTask(projectId)
  const updateStatus = useUpdateTaskStatus(projectId)
  const [editingTask, setEditingTask] = useState<Task>()
  const [isCreating, setIsCreating] = useState(false)

  const submit = (input: TaskInput) => {
    if (editingTask) {
      updateTask.mutate({ taskId: editingTask.id, input }, { onSuccess: () => setEditingTask(undefined) })
    } else {
      createTask.mutate(input, { onSuccess: () => setIsCreating(false) })
    }
  }

  const tasks = [...(query.data?.data ?? [])].sort((a, b) => a.position - b.position)
  const tagOrder = ['Desenvolvimento', 'Revisão', 'Documentação', 'Deploy']
  const availableTags = [...(tagsQuery.data?.data ?? [])].sort((a, b) => tagOrder.indexOf(a.name) - tagOrder.indexOf(b.name))
  const mutationError = createTask.error ?? updateTask.error
  const actionError = mutationError ?? updateStatus.error ?? deleteTask.error ?? tagsQuery.error

  return (
    <section className="mt-8 space-y-5" aria-label="Tarefas do projeto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tarefas</h2>
        <button type="button" onClick={() => { setIsCreating((value) => !value); setEditingTask(undefined) }} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{isCreating ? 'Fechar formulário' : 'Nova tarefa'}</button>
      </div>
      {actionError && <p className="text-sm text-red-600" role="alert">{getApiErrorMessage(actionError, 'Não foi possível concluir a ação.')}</p>}
      {(isCreating || editingTask) && <TaskForm task={editingTask} availableTags={availableTags} isSubmitting={createTask.isPending || updateTask.isPending} serverError={mutationError ? getApiErrorMessage(mutationError, 'Não foi possível salvar a tarefa.') : undefined} serverErrors={mutationError instanceof ApiError ? mutationError.errors : undefined} onSubmit={submit} onCancel={() => { setIsCreating(false); setEditingTask(undefined) }} />}
      {query.isLoading && <LoadingState label="Carregando tarefas..." />}
      {query.error && <ErrorState title="Não foi possível carregar as tarefas" message={getApiErrorMessage(query.error, 'Tente novamente em alguns instantes.')} onRetry={() => void query.refetch()} />}
      {!query.isLoading && !query.error && tasks.length === 0 && <EmptyState title="Nenhuma tarefa por aqui" message="Crie a primeira tarefa deste projeto." />}
      {!query.isLoading && !query.error && tasks.length > 0 && (
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TASK_STATUS_VALUES.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status)
            return <div key={status} className={`min-w-0 rounded-xl border p-3 ${STATUS_STYLES[status]}`}>
              <h3 className="mb-3 text-sm font-semibold">{getTaskStatusLabel(status)} <span className="font-normal text-slate-500">({statusTasks.length})</span></h3>
              <div className="max-h-[calc(100vh-15rem)] min-h-24 space-y-3 overflow-y-auto pr-1">
                {statusTasks.map((task) => <TaskCard key={task.id} task={task} projectId={projectId} onStatusChange={(taskId, status) => updateStatus.mutate({ taskId, status })} onEdit={(selectedTask) => { setEditingTask(selectedTask); setIsCreating(false) }} onDelete={(selectedTask) => { if (window.confirm(`Excluir a tarefa "${selectedTask.title}"?`)) deleteTask.mutate(selectedTask.id) }} isStatusUpdating={updateStatus.isPending} isDeleting={deleteTask.isPending} />)}
              </div>
            </div>
          })}
        </div>
      )}
    </section>
  )
}
