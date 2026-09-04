import { useRef, useState } from 'react'
import { getApiErrorMessage } from '@/api/errorMessage'
import { useDeleteTaskAttachment, useUploadTaskAttachment } from '@/hooks/useProjects'
import type { Attachment } from '@/types/api'

interface TaskAttachmentsProps {
  projectId: number
  taskId: number
  attachments?: Attachment[]
}

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip']

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function TaskAttachments({ projectId, taskId, attachments }: TaskAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string>()
  const [progress, setProgress] = useState<number>()
  const upload = useUploadTaskAttachment(projectId)
  const remove = useDeleteTaskAttachment(projectId)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('O arquivo deve ter no máximo 10 MB.')
      return
    }
    if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
      setUploadError('Tipo de arquivo não permitido.')
      return
    }

    setUploadError(undefined)
    setProgress(0)
    upload.mutate({ taskId, file, onProgress: setProgress }, {
      onSuccess: () => setProgress(undefined),
      onError: () => setProgress(undefined),
    })
  }

  const mutationError = upload.error ?? remove.error
  const errorMessage = uploadError ?? (mutationError ? getApiErrorMessage(mutationError, 'Não foi possível atualizar os anexos.') : undefined)

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between gap-2">
        <h5 className="text-xs font-semibold text-slate-700">Anexos</h5>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={upload.isPending || remove.isPending} className="rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60">
          {upload.isPending ? 'Enviando...' : 'Adicionar arquivo'}
        </button>
        <input ref={inputRef} type="file" className="sr-only" accept={ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`).join(',')} onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = '' }} />
      </div>
      {progress !== undefined && <div className="mt-2" aria-live="polite"><div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-1 text-xs text-slate-500">Enviando {progress}%</p></div>}
      {errorMessage && <p className="mt-2 text-xs text-red-600" role="alert">{errorMessage}</p>}
      {attachments && attachments.length > 0 && (
        <ul className="mt-2 space-y-1">
          {attachments.map((attachment) => <li key={attachment.id} className="flex items-center justify-between gap-2 text-xs text-slate-600">
            <span className="min-w-0 truncate" title={attachment.file_name}>{attachment.file_name} <span className="text-slate-400">({attachment.mime_type}, {formatFileSize(attachment.file_size)})</span></span>
            <button type="button" onClick={() => { if (window.confirm(`Excluir o anexo "${attachment.file_name}"?`)) remove.mutate(attachment.id) }} disabled={remove.isPending} className="shrink-0 text-red-600 disabled:opacity-60">Excluir</button>
          </li>)}
        </ul>
      )}
      {attachments?.length === 0 && <p className="mt-2 text-xs text-slate-500">Nenhum anexo.</p>}
    </div>
  )
}
