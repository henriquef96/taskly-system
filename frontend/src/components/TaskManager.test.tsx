import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  })

  it('cria e exclui tarefas e altera o status', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<TestProviders><TaskManager projectId={project.id} /></TestProviders>)

    fireEvent.click(screen.getByRole('button', { name: 'Nova tarefa' }))
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Nova tarefa' } })
    fireEvent.change(screen.getByLabelText('Descrição curta'), { target: { value: 'Descrição' } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar tarefa' }))
    await waitFor(() => expect(createMutate).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Nova tarefa',
      short_description: 'Descrição',
    }), expect.objectContaining({ onSuccess: expect.any(Function) })))

    fireEvent.change(screen.getByRole('combobox', { name: `Alterar status de ${task.title}` }), { target: { value: 'completed' } })
    expect(statusMutate).toHaveBeenCalledWith({ taskId: task.id, status: 'completed' })

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(deleteMutate).toHaveBeenCalledWith(task.id)
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
