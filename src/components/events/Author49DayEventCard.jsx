import { useEffect, useState } from 'react'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function Author49DayEventCard({
  onStartWriting,
  startWritingLoading = false,
}) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadEvent() {
      const token = getReaderToken()

      if (!token) {
        if (!ignore) {
          setEvent({
            visible: true,
            enabled: true,
            status: 'not_started',
          })
          setLoading(false)
        }
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/49-day-event`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error(
            data.message ||
              'Failed to load event'
          )
        }

        if (!ignore) {
          setEvent(data.event || null)
        }
      } catch {
        if (!ignore) {
          setEvent(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadEvent()

    const refreshTimer = window.setInterval(
      loadEvent,
      60000
    )

    return () => {
      ignore = true
      window.clearInterval(refreshTimer)
    }
  }, [])

  if (loading) {
    return (
      <div className="mt-4 aspect-square w-full animate-pulse rounded-[24px] bg-[#FFF5D8]" />
    )
  }

  if (
    !event ||
    !event.visible ||
    !event.enabled ||
    event.status === 'finished'
  ) {
    return null
  }

  return (
    <section className="mt-4 overflow-hidden rounded-[24px] border border-[#F2B705] bg-black shadow-[0_16px_38px_rgba(246,184,0,0.16)]">
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src="/assets/Icons/Event/Event 2.webp"
          alt="80% for 49 Days Event"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-4 pb-4 pt-16">
          <button
            type="button"
            onClick={onStartWriting}
            disabled={startWritingLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border-2 border-black bg-[#FFC400] text-[14px] font-black text-black shadow-[0_5px_0_#111111] transition active:translate-y-[3px] active:shadow-[0_2px_0_#111111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className="fa-solid fa-pen-nib text-[13px]" />
            {startWritingLoading
              ? 'Opening...'
              : 'Start Writing'}
          </button>
        </div>
      </div>
    </section>
  )
}
