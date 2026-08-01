import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import ShadowMallPromotionSocial from './ShadowMallPromotionSocial'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getDiscountPercent(originalPrice, salePrice) {
  const original = Number(originalPrice || 0)
  const sale = Number(salePrice || 0)

  if (
    original <= 0 ||
    sale <= 0 ||
    sale > original
  ) {
    return 0
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        ((original - sale) / original) * 100
      )
    )
  )
}

function DiamondValue({
  value,
  muted = false,
  crossed = false,
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 whitespace-nowrap',
        muted
          ? 'text-[11px] font-semibold text-gray-400'
          : 'text-[15px] font-black text-[#111827]',
        crossed ? 'line-through' : '',
      ].join(' ')}
    >
      <span>{Number(value || 0)}</span>
      <img
        src="/assets/Icons/Diamond.svg"
        alt="Diamond"
        className={
          muted
            ? 'h-[13px] w-[13px] object-contain opacity-70'
            : 'h-[16px] w-[16px] object-contain'
        }
      />
    </span>
  )
}

function PromotionLink({
  to,
  className,
  children,
}) {
  const destination =
    String(to || '/shop').trim() || '/shop'
  const url = new URL(
    destination,
    window.location.origin
  )
  const internalHosts = new Set([
    window.location.hostname,
    'shadowerabook.site',
    'www.shadowerabook.site',
  ])

  if (internalHosts.has(url.hostname)) {
    return (
      <Link
        to={`${url.pathname}${url.search}${url.hash}`}
        className={className}
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      href={destination}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

export default function ShadowMallPromotionCard({
  item,
  onMore,
  onHide,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useMemo(() => getAuthToken(), [])
  const isStorySale =
    item?.promotion_type === 'story_sale' &&
    Boolean(item?.story_id)

  const storyUrl = `/story/${item?.story_id || ''}`
  const destination = isStorySale
    ? storyUrl
    : item?.link_url || '/shop'

  const [captionExpanded, setCaptionExpanded] =
    useState(false)
  const [saleStatus, setSaleStatus] = useState(null)
  const [statusLoading, setStatusLoading] =
    useState(false)
  const [purchaseBusy, setPurchaseBusy] =
    useState(false)
  const [confirmOpen, setConfirmOpen] =
    useState(false)
  const [needsTopUp, setNeedsTopUp] =
    useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] =
    useState('')

  const description = String(item?.description || '')
  const hasMoreDescription =
    description.length > 110

  const originalPrice = Number(
    saleStatus?.price?.original ??
      item?.original_price_diamonds ??
      0
  )
  const salePrice = Number(
    saleStatus?.price?.sale ??
      item?.sale_price_diamonds ??
      0
  )
  const discountPercent = Number(
    saleStatus?.price?.discount_percent ??
      getDiscountPercent(
        originalPrice,
        salePrice
      )
  )
  const walletBalance = Number(
    saleStatus?.wallet?.diamond_balance ?? 0
  )
  const owned = Boolean(saleStatus?.owned)
  const insufficient =
    Boolean(needsTopUp) ||
    Boolean(
      token &&
      saleStatus &&
      walletBalance < salePrice
    )

  useEffect(() => {
    if (!isStorySale || !token || !item?.id) {
      setSaleStatus(null)
      setStatusLoading(false)
      setNeedsTopUp(false)
      setMessage('')
      setErrorMessage('')
      return undefined
    }

    let alive = true
    const controller = new AbortController()

    async function loadStatus() {
      try {
        setStatusLoading(true)
        setErrorMessage('')

        const response = await fetch(
          `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(
            item.id
          )}/story-sale/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )
        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              'Failed to check purchase status'
          )
        }

        if (alive) {
          setSaleStatus(data)
          setNeedsTopUp(
            Number(
              data.wallet?.diamond_balance || 0
            ) <
              Number(data.price?.sale || 0)
          )
        }
      } catch (error) {
        if (
          alive &&
          error.name !== 'AbortError'
        ) {
          setErrorMessage(
            error.message ||
              'Failed to check purchase status'
          )
        }
      } finally {
        if (alive) {
          setStatusLoading(false)
        }
      }
    }

    loadStatus()

    return () => {
      alive = false
      controller.abort()
    }
  }, [
    isStorySale,
    item?.id,
    token,
  ])

  function goToLogin() {
    navigate('/login', {
      state: {
        from:
          `${location.pathname}` +
          `${location.search}` +
          `${location.hash}`,
      },
    })
  }

  function handleStoryAction() {
    setMessage('')
    setErrorMessage('')

    if (!token) {
      goToLogin()
      return
    }

    if (owned) {
      navigate(
        saleStatus?.story_url || storyUrl
      )
      return
    }

    if (insufficient) {
      navigate('/wallet')
      return
    }

    setConfirmOpen(true)
  }

  async function confirmPurchase() {
    if (
      purchaseBusy ||
      !token ||
      !item?.id
    ) {
      return
    }

    try {
      setPurchaseBusy(true)
      setMessage('')
      setErrorMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(
          item.id
        )}/story-sale/purchase`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      )
      const data = await response
        .json()
        .catch(() => ({}))

      if (
        response.status === 401 ||
        data.code === 'LOGIN_REQUIRED'
      ) {
        setConfirmOpen(false)
        goToLogin()
        return
      }

      if (
        response.status === 402 ||
        data.code ===
          'INSUFFICIENT_DIAMONDS'
      ) {
        setConfirmOpen(false)
        setNeedsTopUp(true)
        setSaleStatus((current) => ({
          ...(current || {}),
          wallet:
            data.wallet ||
            current?.wallet ||
            null,
        }))
        setErrorMessage(
          `You need ${Number(
            data.need || 0
          )} more Diamonds.`
        )
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            'Failed to purchase story'
        )
      }

      setConfirmOpen(false)
      setNeedsTopUp(false)
      setSaleStatus((current) => ({
        ...(current || {}),
        owned: true,
        purchased: !data.already_owned,
        button_state: 'read',
        story_url:
          data.story_url ||
          current?.story_url ||
          storyUrl,
        purchase: {
          id: data.purchase_id || null,
          paid_price_diamonds:
            data.paid_price_diamonds ||
            salePrice,
        },
        wallet:
          data.wallet ||
          current?.wallet ||
          null,
      }))
      setMessage(
        data.already_owned
          ? 'You already own this story.'
          : 'Story purchased successfully.'
      )

      window.dispatchEvent(
        new CustomEvent(
          'shadow-wallet-updated',
          {
            detail: data.wallet || null,
          }
        )
      )
    } catch (error) {
      setErrorMessage(
        error.message ||
          'Failed to purchase story'
      )
    } finally {
      setPurchaseBusy(false)
    }
  }

  return (
    <>
      <article
        id={`shadow-mall-promotion-${item.id}`}
        className="overflow-hidden bg-white ring-1 ring-gray-100 sm:rounded-[12px]"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-white">
            {item.profile_image_url ? (
              <img
                src={item.profile_image_url}
                alt={
                  item.sponsor ||
                  'Shadow Mall'
                }
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <i className="fa-solid fa-store text-[14px]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-semibold text-[#111827]">
              {item.sponsor || 'Shadow Mall'}
            </div>

            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400">
              <span>Ad</span>
              <span>·</span>
              <i className="fa-solid fa-earth-americas text-[10px]" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onMore?.(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
            aria-label="More sponsored options"
          >
            <i className="fa-solid fa-ellipsis text-[13px]" />
          </button>

          <button
            type="button"
            onClick={() => onHide?.(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
            aria-label="Hide sponsored promotion"
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        </div>

        {item.title || description ? (
          <div className="px-4 pb-3 text-[13px] font-normal leading-5 text-[#111827]">
            {item.title ? (
              <span className="font-semibold">
                {item.title}
              </span>
            ) : null}

            {description ? (
              <>
                {item.title ? (
                  <span> · </span>
                ) : null}
                <span>
                  {captionExpanded ||
                  !hasMoreDescription
                    ? description
                    : `${description
                        .slice(0, 110)
                        .trim()}...`}
                </span>

                {hasMoreDescription ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCaptionExpanded(
                        (current) => !current
                      )
                    }
                    className="ml-1 font-semibold text-gray-500"
                  >
                    {captionExpanded
                      ? 'less'
                      : 'more'}
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}

        <PromotionLink
          to={destination}
          className="block"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-[#111827]">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={
                  item.title ||
                  item.sponsor ||
                  'Shadow Mall promotion'
                }
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#4c1d95] to-[#f59e0b]" />
                <div className="absolute -right-16 -top-14 h-48 w-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-black/20" />

                <div className="absolute inset-x-5 bottom-6">
                  <div className="max-w-[360px] text-[25px] font-black leading-[1.16] text-white">
                    {item.title}
                  </div>

                  <div className="mt-3 max-w-[390px] text-[13px] font-medium leading-5 text-white/80">
                    {item.description}
                  </div>
                </div>
              </>
            )}
          </div>
        </PromotionLink>

        {isStorySale ? (
          <div className="border-b border-gray-100 bg-white px-4 py-3">
            <div className="flex min-h-[48px] items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold text-[#111827]">
                  {item.sponsor ||
                    'Shadow Mall'}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {originalPrice >
                  salePrice ? (
                    <DiamondValue
                      value={originalPrice}
                      muted
                      crossed
                    />
                  ) : null}

                  <DiamondValue
                    value={salePrice}
                  />

                  {discountPercent > 0 ? (
                    <span className="text-[10px] font-black text-[#dc2626]">
                      {discountPercent}% OFF
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                disabled={
                  statusLoading ||
                  purchaseBusy
                }
                onClick={handleStoryAction}
                className="flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-[#111827] px-4 text-[12px] font-bold text-white active:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {statusLoading
                  ? 'Checking...'
                  : owned
                    ? 'Read Story'
                    : insufficient
                      ? 'Top up'
                      : 'Buy now'}
              </button>
            </div>

            {message ? (
              <div className="mt-2 text-[11px] font-semibold text-[#15803d]">
                {message}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-2 text-[11px] font-semibold text-[#dc2626]">
                {errorMessage}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[58px] items-center justify-between gap-4 border-b border-gray-100 px-4 py-2.5">
            <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111827]">
              {item.sponsor ||
                'Shadow Mall'}
            </div>

            <PromotionLink
              to={destination}
              className="flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-[#eef0f4] px-4 text-[12px] font-semibold text-[#111827] active:bg-[#e5e7eb]"
            >
              {item.button_text ||
                item.cta ||
                'Shop now'}
            </PromotionLink>
          </div>
        )}

        <ShadowMallPromotionSocial
          promotion={item}
        />
      </article>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm story purchase"
        >
          <button
            type="button"
            aria-label="Close purchase confirmation"
            className="absolute inset-0"
            onClick={() =>
              !purchaseBusy &&
              setConfirmOpen(false)
            }
          />

          <section className="relative z-10 w-full max-w-[420px] rounded-t-[22px] bg-white p-5 shadow-2xl sm:rounded-[22px]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

            <h2 className="m-0 text-[18px] font-black text-[#111827]">
              Confirm purchase
            </h2>

            <p className="mt-2 text-[13px] font-medium leading-5 text-gray-500">
              Buy{' '}
              <span className="font-bold text-[#111827]">
                {item.title || 'this story'}
              </span>{' '}
              and permanently unlock all current
              and future episodes.
            </p>

            <div className="mt-4 rounded-[16px] bg-[#f8fafc] p-4 ring-1 ring-gray-100">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-semibold text-gray-500">
                  Price
                </span>
                <DiamondValue
                  value={salePrice}
                />
              </div>

              {saleStatus ? (
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-200 pt-3">
                  <span className="text-[12px] font-semibold text-gray-500">
                    Your balance
                  </span>
                  <DiamondValue
                    value={walletBalance}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={purchaseBusy}
                onClick={() =>
                  setConfirmOpen(false)
                }
                className="h-11 rounded-[12px] border border-gray-200 bg-white text-[13px] font-bold text-[#111827] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={purchaseBusy}
                onClick={confirmPurchase}
                className="h-11 rounded-[12px] bg-[#111827] text-[13px] font-bold text-white active:bg-black disabled:opacity-60"
              >
                {purchaseBusy
                  ? 'Purchasing...'
                  : 'Confirm'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
