import { useCallback, useEffect, useRef, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

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

function getCurrentReward(checkIn) {
  const currentDay = Math.min(Math.max(Number(checkIn?.current_day || 1), 1), 7)
  const rewards = Array.isArray(checkIn?.rewards) ? checkIn.rewards : []

  return rewards.find((item) => Number(item.day) === currentDay) || null
}

function isGiftReward(reward) {
  return Boolean(
    reward?.gift ||
      Number(reward?.vouchers || 0) > 0 ||
      Number(reward?.story_cards || 0) > 0
  )
}

export default function StoriesDailyCheckIn() {
  const [reward, setReward] = useState(null)
  const [visible, setVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [feedback, setFeedback] = useState('')
  const feedbackTimerRef = useRef(null)

  const loadCheckIn = useCallback(async () => {
    const token = getReaderToken()

    if (!token) {
      setVisible(false)
      setReward(null)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/check-in`, {
        headers: getHeaders(),
      })
      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setVisible(false)
        setReward(null)
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load check-in')
      }

      const checkIn = data.check_in || null
      const currentReward = getCurrentReward(checkIn)

      setReward(currentReward)
      setVisible(Boolean(currentReward) && !Boolean(checkIn?.claimed_today))
    } catch {
      setVisible(false)
      setReward(null)
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
      if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current)
    }
  }, [loadCheckIn])

  function showFeedback(message) {
    setFeedback(message)

    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current)

    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback('')
    }, 2200)
  }

  async function claimReward() {
    if (claiming || !visible) return

    try {
      setClaiming(true)

      const response = await fetch(`${API_BASE_URL}/api/tasks/check-in/claim`, {
        method: 'POST',
        headers: getHeaders(),
      })
      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setVisible(false)
        showFeedback('Please log in again')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Reward is not available yet')
      }

      setVisible(false)

      if (data.already_claimed) {
        showFeedback('Already claimed today')
        return
      }

      const claimed = data.reward || reward
      const gift = isGiftReward(claimed)
      const coins = Number(claimed?.coins ?? claimed?.gems ?? 0)

      showFeedback(gift ? 'Gift claimed!' : `+${coins.toLocaleString()} Coins`)
      window.dispatchEvent(new CustomEvent('shadow:wallet-updated', { detail: data.wallet || null }))
    } catch (error) {
      showFeedback(error.message || 'Failed to claim reward')
    } finally {
      setClaiming(false)
    }
  }

  const gift = isGiftReward(reward)
  const amount = gift ? 1 : Number(reward?.coins ?? reward?.gems ?? 0)
  const rewardIcon = gift ? '/assets/Icons/Gift.svg' : '/assets/Icons/Shadow%20Coin.svg'

  return (
    <>
      <style>{`
        .stories-daily-check-in {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        body.for-you-bars-hidden .stories-daily-check-in {
          opacity: 0;
          pointer-events: none;
          transform: translateY(90px);
        }
      `}</style>

      {visible ? (
        <button
          type="button"
          onClick={claimReward}
          disabled={claiming}
          aria-label={gift ? 'Get one daily gift' : `Get ${amount} daily coins`}
          className="stories-daily-check-in fixed z-[99998] flex w-[68px] flex-col items-center active:scale-95 disabled:pointer-events-none disabled:opacity-70"
          style={{
            right: 'max(10px, calc((100vw - 480px) / 2 + 10px))',
            bottom: 'calc(55px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <img
            src="/assets/Icons/Login%20Streak.svg"
            alt=""
            className="h-[58px] w-[58px] object-contain drop-shadow-[0_5px_8px_rgba(17,24,39,0.18)]"
          />

          <span className="-mt-1 flex h-[24px] min-w-[68px] items-center justify-center gap-1 rounded-full border border-[#ff647d] bg-white/95 px-2 shadow-[0_4px_12px_rgba(17,24,39,0.18)] backdrop-blur-md">
            <span className="text-[10px] font-black leading-none text-[#ff3f62]">Get</span>
            <img src={rewardIcon} alt="" className="h-[14px] w-[14px] object-contain" />
            <span className="text-[10px] font-black leading-none text-[#111827]">
              {amount.toLocaleString()}
            </span>
          </span>
        </button>
      ) : null}

      {feedback ? (
        <div
          role="status"
          className="fixed left-1/2 z-[100001] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-bold text-white shadow-xl"
          style={{ bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))' }}
        >
          {feedback}
        </div>
      ) : null}
    </>
  )
}
