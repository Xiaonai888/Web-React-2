import {
  BookOpen,
  Check,
  LoaderCircle,
  MessageCircle,
  Search,
  SquarePen,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderProfileFooter from '../../components/reader-profile/ReaderProfileFooter'
import ChatSuggestedPeople from '../../components/chat/ChatSuggestedPeople'
import ChatNewMessageSheet from '../../components/chat/ChatNewMessageSheet'
import ReaderAuthorMessageRequestModal from '../../components/chat/ReaderAuthorMessageRequestModal'
import ReaderReaderMessageRequestModal from '../../components/chat/ReaderReaderMessageRequestModal'
import {
  decideChatRequest,
  getChatConversations,
  getChatQuickContacts,
  hasReaderSession,
    searchChatUsers,
} from '../../services/chatApi'

function normalizeSearchValue(value) {
  return String(value || '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
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

function ConversationRow({ conversation, onOpen }) {
  const person = conversation.counterpart || {}
  const latest = conversation.latest_message
  const unread = Number(conversation.unread_count || 0)
  const pending = conversation.request_status === 'pending'
  const canDecideRequest = Boolean(conversation.can_decide)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[18px] px-2 py-3 text-left transition hover:bg-[#faf9fc] active:bg-[#f4f2f8]"
    >
      <div className="relative">
        <PersonAvatar person={person} />

        {person.type === 'author' ? (
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
      : user?.is_author
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
  const searchRequestRef = useRef(0)
  const [conversations, setConversations] = useState([])
  const [quickContacts, setQuickContacts] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [busyRequest, setBusyRequest] = useState(null)
  const [error, setError] = useState('')
  const [searchUsers, setSearchUsers] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selectedSearchReader, setSelectedSearchReader] =
    useState(null)
  const [selectedSearchAuthor, setSelectedSearchAuthor] =
    useState(null)

  const loadQuickContacts = useCallback(async () => {
    try {
      const data = await getChatQuickContacts(12)
      setQuickContacts(
        Array.isArray(data.contacts) ? data.contacts : []
      )
    } catch {
      setQuickContacts([])
    }
  }, [])

  const loadConversations = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setLoading(true)
      }

      try {
        const data = await getChatConversations('all')

        setConversations(
          Array.isArray(data.conversations)
            ? data.conversations
            : []
        )
        setError('')
      } catch (loadError) {
        if (loadError.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        setError(
          loadError.message || 'Failed to load messages'
        )
      } finally {
        if (!silent) {
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

    loadConversations()
    loadQuickContacts()

    const conversationIntervalId = window.setInterval(() => {
      loadConversations({ silent: true })
    }, 6000)
    const contactsIntervalId = window.setInterval(
      loadQuickContacts,
      20000
    )

    return () => {
      window.clearInterval(conversationIntervalId)
      window.clearInterval(contactsIntervalId)
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

    const timeoutId = window.setTimeout(async () => {
      try {
        setSearchLoading(true)
        setSearchError('')

        const data = await searchChatUsers(normalizedQuery, 20)

        if (searchRequestRef.current !== requestId) {
          return
        }

        setSearchUsers(
          Array.isArray(data.users) ? data.users : []
        )
      } catch (searchFailure) {
        if (searchRequestRef.current !== requestId) {
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
    }
  }, [navigate, normalizedQuery])

  const unreadTotal = useMemo(
    () =>
      conversations.reduce(
        (total, item) =>
          total + Number(item.unread_count || 0),
        0
      ),
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
    return conversations.filter((conversation) => {
      if (
        !normalizedQuery &&
        activeFilter === 'pending' &&
        conversation.request_status !== 'pending'
      ) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const person = conversation.counterpart || {}
      const searchable = [
        person.name,
        person.page_name,
        person.username,
        person.page_username,
        conversation.latest_message?.body,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalizedQuery)
    })
  }, [activeFilter, conversations, normalizedQuery])

  const peopleResults = useMemo(() => {
    const existingKeys = new Set()

    for (const conversation of conversations) {
      const person = conversation.counterpart || {}

      if (person.user_id) {
        existingKeys.add(`user:${person.user_id}`)
      }

      if (person.author_page_id) {
        existingKeys.add(`author:${person.author_page_id}`)
      }

      if (person.username) {
        existingKeys.add(
          `username:${String(person.username).toLowerCase()}`
        )
      }
    }

    return searchUsers.filter((user) => {
      const isAuthorResult =
        user.result_type === 'author' ||
        Boolean(user.author_page_id)
      const authorPageId =
        user.author_page_id ||
        (isAuthorResult ? user.id : '')
      const userId = user.user_id || user.id
      const username =
        user.username || user.page_username || ''

      if (isAuthorResult) {
        if (
          authorPageId &&
          existingKeys.has(`author:${authorPageId}`)
        ) {
          return false
        }

        return true
      }

      if (userId && existingKeys.has(`user:${userId}`)) {
        return false
      }

      if (
        username &&
        existingKeys.has(
          `username:${String(username).toLowerCase()}`
        )
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

      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId
            ? data.conversation
            : item
        )
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
    setActiveFilter((current) =>
      current === 'pending' ? 'all' : 'pending'
    )
  }

  const openSearchPerson = (user) => {
    if (user?.conversation_id) {
      navigate(`/chat/${user.conversation_id}`)
      return
    }

    const authorPageId =
      user.author_page_id ||
      (user.result_type === 'author' ? user.id : '')
    const userId = user.user_id || user.id
    const username = String(
      user.username || user.page_username || ''
    ).toLowerCase()

    const existing = conversations.find((conversation) => {
      const person = conversation.counterpart || {}

      return (
        (authorPageId &&
          String(conversation.author_page_id || '') ===
            String(authorPageId)) ||
        (userId &&
          String(person.user_id || '') === String(userId)) ||
        (username &&
          String(person.username || '').toLowerCase() ===
            username)
      )
    })

    if (existing?.id) {
      navigate(`/chat/${existing.id}`)
      return
    }

    if (authorPageId) {
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

    setSelectedSearchReader({
      ...user,
      id: userId,
      name: user.name || user.page_name || 'Shadow Reader',
      username:
        user.username || user.page_username || '',
    })
  }

  const hasSearch = Boolean(normalizedQuery)
  const hasAnySearchResult =
    visibleConversations.length > 0 || peopleResults.length > 0

  return (
    <div className="min-h-screen bg-white pb-[92px]">
      <style>{`.shadow-chat-scroll::-webkit-scrollbar{display:none}.shadow-chat-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <header className="sticky top-0 z-[70] border-b border-[#f0f0f3] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[620px] px-4 pb-4 pt-4">
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
              onClick={() => setNewMessageOpen(true)}
              aria-label="New message"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f1fb] text-[#7c3aed] transition active:scale-90"
            >
              <SquarePen size={21} strokeWidth={2.2} />
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
                setQuery(event.target.value.slice(0, 50))
              }
              placeholder="Search name or @username"
              className="h-[46px] w-full rounded-full border border-transparent bg-[#f4f4f7] pl-11 pr-4 text-[14px] font-bold text-[#111827] outline-none transition placeholder:text-[#8e8b96] focus:border-[#d9cdf8] focus:bg-white"
            />
          </div>

          <div className="shadow-chat-scroll -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
            <QuickCircle
              label="Request"
              count={pendingConversations.length}
              onClick={chooseRequestFilter}
              fallback={
                <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#f1f1f4] text-[#7c3aed]">
                  <MessageCircle size={26} strokeWidth={2} />
                </span>
              }
            />

            {displayedQuickContacts.map((contact) => {
              const person =
                contact.counterpart || contact

              return (
                <QuickCircle
                  key={
                    contact.key ||
                    contact.conversation_id ||
                    `${contact.type || 'reader'}:${
                      contact.author_page_id ||
                      contact.user_id ||
                      contact.id
                    }`
                  }
                  label={
                    person.name ||
                    person.username ||
                    'Shadow'
                  }
                  person={person}
                  online={Boolean(
                    contact.is_online ||
                    person.is_online
                  )}
                  onClick={() =>
                    openSearchPerson(contact)
                  }
                />
              )
            })}
          </div>
        </div>
      </header>

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

        {!hasSearch && incomingRequests[0] ? (
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

        {!hasSearch && incomingRequests.length > 1 ? (
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
                onOpen={() =>
                  navigate(`/chat/${conversation.id}`)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyInbox />
        )}

        {!hasSearch ? <ChatSuggestedPeople /> : null}
      </main>

      <ChatNewMessageSheet
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
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

      <ReaderProfileFooter />
    </div>
  )
}
