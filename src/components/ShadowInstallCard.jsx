import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shadowInstallCard', {
  en: {
    iosTitle: 'Add Shadow to your Home Screen',
    title: 'Bring Shadow closer',
    iosDescription: 'Tap Share in your browser, then choose Add to Home Screen.',
    description: 'Add Shadow to your device for faster access and a smoother reading experience.',
    gotIt: 'Got it',
    install: 'Install Shadow',
  },
  km: {
    iosTitle: 'បន្ថែម Shadow ទៅអេក្រង់ដើម',
    title: 'នាំ Shadow មកកាន់តែជិតអ្នក',
    iosDescription: 'ចុច Share ក្នុង browser របស់អ្នក បន្ទាប់មកជ្រើស Add to Home Screen។',
    description: 'បន្ថែម Shadow ទៅឧបករណ៍របស់អ្នក ដើម្បីចូលប្រើបានលឿន និងអានបានរលូនជាងមុន។',
    gotIt: 'យល់ហើយ',
    install: 'ដំឡើង Shadow',
  },
  zh: {
    iosTitle: '将 Shadow 添加到主屏幕',
    title: '让 Shadow 离你更近',
    iosDescription: '在浏览器中点击“分享”，然后选择“添加到主屏幕”。',
    description: '将 Shadow 添加到你的设备，以便更快访问并获得更流畅的阅读体验。',
    gotIt: '知道了',
    install: '安装 Shadow',
  },
  ja: {
    iosTitle: 'Shadow をホーム画面に追加',
    title: 'Shadow をもっと身近に',
    iosDescription: 'ブラウザで共有をタップし、「ホーム画面に追加」を選択してください。',
    description: 'Shadow を端末に追加して、より速くアクセスし、快適に読書を楽しめます。',
    gotIt: '了解',
    install: 'Shadow をインストール',
  },
  ko: {
    iosTitle: 'Shadow를 홈 화면에 추가',
    title: 'Shadow를 더 가까이',
    iosDescription: '브라우저에서 공유를 누른 다음 홈 화면에 추가를 선택하세요.',
    description: 'Shadow를 기기에 추가해 더 빠르게 접속하고 더 부드럽게 읽어보세요.',
    gotIt: '확인',
    install: 'Shadow 설치',
  },
})

const DISMISS_KEY = 'shadow_install_card_dismissed_at'
const SNOOZE_KEY = 'shadow_install_card_snooze_until'
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function isIOS() {
  const userAgent = window.navigator.userAgent || ''

  return (
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (window.navigator.platform === 'MacIntel' &&
      window.navigator.maxTouchPoints > 1)
  )
}

function isHiddenByPreference() {
  const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0)
  const snoozeUntil = Number(localStorage.getItem(SNOOZE_KEY) || 0)

  return (
    (dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_MS) ||
    snoozeUntil > Date.now()
  )
}

export default function ShadowInstallCard() {
  const { t } = useDisplayTranslation()
  const [visible, setVisible] = useState(false)
  const [showIOSHelp, setShowIOSHelp] = useState(false)

  useEffect(() => {
    if (isStandalone() || isHiddenByPreference()) return

    const syncAvailability = () => {
      if (isStandalone()) {
        setVisible(false)
        return
      }

      setVisible(Boolean(window.__shadowInstallPrompt) || isIOS())
    }

    const handleInstalled = () => {
      window.__shadowInstallPrompt = null
      localStorage.removeItem(SNOOZE_KEY)
      setVisible(false)
    }

    syncAvailability()
    window.addEventListener('shadow-install-ready', syncAvailability)
    window.addEventListener('shadow-app-installed', handleInstalled)

    return () => {
      window.removeEventListener('shadow-install-ready', syncAvailability)
      window.removeEventListener('shadow-app-installed', handleInstalled)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setVisible(false)
  }

  const handleInstall = async () => {
    const promptEvent = window.__shadowInstallPrompt

    if (!promptEvent) {
      if (isIOS()) setShowIOSHelp(true)
      return
    }

    window.__shadowInstallPrompt = null

    try {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice

      if (choice?.outcome === 'accepted') {
        setVisible(false)
        return
      }

      localStorage.setItem(
        SNOOZE_KEY,
        String(Date.now() + SNOOZE_MS)
      )
      setVisible(false)
    } catch {
      setVisible(false)
    }
  }

  if (!visible) return null

  return (
    <section
      className="app-card mt-3 rounded-[18px] border p-4"
      style={{ boxShadow: 'var(--shadow-shadow)' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: 'var(--shadow-bg-soft)' }}
        >
          <img
            src="/assets/Icons/Shadow%20Logo.svg"
            alt="Shadow"
            className="h-9 w-9 object-contain"
          />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h2
            className="text-[15px] font-extrabold leading-5"
            style={{ color: 'var(--shadow-text-primary)' }}
          >
            {showIOSHelp
              ? t('shadowInstallCard.iosTitle')
              : t('shadowInstallCard.title')}
          </h2>

          <p
            className="mt-1 text-[11.5px] leading-[17px]"
            style={{ color: 'var(--shadow-text-secondary)' }}
          >
            {showIOSHelp
              ? t('shadowInstallCard.iosDescription')
              : t('shadowInstallCard.description')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close install suggestion"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full active:scale-95"
          style={{ color: 'var(--shadow-icon)' }}
        >
          <i className="fa-solid fa-xmark text-[16px]" />
        </button>
      </div>

      <button
        type="button"
        onClick={showIOSHelp ? handleDismiss : handleInstall}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[12px] px-4 text-[12px] font-bold active:scale-[0.99]"
        style={{
          background: 'var(--shadow-text-primary)',
          color: 'var(--shadow-bg-page)',
        }}
      >
        <i
          className={`fa-solid ${
            showIOSHelp ? 'fa-check' : 'fa-arrow-down'
          } text-[11px]`}
        />
        <span>
          {showIOSHelp
            ? t('shadowInstallCard.gotIt')
            : t('shadowInstallCard.install')}
        </span>
      </button>
    </section>
  )
}
