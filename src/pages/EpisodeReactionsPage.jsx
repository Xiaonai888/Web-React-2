import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REACTION_META = {
  love: {
    label: 'Love',
    src: '/assets/React/1%20React_Love.svg',
  },
  haha: {
    label: 'Haha',
    src: '/assets/React/2%20React_Haha.svg',
  },
  wow: {
    label: 'Wow',
    src: '/assets/React/3%20React_Wow.svg',
  },
  sad: {
    label: 'Sad',
    src: '/assets/React/4%20React_Sad.svg',
  },
  angry: {
    label: 'Angry',
    src: '/assets/React/5%20React_Angry.svg',
  },
  support: {
    label: 'Support',
    src: '/assets/React/6%20React_Support.svg',
  },
  touched: {
    label: 'Touched',
    src: '/assets/React/7%20React_Touched.svg',
  },
}

function Avatar({ user }) {
  const avatar = user?.avatar_url || ''
  const name = user?.name || 'Reader'

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="h-12 w-12 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-[15px] font-bold text-white">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

export default function EpisodeReactionsPage() {
  const navigate = useNavigate()
  const { episodeId } = useParams()
  const [activeType, setActiveType] = useState('all')
  const [reactions, setReactions] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadReactions() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reactions/episode/${episodeId}?page=1&limit=200`
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load reactions')
        }

        if (!ignore) {
          setReactions(Array.isArray(data.reactions) ? data.reactions : [])
          setCounts(data.counts && typeof data.counts === 'object' ? data.counts : {})
        }
      } catch (error) {
        if (!ignore) {
          setReactions([])
          setCounts({})
          setMessage(error.message || 'Failed to load reactions')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    if (episodeId) loadReactions()

    return () => {
      ignore = true
    }
  }, [episodeId])

  const tabs = useMemo(() => {
    const available = Object.entries(REACTION_META)
      .filter(([type]) => Number(counts[type] || 0) > 0)
      .map(([type, meta]) => ({
        type,
        label: meta.label,
        count: Number(counts[type] || 0),
        src: meta.src,
      }))

    return [
      {
        type: 'all',
        label: 'All',
        count: reactions.length,
        src: '',
      },
      ...available,
    ]
  }, [counts, reactions.length])

  const visibleReactions = useMemo(() => {
    if (activeType === 'all') return reactions

    return reactions.filter(
      (item) => String(item.reaction_type || 'love').toLowerCase() === activeType
    )
  }, [activeType, reactions])

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[21px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate px-2 text-[19px] font-semibold">
            People who reacted
          </h1>

          <div className="h-10 w-10 shrink-0" />
        </div>

        <div className="overflow-x-auto">
          <div className="mx-auto flex min-w-max max-w-3xl px-4">
            {tabs.map((tab) => {
              const active = activeType === tab.type

              return (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => setActiveType(tab.type)}
                  className={`relative flex h-14 items-center gap-2 px-4 text-[15px] font-medium ${
                    active ? 'text-[#1976d2]' : 'text-[#667085]'
                  }`}
                >
                  {tab.src ? (
                    <img src={tab.src} alt="" className="h-6 w-6 object-contain" />
                  ) : null}

                  <span>{tab.label}</span>
                  <span>{tab.count.toLocaleString()}</span>

                  {active ? (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1976d2]" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex animate-pulse items-center gap-4 py-2">
                <div className="h-12 w-12 rounded-full bg-[#eef1f5]" />
                <div className="h-4 w-40 rounded-full bg-[#eef1f5]" />
              </div>
            ))}
          </div>
        ) : message ? (
          <div className="py-12 text-center text-[14px] font-medium text-[#667085]">
            {message}
          </div>
        ) : visibleReactions.length ? (
          <div>
            {visibleReactions.map((reaction) => {
              const type = String(reaction.reaction_type || 'love').toLowerCase()
              const meta = REACTION_META[type] || REACTION_META.love

              return (
                <div key={reaction.id} className="flex items-center gap-4 py-3">
                  <div className="relative shrink-0">
                    <Avatar user={reaction.user} />
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                      <img src={meta.src} alt={meta.label} className="h-5 w-5 object-contain" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[16px] font-semibold">
                      {reaction.user?.name || 'Reader'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i className="fa-regular fa-heart text-[22px]" />
            </div>
            <div className="mt-4 text-[16px] font-semibold">No reactions yet</div>
          </div>
        )}
      </section>
    </main>
  )
}
