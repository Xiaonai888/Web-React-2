import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('subscriptionsPage', {
  en: {
    all: 'All',
    novel: 'Novel',
    chatStory: 'Chat Story',
    manga: 'Manga',
    backToLibrary: 'Back to library',
    title: 'Subscriptions',
    subtitle: 'Track new chapters from stories you follow.',
    recentUpdates: 'Recent Updates',
    allSubscribedStories: 'All Subscribed Stories',
    updatedHoursAgo: 'Updated {{hours}}h ago',
    updatedToday: 'Updated today',
    updatedYesterday: 'Updated yesterday',
    episodeReleased: 'Ep. {{count}} released',
    chatReleased: 'Chat {{count}} released',
    newEpisode: 'New Ep. {{count}}',
    newChat: 'New Chat {{count}}',
  },
  km: {
    all: 'ទាំងអស់',
    novel: 'ប្រលោមលោក',
    chatStory: 'Chat Story',
    manga: 'Manga',
    backToLibrary: 'ត្រឡប់ទៅបណ្ណាល័យ',
    title: 'ការតាមដាន',
    subtitle: 'តាមដានភាគថ្មីពីរឿងដែលអ្នកកំពុង Follow។',
    recentUpdates: 'អាប់ដេតថ្មីៗ',
    allSubscribedStories: 'រឿងដែលបាន Follow ទាំងអស់',
    updatedHoursAgo: 'បានអាប់ដេត {{hours}} ម៉ោងមុន',
    updatedToday: 'បានអាប់ដេតថ្ងៃនេះ',
    updatedYesterday: 'បានអាប់ដេតម្សិលមិញ',
    episodeReleased: 'ភាគ {{count}} បានចេញហើយ',
    chatReleased: 'Chat {{count}} បានចេញហើយ',
    newEpisode: 'ភាគថ្មី {{count}}',
    newChat: 'Chat ថ្មី {{count}}',
  },
  zh: {
    all: '全部',
    novel: '小说',
    chatStory: '聊天故事',
    manga: '漫画',
    backToLibrary: '返回书库',
    title: '订阅',
    subtitle: '跟踪你关注故事的新章节。',
    recentUpdates: '最近更新',
    allSubscribedStories: '全部订阅故事',
    updatedHoursAgo: '{{hours}} 小时前更新',
    updatedToday: '今天更新',
    updatedYesterday: '昨天更新',
    episodeReleased: '第 {{count}} 集已发布',
    chatReleased: '聊天 {{count}} 已发布',
    newEpisode: '新章节 {{count}}',
    newChat: '新聊天 {{count}}',
  },
  ja: {
    all: 'すべて',
    novel: '小説',
    chatStory: 'チャットストーリー',
    manga: 'マンガ',
    backToLibrary: 'ライブラリに戻る',
    title: '購読',
    subtitle: 'フォロー中のストーリーの新しいエピソードを確認できます。',
    recentUpdates: '最近の更新',
    allSubscribedStories: '購読中のすべてのストーリー',
    updatedHoursAgo: '{{hours}}時間前に更新',
    updatedToday: '今日更新',
    updatedYesterday: '昨日更新',
    episodeReleased: '第{{count}}話公開',
    chatReleased: 'チャット{{count}}公開',
    newEpisode: '新着 第{{count}}話',
    newChat: '新着 チャット{{count}}',
  },
  ko: {
    all: '전체',
    novel: '소설',
    chatStory: '채팅 스토리',
    manga: '만화',
    backToLibrary: '라이브러리로 돌아가기',
    title: '구독',
    subtitle: '팔로우한 스토리의 새 에피소드를 확인하세요.',
    recentUpdates: '최근 업데이트',
    allSubscribedStories: '구독한 모든 스토리',
    updatedHoursAgo: '{{hours}}시간 전에 업데이트',
    updatedToday: '오늘 업데이트',
    updatedYesterday: '어제 업데이트',
    episodeReleased: '{{count}}화 공개',
    chatReleased: '채팅 {{count}} 공개',
    newEpisode: '새 에피소드 {{count}}',
    newChat: '새 채팅 {{count}}',
  },
})

const typeTabs = ['All', 'Novel', 'Chat Story', 'Manga']

const TAB_LABEL_KEYS = {
  All: 'all',
  Novel: 'novel',
  'Chat Story': 'chatStory',
  Manga: 'manga',
}

