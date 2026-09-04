import { httpClient } from '@/api/httpClient'
import type { AuthResponse, UserResponse } from '@/types/api'
import type { LoginInput, RegisterInput } from '@/types/auth'

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/login', input)
  return data
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/register', input)
  return data
}

export async function getCurrentUser(): Promise<UserResponse> {
  const { data } = await httpClient.get<UserResponse>('/me')
  return data
}

export async function logout(): Promise<void> {
  await httpClient.post('/logout')
}
