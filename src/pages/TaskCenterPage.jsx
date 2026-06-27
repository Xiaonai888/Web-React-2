import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CHEST_COOLDOWN_MS = 4 * 60 * 60 * 1000
const CHEST_MAX_STORAGE = 2

const fallbackRewards = [
  { day: 1, gems: 50, coins: 50, vouchers: 0, gift: false, story_cards: 0 },
  { day: 2, gems: 100, coins: 100, vouchers: 0, gift: false, story_cards: 0 },
  { day: 3, gems: 150, coins: 150, vouchers: 0, gift: false, story_cards: 0 },
  { day: 4, gems: 200, coins: 200, vouchers: 0, gift: false, story_cards: 0 },
  { day: 5, gems: 250, coins: 250, vouchers: 0, gift: false, story_cards: 0 },
  { day: 6, gems: 300, coins: 300, vouchers: 0, gift: false, story_cards: 0 },
  { day: 7, gems: 0, coins: 0, vouchers: 1, gift: true, story_cards: 0 },
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
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('shadow_reader_user') || localStorage.getItem('shadow_reader_user') || 'null')
  } catch {
    return null
  }
}

function clearReaderSession() {
  localStorage.removeItem('shadow_reader_token')
  sessionStorage.removeItem('shadow_reader_token')
  localStorage.removeItem('shadow_reader_user')
  sessionStorage.removeItem('shadow_reader_user')
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

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.ceil(Number(ms || 0) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getLiveChest(chest) {
  if (!chest) {
    return {
      available_chests: 0,
      max_chests: CHEST_MAX_STORAGE,
      is_full: false,
      next_chest_at: null,
      ms_until_next: 0,
    }
  }

  const maxChests = Number(chest.max_chests || CHEST_MAX_STORAGE)
  const baseAvailable = Math.min(maxChests, Math.max(0, Number(chest.available_chests || 0)))

  if (baseAvailable >= maxChests) {
    return {
      ...chest,
      available_chests: maxChests,
      is_full: true,
      next_chest_at: null,
      ms_until_next: 0,
    }
  }

  if (!chest.next_chest_at) {
    return {
      ...chest,
      available_chests: baseAvailable,
      is_full: baseAvailable >= maxChests,
      ms_until_next: Number(chest.ms_until_next || 0),
    }
  }

  const nowMs = Date.now()
  const nextMs = new Date(chest.next_chest_at).getTime()

  if (!Number.isFinite(nextMs)) {
    return {
      ...chest,
      available_chests: baseAvailable,
      is_full: false,
      ms_until_next: Number(chest.ms_until_next || 0),
    }
  }

  if (nowMs < nextMs) {
    return {
      ...chest,
      available_chests: baseAvailable,
      is_full: false,
      ms_until_next: nextMs - nowMs,
    }
  }

  const gained = 1 + Math.floor((nowMs - nextMs) / CHEST_COOLDOWN_MS)
  const liveAvailable = Math.min(maxChests, baseAvailable + gained)
  const isFull = liveAvailable >= maxChests
  const liveNextMs = isFull ? null : nextMs + gained * CHEST_COOLDOWN_MS

  return {
    ...chest,
    available_chests: liveAvailable,
    is_full: isFull,
    next_chest_at: liveNextMs ? new Date(liveNextMs).toISOString() : null,
    ms_until_next: liveNextMs ? Math.max(0, liveNextMs - nowMs) : 0,
  }
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
    <img
      src="/assets/Icons/Diamond.svg"
      alt="Diamond"
      className={`shrink-0 object-contain ${className}`}
    />
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

function BalanceBox({ label, value, type, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-center gap-3 px-5 py-4 text-left active:scale-[0.99]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {type === 'diamond' ? <DiamondIcon className="h-6 w-6" /> : <CoinIcon className="h-7 w-7" />}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1 text-[13px] font-semibold text-[#343a46]">
          <span>{label}</span>
          <i className="fa-solid fa-chevron-right text-[9px] text-[#6b7280]" />
        </div>
        <div className="mt-1 text-[24px] font-bold leading-none text-[#ff3f62]">{formatNumber(value)}</div>
      </div>
    </button>
  )
}

function DayReward({ reward, currentDay, claimedToday, onClaim, claiming }) {
  const isPast = reward.day < currentDay
  const isToday = reward.day === currentDay
  const isClaimed = isPast || (isToday && claimedToday)
  const canTap = isToday && !claimedToday && !claiming
  const isGift = Boolean(reward.gift || Number(reward.vouchers || 0) > 0 || Number(reward.story_cards || 0) > 0)
  const label = isClaimed ? 'Claimed' : `Day ${reward.day}`

  return (
    <button
      type="button"
      onClick={canTap ? onClaim : undefined}
      disabled={!canTap}
      className={`min-w-0 text-center active:scale-95 ${canTap ? 'cursor-pointer' : 'cursor-default'}`}
      aria-label={canTap ? 'Tap to claim reward' : label}
    >
      <div className={`mx-auto flex h-7 w-7 items-center justify-center sm:h-9 sm:w-9 ${isClaimed ? 'opacity-55' : ''}`}>
        {isGift ? (
          <img
            src="/assets/Icons/Gift.svg"
            alt="Gift"
            className="h-6 w-6 object-contain sm:h-8 sm:w-8"
          />
        ) : (
          <CoinIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        )}
      </div>

      <div className="mt-1 text-[10px] font-black text-[#111827] sm:mt-2 sm:text-[11px]">
        {isGift ? 'Gift' : reward.coins || reward.gems}
      </div>

      <div className={`mt-1 text-[10px] font-bold ${canTap ? 'text-[#d97706]' : isClaimed ? 'text-[#f59e0b]' : 'text-[#9ca3af]'}`}>
        {canTap ? 'Tap' : label}
      </div>
    </button>
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


function FloatingRewardChest({ chest, onClick, claiming }) {
  const availableChests = Number(chest?.available_chests || 0)
  const isReady = availableChests > 0
  const isFull = Boolean(chest?.is_full)
  const label = isFull ? 'Full' : availableChests > 1 ? `x${availableChests}` : 'Ready'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[106px] z-[80] mx-auto h-[116px] max-w-[760px]">
      <button
        type="button"
        onClick={onClick}
        disabled={claiming}
        className={`pointer-events-auto absolute bottom-0 right-2 flex h-[112px] w-[112px] items-end justify-center active:scale-95 disabled:opacity-70 sm:right-4 ${
          isReady ? 'shadowChestReady' : 'opacity-90'
        }`}
        aria-label="Reward Chest"
      >
        <span className={`absolute bottom-1 h-16 w-16 rounded-full ${isReady ? 'bg-[#ffb800]/30 blur-xl' : 'bg-black/10 blur-lg'}`} />

        <img
          src="/assets/TaskCenter/Chest/chest-closed.png"
          alt="Reward Chest"
          className="relative z-10 h-[92px] w-[104px] object-contain drop-shadow-[0_12px_18px_rgba(17,24,39,0.22)]"
        />

        {isReady ? (
          <span className="absolute bottom-0 right-2 z-20 rounded-full bg-gradient-to-r from-[#ff3f62] to-[#ff8a00] px-3 py-1 text-[12px] font-black text-white shadow-[0_8px_18px_rgba(255,63,98,0.25)]">
            {label}
          </span>
        ) : null}
      </button>
    </div>
  )
}

function RewardChestPopup({ reward, onClaim }) {
  if (!reward) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <CoinIcon className="shadowCoinBurst shadowCoinBurstOne absolute left-[18%] top-[30%] h-9 w-9" />
        <CoinIcon className="shadowCoinBurst shadowCoinBurstTwo absolute right-[19%] top-[28%] h-8 w-8" />
        <CoinIcon className="shadowCoinBurst shadowCoinBurstThree absolute left-[26%] bottom-[31%] h-7 w-7" />
        <CoinIcon className="shadowCoinBurst shadowCoinBurstFour absolute right-[27%] bottom-[32%] h-7 w-7" />
        <span className="absolute left-[16%] top-[42%] h-2 w-2 animate-ping rounded-full bg-[#F6B800]" />
        <span className="absolute right-[18%] top-[44%] h-2 w-2 animate-ping rounded-full bg-white" />
      </div>

      <div className="relative w-full max-w-[360px] rounded-[30px] bg-white px-6 py-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="absolute left-1/2 top-[86px] h-28 w-28 -translate-x-1/2 rounded-full bg-[#ffcd3c]/45 blur-2xl" />

        <h3 className="relative z-10 text-[22px] font-black leading-7 text-[#ffcc32] drop-shadow-[0_2px_0_rgba(143,86,0,0.28)]">
          Hooray! You’ve got
        </h3>

        <div className="relative z-10 mx-auto mt-4 flex h-[190px] items-center justify-center">
          <img
            src="/assets/TaskCenter/Chest/chest-open.png"
            alt="Opened Reward Chest"
            className="shadowChestOpen h-[178px] w-[240px] object-contain drop-shadow-[0_16px_25px_rgba(17,24,39,0.25)]"
          />
        </div>

        <div className="relative z-10 -mt-3 flex items-center justify-center gap-2">
          <CoinIcon className="h-10 w-10" />
          <span className="text-[38px] font-black leading-none text-[#111827]">
            +{formatNumber(reward.coins)}
          </span>
        </div>

        <button
          type="button"
          onClick={onClaim}
          className="relative z-10 mt-7 flex h-12 w-full items-center justify-center rounded-full bg-[#ff3f62] text-[15px] font-black text-white shadow-[0_10px_22px_rgba(255,63,98,0.24)] active:scale-[0.98]"
        >
          Claim
        </button>
      </div>
    </div>
  )
}

export default function TaskCenterPage() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState({ coins: 0, diamonds: 0, vouchers: 0 })
  const [checkIn, setCheckIn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')
  const [showCheckInRules, setShowCheckInRules] = useState(false)
  const [giftReward, setGiftReward] = useState(null)
  const [rewardChest, setRewardChest] = useState(null)
  const [chestReward, setChestReward] = useState(null)
  const [chestClaiming, setChestClaiming] = useState(false)
  const [chestTick, setChestTick] = useState(Date.now())
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderLoading, setReminderLoading] = useState(false)
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
  const streakCount = Number(currentCheckIn.streak_count || (claimedToday ? currentDay : Math.max(currentDay - 1, 0)))
  const coverImageUrl = taskCoverUrl || '/assets/Task%20Center/Task%20background%202.webp'
  const liveRewardChest = useMemo(() => {
    chestTick
    return getLiveChest(rewardChest)
  }, [rewardChest, chestTick])

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
      setWallet({ coins: 0, diamonds: 0, vouchers: 0 })
      setCheckIn(null)
      setRewardChest(null)
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const [walletResponse, checkInResponse, chestResponse] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/tasks/check-in`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/tasks/reward-chest`, { headers: getHeaders() }),
      ])

      if (walletResponse.status === 'fulfilled') {
        const walletData = await walletResponse.value.json().catch(() => ({}))

        if (walletResponse.value.status === 401 || walletResponse.value.status === 403) {
          clearReaderSession()
          setToast('Please log in again')
          navigate('/login')
          return
        }

        if (walletResponse.value.ok && walletData.ok && walletData.wallet) {
          setWallet({
            coins: Number(walletData.wallet.coin_balance ?? walletData.wallet.gem_balance ?? 0),
            diamonds: Number(walletData.wallet.diamond_balance ?? 0),
            vouchers: Number(walletData.wallet.voucher_balance ?? 0),
          })
        }
      }

      if (checkInResponse.status === 'fulfilled') {
        const checkInData = await checkInResponse.value.json().catch(() => ({}))

        if (checkInResponse.value.status === 401 || checkInResponse.value.status === 403) {
          clearReaderSession()
          setToast('Please log in again')
          navigate('/login')
          return
        }

        if (checkInResponse.value.ok && checkInData.ok) {
          setCheckIn(checkInData.check_in || null)

          if (checkInData.wallet) {
            setWallet({
              coins: Number(checkInData.wallet.coin_balance ?? checkInData.wallet.gem_balance ?? 0),
              diamonds: Number(checkInData.wallet.diamond_balance ?? 0),
              vouchers: Number(checkInData.wallet.voucher_balance ?? 0),
            })
          }
        }
      }

      if (chestResponse.status === 'fulfilled') {
        const chestData = await chestResponse.value.json().catch(() => ({}))

        if (chestResponse.value.status === 401 || chestResponse.value.status === 403) {
          clearReaderSession()
          setToast('Please log in again')
          navigate('/login')
          return
        }

        if (chestResponse.value.ok && chestData.ok && chestData.chest) {
          setRewardChest(chestData.chest)
        }
      }
    } catch {
      setToast('Could not load rewards')
    } finally {
      setLoading(false)
    }
  }

  async function loadReminderSetting() {
    if (!isLoggedIn) {
      setReminderEnabled(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/mails/daily-checkin-reminder`, {
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.ok) {
        setReminderEnabled(Boolean(data.enabled))
      }
    } catch {
      setReminderEnabled(false)
    }
  }

  async function toggleReminder() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (reminderLoading) return

    try {
      setReminderLoading(true)
      setMessage('')

      const nextEnabled = !reminderEnabled

      const response = await fetch(`${API_BASE_URL}/api/mails/daily-checkin-reminder`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ enabled: nextEnabled }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast('Please log in again')
        navigate('/login')
        return
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to update reminder')
      }

      setReminderEnabled(Boolean(data.enabled))
      setToast(data.enabled ? 'Check-in reminder set for 9:00 AM' : 'Check-in reminder turned off')
    } catch (error) {
      setToast(error.message || 'Failed to update reminder')
    } finally {
      setReminderLoading(false)
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

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast('Please log in again to claim coins')
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Reward is not available yet')
      }

      if (data.wallet) {
        setWallet({
          coins: Number(data.wallet.coin_balance ?? data.wallet.gem_balance ?? wallet.coins ?? 0),
          diamonds: Number(data.wallet.diamond_balance ?? wallet.diamonds ?? 0),
          vouchers: Number(data.wallet.voucher_balance ?? wallet.vouchers ?? 0),
        })
      }

      setCheckIn(data.check_in || { ...currentCheckIn, claimed_today: true })

      const rewardCoins = Number(data.reward?.coins ?? data.reward?.gems ?? data.history_item?.amount_coins ?? data.history_item?.amount_gems ?? 0)
      const rewardVouchers = Number(data.reward?.vouchers ?? data.history_item?.amount_vouchers ?? 0)
      const storyCards = Number(data.reward?.story_cards ?? data.history_item?.story_cards ?? 0)
      const isGiftReward = Boolean(data.reward?.gift || rewardVouchers > 0 || storyCards > 0)

      if (isGiftReward) {
        setGiftReward({
          coins: rewardCoins,
          vouchers: rewardVouchers,
        })
      } else {
        setToast(data.message || 'Coins added to your wallet')
      }
    } catch (error) {
      setToast(error.message || 'Failed to claim reward')
    } finally {
      setClaiming(false)
    }
  }

  async function claimRewardChest() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    const liveChest = getLiveChest(rewardChest)
    const availableChests = Number(liveChest.available_chests || 0)

    if (availableChests < 1) {
      const waitText = liveChest.ms_until_next > 0 ? `Next chest in ${formatDuration(liveChest.ms_until_next)}` : 'Chest is not ready yet'
      setToast(waitText)
      return
    }

    if (chestClaiming) return

    try {
      setChestClaiming(true)

      const response = await fetch(`${API_BASE_URL}/api/tasks/reward-chest/claim`, {
        method: 'POST',
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast('Please log in again')
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        if (data.chest) setRewardChest(data.chest)
        throw new Error(data.message || 'Chest is not ready yet')
      }

      if (data.wallet) {
        setWallet({
          coins: Number(data.wallet.coin_balance ?? data.wallet.gem_balance ?? wallet.coins ?? 0),
          diamonds: Number(data.wallet.diamond_balance ?? wallet.diamonds ?? 0),
          vouchers: Number(data.wallet.voucher_balance ?? wallet.vouchers ?? 0),
        })
      }

      if (data.chest) {
        setRewardChest(data.chest)
      }

      setChestReward({
        coins: Number(data.reward?.coins ?? data.reward?.gems ?? data.history_item?.amount_coins ?? data.history_item?.amount_gems ?? 0),
      })
    } catch (error) {
      setToast(error.message || 'Failed to claim reward chest')
    } finally {
      setChestClaiming(false)
    }
  }

  useEffect(() => {
    loadTaskCover()
    loadTaskCenter()
    loadReminderSetting()
  }, [])

  useEffect(() => {
    if (!toast) return undefined

    const timer = window.setTimeout(() => {
      setToast('')
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setChestTick(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
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
      <style>
        {`
          @keyframes shadowToast {
            0% { opacity: 0; transform: translate(-50%, 12px) scale(0.98); }
            12% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            82% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            100% { opacity: 0; transform: translate(-50%, 12px) scale(0.98); }
          }

          @keyframes shadowChestReady {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(-2deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(-4px) rotate(2deg); }
          }

          @keyframes shadowChestOpen {
            0% { opacity: 0; transform: scale(0.82) translateY(16px); }
            55% { opacity: 1; transform: scale(1.08) translateY(-4px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }

          @keyframes shadowCoinBurstOne {
            0% { opacity: 0; transform: translate(36px, 72px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(-24px, -56px) scale(1) rotate(-28deg); }
          }

          @keyframes shadowCoinBurstTwo {
            0% { opacity: 0; transform: translate(-36px, 72px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(26px, -54px) scale(1) rotate(28deg); }
          }

          @keyframes shadowCoinBurstThree {
            0% { opacity: 0; transform: translate(40px, -10px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(-32px, 36px) scale(0.9) rotate(22deg); }
          }

          @keyframes shadowCoinBurstFour {
            0% { opacity: 0; transform: translate(-40px, -10px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(32px, 36px) scale(0.9) rotate(-22deg); }
          }

          .shadowChestReady {
            animation: shadowChestReady 1.65s ease-in-out infinite;
          }

          .shadowChestOpen {
            animation: shadowChestOpen 0.48s ease-out both;
          }

          .shadowCoinBurst {
            animation-duration: 1.25s;
            animation-timing-function: ease-out;
            animation-iteration-count: infinite;
          }

          .shadowCoinBurstOne { animation-name: shadowCoinBurstOne; }
          .shadowCoinBurstTwo { animation-name: shadowCoinBurstTwo; animation-delay: 0.12s; }
          .shadowCoinBurstThree { animation-name: shadowCoinBurstThree; animation-delay: 0.2s; }
          .shadowCoinBurstFour { animation-name: shadowCoinBurstFour; animation-delay: 0.28s; }
        `}
      </style>

      {chestReward ? (
        <RewardChestPopup
          reward={chestReward}
          onClaim={() => {
            setChestReward(null)
            setToast('Reward added to your wallet')
          }}
        />
      ) : null}

      {giftReward ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-6">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute left-[18%] top-[28%] h-2 w-2 animate-bounce rounded-full bg-[#F6B800]" />
            <span className="absolute right-[22%] top-[30%] h-2 w-2 animate-ping rounded-full bg-[#ff3f62]" />
            <span className="absolute left-[25%] bottom-[32%] h-2 w-2 animate-pulse rounded-full bg-white" />
            <span className="absolute right-[28%] bottom-[34%] h-2 w-2 animate-bounce rounded-full bg-[#F6B800]" />
          </div>

          <div className="relative w-full max-w-[340px] rounded-[28px] bg-white px-6 py-7 text-center shadow-[0_18px_50px_rgba(17,24,39,0.24)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff7d6]">
              <img
                src="/assets/Icons/Gift.svg"
                alt="Gift"
                className="h-12 w-12 object-contain"
              />
            </div>

            <h3 className="mt-4 text-[20px] font-black text-[#111827]">
              Gift Opened!
            </h3>

            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#8b93a1]">
              Your Day 7 reward has been added to your wallet.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-[#fff7d6] px-3 py-4">
                <CoinIcon className="mx-auto h-8 w-8" />
                <div className="mt-2 text-[18px] font-black text-[#111827]">
                  +{formatNumber(giftReward.coins)}
                </div>
                <div className="mt-1 text-[11px] font-bold text-[#8b93a1]">Coins</div>
              </div>

              <div className="rounded-[20px] bg-[#f8fafc] px-3 py-4">
                <i className="fa-solid fa-ticket text-[28px] text-[#111827]" />
                <div className="mt-2 text-[18px] font-black text-[#111827]">
                  +{formatNumber(giftReward.vouchers)}
                </div>
                <div className="mt-1 text-[11px] font-bold text-[#8b93a1]">Voucher</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setGiftReward(null)
                setToast('Reward added to your wallet')
              }}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#ff3f62] text-[15px] font-black text-white shadow-[0_10px_22px_rgba(255,63,98,0.24)] active:scale-[0.98]"
            >
              Claim
            </button>
          </div>
        </div>
      ) : null}

      {showCheckInRules ? (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/45 px-6">
          <button
            type="button"
            aria-label="Close check-in rules"
            className="absolute inset-0"
            onClick={() => setShowCheckInRules(false)}
          />

          <div className="relative w-full max-w-[340px] rounded-[26px] bg-white px-6 py-7 text-center shadow-[0_18px_50px_rgba(17,24,39,0.22)]">
            <h3 className="text-[20px] font-black leading-7 text-[#111827]">
              Check-in Rules
            </h3>

            <p className="mt-4 text-[14px] font-semibold leading-6 text-[#4b5563]">
              Check in every day to keep your streak and collect rewards.
              If you miss a day, your streak will reset.
            </p>

            <p className="mt-3 text-[13px] font-semibold leading-5 text-[#8b93a1]">
              Premium readers can auto-claim daily rewards.
            </p>

            <button
              type="button"
              onClick={() => setShowCheckInRules(false)}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#ff3f62] text-[15px] font-black text-white shadow-[0_10px_22px_rgba(255,63,98,0.24)] active:scale-[0.98]"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          className="fixed bottom-[92px] left-1/2 z-[9999] max-w-[320px] rounded-full bg-black/55 px-4 py-2.5 text-center text-[12px] font-normal text-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md"
          style={{ animation: 'shadowToast 2.2s ease forwards' }}
        >
          {toast}
        </div>
      ) : null}

      <FloatingRewardChest
        chest={liveRewardChest}
        claiming={chestClaiming}
        onClick={claimRewardChest}
      />

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

          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#f5f3fa] via-[#f5f3fa]/75 to-transparent" />
        </div>

        <section className="relative z-20 -mt-11">
          <div className="overflow-hidden rounded-t-[28px] bg-white/95 shadow-[0_-6px_22px_rgba(17,24,39,0.08)] ring-1 ring-white/70 backdrop-blur">
            <div className="grid grid-cols-2">
              <BalanceBox
                label="My Coins"
                value={wallet.coins}
                type="coin"
                onClick={() => navigate('/tasks/history')}
              />
              <BalanceBox
                label="My Diamonds"
                value={wallet.diamonds}
                type="diamond"
                onClick={() => navigate('/shop', { state: { activeTab: 'Purchase', returnTo: '/tasks' } })}
              />
            </div>

            <div className="bg-white px-5 pb-4 pt-0">
              <p className="text-[12px] font-medium leading-5 text-[#7b8190]">
                Use Coins to unlock and read any stories on Shadow.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-1.5 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[17px] font-bold leading-6 text-[#111827]">
                  <span className="text-[#ff3f62]">{streakCount || 0}</span>-Day Streak
                </h2>

                <button
                  type="button"
                  className="flex h-5 w-5 shrink-0 items-center justify-center bg-transparent text-[#b3bac6] active:scale-95"
                  aria-label="Check-in rules"
                  onClick={() => setShowCheckInRules(true)}
                >
                  <i className="fa-regular fa-circle-question text-[15px]" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="group flex shrink-0 items-center gap-2 bg-transparent text-[12px] font-semibold text-[#6b7280] active:scale-95 disabled:opacity-60"
              aria-label="Reminder"
              aria-pressed={reminderEnabled}
              disabled={reminderLoading}
              onClick={toggleReminder}
            >
              <span>Reminder</span>
              <span
                className={`relative h-[22px] w-[42px] rounded-full p-[2px] transition-all duration-300 ${
                  reminderEnabled
                    ? 'bg-[#F6B800] shadow-[0_0_0_4px_rgba(246,184,0,0.14),inset_0_1px_2px_rgba(255,255,255,0.35)]'
                    : 'bg-[#d1d5db] shadow-inner'
                }`}
              >
                <span
                  className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_2px_7px_rgba(17,24,39,0.22)] transition-all duration-300 ${
                    reminderEnabled ? 'left-[22px]' : 'left-[2px]'
                  }`}
                />
              </span>
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

          <div className="mt-4 grid grid-cols-7 gap-1 pb-1 sm:gap-3">
            {rewards.map((reward) => (
              <DayReward
                key={reward.day}
                reward={reward}
                currentDay={currentDay}
                claimedToday={claimedToday}
                onClaim={claimToday}
                claiming={claiming}
              />
            ))}
          </div>
        </section>

        <section className="mt-1.5 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#111827]">More Rewards</h2>
            </div>
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

        <section className="mt-1.5 bg-white px-5 py-5">
  <h3 className="text-[16px] font-black leading-6 text-[#111827]">
    Notes:
  </h3>

  <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] font-semibold leading-6 text-[#111827]">
    <li>
      Shadow may suspend or restrict users who are involved in fraud, abuse, or
      violations of the rules.
    </li>

    <li>
      All events are organized and promoted by Shadow only and are not related to
      any individual authors. Shadow reserves the right to make the final decision
      on all event-related matters.
    </li>

    <li>
      If you have any questions, please contact us via{' '}
      <a
        href="https://web.facebook.com/AlphaCentauri12226/"
        target="_blank"
        rel="noreferrer"
        className="font-black text-[#ff3f62] underline decoration-[#ff3f62]/40 underline-offset-2"
      >
        “ប្រលោមលោកស្នេហា”
      </a>
      .
    </li>
  </ol>
</section>
      </main>
    </div>
  )
}
