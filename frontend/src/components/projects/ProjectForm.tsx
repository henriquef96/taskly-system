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
    <form onSubmit={(event) => void handleSubmit(submit)(event)} className="project-card space-y-5 rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm">
      <div>
        {project && <div className="mb-5">
          <label htmlFor="project-ticket-number" className="text-sm font-medium text-[var(--color-ink)]">Ticket</label>
          <input id="project-ticket-number" value={formatProjectTicket(project.ticket_number)} readOnly className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-muted)]" />
        </div>}
        <label htmlFor="project-name" className="text-sm font-medium text-[var(--color-ink)]">Título</label>
        {isEditing || !project ? <input
          id="project-name"
          aria-invalid={Boolean(errors.name || serverErrors.name)}
          aria-describedby={errors.name || serverErrors.name ? 'project-name-error' : undefined}
          {...register('name', { required: 'Informe o nome do projeto', maxLength: { value: 255, message: 'Use no máximo 255 caracteres' } })}
          className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]"
          autoFocus
          disabled={Boolean(project) && !isEditing}
        /> : <p className="mt-1 rounded-2xl bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)]">{project.name}</p>}
        {(errors.name || serverErrors.name) && <p id="project-name-error" className="mt-1 text-sm text-[var(--color-danger)]">{errors.name?.message ?? serverErrors.name?.join(' ')}</p>}
      </div>
      <div>
        <label htmlFor="project-description" className="text-sm font-medium text-[var(--color-ink)]">Descrição</label>
        {isEditing || !project ? <textarea
          id="project-description"
          {...register('description')}
          rows={4}
          className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]"
          placeholder="Descreva o objetivo deste projeto"
          disabled={Boolean(project) && !isEditing}
        /> : <p className="mt-1 min-h-24 rounded-2xl bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)]">{project.description || 'Sem descrição.'}</p>}
      </div>
      <div>
        <label htmlFor="project-status" className="text-sm font-medium text-[var(--color-ink)]">Status</label>
        {isEditing || !project ? <select id="project-status" {...register('status')} disabled={Boolean(project) && !isEditing} className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(103,242,255,0.12)]">
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select> : <p className="mt-1 rounded-2xl bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)]">{statusOptions.find((option) => option.value === project.status)?.label}</p>}
      </div>
      {project && <ProjectAttachments projectId={project.id} attachments={projectAttachments ?? project.attachments} />}
      {serverErrors.description?.map((message) => <p key={message} className="text-sm text-[var(--color-danger)]">{message}</p>)}
      {!project && <div className="flex items-end justify-between gap-4 border-t border-[var(--color-line)] pt-4">
        <div className="min-w-0">
          <label htmlFor="project-attachment" className="text-sm font-medium text-[var(--color-ink)]">Anexo</label>
          <p className="mt-1 truncate text-xs text-[var(--color-muted)]">{attachment?.name ?? 'Opcional, até 10 MB'}</p>
        </div>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="shrink-0 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-primary-strong)] hover:bg-[rgba(103,242,255,0.08)]">Adicionar arquivo</button>
        <input ref={fileInputRef} id="project-attachment" type="file" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0])} />
      </div>}
      {serverError && <p className="text-sm text-[var(--color-danger)]" role="alert">{serverError}</p>}
      <div className="flex justify-end gap-3">
        {project && !isEditing && onEdit && <button type="button" onClick={onEdit} className="brand-button px-4 py-2 text-sm">Editar</button>}
        {project && !isEditing ? null : <>
        {onCancel && <button type="button" onClick={onCancel} className="brand-button-secondary px-4 py-2 text-sm">Cancelar</button>}
        <button type="submit" disabled={isSubmitting} className="brand-button px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Salvando...' : project ? 'Salvar alterações' : 'Criar projeto'}
        </button>
        </>}
      </div>
    </form>
  )
}
