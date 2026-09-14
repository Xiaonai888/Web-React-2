import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorManagedEventsSection', {
  en: { events: 'Events', currentEvents: 'Current Shadow events', auto5s: 'Auto 5s', eventFallback: 'Event' },
  km: { events: 'ព្រឹត្តិការណ៍', currentEvents: 'ព្រឹត្តិការណ៍ Shadow បច្ចុប្បន្ន', auto5s: 'ស្វ័យប្រវត្តិ 5 វិនាទី', eventFallback: 'ព្រឹត្តិការណ៍' },
  zh: { events: '活动', currentEvents: '当前 Shadow 活动', auto5s: '自动 5 秒', eventFallback: '活动' },
  ja: { events: 'イベント', currentEvents: '現在の Shadow イベント', auto5s: '自動 5秒', eventFallback: 'イベント' },
  ko: { events: '이벤트', currentEvents: '현재 Shadow 이벤트', auto5s: '자동 5초', eventFallback: '이벤트' },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function openEventLink(url, navigate) {
  const target = String(url || '').trim()

  if (!target) return

  if (/^https?:\/\//i.test(target)) {
    window.location.assign(target)
    return
  }

  navigate(
    target.startsWith('/')
      ? target
      : `/${target}`
  )
}

export default function AuthorManagedEventsSection() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [events, setEvents] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadEvents() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/events`,
          {
            signal: controller.signal,
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error('Failed to load events')
        }

        if (ignore) return

        const nextEvents = Array.isArray(data.events)
          ? data.events
          : []

        setEvents(nextEvents)
        setSelectedId((current) =>
          nextEvents.some(
            (event) => String(event.id) === String(current)
          )
            ? current
            : String(nextEvents[0]?.id || '')
        )
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          !ignore
        ) {
          setEvents([])
          setSelectedId('')
        }
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
  }, [])

  const selectedEvent = useMemo(
    () =>
      events.find(
        (event) =>
          String(event.id) === String(selectedId)
      ) || events[0] || null,
    [events, selectedId]
  )

  useEffect(() => {
    if (
      events.length <= 1 ||
      !selectedEvent
    ) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      const currentIndex = events.findIndex(
        (event) =>
          String(event.id) === String(selectedEvent.id)
      )
      const nextIndex =
        currentIndex < 0
          ? 0
          : (currentIndex + 1) % events.length

      setSelectedId(String(events[nextIndex].id))
    }, 5000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [events, selectedEvent])

  if (loading || !selectedEvent) {
    return null
  }

  const displayImage =
    selectedEvent.banner_url ||
    selectedEvent.image_url ||
    ''

  const hasLink = Boolean(
    String(selectedEvent.button_url || '').trim()
  )

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">
            {t('authorManagedEventsSection.events')}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-[var(--shadow-text-secondary)]">
            {t('authorManagedEventsSection.currentEvents')}
          </p>
        </div>

        {events.length > 1 ? (
          <span className="text-[10px] font-bold text-[var(--shadow-text-tertiary)]">
            {t('authorManagedEventsSection.auto5s')}
          </span>
        ) : null}
      </div>

      <article
        role={hasLink ? 'button' : undefined}
        tabIndex={hasLink ? 0 : undefined}
        onClick={() =>
          hasLink
            ? openEventLink(
                selectedEvent.button_url,
                navigate
              )
            : undefined
        }
        onKeyDown={(event) => {
          if (
            hasLink &&
            (event.key === 'Enter' ||
              event.key === ' ')
          ) {
            event.preventDefault()
            openEventLink(
              selectedEvent.button_url,
              navigate
            )
          }
        }}
        className={`relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] shadow-[0_10px_26px_rgba(31,24,55,0.10)] ${
          hasLink
            ? 'cursor-pointer transition active:scale-[0.99]'
            : ''
        }`}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={selectedEvent.title || t('authorManagedEventsSection.eventFallback')}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#8050e8]">
            <i className="fa-regular fa-calendar-days text-[28px]" />
          </div>
        )}
      </article>

      {events.length > 1 ? (
        <div className="-mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {events.map((event) => {
            const active =
              String(event.id) === String(selectedEvent.id)
            const thumbImage =
              event.banner_url ||
              event.image_url ||
              ''

            return (
              <button
                key={event.id}
                type="button"
                onClick={() =>
                  setSelectedId(String(event.id))
                }
                className={`flex min-h-[68px] w-[220px] shrink-0 items-center gap-3 rounded-[14px] border px-2.5 py-2 text-left transition active:scale-[0.99] ${
                  active
                    ? 'border-[#8050e8] bg-[#8050e8]/10 shadow-[0_8px_20px_rgba(109,66,219,0.12)]'
                    : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)]'
                }`}
              >
                <div className="h-[50px] w-[76px] shrink-0 overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)]">
                  {thumbImage ? (
                    <img
                      src={thumbImage}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#7c4dea]">
                      <i className="fa-regular fa-calendar-days text-[17px]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {event.badge_text ? (
                    <div className="line-clamp-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#8050e8]">
                      {event.badge_text}
                    </div>
                  ) : null}

                  <div className="mt-0.5 line-clamp-2 text-[11.5px] font-extrabold leading-4 text-[var(--shadow-text-primary)]">
                    {event.title || t('authorManagedEventsSection.eventFallback')}
                  </div>
                </div>

                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    active
                      ? 'bg-[#8050e8]'
                      : 'bg-[var(--shadow-border-strong)]'
                  }`}
                />
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
