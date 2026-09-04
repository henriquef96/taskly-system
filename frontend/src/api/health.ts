import { httpClient } from '@/api/httpClient'
import type { HealthStatus } from '@/types/health'

/**
 * Consulta o health-check da API (`GET /api/health`).
 */
export function fetchHealth(): Promise<HealthStatus> {
  return httpClient.get<HealthStatus>('/health')
}
