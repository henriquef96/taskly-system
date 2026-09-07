import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { AuthContext } from '@/auth/AuthContext'
import { user } from '@/test/fixtures'
import { TestProviders } from '@/test/testUtils'

vi.mock('@/pages/LoginPage', () => ({
  LoginPage: () => <h2>Entrar no Taskly</h2>,
}))

vi.mock('@/pages/DashboardPage', () => ({
  DashboardPage: () => <h2>Visão geral</h2>,
}))

function renderApp(authUser: typeof user | null, isLoading = false) {
  return render(
    <TestProviders initialEntries={['/dashboard']}>
      <AuthContext.Provider value={{ user: authUser, isLoading }}>
        <App />
      </AuthContext.Provider>
    </TestProviders>,
  )
}

function renderHome(authUser: typeof user | null) {
  return render(
    <TestProviders initialEntries={['/']}>
      <AuthContext.Provider value={{ user: authUser, isLoading: false }}>
        <App />
      </AuthContext.Provider>
    </TestProviders>,
  )
}

describe('rotas protegidas', () => {
  it('redireciona usuário não autenticado para o login', async () => {
    renderApp(null)
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Entrar no Taskly' })).toBeInTheDocument())
  })

  it('exibe loading enquanto a autenticação é resolvida', () => {
    renderApp(null, true)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})

describe('entrada da aplicação', () => {
  it('encaminha visitante para o login em vez da página-base', async () => {
    renderHome(null)
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Entrar no Taskly' })).toBeInTheDocument())
  })

  it('encaminha usuário autenticado para o dashboard', async () => {
    renderHome(user)
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Visão geral' })).toBeInTheDocument())
  })
})
