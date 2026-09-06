import type { TaskView } from '@/hooks/useTaskViewPreference'

interface TaskViewToggleProps {
  view: TaskView
  onChange: (view: TaskView) => void
}

export function TaskViewToggle({ view, onChange }: TaskViewToggleProps) {
  return (
    <div role="group" aria-label="Alternar visualização de tarefas" className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-panel)] p-1 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${view === 'list' ? 'bg-[rgba(103,242,255,0.12)] text-[var(--color-primary)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)]'}`}
      >
        <span aria-hidden="true">≡</span>
        Lista
      </button>
      <button
        type="button"
        onClick={() => onChange('kanban')}
        aria-pressed={view === 'kanban'}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${view === 'kanban' ? 'bg-[rgba(103,242,255,0.12)] text-[var(--color-primary)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)]'}`}
      >
        <span aria-hidden="true">⊞</span>
        Kanban
      </button>
    </div>
  )
}