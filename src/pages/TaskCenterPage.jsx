import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const fallbackRewards = [
  { day: 1, gems: 50, story_cards: 0 },
  { day: 2, gems: 100, story_cards: 0 },
  { day: 3, gems: 150, story_cards: 0 },
  { day: 4, gems: 200, story_cards: 0 },
  { day: 5, gems: 250, story_cards: 0 },
  { day: 6, gems: 300, story_cards: 0 },
  { day: 7, gems: 500, story_cards: 1 },
]

const dailyMissions = [
  { id: 'read-10-min', title: 'Read 10 minutes', reward: 50, progress: 0, target: 10, status: 'start', icon: 'fa-book-open' },
  { id: 'read-3-episodes', title: 'Read 3 episodes', reward: 100, progress: 1, target: 3, status: 'start', icon: 'fa-list-check' },
  { id: 'add-library', title: 'Add 1 story to Library', reward: 80, progress: 0, target: 1, status: 'start', icon: 'fa-bookmark' },
  { id: 'follow-author', title: 'Follow 1 author', reward: 80, progress: 1, target: 1, status: 'claim', icon: 'fa-user-plus' },
]

const weeklyMissions = [
  { id: 'read-3-days', title: 'Read 3 different days this week', reward: 200, progress: 1, target: 3, status: 'start', icon: 'fa-calendar-check' },
  { id: 'finish-10-episodes', title: 'Finish 10 episodes this week', reward: 250, progress: 4, target: 10, status: 'start', icon: 'fa-layer-group' },
  { id: 'share-story', title: 'Share 1 story', reward: 120, progress: 0, target: 1, status: 'start', icon: 'fa-share-nodes' },
  { id: 'unlock-paid', title: 'Unlock 1 paid episode', reward: 300, progress: 1, target: 1, status: 'claimed', icon: 'fa-lock-open' },
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
    done: 'bg-[#e5e7eb] text-[#6b7280]',
    gold: 'bg-[#fff7ed] text-[#d97706]',
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
        {reward.story_cards ? (
          <div className="text-[28px] leading-none">🎁</div>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7ed]">
            <CrystalShardIcon className="h-6 w-6" />
          </div>
        )}

        <div className="mt-2 text-[18px] font-black text-[#111827]">{reward.gems}</div>

        {reward.story_cards ? (
          <div className="mt-1 text-[10px] font-black text-[#d97706]">
            +{reward.story_cards} Story Card
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

function ProgressBar({ progress, target }) {
  const percent = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[11px] font-bold text-[#8b93a1]">
        <span>{progress}/{target}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eef0f4]">
        <div className="h-full rounded-full bg-[#111827]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function MissionButton({ status }) {
  if (status === 'claimed') {
    return (
      <button type="button" disabled className="h-9 rounded-full bg-[#d1d5db] px-4 text-[12px] font-black text-white">
        Claimed
      </button>
    )
  }

  if (status === 'claim') {
    return (
      <button type="button" className="h-9 rounded-full bg-[#111827] px-5 text-[12px] font-black text-white active:scale-[0.98]">
        Claim
      </button>
    )
  }

  return (
    <button type="button" className="h-9 rounded-full border border-[#111827] bg-white px-5 text-[12px] font-black text-[#111827] active:scale-[0.98]">
      Start
    </button>
  )
}

function MissionCard({ mission }) {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#111827]">
          <i className={`fa-solid ${mission.icon} text-[18px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-[#111827]">
                {mission.title}
              </h3>

              <div className="mt-1 flex items-center gap-1 text-[13px] font-black text-[#d97706]">
                <CrystalShardIcon className="h-4 w-4" />
                <span>+{mission.reward}</span>
              </div>
            </div>

            <MissionButton status={mission.status} />
          </div>

          <ProgressBar progress={mission.progress} target={mission.target} />
        </div>
      </div>
    </div>
  )
}

export default function TaskCenterPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('daily')
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
    streak_count: 0,
    premium_auto_claim: isPremium,
    rewards: fallbackRewards,
  }), [isPremium])

  const currentCheckIn = checkIn || fallbackCheckIn
  const rewards = currentCheckIn.rewards || fallbackRewards
  const currentDay = Math.min(Math.max(Number(currentCheckIn.current_day || 1), 1), 7)
  const claimedToday = Boolean(currentCheckIn.claimed_today)
  const canClaim = isLoggedIn && !claimedToday && !claiming

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
          setCheckIn(checkInData.check_in || null)
          if (checkInData.wallet) {
            setWallet({
              gems: Number(checkInData.wallet.gem_balance || 0),
              diamonds: Number(checkInData.wallet.diamond_balance || 0),
            })
          }
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

      setCheckIn(data.check_in || { ...currentCheckIn, claimed_today: true })
      setMessage(data.message || 'Daily bonus claimed.')
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
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[18px] font-black text-[#111827]">Task Center</h1>

          <button type="button" onClick={() => navigate('/tasks/history')} className="rounded-full bg-[#f5f3fa] px-4 py-2 text-[12px] font-black text-[#111827] active:scale-95">
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

        <section className="mt-4 rounded-[28px] bg-white p-2 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setActiveTab('daily')} className={`h-12 rounded-[22px] text-[14px] font-black ${activeTab === 'daily' ? 'bg-[#111827] text-white' : 'text-[#8b93a1]'}`}>
              Daily Bonus
            </button>
            <button type="button" onClick={() => setActiveTab('missions')} className={`h-12 rounded-[22px] text-[14px] font-black ${activeTab === 'missions' ? 'bg-[#111827] text-white' : 'text-[#8b93a1]'}`}>
              Missions
            </button>
          </div>
        </section>

        {activeTab === 'daily' ? (
          <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-black text-[#111827]">Daily Bonus</h2>
                <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">
                  Streak Day {currentDay} · {claimedToday ? 'Claimed today' : 'Ready to claim'}
                </p>
              </div>

              <StatusPill tone={claimedToday ? 'done' : canClaim ? 'dark' : 'soft'}>
                {claimedToday ? 'Done' : isLoggedIn ? 'Ready' : 'Login'}
              </StatusPill>
            </div>

            {message ? (
              <button type="button" onClick={() => setMessage('')} className="mt-4 w-full rounded-[18px] bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#111827]">
                {message}
              </button>
            ) : null}

            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-7">
              {rewards.map((reward) => (
                <RewardCard key={reward.day} reward={reward} currentDay={currentDay} claimedToday={claimedToday} />
              ))}
            </div>

            <button type="button" onClick={claimToday} disabled={isLoggedIn && !canClaim} className={`mt-5 h-12 w-full rounded-full text-[14px] font-black active:scale-[0.99] disabled:cursor-not-allowed ${!isLoggedIn || canClaim ? 'bg-[#111827] text-white' : 'bg-[#e5e7eb] text-[#6b7280]'}`}>
              {!isLoggedIn ? 'Login to Check In' : claiming ? 'Claiming...' : claimedToday ? 'Claimed Today' : 'Claim Today'}
            </button>

            <div className="mt-4 rounded-[20px] bg-[#f8fafc] p-4 text-[12px] font-semibold leading-6 text-[#6b7280]">
              Free readers must open Task Center and claim manually. Premium readers can auto-claim when the reward is available.
            </div>
          </section>
        ) : null}

        {activeTab === 'missions' ? (
          <>
            <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-black text-[#111827]">Daily Missions</h2>
                  <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">Demo missions for the next stage.</p>
                </div>
                <StatusPill tone="soft">Demo</StatusPill>
              </div>

              <div className="mt-4 space-y-3">
                {dailyMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-black text-[#111827]">Weekly Missions</h2>
                  <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">Weekly demo rewards.</p>
                </div>
                <StatusPill tone="soft">Demo</StatusPill>
              </div>

              <div className="mt-4 space-y-3">
                {weeklyMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
