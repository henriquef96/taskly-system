import { useState } from 'react'
import { ApiError } from '@/api/ApiError'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { TaskForm } from '@/components/tasks/TaskForm'
import { useCreateTask, useDeleteTask, useProjectTasks, useUpdateTask, useUpdateTaskStatus } from '@/hooks/useProjects'
import type { Task, TaskInput } from '@/types/api'
import { isTaskStatus, TASK_STATUS_VALUES, getTaskStatusLabel } from '@/types/api'

interface TaskManagerProps { projectId: number }

const STATUS_STYLES: Record<(typeof TASK_STATUS_VALUES)[number], string> = {
  pending: 'border-slate-200 bg-slate-50',
  in_progress: 'border-blue-200 bg-blue-50',
  completed: 'border-green-200 bg-green-50',
  cancelled: 'border-red-200 bg-red-50',
}

export function TaskManager({ projectId }: TaskManagerProps) {
  const query = useProjectTasks(projectId)
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
  const mutationError = createTask.error ?? updateTask.error
  const actionError = mutationError ?? updateStatus.error ?? deleteTask.error

  return (
    <section className="mt-8 space-y-5" aria-label="Tarefas do projeto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tarefas</h2>
        <button type="button" onClick={() => { setIsCreating((value) => !value); setEditingTask(undefined) }} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{isCreating ? 'Fechar formulário' : 'Nova tarefa'}</button>
      </div>
      {actionError instanceof ApiError && <p className="text-sm text-red-600" role="alert">{actionError.message}</p>}
      {(isCreating || editingTask) && <TaskForm task={editingTask} isSubmitting={createTask.isPending || updateTask.isPending} serverError={mutationError instanceof ApiError ? mutationError.message : undefined} onSubmit={submit} onCancel={() => { setIsCreating(false); setEditingTask(undefined) }} />}
      {query.isLoading && <LoadingState label="Carregando tarefas..." />}
      {query.error && <ErrorState title="Não foi possível carregar as tarefas" message={query.error instanceof ApiError ? query.error.message : 'Tente novamente em alguns instantes.'} />}
      {!query.isLoading && !query.error && tasks.length === 0 && <EmptyState title="Nenhuma tarefa por aqui" message="Crie a primeira tarefa deste projeto." />}
      {!query.isLoading && !query.error && tasks.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TASK_STATUS_VALUES.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status)
            return <div key={status} className={`rounded-xl border p-3 ${STATUS_STYLES[status]}`}>
              <h3 className="mb-3 text-sm font-semibold">{getTaskStatusLabel(status)} <span className="font-normal text-slate-500">({statusTasks.length})</span></h3>
              <div className="space-y-3">
                {statusTasks.map((task) => <article key={task.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2"><h4 className="font-semibold">{task.title}</h4><span className="text-xs text-slate-400">#{task.position}</span></div>
                  <p className="mt-1 text-sm text-slate-600">{task.short_description}</p>
                  {task.due_date && <p className="mt-2 text-xs text-slate-500">Prazo: {new Date(task.due_date).toLocaleString('pt-BR')}</p>}
                  {task.tags.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{task.tags.map((tag) => <span key={tag.id} className="rounded-full px-2 py-0.5 text-xs text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span>)}</div>}
                  <div className="mt-3 flex items-center gap-2">
                    <select aria-label={`Alterar status de ${task.title}`} value={task.status} onChange={(event) => { if (isTaskStatus(event.target.value)) updateStatus.mutate({ taskId: task.id, status: event.target.value }) }} disabled={updateStatus.isPending} className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs">
                      {TASK_STATUS_VALUES.map((value) => <option key={value} value={value}>{getTaskStatusLabel(value)}</option>)}
                    </select>
                    <button type="button" onClick={() => { setEditingTask(task); setIsCreating(false) }} className="text-xs font-medium text-indigo-600">Editar</button>
                    <button type="button" onClick={() => { if (window.confirm(`Excluir a tarefa "${task.title}"?`)) deleteTask.mutate(task.id) }} disabled={deleteTask.isPending} className="text-xs font-medium text-red-600 disabled:opacity-60">Excluir</button>
                  </div>
                </article>)}
              </div>
            </div>
          })}
        </div>
      )}
    </section>
  )
}
