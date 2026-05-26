import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const tabs = ['Posts', 'Works', 'About']

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeAuthor(page, pageUsername, myPage = null) {
  const author = page || {}

  return {
    id: author.id || '',
    user_id: author.user_id || '',
    page_name: author.page_name || author.name || 'Author Page',
    page_username: author.page_username || author.username || pageUsername || 'author',
    page_slug: author.page_slug || author.page_username || pageUsername || 'author',
    bio: author.bio || 'This author has not added a bio yet.',
    avatar_url: author.avatar_url || author.profile_image_url || '',
    cover_url: author.cover_url || author.banner_url || '',
    works_count: Number(author.total_stories || author.works_count || 0),
    followers_count: Number(author.total_followers || author.followers_count || 0),
    fans_count: Number(author.total_fans || author.fans_count || 0),
    likes_count: Number(author.total_likes || author.likes_count || 0),
    created_at: author.created_at || '',
    updated_at: author.updated_at || '',
    is_owner: Boolean(myPage?.id && author.id && myPage.id === author.id),
  }
}

async function fetchPublicAuthorPage(pageUsername) {
  const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Author page not found')
  }

  return data.author_page || data.author || data.page || null
}

async function fetchMyAuthorPage() {
  const token = getAuthToken()

  if (!token) return null

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) return null

    return data.author_page || null
  } catch (error) {
    console.error('Fetch my author page error:', error)
    return null
  }
}

function StatItem({ value, label }) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[18px] font-black leading-tight text-[#111827] sm:text-[20px]">
        {formatCompactNumber(value)}
      </div>
      <div className="mt-0.5 text-[12px] font-semibold text-[#6b7280] sm:text-[13px]">
        {label}
      </div>
    </div>
  )
}

function EmptyPanel({ title, text }) {
  return (
    <div className="rounded-[24px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-file-lines text-[20px]" />
      </div>
      <h3 className="text-[16px] font-black text-[#111827]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        {text}
      </p>
    </div>
  )
}

