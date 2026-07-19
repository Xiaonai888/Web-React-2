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

function SettingsRow({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="flex min-h-[72px] w-full items-center gap-4 px-4 py-3 text-left transition active:bg-[#f7f7f9]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${item.icon} text-[20px]`} />
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
