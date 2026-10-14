import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import OfflinePdfSaveButton from '../components/library/OfflinePdfSaveButton'
import LibraryDownloadsSections from '../components/library/LibraryDownloadsSections'
import { isReaderOffline } from '../utils/readerOfflineControl'
import { getOfflineReaderAccountId } from '../utils/offlineReaderContent'
import { listOfflineEpisodes } from '../utils/offlineReadingStorage'
import useReaderLibraryFeed from '../hooks/useReaderLibraryFeed'
import ReaderSubscriptionBadge from '../components/library/ReaderSubscriptionBadge'
import { getStoryBadge } from '../utils/storyBadge'
import { loadReaderLibraryFeedCache, invalidateReaderLibraryFeedCache } from '../utils/readerLibraryFeedCache'

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
    recentsSubtitle: "Stories you've recently read appear here.",
    endEpisode: 'End Ep. {{count}}',
    recentEpisode: 'Ep. {{count}}',
    completed: 'Completed',
    new: 'NEW',
    up: 'UP',
    subscribedSubtitle: 'Follow the latest updates from stories you love.',
    downloadsSubtitle: 'Your purchased books and saved stories.',
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
    clearConfirm: 'Clear your recently read list? Your reading progress and bookmarks will be kept.',
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
    noSavedStories: 'No recently read stories yet',
    noSubscriptionsText: 'Tap the heart button on a story to follow its updates.',
    noDownloadsText: 'Purchased PDFs will appear here after payment.',
    noSavedStoriesText: 'Stories you start reading will appear here.',
    browseStories: 'Browse Stories',
    offlineAvailable: 'Offline • {{count}} Ep',
    internetRequired: 'Internet required',
    retry: 'Try again',
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
    recentsSubtitle: 'រឿងដែលអ្នកបានអានថ្មីៗ នឹងបង្ហាញនៅទីនេះ។',
    endEpisode: 'ចប់ Ep. {{count}}',
    recentEpisode: 'Ep. {{count}}',
    completed: 'រឿងចប់',
    new: 'ថ្មី',
    up: 'អាប់ដេត',
    subscribedSubtitle: 'តាមដាន Update ថ្មីៗពីរឿងដែលអ្នកចូលចិត្ត។',
    downloadsSubtitle: 'សៀវភៅដែលបានទិញ និងរឿងដែលបានទាញយករបស់អ្នក។',
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
    clearConfirm: 'សម្អាតបញ្ជីរឿងដែលបានអានថ្មីៗ? Reading Progress និង Bookmark នឹងរក្សាទុកដដែល។',
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
    noSavedStories: 'មិនទាន់មានរឿងដែលបានអាន',
    noSubscriptionsText: 'ចុចប៊ូតុងបេះដូងលើរឿង ដើម្បីតាមដាន Update។',
    noDownloadsText: 'PDF ដែលបានទិញនឹងបង្ហាញនៅទីនេះបន្ទាប់ពីការទូទាត់។',
    noSavedStoriesText: 'រឿងដែលអ្នកចាប់ផ្តើមអាន នឹងបង្ហាញនៅទីនេះ។',
    browseStories: 'រកមើលរឿង',
    offlineAvailable: 'Offline • {{count}} ភាគ',
    internetRequired: 'ត្រូវការអ៊ីនធឺណិត',
    retry: 'ព្យាយាមម្តងទៀត',
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
    recentsSubtitle: '你最近阅读过的作品会显示在这里。',
    endEpisode: '完结 Ep. {{count}}',
    recentEpisode: 'Ep. {{count}}',
    completed: '已完结',
    new: '新',
    up: '更新',
    subscribedSubtitle: '关注你喜欢的故事的最新更新。',
    downloadsSubtitle: '您购买的图书和保存的作品。',
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
    clearConfirm: '清除最近阅读记录？阅读进度和书签将保留。',
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
    noSavedStories: '暂无最近阅读的作品',
    noSubscriptionsText: '点击故事上的心形按钮即可关注更新。',
    noDownloadsText: '购买的 PDF 会在付款后显示在这里。',
    noSavedStoriesText: '开始阅读的作品会显示在这里。',
    browseStories: '浏览故事',
    offlineAvailable: '离线 • {{count}} 章',
    internetRequired: '需要互联网',
    retry: '重试',
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
    recentsSubtitle: '最近読んだ作品がここに表示されます。',
    endEpisode: '完結 Ep. {{count}}',
    recentEpisode: 'Ep. {{count}}',
    completed: '完結',
    new: '新着',
    up: '更新',
    subscribedSubtitle: 'お気に入りのストーリーの最新更新をフォローします。',
    downloadsSubtitle: '購入した本と保存した作品です。',
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
    clearConfirm: '最近読んだ作品の一覧を消去しますか？読書の進捗とブックマークは保持されます。',
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
    noSavedStories: '最近読んだ作品はありません',
    noSubscriptionsText: 'ストーリーのハートボタンを押して更新をフォローできます。',
    noDownloadsText: '購入した PDF は支払い後にここへ表示されます。',
    noSavedStoriesText: '読み始めた作品がここに表示されます。',
    browseStories: 'ストーリーを見る',
    offlineAvailable: 'オフライン • {{count}} 話',
    internetRequired: 'インターネットが必要です',
    retry: '再試行',
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
    recentsSubtitle: '최근 읽은 작품이 여기에 표시됩니다.',
    endEpisode: '완결 Ep. {{count}}',
    recentEpisode: 'Ep. {{count}}',
    completed: '완결',
    new: '신규',
    up: '업데이트',
    subscribedSubtitle: '좋아하는 스토리의 최신 업데이트를 확인하세요.',
    downloadsSubtitle: '구매한 도서와 저장한 작품입니다.',
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
    clearConfirm: '최근 읽은 목록을 지울까요? 읽기 진행 상황과 북마크는 유지됩니다.',
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
    noSavedStories: '최근 읽은 작품이 없습니다',
    noSubscriptionsText: '스토리의 하트 버튼을 눌러 업데이트를 구독하세요.',
    noDownloadsText: '구매한 PDF는 결제 후 여기에 표시됩니다.',
    noSavedStoriesText: '읽기 시작한 작품이 여기에 표시됩니다.',
    browseStories: '스토리 둘러보기',
    offlineAvailable: '오프라인 • {{count}}화',
    internetRequired: '인터넷 연결 필요',
    retry: '다시 시도',
  },
})

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function formatDisplayNumber(value) {
  const number = Number(value || 0)
  const locale = DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
  return new Intl.NumberFormat(locale).format(Number.isFinite(number) ? number : 0)
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const topTabs = ['Recents', 'Subscribed', 'Downloads']
const storyTypeTabs = ['All', 'Novel', 'Chat Story', 'Manga']

const storyBadgeClass = {
  new: 'bg-[#FF4D6D] text-white',
  up: 'bg-[#F6B800] text-[#111827]',
  end: 'bg-[#16A34A] text-white',
}

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
  Completed: 'completed',
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
  const rule = String(value || '').toLowerCase().replace(/[_-]/g, ' ')

  if (/\b(?:no|not|without)\s+download\b|\bread\s+only\b|\bonline\s+only\b/.test(rule)) return 'read_only'
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

function canSavePdfOffline(story) {
  const rule = String(story?.access_rule || '').toLowerCase().replace(/[_-]/g, ' ')
  return Boolean(story?.id && story?.pdf_file_url) && /\bdownload\b/.test(rule) &&
    !/\b(?:no|not|without)\s+download\b|\bread\s+only\b|\bonline\s+only\b/.test(rule)
}

function getStoryType(story) {
  const type = String(story?.story_type || '').trim().toLowerCase().replace(/[\s-]+/g, '_')
  if (type === 'chat_story' || type === 'chatstory') return 'Chat Story'
  if (type === 'manga') return 'Manga'
  if (type === 'novel') return 'Novel'

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
    return t(story?.status === 'completed' ? 'libraryPage.endEpisode' : 'libraryPage.newEpisode', {
      count: formatDisplayNumber(story?.total_episodes || 0),
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

  return t('libraryPage.recentEpisode', {
    count: formatDisplayNumber(story?.last_read_episode_number || 0),
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

const LIBRARY_SNAPSHOT_PREFIX = 'shadow_library_snapshot_v2'
const LIBRARY_SCROLL_PREFIX = 'shadow_reader_library_scroll_v1'

function librarySnapshotKey(accountId, tab) {
  return `${LIBRARY_SNAPSHOT_PREFIX}:${accountId}:${tab.toLowerCase()}`
}

function compactLibraryItems(items) {
  if (!Array.isArray(items)) return []

  return items
    .filter((item) => item?.story)
    .map((item) => ({
      id: item.id,
      story_id: item.story_id || item.story?.id,
      kind: item.kind,
      story: {
        id: item.story?.id,
        title: item.story?.title,
        description: item.story?.description,
        cover_url: item.story?.cover_url,
        main_genre: item.story?.main_genre,
        total_episodes: item.story?.total_episodes,
        last_read_episode_number: item.story?.last_read_episode_number,
        story_type: item.story?.story_type,
        status: item.story?.status,
        updated_at: item.story?.updated_at,
      },
    }))
}

function readLibrarySnapshot(accountId, tab) {
  if (!accountId || !['Recents', 'Subscribed'].includes(tab)) return []

  try {
    const value = JSON.parse(
      localStorage.getItem(librarySnapshotKey(accountId, tab)) || 'null'
    )

    return Array.isArray(value?.items) ? value.items : []
  } catch {
    return []
  }
}

function writeLibrarySnapshot(accountId, tab, items) {
  if (!accountId || !['Recents', 'Subscribed'].includes(tab)) return

  try {
    localStorage.setItem(
      librarySnapshotKey(accountId, tab),
      JSON.stringify({
        items: compactLibraryItems(items),
        savedAt: Date.now(),
      })
    )
  } catch {
  }
}

function buildOfflineStoryIndex(records) {
  const index = {}

  for (const record of Array.isArray(records) ? records : []) {
    const storyId = String(record?.storyId || '').trim()
    const episodeId = String(record?.episodeId || '').trim()
    if (!storyId || !episodeId) continue

    if (!index[storyId]) {
      index[storyId] = {
        episodeId,
        count: 0,
        savedAt: Number(record.savedAt || 0),
      }
    }

    index[storyId].count += 1

    if (Number(record.savedAt || 0) > index[storyId].savedAt) {
      index[storyId].episodeId = episodeId
      index[storyId].savedAt = Number(record.savedAt || 0)
    }
  }

  return index
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
          loading="lazy"
          decoding="async"
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
      {canSavePdfOffline(story) ? <OfflinePdfSaveButton pdfId={story.id} /> : null}
    </div>
  )
}

function LibraryBookCard({
  item,
  tab,
  offlineMode = false,
  offlineInfo = null,
  onOfflineUnavailable,
}) {
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

  const offlineTarget = offlineInfo?.episodeId
    ? `/story/${encodeURIComponent(story.id)}/episode/${encodeURIComponent(offlineInfo.episodeId)}?_shadow_offline=1`
    : `/story/${story.id}`

  return (
    <Link
      to={offlineMode ? offlineTarget : `/story/${story.id}`}
      onClick={(event) => {
        if (offlineMode && !offlineInfo?.episodeId) {
          event.preventDefault()
          onOfflineUnavailable?.()
        }
      }}
      className="group block min-w-0"
    >
      <div
        className="relative overflow-hidden rounded-[8px]"
        style={{ background: 'var(--shadow-bg-soft)' }}
      >
        <div className="aspect-[2/3] overflow-hidden">
          <StoryCover story={story} className="h-full w-full" />
        </div>

        {getStoryBadge(story) ? (
          <span
            className={`pointer-events-none absolute left-0 top-0 rounded-br-[7px] px-2 py-1 text-[10px] font-extrabold leading-none ${storyBadgeClass[getStoryBadge(story)]}`}
          >
            {t(`libraryPage.${getStoryBadge(story)}`)}
          </span>
        ) : null}
        {tab === 'Subscribed' && !offlineMode && Number(item.unread_episode_count || 0) > 0 ? (
          <ReaderSubscriptionBadge
            unreadCount={item.unread_episode_count}
            showUpdateLabel={false}
          />
        ) : null}
        {offlineMode && offlineInfo?.count ? (
          <div className="absolute right-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[9px] font-extrabold text-white shadow-sm">
            {t('libraryPage.offlineAvailable', {
              count: formatDisplayNumber(offlineInfo.count),
            })}
          </div>
        ) : null}
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
          {offlineMode
            ? offlineInfo?.count
              ? t('libraryPage.offlineAvailable', {
                  count: formatDisplayNumber(offlineInfo.count),
                })
              : t('libraryPage.internetRequired')
            : formatInfo(tab, story, t)}
        </p>
      </div>
    </Link>
  )
}

function ContextCard({
  item,
  tab,
  offlineMode = false,
  offlineInfo = null,
  onOfflineUnavailable,
}) {
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
        to={
          offlineMode && offlineInfo?.episodeId
            ? `/story/${encodeURIComponent(story.id)}/episode/${encodeURIComponent(offlineInfo.episodeId)}?_shadow_offline=1`
            : `/story/${story.id}`
        }
        onClick={(event) => {
          if (offlineMode && !offlineInfo?.episodeId) {
            event.preventDefault()
            onOfflineUnavailable?.()
          }
        }}
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
                  count: formatDisplayNumber(story.total_episodes || 0),
                })}
            </p>

            <p
              className="mt-2 text-[11px] font-extrabold sm:text-[12px]"
              style={{ color: 'var(--shadow-text-primary)' }}
            >
              {offlineMode
                ? offlineInfo?.count
                  ? t('libraryPage.offlineAvailable', {
                      count: formatDisplayNumber(offlineInfo.count),
                    })
                  : t('libraryPage.internetRequired')
                : formatInfo(tab, story, t)}
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
  const location = useLocation()
  const locationParams = new URLSearchParams(location.search)
  const meLibrarySource = locationParams.get('source') === 'me'
  const offlineRequested = locationParams.get('_shadow_offline') === '1'
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] = useState(() =>
    offlineRequested || isReaderOffline() || locationParams.get('tab') === 'downloads'
      ? 'Downloads'
      : 'Subscribed'
  )
  const [activeType, setActiveType] = useState('All')
  const [downloadItems, setDownloadItems] = useState([])
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [clearing, setClearing] = useState(false)
  const [offline, setOffline] = useState(() => isReaderOffline())
  const [offlineStoryIndex, setOfflineStoryIndex] = useState({})
  const [downloadRevision, setDownloadRevision] = useState(0)
  const downloadedRef = useRef(false)
  const downloadAccountRef = useRef('')
  const clearInProgressRef = useRef(false)
  const lastRestoredScrollKeyRef = useRef('')
  const isLoggedIn = Boolean(getReaderToken())
  const accountId = getOfflineReaderAccountId()
  const feedType = activeType === 'Chat Story'
    ? 'chat_story'
    : activeType.toLowerCase()
  const feedTab = activeTab === 'Recents'
    ? 'recents'
    : 'subscribed'
  const feed = useReaderLibraryFeed({
    accountId,
    tab: feedTab,
    type: feedType,
    enabled: isLoggedIn && !offline && activeTab !== 'Downloads',
  })

  useEffect(() => {
    const syncConnection = () => {
      const nextOffline = isReaderOffline()
      setOffline(nextOffline)
      if (nextOffline) downloadedRef.current = false
      if (!nextOffline && offlineRequested) {
        const params = new URLSearchParams(location.search)
        params.delete('_shadow_offline')
        const search = params.toString()
        navigate(`${location.pathname}${search ? `?${search}` : ''}${location.hash || ''}`, { replace: true })
      }
    }
    syncConnection()
    window.addEventListener('online', syncConnection)
    window.addEventListener('offline', syncConnection)
    window.addEventListener('shadow-offline-control-change', syncConnection)
    return () => {
      window.removeEventListener('online', syncConnection)
      window.removeEventListener('offline', syncConnection)
      window.removeEventListener('shadow-offline-control-change', syncConnection)
    }
  }, [offlineRequested, location.pathname, location.search, location.hash, navigate])

  useEffect(() => {
    if (downloadAccountRef.current === accountId) return

    downloadAccountRef.current = accountId
    downloadedRef.current = false
    setDownloadItems([])
    setDownloadLoading(false)
  }, [accountId])

  useEffect(() => {
    if (activeTab !== 'Downloads' || offline || !isLoggedIn || downloadedRef.current) return undefined
    const controller = new AbortController()
    let active = true
    setDownloadLoading(true)
    async function loadDownloads() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/author-store/downloads/my`,
          {
            headers: getHeaders(),
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || t('libraryPage.loadDownloadsFailed')
          )
        }
        if (!active) return
        setDownloadItems(formatDownloadItems(data.downloads))
        downloadedRef.current = true
      } catch (error) {
        if (active) {
          setMessage(error?.message || t('libraryPage.loadDownloadsFailed'))
        }
      } finally {
        if (active) setDownloadLoading(false)
      }
    }
    void loadDownloads()
    return () => {
      active = false
      controller.abort()
    }
  }, [activeTab, offline, isLoggedIn, accountId, downloadRevision])

  useEffect(() => {
    let active = true
    async function loadOfflineIndex() {
      if (!accountId) {
        if (active) setOfflineStoryIndex({})
        return
      }
      try {
        const records = await listOfflineEpisodes({ accountId })
        if (active) setOfflineStoryIndex(buildOfflineStoryIndex(records))
      } catch {
        if (active) setOfflineStoryIndex({})
      }
    }
    void loadOfflineIndex()
    const refresh = () => {
      if (document.visibilityState !== 'hidden') {
        void loadOfflineIndex()
      }
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      active = false
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [accountId])

  const offlineItems = useMemo(() => {
    if (!offline || !accountId || activeTab === 'Downloads') return []

    const tab = activeTab === 'Recents' ? 'recents' : 'subscribed'
    const cache = loadReaderLibraryFeedCache({ accountId, tab, type: feedType })
    if (cache) return cache.items

    const snapshot = readLibrarySnapshot(accountId, activeTab)
    if (activeType === 'All') return snapshot

    return snapshot.filter((item) => getStoryType(item.story) === activeType)
  }, [offline, accountId, activeTab, activeType, feedType])

  const filteredItems = activeTab === 'Downloads'
    ? downloadItems
    : offline
      ? offlineItems
      : feed.items
  const loadingCurrent = activeTab === 'Downloads'
    ? downloadLoading
    : !offline && feed.loading && feed.items.length === 0
  const actionText = getActionText(activeTab, t)
  const subtitle = getSubtitle(activeTab, t)
  const moreLabels = {
    en: 'Load 9 More',
    km: 'បង្ហាញ ៩ រឿងទៀត',
    zh: '再加载9本',
    ja: 'さらに9作品を読み込む',
    ko: '9개 더 불러오기',
  }
  const moreLabel = moreLabels[getDisplayLanguageId()] || moreLabels.en
  const ongoingSubscriptionCount = feed.ongoingSubscriptionCount ||
    loadReaderLibraryFeedCache({ accountId, tab: 'subscribed', type: 'all' })?.ongoingSubscriptionCount || 0
  const visibleTypeTabs = activeTab === 'Subscribed' && ongoingSubscriptionCount >= 27
    ? [...storyTypeTabs, 'Completed']
    : storyTypeTabs
  const unreadCounts = feed.unreadStoryCounts ||
    loadReaderLibraryFeedCache({
      accountId,
      tab: 'subscribed',
      type: 'all',
    })?.unreadStoryCounts || null
  const displayError = message || (
    activeTab === 'Downloads' || offline ? '' : feed.error
  )
  const scrollKey = `${LIBRARY_SCROLL_PREFIX}:${accountId}:${activeTab}:${feedType}`

  useEffect(() => {
    if (!accountId) return undefined

    let saveTimeout = null
    const savePosition = () => {
      if (saveTimeout !== null) return
      saveTimeout = window.setTimeout(() => {
        saveTimeout = null
        try {
          sessionStorage.setItem(scrollKey, String(window.scrollY))
        } catch {}
      }, 200)
    }

    window.addEventListener('scroll', savePosition, { passive: true })
    return () => {
      window.removeEventListener('scroll', savePosition)
      if (saveTimeout !== null) window.clearTimeout(saveTimeout)
      try {
        sessionStorage.setItem(scrollKey, String(window.scrollY))
      } catch {}
    }
  }, [accountId, scrollKey])

  useEffect(() => {
    lastRestoredScrollKeyRef.current = ''
  }, [scrollKey])

  useEffect(() => {
    if (!accountId || loadingCurrent || !filteredItems.length) return undefined
    if (lastRestoredScrollKeyRef.current === scrollKey) return undefined
    lastRestoredScrollKeyRef.current = scrollKey

    let value = null
    try {
      value = sessionStorage.getItem(scrollKey)
    } catch {}
    const savedPosition = Number(value)
    if (value === null || !Number.isFinite(savedPosition) || savedPosition <= 0) return undefined

    let secondFrame = null
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: savedPosition, behavior: 'auto' })
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      if (secondFrame !== null) window.cancelAnimationFrame(secondFrame)
    }
  }, [accountId, scrollKey, loadingCurrent, filteredItems.length])

  const handleClear = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (
      activeTab !== 'Recents' ||
      clearInProgressRef.current ||
      offline
    ) {
      return
    }

    if (!window.confirm(t('libraryPage.clearConfirm'))) return

    clearInProgressRef.current = true
    setClearing(true)
    setMessage('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reader/library/recents/clear`,
        {
          method: 'DELETE',
          headers: getHeaders(),
          cache: 'no-store',
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok !== true) {
        throw new Error(data.message || 'LIBRARY_CLEAR_FAILED')
      }

      invalidateReaderLibraryFeedCache({
        accountId,
        tab: 'recents',
      })

      try {
        localStorage.removeItem(librarySnapshotKey(accountId, 'Recents'))
      } catch {}
    } catch {
      setMessage(t('libraryPage.clearFailed'))
    } finally {
      clearInProgressRef.current = false
      setClearing(false)
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

      <div className="app-page min-h-screen bg-[var(--shadow-bg-surface)] pb-[88px]">
        <header className="app-nav sticky top-0 z-[60] border-b backdrop-blur-sm">
          <div className="px-4 pt-5 sm:px-5">
            <div className="flex items-end justify-between gap-4">
              <div className="flex min-w-0 items-end gap-5 overflow-x-auto no-scrollbar">
                {topTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab)
                      setActiveType('All')
                      setMessage('')
                    }}
                    className={`relative shrink-0 pb-3 text-[13px] font-bold transition-colors sm:text-[14px] ${
                      tab === activeTab ? 'tab-active-lib' : ''
                    }`}
                    style={{
                      color: tab === activeTab
                        ? 'var(--shadow-text-primary)'
                        : 'var(--shadow-text-tertiary)',
                    }}
                  >
                    {t(`libraryPage.${TOP_TAB_LABEL_KEYS[tab]}`)}
                  </button>
                ))}
              </div>

              {activeTab !== 'Downloads' ? (
                <button
                  type="button"
                  onClick={activeTab === 'Subscribed'
                    ? () => navigate(
                      meLibrarySource
                        ? '/library/manage?source=me'
                        : '/library/manage'
                    )
                    : handleClear}
                  disabled={clearing || offline}
                  className={`shrink-0 pb-3 text-[13px] font-semibold transition ${offline ? 'cursor-not-allowed opacity-40' : ''}`}
                  style={{ color: 'var(--shadow-text-secondary)' }}
                >
                  {actionText}
                </button>
              ) : null}
            </div>

            <p
              className="pb-4 pt-2 text-[12px] sm:text-[13px]"
              style={{ color: 'var(--shadow-text-secondary)' }}
            >
              {subtitle}
            </p>

            {activeTab !== 'Downloads' ? (
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {visibleTypeTabs.map((type) => {
                  const selected = type === activeType
                  const key = type === 'Chat Story' ? 'chat_story' : type.toLowerCase()
                  const count = activeTab === 'Subscribed' && unreadCounts
                    ? Math.max(0, Number(unreadCounts[key] || 0))
                    : null
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveType(type)}
                      className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[var(--shadow-bg-soft)] ${
                        selected ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]' : 'bg-transparent text-[var(--shadow-text-tertiary)]'
                      }`}
                    >
                      {t(`libraryPage.${TYPE_LABEL_KEYS[type]}`)}
                      {count !== null && count > 0 ? (
                        <span className="ml-1.5 rounded-full bg-[#ef4444] px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">
                          {count > 99 ? '99+' : formatDisplayNumber(count)}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </header>

        <main className="px-4 sm:px-5">
          {displayError ? (
            <div
              className="mt-4 rounded-[18px] border px-4 py-3 text-[12px] font-bold"
              style={{
                background: 'rgba(229, 72, 77, 0.10)',
                borderColor: 'rgba(229, 72, 77, 0.18)',
                color: 'var(--shadow-danger)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0">{displayError}</span>
                {!offline ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMessage('')
                      if (activeTab === 'Downloads') {
                        downloadedRef.current = false
                        setDownloadRevision((value) => value + 1)
                      } else if (feed.items.length && feed.hasMore) {
                        void feed.loadMore()
                      } else {
                        void feed.refresh()
                      }
                    }}
                    className="shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-extrabold"
                    style={{
                      borderColor: 'var(--shadow-danger)',
                      color: 'var(--shadow-danger)',
                    }}
                  >
                    {t('libraryPage.retry')}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeTab === 'Downloads' ? (
            <LibraryDownloadsSections
              purchases={downloadItems}
              loading={downloadLoading}
              isLoggedIn={isLoggedIn}
              offlineMode={offline}
            />
          ) : loadingCurrent ? (
            <div className="pt-5">
              <div
                className="rounded-[24px] border px-5 py-10 text-center text-[13px] font-bold"
                style={{
                  background: 'var(--shadow-bg-surface)',
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
            <section className="pt-4">
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {filteredItems.map((item) => (
                  <div key={item.id || item.story_id} className="relative min-w-0">
                    <LibraryBookCard
                      item={item}
                      tab={activeTab}
                      offlineMode={offline}
                      offlineInfo={offlineStoryIndex[String(item?.story?.id || '')] || null}
                      onOfflineUnavailable={() => setMessage(t('libraryPage.internetRequired'))}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : !displayError ? (
            <div className="pt-5">
              <EmptyState
                title={activeTab === 'Subscribed' ? t('libraryPage.noSubscriptions') : t('libraryPage.noSavedStories')}
                text={activeTab === 'Subscribed' ? t('libraryPage.noSubscriptionsText') : t('libraryPage.noSavedStoriesText')}
                actionText={offline ? '' : t('libraryPage.browseStories')}
                  onAction={() => {
                    if (!offline) navigate('/')
                  }}
              />
            </div>
          ) : null}

          {!offline && activeTab !== 'Downloads' && feed.hasMore ? (
            <div className="flex justify-center py-7" ref={feed.sentinelRef}>
              {feed.loadingMore ? (
                <span className="text-[12px] font-semibold" style={{ color: 'var(--shadow-text-secondary)' }}>
                  {t('libraryPage.loadingLibrary')}
                </span>
              ) : feed.showManualLoad || feed.error ? (
                <button
                  type="button"
                  onClick={() => void feed.loadMore()}
                  className="rounded-full border px-5 py-2.5 text-[12px] font-extrabold"
                  style={{
                    background: 'var(--shadow-bg-surface)',
                    borderColor: 'var(--shadow-border)',
                    color: 'var(--shadow-text-primary)',
                  }}
                >
                  {moreLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>

      {!meLibrarySource && !offline && <ReaderProfileFooter />}
    </>
  )
}
