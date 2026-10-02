import { useEffect, useState } from 'react'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'

registerTranslationNamespace('authorPageTransparencyPopup', {
  en: {
    title: 'Page history & transparency',
    intro: 'This information helps readers understand how this Author Page has changed over time.',
    history: 'History',
    created: 'Page created',
    nameChanges: 'Page name changes',
    none: 'This Page has not changed its name.',
    previous: 'Previous name',
    current: 'New name',
    loading: 'Loading...',
    failed: 'Unable to load Page history.',
    back: 'Back',
    close: 'Close',
  },
  km: {
    title: 'ប្រវត្តិ និងព័ត៌មានតម្លាភាពទំព័រ',
    intro: 'ព័ត៌មាននេះជួយឱ្យអ្នកអានយល់ពីការផ្លាស់ប្តូររបស់ទំព័រអ្នកនិពន្ធនេះតាមពេលវេលា។',
    history: 'ប្រវត្តិទំព័រ',
    created: 'បានបង្កើតទំព័រ',
    nameChanges: 'ការប្តូរឈ្មោះទំព័រ',
    none: 'ទំព័រនេះមិនទាន់មានប្រវត្តិប្តូរឈ្មោះទេ។',
    previous: 'ឈ្មោះចាស់',
    current: 'ឈ្មោះថ្មី',
    loading: 'កំពុងផ្ទុក...',
    failed: 'មិនអាចផ្ទុកប្រវត្តិទំព័របានទេ។',
    back: 'ត្រឡប់ក្រោយ',
    close: 'បិទ',
  },
  zh: {
    title: '主页历史与透明度',
    intro: '这些信息可帮助读者了解此作者主页随时间发生的变化。',
    history: '主页历史',
    created: '主页已创建',
    nameChanges: '主页名称更改',
    none: '此主页尚未更改名称。',
    previous: '旧名称',
    current: '新名称',
    loading: '加载中...',
    failed: '无法加载主页历史。',
    back: '返回',
    close: '关闭',
  },
  ja: {
    title: 'ページ履歴と透明性',
    intro: 'この情報は、作者ページが時間とともにどのように変化したかを読者が理解するのに役立ちます。',
    history: 'ページ履歴',
    created: 'ページを作成',
    nameChanges: 'ページ名の変更',
    none: 'このページには名前変更の履歴がありません。',
    previous: '以前の名前',
    current: '新しい名前',
    loading: '読み込み中...',
    failed: 'ページ履歴を読み込めません。',
    back: '戻る',
    close: '閉じる',
  },
  ko: {
    title: '페이지 기록 및 투명성',
    intro: '이 정보는 독자가 작가 페이지의 변경 기록을 이해하는 데 도움이 됩니다.',
    history: '페이지 기록',
    created: '페이지 생성',
    nameChanges: '페이지 이름 변경',
    none: '이 페이지에는 이름 변경 기록이 없습니다.',
    previous: '이전 이름',
    current: '새 이름',
    loading: '불러오는 중...',
    failed: '페이지 기록을 불러올 수 없습니다.',
    back: '뒤로',
    close: '닫기',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DATE_LOCALES = {
  en: 'en-US',
  km: 'km-KH',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function formatDate(value, language) {
  if (!value) return '—'
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return '—'
  return new Intl.DateTimeFormat(DATE_LOCALES[language] || 'en-US', {
    dateStyle: 'long',
  }).format(date)
}

export default function AuthorPageTransparencyPopup({
  open,
  author,
  onBack,
  onClose,
}) {
  const { t } = useDisplayTranslation()
  const language = getDisplayLanguageId()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pageUsername = author?.page_username || ''
  const pageName = author?.page_name || ''

  useEffect(() => {
    if (!open || !pageUsername) return undefined

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/transparency`,
          { signal: controller.signal }
        )
        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok !== true) {
          throw new Error('Unable to load Page history')
        }

        if (!controller.signal.aborted) setData(result)
      } catch (caught) {
        if (caught?.name !== 'AbortError' && !controller.signal.aborted) {
          setError(caught?.message || 'Unable to load Page history')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [open, pageUsername])

  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousOverflow = document.body.style.overflow
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const previousWidth = document.body.style.width

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousOverflow
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = previousWidth
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  const history = Array.isArray(data?.name_changes) ? data.name_changes : []

  return (
    <div className="fixed inset-0 z-[275] flex items-center justify-center bg-black/45 px-3 py-5">
      <button
        type="button"
        aria-label={t('authorPageTransparencyPopup.close')}
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-2xl">
        <header className="relative flex min-h-[56px] shrink-0 items-center justify-center border-b border-[var(--shadow-border)] px-14">
          <button
            type="button"
            onClick={onBack}
            aria-label={t('authorPageTransparencyPopup.back')}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h2 className="line-clamp-1 text-center text-[16px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorPageTransparencyPopup.title')}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('authorPageTransparencyPopup.close')}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain">
          <div className="px-5 pb-4 pt-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
              {author?.avatar_url ? (
                <img src={author.avatar_url} alt={pageName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[22px] font-bold text-[var(--shadow-text-primary)]">
                  {(pageName || 'A').slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>

            <div className="mt-3 text-[16px] font-bold text-[var(--shadow-text-primary)]">
              {pageName}
            </div>

            <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
              {t('authorPageTransparencyPopup.intro')}
            </p>
          </div>

          {loading ? (
            <div className="mx-5 mb-5 rounded-[14px] bg-[var(--shadow-bg-soft)] p-4 text-[13px] text-[var(--shadow-text-secondary)]">
              {t('authorPageTransparencyPopup.loading')}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="mx-5 mb-5 rounded-[14px] bg-[var(--shadow-bg-soft)] p-4 text-[13px] text-[#e5484d]">
              {t('authorPageTransparencyPopup.failed')}
            </div>
          ) : null}

          {!loading && !error && data ? (
            <div className="border-t border-[var(--shadow-border)] px-5 pb-6 pt-5">
              <h3 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
                {t('authorPageTransparencyPopup.history')}
              </h3>

              <div className="mt-4 flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                  <i className="fa-regular fa-calendar text-[14px]" />
                </span>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                    {t('authorPageTransparencyPopup.created')}
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--shadow-text-secondary)]">
                    {formatDate(data.page_created_at, language)}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                  {t('authorPageTransparencyPopup.nameChanges')} ({history.length})
                </div>

                {history.length === 0 ? (
                  <p className="mt-2 text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
                    {t('authorPageTransparencyPopup.none')}
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {history.map((item, index) => (
                      <div
                        key={`${item.changed_at || index}-${index}`}
                        className="rounded-[14px] bg-[var(--shadow-bg-soft)] p-4"
                      >
                        <div className="text-[12px] text-[var(--shadow-text-tertiary)]">
                          {formatDate(item.changed_at, language)}
                        </div>
                        <div className="mt-3 text-[13px] text-[var(--shadow-text-primary)]">
                          <span className="text-[var(--shadow-text-secondary)]">
                            {t('authorPageTransparencyPopup.previous')}:{' '}
                          </span>
                          {item.old_name || '—'}
                        </div>
                        <div className="mt-2 text-[13px] text-[var(--shadow-text-primary)]">
                          <span className="text-[var(--shadow-text-secondary)]">
                            {t('authorPageTransparencyPopup.current')}:{' '}
                          </span>
                          {item.new_name || '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
