import { useEffect, useState } from 'react'
import { UserRound, X } from 'lucide-react'
import {
  AUTHOR_NOTE_MAX_CHARACTERS,
  getAuthorNoteCharacterCount,
  limitAuthorNote,
  normalizeAuthorNote,
} from '../../utils/authorNote'

export default function AuthorWordsSheet({
  open = false,
  storyType = 'novel',
  value = '',
  onClose,
  onSave,
  onRemove,
  hasNote = false,
  saving = false,
}) {
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!open || storyType !== 'novel') return undefined

    setDraft(limitAuthorNote(value))

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !saving) onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, storyType])

  if (!open || storyType !== 'novel') return null

  const characterCount = getAuthorNoteCharacterCount(draft)
  const canSave = !saving && characterCount <= AUTHOR_NOTE_MAX_CHARACTERS

  const handleSave = () => {
    if (!canSave) return
    onSave?.(normalizeAuthorNote(draft).trim())
  }

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end justify-center bg-black/35 sm:items-center sm:px-4"
      onClick={() => {
        if (!saving) onClose?.()
      }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="author-words-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[18px] bg-white px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:max-w-xl sm:rounded-[12px] sm:px-5 sm:pb-5"
      >
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95 disabled:opacity-50"
            aria-label="Close Author Words"
          >
            <X size={17} />
          </button>

          <h2
            id="author-words-dialog-title"
            className="min-w-0 flex-1 truncate text-center text-[14px] font-bold text-[#111827]"
          >
            Author Words
          </h2>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="h-8 shrink-0 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white active:scale-95 disabled:bg-[#d0d5dd]"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </header>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="author-words-message"
              className="text-[13px] font-semibold text-[#111827]"
            >
              Message
            </label>
            <span className="text-[11px] text-[#8d94a1]">Optional</span>
          </div>

          <textarea
            id="author-words-message"
            value={draft}
            onChange={(event) => setDraft(limitAuthorNote(event.target.value))}
            disabled={saving}
            rows={6}
            placeholder="Write a short message to your readers..."
            className="min-h-[132px] w-full resize-y rounded-[10px] bg-[#f7f7fa] px-3 py-3 text-[14px] leading-6 text-[#111827] outline-none placeholder:text-[#a5aab4] focus:ring-2 focus:ring-[#a5aab4]/40 disabled:opacity-60"
          />

          <p
            className="mt-2 text-right text-[11px] tabular-nums text-[#667085]"
            aria-live="polite"
          >
            {characterCount}/{AUTHOR_NOTE_MAX_CHARACTERS}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#f7f7fa] px-3 py-3">
          <UserRound size={16} className="mt-0.5 shrink-0 text-[#667085]" />
          <p className="text-[11.5px] leading-5 text-[#667085]">
            This message is for this novel episode only. Readers will see the full message after the story text.
          </p>
        </div>

        {hasNote && typeof onRemove === 'function' ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={saving}
            className="mt-4 h-11 w-full rounded-full bg-[#fff1f1] text-[12px] font-semibold text-[#d92d20] active:scale-[0.99] disabled:opacity-60"
          >
            Remove Author Words
          </button>
        ) : null}
      </section>
    </div>
  )
}
