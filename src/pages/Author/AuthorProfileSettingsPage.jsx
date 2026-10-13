import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'

export default function AuthorProfileSettingsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile')}
            aria-label={t('authorPushSettings.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" aria-hidden="true" />
          </button>
          <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPushSettings.settings')}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate('/author/profile-settings/notifications')}
          className="flex w-full items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#f0eaff] text-[#7040d8]">
            <i className="fa-regular fa-bell text-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPushSettings.notification')}</span>
            <span className="mt-1 block text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{t('authorPushSettings.notificationHelp')}</span>
          </span>
        </button>
      </main>
    </div>
  )
}
