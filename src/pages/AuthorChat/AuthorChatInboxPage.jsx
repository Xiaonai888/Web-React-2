import {
  Archive,
  Check,
  ChevronRight,
  EllipsisVertical,
  LoaderCircle,
  MessageCircle,
  Search,
  Send,
  Trash2,
  VolumeX,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  archiveAuthorChatConversation,
  decideAuthorChatRequest,
  deleteAuthorChatConversation,
  getAuthorChatConversations,
  hasAuthorChatSession,
  muteAuthorChatConversation,
  unmuteAuthorChatConversation,
} from '../../services/authorChatApi'

function formatTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

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

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name ||
      person?.username ||
      'Shadow Reader'
  ).trim()
  const letter = name.charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[16px] font-bold text-white">
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

function EmptyInbox() {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
        <MessageCircle size={30} strokeWidth={1.9} />
      </div>
      <h2 className="mt-5 text-[18px] font-bold text-[#111827]">
        No Page messages yet
      </h2>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-[#8a8a95]">
        Messages sent to your Author Page will appear here.
      </p>
    </div>
  )
}

function RequestCard({
  conversation,
  busy,
  onOpen,
  onDecision,
}) {
  const person = conversation.counterpart || {}

  return (
    <section className="mx-4 mt-4 rounded-[20px] border border-[#e6def8] bg-[#faf8ff] p-4">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 text-left"
      >
        <Avatar person={person} />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-[#8b8793]">
            Message request
          </span>
          <strong className="mt-1 block truncate text-[15px] font-bold text-[#111827]">
            {person.name || 'Shadow Reader'}
          </strong>
          <span className="mt-1 block truncate text-[12px] font-semibold text-[#76727f]">
            {conversation.latest_message?.body ||
              'Sent a message to your Page'}
          </span>
        </span>
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => onDecision('decline')}
          className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#efeff3] text-[12px] font-bold text-[#44444d] disabled:opacity-50"
        >
          {busy === 'decline' ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <X size={16} />
          )}
          Decline
        </button>

        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => onDecision('accept')}
          className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#7c3aed] text-[12px] font-bold text-white disabled:opacity-50"
        >
          {busy === 'accept' ? (
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
  menuOpen,
  busy,
  onOpen,
  onMenu,
  onArchive,
  onMute,
  onUnmute,
  onDelete,
}) {
  const person = conversation.counterpart || {}
  const latest = conversation.latest_message
  const unread = Number(conversation.unread_count || 0)

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-[18px] px-3 py-3 active:bg-[#f6f4f9]">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <Avatar person={person} />

          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <strong className="truncate text-[15px] font-bold text-[#111827]">
                {person.name || 'Shadow Reader'}
              </strong>
              {unread > 0 ? (
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#7c3aed]" />
              ) : null}
            </span>

            <span className="mt-1 block truncate text-[12px] font-semibold text-[#87838f]">
              {latest?.body || 'Open this conversation'}
            </span>
          </span>

          <span className="shrink-0 text-[10px] font-semibold text-[#96929d]">
            {formatTime(
              conversation.last_message_at ||
                latest?.created_at
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={onMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#55545d] active:bg-[#efeff3]"
          aria-label="Chat options"
        >
          <EllipsisVertical size={20} />
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute right-3 top-[58px] z-30 w-[190px] overflow-hidden rounded-[16px] bg-white py-1 shadow-[0_14px_38px_rgba(17,24,39,0.18)] ring-1 ring-black/5">
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={conversation.is_muted ? onUnmute : onMute}
            className="flex h-11 w-full items-center gap-3 px-4 text-left text-[13px] font-semibold text-[#111827] active:bg-[#f5f5f7] disabled:opacity-50"
          >
            <VolumeX size={18} />
            {conversation.is_muted ? 'Unmute' : 'Mute'}
          </button>

          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={onArchive}
            className="flex h-11 w-full items-center gap-3 px-4 text-left text-[13px] font-semibold text-[#111827] active:bg-[#f5f5f7] disabled:opacity-50"
          >
            <Archive size={18} />
            Archive
          </button>

          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={onDelete}
            className="flex h-11 w-full items-center gap-3 px-4 text-left text-[13px] font-semibold text-[#c7353d] active:bg-[#fff4f4] disabled:opacity-50"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function AuthorChatInboxPage() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [archivedCount, setArchivedCount] = useState(0)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [menuId, setMenuId] = useState('')
  const [busy, setBusy] = useState(null)

  const loadConversations = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true)

      try {
        const [activeData, archivedData] =
          await Promise.all([
            getAuthorChatConversations({
              view: 'active',
            }),
            getAuthorChatConversations({
              view: 'archived',
            }),
          ])

        setConversations(activeData.conversations || [])
        setArchivedCount(
          (archivedData.conversations || []).length
        )
        setError('')
      } catch (loadError) {
        if (loadError.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        setError(
          loadError.message ||
            'Failed to load Page messages'
        )
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (!hasAuthorChatSession()) {
      navigate('/login', { replace: true })
      return undefined
    }

    loadConversations()

    const intervalId = window.setInterval(
      () => loadConversations({ silent: true }),
      6000
    )

    return () => window.clearInterval(intervalId)
  }, [loadConversations, navigate])

  const incomingRequests = useMemo(
    () =>
      conversations.filter(
        (item) =>
          item.request_status === 'pending' &&
          item.can_decide === true
      ),
    [conversations]
  )

  const unreadTotal = useMemo(
    () =>
      conversations.reduce(
        (total, item) =>
          total +
          Math.max(0, Number(item.unread_count || 0)),
        0
      ),
    [conversations]
  )

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return conversations.filter((item) => {
      if (
        filter === 'requests' &&
        !(
          item.request_status === 'pending' &&
          item.can_decide === true
        )
      ) {
        return false
      }

      if (!normalized) return true

      const person = item.counterpart || {}
      const text = [
        person.name,
        person.username,
        item.latest_message?.body,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return text.includes(normalized)
    })
  }, [conversations, filter, query])

  async function handleDecision(conversation, action) {
    if (busy) return

    try {
      setBusy({
        id: conversation.id,
        action,
      })

      await decideAuthorChatRequest(
        conversation.id,
        action
      )

      await loadConversations({ silent: true })
    } catch (decisionError) {
      setError(
        decisionError.message ||
          'Failed to update request'
      )
    } finally {
      setBusy(null)
    }
  }

  async function handleAction(conversation, action) {
    if (busy) return

    try {
      setBusy({
        id: conversation.id,
        action,
      })
      setMenuId('')

      if (action === 'archive') {
        await archiveAuthorChatConversation(
          conversation.id
        )
      }

      if (action === 'mute') {
        await muteAuthorChatConversation(
          conversation.id,
          'forever'
        )
      }

      if (action === 'unmute') {
        await unmuteAuthorChatConversation(
          conversation.id
        )
      }

      if (action === 'delete') {
        const confirmed = window.confirm(
          'Delete this Page conversation from your inbox?'
        )

        if (!confirmed) return

        await deleteAuthorChatConversation(
          conversation.id
        )
      }

      await loadConversations({ silent: true })
    } catch (actionError) {
      setError(
        actionError.message ||
          'Failed to update conversation'
      )
    } finally {
      setBusy(null)
    }
  }

  return (
    <div
      className="min-h-screen bg-white"
      onClick={() => {
        if (menuId) setMenuId('')
      }}
    >
      <header className="sticky top-0 z-40 border-b border-[#eeeeF2] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[620px] px-4 pb-4 pt-[max(12px,env(safe-area-inset-top))]">
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
              onClick={() => navigate('/author/page')}
              className="rounded-full bg-[#f2edff] px-4 py-2.5 text-[12px] font-bold text-[#6d46bf]"
            >
              Profile page
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
                setQuery(event.target.value.slice(0, 60))
              }
              placeholder="Search Page messages"
              className="h-[46px] w-full rounded-full bg-[#f4f4f7] pl-11 pr-4 text-[14px] text-[#111827] outline-none focus:bg-white focus:ring-1 focus:ring-[#d9cdf8]"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${
                filter === 'all'
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#f2f2f5] text-[#66636d]'
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter('requests')}
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${
                filter === 'requests'
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#f2f2f5] text-[#66636d]'
              }`}
            >
              Requests
              {incomingRequests.length
                ? ` ${incomingRequests.length}`
                : ''}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[620px] pb-[max(32px,env(safe-area-inset-bottom))]">
        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[12px] font-semibold text-[#c7353d]"
          >
            {error}
          </button>
        ) : null}

        {archivedCount > 0 &&
        filter === 'all' &&
        !query.trim() ? (
          <button
            type="button"
            onClick={() =>
              navigate('/author/page/chat/archived')
            }
            className="mx-3 mt-3 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-[18px] px-3 py-3 text-left active:bg-[#f5f4f8]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
              <Archive size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[14px] font-bold text-[#111827]">
                Archived chats
              </strong>
              <span className="mt-1 block text-[12px] text-[#898691]">
                {archivedCount} conversation
                {archivedCount === 1 ? '' : 's'}
              </span>
            </span>
            <ChevronRight
              size={20}
              className="text-[#aaa7b0]"
            />
          </button>
        ) : null}

        {filter === 'all' &&
        !query.trim() &&
        incomingRequests[0] ? (
          <RequestCard
            conversation={incomingRequests[0]}
            busy={
              busy?.id === incomingRequests[0].id
                ? busy.action
                : ''
            }
            onOpen={() =>
              navigate(
                `/author/page/chat/${incomingRequests[0].id}`
              )
            }
            onDecision={(action) =>
              handleDecision(
                incomingRequests[0],
                action
              )
            }
          />
        ) : null}

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center text-[#7c3aed]">
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : visible.length ? (
          <div className="px-2 py-3">
            {visible.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                menuOpen={menuId === conversation.id}
                busy={
                  busy?.id === conversation.id
                    ? busy.action
                    : ''
                }
                onOpen={() =>
                  navigate(
                    `/author/page/chat/${conversation.id}`
                  )
                }
                onMenu={(event) => {
                  event.stopPropagation()
                  setMenuId((current) =>
                    current === conversation.id
                      ? ''
                      : conversation.id
                  )
                }}
                onArchive={() =>
                  handleAction(
                    conversation,
                    'archive'
                  )
                }
                onMute={() =>
                  handleAction(conversation, 'mute')
                }
                onUnmute={() =>
                  handleAction(
                    conversation,
                    'unmute'
                  )
                }
                onDelete={() =>
                  handleAction(
                    conversation,
                    'delete'
                  )
                }
              />
            ))}
          </div>
        ) : (
          <EmptyInbox />
        )}
      </main>
    </div>
  )
}
