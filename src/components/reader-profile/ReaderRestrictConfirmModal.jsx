import { useEffect, useRef } from 'react'
import ReaderBlockAvatar from './ReaderBlockAvatar'

export default function ReaderRestrictConfirmModal({
  target,
  shouldRestrict,
  onConfirm,
  onCancel,
  busy = false,
  error = '',
  t,
}) {
  const cancelRef = useRef(null)
  const busyRef = useRef(busy)
  const cancelHandler = useRef(onCancel)
  busyRef.current = busy
  cancelHandler.current = onCancel

  useEffect(() => {
    if (!target) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busyRef.current) cancelHandler.current?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [target])

  if (!target) return null

  const name = String(target.name || target.username || '')
  const title = t(shouldRestrict ? 'readerManageRestrictions.restrictTitle' : 'readerManageRestrictions.unrestrictTitle', { name })
  const description = t(shouldRestrict ? 'readerManageRestrictions.restrictQuestion' : 'readerManageRestrictions.unrestrictQuestion', { name })
  const action = t(shouldRestrict ? 'readerManageRestrictions.restrict' : 'readerManageRestrictions.unrestrict')

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center bg-black/60 px-5" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="reader-restrict-confirm-title" aria-describedby="reader-restrict-confirm-desc" className="w-full max-w-[360px] rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 pb-5 pt-6 text-center text-[var(--shadow-text-primary)]">
        <div className="flex justify-center">
          <ReaderBlockAvatar name={name} src={target.avatar_url} size="lg" />
        </div>
        <h2 id="reader-restrict-confirm-title" className="mt-3 text-[16px] font-semibold">{title}</h2>
        <p id="reader-restrict-confirm-desc" className="mt-2 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{description}</p>
        {error ? <p role="alert" className="mt-3 text-[12px] text-[#ef5675]">{error}</p> : null}
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={onConfirm} disabled={busy} className={`min-h-10 rounded-full px-4 text-[13px] font-semibold disabled:opacity-60 ${shouldRestrict ? 'bg-[#7c5ac5] text-white' : 'border border-[#ef5675] text-[#ef5675]'}`}>
            {busy ? t('readerManageRestrictions.saving') : action}
          </button>
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy} className="min-h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] text-[var(--shadow-text-primary)] disabled:opacity-60">
            {t('readerManageRestrictions.cancel')}
          </button>
        </div>
      </section>
    </div>
  )
}
