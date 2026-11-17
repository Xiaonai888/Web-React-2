import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('readerProfilePhotoSheet', {
  en: {
    title: 'Profile picture',
    upload: 'Upload Profile',
    view: 'See profile picture',
    choose: 'Choose profile picture',
  },
  km: {
    title: 'រូបប្រវត្តិរូប',
    upload: 'បង្ហោះរូប Profile',
    view: 'មើលរូបប្រវត្តិរូប',
    choose: 'ជ្រើសរូបប្រវត្តិរូប',
  },
  zh: {
    title: '头像',
    upload: '上传头像',
    view: '查看头像',
    choose: '选择头像',
  },
  ja: {
    title: 'プロフィール写真',
    upload: 'プロフィール写真をアップロード',
    view: 'プロフィール写真を見る',
    choose: 'プロフィール写真を選ぶ',
  },
  ko: {
    title: '프로필 사진',
    upload: '프로필 사진 업로드',
    view: '프로필 사진 보기',
    choose: '프로필 사진 선택',
  },
})

const ACTIONS = [
  { key: 'upload', icon: 'fa-solid fa-cloud-arrow-up' },
  { key: 'view', icon: 'fa-solid fa-circle-user' },
  { key: 'choose', icon: 'fa-regular fa-image' },
]

export default function ReaderProfilePhotoSheet({
  open,
  onClose,
  onSelect,
  enabledActions = ['upload', 'view', 'choose'],
}) {
  const { t } = useDisplayTranslation()
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)
  const closeRef = useRef(onClose)
  const gestureRef = useRef(null)
  const closeTimerRef = useRef(null)
  const clickTimerRef = useRef(null)
  const closingRef = useRef(false)
  const suppressClickRef = useRef(false)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  closeRef.current = onClose

  const dismiss = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setDragging(false)
    setClosing(true)
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => closeRef.current?.(), 240)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const body = document.body
    const html = document.documentElement
    const scrollY = window.scrollY
    const original = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
    }

    previousFocusRef.current = document.activeElement
    gestureRef.current = null
    closingRef.current = false
    suppressClickRef.current = false
    setVisible(false)
    setClosing(false)
    setDragging(false)
    setDragOffset(0)

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'
    html.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'

    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setVisible(true))
    })

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        dismiss()
        return
      }
      if (event.key !== 'Tab') return
      const buttons = [...(panelRef.current?.querySelectorAll('button:not([disabled])') || [])]
      if (!buttons.length) return
      if (event.shiftKey && document.activeElement === buttons[0]) {
        event.preventDefault()
        buttons[buttons.length - 1].focus()
      } else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) {
        event.preventDefault()
        buttons[0].focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus({ preventScroll: true })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.cancelAnimationFrame(firstFrame)
      window.clearTimeout(closeTimerRef.current)
      window.clearTimeout(clickTimerRef.current)
      body.style.position = original.bodyPosition
      body.style.top = original.bodyTop
      body.style.left = original.bodyLeft
      body.style.right = original.bodyRight
      body.style.width = original.bodyWidth
      body.style.overflow = original.bodyOverflow
      body.style.overscrollBehavior = original.bodyOverscroll
      html.style.overflow = original.htmlOverflow
      html.style.overscrollBehavior = original.htmlOverscroll
      window.scrollTo(0, scrollY)
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus?.({ preventScroll: true })
      }
    }
  }, [open, dismiss])

  useEffect(() => {
    if (!open) return undefined

    function onPointerMove(event) {
      const gesture = gestureRef.current
      if (!gesture || gesture.id !== event.pointerId || closingRef.current) return
      gesture.lastY = event.clientY
      const distance = event.clientY - gesture.startY
      if (!gesture.active) {
        if (distance < 8) return
        gesture.active = true
        setDragging(true)
      }
      setDragOffset(Math.min(Math.max(0, distance), window.innerHeight * 0.85))
    }

    function onPointerEnd(event) {
      const gesture = gestureRef.current
      if (!gesture || gesture.id !== event.pointerId) return
      gestureRef.current = null
      const distance = Math.max(0, gesture.lastY - gesture.startY, event.clientY - gesture.startY)
      const elapsed = Math.max(1, performance.now() - gesture.startTime)
      if (gesture.active) {
        suppressClickRef.current = true
        window.clearTimeout(clickTimerRef.current)
        clickTimerRef.current = window.setTimeout(() => {
          suppressClickRef.current = false
        }, 350)
      }
      if (gesture.active && (distance >= 65 || (distance >= 28 && distance / elapsed >= 0.5))) {
        dismiss()
        return
      }
      setDragging(false)
      setDragOffset(0)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerEnd)
    window.addEventListener('pointercancel', onPointerEnd)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerEnd)
      window.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [open, dismiss])

  function onPointerDown(event) {
    if (closingRef.current || !event.isPrimary) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    gestureRef.current = {
      id: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      startTime: performance.now(),
      active: false,
    }
  }

  function onClickCapture(event) {
    if (!suppressClickRef.current && !closingRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[5000] flex items-end justify-center overscroll-none">
      <button
        type="button"
        tabIndex={-1}
        aria-label={t('readerProfilePhotoSheet.title')}
        onClick={dismiss}
        className="absolute inset-0 bg-black/45"
        style={{ opacity: visible && !closing ? 1 : 0, transition: 'opacity 230ms ease' }}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('readerProfilePhotoSheet.title')}
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        className="relative w-full max-w-[560px] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-2xl outline-none"
        style={{
          maxHeight: '88dvh',
          touchAction: 'none',
          transform: closing || !visible ? 'translate3d(0, 100%, 0)' : `translate3d(0, ${dragOffset}px, 0)`,
          transition: dragging ? 'none' : 'transform 230ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <div className="flex h-12 cursor-grab select-none items-center justify-center active:cursor-grabbing">
          <div className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        </div>
        <div className="overflow-y-auto overscroll-contain px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          {ACTIONS.map(({ key, icon }) => (
            <button
              key={key}
              type="button"
              disabled={closing || !onSelect || !enabledActions.includes(key)}
              onClick={() => onSelect?.(key)}
              className="flex min-h-[64px] w-full items-center gap-4 rounded-xl px-1 text-left text-[16px] text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)] disabled:opacity-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
                <i className={`${icon} text-[18px]`} aria-hidden="true" />
              </span>
              <span>{t(`readerProfilePhotoSheet.${key}`)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>,
    document.body
  )
}
