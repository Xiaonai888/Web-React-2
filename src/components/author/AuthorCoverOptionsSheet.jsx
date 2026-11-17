import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import useOverlayScrollLock from '../../hooks/useOverlayScrollLock'

const DISMISS_DISTANCE = 85

export default function AuthorCoverOptionsSheet({
  open,
  onClose,
  onSeeCover,
  onUploadCover,
  onChooseCover,
}) {
  const { t } = useDisplayTranslation()
  const [dragY, setDragY] = useState(0)
  const dragStart = useRef(null)
  const dragged = useRef(false)

  useOverlayScrollLock(open)

  useEffect(() => {
    if (!open) return undefined
    setDragY(0)
    dragged.current = false
    const onEscape = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [open, onClose])

  const startDrag = (event) => {
    const touch = event.touches?.[0]
    if (!touch) return
    dragStart.current = touch.clientY
    dragged.current = false
  }

  const moveDrag = (event) => {
    const touch = event.touches?.[0]
    if (!touch || dragStart.current === null) return
    const movement = Math.max(0, touch.clientY - dragStart.current)
    if (movement > 8) dragged.current = true
    setDragY(Math.min(movement, 360))
  }

  const finishDrag = () => {
    dragStart.current = null
    if (dragY >= DISMISS_DISTANCE) {
      setDragY(0)
      onClose?.()
      return
    }
    setDragY(0)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center px-4 py-4" role="presentation">
      <button
        type="button"
        aria-label={t('authorPublicPage.closeCoverOptions')}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('authorPublicPage.chooseCover')}
        className="relative z-10 mx-auto max-h-[calc(100dvh-32px)] w-full max-w-[420px] overflow-y-auto overscroll-contain rounded-[28px] bg-[var(--shadow-bg-surface)] px-5 py-4 shadow-2xl"
        style={{
          transform: `translate3d(0, ${dragY}px, 0)`,
          transition: dragStart.current === null ? 'transform 180ms ease-out' : 'none',
          touchAction: 'pan-y',
        }}
        onTouchStart={startDrag}
        onTouchMove={moveDrag}
        onTouchEnd={finishDrag}
        onTouchCancel={finishDrag}
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#9ca3af]" />
        <div className="space-y-1">
          <button type="button" onClick={onSeeCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-image text-[18px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.seeCover')}</span>
          </button>
          <button type="button" onClick={onUploadCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-solid fa-arrow-up-from-bracket text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.uploadCover')}</span>
          </button>
          <button type="button" onClick={onChooseCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-folder-open text-[18px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.chooseCover')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
