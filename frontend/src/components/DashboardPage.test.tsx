import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardPage } from '@/pages/DashboardPage'
import { user, project } from '@/test/fixtures'
import { AuthContext } from '@/auth/AuthContext'
import { TestProviders } from '@/test/testUtils'

const dashboardState = {
  projectsQuery: { data: { data: [project] }, isLoading: false, error: null, refetch: vi.fn() },
  taskQueries: [],
  tasks: [],
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
  useDeleteProject: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}))

describe('DashboardPage', () => {
  it('lista os projetos retornados pela API', () => {
    render(
      <TestProviders>
        <AuthContext.Provider value={{ user, isLoading: false }}>
          <DashboardPage />
        </AuthContext.Provider>
      </TestProviders>,
    )

    expect(screen.getByRole('link', { name: project.name })).toBeInTheDocument()
    expect(screen.getByText('1 exibidos')).toBeInTheDocument()
  })
})
