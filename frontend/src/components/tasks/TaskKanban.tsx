import { useState } from 'react'
import { TaskCard } from '@/components/tasks/TaskCard'
import { getTaskStatusLabel, TASK_STATUS_VALUES, type Task, type TaskStatus } from '@/types/api'

interface TaskKanbanProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
  isDeleting?: boolean
  scrollColumns?: boolean
}

const COLUMN_STYLES: Record<TaskStatus, string> = {
  pending: 'border-[rgba(155,183,191,0.18)] bg-[rgba(155,183,191,0.06)]',
  in_progress: 'border-[rgba(103,242,255,0.18)] bg-[rgba(103,242,255,0.06)]',
  completed: 'border-[rgba(97,209,172,0.18)] bg-[rgba(97,209,172,0.06)]',
  cancelled: 'border-[rgba(255,127,127,0.18)] bg-[rgba(255,127,127,0.06)]',
}

export function TaskKanban({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting = false,
  scrollColumns = true,
}: TaskKanbanProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
  const [dropTargetStatus, setDropTargetStatus] = useState<TaskStatus | null>(null)

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDropTargetStatus(null)
  }

  const handleDrop = (status: TaskStatus) => {
    const draggedTask = tasks.find((task) => task.id === draggedTaskId)

    if (draggedTask && draggedTask.status !== status) {
      onStatusChange(draggedTask, status)
    }

    handleDragEnd()
  }

  return (
    <div>
      <p className="mb-3 text-xs text-[var(--color-muted)]">
        Arraste um card para outra coluna para definir o status.
      </p>
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TASK_STATUS_VALUES.map((status) => {
          const statusTasks = tasks.filter((task) => task.status === status)

          return (
            <section
              key={status}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
                setDropTargetStatus(status)
              }}
              onDragLeave={() => setDropTargetStatus((current) => current === status ? null : current)}
              onDrop={(event) => {
                event.preventDefault()
                handleDrop(status)
              }}
              className={`min-w-0 rounded-[1.5rem] border p-3 transition-colors ${COLUMN_STYLES[status]} ${dropTargetStatus === status ? 'border-[var(--color-primary)] bg-[rgba(103,242,255,0.12)]' : ''}`}
              aria-labelledby={`tasks-${status}`}
            >
              <h3 id={`tasks-${status}`} className="mb-3 text-sm font-semibold text-[var(--color-ink)]">
                {getTaskStatusLabel(status)} <span className="font-normal text-[var(--color-muted)]">({statusTasks.length})</span>
              </h3>
              <div className={`min-h-24 space-y-3 pr-1 ${scrollColumns ? 'max-h-[calc(100vh-15rem)] overflow-y-auto' : ''}`}>
                {statusTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={task.project_id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    onDragStart={(selectedTask) => setDraggedTaskId(selectedTask.id)}
                    onDragEnd={handleDragEnd}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