const subscribedFeed = [
  {
    id: 501,
    title: 'Shadow Bride',
    author: 'Luna Hale',
    update: 'Updated 2h ago',
    episode: 'Ep. 26 released',
    image: '/assets/Shadow Exclusive/Shadow Exclusive 1.jpg',
  },
  {
    id: 502,
    title: 'Royal Scheme',
    author: 'Mira Voss',
    update: 'Updated today',
    episode: 'Ep. 13 released',
    image: '/assets/Shadow Exclusive/Shadow Exclusive 2.jpg',
  },
  {
    id: 503,
    title: 'Typing My Heart',
    author: 'Yuna K',
    update: 'Updated yesterday',
    episode: 'Chat 44 released',
    image: '/assets/Shadow Exclusive/Shadow Exclusive 3.jpg',
  },
]

const subscribedBooks = [
  { id: 501, title: 'Shadow Bride', type: 'Novel', info: 'New Ep. 26', image: '/assets/Shadow Exclusive/Shadow Exclusive 1.jpg' },
  { id: 502, title: 'Royal Scheme', type: 'Novel', info: 'New Ep. 13', image: '/assets/Shadow Exclusive/Shadow Exclusive 2.jpg' },
  { id: 503, title: 'Typing My Heart', type: 'Chat Story', info: 'New Chat 44', image: '/assets/Shadow Exclusive/Shadow Exclusive 3.jpg' },
  { id: 504, title: 'My Princess Roommate', type: 'Manga', info: 'New Ep. 9', image: '/assets/Shadow Exclusive/Shadow Exclusive 4.jpg' },
  { id: 505, title: 'CEO in the Rain', type: 'Novel', info: 'New Ep. 17', image: '/assets/Shadow Exclusive/Shadow Exclusive 5.jpg' },
  { id: 506, title: 'Under the Same Rain', type: 'Manga', info: 'New Ep. 21', image: '/assets/Shadow Exclusive/Shadow Exclusive 6.jpg' },
  { id: 507, title: 'The Quiet Engagement', type: 'Novel', info: 'New Ep. 11', image: '/assets/Trending%20Now/Trending%207.jpg' },
  { id: 508, title: 'Chat After Midnight', type: 'Chat Story', info: 'New Chat 12', image: '/assets/Trending%20Now/Trending%208.jpg' },
  { id: 509, title: 'Campus Bloom', type: 'Manga', info: 'New Ep. 5', image: '/assets/Trending%20Now/Trending%209.jpg' },
  { id: 510, title: 'Promise in Winter', type: 'Novel', info: 'New Ep. 30', image: '/assets/Trending%20Now/Trending%2010.jpg' },
  { id: 511, title: 'My Soft Villain', type: 'Novel', info: 'New Ep. 22', image: '/assets/Trending%20Now/Trending%2011.jpg' },
  { id: 512, title: 'Unread Feelings', type: 'Chat Story', info: 'New Chat 7', image: '/assets/Trending%20Now/Trending%2012.jpg' },
]

function getFeedUpdateLabel(value, t) {
  const text = String(value || '')
  const hoursMatch = text.match(/^Updated (\d+)h ago$/)

  if (hoursMatch) {
    return t('subscriptionsPage.updatedHoursAgo', {
      hours: Number(hoursMatch[1]),
    })
  }

  if (text === 'Updated today') {
    return t('subscriptionsPage.updatedToday')
  }

  if (text === 'Updated yesterday') {
    return t('subscriptionsPage.updatedYesterday')
  }

  return value
}

function getFeedEpisodeLabel(value, t) {
  const text = String(value || '')
  const episodeMatch = text.match(/^Ep\. (\d+) released$/)
  const chatMatch = text.match(/^Chat (\d+) released$/)

  if (episodeMatch) {
    return t('subscriptionsPage.episodeReleased', {
      count: Number(episodeMatch[1]),
    })
  }

  if (chatMatch) {
    return t('subscriptionsPage.chatReleased', {
      count: Number(chatMatch[1]),
    })
  }

  return value
}

function getBookInfoLabel(value, t) {
  const text = String(value || '')
  const episodeMatch = text.match(/^New Ep\. (\d+)$/)
  const chatMatch = text.match(/^New Chat (\d+)$/)

  if (episodeMatch) {
    return t('subscriptionsPage.newEpisode', {
      count: Number(episodeMatch[1]),
    })
  }

  if (chatMatch) {
    return t('subscriptionsPage.newChat', {
      count: Number(chatMatch[1]),
    })
  }

  return value
}

