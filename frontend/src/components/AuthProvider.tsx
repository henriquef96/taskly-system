import { useMemo, type PropsWithChildren } from 'react'
import { useCurrentUser } from '@/hooks/useAuth'
import { AuthContext } from '@/auth/AuthContext'
import type { AuthContextValue } from '@/types/auth'

export function AuthProvider({ children }: PropsWithChildren) {
  const currentUser = useCurrentUser()
  const value = useMemo<AuthContextValue>(() => ({
    user: currentUser.data ?? null,
    isLoading: currentUser.isLoading,
  }), [currentUser.data, currentUser.isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
