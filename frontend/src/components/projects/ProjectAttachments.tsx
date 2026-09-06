import { useRef, useState } from 'react'
import { getApiErrorMessage } from '@/api/errorMessage'
import { useDeleteProjectAttachment, useUploadProjectAttachment } from '@/hooks/useProjects'
import type { Attachment } from '@/types/api'

interface ProjectAttachmentsProps {
  projectId: number
  attachments?: Attachment[]
}

const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip']
const MAX_FILE_SIZE = 10 * 1024 * 1024

export function ProjectAttachments({ projectId, attachments = [] }: ProjectAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const upload = useUploadProjectAttachment()
  const remove = useDeleteProjectAttachment(projectId)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (file.size > MAX_FILE_SIZE || !extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
      setError(file.size > MAX_FILE_SIZE ? 'O arquivo deve ter no máximo 10 MB.' : 'Tipo de arquivo não permitido.')
      return
    }
    setError(null)
    upload.mutate({ projectId, file })
  }

  return (
    <div className="mt-5 border-t border-[var(--color-line)] pt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Anexos</h3>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={upload.isPending || remove.isPending} className="rounded px-2 py-1 text-xs font-medium text-[var(--color-primary-strong)] hover:bg-[rgba(103,242,255,0.08)] disabled:opacity-60">{upload.isPending ? 'Enviando...' : 'Adicionar arquivo'}</button>
        <input ref={inputRef} type="file" className="sr-only" accept={ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`).join(',')} onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = '' }} />
      </div>
      {(Boolean(error) || Boolean(upload.error) || Boolean(remove.error)) && <p className="mt-2 text-xs text-[var(--color-danger)]" role="alert">{error ?? getApiErrorMessage(upload.error ?? remove.error, 'Não foi possível atualizar os anexos.')}</p>}
      {attachments.length > 0 && <ul className="mt-2 space-y-1">{attachments.map((attachment) => <li key={attachment.id} className="flex items-center justify-between gap-2 text-xs text-[var(--color-muted)]"><a href={attachment.download_url} className="truncate text-[var(--color-primary)] hover:underline">{attachment.file_name}</a><button type="button" onClick={() => { if (window.confirm(`Excluir o anexo "${attachment.file_name}"?`)) remove.mutate(attachment.id) }} className="shrink-0 text-[var(--color-danger)]">Excluir</button></li>)}</ul>}
      {attachments.length === 0 && <p className="mt-2 text-xs text-[var(--color-muted)]">Nenhum anexo.</p>}
    </div>
  )
}
