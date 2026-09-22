import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('appPage', {
  en: { back: 'Back', app: 'App', shadowStudio: 'Shadow Studio', open: 'Open' },
  km: { back: 'ត្រឡប់ក្រោយ', app: 'កម្មវិធី', shadowStudio: 'Shadow Studio', open: 'បើក' },
  zh: { back: '返回', app: '应用', shadowStudio: 'Shadow Studio', open: '打开' },
  ja: { back: '戻る', app: 'アプリ', shadowStudio: 'Shadow Studio', open: '開く' },
  ko: { back: '뒤로 가기', app: '앱', shadowStudio: 'Shadow Studio', open: '열기' },
})

const apps = [
  {
    key: 'shadow-studio',
    nameKey: 'shadowStudio',
    icon: 'fa-solid fa-palette',
    path: '/apps/shadow-studio',
  },
  {
    key: 'shadow-docs',
    name: 'Shadow Docs',
    icon: 'fa-solid fa-book-open',
    path: '/apps/shadow-docs',
  },
]

export default function AppPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-20 border-b border-[#eeeeee] bg-white dark:border-white/10 dark:bg-[#171923]">
        <div className="mx-auto grid h-14 max-w-5xl grid-cols-[40px_1fr_40px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95 dark:text-white"
            aria-label={t('appPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-center text-[16px] font-semibold text-[#111827] dark:text-white">
            {t('appPage.app')}
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 lg:grid-cols-6">
          {apps.map((app) => (
            <button
              type="button"
              key={app.key}
              onClick={() => navigate(app.path)}
              className="min-w-0 text-left active:scale-[0.98]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#f1f2f5] shadow-sm ring-1 ring-black/[0.06] dark:bg-[#171923] dark:ring-white/10">
                <div className="absolute inset-0 flex items-center justify-center text-[#374151] dark:text-white/85">
                  <i className={`${app.icon} text-[42px] sm:text-[48px]`} />
                </div>
              </div>

              <div className="mt-2 truncate px-0.5 text-[14px] font-semibold text-[#111827] dark:text-white sm:text-[15px]">
                {app.name || t(`appPage.${app.nameKey}`)}
              </div>

              <div className="mt-0.5 px-0.5 text-[10px] font-medium text-[#8b93a1] dark:text-white/50 sm:text-[11px]">
                {t('appPage.open')}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
