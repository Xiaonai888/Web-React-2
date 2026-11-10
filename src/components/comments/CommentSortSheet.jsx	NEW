import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'

// Shared bottom-sheet presentation matching the Reader Post comment sorting UI.
// Keep the choices independent of the calling comment engine.
const OPTIONS = [
  { value: 'top', title: 'hotComments', description: 'hotCommentsDesc' },
  { value: 'newest', title: 'newest', description: 'newestDesc' },
  { value: 'all', title: 'allComments', description: 'allCommentsDesc' },
]

export default function CommentSortSheet({ open, value = 'top', namespace = 'fastReelComments', onChoose, onClose }) {
  const { t } = useDisplayTranslation()
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200010] flex items-end justify-center bg-black/35" role="dialog" aria-modal="true" aria-label={t(`${namespace}.sortComments`)}>
      <button
        type="button"
        aria-label={t(`${namespace}.closeSort`)}
        onClick={onClose}
        className="absolute inset-0"
      />
      <section className="relative w-full max-w-3xl rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:mb-4 sm:rounded-[28px]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--shadow-bg-soft)]" />
        {OPTIONS.map(option => {
          const selected = value === option.value
          return (
            <button
              type="button"
              key={option.value}
              onClick={() => onChoose?.(option.value)}
              className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
              aria-pressed={selected}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-normal text-[var(--shadow-text-primary)]">
                  {t(`${namespace}.${option.title}`)}
                </span>
                <span className="mt-0.5 block text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                  {t(`${namespace}.${option.description}`)}
                </span>
              </span>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected
                ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-text-primary)]'
                : 'border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)]'}`}>
                {selected ? <i className="fa-solid fa-check text-[10px] text-[var(--shadow-bg-surface)]" /> : null}
              </span>
            </button>
          )
        })}
      </section>
    </div>,
    document.body,
  )
}
