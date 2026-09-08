import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorFollowers', {
  "en": {
    "reader": "Reader",
    "following": "Following",
    "follow": "Follow",
    "back": "Back",
    "mutualFollowers": "Mutual followers",
    "mutualCount": "{{count}} mutual",
    "noMutualFollowers": "No mutual followers",
    "noMutualHelp": "{t('authorFollowers.noMutualHelp')}",
    "loading": "Loading...",
    "loadMore": "Load more",
    "followers": "Followers",
    "topFans": "Top fans",
    "readers": "Readers",
    "andOthers": "and {{count}} others",
    "andMore": "and {{count}} more",
    "followersCount": "{{count}} followers",
    "noFollowersYet": "No followers yet",
    "noFollowersHelp": "{t('authorFollowers.noFollowersHelp')}",
    "openActions": "Open {{name}} actions",
    "messageName": "Message {{name}}",
    "blockName": "Block {{name}}",
    "messageSoon": "Message {{name}} is coming soon.",
    "blockSoon": "Block {{name}} is coming soon.",
    "failedLoadFollowers": "Failed to load followers",
    "failedUpdateFollow": "Failed to update follow",
    "failedLoadMoreFollowers": "Failed to load more followers",
    "failedLoadMutualFollowers": "Failed to load mutual followers",
    "failedLoadMoreMutualFollowers": "Failed to load more mutual followers"
  },
  "km": {
    "reader": "អ្នកអាន",
    "following": "កំពុងតាមដាន",
    "follow": "តាមដាន",
    "back": "ត្រឡប់ក្រោយ",
    "mutualFollowers": "អ្នកតាមដានរួម",
    "mutualCount": "រួម {{count}} នាក់",
    "noMutualFollowers": "មិនមានអ្នកតាមដានរួម",
    "noMutualHelp": "មនុស្សដែលអ្នកតាមដាន ហើយក៏តាមដានទំព័រនេះ នឹងបង្ហាញនៅទីនេះ។",
    "loading": "កំពុងផ្ទុក...",
    "loadMore": "ផ្ទុកបន្ថែម",
    "followers": "អ្នកតាមដាន",
    "topFans": "អ្នកគាំទ្រកំពូល",
    "readers": "អ្នកអាន",
    "andOthers": "និង {{count}} នាក់ទៀត",
    "andMore": "និង {{count}} នាក់ទៀត",
    "followersCount": "អ្នកតាមដាន {{count}} នាក់",
    "noFollowersYet": "មិនទាន់មានអ្នកតាមដាន",
    "noFollowersHelp": "អ្នកអានដែលតាមដានទំព័រនេះ នឹងបង្ហាញនៅទីនេះ។",
    "openActions": "បើកសកម្មភាពរបស់ {{name}}",
    "messageName": "ផ្ញើសារទៅ {{name}}",
    "blockName": "ទប់ស្កាត់ {{name}}",
    "messageSoon": "មុខងារផ្ញើសារទៅ {{name}} នឹងមានឆាប់ៗនេះ។",
    "blockSoon": "មុខងារទប់ស្កាត់ {{name}} នឹងមានឆាប់ៗនេះ។",
    "failedLoadFollowers": "មិនអាចផ្ទុកអ្នកតាមដានបានទេ",
    "failedUpdateFollow": "មិនអាចធ្វើបច្ចុប្បន្នភាពការតាមដានបានទេ",
    "failedLoadMoreFollowers": "មិនអាចផ្ទុកអ្នកតាមដានបន្ថែមបានទេ",
    "failedLoadMutualFollowers": "មិនអាចផ្ទុកអ្នកតាមដានរួមបានទេ",
    "failedLoadMoreMutualFollowers": "មិនអាចផ្ទុកអ្នកតាមដានរួមបន្ថែមបានទេ"
  },
  "zh": {
    "reader": "读者",
    "following": "已关注",
    "follow": "关注",
    "back": "返回",
    "mutualFollowers": "共同关注者",
    "mutualCount": "{{count}} 位共同关注者",
    "noMutualFollowers": "暂无共同关注者",
    "noMutualHelp": "你关注且也关注此主页的人会显示在这里。",
    "loading": "加载中...",
    "loadMore": "加载更多",
    "followers": "关注者",
    "topFans": "顶级粉丝",
    "readers": "读者",
    "andOthers": "和另外 {{count}} 人",
    "andMore": "和另外 {{count}} 人",
    "followersCount": "{{count}} 位关注者",
    "noFollowersYet": "暂无关注者",
    "noFollowersHelp": "关注此主页的读者会显示在这里。",
    "openActions": "打开 {{name}} 的操作",
    "messageName": "给 {{name}} 发消息",
    "blockName": "屏蔽 {{name}}",
    "messageSoon": "给 {{name}} 发消息的功能即将推出。",
    "blockSoon": "屏蔽 {{name}} 的功能即将推出。",
    "failedLoadFollowers": "无法加载关注者",
    "failedUpdateFollow": "无法更新关注状态",
    "failedLoadMoreFollowers": "无法加载更多关注者",
    "failedLoadMutualFollowers": "无法加载共同关注者",
    "failedLoadMoreMutualFollowers": "无法加载更多共同关注者"
  },
  "ja": {
    "reader": "読者",
    "following": "フォロー中",
    "follow": "フォロー",
    "back": "戻る",
    "mutualFollowers": "共通のフォロワー",
    "mutualCount": "共通 {{count}} 人",
    "noMutualFollowers": "共通のフォロワーはいません",
    "noMutualHelp": "あなたがフォローしていて、このページもフォローしている人がここに表示されます。",
    "loading": "読み込み中...",
    "loadMore": "さらに読み込む",
    "followers": "フォロワー",
    "topFans": "トップファン",
    "readers": "読者",
    "andOthers": "ほか {{count}} 人",
    "andMore": "ほか {{count}} 人",
    "followersCount": "フォロワー {{count}} 人",
    "noFollowersYet": "まだフォロワーはいません",
    "noFollowersHelp": "このページをフォローした読者がここに表示されます。",
    "openActions": "{{name}} の操作を開く",
    "messageName": "{{name}} にメッセージ",
    "blockName": "{{name}} をブロック",
    "messageSoon": "{{name}} へのメッセージ機能は近日公開予定です。",
    "blockSoon": "{{name}} のブロック機能は近日公開予定です。",
    "failedLoadFollowers": "フォロワーを読み込めませんでした",
    "failedUpdateFollow": "フォロー状態を更新できませんでした",
    "failedLoadMoreFollowers": "フォロワーを追加で読み込めませんでした",
    "failedLoadMutualFollowers": "共通のフォロワーを読み込めませんでした",
    "failedLoadMoreMutualFollowers": "共通のフォロワーを追加で読み込めませんでした"
  },
  "ko": {
    "reader": "독자",
    "following": "팔로잉",
    "follow": "팔로우",
    "back": "뒤로",
    "mutualFollowers": "함께 아는 팔로워",
    "mutualCount": "함께 아는 팔로워 {{count}}명",
    "noMutualFollowers": "함께 아는 팔로워가 없습니다",
    "noMutualHelp": "내가 팔로우하면서 이 페이지도 팔로우하는 사람이 여기에 표시됩니다.",
    "loading": "불러오는 중...",
    "loadMore": "더 보기",
    "followers": "팔로워",
    "topFans": "톱 팬",
    "readers": "독자",
    "andOthers": "외 {{count}}명",
    "andMore": "외 {{count}}명",
    "followersCount": "팔로워 {{count}}명",
    "noFollowersYet": "아직 팔로워가 없습니다",
    "noFollowersHelp": "이 페이지를 팔로우하는 독자가 여기에 표시됩니다.",
    "openActions": "{{name}} 작업 열기",
    "messageName": "{{name}}에게 메시지",
    "blockName": "{{name}} 차단",
    "messageSoon": "{{name}}에게 메시지 보내기 기능은 곧 제공됩니다.",
    "blockSoon": "{{name}} 차단 기능은 곧 제공됩니다.",
    "failedLoadFollowers": "팔로워를 불러오지 못했습니다",
    "failedUpdateFollow": "팔로우 상태를 업데이트하지 못했습니다",
    "failedLoadMoreFollowers": "팔로워를 더 불러오지 못했습니다",
    "failedLoadMutualFollowers": "함께 아는 팔로워를 불러오지 못했습니다",
    "failedLoadMoreMutualFollowers": "함께 아는 팔로워를 더 불러오지 못했습니다"
  }
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PAGE_LIMIT = 30
const PREVIEW_LIMIT = 5

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getFollowerName(user) {
  return user?.name || user?.display_name || user?.username || getDisplayText('authorFollowers.reader')
}

