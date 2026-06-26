import { useEffect, useMemo, useRef, useState } from 'react'
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

const moreRewards = [
  {
    id: 'daily-check-in',
    title: 'Daily Check-in',
    subtitle: 'Open Task Center and collect today’s reward.',
    reward: 50,
    action: 'Claim',
    status: 'claim',
    icon: 'fa-calendar-check',
  },
  {
    id: 'read-10-min',
    title: 'Read 10 minutes',
    subtitle: 'Read stories for 10 minutes today.',
    reward: 20,
    action: 'Go',
    status: 'go',
    icon: 'fa-book-open',
    progress: 0,
    target: 10,
  },
  {
    id: 'read-30-min',
    title: 'Read 30 minutes',
    subtitle: 'Keep reading longer to earn more coins.',
    reward: 60,
    action: 'Go',
    status: 'go',
    icon: 'fa-clock',
    progress: 0,
    target: 30,
  },
  {
    id: 'add-library',
    title: 'Add story to Library',
    subtitle: 'Save one story you want to continue reading.',
    reward: 30,
    action: 'Go',
    status: 'go',
    icon: 'fa-bookmark',
    progress: 0,
    target: 1,
  },
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

function CoinIcon({ className = 'h-5 w-5' }) {
  return (
    <img
      src="/assets/Icons/Shadow%20Coin.svg"
      alt="Shadow Coin"
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

function DiamondIcon({ className = 'h-5 w-5' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>
      <i className="fa-solid fa-gem text-[#38BDF8]" />
    </span>
  )
}

function RewardButton({ children, disabled = false, tone = 'dark', onClick }) {
  const styles = {
  dark: 'bg-[#111827] text-white',
  gold: 'bg-[#ff3f62] text-white',
  soft: 'bg-[#e5e7eb] text-[#8b93a1]',
  outline: 'bg-[#ff3f62] text-white',
}

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-10 rounded-full px-5 text-[12px] font-black shadow-sm active:scale-[0.98] disabled:cursor-not-allowed ${styles[tone] || styles.dark}`}
    >
      {children}
    </button>
  )
}

function BalanceBox({ label, value, type }) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-5 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {type === 'diamond' ? <DiamondIcon className="h-5 w-5" /> : <CoinIcon className="h-7 w-7" />}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1 text-[13px] font-semibold text-[#343a46]">
          <span>{label}</span>
          <i className="fa-solid fa-chevron-right text-[9px] text-[#6b7280]" />
        </div>
        <div className="mt-1 text-[30px] font-black leading-none text-[#ff3f62]">{formatNumber(value)}</div>
      </div>
    </div>
  )
}

function DayReward({ reward, currentDay, claimedToday }) {
  const isPast = reward.day < currentDay
  const isToday = reward.day === currentDay
  const isClaimed = isPast || (isToday && claimedToday)
  const isTomorrow = reward.day === currentDay + 1 && claimedToday
  const isLocked = reward.day > currentDay && !isTomorrow
  const label = isClaimed ? 'Claimed' : isToday ? 'Today' : isTomorrow ? 'Tomorrow' : 'Locked'

  return (
    <div className="min-w-[68px] text-center">
      <div className={`mx-auto flex h-9 w-9 items-center justify-center ${isLocked ? 'opacity-55' : ''}`}>
  {reward.story_cards ? (
    <span className="text-[28px] leading-none">🎁</span>
  ) : (
    <CoinIcon className="h-8 w-8" />
  )}
</div>

      <div className="mt-2 text-[11px] font-black text-[#111827]">
        {reward.story_cards ? 'Gift' : reward.gems}
      </div>

      <div
        className={`mt-1 text-[10px] font-bold ${
          isToday && !claimedToday
            ? 'text-[#d97706]'
            : isClaimed
              ? 'text-[#6b7280]'
              : isTomorrow
                ? 'text-[#d97706]'
                : 'text-[#9ca3af]'
        }`}
      >
        {label}
      </div>

      <div className="mt-1 text-[10px] font-semibold text-[#9ca3af]">Day {reward.day}</div>
    </div>
  )
}

function ProgressLine({ progress = 0, target = 1 }) {
  const percent = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0

  return (
    <div className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-[#edf0f5]">
        <div className="h-full rounded-full bg-[#F6B800]" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 text-[10px] font-semibold text-[#9ca3af]">
        {progress}/{target}
      </div>
    </div>
  )
}

function TaskRow({ task, onCheckIn, claimedToday }) {
  const isCheckIn = task.id === 'daily-check-in'
  const alreadyDone = isCheckIn && claimedToday
  const buttonText = alreadyDone ? 'Done' : task.action
  const buttonTone = alreadyDone ? 'soft' : task.status === 'claim' ? 'gold' : 'outline'

  return (
    <div className="flex gap-3 border-b border-[#f1f2f5] py-4 last:border-b-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8fafc] text-[#111827] ring-1 ring-black/5">
        <i className={`fa-solid ${task.icon} text-[15px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-[#111827]">{task.title}</h3>
            <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 text-[#8b93a1]">{task.subtitle}</p>

            <div className="mt-2 flex items-center gap-1 text-[12px] font-black text-[#d97706]">
              <CoinIcon className="h-4 w-4" />
              <span>+{task.reward}</span>
            </div>
          </div>

          <RewardButton
            tone={buttonTone}
            disabled={alreadyDone}
            onClick={isCheckIn ? onCheckIn : undefined}
          >
            {buttonText}
          </RewardButton>
        </div>

        {task.progress !== undefined ? <ProgressLine progress={task.progress} target={task.target} /> : null}
      </div>
    </div>
  )
}

export default function TaskCenterPage() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState({ coins: 0, diamonds: 0 })
  const [checkIn, setCheckIn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [message, setMessage] = useState('')
  const [taskCoverUrl, setTaskCoverUrl] = useState('')
  const [scrolledPastCover, setScrolledPastCover] = useState(false)
  const coverRef = useRef(null)

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
  const streakCount = Number(currentCheckIn.streak_count || (claimedToday ? currentDay : Math.max(currentDay - 1, 0)))
  const coverImageUrl = taskCoverUrl || '/assets/Task%20Center/Task%20background%202.webp'

  async function loadTaskCover() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/task-center/public`)
    const data = await response.json().catch(() => ({}))

    if (response.ok && data.ok && data.settings?.cover_url) {
      setTaskCoverUrl(data.settings.cover_url)
    }
  } catch {
    setTaskCoverUrl('')
  }
}

  async function loadTaskCenter() {
    if (!token) {
      setLoading(false)
      setWallet({ coins: 0, diamonds: 0 })
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
            coins: Number(walletData.wallet.gem_balance || 0),
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
              coins: Number(checkInData.wallet.gem_balance || 0),
              diamonds: Number(checkInData.wallet.diamond_balance || 0),
            })
          }
        }
      }
    } catch {
      setMessage('Could not load rewards. Please try again.')
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
        throw new Error(data.message || 'Reward is not available yet.')
      }

      if (data.wallet) {
        setWallet({
          coins: Number(data.wallet.gem_balance || wallet.coins || 0),
          diamonds: Number(data.wallet.diamond_balance || wallet.diamonds || 0),
        })
      }

      setCheckIn(data.check_in || { ...currentCheckIn, claimed_today: true })
      setMessage(data.message || 'Reward claimed successfully.')
    } catch (error) {
      setMessage(error.message || 'Failed to claim reward.')
    } finally {
      setClaiming(false)
    }
  }

  useEffect(() => {
  loadTaskCover()
  loadTaskCenter()
}, [])
  
useEffect(() => {
  function handleScroll() {
  const coverHeight = coverRef.current?.offsetHeight || 220
  setScrolledPastCover(window.scrollY > coverHeight - 56)
}

  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })

  return () => window.removeEventListener('scroll', handleScroll)
}, [])
  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      

<main className="mx-auto max-w-[760px] bg-[#f5f3fa] pt-0">
 <div ref={coverRef} className="relative aspect-[16/9] overflow-hidden bg-[#ff6f86]">
  <img
    src={coverImageUrl}
    alt="Task Center Cover"
    className="absolute inset-0 h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/20" />

  <header
    className={`fixed left-1/2 top-0 z-50 flex h-14 w-full max-w-[760px] -translate-x-1/2 items-center justify-between px-4 transition-all duration-200 ${
      scrolledPastCover
        ? 'border-b border-[#eef0f4] bg-white/95 text-[#111827] shadow-sm backdrop-blur'
        : 'bg-transparent text-white'
    }`}
  >
    <button
  type="button"
  onClick={() => navigate(-1)}
  className={`flex h-9 w-9 items-center justify-center rounded-full active:scale-95 ${
    scrolledPastCover ? 'bg-transparent text-[#111827]' : 'bg-white/20 text-white shadow-sm'
  }`}
  aria-label="Go back"
>
  <i className="fa-solid fa-chevron-left text-[14px]" />
</button>

    <h1 className={`text-[16px] font-bold ${scrolledPastCover ? 'text-[#111827]' : 'text-white drop-shadow'}`}>
      Task Center
    </h1>

    <button
  type="button"
  className={`flex h-9 w-9 items-center justify-center rounded-full active:scale-95 ${
    scrolledPastCover ? 'bg-transparent text-[#111827]' : 'bg-white/20 text-white shadow-sm'
  }`}
  aria-label="More"
>
  <i className="fa-solid fa-ellipsis text-[16px]" />
</button>
  </header>

  <section className="relative z-10 flex h-full flex-col justify-end px-4 pb-8 pt-16 text-white">
    <h2 className="max-w-[310px] text-[22px] font-bold leading-[1.08] tracking-[-0.02em] drop-shadow">
      Earn coins to unlock stories
    </h2>
  </section>
</div>

  <section className="relative z-20 mt-3">
  <div className="overflow-hidden rounded-t-[24px] bg-white shadow-[0_8px_22px_rgba(17,24,39,0.08)]">
    <div className="grid grid-cols-2">
      <BalanceBox label="My Coins" value={wallet.coins} type="coin" />
      <BalanceBox label="My Diamonds" value={wallet.diamonds} type="diamond" />
    </div>

    <div className="bg-white px-5 pb-4 pt-0">
      <p className="text-[12px] font-medium leading-5 text-[#7b8190]">
        Use Coins to unlock and read any stories on Shadow.
      </p>
    </div>
  </div>
</section>

  <section className="mt-0 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-bold leading-6 text-[#111827]">
                Checked in {streakCount || 0} day{Number(streakCount) === 1 ? '' : 's'} in a row
              </h2>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
                {claimedToday ? 'Today’s reward has been collected.' : 'Claim today’s reward to keep your streak.'}
              </p>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8fafc] text-[#9ca3af] ring-1 ring-black/5"
              aria-label="Task rules"
              onClick={() => setMessage('Coins can be used for story rewards. Come back daily to keep your streak active.')}
            >
              <i className="fa-solid fa-circle-info text-[13px]" />
            </button>
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

          <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2">
            {rewards.map((reward) => (
              <DayReward key={reward.day} reward={reward} currentDay={currentDay} claimedToday={claimedToday} />
            ))}
          </div>

          <button
            type="button"
            onClick={claimToday}
            disabled={isLoggedIn && !canClaim}
            className={`mt-5 h-12 w-full rounded-full text-[14px] font-black shadow-sm active:scale-[0.99] disabled:cursor-not-allowed ${
              !isLoggedIn || canClaim
                ? 'bg-[#F6B800] text-[#111827]'
                : 'bg-[#e5e7eb] text-[#6b7280]'
            }`}
          >
            {!isLoggedIn ? 'Login to Claim' : claiming ? 'Claiming...' : claimedToday ? 'Claimed Today' : 'Claim Reward'}
          </button>

          <p className="mt-3 text-center text-[11px] font-semibold leading-5 text-[#8b93a1]">
  {loading ? 'Loading your rewards...' : isPremium ? 'Premium readers may receive extra reward support.' : 'Come back daily to keep your streak active.'}
</p>
</section>

<section className="mt-3 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#111827]">More Rewards</h2>
              <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">Complete tasks to earn more coins.</p>
            </div>

            <span className="rounded-full bg-[#fff7d6] px-3 py-1 text-[11px] font-black text-[#d97706]">
              Daily
            </span>
          </div>

          <div className="mt-2">
            {moreRewards.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                claimedToday={claimedToday}
                onCheckIn={claimToday}
              />
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff7d6] text-[#F6B800]">
              <i className="fa-solid fa-lightbulb text-[14px]" />
            </div>

            <div>
              <h3 className="text-[14px] font-black text-[#111827]">Reward Rules</h3>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-[#8b93a1]">
                Coins are used for story rewards. Diamonds are premium currency. Rewards may reset if you miss daily check-in.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
