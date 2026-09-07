import { httpClient } from '@/api/httpClient'
import { clearAuthToken, storeAuthToken } from '@/api/authToken'
import type { AuthResponse, UserResponse } from '@/types/api'
import type { ChangePasswordInput, LoginInput, RegisterInput } from '@/types/auth'

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/login', input)
  storeAuthToken(data.token)
  return data
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/register', input)
  storeAuthToken(data.token)
  return data
}

export async function getCurrentUser(): Promise<UserResponse | null> {
  const response = await httpClient.get<UserResponse>('/me', {
    validateStatus: (status) => status === 200 || status === 401,
  })
  if (response.status === 401) {
    clearAuthToken()
    return null
  }
  return response.data
}

export async function logout(): Promise<void> {
  try {
    await httpClient.post('/logout')
  } finally {
    clearAuthToken()
  }
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await httpClient.patch('/password', input)
}