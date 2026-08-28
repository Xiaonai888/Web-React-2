import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  BookOpen,
  Clapperboard,
  Send,
  ShoppingBag,
} from 'lucide-react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  getChatConversations,
  hasReaderSession,
} from '../../services/chatApi'
import {
  playChatNotificationTone,
  primeChatNotificationSound,
} from '../../services/chatNotificationSound'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerProfileFooter', {
  en: {
    mall: 'Mall',
    reel: 'Reel',
    chat: 'Chat',
    library: 'Library',
    me: 'Me',
    comingSoon: '{{label}} is coming soon.',
    chatUnread: 'Chat, {{count}} unread',
  },
  km: {
    mall: 'Mall',
    reel: 'Reel',
    chat: 'ជជែក',
    library: 'បណ្ណាល័យ',
    me: 'ខ្ញុំ',
    comingSoon: '{{label}} នឹងមកដល់ឆាប់ៗនេះ។',
    chatUnread: 'ជជែក, មិនទាន់អាន {{count}}',
  },
  zh: {
    mall: '商城',
    reel: '短视频',
    chat: '聊天',
    library: '书架',
    me: '我的',
    comingSoon: '{{label}} 即将推出。',
    chatUnread: '聊天，{{count}} 条未读',
  },
  ja: {
    mall: 'モール',
    reel: 'リール',
    chat: 'チャット',
    library: 'ライブラリ',
    me: 'マイ',
    comingSoon: '{{label}} は近日公開予定です。',
    chatUnread: 'チャット、未読 {{count}} 件',
  },
  ko: {
    mall: '몰',
    reel: '릴스',
    chat: '채팅',
    library: '라이브러리',
    me: '내 정보',
    comingSoon: '{{label}} 기능은 곧 제공됩니다.',
    chatUnread: '채팅, 읽지 않음 {{count}}개',
  },
})

