import axios from 'axios'
import { env } from '@/config/env'

const rawApiUrl = env.apiUrl.replace(/\/$/, '')

export const httpClient = axios.create({
  baseURL: rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

httpClient.interceptors.request.use((config) => {
  if (config.url?.startsWith('/sanctum/')) {
    config.baseURL = rawApiUrl.replace(/\/api$/, '')
  }
  
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  
  return config
})