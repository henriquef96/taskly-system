import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Informe seu nome').max(255),
  email: z.email('Informe um e-mail válido'),
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[a-z]/, 'A senha deve conter uma letra minúscula')
    .regex(/[A-Z]/, 'A senha deve conter uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter um número')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter um símbolo'),
  password_confirmation: z.string().min(1, 'Confirme sua senha'),
}).refine((value) => value.password === value.password_confirmation, {
  message: 'As senhas precisam ser iguais',
  path: ['password_confirmation'],
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

export interface ProjectFormValues {
  name: string
  description: string
  status: 'active' | 'completed' | 'archived'
}

export interface TaskFormValues {
  title: string
  short_description: string
  full_description: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  position: number
  tags: number[]
}
