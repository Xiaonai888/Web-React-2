import {
  Archive,
  BookOpen,
  ChevronLeft,
  LoaderCircle,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderProfileFooter from '../../components/reader-profile/ReaderProfileFooter'
import {
  deleteChatConversation,
  getManagedChatConversations,
  hasReaderSession,
  unarchiveChatConversation,
} from '../../services/chatApi'

function formatConversationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function PersonAvatar({ person }) {
  const [failed, setFailed] =
    useState(false)
  const name = String(
    person?.name ||
      person?.username ||
      'Shadow'
  ).trim()
  const letter =
    name.charAt(0).toUpperCase() || 'S'

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

function EmptyArchived() {
  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
        <Archive
          size={30}
          strokeWidth={1.9}
        />
      </div>
      <h2 className="mt-5 text-[18px] font-bold text-[#111827]">
        No archived messages
      </h2>
      <p className="mx-auto mt-2 max-w-[290px] text-[13px] font-bold leading-6 text-[#8a8a95]">
        Conversations you archive will appear here.
      </p>
    </div>
  )
}

function ArchivedRow({
  conversation,
  busyAction,
  onOpen,
  onRestore,
  onDelete,
}) {
  const person =
    conversation.counterpart || {}
  const latest =
    conversation.latest_message

  return (
    <section className="rounded-[20px] border border-[#ece9f1] bg-white p-3 shadow-[0_8px_24px_rgba(17,24,39,0.05)]">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="relative">
          <PersonAvatar person={person} />

          {person.type === 'author' ? (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-white">
              <BookOpen
                size={10}
                strokeWidth={2.4}
              />
            </span>
          ) : null}
        </div>

        <span className="min-w-0 flex-1">
          <strong className="block truncate text-[15px] font-bold text-[#111827]">
            {person.name || 'Shadow User'}
          </strong>
          <span className="mt-1 block truncate text-[13px] font-bold text-[#87838f]">
            {latest?.body ||
              'Open this conversation'}
          </span>
        </span>

        <span className="shrink-0 text-[10px] font-bold text-[#8f8b96]">
          {formatConversationTime(
            conversation.last_message_at ||
              latest?.created_at
          )}
        </span>
      </button>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#f0eef3] pt-3">
        <button
          type="button"
          onClick={onRestore}
          disabled={Boolean(busyAction)}
          className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#f2edff] text-[11px] font-extrabold text-[#6f52b5] transition active:scale-[0.98] disabled:opacity-50"
        >
          {busyAction === 'restore' ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <RotateCcw size={16} />
          )}
          Restore
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={Boolean(busyAction)}
          className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#fff0f1] text-[11px] font-extrabold text-[#c7353d] transition active:scale-[0.98] disabled:opacity-50"
        >
          {busyAction === 'delete' ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={16} />
          )}
          Delete
        </button>
      </div>
    </section>
  )
}

export default function ArchivedChatPage() {
  const navigate = useNavigate()
  const [conversations, setConversations] =
    useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] =
    useState(true)
  const [busyItem, setBusyItem] =
    useState(null)
  const [error, setError] = useState('')

  const loadArchived = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setLoading(true)
      }

      try {
        const data =
          await getManagedChatConversations({
            view: 'archived',
          })

        setConversations(
  Array.isArray(data.conversations)
    ? data.conversations.filter(
        (item) =>
          item.viewer_role !== 'author'
      )
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
            'Failed to load archived messages'
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
      navigate('/login', {
        replace: true,
      })
      return undefined
    }

    loadArchived()

    const intervalId =
      window.setInterval(() => {
        loadArchived({ silent: true })
      }, 8000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadArchived, navigate])

  const visibleConversations = useMemo(() => {
    const normalized =
      query.trim().toLowerCase()

    if (!normalized) {
      return conversations
    }

    return conversations.filter(
      (conversation) => {
        const person =
          conversation.counterpart || {}
        const searchable = [
          person.name,
          person.username,
          conversation.latest_message
            ?.body,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchable.includes(normalized)
      }
    )
  }, [conversations, query])

  const handleRestore = async (
    conversationId
  ) => {
    if (busyItem) return

    setBusyItem({
      id: conversationId,
      action: 'restore',
    })

    try {
      await unarchiveChatConversation(
        conversationId
      )
      await loadArchived({
        silent: true,
      })
      window.dispatchEvent(
        new CustomEvent(
          'shadow-chat-updated'
        )
      )
      setError('')
    } catch (restoreError) {
      setError(
        restoreError.message ||
          'Failed to restore conversation'
      )
    } finally {
      setBusyItem(null)
    }
  }

  const handleDelete = async (
    conversationId
  ) => {
    if (busyItem) return

    if (
      !window.confirm(
        'Delete this conversation from your inbox? New messages can restore it.'
      )
    ) {
      return
    }

    setBusyItem({
      id: conversationId,
      action: 'delete',
    })

    try {
      await deleteChatConversation(
        conversationId
      )
      await loadArchived({
        silent: true,
      })
      window.dispatchEvent(
        new CustomEvent(
          'shadow-chat-updated'
        )
      )
      setError('')
    } catch (deleteError) {
      setError(
        deleteError.message ||
          'Failed to delete conversation'
      )
    } finally {
      setBusyItem(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f9] pb-[96px]">
      <header className="sticky top-0 z-[70] border-b border-[#eceaf0] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[620px] px-4 pb-4 pt-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate('/chat')
              }
              aria-label="Back to messages"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition active:scale-90"
            >
              <ChevronLeft size={27} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-[22px] font-extrabold text-[#111827]">
                Archived
              </h1>
              <p className="text-[11px] font-bold text-[#8a8792]">
                {conversations.length}{' '}
                conversations
              </p>
            </div>
          </div>

          <div className="relative mt-3">
            <Search
              size={18}
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
              placeholder="Search archived messages"
              className="h-[44px] w-full rounded-full border border-transparent bg-[#f4f4f7] pl-11 pr-4 text-[13px] text-[#111827] outline-none transition placeholder:text-[#8e8b96] focus:border-[#d9cdf8] focus:bg-white"
            />
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

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center text-[#7c3aed]">
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : visibleConversations.length ? (
          <div className="space-y-3 px-4 py-4">
            {visibleConversations.map(
              (conversation) => {
                const action =
                  busyItem?.id ===
                  conversation.id
                    ? busyItem.action
                    : ''

                return (
                  <ArchivedRow
                    key={conversation.id}
                    conversation={
                      conversation
                    }
                    busyAction={action}
                    onOpen={() =>
                      navigate(
                        `/chat/${conversation.id}`
                      )
                    }
                    onRestore={() =>
                      handleRestore(
                        conversation.id
                      )
                    }
                    onDelete={() =>
                      handleDelete(
                        conversation.id
                      )
                    }
                  />
                )
              }
            )}
          </div>
        ) : query.trim() ? (
          <div className="px-5 py-20 text-center">
            <Search
              size={32}
              className="mx-auto text-[#9a96a2]"
            />
            <h2 className="mt-4 text-[17px] font-bold text-[#111827]">
              No results found
            </h2>
          </div>
        ) : (
          <EmptyArchived />
        )}
      </main>

      <ReaderProfileFooter />
    </div>
  )
}
