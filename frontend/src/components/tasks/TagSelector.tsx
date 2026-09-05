import type { ChangeEvent } from 'react'
import type { Tag, TagId } from '@/types/tags'

interface TagSelectorProps {
  availableTags: Tag[]
  selectedTagIds: TagId[]
  onChange: (tagIds: TagId[]) => void
  disabled?: boolean
}

export function TagSelector({ availableTags, selectedTagIds, onChange, disabled = false }: TagSelectorProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(Array.from(event.target.selectedOptions, (option) => Number(option.value) as TagId))
  }

  return (
    <fieldset disabled={disabled} className="space-y-2">
      <legend className="text-sm font-medium text-slate-700">Tags</legend>
      {availableTags.length > 0 ? (
        <select
          multiple
          value={selectedTagIds.map(String)}
          onChange={handleChange}
          className="min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          aria-label="Tags da tarefa"
        >
          {availableTags.map((tag) => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      ) : (
        <p className="text-xs text-slate-500">Nenhuma tag cadastrada.</p>
      )}
    </fieldset>
  )
}
