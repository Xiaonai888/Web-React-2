import { useEffect, useState } from 'react'

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
              ? 'Add Shadow to your Home Screen'
              : 'Bring Shadow closer'}
          </h2>

          <p
            className="mt-1 text-[11.5px] leading-[17px]"
            style={{ color: 'var(--shadow-text-secondary)' }}
          >
            {showIOSHelp
              ? 'Tap Share in your browser, then choose Add to Home Screen.'
              : 'Add Shadow to your device for faster access and a smoother reading experience.'}
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
        <span>{showIOSHelp ? 'Got it' : 'Install Shadow'}</span>
      </button>
    </section>
  )
}
