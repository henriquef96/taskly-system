export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Erro tipado lançado quando a API REST retorna uma resposta de falha.
 */
export class ApiError extends Error {
  readonly status: number
  readonly errors: Record<string, string[]>

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  if (typeof value !== 'object' || value === null) return false

  const payload = value as Record<string, unknown>
  const hasMessage = payload.message === undefined || typeof payload.message === 'string'
  const hasErrors = payload.errors === undefined || isValidationErrors(payload.errors)

  return hasMessage && hasErrors
}

function isValidationErrors(value: unknown): value is Record<string, string[]> {
  if (typeof value !== 'object' || value === null) return false

  return Object.values(value).every(
    (messages) => Array.isArray(messages) && messages.every((message) => typeof message === 'string'),
  )
}
