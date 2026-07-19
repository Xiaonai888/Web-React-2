import { useEffect, useRef, useState } from 'react'

const OPTIONS = [
  { key: 'restrict', label: 'Restrict' },
  { key: 'block', label: 'Block' },
  { key: 'report', label: 'Report', danger: true },
  { key: 'about', label: 'About this reader' },
  { key: 'activity', label: 'See shared activity' },
  { key: 'hide-story', label: 'Hide your story' },
  { key: 'remove-follower', label: 'Remove follower' },
  { key: 'copy-link', label: 'Copy profile URL' },
  { key: 'share-profile', label: 'Share this profile' },
  { key: 'qr-code', label: 'QR code' },
]

export default function ReaderProfileOptionsSheet({
  open,
  onClose,
  onSelect,
}) {
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    lastY: 0,
    startTime: 0,
  })
  const [dragOffset, setDragOffset] =
    useState(0)
  const [dragging, setDragging] =
    useState(false)

  useEffect(() => {
    if (!open) return undefined

    setDragOffset(0)
    document.body.style.overflow =
      'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  function resetDrag() {
    dragRef.current = {
      active: false,
      pointerId: null,
      startY: 0,
      lastY: 0,
      startTime: 0,
    }
    setDragging(false)
    setDragOffset(0)
  }

  function startDrag(event) {
    if (!event.isPrimary) return
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      startTime: performance.now(),
    }

    setDragging(true)
    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  function moveDrag(event) {
    const drag = dragRef.current

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    drag.lastY = event.clientY

    setDragOffset(
      Math.min(
        Math.max(
          0,
          event.clientY - drag.startY
        ),
        window.innerHeight * 0.55
      )
    )
  }

  function endDrag(event) {
    const drag = dragRef.current

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    drag.lastY = event.clientY

    const distance = Math.max(
      0,
      drag.lastY - drag.startY
    )
    const elapsed = Math.max(
      1,
      performance.now() -
        drag.startTime
    )
    const velocity =
      distance / elapsed

    if (
      distance >= 70 ||
      (distance >= 28 &&
        velocity >= 0.55)
    ) {
      resetDrag()
      onClose()
      return
    }

    resetDrag()
  }

  function cancelDrag(event) {
    if (
      dragRef.current.pointerId !==
      event.pointerId
    ) {
      return
    }

    resetDrag()
  }

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
        aria-label="Close profile options"
      />

      <section
        className="relative max-h-[88vh] w-full overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:mb-4 sm:max-w-[560px] sm:rounded-[28px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <div
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={cancelDrag}
          onLostPointerCapture={
            cancelDrag
          }
          className="flex h-14 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        >
          <div className="h-1.5 w-12 rounded-full bg-[#cfd3dc]" />
        </div>

        <div className="max-h-[calc(88vh-56px)] overflow-y-auto px-5 pb-[calc(22px+env(safe-area-inset-bottom))]">
          {OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() =>
                onSelect?.(option.key)
              }
              className={`flex min-h-16 w-full items-center text-left text-[17px] font-normal active:bg-[#f7f7f9] ${
                option.danger
                  ? 'text-[#dc2626]'
                  : 'text-[#111827]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
