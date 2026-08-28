import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SubscriptionsSection from '../components/library/SubscriptionsSection'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('libraryPage', {
  en: {
    recents: 'Recents',
    subscribed: 'Subscribed',
    downloads: 'Downloads',
    all: 'All',
    novel: 'Novel',
    chatStory: 'Chat Story',
    manga: 'Manga',
    pdf: 'PDF',
    clear: 'Clear',
    manage: 'Manage',
    edit: 'Edit',
    recentsSubtitle: 'Stories you added to your library.',
    subscribedSubtitle: 'Follow the latest updates from stories you love.',
    downloadsSubtitle: 'Purchased PDFs and downloads from Author Store.',
    newEpisode: 'New Ep. {{count}}',
    readOnlineOnly: '{{file}} • Read online only',
    downloadAndRead: '{{file}} • Download + Read',
    downloadOnly: '{{file}} • Download',
    savedEpisode: 'Saved • Ep. {{count}}',
    untitledPdf: 'Untitled PDF',
    pdfBook: 'PDF book',
    end: 'END',
    storyCover: 'Story cover',
    pdfNotReady: 'PDF file is not ready.',
    read: 'Read',
    download: 'Download',
    untitledStory: 'Untitled Story',
    pdfDownload: 'PDF Download',
    purchasedPdfBook: 'Purchased PDF book',
    latestUpdate: 'Latest Update',
    downloaded: 'Downloaded',
    inLibrary: 'In Library',
    story: 'Story',
    episodeCount: '{{genre}} • {{count}} episodes',
    loadSubscriptionsFailed: 'Failed to load subscriptions',
    loadDownloadsFailed: 'Failed to load downloads',
    loadLibraryFailed: 'Failed to load library',
    clearConfirm: 'Clear all saved stories from your library?',
    clearFailed: 'Failed to clear library',
    loadingLibrary: 'Loading library...',
    loginLibrary: 'Login to use your library',
    loginLibraryText: 'Save stories, subscribe to updates, and keep your reading list synced.',
    login: 'Login',
    yourSubscriptions: 'Your Subscriptions',
    yourDownloads: 'Your Downloads',
    yourLibrary: 'Your Library',
    seeAll: 'See All',
    noSubscriptions: 'No subscriptions yet',
    noDownloads: 'No downloads yet',
    noSavedStories: 'No saved stories yet',
    noSubscriptionsText: 'Tap the heart button on a story to follow its updates.',
    noDownloadsText: 'Purchased PDFs will appear here after payment.',
    noSavedStoriesText: 'Tap the bookmark button on a story to add it to your library.',
    browseStories: 'Browse Stories',
  },
  km: {
    recents: 'ថ្មីៗ',
    subscribed: 'បានតាមដាន',
    downloads: 'បានទាញយក',
    all: 'ទាំងអស់',
    novel: 'Novel',
    chatStory: 'Chat Story',
    manga: 'Manga',
    pdf: 'PDF',
    clear: 'សម្អាត',
    manage: 'គ្រប់គ្រង',
    edit: 'កែសម្រួល',
    recentsSubtitle: 'រឿងដែលអ្នកបានបន្ថែមទៅ Library។',
    subscribedSubtitle: 'តាមដាន Update ថ្មីៗពីរឿងដែលអ្នកចូលចិត្ត។',
    downloadsSubtitle: 'PDF ដែលបានទិញ និងការទាញយកពី Author Store។',
    newEpisode: 'ភាគថ្មី {{count}}',
    readOnlineOnly: '{{file}} • អាន Online ប៉ុណ្ណោះ',
    downloadAndRead: '{{file}} • ទាញយក + អាន',
    downloadOnly: '{{file}} • ទាញយក',
    savedEpisode: 'បានរក្សាទុក • ភាគ {{count}}',
    untitledPdf: 'PDF គ្មានចំណងជើង',
    pdfBook: 'សៀវភៅ PDF',
    end: 'ចប់',
    storyCover: 'គម្របរឿង',
    pdfNotReady: 'ឯកសារ PDF មិនទាន់រួចរាល់។',
    read: 'អាន',
    download: 'ទាញយក',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    pdfDownload: 'ទាញយក PDF',
    purchasedPdfBook: 'សៀវភៅ PDF ដែលបានទិញ',
    latestUpdate: 'Update ចុងក្រោយ',
    downloaded: 'បានទាញយក',
    inLibrary: 'នៅក្នុង Library',
    story: 'រឿង',
    episodeCount: '{{genre}} • {{count}} ភាគ',
    loadSubscriptionsFailed: 'មិនអាចផ្ទុកការតាមដានបានទេ',
    loadDownloadsFailed: 'មិនអាចផ្ទុកការទាញយកបានទេ',
    loadLibraryFailed: 'មិនអាចផ្ទុក Library បានទេ',
    clearConfirm: 'លុបរឿងដែលបានរក្សាទុកទាំងអស់ចេញពី Library?',
    clearFailed: 'មិនអាចសម្អាត Library បានទេ',
    loadingLibrary: 'កំពុងផ្ទុក Library...',
    loginLibrary: 'Login ដើម្បីប្រើ Library',
    loginLibraryText: 'រក្សាទុករឿង តាមដាន Update និងរក្សាបញ្ជីអានរបស់អ្នកឱ្យ Sync។',
    login: 'Login',
    yourSubscriptions: 'ការតាមដានរបស់អ្នក',
    yourDownloads: 'ការទាញយករបស់អ្នក',
    yourLibrary: 'Library របស់អ្នក',
    seeAll: 'មើលទាំងអស់',
    noSubscriptions: 'មិនទាន់មានការតាមដាន',
    noDownloads: 'មិនទាន់មានការទាញយក',
    noSavedStories: 'មិនទាន់មានរឿងដែលបានរក្សាទុក',
    noSubscriptionsText: 'ចុចប៊ូតុងបេះដូងលើរឿង ដើម្បីតាមដាន Update។',
    noDownloadsText: 'PDF ដែលបានទិញនឹងបង្ហាញនៅទីនេះបន្ទាប់ពីការទូទាត់។',
    noSavedStoriesText: 'ចុចប៊ូតុង Bookmark លើរឿង ដើម្បីបន្ថែមទៅ Library។',
    browseStories: 'រកមើលរឿង',
  },
  zh: {
    recents: '最近',
    subscribed: '已订阅',
    downloads: '下载',
    all: '全部',
    novel: '小说',
    chatStory: 'Chat Story',
    manga: 'Manga',
    pdf: 'PDF',
    clear: '清除',
    manage: '管理',
    edit: '编辑',
    recentsSubtitle: '你添加到 Library 的故事。',
    subscribedSubtitle: '关注你喜欢的故事的最新更新。',
    downloadsSubtitle: '从 Author Store 购买的 PDF 和下载内容。',
    newEpisode: '新章节 {{count}}',
    readOnlineOnly: '{{file}} • 仅在线阅读',
    downloadAndRead: '{{file}} • 下载 + 阅读',
    downloadOnly: '{{file}} • 下载',
    savedEpisode: '已保存 • 第 {{count}} 集',
    untitledPdf: '无标题 PDF',
    pdfBook: 'PDF 图书',
    end: '完结',
    storyCover: '故事封面',
    pdfNotReady: 'PDF 文件尚未准备好。',
    read: '阅读',
    download: '下载',
    untitledStory: '无标题故事',
    pdfDownload: 'PDF 下载',
    purchasedPdfBook: '已购买的 PDF 图书',
    latestUpdate: '最新更新',
    downloaded: '已下载',
    inLibrary: '在 Library 中',
    story: '故事',
    episodeCount: '{{genre}} • {{count}} 集',
    loadSubscriptionsFailed: '无法加载订阅',
    loadDownloadsFailed: '无法加载下载内容',
    loadLibraryFailed: '无法加载 Library',
    clearConfirm: '清除 Library 中所有已保存的故事？',
    clearFailed: '无法清除 Library',
    loadingLibrary: '正在加载 Library...',
    loginLibrary: '登录后使用 Library',
    loginLibraryText: '保存故事、订阅更新并同步你的阅读列表。',
    login: '登录',
    yourSubscriptions: '你的订阅',
    yourDownloads: '你的下载',
    yourLibrary: '你的 Library',
    seeAll: '查看全部',
    noSubscriptions: '暂无订阅',
    noDownloads: '暂无下载',
    noSavedStories: '暂无已保存故事',
    noSubscriptionsText: '点击故事上的心形按钮即可关注更新。',
    noDownloadsText: '购买的 PDF 会在付款后显示在这里。',
    noSavedStoriesText: '点击故事上的书签按钮即可添加到 Library。',
    browseStories: '浏览故事',
  },
  ja: {
    recents: '最近',
    subscribed: '購読中',
    downloads: 'ダウンロード',
    all: 'すべて',
    novel: '小説',
    chatStory: 'Chat Story',
    manga: 'Manga',
    pdf: 'PDF',
    clear: 'クリア',
    manage: '管理',
    edit: '編集',
    recentsSubtitle: 'Library に追加したストーリーです。',
    subscribedSubtitle: 'お気に入りのストーリーの最新更新をフォローします。',
    downloadsSubtitle: 'Author Store で購入した PDF とダウンロードです。',
    newEpisode: '新着 Ep. {{count}}',
    readOnlineOnly: '{{file}} • オンライン閲覧のみ',
    downloadAndRead: '{{file}} • ダウンロード + 閲覧',
    downloadOnly: '{{file}} • ダウンロード',
    savedEpisode: '保存済み • Ep. {{count}}',
    untitledPdf: '無題の PDF',
    pdfBook: 'PDF ブック',
    end: '完結',
    storyCover: 'ストーリーの表紙',
    pdfNotReady: 'PDF ファイルはまだ準備できていません。',
    read: '読む',
    download: 'ダウンロード',
    untitledStory: '無題のストーリー',
    pdfDownload: 'PDF ダウンロード',
    purchasedPdfBook: '購入済み PDF ブック',
    latestUpdate: '最新更新',
    downloaded: 'ダウンロード済み',
    inLibrary: 'Library に保存済み',
    story: 'ストーリー',
    episodeCount: '{{genre}} • {{count}} エピソード',
    loadSubscriptionsFailed: '購読を読み込めませんでした',
    loadDownloadsFailed: 'ダウンロードを読み込めませんでした',
    loadLibraryFailed: 'Library を読み込めませんでした',
    clearConfirm: 'Library の保存済みストーリーをすべて削除しますか？',
    clearFailed: 'Library をクリアできませんでした',
    loadingLibrary: 'Library を読み込み中...',
    loginLibrary: 'ログインして Library を利用',
    loginLibraryText: 'ストーリーを保存し、更新を購読して、読書リストを同期できます。',
    login: 'ログイン',
    yourSubscriptions: '購読中のストーリー',
    yourDownloads: 'ダウンロード',
    yourLibrary: 'あなたの Library',
    seeAll: 'すべて見る',
    noSubscriptions: '購読はまだありません',
    noDownloads: 'ダウンロードはまだありません',
    noSavedStories: '保存済みストーリーはまだありません',
    noSubscriptionsText: 'ストーリーのハートボタンを押して更新をフォローできます。',
    noDownloadsText: '購入した PDF は支払い後にここへ表示されます。',
    noSavedStoriesText: 'ストーリーのブックマークボタンを押して Library に追加できます。',
    browseStories: 'ストーリーを見る',
  },
  ko: {
    recents: '최근',
    subscribed: '구독',
    downloads: '다운로드',
    all: '전체',
    novel: '소설',
    chatStory: 'Chat Story',
    manga: 'Manga',
    pdf: 'PDF',
    clear: '지우기',
    manage: '관리',
    edit: '편집',
    recentsSubtitle: 'Library에 추가한 스토리입니다.',
    subscribedSubtitle: '좋아하는 스토리의 최신 업데이트를 확인하세요.',
    downloadsSubtitle: 'Author Store에서 구매한 PDF와 다운로드입니다.',
    newEpisode: '신규 Ep. {{count}}',
    readOnlineOnly: '{{file}} • 온라인 읽기만 가능',
    downloadAndRead: '{{file}} • 다운로드 + 읽기',
    downloadOnly: '{{file}} • 다운로드',
    savedEpisode: '저장됨 • Ep. {{count}}',
    untitledPdf: '제목 없는 PDF',
    pdfBook: 'PDF 도서',
    end: '완결',
    storyCover: '스토리 표지',
    pdfNotReady: 'PDF 파일이 아직 준비되지 않았습니다.',
    read: '읽기',
    download: '다운로드',
    untitledStory: '제목 없는 스토리',
    pdfDownload: 'PDF 다운로드',
    purchasedPdfBook: '구매한 PDF 도서',
    latestUpdate: '최신 업데이트',
    downloaded: '다운로드됨',
    inLibrary: 'Library에 저장됨',
    story: '스토리',
    episodeCount: '{{genre}} • {{count}} 에피소드',
    loadSubscriptionsFailed: '구독을 불러오지 못했습니다',
    loadDownloadsFailed: '다운로드를 불러오지 못했습니다',
    loadLibraryFailed: 'Library를 불러오지 못했습니다',
    clearConfirm: 'Library에 저장된 모든 스토리를 지울까요?',
    clearFailed: 'Library를 지우지 못했습니다',
    loadingLibrary: 'Library를 불러오는 중...',
    loginLibrary: '로그인하여 Library 사용',
    loginLibraryText: '스토리를 저장하고 업데이트를 구독하며 읽기 목록을 동기화하세요.',
    login: '로그인',
    yourSubscriptions: '내 구독',
    yourDownloads: '내 다운로드',
    yourLibrary: '내 Library',
    seeAll: '전체 보기',
    noSubscriptions: '아직 구독이 없습니다',
    noDownloads: '아직 다운로드가 없습니다',
    noSavedStories: '아직 저장된 스토리가 없습니다',
    noSubscriptionsText: '스토리의 하트 버튼을 눌러 업데이트를 구독하세요.',
    noDownloadsText: '구매한 PDF는 결제 후 여기에 표시됩니다.',
    noSavedStoriesText: '스토리의 북마크 버튼을 눌러 Library에 추가하세요.',
    browseStories: '스토리 둘러보기',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const topTabs = ['Recents', 'Subscribed', 'Downloads']
const storyTypeTabs = ['All', 'Novel', 'Chat Story', 'Manga']
const downloadTypeTabs = ['All', 'PDF']

const TOP_TAB_LABEL_KEYS = {
  Recents: 'recents',
  Subscribed: 'subscribed',
  Downloads: 'downloads',
}

const TYPE_LABEL_KEYS = {
  All: 'all',
  Novel: 'novel',
  'Chat Story': 'chatStory',
  Manga: 'manga',
  PDF: 'pdf',
}

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function normalizeAccessRule(value = '') {
  const rule = String(value || '').toLowerCase()

  if (rule.includes('read') && rule.includes('download')) return 'download_and_read'
  if (rule.includes('read')) return 'read_only'
  return 'download_after_payment'
}

function canDownloadPdf(story) {
  const rule = normalizeAccessRule(story?.access_rule)
  return rule === 'download_after_payment' || rule === 'download_and_read'
}

function canReadPdf(story) {
  const rule = normalizeAccessRule(story?.access_rule)
  return rule === 'read_only' || rule === 'download_and_read'
}

function getStoryType(story) {
  const genre = String(story?.main_genre || '').toLowerCase()

  if (genre.includes('pdf')) return 'PDF'
  if (genre.includes('chat')) return 'Chat Story'
  if (genre.includes('manga') || genre.includes('comic') || genre.includes('manhwa')) return 'Manga'

  return 'Novel'
}

function getActionText(tab, t) {
  if (tab === 'Recents') return t('libraryPage.clear')
  if (tab === 'Subscribed') return t('libraryPage.manage')
  return t('libraryPage.edit')
}

function getSubtitle(tab, t) {
  if (tab === 'Recents') return t('libraryPage.recentsSubtitle')
  if (tab === 'Subscribed') return t('libraryPage.subscribedSubtitle')
  return t('libraryPage.downloadsSubtitle')
}

function formatInfo(tab, story, t) {
  if (tab === 'Subscribed') {
    return t('libraryPage.newEpisode', {
      count: story?.total_episodes || 0,
    })
  }

  if (tab === 'Downloads') {
    const fileName = story?.pdf_file_name || 'PDF'
    const rule = normalizeAccessRule(story?.access_rule)

    if (rule === 'read_only') {
      return t('libraryPage.readOnlineOnly', { file: fileName })
    }
    if (rule === 'download_and_read') {
      return t('libraryPage.downloadAndRead', { file: fileName })
    }
    return t('libraryPage.downloadOnly', { file: fileName })
  }

  return t('libraryPage.savedEpisode', {
    count: story?.total_episodes || 0,
  })
}

function formatDownloadItems(downloads) {
  if (!Array.isArray(downloads)) return []

  return downloads.map((item) => ({
    id: item.id,
    story_id: item.product_id,
    kind: 'pdf',
    download: item,
    story: {
      id: item.product_id,
      title: item.title || 'Untitled PDF',
      description: item.pdf_file_name || 'PDF book',
      cover_url: item.cover_url || '',
      main_genre: 'PDF',
      total_episodes: 1,
      status: 'completed',
      pdf_file_url: item.pdf_file_url || '',
      pdf_file_name: item.pdf_file_name || '',
      access_rule: item.access_rule || 'Download after payment',
      order_number: item.order_number || '',
    },
  }))
}

function EmptyState({ title, text, actionText, onAction }) {
  return (
    <div
      className="rounded-3xl border px-5 py-10 text-center"
      style={{
        background: 'var(--shadow-bg-elevated)',
        borderColor: 'var(--shadow-border)',
      }}
    >
      <h3
        className="text-[16px] font-extrabold"
        style={{ color: 'var(--shadow-text-primary)' }}
      >
        {title}
      </h3>
      <p
        className="mx-auto mt-2 max-w-[300px] text-[13px] leading-5"
        style={{ color: 'var(--shadow-text-secondary)' }}
      >
        {text}
      </p>

      {actionText ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full px-5 py-2.5 text-[12px] font-extrabold active:scale-95"
          style={{
            background: 'var(--shadow-text-primary)',
            color: 'var(--shadow-bg-page)',
          }}
        >
          {actionText}
        </button>
      ) : null}
    </div>
  )
}

function EndBadge() {
  const { t } = useDisplayTranslation()

  return (
    <div className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#ff9a44] to-[#fc6076] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm">
      {t('libraryPage.end')}
    </div>
  )
}

function PdfBadge() {
  return (
    <div className="absolute left-2 top-2 rounded-full bg-[#111827] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm">
      PDF
    </div>
  )
}

function StoryCover({ story, className = '' }) {
  const { t } = useDisplayTranslation()
  const title =
    story?.title === 'Untitled Story'
      ? t('libraryPage.untitledStory')
      : story?.title === 'Untitled PDF'
        ? t('libraryPage.untitledPdf')
        : story?.title || t('libraryPage.storyCover')

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ background: 'var(--shadow-bg-soft)' }}
    >
      {story?.cover_url ? (
        <img
          src={story.cover_url}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
    </div>
  )
}

function PdfActionButtons({ story, compact = false }) {
  const { t } = useDisplayTranslation()
  const pdfUrl = story?.pdf_file_url || ''
  const fileName = story?.pdf_file_name || `${story?.title || 'download'}.pdf`

  if (!pdfUrl) {
    return (
      <div
        className="rounded-xl px-3 py-2 text-[10px] font-extrabold"
        style={{
          background: 'rgba(245, 158, 11, 0.12)',
          color: 'var(--shadow-warning)',
        }}
      >
        {t('libraryPage.pdfNotReady')}
      </div>
    )
  }

  return (
    <div className={`flex ${compact ? 'flex-col gap-1.5' : 'flex-wrap gap-2'}`}>
      {canReadPdf(story) ? (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-[10px] font-extrabold active:scale-95"
          style={{
            background: 'var(--shadow-text-primary)',
            color: 'var(--shadow-bg-page)',
          }}
        >
          {t('libraryPage.read')}
        </a>
      ) : null}

      {canDownloadPdf(story) ? (
        <a
          href={pdfUrl}
          download={fileName}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[10px] font-extrabold active:scale-95"
          style={{
            background: 'var(--shadow-bg-soft)',
            borderColor: 'var(--shadow-border)',
            color: 'var(--shadow-text-primary)',
          }}
        >
          {t('libraryPage.download')}
        </a>
      ) : null}
    </div>
  )
}

function LibraryBookCard({ item, tab }) {
  const { t } = useDisplayTranslation()
  const story = item.story
  if (!story) return null

  const displayTitle =
    story.title === 'Untitled PDF'
      ? t('libraryPage.untitledPdf')
      : story.title === 'Untitled Story'
        ? t('libraryPage.untitledStory')
        : story.title

  if (tab === 'Downloads' || item.kind === 'pdf') {
    return (
      <article className="group block min-w-0">
        <div
          className="relative overflow-hidden rounded-2xl shadow-sm"
          style={{ background: 'var(--shadow-bg-soft)' }}
        >
          <div className="aspect-[2/3] overflow-hidden">
            <StoryCover story={story} className="h-full w-full" />
          </div>

          <PdfBadge />
        </div>

        <div className="pt-2.5">
          <h4
            className="line-clamp-1 text-[12px] font-extrabold tracking-tight sm:text-[13px]"
            style={{ color: 'var(--shadow-text-primary)' }}
          >
            {displayTitle || t('libraryPage.untitledPdf')}
          </h4>
          <p
            className="mt-1 line-clamp-1 text-[10px] font-medium sm:text-[11px]"
            style={{ color: 'var(--shadow-text-secondary)' }}
          >
            {formatInfo(tab, story, t)}
          </p>

          <div className="mt-2">
            <PdfActionButtons story={story} compact />
          </div>
        </div>
      </article>
    )
  }

  return (
    <Link to={`/story/${story.id}`} className="group block min-w-0">
      <div
        className="relative overflow-hidden rounded-2xl shadow-sm"
        style={{ background: 'var(--shadow-bg-soft)' }}
      >
        <div className="aspect-[2/3] overflow-hidden">
          <StoryCover story={story} className="h-full w-full" />
        </div>

        {story.status === 'completed' ? <EndBadge /> : null}
      </div>

      <div className="pt-2.5">
        <h4
          className="line-clamp-1 text-[12px] font-extrabold tracking-tight sm:text-[13px]"
          style={{ color: 'var(--shadow-text-primary)' }}
        >
          {displayTitle || t('libraryPage.untitledStory')}
        </h4>
        <p
          className="mt-1 text-[10px] font-medium sm:text-[11px]"
          style={{ color: 'var(--shadow-text-secondary)' }}
        >
          {formatInfo(tab, story, t)}
        </p>
      </div>
    </Link>
  )
}

function ContextCard({ item, tab }) {
  const { t } = useDisplayTranslation()
  const story = item?.story
  if (!story) return null

  const displayTitle =
    story.title === 'Untitled PDF'
      ? t('libraryPage.untitledPdf')
      : story.title === 'Untitled Story'
        ? t('libraryPage.untitledStory')
        : story.title
  const displayDescription =
    story.description === 'PDF book'
      ? t('libraryPage.pdfBook')
      : story.description
  const genreFallback =
    story.main_genre || t('libraryPage.story')

  if (tab === 'Downloads' || item.kind === 'pdf') {
    return (
      <section className="pt-5">
        <div
          className="rounded-[24px] border p-4"
          style={{
            background: 'var(--shadow-bg-elevated)',
            borderColor: 'var(--shadow-border)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-[82px] shrink-0 overflow-hidden rounded-2xl shadow-sm sm:w-[90px]"
              style={{ background: 'var(--shadow-bg-soft)' }}
            >
              <div className="aspect-[2/3] overflow-hidden">
                <StoryCover story={story} className="h-full w-full" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div
                className="mb-2 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] shadow-sm"
                style={{
                  background: 'var(--shadow-bg-surface)',
                  borderColor: 'var(--shadow-border)',
                  color: 'var(--shadow-text-primary)',
                }}
              >
                {t('libraryPage.pdfDownload')}
              </div>

              <h3
                className="line-clamp-1 text-[15px] font-extrabold tracking-tight sm:text-[17px]"
                style={{ color: 'var(--shadow-text-primary)' }}
              >
                {displayTitle || t('libraryPage.untitledPdf')}
              </h3>

              <p
                className="mt-1 line-clamp-2 text-[12px] leading-5 sm:text-[13px]"
                style={{ color: 'var(--shadow-text-secondary)' }}
              >
                {displayDescription || t('libraryPage.purchasedPdfBook')}
              </p>

              <p
                className="mt-2 text-[11px] font-extrabold sm:text-[12px]"
                style={{ color: 'var(--shadow-text-primary)' }}
              >
                {formatInfo(tab, story, t)}
              </p>

              <div className="mt-3">
                <PdfActionButtons story={story} />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-5">
      <Link
        to={`/story/${story.id}`}
        className="group block rounded-[24px] border p-4 transition"
        style={{
          background: 'var(--shadow-bg-elevated)',
          borderColor: 'var(--shadow-border)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-[82px] shrink-0 overflow-hidden rounded-2xl shadow-sm sm:w-[90px]"
            style={{ background: 'var(--shadow-bg-soft)' }}
          >
            <div className="aspect-[2/3] overflow-hidden">
              <StoryCover story={story} className="h-full w-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="mb-2 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] shadow-sm"
              style={{
                background: 'var(--shadow-bg-surface)',
                borderColor: 'var(--shadow-border)',
                color: 'var(--shadow-text-primary)',
              }}
            >
              {tab === 'Subscribed'
                ? t('libraryPage.latestUpdate')
                : tab === 'Downloads'
                  ? t('libraryPage.downloaded')
                  : t('libraryPage.inLibrary')}
            </div>

            <h3
              className="line-clamp-1 text-[15px] font-extrabold tracking-tight sm:text-[17px]"
              style={{ color: 'var(--shadow-text-primary)' }}
            >
              {displayTitle || t('libraryPage.untitledStory')}
            </h3>

            <p
              className="mt-1 line-clamp-2 text-[12px] leading-5 sm:text-[13px]"
              style={{ color: 'var(--shadow-text-secondary)' }}
            >
              {story.description ||
                t('libraryPage.episodeCount', {
                  genre: genreFallback,
                  count: story.total_episodes || 0,
                })}
            </p>

            <p
              className="mt-2 text-[11px] font-extrabold sm:text-[12px]"
              style={{ color: 'var(--shadow-text-primary)' }}
            >
              {formatInfo(tab, story, t)}
            </p>
          </div>

          <i
            className="fa-solid fa-chevron-right transition group-hover:translate-x-1"
            style={{ color: 'var(--shadow-text-tertiary)' }}
          />
        </div>
      </Link>
    </section>
  )
}

export default function Library() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] = useState('Subscribed')
  const [activeType, setActiveType] = useState('All')
  const [libraryItems, setLibraryItems] = useState([])
  const [subscriptionItems, setSubscriptionItems] = useState([])
  const [downloadItems, setDownloadItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const isLoggedIn = Boolean(getReaderToken())
  const loadedTabsRef = useRef(new Set())
  const inFlightTabsRef = useRef(new Set())
  const activeTabRef = useRef(activeTab)

  const loadLibrary = async (
    tab = activeTab,
    { force = false } = {}
  ) => {
    if (!isLoggedIn) {
      loadedTabsRef.current.clear()
      inFlightTabsRef.current.clear()
      setLibraryItems([])
      setSubscriptionItems([])
      setDownloadItems([])
      setLoading(false)
      setMessage('')
      return
    }

    if (
      !force &&
      loadedTabsRef.current.has(tab)
    ) {
      if (activeTabRef.current === tab) {
        setLoading(false)
        setMessage('')
      }
      return
    }

    if (
      inFlightTabsRef.current.has(tab)
    ) {
      return
    }

    inFlightTabsRef.current.add(tab)

    if (activeTabRef.current === tab) {
      setLoading(true)
      setMessage('')
    }

    try {
      if (tab === 'Subscribed') {
        const response = await fetch(
          `${API_BASE_URL}/api/reader/subscriptions`,
          { headers: getHeaders() }
        )
        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error(
            data.message ||
              t('libraryPage.loadSubscriptionsFailed')
          )
        }

        setSubscriptionItems(
          Array.isArray(data.items)
            ? data.items
            : []
        )
      } else if (tab === 'Downloads') {
        const response = await fetch(
          `${API_BASE_URL}/api/author-store/downloads/my`,
          { headers: getHeaders() }
        )
        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error(
            data.message ||
              t('libraryPage.loadDownloadsFailed')
          )
        }

        setDownloadItems(
          formatDownloadItems(
            data.downloads
          )
        )
      } else {
        const response = await fetch(
          `${API_BASE_URL}/api/reader/library`,
          { headers: getHeaders() }
        )
        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error(
            data.message ||
              t('libraryPage.loadLibraryFailed')
          )
        }

        setLibraryItems(
          Array.isArray(data.items)
            ? data.items
            : []
        )
      }

      loadedTabsRef.current.add(tab)
    } catch (error) {
      if (activeTabRef.current === tab) {
        setMessage(
          error.message ||
            t('libraryPage.loadLibraryFailed')
        )
      }
    } finally {
      inFlightTabsRef.current.delete(tab)

      if (activeTabRef.current === tab) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    activeTabRef.current = activeTab
    loadLibrary(activeTab)
  }, [activeTab, isLoggedIn])

  const currentItems = useMemo(() => {
    if (activeTab === 'Subscribed') return subscriptionItems
    if (activeTab === 'Downloads') return downloadItems
    return libraryItems
  }, [activeTab, libraryItems, subscriptionItems, downloadItems])

  const currentTypeTabs = activeTab === 'Downloads' ? downloadTypeTabs : storyTypeTabs

  const filteredItems = useMemo(() => {
    if (activeType === 'All') return currentItems
    return currentItems.filter((item) => getStoryType(item.story) === activeType)
  }, [currentItems, activeType])

  const actionText = getActionText(activeTab, t)
  const subtitle = getSubtitle(activeTab, t)
  const firstItem = filteredItems[0] || null

  const handleAction = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (activeTab !== 'Recents' || !libraryItems.length) return

    const confirmed = window.confirm(t('libraryPage.clearConfirm'))
    if (!confirmed) return

    try {
      await Promise.all(
        libraryItems.map((item) =>
          fetch(`${API_BASE_URL}/api/reader/library/${item.story_id}`, {
            method: 'DELETE',
            headers: getHeaders(),
          })
        )
      )

      setLibraryItems([])
      loadedTabsRef.current.add('Recents')
    } catch {
      setMessage(t('libraryPage.clearFailed'))
    }
  }

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .tab-active-lib::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -10px;
          width: 22px;
          height: 4px;
          border-radius: 9999px;
          background: var(--shadow-text-primary);
        }
      `}</style>

      <div className="app-page min-h-screen pb-[88px]">
        <header className="app-nav sticky top-0 z-[60] border-b backdrop-blur-sm">
          <div className="px-4 pt-5 sm:px-5">
            <div className="flex items-end justify-between gap-4">
              <div className="flex min-w-0 items-end gap-5 overflow-x-auto no-scrollbar">
                {topTabs.map((tab) => {
                  const active = tab === activeTab

                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab)
                        setActiveType('All')
                      }}
                      className={`relative shrink-0 pb-3 text-[13px] font-bold transition-colors sm:text-[14px] ${
                        active ? 'tab-active-lib' : ''
                      }`}
                      style={{
                        color: active
                          ? 'var(--shadow-text-primary)'
                          : 'var(--shadow-text-tertiary)',
                      }}
                    >
                      {t(`libraryPage.${TOP_TAB_LABEL_KEYS[tab]}`)}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={handleAction}
                className="shrink-0 pb-3 text-[13px] font-semibold transition"
                style={{ color: 'var(--shadow-text-secondary)' }}
              >
                {actionText}
              </button>
            </div>

            <p
              className="pb-4 pt-2 text-[12px] sm:text-[13px]"
              style={{ color: 'var(--shadow-text-secondary)' }}
            >
              {subtitle}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {currentTypeTabs.map((type) => {
                const active = type === activeType

                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className="shrink-0 rounded-full border px-4 py-1.5 text-[12px] font-bold transition-colors"
                    style={{
                      background: active
                        ? 'var(--shadow-text-primary)'
                        : 'var(--shadow-bg-soft)',
                      borderColor: active
                        ? 'var(--shadow-text-primary)'
                        : 'var(--shadow-border)',
                      color: active
                        ? 'var(--shadow-bg-page)'
                        : 'var(--shadow-text-secondary)',
                      boxShadow: active
                        ? 'var(--shadow-shadow)'
                        : 'none',
                    }}
                  >
                    {t(`libraryPage.${TYPE_LABEL_KEYS[type]}`)}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-5">
          {message ? (
            <div
              className="mt-4 rounded-[18px] border px-4 py-3 text-[12px] font-bold"
              style={{
                background: 'rgba(229, 72, 77, 0.10)',
                borderColor: 'rgba(229, 72, 77, 0.18)',
                color: 'var(--shadow-danger)',
              }}
            >
              {message}
            </div>
          ) : null}

          {loading ? (
            <div className="pt-5">
              <div
                className="rounded-[24px] border px-5 py-10 text-center text-[13px] font-bold"
                style={{
                  background: 'var(--shadow-bg-elevated)',
                  borderColor: 'var(--shadow-border)',
                  color: 'var(--shadow-text-secondary)',
                }}
              >
                {t('libraryPage.loadingLibrary')}
              </div>
            </div>
          ) : !isLoggedIn ? (
            <div className="pt-5">
              <EmptyState
                title={t('libraryPage.loginLibrary')}
                text={t('libraryPage.loginLibraryText')}
                actionText={t('libraryPage.login')}
                onAction={() => navigate('/login')}
              />
            </div>
          ) : filteredItems.length ? (
            <>
              <ContextCard item={firstItem} tab={activeTab} />

              <section className="pt-7">
                <div className="mb-4 flex items-center justify-between">
                  <h2
                    className="text-[20px] font-extrabold tracking-tight"
                    style={{ color: 'var(--shadow-text-primary)' }}
                  >
                    {activeTab === 'Subscribed'
                      ? t('libraryPage.yourSubscriptions')
                      : activeTab === 'Downloads'
                        ? t('libraryPage.yourDownloads')
                        : t('libraryPage.yourLibrary')}
                  </h2>

                  {activeTab === 'Subscribed' ? (
                    <button
                      className="text-[11px] font-extrabold uppercase tracking-[0.12em]"
                      style={{ color: 'var(--shadow-text-primary)' }}
                    >
                      {t('libraryPage.seeAll')}
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {filteredItems.map((item) => (
                    <LibraryBookCard
                      key={item.id || item.story_id}
                      item={item}
                      tab={activeTab}
                    />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="pt-5">
              <EmptyState
                title={
                  activeTab === 'Subscribed'
                    ? t('libraryPage.noSubscriptions')
                    : activeTab === 'Downloads'
                      ? t('libraryPage.noDownloads')
                      : t('libraryPage.noSavedStories')
                }
                text={
                  activeTab === 'Subscribed'
                    ? t('libraryPage.noSubscriptionsText')
                    : activeTab === 'Downloads'
                      ? t('libraryPage.noDownloadsText')
                      : t('libraryPage.noSavedStoriesText')
                }
                actionText={t('libraryPage.browseStories')}
                onAction={() => navigate('/')}
              />
            </div>
          )}
        </main>

        {activeTab === 'Subscribed' && subscriptionItems.length ? (
          <SubscriptionsSection items={subscriptionItems} />
        ) : null}
      </div>

      <ReaderProfileFooter />
    </>
  )
}
