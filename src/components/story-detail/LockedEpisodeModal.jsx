import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const FALLBACK_DIAMOND_PRICE = 10
const FALLBACK_GEM_PRICE = 1000
const AUTO_UNLOCK_HINT =
  'Auto-unlock with Diamonds only. Free methods like Coins, Vouchers, or Story Cards won’t apply.'

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function authHeaders() {
  const token = getReaderToken()

  return token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function buildFallbackPackageOptions(price = FALLBACK_DIAMOND_PRICE) {
  return [
    {
      key: 'single',
      label: '1 Episode',
      requested_count: 1,
      enabled: true,
      discount_percent: 0,
      original_price: price,
      price,
      disabled_reason: '',
    },
    {
      key: 'next10',
      label: 'Next 10 Eps',
      requested_count: 10,
      enabled: false,
      discount_percent: 10,
      original_price: 100,
      price: 90,
      disabled_reason: 'This story does not have 10 locked released episodes available from this point.',
    },
    {
      key: 'next30',
      label: 'Next 30 Eps',
      requested_count: 30,
      enabled: false,
      discount_percent: 20,
      original_price: 300,
      price: 240,
      disabled_reason: 'This story does not have 30 locked released episodes available from this point.',
    },
    {
      key: 'next50',
      label: 'Next 50 Eps',
      requested_count: 50,
      enabled: false,
      discount_percent: 25,
      original_price: 500,
      price: 375,
      disabled_reason: 'This story does not have 50 locked released episodes available from this point.',
    },
    {
      key: 'all_released',
      label: 'All Released Episodes',
      requested_count: 0,
      enabled: false,
      discount_percent: 40,
      original_price: 5000,
      price: 3000,
      disabled_reason: 'All Released Episodes works when the story has more than 70 released locked episodes or the story is completed.',
    },
  ]
}

function DiamondIcon({ size = 'h-7 w-7' }) {
  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt="Diamond"
      className={`${size} shrink-0 object-contain`}
      loading="lazy"
      decoding="async"
    />
  )
}

function GemIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center ${size}`}>
      <img
        src="/assets/Icons/Shadow Coin.svg"
        alt="Coin"
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
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

function InstantOption({ option, active, onClick }) {
  return (
    <button
      type="button"
      disabled={!option.enabled}
      onClick={onClick}
      className={`relative min-h-[88px] rounded-[18px] border bg-white px-4 py-3 text-left transition active:scale-[0.99] ${
        active ? 'border-[#C59B2D] shadow-[0_14px_30px_rgba(197,155,45,0.16)]' : 'border-[#E5E7EB]'
      } ${!option.enabled ? 'opacity-55' : ''}`}
      title={option.disabled_reason || ''}
    >
      {Number(option.discount_percent || 0) > 0 ? (
        <span className="mb-2 inline-flex rounded-full bg-[#F5C542] px-2.5 py-1 text-[11px] font-black text-[#111111]">
          {option.discount_percent}% Off
        </span>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-[14px] font-black leading-5 text-[#111111]">
          {option.label}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {Number(option.original_price || 0) > Number(option.price || 0) ? (
            <span className="text-[13px] font-medium text-[#C1C5CC] line-through">
              {formatNumber(option.original_price)}
            </span>
          ) : null}
          <DiamondIcon selected={active} size="h-7 w-7" />
          <span className="text-[15px] font-black text-[#111111]">{formatNumber(option.price)}</span>
        </div>
      </div>
    </button>
  )
}

function FreeAccessRow({ iconType, title, subtitle, disabled, buttonText = 'Access', onClick }) {
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
        onClick={onClick}
        className="h-8 shrink-0 rounded-full bg-[#111111] px-4 text-[12px] font-medium text-white disabled:bg-[#C9CBD1] disabled:opacity-75"
      >
        {buttonText}
      </button>
    </div>
  )
}

export default function LockedEpisodeModal({ episode, storyId, onClose, onUnlocked, onLogin, onTopUp }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('instant')
  const [selectedPackage, setSelectedPackage] = useState('single')
  const [loading, setLoading] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [message, setMessage] = useState('')
  const [wallet, setWallet] = useState(null)
  const [packageOptions, setPackageOptions] = useState(buildFallbackPackageOptions())
  const [gemAccess, setGemAccess] = useState({
    amount: FALLBACK_GEM_PRICE,
    access_days: 7,
  })
  const [autoUnlock, setAutoUnlock] = useState(false)
  const [showAutoHint, setShowAutoHint] = useState(false)

  const episodeStoryId = storyId || episode?.story_id
  const diamondBalance = Number(wallet?.diamond_balance || 0)
  const gemBalance = Number(wallet?.gem_balance || 0)
  const selectedOption = packageOptions.find((option) => option.key === selectedPackage) || packageOptions[0]
  const packagePrice = Number(selectedOption?.price || FALLBACK_DIAMOND_PRICE)
  const hasEnoughDiamonds = diamondBalance >= packagePrice
  const needDiamonds = Math.max(0, packagePrice - diamondBalance)
  const hasEnoughGems = gemBalance >= Number(gemAccess.amount || FALLBACK_GEM_PRICE)

  const purchaseText = useMemo(() => {
    if (unlocking) return 'Unlocking...'
    if (!getReaderToken()) return 'Login to Unlock'
    if (!selectedOption?.enabled) return 'Package unavailable'
    if (!hasEnoughDiamonds) return 'Top Up Diamonds'
    return 'Purchase'
  }, [hasEnoughDiamonds, selectedOption, unlocking])

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
        headers: authHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to check unlock status')
      }

      const options = Array.isArray(data.package_options) && data.package_options.length
        ? data.package_options
        : buildFallbackPackageOptions(Number(data.price?.amount || FALLBACK_DIAMOND_PRICE))

      setWallet(data.wallet || null)
      setAutoUnlock(Boolean(data.wallet?.auto_unlock))
      setPackageOptions(options)
      setGemAccess(data.gem_access || { amount: FALLBACK_GEM_PRICE, access_days: 7 })

      if (!options.some((option) => option.key === selectedPackage)) {
        setSelectedPackage(options[0]?.key || 'single')
      }

      if (data.unlocked) {
        onUnlocked?.(episode)
      }
    } catch (error) {
      setPackageOptions(buildFallbackPackageOptions())
      setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to check unlock status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUnlockStatus()
  }, [episode?.id, episodeStoryId])

  if (!episode) return null

  const handlePurchase = async () => {
    const token = getReaderToken()

    if (!token) {
      onLogin?.()
      return
    }

    if (!selectedOption?.enabled) {
      setMessage(selectedOption?.disabled_reason || 'This package is not available.')
      return
    }

    if (!hasEnoughDiamonds) {
      onTopUp?.()
      return
    }

    try {
      setUnlocking(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/unlocks/stories/${episodeStoryId}/episodes/${episode.id}/package`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          package_key: selectedPackage,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        if (data.code === 'INSUFFICIENT_DIAMONDS') {
          setWallet(data.wallet || wallet)
          setMessage(`Not enough Diamonds. Need ${data.need || needDiamonds} more.`)
          return
        }

        throw new Error(data.message || 'Failed to unlock episodes')
      }

      setWallet(data.wallet || wallet)
      onUnlocked?.(episode)
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to unlock episodes')
    } finally {
      setUnlocking(false)
    }
  }

  const handleGemAccess = async () => {
    const token = getReaderToken()

    if (!token) {
      onLogin?.()
      return
    }

    if (!hasEnoughGems) {
      setMessage(`Not enough Coins. Need ${Number(gemAccess.amount || FALLBACK_GEM_PRICE) - gemBalance} more.`)
      return
    }

    try {
      setUnlocking(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/unlocks/stories/${episodeStoryId}/episodes/${episode.id}/gem`, {
        method: 'POST',
        headers: authHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        if (data.code === 'INSUFFICIENT_GEMS') {
          setWallet(data.wallet || wallet)
          setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to unlock with Coins')
          return
        }

        throw new Error(data.message || 'Failed to unlock with Gems')
      }

      setWallet(data.wallet || wallet)
      onUnlocked?.(episode)
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to unlock with Gems')
    } finally {
      setUnlocking(false)
    }
  }

  const handleComingSoon = () => {
  onClose?.()
  navigate('/tasks')
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
                {packageOptions.filter((option) => option.key !== 'all_released').map((option) => (
                  <InstantOption
                    key={option.key}
                    option={option}
                    active={selectedPackage === option.key}
                    onClick={() => setSelectedPackage(option.key)}
                  />
                ))}
              </div>

              {packageOptions.filter((option) => option.key === 'all_released').map((option) => (
                <button
                  key={option.key}
                  type="button"
                  disabled={!option.enabled}
                  onClick={() => setSelectedPackage(option.key)}
                  className={`mt-3 flex min-h-[88px] w-full items-center justify-between rounded-[18px] border bg-white px-4 py-3 text-left ${
                    selectedPackage === option.key ? 'border-[#C59B2D]' : 'border-[#E5E7EB]'
                  } ${!option.enabled ? 'opacity-55' : ''}`}
                  title={option.disabled_reason || ''}
                >
                  <div>
                    <span className="mb-2 inline-flex rounded-full bg-[#F5C542] px-2.5 py-1 text-[11px] font-black text-[#111111]">
                      {option.discount_percent}% Off
                    </span>
                    <div className="text-[14px] font-black text-[#111111]">{option.label}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {Number(option.original_price || 0) > Number(option.price || 0) ? (
                      <span className="text-[13px] font-medium text-[#C1C5CC] line-through">
                        {formatNumber(option.original_price)}
                      </span>
                    ) : null}
                    <DiamondIcon selected={selectedPackage === option.key} size="h-7 w-7" />
                    <span className="text-[15px] font-black text-[#111111]">{formatNumber(option.price)}</span>
                  </div>
                </button>
              ))}

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="text-[14px] font-medium text-[#B8BDC7]">
                  Balance: {loading ? 'Checking...' : `${formatNumber(diamondBalance)} Diamonds`}
                </div>

                <div className="relative flex items-center gap-2 text-[14px] font-medium text-[#B8BDC7]">
                  <button
                    type="button"
                    onClick={() => setShowAutoHint((value) => !value)}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-[#CFD4DF] text-[12px]"
                    aria-label="Auto unlock info"
                  >
                    ?
                  </button>

                  {showAutoHint ? (
                    <button
                      type="button"
                      onClick={() => setShowAutoHint(false)}
                      className="absolute bottom-9 right-0 z-20 w-[260px] rounded-[16px] bg-[#111111] px-4 py-3 text-left text-[11px] font-medium leading-5 text-white shadow-xl"
                    >
                      {AUTO_UNLOCK_HINT}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setAutoUnlock((value) => !value)}
                    className="flex items-center gap-2"
                  >
                    Auto Unlock
                    <span className={`relative h-8 w-14 rounded-full transition ${autoUnlock ? 'bg-[#111111]' : 'bg-[#D0D5DD]'}`}>
                      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${autoUnlock ? 'left-7' : 'left-1'}`} />
                    </span>
                  </button>
                </div>
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
                  Need {needDiamonds} more Diamonds to unlock this package.
                </div>
              ) : null}

              <button
                type="button"
                onClick={handlePurchase}
                disabled={loading || unlocking || !selectedOption?.enabled}
                className="mt-5 h-[56px] w-full rounded-full bg-[#111111] text-[16px] font-medium text-white shadow-[0_16px_32px_rgba(17,24,39,0.22)] active:scale-[0.99] disabled:bg-[#9CA3AF]"
              >
                {purchaseText}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleComingSoon}
                className="flex w-full items-center gap-3 text-left active:scale-[0.99]"
              >
                <span className="rounded-[14px] bg-[#111111] px-4 py-3 text-[14px] font-medium text-white">
                  Free Unlock
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium text-[#8D94A1]">
                  Earn more from tasks & events
                </span>
                <i className="fa-solid fa-chevron-right text-[13px] text-[#8D94A1]" />
              </button>

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
  title={`Coins — ${formatNumber(gemBalance)} remaining`}
  subtitle={`Access lasts ${Number(gemAccess.access_days || 7)} days.`}
  buttonText={hasEnoughGems ? 'Access' : 'Not enough'}
  disabled={unlocking || !hasEnoughGems}
  onClick={handleGemAccess}
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

              {message ? (
                <button
                  type="button"
                  onClick={() => setMessage('')}
                  className="mt-4 w-full rounded-[16px] bg-[#FFF1F1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#E5484D]"
                >
                  {message}
                </button>
              ) : null}

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
