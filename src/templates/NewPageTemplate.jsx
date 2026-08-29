import { useNavigate } from 'react-router-dom'
import {
  PageShell,
  PageHeader,
  SurfaceCard,
  PageLoadingState,
  PageErrorState,
  PageEmptyState,
} from '../components/common/PagePrimitives'
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

export default function NewPageTemplate() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  const loading = false
  const error = ''
  const items = []

  return (
    <PageShell className="pb-20">
      <PageHeader
        title={t('newPageTemplate.title')}
        onBack={() => navigate(-1)}
        backLabel={t('newPageTemplate.goBack')}
      />

      <main className="mx-auto max-w-[960px] px-4 py-5">
        <section className="mb-5">
          <h2 className="app-title text-[20px] font-extrabold">
            {t('newPageTemplate.title')}
          </h2>

          <p className="app-muted mt-1 text-[12px] leading-5">
            {t('newPageTemplate.subtitle')}
          </p>
        </section>

        {loading ? (
          <PageLoadingState label={t('newPageTemplate.loading')} />
        ) : null}

        {!loading && error ? (
          <PageErrorState
            title={t('newPageTemplate.error')}
            actionLabel={t('newPageTemplate.retry')}
            onAction={() => window.location.reload()}
          />
        ) : null}

        {!loading && !error && !items.length ? (
          <PageEmptyState
            title={t('newPageTemplate.emptyTitle')}
            body={t('newPageTemplate.emptyBody')}
          />
        ) : null}

        {!loading && !error && items.length ? (
          <section className="grid gap-3">
            {items.map((item) => (
              <SurfaceCard key={item.id} as="article" className="p-4">
                <div className="app-title text-[14px] font-extrabold">
                  {item.title}
                </div>
              </SurfaceCard>
            ))}
          </section>
        ) : null}
      </main>
    </PageShell>
  )
}
