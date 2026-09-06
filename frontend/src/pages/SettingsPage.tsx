import { Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { useChangePassword } from '@/hooks/useAuth'
import { changePasswordSchema, type ChangePasswordFormValues } from '@/types/forms'

export function SettingsPage() {
  const changePassword = useChangePassword()
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmationPassword, setShowConfirmationPassword] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })
  const serverErrors = changePassword.error instanceof ApiError ? changePassword.error.errors : {} as Record<string, string[]>

  function onSubmit(form: ChangePasswordFormValues) {
    setIsSuccess(false)
    changePassword.mutate(form, {
      onSuccess: () => {
        reset()
        setIsSuccess(true)
      },
    })
  }

  return (
    <AuthenticatedLayout title="Configurações" description="Mantenha o acesso seguro e organizado.">
      <section className="brand-panel mx-auto w-full max-w-2xl rounded-[1.75rem] p-6 sm:p-8" aria-labelledby="change-password-title">
        <div className="mb-6">
          <p className="brand-kicker">Segurança</p>
          <h2 id="change-password-title" className="mt-2 text-3xl text-[var(--color-ink)]">Trocar senha</h2>
          <p className="mt-2 max-w-[30rem] text-sm leading-6 text-[var(--color-muted)]">Use uma senha forte com letras maiúsculas e minúsculas, número e símbolo.</p>
        </div>
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-5">
          <div>
            <label htmlFor="settings-current-password" className="block text-sm font-medium text-[var(--color-ink)]">Senha atual</label>
            <div className="relative mt-2">
              <input id="settings-current-password" type={showCurrentPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={Boolean(errors.current_password || serverErrors.current_password)} aria-describedby={errors.current_password || serverErrors.current_password ? 'settings-current-password-error' : undefined} {...register('current_password')} className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 pr-11 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
              <button type="button" aria-label={showCurrentPassword ? 'Ocultar senha atual' : 'Mostrar senha atual'} onClick={() => setShowCurrentPassword((current) => !current)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {(errors.current_password || serverErrors.current_password) && <p id="settings-current-password-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.current_password?.message ?? serverErrors.current_password?.join(' ')}</p>}
          </div>
          <div>
            <label htmlFor="settings-password" className="block text-sm font-medium text-[var(--color-ink)]">Nova senha</label>
            <div className="relative mt-2">
              <input id="settings-password" type={showNewPassword ? 'text' : 'password'} autoComplete="new-password" aria-invalid={Boolean(errors.password || serverErrors.password)} aria-describedby={errors.password || serverErrors.password ? 'settings-password-error' : undefined} {...register('password')} className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 pr-11 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
              <button type="button" aria-label={showNewPassword ? 'Ocultar nova senha' : 'Mostrar nova senha'} onClick={() => setShowNewPassword((current) => !current)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {(errors.password || serverErrors.password) && <p id="settings-password-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.password?.message ?? serverErrors.password?.join(' ')}</p>}
          </div>
          <div>
            <label htmlFor="settings-password-confirmation" className="block text-sm font-medium text-[var(--color-ink)]">Confirme a nova senha</label>
            <div className="relative mt-2">
              <input id="settings-password-confirmation" type={showConfirmationPassword ? 'text' : 'password'} autoComplete="new-password" aria-invalid={Boolean(errors.password_confirmation || serverErrors.password_confirmation)} aria-describedby={errors.password_confirmation || serverErrors.password_confirmation ? 'settings-password-confirmation-error' : undefined} {...register('password_confirmation')} className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 pr-11 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]" />
              <button type="button" aria-label={showConfirmationPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'} onClick={() => setShowConfirmationPassword((current) => !current)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                {showConfirmationPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {(errors.password_confirmation || serverErrors.password_confirmation) && <p id="settings-password-confirmation-error" className="mt-2 text-sm text-[var(--color-danger)]">{errors.password_confirmation?.message ?? serverErrors.password_confirmation?.join(' ')}</p>}
          </div>
          {Boolean(changePassword.error) && <p role="alert" className="text-sm text-[var(--color-danger)]">{getApiErrorMessage(changePassword.error, 'Não foi possível alterar sua senha. Tente novamente.')}</p>}
          {isSuccess && <p role="status" className="text-sm font-medium text-[var(--color-success)]">Senha alterada com sucesso.</p>}
          <button type="submit" disabled={changePassword.isPending} className="brand-button px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70">
            {changePassword.isPending ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </section>
    </AuthenticatedLayout>
  )
}
