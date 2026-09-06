import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextIdRef = useRef(1)

  useEffect(() => {
    if (toasts.length === 0) return

    const timers = toasts.map((toast) => window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id))
    }, 4200))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [toasts])

  const dismissToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = nextIdRef.current++
    setToasts((current) => [...current, { ...toast, id }])
  }

  const value = useMemo<ToastContextValue>(() => ({ showToast, dismissToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-sm ${toast.variant === 'success' ? 'border-[#30d7c7]/30 bg-[#0d1f1d] text-[#dffef4]' : toast.variant === 'error' ? 'border-[#ff6d6d]/30 bg-[#2b1717] text-[#ffe4e4]' : 'border-[#3be7ff]/30 bg-[#10191d] text-[#ebfeff]'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && <p className="mt-1 text-xs leading-5 text-current/80">{toast.description}</p>}
              </div>
              <button type="button" aria-label="Fechar notificação" onClick={() => dismissToast(toast.id)} className="text-lg leading-none text-current/70 transition hover:text-current">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      showToast: () => undefined,
      dismissToast: () => undefined,
    }
  }

  return context
}
