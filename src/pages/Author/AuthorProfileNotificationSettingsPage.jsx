import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { useAuthorPushSettings } from '../../hooks/useAuthorPushSettings'

function NotificationSwitch({ checked, disabled, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="shrink-0 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className={`relative block h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${
        checked ? 'bg-[#111827]' : 'bg-[#D1D6DE]'
      }`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ${
          checked ? 'left-[26px]' : 'left-1'
        }`} />
      </span>
    </button>
  )
}

const TYPES = [
  { key: 'unlock', icon: 'fa-regular fa-gem', background: '#fff3df', color: '#e5a000' },
  { key: 'gift', icon: 'fa-solid fa-gift', background: '#ffe8ed', color: '#e54865' },
  { key: 'comment', icon: 'fa-regular fa-comment', background: '#e7f0ff', color: '#2885e9' },
]

export default function AuthorProfileNotificationSettingsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { preferences, browserEnabled, loading, busy, error, updatePreference, allowBrowser } = useAuthorPushSettings()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile-settings')}
            aria-label={t('authorPushSettings.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" aria-hidden="true" />
          </button>
          <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPushSettings.notification')}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pt-4">
        <section className="flex items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#f0eaff] text-[#7040d8]">
            <i className="fa-regular fa-bell text-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPushSettings.receive')}</h2>
            <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{t('authorPushSettings.receiveHelp')}</p>
          </div>
          <NotificationSwitch
            checked={preferences.master}
            disabled={loading || Boolean(busy)}
            onChange={() => updatePreference('master', !preferences.master)}
            label={t('authorPushSettings.receive')}
          />
        </section>

        {preferences.master && !browserEnabled && !loading ? (
          <button
            type="button"
            onClick={allowBrowser}
            disabled={Boolean(busy)}
            className="mt-3 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-2 text-[11px] font-medium text-[var(--shadow-text-primary)] disabled:opacity-50"
          >
            {t('authorPushSettings.allow')}
          </button>
        ) : null}

        <h2 className="mb-3 mt-7 px-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorPushSettings.types')}</h2>
        <section className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4">
          {TYPES.map((item, index) => (
            <div key={item.key} className={`flex items-center gap-3 py-4 ${index > 0 ? 'border-t border-[var(--shadow-border)]' : ''}`}>
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
                style={{ backgroundColor: item.background, color: item.color }}
              >
                <i className={`${item.icon} text-[18px]`} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t(`authorPushSettings.${item.key}`)}</h3>
                <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{t(`authorPushSettings.${item.key}Help`)}</p>
              </div>
              <NotificationSwitch
  checked={preferences[item.key]}
  disabled={loading || Boolean(busy) || !preferences.master}
  onChange={() => updatePreference(item.key, !preferences[item.key])}
  label={t(`authorPushSettings.${item.key}`)}
/>
            </div>
          ))}
        </section>

        {error ? <p role="alert" className="mt-3 text-[11px] leading-5 text-red-500">{t(`authorPushSettings.${error}`)}</p> : null}
      </main>
    </div>
  )
}
