import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { LockKeyhole, X } from 'lucide-react'

const DIAMOND_ICON_URL = '/assets/Icons/Diamond.svg'

function formatDiamonds(value) {
  return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function SpecialPromotionCheckoutSheet({
  quote,
  busy = false,
  error = '',
  needsTopUp = false,
  labels,
  onClose,
  onConfirm,
  onTopUp,
}) {
  const active = Boolean(quote)
  const closeRef = useRef(null)
  const sheetRef = useRef(null)
  const closeHandlerRef = useRef(onClose)
  const busyRef = useRef(busy)
  useEffect(() => {
    closeHandlerRef.current = onClose
  }, [onClose])

  useEffect(() => {
    busyRef.current = busy
  }, [busy])

  useLayoutEffect(() => {
    if (!active) return undefined
    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('root')
    const previousHtmlOverflow = html.style.overflow
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverscroll = html.style.overscrollBehavior
    const previousBodyOverscroll = body.style.overscrollBehavior
    const previousRootInert = root?.inert
    const previouslyFocused = document.activeElement

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
    if (root) root.inert = true
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (!busyRef.current) {
          event.preventDefault()
          closeHandlerRef.current?.()
        }
        return
      }
      if (event.key !== 'Tab' || !sheetRef.current) return
      const focusable = Array.from(sheetRef.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      html.style.overflow = previousHtmlOverflow
      body.style.overflow = previousBodyOverflow
      html.style.overscrollBehavior = previousHtmlOverscroll
      body.style.overscrollBehavior = previousBodyOverscroll
      if (root) root.inert = previousRootInert
      if (previouslyFocused?.isConnected) previouslyFocused.focus?.()
    }
  }, [active])

  if (!quote) return null

  return createPortal(
    <div className="fixed inset-0 z-[2147483000] flex items-end justify-center bg-black/50 overscroll-none sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={labels.title}>
      <button type="button" aria-label={labels.close} className="absolute inset-0 cursor-default" onClick={onClose} disabled={busy} tabIndex={-1} />
      <div ref={sheetRef} className="relative z-10 max-h-[100dvh] w-full min-w-0 max-w-none overflow-y-auto overscroll-contain rounded-t-[22px] bg-white px-5 pb-7 pt-5 text-[#25142f] shadow-2xl dark:bg-[#241d2b] dark:text-white sm:max-h-[calc(100dvh-40px)] sm:max-w-[410px] sm:rounded-[22px] sm:pb-5" style={{ paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[16px] font-extrabold leading-snug">{labels.title}</h2>
          <button ref={closeRef} type="button" aria-label={labels.close} onClick={onClose} disabled={busy} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-40 dark:bg-white/10 dark:text-white">
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-3 text-[14px] font-bold leading-relaxed">{quote.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-gray-500 dark:text-white/60">{labels.description}</p>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1 text-[12px] text-gray-400 line-through dark:text-white/40">
              <img src={DIAMOND_ICON_URL} alt="" aria-hidden="true" className="h-3.5 w-3.5 object-contain opacity-70" />
              {formatDiamonds(quote.originalPrice)}
            </span>
            <span className="rounded-lg bg-red-600 px-2 py-1 text-[11px] font-extrabold text-white">-50%</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[22px] font-black">
            <img src={DIAMOND_ICON_URL} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
            {formatDiamonds(quote.price)}
            <span className="ml-auto text-[11px] font-semibold text-gray-500 dark:text-white/60">
              <LockKeyhole size={12} className="mr-1 inline" aria-hidden="true" />
              {quote.count}
            </span>
          </div>
        </div>
        {error ? <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700 dark:bg-red-950/40 dark:text-red-200" role="alert">{error}</p> : null}
        {needsTopUp ? (
          <button type="button" onClick={onTopUp} disabled={busy} className="mt-3 w-full rounded-full border border-[#d6a343] bg-white px-3 py-2.5 text-[12px] font-bold text-[#25142f] disabled:opacity-50 dark:bg-white/10 dark:text-white">
            {labels.topUp}
          </button>
        ) : null}
        <div className="mt-5 flex gap-2.5">
          <button type="button" onClick={onClose} disabled={busy} className="flex-1 rounded-full border border-gray-200 px-3 py-3 text-[12px] font-bold disabled:opacity-50 dark:border-white/20">{labels.cancel}</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="flex-[1.4] rounded-full border-[1.5px] border-[#d6a343] bg-[#101010] px-3 py-3 text-[12px] font-bold text-white disabled:opacity-50">
            {busy ? labels.processing : labels.confirm}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
