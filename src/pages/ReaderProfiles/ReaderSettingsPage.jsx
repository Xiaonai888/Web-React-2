import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SETTINGS_GROUPS = [
  {
    title: 'Your account',
    items: [
      {
        key: 'edit-profile',
        title: 'Edit profile',
        subtitle: 'Update your name, photo, bio, and profile links.',
        icon: 'fa-regular fa-user',
        route: '/profile/edit',
      },
      {
        key: 'account-security',
        title: 'Account & security',
        subtitle: 'Password, email, and account access.',
        icon: 'fa-solid fa-shield-halved',
      },
      {
        key: 'privacy',
        title: 'Privacy',
        subtitle: 'Control who can see your reader space.',
        icon: 'fa-solid fa-lock',
      },
      {
        key: 'blocked-readers',
        title: 'Blocked readers',
        subtitle: 'Review readers you have blocked.',
        icon: 'fa-solid fa-ban',
      },
    ],
  },
  {
    title: 'Your activity',
    items: [
      {
        key: 'saved-posts',
        title: 'Saved posts',
        subtitle: 'View posts you saved for later.',
        icon: 'fa-regular fa-bookmark',
        route: '/saved-posts',
      },
      {
        key: 'my-comments',
        title: 'My comments',
        subtitle: 'Review your comments and replies.',
        icon: 'fa-regular fa-comment',
        route: '/comments',
      },
      {
        key: 'notifications',
        title: 'Notifications',
        subtitle: 'See updates from readers, authors, and stories.',
        icon: 'fa-regular fa-bell',
        route: '/notifications',
      },
      {
        key: 'reading-history',
        title: 'Reading history',
        subtitle: 'Find stories and episodes you viewed.',
        icon: 'fa-solid fa-clock-rotate-left',
      },
      {
        key: 'echo-sharing',
        title: 'Echo and sharing',
        subtitle: 'Manage echoed posts and sharing activity.',
        icon: 'fa-solid fa-arrows-rotate',
      },
    ],
  },
  {
    title: 'How readers interact with you',
    items: [
      {
        key: 'messages-replies',
        title: 'Messages and replies',
        subtitle: 'Control who can contact and reply to you.',
        icon: 'fa-regular fa-message',
      },
      {
        key: 'tags-mentions',
        title: 'Tags and mentions',
        subtitle: 'Choose who can tag or mention you.',
        icon: 'fa-solid fa-at',
      },
      {
        key: 'comment-settings',
        title: 'Comment settings',
        subtitle: 'Manage comments on your reader posts.',
        icon: 'fa-regular fa-comments',
      },
      {
        key: 'hidden-words',
        title: 'Hidden words',
        subtitle: 'Hide words and phrases you do not want to see.',
        icon: 'fa-solid fa-eye-slash',
      },
      {
        key: 'restricted-readers',
        title: 'Restricted readers',
        subtitle: 'Review readers with limited interaction.',
        icon: 'fa-solid fa-user-shield',
      },
    ],
  },
  {
    title: 'App and support',
    items: [
      {
        key: 'language',
        title: 'Language',
        subtitle: 'Choose your app and reading language.',
        icon: 'fa-solid fa-language',
      },
      {
        key: 'accessibility',
        title: 'Accessibility',
        subtitle: 'Adjust reading and display assistance.',
        icon: 'fa-solid fa-universal-access',
      },
      {
        key: 'help-center',
        title: 'Help Center',
        subtitle: 'Find answers and guides for using Shadow.',
        icon: 'fa-regular fa-circle-question',
        route: '/help',
      },
      {
        key: 'feedback-support',
        title: 'Feedback & Support',
        subtitle: 'Send feedback or request help.',
        icon: 'fa-regular fa-paper-plane',
        route: '/feedback',
      },
      {
        key: 'about-shadow',
        title: 'About Shadow',
        subtitle: 'Learn more about Shadow and its purpose.',
        icon: 'fa-solid fa-circle-info',
        route: '/about',
      },
    ],
  },
]

function clearReaderSession() {
  localStorage.removeItem('shadow_reader_token')
  localStorage.removeItem('shadow_reader_user')
  sessionStorage.removeItem('shadow_reader_token')
  sessionStorage.removeItem('shadow_reader_user')
}

