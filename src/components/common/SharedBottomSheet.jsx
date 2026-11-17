import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const activeSheets = []
const subscribers = new Set()
let scrollSnapshot = null

function broadcastSheets() {
  const ids = [...activeSheets]
  subscribers.forEach((notify) => notify(ids))
}

function lockPageScroll() {
  if (scrollSnapshot || typeof window === 'undefined') return
  const body = document.body
  const html = document.documentElement
  const scrollY = window.scrollY

  scrollSnapshot = {
    scrollY,
    body: {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
    },
    html: {
      overflow: html.style.overflow,
      overscrollBehavior: html.style.overscrollBehavior,
    },
  }

  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.overflow = 'hidden'
  body.style.overscrollBehavior = 'none'
  html.style.overflow = 'hidden'
  html.style.overscrollBehavior = 'none'
}

function unlockPageScroll() {
  if (!scrollSnapshot) return
  const { body: previousBody, html: previousHtml, scrollY } = scrollSnapshot
  const body = document.body
  const html = document.documentElement

  Object.assign(body.style, previousBody)
  Object.assign(html.style, previousHtml)
  scrollSnapshot = null
  window.scrollTo(0, scrollY)
}

export default function SharedBottomSheet({
  open,
  onClose,
  title = '',
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  maxHeight = '88dvh',
  panelClassName = '',
  contentClassName = '',
  swipeAnywhere = false,
}) {
  const sheetId = useId()
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const dragRef = useRef(null)
  const [sheets, setSheets] = useState([])
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  onCloseRef.current = onClose
  const stackIndex = sheets.indexOf(sheetId)
  const isTop = stackIndex >= 0 && stackIndex === sheets.length - 1

  useEffect(() => {
    if (!open) return undefined

    const previousFocus = document.activeElement
    if (activeSheets.length === 0) lockPageScroll()
    activeSheets.push(sheetId)
    subscribers.add(setSheets)
    broadcastSheets()
    setDragOffset(0)
    setDragging(false)
    panelRef.current?.focus({ preventScroll: true })

    return () => {
      subscribers.delete(setSheets)
      const position = activeSheets.lastIndexOf(sheetId)
      if (position !== -1) activeSheets.splice(position, 1)
      broadcastSheets()
      if (activeSheets.length === 0) unlockPageScroll()
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [open, sheetId])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (activeSheets[activeSheets.length - 1] !== sheetId) return

      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault()
        event.stopPropagation()
        onCloseRef.current?.()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = [...(panelRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])]
        .filter((element) => element.getClientRects().length > 0)
      if (focusable.length === 0) {
        event.preventDefault()
        panelRef.current?.focus({ preventScroll: true })
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [open, closeOnEscape, sheetId])

  const stopDrag = () => {
    dragRef.current = null
    setDragging(false)
    setDragOffset(0)
  }

  const onPointerDown = (event) => {
    if (activeSheets[activeSheets.length - 1] !== sheetId) return
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    const handle = event.target.closest?.('[data-sheet-drag-handle]')
    if (!handle && (!swipeAnywhere || event.pointerType === 'mouse')) return

    dragRef.current = {
      id: event.pointerId,
      startY: event.clientY,
      startTime: performance.now(),
      active: false,
    }
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    const distance = Math.max(0, event.clientY - drag.startY)
    if (!drag.active) {
      if (distance < 7) return
      drag.active = true
      setDragging(true)
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }
    setDragOffset(Math.min(distance, window.innerHeight * 0.75))
  }

  const onPointerUp = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    const distance = Math.max(0, event.clientY - drag.startY)
    const elapsed = Math.max(1, performance.now() - drag.startTime)
    const dismiss = drag.active && (distance >= 72 || (distance >= 28 && distance / elapsed >= 0.55))
    stopDrag()
    if (dismiss) onCloseRef.current?.()
  }

  const onPointerCancel = (event) => {
    if (dragRef.current?.id === event.pointerId) stopDrag()
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center overscroll-none"
      style={{
        zIndex: 5000 + Math.max(stackIndex, 0) * 10,
        pointerEvents: isTop ? 'auto' : 'none',
      }}
    >
      <style>{`
        @keyframes shadowSharedSheetEnter {
          from { opacity: 0.7; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .shadow-shared-sheet-enter { animation: none !important; }
          .shadow-shared-sheet-panel { transition: none !important; }
        }
      `}</style>
      <button
        type="button"
        tabIndex={-1}
        aria-label={title || 'Close'}
        className="absolute inset-0 touch-none bg-black/45"
        onClick={() => {
          if (isTop && closeOnBackdrop) onCloseRef.current?.()
        }}
      />
      <div
        className="shadow-shared-sheet-enter relative w-full max-w-[560px]"
        style={{
          maxHeight,
          animation: 'shadowSharedSheetEnter 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <section
          ref={panelRef}
          role="dialog"
          aria-modal={isTop ? 'true' : 'false'}
          aria-label={title || 'Options'}
          tabIndex={-1}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onLostPointerCapture={onPointerCancel}
          className={`shadow-shared-sheet-panel relative flex w-full flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-2xl outline-none ${panelClassName}`}
          style={{
            maxHeight,
            touchAction: swipeAnywhere ? 'none' : undefined,
            transform: `translate3d(0, ${dragOffset}px, 0)`,
            transition: dragging ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        >
          <div
            role="presentation"
            data-sheet-drag-handle=""
            className="flex h-12 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
          >
            <div className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
          </div>
          <div
            className={`min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)] ${contentClassName}`}
          >
            {children}
          </div>
        </section>
      </div>
    </div>,
    document.body
  )
}
