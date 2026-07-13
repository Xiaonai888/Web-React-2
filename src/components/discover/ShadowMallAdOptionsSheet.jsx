import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEYS = {
  interested: 'shadow_interested_sponsored_ads',
  hidden: 'shadow_hidden_sponsored_ads',
  saved: 'shadow_saved_sponsored_ads',
  notifications: 'shadow_sponsored_ad_notifications',
  reports: 'shadow_sponsored_ad_reports',
}

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getAdKey(item) {
  return String(
    item?.id ||
      item?.link_url ||
      item?.image_url ||
      item?.title ||
      item?.sponsor ||
      'shadow-mall-ad'
  )
}

function hasKey(items, key) {
  return items.some((item) =>
    String(typeof item === 'object' ? item?.key : item) === String(key)
  )
}

function addKey(items, key) {
  return hasKey(items, key) ? items : [...items, key]
}

function removeKey(items, key) {
  return items.filter((item) => {
    const value = typeof item === 'object' ? item?.key : item
    return String(value) !== String(key)
  })
}

function getAdSnapshot(item) {
  return {
    key: getAdKey(item),
    id: item?.id || null,
    sponsor: item?.sponsor || 'Shadow Mall',
    title: item?.title || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    profile_image_url: item?.profile_image_url || '',
    link_url: item?.link_url || '/shop',
    button_text: item?.button_text || item?.cta || 'Shop now',
    saved_at: new Date().toISOString(),
  }
}

function getDestinationDomain(value) {
  try {
    const url = new URL(value, window.location.origin)
    return url.hostname || 'Shadow'
  } catch {
    return 'Shadow'
  }
}

export function isShadowMallAdHidden(item) {
  return hasKey(readArray(STORAGE_KEYS.hidden), getAdKey(item))
}

export function hideShadowMallAdLocally(item) {
  const key = getAdKey(item)
  writeArray(
    STORAGE_KEYS.hidden,
    addKey(readArray(STORAGE_KEYS.hidden), key)
  )
}

function ActionIcon({ type }) {
  const icons = {
    interested: 'fa-regular fa-circle-plus',
    notInterested: 'fa-regular fa-circle-minus',
    save: 'fa-regular fa-bookmark',
    saved: 'fa-solid fa-bookmark',
    hide: 'fa-regular fa-rectangle-xmark',
    report: 'fa-regular fa-message-exclamation',
    why: 'fa-regular fa-circle-info',
    about: 'fa-regular fa-rectangle-list',
    notify: 'fa-regular fa-bell',
    notifyActive: 'fa-solid fa-bell',
    copy: 'fa-regular fa-copy',
    scam: 'fa-solid fa-triangle-exclamation',
    inappropriate: 'fa-solid fa-eye-slash',
    repeated: 'fa-solid fa-rotate',
    other: 'fa-solid fa-ellipsis',
  }

  return (
    <i
      className={`${icons[type] || 'fa-regular fa-circle'} text-[22px]`}
      aria-hidden="true"
    />
  )
}

