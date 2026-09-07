// auth.ts
import { httpClient } from '@/api/httpClient'
import { env } from '@/config/env'
import type { AuthResponse, UserResponse } from '@/types/api'
import type { ChangePasswordInput, LoginInput, RegisterInput } from '@/types/auth'

async function initializeCsrfCookie(): Promise<void> {
  await httpClient.get('/sanctum/csrf-cookie', {
    baseURL: env.apiUrl.replace(/\/$/, ''),
  })
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  await initializeCsrfCookie()
  const { data } = await httpClient.post<AuthResponse>('/login', input)
  return data
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  await initializeCsrfCookie()
  const { data } = await httpClient.post<AuthResponse>('/register', input)
  return data
}

export async function getCurrentUser(): Promise<UserResponse | null> {
  const response = await httpClient.get<UserResponse>('/me', {
    validateStatus: (status) => status === 200 || status === 401,
  })
  return response.status === 401 ? null : response.data
}

export async function logout(): Promise<void> {
  await httpClient.post('/logout')
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await httpClient.patch('/password', input)
}