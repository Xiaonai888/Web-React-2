import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GiftPopup from '../components/reader/GiftPopup'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getCurrentReader() {
  try {
    const raw =
      localStorage.getItem('shadow_reader_user') ||
      sessionStorage.getItem('shadow_reader_user') ||
      ''

    if (!raw) {
      return {
        name: 'Reader',
        avatar_url: '',
      }
    }

    const user = JSON.parse(raw)

    return {
      name:
        user.name ||
        user.username ||
        user.display_name ||
        user.email?.split('@')[0] ||
        'Reader',
      avatar_url:
        user.avatar_url ||
        user.profile_image ||
        user.photo_url ||
        '',
    }
  } catch {
    return {
      name: 'Reader',
      avatar_url: '',
    }
  }
}

function readerAuthHeaders() {
  const token = getReaderToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function isUsableRouteId(value) {
  const text = String(value ?? '').trim()
  return Boolean(text && text !== 'undefined' && text !== 'null')
}

function formatDateYMD(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getWeeklyDateRange() {
  const today = new Date()
  const dayOfWeek = today.getDay()

  // Monday = first day of the week
  const daysFromMonday = (dayOfWeek + 6) % 7

  const monday = new Date(today)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(today.getDate() - daysFromMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return `${formatDateYMD(monday)} ~ ${formatDateYMD(sunday)}`
}



function normalizeFan(item, index) {
  const user = item.user || item.reader || item.profile || {}

  return {
    id: item.id || item.user_id || user.id || `fan-${index}`,
    name: user.name || user.username || item.name || item.username || 'Shadow Reader',
    avatar: user.avatar_url || user.profile_image || item.avatar_url || item.profile_image || '',
    support: Number(item.support || item.points || item.gift_value || item.total || item.score || 0),
  }
}

function getInitial(name) {
  return String(name || 'S').slice(0, 1).toUpperCase()
}

function FanAvatar({ fan, className = 'h-12 w-12', textClassName = 'text-[15px]' }) {
  if (fan.avatar) {
    return (
      <img
        src={fan.avatar}
        alt=""
        className={`${className} rounded-full object-cover`}
      />
    )
  }

  return (
    <span
      className={`flex ${className} items-center justify-center rounded-full font-bold text-white ${textClassName}`}
      style={{
        backgroundColor: fan.color || '#111827',
      }}
    >
      {getInitial(fan.name)}
    </span>
  )
}

const TOP_FAN_LAYOUT = {
  1: {
    frame: '/assets/Top%20Fan/Top%20Fan%201.png',

    // Top 1 stays larger and higher.
    frameWidth: 'clamp(104px, 25vw, 114px)',
    avatarSize: 'clamp(106px, 17vw, 106px)',
    avatarTop: '53%',
    avatarLeft: '50%',
    cardTop: '0px',
  },
  2: {
    frame: '/assets/Top%20Fan/Top%20Fan%202.png',

    // Top 2 is smaller and sits lower than Top 1.
    frameWidth: 'clamp(88px, 20vw, 98px)',
    avatarSize: 'clamp(84px, 18vw, 90px)',
    avatarTop: '54.5%',
    avatarLeft: '50%',
    cardTop: '18px',
  },
  3: {
    frame: '/assets/Top%20Fan/Top%20Fan%203.png',

    // Top 3 is smaller and sits lower than Top 1.
    frameWidth: 'clamp(88px, 20vw, 98px)',
    avatarSize: 'clamp(84px, 18vw, 90px)',
    avatarTop: '54.5%',
    avatarLeft: '50%',
    cardTop: '18px',
  },
}

function RankedFanAvatar({ fan, rank }) {
  const layout = TOP_FAN_LAYOUT[rank]

  if (!layout) return null

  return (
    <div
      className="relative mx-auto shrink-0"
      style={{
        width: layout.frameWidth,
        aspectRatio: '907 / 972',
      }}
    >
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#111827]"
        style={{
          width: layout.avatarSize,
          height: layout.avatarSize,
          top: layout.avatarTop,
          left: layout.avatarLeft,
        }}
      >
        <FanAvatar
          fan={fan}
          className="h-full w-full"
          textClassName={rank === 1 ? 'text-[23px]' : 'text-[20px]'}
        />
      </div>

      <img
        src={layout.frame}
        alt={`Top ${rank} frame`}
        draggable="false"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-contain"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

function TopThree({ fans }) {
  const rankedTop = fans.slice(0, 3).map((fan, index) => ({
    ...fan,
    rank: index + 1,
  }))

  // Show Top 2 on the left, Top 1 in the center, and Top 3 on the right.
  const displayOrder = [rankedTop[1], rankedTop[0], rankedTop[2]]

  return (
    <div className="grid min-h-[170px] grid-cols-3 items-start gap-2 px-2 sm:gap-5 sm:px-8">
      {displayOrder.map((fan, slotIndex) => {
        if (!fan) return <div key={`empty-${slotIndex}`} />

        return (
          <div
            key={fan.id}
            className="min-w-0 text-center"
            style={{
              marginTop: TOP_FAN_LAYOUT[fan.rank]?.cardTop || '0px',
            }}
          >
            <RankedFanAvatar fan={fan} rank={fan.rank} />

            <div className="mt-0.5 truncate text-[12px] font-bold text-[#111827] sm:text-[13px]">
              {fan.name}
            </div>

            <div className="mt-0.5 text-[10px] font-normal text-[#98a2b3] sm:text-[11px]">
              {formatNumber(fan.support)} points
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FanRow({ fan, index }) {
  const rank = index + 1

  return (
    <div className="flex items-center gap-3 px-2 py-3 sm:px-4">
      <div className="w-8 shrink-0 text-center text-[14px] font-normal text-[#98a2b3]">
        {rank < 10 ? `0${rank}` : rank}
      </div>

      <FanAvatar fan={fan} className="h-11 w-11 shrink-0" textClassName="text-[14px]" />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-normal text-[#111827] sm:text-[15px]">
          {fan.name}
        </div>
      </div>

      <div className="shrink-0 text-[14px] font-normal text-[#667085]">
        {formatNumber(fan.support)}
      </div>
    </div>
  )
}

export default function StoryTopFansPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()
  const [giftPopupOpen, setGiftPopupOpen] = useState(false)
  const [rankingRefreshKey, setRankingRefreshKey] = useState(0)
  const currentReader = useMemo(() => getCurrentReader(), [])

  useEffect(() => {
    if (sessionStorage.getItem('shadow_reopen_top_fans_gift_popup') !== '1') return
    sessionStorage.removeItem('shadow_reopen_top_fans_gift_popup')
    setGiftPopupOpen(true)
  }, [])

  const [story, setStory] = useState(location.state?.storyPreview || null)
  const [activeTab, setActiveTab] = useState('weekly')
  const [weeklyFans, setWeeklyFans] = useState([])
  const [allTimeFans, setAllTimeFans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      if (!isUsableRouteId(storyId)) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${storyId}`)
        const data = await response.json().catch(() => ({}))

        if (!ignore && data.story) setStory(data.story)
      } catch {
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [storyId])

  useEffect(() => {
    let ignore = false

    async function loadFans() {
      if (!isUsableRouteId(storyId)) {
        setWeeklyFans([])
        setAllTimeFans([])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const [weeklyResponse, allTimeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/gifts/stories/${storyId}/top-fans?period=weekly`, {
            headers: readerAuthHeaders(),
          }),
          fetch(`${API_BASE_URL}/api/gifts/stories/${storyId}/top-fans?period=all_time`, {
            headers: readerAuthHeaders(),
          }),
        ])

        const weeklyData = await weeklyResponse.json().catch(() => ({}))
        const allTimeData = await allTimeResponse.json().catch(() => ({}))

        if (ignore) return

        const nextWeekly = Array.isArray(weeklyData.fans)
          ? weeklyData.fans
          : Array.isArray(weeklyData.top_fans)
            ? weeklyData.top_fans
            : []

        const nextAllTime = Array.isArray(allTimeData.fans)
          ? allTimeData.fans
          : Array.isArray(allTimeData.top_fans)
            ? allTimeData.top_fans
            : []

        setWeeklyFans(nextWeekly.map(normalizeFan))
        setAllTimeFans(nextAllTime.map(normalizeFan))
      } catch {
        if (!ignore) {
          setWeeklyFans([])
          setAllTimeFans([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadFans()

    return () => {
      ignore = true
    }
  }, [storyId, rankingRefreshKey])

  const fans = useMemo(() => {
  const source = activeTab === 'weekly' ? weeklyFans : allTimeFans

  return source
    .filter((fan) =>
      !String(fan?.id || '').startsWith('demo-') &&
      Number(fan?.support || 0) > 0
    )
    .sort((a, b) => Number(b.support || 0) - Number(a.support || 0))
}, [activeTab, weeklyFans, allTimeFans])

  const cover = story?.cover_url || story?.thumbnail_url || ''
const title = story?.title || 'Top Fans'
const weeklyDateRange = useMemo(() => getWeeklyDateRange(), [])

  return (
    <main className="min-h-screen bg-white pb-[92px]">
      <div className="relative h-[220px] overflow-hidden bg-white text-white">
        <div
          className="absolute left-1/2 top-0 h-full w-[124%] -translate-x-1/2 overflow-hidden bg-[#111827]"
          style={{
            borderBottomLeftRadius: '50% 50px',
            borderBottomRightRadius: '50% 50px',
          }} 
        >
          {cover ? (
            <img
              src={cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-35 blur-[1px]"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col px-3 pt-4 sm:px-4 sm:pt-5">
  <div className="flex items-center justify-between">
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="flex h-8 w-8 items-center justify-center text-white active:scale-95 sm:h-9 sm:w-9"
    >
      <i className="fa-solid fa-chevron-left text-[17px] sm:text-[18px]" />
    </button>

    <h1 className="text-[18px] font-bold tracking-[0.03em] sm:text-[20px]">
      TOP FANS
    </h1>

    <button
      type="button"
      onClick={() =>
        navigate(`/story/${storyId}/top-fans-guide`, {
          state: {
            storyPreview: story,
          },
        })
      }
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white text-white active:scale-95 sm:h-8 sm:w-8"
      aria-label="How Top Fans works"
    >
      <i className="fa-solid fa-question text-[9px] sm:text-[10px]" />
    </button>
  </div>

<div className="mt-9 px-6 text-center">
  <h2 className="line-clamp-2 text-[20px] font-bold leading-7 text-white sm:text-[22px]">
    {title}
  </h2>

  {activeTab === 'weekly' ? (
    <p className="mt-2 text-[14px] font-normal text-white/85 sm:text-[15px]">
      {weeklyDateRange}
    </p>
  ) : null}
</div>

          
        </div>
      </div>

      <section className="bg-white px-4 pt-8">
        <div className="rounded-[22px] bg-gradient-to-r from-[#fff1f5] to-[#f4efff] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#ff3b5f] shadow-sm">
              <i className="fa-solid fa-gem text-[22px]" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#111827]">Become a Signature Fan</h3>
              <p className="mt-1 text-[12px] font-normal leading-5 text-[#98a2b3]">
                Send gifts to support the story and appear on the fan board.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 text-center">
  <button
    type="button"
    onClick={() => setActiveTab('weekly')}
    className={`relative pb-4 text-[16px] font-normal active:scale-95 ${
      activeTab === 'weekly' ? 'text-[#111827]' : 'text-[#98a2b3]'
    }`}
  >
    Weekly Ranking
    {activeTab === 'weekly' ? (
      <span className="absolute bottom-1 left-1/2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-[#ff3b5f]" />
    ) : null}
  </button>

  <button
    type="button"
    onClick={() => setActiveTab('all_time')}
    className={`relative pb-4 text-[16px] font-normal active:scale-95 ${
      activeTab === 'all_time' ? 'text-[#111827]' : 'text-[#98a2b3]'
    }`}
  >
    Overall Ranking
    {activeTab === 'all_time' ? (
      <span className="absolute bottom-1 left-1/2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-[#ff3b5f]" />
    ) : null}
  </button>
</div>

        <div className="mt-5">
          {loading ? (
            <div className="space-y-3 px-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
              ))}
            </div>
          ) : (
            <>
            fans.length > 0 ? (
  <>
    <TopThree fans={fans} />

    {fans.length > 3 ? (
      <div className="mt-7 rounded-[24px] bg-white">
        {fans.slice(3).map((fan, index) => (
          <FanRow key={fan.id} fan={fan} index={index + 3} />
        ))}
      </div>
    ) : null}
  </>
) : (
  <div className="px-4 py-16 text-center">
    <div className="text-[15px] font-semibold text-[#111827]">
      {activeTab === 'weekly'
        ? 'No weekly ranking yet'
        : 'No overall ranking yet'}
    </div>

    <div className="mt-2 text-[12px] text-[#98a2b3]">
      Send a gift to become this story’s first Top Fan.
    </div>
  </div>
)
          )}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 shadow-[0_-10px_30px_rgba(17,24,39,0.08)]">
  <div className="mx-auto flex max-w-3xl items-center gap-3">
    {currentReader.avatar_url ? (
      <img
        src={currentReader.avatar_url}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    ) : (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[13px] font-bold text-white">
        {currentReader.name.slice(0, 1).toUpperCase()}
      </div>
    )}

    <div className="min-w-0 flex-1">
      <div className="truncate text-[13px] font-medium text-[#111827]">
        {currentReader.name}
      </div>

      <div className="mt-0.5 truncate text-[11px] font-normal text-[#98a2b3]">
        Send a gift and join this story’s fan board.
      </div>
    </div>

    <button
      type="button"
      onClick={() => setGiftPopupOpen(true)}
      className="h-9 shrink-0 rounded-full bg-[#ff3b5f] px-6 text-[13px] font-bold text-white active:scale-95"
    >
      Gift
    </button>
  </div>
</div>

      <GiftPopup
        open={giftPopupOpen}
        storyId={storyId}
        onClose={() => setGiftPopupOpen(false)}
        onOpenGuide={() => {
          sessionStorage.setItem('shadow_reopen_top_fans_gift_popup', '1')
          setGiftPopupOpen(false)
          navigate('/gift-guide')
        }}
        onOpenTopFans={() => setGiftPopupOpen(false)}
        onGiftSent={() => {
          setGiftPopupOpen(false)
          setRankingRefreshKey((value) => value + 1)
        }}
      />
    </main>
  )
}
