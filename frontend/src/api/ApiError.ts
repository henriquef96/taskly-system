/**
 * Erro lançado quando a API REST retorna uma resposta de falha.
 * Mantém o status HTTP para permitir tratamento específico por quem consome a API.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
