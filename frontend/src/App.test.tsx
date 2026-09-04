import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'
import { AuthContext } from '@/auth/AuthContext'
import { user } from '@/test/fixtures'
import { TestProviders } from '@/test/testUtils'

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
  it('redireciona usuário não autenticado para o login', () => {
    renderApp(null)
    expect(screen.getByRole('heading', { name: 'Entrar no Taskly' })).toBeInTheDocument()
  })

  it('exibe loading enquanto a autenticação é resolvida', () => {
    renderApp(null, true)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})

describe('entrada da aplicação', () => {
  it('encaminha visitante para o login em vez da página-base', () => {
    renderHome(null)
    expect(screen.getByRole('heading', { name: 'Entrar no Taskly' })).toBeInTheDocument()
  })

  it('encaminha usuário autenticado para o dashboard', () => {
    renderHome(user)
    expect(screen.getByRole('heading', { name: 'Visão geral' })).toBeInTheDocument()
  })
})
