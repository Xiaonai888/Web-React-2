import {
  Ban,
  Bell,
  Check,
  ChevronLeft,
  Clock3,
  EyeOff,
  FileImage,
  FileText,
  Flag,
  Link2,
  LoaderCircle,
  MoreHorizontal,
  Pin,
  Search,
  ShieldAlert,
  Trash2,
  UserRound,
  VolumeX,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  blockChatConversation,
  deleteChatConversation,
  getChatBlockStatus,
  getChatMessages,
  getPinnedChatMessages,
  hasReaderSession,
  reportChatMessage,
  unblockChatConversation,
  unpinChatMessage,
} from '../../services/chatApi'
import {
  getChatMuteStatus,
  muteChatConversation,
  unmuteChatConversation,
} from '../../services/chatMuteApi'
import {
  getChatAutoDeleteStatus,
  setChatAutoDelete,
} from '../../services/chatAutoDeleteApi'

const REPORT_REASONS = [
  ['spam', 'Spam'],
  ['harassment', 'Harassment or bullying'],
  ['hate', 'Hate or abusive content'],
  ['sexual_content', 'Sexual or inappropriate content'],
  ['violence', 'Violence or threats'],
  ['scam', 'Scam or suspicious links'],
  ['impersonation', 'Impersonation'],
  ['privacy', 'Privacy or personal information'],
  ['other', 'Something else'],
]

const MAX_SEARCH_MESSAGES = 1000

const MUTE_OPTIONS = [
  ['1h', '1 hour'],
  ['8h', '8 hours'],
  ['1d', '1 day'],
  ['7d', '7 days'],
  ['forever', 'Until I turn it back on'],
]

const AUTO_DELETE_OPTIONS = [
  [0, 'Off'],
  [86400, '1 day'],
  [604800, '7 days'],
  [2592000, '30 days'],
]

function formatAutoDeleteDuration(value) {
  const seconds = Number(value || 0)

  if (seconds === 86400) return '1 day'
  if (seconds === 604800) return '7 days'
  if (seconds === 2592000) return '30 days'

  return 'Off'
}

function normalizeMessageSearchValue(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[^\p{L}\p{N}@._-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatSearchMessageDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function extractSharedUrls(value) {
  return (
    String(value || '').match(
      /https?:\/\/[^\s<>"']+/gi
    ) || []
  ).map((url) =>
    url.replace(/[),.;!?]+$/g, '')
  )
}

function isImageUrl(value) {
  try {
    return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(
      new URL(value).pathname
    )
  } catch {
    return false
  }
}

function classifySharedUrl(value) {
  try {
    const path = new URL(value).pathname

    if (
      /\.(jpg|jpeg|png|webp|gif|avif|mp4|webm|mov)$/i.test(
        path
      )
    ) {
      return 'media'
    }

    if (
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|txt|epub)$/i.test(
        path
      )
    ) {
      return 'files'
    }
  } catch {
    return 'links'
  }

  return 'links'
}

function getSharedUrlLabel(value) {
  try {
    return new URL(value).hostname.replace(
      /^www\./,
      ''
    )
  } catch {
    return value
  }
}

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name ||
      person?.page_name ||
      person?.username ||
      'Shadow'
  ).trim()
  const avatar =
    person?.avatar_url ||
    person?.profile_image_url ||
    ''

  useEffect(() => {
    setFailed(false)
  }, [avatar])

  return (
    <span className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[30px] font-bold text-white">
      {avatar && !failed ? (
        <img
          src={avatar}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        name.charAt(0).toUpperCase() || 'S'
      )}
    </span>
  )
}

