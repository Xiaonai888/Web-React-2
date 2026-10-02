import { useEffect, useMemo } from 'react'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'

registerTranslationNamespace('authorPageAboutPopup', {
  en: {
    title: 'About {{name}}',
    intro: 'Page information helps readers understand this Author Page.',
    created: 'Page created',
    updated: 'Profile updated',
    type: 'Page type',
    authorPage: 'Author Page',
    works: 'Published works',
    transparency: 'Page history & transparency',
    close: 'Close',
    unknown: 'Not available',
  },
  km: {
    title: 'អំពី {{name}}',
    intro: 'ព័ត៌មានទំព័រជួយឱ្យអ្នកអានស្គាល់ទំព័រអ្នកនិពន្ធនេះកាន់តែច្បាស់។',
    created: 'ថ្ងៃបង្កើតទំព័រ',
    updated: 'Profile បាន Update',
    type: 'ប្រភេទទំព័រ',
    authorPage: 'ទំព័រអ្នកនិពន្ធ',
    works: 'ស្នាដៃបានបោះពុម្ព',
    transparency: 'ប្រវត្តិ និងព័ត៌មានតម្លាភាពទំព័រ',
    close: 'បិទ',
    unknown: 'មិនមានព័ត៌មាន',
  },
  zh: {
    title: '关于 {{name}}',
    intro: '主页信息可帮助读者更好地了解此作者主页。',
    created: '主页创建时间',
    updated: '资料更新时间',
    type: '主页类型',
    authorPage: '作者主页',
    works: '已发布作品',
    transparency: '主页历史与透明度',
    close: '关闭',
    unknown: '暂无信息',
  },
  ja: {
    title: '{{name}} について',
    intro: 'ページ情報は、この作者ページを読者がよりよく理解するためのものです。',
    created: 'ページ作成日',
    updated: 'プロフィール更新',
    type: 'ページの種類',
    authorPage: '作者ページ',
    works: '公開作品',
    transparency: 'ページ履歴と透明性',
    close: '閉じる',
    unknown: '情報なし',
  },
  ko: {
    title: '{{name}} 정보',
    intro: '페이지 정보는 독자가 이 작가 페이지를 더 잘 이해하도록 도와줍니다.',
    created: '페이지 생성일',
    updated: '프로필 업데이트',
    type: '페이지 유형',
    authorPage: '작가 페이지',
    works: '게시된 작품',
    transparency: '페이지 기록 및 투명성',
    close: '닫기',
    unknown: '정보 없음',
  },
})

const DATE_LOCALES = {
  en: 'en-US',
  km: 'km-KH',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function formatDate(value, language, fallback) {
  if (!value) return fallback
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return fallback
  return new Intl.DateTimeFormat(DATE_LOCALES[language] || 'en-US', {
    dateStyle: 'long',
  }).format(date)
}

function formatRelative(value, language, fallback) {
  if (!value) return fallback
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return fallback

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absSeconds = Math.abs(diffSeconds)
  const formatter = new Intl.RelativeTimeFormat(DATE_LOCALES[language] || 'en-US', {
    numeric: 'auto',
  })

  if (absSeconds < 60) return formatter.format(diffSeconds, 'second')
  if (absSeconds < 3600) return formatter.format(Math.round(diffSeconds / 60), 'minute')
  if (absSeconds < 86400) return formatter.format(Math.round(diffSeconds / 3600), 'hour')
  if (absSeconds < 2592000) return formatter.format(Math.round(diffSeconds / 86400), 'day')

  return formatDate(value, language, fallback)
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className={`${icon} text-[15px]`} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-[var(--shadow-text-secondary)]">{label}</div>
        <div className="mt-0.5 break-words text-[14px] font-semibold text-[var(--shadow-text-primary)]">{value}</div>
      </div>
    </div>
  )
}

export default function AuthorPageAboutPopup({
  open,
  author,
  onClose,
  onOpenTransparency,
}) {
  const { t } = useDisplayTranslation()
  const language = getDisplayLanguageId()

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

  const pageName = author?.page_name || t('authorPageAboutPopup.authorPage')
  const createdText = useMemo(
    () => formatDate(author?.created_at, language, t('authorPageAboutPopup.unknown')),
    [author?.created_at, language, t]
  )
  const updatedText = useMemo(
    () => formatRelative(author?.updated_at, language, t('authorPageAboutPopup.unknown')),
    [author?.updated_at, language, t]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[265] flex items-center justify-center bg-black/45 px-3 py-6">
      <button
        type="button"
        aria-label={t('authorPageAboutPopup.close')}
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-[480px] overflow-hidden rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-2xl">
        <header className="relative flex min-h-[54px] items-center justify-center border-b border-[var(--shadow-border)] px-14 py-3">
          <h2 className="line-clamp-1 text-center text-[16px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorPageAboutPopup.title', { name: pageName })}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('authorPageAboutPopup.close')}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        </header>

        <div className="px-5 pb-2 pt-4">
          <p className="text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('authorPageAboutPopup.intro')}
          </p>
        </div>

        <div className="pb-2">
          <InfoRow
            icon="fa-regular fa-calendar"
            label={t('authorPageAboutPopup.created')}
            value={createdText}
          />
          <InfoRow
            icon="fa-regular fa-clock"
            label={t('authorPageAboutPopup.updated')}
            value={updatedText}
          />
          <InfoRow
            icon="fa-regular fa-id-badge"
            label={t('authorPageAboutPopup.type')}
            value={t('authorPageAboutPopup.authorPage')}
          />
          <InfoRow
            icon="fa-solid fa-book-open"
            label={t('authorPageAboutPopup.works')}
            value={Number(author?.works_count || 0).toLocaleString(DATE_LOCALES[language] || 'en-US')}
          />
        </div>

        <button
          type="button"
          onClick={onOpenTransparency}
          className="flex w-full items-center gap-3 border-t border-[var(--shadow-border)] px-5 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
            <i className="fa-solid fa-circle-info text-[15px]" />
          </span>
          <span className="min-w-0 flex-1 text-[14px] font-semibold text-[var(--shadow-text-primary)]">
            {t('authorPageAboutPopup.transparency')}
          </span>
          <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
        </button>
      </section>
    </div>
  )
}
