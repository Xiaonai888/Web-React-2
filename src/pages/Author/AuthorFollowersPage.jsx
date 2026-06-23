import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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
  return user?.name || user?.display_name || user?.username || 'Reader'
}

function getFollowerId(user) {
  return String(user?.id || user?.user_id || user?.username || user?.reader_username || '')
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function Avatar({ user, size = 'h-12 w-12' }) {
  const name = getFollowerName(user)
  const avatar = user?.avatar_url || user?.profile_image || ''

  if (avatar) {
    return <img src={avatar} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />
  }

  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[#e5e7eb] text-[16px] font-black text-[#6b7280]`}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function FollowButton({ user, onToggle }) {
  if (!user?.username || user.is_me) return null

  return (
    <button
      type="button"
      onClick={() => onToggle(user)}
      className="h-9 rounded-[10px] bg-[#eef0f4] px-4 text-[14px] font-medium text-[#111827] active:scale-[0.98]"
    >
      {user.is_following ? 'Following' : 'Follow'}
    </button>
  )
}

function PersonRow({ user, showFollow, onToggleFollow, showOwnerMenu, onOpenActions }) {
  return (
    <div className="flex min-h-[66px] w-full items-center gap-3 px-4 py-2 text-left">
      <Avatar user={user} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-[#111827]">
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:bg-[#f3f4f6]"
          aria-label={`Open ${getFollowerName(user)} actions`}
        >
          <i className="fa-solid fa-ellipsis text-[16px]" />
        </button>
      ) : null}
    </div>
  )
}

export default function AuthorFollowersPage() {
  const navigate = useNavigate()
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
      throw new Error(data.message || 'Failed to load followers')
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
        throw new Error(data.message || 'Failed to update follow')
      }
    } catch (error) {
      patchUserFollowState(userId, { is_following: !nextFollowing })
      setMessage(error.message || 'Failed to update follow')
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
      setMessage(error.message || 'Failed to load followers')
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
      setMessage(error.message || 'Failed to load more followers')
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
      setMessage(error.message || 'Failed to load mutual followers')
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
      setMessage(error.message || 'Failed to load more mutual followers')
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
      <div className="min-h-screen bg-white pb-10">
        <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white">
          <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
            <button
              type="button"
              onClick={() => setScreen('main')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
              aria-label="Back"
            >
              <i className="fa-solid fa-chevron-left text-[20px]" />
            </button>

            <h1 className="text-[17px] font-bold text-[#111827]">Mutual followers</h1>

            <div className="h-10 w-10" />
          </div>
        </header>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[14px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <main className="mx-auto max-w-[720px] pt-3">
          <div className="px-4 pb-2 pt-3 text-[23px] font-bold text-[#111827]">
            {formatCompactNumber(mutualCount)} mutual
          </div>

          {loading ? (
            <div className="space-y-4 px-4 pt-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-[#eef0f4]" />
                  <div className="h-5 flex-1 animate-pulse rounded-full bg-[#eef0f4]" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && mutualFollowers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-[15px] font-bold text-[#111827]">No mutual followers</div>
              <div className="mt-1 text-[12px] font-medium text-[#8b93a1]">
                People you follow who also follow this page will appear here.
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
                    className="h-11 w-full rounded-[12px] bg-[#f3f4f6] text-[14px] font-bold text-[#111827] disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading...' : 'Load more'}
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
    <div className="min-h-screen bg-white pb-10 sm:bg-[#f5f3fa]">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[20px]" />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            <h1 className="truncate text-[17px] font-bold text-[#111827]">Followers</h1>
            <p className="truncate text-[11px] font-semibold text-[#8b93a1]">@{pageUsername}</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-0 pt-0 sm:px-4 sm:pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mb-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d] sm:mx-0 sm:w-full"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <div className="space-y-4 p-4">
            <div className="h-20 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
            <div className="h-40 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
            <div className="h-40 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
          </div>
        ) : null}

        {!loading ? (
          <section className="bg-white sm:overflow-hidden sm:rounded-[24px] sm:shadow-sm sm:ring-1 sm:ring-black/5">
            {topFans.length ? (
              <button
                type="button"
                onClick={() => navigate(`/author/page/${pageUsername}/top-fans`)}
                className="flex w-full items-center gap-3 border-b border-[#eef0f4] px-4 py-4 text-left active:bg-[#f8fafc]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[23px]">
                  💎
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[16px] font-bold text-[#111827]">Top fans</div>
                  <div className="mt-0.5 truncate text-[12px] font-medium text-[#6b7280]">
                    {topFans[0]?.name || 'Readers'}
                    {followersCount > 1 ? ` and ${formatCompactNumber(Math.max(0, followersCount - 1))} others` : ''}
                  </div>
                </div>

                <i className="fa-solid fa-chevron-right text-[22px] text-[#6b7280]" />
              </button>
            ) : null}

            {!isOwner && mutualCount > 0 ? (
              <div className="border-b border-[#eef0f4] px-4 py-5">
                <button
                  type="button"
                  onClick={openMutualFollowers}
                  className="mb-4 flex w-full items-center justify-between text-left active:opacity-70"
                >
                  <h2 className="text-[18px] font-semibold text-[#111827]">
  {formatCompactNumber(mutualCount)} mutual
</h2>
                  <i className="fa-solid fa-chevron-right text-[18px] text-[#6b7280]" />
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
                      className="flex min-h-[58px] w-full items-center gap-3 px-4 py-2 text-left active:bg-[#f8fafc]"
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

                      <div className="min-w-0 flex-1 truncate text-[15px] font-medium text-[#111827]">
                        {mutualPreview[4]?.name || mutualPreview[0]?.name || 'Readers'} and {formatCompactNumber(Math.max(0, mutualCount - 4))} more
                      </div>
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="flex items-start justify-between gap-4 px-4 pb-2 pt-5">
              <div className="text-[18px] font-semibold text-[#111827]">
  {formatCompactNumber(followersCount)} followers
</div>
            </div>

            {followers.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                  <i className="fa-regular fa-user text-[22px]" />
                </div>
                <div className="mt-4 text-[15px] font-black text-[#111827]">No followers yet</div>
                <div className="mt-1 text-[12px] font-semibold text-[#8b93a1]">
                  Readers who follow this page will appear here.
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
                      className="h-11 w-full rounded-[12px] bg-[#f3f4f6] text-[14px] font-bold text-[#111827] disabled:opacity-60"
                    >
                      {loadingMore ? 'Loading...' : 'Load more'}
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
            className="absolute bottom-0 left-0 right-0 rounded-t-[22px] bg-white px-4 pb-6 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#c7ccd5]" />

            <button
              type="button"
              onClick={() => {
                setSelectedFollower(null)
                setMessage(`Message ${selectedName} is coming soon.`)
              }}
              className="flex w-full items-center gap-3 rounded-[14px] px-2 py-3 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
                <i className="fa-solid fa-comment-dots text-[16px]" />
              </span>
              <span className="text-[15px] font-medium text-[#111827]">Message {selectedName}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedFollower(null)
                setMessage(`Block ${selectedName} is coming soon.`)
              }}
              className="flex w-full items-center gap-3 rounded-[14px] px-2 py-3 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
                <i className="fa-solid fa-user-slash text-[16px]" />
              </span>
              <span className="text-[15px] font-medium text-[#111827]">Block {selectedName}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
