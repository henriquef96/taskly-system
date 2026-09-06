import { TaskAttachments } from '@/components/tasks/TaskAttachments'

import {
  formatTaskTicket,
  getTaskStatusLabel,
  isTaskStatus,
  TASK_STATUS_VALUES,
  type Task,
} from '@/types/api'

interface TaskCardProps {
  task: Task
  projectId: number
  onStatusChange: (taskId: number, status: Task['status']) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isStatusUpdating?: boolean
  isDeleting?: boolean
  variant?: 'kanban' | 'list'
}

export function TaskCard({
  task,
  projectId,
  onStatusChange,
  onEdit,
  onDelete,
  isStatusUpdating = false,
  isDeleting = false,
  variant = 'kanban',
}: TaskCardProps) {
  const isListVariant = variant === 'list'

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 truncate font-semibold">
          <span className="mr-1 text-sm font-normal text-slate-500">
            {formatTaskTicket(task.ticket_number)}
          </span>
          {task.title}
        </h4>
      </div>

      <p className="mt-1 text-sm text-slate-600">
        {task.short_description}
      </p>

      {task.due_date && (
        <p className="mt-2 text-xs text-slate-500">
          Prazo: {new Date(task.due_date).toLocaleString('pt-BR')}
        </p>
      )}

      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full px-2 py-0.5 text-xs text-slate-700"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {!isListVariant && (
        <TaskAttachments
          projectId={projectId}
          taskId={task.id}
          attachments={task.attachments}
        />
      )}

      <div className="mt-3 flex items-center gap-2">
        {!isListVariant && (
          <select
            aria-label={`Alterar status de ${task.title}`}
            value={task.status}
            onChange={(event) => {
              if (isTaskStatus(event.target.value)) {
                onStatusChange(task.id, event.target.value)
              }
            }}
            disabled={isStatusUpdating}
            className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          >
            {TASK_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {getTaskStatusLabel(value)}
              </option>
            ))}
          </select>
        )}

        {!isListVariant && (
          <>
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="text-xs font-medium text-indigo-600"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => onDelete(task)}
              disabled={isDeleting}
              className="text-xs font-medium text-red-600 disabled:opacity-60"
            >
              Excluir
            </button>
          </>
        )}
      </div>
    </article>
  )
}