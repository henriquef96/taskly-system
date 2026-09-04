import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as authApi from '@/api/auth'
import type { User } from '@/types/api'
import type { AuthContextValue, LoginInput, RegisterInput } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('taskly_token')) {
      setIsLoading(false)
      return
    }
    authApi.getCurrentUser()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem('taskly_token'))
      .finally(() => setIsLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    async login(input: LoginInput) {
      const response = await authApi.login(input)
      localStorage.setItem('taskly_token', response.token)
      setUser(response.user)
    },
    async register(input: RegisterInput) {
      const response = await authApi.register(input)
      localStorage.setItem('taskly_token', response.token)
      setUser(response.user)
    },
    async logout() {
      await authApi.logout()
      localStorage.removeItem('taskly_token')
      setUser(null)
      queryClient.clear()
    },
  }), [isLoading, queryClient, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
