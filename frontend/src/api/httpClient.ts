import { env } from '@/config/env'
import axios from 'axios'

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
