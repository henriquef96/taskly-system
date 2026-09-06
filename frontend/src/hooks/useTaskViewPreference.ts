import { useEffect, useState } from 'react'

export type TaskView = 'kanban' | 'list'

const STORAGE_KEY = 'taskly:task-view'

function readStoredView(): TaskView {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'kanban'
  } catch {
    return 'kanban'
  }
}

export function useTaskViewPreference() {
  const [view, setView] = useState<TaskView>(readStoredView)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, view)
    } catch {
    }
  }, [view])

  return [view, setView] as const
}