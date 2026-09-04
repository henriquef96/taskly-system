import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from '@/pages/LoginPage'
import { TestProviders } from '@/test/testUtils'

const mutate = vi.fn()
let loginState: { error: Error | null; isPending: boolean }

vi.mock('@/hooks/useAuth', () => ({
  useLogin: () => ({ ...loginState, mutate }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    mutate.mockReset()
    loginState = { error: null, isPending: false }
  })

  it('submits valid credentials and navigates after a successful login', async () => {
    mutate.mockImplementation((_input: unknown, options: { onSuccess: () => void }) => options.onSuccess())

    render(
      <TestProviders initialEntries={['/login']}>
        <LoginPage />
      </TestProviders>,
    )

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-segura' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(mutate).toHaveBeenCalledWith(
      { email: 'ana@example.com', password: 'senha-segura' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    ))
  })

  it('shows the invalid login error from the API', () => {
    loginState = { error: new Error('Credenciais inválidas'), isPending: false }

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível entrar')
  })
})