function Shortcut({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 flex-1 flex-col items-center gap-2 text-[#111827] active:opacity-60"
    >
      <span className="flex h-10 w-10 items-center justify-center">
        <Icon size={27} strokeWidth={1.9} />
      </span>
      <span className="text-[12px] font-normal">
        {label}
      </span>
    </button>
  )
}

function Row({
  icon: Icon,
  title,
  subtitle = '',
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[58px] w-full items-center gap-4 px-1 text-left active:bg-[#f7f7f9] ${
        danger ? 'text-[#d13a42]' : 'text-[#111827]'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon size={22} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-[11px] font-normal text-[#8a8a95]">
            {subtitle}
          </span>
        ) : null}
      </span>
    </button>
  )
}

function Sheet({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/35 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />
      <section className="relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-4 sm:max-w-[460px] sm:rounded-[24px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111827]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-full px-3 text-[12px] font-semibold text-[#6b7280]"
          >
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default function ChatInfoPage() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [blockStatus, setBlockStatus] = useState({
    is_blocked: false,
    viewer_has_blocked: false,
    viewer_is_blocked: false,
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('spam')
  const [reportDetails, setReportDetails] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMessages, setSearchMessages] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchLoaded, setSearchLoaded] = useState(false)
  const [muteOpen, setMuteOpen] = useState(false)
  const [muteStatus, setMuteStatus] = useState({
    is_muted: false,
    muted_until: null,
  })
  const [autoDeleteOpen, setAutoDeleteOpen] = useState(false)
  const [autoDeleteStatus, setAutoDeleteStatus] = useState({
    auto_delete_enabled: false,
    auto_delete_seconds: 0,
  })
  const [pinnedOpen, setPinnedOpen] = useState(false)
  const [pinnedItems, setPinnedItems] = useState([])
  const [pinnedLoading, setPinnedLoading] = useState(false)
  const [pinnedError, setPinnedError] = useState('')
  const [pinnedBusyId, setPinnedBusyId] = useState('')
  const [sharedOpen, setSharedOpen] = useState(false)
  const [sharedTab, setSharedTab] = useState('media')
  const [optionsOpen, setOptionsOpen] = useState(false)

  const person = conversation?.counterpart || {}
  const name =
    person.name ||
    person.page_name ||
    person.username ||
    'Conversation'
  const username =
    person.username ||
    person.page_username ||
    ''
  const canDeleteForBoth =
    conversation?.conversation_type === 'reader_reader' ||
    conversation?.delete_permissions?.can_delete_for_both === true

  const reportMessage = useMemo(
    () =>
      [...messages]
        .reverse()
        .find(
          (message) =>
            !message.is_mine &&
            !message.is_deleted &&
            message.id
        ) || null,
    [messages]
  )

  const normalizedSearchQuery = useMemo(
    () => normalizeMessageSearchValue(searchQuery),
    [searchQuery]
  )

  const searchResults = useMemo(() => {
    if (!normalizedSearchQuery) return []

    const terms = normalizedSearchQuery
      .split(' ')
      .filter(Boolean)

    return searchMessages
      .filter(
        (message) =>
          !message.is_deleted &&
          String(message.body || '').trim()
      )
      .filter((message) => {
        const body = normalizeMessageSearchValue(
          message.body
        )

        return terms.every((term) =>
          body.includes(term)
        )
      })
      .sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime()
      )
  }, [normalizedSearchQuery, searchMessages])
  const sharedContent = useMemo(() => {
  const source = searchLoaded
    ? searchMessages
    : messages
  const items = []
  const seen = new Set()

  source.forEach((message) => {
    if (message.is_deleted) return

    extractSharedUrls(message.body).forEach(
      (url) => {
        if (seen.has(url)) return
        seen.add(url)

        items.push({
          id: `${message.id}:${url}`,
          url,
          kind: classifySharedUrl(url),
          image: isImageUrl(url),
          name: getSharedUrlLabel(url),
          created_at: message.created_at,
        })
      }
    )
  })

  return {
    media: items.filter(
      (item) => item.kind === 'media'
    ),
    files: items.filter(
      (item) => item.kind === 'files'
    ),
    links: items.filter(
      (item) => item.kind === 'links'
    ),
  }
}, [
  messages,
  searchLoaded,
  searchMessages,
])

const activeSharedItems =
  sharedContent[sharedTab] || []

  const notifyUpdated = () => {
    window.dispatchEvent(new CustomEvent('shadow-chat-updated'))
  }

  const showNotice = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 2200)
  }

  const loadInfo = async () => {
    if (!conversationId) return

    if (!hasReaderSession()) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setLoading(true)
      const [
        roomData,
        blockData,
        muteData,
        autoDeleteData,
      ] = await Promise.all([
        getChatMessages(conversationId, { limit: 50 }),
        getChatBlockStatus(conversationId),
        getChatMuteStatus(conversationId),
        getChatAutoDeleteStatus(conversationId),
      ])

      setConversation(roomData.conversation || null)
      setMessages(
        Array.isArray(roomData.messages) ? roomData.messages : []
      )
      setBlockStatus({
        is_blocked: Boolean(blockData.block_status?.is_blocked),
        viewer_has_blocked: Boolean(
          blockData.block_status?.viewer_has_blocked
        ),
        viewer_is_blocked: Boolean(
          blockData.block_status?.viewer_is_blocked
        ),
      })
      setMuteStatus({
        is_muted: Boolean(muteData.is_muted),
        muted_until: muteData.muted_until || null,
      })
      setAutoDeleteStatus({
        auto_delete_enabled: Boolean(
          autoDeleteData.auto_delete_enabled
        ),
        auto_delete_seconds: Number(
          autoDeleteData.auto_delete_seconds || 0
        ),
      })
    } catch (error) {
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.status === 404
      ) {
        navigate('/chat', { replace: true })
        return
      }

      showNotice(error.message || 'Failed to load chat info')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInfo()
  }, [conversationId])

  const loadSearchHistory = async () => {
    if (
      searchLoading ||
      searchLoaded ||
      !conversationId
    ) {
      return
    }

    setSearchLoading(true)

    try {
      let before = ''
      let collected = []
      let pageCount = 0

      do {
        const data = await getChatMessages(
          conversationId,
          {
            before,
            limit: 100,
          }
        )

        const pageMessages = Array.isArray(
          data.messages
        )
          ? data.messages
          : []

        const messageMap = new Map(
          collected.map((message) => [
            String(message.id),
            message,
          ])
        )

        pageMessages.forEach((message) => {
          if (message?.id) {
            messageMap.set(
              String(message.id),
              message
            )
          }
        })

        collected = [...messageMap.values()]
        before = data.next_before || ''
        pageCount += 1
      } while (
        before &&
        collected.length < MAX_SEARCH_MESSAGES &&
        pageCount < 10
      )

      setSearchMessages(
        collected.slice(-MAX_SEARCH_MESSAGES)
      )
      setSearchLoaded(true)
    } catch (error) {
      showNotice(
        error.message ||
          'Failed to load messages for search'
      )
    } finally {
      setSearchLoading(false)
    }
  }

  const openSearch = () => {
    setSearchOpen(true)
    setSearchQuery('')

    if (!searchLoaded) {
      loadSearchHistory()
    }
  }

  const openSharedContent = () => {
  setSharedTab('media')
  setSharedOpen(true)

  if (!searchLoaded) {
    loadSearchHistory()
  }
}

  const openProfile = () => {
    if (!username) return

    if (person.type === 'author') {
      navigate(`/author/page/${encodeURIComponent(username)}`)
      return
    }

    navigate(`/profile?username=${encodeURIComponent(username)}`)
  }

  const openPinnedMessages = async () => {
    if (!conversationId) return

    setPinnedOpen(true)
    setPinnedLoading(true)
    setPinnedError('')

    try {
      const data = await getPinnedChatMessages(
        conversationId
      )

      setPinnedItems(
        Array.isArray(data.pins)
          ? data.pins
          : []
      )
    } catch (error) {
      setPinnedError(
        error.message ||
          'Failed to load pinned messages'
      )
    } finally {
      setPinnedLoading(false)
    }
  }

  const handleUnpinPinnedMessage = async (
    messageId
  ) => {
    if (pinnedBusyId) return

    setPinnedBusyId(String(messageId))
    setPinnedError('')

    try {
      await unpinChatMessage(
        conversationId,
        messageId
      )

      setPinnedItems((current) =>
        current.filter(
          (pin) =>
            String(pin.message_id) !==
              String(messageId) &&
            String(pin.message?.id) !==
              String(messageId)
        )
      )
      notifyUpdated()
      showNotice('Message unpinned')
    } catch (error) {
      setPinnedError(
        error.message ||
          'Failed to unpin message'
      )
    } finally {
      setPinnedBusyId('')
    }
  }

  const handleMute = async (duration) => {
    if (busy) return

    setBusy('mute')

    try {
      const data = await muteChatConversation(
        conversationId,
        duration
      )

      setMuteStatus({
        is_muted: true,
        muted_until: data.muted_until || null,
      })
      setMuteOpen(false)
      notifyUpdated()
      showNotice('Chat muted')
    } catch (error) {
      showNotice(
        error.message || 'Failed to mute chat'
      )
    } finally {
      setBusy('')
    }
  }

  const handleUnmute = async () => {
    if (busy) return

    setBusy('unmute')

    try {
      await unmuteChatConversation(
        conversationId
      )
      setMuteStatus({
        is_muted: false,
        muted_until: null,
      })
      notifyUpdated()
      showNotice('Chat unmuted')
    } catch (error) {
      showNotice(
        error.message || 'Failed to unmute chat'
      )
    } finally {
      setBusy('')
    }
  }

  const handleToggleNotifications = async () => {
    if (busy) return

    const turningOn = muteStatus.is_muted
    setBusy('notifications')

    try {
      if (turningOn) {
        await unmuteChatConversation(conversationId)
        setMuteStatus({
          is_muted: false,
          muted_until: null,
        })
      } else {
        await muteChatConversation(
          conversationId,
          'forever'
        )
        setMuteStatus({
          is_muted: true,
          muted_until: null,
        })
      }

      notifyUpdated()
      showNotice(
        turningOn
          ? 'Notifications turned on'
          : 'Notifications turned off'
      )
    } catch (error) {
      showNotice(
        error.message ||
          'Failed to update notifications'
      )
    } finally {
      setBusy('')
    }
  }

  const handleAutoDelete = async (seconds) => {
    if (busy) return

    setBusy('auto-delete')

    try {
      const data = await setChatAutoDelete(
        conversationId,
        seconds
      )

      setAutoDeleteStatus({
        auto_delete_enabled: Boolean(
          data.auto_delete_enabled
        ),
        auto_delete_seconds: Number(
          data.auto_delete_seconds || 0
        ),
      })
      setAutoDeleteOpen(false)
      notifyUpdated()
      showNotice(
        Number(data.auto_delete_seconds || 0) > 0
          ? `Auto-delete set to ${formatAutoDeleteDuration(
              data.auto_delete_seconds
            )}`
          : 'Auto-delete turned off'
      )
    } catch (error) {
      showNotice(
        error.message ||
          'Failed to update auto-delete'
      )
    } finally {
      setBusy('')
    }
  }

  const handleBlock = async () => {
    if (busy) return

    const unblocking = blockStatus.viewer_has_blocked
    if (
      !window.confirm(
        unblocking
          ? 'Unblock this account?'
          : 'Block this account and stop messages?'
      )
    ) {
      return
    }

    setBusy(unblocking ? 'unblock' : 'block')

    try {
      if (unblocking) {
        await unblockChatConversation(conversationId)
      } else {
        await blockChatConversation(conversationId)
      }

      await loadInfo()
      notifyUpdated()
      showNotice(unblocking ? 'Account unblocked' : 'Account blocked')
    } catch (error) {
      showNotice(error.message || 'Failed to update block')
    } finally {
      setBusy('')
    }
  }

  const handleReport = async () => {
    if (!reportMessage) {
      showNotice('No received message is available to report.')
      return
    }

    if (busy === 'report') return
    setBusy('report')

    try {
      await reportChatMessage(conversationId, reportMessage.id, {
        reason: reportReason,
        details: reportDetails.trim(),
      })
      setReportOpen(false)
      setReportDetails('')
      showNotice('Report submitted')
    } catch (error) {
      showNotice(error.message || 'Failed to submit report')
    } finally {
      setBusy('')
    }
  }

  const handleDelete = async (scope) => {
    if (busy) return

    if (
      !window.confirm(
        scope === 'for_both'
          ? 'Delete this chat for both people?'
          : 'Delete this chat from your inbox?'
      )
    ) {
      return
    }

    setBusy(scope)

    try {
      await deleteChatConversation(conversationId, scope)
      notifyUpdated()
      navigate('/chat', { replace: true })
    } catch (error) {
      showNotice(error.message || 'Failed to delete chat')
    } finally {
      setBusy('')
    }
  }

  if (searchOpen) {
    return (
      <div className="min-h-screen bg-white text-[#111827]">
        <header className="sticky top-0 z-40 border-b border-[#ececf0] bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-[58px] max-w-[560px] items-center gap-2 px-3">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery('')
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f3f4f6]"
              aria-label="Back to chat info"
            >
              <ChevronLeft size={27} strokeWidth={2} />
            </button>

            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#85858f]"
              />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value.slice(0, 120)
                  )
                }
                placeholder="Search in chat"
                className="h-10 w-full rounded-full bg-[#f2f3f5] pl-10 pr-10 text-[13px] font-normal text-[#111827] outline-none placeholder:text-[#92929b] focus:bg-[#eeeeF2]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#777781] active:bg-[#dedee4]"
                >
                  <X size={17} />
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[560px] px-4 pb-10">
          {notice ? (
            <div className="fixed left-1/2 top-[70px] z-[170] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[11px] font-medium text-white">
              {notice}
            </div>
          ) : null}

          {searchLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-[#7c3aed]">
              <LoaderCircle
                size={27}
                className="animate-spin"
              />
            </div>
          ) : !normalizedSearchQuery ? (
            <div className="px-5 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f3f5] text-[#777781]">
                <Search size={25} />
              </div>
              <h2 className="mt-4 text-[16px] font-semibold">
                Search this chat
              </h2>
              <p className="mx-auto mt-2 max-w-[300px] text-[12px] font-normal leading-5 text-[#868690]">
                Enter one or more words. The words can appear anywhere in the message and do not need to be typed as one exact phrase.
              </p>
            </div>
          ) : searchResults.length ? (
            <section className="py-3">
              <div className="px-2 pb-2 text-[11px] font-normal text-[#888892]">
                {searchResults.length} result
                {searchResults.length === 1 ? '' : 's'}
              </div>

              <div className="divide-y divide-[#efeff2]">
                {searchResults.map((message) => (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() =>
  navigate(`/chat/${conversationId}`, {
    state: {
      jumpToMessageId: message.id,
    },
  })
}
                    className="block w-full px-2 py-4 text-left active:bg-[#f7f7f9]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[12px] font-semibold text-[#111827]">
                        {message.is_mine
                          ? 'You'
                          : name}
                      </span>
                      <span className="shrink-0 text-[10px] font-normal text-[#9999a2]">
                        {formatSearchMessageDate(
                          message.created_at
                        )}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-[13px] font-normal leading-5 text-[#4b4b54]">
                      {message.body}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <div className="px-5 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f3f5] text-[#777781]">
                <Search size={25} />
              </div>
              <h2 className="mt-4 text-[16px] font-semibold">
                No messages found
              </h2>
              <p className="mt-2 text-[12px] font-normal text-[#888892]">
                Try another word or a shorter part of the message.
              </p>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#7c3aed]">
        <LoaderCircle size={28} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[560px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate(`/chat/${conversationId}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Back to chat"
          >
            <ChevronLeft size={27} strokeWidth={2} />
          </button>
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[560px] px-5 pb-12">
        {notice ? (
          <div className="fixed left-1/2 top-[70px] z-[170] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[11px] font-medium text-white">
            {notice}
          </div>
        ) : null}

        <section className="flex flex-col items-center pt-6 text-center">
          <Avatar person={person} />
          <h1 className="mt-4 max-w-full truncate text-[22px] font-semibold">
            {name}
          </h1>
          {username ? (
            <p className="mt-1 text-[12px] font-normal text-[#7b7b85]">
              @{username}
            </p>
          ) : null}

          <div className="relative mt-7 w-full">
  <div className="mx-auto flex max-w-[360px] items-start justify-between">
    <Shortcut
      icon={UserRound}
      label="Profile"
      onClick={openProfile}
    />

    <Shortcut
      icon={Search}
      label="Search"
      onClick={openSearch}
    />

    <Shortcut
      icon={Bell}
      label="Mute"
      onClick={() => {
        if (muteStatus.is_muted) {
          handleUnmute()
          return
        }

        setMuteOpen(true)
      }}
    />

    <Shortcut
      icon={MoreHorizontal}
      label="Options"
      onClick={() =>
        setOptionsOpen((current) => !current)
      }
    />
  </div>

  {optionsOpen ? (
    <>
      <button
        type="button"
        aria-label="Close options"
        onClick={() => setOptionsOpen(false)}
        className="fixed inset-0 z-[55]"
      />

      <div className="absolute right-0 top-[68px] z-[60] w-[220px] overflow-hidden rounded-[20px] border border-[#e8e8ec] bg-white p-1.5 shadow-[0_18px_45px_rgba(17,24,39,0.18)]">
        <button
          type="button"
          onClick={() => {
            setOptionsOpen(false)
            showNotice('Restrict is coming soon.')
          }}
          className="flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-[14px] text-[#111827] active:bg-[#f4f4f6]"
        >
          <EyeOff size={21} />
          Restrict
        </button>

        <button
          type="button"
          onClick={() => {
            setOptionsOpen(false)
            handleBlock()
          }}
          disabled={Boolean(busy)}
          className="flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-[14px] text-[#111827] active:bg-[#f4f4f6] disabled:opacity-50"
        >
          <Ban size={21} />
          {blockStatus.viewer_has_blocked
            ? 'Unblock'
            : 'Block'}
        </button>

        <button
          type="button"
          onClick={() => {
            setOptionsOpen(false)

            if (!reportMessage) {
              showNotice(
                'No received message is available to report.'
              )
              return
            }

            setReportOpen(true)
          }}
          className="flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-[14px] text-[#d13a42] active:bg-[#fff1f2]"
        >
          <Flag size={21} />
          Report
        </button>
      </div>
    </>
  ) : null}
</div>
            <Shortcut icon={UserRound} label="Profile" onClick={openProfile} />
            <Shortcut
              icon={Search}
              label="Search"
              onClick={openSearch}
            />
          </div>
        </section>

        <section className="mt-9">
          <h2 className="mb-2 text-[13px] font-normal text-[#777781]">
            Chat info
          </h2>
          <Row
  icon={FileImage}
  title="View media, files & links"
  onClick={openSharedContent}
/>
          <Row
            icon={Pin}
            title="Pinned messages"
            onClick={openPinnedMessages}
          />
        </section>

        <section className="mt-7">
          <h2 className="mb-2 text-[13px] font-normal text-[#777781]">
            Actions
          </h2>
          <Row
            icon={VolumeX}
            title={
              muteStatus.is_muted
                ? `Unmute ${name}`
                : `Mute ${name}`
            }
            subtitle={
              muteStatus.is_muted
                ? muteStatus.muted_until
                  ? `Muted until ${formatSearchMessageDate(
                      muteStatus.muted_until
                    )}`
                  : 'Muted until you turn it back on'
                : ''
            }
            onClick={() => {
              if (muteStatus.is_muted) {
                handleUnmute()
                return
              }

              setMuteOpen(true)
            }}
          />
          <Row
            icon={Bell}
            title="Notifications"
            subtitle={
              muteStatus.is_muted ? 'Off' : 'On'
            }
            onClick={handleToggleNotifications}
          />
          <Row
            icon={Clock3}
            title="Auto-delete chat"
            subtitle={formatAutoDeleteDuration(
              autoDeleteStatus.auto_delete_seconds
            )}
            onClick={() => setAutoDeleteOpen(true)}
          />
        </section>

        <section className="mt-7">
          <h2 className="mb-2 text-[13px] font-normal text-[#777781]">
            Privacy and report
          </h2>
          <Row
            icon={Ban}
            title={blockStatus.viewer_has_blocked ? 'Unblock' : 'Block'}
            subtitle={
              blockStatus.viewer_is_blocked &&
              !blockStatus.viewer_has_blocked
                ? 'This account has blocked messaging with you'
                : ''
            }
            danger={!blockStatus.viewer_has_blocked}
            onClick={handleBlock}
          />
          <Row
            icon={ShieldAlert}
            title="Restrict"
            onClick={() => showNotice('Restrict is coming soon.')}
          />
          <Row
            icon={Flag}
            title="Report"
            danger
            onClick={() => {
              if (!reportMessage) {
                showNotice('No received message is available to report.')
                return
              }
              setReportOpen(true)
            }}
          />
          <Row
            icon={Trash2}
            title="Delete chat"
            danger
            onClick={() => setDeleteOpen(true)}
          />
        </section>
      </main>

      {muteOpen ? (
        <Sheet
          title="Mute notifications"
          onClose={() => setMuteOpen(false)}
        >
          <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
            Choose how long you want to mute notifications from this chat.
          </p>

          <div className="overflow-hidden rounded-[14px] bg-[#f5f5f7]">
            {MUTE_OPTIONS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => handleMute(value)}
                disabled={busy === 'mute'}
                className="flex h-12 w-full items-center gap-3 border-b border-white px-4 text-left text-[13px] font-normal text-[#111827] last:border-b-0 active:bg-[#ececf0] disabled:opacity-50"
              >
                {busy === 'mute' ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <VolumeX size={18} />
                )}
                {label}
              </button>
            ))}
          </div>
        </Sheet>
      ) : null}

      {sharedOpen ? (
  <Sheet
    title="Media, files & links"
    onClose={() => setSharedOpen(false)}
  >
    <div className="mb-4 grid grid-cols-3 rounded-[14px] bg-[#f3f3f6] p-1">
      {[
        ['media', 'Media'],
        ['files', 'Files'],
        ['links', 'Links'],
      ].map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setSharedTab(key)}
          className={`h-9 rounded-[11px] text-[12px] font-semibold ${
            sharedTab === key
              ? 'bg-white text-[#7c3aed] shadow-sm'
              : 'text-[#777781]'
          }`}
        >
          {label} ({sharedContent[key].length})
        </button>
      ))}
    </div>

    {searchLoading && !searchLoaded ? (
      <div className="flex min-h-[180px] items-center justify-center text-[#7c3aed]">
        <LoaderCircle
          size={25}
          className="animate-spin"
        />
      </div>
    ) : activeSharedItems.length ? (
      sharedTab === 'media' ? (
        <div className="grid grid-cols-3 gap-2">
          {activeSharedItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex aspect-square overflow-hidden rounded-[12px] bg-[#f2f2f5]"
            >
              {item.image ? (
                <img
                  src={item.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[#7c3aed]">
                  <FileImage size={25} />
                </span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] bg-[#f6f6f8]">
          {activeSharedItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border-b border-white px-3 py-3 last:border-b-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#7c3aed]">
                {sharedTab === 'files' ? (
                  <FileText size={19} />
                ) : (
                  <Link2 size={19} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-[#22222b]">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[10px] text-[#92929b]">
                  {formatSearchMessageDate(
                    item.created_at
                  )}
                </span>
              </span>
            </a>
          ))}
        </div>
      )
    ) : (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
          {sharedTab === 'files' ? (
            <FileText size={24} />
          ) : sharedTab === 'links' ? (
            <Link2 size={24} />
          ) : (
            <FileImage size={24} />
          )}
        </div>

        <h3 className="mt-4 text-[15px] font-semibold">
          No {sharedTab} yet
        </h3>
      </div>
    )}
  </Sheet>
) : null}

      {pinnedOpen ? (
        <Sheet
          title="Pinned messages"
          onClose={() => setPinnedOpen(false)}
        >
          {pinnedError ? (
            <p className="mb-3 rounded-[12px] bg-[#fff0f1] px-3 py-2.5 text-[11px] font-medium text-[#c7353d]">
              {pinnedError}
            </p>
          ) : null}

          {pinnedLoading ? (
            <div className="flex min-h-[180px] items-center justify-center text-[#7c3aed]">
              <LoaderCircle
                size={25}
                className="animate-spin"
              />
            </div>
          ) : pinnedItems.length ? (
            <div className="overflow-hidden rounded-[14px] bg-[#f6f6f8]">
              {pinnedItems.map((pin) => {
                const message = pin.message || {}
                const messageId =
                  message.id || pin.message_id
                const busy =
                  String(pinnedBusyId) ===
                  String(messageId)

                return (
                  <div
                    key={pin.id || messageId}
                    className="flex items-start gap-3 border-b border-white px-3 py-3 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() =>
  navigate(`/chat/${conversationId}`, {
    state: {
      jumpToMessageId: messageId,
    },
  })
}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#7c3aed]">
                        <Pin size={12} />
                        Pinned message
                      </div>

                      <p className="mt-1 whitespace-pre-wrap break-words text-[13px] font-normal leading-5 text-[#2f2f37]">
                        {message.body ||
                          'Message'}
                      </p>

                      <p className="mt-1 text-[10px] font-normal text-[#92929b]">
                        {formatSearchMessageDate(
                          message.created_at ||
                            pin.created_at
                        )}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleUnpinPinnedMessage(
                          messageId
                        )
                      }
                      disabled={busy}
                      aria-label="Unpin message"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7c3aed] active:bg-[#ece7f8] disabled:opacity-50"
                    >
                      {busy ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <X size={17} />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
                <Pin size={24} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-[#111827]">
                No pinned messages
              </h3>
              <p className="mx-auto mt-2 max-w-[280px] text-[11px] font-normal leading-5 text-[#8b8b95]">
                Pin a message from the chat and it will appear here.
              </p>
            </div>
          )}
        </Sheet>
      ) : null}

      {autoDeleteOpen ? (
        <Sheet
          title="Auto-delete messages"
          onClose={() => setAutoDeleteOpen(false)}
        >
          <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
            This setting applies to new messages sent after it is enabled.
            Existing messages keep their current lifetime.
          </p>

          <div className="overflow-hidden rounded-[14px] bg-[#f5f5f7]">
            {AUTO_DELETE_OPTIONS.map(
              ([seconds, label]) => {
                const selected =
                  Number(
                    autoDeleteStatus.auto_delete_seconds || 0
                  ) === Number(seconds)

                return (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() =>
                      handleAutoDelete(seconds)
                    }
                    disabled={busy === 'auto-delete'}
                    className="flex h-12 w-full items-center gap-3 border-b border-white px-4 text-left text-[13px] font-normal text-[#111827] last:border-b-0 active:bg-[#ececf0] disabled:opacity-50"
                  >
                    {busy === 'auto-delete' ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Clock3 size={18} />
                    )}

                    <span className="flex-1">
                      {label}
                    </span>

                    {selected ? (
                      <Check
                        size={18}
                        strokeWidth={2.4}
                        className="text-[#7c3aed]"
                      />
                    ) : null}
                  </button>
                )
              }
            )}
          </div>

          <p className="mt-3 text-[10px] font-normal leading-4 text-[#92929b]">
            Expired messages disappear from the chat automatically. Shadow's
            safety retention remains separate from what users can see.
          </p>
        </Sheet>
      ) : null}

      {reportOpen ? (
        <Sheet title="Report this chat" onClose={() => setReportOpen(false)}>
          <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
            Choose the reason that best describes the problem in this conversation.
          </p>

          <select
            value={reportReason}
            onChange={(event) => setReportReason(event.target.value)}
            className="h-11 w-full rounded-[12px] border border-[#dedee4] bg-white px-3 text-[13px] font-normal outline-none focus:border-[#7c3aed]"
          >
            {REPORT_REASONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <textarea
            value={reportDetails}
            onChange={(event) =>
              setReportDetails(event.target.value.slice(0, 1000))
            }
            rows={4}
            placeholder="Add details (optional)"
            className="mt-3 w-full resize-none rounded-[12px] border border-[#dedee4] px-3 py-3 text-[13px] font-normal outline-none focus:border-[#7c3aed]"
          />

          <button
            type="button"
            onClick={handleReport}
            disabled={busy === 'report'}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#d13a42] text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {busy === 'report' ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Flag size={17} />
            )}
            Submit report
          </button>
        </Sheet>
      ) : null}

      {deleteOpen ? (
        <Sheet title="Delete chat" onClose={() => setDeleteOpen(false)}>
          <button
            type="button"
            onClick={() => handleDelete('for_me')}
            disabled={Boolean(busy)}
            className="flex min-h-[54px] w-full items-center gap-3 rounded-[14px] bg-[#f5f5f7] px-4 text-left text-[13px] font-medium text-[#111827] disabled:opacity-50"
          >
            <Trash2 size={19} />
            Delete for me
          </button>

          {canDeleteForBoth ? (
            <button
              type="button"
              onClick={() => handleDelete('for_both')}
              disabled={Boolean(busy)}
              className="mt-2 flex min-h-[54px] w-full items-center gap-3 rounded-[14px] bg-[#fff0f1] px-4 text-left text-[13px] font-medium text-[#d13a42] disabled:opacity-50"
            >
              <Trash2 size={19} />
              Delete for both
            </button>
          ) : null}
        </Sheet>
      ) : null}
    </div>
  )
}
