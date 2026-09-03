import {
  Archive,
  BookOpen,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  EllipsisVertical,
  Folder,
  LoaderCircle,
  MessageCircle,
  Pin,
  Search,
  SquarePen,
  Trash2,
  UsersRound,
  VolumeX,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReaderProfileFooter from '../../components/reader-profile/ReaderProfileFooter'
import ChatSuggestedPeople from '../../components/chat/ChatSuggestedPeople'
import ChatNewMessageSheet from '../../components/chat/ChatNewMessageSheet'
import ChatGroupCreateSheet from '../../components/chat/ChatGroupCreateSheet'
import ReaderAuthorMessageRequestModal from '../../components/chat/ReaderAuthorMessageRequestModal'
import ReaderReaderMessageRequestModal from '../../components/chat/ReaderReaderMessageRequestModal'
import {
  addChatConversationToFolder,
  archiveChatConversation,
  clearChatHistory,
  createChatFolder,
  decideChatRequest,
  deleteChatConversation,
  getChatConversations,
  getChatQuickContacts,
  getManagedChatConversations,
  getChatFolders,
  getChatSoundSettings,
  hasReaderSession,
  markChatUnread,
  pinChatConversation,
  removeChatConversationFromFolder,
  searchChatUsers,
  unpinChatConversation,
  updateChatSoundSettings,
} from '../../services/chatApi'
import {
  muteChatConversation,
  unmuteChatConversation,
} from '../../services/chatMuteApi'

function normalizeSearchValue(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/^@+/, '')
    .replace(/[^\p{L}\p{M}\p{N}._\-\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSmartSearchScore(query, values) {
  const target = normalizeSearchValue(query)
  if (!target) return 0

  const terms = target.split(' ').filter(Boolean)
  const compactTarget = target.replace(/\s+/g, '')
  const texts = (values || [])
    .map(normalizeSearchValue)
    .filter(Boolean)
  const compactTexts = texts.map((text) =>
    text.replace(/\s+/g, '')
  )

  let score = 0

  for (const text of texts) {
    if (text === target) score = Math.max(score, 1000)
    else if (text.startsWith(target)) score = Math.max(score, 700)
    else if (text.includes(target)) score = Math.max(score, 500)
  }

  if (compactTarget !== target) {
    for (const text of compactTexts) {
      if (text === compactTarget) score = Math.max(score, 900)
      else if (text.startsWith(compactTarget)) score = Math.max(score, 650)
      else if (text.includes(compactTarget)) score = Math.max(score, 450)
    }
  }

  let matchedTerms = 0

  for (const term of terms) {
    let best = 0

    for (let index = 0; index < texts.length; index += 1) {
      const text = texts[index]
      const compactText = compactTexts[index]

      if (text === term || compactText === term) best = Math.max(best, 160)
      else if (text.startsWith(term) || compactText.startsWith(term)) {
        best = Math.max(best, 110)
      } else if (text.includes(term) || compactText.includes(term)) {
        best = Math.max(best, 70)
      }
    }

    if (best > 0) {
      matchedTerms += 1
      score += best
    }
  }

  if (terms.length > 1 && matchedTerms === terms.length) {
    score += 300
  }

  return matchedTerms > 0 || score > 0 ? score : 0
}

const CHAT_TONE_OPTIONS = [
  ['default', 'Default'],
  ['chime', 'Chime'],
  ['pop', 'Pop'],
  ['bell', 'Bell'],
]

const MUTE_OPTIONS = [
  ['1h', '1 hour'],
  ['8h', '8 hours'],
  ['1d', '1 day'],
  ['7d', '7 days'],
  ['forever', 'Until I turn it back on'],
]

function clampConversationMenuPosition(x, y) {
  const width = 224
  const height = 340
  const margin = 10

  return {
    left: Math.max(
      margin,
      Math.min(x, window.innerWidth - width - margin)
    ),
    top: Math.max(
      margin,
      Math.min(y, window.innerHeight - height - margin)
    ),
  }
}

function ConversationMenuRow({
  icon: Icon,
  label,
  danger = false,
  arrow = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 w-full items-center gap-3 px-3 text-left text-[13px] font-normal transition active:bg-[#f2f2f4] disabled:opacity-45 ${
        danger
          ? 'text-[#ef4444]'
          : 'text-[#111827]'
      }`}
    >
      <Icon size={19} strokeWidth={1.9} />
      <span className="min-w-0 flex-1">
        {label}
      </span>
      {arrow ? (
        <ChevronRight
          size={17}
          className="text-[#8b8b94]"
        />
      ) : null}
    </button>
  )
}

function formatConversationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const wasYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (wasYesterday) {
    return 'Yesterday'
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function PersonAvatar({
  person,
  size = 'h-14 w-14',
  textSize = 'text-[16px]',
}) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name ||
      person?.page_name ||
      person?.username ||
      'Shadow'
  ).trim()
  const letter = name.charAt(0).toUpperCase() || 'S'
  const avatarUrl =
    person?.avatar_url ||
    person?.profile_image_url ||
    ''

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] ${textSize} font-bold text-white`}
    >
      {avatarUrl && !failed ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

function QuickCircle({
  label,
  count = 0,
  person,
  fallback,
  online = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[70px] shrink-0 flex-col items-center"
    >
      <span className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full">
        {person ? (
          <PersonAvatar
            person={person}
            size="h-[58px] w-[58px]"
            textSize="text-[15px]"
          />
        ) : (
          fallback
        )}

        {online ? (
          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-white bg-[#22c55e]" />
        ) : null}

        {count > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] px-1 text-[10px] font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </span>

      <span className="mt-2 max-w-[70px] truncate text-[11px] font-bold text-[#33333b]">
        {label}
      </span>
    </button>
  )
}

function LoadingInbox() {
  return (
    <div className="space-y-4 px-4 py-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3"
        >
          <div className="h-14 w-14 rounded-full bg-[#efeff3]" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-32 rounded-full bg-[#e9e9ee]" />
            <div className="mt-2 h-3 w-48 max-w-full rounded-full bg-[#f1f1f4]" />
          </div>
          <div className="h-3 w-8 rounded-full bg-[#eeeef2]" />
        </div>
      ))}
    </div>
  )
}

function EmptyInbox() {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
        <MessageCircle size={30} strokeWidth={1.9} />
      </div>
      <h2 className="mt-5 text-[18px] font-bold text-[#111827]">
        No messages yet
      </h2>
      <p className="mx-auto mt-2 max-w-[290px] text-[13px] font-bold leading-6 text-[#8a8a95]">
        Your conversations with readers and authors will appear here.
      </p>
    </div>
  )
}

function EmptyRequests() {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
        <MessageCircle size={30} strokeWidth={1.9} />
      </div>
      <h2 className="mt-5 text-[18px] font-bold text-[#111827]">
        No message requests
      </h2>
      <p className="mx-auto mt-2 max-w-[290px] text-[13px] font-bold leading-6 text-[#8a8a95]">
        New requests sent to you will appear here.
      </p>
    </div>
  )
}

function EmptySearch({ query }) {
  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f4f7] text-[#777480]">
        <Search size={28} strokeWidth={1.9} />
      </div>
      <h2 className="mt-5 text-[17px] font-bold text-[#111827]">
        No results found
      </h2>
      <p className="mx-auto mt-2 max-w-[290px] text-[12px] font-bold leading-5 text-[#8a8a95]">
        No reader, author, name, or username matched “{query}”.
      </p>
    </div>
  )
}

function IncomingRequestCard({
  conversation,
  busyAction,
  onDecision,
  onOpen,
}) {
  const person = conversation?.counterpart || {}
  const preview =
    conversation?.latest_message?.body ||
    'Sent you a message request'

  return (
    <section className="mx-4 mt-4 rounded-[20px] border border-[#e8e5ee] bg-white p-4 shadow-[0_8px_24px_rgba(17,24,39,0.07)]">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="shrink-0"
        >
          <PersonAvatar
            person={person}
            size="h-12 w-12"
            textSize="text-[14px]"
          />
        </button>

        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left"
        >
          <div className="text-[10px] font-bold text-[#8b8793]">
            Message request
          </div>
          <div className="mt-0.5 truncate text-[14px] font-bold text-[#111827]">
            {person.name || 'Shadow User'}
          </div>
          <div className="mt-1 truncate text-[12px] font-bold text-[#76727f]">
            {preview}
          </div>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onDecision(conversation.id, 'decline')}
          disabled={Boolean(busyAction)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[12px] bg-[#f0eff3] text-[12px] font-bold text-[#33313a] transition active:scale-[0.98] disabled:opacity-50"
        >
          {busyAction === 'decline' ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <X size={16} />
          )}
          Decline
        </button>

        <button
          type="button"
          onClick={() => onDecision(conversation.id, 'accept')}
          disabled={Boolean(busyAction)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[12px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-[12px] font-bold text-white shadow-[0_6px_16px_rgba(124,58,237,0.2)] transition active:scale-[0.98] disabled:opacity-50"
        >
          {busyAction === 'accept' ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          Accept
        </button>
      </div>
    </section>
  )
}

function ConversationRow({
  conversation,
  selected,
  selectionMode,
  onOpen,
  onOpenContextMenu,
  onToggleSelection,
}) {
  const longPressRef = useRef(null)
  const pointerStartRef = useRef(null)
  const suppressClickRef = useRef(false)
  const person = conversation.counterpart || {}
  const latest = conversation.latest_message
  const unread = Number(conversation.unread_count || 0)
  const pending = conversation.request_status === 'pending'
  const canDecideRequest = Boolean(conversation.can_decide)

  const clearLongPress = () => {
    if (longPressRef.current) {
      window.clearTimeout(longPressRef.current)
      longPressRef.current = null
    }

    pointerStartRef.current = null
  }

  const handlePointerDown = (event) => {
    if (selectionMode || event.button > 0) return

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    longPressRef.current = window.setTimeout(() => {
      const point = pointerStartRef.current

      if (!point) return

      suppressClickRef.current = true
      onOpenContextMenu(point.x, point.y)
      longPressRef.current = null
    }, 500)
  }

  const handlePointerMove = (event) => {
    const startPoint = pointerStartRef.current
    if (!startPoint) return

    if (
      Math.abs(event.clientX - startPoint.x) > 10 ||
      Math.abs(event.clientY - startPoint.y) > 10
    ) {
      clearLongPress()
    }
  }

  const handleClick = () => {
    clearLongPress()

    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    if (selectionMode) {
      onToggleSelection()
      return
    }

    onOpen()
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
    clearLongPress()

    if (selectionMode) {
      onToggleSelection()
      return
    }

        onOpenContextMenu(
      event.clientX,
      event.clientY
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      className={`flex w-full select-none items-center gap-3 rounded-[18px] px-2 py-3 text-left transition ${
        selected
          ? 'bg-[#eef8f0]'
          : 'hover:bg-[#faf9fc] active:bg-[#f4f2f8]'
      }`}
    >
      <div className="relative">
        <PersonAvatar person={person} />

        {selected ? (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#35b44a] text-white">
            <Check size={14} strokeWidth={3} />
          </span>
        ) : person.type === 'author' ? (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-white">
            <BookOpen size={10} strokeWidth={2.4} />
          </span>
        ) : null}
      </div>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <strong className="truncate text-[15px] font-bold text-[#111827]">
            {person.name || 'Shadow User'}
          </strong>

          {pending ? (
            <span className="shrink-0 rounded-full bg-[#f2edff] px-2 py-1 text-[9px] font-bold text-[#7c3aed]">
              {canDecideRequest ? 'Request' : 'Pending'}
            </span>
          ) : null}

          {conversation.is_muted ? (
            <VolumeX
              size={14}
              strokeWidth={2}
              className="shrink-0 text-[#96929d]"
            />
          ) : null}
        </span>

        <span
          className={`mt-1 block truncate text-[13px] font-bold ${
            unread > 0 ? 'text-[#34313a]' : 'text-[#87838f]'
          }`}
        >
          {latest?.body || 'Open this conversation'}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-[10px] font-bold text-[#8f8b96]">
          {formatConversationTime(
            conversation.last_message_at || latest?.created_at
          )}
        </span>

        {unread > 0 ? (
          <span className="h-3 w-3 rounded-full bg-[#7c3aed]" />
        ) : null}
      </span>
    </button>
  )
}

function SearchPersonRow({ user, onOpen }) {
  const resultType =
    user?.result_type === 'author' || user?.author_page_id
      ? 'author'
      : 'reader'
  const name =
    user?.name || user?.page_name || user?.username || 'Shadow User'
  const username = user?.username || user?.page_username || ''

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[18px] px-2 py-3 text-left transition hover:bg-[#faf9fc] active:bg-[#f4f2f8]"
    >
      <PersonAvatar person={user} />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <strong className="truncate text-[15px] font-bold text-[#111827]">
            {name}
          </strong>
          <span className="shrink-0 rounded-full bg-[#f2edff] px-2 py-1 text-[9px] font-bold text-[#7c3aed]">
            {resultType === 'author' ? 'Author' : 'Reader'}
          </span>
        </span>

        <span className="mt-1 block truncate text-[12px] font-bold text-[#87838f]">
          {username ? `@${username}` : resultType === 'author' ? 'Author' : 'Reader'}
        </span>
      </span>

      <span className="shrink-0 text-[11px] font-bold text-[#7c3aed]">
        Message
      </span>
    </button>
  )
}

export default function ChatInboxPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const hideReaderFooter = location.state?.hideReaderFooter === true
  const searchRequestRef = useRef(0)
  const [conversations, setConversations] = useState([])
  const [archivedCount, setArchivedCount] = useState(0)
  const [quickContacts, setQuickContacts] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [groupCreateOpen, setGroupCreateOpen] = useState(false)
  const [busyRequest, setBusyRequest] = useState(null)
  const [error, setError] = useState('')
  const [searchUsers, setSearchUsers] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selectedSearchReader, setSelectedSearchReader] =
    useState(null)
  const [selectedSearchAuthor, setSelectedSearchAuthor] =
    useState(null)
  const [selectedConversationIds, setSelectedConversationIds] =
    useState(() => new Set())
  const [selectionMenuOpen, setSelectionMenuOpen] =
    useState(false)
  const [selectionBusy, setSelectionBusy] = useState('')
  const [selectionNotice, setSelectionNotice] = useState('')
  const [muteSheetOpen, setMuteSheetOpen] = useState(false)
    const [conversationMenu, setConversationMenu] =
    useState(null)
  const [conversationMenuView, setConversationMenuView] =
    useState('main')
  const [chatFolders, setChatFolders] = useState([])
const [folderLoading, setFolderLoading] =
  useState(false)

  const [soundLoading, setSoundLoading] =
  useState(false)
const [soundSettings, setSoundSettings] =
  useState({
    sound_enabled: true,
    tone: 'default',
  })

  const loadQuickContacts = useCallback(
    async ({ signal } = {}) => {
      try {
        const data = await getChatQuickContacts(
          12,
          { signal }
        )

        setQuickContacts(
          Array.isArray(data.contacts)
            ? data.contacts
            : []
        )
      } catch (error) {
        if (error?.name !== 'AbortError') {
          setQuickContacts([])
        }
      }
    },
    []
  )

  const loadConversations = useCallback(
    async ({
      silent = false,
      includeArchived = true,
      signal,
    } = {}) => {
      if (!silent) {
        setLoading(true)
      }

      try {
        const [data, archivedData] =
          await Promise.all([
            getChatConversations(
              'all',
              { signal }
            ),
            includeArchived
              ? getManagedChatConversations({
                  view: 'archived',
                  signal,
                })
              : Promise.resolve(null),
          ])

        const readerConversations =
          Array.isArray(data.conversations)
            ? data.conversations.filter(
                (item) =>
                  item.viewer_role !== 'author'
              )
            : []

        setConversations(readerConversations)

        if (includeArchived) {
          setArchivedCount(
            Array.isArray(
              archivedData?.conversations
            )
              ? archivedData.conversations.filter(
                  (item) =>
                    item.viewer_role !== 'author'
                ).length
              : 0
          )
        }

        setError('')
        return readerConversations.length
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return null
        }

        if (loadError.status === 401) {
          navigate('/login', { replace: true })
          return null
        }

        setError(
          loadError.message || 'Failed to load messages'
        )
        return null
      } finally {
        if (!silent && !signal?.aborted) {
          setLoading(false)
        }
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (!hasReaderSession()) {
      navigate('/login', { replace: true })
      return undefined
    }

    let active = true
    let refreshInFlight = false
    let lastRefreshAt = 0
    const controller = new AbortController()

    const refreshInbox = async ({
      initial = false,
      force = false,
    } = {}) => {
      if (
        refreshInFlight ||
        controller.signal.aborted
      ) {
        return
      }

      const now = Date.now()

      if (
        !force &&
        lastRefreshAt &&
        now - lastRefreshAt < 30000
      ) {
        return
      }

      refreshInFlight = true
      lastRefreshAt = now

      try {
        const conversationCount =
          await loadConversations({
            silent: !initial,
            includeArchived: true,
            signal: controller.signal,
          })

        if (
          active &&
          Number(conversationCount) > 0
        ) {
          await loadQuickContacts({
            signal: controller.signal,
          })
        }
      } finally {
        refreshInFlight = false
      }
    }

    refreshInbox({
      initial: true,
      force: true,
    })

    const handleFocus = () => {
      if (!document.hidden) {
        refreshInbox()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshInbox()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      active = false
      controller.abort()
      window.removeEventListener(
        'focus',
        handleFocus
      )
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [loadConversations, loadQuickContacts, navigate])

  const normalizedQuery = useMemo(
    () => normalizeSearchValue(query),
    [query]
  )

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      searchRequestRef.current += 1
      setSearchUsers([])
      setSearchLoading(false)
      setSearchError('')
      return undefined
    }

    const requestId = searchRequestRef.current + 1
    searchRequestRef.current = requestId

    const controller = new AbortController()

    const timeoutId = window.setTimeout(async () => {
      try {
        setSearchLoading(true)
        setSearchError('')

        const data = await searchChatUsers(
          normalizedQuery,
          20,
          { signal: controller.signal }
        )

        if (searchRequestRef.current !== requestId) {
          return
        }

        setSearchUsers(
          Array.isArray(data.users) ? data.users : []
        )
      } catch (searchFailure) {
        if (
          searchFailure?.name === 'AbortError' ||
          searchRequestRef.current !== requestId
        ) {
          return
        }

        if (searchFailure.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        setSearchUsers([])
        setSearchError(
          searchFailure.message || 'Failed to search people'
        )
      } finally {
        if (searchRequestRef.current === requestId) {
          setSearchLoading(false)
        }
      }
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [navigate, normalizedQuery])

  const unreadTotal = useMemo(
    () =>
      conversations.reduce((total, item) => {
        if (
          item.request_status === 'declined' ||
          item.request_status === 'blocked'
        ) {
          return total
        }

        const unread = Math.max(
          0,
          Number(item.unread_count || 0)
        )
        const incomingRequest =
          item.can_decide === true &&
          item.request_status === 'pending'

        return (
          total +
          (incomingRequest
            ? Math.max(1, unread)
            : unread)
        )
      }, 0),
    [conversations]
  )

  const pendingConversations = useMemo(
    () =>
      conversations.filter(
        (item) => item.request_status === 'pending'
      ),
    [conversations]
  )

  const incomingRequests = useMemo(
    () =>
      pendingConversations.filter(
        (item) => item.can_decide === true
      ),
    [pendingConversations]
  )

  const frequentContacts = useMemo(() => {
    const seen = new Set()

    return conversations
      .filter(
        (item) =>
          item.request_status === 'accepted' &&
          item.counterpart
      )
      .sort((first, second) => {
        const firstTime = new Date(
          first.last_message_at ||
            first.latest_message?.created_at ||
            first.updated_at ||
            0
        ).getTime()
        const secondTime = new Date(
          second.last_message_at ||
            second.latest_message?.created_at ||
            second.updated_at ||
            0
        ).getTime()

        return secondTime - firstTime
      })
      .filter((item) => {
        const person = item.counterpart || {}
        const key = String(
          person.author_page_id ||
            person.user_id ||
            person.username ||
            item.id
        )

        if (seen.has(key)) {
          return false
        }

        seen.add(key)
        return true
      })
      .slice(0, 12)
  }, [conversations])

  const displayedQuickContacts =
    quickContacts.length
      ? quickContacts
      : frequentContacts

  const visibleConversations = useMemo(() => {
    const ranked = []

    for (const conversation of conversations) {
      if (
        !normalizedQuery &&
        activeFilter === 'pending' &&
        conversation.can_decide !== true
      ) {
        continue
      }

      if (!normalizedQuery) {
        ranked.push({
          conversation,
          score: 0,
        })
        continue
      }

      const person = conversation.counterpart || {}
      const score = getSmartSearchScore(
        normalizedQuery,
        [
          person.username,
          person.page_username,
          person.name,
          person.page_name,
          conversation.latest_message?.body,
        ]
      )

      if (score > 0) {
        ranked.push({
          conversation,
          score,
        })
      }
    }

    if (normalizedQuery) {
      ranked.sort(
        (first, second) =>
          second.score - first.score
      )
    } else {
      ranked.sort(
        (first, second) =>
          Number(Boolean(second.conversation.is_pinned)) -
          Number(Boolean(first.conversation.is_pinned))
      )
    }
    return ranked.map(
      (item) => item.conversation
    )
  }, [activeFilter, conversations, normalizedQuery])

  const peopleResults = useMemo(() => {
    const existingReaderIds = new Set()
    const existingReaderUsernames = new Set()
    const existingAuthorPageIds = new Set()

    for (const conversation of conversations) {
      const person = conversation.counterpart || {}
      const isAuthorConversation =
        conversation.conversation_type === 'reader_author' ||
        person.type === 'author' ||
        Boolean(
          conversation.author_page_id ||
            person.author_page_id
        )

      if (isAuthorConversation) {
        const authorPageId =
          conversation.author_page_id ||
          person.author_page_id

        if (authorPageId) {
          existingAuthorPageIds.add(
            String(authorPageId)
          )
        }

        continue
      }

      if (person.user_id) {
        existingReaderIds.add(
          String(person.user_id)
        )
      }

      if (person.username) {
        existingReaderUsernames.add(
          String(person.username).toLowerCase()
        )
      }
    }

    return searchUsers.filter((user) => {
      const isAuthorResult =
        user.result_type === 'author' ||
        Boolean(user.author_page_id)

      if (isAuthorResult) {
        const authorPageId =
          user.author_page_id || user.id

        return !existingAuthorPageIds.has(
          String(authorPageId || '')
        )
      }

      const userId = user.user_id || user.id
      const username = String(
        user.username || ''
      ).toLowerCase()

      if (
        userId &&
        existingReaderIds.has(String(userId))
      ) {
        return false
      }

      if (
        username &&
        existingReaderUsernames.has(username)
      ) {
        return false
      }

      return true
    })
  }, [conversations, searchUsers])

  const handleDecision = async (conversationId, action) => {
    if (busyRequest) return

    setBusyRequest({ conversationId, action })

    try {
      const data = await decideChatRequest(
        conversationId,
        action
      )

      if (data.conversation) {
        setConversations((current) =>
          current.map((item) =>
            item.id === conversationId
              ? data.conversation
              : item
          )
        )
      } else {
        await loadConversations({ silent: true })
      }

      await loadQuickContacts()
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      setError('')
    } catch (decisionError) {
      setError(
        decisionError.message || 'Failed to update request'
      )
    } finally {
      setBusyRequest(null)
    }
  }

  const chooseRequestFilter = () => {
    setQuery('')
    setActiveFilter((current) =>
      current === 'pending' ? 'all' : 'pending'
    )
  }

  const openSearchPerson = (user) => {
    if (user?.conversation_id) {
      navigate(`/chat/${user.conversation_id}`)
      return
    }

    if (user?.counterpart && user?.id) {
      navigate(`/chat/${user.id}`)
      return
    }

    const isAuthorTarget =
      user?.result_type === 'author' ||
      user?.type === 'author' ||
      Boolean(user?.author_page_id)
    const authorPageId = isAuthorTarget
      ? user.author_page_id || user.id
      : ''
    const userId = isAuthorTarget
      ? user.user_id || ''
      : user.user_id || user.id
    const username = String(
      user.username || user.page_username || ''
    ).toLowerCase()

    const existing = conversations.find((conversation) => {
      const person = conversation.counterpart || {}

      if (isAuthorTarget) {
        return (
          authorPageId &&
          String(
            conversation.author_page_id ||
              person.author_page_id ||
              ''
          ) === String(authorPageId)
        )
      }

      return (
        conversation.conversation_type ===
          'reader_reader' &&
        ((userId &&
          String(person.user_id || '') ===
            String(userId)) ||
          (username &&
            String(
              person.username || ''
            ).toLowerCase() === username))
      )
    })

    if (existing?.id) {
      navigate(`/chat/${existing.id}`)
      return
    }

    if (isAuthorTarget && authorPageId) {
      setSelectedSearchAuthor({
        id: authorPageId,
        page_name:
          user.page_name || user.name || 'Author',
        page_username:
          user.page_username || user.username || '',
        avatar_url: user.avatar_url || null,
      })
      return
    }

    if (!userId) {
      setError('Reader profile is not available')
      return
    }

    setSelectedSearchReader({
      ...user,
      id: userId,
      name:
        user.name ||
        user.page_name ||
        'Shadow Reader',
      username:
        user.username || user.page_username || '',
    })
  }

  const selectionMode =
    selectedConversationIds.size > 0

  const selectedConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        selectedConversationIds.has(
          String(conversation.id)
        )
      ),
    [conversations, selectedConversationIds]
  )

  const allSelectedMuted =
    selectedConversations.length > 0 &&
    selectedConversations.every(
      (conversation) =>
        Boolean(conversation.is_muted)
    )

  const clearConversationSelection = () => {
    setSelectedConversationIds(new Set())
    setSelectionMenuOpen(false)
    setMuteSheetOpen(false)
  }

  const startConversationSelection = (
    conversationId
  ) => {
    setQuery('')
    setActiveFilter('all')
    setNewMessageOpen(false)
    setSelectionMenuOpen(false)
    setMuteSheetOpen(false)
    setSelectedConversationIds(
      new Set([String(conversationId)])
    )
  }

  const toggleConversationSelection = (
    conversationId
  ) => {
    const key = String(conversationId)

    setSelectedConversationIds((current) => {
      const next = new Set(current)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }

  const showSelectionNotice = (message) => {
    setSelectionMenuOpen(false)
    setSelectionNotice(message)

    window.setTimeout(() => {
      setSelectionNotice('')
    }, 2200)
  }

    const closeConversationMenu = () => {
    setConversationMenu(null)
    setConversationMenuView('main')
  }

  const openConversationMenu = (
    conversation,
    x,
    y
  ) => {
    const position =
      clampConversationMenuPosition(x, y)

    setConversationMenu({
      conversation,
      ...position,
    })
    setConversationMenuView('main')
  }

  const showConversationMenuNotice = (
    message
  ) => {
    closeConversationMenu()
    showSelectionNotice(message)
  }

    const handleOpenMuteSettings = async () => {
    if (
      conversationMenu?.conversation?.is_muted
    ) {
      handleMenuUnmute()
      return
    }

    const id =
      conversationMenu?.conversation?.id

    if (!id) return

    setConversationMenuView('mute')
    setSoundLoading(true)

    try {
      const data = await getChatSoundSettings(id)
      setSoundSettings({
        sound_enabled:
          data.sound_enabled !== false,
        tone: data.tone || 'default',
      })
    } catch (actionError) {
      showConversationMenuNotice(
        actionError.message ||
          'Failed to load sound settings'
      )
    } finally {
      setSoundLoading(false)
    }
  }

  const handleToggleChatSound = async () => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    const nextEnabled =
      !soundSettings.sound_enabled

    setSelectionBusy('menu-sound')

    try {
      const data =
        await updateChatSoundSettings(id, {
          sound_enabled: nextEnabled,
        })

      setSoundSettings((current) => ({
        ...current,
        sound_enabled:
          data.sound_enabled !== false,
      }))

      await loadConversations({
        silent: true,
      })
    } catch (actionError) {
      showConversationMenuNotice(
        actionError.message ||
          'Failed to update sound'
      )
    } finally {
      setSelectionBusy('')
    }
  }

  const handleSelectChatTone = async (tone) => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    setSelectionBusy('menu-tone')

    try {
      const data =
        await updateChatSoundSettings(id, {
          tone,
        })

      setSoundSettings((current) => ({
        ...current,
        tone: data.tone || tone,
      }))

      await loadConversations({
        silent: true,
      })
    } catch (actionError) {
      showConversationMenuNotice(
        actionError.message ||
          'Failed to update tone'
      )
    } finally {
      setSelectionBusy('')
    }
  }


    const handleOpenFolderMenu = async () => {
    const id =
      conversationMenu?.conversation?.id

    if (!id) return

    setConversationMenuView('folder')
    setFolderLoading(true)

    try {
      const data = await getChatFolders(id)
      setChatFolders(
        Array.isArray(data.folders)
          ? data.folders
          : []
      )
    } catch (actionError) {
      showConversationMenuNotice(
        actionError.message ||
          'Failed to load folders'
      )
    } finally {
      setFolderLoading(false)
    }
  }

  const handleFolderToggle = async (folder) => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || !folder?.id || selectionBusy) {
      return
    }

    setSelectionBusy('menu-folder')

    try {
      if (folder.is_added) {
        await removeChatConversationFromFolder(
          folder.id,
          id
        )
      } else {
        await addChatConversationToFolder(
          folder.id,
          id
        )
      }

      setChatFolders((current) =>
        current.map((item) =>
          item.id === folder.id
            ? {
                ...item,
                is_added: !folder.is_added,
              }
            : item
        )
      )
    } catch (actionError) {
      showConversationMenuNotice(
        actionError.message ||
          'Failed to update folder'
      )
    } finally {
      setSelectionBusy('')
    }
  }

  const handleCreateFolder = async () => {
    if (selectionBusy) return

    const name = window.prompt(
      'New folder name'
    )

    if (name === null) return

    const safeName = name.trim()

    if (!safeName) {
      showConversationMenuNotice(
        'Folder name is required'
      )
      return
    }

    setSelectionBusy('menu-folder-create')

    try {
      await createChatFolder(safeName)

      const id =
        conversationMenu?.conversation?.id
      const data = await getChatFolders(id)

      setChatFolders(
        Array.isArray(data.folders)
          ? data.folders
          : []
      )
    } catch (actionError) {
      showConversationMenuNotice(
        actionError.message ||
          'Failed to create folder'
      )
    } finally {
      setSelectionBusy('')
    }
  }

    const handleMenuClearHistory = async () => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    if (
      !window.confirm(
        'Clear all message history for this chat?'
      )
    ) {
      return
    }

    setSelectionBusy('menu-clear-history')

    try {
      await clearChatHistory(id)
      closeConversationMenu()
      await loadConversations({
        silent: true,
      })
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice('Chat history cleared')
    } catch (actionError) {
      closeConversationMenu()
      showSelectionNotice(
        actionError.message ||
          'Failed to clear chat history'
      )
    } finally {
      setSelectionBusy('')
    }
  }

    const handleMenuMarkUnread = async () => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    setSelectionBusy('menu-unread')

    try {
      await markChatUnread(id)
      closeConversationMenu()
      await loadConversations({
        silent: true,
      })
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice('Marked as unread')
    } catch (actionError) {
      closeConversationMenu()
      showSelectionNotice(
        actionError.message ||
          'Failed to mark as unread'
      )
    } finally {
      setSelectionBusy('')
    }
  }

    const handleMenuPinToggle = async () => {
    const target =
      conversationMenu?.conversation

    if (!target?.id || selectionBusy) return

    const unpinning = Boolean(target.is_pinned)
    setSelectionBusy(
      unpinning ? 'menu-unpin' : 'menu-pin'
    )

    try {
      if (unpinning) {
        await unpinChatConversation(target.id)
      } else {
        await pinChatConversation(target.id)
      }

      closeConversationMenu()
      await loadConversations({
        silent: true,
      })
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice(
        unpinning ? 'Chat unpinned' : 'Chat pinned'
      )
    } catch (actionError) {
      closeConversationMenu()
      showSelectionNotice(
        actionError.message ||
          'Failed to update pin'
      )
    } finally {
      setSelectionBusy('')
    }
  }

  const handleMenuArchive = async () => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    setSelectionBusy('menu-archive')

    try {
      await archiveChatConversation(id)
      closeConversationMenu()
      await loadConversations({
        silent: true,
      })
      await loadQuickContacts()
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice('Chat archived')
    } catch (actionError) {
      setError(
        actionError.message ||
          'Failed to archive chat'
      )
    } finally {
      setSelectionBusy('')
    }
  }

  const handleMenuMute = async (
    duration
  ) => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    setSelectionBusy('menu-mute')

    try {
      await muteChatConversation(
        id,
        duration
      )
      closeConversationMenu()
      await loadConversations({
        silent: true,
      })
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice(
        'Notifications muted'
      )
    } catch (actionError) {
      setError(
        actionError.message ||
          'Failed to mute chat'
      )
    } finally {
      setSelectionBusy('')
    }
  }

  const handleMenuUnmute = async () => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    setSelectionBusy('menu-unmute')

    try {
      await unmuteChatConversation(id)
      closeConversationMenu()
      await loadConversations({
        silent: true,
      })
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice(
        'Notifications unmuted'
      )
    } catch (actionError) {
      setError(
        actionError.message ||
          'Failed to unmute chat'
      )
    } finally {
      setSelectionBusy('')
    }
  }

  const handleMenuDelete = async () => {
    const id =
      conversationMenu?.conversation?.id

    if (!id || selectionBusy) return

    if (
      !window.confirm(
        'Delete this chat from your inbox?'
      )
    ) {
      return
    }

    setSelectionBusy('menu-delete')

    try {
      await deleteChatConversation(
        id,
        'for_me'
      )
      closeConversationMenu()
      await loadConversations({
        silent: true,
      })
      await loadQuickContacts()
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
    } catch (actionError) {
      setError(
        actionError.message ||
          'Failed to delete chat'
      )
    } finally {
      setSelectionBusy('')
    }
  }

  const handleMuteSelected = async (duration) => {
    if (
      selectionBusy ||
      !selectedConversationIds.size
    ) {
      return
    }

    const ids = [...selectedConversationIds]
    setSelectionBusy('mute')
    setMuteSheetOpen(false)

    try {
      await Promise.all(
        ids.map((id) =>
          muteChatConversation(id, duration)
        )
      )
      clearConversationSelection()
      await loadConversations({ silent: true })
      await loadQuickContacts()
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice(
        ids.length === 1
          ? 'Chat muted'
          : `${ids.length} chats muted`
      )
    } catch (muteError) {
      setError(
        muteError.message ||
          'Failed to mute selected chats'
      )
      await loadConversations({ silent: true })
    } finally {
      setSelectionBusy('')
    }
  }

  const handleUnmuteSelected = async () => {
    if (
      selectionBusy ||
      !selectedConversationIds.size
    ) {
      return
    }

    const ids = [...selectedConversationIds]
    setSelectionBusy('unmute')

    try {
      await Promise.all(
        ids.map((id) =>
          unmuteChatConversation(id)
        )
      )
      clearConversationSelection()
      await loadConversations({ silent: true })
      await loadQuickContacts()
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      showSelectionNotice(
        ids.length === 1
          ? 'Chat unmuted'
          : `${ids.length} chats unmuted`
      )
    } catch (muteError) {
      setError(
        muteError.message ||
          'Failed to unmute selected chats'
      )
      await loadConversations({ silent: true })
    } finally {
      setSelectionBusy('')
    }
  }

  const handleArchiveSelected = async () => {
    if (
      selectionBusy ||
      !selectedConversationIds.size
    ) {
      return
    }

    const ids = [...selectedConversationIds]
    setSelectionBusy('archive')

    try {
      await Promise.all(
        ids.map((id) =>
          archiveChatConversation(id)
        )
      )
      clearConversationSelection()
      await loadConversations({ silent: true })
      await loadQuickContacts()
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
    } catch (archiveError) {
      setError(
        archiveError.message ||
          'Failed to archive selected chats'
      )
      await loadConversations({ silent: true })
      clearConversationSelection()
    } finally {
      setSelectionBusy('')
    }
  }

  const handleDeleteSelected = async () => {
    if (
      selectionBusy ||
      !selectedConversationIds.size
    ) {
      return
    }

    const count = selectedConversationIds.size

    if (
      !window.confirm(
        `Delete ${count} chat${
          count === 1 ? '' : 's'
        } from your inbox?`
      )
    ) {
      return
    }

    const ids = [...selectedConversationIds]
    setSelectionBusy('delete')

    try {
      await Promise.all(
        ids.map((id) =>
          deleteChatConversation(
            id,
            'for_me'
          )
        )
      )
      clearConversationSelection()
      await loadConversations({ silent: true })
      await loadQuickContacts()
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
    } catch (deleteError) {
      setError(
        deleteError.message ||
          'Failed to delete selected chats'
      )
      await loadConversations({ silent: true })
      clearConversationSelection()
    } finally {
      setSelectionBusy('')
    }
  }

  const hasSearch = Boolean(normalizedQuery)
  const hasAnySearchResult =
    visibleConversations.length > 0 || peopleResults.length > 0

  return (
    <div className="app-page chat-inbox-page min-h-screen pb-[92px]">
      <style>{`
        .shadow-chat-scroll::-webkit-scrollbar{display:none}
        .shadow-chat-scroll{-ms-overflow-style:none;scrollbar-width:none}

        html.dark .chat-inbox-page {
          background: var(--shadow-bg-page);
          color: var(--shadow-text-primary);
        }

        html.dark .chat-inbox-page [class~="bg-white"],
        html.dark .chat-inbox-page [class~="bg-white/95"] {
          background-color: var(--shadow-bg-surface) !important;
        }

        html.dark .chat-inbox-page [class~="focus:bg-white"]:focus {
          background-color: var(--shadow-input-bg) !important;
        }

        html.dark .chat-inbox-page [class~="text-[#111827]"],
        html.dark .chat-inbox-page [class~="text-[#33333b]"],
        html.dark .chat-inbox-page [class~="text-[#33313a]"],
        html.dark .chat-inbox-page [class~="text-[#34313a]"] {
          color: var(--shadow-text-primary) !important;
        }

        html.dark .chat-inbox-page [class~="text-[#55515e]"],
        html.dark .chat-inbox-page [class~="text-[#555560]"],
        html.dark .chat-inbox-page [class~="text-[#666970]"],
        html.dark .chat-inbox-page [class~="text-[#756f7d]"],
        html.dark .chat-inbox-page [class~="text-[#76727f]"],
        html.dark .chat-inbox-page [class~="text-[#777480]"],
        html.dark .chat-inbox-page [class~="text-[#85818c]"],
        html.dark .chat-inbox-page [class~="text-[#85888e]"],
        html.dark .chat-inbox-page [class~="text-[#87838f]"],
        html.dark .chat-inbox-page [class~="text-[#8a8792]"],
        html.dark .chat-inbox-page [class~="text-[#8a8a95]"],
        html.dark .chat-inbox-page [class~="text-[#8b8793]"],
        html.dark .chat-inbox-page [class~="text-[#8b8b94]"],
        html.dark .chat-inbox-page [class~="text-[#8d94a1]"],
        html.dark .chat-inbox-page [class~="text-[#8D94A1]"],
        html.dark .chat-inbox-page [class~="text-[#8e8b96]"],
        html.dark .chat-inbox-page [class~="text-[#8f8b96]"],
        html.dark .chat-inbox-page [class~="text-[#92929b]"],
        html.dark .chat-inbox-page [class~="text-[#94919b]"],
        html.dark .chat-inbox-page [class~="text-[#96929d]"],
        html.dark .chat-inbox-page [class~="text-[#98a2b3]"],
        html.dark .chat-inbox-page [class~="text-[#9a96a2]"],
        html.dark .chat-inbox-page [class~="text-[#a0a0aa]"],
        html.dark .chat-inbox-page [class~="text-[#5d5868]"] {
          color: var(--shadow-text-secondary) !important;
        }

        html.dark .chat-inbox-page [class~="placeholder:text-[#8e8b96]"]::placeholder,
        html.dark .chat-inbox-page [class~="placeholder:text-[#94919b]"]::placeholder,
        html.dark .chat-inbox-page [class~="placeholder:text-[#9a96a2]"]::placeholder {
          color: var(--shadow-placeholder) !important;
        }

        html.dark .chat-inbox-page [class~="bg-[#efeff3]"],
        html.dark .chat-inbox-page [class~="bg-[#e9e9ee]"],
        html.dark .chat-inbox-page [class~="bg-[#eeeef2]"],
        html.dark .chat-inbox-page [class~="bg-[#eeeeF2]"],
        html.dark .chat-inbox-page [class~="bg-[#f0eff3]"],
        html.dark .chat-inbox-page [class~="bg-[#f0f0f3]"],
        html.dark .chat-inbox-page [class~="bg-[#f1f1f4]"],
        html.dark .chat-inbox-page [class~="bg-[#f2f2f4]"],
        html.dark .chat-inbox-page [class~="bg-[#f3f2f6]"],
        html.dark .chat-inbox-page [class~="bg-[#f3f3f6]"],
        html.dark .chat-inbox-page [class~="bg-[#f3f4f6]"],
        html.dark .chat-inbox-page [class~="bg-[#f4f4f5]"],
        html.dark .chat-inbox-page [class~="bg-[#f4f4f6]"],
        html.dark .chat-inbox-page [class~="bg-[#f4f4f7]"],
        html.dark .chat-inbox-page [class~="bg-[#f5f5f5]"],
        html.dark .chat-inbox-page [class~="bg-[#f5f5f7]"],
        html.dark .chat-inbox-page [class~="bg-[#f6f6f8]"],
        html.dark .chat-inbox-page [class~="bg-[#faf9fc]"] {
          background-color: var(--shadow-bg-soft) !important;
        }

        html.dark .chat-inbox-page [class~="bg-[#f2edff]"],
        html.dark .chat-inbox-page [class~="bg-[#f4f1fb]"],
        html.dark .chat-inbox-page [class~="bg-[#f6f2ff]"],
        html.dark .chat-inbox-page [class~="bg-[#f6f3fb]"] {
          background-color: rgb(124 58 237 / 0.14) !important;
        }

        html.dark .chat-inbox-page [class~="bg-[#eef8f0]"] {
          background-color: rgb(34 197 94 / 0.12) !important;
        }

        html.dark .chat-inbox-page [class~="bg-[#fff0f1]"],
        html.dark .chat-inbox-page [class~="bg-[#fff1f1]"] {
          background-color: rgb(229 72 77 / 0.12) !important;
        }

        html.dark .chat-inbox-page [class~="text-[#c7353d]"],
        html.dark .chat-inbox-page [class~="text-[#d13a42]"] {
          color: #fca5a5 !important;
        }

        html.dark .chat-inbox-page [class~="border-white"] {
          border-color: var(--shadow-bg-surface) !important;
        }

        html.dark .chat-inbox-page [class~="border-[#e8e5ee]"],
        html.dark .chat-inbox-page [class~="border-[#ececef]"],
        html.dark .chat-inbox-page [class~="border-[#ececf0]"],
        html.dark .chat-inbox-page [class~="border-[#eeeeF2]"],
        html.dark .chat-inbox-page [class~="border-[#f0f0f3]"],
        html.dark .chat-inbox-page [class~="border-[#f4f4f6]"],
        html.dark .chat-inbox-page [class~="border-[#e4e4e8]"],
        html.dark .chat-inbox-page [class~="border-[#ddd9e6]"],
        html.dark .chat-inbox-page [class~="border-[#d8d6df]"],
        html.dark .chat-inbox-page [class~="border-[#d6d4dc]"] {
          border-color: var(--shadow-border) !important;
        }

        html.dark .chat-inbox-page [class~="bg-[#d6d4dc]"],
        html.dark .chat-inbox-page [class~="bg-[#d7d7dc]"] {
          background-color: var(--shadow-border-strong) !important;
        }

        html.dark .chat-inbox-page [class~="active:bg-[#f2f2f4]"]:active,
        html.dark .chat-inbox-page [class~="active:bg-[#f3f2f6]"]:active,
        html.dark .chat-inbox-page [class~="active:bg-[#f3f4f6]"]:active,
        html.dark .chat-inbox-page [class~="active:bg-[#f4f2f8]"]:active,
        html.dark .chat-inbox-page [class~="active:bg-[#f4f4f5]"]:active,
        html.dark .chat-inbox-page [class~="active:bg-[#f5f5f7]"]:active,
        html.dark .chat-inbox-page [class~="active:bg-[#ececf0]"]:active,
        html.dark .chat-inbox-page [class~="hover:bg-[#faf9fc]"]:hover {
          background-color: var(--shadow-bg-hover) !important;
        }

        html.dark .chat-inbox-page input,
        html.dark .chat-inbox-page textarea {
          color: var(--shadow-text-primary);
          caret-color: var(--shadow-text-primary);
        }

        html.dark .chat-inbox-page [class~="bg-[#f4f4f7]"][class*="input"],
        html.dark .chat-inbox-page input[class~="bg-[#f4f4f7]"],
        html.dark .chat-inbox-page textarea[class~="bg-[#faf9fc]"] {
          background-color: var(--shadow-input-bg) !important;
          border-color: var(--shadow-border) !important;
        }
      `}</style>

      <header className="sticky top-0 z-[70] bg-white/95 backdrop-blur-xl">
        <div
          className={`relative mx-auto max-w-[620px] px-4 ${
            selectionMode ? 'py-2' : 'pb-4 pt-4'
          }`}
        >
          {selectionMode ? (
            <div className="flex h-[48px] items-center gap-2">
              <button
                type="button"
                onClick={clearConversationSelection}
                aria-label="Exit selection"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
              >
                <X size={25} />
              </button>

              <div className="min-w-[36px] text-[20px] font-semibold text-[#111827]">
                {selectedConversationIds.size}
              </div>

              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (allSelectedMuted) {
                      handleUnmuteSelected()
                      return
                    }

                    setMuteSheetOpen(true)
                  }}
                  disabled={Boolean(selectionBusy)}
                  aria-label={
                    allSelectedMuted
                      ? 'Unmute selected chats'
                      : 'Mute selected chats'
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6] disabled:opacity-40"
                >
                  {selectionBusy === 'mute' ||
                  selectionBusy === 'unmute' ? (
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <VolumeX size={21} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleArchiveSelected}
                  disabled={Boolean(selectionBusy)}
                  aria-label="Archive selected chats"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6] disabled:opacity-40"
                >
                  {selectionBusy === 'archive' ? (
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <Archive size={21} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={Boolean(selectionBusy)}
                  aria-label="Delete selected chats"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6] disabled:opacity-40"
                >
                  {selectionBusy === 'delete' ? (
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={21} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectionMenuOpen(
                      (current) => !current
                    )
                  }
                  aria-label="More selected chat actions"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
                >
                  <EllipsisVertical size={22} />
                </button>
              </div>

              {selectionMenuOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Close selection menu"
                    onClick={() =>
                      setSelectionMenuOpen(false)
                    }
                    className="fixed inset-0 z-[74]"
                  />

                  <div className="absolute right-4 top-[58px] z-[75] w-[210px] overflow-hidden rounded-[16px] bg-white py-1 shadow-[0_14px_38px_rgba(17,24,39,0.16)]">
                    <button
                      type="button"
                      onClick={() =>
                        showSelectionNotice(
                          'Saved Messages is coming soon.'
                        )
                      }
                      className="flex h-12 w-full items-center gap-3 px-4 text-left text-[14px] font-normal text-[#111827] active:bg-[#f5f5f7]"
                    >
                      <Bookmark size={20} />
                      Saved Messages
                    </button>

                    <button
  type="button"
  onClick={() => {
    setSelectionMenuOpen(false)
    setSelectedConversationIds(new Set())
    setGroupCreateOpen(true)
  }}
  className="flex h-12 w-full items-center gap-3 px-4 text-left text-[14px] font-normal text-[#111827] active:bg-[#f5f5f7]"
>
  <UsersRound size={20} />
  New Group
</button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-[25px] font-bold tracking-[-0.03em] text-[#111827]">
                    Messages
                  </h1>

                  <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-[#8a8792]">
                    <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                    {unreadTotal} unread
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNewMessageOpen(true)
                  }
                  aria-label="New message"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f1fb] text-[#7c3aed] transition active:scale-90"
                >
                  <SquarePen
                    size={21}
                    strokeWidth={2.2}
                  />
                </button>
              </div>

              <div className="relative mt-4">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777480]"
                />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value.slice(
                        0,
                        50
                      )
                    )
                  }
                  placeholder="Search by name or username"
                  className="h-[46px] w-full rounded-full border border-transparent bg-[#f4f4f7] pl-11 pr-4 text-[14px] font-normal text-[#111827] outline-none transition placeholder:font-normal placeholder:text-[#8e8b96] focus:border-[#d9cdf8] focus:bg-white"
                />
              </div>

              <div className="shadow-chat-scroll -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
                <QuickCircle
                  label="Request"
                  count={incomingRequests.length}
                  onClick={chooseRequestFilter}
                  fallback={
                    <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#f1f1f4] text-[#7c3aed]">
                      <MessageCircle
                        size={26}
                        strokeWidth={2}
                      />
                    </span>
                  }
                />

                {displayedQuickContacts.map(
                  (contact) => {
                    const quickPerson =
                      contact.counterpart ||
                      contact

                    return (
                      <QuickCircle
                        key={
                          contact.key ||
                          contact.conversation_id ||
                          `${
                            contact.type ||
                            'reader'
                          }:${
                            contact.author_page_id ||
                            contact.user_id ||
                            contact.id
                          }`
                        }
                        label={
                          quickPerson.name ||
                          quickPerson.username ||
                          'Shadow'
                        }
                        person={quickPerson}
                        online={Boolean(
                          contact.is_online ||
                            quickPerson.is_online
                        )}
                        onClick={() =>
                          openSearchPerson(
                            contact
                          )
                        }
                      />
                    )
                  }
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {selectionNotice ? (
        <div className="fixed left-1/2 top-[72px] z-[110] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[11px] font-normal text-white">
          {selectionNotice}
        </div>
      ) : null}

      {muteSheetOpen ? (
        <>
          <button
            type="button"
            aria-label="Close mute options"
            onClick={() => setMuteSheetOpen(false)}
            className="fixed inset-0 z-[118] bg-black/30"
          />

          <section className="fixed inset-x-0 bottom-0 z-[119] mx-auto w-full max-w-[620px] rounded-t-[24px] bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-4 shadow-[0_-14px_36px_rgba(17,24,39,0.14)]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d7d7dc]" />
            <h2 className="px-1 text-[16px] font-semibold text-[#111827]">
              Mute notifications
            </h2>
            <p className="mt-1 px-1 text-[11px] font-normal text-[#85818c]">
              Choose how long to mute the selected chat.
            </p>

            <div className="mt-3 overflow-hidden rounded-[16px] bg-[#f6f6f8]">
              {MUTE_OPTIONS.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    handleMuteSelected(value)
                  }
                  disabled={Boolean(selectionBusy)}
                  className="flex h-12 w-full items-center gap-3 border-b border-white px-4 text-left text-[14px] font-normal text-[#111827] last:border-b-0 active:bg-[#ececf0] disabled:opacity-50"
                >
                  <VolumeX size={19} />
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMuteSheetOpen(false)}
              className="mt-3 h-11 w-full rounded-[14px] bg-[#f0f0f3] text-[13px] font-semibold text-[#555560]"
            >
              Cancel
            </button>
          </section>
        </>
      ) : null}

            {conversationMenu ? (
        <>
          <button
            type="button"
            aria-label="Close chat menu"
            onClick={closeConversationMenu}
            className="fixed inset-0 z-[124]"
          />

          <div
            className="fixed z-[125] w-[224px] overflow-hidden rounded-[12px] border border-[#e4e4e8] bg-white py-1 shadow-[0_12px_35px_rgba(17,24,39,0.2)]"
            style={{
              left: conversationMenu.left,
              top: conversationMenu.top,
            }}
          >
            {conversationMenuView ===
            'main' ? (
              <>
                <ConversationMenuRow
                  icon={Archive}
                  label="Archive"
                  disabled={Boolean(
                    selectionBusy
                  )}
                  onClick={handleMenuArchive}
                />

                <ConversationMenuRow
  icon={Pin}
  label={
    conversationMenu.conversation?.is_pinned
      ? 'Unpin'
      : 'Pin'
  }
  disabled={Boolean(selectionBusy)}
  onClick={handleMenuPinToggle}
/>

                <ConversationMenuRow
  icon={VolumeX}
  label={
    conversationMenu
      .conversation
      ?.is_muted
      ? 'Unmute notifications'
      : 'Mute notifications'
  }
  arrow={
    !conversationMenu
      .conversation
      ?.is_muted
  }
  onClick={handleOpenMuteSettings}
/>

                <ConversationMenuRow
  icon={Circle}
  label="Mark as unread"
  disabled={Boolean(selectionBusy)}
  onClick={handleMenuMarkUnread}
/>
                <ConversationMenuRow
  icon={Folder}
  label="Add to folder"
  arrow
  onClick={handleOpenFolderMenu}
/>

                <ConversationMenuRow
  icon={X}
  label="Clear history"
  disabled={Boolean(selectionBusy)}
  onClick={handleMenuClearHistory}
/>

                <div className="my-1 h-px bg-[#ececef]" />

                <ConversationMenuRow
                  icon={Trash2}
                  label="Delete chat"
                  danger
                  disabled={Boolean(
                    selectionBusy
                  )}
                  onClick={handleMenuDelete}
                />
              </>
            ) : null}

                        {conversationMenuView ===
            'tone' ? (
              <>
                <ConversationMenuRow
                  icon={ChevronLeft}
                  label="Select tone"
                  onClick={() =>
                    setConversationMenuView(
                      'mute'
                    )
                  }
                />

                <div className="my-1 h-px bg-[#ececef]" />

                {CHAT_TONE_OPTIONS.map(
                  ([value, label]) => (
                    <ConversationMenuRow
                      key={value}
                      icon={
                        soundSettings.tone ===
                        value
                          ? Check
                          : Circle
                      }
                      label={label}
                      disabled={Boolean(
                        selectionBusy
                      )}
                      onClick={() =>
                        handleSelectChatTone(
                          value
                        )
                      }
                    />
                  )
                )}
              </>
            ) : null}


            {conversationMenuView ===
            'mute' ? (
              <>
                <ConversationMenuRow
                  icon={ChevronLeft}
                  label="Mute notifications"
                  onClick={() =>
                    setConversationMenuView(
                      'main'
                    )
                  }
                />

                <div className="my-1 h-px bg-[#ececef]" />

                
                {soundLoading ? (
                  <div className="flex h-12 items-center justify-center text-[#7c3aed]">
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  </div>
                ) : (
                  <>
                    <ConversationMenuRow
                      icon={Circle}
                      label="Select tone"
                      arrow
                      onClick={() =>
                        setConversationMenuView(
                          'tone'
                        )
                      }
                    />

                    <ConversationMenuRow
                      icon={VolumeX}
                      label={
                        soundSettings.sound_enabled
                          ? 'Disable sound'
                          : 'Enable sound'
                      }
                      disabled={Boolean(
                        selectionBusy
                      )}
                      onClick={
                        handleToggleChatSound
                      }
                    />

                    <ConversationMenuRow
                      icon={VolumeX}
                      label="Mute for..."
                      arrow
                      onClick={() =>
                        setConversationMenuView(
                          'mute-duration'
                        )
                      }
                    />

                    <ConversationMenuRow
                      icon={VolumeX}
                      label="Mute forever"
                      danger
                      disabled={Boolean(
                        selectionBusy
                      )}
                      onClick={() =>
                        handleMenuMute(
                          'forever'
                        )
                      }
                    />
                  </>
                )}

                
              </>
            ) : null}

            {conversationMenuView ===
            'mute-duration' ? (
              <>
                <ConversationMenuRow
                  icon={ChevronLeft}
                  label="Mute for..."
                  onClick={() =>
                    setConversationMenuView(
                      'mute'
                    )
                  }
                />

                <div className="my-1 h-px bg-[#ececef]" />

                {MUTE_OPTIONS.filter(
                  ([value]) =>
                    value !== 'forever'
                ).map(
                  ([value, label]) => (
                    <ConversationMenuRow
                      key={value}
                      icon={VolumeX}
                      label={label}
                      disabled={Boolean(
                        selectionBusy
                      )}
                      onClick={() =>
                        handleMenuMute(
                          value
                        )
                      }
                    />
                  )
                )}
              </>
            ) : null}

            {conversationMenuView ===
            'folder' ? (
              <>
                <ConversationMenuRow
                  icon={ChevronLeft}
                  label="Add to folder"
                  onClick={() =>
                    setConversationMenuView(
                      'main'
                    )
                  }
                />

                <div className="my-1 h-px bg-[#ececef]" />
                {folderLoading ? (
                  <div className="flex h-12 items-center justify-center text-[#7c3aed]">
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  </div>
                ) : chatFolders.length ? (
                  chatFolders.map((folder) => (
                    <ConversationMenuRow
                      key={folder.id}
                      icon={
                        folder.is_added
                          ? Check
                          : Folder
                      }
                      label={folder.name}
                      disabled={Boolean(
                        selectionBusy
                      )}
                      onClick={() =>
                        handleFolderToggle(folder)
                      }
                    />
                  ))
                ) : (
                  <div className="px-4 py-3 text-[11px] text-[#92929b]">
                    No folders yet
                  </div>
                )}

                <ConversationMenuRow
                  icon={Folder}
                  label="Create new folder"
                  disabled={Boolean(selectionBusy)}
                  onClick={handleCreateFolder}
                />

                
              </>
            ) : null}
          </div>
        </>
      ) : null}

      <main className="mx-auto max-w-[620px]">
        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-4 block w-[calc(100%_-_2rem)] rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[11px] font-bold text-[#c7353d]"
          >
            {error}
          </button>
        ) : null}

        {!selectionMode &&
!hasSearch &&
activeFilter === 'all' ? (
  <button
    type="button"
    onClick={() => navigate('/chat/archived')}
    className="flex w-full items-center gap-3 px-5 py-3 text-left active:bg-[#f4f4f5]"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5e5e7] text-[#666970]">
      <Archive size={20} />
    </span>

    <span className="min-w-0 flex-1">
      <strong className="block text-[14px] font-semibold text-[#111827]">
        Archived chats
      </strong>
      <span className="mt-0.5 block text-[11px] text-[#85888e]">
        {archivedCount} archived
      </span>
    </span>
  </button>
) : null}

        {!selectionMode &&
        !hasSearch &&
        activeFilter === 'all' &&
        incomingRequests[0] ? (
          <IncomingRequestCard
            conversation={incomingRequests[0]}
            busyAction={
              busyRequest?.conversationId ===
              incomingRequests[0].id
                ? busyRequest.action
                : ''
            }
            onDecision={handleDecision}
            onOpen={() =>
              navigate(`/chat/${incomingRequests[0].id}`)
            }
          />
        ) : null}

        {!selectionMode &&
        !hasSearch &&
        activeFilter === 'all' &&
        incomingRequests.length > 1 ? (
          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className="mx-4 mt-3 text-[11px] font-bold text-[#7c3aed]"
          >
            View {incomingRequests.length - 1} more requests
          </button>
        ) : null}

        {loading ? (
          <LoadingInbox />
        ) : hasSearch ? (
          <div className="px-2 py-3">
            {visibleConversations.length ? (
              <section>
                <h2 className="px-2 pb-2 pt-1 text-[13px] font-bold text-[#111827]">
                  Conversations
                </h2>
                {visibleConversations.map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    selected={selectedConversationIds.has(
                      String(conversation.id)
                    )}
                    selectionMode={selectionMode}
                    onOpenContextMenu={(x, y) =>
  openConversationMenu(
    conversation,
    x,
    y
  )
}
                    onToggleSelection={() =>
                      toggleConversationSelection(
                        conversation.id
                      )
                    }
                    onOpen={() =>
                      navigate(`/chat/${conversation.id}`)
                    }
                  />
                ))}
              </section>
            ) : null}

            {normalizedQuery.length < 2 ? (
              <div className="mx-2 mt-3 rounded-[16px] bg-[#f6f3fb] px-4 py-4 text-center text-[12px] font-bold leading-5 text-[#756f7d]">
                Enter at least 2 characters to search all readers and authors by name or username.
              </div>
            ) : searchLoading ? (
              <div className="flex min-h-[180px] items-center justify-center text-[#7c3aed]">
                <LoaderCircle size={27} className="animate-spin" />
              </div>
            ) : searchError ? (
              <div className="mx-2 mt-3 rounded-[14px] bg-[#fff0f1] px-4 py-3 text-[11px] font-bold text-[#c7353d]">
                {searchError}
              </div>
            ) : peopleResults.length ? (
              <section className={visibleConversations.length ? 'mt-3' : ''}>
                <h2 className="px-2 pb-2 pt-1 text-[13px] font-bold text-[#111827]">
                  Readers and Authors
                </h2>
                {peopleResults.map((user) => (
                  <SearchPersonRow
                    key={`${user.result_type || 'user'}:${user.author_page_id || user.id}`}
                    user={user}
                    onOpen={() => openSearchPerson(user)}
                  />
                ))}
              </section>
            ) : !hasAnySearchResult ? (
              <EmptySearch query={query.trim()} />
            ) : null}
          </div>
        ) : visibleConversations.length ? (
          <div className="px-2 py-3">
            {visibleConversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                selected={selectedConversationIds.has(
                  String(conversation.id)
                )}
                selectionMode={selectionMode}
                onOpenContextMenu={(x, y) =>
  openConversationMenu(
    conversation,
    x,
    y
  )
}
                onToggleSelection={() =>
                  toggleConversationSelection(
                    conversation.id
                  )
                }
                onOpen={() =>
                  navigate(`/chat/${conversation.id}`)
                }
              />
            ))}
          </div>
        ) : activeFilter === 'pending' ? (
          <EmptyRequests />
        ) : (
          <EmptyInbox />
        )}

        {!selectionMode &&
        !hasSearch &&
        activeFilter === 'all' ? (
          <ChatSuggestedPeople />
        ) : null}
      </main>

      <ChatNewMessageSheet
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
      />

      <ChatGroupCreateSheet
  open={groupCreateOpen}
  onClose={() => setGroupCreateOpen(false)}
  onCreated={() => {
    loadConversations({ silent: true })
    loadQuickContacts()
  }}
/>

      <ReaderReaderMessageRequestModal
        open={Boolean(selectedSearchReader)}
        reader={selectedSearchReader}
        onClose={() => setSelectedSearchReader(null)}
      />

      <ReaderAuthorMessageRequestModal
        open={Boolean(selectedSearchAuthor)}
        author={selectedSearchAuthor}
        onClose={() => setSelectedSearchAuthor(null)}
      />

      {!hideReaderFooter && !selectionMode ? (
        <ReaderProfileFooter />
      ) : null}
    </div>
  )
}
