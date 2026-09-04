import type { User } from '@/types/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginInput extends LoginRequest {}

export interface RegisterInput extends RegisterRequest {}

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
}
