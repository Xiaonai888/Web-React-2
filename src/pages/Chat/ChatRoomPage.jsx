import {
  Ban,
  Check,
  ChevronLeft,
  EllipsisVertical,
  LoaderCircle,
  Send,
  UserRound,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  decideChatRequest,
  getChatMessages,
  hasReaderSession,
  markChatRead,
  sendChatMessage,
} from '../../services/chatApi'

function formatMessageTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: 'numeric',
      minute: '2-digit',
    }
  ).format(date)
}

function RoomAvatar({ person }) {
  const [failed, setFailed] =
    useState(false)
  const name = String(
    person?.name || 'Shadow'
  ).trim()
  const letter =
    name.charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[13px] font-extrabold text-white">
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

function RequestPanel({
  conversation,
  busyAction,
  onDecision,
}) {
  if (!conversation) return null

  if (
    conversation.request_status ===
    'pending'
  ) {
    if (conversation.can_decide) {
      return (
        <section className="mx-4 mt-4 rounded-[20px] border border-[#ded4fa] bg-[#f7f3ff] p-4">
          <h2 className="text-[13px] font-extrabold text-[#111827]">
            Message request
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-[#746b85]">
            Accept this request before continuing the conversation.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                onDecision('accept')
              }
              disabled={Boolean(busyAction)}
              className="flex h-10 items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-[10px] font-extrabold text-white disabled:opacity-50"
            >
              {busyAction === 'accept' ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Check size={15} />
              )}
              Accept
            </button>

            <button
              type="button"
              onClick={() =>
                onDecision('decline')
              }
              disabled={Boolean(busyAction)}
              className="flex h-10 items-center justify-center gap-1 rounded-[12px] border border-[#d7d7dc] bg-white text-[10px] font-extrabold text-[#5c5c65] disabled:opacity-50"
            >
              {busyAction === 'decline' ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <X size={15} />
              )}
              Decline
            </button>

            <button
              type="button"
              onClick={() =>
                onDecision('block')
              }
              disabled={Boolean(busyAction)}
              className="flex h-10 items-center justify-center gap-1 rounded-[12px] border border-[#f0c8ca] bg-white text-[10px] font-extrabold text-[#c1353b] disabled:opacity-50"
            >
              {busyAction === 'block' ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Ban size={14} />
              )}
              Block
            </button>
          </div>
        </section>
      )
    }

    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#f4efff] px-4 py-3 text-center">
        <p className="text-[11px] font-bold leading-5 text-[#705b9d]">
          Waiting for the recipient to accept your message request.
        </p>
      </section>
    )
  }

  if (
    conversation.request_status ===
    'declined'
  ) {
    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#f4f4f6] px-4 py-3 text-center">
        <p className="text-[11px] font-bold text-[#777781]">
          This message request was declined.
        </p>
      </section>
    )
  }

  if (
    conversation.request_status ===
    'blocked'
  ) {
    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#fff0f1] px-4 py-3 text-center">
        <p className="text-[11px] font-bold text-[#bd3038]">
          Messaging is blocked for this conversation.
        </p>
      </section>
    )
  }

  return null
}

function ConversationMenu({
  open,
  canOpenProfile,
  canBlock,
  busyAction,
  onClose,
  onOpenProfile,
  onBlock,
}) {
  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label="Close conversation menu"
        onClick={onClose}
        className="fixed inset-0 z-[84]"
      />

      <div className="absolute right-3 top-[56px] z-[85] w-[210px] overflow-hidden rounded-[18px] border border-[#eceaf2] bg-white p-1.5 shadow-[0_18px_45px_rgba(17,24,39,0.17)]">
        <button
          type="button"
          onClick={onOpenProfile}
          disabled={!canOpenProfile}
          className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-extrabold text-[#111827] transition hover:bg-[#f7f5fb] active:bg-[#f1edf8] disabled:opacity-45"
        >
          <UserRound size={17} />
          View profile
        </button>

        {canBlock ? (
          <button
            type="button"
            onClick={onBlock}
            disabled={Boolean(busyAction)}
            className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-extrabold text-[#c7353d] transition hover:bg-[#fff1f1] active:bg-[#ffe8e9] disabled:opacity-45"
          >
            {busyAction === 'block' ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Ban size={17} />
            )}
            Block account
          </button>
        ) : null}
      </div>
    </>
  )
}

