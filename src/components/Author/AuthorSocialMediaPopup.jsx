import { useEffect, useMemo } from 'react'

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
  const items = useMemo(() => {
    const current = normalizeLinks(links)
    return current.length ? current : normalizeLegacyLinks(legacyValue)
  }, [links, legacyValue])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

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

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/55 sm:items-center sm:px-4">
      <button
        type="button"
        aria-label="Close social media"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:rounded-[16px] dark:bg-[#242526]">
        <header className="relative flex min-h-[58px] items-center justify-center border-b border-black/10 px-14 dark:border-white/10">
          <h2 className="text-[18px] font-bold text-[#111318] dark:text-white">
            Social media
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb] text-[#111318] active:scale-95 dark:bg-[#3a3b3c] dark:text-white"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[19px]" />
          </button>

          {isOwner ? (
            <button
              type="button"
              onClick={onEdit}
              className="absolute right-4 text-[15px] font-semibold text-[#1877f2] active:opacity-60"
            >
              Edit
            </button>
          ) : null}
        </header>

        <div className="max-h-[70dvh] overflow-y-auto px-4 py-3">
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
                    className="flex min-h-[70px] items-center gap-4 rounded-[12px] px-2 py-2 text-left active:bg-[#f0f2f5] dark:active:bg-[#3a3b3c]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[27px] text-[#111318] dark:text-white">
                      <i className={meta.icon} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-semibold text-[#111318] dark:text-white">
                        {item.displayName}
                      </span>
                      <span className="mt-0.5 block text-[14px] text-[#65676b] dark:text-[#b0b3b8]">
                        {meta.label}
                      </span>
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#65676b] dark:text-[#b0b3b8]">
                      <i className="fa-solid fa-arrow-up-right-from-square text-[14px]" />
                    </span>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f2f5] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]">
                <i className="fa-solid fa-at text-[22px]" />
              </div>
              <p className="mt-4 text-[15px] text-[#65676b] dark:text-[#b0b3b8]">
                No social media links yet
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
