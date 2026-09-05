import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatProjectTicket, type Project, type ProjectInput, type ProjectStatus } from '@/types/api'
import type { ProjectFormValues } from '@/types/forms'
import { ProjectAttachments } from '@/components/projects/ProjectAttachments'

interface ProjectFormProps {
  project?: Project
  isSubmitting: boolean
  serverError?: string
  serverErrors?: Record<string, string[]>
  onSubmit: (input: ProjectInput, attachment?: File) => void
  onCancel?: () => void
  isEditing?: boolean
  onEdit?: () => void
  projectAttachments?: Project['attachments']
}

const statusOptions: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'active', label: 'Ativo' },
  { value: 'completed', label: 'Concluído' },
  { value: 'archived', label: 'Arquivado' },
]

export function ProjectForm({ project, isSubmitting, serverError, serverErrors = {}, onSubmit, onCancel, isEditing = true, onEdit, projectAttachments }: ProjectFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachment, setAttachment] = useState<File>()
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
    }, attachment)
  }

  return (
    <form onSubmit={(event) => void handleSubmit(submit)(event)} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        {project && <div className="mb-5">
          <label htmlFor="project-ticket-number" className="text-sm font-medium text-slate-700">Ticket</label>
          <input id="project-ticket-number" value={formatProjectTicket(project.ticket_number)} readOnly className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
        </div>}
        <label htmlFor="project-name" className="text-sm font-medium text-slate-700">Título</label>
        {isEditing || !project ? <input
          id="project-name"
          aria-invalid={Boolean(errors.name || serverErrors.name)}
          aria-describedby={errors.name || serverErrors.name ? 'project-name-error' : undefined}
          {...register('name', { required: 'Informe o nome do projeto', maxLength: { value: 255, message: 'Use no máximo 255 caracteres' } })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          autoFocus
          disabled={Boolean(project) && !isEditing}
        /> : <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{project.name}</p>}
        {(errors.name || serverErrors.name) && <p id="project-name-error" className="mt-1 text-sm text-red-600">{errors.name?.message ?? serverErrors.name?.join(' ')}</p>}
      </div>
      <div>
        <label htmlFor="project-description" className="text-sm font-medium text-slate-700">Descrição</label>
        {isEditing || !project ? <textarea
          id="project-description"
          {...register('description')}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Descreva o objetivo deste projeto"
          disabled={Boolean(project) && !isEditing}
        /> : <p className="mt-1 min-h-24 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{project.description || 'Sem descrição.'}</p>}
      </div>
      <div>
        <label htmlFor="project-status" className="text-sm font-medium text-slate-700">Status</label>
        {isEditing || !project ? <select id="project-status" {...register('status')} disabled={Boolean(project) && !isEditing} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select> : <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{statusOptions.find((option) => option.value === project.status)?.label}</p>}
      </div>
      {project && <ProjectAttachments projectId={project.id} attachments={projectAttachments ?? project.attachments} />}
      {serverErrors.description?.map((message) => <p key={message} className="text-sm text-red-600">{message}</p>)}
      {!project && <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="min-w-0">
          <label htmlFor="project-attachment" className="text-sm font-medium text-slate-700">Anexo</label>
          <p className="mt-1 truncate text-xs text-slate-500">{attachment?.name ?? 'Opcional, até 10 MB'}</p>
        </div>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="shrink-0 rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">Adicionar arquivo</button>
        <input ref={fileInputRef} id="project-attachment" type="file" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0])} />
      </div>}
      {serverError && <p className="text-sm text-red-600" role="alert">{serverError}</p>}
      <div className="flex justify-end gap-3">
        {project && !isEditing && onEdit && <button type="button" onClick={onEdit} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Editar</button>}
        {project && !isEditing ? null : <>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button>}
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Salvando...' : project ? 'Salvar alterações' : 'Criar projeto'}
        </button>
        </>}
      </div>
    </form>
  )
}
