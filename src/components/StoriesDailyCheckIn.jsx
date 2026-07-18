import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const BANNER_IMAGE = '/assets/Task%20Center/Check-in%20Banner.png'
const COIN_IMAGE = '/assets/Icons/Shadow%20Coin.svg'
const GIFT_IMAGE = '/assets/Icons/Gift.svg'

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
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

function isGiftReward(reward) {
  return Boolean(
    reward?.gift ||
      Number(reward?.vouchers || 0) > 0 ||
      Number(reward?.story_cards || 0) > 0
  )
}

function getRewardAmount(reward) {
  if (isGiftReward(reward)) return 1
  return Number(reward?.coins ?? reward?.gems ?? 0)
}

function getRewardLabel(reward) {
  if (!isGiftReward(reward)) {
    return `${getRewardAmount(reward).toLocaleString()} Coins`
  }

  const vouchers = Number(reward?.vouchers || 0)
  const storyCards = Number(reward?.story_cards || 0)

  if (vouchers > 0 && storyCards > 0) {
    return `${vouchers} Voucher${vouchers === 1 ? '' : 's'} + ${storyCards} Story Card${storyCards === 1 ? '' : 's'}`
  }

  if (vouchers > 0) {
    return `${vouchers} Voucher${vouchers === 1 ? '' : 's'}`
  }

  if (storyCards > 0) {
    return `${storyCards} Story Card${storyCards === 1 ? '' : 's'}`
  }

  return 'Daily Gift'
}

function normalizeRewards(checkIn) {
  const rewards = Array.isArray(checkIn?.rewards) ? checkIn.rewards : []

  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1
    const reward = rewards.find((item) => Number(item.day) === day)

    return (
      reward || {
        day,
        coins: 0,
        gems: 0,
        vouchers: day === 7 ? 1 : 0,
        story_cards: 0,
        gift: day === 7,
      }
    )
  })
}

