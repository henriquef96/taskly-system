import axios from 'axios'
import { httpClient } from '@/api/httpClient'
import type { AuthResponse, UserResponse } from '@/types/api'
import type { LoginInput, RegisterInput } from '@/types/auth'

async function initializeCsrfCookie(): Promise<void> {
  await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
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

export async function getCurrentUser(): Promise<UserResponse> {
  const { data } = await httpClient.get<UserResponse>('/me')
  return data
}

export async function logout(): Promise<void> {
  await httpClient.post('/logout')
}
