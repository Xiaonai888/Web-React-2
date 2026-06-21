import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getFanName(user) {
  return user?.name || user?.display_name || user?.username || 'Reader'
}

function Avatar({ user }) {
  const name = getFanName(user)
  const avatar = user?.avatar_url || user?.profile_image || ''

  if (avatar) {
    return <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-[16px] font-black text-white">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

export default function AuthorTopFansPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const [followers, setFollowers] = useState([])
  const [removedFanIds, setRemovedFanIds] = useState([])
  const [selectedFan, setSelectedFan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadTopFans() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load top fans')
        }

        if (ignore) return

        setFollowers(data.followers || data.items || [])
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load top fans')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadTopFans()

    return () => {
      ignore = true
    }
  }, [pageUsername, navigate])

  const topFans = useMemo(() => {
    return followers
      .filter((fan) => {
        const id = String(fan.id || fan.user_id || fan.username || fan.reader_username || '')
        return !removedFanIds.includes(id)
      })
      .slice(0, 20)
  }, [followers, removedFanIds])

  function getFanId(fan) {
    return String(fan?.id || fan?.user_id || fan?.username || fan?.reader_username || '')
  }

  function removeSelectedFanBadge() {
    if (!selectedFan) return
    const fanId = getFanId(selectedFan)

    if (fanId) {
      setRemovedFanIds((current) => (current.includes(fanId) ? current : [...current, fanId]))
    }

    setMessage(`Removed Top Fan Badge from ${getFanName(selectedFan)}.`)
    setSelectedFan(null)
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[#111827]">Top fans</h1>

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

      <main className="mx-auto max-w-[720px] pt-12">
        {loading ? (
          <div className="space-y-6 px-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-full bg-[#eef0f4]" />
                <div className="h-5 flex-1 animate-pulse rounded-full bg-[#eef0f4]" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-[#eef0f4]" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && topFans.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef6ff] text-[28px]">
              💎
            </div>
            <div className="mt-4 text-[18px] font-black text-[#111827]">No Top Fan yet</div>
            <div className="mx-auto mt-2 max-w-[280px] text-[13px] font-medium leading-6 text-[#8b93a1]">
              Top fans will appear here after readers become more active on this page.
            </div>
          </div>
        ) : null}

        {!loading && topFans.length > 0 ? (
          <div className="space-y-2 px-4">
            {topFans.map((fan) => {
              const name = getFanName(fan)

              return (
                <div
                  key={getFanId(fan)}
                  className="flex min-h-[60px] items-center gap-3 rounded-[14px] px-4 py-2"
                >
                  <Avatar user={fan} />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold text-[#111827]">
                      {name}
                    </div>
                    {fan.top_fan_streak ? (
                      <div className="mt-0.5 truncate text-[16px] font-normal text-[#6b7280]">
                        {fan.top_fan_streak}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFan(fan)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
                    aria-label={`Open ${name} options`}
                  >
                    <i className="fa-solid fa-ellipsis text-[16px]" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : null}
      </main>

      {selectedFan ? (
        <div className="fixed inset-0 z-[300] bg-black/40" onClick={() => setSelectedFan(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[22px] bg-white px-4 pb-6 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-6 h-1 w-14 rounded-full bg-[#9ca3af]" />

            <h2className="mb-4 text-[20px] font-bold tracking-[-0.01em] text-[#111827]">
              {getFanName(selectedFan)}
            </h2>

            <button
              type="button"
              onClick={removeSelectedFanBadge}
              className="mb-5 flex w-full items-center gap-4 text-left active:opacity-70"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black text-white">
                <i className="fa-solid fa-xmark text-[17px]" />
              </span>
              <span className="text-[15px] font-medium text-[#111827]">Remove Top Fan Badge</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFan(null)}
              className="text-[21px] font-normal text-[#111827] active:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
