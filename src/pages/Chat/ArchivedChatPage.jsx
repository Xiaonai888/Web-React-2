import {
  Archive,
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
import {
  deleteChatConversation,
  getManagedChatConversations,
  hasReaderSession,
  unarchiveChatConversation,
} from '../../services/chatApi'

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || person?.username || 'Shadow User'
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

export default function ArchivedChatPage() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  const loadArchived = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true)

      try {
        const data = await getManagedChatConversations({
          view: 'archived',
        })

        setConversations(
          Array.isArray(data.conversations)
            ? data.conversations.filter(
                (conversation) =>
                  conversation.viewer_role === 'reader'
              )
            : []
        )
        setError('')
      } catch (loadError) {
        if (loadError.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        setError(
          loadError.message ||
            'Failed to load archived messages'
        )
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (!hasReaderSession()) {
      navigate('/login', { replace: true })
      return undefined
    }

    loadArchived()

    const intervalId = window.setInterval(
      () => loadArchived({ silent: true }),
      8000
    )

    return () => window.clearInterval(intervalId)
  }, [loadArchived, navigate])

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return conversations

    return conversations.filter((conversation) => {
      const person = conversation.counterpart || {}

      return [
        person.name,
        person.username,
        conversation.latest_message?.body,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    })
  }, [conversations, query])

  async function restore(conversationId) {
    if (busyId) return

    try {
      setBusyId(conversationId)
      await unarchiveChatConversation(conversationId)
      await loadArchived({ silent: true })
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
    } catch (restoreError) {
      setError(
        restoreError.message ||
          'Failed to restore conversation'
      )
    } finally {
      setBusyId('')
    }
  }

  async function remove(conversationId) {
    if (busyId) return

    if (
      !window.confirm(
        'Delete this conversation from your inbox?'
      )
    ) {
      return
    }

    try {
      setBusyId(conversationId)
      await deleteChatConversation(conversationId)
      await loadArchived({ silent: true })
      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
    } catch (deleteError) {
      setError(
        deleteError.message ||
          'Failed to delete conversation'
      )
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f9]">
      <header className="sticky top-0 z-40 border-b border-[#eceaf0] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[620px] px-4 pt-[max(10px,env(safe-area-inset-top))]">
          <div className="flex h-[52px] items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (searchOpen) {
                  setSearchOpen(false)
                  setQuery('')
                  return
                }
                navigate('/chat')
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            >
              <ChevronLeft size={27} />
            </button>

            {searchOpen ? (
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777a80]"
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value.slice(0, 60)
                    )
                  }
                  placeholder="Search archived chats"
                  className="h-10 w-full rounded-full bg-[#f1f2f4] pl-11 pr-4 text-[14px] outline-none"
                />
              </div>
            ) : (
              <>
                <h1 className="min-w-0 flex-1 text-[20px] font-bold leading-none text-[#111827]">
                  Archived chats
                </h1>

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f2f2f3]"
                  aria-label="Search archived chats"
                >
                  <Search size={24} strokeWidth={2.2} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[620px] px-3 pb-[max(28px,env(safe-area-inset-bottom))] pt-3">
        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mb-3 w-full rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[12px] font-semibold text-[#c7353d]"
          >
            {error}
          </button>
        ) : null}

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center text-[#7c3aed]">
            <LoaderCircle size={28} className="animate-spin" />
          </div>
        ) : visible.length ? (
          <div className="space-y-3">
            {visible.map((conversation) => {
              const person =
                conversation.counterpart || {}
              const busy =
                busyId === conversation.id

              return (
                <section
                  key={conversation.id}
                  className="rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-black/5"
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/chat/${conversation.id}`
                      )
                    }
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <Avatar person={person} />

                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-[15px] font-bold text-[#111827]">
                        {person.name || 'Shadow User'}
                      </strong>
                      <span className="mt-1 block truncate text-[12px] text-[#85818c]">
                        {conversation.latest_message
                          ?.body ||
                          'Open this conversation'}
                      </span>
                    </span>
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#f0eef3] pt-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        restore(conversation.id)
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#f2edff] text-[11px] font-bold text-[#6f52b5] disabled:opacity-50"
                    >
                      {busy ? (
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
                      disabled={busy}
                      onClick={() =>
                        remove(conversation.id)
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#fff0f1] text-[11px] font-bold text-[#c7353d] disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
              <Archive size={30} />
            </div>
            <h2 className="mt-5 text-[18px] font-bold text-[#111827]">
              No archived messages
            </h2>
          </div>
        )}
      </main>
    </div>
  )
}
