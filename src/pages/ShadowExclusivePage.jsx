import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addStoryLanguageParam,
  getStoryLanguageId,
} from '../utils/storyLanguage'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shadowExclusivePage', {
  en: {
    adsFree: 'Ads-Free',
    adsFreeSubtitle: 'No interruptions while reading',
    premiumStories: 'Premium Stories',
    premiumStoriesSubtitle: 'Approved by Shadow',
    earlyAccess: 'Early Access',
    earlyAccessSubtitle: 'Read selected releases first',
    shadowPicks: 'Shadow Picks',
    shadowPicksSubtitle: 'Carefully selected stories for premium members',
    newExclusive: 'New Exclusive',
    newExclusiveSubtitle: 'Fresh premium stories recently approved',
    popularExclusive: 'Popular Exclusive',
    popularExclusiveSubtitle: 'Premium stories readers open the most',
    editorPick: 'Editor Pick',
    editorPickSubtitle: 'Admin-curated premium recommendations',
    premiumRomance: 'Premium Romance',
    premiumRomanceSubtitle: 'Exclusive romance stories for members',
    premiumFantasy: 'Premium Fantasy',
    premiumFantasySubtitle: 'Exclusive fantasy stories for members',
    completedExclusive: 'Completed Exclusive',
    completedExclusiveSubtitle: 'Premium stories ready for binge reading',
    free: 'Free',
    noCover: 'No Cover',
    untitledStory: 'Untitled Story',
    upToEpisode: 'Up to Ep. {{count}}',
    premiumStory: 'Premium story',
    premium: 'Premium',
    emptySection: 'No approved stories in this section yet.',
    loadFailed: 'Failed to load Shadow Exclusive stories',
    popular: 'Popular',
    daily: 'Daily',
    weekly: 'Weekly',
    allTime: 'All Time',
    title: 'Shadow Exclusive',
    premiumSubscription: 'Premium Subscription',
    membershipLine1: 'Shadow',
    membershipLine2: 'Membership',
    membershipBody:
      'Unlock selected premium stories, enjoy ads-free reading, and get early access to internal releases.',
    subscribeNow: 'Subscribe Now',
    contactTitle: 'Got a question? Contact us',
    contactSubtitle: 'Premium support for Shadow members',
    support: 'Support',
  },
  km: {
    adsFree: 'គ្មានពាណិជ្ជកម្ម',
    adsFreeSubtitle: 'អានដោយគ្មានការរំខាន',
    premiumStories: 'រឿង Premium',
    premiumStoriesSubtitle: 'បានអនុម័តដោយ Shadow',
    earlyAccess: 'ចូលមើលមុន',
    earlyAccessSubtitle: 'អានការចេញផ្សាយដែលបានជ្រើសរើសមុនគេ',
    shadowPicks: 'Shadow ជ្រើសរើស',
    shadowPicksSubtitle: 'រឿងដែលបានជ្រើសរើសយ៉ាងពិសេសសម្រាប់សមាជិក Premium',
    newExclusive: 'Exclusive ថ្មី',
    newExclusiveSubtitle: 'រឿង Premium ថ្មីៗដែលទើបបានអនុម័ត',
    popularExclusive: 'Exclusive ពេញនិយម',
    popularExclusiveSubtitle: 'រឿង Premium ដែលអ្នកអានបើកមើលច្រើនបំផុត',
    editorPick: 'ជម្រើសអ្នកកែសម្រួល',
    editorPickSubtitle: 'ការណែនាំ Premium ដែលជ្រើសរើសដោយ Admin',
    premiumRomance: 'មនោសញ្ចេតនា Premium',
    premiumRomanceSubtitle: 'រឿងមនោសញ្ចេតនា Exclusive សម្រាប់សមាជិក',
    premiumFantasy: 'Fantasy Premium',
    premiumFantasySubtitle: 'រឿង Fantasy Exclusive សម្រាប់សមាជិក',
    completedExclusive: 'Exclusive ដែលបានបញ្ចប់',
    completedExclusiveSubtitle: 'រឿង Premium ដែលអាចអានបន្តរហូតដល់ចប់',
    free: 'ឥតគិតថ្លៃ',
    noCover: 'គ្មានគម្រប',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    upToEpisode: 'រហូតដល់ភាគ {{count}}',
    premiumStory: 'រឿង Premium',
    premium: 'Premium',
    emptySection: 'មិនទាន់មានរឿងដែលបានអនុម័តនៅក្នុងផ្នែកនេះទេ។',
    loadFailed: 'មិនអាចផ្ទុករឿង Shadow Exclusive បានទេ',
    popular: 'ពេញនិយម',
    daily: 'ប្រចាំថ្ងៃ',
    weekly: 'ប្រចាំសប្តាហ៍',
    allTime: 'គ្រប់ពេល',
    title: 'Shadow Exclusive',
    premiumSubscription: 'ការជាវ Premium',
    membershipLine1: 'Shadow',
    membershipLine2: 'Membership',
    membershipBody:
      'ដោះសោរឿង Premium ដែលបានជ្រើសរើស អានដោយគ្មានពាណិជ្ជកម្ម និងចូលមើលការចេញផ្សាយផ្ទៃក្នុងមុនគេ។',
    subscribeNow: 'ជាវឥឡូវនេះ',
    contactTitle: 'មានសំណួរ? ទាក់ទងមកយើង',
    contactSubtitle: 'ជំនួយ Premium សម្រាប់សមាជិក Shadow',
    support: 'ជំនួយ',
  },
  zh: {
    adsFree: '无广告',
    adsFreeSubtitle: '阅读时不受打扰',
    premiumStories: 'Premium 故事',
    premiumStoriesSubtitle: '由 Shadow 审核通过',
    earlyAccess: '抢先阅读',
    earlyAccessSubtitle: '优先阅读精选新内容',
    shadowPicks: 'Shadow 精选',
    shadowPicksSubtitle: '为 Premium 会员精心挑选的故事',
    newExclusive: '全新 Exclusive',
    newExclusiveSubtitle: '最近审核通过的全新 Premium 故事',
    popularExclusive: '热门 Exclusive',
    popularExclusiveSubtitle: '读者打开最多的 Premium 故事',
    editorPick: '编辑精选',
    editorPickSubtitle: '由 Admin 精选的 Premium 推荐',
    premiumRomance: 'Premium 爱情',
    premiumRomanceSubtitle: '会员专属爱情故事',
    premiumFantasy: 'Premium 奇幻',
    premiumFantasySubtitle: '会员专属奇幻故事',
    completedExclusive: '已完结 Exclusive',
    completedExclusiveSubtitle: '适合一次读完的 Premium 故事',
    free: '免费',
    noCover: '暂无封面',
    untitledStory: '无标题故事',
    upToEpisode: '更新至第 {{count}} 集',
    premiumStory: 'Premium 故事',
    premium: 'Premium',
    emptySection: '此分区暂时没有已审核通过的故事。',
    loadFailed: '无法加载 Shadow Exclusive 故事',
    popular: '热门',
    daily: '每日',
    weekly: '每周',
    allTime: '全部时间',
    title: 'Shadow Exclusive',
    premiumSubscription: 'Premium 订阅',
    membershipLine1: 'Shadow',
    membershipLine2: '会员',
    membershipBody:
      '解锁精选 Premium 故事，享受无广告阅读，并抢先阅读内部新内容。',
    subscribeNow: '立即订阅',
    contactTitle: '有问题？联系我们',
    contactSubtitle: 'Shadow 会员专属 Premium 支持',
    support: '支持',
  },
  ja: {
    adsFree: '広告なし',
    adsFreeSubtitle: '読書中に邪魔されません',
    premiumStories: 'Premium ストーリー',
    premiumStoriesSubtitle: 'Shadow による承認済み',
    earlyAccess: '先行アクセス',
    earlyAccessSubtitle: '選ばれた新作を先に読めます',
    shadowPicks: 'Shadow Picks',
    shadowPicksSubtitle: 'Premium メンバー向けに厳選されたストーリー',
    newExclusive: '新着 Exclusive',
    newExclusiveSubtitle: '最近承認された新しい Premium ストーリー',
    popularExclusive: '人気 Exclusive',
    popularExclusiveSubtitle: '読者が最も多く開く Premium ストーリー',
    editorPick: '編集部おすすめ',
    editorPickSubtitle: 'Admin が選んだ Premium おすすめ作品',
    premiumRomance: 'Premium ロマンス',
    premiumRomanceSubtitle: 'メンバー限定のロマンスストーリー',
    premiumFantasy: 'Premium ファンタジー',
    premiumFantasySubtitle: 'メンバー限定のファンタジーストーリー',
    completedExclusive: '完結 Exclusive',
    completedExclusiveSubtitle: '一気読みできる Premium ストーリー',
    free: '無料',
    noCover: '表紙なし',
    untitledStory: '無題のストーリー',
    upToEpisode: '第{{count}}話まで',
    premiumStory: 'Premium ストーリー',
    premium: 'Premium',
    emptySection: 'このセクションには承認済みのストーリーがまだありません。',
    loadFailed: 'Shadow Exclusive ストーリーを読み込めませんでした',
    popular: '人気',
    daily: 'デイリー',
    weekly: '週間',
    allTime: '全期間',
    title: 'Shadow Exclusive',
    premiumSubscription: 'Premium サブスクリプション',
    membershipLine1: 'Shadow',
    membershipLine2: 'メンバーシップ',
    membershipBody:
      '厳選された Premium ストーリーを解放し、広告なしで読書を楽しみ、内部リリースへ先行アクセスできます。',
    subscribeNow: '今すぐ購読',
    contactTitle: 'ご質問がありますか？お問い合わせください',
    contactSubtitle: 'Shadow メンバー向け Premium サポート',
    support: 'サポート',
  },
  ko: {
    adsFree: '광고 없음',
    adsFreeSubtitle: '방해 없이 읽을 수 있습니다',
    premiumStories: 'Premium 스토리',
    premiumStoriesSubtitle: 'Shadow 승인',
    earlyAccess: '선공개 이용',
    earlyAccessSubtitle: '선정된 신규 콘텐츠를 먼저 읽으세요',
    shadowPicks: 'Shadow Picks',
    shadowPicksSubtitle: 'Premium 회원을 위해 엄선한 스토리',
    newExclusive: '신규 Exclusive',
    newExclusiveSubtitle: '최근 승인된 새로운 Premium 스토리',
    popularExclusive: '인기 Exclusive',
    popularExclusiveSubtitle: '독자가 가장 많이 여는 Premium 스토리',
    editorPick: '에디터 추천',
    editorPickSubtitle: 'Admin이 선정한 Premium 추천',
    premiumRomance: 'Premium 로맨스',
    premiumRomanceSubtitle: '회원 전용 로맨스 스토리',
    premiumFantasy: 'Premium 판타지',
    premiumFantasySubtitle: '회원 전용 판타지 스토리',
    completedExclusive: '완결 Exclusive',
    completedExclusiveSubtitle: '정주행할 수 있는 Premium 스토리',
    free: '무료',
    noCover: '표지 없음',
    untitledStory: '제목 없는 스토리',
    upToEpisode: '{{count}}화까지',
    premiumStory: 'Premium 스토리',
    premium: 'Premium',
    emptySection: '이 섹션에는 아직 승인된 스토리가 없습니다.',
    loadFailed: 'Shadow Exclusive 스토리를 불러오지 못했습니다',
    popular: '인기',
    daily: '일간',
    weekly: '주간',
    allTime: '전체 기간',
    title: 'Shadow Exclusive',
    premiumSubscription: 'Premium 구독',
    membershipLine1: 'Shadow',
    membershipLine2: '멤버십',
    membershipBody:
      '선정된 Premium 스토리를 잠금 해제하고 광고 없이 읽으며 내부 신규 콘텐츠를 먼저 이용하세요.',
    subscribeNow: '지금 구독',
    contactTitle: '궁금한 점이 있나요? 문의하세요',
    contactSubtitle: 'Shadow 회원을 위한 Premium 지원',
    support: '지원',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
const SHADOW_EXCLUSIVE_CACHE_MAX_AGE_MS = 2 * 60 * 60 * 1000

const featureCards = [
  { title: 'Ads-Free', subtitle: 'No interruptions while reading', iconText: '🚫' },
  { title: 'Premium Stories', subtitle: 'Approved by Shadow', iconText: '👑' },
  { title: 'Early Access', subtitle: 'Read selected releases first', iconText: '⚡' },
]

const FEATURE_LABEL_KEYS = {
  'Ads-Free': ['adsFree', 'adsFreeSubtitle'],
  'Premium Stories': ['premiumStories', 'premiumStoriesSubtitle'],
  'Early Access': ['earlyAccess', 'earlyAccessSubtitle'],
}

const sectionConfigs = [
  {
    id: 'featured',
    title: 'Shadow Picks',
    subtitle: 'Carefully selected stories for premium members',
    layout: 'featured',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=featured&sort=updated',
  },
  {
    id: 'new_exclusive',
    title: 'New Exclusive',
    subtitle: 'Fresh premium stories recently approved',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=new_exclusive&sort=latest',
  },
  {
    id: 'popular_exclusive',
    title: 'Popular Exclusive',
    subtitle: 'Premium stories readers open the most',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=popular_exclusive&sort=popular',
  },
  {
    id: 'editor_pick',
    title: 'Editor Pick',
    subtitle: 'Admin-curated premium recommendations',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=editor_pick&sort=updated',
  },
  {
    id: 'premium_romance',
    title: 'Premium Romance',
    subtitle: 'Exclusive romance stories for members',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=premium_romance&sort=updated',
  },
  {
    id: 'premium_fantasy',
    title: 'Premium Fantasy',
    subtitle: 'Exclusive fantasy stories for members',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=premium_fantasy&sort=updated',
  },
  {
    id: 'completed_exclusive',
    title: 'Completed Exclusive',
    subtitle: 'Premium stories ready for binge reading',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=completed_exclusive&sort=updated',
  },
]

const SECTION_LABEL_KEYS = {
  featured: ['shadowPicks', 'shadowPicksSubtitle'],
  new_exclusive: ['newExclusive', 'newExclusiveSubtitle'],
  popular_exclusive: ['popularExclusive', 'popularExclusiveSubtitle'],
  editor_pick: ['editorPick', 'editorPickSubtitle'],
  premium_romance: ['premiumRomance', 'premiumRomanceSubtitle'],
  premium_fantasy: ['premiumFantasy', 'premiumFantasySubtitle'],
  completed_exclusive: ['completedExclusive', 'completedExclusiveSubtitle'],
}

const TAB_LABEL_KEYS = {
  Popular: 'popular',
  Daily: 'daily',
  Weekly: 'weekly',
  'All Time': 'allTime',
}

function CrownBadge() {
  const { t } = useDisplayTranslation()

  return (
    <div className="absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-[#23182d]/90 px-1.5 py-1 shadow-md">
      <div className="flex items-center gap-1">
        <svg className="h-2.5 w-2.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18l-1.6-9-4.9 3.4L12 6 9.5 12.4 4.6 9 3 18z" />
        </svg>
        <span className="text-[8px] font-black uppercase leading-none text-yellow-300">
          {t('shadowExclusivePage.free')}
        </span>
      </div>
    </div>
  )
}

function PlaceholderCover({ featured = false }) {
  const { t } = useDisplayTranslation()

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-yellow-400/70 bg-[#2a2036] shadow-[0_0_10px_rgba(250,204,21,0.22)] ${
        featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <div className="px-3 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <svg className="h-5 w-5 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" />
            <path d="M8 4v13a3 3 0 003 3" />
          </svg>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-white/35">
          {t('shadowExclusivePage.noCover')}
        </div>
      </div>
      <CrownBadge />
    </div>
  )
}

function normalizeBook(story) {
  const totalEpisodes = Number(story.total_episodes || 0)

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    episode: totalEpisodes > 0 ? `Up to Ep. ${totalEpisodes}` : 'Premium story',
    genre: story.main_genre || 'Premium',
    image: story.cover_url || '',
    link: `/story/${story.id}`,
  }
}