function getFollowerId(user) {
  return String(user?.id || user?.user_id || user?.username || user?.reader_username || '')
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

function Avatar({ user, size = 'h-12 w-12' }) {
  const name = getFollowerName(user)
  const avatar = user?.avatar_url || user?.profile_image || ''

  if (avatar) {
    return <img src={avatar} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />
  }

  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[16px] font-black text-[var(--shadow-text-secondary)]`}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function FollowButton({ user, onToggle }) {
  const { t } = useDisplayTranslation()
  if (!user?.username || user.is_me) return null

  return (
    <button
      type="button"
      onClick={() => onToggle(user)}
      className="h-9 rounded-[10px] bg-[var(--shadow-bg-soft)] px-4 text-[14px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.98]"
    >
      {user.is_following ? t('authorFollowers.following') : t('authorFollowers.follow')}
    </button>
  )
}

function PersonRow({ user, showFollow, onToggleFollow, showOwnerMenu, onOpenActions }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="flex min-h-[66px] w-full items-center gap-3 px-4 py-2 text-left">
      <Avatar user={user} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-[var(--shadow-text-primary)]">
          {getFollowerName(user)}
        </div>
      </div>

      {showFollow ? (
        <FollowButton user={user} onToggle={onToggleFollow} />
      ) : null}

      {showOwnerMenu ? (
        <button
          type="button"
          onClick={() => onOpenActions(user)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-soft)]"
          aria-label={t('authorFollowers.openActions', { name: getFollowerName(user) })}
        >
          <i className="fa-solid fa-ellipsis text-[16px]" />
        </button>
      ) : null}
    </div>
  )
}

export default function AuthorFollowersPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { pageUsername } = useParams()

  const [screen, setScreen] = useState('main')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [message, setMessage] = useState('')

  const [isOwner, setIsOwner] = useState(false)

  const [topFans, setTopFans] = useState([])
  const [mutualPreview, setMutualPreview] = useState([])
  const [mutualFollowers, setMutualFollowers] = useState([])
  const [mutualCount, setMutualCount] = useState(0)
  const [mutualHasMore, setMutualHasMore] = useState(false)

  const [followers, setFollowers] = useState([])
  const [followersCount, setFollowersCount] = useState(0)
  const [followersHasMore, setFollowersHasMore] = useState(false)

  const [selectedFollower, setSelectedFollower] = useState(null)

  async function fetchFollowers(section, limit = PAGE_LIMIT, offset = 0) {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/followers?section=${section}&limit=${limit}&offset=${offset}`,
      { headers: getHeaders() }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('authorFollowers.failedLoadFollowers'))
    }

    return data
  }

  function patchUserFollowState(userId, patch) {
    const updateList = (list) =>
      list.map((item) => (getFollowerId(item) === userId ? { ...item, ...patch } : item))

    setTopFans(updateList)
    setMutualPreview(updateList)
    setMutualFollowers(updateList)
    setFollowers(updateList)
  }

  async function handleToggleUserFollow(user) {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!user?.username || user.is_me) return

    const userId = getFollowerId(user)
    const nextFollowing = !user.is_following

    patchUserFollowState(userId, { is_following: nextFollowing })

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${encodeURIComponent(user.username)}/follow`,
        {
          method: nextFollowing ? 'POST' : 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('authorFollowers.failedUpdateFollow'))
      }
    } catch (error) {
      patchUserFollowState(userId, { is_following: !nextFollowing })
      setMessage(error.message || t('authorFollowers.failedUpdateFollow'))
    }
  }

  async function loadMain() {
    try {
      setLoading(true)
      setMessage('')

      const [topData, mutualData, followerData] = await Promise.all([
        fetchFollowers('top', PREVIEW_LIMIT, 0),
        fetchFollowers('mutual', PREVIEW_LIMIT, 0),
        fetchFollowers('all', PAGE_LIMIT, 0),
      ])

      setIsOwner(Boolean(followerData.is_owner || topData.is_owner || mutualData.is_owner))

      setTopFans(topData.followers || [])

      setMutualPreview(mutualData.followers || [])
      setMutualCount(Number(mutualData.total_count || 0))
      setMutualHasMore(Boolean(mutualData.has_more))

      setFollowers(followerData.followers || [])
      setFollowersCount(Number(followerData.total_count || followerData.total_followers || 0))
      setFollowersHasMore(Boolean(followerData.has_more))
    } catch (error) {
      setMessage(error.message || t('authorFollowers.failedLoadFollowers'))
    } finally {
      setLoading(false)
    }
  }

  async function loadMoreFollowers() {
    if (loadingMore || !followersHasMore) return

    try {
      setLoadingMore(true)

      const data = await fetchFollowers('all', PAGE_LIMIT, followers.length)

      setFollowers((current) => [...current, ...(data.followers || [])])
      setFollowersHasMore(Boolean(data.has_more))
      setFollowersCount(Number(data.total_count || followersCount))
    } catch (error) {
      setMessage(error.message || t('authorFollowers.failedLoadMoreFollowers'))
    } finally {
      setLoadingMore(false)
    }
  }

  async function openMutualFollowers() {
    setScreen('mutual')
    setMutualFollowers([])
    setMutualHasMore(false)

    try {
      setLoading(true)
      setMessage('')

      const data = await fetchFollowers('mutual', PAGE_LIMIT, 0)

      setMutualFollowers(data.followers || [])
      setMutualCount(Number(data.total_count || 0))
      setMutualHasMore(Boolean(data.has_more))
      setIsOwner(Boolean(data.is_owner))
    } catch (error) {
      setMessage(error.message || t('authorFollowers.failedLoadMutualFollowers'))
    } finally {
      setLoading(false)
    }
  }

  async function loadMoreMutualFollowers() {
    if (loadingMore || !mutualHasMore) return

    try {
      setLoadingMore(true)

      const data = await fetchFollowers('mutual', PAGE_LIMIT, mutualFollowers.length)

      setMutualFollowers((current) => [...current, ...(data.followers || [])])
      setMutualHasMore(Boolean(data.has_more))
      setMutualCount(Number(data.total_count || mutualCount))
    } catch (error) {
      setMessage(error.message || t('authorFollowers.failedLoadMoreMutualFollowers'))
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (!pageUsername) return
    loadMain()
  }, [pageUsername])

  const selectedName = selectedFollower ? getFollowerName(selectedFollower) : ''
  const showReaderFollowButtons = !isOwner

  if (screen === 'mutual') {
    return (
      <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
        <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
            <button
              type="button"
              onClick={() => setScreen('main')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
              aria-label={t('authorFollowers.back')}
            >
              <i className="fa-solid fa-chevron-left text-[20px]" />
            </button>

            <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('authorFollowers.mutualFollowers')}</h1>

            <div className="h-10 w-10" />
          </div>
        </header>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[14px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <main className="mx-auto max-w-[720px] pt-3">
          <div className="px-4 pb-2 pt-3 text-[23px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorFollowers.mutualCount', { count: formatCompactNumber(mutualCount) })}
          </div>

          {loading ? (
            <div className="space-y-4 px-4 pt-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                  <div className="h-5 flex-1 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && mutualFollowers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-[15px] font-bold text-[var(--shadow-text-primary)]">{t('authorFollowers.noMutualFollowers')}</div>
              <div className="mt-1 text-[12px] font-medium text-[var(--shadow-text-tertiary)]">
                {t('authorFollowers.noMutualHelp')}
              </div>
            </div>
          ) : null}

          {!loading && mutualFollowers.length > 0 ? (
            <div>
              {mutualFollowers.map((user) => (
                <PersonRow
                  key={getFollowerId(user)}
                  user={user}
                  showFollow={showReaderFollowButtons}
                  onToggleFollow={handleToggleUserFollow}
                  showOwnerMenu={false}
                  onOpenActions={setSelectedFollower}
                />
              ))}

              {mutualHasMore ? (
                <div className="px-4 py-4">
                  <button
                    type="button"
                    onClick={loadMoreMutualFollowers}
                    disabled={loadingMore}
                    className="h-11 w-full rounded-[12px] bg-[var(--shadow-bg-soft)] text-[14px] font-bold text-[var(--shadow-text-primary)] disabled:opacity-60"
                  >
                    {loadingMore ? t('authorFollowers.loading') : t('authorFollowers.loadMore')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10 sm:bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorFollowers.back')}
          >
            <i className="fa-solid fa-chevron-left text-[20px]" />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            <h1 className="truncate text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('authorFollowers.followers')}</h1>
            <p className="truncate text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">@{pageUsername}</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-0 pt-0 sm:px-4 sm:pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mb-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d] sm:mx-0 sm:w-full"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <div className="space-y-4 p-4">
            <div className="h-20 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
            <div className="h-40 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
            <div className="h-40 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
          </div>
        ) : null}

        {!loading ? (
          <section className="bg-[var(--shadow-bg-surface)] sm:overflow-hidden sm:rounded-[24px] sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
            {topFans.length ? (
              <button
                type="button"
                onClick={() => navigate(`/author/page/${pageUsername}/top-fans`)}
                className="flex w-full items-center gap-3 border-b border-[var(--shadow-border)] px-4 py-4 text-left active:bg-[var(--shadow-bg-soft)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[23px]">
                  💎
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[16px] font-bold text-[var(--shadow-text-primary)]">{t('authorFollowers.topFans')}</div>
                  <div className="mt-0.5 truncate text-[12px] font-medium text-[var(--shadow-text-secondary)]">
                    {topFans[0]?.name || t('authorFollowers.readers')}
                    {followersCount > 1 ? ` ${t('authorFollowers.andOthers', { count: formatCompactNumber(Math.max(0, followersCount - 1)) })}` : ''}
                  </div>
                </div>

                <i className="fa-solid fa-chevron-right text-[22px] text-[var(--shadow-text-secondary)]" />
              </button>
            ) : null}

            {!isOwner && mutualCount > 0 ? (
              <div className="border-b border-[var(--shadow-border)] px-4 py-5">
                <button
                  type="button"
                  onClick={openMutualFollowers}
                  className="mb-4 flex w-full items-center justify-between text-left active:opacity-70"
                >
                  <h2 className="text-[18px] font-semibold text-[var(--shadow-text-primary)]">
  {t('authorFollowers.mutualCount', { count: formatCompactNumber(mutualCount) })}
</h2>
                  <i className="fa-solid fa-chevron-right text-[18px] text-[var(--shadow-text-secondary)]" />
                </button>

                <div className="space-y-3">
                  {mutualPreview.slice(0, 4).map((user) => (
                    <PersonRow
                      key={getFollowerId(user)}
                      user={user}
                      showFollow={showReaderFollowButtons}
                      onToggleFollow={handleToggleUserFollow}
                      showOwnerMenu={false}
                      onOpenActions={setSelectedFollower}
                    />
                  ))}

                  {mutualCount > 4 ? (
                    <button
                      type="button"
                      onClick={openMutualFollowers}
                      className="flex min-h-[58px] w-full items-center gap-3 px-4 py-2 text-left active:bg-[var(--shadow-bg-soft)]"
                    >
                      <div className="relative h-12 w-12 shrink-0">
                        {mutualPreview.slice(0, 2).map((user, index) => (
                          <div
                            key={getFollowerId(user)}
                            className={`absolute ${index === 0 ? 'left-0 top-0' : 'bottom-0 right-0'}`}
                          >
                            <Avatar user={user} size="h-8 w-8" />
                          </div>
                        ))}
                      </div>

                      <div className="min-w-0 flex-1 truncate text-[15px] font-medium text-[var(--shadow-text-primary)]">
                        {mutualPreview[4]?.name || mutualPreview[0]?.name || t('authorFollowers.readers')} {t('authorFollowers.andMore', { count: formatCompactNumber(Math.max(0, mutualCount - 4)) })}
                      </div>
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="flex items-start justify-between gap-4 px-4 pb-2 pt-5">
              <div className="text-[18px] font-semibold text-[var(--shadow-text-primary)]">
  {t('authorFollowers.followersCount', { count: formatCompactNumber(followersCount) })}
</div>
            </div>

            {followers.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                  <i className="fa-regular fa-user text-[22px]" />
                </div>
                <div className="mt-4 text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorFollowers.noFollowersYet')}</div>
                <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
                  {t('authorFollowers.noFollowersHelp')}
                </div>
              </div>
            ) : null}

            {followers.length > 0 ? (
              <div className="pb-2">
                {followers.map((user) => (
                  <PersonRow
                    key={getFollowerId(user)}
                    user={user}
                    showFollow={showReaderFollowButtons}
                    onToggleFollow={handleToggleUserFollow}
                    showOwnerMenu={isOwner}
                    onOpenActions={setSelectedFollower}
                  />
                ))}

                {followersHasMore ? (
                  <div className="px-4 py-4">
                    <button
                      type="button"
                      onClick={loadMoreFollowers}
                      disabled={loadingMore}
                      className="h-11 w-full rounded-[12px] bg-[var(--shadow-bg-soft)] text-[14px] font-bold text-[var(--shadow-text-primary)] disabled:opacity-60"
                    >
                      {loadingMore ? t('authorFollowers.loading') : t('authorFollowers.loadMore')}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}
      </main>

      {isOwner && selectedFollower ? (
        <div className="fixed inset-0 z-[300] bg-black/35" onClick={() => setSelectedFollower(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[22px] bg-[var(--shadow-bg-surface)] px-4 pb-6 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[var(--shadow-border-strong)]" />

            <button
              type="button"
              onClick={() => {
                setSelectedFollower(null)
                setMessage(t('authorFollowers.messageSoon', { name: selectedName }))
              }}
              className="flex w-full items-center gap-3 rounded-[14px] px-2 py-3 text-left active:bg-[var(--shadow-bg-soft)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i className="fa-solid fa-comment-dots text-[16px]" />
              </span>
              <span className="text-[15px] font-medium text-[var(--shadow-text-primary)]">{t('authorFollowers.messageName', { name: selectedName })}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedFollower(null)
                setMessage(t('authorFollowers.blockSoon', { name: selectedName }))
              }}
              className="flex w-full items-center gap-3 rounded-[14px] px-2 py-3 text-left active:bg-[var(--shadow-bg-soft)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i className="fa-solid fa-user-slash text-[16px]" />
              </span>
              <span className="text-[15px] font-medium text-[var(--shadow-text-primary)]">{t('authorFollowers.blockName', { name: selectedName })}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
