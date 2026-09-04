interface ErrorStateProps {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800" role="alert">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500">
          Tentar novamente
        </button>
      )}
    </div>
  )
}