function ReaderSettingsIcon({ name }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-[21px] w-[21px]',
    'aria-hidden': true,
  }

  switch (name) {
    case 'edit-profile':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="7" r="4" />
          <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
        </svg>
      )

    case 'account-security':
      return (
        <svg {...commonProps}>
          <path d="M12 3 20 6v5.5c0 4.8-3.2 8.1-8 9.5-4.8-1.4-8-4.7-8-9.5V6l8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )

    case 'privacy':
      return (
        <svg {...commonProps}>
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      )

    case 'blocked-readers':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m5.7 5.7 12.6 12.6" />
        </svg>
      )

    case 'saved-posts':
      return (
        <svg {...commonProps}>
          <path d="M6 3.5h12v17l-6-4-6 4v-17Z" />
        </svg>
      )

    case 'my-comments':
      return (
        <svg {...commonProps}>
          <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-3.5-.7L4 20l1.4-4A7.5 7.5 0 1 1 20 11.5Z" />
        </svg>
      )

    case 'notifications':
      return (
        <svg {...commonProps}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M10 20h4" />
        </svg>
      )

    case 'reading-history':
      return (
        <svg {...commonProps}>
          <path d="M4 5v5h5" />
          <path d="M5.5 16a8 8 0 1 0-.8-8" />
          <path d="M12 7v5l3 2" />
        </svg>
      )

    case 'echo-sharing':
      return (
        <svg {...commonProps}>
          <path d="m17 3 4 4-4 4" />
          <path d="M3 7h18" />
          <path d="m7 21-4-4 4-4" />
          <path d="M21 17H3" />
        </svg>
      )

    case 'messages-replies':
      return (
        <svg {...commonProps}>
          <path d="M21 12a8 8 0 0 1-8 8H5l-3 2 1-5a9 9 0 1 1 18-5Z" />
          <path d="M8 12h8" />
        </svg>
      )

    case 'tags-mentions':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
        </svg>
      )

    case 'comment-settings':
      return (
        <svg {...commonProps}>
          <path d="M19 15a7 7 0 0 0-7-9H8a6 6 0 0 0-4 10.5L3 20l4-1.5A7 7 0 0 0 12 20" />
          <circle cx="18" cy="18" r="3" />
          <path d="M18 16.7v2.6M16.7 18h2.6" />
        </svg>
      )

    case 'hidden-words':
      return (
        <svg {...commonProps}>
          <path d="M3 3 21 21" />
          <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
          <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 8 9 8a17.4 17.4 0 0 1-2 3.1" />
          <path d="M6.6 6.6C4.3 8.3 3 12 3 12s3.5 8 9 8a9.8 9.8 0 0 0 4-.9" />
        </svg>
      )

    case 'restricted-readers':
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="7" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M17 12v6" />
          <path d="M14 15h6" />
        </svg>
      )

    case 'language':
      return (
        <svg {...commonProps}>
          <path d="M4 5h10" />
          <path d="M9 3v2" />
          <path d="M6 9c1.8 2.8 4.2 4.7 7 6" />
          <path d="M13 7c-1.5 4-4.2 7.2-8 9" />
          <path d="m15 20 3-8 3 8" />
          <path d="M16 17h4" />
        </svg>
      )

    case 'accessibility':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="4" r="2" />
          <path d="M5 8h14" />
          <path d="M12 6v7" />
          <path d="m8 21 4-8 4 8" />
        </svg>
      )

    case 'help-center':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.1c-.9.5-1.3 1-1.3 1.9" />
          <path d="M12 17h.01" />
        </svg>
      )

    case 'feedback-support':
      return (
        <svg {...commonProps}>
          <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          <path d="m22 2-11 11" />
        </svg>
      )

    case 'about-shadow':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6" />
          <path d="M12 7h.01" />
        </svg>
      )

    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

function SettingsRow({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="flex min-h-[72px] w-full items-center gap-4 px-4 py-3 text-left transition active:bg-[#f7f7f9]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827]">
  <ReaderSettingsIcon name={item.key} />
</span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[#111827]">
          {item.title}
        </span>
        <span className="mt-1 block text-[12px] font-normal leading-5 text-[#8d94a1]">
          {item.subtitle}
        </span>
      </span>

      <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#a6abb4]" />
    </button>
  )
}

export default function ReaderSettingsPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const groups = useMemo(() => SETTINGS_GROUPS, [])

  function showComingSoon(title) {
    setMessage(`${title} is coming soon.`)
    window.clearTimeout(showComingSoon.timer)
    showComingSoon.timer = window.setTimeout(() => {
      setMessage('')
    }, 2200)
  }

  function handleOpen(item) {
    if (item.route) {
      navigate(item.route)
      return
    }

    showComingSoon(item.title)
  }

  function handleLogout() {
    clearReaderSession()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-white pb-[calc(28px+env(safe-area-inset-bottom))] text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eceef2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate('/profile', { replace: true })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Back to profile"
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-[18px] font-semibold">
  Settings and activity
</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px]">
        {groups.map((group, groupIndex) => (
          <section
            key={group.title}
            className={groupIndex ? 'border-t-[8px] border-[#f1f2f4]' : ''}
          >
            <div className="px-5 pb-2 pt-5 text-[12.5px] font-medium text-[#7d8490]">
  {group.title}
</div>

            <div>
              {group.items.map((item) => (
                <SettingsRow
                  key={item.key}
                  item={item}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="border-t-[8px] border-[#f1f2f4] px-4 py-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-14 w-full items-center gap-4 rounded-[14px] px-1 text-left text-[#dc2626] active:bg-[#fff5f5]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <i className="fa-solid fa-arrow-right-from-bracket text-[20px]" />
            </span>

            <span className="text-[16px] font-normal">
              Log out
            </span>
          </button>
        </section>
      </div>

      {message ? (
        <div className="fixed bottom-[calc(28px+env(safe-area-inset-bottom))] left-1/2 z-[100] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2.5 text-[12px] font-normal text-white shadow-xl">
          {message}
        </div>
      ) : null}
    </main>
  )
}
