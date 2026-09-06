import { useState } from 'react'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskKanban } from '@/components/tasks/TaskKanban'
import { TaskListView } from '@/components/tasks/TaskListView'
import { TaskViewToggle } from '@/components/tasks/TaskViewToggle'
import { useCreateTask, useDeleteTask, useProjectTasks, useTags, useUpdateTask, useUpdateTaskStatus } from '@/hooks/useProjects'
import { useTaskViewPreference } from '@/hooks/useTaskViewPreference'
import type { Task, TaskInput, TaskStatus } from '@/types/api'

interface TaskManagerProps { projectId: number }

export function TaskManager({ projectId }: TaskManagerProps) {
  const query = useProjectTasks(projectId)
  const tagsQuery = useTags()
  const createTask = useCreateTask(projectId)
  const updateTask = useUpdateTask(projectId)
  const deleteTask = useDeleteTask(projectId)
  const updateStatus = useUpdateTaskStatus(projectId)
  const [editingTask, setEditingTask] = useState<Task>()
  const [isCreating, setIsCreating] = useState(false)
  const [view, setView] = useTaskViewPreference()

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

  const handleEdit = (selectedTask: Task) => { setEditingTask(selectedTask); setIsCreating(false) }
  const handleDelete = (selectedTask: Task) => { if (window.confirm(`Excluir a tarefa "${selectedTask.title}"?`)) deleteTask.mutate(selectedTask.id) }
  const handleStatusChange = (selectedTask: Task, status: TaskStatus) => {
    if (selectedTask.status !== status) updateStatus.mutate({ taskId: selectedTask.id, status })
  }

  return (
    <section className="mt-8 space-y-5" aria-label="Tarefas do projeto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl text-[var(--color-ink)]">Tarefas</h2>
        <div className="flex items-center gap-3">
          <TaskViewToggle view={view} onChange={setView} />
          <button type="button" onClick={() => { setIsCreating((value) => !value); setEditingTask(undefined) }} className="brand-button px-4 py-2 text-sm">{isCreating ? 'Fechar formulário' : 'Nova tarefa'}</button>
        </div>
      </div>
      {actionError && <p className="text-sm text-[var(--color-danger)]" role="alert">{getApiErrorMessage(actionError, 'Não foi possível concluir a ação.')}</p>}
      {(isCreating || editingTask) && <TaskForm task={editingTask} availableTags={availableTags} isSubmitting={createTask.isPending || updateTask.isPending} serverError={mutationError ? getApiErrorMessage(mutationError, 'Não foi possível salvar a tarefa.') : undefined} serverErrors={mutationError instanceof ApiError ? mutationError.errors : undefined} onSubmit={submit} onCancel={() => { setIsCreating(false); setEditingTask(undefined) }} />}
      {query.isLoading && <LoadingState label="Carregando tarefas..." />}
      {query.error && <ErrorState title="Não foi possível carregar as tarefas" message={getApiErrorMessage(query.error, 'Tente novamente em alguns instantes.')} onRetry={() => void query.refetch()} />}
      {!query.isLoading && !query.error && tasks.length === 0 && <EmptyState title="Nenhuma tarefa por aqui" message="Crie a primeira tarefa para começar a execução e acompanhar o progresso." />}
      {!query.isLoading && !query.error && tasks.length > 0 && view === 'list' && (
        <TaskListView
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteTask.isPending}
        />
      )}
      {!query.isLoading && !query.error && tasks.length > 0 && view === 'kanban' && (
        <TaskKanban
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          isDeleting={deleteTask.isPending}
        />
      )}
    </section>
  )
}