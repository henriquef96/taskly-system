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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })
  const serverErrors = changePassword.error instanceof ApiError ? changePassword.error.errors : {}

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
    <AuthenticatedLayout title="Configurações" description="Mantenha sua conta segura.">
      <section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="change-password-title">
        <div className="mb-6">
          <h2 id="change-password-title" className="text-lg font-semibold text-slate-950">Trocar senha</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">Use uma senha forte com letras maiúsculas e minúsculas, número e símbolo.</p>
        </div>
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-5">
          <div>
            <label htmlFor="settings-current-password" className="block text-sm font-medium text-slate-700">Senha atual</label>
            <input id="settings-current-password" type="password" autoComplete="current-password" aria-invalid={Boolean(errors.current_password || serverErrors.current_password)} aria-describedby={errors.current_password || serverErrors.current_password ? 'settings-current-password-error' : undefined} {...register('current_password')} className="mt-2 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            {(errors.current_password || serverErrors.current_password) && <p id="settings-current-password-error" className="mt-1 text-sm text-red-600">{errors.current_password?.message ?? serverErrors.current_password?.join(' ')}</p>}
          </div>
          <div>
            <label htmlFor="settings-password" className="block text-sm font-medium text-slate-700">Nova senha</label>
            <input id="settings-password" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password || serverErrors.password)} aria-describedby={errors.password || serverErrors.password ? 'settings-password-error' : undefined} {...register('password')} className="mt-2 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            {(errors.password || serverErrors.password) && <p id="settings-password-error" className="mt-1 text-sm text-red-600">{errors.password?.message ?? serverErrors.password?.join(' ')}</p>}
          </div>
          <div>
            <label htmlFor="settings-password-confirmation" className="block text-sm font-medium text-slate-700">Confirme a nova senha</label>
            <input id="settings-password-confirmation" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password_confirmation || serverErrors.password_confirmation)} aria-describedby={errors.password_confirmation || serverErrors.password_confirmation ? 'settings-password-confirmation-error' : undefined} {...register('password_confirmation')} className="mt-2 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            {(errors.password_confirmation || serverErrors.password_confirmation) && <p id="settings-password-confirmation-error" className="mt-1 text-sm text-red-600">{errors.password_confirmation?.message ?? serverErrors.password_confirmation?.join(' ')}</p>}
          </div>
          {changePassword.error && <p role="alert" className="text-sm text-red-600">{getApiErrorMessage(changePassword.error, 'Não foi possível alterar sua senha. Tente novamente.')}</p>}
          {isSuccess && <p role="status" className="text-sm font-medium text-emerald-600">Senha alterada com sucesso.</p>}
          <button type="submit" disabled={changePassword.isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
            {changePassword.isPending ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </section>
    </AuthenticatedLayout>
  )
}
