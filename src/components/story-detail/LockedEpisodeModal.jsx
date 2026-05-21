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

function DiamondIcon({ selected = false, size = 'h-8 w-8' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full border ${size} ${selected ? 'border-[#C59B2D] bg-[#FFF7DF]' : 'border-[#E5E7EB] bg-[#F8F8F8]'}`}>
      <i className={`fas fa-gem text-[13px] ${selected ? 'text-[#3B0764]' : 'text-[#111111]'}`} />
    </span>
  )
}

function GemIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[#F4D58D] bg-[#FFF7ED] ${size}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2.6 19.2 7 17.4 17.2 12 21.4 6.6 17.2 4.8 7 12 2.6Z" fill="#F59E0B" />
        <path d="M12 2.6 9.1 8.2 12 21.4 14.9 8.2 12 2.6Z" fill="#FDBA74" />
        <path d="M4.8 7 9.1 8.2 6.6 17.2 4.8 7Z" fill="#D97706" />
        <path d="M19.2 7 14.9 8.2 17.4 17.2 19.2 7Z" fill="#B45309" />
        <path d="M9.1 8.2h5.8L12 21.4 9.1 8.2Z" fill="#FDE68A" opacity=".8" />
      </svg>
    </span>
  )
}

function VoucherIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[#DBEAFE] bg-[#EFF6FF] ${size}`}>
      <i className="fa-solid fa-ticket text-[20px] text-[#0B5CFF]" />
    </span>
  )
}

function StoryCardIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-[#F8F8F8] ${size}`}>
      <i className="fa-regular fa-address-card text-[21px] text-[#111111]" />
    </span>
  )
}

function VideoIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[#DBEAFE] bg-[#EFF6FF] ${size}`}>
      <i className="fa-solid fa-play text-[18px] text-[#0B5CFF]" />
    </span>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-12 flex-1 text-[15px] font-medium transition ${
        active ? 'text-[#111111]' : 'text-[#B8BDC7]'
      }`}
    >
      {children}
      {active ? (
        <span className="absolute bottom-0 left-1/2 h-[3px] w-[72%] -translate-x-1/2 rounded-full bg-[#C59B2D]" />
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
        active ? 'border-[#C59B2D] shadow-[0_14px_30px_rgba(197,155,45,0.16)]' : 'border-[#E5E7EB]'
      } ${disabled ? 'opacity-55' : ''}`}
    >
      {discount ? (
        <span className="mb-2 inline-flex rounded-full bg-[#F5C542] px-2.5 py-1 text-[11px] font-black text-[#111111]">
          {discount}
        </span>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-[14px] font-black leading-5 text-[#111111]">
          {title}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {oldPrice ? (
            <span className="text-[13px] font-medium text-[#C1C5CC] line-through">
              {oldPrice}
            </span>
          ) : null}
          <DiamondIcon selected={active} size="h-7 w-7" />
          <span className="text-[15px] font-black text-[#111111]">{price}</span>
        </div>
      </div>
    </button>
  )
}

function FreeAccessRow({ iconType, title, subtitle, disabled, buttonText = 'Access' }) {
  const iconMap = {
    ads: <VideoIcon />,
    gems: <GemIcon />,
    voucher: <VoucherIcon />,
    story_card: <StoryCardIcon />,
  }

  return (
    <div className="flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-3">
      {iconMap[iconType] || <GemIcon />}

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-[#111111]">{title}</div>
        <div className="mt-1 text-[12px] font-medium leading-4 text-[#555B66]">{subtitle}</div>
      </div>

      <button
        type="button"
        disabled={disabled}
        className="h-8 shrink-0 rounded-full bg-[#C9CBD1] px-4 text-[12px] font-medium text-white disabled:opacity-75"
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

      <section className="relative w-screen max-w-none overflow-hidden rounded-t-[28px] rounded-b-none bg-white shadow-2xl sm:w-full sm:max-w-[680px] sm:rounded-[30px]">
        <header className="relative px-5 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[18px]" />
          </button>

          <h2 className="pr-12 text-center text-[21px] font-medium text-[#111111]">
            Unlock Episode
          </h2>

          <div className="mt-4 flex border-b border-[#E5E7EB]">
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
                <span className="inline-flex items-center rounded-full bg-[#111111] px-3 py-2 text-[13px] font-black text-white">
                  <i className="fa-solid fa-crown mr-1.5 text-[#F5C542]" />
                  Premium
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium text-[#8D94A1]">
                  Enjoy 10% off every episode you unlock.
                </span>
                <i className="fa-solid fa-chevron-right text-[13px] text-[#8D94A1]" />
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
                className="mt-3 flex min-h-[88px] w-full items-center justify-between rounded-[18px] border border-[#C59B2D] bg-white px-4 py-3 text-left opacity-65"
              >
                <div>
                  <span className="mb-2 inline-flex rounded-full bg-[#F5C542] px-2.5 py-1 text-[11px] font-black text-[#111111]">
                    40% Off
                  </span>
                  <div className="text-[14px] font-black text-[#111111]">All Released Episodes</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-[#C1C5CC] line-through">5000</span>
                  <DiamondIcon selected size="h-7 w-7" />
                  <span className="text-[15px] font-black text-[#111111]">3000</span>
                </div>
              </button>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="text-[14px] font-medium text-[#B8BDC7]">
                  Balance: {loading ? 'Checking...' : `${formatNumber(diamondBalance)} Diamonds`}
                </div>

                <button
                  type="button"
                  onClick={() => setAutoUnlock((value) => !value)}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#B8BDC7]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#CFD4DF] text-[12px]">
                    ?
                  </span>
                  Auto Unlock
                  <span className={`relative h-8 w-14 rounded-full transition ${autoUnlock ? 'bg-[#111111]' : 'bg-[#D0D5DD]'}`}>
                    <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${autoUnlock ? 'left-7' : 'left-1'}`} />
                  </span>
                </button>
              </div>

              {message ? (
                <button
                  type="button"
                  onClick={() => setMessage('')}
                  className="mt-4 w-full rounded-[16px] bg-[#FFF1F1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#E5484D]"
                >
                  {message}
                </button>
              ) : null}

              {!hasEnoughDiamonds && getReaderToken() ? (
                <div className="mt-3 text-center text-[12px] font-medium text-[#8D94A1]">
                  Need {needDiamonds} more Diamonds to unlock this episode.
                </div>
              ) : null}

              <button
                type="button"
                onClick={handlePurchase}
                disabled={loading || unlocking}
                className="mt-5 h-[56px] w-full rounded-full bg-[#111111] text-[16px] font-medium text-white shadow-[0_16px_32px_rgba(17,24,39,0.22)] active:scale-[0.99] disabled:bg-[#9CA3AF]"
              >
                {purchaseText}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <span className="rounded-[14px] bg-[#111111] px-4 py-3 text-[14px] font-medium text-white">
                  Free Unlock
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium text-[#8D94A1]">
                  Earn more from tasks & events
                </span>
                <i className="fa-solid fa-chevron-right text-[13px] text-[#8D94A1]" />
              </div>

              <div className="mt-5 space-y-3">
                <FreeAccessRow
                  iconType="ads"
                  title="Watch Ads — Coming soon"
                  subtitle="Unlock for one read only. After you leave or finish reading, this episode will lock again."
                  buttonText="Watch"
                  disabled
                />
                <FreeAccessRow
                  iconType="gems"
                  title="Gems — Coming soon"
                  subtitle="Temporary access will be added later."
                  disabled
                />
                <FreeAccessRow
                  iconType="voucher"
                  title="Vouchers — Coming soon"
                  subtitle="Permanent unlock will be added later."
                  disabled
                />
                <FreeAccessRow
                  iconType="story_card"
                  title="Story Cards — Coming soon"
                  subtitle="Permanent unlock for same story only."
                  disabled
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('instant')}
                className="mt-5 h-[52px] w-full rounded-full bg-[#111111] text-[15px] font-medium text-white active:scale-[0.99]"
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
