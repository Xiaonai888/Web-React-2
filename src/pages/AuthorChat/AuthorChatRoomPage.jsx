import {
  Check,
  ChevronLeft,
  Info,
  LoaderCircle,
  Send,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  decideAuthorChatRequest,
  getAuthorChatMessages,
  hasAuthorChatSession,
  markAuthorChatRead,
  sendAuthorChatMessage,
} from '../../services/authorChatApi'

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || person?.username || 'Shadow Reader'
  ).trim()
  const letter = name.charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[13px] font-bold text-white">
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

function formatTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function mergeMessages(current, incoming) {
  const merged = new Map(
    current.map((message) => [
      String(message.id),
      message,
    ])
  )

  for (const message of incoming) {
    merged.set(String(message.id), message)
  }

  return [...merged.values()].sort(
    (first, second) =>
      new Date(first.created_at).getTime() -
      new Date(second.created_at).getTime()
  )
}

function getLatestMessageCursor(
  messages,
  fallback = ''
) {
  let latestTime = Number.NEGATIVE_INFINITY
  let latestValue = ''

  for (const message of messages || []) {
    const value = String(
      message?.created_at || ''
    ).trim()
    const time = new Date(value).getTime()

    if (
      value &&
      Number.isFinite(time) &&
      time > latestTime
    ) {
      latestTime = time
      latestValue = value
    }
  }

  return latestValue || String(fallback || '')
}

