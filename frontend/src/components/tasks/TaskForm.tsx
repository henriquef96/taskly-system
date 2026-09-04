import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TagSelector } from '@/components/tasks/TagSelector'
import type { Task, TaskInput } from '@/types/api'
import { TASK_STATUS_VALUES, getTaskStatusLabel } from '@/types/api'
import type { Tag } from '@/types/tags'
import type { TaskFormValues } from '@/types/forms'

interface TaskFormProps {
  task?: Task
  isSubmitting: boolean
  serverError?: string
  onSubmit: (input: TaskInput) => void
  onCancel: () => void
  availableTags: Tag[]
  serverErrors?: Record<string, string[]>
}

const toDateInput = (value: string | null | undefined) => value ? value.slice(0, 16) : ''

export function TaskForm({ task, isSubmitting, serverError, serverErrors = {}, onSubmit, onCancel, availableTags }: TaskFormProps) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<TaskFormValues>({
    defaultValues: {
      title: task?.title ?? '',
      short_description: task?.short_description ?? '',
      full_description: task?.full_description ?? '',
      due_date: toDateInput(task?.due_date),
      status: task?.status ?? 'pending',
      position: task?.position ?? 0,
      tags: task?.tags.map((tag) => tag.id) ?? [],
    },
  })

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      short_description: task?.short_description ?? '',
      full_description: task?.full_description ?? '',
      due_date: toDateInput(task?.due_date),
      status: task?.status ?? 'pending',
      position: task?.position ?? 0,
      tags: task?.tags.map((tag) => tag.id) ?? [],
    })
  }, [reset, task])

  const submit = (values: TaskFormValues) => {
    onSubmit({
      title: values.title.trim(),
      short_description: values.short_description.trim(),
      full_description: values.full_description.trim() || null,
      due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
      status: values.status,
      position: Number(values.position),
      tags: values.tags,
    })
  }

  return (
    <form onSubmit={(event) => void handleSubmit(submit)(event)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Título
          <input id="task-title" aria-invalid={Boolean(errors.title || serverErrors.title)} aria-describedby={errors.title || serverErrors.title ? 'task-title-error' : undefined} {...register('title', { required: 'Informe o título', maxLength: { value: 255, message: 'Use no máximo 255 caracteres' } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          {(errors.title || serverErrors.title) && <span id="task-title-error" className="mt-1 block text-xs text-red-600">{errors.title?.message ?? serverErrors.title?.join(' ')}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700">Descrição curta
          <input id="task-short-description" aria-invalid={Boolean(errors.short_description || serverErrors.short_description)} aria-describedby={errors.short_description || serverErrors.short_description ? 'task-short-description-error' : undefined} {...register('short_description', { required: 'Informe a descrição curta', maxLength: { value: 255, message: 'Use no máximo 255 caracteres' } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          {(errors.short_description || serverErrors.short_description) && <span id="task-short-description-error" className="mt-1 block text-xs text-red-600">{errors.short_description?.message ?? serverErrors.short_description?.join(' ')}</span>}
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">Descrição completa
        <textarea {...register('full_description')} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-indigo-500" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">Prazo
          <input type="datetime-local" {...register('due_date')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
        </label>
        <label className="text-sm font-medium text-slate-700">Status
          <select {...register('status')} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
            {TASK_STATUS_VALUES.map((status) => <option key={status} value={status}>{getTaskStatusLabel(status)}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Posição
          <input type="number" min="0" {...register('position', { valueAsNumber: true, min: 0 })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
        </label>
      </div>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagSelector
            availableTags={availableTags}
            selectedTagIds={field.value}
            onChange={field.onChange}
            disabled={isSubmitting}
          />
        )}
      />
      {serverErrors.tags?.map((message) => <p key={message} className="text-xs text-red-600">{message}</p>)}
      {serverError && <p className="text-sm text-red-600" role="alert">{serverError}</p>}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{isSubmitting ? 'Salvando...' : task ? 'Salvar tarefa' : 'Criar tarefa'}</button>
      </div>
    </form>
  )
}
