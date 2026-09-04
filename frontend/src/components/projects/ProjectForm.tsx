import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Project, ProjectInput, ProjectStatus } from '@/types/api'

interface ProjectFormProps {
  project?: Project
  isSubmitting: boolean
  serverError?: string
  onSubmit: (input: ProjectInput) => void
  onCancel?: () => void
}

interface ProjectFormValues {
  name: string
  description: string
  status: ProjectStatus
}

const statusOptions: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'active', label: 'Ativo' },
  { value: 'completed', label: 'Concluído' },
  { value: 'archived', label: 'Arquivado' },
]

export function ProjectForm({ project, isSubmitting, serverError, onSubmit, onCancel }: ProjectFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>({
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
      status: project?.status ?? 'active',
    },
  })

  useEffect(() => {
    reset({
      name: project?.name ?? '',
      description: project?.description ?? '',
      status: project?.status ?? 'active',
    })
  }, [project, reset])

  const submit = (values: ProjectFormValues) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      status: values.status,
    })
  }

  return (
    <form onSubmit={(event) => void handleSubmit(submit)(event)} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="project-name" className="text-sm font-medium text-slate-700">Nome</label>
        <input
          id="project-name"
          {...register('name', { required: 'Informe o nome do projeto', maxLength: { value: 255, message: 'Use no máximo 255 caracteres' } })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          autoFocus
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="project-description" className="text-sm font-medium text-slate-700">Descrição</label>
        <textarea
          id="project-description"
          {...register('description')}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Descreva o objetivo deste projeto"
        />
      </div>
      <div>
        <label htmlFor="project-status" className="text-sm font-medium text-slate-700">Status</label>
        <select id="project-status" {...register('status')} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      {serverError && <p className="text-sm text-red-600" role="alert">{serverError}</p>}
      <div className="flex justify-end gap-3">
        {onCancel && <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button>}
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Salvando...' : project ? 'Salvar alterações' : 'Criar projeto'}
        </button>
      </div>
    </form>
  )
}
