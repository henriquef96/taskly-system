interface StatusBadgeProps {
  state: 'loading' | 'online' | 'offline'
  message: string
}

const STYLES: Record<StatusBadgeProps['state'], string> = {
  loading: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  online: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  offline: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const LABELS: Record<StatusBadgeProps['state'], string> = {
  loading: 'Verificando',
  online: 'Online',
  offline: 'Offline',
}

/**
 * Indicador visual do status de conexão com a API.
 */
export function StatusBadge({ state, message }: StatusBadgeProps) {
  return (
    <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${STYLES[state]}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
      </span>
      <span>{LABELS[state]}</span>
      <span className="text-xs font-normal opacity-80">{message}</span>
    </div>
  )
}
