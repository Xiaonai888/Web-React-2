import { NavLink } from 'react-router-dom'

function StoriesIcon({ active }) {
  return (
    <img
      src={
        active
          ? '/assets/Icons/Stories-active.svg'
          : '/assets/Icons/Stories.svg'
      }
      alt=""
      className="h-[21px] w-[21px] object-contain"
    />
  )
}

function MangaIcon({ active }) {
  return (
    <img
      src={active ? '/assets/Icons/Manga-active.svg' : '/assets/Icons/Manga.svg'}
      alt=""
      className="my-[1px] h-[19px] w-[19px] object-contain"
    />
  )
}

function PlayIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={active ? '#F6C800' : 'none'}
        stroke="#111827"
        strokeWidth="1.9"
      />
      <path
        d="m10 8 6 4-6 4V8Z"
        fill={active ? '#111827' : 'none'}
        stroke="#111827"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CompassIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={active ? '#F6C800' : 'none'}
        stroke="#111827"
        strokeWidth="1.9"
      />
      <path
        d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1Z"
        fill={active ? '#111827' : 'none'}
        stroke="#111827"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <g
        fill={active ? '#F6C800' : 'none'}
        stroke="#111827"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 18V6.5c0-.55.45-1 1-1h3V18Z" />
        <path d="M8.5 18V4.5c0-.55.45-1 1-1h3c.55 0 1 .45 1 1V18Z" />
        <path d="M13.5 7.2 17 6.3c.54-.14 1.08.19 1.21.73L20.8 17.1c.14.54-.19 1.08-.73 1.21l-3.47.89-3.1-12Z" />
        <path d="M3 18.5h18v2H3z" />
      </g>

      <g
        fill="none"
        stroke="#111827"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <path d="M10 7h2" />
        <path d="M15.5 10.4 18.2 9.7" />
      </g>
    </svg>
  )
}


function SmileIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={active ? '#F6C800' : 'none'}
        stroke="#111827"
        strokeWidth="1.9"
      />
      <circle cx="9" cy="10" r="1" fill="#111827" />
      <circle cx="15" cy="10" r="1" fill="#111827" />
      <path
        d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2"
        fill="none"
        stroke="#111827"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChatStoryIcon({ active }) {
  return (
    <span className="relative flex h-[21px] w-[21px] items-center justify-center">
      {active && <i className="fa-solid fa-comments absolute scale-[0.82] text-[17px] text-[#F6C800]" />}
      <i className="fa-regular fa-comments relative z-10 text-[17px] text-[#111827]" />
    </span>
  )
}

const NAV = [
  { to: '/', label: 'Stories', Icon: StoriesIcon },
  { to: '/manga', label: 'Manga', Icon: MangaIcon },
  { to: '/chat-story', label: 'Chat Story', Icon: ChatStoryIcon },
  { to: '/discover', label: 'Discover', Icon: CompassIcon },
  { to: '/me', label: 'Mine', Icon: SmileIcon },
]

export default function Footer() {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.98)',
        borderTop: '1px solid #eeeeee',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
        zIndex: 99999,
        paddingTop: '4px',
        paddingBottom: 'calc(4px + env(safe-area-inset-bottom, 0px))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'transform 0.2s ease-out',
        willChange: 'transform',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 8px',
        }}
      >
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              minHeight: '40px',
              textDecoration: 'none',
              gap: '2px',
              color: '#111827',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />

                <span
                  style={{
                    fontSize: '10px',
                    lineHeight: 1.15,
                    fontWeight: isActive ? 500 : 400,
                    color: '#111827',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </footer>
  )
}
