import axios, { isAxiosError } from 'axios'
import { ApiError, isApiErrorPayload } from '@/api/ApiError'
import { env } from '@/config/env'

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: { Accept: 'application/json' },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

httpClient.interceptors.request.use((config) => {
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
