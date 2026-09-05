import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardPage } from '@/pages/DashboardPage'
import { user } from '@/test/fixtures'
import { AuthContext } from '@/auth/AuthContext'
import { TestProviders } from '@/test/testUtils'

const dashboardState = {
data: { projects: [], tasks: [] },
isLoading: false,
error: null,
}

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user, isLoading: false }),
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@/hooks/useProjects', () => ({
  useDashboardData: () => dashboardState,
  useCreateProject: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useUploadProjectAttachment: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useDeleteProject: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}))

describe('DashboardPage', () => {
  it('mantém a visão geral sem o bloco de projetos recentes', () => {
    render(
      <TestProviders>
        <AuthContext.Provider value={{ user, isLoading: false }}>
          <DashboardPage />
        </AuthContext.Provider>
      </TestProviders>,
    )

    expect(screen.queryByText('Projetos recentes')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Tarefas' })).toHaveAttribute('href', '/tasks')
  })
})
