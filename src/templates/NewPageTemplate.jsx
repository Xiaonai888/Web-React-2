import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('newPageTemplate', {
  en: {
    title: 'Page Title',
    subtitle: 'Page description goes here.',
    loading: 'Loading...',
    error: 'Something went wrong.',
    emptyTitle: 'Nothing here yet',
    emptyBody: 'Content will appear here when it becomes available.',
    retry: 'Retry',
    goBack: 'Go back',
  },
  km: {
    title: 'ចំណងជើងទំព័រ',
    subtitle: 'ការពិពណ៌នាទំព័រនឹងបង្ហាញនៅទីនេះ។',
    loading: 'កំពុងផ្ទុក...',
    error: 'មានបញ្ហាអ្វីមួយកើតឡើង។',
    emptyTitle: 'មិនទាន់មានអ្វីនៅទីនេះទេ',
    emptyBody: 'មាតិកានឹងបង្ហាញនៅទីនេះនៅពេលមាន។',
    retry: 'ព្យាយាមម្ដងទៀត',
    goBack: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    title: '页面标题',
    subtitle: '页面说明将显示在这里。',
    loading: '加载中...',
    error: '出了点问题。',
    emptyTitle: '这里暂时没有内容',
    emptyBody: '有内容时会显示在这里。',
    retry: '重试',
    goBack: '返回',
  },
  ja: {
    title: 'ページタイトル',
    subtitle: 'ページの説明がここに表示されます。',
    loading: '読み込み中...',
    error: '問題が発生しました。',
    emptyTitle: 'まだ何もありません',
    emptyBody: 'コンテンツが利用可能になるとここに表示されます。',
    retry: '再試行',
    goBack: '戻る',
  },
  ko: {
    title: '페이지 제목',
    subtitle: '페이지 설명이 여기에 표시됩니다.',
    loading: '불러오는 중...',
    error: '문제가 발생했습니다.',
    emptyTitle: '아직 내용이 없습니다',
    emptyBody: '콘텐츠가 준비되면 여기에 표시됩니다.',
    retry: '다시 시도',
    goBack: '뒤로 가기',
  },
})

function LoadingState({ t }) {
  return (
    <div className="space-y-3">
      <div className="h-20 animate-pulse rounded-[18px] bg-[var(--shadow-bg-elevated)]" />
      <div className="h-20 animate-pulse rounded-[18px] bg-[var(--shadow-bg-elevated)]" />
      <div className="text-center text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
        {t('newPageTemplate.loading')}
      </div>
    </div>
  )
}

function ErrorState({ t, onRetry }) {
  return (
    <div className="app-card rounded-[20px] border p-6 text-center">
      <div className="text-[15px] font-extrabold text-red-500 dark:text-red-300">
        {t('newPageTemplate.error')}
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-[var(--shadow-text-primary)] px-5 py-2.5 text-[12px] font-extrabold text-[var(--shadow-bg-surface)] active:scale-95"
      >
        {t('newPageTemplate.retry')}
      </button>
    </div>
  )
}

function EmptyState({ t }) {
  return (
    <div className="app-card rounded-[20px] border p-7 text-center">
      <div className="app-title text-[17px] font-extrabold">
        {t('newPageTemplate.emptyTitle')}
      </div>

      <div className="app-muted mx-auto mt-2 max-w-[320px] text-[12px] leading-5">
        {t('newPageTemplate.emptyBody')}
      </div>
    </div>
  )
}

export default function NewPageTemplate() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  const loading = false
  const error = ''
  const items = []

  return (
    <div className="app-page min-h-screen pb-20">
      <header className="app-nav sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-14 max-w-[960px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('newPageTemplate.goBack')}
          >
            <i className="fas fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0">
            <h1 className="app-title truncate text-[18px] font-extrabold">
              {t('newPageTemplate.title')}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-4 py-5">
        <section className="mb-5">
          <h2 className="app-title text-[20px] font-extrabold">
            {t('newPageTemplate.title')}
          </h2>

          <p className="app-muted mt-1 text-[12px] leading-5">
            {t('newPageTemplate.subtitle')}
          </p>
        </section>

        {loading ? <LoadingState t={t} /> : null}

        {!loading && error ? (
          <ErrorState t={t} onRetry={() => window.location.reload()} />
        ) : null}

        {!loading && !error && !items.length ? (
          <EmptyState t={t} />
        ) : null}

        {!loading && !error && items.length ? (
          <section className="grid gap-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="app-card rounded-[18px] border p-4"
              >
                <div className="app-title text-[14px] font-extrabold">
                  {item.title}
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}
