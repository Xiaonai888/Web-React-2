import {
  LoaderCircle,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatSuggestedPeople', {
  en: {
    reader: 'Reader',
    author: 'Author',
    loadFailed: 'Failed to load suggestions',
    followFailed: 'Failed to follow account',
    title: 'People You May Know',
    seeAll: 'See all',
    followers: '{{count}} followers',
    following: 'Following',
    follow: 'Follow',
  },
  km: {
    reader: 'អ្នកអាន',
    author: 'អ្នកនិពន្ធ',
    loadFailed: 'មិនអាចផ្ទុកការណែនាំបានទេ',
    followFailed: 'មិនអាច Follow គណនីនេះបានទេ',
    title: 'មនុស្សដែលអ្នកប្រហែលជាស្គាល់',
    seeAll: 'មើលទាំងអស់',
    followers: '{{count}} អ្នកតាម',
    following: 'កំពុងតាម',
    follow: 'តាម',
  },
  zh: {
    reader: '读者',
    author: '作者',
    loadFailed: '无法加载推荐',
    followFailed: '无法关注该账户',
    title: '你可能认识的人',
    seeAll: '查看全部',
    followers: '{{count}} 位关注者',
    following: '已关注',
    follow: '关注',
  },
  ja: {
    reader: '読者',
    author: '作者',
    loadFailed: 'おすすめを読み込めませんでした',
    followFailed: 'アカウントをフォローできませんでした',
    title: '知り合いかもしれない人',
    seeAll: 'すべて見る',
    followers: 'フォロワー {{count}}',
    following: 'フォロー中',
    follow: 'フォロー',
  },
  ko: {
    reader: '독자',
    author: '작가',
    loadFailed: '추천 사용자를 불러오지 못했습니다',
    followFailed: '계정을 팔로우하지 못했습니다',
    title: '알 수도 있는 사람',
    seeAll: '모두 보기',
    followers: '팔로워 {{count}}명',
    following: '팔로잉',
    follow: '팔로우',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HIDDEN_SUGGESTIONS_KEY =
  'shadow_reader_hidden_suggestions_v1'
const HIDDEN_DURATION_MS =
  30 * 24 * 60 * 60 * 1000

function getToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readHiddenSuggestions() {
  try {
    const now = Date.now()
    const stored = JSON.parse(
      localStorage.getItem(
        HIDDEN_SUGGESTIONS_KEY
      ) || '{}'
    )

    const active = Object.fromEntries(
      Object.entries(stored).filter(
        ([, expiresAt]) =>
          Number(expiresAt) > now
      )
    )

    localStorage.setItem(
      HIDDEN_SUGGESTIONS_KEY,
      JSON.stringify(active)
    )

    return active
  } catch {
    return {}
  }
}

function formatFollowers(value) {
  const count = Number(value || 0)

  if (count >= 1000000) {
    return `${(count / 1000000)
      .toFixed(count >= 10000000 ? 0 : 1)
      .replace('.0', '')}M`
  }

  if (count >= 1000) {
    return `${(count / 1000)
      .toFixed(count >= 10000 ? 0 : 1)
      .replace('.0', '')}K`
  }

  return String(count)
}

function SuggestedAvatar({ user }) {
  const [failed, setFailed] = useState(false)
  const name =
    user?.name ||
    user?.username ||
    'Reader'
  const letter =
    String(name).trim().charAt(0).toUpperCase() ||
    'R'

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-extrabold text-white">
      {user?.avatar_url && !failed ? (
        <img
          src={user.avatar_url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

export default function ChatSuggestedPeople() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [hiddenSuggestions, setHiddenSuggestions] =
    useState(readHiddenSuggestions)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadSuggestions() {
      const token = getToken()

      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const response = await fetch(
          `${API_BASE_URL}/api/users/suggestions?page=1&limit=12`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
              t('chatSuggestedPeople.loadFailed')
          )
        }

        if (!ignore) {
          setUsers(
            Array.isArray(data.users)
              ? data.users
              : []
          )
          setHiddenSuggestions(
            readHiddenSuggestions()
          )
          setMessage('')
        }
      } catch (error) {
        if (!ignore) {
          setUsers([])
          setMessage(
            error.message ||
              t('chatSuggestedPeople.loadFailed')
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadSuggestions()

    return () => {
      ignore = true
    }
  }, [])

  const visibleUsers = useMemo(() => {
    const hiddenIds = new Set(
      Object.keys(hiddenSuggestions)
    )

        return users
      .filter(
        (user) =>
          !user.is_following &&
          !hiddenIds.has(String(user.id))
      )
      .slice(0, 3)
  }, [hiddenSuggestions, users])

  const hideSuggestion = (userId) => {
    const next = {
      ...readHiddenSuggestions(),
      [String(userId)]:
        Date.now() + HIDDEN_DURATION_MS,
    }

    localStorage.setItem(
      HIDDEN_SUGGESTIONS_KEY,
      JSON.stringify(next)
    )
    setHiddenSuggestions(next)
  }

  const handleFollow = async (user) => {
    if (
      !user?.username ||
      user.is_following ||
      actionId
    ) {
      return
    }

    const token = getToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setActionId(user.id)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/users/${encodeURIComponent(
          user.username
        )}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
            t('chatSuggestedPeople.followFailed')
        )
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                is_following: true,
              }
            : item
        )
      )
    } catch (error) {
      setMessage(
        error.message ||
          t('chatSuggestedPeople.followFailed')
      )
    } finally {
      setActionId('')
    }
  }

  if (
    !loading &&
    !visibleUsers.length &&
    !message
  ) {
    return null
  }

  return (
    <section className="border-t border-[var(--shadow-border)] px-4 pb-5 pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-extrabold text-[var(--shadow-text-primary)]">
          {t('chatSuggestedPeople.title')}
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate('/profile/discover-people')
          }
          className="text-[13px] font-normal text-[#7c3aed] active:opacity-70"
        >
          {t('chatSuggestedPeople.seeAll')}
        </button>
      </div>

      {message ? (
        <div className="mb-3 rounded-[14px] bg-[#fff1f1] px-3 py-2 text-[11px] font-semibold text-[#d13a42] dark:bg-[#7f1d1d]/25 dark:text-[#fca5a5]">
          {message}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3"
              >
                <div className="h-12 w-12 rounded-full bg-[var(--shadow-bg-soft)]" />
                <div className="min-w-0 flex-1">
                  <div className="h-3 w-28 rounded-full bg-[var(--shadow-bg-soft)]" />
                  <div className="mt-2 h-3 w-36 rounded-full bg-[var(--shadow-bg-hover)]" />
                </div>
                <div className="h-9 w-24 rounded-[10px] bg-[var(--shadow-bg-soft)]" />
              </div>
            )
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visibleUsers.map((user) => {
            const following = Boolean(
              user.is_following
            )
            const busy =
              actionId === user.id

            return (
              <article
                key={user.id}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/profile?username=${encodeURIComponent(
                        user.username
                      )}`
                    )
                  }
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <SuggestedAvatar user={user} />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
                      {user.name ||
                        user.username}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] font-medium text-[var(--shadow-text-secondary)]">
                      {user.is_author
                        ? t('chatSuggestedPeople.author')
                        : t('chatSuggestedPeople.reader')}
                      {' · '}
                      {t('chatSuggestedPeople.followers', {
                        count: formatFollowers(
                          user.followers_count
                        ),
                      })}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleFollow(user)
                  }
                  disabled={
                    following || busy
                  }
                  className={`flex h-9 min-w-[96px] items-center justify-center rounded-[10px] px-4 text-[12px] font-extrabold transition active:scale-[0.98] disabled:cursor-default ${
                    following
                      ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                      : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-none'
                  }`}
                >
                  {busy ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  ) : following ? (
                    t('chatSuggestedPeople.following')
                  ) : (
                    t('chatSuggestedPeople.follow')
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    hideSuggestion(user.id)
                  }
                  aria-label={`Hide ${
                    user.name ||
                    user.username
                  }`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] transition active:scale-90"
                >
                  <X size={17} />
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
