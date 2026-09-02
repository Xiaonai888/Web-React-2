import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function openEventLink(url, navigate) {
  const target = String(url || '').trim()

  if (!target) return

  if (/^https?:\/\//i.test(target)) {
    window.location.assign(target)
    return
  }

  navigate(target.startsWith('/') ? target : `/${target}`)
}

export default function ManagedEventsSection({ onCountChange }) {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadEvents() {
      try {
        const response = await fetch(
          `${API_URL}/api/events`,
          {
            signal: controller.signal,
          }
        )
        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              'Failed to load events'
          )
        }

        if (!ignore) {
          const list = Array.isArray(data.events)
            ? data.events
            : []

          setEvents(list)
          onCountChange?.(list.length)
        }
      } catch (error) {
        if (
          error?.name === 'AbortError' ||
          ignore
        ) {
          return
        }

        setEvents([])
        onCountChange?.(0)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [onCountChange])

  if (loading) {
    return (
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="aspect-square animate-pulse rounded-[20px] bg-[var(--shadow-bg-soft)]"
          />
        ))}
      </div>
    )
  }

  if (!events.length) return null

  return (
    <section className="mt-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {events.map((item) => {
          const hasLink = Boolean(
            String(item.button_url || '').trim()
          )

          return (
            <article
              key={item.id}
              role={hasLink ? 'button' : undefined}
              tabIndex={hasLink ? 0 : undefined}
              onClick={() => {
                if (hasLink) {
                  openEventLink(
                    item.button_url,
                    navigate
                  )
                }
              }}
              onKeyDown={(event) => {
                if (
                  hasLink &&
                  event.key === 'Enter'
                ) {
                  openEventLink(
                    item.button_url,
                    navigate
                  )
                }
              }}
              className={`group relative aspect-square overflow-hidden rounded-[20px] bg-[var(--shadow-bg-soft)] shadow-sm ring-1 ring-black/5 ${
                hasLink
                  ? 'cursor-pointer active:scale-[0.98]'
                  : ''
              }`}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title || 'Event'}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/80" />

              <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                {item.badge_text ? (
                  <div className="mb-1.5 inline-flex rounded-full bg-white/20 px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em] backdrop-blur-sm">
                    {item.badge_text}
                  </div>
                ) : null}

                <h3 className="line-clamp-2 text-[14px] font-black leading-[1.2]">
                  {item.title || 'Event'}
                </h3>

                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-[9px] font-semibold leading-[1.45] text-white/80">
                    {item.description}
                  </p>
                ) : null}

                {item.button_text && hasLink ? (
                  <div className="mt-2 inline-flex min-h-[28px] items-center rounded-full bg-white px-3 text-[9px] font-black text-[#111827]">
                    {item.button_text}
                  </div>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
