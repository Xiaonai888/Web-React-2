import { useEffect, useState } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function Author49DayDashboardCard({ onStartWriting }) {
  const [event, setEvent] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadEvent() {
      const token = getAuthToken()
      if (!token) return

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

        if (!response.ok || data.ok === false) {
          throw new Error('Failed')
        }

        if (!ignore) {
          setEvent(data.event || null)
        }
      } catch {
        if (!ignore) {
          setEvent(null)
        }
      }
    }

    loadEvent()

    const refreshId = window.setInterval(
      loadEvent,
      60000
    )

    return () => {
      ignore = true
      window.clearInterval(refreshId)
    }
  }, [])

  if (
    !event ||
    !event.visible ||
    !event.enabled ||
    event.status === 'finished'
  ) {
    return null
  }

  return (
    <section className="mt-5 overflow-hidden rounded-[16px] border border-[#F2C230] bg-black shadow-[0_10px_26px_rgba(216,164,0,0.12)]">
      <div className="relative min-h-[126px] w-full overflow-hidden">
        <img
          src="/assets/Icons/Event/Event 2.webp"
          alt="80% for 49 Days Event"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-3 pb-3 pt-10">
          <button
            type="button"
            onClick={onStartWriting}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[11px] border-2 border-black bg-[#FFC400] text-[11px] font-black text-black shadow-[0_3px_0_#111111] transition active:translate-y-[2px] active:shadow-[0_1px_0_#111111]"
          >
            <i className="fa-solid fa-pen-nib text-[9px]" />
            Start Writing
          </button>
        </div>
      </div>
    </section>
  )
}