function SubscriptionGridCard({ book }) {
  const { t } = useDisplayTranslation()

  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="overflow-hidden rounded-2xl bg-[#efefef] shadow-sm dark:bg-[var(--shadow-bg-elevated)]">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      </div>

      <div className="pt-2.5">
        <h4 className="line-clamp-1 text-[12px] font-extrabold tracking-tight text-[#111] sm:text-[13px] dark:text-[var(--shadow-text-primary)]">
          {book.title}
        </h4>
        <p className="mt-1 text-[10px] font-medium text-[#8d8d8d] sm:text-[11px] dark:text-[var(--shadow-text-secondary)]">
          {getBookInfoLabel(book.info, t)}
        </p>
      </div>
    </Link>
  )
}

export default function SubscriptionsPage() {
  const { t } = useDisplayTranslation()
  const [activeType, setActiveType] = useState('All')

  const filteredFeed = useMemo(() => {
    if (activeType === 'All') return subscribedFeed

    const typeMap = Object.fromEntries(
      subscribedBooks.map((book) => [book.id, book.type])
    )
    return subscribedFeed.filter(
      (item) => typeMap[item.id] === activeType
    )
  }, [activeType])

  const filteredBooks = useMemo(() => {
    if (activeType === 'All') return subscribedBooks
    return subscribedBooks.filter(
      (book) => book.type === activeType
    )
  }, [activeType])

  return (
    <div className="app-page min-h-screen bg-white pb-[88px] dark:bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-[60] border-b border-[#f3f3f3] bg-white/95 backdrop-blur-sm dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="px-4 py-5 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/library"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5 dark:text-[var(--shadow-text-primary)] dark:hover:bg-[var(--shadow-bg-hover)]"
                aria-label={t('subscriptionsPage.backToLibrary')}
              >
                <i className="fas fa-chevron-left text-[14px]" />
              </Link>

              <div>
                <h1 className="text-[20px] font-extrabold tracking-tight text-[#111] dark:text-[var(--shadow-text-primary)]">
                  {t('subscriptionsPage.title')}
                </h1>
                <p className="mt-1 text-[12px] text-[#8b8b95] sm:text-[13px] dark:text-[var(--shadow-text-secondary)]">
                  {t('subscriptionsPage.subtitle')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
            {typeTabs.map((type) => {
              const active = type === activeType

              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold transition-colors ${
                    active
                      ? 'bg-[#ff3b5c] text-white shadow-[0_8px_18px_rgba(255,59,92,0.18)]'
                      : 'bg-[#f3f3f5] text-[#7b7b85] hover:bg-[#ececef] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)] dark:hover:bg-[var(--shadow-bg-hover)]'
                  }`}
                >
                  {t(
                    `subscriptionsPage.${TAB_LABEL_KEYS[type]}`
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-5">
        <section className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-tight text-[#111] dark:text-[var(--shadow-text-primary)]">
              {t('subscriptionsPage.recentUpdates')}
            </h2>
          </div>

          <div className="space-y-3">
            {filteredFeed.map((item) => (
              <Link
                key={item.id}
                to={`/story/${item.id}`}
                className="flex items-start gap-4 rounded-2xl border border-[#f1f1f1] bg-white p-4 transition hover:bg-[#fafafa] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:hover:bg-[var(--shadow-bg-hover)]"
              >
                <div className="w-[64px] shrink-0 overflow-hidden rounded-xl bg-[#efefef] dark:bg-[var(--shadow-bg-elevated)]">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-[14px] font-extrabold text-[#111] dark:text-[var(--shadow-text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#8d8d95] dark:text-[var(--shadow-text-secondary)]">
                    {item.author}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#5f78ff]">
                    {getFeedEpisodeLabel(item.episode, t)}
                  </p>
                </div>

                <div className="shrink-0 text-[11px] font-medium text-[#a0a0a8] dark:text-[var(--shadow-text-tertiary)]">
                  {getFeedUpdateLabel(item.update, t)}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-tight text-[#111] dark:text-[var(--shadow-text-primary)]">
              {t('subscriptionsPage.allSubscribedStories')}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-4 md:gap-y-0">
            {filteredBooks.map((book) => (
              <SubscriptionGridCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
