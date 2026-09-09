export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  serverUrl: (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api').replace(/\/api\/?$/, ''),
} as const
