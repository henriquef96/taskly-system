import { TaskAttachments } from '@/components/tasks/TaskAttachments'

import {
  formatTaskTicket,
  getTaskStatusLabel,
  isTaskStatus,
  TASK_STATUS_VALUES,
  type Task,
  type TaskStatus,
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

const TASK_STATUS_BADGE_STYLES: Record<TaskStatus, string> = {
  pending: 'border-slate-200 bg-slate-50 text-slate-700',
  in_progress: 'border-blue-200 bg-blue-50 text-blue-700',
  completed: 'border-green-200 bg-green-50 text-green-700',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
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
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 truncate font-semibold">
          <span className="mr-1 text-sm font-normal text-slate-500">
            {formatTaskTicket(task.ticket_number)}
          </span>
          {task.title}
        </h4>
        {variant === 'list' ? null : (
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${TASK_STATUS_BADGE_STYLES[task.status]}`}>
            {getTaskStatusLabel(task.status)}
          </span>
        )}
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

      <TaskAttachments projectId={projectId} taskId={task.id} attachments={task.attachments} />

      <div className="mt-3 flex items-center gap-2">
        <select
          aria-label={`Alterar status de ${task.title}`}
          value={task.status}
          onChange={(event) => {
            if (isTaskStatus(event.target.value)) onStatusChange(task.id, event.target.value)
          }}
          disabled={isStatusUpdating}
          className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs"
        >
          {TASK_STATUS_VALUES.map((value) => <option key={value} value={value}>{getTaskStatusLabel(value)}</option>)}
        </select>
        <button type="button" onClick={() => onEdit(task)} className="text-xs font-medium text-indigo-600">
          Editar
        </button>
        <button type="button" onClick={() => onDelete(task)} disabled={isDeleting} className="text-xs font-medium text-red-600 disabled:opacity-60">
          Excluir
        </button>
      </div>
    </article>
  )
}