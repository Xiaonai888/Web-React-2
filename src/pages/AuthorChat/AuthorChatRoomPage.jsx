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
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorChatRoom', {
  "en": {
    "shadowReader": "Shadow Reader",
    "failedLoadConversation": "Failed to load Page conversation",
    "failedSendMessage": "Failed to send message",
    "failedUpdateRequest": "Failed to update request",
    "pageMessage": "Page message",
    "profilePage": "Profile page",
    "messageRequest": "Message request",
    "requestHelp": "Accept this request before replying.",
    "decline": "Decline",
    "accept": "Accept",
    "noMessages": "No messages yet.",
    "messagePlaceholder": "Message...",
    "acceptToReply": "Accept the request to reply"
  },
  "km": {
    "shadowReader": "អ្នកអាន Shadow",
    "failedLoadConversation": "មិនអាចផ្ទុកការសន្ទនា Page បានទេ",
    "failedSendMessage": "មិនអាចផ្ញើសារបានទេ",
    "failedUpdateRequest": "មិនអាចអាប់ដេតសំណើបានទេ",
    "pageMessage": "សារ Page",
    "profilePage": "ទំព័រ Profile",
    "messageRequest": "សំណើសារ",
    "requestHelp": "ទទួលយកសំណើនេះមុនពេលឆ្លើយតប។",
    "decline": "បដិសេធ",
    "accept": "ទទួលយក",
    "noMessages": "មិនទាន់មានសារ។",
    "messagePlaceholder": "សារ...",
    "acceptToReply": "ទទួលយកសំណើដើម្បីឆ្លើយតប"
  },
  "zh": {
    "shadowReader": "Shadow 读者",
    "failedLoadConversation": "无法加载 Page 对话",
    "failedSendMessage": "无法发送消息",
    "failedUpdateRequest": "无法更新请求",
    "pageMessage": "Page 消息",
    "profilePage": "个人主页",
    "messageRequest": "消息请求",
    "requestHelp": "回复前请先接受此请求。",
    "decline": "拒绝",
    "accept": "接受",
    "noMessages": "暂无消息。",
    "messagePlaceholder": "消息...",
    "acceptToReply": "接受请求后即可回复"
  },
  "ja": {
    "shadowReader": "Shadow 読者",
    "failedLoadConversation": "Page の会話を読み込めませんでした",
    "failedSendMessage": "メッセージを送信できませんでした",
    "failedUpdateRequest": "リクエストを更新できませんでした",
    "pageMessage": "Page メッセージ",
    "profilePage": "プロフィールページ",
    "messageRequest": "メッセージリクエスト",
    "requestHelp": "返信する前にこのリクエストを承認してください。",
    "decline": "拒否",
    "accept": "承認",
    "noMessages": "メッセージはまだありません。",
    "messagePlaceholder": "メッセージ...",
    "acceptToReply": "返信するにはリクエストを承認してください"
  },
  "ko": {
    "shadowReader": "Shadow 독자",
    "failedLoadConversation": "Page 대화를 불러오지 못했습니다",
    "failedSendMessage": "메시지를 보내지 못했습니다",
    "failedUpdateRequest": "요청을 업데이트하지 못했습니다",
    "pageMessage": "Page 메시지",
    "profilePage": "프로필 페이지",
    "messageRequest": "메시지 요청",
    "requestHelp": "답장하기 전에 이 요청을 수락하세요.",
    "decline": "거절",
    "accept": "수락",
    "noMessages": "아직 메시지가 없습니다.",
    "messagePlaceholder": "메시지...",
    "acceptToReply": "답장하려면 요청을 수락하세요"
  }
})

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || person?.username || getDisplayText('authorChatRoom.shadowReader')
  ).trim()
  const letter = name.charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-bold text-[var(--shadow-bg-surface)]">
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

  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
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
  useDisplayTranslation()
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
              getDisplayText('authorChatRoom.failedLoadConversation')
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
        sendError.message || getDisplayText('authorChatRoom.failedSendMessage')
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
          getDisplayText('authorChatRoom.failedUpdateRequest')
      )
    } finally {
      setBusyRequest('')
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[720px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() =>
              navigate('/author/page/chat')
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <ChevronLeft size={26} />
          </button>

          <Avatar person={counterpart} />

          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-bold text-[var(--shadow-text-primary)]">
              {counterpart.name || getDisplayText('authorChatRoom.shadowReader')}
            </div>
            <div className="truncate text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
              {counterpart.username
                ? `@${counterpart.username}`
                : getDisplayText('authorChatRoom.pageMessage')}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="rounded-full bg-[var(--shadow-bg-soft)] px-3 py-2 text-[10px] font-bold text-[#7c3aed]"
          >
            {getDisplayText('authorChatRoom.profilePage')}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/author/page/chat/${conversationId}/info`
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
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
        <section className="mx-auto mt-3 w-[calc(100%-2rem)] max-w-[680px] rounded-[18px] bg-[var(--shadow-bg-elevated)] p-4 ring-1 ring-[var(--shadow-border)]">
          <div className="text-[13px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('authorChatRoom.messageRequest')}
          </div>
          <div className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
            {getDisplayText('authorChatRoom.requestHelp')}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={Boolean(busyRequest)}
              onClick={() => decide('decline')}
              className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[var(--shadow-bg-surface)] text-[12px] font-bold text-[var(--shadow-text-secondary)] disabled:opacity-50"
            >
              {busyRequest === 'decline' ? (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <X size={16} />
              )}
              {getDisplayText('authorChatRoom.decline')}
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
              {getDisplayText('authorChatRoom.accept')}
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
                      : 'rounded-bl-[6px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words text-[13px] leading-5">
                    {message.body}
                  </div>
                  <div
                    className={`mt-1 text-right text-[9px] ${
                      message.is_mine
                        ? 'text-white/70'
                        : 'text-[var(--shadow-text-tertiary)]'
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
          <div className="flex flex-1 items-center justify-center py-20 text-center text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
            {getDisplayText('authorChatRoom.noMessages')}
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
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
                ? getDisplayText('authorChatRoom.messagePlaceholder')
                : getDisplayText('authorChatRoom.acceptToReply')
            }
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-[20px] bg-[var(--shadow-input-bg)] px-4 py-3 text-[13px] leading-5 text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)] disabled:opacity-60"
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
