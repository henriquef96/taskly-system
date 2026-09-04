import { ApiError } from '@/api/ApiError'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback

  if (error.message && error.message !== 'Network Error') return error.message

  switch (error.status) {
    case 401:
      return 'Sua sessão expirou. Entre novamente para continuar.'
    case 403:
      return 'Você não tem permissão para realizar esta ação.'
    case 404:
      return 'O recurso solicitado não foi encontrado.'
    case 422:
      return 'Verifique os dados informados e tente novamente.'
    default:
      return fallback
  }
}
