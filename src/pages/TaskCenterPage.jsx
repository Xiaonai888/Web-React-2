import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const rewards = [
  { day: 1, gems: 50 },
  { day: 2, gems: 100 },
  { day: 3, gems: 150 },
  { day: 4, gems: 200 },
  { day: 5, gems: 250 },
  { day: 6, gems: 300 },
  { day: 7, gems: 500, storyCard: 1 },
]

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
  } catch {
    return null
  }
}

function getHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function CrystalShardIcon({ className = 'h-6 w-6' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <path d="M12 2.6 19.2 7 17.4 17.2 12 21.4 6.6 17.2 4.8 7 12 2.6Z" fill="#F59E0B" />
        <path d="M12 2.6 9.1 8.2 12 21.4 14.9 8.2 12 2.6Z" fill="#FDBA74" />
        <path d="M4.8 7 9.1 8.2 6.6 17.2 4.8 7Z" fill="#D97706" />
        <path d="M19.2 7 14.9 8.2 17.4 17.2 19.2 7Z" fill="#B45309" />
        <path d="M9.1 8.2h5.8L12 21.4 9.1 8.2Z" fill="#FDE68A" opacity=".8" />
      </svg>
    </span>
  )
}

function StatusPill({ children, tone = 'dark' }) {
  const styles = {
    dark: 'bg-[#111827] text-white',
    soft: 'bg-[#f5f3fa] text-[#6b7280]',
    gold: 'bg-[#fff7ed] text-[#d97706]',
    done: 'bg-[#e5e7eb] text-[#6b7280]',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black ${styles[tone] || styles.dark}`}>
      {children}
    </span>
  )
}

function RewardCard({ reward, currentDay, claimedToday }) {
  const isPast = reward.day < currentDay
  const isToday = reward.day === currentDay
  const isLocked = reward.day > currentDay
  const status = isPast || (isToday && claimedToday) ? 'Claimed' : isToday ? 'Ready' : 'Locked'

  return (
    <div
      className={`relative min-h-[126px] rounded-[20px] border bg-white p-3 text-center ${
        isToday && !claimedToday
          ? 'border-[#111827] shadow-[0_14px_30px_rgba(17,24,39,0.12)]'
          : 'border-[#e5e7eb]'
      } ${isLocked ? 'opacity-60' : ''}`}
    >
      <div
        className={`absolute left-0 right-0 top-0 rounded-t-[19px] py-1.5 text-[11px] font-black ${
          isPast || (isToday && claimedToday)
            ? 'bg-[#e5e7eb] text-[#6b7280]'
            : isToday
              ? 'bg-[#111827] text-white'
              : 'bg-[#f5f3fa] text-[#8b93a1]'
        }`}
      >
        Day {reward.day}
      </div>

      <div className="pt-8">
        {reward.storyCard ? (
          <div className="text-[28px] leading-none">🎁</div>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7ed]">
            <CrystalShardIcon className="h-6 w-6" />
          </div>
        )}

        <div className="mt-2 text-[18px] font-black text-[#111827]">{reward.gems}</div>

        {reward.storyCard ? (
          <div className="mt-1 text-[10px] font-black text-[#d97706]">
            +{reward.storyCard} Story Card
          </div>
        ) : null}

        <div className="mt-2">
          <StatusPill tone={status === 'Ready' ? 'dark' : status === 'Claimed' ? 'done' : 'soft'}>
            {status}
          </StatusPill>
        </div>
      </div>
    </div>
  )
}

function LoadingBox() {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="h-5 w-32 animate-pulse rounded-full bg-[#eef0f4]" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="h-[112px] animate-pulse rounded-[20px] bg-[#eef0f4]" />
        <div className="h-[112px] animate-pulse rounded-[20px] bg-[#eef0f4]" />
        <div className="h-[112px] animate-pulse rounded-[20px] bg-[#eef0f4]" />
      </div>
    </div>
  )
}

export default function TaskCenterPage() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState({ gems: 0, diamonds: 0 })
  const [checkIn, setCheckIn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [message, setMessage] = useState('')

  const token = getReaderToken()
  const storedUser = getStoredUser()
  const isLoggedIn = Boolean(token)
  const tier = String(storedUser?.reader_tier || storedUser?.subscription_tier || storedUser?.role || 'free').toLowerCase()
  const isPremium = tier === 'premium' || tier === 'vip'

  const fallbackCheckIn = useMemo(() => ({
    current_day: 1,
    claimed_today: false,
    next_claim_at: null,
    streak_count: 0,
    premium_auto_claim: isPremium,
  }), [isPremium])

  const currentCheckIn = checkIn || fallbackCheckIn
  const currentDay = Math.min(Math.max(Number(currentCheckIn.current_day || 1), 1), 7)
  const claimedToday = Boolean(currentCheckIn.claimed_today)
  const canClaim = isLoggedIn && !claimedToday && !claiming
  const headerStatus = !isLoggedIn
    ? 'Login required'
    : claimedToday
      ? 'Claimed today'
      : isPremium
        ? 'Premium auto-claim ready'
        : 'Ready to claim'

  async function loadTaskCenter() {
    if (!token) {
      setLoading(false)
      setWallet({ gems: 0, diamonds: 0 })
      setCheckIn(null)
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const [walletResponse, checkInResponse] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/tasks/check-in`, { headers: getHeaders() }),
      ])

      if (walletResponse.status === 'fulfilled') {
        const walletData = await walletResponse.value.json().catch(() => ({}))

        if (walletResponse.value.ok && walletData.ok && walletData.wallet) {
          setWallet({
            gems: Number(walletData.wallet.gem_balance || 0),
            diamonds: Number(walletData.wallet.diamond_balance || 0),
          })
        }
      }

      if (checkInResponse.status === 'fulfilled') {
        const checkInData = await checkInResponse.value.json().catch(() => ({}))

        if (checkInResponse.value.ok && checkInData.ok) {
          setCheckIn(checkInData.check_in || checkInData.data || null)
        }
      }
    } catch {
      setMessage('Could not load task center.')
    } finally {
      setLoading(false)
    }
  }

  async function claimToday() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (claiming || claimedToday) return

    try {
      setClaiming(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/tasks/check-in/claim`, {
        method: 'POST',
        headers: getHeaders(),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Check-in is not available yet.')
      }

      if (data.wallet) {
        setWallet({
          gems: Number(data.wallet.gem_balance || wallet.gems || 0),
          diamonds: Number(data.wallet.diamond_balance || wallet.diamonds || 0),
        })
      }

      setCheckIn(data.check_in || data.data || { ...currentCheckIn, claimed_today: true })
      setMessage('Daily reward claimed.')
    } catch (error) {
      setMessage(error.message || 'Failed to claim reward.')
    } finally {
      setClaiming(false)
    }
  }

  useEffect(() => {
    loadTaskCenter()
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[760px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[18px] font-black text-[#111827]">Task Center</h1>

          <button
            type="button"
            onClick={() => navigate('/tasks/history')}
            className="rounded-full bg-[#f5f3fa] px-4 py-2 text-[12px] font-black text-[#111827] active:scale-95"
          >
            History
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pt-4">
        <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[12px] font-bold text-[#8b93a1]">My Gems</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F4D58D] bg-[#FFF7ED]">
                  <CrystalShardIcon className="h-6 w-6" />
                </div>
                <div className="text-[30px] font-black text-[#111827]">{formatNumber(wallet.gems)}</div>
              </div>
            </div>

            <div className="rounded-[22px] bg-[#f8fafc] px-4 py-3 text-right">
              <div className="text-[12px] font-black text-[#111827]">{isPremium ? 'Premium Reader' : 'Free Reader'}</div>
              <div className="mt-1 text-[11px] font-semibold leading-5 text-[#8b93a1]">
                {isPremium ? 'Auto-claim when available.' : 'Missing a day resets your streak.'}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-black text-[#111827]">Daily Login Check-in</h2>
              <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">
                Streak Day {currentDay} · {headerStatus}
              </p>
            </div>

            <StatusPill tone={claimedToday ? 'done' : canClaim ? 'dark' : 'soft'}>
              {claimedToday ? 'Done' : isLoggedIn ? 'Ready' : 'Login'}
            </StatusPill>
          </div>

          {message ? (
            <button
              type="button"
              onClick={() => setMessage('')}
              className="mt-4 w-full rounded-[18px] bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#111827]"
            >
              {message}
            </button>
          ) : null}

          {loading ? (
            <div className="mt-5">
              <LoadingBox />
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-7">
              {rewards.map((reward) => (
                <RewardCard
                  key={reward.day}
                  reward={reward}
                  currentDay={currentDay}
                  claimedToday={claimedToday}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={claimToday}
            disabled={isLoggedIn && !canClaim}
            className={`mt-5 h-12 w-full rounded-full text-[14px] font-black active:scale-[0.99] disabled:cursor-not-allowed ${
              !isLoggedIn || canClaim
                ? 'bg-[#111827] text-white'
                : 'bg-[#e5e7eb] text-[#6b7280]'
            }`}
          >
            {!isLoggedIn ? 'Login to Check In' : claiming ? 'Claiming...' : claimedToday ? 'Claimed Today' : 'Claim Today'}
          </button>

          <div className="mt-4 rounded-[20px] bg-[#f8fafc] p-4 text-[12px] font-semibold leading-6 text-[#6b7280]">
            Free readers must open Task Center and claim manually. Premium readers can auto-claim when the reward is available.
          </div>
        </section>
      </main>
    </div>
  )
}
