import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { useRegister } from '@/hooks/useAuth'
import { registerSchema, type RegisterFormValues } from '@/types/forms'

export function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })
  const serverErrors = registerUser.error instanceof ApiError ? registerUser.error.errors : {}

  function onSubmit(form: RegisterFormValues) {
    registerUser.mutate(form, { onSuccess: () => navigate('/dashboard') })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-neutral-100 px-6">
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <label htmlFor="register-name" className="block text-sm font-medium text-slate-700">Nome</label>
        <input id="register-name" autoComplete="name" aria-invalid={Boolean(errors.name || serverErrors.name)} aria-describedby={errors.name || serverErrors.name ? 'register-name-error' : undefined} {...register('name')} className="w-full rounded border p-3" />
        {(errors.name || serverErrors.name) && <p id="register-name-error" className="text-sm text-red-600">{errors.name?.message ?? serverErrors.name?.join(' ')}</p>}
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">E-mail</label>
        <input id="register-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email || serverErrors.email)} aria-describedby={errors.email || serverErrors.email ? 'register-email-error' : undefined} {...register('email')} className="w-full rounded border p-3" />
        {(errors.email || serverErrors.email) && <p id="register-email-error" className="text-sm text-red-600">{errors.email?.message ?? serverErrors.email?.join(' ')}</p>}
        <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">Senha</label>
        <input id="register-password" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password || serverErrors.password)} aria-describedby={errors.password || serverErrors.password ? 'register-password-error' : undefined} {...register('password')} className="w-full rounded border p-3" />
        {(errors.password || serverErrors.password) && <p id="register-password-error" className="text-sm text-red-600">{errors.password?.message ?? serverErrors.password?.join(' ')}</p>}
        <label htmlFor="register-password-confirmation" className="block text-sm font-medium text-slate-700">Confirme a senha</label>
        <input id="register-password-confirmation" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password_confirmation || serverErrors.password_confirmation)} aria-describedby={errors.password_confirmation || serverErrors.password_confirmation ? 'register-password-confirmation-error' : undefined} {...register('password_confirmation')} className="w-full rounded border p-3" />
        {(errors.password_confirmation || serverErrors.password_confirmation) && <p id="register-password-confirmation-error" className="text-sm text-red-600">{errors.password_confirmation?.message ?? serverErrors.password_confirmation?.join(' ')}</p>}
        {registerUser.error && <p role="alert" className="text-sm text-red-600">
          {getApiErrorMessage(registerUser.error, 'Não foi possível criar sua conta. Tente novamente.')}
        </p>}
        <button type="submit" disabled={registerUser.isPending} className="w-full rounded bg-blue-600 p-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
          {registerUser.isPending ? 'Criando conta...' : 'Criar conta'}
        </button>
        <p className="text-center text-sm text-neutral-600">
          Já tem uma conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
        </p>
      </form>
    </main>
  )
}
