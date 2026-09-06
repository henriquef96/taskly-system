import { Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { useLogin } from '@/hooks/useAuth'
import { loginSchema, type LoginFormValues } from '@/types/forms'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const serverErrors = login.error instanceof ApiError ? login.error.errors : {} as Record<string, string[]>

  function onSubmit(form: LoginFormValues) {
    login.mutate(form, { onSuccess: () => navigate('/dashboard') })
  }

  return (
    <main className="min-h-svh w-full max-w-full overflow-x-hidden bg-[var(--color-background)] px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl min-w-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="brand-panel brand-hero-rail order-2 min-w-0 max-w-full overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:order-1 lg:p-10">
          <div className="brand-badge mb-5 w-fit max-w-full px-3 py-1.5 text-xs font-bold sm:mb-6">
            <span aria-hidden="true">●</span>
            Operação em dia
          </div>
          <h1 className="w-100 break-words text-5xl leading-[0.94] text-[var(--color-ink)]">
            Taskly organiza a próxima entrega.
          </h1>
          <p className="mt-4 max-w-[32rem] text-base leading-7 text-[var(--color-muted)]">
            Tenha controle das suas atividades de forma prática e dinâmica.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-elevated)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="brand-kicker">Quadro</span>
              <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                hoje
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--color-surface)] px-3 py-2 shadow-sm">
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">Tarefa</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">Revisar briefing</p>
                </div>
                <span className="rounded-full border border-[rgba(103,242,255,0.3)] bg-[rgba(103,242,255,0.08)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                  em dia
                </span>
              </div>

              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--color-surface)] px-3 py-2 shadow-sm">
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">Projeto</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">Lançamento Q4</p>
                </div>
                <span className="rounded-full bg-[rgba(97,209,172,0.12)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-success)]">
                  ok
                </span>
              </div>

              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--color-surface)] px-3 py-2 shadow-sm">
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">Prazo</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">08:00 amanhã</p>
                </div>
                <span className="rounded-full bg-[rgba(128,235,192,0.12)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  atenção
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-panel order-1 rounded-[2rem] p-5 sm:p-7 lg:order-2 lg:p-8 h-100">
          <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-4">
            <div>
              <p className="brand-kicker">Acesso</p>
              <h2 className="mt-2 text-3xl leading-tight text-[var(--color-ink)]">Entrar no Taskly</h2>
            </div>

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-[var(--color-ink)]">E-mail</label>
              <input id="login-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email || serverErrors.email)} aria-describedby={errors.email || serverErrors.email ? 'login-email-error' : undefined} {...register('email')} className="mt-2 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
              {(errors.email || serverErrors.email) && <p id="login-email-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.email?.message ?? serverErrors.email?.join(' ')}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-[var(--color-ink)]">Senha</label>
              <div className="relative mt-2">
                <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={Boolean(errors.password || serverErrors.password)} aria-describedby={errors.password || serverErrors.password ? 'login-password-error' : undefined} {...register('password')} className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 pr-11 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
                <button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {(errors.password || serverErrors.password) && <p id="login-password-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.password?.message ?? serverErrors.password?.join(' ')}</p>}
            </div>

            {Boolean(login.error) && <p role="alert" className="text-sm text-[var(--color-danger)]">{getApiErrorMessage(login.error, 'Não foi possível entrar. Tente novamente.')}</p>}

            <button type="submit" disabled={login.isPending} className="brand-button w-full px-4 py-3 text-base disabled:cursor-not-allowed disabled:opacity-70">
              {login.isPending ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="text-center text-sm text-[var(--color-muted)]">
              Ainda não tem conta?
              <Link to="/register" className="ml-1 font-semibold text-[var(--color-primary-strong)] hover:text-[var(--color-primary)]">Criar conta</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
