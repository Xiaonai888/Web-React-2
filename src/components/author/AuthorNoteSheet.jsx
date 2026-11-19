import { useEffect } from 'react'
import { UserRound, X } from 'lucide-react'
import {
  AUTHOR_NOTE_MAX_CHARACTERS,
  getAuthorNoteCharacterCount,
  limitAuthorNote,
} from '../../utils/authorNote'

export default function AuthorNoteSheet({
  open,
  value = '',
  onChange,
  onClose,
  onSave,
  onRemove,
  hasNote = false,
  saving = false,
}) {
  useEffect(() => {
    if (!open) return undefined
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const text = String(value ?? '')
  const count = getAuthorNoteCharacterCount(text)
  const canSave = !saving && count <= AUTHOR_NOTE_MAX_CHARACTERS

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end justify-center bg-black/35 sm:items-center sm:px-4"
      onClick={() => { if (!saving) onClose?.() }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="author-note-sheet-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[18px] bg-white px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:max-w-xl sm:rounded-[14px] sm:px-5 sm:pb-5"
      >
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] disabled:opacity-50"
            aria-label="Close author's note"
          >
            <X size={17} />
          </button>
          <h2 id="author-note-sheet-title" className="min-w-0 flex-1 text-center text-[14px] font-bold text-[#111827]">
            Author's Note
          </h2>
          <button
            type="button"
            onClick={() => onSave?.(text.trim())}
            disabled={!canSave}
            className="h-8 shrink-0 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white disabled:bg-[#d0d5dd]"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </header>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <label htmlFor="author-note-text" className="text-[13px] font-semibold text-[#111827]">
              Message
            </label>
            <span className="text-[11px] text-[#8d94a1]">Optional</span>
          </div>
          <textarea
            id="author-note-text"
            value={text}
            onChange={(event) => onChange?.(limitAuthorNote(event.target.value))}
            rows={6}
            placeholder="Write a short message to your readers..."
            className="w-full resize-y rounded-[10px] bg-[#f7f7fa] px-3 py-3 text-[14px] leading-6 text-[#111827] outline-none placeholder:text-[#a5aab4] focus:ring-2 focus:ring-[#a5aab4]/45"
          />
          <p className="mt-1 text-right text-[11px] tabular-nums text-[#667085]">
            {count}/{AUTHOR_NOTE_MAX_CHARACTERS}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-[#f7f7fa] px-3 py-3">
          <UserRound className="mt-0.5 shrink-0 text-[#667085]" size={16} />
          <p className="text-[11.5px] leading-5 text-[#667085]">
            This message belongs to this episode only. Readers will see all of it after the story text.
          </p>
        </div>

        {hasNote && typeof onRemove === 'function' ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={saving}
            className="mt-4 h-11 w-full rounded-full bg-[#fff1f1] text-[12px] font-semibold text-[#d92d20] disabled:opacity-50"
          >
            Remove Author's Note
          </button>
        ) : null}
      </section>
    </div>
  )
}
