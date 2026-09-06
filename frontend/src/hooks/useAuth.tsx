import { useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authApi from '@/api/auth'
import { AuthContext } from '@/auth/AuthContext'
import { ApiError } from '@/api/ApiError'
import { useToast } from '@/components/toast/ToastProvider'
import type { User } from '@/types/api'
import type { ChangePasswordInput, LoginInput, RegisterInput } from '@/types/auth'

export const currentUserQueryKey = ['auth', 'current-user'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await authApi.getCurrentUser()
        return response.user
      } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) return null
        throw error
      }
    },
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (response) => {
      queryClient.setQueryData(currentUserQueryKey, response.user)
      showToast({
        title: 'Login realizado',
        description: 'Bem-vindo de volta ao Taskly.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Verifique seus dados e tente novamente.'
      showToast({
        title: 'Não foi possível entrar',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (response) => {
      queryClient.setQueryData(currentUserQueryKey, response.user)
      showToast({
        title: 'Cadastro concluído',
        description: 'Sua conta foi criada com sucesso.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.'
      showToast({
        title: 'Cadastro falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      showToast({
        title: 'Sessão encerrada',
        description: 'Você saiu com segurança do Taskly.',
        variant: 'info',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível encerrar a sessão.'
      showToast({
        title: 'Não foi possível sair',
        description: message,
        variant: 'error',
      })
    },
    onSettled: () => {
      queryClient.setQueryData(currentUserQueryKey, null)
      queryClient.clear()
    },
  })
}

export function useChangePassword() {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input),
    onSuccess: () => {
      showToast({
        title: 'Senha atualizada',
        description: 'Sua senha foi alterada com sucesso.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível alterar sua senha.'
      showToast({
        title: 'Alteração falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