function getBookTitle(book, t) {
  return book.title === 'Untitled Story'
    ? t('shadowExclusivePage.untitledStory')
    : book.title
}

function getEpisodeLabel(value, t) {
  const text = String(value || '')
  const match = text.match(/^Up to Ep\. (\d+)$/)

  if (match) {
    return t('shadowExclusivePage.upToEpisode', {
      count: Number(match[1]),
    })
  }

  if (text === 'Premium story') {
    return t('shadowExclusivePage.premiumStory')
  }

  return value
}

function BookCard({ book, featured = false }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const hasImage = typeof book.image === 'string' && book.image.trim() !== ''
  const title = getBookTitle(book, t)

  return (
    <button type="button" onClick={() => navigate(book.link)} className="group min-w-0 cursor-pointer text-left">
      {hasImage ? (
        <div
          className={`relative overflow-hidden rounded-2xl border border-yellow-400/70 bg-[#2a2036] shadow-[0_0_10px_rgba(250,204,21,0.22)] ${
            featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'
          }`}
        >
          <img
            src={book.image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <CrownBadge />
        </div>
      ) : (
        <PlaceholderCover featured={featured} />
      )}

      <div className="mt-2 min-w-0 px-0.5">
        <h3 className="truncate text-[12px] font-bold text-white">{title}</h3>
        <p className="mt-1 truncate text-[10px] text-white/55">
          {getEpisodeLabel(book.episode, t)}
        </p>
      </div>
    </button>
  )
}

function SectionHeader({ title, subtitle }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[15px] font-extrabold tracking-tight text-white">{title}</h2>
        <p className="mt-0.5 text-[11px] text-white/55">{subtitle}</p>
      </div>
      <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-white/50">
        {t('shadowExclusivePage.premium')}
      </span>
    </div>
  )
}

