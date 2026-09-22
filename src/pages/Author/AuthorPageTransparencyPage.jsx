import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('authorPageTransparency', {
  en: { title: 'Page Transparency', created: 'Page created', history: 'Name change history', none: 'No recorded name changes', previous: 'Previous name', current: 'New name', loading: 'Loading...', failed: 'Unable to load Page Transparency', back: 'Back' },
  km: { title: 'ព័ត៌មានតម្លាភាពទំព័រ', created: 'ថ្ងៃបង្កើតទំព័រ', history: 'ប្រវត្តិប្តូរឈ្មោះ', none: 'មិនមានប្រវត្តិប្តូរឈ្មោះដែលបានកត់ត្រា', previous: 'ឈ្មោះចាស់', current: 'ឈ្មោះថ្មី', loading: 'កំពុងផ្ទុក...', failed: 'មិនអាចផ្ទុកព័ត៌មានតម្លាភាពទំព័របានទេ', back: 'ត្រឡប់ក្រោយ' },
  zh: { title: '主页透明度', created: '主页创建日期', history: '名称更改记录', none: '没有已记录的名称更改', previous: '旧名称', current: '新名称', loading: '加载中...', failed: '无法加载主页透明度信息', back: '返回' },
  ja: { title: 'ページの透明性', created: 'ページ作成日', history: '名前の変更履歴', none: '記録された名前の変更はありません', previous: '以前の名前', current: '新しい名前', loading: '読み込み中...', failed: 'ページの透明性情報を読み込めません', back: '戻る' },
  ko: { title: '페이지 투명성', created: '페이지 생성일', history: '이름 변경 내역', none: '기록된 이름 변경이 없습니다', previous: '이전 이름', current: '새 이름', loading: '불러오는 중...', failed: '페이지 투명성 정보를 불러올 수 없습니다', back: '뒤로' },
})

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://shadow-backend-kucw.onrender.com'

const DATE_LOCALES = { en: 'en-US', km: 'km-KH', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

function formatPageDate(value, language) {
  if (!value) return '—'
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return '—'
  return new Intl.DateTimeFormat(DATE_LOCALES[language] || 'en-US', { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

export default function AuthorPageTransparencyPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const { t } = useDisplayTranslation()
  const language = getDisplayLanguageId()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      setData(null)
      try {
        if (!pageUsername) throw new Error('Missing page username')
        const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/transparency`, { signal: controller.signal })
        if (!response.ok) throw new Error('Unable to load page transparency')
        const result = await response.json()
        if (result.ok !== true) throw new Error('Unable to load page transparency')
        if (!controller.signal.aborted) setData(result)
      } catch (caught) {
        if (!controller.signal.aborted) setError(caught.message || 'Unable to load page transparency')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [pageUsername])

  const history = Array.isArray(data?.name_changes) ? data.name_changes : []

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10 text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate(-1)} aria-label={t('authorPageTransparency.back')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-soft)]">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <h1 className="text-[16px] font-semibold">{t('authorPageTransparency.title')}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>
      <main className="mx-auto max-w-[720px] space-y-4 px-4 py-5">
        {loading ? <div className="rounded-2xl bg-[var(--shadow-bg-surface)] p-5">{t('authorPageTransparency.loading')}</div> : null}
        {!loading && error ? <div role="alert" className="rounded-2xl bg-[var(--shadow-bg-surface)] p-5">{t('authorPageTransparency.failed')}</div> : null}
        {!loading && data ? (
          <>
            <section className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
              <h2 className="mb-2 text-[15px] font-semibold">{t('authorPageTransparency.created')}</h2>
              <p className="text-[14px] text-[var(--shadow-text-secondary)]">{formatPageDate(data.page_created_at, language)}</p>
            </section>
            <section className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
              <h2 className="mb-4 text-[15px] font-semibold">{t('authorPageTransparency.history')} ({history.length})</h2>
              {history.length === 0 ? <p className="text-[14px] text-[var(--shadow-text-secondary)]">{t('authorPageTransparency.none')}</p> : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={`${item.changed_at}-${index}`} className="rounded-xl bg-[var(--shadow-bg-soft)] p-3">
                      <p className="mb-3 text-[12px] text-[var(--shadow-text-tertiary)]">{formatPageDate(item.changed_at, language)}</p>
                      <p className="break-words text-[13px]"><span className="text-[var(--shadow-text-secondary)]">{t('authorPageTransparency.previous')}: </span>{item.old_name}</p>
                      <p className="mt-2 break-words text-[13px]"><span className="text-[var(--shadow-text-secondary)]">{t('authorPageTransparency.current')}: </span>{item.new_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
