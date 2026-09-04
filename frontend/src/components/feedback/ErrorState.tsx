interface ErrorStateProps {
  title: string
  message: string
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800" role="alert">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  )
}
