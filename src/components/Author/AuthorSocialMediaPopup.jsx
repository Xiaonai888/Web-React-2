import { useEffect, useMemo, useRef, useState } from 'react'

const PLATFORM_META = {
  facebook: { label: 'Facebook', icon: 'fa-brands fa-facebook-f' },
  instagram: { label: 'Instagram', icon: 'fa-brands fa-instagram' },
  tiktok: { label: 'TikTok', icon: 'fa-brands fa-tiktok' },
  youtube: { label: 'YouTube', icon: 'fa-brands fa-youtube' },
  threads: { label: 'Threads', icon: 'fa-solid fa-at' },
  x: { label: 'X', icon: 'fa-brands fa-x-twitter' },
  snapchat: { label: 'Snapchat', icon: 'fa-brands fa-snapchat' },
  twitch: { label: 'Twitch', icon: 'fa-brands fa-twitch' },
  line: { label: 'LINE', icon: 'fa-brands fa-line' },
  wechat: { label: 'WeChat', icon: 'fa-brands fa-weixin' },
  kik: { label: 'Kik', icon: 'fa-solid fa-comment-dots' },
  pinterest: { label: 'Pinterest', icon: 'fa-brands fa-pinterest-p' },
  tumblr: { label: 'Tumblr', icon: 'fa-brands fa-tumblr' },
  soundcloud: { label: 'SoundCloud', icon: 'fa-brands fa-soundcloud' },
}

function detectPlatform(url = '') {
  const value = String(url).toLowerCase()

  if (value.includes('facebook.com') || value.includes('fb.com')) return 'facebook'
  if (value.includes('instagram.com')) return 'instagram'
  if (value.includes('tiktok.com')) return 'tiktok'
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube'
  if (value.includes('threads.net')) return 'threads'
  if (value.includes('x.com') || value.includes('twitter.com')) return 'x'
  if (value.includes('snapchat.com')) return 'snapchat'
  if (value.includes('twitch.tv')) return 'twitch'
  if (value.includes('line.me')) return 'line'
  if (value.includes('wechat.com') || value.includes('weixin.qq.com')) return 'wechat'
  if (value.includes('kik.me')) return 'kik'
  if (value.includes('pinterest.com') || value.includes('pin.it')) return 'pinterest'
  if (value.includes('tumblr.com')) return 'tumblr'
  if (value.includes('soundcloud.com')) return 'soundcloud'

  return 'facebook'
}

function getPlatformMeta(platform) {
  return PLATFORM_META[platform] || {
    label: 'Social media',
    icon: 'fa-solid fa-at',
  }
}

function normalizeUrl(url = '') {
  const value = String(url).trim()

  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value

  return `https://${value}`
}

function getNameFromUrl(url = '', platform = '') {
  const raw = String(url).trim()

  if (!raw) return ''

  try {
    const parsed = new URL(normalizeUrl(raw))
    const parts = parsed.pathname.split('/').filter(Boolean)

    if (!parts.length) return ''

    if (platform === 'facebook' && ['share', 'sharer', 'dialog'].includes(parts[0]?.toLowerCase())) {
      return ''
    }

    if (platform === 'youtube' && parts[0]?.toLowerCase() === 'channel') {
      return ''
    }

    const candidate = parts[parts.length - 1]
      .replace(/^@/, '')
      .replace(/[?#].*$/, '')
      .trim()

    if (!candidate || candidate.length > 60) return ''

    return candidate
  } catch {
    return ''
  }
}

function makeDisplayName(item, platform) {
  const meta = getPlatformMeta(platform)
  const savedName = String(item?.display_name || '').trim()
  const value = String(item?.value || '').trim()
  const url = String(item?.url || '').trim()

  if (savedName && !/^https?:\/\//i.test(savedName)) {
    return savedName.replace(/^@/, '')
  }

  if (value && !/^https?:\/\//i.test(value)) {
    return value.replace(/^@/, '')
  }

  return getNameFromUrl(url || value || savedName, platform) || meta.label
}

function normalizeLinks(value) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const url = String(item.url || '').trim()
      const platform = String(item.platform || detectPlatform(url || item.value || '')).toLowerCase()

      return {
        id: String(item.id || `social-${index}`),
        platform,
        url: normalizeUrl(url || item.value || ''),
        displayName: makeDisplayName(item, platform),
      }
    })
    .filter((item) => item.url)
}

