import { TaskCard } from '@/components/tasks/TaskCard'

import type { Task } from '@/types/api'

interface TaskListViewProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isDeleting?: boolean
}

export function TaskListView({
  tasks,
  onEdit,
  onDelete,
  isDeleting = false,
}: TaskListViewProps) {
  const sortedTasks = [...tasks].sort(
    (a, b) => a.position - b.position
  )

  if (sortedTasks.length === 0) {
    return (
      <p className="rounded-[1.5rem] border border-dashed border-[var(--color-line)] bg-[var(--color-panel)] p-6 text-center text-sm text-[var(--color-muted)] backdrop-blur-sm">
        Nenhuma tarefa em andamento. Crie a primeira para começar.
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
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
            variant="list"
          />
        </li>
      ))}
    </ul>
  )
}