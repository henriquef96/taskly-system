import axios, { isAxiosError } from 'axios'
import { ApiError, isApiErrorPayload } from '@/api/ApiError'
import { getAuthToken } from '@/api/authToken'
import { env } from '@/config/env'

const rawApiUrl = env.apiUrl.replace(/\/$/, '')

export const httpClient = axios.create({
  baseURL: rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

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