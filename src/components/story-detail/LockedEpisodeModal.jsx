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

function DiamondIcon({ className = 'h-6 w-6' }) {
  return <img src="/assets/Icons/Diamond.png" alt="Diamond" className={className} />
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-12 flex-1 text-[15px] font-medium transition ${
        active ? 'text-[#111827]' : 'text-[#b8bdc7]'
      }`}
    >
      {children}
      {active ? (
        <span className="absolute bottom-0 left-1/2 h-[3px] w-[72%] -translate-x-1/2 rounded-full bg-[#d4a017]" />
      ) : null}
    </button>
  )
}

function InstantOption({ active, disabled, title, oldPrice, price, discount, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative min-h-[88px] rounded-[18px] border bg-white px-4 py-3 text-left transition active:scale-[0.99] ${
        active ? 'border-[#111827] shadow-sm' : 'border-[#d8dce4]'
      } ${disabled ? 'opacity-55' : ''}`}
    >
      {discount ? (
        <span className="mb-2 inline-flex rounded-full bg-[#d4a017] px-2.5 py-1 text-[11px] font-black text-white">
          {discount}
        </span>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-[14px] font-black leading-5 text-[#111827]">
          {title}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {oldPrice ? (
            <span className="text-[13px] font-medium text-[#c1c5cc] line-through">
              {oldPrice}
            </span>
          ) : null}
          <DiamondIcon className="h-6 w-6" />
          <span className="text-[15px] font-black text-[#111827]">{price}</span>
        </div>
      </div>
    </button>
  )
}

function FreeAccessRow({ image, icon, iconClass = '', title, subtitle, disabled, buttonText = 'Access' }) {
  return (
    <div className="flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[#d8dce4] bg-white px-4 py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#f5f3fa]">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-contain" />
        ) : (
          <i className={`${icon || 'fa-solid fa-gem'} ${iconClass || 'text-[#7c3aed]'} text-[20px]`} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-[#111827]">{title}</div>
        <div className="mt-1 text-[12px] font-medium leading-4 text-[#555b66]">{subtitle}</div>
      </div>

      <button
        type="button"
        disabled={disabled}
        className="h-8 shrink-0 rounded-full bg-[#c9cbd1] px-4 text-[12px] font-medium text-white disabled:opacity-75"
      >
        {buttonText}
      </button>
    </div>
  )
}

export default function LockedEpisodeModal({ episode, storyId, onClose, onUnlocked, onLogin, onTopUp }) {
  const [activeTab, setActiveTab] = useState('instant')
  const [selectedPackage, setSelectedPackage] = useState('single')
  const [loading, setLoading] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [message, setMessage] = useState('')
  const [wallet, setWallet] = useState(null)
  const [price, setPrice] = useState(DIAMOND_PRICE)
  const [autoUnlock, setAutoUnlock] = useState(false)

  const episodeStoryId = storyId || episode?.story_id
  const diamondBalance = Number(wallet?.diamond_balance || 0)
  const hasEnoughDiamonds = diamondBalance >= price
  const needDiamonds = Math.max(0, price - diamondBalance)

  const purchaseText = useMemo(() => {
    if (unlocking) return 'Unlocking...'
    if (!getReaderToken()) return 'Login to Unlock'
    if (!hasEnoughDiamonds) return 'Top Up Diamonds'
    return 'Purchase'
  }, [hasEnoughDiamonds, unlocking])

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
        setAutoUnlock(Boolean(data.wallet?.auto_unlock))
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

  const handlePurchase = async () => {
    const token = getReaderToken()

    if (!token) {
      onLogin?.()
      return
    }

    if (!hasEnoughDiamonds) {
      onTopUp?.()
      return
    }

    if (selectedPackage !== 'single') {
      setMessage('Package unlock will be available in the next stage.')
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
          setMessage(`Not enough Diamonds. Need ${data.need || needDiamonds} more.`)
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
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/45 px-0 pb-0 sm:items-center sm:px-6 sm:pb-0">
      <button type="button" onClick={onClose} className="absolute inset-0" aria-label="Close" />

      <section className="relative w-full max-w-none overflow-hidden rounded-t-[28px] rounded-b-none bg-white shadow-2xl sm:max-w-[680px] sm:rounded-[30px]">
        <header className="relative px-5 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[18px]" />
          </button>

          <h2 className="pr-12 text-center text-[21px] font-medium text-[#111827]">
            Unlock Episode
          </h2>

          <div className="mt-4 flex border-b border-[#eef0f4]">
            <TabButton active={activeTab === 'instant'} onClick={() => setActiveTab('instant')}>
              Instant Access
            </TabButton>
            <TabButton active={activeTab === 'free'} onClick={() => setActiveTab('free')}>
              Free Access
            </TabButton>
          </div>
        </header>

        <div className="max-h-[82vh] overflow-y-auto px-5 pb-5 pt-5">
          {activeTab === 'instant' ? (
            <>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[18px] bg-white text-left active:scale-[0.99]"
              >
                <span className="inline-flex items-center rounded-full bg-[#111827] px-3 py-2 text-[13px] font-black text-white">
                  <i className="fa-solid fa-crown mr-1.5 text-[#d4a017]" />
                  Premium
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium text-[#8d94a1]">
                  Enjoy 10% off every episode you unlock.
                </span>
                <i className="fa-solid fa-chevron-right text-[13px] text-[#8d94a1]" />
              </button>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InstantOption
                  active={selectedPackage === 'single'}
                  title="1 Episode"
                  price={price}
                  onClick={() => setSelectedPackage('single')}
                />
                <InstantOption
                  disabled
                  active={selectedPackage === 'next10'}
                  title="Next 10 Eps"
                  oldPrice="100"
                  price="90"
                  discount="10% Off"
                  onClick={() => setSelectedPackage('next10')}
                />
                <InstantOption
                  disabled
                  active={selectedPackage === 'next30'}
                  title="Next 30 Eps"
                  oldPrice="300"
                  price="240"
                  discount="20% Off"
                  onClick={() => setSelectedPackage('next30')}
                />
                <InstantOption
                  disabled
                  active={selectedPackage === 'next50'}
                  title="Next 50 Eps"
                  oldPrice="500"
                  price="375"
                  discount="25% Off"
                  onClick={() => setSelectedPackage('next50')}
                />
              </div>

              <button
                type="button"
                disabled
                className="mt-3 flex min-h-[88px] w-full items-center justify-between rounded-[18px] border border-[#d4a017] bg-white px-4 py-3 text-left opacity-65"
              >
                <div>
                  <span className="mb-2 inline-flex rounded-full bg-[#d4a017] px-2.5 py-1 text-[11px] font-black text-white">
                    40% Off
                  </span>
                  <div className="text-[14px] font-black text-[#111827]">All Released Episodes</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-[#c1c5cc] line-through">5000</span>
                  <DiamondIcon className="h-6 w-6" />
                  <span className="text-[15px] font-black text-[#111827]">3000</span>
                </div>
              </button>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="text-[14px] font-medium text-[#b8bdc7]">
                  Balance: {loading ? 'Checking...' : `${formatNumber(diamondBalance)} Diamonds`}
                </div>

                <button
                  type="button"
                  onClick={() => setAutoUnlock((value) => !value)}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#b8bdc7]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#cfd4df] text-[12px]">
                    ?
                  </span>
                  Auto Unlock
                  <span className={`relative h-8 w-14 rounded-full transition ${autoUnlock ? 'bg-[#111827]' : 'bg-[#d0d5dd]'}`}>
                    <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${autoUnlock ? 'left-7' : 'left-1'}`} />
                  </span>
                </button>
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

              {!hasEnoughDiamonds && getReaderToken() ? (
                <div className="mt-3 text-center text-[12px] font-medium text-[#8d94a1]">
                  Need {needDiamonds} more Diamonds to unlock this episode.
                </div>
              ) : null}

              <button
                type="button"
                onClick={handlePurchase}
                disabled={loading || unlocking}
                className="mt-5 h-[56px] w-full rounded-full bg-[#111827] text-[16px] font-medium text-white shadow-[0_16px_32px_rgba(17,24,39,0.22)] active:scale-[0.99] disabled:bg-[#9ca3af]"
              >
                {purchaseText}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <span className="rounded-[14px] bg-[#111827] px-4 py-3 text-[14px] font-medium text-white">
                  Free Unlock
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium text-[#8d94a1]">
                  Earn more from tasks & events
                </span>
                <i className="fa-solid fa-chevron-right text-[13px] text-[#8d94a1]" />
              </div>

              <div className="mt-5 space-y-3">
                <FreeAccessRow
                  icon="fa-solid fa-video"
                  iconClass="text-[#0b5cff]"
                  title="Watch Ads — Coming soon"
                  subtitle="Unlock for one read only. After you leave or finish reading, this episode will lock again."
                  buttonText="Watch"
                  disabled
                />
                <FreeAccessRow
                  title="Gems — Coming soon"
                  subtitle="Temporary access will be added later."
                  disabled
                />
                <FreeAccessRow
                  image="/assets/Icons/echo.svg"
                  title="Vouchers — Coming soon"
                  subtitle="Permanent unlock will be added later."
                  disabled
                />
                <FreeAccessRow
                  title="Story Cards — Coming soon"
                  subtitle="Permanent unlock for same story only."
                  disabled
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('instant')}
                className="mt-5 h-[52px] w-full rounded-full bg-[#111827] text-[15px] font-medium text-white active:scale-[0.99]"
              >
                Use Diamonds Instead
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
