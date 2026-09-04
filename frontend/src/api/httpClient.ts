import axios, { isAxiosError } from 'axios'
import { ApiError, isApiErrorPayload } from '@/api/ApiError'
import { env } from '@/config/env'

/**
 * Cliente HTTP único da aplicação. O token é lido apenas no momento da
 * requisição para evitar estado duplicado entre autenticação e transporte.
 */
export const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: { Accept: 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskly_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error)) return Promise.reject(error)

    const status = error.response?.status ?? 0
    const payload: unknown = error.response?.data
    const hasPayload = isApiErrorPayload(payload)
    const message = hasPayload && payload.message ? payload.message : error.message
    const errors = hasPayload && payload.errors ? payload.errors : {}

    return Promise.reject(new ApiError(message, status, errors))
  },
)
