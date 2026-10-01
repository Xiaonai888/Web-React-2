import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('premiumSubscribeSoon', {
  en: { comingSoon: 'Coming soon' },
  km: { comingSoon: 'មកដល់ឆាប់ៗនេះ' },
  zh: { comingSoon: '即将推出' },
  ja: { comingSoon: '近日公開' },
  ko: { comingSoon: '곧 출시됩니다' },
})

export default function PremiumSubscribeSoon({ label }) {
  const { t } = useDisplayTranslation()
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const timersRef = useRef([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const showComingSoon = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    setVisible(true)
    setLeaving(false)

    timersRef.current = [
      window.setTimeout(() => setLeaving(true), 1200),
      window.setTimeout(() => setVisible(false), 1700),
    ]
  }

  return (
    <>
      <button
        type="button"
        onClick={showComingSoon}
        className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffd500] to-[#ffad0a] text-[20px] font-semibold text-[#282828] shadow-[0_7px_18px_rgba(255,180,0,0.18)] active:scale-[0.99]"
      >
        {label}
      </button>

      {visible ? (
        <div
          className={`pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+28px)] left-1/2 z-[200000] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#202124]/95 px-5 py-3 text-[14px] font-semibold text-white shadow-xl transition-all duration-500 dark:bg-white dark:text-[#202124] ${
            leaving ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
          }`}
          role="status"
          aria-live="polite"
        >
          <i className="fa-regular fa-clock text-[14px]" />
          <span>{t('premiumSubscribeSoon.comingSoon')}</span>
        </div>
      ) : null}
    </>
  )
}
