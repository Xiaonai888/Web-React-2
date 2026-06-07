import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REACTIONS = [
  {
    type: 'love',
    label: 'Love',
    src: '/assets/React/1%20React_Love.svg',
    bg: '#fff0f4',
    text: '#ff2f5f',
  },
  {
    type: 'haha',
    label: 'Haha',
    src: '/assets/React/2%20React_Haha.svg',
    bg: '#fff7d8',
    text: '#f59e0b',
  },
  {
    type: 'wow',
    label: 'Wow',
    src: '/assets/React/3%20React_Wow.svg',
    bg: '#fff7d8',
    text: '#f59e0b',
  },
  {
    type: 'sad',
    label: 'Sad',
    src: '/assets/React/4%20React_Sad.svg',
    bg: '#eaf4ff',
    text: '#3b82f6',
  },
  {
    type: 'angry',
    label: 'Angry',
    src: '/assets/React/5%20React_Angry.svg',
    bg: '#fff1e8',
    text: '#ef4444',
  },
  {
    type: 'support',
    label: 'Support',
    src: '/assets/React/6%20React_Support.svg',
    bg: '#edfdf3',
    text: '#16a34a',
  },
  {
    type: 'touched',
    label: 'Touched',
    src: '/assets/React/7%20React_Touched.svg',
    bg: '#f5f0ff',
    text: '#8b5cf6',
  },
]

function getStorageKey(storyId) {
  return `shadow_story_basic_reaction_${storyId}`
}

function readReaction(storyId) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(storyId)) || 'null')
  } catch {
    return null
  }
}

function saveReaction(storyId, data) {
  localStorage.setItem(getStorageKey(storyId), JSON.stringify(data))
}

