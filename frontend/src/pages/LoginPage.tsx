import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/ApiError'
import { getApiErrorMessage } from '@/api/errorMessage'
import { useLogin } from '@/hooks/useAuth'
import { loginSchema, type LoginFormValues } from '@/types/forms'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const serverErrors = login.error instanceof ApiError ? login.error.errors : {}

  function onSubmit(form: LoginFormValues) {
    login.mutate(form, { onSuccess: () => navigate('/dashboard') })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-neutral-100 px-6">
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">Entrar no Taskly</h1>
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">E-mail</label>
        <input id="login-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email || serverErrors.email)} aria-describedby={errors.email || serverErrors.email ? 'login-email-error' : undefined} {...register('email')} className="w-full rounded border p-3" />
        {(errors.email || serverErrors.email) && <p id="login-email-error" className="text-sm text-red-600">{errors.email?.message ?? serverErrors.email?.join(' ')}</p>}
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">Senha</label>
        <input id="login-password" type="password" autoComplete="current-password" aria-invalid={Boolean(errors.password || serverErrors.password)} aria-describedby={errors.password || serverErrors.password ? 'login-password-error' : undefined} {...register('password')} className="w-full rounded border p-3" />
        {(errors.password || serverErrors.password) && <p id="login-password-error" className="text-sm text-red-600">{errors.password?.message ?? serverErrors.password?.join(' ')}</p>}
        {login.error && <p role="alert" className="text-sm text-red-600">
          {getApiErrorMessage(login.error, 'Não foi possível entrar. Tente novamente.')}
        </p>}
        <button type="submit" disabled={login.isPending} className="w-full rounded bg-blue-600 p-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
          {login.isPending ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-center text-sm text-neutral-600">
          Ainda não tem conta? <Link to="/register" className="text-blue-600 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </main>
  )
}
