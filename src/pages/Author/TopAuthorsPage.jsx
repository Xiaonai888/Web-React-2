import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('topAuthorsPage', {
  en: { author: 'Author', noWorks: 'No works', oneWork: '1 work', works: '{{count}} works', view: 'View', following: 'Following', follow: 'Follow', fans: '{{count}} fans', loadFailed: 'Failed to load authors', goBack: 'Go back', topAuthors: 'Top Authors', searchAuthors: 'Search authors', searchPlaceholder: 'Search author name or username', rankedText: 'Ranked by followers on Shadow.', loadingAuthors: 'Loading authors...', authorsCount: '{{count}} Authors', showingLimit: 'Showing up to the first {{count}} ranked authors', ranking: 'Ranking', new: 'New', recentlyUpdated: 'Recently Updated', noAuthors: 'No authors found', noAuthorsText: 'Try another search or check back later.', loading: 'Loading...', loadMore: 'Load More', retry: 'Retry' },
  km: { author: 'អ្នកនិពន្ធ', noWorks: 'មិនទាន់មានស្នាដៃ', oneWork: '1 ស្នាដៃ', works: '{{count}} ស្នាដៃ', view: 'មើល', following: 'កំពុងតាមដាន', follow: 'តាមដាន', fans: '{{count}} អ្នកគាំទ្រ', loadFailed: 'មិនអាចផ្ទុកអ្នកនិពន្ធបានទេ', goBack: 'ត្រឡប់ក្រោយ', topAuthors: 'អ្នកនិពន្ធកំពូល', searchAuthors: 'ស្វែងរកអ្នកនិពន្ធ', searchPlaceholder: 'ស្វែងរកឈ្មោះ ឬ username អ្នកនិពន្ធ', rankedText: 'ចំណាត់ថ្នាក់តាមចំនួនអ្នកតាមដាននៅ Shadow។', loadingAuthors: 'កំពុងផ្ទុកអ្នកនិពន្ធ...', authorsCount: '{{count}} អ្នកនិពន្ធ', showingLimit: 'បង្ហាញអ្នកនិពន្ធចំណាត់ថ្នាក់ដំបូងអតិបរមា {{count}} នាក់', ranking: 'ចំណាត់ថ្នាក់', new: 'ថ្មី', recentlyUpdated: 'ទើប Update', noAuthors: 'រកមិនឃើញអ្នកនិពន្ធ', noAuthorsText: 'សាកស្វែងរកផ្សេងទៀត ឬត្រឡប់មកមើលពេលក្រោយ។', loading: 'កំពុងផ្ទុក...', loadMore: 'ផ្ទុកបន្ថែម', retry: 'សាកម្តងទៀត' },
  zh: { author: '作者', noWorks: '暂无作品', oneWork: '1 部作品', works: '{{count}} 部作品', view: '查看', following: '已关注', follow: '关注', fans: '{{count}} 粉丝', loadFailed: '无法加载作者', goBack: '返回', topAuthors: '热门作者', searchAuthors: '搜索作者', searchPlaceholder: '搜索作者姓名或用户名', rankedText: '按 Shadow 的关注者数量排名。', loadingAuthors: '正在加载作者...', authorsCount: '{{count}} 位作者', showingLimit: '最多显示前 {{count}} 位排名作者', ranking: '排行榜', new: '新', recentlyUpdated: '最近更新', noAuthors: '未找到作者', noAuthorsText: '请尝试其他搜索或稍后再来。', loading: '加载中...', loadMore: '加载更多', retry: '重试' },
  ja: { author: '作者', noWorks: '作品なし', oneWork: '1 作品', works: '{{count}} 作品', view: '表示', following: 'フォロー中', follow: 'フォロー', fans: '{{count}} ファン', loadFailed: '作者を読み込めませんでした', goBack: '戻る', topAuthors: 'トップ作者', searchAuthors: '作者を検索', searchPlaceholder: '作者名またはユーザー名を検索', rankedText: 'Shadow のフォロワー数でランキングしています。', loadingAuthors: '作者を読み込み中...', authorsCount: '{{count}} 人の作者', showingLimit: 'ランキング上位 {{count}} 人まで表示', ranking: 'ランキング', new: '新着', recentlyUpdated: '最近更新', noAuthors: '作者が見つかりません', noAuthorsText: '別の検索を試すか、後でもう一度確認してください。', loading: '読み込み中...', loadMore: 'さらに読み込む', retry: '再試行' },
  ko: { author: '작가', noWorks: '작품 없음', oneWork: '작품 1개', works: '작품 {{count}}개', view: '보기', following: '팔로잉', follow: '팔로우', fans: '팬 {{count}}명', loadFailed: '작가를 불러오지 못했습니다', goBack: '뒤로 가기', topAuthors: '인기 작가', searchAuthors: '작가 검색', searchPlaceholder: '작가 이름 또는 사용자명 검색', rankedText: 'Shadow 팔로워 수 기준 순위입니다.', loadingAuthors: '작가를 불러오는 중...', authorsCount: '작가 {{count}}명', showingLimit: '상위 {{count}}명의 작가까지 표시', ranking: '랭킹', new: '신규', recentlyUpdated: '최근 업데이트', noAuthors: '작가를 찾을 수 없습니다', noAuthorsText: '다른 검색어를 사용하거나 나중에 다시 확인하세요.', loading: '불러오는 중...', loadMore: '더 불러오기', retry: '다시 시도' },
})

