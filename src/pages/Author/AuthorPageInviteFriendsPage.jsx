import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageInviteFriends', {
  "en": {
    "reader": "Reader",
    "authorPage": "Author Page",
    "authorPageNotFound": "Author Page not found",
    "failedLoadAccount": "Failed to load your account",
    "failedLoadFriends": "Failed to load friends",
    "failedSendInvite": "Failed to send invite",
    "back": "Back",
    "inviteFriends": "Invite friends",
    "inviteHelp": "Invite friends you follow to follow {{name}}.",
    "searchFriends": "Search friends",
    "clear": "Clear",
    "friendsYouFollow": "Friends you follow",
    "loading": "Loading...",
    "invited": "Invited",
    "following": "Following",
    "invite": "Invite",
    "followsYou": "Follows you",
    "noFriendsFound": "No friends found.",
    "notFollowingAnyone": "You are not following anyone yet."
  },
  "km": {
    "reader": "អ្នកអាន",
    "authorPage": "ទំព័រអ្នកនិពន្ធ",
    "authorPageNotFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "failedLoadAccount": "មិនអាចផ្ទុកគណនីរបស់អ្នកបានទេ",
    "failedLoadFriends": "មិនអាចផ្ទុកមិត្តភក្តិបានទេ",
    "failedSendInvite": "មិនអាចផ្ញើការអញ្ជើញបានទេ",
    "back": "ត្រឡប់ក្រោយ",
    "inviteFriends": "អញ្ជើញមិត្តភក្តិ",
    "inviteHelp": "អញ្ជើញមិត្តភក្តិដែលអ្នកតាមដាន ឱ្យតាមដាន {{name}}។",
    "searchFriends": "ស្វែងរកមិត្តភក្តិ",
    "clear": "សម្អាត",
    "friendsYouFollow": "មិត្តភក្តិដែលអ្នកតាមដាន",
    "loading": "កំពុងផ្ទុក...",
    "invited": "បានអញ្ជើញ",
    "following": "កំពុងតាមដាន",
    "invite": "អញ្ជើញ",
    "followsYou": "តាមដានអ្នក",
    "noFriendsFound": "រកមិនឃើញមិត្តភក្តិ។",
    "notFollowingAnyone": "អ្នកមិនទាន់តាមដាននរណាម្នាក់ទេ។"
  },
  "zh": {
    "reader": "读者",
    "authorPage": "作者主页",
    "authorPageNotFound": "未找到作者主页",
    "failedLoadAccount": "无法加载你的账号",
    "failedLoadFriends": "无法加载好友",
    "failedSendInvite": "无法发送邀请",
    "back": "返回",
    "inviteFriends": "邀请好友",
    "inviteHelp": "邀请你关注的好友关注 {{name}}。",
    "searchFriends": "搜索好友",
    "clear": "清除",
    "friendsYouFollow": "你关注的好友",
    "loading": "加载中...",
    "invited": "已邀请",
    "following": "已关注",
    "invite": "邀请",
    "followsYou": "关注了你",
    "noFriendsFound": "未找到好友。",
    "notFollowingAnyone": "你还没有关注任何人。"
  },
  "ja": {
    "reader": "読者",
    "authorPage": "著者ページ",
    "authorPageNotFound": "著者ページが見つかりません",
    "failedLoadAccount": "アカウントを読み込めませんでした",
    "failedLoadFriends": "友達を読み込めませんでした",
    "failedSendInvite": "招待を送信できませんでした",
    "back": "戻る",
    "inviteFriends": "友達を招待",
    "inviteHelp": "あなたがフォローしている友達を {{name}} のフォローに招待します。",
    "searchFriends": "友達を検索",
    "clear": "クリア",
    "friendsYouFollow": "フォローしている友達",
    "loading": "読み込み中...",
    "invited": "招待済み",
    "following": "フォロー中",
    "invite": "招待",
    "followsYou": "あなたをフォロー中",
    "noFriendsFound": "友達が見つかりません。",
    "notFollowingAnyone": "まだ誰もフォローしていません。"
  },
  "ko": {
    "reader": "독자",
    "authorPage": "작가 페이지",
    "authorPageNotFound": "작가 페이지를 찾을 수 없습니다",
    "failedLoadAccount": "계정을 불러오지 못했습니다",
    "failedLoadFriends": "친구를 불러오지 못했습니다",
    "failedSendInvite": "초대를 보내지 못했습니다",
    "back": "뒤로",
    "inviteFriends": "친구 초대",
    "inviteHelp": "내가 팔로우하는 친구를 {{name}} 팔로우에 초대합니다.",
    "searchFriends": "친구 검색",
    "clear": "지우기",
    "friendsYouFollow": "내가 팔로우하는 친구",
    "loading": "불러오는 중...",
    "invited": "초대됨",
    "following": "팔로잉",
    "invite": "초대",
    "followsYou": "나를 팔로우함",
    "noFriendsFound": "친구를 찾을 수 없습니다.",
    "notFollowingAnyone": "아직 아무도 팔로우하지 않았습니다."
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function Avatar({ user }) {
  const name = user?.name || user?.username || getDisplayText('authorPageInviteFriends.reader')

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[15px] font-bold text-[var(--shadow-text-primary)]">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={name} className="h-full w-full object-cover" />
      ) : (
        String(name).slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

export default function AuthorPageInviteFriendsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { pageUsername } = useParams()
  const [authorPage, setAuthorPage] = useState(null)
  const [friends, setFriends] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [inviteState, setInviteState] = useState({})

  const pageName = authorPage?.page_name || t('authorPageInviteFriends.authorPage')

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return undefined
    }

    let ignore = false
    const controller = new AbortController()

    async function loadPage() {
      try {
        setLoading(true)
        setMessage('')

        const [authorResponse, meResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername || '')}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }),
        ])

        const authorData = await authorResponse.json().catch(() => ({}))
        const meData = await meResponse.json().catch(() => ({}))

        if (!authorResponse.ok || authorData.ok === false) {
          throw new Error(authorData.message || t('authorPageInviteFriends.authorPageNotFound'))
        }

        if (!meResponse.ok || meData.ok === false || !meData.user?.username) {
          throw new Error(meData.message || t('authorPageInviteFriends.failedLoadAccount'))
        }

        const allFriends = []
        let currentPage = 1
        let hasNext = true

        while (hasNext && currentPage <= 20) {
          const response = await fetch(
            `${API_BASE_URL}/api/users/${encodeURIComponent(meData.user.username)}/following?page=${currentPage}&limit=50`,
            {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            }
          )
          const data = await response.json().catch(() => ({}))

          if (!response.ok || data.ok === false) {
            throw new Error(data.message || t('authorPageInviteFriends.failedLoadFriends'))
          }

          allFriends.push(...(Array.isArray(data.users) ? data.users : []))
          hasNext = Boolean(data.has_next)
          currentPage += 1
        }

        if (!ignore) {
          setAuthorPage(authorData.author_page || authorData.page || null)
          setFriends(allFriends.filter((user) => !user?.is_author))
        }
      } catch (error) {
        if (!ignore && error?.name !== 'AbortError') {
          setMessage(error.message || t('authorPageInviteFriends.failedLoadFriends'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPage()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, pageUsername])

  const filteredFriends = useMemo(() => {
    const text = query.trim().toLowerCase()

    if (!text) return friends

    return friends.filter((user) =>
      [user?.name, user?.username, user?.bio]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text))
    )
  }, [friends, query])

  async function inviteFriend(user) {
    const token = getAuthToken()
    const userId = String(user?.id || '')

    if (!token) {
      navigate('/login')
      return
    }

    if (!userId || inviteState[userId] === 'loading') return

    try {
      setInviteState((current) => ({ ...current, [userId]: 'loading' }))
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername || '')}/invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ target_user_id: userId }),
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('authorPageInviteFriends.failedSendInvite'))
      }

      setInviteState((current) => ({
        ...current,
        [userId]: data.status === 'following' ? 'following' : 'invited',
      }))
    } catch (error) {
      setInviteState((current) => ({ ...current, [userId]: 'idle' }))
      setMessage(error.message || t('authorPageInviteFriends.failedSendInvite'))
    }
  }

  function getButtonState(userId) {
    return inviteState[String(userId)] || 'idle'
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorPageInviteFriends.back')}
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <h1 className="ml-2 text-[18px] font-bold text-[var(--shadow-text-primary)]">{t('authorPageInviteFriends.inviteFriends')}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] pb-10">
        <section className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-2">
          <p className="text-[14px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
            {t('authorPageInviteFriends.inviteHelp', { name: pageName })}
          </p>

          <div className="mt-4 flex h-10 items-center rounded-full bg-[var(--shadow-bg-soft)] px-3">
            <i className="fa-solid fa-magnifying-glass mr-2 text-[14px] text-[var(--shadow-text-secondary)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('authorPageInviteFriends.searchFriends')}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-text-tertiary)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="ml-2 flex h-7 w-7 items-center justify-center text-[var(--shadow-text-secondary)]"
                aria-label={t('authorPageInviteFriends.clear')}
              >
                <i className="fa-solid fa-xmark text-[13px]" />
              </button>
            ) : null}
          </div>
        </section>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mt-2 w-full bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[13px] font-normal text-[var(--shadow-text-primary)]"
          >
            {message}
          </button>
        ) : null}

        <div className="mt-2 bg-[var(--shadow-bg-surface)]">
          <div className="px-4 pb-2 pt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorPageInviteFriends.friendsYouFollow')}
          </div>

          {loading ? (
            <div className="px-4 py-10 text-center text-[13px] font-normal text-[var(--shadow-text-secondary)]">
              {t('authorPageInviteFriends.loading')}
            </div>
          ) : filteredFriends.length ? (
            filteredFriends.map((user) => {
              const state = getButtonState(user.id)
              const disabled = state === 'loading' || state === 'invited' || state === 'following'
              const label =
                state === 'loading'
                  ? '...'
                  : state === 'invited'
                    ? t('authorPageInviteFriends.invited')
                    : state === 'following'
                      ? t('authorPageInviteFriends.following')
                      : t('authorPageInviteFriends.invite')

              return (
                <div key={user.id} className="flex min-h-[68px] items-center gap-3 px-4 py-3">
                  <Avatar user={user} />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold text-[var(--shadow-text-primary)]">
                      {user.name || user.username || t('authorPageInviteFriends.reader')}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
                      @{user.username || 'reader'}
                      {user.is_followed_by ? ` · ${t('authorPageInviteFriends.followsYou')}` : ''}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => inviteFriend(user)}
                    disabled={disabled}
                    className={`h-9 min-w-[78px] rounded-full px-4 text-[13px] font-bold active:scale-[0.98] disabled:active:scale-100 ${
                      state === 'idle'
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-[#ede9fe] text-[#6d28d9]'
                    }`}
                  >
                    {label}
                  </button>
                </div>
              )
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <i className="fa-regular fa-address-book text-[28px] text-[var(--shadow-text-tertiary)]" />
              <p className="mt-3 text-[14px] font-normal text-[var(--shadow-text-secondary)]">
                {query ? t('authorPageInviteFriends.noFriendsFound') : t('authorPageInviteFriends.notFollowingAnyone')}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
