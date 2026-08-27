import { NavLink } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'

function StoriesIcon({ active }) {
  return (
    <img
      src={
        active
          ? '/assets/Icons/Stories-active.svg'
          : '/assets/Icons/Stories.svg'
      }
      alt=""
      className={`h-[21px] w-[21px] object-contain ${
        active ? '' : 'dark:brightness-0 dark:invert'
      }`}
    />
  )
}

function MangaIcon({ active }) {
  return (
    <img
      src={active ? '/assets/Icons/Manga-active.svg' : '/assets/Icons/Manga.svg'}
      alt=""
      className={`my-[1px] h-[19px] w-[19px] object-contain ${
        active ? '' : 'dark:brightness-0 dark:invert'
      }`}
    />
  )
}

function CompassIcon({ active }) {
  const stroke = active ? 'var(--shadow-accent-text)' : 'currentColor'

  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={active ? 'var(--shadow-accent)' : 'none'}
        stroke={stroke}
        strokeWidth="1.9"
      />
      <path
        d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1Z"
        fill={active ? 'var(--shadow-accent-text)' : 'none'}
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SmileIcon({ active }) {
  const stroke = active ? 'var(--shadow-accent-text)' : 'currentColor'
  const face = active ? 'var(--shadow-accent-text)' : 'currentColor'

  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={active ? 'var(--shadow-accent)' : 'none'}
        stroke={stroke}
        strokeWidth="1.9"
      />
      <circle cx="9" cy="10" r="1" fill={face} />
      <circle cx="15" cy="10" r="1" fill={face} />
      <path
        d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2"
        fill="none"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChatStoryIcon({ active }) {
  return (
    <span className="relative flex h-[21px] w-[21px] items-center justify-center">
      {active ? (
        <i
          className="fa-solid fa-comments absolute scale-[0.82] text-[17px]"
          style={{ color: 'var(--shadow-accent)' }}
        />
      ) : null}
      <i
        className="fa-regular fa-comments relative z-10 text-[17px]"
        style={{
          color: active
            ? 'var(--shadow-accent-text)'
            : 'var(--shadow-icon)',
        }}
      />
    </span>
  )
}

const NAV = [
  { to: '/', labelKey: 'navStories', Icon: StoriesIcon },
  { to: '/manga', labelKey: 'navManga', Icon: MangaIcon },
  { to: '/chat-story', labelKey: 'navChatStory', Icon: ChatStoryIcon },
  { to: '/discover', labelKey: 'navDiscover', Icon: CompassIcon },
  { to: '/me', labelKey: 'navMine', Icon: SmileIcon },
]

export default function Footer() {
  const { t } = useDisplayTranslation()

  return (
    <footer
      className="app-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--shadow-nav-bg)',
        borderTop: '1px solid var(--shadow-border)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        zIndex: 99999,
        paddingTop: '4px',
        paddingBottom: 'calc(4px + env(safe-area-inset-bottom, 0px))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'transform 0.2s ease-out, background-color 0.2s ease, border-color 0.2s ease',
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
        {NAV.map(({ to, labelKey, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={() => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              minHeight: '40px',
              textDecoration: 'none',
              gap: '2px',
              color: 'var(--shadow-icon)',
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
                    color: 'var(--shadow-text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </footer>
  )
}
