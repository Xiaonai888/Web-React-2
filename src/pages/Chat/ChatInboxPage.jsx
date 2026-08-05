import {
  BookOpen,
  Check,
  LoaderCircle,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  User,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderProfileFooter from '../../components/reader-profile/ReaderProfileFooter'
import ChatSuggestedPeople from '../../components/chat/ChatSuggestedPeople'
import ChatNewMessageSheet from '../../components/chat/ChatNewMessageSheet'
import {
  decideChatRequest,
  getChatConversations,
  hasReaderSession,
} from '../../services/chatApi'

const MORE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'accepted', label: 'Chats' },
]

function formatConversationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()
  const sameDay =
    date.getFullYear() ===
      now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      }
    ).format(date)
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const wasYesterday =
    date.getFullYear() ===
      yesterday.getFullYear() &&
    date.getMonth() ===
      yesterday.getMonth() &&
    date.getDate() ===
      yesterday.getDate()

  if (wasYesterday) {
    return 'Yesterday'
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: 'short',
      day: 'numeric',
    }
  ).format(date)
}

function PersonAvatar({
  person,
  size = 'h-14 w-14',
  textSize = 'text-[16px]',
}) {
  const [failed, setFailed] =
    useState(false)
  const name = String(
    person?.name || 'Shadow'
  ).trim()
  const letter =
    name.charAt(0).toUpperCase() || 'S'

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] ${textSize} font-extrabold text-white`}
    >
      {person?.avatar_url && !failed ? (
        <img
          src={person.avatar_url}
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
  active,
  count = 0,
  person,
  fallback,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[68px] shrink-0 flex-col items-center"
    >
      <span
        className={`relative flex h-[60px] w-[60px] items-center justify-center rounded-full transition ${
          active
            ? 'ring-2 ring-[#7c3aed] ring-offset-2'
            : ''
        }`}
      >
        {person ? (
          <PersonAvatar
            person={person}
            size="h-[60px] w-[60px]"
            textSize="text-[15px]"
          />
        ) : (
          fallback
        )}

        {count > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] px-1 text-[10px] font-black text-white">
            {count > 99
              ? '99+'
              : count}
          </span>
        ) : null}
      </span>

      <span className="mt-2 max-w-[68px] truncate text-[11px] font-bold text-[#33333b]">
        {label}
      </span>
    </button>
  )
}

function LoadingInbox() {
  return (
    <div className="space-y-4 px-4 py-5">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-3"
          >
            <div className="h-14 w-14 rounded-full bg-[#efeff3]" />
            <div className="min-w-0 flex-1">
              <div className="h-3 w-32 rounded-full bg-[#e9e9ee]" />
              <div className="mt-2 h-3 w-48 max-w-full rounded-full bg-[#f1f1f4]" />
            </div>
            <div className="h-3 w-8 rounded-full bg-[#eeeeF2]" />
          </div>
        )
      )}
    </div>
  )
}

function EmptyInbox() {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
        <MessageCircle
          size={30}
          strokeWidth={1.9}
        />
      </div>
      <h2 className="mt-5 text-[18px] font-extrabold text-[#111827]">
        No messages yet
      </h2>
      <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-6 text-[#8a8a95]">
        Your conversations with readers and authors will appear here.
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
  const person =
    conversation?.counterpart || {}
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
          <div className="mt-0.5 truncate text-[14px] font-extrabold text-[#111827]">
            {person.name || 'Shadow User'}
          </div>
          <div className="mt-1 truncate text-[12px] font-medium text-[#76727f]">
            {preview}
          </div>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() =>
            onDecision(
              conversation.id,
              'decline'
            )
          }
          disabled={Boolean(busyAction)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[12px] bg-[#f0eff3] text-[12px] font-extrabold text-[#33313a] transition active:scale-[0.98] disabled:opacity-50"
        >
          {busyAction === 'decline' ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <X size={16} />
          )}
          Decline
        </button>

        <button
          type="button"
          onClick={() =>
            onDecision(
              conversation.id,
              'accept'
            )
          }
          disabled={Boolean(busyAction)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[12px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-[12px] font-extrabold text-white shadow-[0_6px_16px_rgba(124,58,237,0.2)] transition active:scale-[0.98] disabled:opacity-50"
        >
          {busyAction === 'accept' ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <Check size={16} />
          )}
          Accept
        </button>
      </div>
    </section>
  )
}

export default function ChatInboxPage() {
  const navigate = useNavigate()
  const [conversations, setConversations] =
    useState([])
  const [activeFilter, setActiveFilter] =
    useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] =
    useState(true)
  const [refreshing, setRefreshing] =
    useState(false)
  const [moreOpen, setMoreOpen] =
    useState(false)
  const [newMessageOpen, setNewMessageOpen] =
    useState(false)
  const [busyRequest, setBusyRequest] =
    useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadConversations = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      try {
        const data =
          await getChatConversations('all')

        setConversations(
          Array.isArray(
            data.conversations
          )
            ? data.conversations
            : []
        )
        setError('')
      } catch (loadError) {
        if (loadError.status === 401) {
          navigate('/login', {
            replace: true,
          })
          return
        }

        setError(
          loadError.message ||
            'Failed to load messages'
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (!hasReaderSession()) {
      navigate('/login', {
        replace: true,
      })
      return undefined
    }

    loadConversations()

    const intervalId =
      window.setInterval(() => {
        loadConversations({
          silent: true,
        })
      }, 6000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadConversations, navigate])

  useEffect(() => {
    if (!notice) return undefined

    const timeoutId = window.setTimeout(
      () => setNotice(''),
      2200
    )

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [notice])

  const unreadTotal = useMemo(
    () =>
      conversations.reduce(
        (total, item) =>
          total +
          Number(item.unread_count || 0),
        0
      ),
    [conversations]
  )

  const pendingConversations = useMemo(
    () =>
      conversations.filter(
        (item) =>
          item.request_status ===
          'pending'
      ),
    [conversations]
  )

  const incomingRequests = useMemo(
    () =>
      pendingConversations.filter(
        (item) =>
          item.can_decide === true
      ),
    [pendingConversations]
  )

  const firstAuthor = useMemo(
    () =>
      conversations.find(
        (item) =>
          item.counterpart?.type ===
          'author'
      )?.counterpart || null,
    [conversations]
  )

  const firstReader = useMemo(
    () =>
      conversations.find(
        (item) =>
          item.counterpart?.type ===
          'reader'
      )?.counterpart || null,
    [conversations]
  )

  const visibleConversations = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase()

    return conversations.filter(
      (conversation) => {
        if (
          activeFilter === 'unread' &&
          Number(
            conversation.unread_count || 0
          ) < 1
        ) {
          return false
        }

        if (
          activeFilter === 'pending' &&
          conversation.request_status !==
            'pending'
        ) {
          return false
        }

        if (
          activeFilter === 'accepted' &&
          conversation.request_status !==
            'accepted'
        ) {
          return false
        }

        if (
          activeFilter === 'author' &&
          conversation.counterpart?.type !==
            'author'
        ) {
          return false
        }

        if (
          activeFilter === 'reader' &&
          conversation.counterpart?.type !==
            'reader'
        ) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        const person =
          conversation.counterpart || {}

        const searchable = [
          person.name,
          person.username,
          conversation.latest_message?.body,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchable.includes(
          normalizedQuery
        )
      }
    )
  }, [
    activeFilter,
    conversations,
    query,
  ])

  const handleDecision = async (
    conversationId,
    action
  ) => {
    if (busyRequest) return

    setBusyRequest({
      conversationId,
      action,
    })

    try {
      const data =
        await decideChatRequest(
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
        decisionError.message ||
          'Failed to update request'
      )
    } finally {
      setBusyRequest(null)
    }
  }

  const chooseFilter = (filter) => {
    setActiveFilter(filter)
    setMoreOpen(false)
  }

  const openNewMessage = () => {
    setNewMessageOpen(true)
  }

  return (
    <div className="min-h-screen bg-white pb-[92px]">
      <style>{`.shadow-chat-scroll::-webkit-scrollbar{display:none}.shadow-chat-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {notice ? (
        <div className="fixed left-1/2 top-4 z-[100001] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[11px] font-bold text-white shadow-lg">
          {notice}
        </div>
      ) : null}

      <header className="sticky top-0 z-[70] border-b border-[#f0f0f3] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[620px] px-4 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-black tracking-[-0.04em] text-[#111827]">
                Messages
              </h1>

              <div className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-[#8a8792]">
                <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                {unreadTotal} unread
              </div>
            </div>

            <button
              type="button"
              onClick={openNewMessage}
              aria-label="New message"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f1fb] text-[#7c3aed] transition active:scale-90"
            >
              <SquarePen
                size={23}
                strokeWidth={2.2}
              />
            </button>
          </div>

          <div className="relative mt-5">
            <Search
              size={21}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777480]"
            />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search"
              className="h-[54px] w-full rounded-full border border-transparent bg-[#f4f4f7] pl-12 pr-12 text-[15px] font-medium text-[#111827] outline-none transition placeholder:text-[#8e8b96] focus:border-[#d9cdf8] focus:bg-white"
            />

            <button
              type="button"
              onClick={() =>
                loadConversations({
                  silent: true,
                })
              }
              disabled={refreshing}
              aria-label="Refresh messages"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#777480] transition active:scale-90 disabled:opacity-45"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />
            </button>
          </div>

          <div className="shadow-chat-scroll -mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-1">
            <QuickCircle
              label="Request"
              active={
                activeFilter === 'pending'
              }
              count={
                pendingConversations.length
              }
              onClick={() =>
                chooseFilter('pending')
              }
              fallback={
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
                  <MessageCircle
                    size={27}
                    strokeWidth={2}
                  />
                </span>
              }
            />

            <QuickCircle
              label="Author"
              active={
                activeFilter === 'author'
              }
              person={firstAuthor}
              onClick={() =>
                chooseFilter('author')
              }
              fallback={
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f2f2f5] text-[#33333b]">
                  <BookOpen
                    size={26}
                    strokeWidth={1.9}
                  />
                </span>
              }
            />

            <QuickCircle
              label="Reader"
              active={
                activeFilter === 'reader'
              }
              person={firstReader}
              onClick={() =>
                chooseFilter('reader')
              }
              fallback={
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f2f2f5] text-[#33333b]">
                  <User
                    size={26}
                    strokeWidth={1.9}
                  />
                </span>
              }
            />

            <QuickCircle
              label="New"
              active={false}
              onClick={openNewMessage}
              fallback={
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_18px_rgba(124,58,237,0.22)]">
                  <SquarePen
                    size={25}
                    strokeWidth={2}
                  />
                </span>
              }
            />

            <QuickCircle
              label="More"
              active={moreOpen}
              onClick={() =>
                setMoreOpen(
                  (current) => !current
                )
              }
              fallback={
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f2f2f5] text-[#111827]">
                  <Plus
                    size={29}
                    strokeWidth={1.8}
                  />
                </span>
              }
            />
          </div>

          {moreOpen ? (
            <div className="shadow-chat-scroll mt-4 flex gap-2 overflow-x-auto">
              {MORE_FILTERS.map((filter) => {
                const active =
                  activeFilter === filter.key

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() =>
                      chooseFilter(filter.key)
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold transition ${
                      active
                        ? 'bg-[#111827] text-white'
                        : 'bg-[#f1f1f4] text-[#68656f]'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
          ) : null}
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

        {incomingRequests[0] ? (
          <IncomingRequestCard
            conversation={
              incomingRequests[0]
            }
            busyAction={
              busyRequest?.conversationId ===
              incomingRequests[0].id
                ? busyRequest.action
                : ''
            }
            onDecision={handleDecision}
            onOpen={() =>
              navigate(
                `/chat/${incomingRequests[0].id}`
              )
            }
          />
        ) : null}

        {incomingRequests.length > 1 ? (
          <button
            type="button"
            onClick={() =>
              chooseFilter('pending')
            }
            className="mx-4 mt-3 text-[11px] font-extrabold text-[#7c3aed]"
          >
            View {incomingRequests.length - 1}{' '}
            more requests
          </button>
        ) : null}

        {loading ? (
          <LoadingInbox />
        ) : visibleConversations.length ? (
          <div className="px-2 py-3">
            {visibleConversations.map(
              (conversation) => {
                const person =
                  conversation.counterpart || {}
                const latest =
                  conversation.latest_message
                const unread = Number(
                  conversation.unread_count || 0
                )
                const pending =
                  conversation.request_status ===
                  'pending'
                const canDecideRequest =
                  Boolean(
                    conversation.can_decide
                  )

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/chat/${conversation.id}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-[18px] px-2 py-3 text-left transition hover:bg-[#faf9fc] active:bg-[#f4f2f8]"
                  >
                    <div className="relative">
                      <PersonAvatar
                        person={person}
                      />

                      {person.type ===
                      'author' ? (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-white">
                          <BookOpen
                            size={10}
                            strokeWidth={2.4}
                          />
                        </span>
                      ) : null}
                    </div>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <strong className="truncate text-[15px] font-extrabold text-[#111827]">
                          {person.name ||
                            'Shadow User'}
                        </strong>

                        {pending ? (
                          <span className="shrink-0 rounded-full bg-[#f2edff] px-2 py-1 text-[9px] font-extrabold text-[#7c3aed]">
                            {canDecideRequest
                              ? 'Request'
                              : 'Pending'}
                          </span>
                        ) : null}
                      </span>

                      <span
                        className={`mt-1 block truncate text-[13px] ${
                          unread > 0
                            ? 'font-bold text-[#34313a]'
                            : 'font-medium text-[#87838f]'
                        }`}
                      >
                        {latest?.body ||
                          'Open this conversation'}
                      </span>
                    </span>

                    <span className="flex shrink-0 flex-col items-end gap-2">
                      <span className="text-[10px] font-semibold text-[#8f8b96]">
                        {formatConversationTime(
                          conversation.last_message_at ||
                            latest?.created_at
                        )}
                      </span>

                      {unread > 0 ? (
                        <span className="h-3 w-3 rounded-full bg-[#7c3aed]" />
                      ) : null}
                    </span>
                  </button>
                )
              }
            )}
          </div>
        ) : (
          <EmptyInbox />
        )}

        <ChatSuggestedPeople />
      </main>

      <ChatNewMessageSheet
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
      />

      <ReaderProfileFooter />
    </div>
  )
}
