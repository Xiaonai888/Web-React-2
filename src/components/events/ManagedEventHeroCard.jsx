import { useNavigate } from 'react-router-dom'

function openEventLink(url, navigate) {
  const target = String(url || '').trim()

  if (!target) return

  if (/^https?:\/\//i.test(target)) {
    window.location.assign(target)
    return
  }

  navigate(target.startsWith('/') ? target : `/${target}`)
}

export default function ManagedEventHeroCard({ event }) {
  const navigate = useNavigate()

  if (!event) return null

  const hasLink = Boolean(
    String(event.button_url || '').trim()
  )

  const open = () => {
    if (hasLink) {
      openEventLink(event.button_url, navigate)
    }
  }

  return (
    <article
      role={hasLink ? 'button' : undefined}
      tabIndex={hasLink ? 0 : undefined}
      onClick={open}
      onKeyDown={(keyboardEvent) => {
        if (
          hasLink &&
          (keyboardEvent.key === 'Enter' ||
            keyboardEvent.key === ' ')
        ) {
          keyboardEvent.preventDefault()
          open()
        }
      }}
      className={`group relative mt-4 aspect-square w-full overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] shadow-[0_16px_38px_rgba(31,24,55,0.12)] ${
        hasLink
          ? 'cursor-pointer transition active:scale-[0.99]'
          : ''
      }`}
    >
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={event.title || 'Event'}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/80" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
        {event.badge_text ? (
          <div className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] backdrop-blur-md">
            {event.badge_text}
          </div>
        ) : null}

        <h2 className="line-clamp-2 text-[24px] font-black leading-[1.12] tracking-[-0.02em]">
          {event.title || 'Event'}
        </h2>

        {event.description ? (
          <p className="mt-2 line-clamp-3 max-w-[92%] text-[12px] font-semibold leading-5 text-white/85">
            {event.description}
          </p>
        ) : null}

        {event.button_text && hasLink ? (
          <div className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full bg-white px-5 text-[12px] font-black text-[#111827] shadow-lg">
            {event.button_text}
          </div>
        ) : null}
      </div>
    </article>
  )
}
