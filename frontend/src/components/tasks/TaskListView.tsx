import { TaskCard } from '@/components/tasks/TaskCard'

import type { Task } from '@/types/api'

interface TaskListViewProps {
  tasks: Task[]
  onStatusChange: (
    taskId: number,
    status: Task['status']
  ) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isStatusUpdating?: boolean
  isDeleting?: boolean
}

export function TaskListView({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  isStatusUpdating = false,
  isDeleting = false,
}: TaskListViewProps) {
  const sortedTasks = [...tasks].sort(
    (a, b) => a.position - b.position
  )

  if (sortedTasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        Nenhuma tarefa por aqui.
      </p>
    )
  }

  return (
    <ul
      className="space-y-3"
      aria-label="Lista de tarefas ordenada por posição"
    >
      {sortedTasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            projectId={task.project_id}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
            isStatusUpdating={isStatusUpdating}
            isDeleting={isDeleting}
            variant="list"
          />
        </li>
      ))}
    </ul>
  )
}