export default function ChatRoomPage() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const bottomRef = useRef(null)
  const [conversation, setConversation] =
    useState(null)
  const [messages, setMessages] =
    useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] =
    useState(true)
  const [sending, setSending] =
    useState(false)
  const [busyAction, setBusyAction] =
    useState('')
  const [menuOpen, setMenuOpen] =
    useState(false)
  const [error, setError] = useState('')

  const notifyChatUpdated = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('shadow-chat-updated')
    )
  }, [])

  const loadRoom = useCallback(
    async ({ silent = false } = {}) => {
      if (!conversationId) return

      if (!silent) {
        setLoading(true)
      }

      try {
        const data = await getChatMessages(
          conversationId,
          { limit: 50 }
        )

        setConversation(
          data.conversation || null
        )
        setMessages(
          Array.isArray(data.messages)
            ? data.messages
            : []
        )
        setError('')

        if (
          Number(
            data.conversation
              ?.unread_count || 0
          ) > 0
        ) {
          await markChatRead(
            conversationId
          )
          notifyChatUpdated()
        }
      } catch (loadError) {
        if (loadError.status === 401) {
          navigate('/login', {
            replace: true,
          })
          return
        }

        if (
          loadError.status === 403 ||
          loadError.status === 404
        ) {
          setError(loadError.message)
          return
        }

        if (!silent) {
          setError(
            loadError.message ||
              'Failed to load conversation'
          )
        }
      } finally {
        setLoading(false)
      }
    },
    [
      conversationId,
      navigate,
      notifyChatUpdated,
    ]
  )

  useEffect(() => {
    if (!hasReaderSession()) {
      navigate('/login', {
        replace: true,
      })
      return undefined
    }

    loadRoom()

    const intervalId =
      window.setInterval(() => {
        loadRoom({ silent: true })
      }, 3000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadRoom, navigate])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages.length])

  useEffect(() => {
    setMenuOpen(false)
  }, [conversationId])

  const handleSend = async () => {
    const message = text.trim()

    if (
      !message ||
      !conversation?.can_send ||
      sending
    ) {
      return
    }

    setSending(true)

    try {
      const data = await sendChatMessage(
        conversationId,
        message
      )

      setMessages((current) => [
        ...current,
        data.message,
      ])
      setText('')
      setError('')
      notifyChatUpdated()
    } catch (sendError) {
      setError(
        sendError.message ||
          'Failed to send message'
      )
    } finally {
      setSending(false)
    }
  }

  const handleDecision = async (
    action
  ) => {
    if (busyAction) return

    if (
      action === 'block' &&
      !window.confirm(
        'Block this account and stop all messages?'
      )
    ) {
      return
    }

    setBusyAction(action)

    try {
      const data =
        await decideChatRequest(
          conversationId,
          action
        )

      setConversation(
        data.conversation || null
      )
      setMenuOpen(false)
      setError('')
      notifyChatUpdated()
    } catch (decisionError) {
      setError(
        decisionError.message ||
          'Failed to update request'
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      handleSend()
    }
  }

  const person =
    conversation?.counterpart || {}
  const canSend = Boolean(
    conversation?.can_send
  )
  const canOpenProfile = Boolean(
    person.username
  )
  const canBlock = Boolean(
    conversation &&
      conversation.request_status !== 'blocked'
  )

  const handleOpenProfile = () => {
    if (!person.username) return

    setMenuOpen(false)

    if (person.type === 'author') {
      navigate(
        `/author/page/${encodeURIComponent(
          person.username
        )}`
      )
      return
    }

    navigate(
      `/profile?username=${encodeURIComponent(
        person.username
      )}`
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f9]">
      <header className="sticky top-0 z-[80] border-b border-[#e9e9ed] bg-white/95 backdrop-blur-xl">
        <div className="relative mx-auto flex h-[64px] max-w-[620px] items-center gap-3 px-3">
          <button
            type="button"
            onClick={() =>
              navigate('/chat')
            }
            aria-label="Back to messages"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition active:scale-90"
          >
            <ChevronLeft
              size={27}
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            onClick={handleOpenProfile}
            disabled={!canOpenProfile}
            aria-label="Open profile"
            className="shrink-0 rounded-full disabled:cursor-default"
          >
            <RoomAvatar person={person} />
          </button>

          <button
            type="button"
            onClick={handleOpenProfile}
            disabled={!canOpenProfile}
            className="min-w-0 flex-1 text-left disabled:cursor-default"
          >
            <h1 className="truncate text-[14px] font-extrabold text-[#111827]">
              {person.name ||
                'Conversation'}
            </h1>
            <p className="truncate text-[10px] font-semibold text-[#92929c]">
              {person.username
                ? `@${person.username}`
                : conversation?.request_status ===
                    'accepted'
                  ? 'Messages'
                  : 'Message request'}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            aria-label="Conversation options"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f4f2f7] active:scale-90"
          >
            <EllipsisVertical size={21} />
          </button>

          <ConversationMenu
            open={menuOpen}
            canOpenProfile={canOpenProfile}
            canBlock={canBlock}
            busyAction={busyAction}
            onClose={() => setMenuOpen(false)}
            onOpenProfile={handleOpenProfile}
            onBlock={() => handleDecision('block')}
          />
        </div>
      </header>

      <main className="mx-auto max-w-[620px] pb-[118px]">
        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-4 block w-[calc(100%_-_2rem)] rounded-[16px] bg-[#fff0f1] px-4 py-3 text-left text-[11px] font-bold text-[#c7353d]"
          >
            {error}
          </button>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-28 text-[#8c8c96]">
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : conversation ? (
          <>
            <RequestPanel
              conversation={conversation}
              busyAction={busyAction}
              onDecision={handleDecision}
            />

            <div className="space-y-3 px-4 py-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.is_mine
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-[20px] px-4 py-2.5 shadow-sm ${
                      message.is_mine
                        ? 'rounded-br-[6px] bg-gradient-to-r from-[#7c3aed] to-[#9b6df2] text-white'
                        : 'rounded-bl-[6px] bg-white text-[#24242c]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-[13px] leading-5">
                      {message.body}
                    </p>
                    <p
                      className={`mt-1 text-right text-[9px] font-semibold ${
                        message.is_mine
                          ? 'text-white/75'
                          : 'text-[#9b9ba4]'
                      }`}
                    >
                      {formatMessageTime(
                        message.created_at
                      )}
                    </p>
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          </>
        ) : null}
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 z-[90] border-t border-[#e6e6ea] bg-white/95 backdrop-blur-xl"
        style={{
          paddingBottom:
            'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="mx-auto flex max-w-[620px] items-end gap-2 px-3 py-3">
          <textarea
            value={text}
            onChange={(event) =>
              setText(
                event.target.value.slice(
                  0,
                  2000
                )
              )
            }
            onKeyDown={handleKeyDown}
            disabled={!canSend || sending}
            rows={1}
            placeholder={
              canSend
                ? 'Write a message...'
                : conversation?.request_status ===
                    'pending'
                  ? 'Waiting for request approval'
                  : 'Messages are unavailable'
            }
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-[22px] border border-[#dedee4] bg-[#f7f7f9] px-4 py-3 text-[13px] leading-5 text-[#111827] outline-none transition focus:border-[#9b7be8] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={
              !canSend ||
              !text.trim() ||
              sending
            }
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_6px_16px_rgba(124,58,237,0.22)] transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {sending ? (
              <LoaderCircle
                size={19}
                className="animate-spin"
              />
            ) : (
              <Send
                size={19}
                strokeWidth={2.2}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