function ActionButton({
  icon,
  title,
  subtitle,
  onClick,
  trailing = null,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 px-4 py-3.5 text-left active:bg-black/[0.04] ${
        danger ? 'text-red-600' : 'text-[#111827]'
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <ActionIcon type={icon} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-5">
          {title}
        </span>

        {subtitle ? (
          <span className="mt-0.5 block text-[11px] font-normal leading-4 text-gray-400">
            {subtitle}
          </span>
        ) : null}
      </span>

      {trailing}
    </button>
  )
}

export default function ShadowMallAdOptionsSheet({
  open,
  item,
  onClose,
  onHide,
}) {
  const [screen, setScreen] = useState('quick')
  const [saved, setSaved] = useState(false)
  const [interested, setInterested] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(false)
  const [message, setMessage] = useState('')
  const [dragY, setDragY] = useState(0)
  const dragRef = useRef({
    active: false,
    startY: 0,
  })

  const adKey = getAdKey(item)
  const sponsor = item?.sponsor || 'Shadow Mall'
  const destination = item?.link_url || '/shop'
  const domain = useMemo(
    () => getDestinationDomain(destination),
    [destination]
  )

  useEffect(() => {
    if (!open || !item) return

    setScreen('quick')
    setMessage('')
    setDragY(0)
    setInterested(
      hasKey(readArray(STORAGE_KEYS.interested), adKey)
    )
    setSaved(
      hasKey(readArray(STORAGE_KEYS.saved), adKey)
    )
    setNotificationsOn(
      hasKey(readArray(STORAGE_KEYS.notifications), adKey)
    )
  }, [adKey, item, open])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key !== 'Escape') return

      if (screen === 'quick') {
        onClose?.()
      } else {
        setMessage('')
        setScreen('quick')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open, screen])

  if (!open || !item) return null

  function closeSheet() {
    setDragY(0)
    onClose?.()
  }

  function startDrag(event) {
    dragRef.current = {
      active: true,
      startY: event.clientY,
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function moveDrag(event) {
    if (!dragRef.current.active) return

    setDragY(
      Math.max(0, event.clientY - dragRef.current.startY)
    )
  }

  function endDrag(event) {
    const shouldClose = dragY > 110
    dragRef.current.active = false

    if (
      event.currentTarget.hasPointerCapture?.(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (shouldClose) {
      closeSheet()
    } else {
      setDragY(0)
    }
  }

  function chooseInterested(nextInterested) {
    const items = readArray(STORAGE_KEYS.interested)

    writeArray(
      STORAGE_KEYS.interested,
      nextInterested
        ? addKey(items, adKey)
        : removeKey(items, adKey)
    )

    setInterested(nextInterested)

    if (nextInterested) {
      setMessage('More sponsored posts like this may appear.')
      return
    }

    hideShadowMallAdLocally(item)
    onHide?.(item)
    closeSheet()
  }

  function toggleSaved() {
    const items = readArray(STORAGE_KEYS.saved)
    const nextSaved = !hasKey(items, adKey)

    writeArray(
      STORAGE_KEYS.saved,
      nextSaved
        ? [...items, getAdSnapshot(item)]
        : removeKey(items, adKey)
    )

    setSaved(nextSaved)
    setMessage(
      nextSaved ? 'Ad saved.' : 'Ad removed from saved.'
    )
  }

  function hideAd() {
    hideShadowMallAdLocally(item)
    onHide?.(item)
    closeSheet()
  }

  function toggleNotifications() {
    const items = readArray(STORAGE_KEYS.notifications)
    const nextValue = !hasKey(items, adKey)

    writeArray(
      STORAGE_KEYS.notifications,
      nextValue
        ? addKey(items, adKey)
        : removeKey(items, adKey)
    )

    setNotificationsOn(nextValue)
    setMessage(
      nextValue
        ? `Notifications turned on for ${sponsor}.`
        : `Notifications turned off for ${sponsor}.`
    )
  }

  async function copyLink() {
    const value = String(destination || '/shop')

    try {
      await navigator.clipboard.writeText(value)
      setMessage('Link copied.')
    } catch {
      const input = document.createElement('textarea')
      input.value = value
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.focus()
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setMessage('Link copied.')
    }
  }

  function submitReport(reason) {
    const reports = readArray(STORAGE_KEYS.reports)

    writeArray(STORAGE_KEYS.reports, [
      ...reports,
      {
        key: adKey,
        ad_id: item?.id || null,
        sponsor,
        reason,
        created_at: new Date().toISOString(),
      },
    ])

    setMessage('Report saved for review.')
    window.setTimeout(closeSheet, 700)
  }

  function openScreen(nextScreen) {
    setMessage('')
    setScreen(nextScreen)
  }

  function renderHeader(title, subtitle) {
    return (
      <div className="mb-4 flex items-center gap-3 px-1">
        <button
          type="button"
          onClick={() => openScreen('quick')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:bg-gray-100"
          aria-label="Back"
        >
          <i className="fa-solid fa-chevron-left text-[16px]" />
        </button>

        <div className="min-w-0">
          <div className="truncate text-[17px] font-semibold text-[#111827]">
            {title}
          </div>
          <div className="mt-0.5 text-[11px] font-normal text-gray-400">
            {subtitle}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[210000] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close sponsored options"
        onClick={closeSheet}
        className="absolute inset-0 bg-black/45"
      />

      <section
        className="relative max-h-[90dvh] w-full max-w-[620px] overflow-y-auto rounded-t-[24px] bg-white px-3 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl transition-transform duration-150"
        style={{
          transform: `translateY(${dragY}px)`,
        }}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto mb-3 flex h-5 w-20 touch-none items-center justify-center"
          aria-label="Drag to close"
        >
          <span className="h-1 w-12 rounded-full bg-gray-400" />
        </button>

        {screen === 'quick' ? (
          <>
            <div className="mb-3 rounded-[16px] bg-[#f3f4f7]">
              <ActionButton
                icon="interested"
                title="Interested"
                subtitle="More sponsored posts like this"
                onClick={() => chooseInterested(true)}
                trailing={
                  interested ? (
                    <i className="fa-solid fa-check text-[14px] text-[#1677ff]" />
                  ) : null
                }
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="notInterested"
                title="Not interested"
                subtitle="Fewer sponsored posts like this"
                onClick={() => chooseInterested(false)}
              />
            </div>

            <div className="rounded-[16px] bg-[#f3f4f7]">
              <ActionButton
                icon={saved ? 'saved' : 'save'}
                title={saved ? 'Remove from saved' : 'Save ad'}
                subtitle="Keep this promotion for later"
                onClick={toggleSaved}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="hide"
                title="Hide ad"
                subtitle="Do not show this ad again"
                onClick={hideAd}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="report"
                title="Report ad"
                subtitle="Tell Shadow about a problem"
                onClick={() => openScreen('report')}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="why"
                title="Why am I seeing this ad?"
                onClick={() => openScreen('why')}
                trailing={
                  <i className="fa-solid fa-chevron-right text-[14px] text-gray-500" />
                }
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="about"
                title="About this advertiser"
                onClick={() => openScreen('about')}
                trailing={
                  <i className="fa-solid fa-chevron-right text-[14px] text-gray-500" />
                }
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon={notificationsOn ? 'notifyActive' : 'notify'}
                title={
                  notificationsOn
                    ? 'Turn off notifications'
                    : 'Turn on notifications'
                }
                subtitle={`Updates from ${sponsor}`}
                onClick={toggleNotifications}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="copy"
                title="Copy link"
                subtitle="Copy the promotion destination"
                onClick={copyLink}
              />
            </div>
          </>
        ) : null}

        {screen === 'why' ? (
          <>
            {renderHeader(
              'Why am I seeing this ad?',
              'How sponsored promotions appear on Shadow'
            )}

            <div className="rounded-[16px] bg-[#f3f4f7] p-4">
              <div className="text-[14px] font-semibold leading-5 text-[#111827]">
                This is a sponsored promotion from {sponsor}.
              </div>

              <div className="mt-3 text-[12px] font-normal leading-5 text-gray-500">
                Shadow may show active promotions based on their display order, availability, and your activity in Discover.
              </div>

              <div className="mt-3 text-[12px] font-normal leading-5 text-gray-500">
                Use Interested, Not interested, or Hide ad to adjust what appears in this browser.
              </div>
            </div>
          </>
        ) : null}

        {screen === 'about' ? (
          <>
            {renderHeader(
              'About this advertiser',
              'Sponsored by an advertiser on Shadow'
            )}

            <div className="rounded-[16px] bg-[#f3f4f7] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-semibold text-white">
                  {item.profile_image_url ? (
                    <img
                      src={item.profile_image_url}
                      alt={sponsor}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    sponsor.slice(0, 1).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-[#111827]">
                    {sponsor}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] font-normal text-gray-400">
                    Destination: {domain}
                  </div>
                </div>
              </div>

              {item.title ? (
                <div className="mt-4 text-[13px] font-semibold leading-5 text-[#111827]">
                  {item.title}
                </div>
              ) : null}

              {item.description ? (
                <div className="mt-2 text-[12px] font-normal leading-5 text-gray-500">
                  {item.description}
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        {screen === 'report' ? (
          <>
            {renderHeader(
              'Report this ad',
              'Choose the reason that best describes the problem'
            )}

            <div className="rounded-[16px] bg-[#f3f4f7]">
              <ActionButton
                icon="scam"
                title="Scam or misleading promotion"
                subtitle="Fraud, unsafe links, or false claims"
                onClick={() => submitReport('scam_or_misleading')}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="inappropriate"
                title="Inappropriate content"
                subtitle="Sexual, violent, or otherwise unsuitable"
                onClick={() => submitReport('inappropriate_content')}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="repeated"
                title="Repeated or annoying ad"
                subtitle="This promotion appears too often"
                onClick={() => submitReport('repeated_or_annoying')}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <ActionButton
                icon="other"
                title="Something else"
                subtitle="A different problem with this ad"
                onClick={() => submitReport('other')}
              />
            </div>
          </>
        ) : null}

        {message ? (
          <div className="mt-3 rounded-[12px] bg-[#eef2ff] px-3 py-2.5 text-center text-[11px] font-semibold leading-4 text-[#3730a3]">
            {message}
          </div>
        ) : null}
      </section>
    </div>
  )
}