function normalizeLegacyLinks(value) {
  const urls = String(value || '').match(/https?:\/\/[^\s]+/gi) || []

  return urls.map((url, index) => {
    const platform = detectPlatform(url)

    return {
      id: `legacy-social-${index}`,
      platform,
      url,
      displayName: getNameFromUrl(url, platform) || getPlatformMeta(platform).label,
    }
  })
}

export default function AuthorSocialMediaPopup({
  open,
  links = [],
  legacyValue = '',
  isOwner = false,
  onClose,
  onEdit,
}) {
  const dragStartRef = useRef(null)
  const dragCurrentRef = useRef(0)
  const [dragY, setDragY] = useState(0)

  const items = useMemo(() => {
    const current = normalizeLinks(links)
    return current.length ? current : normalizeLegacyLinks(legacyValue)
  }, [links, legacyValue])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const handlePointerDown = (event) => {
    dragStartRef.current = event.clientY
    dragCurrentRef.current = 0
  }

  const handlePointerMove = (event) => {
    if (dragStartRef.current === null) return

    const delta = Math.max(0, event.clientY - dragStartRef.current)
    dragCurrentRef.current = delta
    setDragY(delta)
  }

  const handlePointerEnd = () => {
    if (dragStartRef.current === null) return

    const delta = dragCurrentRef.current
    dragStartRef.current = null
    dragCurrentRef.current = 0

    if (delta > 90) {
      onClose?.()
      return
    }

    setDragY(0)
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/30">
      <button
        type="button"
        aria-label="Close social media"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section
        className="relative z-10 w-full max-w-[520px] rounded-t-[28px] bg-[#e9eaed] px-3 pb-[max(14px,env(safe-area-inset-bottom))] pt-2 shadow-2xl dark:bg-[#18191c]"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragStartRef.current === null ? 'transform 180ms ease' : 'none',
        }}
      >
        <button
          type="button"
          onPointerDown={handlePointerDown}
          className="flex w-full touch-none justify-center pb-3 pt-1"
          aria-label="Drag down to close"
        >
          <span className="h-1.5 w-12 rounded-full bg-[#8a8d91]" />
        </button>

        <div className="overflow-hidden rounded-[20px] bg-white px-4 pb-2 pt-4 dark:bg-[#242526]">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <h2 className="text-[18px] font-semibold text-[#111318] dark:text-white">
              Social media
            </h2>

            {isOwner ? (
              <button
                type="button"
                onClick={onEdit}
                className="shrink-0 text-[16px] font-normal text-[#1877f2] active:opacity-60"
              >
                Edit
              </button>
            ) : null}
          </div>

          <div className="max-h-[62dvh] overflow-y-auto pb-2">
            {items.length ? (
              <div>
                {items.map((item) => {
                  const meta = getPlatformMeta(item.platform)

                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[68px] items-center gap-4 rounded-[14px] px-1 py-2 text-left active:bg-[#f0f2f5] dark:active:bg-[#3a3b3c]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[27px] text-[#111318] dark:text-white">
                        <i className={meta.icon} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-[16px] font-normal leading-5 text-[#111318] dark:text-white">
                          {item.displayName}
                        </span>
                        <span className="mt-1 block text-[14px] font-normal text-[#65676b] dark:text-[#b0b3b8]">
                          {meta.label}
                        </span>
                      </span>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="px-6 py-10 text-center text-[14px] font-normal text-[#65676b] dark:text-[#b0b3b8]">
                No social media links yet
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
