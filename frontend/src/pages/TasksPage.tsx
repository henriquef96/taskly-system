import { useState } from 'react'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { TaskForm } from '@/components/tasks/TaskForm'
import { useDashboardData, useDeleteTask, useTags, useUpdateTask, useUpdateTaskStatus } from '@/hooks/useProjects'
import { useTaskViewPreference } from '@/hooks/useTaskViewPreference'
import { TaskListView } from '@/components/tasks/TaskListView'
import { TaskKanban } from '@/components/tasks/TaskKanban'
import { TaskViewToggle } from '@/components/tasks/TaskViewToggle'
import type { Task, TaskInput, TaskStatus } from '@/types/api'

export function TasksPage() {
  const dashboard = useDashboardData()
  const tagsQuery = useTags()
  const updateStatus = useUpdateTaskStatus(0)
  const deleteTask = useDeleteTask()
  const [editingTask, setEditingTask] = useState<Task>()
  const [view, setView] = useTaskViewPreference()
  const updateTask = useUpdateTask(editingTask?.project_id ?? 0)
  const tasks = dashboard.data?.tasks ?? []

  const handleEdit = (selectedTask: Task) => setEditingTask(selectedTask)
  const handleUpdate = (input: TaskInput) => {
    if (!editingTask) return

    updateTask.mutate(
      { taskId: editingTask.id, input },
      { onSuccess: () => setEditingTask(undefined) },
    )
  }
  const handleDelete = (selectedTask: Task) => {
    if (window.confirm(`Excluir a tarefa "${selectedTask.title}"?`)) {
      deleteTask.mutate({ projectId: selectedTask.project_id, taskId: selectedTask.id })
    }
  }
  const handleStatusChange = (selectedTask: Task, status: TaskStatus) => {
    if (selectedTask.status !== status) updateStatus.mutate({ taskId: selectedTask.id, status })
  }
  const availableTags = tagsQuery.data?.data ?? []
  const actionError = updateTask.error ?? updateStatus.error ?? deleteTask.error ?? tagsQuery.error

  return (
    <AuthenticatedLayout title="Tarefas" description="Ajuste prioridade e acompanhe a execução em tempo real.">
      {!dashboard.isLoading && !dashboard.error && tasks.length > 0 && (
        <div className="mb-4 flex justify-end">
          <TaskViewToggle view={view} onChange={setView} />
        </div>
      )}
      {dashboard.isLoading && <LoadingState label="Carregando tarefas..." />}
      {dashboard.error && <ErrorState title="Não foi possível carregar as tarefas" message={getApiErrorMessage(dashboard.error, 'Tente novamente em alguns instantes.')} onRetry={() => void dashboard.refetch()} />}
      {actionError && <p className="mb-4 text-sm text-[var(--color-danger)]" role="alert">{getApiErrorMessage(actionError, 'Não foi possível concluir a ação.')}</p>}
      {editingTask && (
        <div className="mb-5">
          <TaskForm
            task={editingTask}
            availableTags={availableTags}
            isSubmitting={updateTask.isPending}
            serverError={updateTask.error ? getApiErrorMessage(updateTask.error, 'Não foi possível salvar a tarefa.') : undefined}
            serverErrors={updateTask.error instanceof ApiError ? updateTask.error.errors : undefined}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTask(undefined)}
          />
        </div>
      )}
      {!dashboard.isLoading && !dashboard.error && tasks.length === 0 && <EmptyState title="Nenhuma tarefa ativa" message="Crie a primeira tarefa dentro de um projeto para começar a operação." />}
      {!dashboard.isLoading && !dashboard.error && tasks.length > 0 && view === 'list' && (
        <TaskListView
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteTask.isPending}
        />
      )}
      {!dashboard.isLoading && !dashboard.error && tasks.length > 0 && view === 'kanban' && (
        <TaskKanban
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          isDeleting={deleteTask.isPending}
          scrollColumns={false}
        />
      )}
    </AuthenticatedLayout>
  )
}