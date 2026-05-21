import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const DIAMOND_PRICE = 10

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

export default function LockedEpisodeModal({ episode, storyId, onClose, onUnlocked, onLogin, onTopUp }) {
  const [loading, setLoading] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [message, setMessage] = useState('')
  const [wallet, setWallet] = useState(null)
  const [price, setPrice] = useState(DIAMOND_PRICE)

  const episodeStoryId = storyId || episode?.story_id
  const diamondBalance = Number(wallet?.diamond_balance || 0)
  const needDiamonds = Math.max(0, price - diamondBalance)
  const hasEnoughDiamonds = diamondBalance >= price

  const statusText = useMemo(() => {
    if (!wallet) return 'Checking balance...'
    if (hasEnoughDiamonds) return 'Permanent unlock with Diamonds'
    return `Need ${needDiamonds} more Diamonds`
  }, [hasEnoughDiamonds, needDiamonds, wallet])

  useEffect(() => {
    let ignore = false

    async function loadUnlockStatus() {
      if (!episode?.id || !episodeStoryId) return

      const token = getReaderToken()

      if (!token) {
        setWallet(null)
        setMessage('Please login to unlock this episode.')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/unlocks/stories/${episodeStoryId}/episodes/${episode.id}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to check unlock status')
        }

        if (ignore) return

        setWallet(data.wallet || null)
        setPrice(Number(data.price?.amount || DIAMOND_PRICE))

        if (data.unlocked) {
          onUnlocked?.(episode)
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to check unlock status')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUnlockStatus()

    return () => {
      ignore = true
    }
  }, [episode, episodeStoryId, onUnlocked])

  if (!episode) return null

  const handleUnlock = async () => {
    const token = getReaderToken()

    if (!token) {
      onLogin?.()
      return
    }

    if (!hasEnoughDiamonds) {
      onTopUp?.()
      return
    }

    try {
      setUnlocking(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/unlocks/stories/${episodeStoryId}/episodes/${episode.id}/diamond`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        if (data.code === 'INSUFFICIENT_DIAMONDS') {
          setWallet(data.wallet || wallet)
          setMessage(`Not enough Diamonds. Need ${data.need || price} more.`)
          return
        }

        throw new Error(data.message || 'Failed to unlock episode')
      }

      setWallet(data.wallet || wallet)
      onUnlocked?.(episode)
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to unlock episode')
    } finally {
      setUnlocking(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close"
      />

      <section className="relative w-full max-w-[520px] rounded-[30px] bg-white p-5 shadow-2xl">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#e5e7eb] sm:hidden" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold text-[#8d94a1]">
              Instant Access
            </div>

            <h2 className="mt-1 text-[22px] font-black leading-7 text-[#111827]">
              Episode {episode.episode_number || ''} is locked
            </h2>

            <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
              Unlock this episode permanently and continue reading.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[18px]" />
          </button>
        </div>

        <div className="mt-5 rounded-[22px] border border-[#e5e7eb] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[16px] font-black text-[#111827]">
                1 Episode
              </div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                {statusText}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-[20px] font-black text-[#111827]">
              <img src="/assets/Icons/Diamond.png" alt="Diamond" className="h-7 w-7" />
              {price}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] bg-[#f8fafc] px-4 py-3">
          <div className="flex items-center justify-between gap-3 text-[13px] font-semibold">
            <span className="text-[#8d94a1]">Balance</span>
            <span className="font-black text-[#111827]">
              {loading ? 'Checking...' : `${formatNumber(diamondBalance)} Diamonds`}
            </span>
          </div>
        </div>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mt-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleUnlock}
          disabled={loading || unlocking}
          className="mt-5 h-13 w-full rounded-full bg-[#0b5cff] text-[15px] font-black text-white shadow-[0_14px_28px_rgba(11,92,255,0.24)] active:scale-[0.99] disabled:bg-[#9ca3af]"
        >
          {unlocking ? 'Unlocking...' : hasEnoughDiamonds ? `Unlock for ${price} Diamonds` : 'Top Up Diamonds'}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-11 w-full rounded-full bg-[#f5f3fa] text-[13px] font-extrabold text-[#111827] active:scale-[0.99]"
        >
          Not now
        </button>
      </section>
    </div>
  )
}
