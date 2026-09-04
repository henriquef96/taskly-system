import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Informe seu nome').max(255),
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  password_confirmation: z.string().min(8, 'Confirme sua senha'),
}).refine((value) => value.password === value.password_confirmation, {
  message: 'As senhas precisam ser iguais',
  path: ['password_confirmation'],
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