export default function AuthorChatRoomPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const bottomRef = useRef(null)
  const knownMessageIdsRef = useRef(new Set())
  const pollCursorRef = useRef('')
  const incrementalLoadingRef = useRef(false)
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [busyRequest, setBusyRequest] = useState('')
  const [error, setError] = useState('')

  const loadRoom = useCallback(
    async ({
      silent = false,
      signal,
    } = {}) => {
      if (!conversationId) return
      if (!silent) setLoading(true)

      try {
        const data = await getAuthorChatMessages(
          conversationId,
          {
            limit: silent ? 20 : 50,
            signal,
          }
        )

        const incomingMessages =
          Array.isArray(data.messages)
            ? data.messages
            : []
        const roomConversation =
          data.conversation || null

        pollCursorRef.current =
          getLatestMessageCursor(
            incomingMessages,
            roomConversation?.last_message_at ||
              roomConversation?.created_at ||
              pollCursorRef.current
          )

        const hasNewIncoming =
          silent &&
          incomingMessages.some(
            (message) =>
              !message.is_mine &&
              !knownMessageIdsRef.current.has(
                String(message.id)
              )
          )

        for (const message of incomingMessages) {
          knownMessageIdsRef.current.add(
            String(message.id)
          )
        }

        setConversation(roomConversation)

        if (silent) {
          setMessages((current) =>
            mergeMessages(
              current,
              incomingMessages
            )
          )
        } else {
          setMessages(incomingMessages)
        }

        setError('')

        const unreadCount = Number(
          data.conversation?.unread_count || 0
        )

        if (
          unreadCount > 0 &&
          (!silent || hasNewIncoming) &&
          document.visibilityState === 'visible'
        ) {
          markAuthorChatRead(
            conversationId,
            { signal }
          ).catch(() => null)
        }
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

        if (
          loadError.status === 401 ||
          loadError.code ===
            'AUTHOR_CHAT_ACCESS_DENIED'
        ) {
          navigate('/author/page/chat', {
            replace: true,
          })
          return
        }

        if (!silent) {
          setError(
            loadError.message ||
              'Failed to load Page conversation'
          )
        }
      } finally {
        if (!silent && !signal?.aborted) {
          setLoading(false)
        }
      }
    },
    [conversationId, navigate]
  )

  const loadIncrementalMessages = useCallback(
    async ({ signal } = {}) => {
      if (
        !conversationId ||
        incrementalLoadingRef.current
      ) {
        return
      }

      const after = pollCursorRef.current

      if (!after) {
        await loadRoom({ silent: true })
        return
      }

      incrementalLoadingRef.current = true

      try {
        const data = await getAuthorChatMessages(
          conversationId,
          {
            after,
            limit: 20,
            signal,
          }
        )

        const incomingMessages =
          Array.isArray(data.messages)
            ? data.messages
            : []

        if (!incomingMessages.length) {
          return
        }

        const hasNewIncoming =
          incomingMessages.some(
            (message) => !message.is_mine
          )

        for (const message of incomingMessages) {
          knownMessageIdsRef.current.add(
            String(message.id)
          )
        }

        setMessages((current) =>
          mergeMessages(
            current,
            incomingMessages
          )
        )

        pollCursorRef.current =
          getLatestMessageCursor(
            incomingMessages,
            after
          )

        if (
          hasNewIncoming &&
          document.visibilityState === 'visible'
        ) {
          markAuthorChatRead(
            conversationId,
            { signal }
          ).catch(() => null)
        }
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

        if (
          loadError.status === 401 ||
          loadError.code ===
            'AUTHOR_CHAT_ACCESS_DENIED'
        ) {
          navigate('/author/page/chat', {
            replace: true,
          })
        }
      } finally {
        incrementalLoadingRef.current = false
      }
    },
    [
      conversationId,
      loadRoom,
      navigate,
    ]
  )

  useEffect(() => {
    if (!hasAuthorChatSession()) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()

    knownMessageIdsRef.current = new Set()
    pollCursorRef.current = ''
    incrementalLoadingRef.current = false
    loadRoom({
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [loadRoom, navigate])

  useEffect(() => {
    if (
      !conversationId ||
      conversation?.request_status !== 'accepted'
    ) {
      return undefined
    }

    const controller = new AbortController()

    const refreshRoom = () => {
      if (
        document.visibilityState !== 'visible' ||
        controller.signal.aborted
      ) {
        return
      }

      loadIncrementalMessages({
        signal: controller.signal,
      })
    }

    const intervalId = window.setInterval(
      refreshRoom,
      15000
    )

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        loadRoom({
          silent: true,
          signal: controller.signal,
        })
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      controller.abort()
      window.clearInterval(intervalId)
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [
    conversation?.request_status,
    conversationId,
    loadIncrementalMessages,
    loadRoom,
  ])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages.length])

  const counterpart = conversation?.counterpart || {}
  const canSend =
    conversation?.request_status === 'accepted' &&
    conversation?.can_send !== false

  const visibleMessages = useMemo(
    () =>
      messages.filter(
        (message) => !message.is_deleted
      ),
    [messages]
  )

  async function sendMessage() {
    const message = draft.trim()

    if (
      !message ||
      !conversationId ||
      !canSend ||
      sending
    ) {
      return
    }

    try {
      setSending(true)
      setError('')
      setDraft('')

      const data = await sendAuthorChatMessage(
        conversationId,
        message
      )

      if (data.message) {
        knownMessageIdsRef.current.add(
          String(data.message.id)
        )

        setMessages((current) =>
          mergeMessages(
            current,
            [data.message]
          )
        )
      }
    } catch (sendError) {
      setDraft(message)
      setError(
        sendError.message || 'Failed to send message'
      )
    } finally {
      setSending(false)
    }
  }

  async function decide(action) {
    if (!conversationId || busyRequest) return

    try {
      setBusyRequest(action)
      setError('')

      await decideAuthorChatRequest(
        conversationId,
        action
      )

      if (action === 'decline') {
        navigate('/author/page/chat', {
          replace: true,
        })
        return
      }

      await loadRoom({ silent: true })
    } catch (decisionError) {
      setError(
        decisionError.message ||
          'Failed to update request'
      )
    } finally {
      setBusyRequest('')
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f5f5f7]">
      <header className="sticky top-0 z-40 border-b border-[#ececf0] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[720px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() =>
              navigate('/author/page/chat')
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
          >
            <ChevronLeft size={26} />
          </button>

          <Avatar person={counterpart} />

          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-bold text-[#111827]">
              {counterpart.name || 'Shadow Reader'}
            </div>
            <div className="truncate text-[10px] font-semibold text-[#8d8994]">
              {counterpart.username
                ? `@${counterpart.username}`
                : 'Page message'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="rounded-full bg-[#f2edff] px-3 py-2 text-[10px] font-bold text-[#6d46bf]"
          >
            Profile page
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/author/page/chat/${conversationId}/info`
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
          >
            <Info size={21} />
          </button>
        </div>
      </header>

      {error ? (
        <button
          type="button"
          onClick={() => setError('')}
          className="mx-auto mt-3 w-[calc(100%-2rem)] max-w-[680px] rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[12px] font-semibold text-[#c7353d]"
        >
          {error}
        </button>
      ) : null}

      {conversation?.request_status ===
        'pending' &&
      conversation?.can_decide ? (
        <section className="mx-auto mt-3 w-[calc(100%-2rem)] max-w-[680px] rounded-[18px] bg-[#f2edff] p-4">
          <div className="text-[13px] font-bold text-[#111827]">
            Message request
          </div>
          <div className="mt-1 text-[11px] leading-5 text-[#756b84]">
            Accept this request before replying.
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={Boolean(busyRequest)}
              onClick={() => decide('decline')}
              className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-white text-[12px] font-bold text-[#55515d] disabled:opacity-50"
            >
              {busyRequest === 'decline' ? (
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
              disabled={Boolean(busyRequest)}
              onClick={() => decide('accept')}
              className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#7c3aed] text-[12px] font-bold text-white disabled:opacity-50"
            >
              {busyRequest === 'accept' ? (
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
      ) : null}

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-3 pb-28 pt-4">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-20 text-[#7c3aed]">
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : visibleMessages.length ? (
          <div className="space-y-2">
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.is_mine
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-[18px] px-4 py-2.5 ${
                    message.is_mine
                      ? 'rounded-br-[6px] bg-[#7c3aed] text-white'
                      : 'rounded-bl-[6px] bg-white text-[#22222b] shadow-sm ring-1 ring-black/5'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words text-[13px] leading-5">
                    {message.body}
                  </div>
                  <div
                    className={`mt-1 text-right text-[9px] ${
                      message.is_mine
                        ? 'text-white/70'
                        : 'text-[#9a97a1]'
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-20 text-center text-[12px] font-semibold text-[#96929d]">
            No messages yet.
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ececf0] bg-white px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto flex max-w-[720px] items-end gap-2">
          <textarea
            value={draft}
            disabled={!canSend || sending}
            onChange={(event) =>
              setDraft(
                event.target.value.slice(0, 2000)
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey
              ) {
                event.preventDefault()
                sendMessage()
              }
            }}
            rows={1}
            placeholder={
              canSend
                ? 'Message...'
                : 'Accept the request to reply'
            }
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-[20px] bg-[#f2f2f5] px-4 py-3 text-[13px] leading-5 text-[#111827] outline-none disabled:opacity-60"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={
              !canSend ||
              !draft.trim() ||
              sending
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white disabled:opacity-40"
          >
            {sending ? (
              <LoaderCircle
                size={19}
                className="animate-spin"
              />
            ) : (
              <Send size={19} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
