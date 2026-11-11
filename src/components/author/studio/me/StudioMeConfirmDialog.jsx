import { useEffect, useId, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function StudioMeConfirmDialog({
  open = false,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  pending = false,
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId()
  const messageId = useId()
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    confirmRef.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape' && !pending) {
        event.preventDefault()
        onCancel?.()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
    }
  }, [open, pending, onCancel])

  if (!open) return null

  return <div className="fixed inset-0 z-[101000] flex items-center justify-center px-4 py-5">
    <button type="button" className="absolute inset-0 bg-black/65" aria-label={cancelLabel}
      disabled={pending} onClick={() => onCancel?.()} />
    <section role={destructive ? 'alertdialog' : 'dialog'} aria-modal="true"
      aria-labelledby={titleId} aria-describedby={messageId}
      className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated,var(--shadow-bg-surface))] p-5 text-[var(--shadow-text-primary)] shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {destructive ? <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] text-[var(--shadow-danger)]"><AlertTriangle size={21} /></span> : null}
          <h2 id={titleId} className="min-w-0 text-base font-bold leading-6 sm:text-lg">{title}</h2>
        </div>
        <button type="button" disabled={pending} onClick={() => onCancel?.()}
          aria-label={cancelLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-soft)] disabled:opacity-50"><X size={20}/></button>
      </div>
      <p id={messageId} className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--shadow-text-secondary)]">{message}</p>
      <div className="mt-6 flex items-center justify-end gap-2.5">
        <button type="button" disabled={pending} onClick={() => onCancel?.()}
          className="min-h-11 rounded-xl border border-[var(--shadow-border)] px-4 text-sm font-semibold disabled:opacity-50">{cancelLabel}</button>
        <button type="button" ref={confirmRef} disabled={pending || typeof onConfirm !== 'function'}
          onClick={() => onConfirm?.()}
          className={`min-h-11 rounded-xl px-4 text-sm font-semibold disabled:opacity-50 ${destructive
            ? 'bg-[var(--shadow-danger)] text-white'
            : 'bg-[var(--shadow-accent)] text-[var(--shadow-accent-text)]'}`}>{confirmLabel}</button>
      </div>
    </section>
  </div>
}