function RewardDay({ reward, currentDay, claimedToday }) {
  const day = Number(reward?.day || 0)
  const gift = isGiftReward(reward)
  const isPast = day < currentDay
  const isToday = day === currentDay
  const isClaimed = isPast || (isToday && claimedToday)
  const isFuture = day > currentDay
  const icon = gift ? GIFT_IMAGE : COIN_IMAGE

  return (
    <div className="min-w-0 text-center">
      <div
        className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full transition sm:h-11 sm:w-11 ${
          isToday && !claimedToday
            ? 'bg-[#fff3da] ring-2 ring-[#ff3f62] shadow-[0_6px_16px_rgba(255,63,98,0.22)]'
            : 'bg-[#fff8e8] ring-1 ring-[#f7d899]'
        } ${isFuture ? 'opacity-55' : ''}`}
      >
        <img
          src={icon}
          alt=""
          className={`${gift ? 'h-8 w-8' : 'h-7 w-7'} object-contain`}
          loading="eager"
          decoding="async"
        />

        {isClaimed ? (
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#22c55e] text-[8px] text-white ring-2 ring-white">
            <i className="fa-solid fa-check" />
          </span>
        ) : null}
      </div>

      <div className={`mt-1.5 truncate text-[10px] font-black ${isFuture ? 'text-[#9ca3af]' : 'text-[#111827]'}`}>
        {gift ? 'Gift' : getRewardAmount(reward).toLocaleString()}
      </div>

      <div
        className={`mt-0.5 truncate text-[9px] font-bold ${
          isToday && !claimedToday
            ? 'text-[#ff3f62]'
            : isClaimed
              ? 'text-[#22c55e]'
              : 'text-[#9ca3af]'
        }`}
      >
        {isClaimed ? 'Claimed' : isToday ? 'Today' : `Day ${day}`}
      </div>
    </div>
  )
}

function RewardSuccess({ reward, onClose }) {
  const gift = isGiftReward(reward)
  const icon = gift ? GIFT_IMAGE : COIN_IMAGE

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-white px-6 pb-6 pt-8 text-center shadow-[0_28px_70px_rgba(17,24,39,0.28)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className="shadow-checkin-spark absolute h-2 w-2 rounded-full bg-[#ffd54a]"
            style={{
              left: `${12 + ((index * 19) % 78)}%`,
              top: `${10 + ((index * 23) % 68)}%`,
              animationDelay: `${index * 55}ms`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#fff7d8] to-[#ffd66b] shadow-[0_16px_34px_rgba(245,158,11,0.28)]">
        <div className="absolute inset-2 rounded-full border-2 border-white/80" />
        <img
          src={icon}
          alt=""
          className={`${gift ? 'h-16 w-16' : 'h-14 w-14'} relative z-10 object-contain shadow-checkin-reward-pop`}
        />
      </div>

      <h2 className="relative mt-5 text-[28px] font-black leading-none text-[#111827]">Congrats!</h2>
      <p className="relative mt-3 text-[13px] font-semibold text-[#8b93a1]">You received</p>
      <p className="relative mt-1 text-[20px] font-black text-[#ff3f62]">{getRewardLabel(reward)}</p>

      <button
        type="button"
        onClick={onClose}
        className="relative mt-6 h-12 w-full rounded-full bg-gradient-to-r from-[#ff3158] to-[#ff5b72] text-[14px] font-black text-white shadow-[0_10px_24px_rgba(255,49,88,0.28)] active:scale-[0.98]"
      >
        Continue
      </button>
    </div>
  )
}

export default function StoriesDailyCheckIn() {
  const [checkIn, setCheckIn] = useState(null)
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [successReward, setSuccessReward] = useState(null)
  const [message, setMessage] = useState('')
  const messageTimerRef = useRef(null)

  const currentDay = Math.min(Math.max(Number(checkIn?.current_day || 1), 1), 7)
  const claimedToday = Boolean(checkIn?.claimed_today)
  const rewards = useMemo(() => normalizeRewards(checkIn), [checkIn])
  const currentReward = rewards.find((item) => Number(item.day) === currentDay) || null
  const gift = isGiftReward(currentReward)
  const amount = getRewardAmount(currentReward)

  const loadCheckIn = useCallback(async () => {
    const token = getReaderToken()

    if (!token) {
      setVisible(false)
      setCheckIn(null)
      setModalOpen(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/check-in`, {
        headers: getHeaders(),
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setVisible(false)
        setCheckIn(null)
        setModalOpen(false)
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load daily rewards')
      }

      const nextCheckIn = data.check_in || null
      setCheckIn(nextCheckIn)
      setVisible(Boolean(nextCheckIn) && !Boolean(nextCheckIn?.claimed_today))
    } catch {
      setVisible(false)
      setCheckIn(null)
      setModalOpen(false)
    }
  }, [])

  useEffect(() => {
    loadCheckIn()

    function refreshWhenVisible() {
      if (document.visibilityState === 'visible') loadCheckIn()
    }

    window.addEventListener('focus', loadCheckIn)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      window.removeEventListener('focus', loadCheckIn)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      if (messageTimerRef.current) window.clearTimeout(messageTimerRef.current)
    }
  }, [loadCheckIn])

  useEffect(() => {
    if (!modalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [modalOpen])

  function showMessage(nextMessage) {
    setMessage(nextMessage)

    if (messageTimerRef.current) window.clearTimeout(messageTimerRef.current)

    messageTimerRef.current = window.setTimeout(() => {
      setMessage('')
    }, 2400)
  }

  function openModal() {
    if (!visible || !currentReward) return
    setSuccessReward(null)
    setMessage('')
    setModalOpen(true)
  }

  function closeModal() {
    if (claiming) return
    setModalOpen(false)
    setSuccessReward(null)
    setMessage('')
  }

  async function claimReward() {
    if (claiming || claimedToday || !currentReward) return

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
        setModalOpen(false)
        setVisible(false)
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Reward is not available yet')
      }

      const claimedReward = data.reward || currentReward
      const nextCheckIn = data.check_in || {
        ...checkIn,
        claimed_today: true,
      }

      setCheckIn(nextCheckIn)
      setVisible(false)
      setSuccessReward(claimedReward)
      window.dispatchEvent(new CustomEvent('shadow:wallet-updated', { detail: data.wallet || null }))
    } catch (error) {
      showMessage(error.message || 'Failed to claim reward')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <>
      <style>{`
        .stories-daily-check-in {
          transition: opacity .2s ease, transform .2s ease;
        }

        body.for-you-bars-hidden .stories-daily-check-in {
          opacity: 0;
          pointer-events: none;
          transform: translateY(90px);
        }

        @keyframes shadowCheckInModalIn {
          from { opacity: 0; transform: translateY(18px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes shadowCheckInRewardPop {
          0% { transform: scale(.45) rotate(-12deg); opacity: 0; }
          62% { transform: scale(1.12) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }

        @keyframes shadowCheckInSpark {
          0% { opacity: 0; transform: translateY(10px) scale(.3); }
          45% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-24px) scale(1.25); }
        }

        .shadow-checkin-modal-in {
          animation: shadowCheckInModalIn .28s cubic-bezier(.22,1,.36,1) both;
        }

        .shadow-checkin-reward-pop {
          animation: shadowCheckInRewardPop .68s cubic-bezier(.22,1,.36,1) both;
        }

        .shadow-checkin-spark {
          animation: shadowCheckInSpark 1.1s ease-out infinite;
        }
      `}</style>

      {visible ? (
        <button
          type="button"
          onClick={openModal}
          aria-label={gift ? 'Open daily gift' : `Open daily reward of ${amount} coins`}
          className="stories-daily-check-in fixed z-[99998] flex w-[68px] flex-col items-center active:scale-95"
          style={{
            right: 'max(10px, calc((100vw - 480px) / 2 + 10px))',
            bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <img
            src="/assets/Icons/Login%20Streak.svg"
            alt=""
            className="h-[58px] w-[58px] object-contain drop-shadow-[0_5px_8px_rgba(17,24,39,0.18)]"
          />

          <span className="-mt-1 flex h-[24px] min-w-[68px] items-center justify-center gap-1 rounded-full border border-white bg-[#ff3f62] px-2 shadow-[0_4px_12px_rgba(17,24,39,0.18)]">
            <span className="text-[10px] font-black leading-none text-white">Get</span>
            <img src={gift ? GIFT_IMAGE : COIN_IMAGE} alt="" className="h-[14px] w-[14px] object-contain" />
            <span className="text-[10px] font-black leading-none text-white">{amount.toLocaleString()}</span>
          </span>
        </button>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#111827]/65 px-4 py-7 backdrop-blur-[3px]">
          <button
            type="button"
            onClick={closeModal}
            className="absolute inset-0"
            aria-label="Close daily rewards"
          />

          <div className="shadow-checkin-modal-in relative z-10 w-full max-w-[430px]">
            {successReward ? (
              <RewardSuccess reward={successReward} onClose={closeModal} />
            ) : (
              <div className="relative pt-[72px]">
                <img
                  src={BANNER_IMAGE}
                  alt=""
                  className="pointer-events-none absolute left-1/2 top-0 z-20 w-[92%] max-w-[395px] -translate-x-1/2 object-contain drop-shadow-[0_12px_22px_rgba(17,24,39,0.18)]"
                  loading="eager"
                  decoding="async"
                />

                <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-b from-[#ff3158] via-[#ff4966] to-[#ff6d7f] px-4 pb-4 pt-[58px] shadow-[0_28px_70px_rgba(17,24,39,0.32)]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur active:scale-95"
                    aria-label="Close"
                  >
                    <i className="fa-solid fa-xmark text-[15px]" />
                  </button>

                  <div className="text-center text-white">
                    <h2 className="text-[25px] font-black leading-tight">Daily Rewards</h2>
                    <p className="mt-1 text-[12px] font-semibold text-white/85">Come back every day and grow your streak.</p>
                  </div>

                  <div className="mt-4 rounded-[24px] bg-white px-3 pb-4 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <div className="grid grid-cols-7 gap-1">
                      {rewards.map((reward) => (
                        <RewardDay
                          key={reward.day}
                          reward={reward}
                          currentDay={currentDay}
                          claimedToday={claimedToday}
                        />
                      ))}
                    </div>

                    <div className="mt-5 rounded-[18px] bg-[#fff7e7] px-4 py-3 text-center ring-1 ring-[#ffe1aa]">
                      <p className="text-[11px] font-bold text-[#9a6a24]">Today’s reward</p>
                      <div className="mt-1 flex items-center justify-center gap-2">
                        <img
                          src={gift ? GIFT_IMAGE : COIN_IMAGE}
                          alt=""
                          className={`${gift ? 'h-7 w-7' : 'h-6 w-6'} object-contain`}
                        />
                        <span className="text-[16px] font-black text-[#111827]">{getRewardLabel(currentReward)}</span>
                      </div>
                    </div>

                    {message ? (
                      <div className="mt-3 rounded-full bg-[#fff1f3] px-4 py-2 text-center text-[11px] font-bold text-[#e11d48]">
                        {message}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={claimReward}
                      disabled={claiming || claimedToday}
                      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff3158] to-[#ff5b72] px-5 text-[14px] font-black text-white shadow-[0_10px_24px_rgba(255,49,88,0.28)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {claiming ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          <span>Claiming...</span>
                        </>
                      ) : (
                        <>
                          <span>{gift ? 'Claim Today’s Gift' : `Claim ${amount.toLocaleString()} Coins`}</span>
                          <i className="fa-solid fa-arrow-right text-[11px]" />
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
