import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Clapperboard,
  House,
  Send,
} from 'lucide-react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  getChatConversations,
  hasReaderSession,
} from '../../services/chatApi'

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function HomeIcon({ highlighted }) {
  return (
    <House
      size={24}
      stroke="#111827"
      strokeWidth={2.15}
      fill={highlighted ? '#F6C800' : 'none'}
    />
  )
}

function FastIcon({ highlighted }) {
  return (
    <Clapperboard
      size={24}
      stroke="#111827"
      strokeWidth={2.15}
      fill={highlighted ? '#F6C800' : 'none'}
    />
  )
}

function ChatIcon({ highlighted }) {
  return (
    <Send
      size={24}
      stroke="#111827"
      strokeWidth={2.15}
      fill={highlighted ? '#F6C800' : 'none'}
    />
  )
}

function LibraryIcon({ highlighted }) {
  return (
    <span className="relative block h-6 w-6">
      <img
        src="/assets/Icons/Library.svg"
        alt=""
        className={`absolute inset-0 h-6 w-6 object-contain transition-opacity ${
          highlighted ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        src="/assets/Icons/Library-active.svg"
        alt=""
        className={`absolute inset-0 h-6 w-6 object-contain transition-opacity ${
          highlighted ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </span>
  )
}

function ProfileIcon({
  highlighted,
  avatarUrl,
  profileName,
}) {
  const [imageFailed, setImageFailed] =
    useState(false)
  const letter =
    String(profileName || 'Me')
      .trim()
      .charAt(0)
      .toUpperCase() || 'M'

  return (
    <span
      className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 bg-[#111827] text-[11px] font-extrabold text-white transition ${
        highlighted
          ? 'border-[#F6C800] ring-2 ring-[#F6C800]/25'
          : 'border-[#111827]'
      }`}
    >
      {avatarUrl && !imageFailed ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() =>
            setImageFailed(true)
          }
        />
      ) : (
        letter
      )}
    </span>
  )
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'reel', label: 'Reel' },
  { key: 'chat', label: 'Chat' },
  { key: 'library', label: 'Library' },
  { key: 'me', label: 'Me' },
]

export default function ReaderProfileFooter({
  avatarUrl = '',
  profileName = '',
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const storedUser = useMemo(
    () => getStoredUser(),
    []
  )
  const [message, setMessage] = useState('')
  const [hoveredKey, setHoveredKey] =
    useState('')
  const [chatBadgeCount, setChatBadgeCount] =
    useState(0)

  const finalAvatarUrl =
    avatarUrl ||
    storedUser?.avatar_url ||
    storedUser?.avatarUrl ||
    storedUser?.profile_image ||
    storedUser?.profileImage ||
    ''

  const finalProfileName =
    profileName ||
    storedUser?.name ||
    storedUser?.display_name ||
    storedUser?.username ||
    'Me'

  const activeKey =
    location.pathname.startsWith('/chat')
      ? 'chat'
      : location.pathname === '/library'
        ? 'library'
        : location.pathname === '/profile'
          ? 'me'
          : ''

  const loadChatBadge = useCallback(
    async () => {
      if (!hasReaderSession()) {
        setChatBadgeCount(0)
        return
      }

      try {
        const data =
          await getChatConversations('all')
        const conversations =
          Array.isArray(data.conversations)
            ? data.conversations
            : []

        const total = conversations.reduce(
          (sum, item) => {
            if (
              item.request_status ===
                'declined' ||
              item.request_status ===
                'blocked'
            ) {
              return sum
            }

            const unread = Math.max(
              0,
              Number(item.unread_count || 0)
            )

            const incomingRequest =
              item.can_decide === true &&
              item.request_status ===
                'pending'

            return (
              sum +
              (incomingRequest
                ? Math.max(1, unread)
                : unread)
            )
          },
          0
        )

        setChatBadgeCount(total)
      } catch {
        setChatBadgeCount(0)
      }
    },
    []
  )

  useEffect(() => {
    loadChatBadge()

    const intervalId =
      window.setInterval(
        loadChatBadge,
        10000
      )

    const handleChatUpdated = () => {
      loadChatBadge()
    }

    window.addEventListener(
      'shadow-chat-updated',
      handleChatUpdated
    )
    window.addEventListener(
      'storage',
      handleChatUpdated
    )

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener(
        'shadow-chat-updated',
        handleChatUpdated
      )
      window.removeEventListener(
        'storage',
        handleChatUpdated
      )
    }
  }, [loadChatBadge, location.pathname])

  const showMessage = (text) => {
    setMessage(text)
    window.setTimeout(
      () => setMessage(''),
      1800
    )
  }

  const handleClick = (key) => {
    if (key === 'library') {
      navigate('/library')
      return
    }

    if (key === 'me') {
      navigate('/profile')
      return
    }

    if (key === 'chat') {
      navigate('/chat')
      return
    }

    showMessage(
      `${key === 'home' ? 'Home' : 'Reel'} is coming soon.`
    )
  }

  const renderIcon = (
    key,
    highlighted
  ) => {
    if (key === 'home') {
      return (
        <HomeIcon
          highlighted={highlighted}
        />
      )
    }

    if (key === 'reel') {
      return (
        <FastIcon
          highlighted={highlighted}
        />
      )
    }

    if (key === 'chat') {
      return (
        <ChatIcon
          highlighted={highlighted}
        />
      )
    }

    if (key === 'library') {
      return (
        <LibraryIcon
          highlighted={highlighted}
        />
      )
    }

    return (
      <ProfileIcon
        highlighted={highlighted}
        avatarUrl={finalAvatarUrl}
        profileName={finalProfileName}
      />
    )
  }

  return (
    <>
      {message ? (
        <div className="fixed bottom-[82px] left-1/2 z-[100001] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-semibold text-white shadow-lg">
          {message}
        </div>
      ) : null}

      <footer
        className="fixed bottom-0 left-0 right-0 z-[100000] border-t border-[#ececf1] bg-white/95 backdrop-blur-xl"
        style={{
          paddingBottom:
            'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <nav className="mx-auto flex h-[64px] w-full max-w-[560px] items-center justify-around px-3">
          {NAV_ITEMS.map((item) => {
            const active =
              activeKey === item.key
            const highlighted =
              active ||
              hoveredKey === item.key
            const isChat =
              item.key === 'chat'
            const accessibleLabel =
              isChat && chatBadgeCount > 0
                ? `Chat, ${chatBadgeCount} unread`
                : item.label

            return (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  handleClick(item.key)
                }
                onMouseEnter={() =>
                  setHoveredKey(item.key)
                }
                onMouseLeave={() =>
                  setHoveredKey('')
                }
                onFocus={() =>
                  setHoveredKey(item.key)
                }
                onBlur={() =>
                  setHoveredKey('')
                }
                aria-label={accessibleLabel}
                title={item.label}
                aria-current={
                  active
                    ? 'page'
                    : undefined
                }
                className="relative flex h-12 w-12 items-center justify-center rounded-full transition active:scale-90"
              >
                {renderIcon(
                  item.key,
                  highlighted
                )}

                {isChat &&
                chatBadgeCount > 0 ? (
                  <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#ef4444] px-1 text-[8px] font-black leading-none text-white">
                    {chatBadgeCount > 99
                      ? '99+'
                      : chatBadgeCount}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>
      </footer>
    </>
  )
}
