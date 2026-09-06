import type { TaskView } from '@/hooks/useTaskViewPreference'

interface TaskViewToggleProps {
  view: TaskView
  onChange: (view: TaskView) => void
}

export function TaskViewToggle({ view, onChange }: TaskViewToggleProps) {
  return (
    <div role="group" aria-label="Alternar visualização de tarefas" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${view === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
      >
        <span aria-hidden="true">≡</span>
        Lista
      </button>
      <button
        type="button"
        onClick={() => onChange('kanban')}
        aria-pressed={view === 'kanban'}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${view === 'kanban' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
      >
        <span aria-hidden="true">⊞</span>
        Kanban
      </button>
    </div>
  )
}