function LoadingBooks({ featured }) {
  return (
    <div className={featured ? 'grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-6' : 'grid grid-cols-3 gap-x-3 gap-y-5 md:grid-cols-6'}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className={`${featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'} animate-pulse rounded-2xl bg-white/10`} />
          <div className="mt-2 h-3 animate-pulse rounded-full bg-white/10" />
          <div className="mt-2 h-2 w-2/3 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  )
}

function EmptySection({ featured }) {
  const { t } = useDisplayTranslation()

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-6 text-center text-[11px] font-semibold text-white/50 ${
        featured ? '' : ''
      }`}
    >
      {t('shadowExclusivePage.emptySection')}
    </div>
  )
}

function ExclusiveSection({ section }) {
  const { t } = useDisplayTranslation()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    async function fetchBooks() {
      const cacheKey = getHomeCacheKey({
        section: 'stories',
        language: getStoryLanguageId(),
        params: {
          page: 'shadow-exclusive',
          section: section.id,
          url: section.url,
          schema: 1,
        },
      })

      let hasCachedBooks = false

      const cached = await loadHomeCache(cacheKey, {
        maxAgeMs: SHADOW_EXCLUSIVE_CACHE_MAX_AGE_MS,
        allowExpired: true,
      })

      if (ignore || controller.signal.aborted) return

      hasCachedBooks = Array.isArray(cached?.data)

      if (hasCachedBooks) {
        setBooks(cached.data)
        setLoading(false)
      }

      if (cached?.isFresh && hasCachedBooks) {
        return
      }

      try {
        if (!hasCachedBooks) {
          setLoading(true)
        }

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}${section.url}`
          ),
          {
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              t('shadowExclusivePage.loadFailed')
          )
        }

        const nextBooks = (
          Array.isArray(data.stories) ? data.stories : []
        ).map(normalizeBook)

        if (ignore || controller.signal.aborted) return

        setBooks(nextBooks)

        await saveHomeCache(cacheKey, nextBooks, {
          maxAgeMs: SHADOW_EXCLUSIVE_CACHE_MAX_AGE_MS,
        })
      } catch (error) {
        if (error?.name === 'AbortError') return

        console.error(
          `ShadowExclusivePage ${section.id} error:`,
          error
        )

        if (!ignore && !hasCachedBooks) {
          setBooks([])
        }
      } finally {
        if (!ignore && !controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchBooks()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [section])

  const isFeatured = section.layout === 'featured'
  const sectionKeys = SECTION_LABEL_KEYS[section.id] || []
  const title = sectionKeys[0]
    ? t(`shadowExclusivePage.${sectionKeys[0]}`)
    : section.title
  const subtitle = sectionKeys[1]
    ? t(`shadowExclusivePage.${sectionKeys[1]}`)
    : section.subtitle

  return (
    <div className="mb-9">
      <SectionHeader title={title} subtitle={subtitle} />

      {loading ? (
        <LoadingBooks featured={isFeatured} />
      ) : books.length ? (
        <div className={isFeatured ? 'grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-6' : 'grid grid-cols-3 gap-x-3 gap-y-5 md:grid-cols-6'}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} featured={isFeatured} />
          ))}
        </div>
      ) : (
        <EmptySection featured={isFeatured} />
      )}
    </div>
  )
}

