import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function readerAuthHeaders() {
  const token = getReaderToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
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

function FanAvatar({ fan, size = 'h-12 w-12', rank }) {
  if (fan.avatar) {
    return (
      <span className="relative shrink-0">
        <img src={fan.avatar} alt="" className={`${size} rounded-full object-cover`} />
        {rank ? (
          <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#ff3b5f] px-1 text-[11px] font-bold text-white">
            {rank}
          </span>
        ) : null}
      </span>
    )
  }

  return (
    <span className={`relative flex ${size} shrink-0 items-center justify-center rounded-full bg-[#111827] text-[15px] font-bold text-white`}>
      {getInitial(fan.name)}
      {rank ? (
        <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#ff3b5f] px-1 text-[11px] font-bold text-white">
          {rank}
        </span>
      ) : null}
    </span>
  )
}

function TopThree({ fans }) {
  const top = fans.slice(0, 3)

  if (!top.length) {
    return (
      <div className="rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f5] text-[#ff3b5f]">
          <i className="fa-solid fa-heart text-[20px]" />
        </div>
        <h3 className="mt-3 text-[17px] font-bold text-[#111827]">No top fans yet</h3>
        <p className="mt-1 text-[13px] leading-5 text-[#98a2b3]">
          Be the first reader to brighten this story with a gift.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 items-end gap-3 px-2">
      {top.map((fan, index) => {
        const rank = index + 1
        const isFirst = rank === 1

        return (
          <div key={fan.id} className={`text-center ${isFirst ? 'pb-0' : 'pb-5'}`}>
            <div className="mx-auto flex justify-center">
              <FanAvatar fan={fan} size={isFirst ? 'h-24 w-24' : 'h-20 w-20'} rank={rank} />
            </div>
            <div className="mt-3 truncate text-[14px] font-bold text-[#111827]">{fan.name}</div>
            <div className="mt-1 text-[12px] text-[#98a2b3]">{formatNumber(fan.support)} support</div>
          </div>
        )
      })}
    </div>
  )
}

function FanRow({ fan, index }) {
  const rank = index + 1

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-7 text-center text-[15px] font-normal text-[#98a2b3]">
        {rank < 10 ? `0${rank}` : rank}
      </div>

      <FanAvatar fan={fan} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-normal text-[#111827]">{fan.name}</div>
        <div className="mt-0.5 text-[12px] font-normal text-[#98a2b3]">
          {formatNumber(fan.support)} support
        </div>
      </div>

      <div className="text-[14px] font-normal text-[#667085]">{formatNumber(fan.support)}</div>
    </div>
  )
}

export default function StoryTopFansPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()

  const [story, setStory] = useState(location.state?.storyPreview || null)
  const [activeTab, setActiveTab] = useState('weekly')
  const [weeklyFans, setWeeklyFans] = useState([])
  const [allTimeFans, setAllTimeFans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadStory() {
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
  }, [storyId])

  const fans = useMemo(() => {
    return activeTab === 'weekly' ? weeklyFans : allTimeFans
  }, [activeTab, weeklyFans, allTimeFans])

  const cover = story?.cover_url || story?.thumbnail_url || ''
  const title = story?.title || 'Top Fans'

  return (
    <main className="min-h-screen bg-white pb-[92px]">
      <section className="relative h-[300px] overflow-hidden bg-[#111827] text-white">
        {cover ? (
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 blur-[1px]" />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

        <div className="relative z-10 flex h-full flex-col px-4 pt-9">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full text-white active:scale-95">
              <i className="fa-solid fa-chevron-left text-[22px]" />
            </button>

            <h1 className="text-[24px] font-bold tracking-[0.04em]">TOP FANS</h1>

            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white active:scale-95">
              <i className="fa-solid fa-question text-[14px]" />
            </button>
          </div>

          <div className="mt-14 text-center">
            <h2 className="line-clamp-2 text-[24px] font-normal leading-8">{title}</h2>
            <p className="mt-3 text-[13px] font-normal text-white/75">
              Celebrate the readers who keep this story shining.
            </p>
          </div>
        </div>
      </section>

      <section className="-mt-8 rounded-t-[28px] bg-white px-4 pt-5">
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
            className={`relative pb-4 text-[20px] font-normal active:scale-95 ${activeTab === 'weekly' ? 'text-[#111827]' : 'text-[#98a2b3]'}`}
          >
            Weekly Fans
            {activeTab === 'weekly' ? <span className="absolute bottom-1 left-1/2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-[#ff3b5f]" /> : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all_time')}
            className={`relative pb-4 text-[20px] font-normal active:scale-95 ${activeTab === 'all_time' ? 'text-[#111827]' : 'text-[#98a2b3]'}`}
          >
            All-Time Fans
            {activeTab === 'all_time' ? <span className="absolute bottom-1 left-1/2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-[#ff3b5f]" /> : null}
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
              <TopThree fans={fans} />

              {fans.length > 3 ? (
                <div className="mt-7 rounded-[24px] bg-white">
                  {fans.slice(3).map((fan, index) => (
                    <FanRow key={fan.id} fan={fan} index={index + 3} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3 shadow-[0_-10px_30px_rgba(17,24,39,0.08)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-normal text-[#111827]">Your support</div>
            <div className="mt-0.5 text-[12px] font-normal text-[#98a2b3]">
              Send a gift and join this story’s fan board.
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-11 rounded-full bg-[#ff3b5f] px-8 text-[14px] font-bold text-white active:scale-95"
          >
            Gift
          </button>
        </div>
      </div>
    </main>
  )
}
