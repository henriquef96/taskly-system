import { env } from '@/config/env'
import { ApiError } from '@/api/ApiError'

/**
 * Cliente HTTP central para consumo da API REST do backend Laravel.
 * Único ponto de acesso à rede: nenhuma outra parte do frontend deve
 * chamar `fetch` diretamente, garantindo que toda a comunicação
 * com o backend passe por aqui (base URL, headers e tratamento de erro).
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(`Falha ao acessar ${path}`, response.status)
  }

  return (await response.json()) as T
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
}