export default function ShadowExclusivePage() {
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] = useState('Popular')
  const tabs = ['Popular', 'Daily', 'Weekly', 'All Time']

  const displaySections = useMemo(() => sectionConfigs, [])

  return (
    <div className="min-h-screen bg-[#17091f] pb-32 text-white md:pb-24">
      <header className="sticky top-0 z-40 bg-[#17091f]/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="text-[18px] font-extrabold tracking-tight">
            {t('shadowExclusivePage.title')}
          </h1>
        </div>
      </header>

      <main className="px-4">
        <section className="mt-4">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#5b2ca1] via-[#3a1570] to-[#1c0b2b] p-5 shadow-2xl">
            <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-yellow-300/15 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-fuchsia-400/10 blur-2xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18l-1.6-9-4.9 3.4L12 6 9.5 12.4 4.6 9 3 18z" />
                </svg>
                {t('shadowExclusivePage.premiumSubscription')}
              </div>

              <h2 className="mt-4 text-[28px] font-black leading-[1.05] text-white">
                {t('shadowExclusivePage.membershipLine1')}
                <br />
                {t('shadowExclusivePage.membershipLine2')}
              </h2>

              <p className="mt-3 max-w-xs text-[12px] leading-5 text-white/75">
                {t('shadowExclusivePage.membershipBody')}
              </p>

              <button className="mt-5 w-full rounded-[22px] bg-[#ffd34d] py-4 text-[14px] font-black uppercase tracking-wide text-[#1d1027] shadow-lg active:scale-[0.99]">
                {t('shadowExclusivePage.subscribeNow')}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {featureCards.map((item) => {
              const keys = FEATURE_LABEL_KEYS[item.title] || []

              return (
                <div key={item.title} className="rounded-[22px] border border-white/8 bg-[#2a1536] px-3 py-4 text-center shadow-md">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#3d2250] text-[18px] text-yellow-300">
                    {item.iconText}
                  </div>
                  <div className="text-[10px] font-black uppercase leading-tight tracking-tight text-white">
                    {keys[0]
                      ? t(`shadowExclusivePage.${keys[0]}`)
                      : item.title}
                  </div>
                  <div className="mt-1 text-[9px] font-semibold text-white/55">
                    {keys[1]
                      ? t(`shadowExclusivePage.${keys[1]}`)
                      : item.subtitle}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full bg-[#25142f] p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`min-w-fit rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-[#ffd34d] text-[#1d1027]' : 'text-white/45'
                }`}
              >
                {t(`shadowExclusivePage.${TAB_LABEL_KEYS[tab]}`)}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7">
          {displaySections.map((section) => (
            <ExclusiveSection key={section.id} section={section} />
          ))}
        </section>

        <section className="mt-8">
          <div className="rounded-[24px] border border-white/8 bg-[#201129] px-4 py-5 shadow-lg md:px-5 md:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 pr-2">
                <h3 className="text-[13px] font-extrabold text-white">
                  {t('shadowExclusivePage.contactTitle')}
                </h3>
                <p className="mt-1 break-words text-[10px] leading-4 text-white/50">
                  {t('shadowExclusivePage.contactSubtitle')}
                </p>
              </div>

              <button className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white">
                {t('shadowExclusivePage.support')}
              </button>
            </div>
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
