import { Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { useRegister } from '@/hooks/useAuth'
import { registerSchema, type RegisterFormValues } from '@/types/forms'

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const navigate = useNavigate()
  const registerUser = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })
  const serverErrors = registerUser.error instanceof ApiError ? registerUser.error.errors : {} as Record<string, string[]>

  function onSubmit(form: RegisterFormValues) {
    registerUser.mutate(form, { onSuccess: () => navigate('/dashboard') })
  }

  return (
    <main className="min-h-svh w-full max-w-full overflow-x-hidden bg-[var(--color-background)] px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl min-w-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="brand-panel brand-hero-rail order-2 h-125 rounded-[2rem] p-5 sm:p-8 lg:order-1 lg:p-10">
          <div className="brand-badge mb-5 w-fit max-w-full px-3 py-1.5 text-xs font-bold sm:mb-6">
            <span aria-hidden="true">●</span>
            Organização leve
          </div>
          <h1 className="w-full break-words text-5xl leading-[0.94] text-[var(--color-ink)]">
            Comece com clareza.
          </h1>
          <p className="mt-4 max-w-[30rem] text-base leading-7 text-[var(--color-muted)]">
            Centralize projetos, tarefas e prazos em um fluxo simples para a equipe seguir.
          </p>

          <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-elevated)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">Sprint</p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">Lançamento</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">6 tarefas ativas</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">Status</p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">Em curso</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">4 entregas esta semana</p>
            </div>
          </div>
        </section>

        <section className="brand-panel order-1 min-w-0 max-w-full overflow-hidden rounded-[2rem] p-5 sm:p-7 lg:order-2 lg:p-8">
          <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-4">
            <div>
              <p className="brand-kicker">Cadastro</p>
              <h2 className="mt-2 text-3xl leading-tight text-[var(--color-ink)]">Criar conta</h2>
            </div>

            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-[var(--color-ink)]">Nome</label>
              <input id="register-name" autoComplete="name" aria-invalid={Boolean(errors.name || serverErrors.name)} aria-describedby={errors.name || serverErrors.name ? 'register-name-error' : undefined} {...register('name')} className="mt-2 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
              {(errors.name || serverErrors.name) && <p id="register-name-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.name?.message ?? serverErrors.name?.join(' ')}</p>}
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-[var(--color-ink)]">E-mail</label>
              <input id="register-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email || serverErrors.email)} aria-describedby={errors.email || serverErrors.email ? 'register-email-error' : undefined} {...register('email')} className="mt-2 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
              {(errors.email || serverErrors.email) && <p id="register-email-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.email?.message ?? serverErrors.email?.join(' ')}</p>}
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-[var(--color-ink)]">Senha</label>
              <div className="relative mt-2">
                <input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" aria-invalid={Boolean(errors.password || serverErrors.password)} aria-describedby={errors.password || serverErrors.password ? 'register-password-error' : undefined} {...register('password')} className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 pr-11 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
                <button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {(errors.password || serverErrors.password) && <p id="register-password-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.password?.message ?? serverErrors.password?.join(' ')}</p>}
            </div>

            <div>
              <label htmlFor="register-password-confirmation" className="block text-sm font-medium text-[var(--color-ink)]">Confirme a senha</label>
              <div className="relative mt-2">
                <input id="register-password-confirmation" type={showPasswordConfirmation ? 'text' : 'password'} autoComplete="new-password" aria-invalid={Boolean(errors.password_confirmation || serverErrors.password_confirmation)} aria-describedby={errors.password_confirmation || serverErrors.password_confirmation ? 'register-password-confirmation-error' : undefined} {...register('password_confirmation')} className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 pr-11 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
                <button type="button" aria-label={showPasswordConfirmation ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'} onClick={() => setShowPasswordConfirmation((current) => !current)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {(errors.password_confirmation || serverErrors.password_confirmation) && <p id="register-password-confirmation-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.password_confirmation?.message ?? serverErrors.password_confirmation?.join(' ')}</p>}
            </div>

            {Boolean(registerUser.error) && <p role="alert" className="text-sm text-[var(--color-danger)]">{getApiErrorMessage(registerUser.error, 'Não foi possível criar sua conta. Tente novamente.')}</p>}

            <button type="submit" disabled={registerUser.isPending} className="brand-button w-full px-4 py-3 text-base disabled:cursor-not-allowed disabled:opacity-70">
              {registerUser.isPending ? 'Criando conta...' : 'Criar conta'}
            </button>

            <p className="text-center text-sm text-[var(--color-muted)]">
              Já tem uma conta?
              <Link to="/login" className="ml-1 font-semibold text-[var(--color-primary-strong)] hover:text-[var(--color-primary)]">Entrar</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
