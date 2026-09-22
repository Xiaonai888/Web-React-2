import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('appPage', {
  en: { back: 'Back', app: 'App', shadowStudio: 'Shadow Studio', open: 'Open', disabled: 'Unavailable', loading: 'Loading apps…', failed: 'Could not load app settings. Please try again.', retry: 'Retry', empty: 'No apps available.' },
  km: { back: 'ត្រឡប់ក្រោយ', app: 'កម្មវិធី', shadowStudio: 'Shadow Studio', open: 'បើក', disabled: 'មិនអាចប្រើបាន', loading: 'កំពុងផ្ទុកកម្មវិធី…', failed: 'មិនអាចផ្ទុកការកំណត់កម្មវិធីបានទេ។ សូមព្យាយាមម្ដងទៀត។', retry: 'ព្យាយាមម្ដងទៀត', empty: 'មិនមានកម្មវិធីសម្រាប់បង្ហាញទេ។' },
  zh: { back: '返回', app: '应用', shadowStudio: 'Shadow Studio', open: '打开', disabled: '暂不可用', loading: '正在加载应用…', failed: '无法加载应用设置，请重试。', retry: '重试', empty: '暂无可用应用。' },
  ja: { back: '戻る', app: 'アプリ', shadowStudio: 'Shadow Studio', open: '開く', disabled: '利用できません', loading: 'アプリを読み込み中…', failed: 'アプリの設定を読み込めませんでした。再試行してください。', retry: '再試行', empty: '利用できるアプリがありません。' },
  ko: { back: '뒤로 가기', app: '앱', shadowStudio: 'Shadow Studio', open: '열기', disabled: '사용 불가', loading: '앱 불러오는 중…', failed: '앱 설정을 불러올 수 없습니다. 다시 시도해 주세요.', retry: '다시 시도', empty: '표시할 앱이 없습니다.' },
})

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const CACHE_KEY = 'shadow-public-app-settings-v1'
const CACHE_MS = 30_000
const apps = [
  { key: 'shadow-studio', nameKey: 'shadowStudio', name: 'Shadow Studio', icon: 'fa-solid fa-palette', path: '/apps/shadow-studio' },
  { key: 'shadow-docs', name: 'Shadow Docs', icon: 'fa-solid fa-book-open', path: '/apps/shadow-docs' },
]

function readCachedApps() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (cached && Date.now() - cached.savedAt < CACHE_MS && Array.isArray(cached.apps)) return cached.apps
  } catch {
    return null
  }
  return null
}

export default function AppPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [settings, setSettings] = useState(readCachedApps)
  const [loading, setLoading] = useState(!settings)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const cached = readCachedApps()
    if (cached && !retry) {
      setSettings(cached)
      setLoading(false)
      return
    }
    let live = true
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12_000)
    setLoading(true)
    setError(false)
    fetch(`${API_BASE_URL}/api/public/apps`, { signal: controller.signal, cache: 'no-cache' })
      .then(async response => {
        if (!response.ok) throw new Error('App settings unavailable')
        const data = await response.json()
        if (data.ok !== true || !Array.isArray(data.apps)) throw new Error('Invalid app settings')
        const valid = data.apps.filter(item => item && typeof item.appKey === 'string' && typeof item.hidden === 'boolean' && typeof item.disabled === 'boolean')
        if (valid.length !== data.apps.length) throw new Error('Invalid app settings')
        return valid
      })
      .then(items => {
        if (!live) return
        setSettings(items)
        setError(false)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), apps: items })) } catch {}
      })
      .catch(() => {
        if (!live) return
        setSettings(null)
        setError(true)
        try { sessionStorage.removeItem(CACHE_KEY) } catch {}
      })
      .finally(() => {
        clearTimeout(timeout)
        if (live) setLoading(false)
      })
    return () => { live = false; clearTimeout(timeout); controller.abort() }
  }, [retry])

  const visibleApps = apps.map(app => ({ ...app, remote: settings?.find(item => item.appKey === app.key) })).filter(app => app.remote && !app.remote.hidden)

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-20 border-b border-[#eeeeee] bg-white dark:border-white/10 dark:bg-[#171923]">
        <div className="mx-auto grid h-14 max-w-5xl grid-cols-[40px_1fr_40px] items-center px-3">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95 dark:text-white" aria-label={t('appPage.back')}>
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h1 className="text-center text-[16px] font-semibold text-[#111827] dark:text-white">{t('appPage.app')}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-5">
        {loading && !settings ? <p role="status" className="py-8 text-center text-sm text-[#6b7280] dark:text-white/65">{t('appPage.loading')}</p> : null}
        {!loading && error ? <div className="flex flex-col items-center gap-3 py-8 text-center"><p role="alert" className="text-sm text-[#6b7280] dark:text-white/65">{t('appPage.failed')}</p><button type="button" onClick={() => setRetry(value => value + 1)} className="rounded-xl bg-[#7351b9] px-5 py-2.5 text-sm font-semibold text-white">{t('appPage.retry')}</button></div> : null}
        {!loading && !error && settings && !visibleApps.length ? <p className="py-8 text-center text-sm text-[#6b7280] dark:text-white/65">{t('appPage.empty')}</p> : null}
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 lg:grid-cols-6">
          {!error && visibleApps.map(app => (
            <button type="button" key={app.key} disabled={app.remote.disabled} onClick={() => navigate(app.path)} className="min-w-0 text-left active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#f1f2f5] shadow-sm ring-1 ring-black/[0.06] dark:bg-[#171923] dark:ring-white/10">
                {app.remote.profile ? <img src={app.remote.profile} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /> : <div className="absolute inset-0 flex items-center justify-center text-[#374151] dark:text-white/85"><i className={`${app.icon} text-[42px] sm:text-[48px]`} /></div>}
              </div>
              <div className="mt-2 truncate px-0.5 text-[14px] font-semibold text-[#111827] dark:text-white sm:text-[15px]">{app.remote.name || app.name || t(`appPage.${app.nameKey}`)}</div>
              <div className="mt-0.5 px-0.5 text-[10px] font-medium text-[#8b93a1] dark:text-white/50 sm:text-[11px]">{t(app.remote.disabled ? 'appPage.disabled' : 'appPage.open')}</div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
