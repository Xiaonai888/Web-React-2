import { X } from 'lucide-react'

export default function ShadowStudioContentFeedback({ error = '', notice = '', onDismiss }) {
  const message = error || notice
  if (!message) return null
  return <div role={error ? 'alert' : 'status'} className={`mx-auto flex w-full max-w-[980px] items-start gap-3 rounded-xl border px-4 py-3 text-xs ${error ? 'border-[var(--shadow-danger)] text-[var(--shadow-danger)]' : 'border-[var(--shadow-border)] text-[var(--shadow-text-primary)]'}`}>
    <span className="min-w-0 flex-1 break-words">{message}</span>
    {typeof onDismiss === 'function' ? <button type="button" onClick={onDismiss} aria-label="Dismiss message"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]">
      <X size={15} aria-hidden="true" />
    </button> : null}
  </div>
}
