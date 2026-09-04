import { StatusBadge } from '@/components/StatusBadge'
import { useApiHealth } from '@/hooks/useApiHealth'

/**
 * Página inicial da base do frontend.
 * Demonstra a integração com o backend consumido exclusivamente via API REST.
 */
export function HomePage() {
  const { state, message } = useApiHealth()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white px-6 text-center dark:bg-neutral-950">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          Taskly System
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Base do frontend com React, TypeScript, Tailwind CSS e Vite.
        </p>
      </div>

      <StatusBadge state={state} message={message} />
    </main>
  )
}
