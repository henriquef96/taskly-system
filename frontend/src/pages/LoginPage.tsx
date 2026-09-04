import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormValues } from '@/types/forms'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const [error, setError] = useState('')

  async function onSubmit(form: LoginFormValues) {
    setError('')
    try { await login(form); navigate('/dashboard') }
    catch { setError('Não foi possível entrar. Verifique suas credenciais.') }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-neutral-100 px-6">
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">Entrar no Taskly</h1>
        <input type="email" placeholder="E-mail" {...register('email')} className="w-full rounded border p-3" />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        <input type="password" placeholder="Senha" {...register('password')} className="w-full rounded border p-3" />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-blue-600 p-3 font-medium text-white">Entrar</button>
      </form>
    </main>
  )
}
