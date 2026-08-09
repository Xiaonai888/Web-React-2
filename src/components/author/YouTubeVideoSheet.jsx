import { useEffect } from 'react'

function isValidYouTubeUrl(value) {
  const input = String(value || '').trim()
  if (!input) return false

  const source = /^https?:\/\//i.test(input) ? input : `https://${input}`

  try {
    const url = new URL(source)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')

    if (host === 'youtu.be') {
      return /^[A-Za-z0-9_-]{11}$/.test(
        url.pathname.split('/').filter(Boolean)[0] || ''
      )
    }

    if (!['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      return false
    }

    if (url.pathname === '/watch') {
      return /^[A-Za-z0-9_-]{11}$/.test(url.searchParams.get('v') || '')
    }

    const parts = url.pathname.split('/').filter(Boolean)

    return (
      ['shorts', 'live', 'embed'].includes(parts[0]) &&
      /^[A-Za-z0-9_-]{11}$/.test(parts[1] || '')
    )
  } catch {
    return false
  }
}

export default function YouTubeVideoSheet({
  open,
  value,
  onChange,
  onClose,
  onSave,
  onRemove,
  hasVideo = false,
}) {
  useEffect(() => {
    if (!open) return undefined

    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [open])

  if (!open) return null

  const title = String(value?.title || '')
  const url = String(value?.url || '')
  const canSave = isValidYouTubeUrl(url) && title.length <= 120

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end justify-center bg-black/35 sm:px-4"
      onClick={onClose}
    >
      <div className="w-full sm:max-w-5xl">
        <div
          className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[18px] bg-white px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:max-h-[82dvh] sm:rounded-[12px] sm:px-5 sm:pb-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95"
              aria-label="Close YouTube video"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>

            <h2 className="min-w-0 flex-1 truncate text-center text-[14px] font-bold text-[#111827]">
              YouTube Video
            </h2>

            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className="h-8 shrink-0 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white active:scale-95 disabled:bg-[#d0d5dd]"
            >
              Save
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-[13px] font-semibold text-[#111827]">
                Title
              </label>
              <span className="text-[11px] text-[#8d94a1]">Optional</span>
            </div>

            <input
              value={title}
              onChange={(event) =>
                onChange({
                  ...value,
                  title: event.target.value,
                })
              }
              maxLength={120}
              placeholder="Song title or note"
              className="h-12 w-full rounded-[10px] bg-[#f7f7fa] px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#a5aab4]"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[13px] font-semibold text-[#111827]">
              YouTube Link <span className="text-[#e5484d]">*</span>
            </label>

            <input
              value={url}
              onChange={(event) =>
                onChange({
                  ...value,
                  url: event.target.value,
                })
              }
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="https://www.youtube.com/watch?v=..."
              className="h-12 w-full rounded-[10px] bg-[#f7f7fa] px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#a5aab4]"
            />

            {url.trim() && !isValidYouTubeUrl(url) ? (
              <div className="mt-2 text-[11px] text-[#d92d20]">
                Please enter a valid YouTube video link.
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#f7f7fa] px-3 py-3">
            <img
              src="/assets/Icons/Hint.svg"
              alt=""
              className="mt-0.5 h-[16px] w-[16px] shrink-0 object-contain"
            />
            <p className="text-[11.5px] leading-5 text-[#667085]">
              Adding a YouTube video can use more data and may make the reading experience heavier. Add one only when it supports the episode.
            </p>
          </div>

          {hasVideo ? (
            <button
              type="button"
              onClick={onRemove}
              className="mt-4 h-11 w-full rounded-full bg-[#fff1f1] text-[12px] font-semibold text-[#d92d20] active:scale-[0.99]"
            >
              Remove YouTube Video
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
