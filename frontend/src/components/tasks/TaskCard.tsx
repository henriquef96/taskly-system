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
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange?: (task: Task, status: Task['status']) => void
  onDragStart?: (task: Task) => void
  onDragEnd?: () => void
  isDeleting?: boolean
  variant?: 'kanban' | 'list'
}

const TASK_STATUS_BADGE_STYLES: Record<TaskStatus, string> = {
  pending: 'border-[rgba(155,183,191,0.25)] bg-[rgba(155,183,191,0.08)] text-[var(--color-muted)]',
  in_progress: 'border-[rgba(103,242,255,0.25)] bg-[rgba(103,242,255,0.08)] text-[var(--color-primary)]',
  completed: 'border-[rgba(97,209,172,0.25)] bg-[rgba(97,209,172,0.08)] text-[var(--color-success)]',
  cancelled: 'border-[rgba(255,127,127,0.25)] bg-[rgba(255,127,127,0.08)] text-[var(--color-danger)]',
}

export function TaskCard({
  task,
  projectId,
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
  onDragEnd,
  isDeleting = false,
  variant = 'kanban',
}: TaskCardProps) {
  const isKanban = variant === 'kanban'

  return (
    <article
      className={`task-card relative rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-sm ${isKanban ? 'cursor-grab active:cursor-grabbing' : ''}`}
      draggable={isKanban}
      onDragStart={() => onDragStart?.(task)}
      onDragEnd={onDragEnd}
    >
      <span className={`absolute top-3 right-3 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${TASK_STATUS_BADGE_STYLES[task.status]}`}>
        {getTaskStatusLabel(task.status)}
      </span>

      <div className="min-w-0 pr-20">
        <span className="text-xs text-[var(--color-muted)]">
          {formatTaskTicket(task.ticket_number)}
        </span>
        <h4 className="mt-1 min-w-0 truncate whitespace-nowrap font-semibold text-[var(--color-ink)]" title={task.title}>
          {task.title}
        </h4>
        {isKanban && onStatusChange && (
          <label className="sr-only" htmlFor={`task-status-${task.id}`}>
            Status da tarefa {task.title}
          </label>
        )}
      </div>

      <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
        {task.short_description}
      </p>

      {task.due_date && (
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Prazo: {new Date(task.due_date).toLocaleString('pt-BR')}
        </p>
      )}

      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
        {task.tags.map((tag) => (
          <span
            key={tag.id}
            className="task-tag rounded-full border px-2 py-0.5 text-[10px] font-semibold"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {variant !== 'list' && (
        <TaskAttachments projectId={projectId} taskId={task.id} attachments={task.attachments} />
      )}

      <div className="mt-3 space-y-2">
        {isKanban && onStatusChange && (
          <select
            id={`task-status-${task.id}`}
            value={task.status}
            aria-label={`Status da tarefa ${task.title}`}
            onChange={(event) => {
              if (isTaskStatus(event.target.value)) onStatusChange(task, event.target.value)
            }}
            onClick={(event) => event.stopPropagation()}
            className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-2 py-1 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)]"
          >
            {TASK_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>{getTaskStatusLabel(status)}</option>
            ))}
          </select>
        )}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onEdit(task)} className="text-xs font-medium text-[var(--color-primary-strong)] hover:text-[var(--color-primary)]">
            Editar
          </button>
          <button type="button" onClick={() => onDelete(task)} disabled={isDeleting} className="text-xs font-medium text-[var(--color-danger)] disabled:opacity-60">
            Excluir
          </button>
        </div>
      </div>
    </article>
  )
}