import type { User } from '@/types/api'

export interface RegisterInput {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
}