function removeReaction(storyId) {
  localStorage.removeItem(getStorageKey(storyId))
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(/\.0$/, '')}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`

  return String(number)
}

export default function ReactionPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [localCount, setLocalCount] = useState(0)
  const [activePop, setActivePop] = useState('')

  const baseCount = useMemo(() => {
    return Number(story?.like_count || story?.likes_count || story?.reaction_count || 0)
  }, [story])

  const totalReactions = baseCount + localCount
  const activeReaction = REACTIONS.find((item) => item.type === selectedReaction) || null

  useEffect(() => {
    const saved = readReaction(storyId)

    if (saved?.reaction_type) {
      setSelectedReaction(saved.reaction_type)
      setLocalCount(1)
    } else {
      setSelectedReaction(null)
      setLocalCount(0)
    }
  }, [storyId])

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${storyId}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load story')
        }

        if (!ignore) setStory(data.story || null)
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load story')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [storyId])

  const handleSelectReaction = (reaction) => {
    if (selectedReaction === reaction.type) {
      removeReaction(storyId)
      setSelectedReaction(null)
      setLocalCount(0)
      setActivePop('')
      return
    }

    saveReaction(storyId, {
      reaction_type: reaction.type,
      reaction_label: reaction.label,
      story_id: storyId,
      created_at: new Date().toISOString(),
    })

    setSelectedReaction(reaction.type)
    setLocalCount(1)
    setActivePop(reaction.type)

    window.setTimeout(() => {
      setActivePop('')
    }, 650)
  }

  return (
    <main className="min-h-screen bg-[#f5f3fa] pb-10 text-[#111827]">
      <style>
        {`
          @keyframes shadowReactionPop {
            0% { transform: translateY(8px) scale(0.65) rotate(-10deg); opacity: 0; }
            45% { transform: translateY(-9px) scale(1.22) rotate(5deg); opacity: 1; }
            70% { transform: translateY(1px) scale(0.96) rotate(-2deg); opacity: 1; }
            100% { transform: translateY(0) scale(1) rotate(0); opacity: 1; }
          }

          @keyframes shadowReactionFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-5px) scale(1.05); }
          }

          @keyframes shadowReactionGlow {
            0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.45; }
            100% { transform: translate(-50%, -50%) scale(1.9); opacity: 0; }
          }

          .shadow-reaction-pop {
            animation: shadowReactionPop 520ms cubic-bezier(.2,.8,.2,1) both;
          }

          .shadow-reaction-float {
            animation: shadowReactionFloat 1.8s ease-in-out infinite;
          }

          .shadow-reaction-button:hover .shadow-reaction-icon {
            transform: translateY(-8px) scale(1.22);
          }

          .shadow-reaction-glow::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            width: 42px;
            height: 42px;
            border-radius: 9999px;
            background: currentColor;
            animation: shadowReactionGlow 620ms ease-out both;
            pointer-events: none;
          }
        `}
      </style>

      <header className="sticky top-0 z-30 border-b border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-black">Reaction</h1>
            <p className="text-[11.5px] font-semibold text-[#8d94a1]">Animated story reactions</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[560px] px-4 pt-5">
        {message ? (
          <div className="mb-4 rounded-[20px] bg-white px-4 py-3 text-[12px] font-bold text-[#667085] shadow-sm ring-1 ring-black/5">
            {message}
          </div>
        ) : null}

        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex gap-3">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[16px] bg-[#eef1f5]">
              {story?.cover_url ? (
                <img src={story.cover_url} alt={story.title || 'Story cover'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
                  <i className="fa-regular fa-bookmark text-[22px]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-black uppercase tracking-[0.08em] text-[#f6a800]">Story</div>
              <h2 className="mt-1 line-clamp-2 text-[18px] font-black leading-6">
                {loading ? 'Loading story...' : story?.title || 'Untitled Story'}
              </h2>
              <p className="mt-2 line-clamp-1 text-[12px] font-bold text-[#8d94a1]">
                {story?.author_page?.page_name ||
                  story?.authorPage?.page_name ||
                  story?.author?.page_name ||
                  story?.author_name ||
                  'Author'}
              </p>
              <p className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#98a2b3]">
                {story?.main_genre || 'Story'}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] bg-[#f8f8fb] p-5 text-center">
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5"
              style={{
                backgroundColor: activeReaction?.bg || '#ffffff',
                color: activeReaction?.text || '#111827',
              }}
            >
              {activeReaction ? (
                <img
                  src={activeReaction.src}
                  alt={activeReaction.label}
                  className={`h-16 w-16 object-contain ${activePop === activeReaction.type ? 'shadow-reaction-pop' : 'shadow-reaction-float'}`}
                />
              ) : (
                <i className="fa-regular fa-face-smile text-[34px] text-[#98a2b3]" />
              )}
            </div>

            <div className="mt-4 text-[24px] font-black">{formatNumber(totalReactions)}</div>
            <div className="mt-1 text-[12px] font-bold text-[#8d94a1]">
              {activeReaction ? `You reacted ${activeReaction.label}` : 'Choose your reaction'}
            </div>

            <div className="mt-5 flex justify-center">
              <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
                {REACTIONS.map((reaction) => {
                  const isActive = selectedReaction === reaction.type
                  const isPopping = activePop === reaction.type

                  return (
                    <button
                      key={reaction.type}
                      type="button"
                      onClick={() => handleSelectReaction(reaction)}
                      disabled={loading}
                      className={`shadow-reaction-button relative flex h-[54px] w-[50px] shrink-0 flex-col items-center justify-center rounded-full transition duration-200 active:scale-95 disabled:opacity-60 ${
                        isActive ? 'scale-110 shadow-sm ring-2 ring-white' : 'hover:bg-[#f8f8fb]'
                      } ${isPopping ? 'shadow-reaction-glow' : ''}`}
                      style={{
                        backgroundColor: isActive ? reaction.bg : 'transparent',
                        color: reaction.text,
                      }}
                      aria-label={`${isActive ? 'Remove' : 'Add'} ${reaction.label} reaction`}
                    >
                      <img
                        src={reaction.src}
                        alt=""
                        className={`shadow-reaction-icon h-8 w-8 object-contain transition duration-200 ${
                          isPopping ? 'shadow-reaction-pop' : ''
                        }`}
                      />
                      <span className={`mt-0.5 text-[9px] font-black ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        {reaction.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate(`/story/${storyId}`)}
              className="flex h-12 items-center justify-center rounded-full border border-[#eceaf2] bg-white text-[13px] font-black text-[#111827] active:scale-95"
            >
              Story Page
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 items-center justify-center rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