const DISPLAY_LOCALES = { en: 'en-US', km: 'km-KH', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const LOAD_STEP = 20
const MAX_VISIBLE = 100

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '0'
  const locale = DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(number)
}

function getInitial(name) {
  return String(name || 'A').trim().slice(0, 1).toUpperCase()
}

function getAuthorRank(author, fallbackRank) {
  const rank = Number(author?.rank || 0)
  return rank > 0 ? rank : fallbackRank
}

function sortAuthors(authors, filter) {
  const items = [...authors]

  if (filter === 'new') {
    return items.sort((first, second) => {
      const difference =
        new Date(second.created_at || 0).getTime() -
        new Date(first.created_at || 0).getTime()

      if (difference) return difference

      return getAuthorRank(first, 999999) - getAuthorRank(second, 999999)
    })
  }

  if (filter === 'updated') {
    return items.sort((first, second) => {
      const difference =
        new Date(second.updated_at || 0).getTime() -
        new Date(first.updated_at || 0).getTime()

      if (difference) return difference

      return getAuthorRank(first, 999999) - getAuthorRank(second, 999999)
    })
  }

  return items.sort(
    (first, second) =>
      getAuthorRank(first, 999999) - getAuthorRank(second, 999999)
  )
}

function AuthorCard({
  author,
  fallbackRank,
  onOpen,
  onFollow,
  followLoading,
}) {
  const name = author?.page_name || getDisplayText('topAuthorsPage.author')
  const username = author?.page_username || 'author'
  const avatarUrl = author?.avatar_url || ''
  const coverUrl = author?.cover_url || ''
  const rank = getAuthorRank(author, fallbackRank)
  const followers = formatCompactNumber(author?.total_followers)
  const worksCount = Number(author?.total_stories || 0)
  const worksLabel =
    worksCount === 0
      ? getDisplayText('topAuthorsPage.noWorks')
      : worksCount === 1
        ? getDisplayText('topAuthorsPage.oneWork')
        : getDisplayText('topAuthorsPage.works', { count: formatCompactNumber(worksCount) })

  const buttonLabel = author?.is_owner
    ? getDisplayText('topAuthorsPage.view')
    : author?.is_following
      ? getDisplayText('topAuthorsPage.following')
      : getDisplayText('topAuthorsPage.follow')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(author)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(author)
        }
      }}
      className="relative overflow-hidden rounded-[20px] border border-[#e7ebf2] bg-white shadow-sm dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] active:scale-[0.99]"
    >
      <div className="absolute left-3 top-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-white/95 px-2 text-[11px] font-black text-[#111827] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-black/5">
        #{rank}
      </div>

      <div className="relative h-[58px] overflow-hidden bg-gradient-to-br from-[#fff1f2] via-[#eef2ff] to-[#ecfeff] dark:from-[#202331] dark:via-[#242738] dark:to-[#1b2a31]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="h-full w-full object-cover opacity-75"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-white/55" />
            <div className="absolute -bottom-10 left-5 h-24 w-24 rounded-full bg-white/40" />
            <div className="absolute right-8 top-6 h-10 w-10 rounded-full bg-white/35" />
          </>
        )}
      </div>

      <div className="-mt-8 px-3 pb-4 text-center">
        <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-[#f4f5f7] text-[20px] font-black text-[#111827] ring-4 ring-white dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)] dark:ring-[var(--shadow-bg-surface)]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            getInitial(name)
          )}
        </div>

        <div className="mt-3 line-clamp-1 text-[13px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
          {name}
        </div>

        <div className="mt-1 line-clamp-1 text-[11px] font-bold text-[#8b93a1] dark:text-[var(--shadow-text-tertiary)]">
          @{username}
        </div>

        <div className="mt-3 rounded-[14px] bg-[#f8fafc] px-2 py-2 dark:bg-[var(--shadow-bg-elevated)]">
          <div className="text-[13px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {getDisplayText('topAuthorsPage.fans', { count: followers })}
          </div>
          <div className="mt-0.5 text-[11px] font-semibold text-[#6b7280] dark:text-[var(--shadow-text-secondary)]">
            {worksLabel}
          </div>
        </div>

        <button
          type="button"
          disabled={followLoading}
          onClick={(event) => {
            event.stopPropagation()

            if (author?.is_owner || author?.is_following) {
              onOpen(author)
              return
            }

            onFollow(author)
          }}
          className={`mt-3 h-8 w-full rounded-full text-[12px] font-black active:scale-95 disabled:opacity-60 ${
            author?.is_following
              ? 'bg-[#f3f4f6] text-[#111827] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)]'
              : 'bg-black text-white'
          }`}
        >
          {followLoading ? '...' : buttonLabel}
        </button>
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-[230px] animate-pulse rounded-[20px] border border-[#e7ebf2] bg-[#f8fafc] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-elevated)]"
        />
      ))}
    </div>
  )
}

