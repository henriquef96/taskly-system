import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskManager } from '@/components/tasks/TaskManager'
import { project, task } from '@/test/fixtures'
import { TestProviders } from '@/test/testUtils'

const createMutate = vi.fn()
const deleteMutate = vi.fn()
const statusMutate = vi.fn()
let taskState: { data: { data: (typeof task)[] } | undefined; isLoading: boolean; error: Error | null; refetch: ReturnType<typeof vi.fn> } = {
  data: { data: [task] },
  isLoading: false,
  error: null,
  refetch: vi.fn(),
}

vi.mock('@/hooks/useProjects', () => ({
  useProjectTasks: () => taskState,
  useTags: () => ({ data: { data: [] }, isLoading: false, error: null }),
  useCreateTask: () => ({ mutate: createMutate, isPending: false, error: null }),
  useUpdateTask: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useDeleteTask: () => ({ mutate: deleteMutate, isPending: false, error: null }),
  useUpdateTaskStatus: () => ({ mutate: statusMutate, isPending: false, error: null }),
  useUploadTaskAttachment: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useDeleteTaskAttachment: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}))

describe('TaskManager', () => {
  beforeEach(() => {
    taskState = { data: { data: [task] }, isLoading: false, error: null, refetch: vi.fn() }
    createMutate.mockReset()
    deleteMutate.mockReset()
    statusMutate.mockReset()
    window.localStorage.clear()
  })

  it('alterna entre visão kanban e lista mantendo a mesma tarefa visível', () => {
    render(<TestProviders><TaskManager projectId={project.id} /></TestProviders>)

    expect(screen.getByRole('button', { name: 'Kanban', pressed: true })).toBeInTheDocument()
    expect(screen.getByText(task.title)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Lista' }))

    expect(screen.getByRole('button', { name: 'Lista', pressed: true })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Lista de tarefas ordenada por posição' })).toBeInTheDocument()
    expect(screen.getByText(task.title)).toBeInTheDocument()
    expect(screen.getByText('Não iniciada')).toBeInTheDocument()
  })

  it('exibe loading, erro e estado vazio', () => {
    taskState = { data: undefined, isLoading: true, error: null, refetch: vi.fn() }
    const { rerender } = render(<TestProviders><TaskManager projectId={project.id} /></TestProviders>)
    expect(screen.getByRole('status')).toHaveTextContent('Carregando tarefas...')

    taskState = { data: undefined, isLoading: false, error: new Error('Falha ao carregar'), refetch: vi.fn() }
    rerender(<TestProviders><TaskManager projectId={project.id} /></TestProviders>)
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar as tarefas')

    taskState = { data: { data: [] }, isLoading: false, error: null, refetch: vi.fn() }
    rerender(<TestProviders><TaskManager projectId={project.id} /></TestProviders>)
    expect(screen.getByText('Nenhuma tarefa por aqui')).toBeInTheDocument()
  })
})
