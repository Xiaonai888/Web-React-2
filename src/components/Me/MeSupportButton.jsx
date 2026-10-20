import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('meSupport', {
  en: { support: 'Support', title: 'Contact us', close: 'Close support', facebook: 'Facebook Page', telegram: 'Telegram' },
  km: { support: 'ជំនួយ', title: 'ទំនាក់ទំនង', close: 'បិទជំនួយ', facebook: 'ទំព័រ Facebook', telegram: 'Telegram' },
  zh: { support: '帮助', title: '联系我们', close: '关闭帮助', facebook: 'Facebook 主页', telegram: 'Telegram' },
  ja: { support: 'サポート', title: 'お問い合わせ', close: 'サポートを閉じる', facebook: 'Facebookページ', telegram: 'Telegram' },
  ko: { support: '고객 지원', title: '문의하기', close: '고객 지원 닫기', facebook: 'Facebook 페이지', telegram: 'Telegram' },
})

export default function MeSupportButton() {
  const { t } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const titleId = useId()
  const dialogId = useId()

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = dialogRef.current
    const focusable = () => Array.from(dialog.querySelectorAll('a[href], button:not([disabled])'))
    focusable()[0]?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
      if (event.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  const contacts = [
    { name: 'ប្រលោមលោកស្នេហា', label: t('meSupport.facebook'), href: 'https://web.facebook.com/AlphaCentauri12226/', icon: 'fa-brands fa-facebook-f', color: '#1877F2' },
    { name: 'Shadow Admin', label: t('meSupport.telegram'), href: 'https://t.me/Shadow12226', icon: 'fa-brands fa-telegram', color: '#229ED9' },
  ]

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('meSupport.support')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#1f2430] active:scale-95 dark:bg-[#202331] dark:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
          <rect x="3" y="11" width="4" height="8" rx="2" />
          <rect x="17" y="11" width="4" height="8" rx="2" />
          <path d="M19 19a3 3 0 0 1-3 3h-3" />
          <path d="M11 22h2" />
        </svg>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-end justify-center">
          <div className="absolute inset-0 bg-[var(--shadow-overlay)]" onClick={() => setOpen(false)} aria-hidden="true" />
          <section
            ref={dialogRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[85dvh] w-full max-w-[560px] overflow-y-auto rounded-t-[26px] border border-b-0 border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 pt-3 text-[var(--shadow-text-primary)]"
            style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" aria-hidden="true" />
            <div className="mb-4 mt-3 flex items-center justify-between gap-3">
              <h2 id={titleId} className="text-[18px] font-bold">{t('meSupport.title')}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={t('meSupport.close')} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-hover)] active:scale-95">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)]">
              {contacts.map((contact, index) => (
                <a
                  key={contact.href}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`flex min-h-[82px] items-center gap-3 px-4 py-4 hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-soft)] ${index ? 'border-t border-[var(--shadow-border)]' : ''}`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: contact.color }}>
                    <i className={`${contact.icon} text-[24px]`} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-[15px] font-semibold leading-6">{contact.name}</span>
                    <span className="mt-0.5 block text-[12px] text-[var(--shadow-text-secondary)]">{contact.label}</span>
                  </span>
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-[var(--shadow-text-tertiary)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  )
}
