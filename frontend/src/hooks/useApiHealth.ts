import { useEffect, useState } from 'react'
import { fetchHealth } from '@/api/health'
import { ApiError } from '@/api/ApiError'

type ConnectionState = 'loading' | 'online' | 'offline'

interface UseApiHealth {
  state: ConnectionState
  message: string
}

/**
 * Verifica a disponibilidade da API REST do backend.
 * Usado para validar, na base do frontend, que a comunicação
 * com o Laravel está funcionando corretamente.
 */
export function useApiHealth(): UseApiHealth {
  const [state, setState] = useState<ConnectionState>('loading')
  const [message, setMessage] = useState('Verificando conexão com a API...')

  useEffect(() => {
    let active = true

    fetchHealth()
      .then((health) => {
        if (!active) return
        setState('online')
        setMessage(`API respondendo (status: ${health.status})`)
      })
      .catch((error: unknown) => {
        if (!active) return
        setState('offline')
        setMessage(
          error instanceof ApiError
            ? `API indisponível (HTTP ${error.status})`
            : 'Não foi possível conectar à API',
        )
      })

    return () => {
      active = false
    }
  }, [])

  return { state, message }
}