function AuthorNotFound({ onBack }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-10">
      <div className="mx-auto max-w-[420px] rounded-[28px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
          <i className="fa-regular fa-user text-[24px]" />
        </div>
        <h1 className="text-[20px] font-black text-[#111827]">Author page not found</h1>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#8b93a1]">
          This author page may be unavailable or the username is incorrect.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 h-11 w-full rounded-full bg-[#111827] text-[14px] font-black text-white"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

export default function AuthorPublicPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const [author, setAuthor] = useState(null)
  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadAuthor() {
      try {
        setLoading(true)
        setError('')

        const [publicPage, myPage] = await Promise.all([
          fetchPublicAuthorPage(pageUsername),
          fetchMyAuthorPage(),
        ])

        if (!ignore) {
          setAuthor(normalizeAuthor(publicPage, pageUsername, myPage))
        }
      } catch (loadError) {
        if (!ignore) {
          setAuthor(null)
          setError(loadError.message || 'Author page not found')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadAuthor()

    return () => {
      ignore = true
    }
  }, [pageUsername])

  const actionButtons = useMemo(() => {
    if (author?.is_owner) {
      return [
        { label: 'Edit Page', icon: 'fa-pen', type: 'primary' },
        { label: 'Add Story', icon: 'fa-plus', type: 'secondary', onClick: () => navigate('/author/create-story') },
      ]
    }

    return [
      { label: 'Follow', icon: 'fa-user-plus', type: 'primary' },
      { label: 'Message', icon: 'fa-comment', type: 'secondary' },
    ]
  }, [author?.is_owner, navigate])

  if (!loading && error) {
    return <AuthorNotFound onBack={() => navigate(-1)} />
  }

  const displayAuthor = author || {
    page_name: 'Loading',
    page_username: pageUsername || 'author',
    bio: '',
    avatar_url: '',
    cover_url: '',
    works_count: 0,
    followers_count: 0,
    fans_count: 0,
    likes_count: 0,
    is_owner: false,
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            <div className="truncate text-[15px] font-black text-[#111827] sm:text-[17px]">
              @{displayAuthor.page_username}
            </div>
          </div>

          <Link
            to="/search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-magnifying-glass text-[16px]" />
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-[980px]">
        <section className="bg-white shadow-sm">
          <div className="relative h-[210px] bg-[#111827] sm:h-[280px]">
            {displayAuthor.cover_url ? (
              <img
                src={displayAuthor.cover_url}
                alt={displayAuthor.page_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]" />
            )}

            {displayAuthor.is_owner ? (
              <button
                type="button"
                className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-[12px] font-black text-[#111827] shadow-sm"
              >
                <i className="fa-solid fa-camera mr-2" />
                Edit Cover
              </button>
            ) : null}
          </div>

          <div className="px-4 pb-5 sm:px-6">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="-mt-16 h-[124px] w-[124px] shrink-0 rounded-full border-4 border-white bg-[#f3f4f6] shadow-sm sm:h-[148px] sm:w-[148px]">
                {displayAuthor.avatar_url ? (
                  <img
                    src={displayAuthor.avatar_url}
                    alt={displayAuthor.page_name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e5e7eb] text-[42px] font-black text-[#9ca3af]">
                    {displayAuthor.page_name.slice(0, 1).toUpperCase()}
                  </div>
                )}

                {displayAuthor.is_owner ? (
                  <button
                    type="button"
                    className="absolute left-[92px] top-[44px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#111827] text-white shadow-sm sm:left-[112px] sm:top-[58px]"
                  >
                    <i className="fa-solid fa-camera text-[13px]" />
                  </button>
                ) : null}
              </div>

              <div className="min-w-0 flex-1 sm:pb-2">
                {loading ? (
                  <div className="h-8 w-52 animate-pulse rounded-full bg-[#f3f4f6]" />
                ) : (
                  <h1 className="line-clamp-1 text-[24px] font-black tracking-tight text-[#111827] sm:text-[30px]">
                    {displayAuthor.page_name}
                  </h1>
                )}

                <p className="mt-1 text-[13px] font-bold text-[#6b7280] sm:text-[14px]">
                  @{displayAuthor.page_username}
                </p>

                {loading ? (
                  <div className="mt-3 h-4 w-full max-w-[420px] animate-pulse rounded-full bg-[#f3f4f6]" />
                ) : (
                  <p className="mt-2 line-clamp-2 max-w-[620px] text-[13px] font-medium leading-6 text-[#374151] sm:text-[14px]">
                    {displayAuthor.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 rounded-[22px] bg-[#f8fafc] p-4 ring-1 ring-black/5">
              <StatItem value={displayAuthor.works_count} label="Works" />
              <StatItem value={displayAuthor.followers_count || displayAuthor.fans_count} label="Followers" />
              <StatItem value={displayAuthor.likes_count} label="Likes" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              {actionButtons.map((button) => (
                <button
                  key={button.label}
                  type="button"
                  onClick={button.onClick}
                  className={`h-11 flex-1 rounded-full text-[14px] font-black transition active:scale-[0.98] ${
                    button.type === 'primary'
                      ? 'bg-[#111827] text-white'
                      : 'bg-[#f3f4f6] text-[#111827]'
                  }`}
                >
                  <i className={`fa-solid ${button.icon} mr-2 text-[13px]`} />
                  {button.label}
                </button>
              ))}

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] transition active:scale-[0.98]"
              >
                <i className="fa-solid fa-ellipsis text-[15px]" />
              </button>
            </div>
          </div>
        </section>

        <section className="sticky top-14 z-30 border-y border-[#eef0f4] bg-white">
          <div className="grid grid-cols-3 px-4">
            {tabs.map((tab) => {
              const active = activeTab === tab

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative h-12 text-[14px] font-black ${
                    active ? 'text-[#111827]' : 'text-[#8b93a1]'
                  }`}
                >
                  {tab}
                  {active ? (
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[#111827]" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>

        <section className="px-4 py-5 sm:px-0">
          {activeTab === 'Posts' ? (
            <EmptyPanel
              title="No posts yet"
              text="Author posts and announcements will appear here."
            />
          ) : null}

          {activeTab === 'Works' ? (
            <EmptyPanel
              title="No works yet"
              text="Published novels, chat stories, and manga will appear here."
            />
          ) : null}

          {activeTab === 'About' ? (
            <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h2 className="text-[18px] font-black text-[#111827]">About</h2>
              <p className="mt-3 text-[14px] font-medium leading-7 text-[#374151]">
                {displayAuthor.bio}
              </p>

              <div className="mt-5 space-y-3 text-[13px] font-bold text-[#4b5563]">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-book-open w-5 text-[#9ca3af]" />
                  <span>{formatCompactNumber(displayAuthor.works_count)} works</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-users w-5 text-[#9ca3af]" />
                  <span>{formatCompactNumber(displayAuthor.followers_count || displayAuthor.fans_count)} followers</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-heart w-5 text-[#9ca3af]" />
                  <span>{formatCompactNumber(displayAuthor.likes_count)} likes</span>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}