export default function TopAuthorsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState('ranking')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [followLoadingId, setFollowLoadingId] = useState('')

  const loadAuthors = useCallback(
  async (pageNumber = 1, append = false) => {
    const token = getReaderToken()

    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setLoadError(false)
      }

      const response = await fetch(
        `${API_BASE_URL}/api/authors/top?page=${pageNumber}&limit=${LOAD_STEP}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            getDisplayText('topAuthorsPage.loadFailed')
        )
      }

      const incoming = Array.isArray(
        data.author_pages
      )
        ? data.author_pages
        : []

      setAuthors((current) => {
        const source = append
          ? [...current, ...incoming]
          : incoming

        const seen = new Set()

        return source
          .filter((author) => {
            if (
              !author?.id ||
              seen.has(author.id)
            ) {
              return false
            }

            seen.add(author.id)
            return true
          })
          .slice(0, MAX_VISIBLE)
      })

      const resolvedPage = Number(
        data.page || pageNumber
      )

      setPage(resolvedPage)
      setHasMore(
        Boolean(data.has_more) &&
          resolvedPage * LOAD_STEP <
            MAX_VISIBLE
      )
    } catch {
      if (!append) {
        setAuthors([])
        setLoadError(true)
      }
    } finally {
      if (append) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  },
  []
)

  useEffect(() => {
  loadAuthors(1, false)
}, [loadAuthors])

  const filteredAuthors = useMemo(() => {
    const value = keyword.trim().toLowerCase()

    const searchedAuthors = value
      ? authors.filter((author) => {
          const name = String(author.page_name || '').toLowerCase()
          const username = String(author.page_username || '').toLowerCase()

          return name.includes(value) || username.includes(value)
        })
      : authors

    return sortAuthors(searchedAuthors, filter)
  }, [authors, keyword, filter])

  const visibleAuthors =
  filteredAuthors.slice(0, MAX_VISIBLE)

const canLoadMore =
  hasMore && authors.length < MAX_VISIBLE

  async function handleLoadMore() {
  if (loadingMore || !canLoadMore) return

  await loadAuthors(page + 1, true)
}

  function handleOpenAuthor(author) {
    if (!author?.page_username) return

    navigate(
      `/author/page/${encodeURIComponent(author.page_username)}`
    )
  }

  async function handleFollowAuthor(author) {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (
      !author?.page_username ||
      author?.is_owner ||
      author?.is_following ||
      followLoadingId
    ) {
      return
    }

    try {
      setFollowLoadingId(author.id)

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
          author.page_username
        )}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        return
      }

      setAuthors((current) =>
  current.map((item) =>
    item.id === author.id
      ? {
          ...item,
          is_following: true,
          total_followers: Number(
            data.total_followers ??
              item.total_followers ??
              0
          ),
        }
      : item
  )
)
    } catch {
    } finally {
      setFollowLoadingId('')
    }
  }

  return (
    <div className="top-authors-page min-h-screen bg-white pb-16 dark:bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 border-b border-[#f1f1f1] bg-white px-4 py-3 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="mx-auto flex max-w-[760px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-start text-[#111827] active:opacity-60 dark:text-[var(--shadow-text-primary)]"
            aria-label={t('topAuthorsPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[18px]" />
          </button>

          <h1 className="text-[18px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {t('topAuthorsPage.topAuthors')}
          </h1>

          <button
            type="button"
            onClick={() => {
              setSearchOpen((current) => !current)
              if (searchOpen) setKeyword('')
            }}
            className="flex h-8 w-8 items-center justify-end text-[#111827] active:opacity-60 dark:text-[var(--shadow-text-primary)]"
            aria-label={t('topAuthorsPage.searchAuthors')}
          >
            <i className="fas fa-search text-[17px]" />
          </button>
        </div>

        {searchOpen ? (
          <div className="mx-auto mt-3 max-w-[760px]">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t('topAuthorsPage.searchPlaceholder')}
              className="h-11 w-full rounded-full bg-[#f4f5f7] px-4 text-[14px] font-semibold text-[#111827] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)] outline-none placeholder:text-[#9ca3af]"
              autoFocus
            />
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="relative overflow-hidden rounded-[22px] bg-[#111827] px-4 py-5 text-white shadow-sm">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-white/5" />

          <div className="relative">
            <div className="text-[18px] font-extrabold">
              {t('topAuthorsPage.topAuthors')}
            </div>
            <p className="mt-1 max-w-[300px] text-[12px] font-medium leading-5 text-white/70">
              {t('topAuthorsPage.rankedText')}
            </p>
          </div>
        </section>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {loading
                ? t('topAuthorsPage.loadingAuthors')
                : t('topAuthorsPage.authorsCount', { count: formatCompactNumber(filteredAuthors.length) })}
            </h2>

            {!loading && authors.length ? (
              <div className="mt-1 text-[11px] font-semibold text-[#9ca3af] dark:text-[var(--shadow-text-tertiary)]">
                {t('topAuthorsPage.showingLimit', { count: MAX_VISIBLE })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {[
            { key: 'ranking', label: t('topAuthorsPage.ranking') },
            { key: 'new', label: t('topAuthorsPage.new') },
            { key: 'updated', label: t('topAuthorsPage.recentlyUpdated') },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold active:scale-95 ${
                filter === item.key
                  ? 'bg-black text-white'
                  : 'border border-[#d8dbe3] bg-white text-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? <LoadingGrid /> : null}

        {!loading && loadError ? (
          <div className="mt-8 rounded-[20px] bg-[#f8fafc] p-8 text-center dark:bg-[var(--shadow-bg-surface)]">
            <div className="text-[13px] font-bold text-[#6b7280] dark:text-[var(--shadow-text-secondary)]">
              {t('topAuthorsPage.loadFailed')}
            </div>

            <button
              type="button"
              onClick={loadAuthors}
              className="mt-4 h-9 rounded-full bg-[#111827] px-5 text-[12px] font-black text-white active:scale-95"
            >
              {t('topAuthorsPage.retry')}
            </button>
          </div>
        ) : null}

        {!loading && !loadError && visibleAuthors.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visibleAuthors.map((author, index) => (
              <AuthorCard
                key={author.id}
                author={author}
                fallbackRank={index + 1}
                onOpen={handleOpenAuthor}
                onFollow={handleFollowAuthor}
                followLoading={followLoadingId === author.id}
              />
            ))}
          </div>
        ) : null}

        {!loading && !loadError && !visibleAuthors.length ? (
          <div className="mt-8 rounded-[20px] bg-[#f8fafc] p-8 text-center text-[13px] font-bold text-[#9ca3af] dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-tertiary)]">
            {t('topAuthorsPage.noAuthors')}
          </div>
        ) : null}

        {!loading && !loadError && canLoadMore ? (
          <button
            type="button"
            onClick={handleLoadMore}
disabled={loadingMore}
            className="mx-auto mt-7 flex h-10 min-w-[150px] items-center justify-center rounded-full bg-[#111827] px-6 text-[13px] font-black text-white active:scale-95"
          >
            {loadingMore ? t('topAuthorsPage.loading') : t('topAuthorsPage.loadMore')}
          </button>
        ) : null}
      </main>
    </div>
  )
}
