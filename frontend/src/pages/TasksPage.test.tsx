import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TasksPage } from '@/pages/TasksPage'
import { task, user } from '@/test/fixtures'
import { TestProviders } from '@/test/testUtils'

const updateMutate = vi.fn()
const deleteMutate = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user, isLoading: false }),
  useLogout: () => ({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useProjects', () => ({
  useDashboardData: () => ({ data: { projects: [], tasks: [task] }, isLoading: false, error: null, refetch: vi.fn() }),
  useTags: () => ({ data: { data: [] }, isLoading: false, error: null }),
  useUpdateTask: () => ({ mutate: updateMutate, isPending: false, error: null }),
  useUpdateTaskStatus: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useDeleteTask: () => ({ mutate: deleteMutate, isPending: false, error: null }),
  useUploadTaskAttachment: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useDeleteTaskAttachment: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}))

describe('TasksPage', () => {
  beforeEach(() => {
    updateMutate.mockReset()
    deleteMutate.mockReset()
    window.localStorage.clear()
  })

  it('abre o formulário de edição no próprio quadro de tarefas', () => {
    render(
      <TestProviders initialEntries={['/tasks']}>
        <TasksPage />
      </TestProviders>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

    expect(screen.getByDisplayValue(task.title)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar tarefa' })).toBeInTheDocument()
  })

  it('exclui a tarefa usando o projeto associado ao card', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <TestProviders initialEntries={['/tasks']}>
        <TasksPage />
      </TestProviders>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(deleteMutate).toHaveBeenCalledWith({ projectId: task.project_id, taskId: task.id })
  })
})
