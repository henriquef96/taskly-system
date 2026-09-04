import type { Tag, TagId } from '@/types/tags'

interface TagSelectorProps {
  availableTags: Tag[]
  selectedTagIds: TagId[]
  onChange: (tagIds: TagId[]) => void
  disabled?: boolean
}

export function TagSelector({ availableTags, selectedTagIds, onChange, disabled = false }: TagSelectorProps) {
  const toggleTag = (tagId: TagId) => {
    const nextTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((selectedTagId) => selectedTagId !== tagId)
      : [...selectedTagIds, tagId]

    onChange(nextTagIds)
  }

  return (
    <fieldset disabled={disabled} className="space-y-2">
      <legend className="text-sm font-medium text-slate-700">Tags</legend>
      {availableTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <label key={tag.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50">
              <input
                type="checkbox"
                checked={selectedTagIds.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
                className="accent-indigo-600"
              />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} aria-hidden="true" />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Nenhuma tag disponível. A API ainda não possui um endpoint para listar ou criar tags.
        </p>
      )}
    </fieldset>
  )
}
