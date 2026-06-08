import { useEffect, useRef, useState } from 'react'
import CommentSection from '../comments/CommentSection'

function getPointerY(event) {
  if (event.touches?.length) return event.touches[0].clientY
  return event.clientY
}

export default function CommentsModal({
  open,
  story,
  targetType = 'story',
  targetId,
  title,
  onClose,
  onCommentChanged,
}) {
  const sheetRef = useRef(null)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const draggingRef = useRef(false)
  const [dragOffset, setDragOffset] = useState(0)

  useEffect(() => {
    if (!open) return

    setDragOffset(0)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const handleDragStart = (event) => {
  draggingRef.current = true
  startYRef.current = event.clientY
  currentYRef.current = event.clientY
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

const handleDragMove = (event) => {
  if (!draggingRef.current) return

  currentYRef.current = event.clientY
  const nextOffset = Math.max(0, currentYRef.current - startYRef.current)

  setDragOffset(nextOffset)
}

const handleDragEnd = () => {
  if (!draggingRef.current) return

  const distance = Math.max(0, currentYRef.current - startYRef.current)
  draggingRef.current = false

  if (distance > 70) {
    onClose()
    return
  }

  setDragOffset(0)
}
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/45 px-0 sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close comments"
      />

      <section
        ref={sheetRef}
        className="relative flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-[82vh] sm:rounded-[28px]"
        style={{ transform: `translateY(${dragOffset}px)` }}
      >
        <div
  role="presentation"
  onPointerDown={handleDragStart}
  onPointerMove={handleDragMove}
  onPointerUp={handleDragEnd}
  onPointerCancel={handleDragEnd}
  className="shrink-0 cursor-grab bg-white px-4 pb-2 pt-3"
  style={{ touchAction: 'none' }}
>
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d0d5dd]" />
        </div>

        <header className="shrink-0 border-b border-[#eef1f5] bg-white px-4 pb-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <div className="h-10 w-10" />

            <div className="min-w-0 flex-1 px-2 text-center">
              <h2 className="text-[17px] font-black text-[#111827]">Comments</h2>
              <p className="line-clamp-1 text-[11px] font-semibold text-[#98a2b3]">
                {title || story?.title || 'Comments'}
              </p>
            </div>

            <div className="h-10 w-10" />
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          <CommentSection
  targetType={targetType}
  targetId={targetId || story?.id}
  story={story}
  variant="modal"
  onCommentsChange={onCommentChanged}
/>
        </div>
      </section>
    </div>
  )
}