function getStoredUser() {
  try {
    return JSON.parse(
      sessionStorage.getItem('shadow_reader_user') ||
        localStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function MallIcon() {
  return (
    <ShoppingBag
      size={23}
      strokeWidth={2.1}
    />
  )
}

function ReelIcon() {
  return (
    <Clapperboard
      size={23}
      strokeWidth={2.1}
    />
  )
}

function ChatIcon() {
  return (
    <Send
      size={23}
      strokeWidth={2.1}
    />
  )
}

function LibraryIcon() {
  return (
    <BookOpen
      size={23}
      strokeWidth={2.1}
    />
  )
}

function ProfileIcon({
  avatarUrl,
  profileName,
  active,
}) {
  const [imageFailed, setImageFailed] =
    useState(false)
  const letter =
    String(profileName || 'Me')
      .trim()
      .charAt(0)
      .toUpperCase() || 'M'

  useEffect(() => {
    setImageFailed(false)
  }, [avatarUrl])

  return (
    <span
      className="flex h-[23px] w-[23px] items-center justify-center overflow-hidden rounded-full text-[9px] font-bold ring-1"
      style={{
        background: active
          ? '#7c3aed'
          : 'var(--shadow-bg-elevated)',
        color: active
          ? '#ffffff'
          : 'var(--shadow-text-primary)',
        borderColor: active
          ? '#7c3aed'
          : 'var(--shadow-border)',
        '--tw-ring-color': active
          ? '#7c3aed'
          : 'var(--shadow-border)',
      }}
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
  { key: 'mall', labelKey: 'mall' },
  { key: 'reel', labelKey: 'reel' },
  { key: 'chat', labelKey: 'chat' },
  { key: 'library', labelKey: 'library' },
  { key: 'me', labelKey: 'me' },
]

export default function ReaderProfileFooter({
  avatarUrl = '',
  profileName = '',
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const messageTimerRef = useRef(null)
  const chatSnapshotRef = useRef(new Map())
  const chatSnapshotReadyRef = useRef(false)
  const [storedUser, setStoredUser] = useState(
    () => getStoredUser()
  )
  const [message, setMessage] = useState('')
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
    location.pathname.startsWith('/store')
      ? 'mall'
      : location.pathname.startsWith('/chat')
      ? 'chat'
      : location.pathname.startsWith('/library')
        ? 'library'
        : location.pathname.startsWith('/profile') ||
            location.pathname.startsWith('/me')
          ? 'me'
          : ''

  const refreshStoredUser = useCallback(() => {
    setStoredUser(getStoredUser())
  }, [])

  const loadChatBadge = useCallback(async () => {
    if (!hasReaderSession()) {
      setChatBadgeCount(0)
      chatSnapshotRef.current = new Map()
      chatSnapshotReadyRef.current = false
      return
    }

    try {
      const data =
        await getChatConversations('all')
      const conversations =
        Array.isArray(data.conversations)
          ? data.conversations
          : []
      const nextSnapshot = new Map()
      let toneToPlay = ''

      const total = conversations.reduce(
        (sum, item) => {
          if (
            item.request_status === 'declined' ||
            item.request_status === 'blocked'
          ) {
            return sum
          }

          const unread = Math.max(
            0,
            Number(item.unread_count || 0)
          )
          const incomingRequest =
            item.can_decide === true &&
            item.request_status === 'pending'
          const effectiveUnread =
            incomingRequest
              ? Math.max(1, unread)
              : unread
          const conversationId =
            String(item.id || '')
          const latestKey = String(
            item.latest_message?.id ||
              item.latest_message?.created_at ||
              item.last_message_at ||
              ''
          )
          const previous =
            chatSnapshotRef.current.get(
              conversationId
            )

          nextSnapshot.set(
            conversationId,
            {
              latestKey,
              unread: effectiveUnread,
            }
          )

          if (
            chatSnapshotReadyRef.current &&
            !toneToPlay &&
            latestKey &&
            effectiveUnread > 0 &&
            (!previous ||
              (latestKey !==
                previous.latestKey &&
                effectiveUnread >
                  previous.unread)) &&
            !item.is_muted &&
            item.notification_sound_enabled !== false
          ) {
            toneToPlay =
              item.notification_tone || 'default'
          }

          return sum + effectiveUnread
        },
        0
      )

      chatSnapshotRef.current = nextSnapshot

      if (!chatSnapshotReadyRef.current) {
        chatSnapshotReadyRef.current = true
      } else if (toneToPlay) {
        playChatNotificationTone(toneToPlay)
      }

      setChatBadgeCount(total)
    } catch {
      return
    }
  }, [])

  useEffect(() => {
    const primeSound = () => {
      primeChatNotificationSound()
    }

    window.addEventListener(
      'pointerdown',
      primeSound,
      { once: true }
    )
    window.addEventListener(
      'keydown',
      primeSound,
      { once: true }
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        primeSound
      )
      window.removeEventListener(
        'keydown',
        primeSound
      )
    }
  }, [])

  useEffect(() => {
    loadChatBadge()
    refreshStoredUser()

    const intervalId = window.setInterval(
      () => {
        if (
          document.visibilityState === 'visible'
        ) {
          loadChatBadge()
        }
      },
      10000
    )

    const handleChatUpdated = () => {
      loadChatBadge()
    }

    const handleStorage = () => {
      refreshStoredUser()
      loadChatBadge()
    }

    window.addEventListener(
      'shadow-chat-updated',
      handleChatUpdated
    )
    window.addEventListener(
      'shadow-profile-updated',
      refreshStoredUser
    )
    window.addEventListener(
      'storage',
      handleStorage
    )

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener(
        'shadow-chat-updated',
        handleChatUpdated
      )
      window.removeEventListener(
        'shadow-profile-updated',
        refreshStoredUser
      )
      window.removeEventListener(
        'storage',
        handleStorage
      )
    }
  }, [loadChatBadge, refreshStoredUser])

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        window.clearTimeout(
          messageTimerRef.current
        )
      }
    }
  }, [])

  const showMessage = (text) => {
    if (messageTimerRef.current) {
      window.clearTimeout(
        messageTimerRef.current
      )
    }

    setMessage(text)
    messageTimerRef.current =
      window.setTimeout(() => {
        setMessage('')
        messageTimerRef.current = null
      }, 1800)
  }

  const handleClick = (key) => {
    if (key === 'mall') {
  navigate('/store')
  return
}

    if (key === 'reel') {
      showMessage(
        t('readerProfileFooter.comingSoon', {
          label: t('readerProfileFooter.reel'),
        })
      )
      return
    }

    if (key === 'chat') {
      navigate('/chat')
      return
    }

    if (key === 'library') {
      navigate('/library')
      return
    }

    navigate('/profile')
  }

  const renderIcon = (key, active) => {
    if (key === 'mall') {
      return <MallIcon />
    }

    if (key === 'reel') {
      return <ReelIcon />
    }

    if (key === 'chat') {
      return <ChatIcon />
    }

    if (key === 'library') {
      return <LibraryIcon />
    }

    return (
      <ProfileIcon
        avatarUrl={finalAvatarUrl}
        profileName={finalProfileName}
        active={active}
      />
    )
  }

  return (
    <>
      {message ? (
        <div
          className="fixed bottom-[82px] left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-semibold"
          style={{
            background: 'var(--shadow-bg-elevated)',
            color: 'var(--shadow-text-primary)',
            boxShadow: 'var(--shadow-shadow)',
            border: '1px solid var(--shadow-border)',
          }}
        >
          {message}
        </div>
      ) : null}

      <footer
        className="app-nav fixed bottom-0 left-0 right-0 z-[90] border-t backdrop-blur-xl"
        style={{
          paddingBottom:
            'env(safe-area-inset-bottom, 0px)',
          boxShadow: 'none',
        }}
      >
        <nav className="mx-auto flex h-[64px] w-full max-w-[560px] items-center justify-around px-3">
          {NAV_ITEMS.map((item) => {
            const active =
              activeKey === item.key
            const isChat =
              item.key === 'chat'
            const label = t(
              `readerProfileFooter.${item.labelKey}`
            )
            const accessibleLabel =
              isChat && chatBadgeCount > 0
                ? t(
                    'readerProfileFooter.chatUnread',
                    { count: chatBadgeCount }
                  )
                : label

            return (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  handleClick(item.key)
                }
                aria-label={accessibleLabel}
                title={label}
                aria-current={
                  active
                    ? 'page'
                    : undefined
                }
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-transparent shadow-none transition active:scale-90"
                style={{
                  color: active
                    ? '#7c3aed'
                    : 'var(--shadow-icon)',
                }}
              >
                {renderIcon(item.key, active)}

                {isChat &&
                chatBadgeCount > 0 ? (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 bg-[#ef4444] px-1 text-[8px] font-bold leading-none text-white"
                    style={{
                      borderColor: 'var(--shadow-nav-bg)',
                    }}
                  >
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
