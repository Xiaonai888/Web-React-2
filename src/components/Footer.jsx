import { NavLink } from 'react-router-dom'

function StoriesIcon() {
  return (
    <img
      src="/assets/Icons/Stories.svg"
      alt=""
      className="h-[21px] w-[21px] object-contain"
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
      <path
        d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v12H7a2 2 0 0 1-2-2V4.5Z"
        fill={active ? '#F6C800' : 'none'}
        stroke="#111827"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M7 19a2 2 0 0 1 0-4h11"
        fill="none"
        stroke="#111827"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
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
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <path
        d="M4 5.5h11a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H9l-4 3v-3.5a3 3 0 0 1-1-2.2V5.5Z"
        fill={active ? '#F6C800' : 'none'}
        stroke="#111827"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="10.5" r="1" fill="#111827" />
      <circle cx="11" cy="10.5" r="1" fill="#111827" />
      <circle cx="14" cy="10.5" r="1" fill="#111827" />
    </svg>
  )
}

const NAV = [
  { to: '/', label: 'Stories', Icon: StoriesIcon },
  { to: '/chat-story', label: 'Chat Story', Icon: ChatStoryIcon },
  { to: '/discover', label: 'Discover', Icon: CompassIcon },
  { to: '/library', label: 'Library', Icon: BookIcon },
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
