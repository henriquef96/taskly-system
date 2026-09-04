import { httpClient } from '@/api/httpClient'
import type { HealthStatus } from '@/types/health'
import { env } from '@/config/env'

/**
 * Consulta o health-check do Laravel (`GET /up`).
 */
export function fetchHealth(): Promise<HealthStatus> {
  return httpClient.get<HealthStatus>(`${env.serverUrl}/up`).then(({ data }) => data)
}
