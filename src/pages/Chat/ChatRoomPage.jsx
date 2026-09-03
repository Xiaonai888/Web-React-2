import {
  Archive,
  Ban,
  Check,
  ChevronLeft,
  ChevronUp,
  Copy,
  CornerUpLeft,
  EllipsisVertical,
  Flag,
  Camera,
  Forward,
  Info,
  Image,
  LoaderCircle,
  Pencil,
  Pin,
  PinOff,
  Search,
  Send,
  Smile,
  Trash2,
  UserRound,
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
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  MAX_CHAT_MESSAGE_SELECTION,
  archiveChatConversation,
  blockChatConversation,
  decideChatRequest,
  deleteChatConversation,
  deleteChatMessages,
  editChatMessage,
  forwardChatMessages,
  getChatBlockStatus,
  getChatConversations,
  getChatMessages,
  getPinnedChatMessages,
  hasReaderSession,
  markChatRead,
  pinChatMessage,
  replyChatMessage,
  reportChatMessage,
  sendChatMessage,
  unblockChatConversation,
  unpinChatMessage,
} from '../../services/chatApi'

const REPORT_REASONS = [
  ['spam', 'Spam'],
  ['harassment', 'Harassment'],
  ['hate', 'Hate'],
  ['sexual_content', 'Sexual content'],
  ['violence', 'Violence'],
  ['scam', 'Scam'],
  ['impersonation', 'Impersonation'],
  ['privacy', 'Privacy'],
  ['other', 'Other'],
]

function formatMessageTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatFullDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

function mergeMessages(current, incoming) {
  const messageMap = new Map()

  for (const message of [
    ...(current || []),
    ...(incoming || []),
  ]) {
    if (message?.id) {
      messageMap.set(String(message.id), message)
    }
  }

  return [...messageMap.values()].sort(
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

function isNearPageBottom() {
  const pageHeight =
    document.documentElement.scrollHeight

  return (
    window.scrollY + window.innerHeight >=
    pageHeight - 180
  )
}

function clampMenuPosition(x, y) {
  const width = 228
  const height = 390
  const margin = 12

  return {
    x: Math.max(
      margin,
      Math.min(x, window.innerWidth - width - margin)
    ),
    y: Math.max(
      margin,
      Math.min(y, window.innerHeight - height - margin)
    ),
  }
}

async function copyToClipboard(value) {
  const text = String(value || '')

  if (!text) return

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

function RoomAvatar({ person, size = 'normal' }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || 'Shadow'
  ).trim()
  const letter =
    name.charAt(0).toUpperCase() || 'S'
  const sizeClass =
    size === 'small'
      ? 'h-9 w-9 text-[12px]'
      : 'h-10 w-10 text-[13px]'

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] font-extrabold text-white ${sizeClass}`}
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

function ModalShell({
  title,
  children,
  onClose,
  width = 'max-w-[430px]',
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section
        className={`relative z-10 max-h-[88vh] w-full overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:rounded-[24px] ${width}`}
      >
        <header className="flex h-[58px] items-center justify-between border-b border-[#ececf0] px-4">
          <h2 className="text-[14px] font-extrabold text-[#111827]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#555560] transition hover:bg-[#f4f4f6] active:scale-90"
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

function RequestPanel({
  conversation,
  blockStatus,
  busyAction,
  onDecision,
}) {
  if (!conversation) return null

  if (conversation.request_status === 'pending') {
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
              onClick={() => onDecision('accept')}
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
              onClick={() => onDecision('decline')}
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
              onClick={() => onDecision('block')}
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

  if (conversation.request_status === 'declined') {
    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#f4f4f6] px-4 py-3 text-center">
        <p className="text-[11px] font-bold text-[#777781]">
          This message request was declined.
        </p>
      </section>
    )
  }

  if (conversation.request_status === 'blocked') {
    const blockedMessage =
      blockStatus.viewer_has_blocked
        ? 'You blocked this account. Open the 3 dots menu to unblock it.'
        : blockStatus.viewer_is_blocked
          ? 'This account blocked messaging with you.'
          : 'Messaging is blocked for this conversation.'

    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#fff0f1] px-4 py-3 text-center">
        <p className="text-[11px] font-bold leading-5 text-[#bd3038]">
          {blockedMessage}
        </p>
      </section>
    )
  }

  return null
}

function ConversationMenu({
  open,
  isGroup,
  canOpenProfile,
  canBlock,
  canUnblock,
  blockedByOther,
  busyAction,
  onClose,
  onOpenProfile,
  onArchive,
  onDelete,
  onBlock,
  onUnblock,
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

      <div className="absolute right-3 top-[56px] z-[85] w-[220px] overflow-hidden rounded-[18px] border border-[#eceaf2] bg-white p-1.5 shadow-[0_18px_45px_rgba(17,24,39,0.17)]">
        {!isGroup ? (
          <button
            type="button"
            onClick={onOpenProfile}
            disabled={!canOpenProfile || Boolean(busyAction)}
            className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#111827] transition hover:bg-[#f7f5fb] active:bg-[#f1edf8] disabled:opacity-45"
          >
            <UserRound size={17} />
            View profile
          </button>
        ) : null}

        <button
          type="button"
          onClick={onArchive}
          disabled={Boolean(busyAction)}
          className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#111827] transition hover:bg-[#f5f5f7] active:bg-[#ededf0] disabled:opacity-45"
        >
          {busyAction === 'archive' ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          ) : (
            <Archive size={17} />
          )}
          Archive chat
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={Boolean(busyAction)}
          className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#c7353d] transition hover:bg-[#fff1f1] active:bg-[#ffe8e9] disabled:opacity-45"
        >
          <Trash2 size={17} />
          Delete chat
        </button>

        {!isGroup ? (
          <div className="my-1 h-px bg-[#efedf3]" />
        ) : null}

        {!isGroup && canUnblock ? (
          <button
            type="button"
            onClick={onUnblock}
            disabled={Boolean(busyAction)}
            className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#111827] transition hover:bg-[#f5f5f7] active:bg-[#ededf0] disabled:opacity-45"
          >
            {busyAction === 'unblock' ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Check size={17} />
            )}
            Unblock account
          </button>
        ) : !isGroup && canBlock ? (
          <button
            type="button"
            onClick={onBlock}
            disabled={Boolean(busyAction)}
            className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#c7353d] transition hover:bg-[#fff1f1] active:bg-[#ffe8e9] disabled:opacity-45"
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
        ) : !isGroup && blockedByOther ? (
          <div className="flex min-h-11 w-full items-center gap-3 rounded-[13px] px-3 py-2 text-left text-[11px] font-normal leading-5 text-[#a64a50]">
            <Ban size={17} className="shrink-0" />
            This account blocked messaging
          </div>
        ) : null}
      </div>
    </>
  )
}

function MessageActionMenu({
  state,
  isPinned,
  busy,
  onClose,
  onAction,
}) {
  if (!state?.message) return null

  const message = state.message
  const actions = message.is_mine
    ? [
        ['reply', CornerUpLeft, 'Reply'],
        ['edit', Pencil, 'Edit'],
        [
          isPinned ? 'unpin' : 'pin',
          isPinned ? PinOff : Pin,
          isPinned ? 'Unpin' : 'Pin',
        ],
        ['copy', Copy, 'Copy text'],
        ['forward', Forward, 'Forward'],
        ['delete', Trash2, 'Delete'],
        ['select', Check, 'Select'],
        ['info', Info, 'Message info'],
      ]
    : [
        ['reply', CornerUpLeft, 'Reply'],
        [
          isPinned ? 'unpin' : 'pin',
          isPinned ? PinOff : Pin,
          isPinned ? 'Unpin' : 'Pin',
        ],
        ['copy', Copy, 'Copy text'],
        ['forward', Forward, 'Forward'],
        ['select', Check, 'Select'],
        ['report', Flag, 'Report'],
      ]

  return (
    <>
      <button
        type="button"
        aria-label="Close message menu"
        onClick={onClose}
        className="fixed inset-0 z-[102]"
      />

      <div
        className="fixed z-[103] w-[228px] overflow-hidden rounded-[18px] border border-[#e9e7ef] bg-white p-1.5 shadow-[0_20px_50px_rgba(17,24,39,0.22)]"
        style={{
          left: state.x,
          top: state.y,
        }}
      >
        {actions.map(([key, Icon, label]) => {
          const destructive =
            key === 'delete' || key === 'report'

          return (
            <button
              key={key}
              type="button"
              onClick={() => onAction(key, message)}
              disabled={Boolean(busy)}
              className={`flex h-10 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[12px] font-extrabold transition disabled:opacity-45 ${
                destructive
                  ? 'text-[#c7353d] hover:bg-[#fff1f1]'
                  : 'text-[#282832] hover:bg-[#f6f4f9]'
              }`}
            >
              {busy === key ? (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Icon size={16} />
              )}
              {label}
            </button>
          )
        })}
      </div>
    </>
  )
}

function PinnedBanner({
  pin,
  busy,
  onJump,
  onUnpin,
}) {
  if (!pin?.message) return null

  const message = pin.message

  return (
    <div className="sticky top-[64px] z-[72] border-b border-[#e9e4f7] bg-[#faf8ff]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[620px] items-center gap-3 px-4 py-2.5">
        <button
          type="button"
          onClick={() => onJump(message.id)}
          className="min-w-0 flex-1 border-l-[3px] border-[#7c3aed] pl-3 text-left"
        >
          <p className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-[#7552c6]">
            <Pin size={12} />
            Pinned message
          </p>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-[#4a4655]">
            {message.body || 'Message'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onUnpin(message.id)}
          disabled={Boolean(busy)}
          aria-label="Unpin message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7552c6] transition hover:bg-[#eee8ff] active:scale-90 disabled:opacity-45"
        >
          {busy ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <PinOff size={16} />
          )}
        </button>
      </div>
    </div>
  )
}

function ForwardModal({
  open,
  currentConversationId,
  messageIds,
  onClose,
  onForwarded,
}) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined

    let active = true
    setLoading(true)
    setError('')

    getChatConversations('accepted')
      .then((data) => {
        if (!active) return

        setConversations(
          (data.conversations || []).filter(
            (item) =>
              String(item.id) !==
                String(currentConversationId) &&
              item.can_send !== false
          )
        )
      })
      .catch((loadError) => {
        if (!active) return
        setError(
          loadError.message ||
            'Failed to load conversations'
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [open, currentConversationId])

  if (!open) return null

  const handleForward = async (targetId) => {
    if (busyId) return

    setBusyId(targetId)
    setError('')

    try {
      await forwardChatMessages({
        sourceConversationId:
          currentConversationId,
        targetConversationId: targetId,
        messageIds,
      })
      onForwarded()
    } catch (forwardError) {
      setError(
        forwardError.message ||
          'Failed to forward messages'
      )
    } finally {
      setBusyId('')
    }
  }

  return (
    <ModalShell
      title={`Forward ${messageIds.length} message${
        messageIds.length === 1 ? '' : 's'
      }`}
      onClose={onClose}
    >
      <div className="max-h-[65vh] overflow-y-auto p-3">
        {error ? (
          <p className="mb-3 rounded-[14px] bg-[#fff0f1] px-3 py-2.5 text-[11px] font-bold text-[#c7353d]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-14 text-[#8c8c96]">
            <LoaderCircle
              size={25}
              className="animate-spin"
            />
          </div>
        ) : conversations.length ? (
          <div className="space-y-1">
            {conversations.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleForward(item.id)}
                disabled={Boolean(busyId)}
                className="flex w-full items-center gap-3 rounded-[16px] p-3 text-left transition hover:bg-[#f6f3fb] active:bg-[#eee8f8] disabled:opacity-50"
              >
                <RoomAvatar
                  person={item.counterpart}
                  size="small"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-extrabold text-[#22222b]">
                    {item.counterpart?.name ||
                      'Conversation'}
                  </span>
                  <span className="block truncate text-[10px] font-semibold text-[#9696a0]">
                    {item.counterpart?.username
                      ? `@${item.counterpart.username}`
                      : 'Messages'}
                  </span>
                </span>
                {busyId === item.id ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin text-[#7c3aed]"
                  />
                ) : (
                  <Forward
                    size={18}
                    className="text-[#7c3aed]"
                  />
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-14 text-center text-[12px] font-semibold text-[#92929c]">
            No other accepted conversation is available.
          </p>
        )}
      </div>
    </ModalShell>
  )
}

function ReportModal({
  message,
  conversationId,
  onClose,
  onSubmitted,
}) {
  const [reason, setReason] = useState('spam')
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!message) return null

  const handleSubmit = async () => {
    if (busy) return

    setBusy(true)
    setError('')

    try {
      await reportChatMessage(
        conversationId,
        message.id,
        {
          reason,
          details,
        }
      )
      onSubmitted()
    } catch (reportError) {
      setError(
        reportError.message ||
          'Failed to submit report'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell
      title="Report message"
      onClose={onClose}
    >
      <div className="max-h-[70vh] overflow-y-auto p-4">
        <div className="rounded-[16px] bg-[#f5f5f7] p-3">
          <p className="line-clamp-4 whitespace-pre-wrap break-words text-[11px] leading-5 text-[#4f4f59]">
            {message.body}
          </p>
        </div>

        <label className="mt-4 block text-[11px] font-extrabold text-[#3a3a43]">
          Reason
        </label>
        <select
          value={reason}
          onChange={(event) =>
            setReason(event.target.value)
          }
          className="mt-2 h-11 w-full rounded-[14px] border border-[#dedee4] bg-white px-3 text-[12px] font-semibold text-[#22222b] outline-none focus:border-[#9b7be8]"
        >
          {REPORT_REASONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-[11px] font-extrabold text-[#3a3a43]">
          Details
        </label>
        <textarea
          value={details}
          onChange={(event) =>
            setDetails(
              event.target.value.slice(0, 1000)
            )
          }
          rows={4}
          placeholder="Add useful details for the admin review..."
          className="mt-2 w-full resize-none rounded-[14px] border border-[#dedee4] bg-white px-3 py-3 text-[12px] leading-5 text-[#22222b] outline-none focus:border-[#9b7be8]"
        />

        {error ? (
          <p className="mt-3 rounded-[14px] bg-[#fff0f1] px-3 py-2.5 text-[11px] font-bold text-[#c7353d]">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={busy}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#c7353d] text-[12px] font-extrabold text-white transition active:scale-[0.99] disabled:opacity-50"
        >
          {busy ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ) : (
            <Flag size={17} />
          )}
          Submit report
        </button>

        <p className="mt-3 text-center text-[10px] leading-4 text-[#8e8e98]">
          The conversation evidence will be preserved for admin review.
        </p>
      </div>
    </ModalShell>
  )
}

function MessageInfoModal({ message, onClose }) {
  if (!message) return null

  const rows = [
    ['Message ID', message.id],
    ['Sent', formatFullDate(message.created_at)],
    [
      'Edited',
      message.edited_at
        ? formatFullDate(message.edited_at)
        : 'No',
    ],
    [
      'Forwarded',
      message.is_forwarded ? 'Yes' : 'No',
    ],
    [
      'Reply to',
      message.reply_to_message_id || 'No',
    ],
    ['Type', message.message_type || 'text'],
  ]

  return (
    <ModalShell
      title="Message info"
      onClose={onClose}
    >
      <div className="p-4">
        <div className="rounded-[16px] bg-[#f7f7f9] p-3">
          <p className="max-h-32 overflow-y-auto whitespace-pre-wrap break-words text-[12px] leading-5 text-[#33333c]">
            {message.body || 'Message deleted'}
          </p>
        </div>

        <div className="mt-4 divide-y divide-[#ededf1] rounded-[16px] border border-[#ededf1]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-3 py-3"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#92929c]">
                {label}
              </span>
              <span className="break-all text-[11px] font-semibold text-[#34343d]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  )
}

function DeleteConversationModal({
  conversation,
  busy,
  onClose,
  onDelete,
}) {
  const isGroup =
    conversation?.is_group === true

  const canDeleteForBoth =
    !isGroup &&
    (conversation?.conversation_type ===
      'reader_reader' ||
      conversation?.delete_permissions
        ?.can_delete_for_both === true)

  return (
    <ModalShell
      title="Delete conversation"
      onClose={onClose}
    >
      <div className="p-4">
        <p className="text-[12px] leading-5 text-[#5d5d67]">
          Deleted chat evidence is kept securely for 90 days and can only be reviewed by authorized admins when needed.
        </p>

        <button
          type="button"
          onClick={() => onDelete('for_me')}
          disabled={Boolean(busy)}
          className="mt-4 flex min-h-[58px] w-full items-center gap-3 rounded-[16px] border border-[#ececf0] px-4 text-left transition hover:bg-[#f7f7f9] disabled:opacity-50"
        >
          {busy === 'for_me' ? (
            <LoaderCircle
              size={20}
              className="animate-spin text-[#7c3aed]"
            />
          ) : (
            <Trash2
              size={20}
              className="text-[#7c3aed]"
            />
          )}
          <span>
            <span className="block text-[12px] font-extrabold text-[#2a2a33]">
              Delete for me
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold text-[#91919b]">
              Removes this chat only from your inbox.
            </span>
          </span>
        </button>

        {canDeleteForBoth ? (
          <button
            type="button"
            onClick={() => onDelete('for_both')}
            disabled={Boolean(busy)}
            className="mt-2 flex min-h-[58px] w-full items-center gap-3 rounded-[16px] border border-[#f1d5d7] px-4 text-left transition hover:bg-[#fff3f4] disabled:opacity-50"
          >
            {busy === 'for_both' ? (
              <LoaderCircle
                size={20}
                className="animate-spin text-[#c7353d]"
              />
            ) : (
              <Trash2
                size={20}
                className="text-[#c7353d]"
              />
            )}
            <span>
              <span className="block text-[12px] font-extrabold text-[#c7353d]">
                Delete for both
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold text-[#a8787c]">
                Removes the old chat from both inboxes.
              </span>
            </span>
          </button>
        ) : (
          <p className="mt-3 rounded-[14px] bg-[#f7f3ff] px-3 py-2.5 text-[10px] font-bold leading-4 text-[#705b9d]">
            {isGroup
              ? 'Group chats can only be deleted from your own inbox.'
              : 'Author Page conversations can only be deleted from your own side.'}
          </p>
        )}
      </div>
    </ModalShell>
  )
}

function MessageBubble({
  message,
  selected,
  selectionMode,
  highlighted,
  isPinned,
  isRead,
  setMessageRef,
  onOpenMenu,
  onToggleSelection,
  onJumpToReply,
}) {
  const longPressTimerRef = useRef(null)
  const pointerStartRef = useRef(null)

  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(
        longPressTimerRef.current
      )
      longPressTimerRef.current = null
    }
  }

  const handlePointerDown = (event) => {
    if (
      message.is_deleted ||
      event.pointerType !== 'touch'
    ) {
      return
    }

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    longPressTimerRef.current =
      window.setTimeout(() => {
        onOpenMenu(
          message,
          event.clientX,
          event.clientY
        )
        longPressTimerRef.current = null
      }, 550)
  }

  const handlePointerMove = (event) => {
    const start = pointerStartRef.current

    if (!start) return

    if (
      Math.abs(event.clientX - start.x) > 12 ||
      Math.abs(event.clientY - start.y) > 12
    ) {
      clearLongPress()
    }
  }

  const handleContextMenu = (event) => {
    if (message.is_deleted) return

    event.preventDefault()
    onOpenMenu(
      message,
      event.clientX,
      event.clientY
    )
  }

  const handleClick = () => {
    if (
      selectionMode &&
      !message.is_deleted
    ) {
      onToggleSelection(message.id)
    }
  }

  const senderName =
    message.reply_to?.sender?.name ||
    'Message'

  return (
    <div
      ref={(node) => setMessageRef(message.id, node)}
      data-message-id={message.id}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      onClick={handleClick}
      className={`group flex scroll-mt-[150px] rounded-[16px] px-1 py-0.5 transition ${
        message.is_mine
          ? 'justify-end'
          : 'justify-start'
      } ${
        selectionMode && !message.is_deleted
          ? 'cursor-pointer'
          : ''
      } ${
        selected
          ? 'bg-[#e9e0ff]'
          : highlighted
            ? 'bg-[#fff0a8]'
            : ''
      }`}
    >
      <div
        className={`flex max-w-[88%] items-center gap-1.5 ${
          message.is_mine
            ? 'flex-row-reverse'
            : 'flex-row'
        }`}
      >
        {!message.is_deleted ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              const rect =
                event.currentTarget.getBoundingClientRect()
              onOpenMenu(
                message,
                message.is_mine
                  ? rect.left - 220
                  : rect.right + 4,
                rect.top
              )
            }}
            aria-label="Message options"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8c8c96] opacity-0 transition hover:bg-white active:scale-90 group-hover:opacity-100 focus:opacity-100"
          >
            <EllipsisVertical size={17} />
          </button>
        ) : null}

        <div
          className={`min-w-0 max-w-full rounded-[20px] px-4 py-2.5 shadow-sm ${
            message.is_mine
              ? 'rounded-br-[6px] bg-gradient-to-r from-[#7c3aed] to-[#9b6df2] text-white'
              : 'rounded-bl-[6px] bg-white text-[#24242c]'
          } ${
            message.is_deleted
              ? 'border border-[#e4e4e8] bg-[#f2f2f4] text-[#8e8e97] shadow-none'
              : ''
          }`}
        >
          {message.is_forwarded ? (
            <p
              className={`mb-1 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide ${
                message.is_mine
                  ? 'text-white/70'
                  : 'text-[#7b5bc5]'
              }`}
            >
              <Forward size={11} />
              Forwarded
              {message.forwarded_from?.name
                ? ` from ${message.forwarded_from.name}`
                : ''}
            </p>
          ) : null}

          {message.reply_to_message_id ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onJumpToReply(
                  message.reply_to_message_id
                )
              }}
              className={`mb-2 block w-full rounded-[10px] border-l-[3px] px-2.5 py-2 text-left ${
                message.is_mine
                  ? 'border-white/70 bg-white/15'
                  : 'border-[#7c3aed] bg-[#f5f1ff]'
              }`}
            >
              <span
                className={`block truncate text-[9px] font-extrabold ${
                  message.is_mine
                    ? 'text-white/85'
                    : 'text-[#7552c6]'
                }`}
              >
                {senderName}
              </span>
              <span
                className={`mt-0.5 block truncate text-[10px] font-semibold ${
                  message.is_mine
                    ? 'text-white/70'
                    : 'text-[#6f6b78]'
                }`}
              >
                {message.reply_to?.is_deleted
                  ? 'Original message unavailable'
                  : message.reply_to?.body ||
                    'Original message'}
              </span>
            </button>
          ) : null}

          <p
            className={`whitespace-pre-wrap break-words text-[13px] leading-5 ${
              message.is_deleted
                ? 'italic'
                : ''
            }`}
          >
            {message.is_deleted
              ? 'Message deleted'
              : message.body}
          </p>

          <div
            className={`mt-1 flex items-center justify-end gap-1.5 text-[9px] font-semibold ${
              message.is_mine &&
              !message.is_deleted
                ? 'text-white/75'
                : 'text-[#9b9ba4]'
            }`}
          >
            {isPinned ? (
              <Pin size={10} />
            ) : null}
            {message.edited_at ? (
              <span>Edited</span>
            ) : null}
            <span>
              {formatMessageTime(
                message.created_at
              )}
            </span>
            {message.is_mine &&
            !message.is_deleted ? (
              <span
                aria-label={
                  isRead
                    ? 'Read'
                    : 'Sent'
                }
              >
                {isRead ? '✓✓' : '✓'}
              </span>
            ) : null}
          </div>
        </div>

        {selectionMode &&
        !message.is_deleted ? (
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              selected
                ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                : 'border-[#bbb9c2] bg-white text-transparent'
            }`}
          >
            <Check size={13} />
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default function ChatRoomPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { conversationId } = useParams()
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const shouldScrollBottomRef = useRef(true)
  const scrollRestoreRef = useRef(null)
  const messageRefs = useRef(new Map())
  const jumpHandledRef = useRef('')
  const pollCursorRef = useRef('')
  const incrementalLoadingRef = useRef(false)
  const [conversation, setConversation] = useState(null)
  const [blockStatus, setBlockStatus] = useState({
    is_blocked: false,
    viewer_has_blocked: false,
    viewer_is_blocked: false,
  })
  const [messages, setMessages] = useState([])
  const [pins, setPins] = useState([])
  const [nextBefore, setNextBefore] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [sending, setSending] = useState(false)
  const [busyAction, setBusyAction] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [messageMenu, setMessageMenu] = useState(null)
  const [selectedIds, setSelectedIds] = useState(
    () => new Set()
  )
  const [replyTarget, setReplyTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [forwardIds, setForwardIds] = useState([])
  const [reportTarget, setReportTarget] = useState(null)
  const [infoTarget, setInfoTarget] = useState(null)
  const [deleteChatOpen, setDeleteChatOpen] = useState(false)
  const [highlightedId, setHighlightedId] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const notifyChatUpdated = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('shadow-chat-updated')
    )
  }, [])

  const loadRoom = useCallback(
    async ({
      silent = false,
      includeMeta = true,
      signal,
    } = {}) => {
      if (!conversationId) return

      if (!silent) setLoading(true)

      try {
        const data = await getChatMessages(
          conversationId,
          {
            limit: silent ? 20 : 50,
            signal,
          }
        )

        const roomConversation =
          data.conversation || null
        const incomingMessages =
          Array.isArray(data.messages)
            ? data.messages
            : []

        pollCursorRef.current =
          getLatestMessageCursor(
            incomingMessages,
            roomConversation?.last_message_at ||
              roomConversation?.created_at ||
              pollCursorRef.current
          )

        if (includeMeta) {
          const [blockData, pinData] =
            await Promise.all([
              roomConversation?.is_group === true
                ? Promise.resolve({
                    block_status: {
                      is_blocked: false,
                      viewer_has_blocked: false,
                      viewer_is_blocked: false,
                    },
                  })
                : getChatBlockStatus(
                    conversationId,
                    { signal }
                  ),
              getPinnedChatMessages(
                conversationId,
                { signal }
              ),
            ])

          setBlockStatus({
            is_blocked: Boolean(
              blockData.block_status?.is_blocked
            ),
            viewer_has_blocked: Boolean(
              blockData.block_status
                ?.viewer_has_blocked
            ),
            viewer_is_blocked: Boolean(
              blockData.block_status
                ?.viewer_is_blocked
            ),
          })

          setPins(
            Array.isArray(pinData.pins)
              ? pinData.pins
              : []
          )
        }

        setConversation(roomConversation)

        if (silent) {
          shouldScrollBottomRef.current =
            isNearPageBottom()

          setMessages((current) =>
            mergeMessages(
              current,
              incomingMessages
            )
          )
        } else {
          shouldScrollBottomRef.current = true
          setMessages(incomingMessages)
          setNextBefore(
            data.next_before || null
          )
        }

        setError('')

        if (
          document.visibilityState === 'visible' &&
          Number(
            data.conversation?.unread_count || 0
          ) > 0
        ) {
          await markChatRead(
            conversationId,
            { signal }
          )
          notifyChatUpdated()
        }
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

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
          if (silent) {
            navigate('/chat', {
              replace: true,
            })
          } else {
            setError(loadError.message)
          }
          return
        }

        if (!silent) {
          setError(
            loadError.message ||
              'Failed to load conversation'
          )
        }
      } finally {
        if (!silent && !signal?.aborted) {
          setLoading(false)
        }
      }
    },
    [
      conversationId,
      navigate,
      notifyChatUpdated,
    ]
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
        await loadRoom({
          silent: true,
          includeMeta: false,
        })
        return
      }

      incrementalLoadingRef.current = true

      try {
        const data = await getChatMessages(
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

        shouldScrollBottomRef.current =
          isNearPageBottom()

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

        const hasNewIncoming =
          incomingMessages.some(
            (message) => !message.is_mine
          )

        if (
          hasNewIncoming &&
          document.visibilityState === 'visible'
        ) {
          await markChatRead(
            conversationId,
            { signal }
          )
          notifyChatUpdated()
        }
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

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
          navigate('/chat', {
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
      notifyChatUpdated,
    ]
  )

  useEffect(() => {
    if (!hasReaderSession()) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()

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
    if (!hasReaderSession()) {
      return undefined
    }

    const status =
      conversation?.request_status

    if (
      status !== 'accepted' &&
      status !== 'pending'
    ) {
      return undefined
    }

    const controller = new AbortController()

    const refreshMessages = () => {
      if (
        document.visibilityState !== 'visible' ||
        controller.signal.aborted
      ) {
        return
      }

      if (status === 'accepted') {
        loadIncrementalMessages({
          signal: controller.signal,
        })
        return
      }

      loadRoom({
        silent: true,
        includeMeta: false,
        signal: controller.signal,
      })
    }

    const intervalId = window.setInterval(
      refreshMessages,
      status === 'accepted' ? 15000 : 30000
    )

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        loadRoom({
          silent: true,
          includeMeta: true,
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
    loadIncrementalMessages,
    loadRoom,
  ])

  
  useEffect(() => {
    if (scrollRestoreRef.current) {
      const { previousHeight, previousY } =
        scrollRestoreRef.current

      scrollRestoreRef.current = null

      const nextHeight =
        document.documentElement.scrollHeight

      window.scrollTo({
        top:
          previousY +
          (nextHeight - previousHeight),
        behavior: 'auto',
      })
      return
    }

    if (shouldScrollBottomRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [messages.length])

  useEffect(() => {
    setMenuOpen(false)
    setMessageMenu(null)
    setSelectedIds(new Set())
    setReplyTarget(null)
    setEditTarget(null)
    setForwardIds([])
    setReportTarget(null)
    setInfoTarget(null)
    setDeleteChatOpen(false)
    setText('')
  }, [conversationId])

  useEffect(() => {
    if (!notice) return undefined

    const timeoutId = window.setTimeout(() => {
      setNotice('')
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [notice])

  const pinIds = useMemo(
    () =>
      new Set(
        pins.map((item) =>
          String(item.message_id)
        )
      ),
    [pins]
  )

  const selectedMessages = useMemo(
    () =>
      messages.filter((message) =>
        selectedIds.has(String(message.id))
      ),
    [messages, selectedIds]
  )

  const selectionMode = selectedIds.size > 0
  const selectedAllMine =
    selectedMessages.length > 0 &&
    selectedMessages.every(
      (message) => message.is_mine
    )

  const setMessageRef = useCallback(
    (id, node) => {
      const key = String(id)

      if (node) {
        messageRefs.current.set(key, node)
      } else {
        messageRefs.current.delete(key)
      }
    },
    []
  )

  const scrollToMessage = async (messageId) => {
  const key = String(messageId || '')
  let node = messageRefs.current.get(key)
  let cursor = nextBefore
  let pages = 0

  if (!node && cursor && !loadingOlder) {
    shouldScrollBottomRef.current = false
    setLoadingOlder(true)

    try {
      while (!node && cursor && pages < 20) {
        const data = await getChatMessages(conversationId, {
          before: cursor,
          limit: 50,
        })

        const older = Array.isArray(data.messages)
          ? data.messages
          : []

        setMessages((current) =>
          mergeMessages(older, current)
        )

        cursor = data.next_before || null
        setNextBefore(cursor)
        pages += 1

        await new Promise((resolve) =>
          window.requestAnimationFrame(() =>
            window.requestAnimationFrame(resolve)
          )
        )

        node = messageRefs.current.get(key)
      }
    } catch (jumpError) {
      setError(
        jumpError.message ||
          'Failed to load this message'
      )
      return
    } finally {
      setLoadingOlder(false)
    }
  }

  node = node || messageRefs.current.get(key)

  if (!node) {
    setError(
      'This message is older than the loaded history or is no longer available'
    )
    return
  }

  node.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  setHighlightedId(key)

  window.setTimeout(() => {
    setHighlightedId((current) =>
      current === key ? '' : current
    )
  }, 1600)
}

  useEffect(() => {
  const messageId = String(
    location.state?.jumpToMessageId || ''
  )
  const jumpKey = `${conversationId}:${messageId}`

  if (
    !messageId ||
    loading ||
    jumpHandledRef.current === jumpKey
  ) {
    return
  }

  jumpHandledRef.current = jumpKey
  scrollToMessage(messageId)

  navigate(location.pathname, {
    replace: true,
    state: null,
  })
}, [
  conversationId,
  loading,
  location.pathname,
  location.state,
  navigate,
])

  const refreshPins = async () => {
    const data = await getPinnedChatMessages(
      conversationId
    )
    setPins(
      Array.isArray(data.pins)
        ? data.pins
        : []
    )
  }

  const handleLoadOlder = async () => {
    if (
      !conversationId ||
      !nextBefore ||
      loadingOlder
    ) {
      return
    }

    scrollRestoreRef.current = {
      previousHeight:
        document.documentElement.scrollHeight,
      previousY: window.scrollY,
    }
    shouldScrollBottomRef.current = false
    setLoadingOlder(true)

    try {
      const data = await getChatMessages(
        conversationId,
        {
          before: nextBefore,
          limit: 50,
        }
      )

      const olderMessages =
        Array.isArray(data.messages)
          ? data.messages
          : []

      setMessages((current) =>
        mergeMessages(olderMessages, current)
      )
      setNextBefore(data.next_before || null)
      setError('')
    } catch (historyError) {
      scrollRestoreRef.current = null
      setError(
        historyError.message ||
          'Failed to load earlier messages'
      )
    } finally {
      setLoadingOlder(false)
    }
  }

  const clearComposerMode = () => {
    setReplyTarget(null)
    setEditTarget(null)
    setText('')
  }

  const handleSend = async () => {
    const message = text.trim()

    if (
      !message ||
      !conversation?.can_send ||
      sending
    ) {
      return
    }

    shouldScrollBottomRef.current = true
    setSending(true)

    try {
      if (editTarget) {
        await editChatMessage(
          conversationId,
          editTarget.id,
          message
        )
        setNotice('Message edited')
      } else if (replyTarget) {
        await replyChatMessage(
          conversationId,
          replyTarget.id,
          message
        )
      } else {
        const data = await sendChatMessage(
          conversationId,
          message
        )

        if (data.message) {
          setMessages((current) =>
            mergeMessages(current, [data.message])
          )
        }
      }

      clearComposerMode()
      setError('')
      notifyChatUpdated()
      await loadRoom({ silent: true })
    } catch (sendError) {
      setError(
        sendError.message ||
          'Failed to send message'
      )
    } finally {
      setSending(false)
    }
  }

  const handleDecision = async (action) => {
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
      if (action === 'block') {
        await blockChatConversation(conversationId)
        await loadRoom({ silent: true })
      } else {
        const data = await decideChatRequest(
          conversationId,
          action
        )
        setConversation(data.conversation || null)
      }

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

  const handleUnblock = async () => {
    if (
      busyAction ||
      !blockStatus.viewer_has_blocked
    ) {
      return
    }

    if (
      !window.confirm(
        'Unblock this account and restore messaging?'
      )
    ) {
      return
    }

    setBusyAction('unblock')

    try {
      await unblockChatConversation(conversationId)
      await loadRoom({ silent: true })
      setMenuOpen(false)
      setError('')
      notifyChatUpdated()
    } catch (unblockError) {
      setError(
        unblockError.message ||
          'Failed to unblock account'
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleArchive = async () => {
    if (busyAction || !conversationId) return

    setBusyAction('archive')

    try {
      await archiveChatConversation(conversationId)
      notifyChatUpdated()
      navigate('/chat', { replace: true })
    } catch (archiveError) {
      setError(
        archiveError.message ||
          'Failed to archive conversation'
      )
      setMenuOpen(false)
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteConversation = async (scope) => {
    if (busyAction || !conversationId) return

    setBusyAction(scope)

    try {
      await deleteChatConversation(
        conversationId,
        scope
      )
      notifyChatUpdated()
      navigate('/chat', { replace: true })
    } catch (deleteError) {
      setError(
        deleteError.message ||
          'Failed to delete conversation'
      )
      setDeleteChatOpen(false)
    } finally {
      setBusyAction('')
    }
  }

  const openMessageMenu = (
    message,
    clientX,
    clientY
  ) => {
    if (message.is_deleted) return

    const position = clampMenuPosition(
      clientX,
      clientY
    )
    setMessageMenu({
      message,
      ...position,
    })
  }

  const toggleSelection = (messageId) => {
    const key = String(messageId)

    setSelectedIds((current) => {
      const next = new Set(current)

      if (next.has(key)) {
        next.delete(key)
        return next
      }

      if (
        next.size >=
        MAX_CHAT_MESSAGE_SELECTION
      ) {
        setError(
          `You can select up to ${MAX_CHAT_MESSAGE_SELECTION} messages`
        )
        return current
      }

      next.add(key)
      return next
    })
  }

  const handleCopyMessages = async (items) => {
    const body = items
      .filter(
        (message) =>
          !message.is_deleted &&
          String(message.body || '').trim()
      )
      .map((message) => message.body)
      .join('\n\n')

    if (!body) {
      setError('No message text to copy')
      return
    }

    try {
      await copyToClipboard(body)
      setNotice('Copied')
    } catch {
      setError('Failed to copy text')
    }
  }

  const handlePinToggle = async (
    messageId,
    forceUnpin = false
  ) => {
    if (busyAction) return

    const key = String(messageId)
    const shouldUnpin =
      forceUnpin || pinIds.has(key)
    setBusyAction(
      shouldUnpin ? 'unpin' : 'pin'
    )

    try {
      if (shouldUnpin) {
        await unpinChatMessage(
          conversationId,
          messageId
        )
        setNotice('Message unpinned')
      } else {
        await pinChatMessage(
          conversationId,
          messageId
        )
        setNotice('Message pinned')
      }

      await refreshPins()
      setMessageMenu(null)
    } catch (pinError) {
      setError(
        pinError.message ||
          'Failed to update pin'
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteMessageIds = async (ids) => {
    if (!ids.length || busyAction) return

    if (
      !window.confirm(
        `Delete ${ids.length} message${
          ids.length === 1 ? '' : 's'
        } for everyone? Admin evidence is retained for 90 days.`
      )
    ) {
      return
    }

    setBusyAction('delete')

    try {
      const data = await deleteChatMessages(
        conversationId,
        ids
      )
      const deletedIds = new Set(
        (data.deleted_message_ids || ids).map(String)
      )

      setMessages((current) =>
        current.map((message) =>
          deletedIds.has(String(message.id))
            ? {
                ...message,
                body: '',
                is_deleted: true,
                deleted_at:
                  data.deleted_at ||
                  new Date().toISOString(),
              }
            : message
        )
      )
      setPins((current) =>
        current.filter(
          (pin) =>
            !deletedIds.has(
              String(pin.message_id)
            )
        )
      )
      setSelectedIds(new Set())
      setMessageMenu(null)
      setNotice('Message deleted')
      notifyChatUpdated()
    } catch (deleteError) {
      setError(
        deleteError.message ||
          'Failed to delete message'
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleMessageAction = async (
    action,
    message
  ) => {
    setMessageMenu(null)

    if (action === 'reply') {
      setEditTarget(null)
      setReplyTarget(message)
      setText('')
      window.setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
      return
    }

    if (action === 'edit') {
      setReplyTarget(null)
      setEditTarget(message)
      setText(message.body || '')
      window.setTimeout(() => {
        textareaRef.current?.focus()
        textareaRef.current?.setSelectionRange(
          message.body?.length || 0,
          message.body?.length || 0
        )
      }, 0)
      return
    }

    if (action === 'pin') {
      await handlePinToggle(message.id)
      return
    }

    if (action === 'unpin') {
      await handlePinToggle(message.id, true)
      return
    }

    if (action === 'copy') {
      await handleCopyMessages([message])
      return
    }

    if (action === 'forward') {
      setForwardIds([message.id])
      return
    }

    if (action === 'delete') {
      await handleDeleteMessageIds([message.id])
      return
    }

    if (action === 'select') {
      toggleSelection(message.id)
      return
    }

    if (action === 'info') {
      setInfoTarget(message)
      return
    }

    if (action === 'report') {
      setReportTarget(message)
    }
  }

  const handleSelectionCopy = async () => {
    await handleCopyMessages(selectedMessages)
  }

  const handleSelectionForward = () => {
    setForwardIds(
      selectedMessages
        .filter(
          (message) =>
            !message.is_deleted &&
            message.body
        )
        .map((message) => message.id)
    )
  }

  const handleSelectionDelete = async () => {
    if (!selectedAllMine) return

    await handleDeleteMessageIds(
      selectedMessages.map(
        (message) => message.id
      )
    )
  }

  const handleSelectionPin = async () => {
    if (selectedMessages.length !== 1) return

    await handlePinToggle(
      selectedMessages[0].id
    )
    setSelectedIds(new Set())
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

  useEffect(() => {
    const textarea =
      textareaRef.current

    if (!textarea) return

    const minHeight = 46
    const maxHeight = 124

    textarea.style.height =
      `${minHeight}px`
    textarea.style.overflowY =
      'hidden'

    const contentHeight =
      textarea.scrollHeight

    textarea.style.height =
      `${Math.min(
        Math.max(
          contentHeight,
          minHeight
        ),
        maxHeight
      )}px`

    textarea.style.overflowY =
      contentHeight > maxHeight
        ? 'auto'
        : 'hidden'
  }, [text])

  const person =
    conversation?.counterpart || {}

  const isGroup =
    conversation?.is_group === true

  const canSend =
    Boolean(conversation?.can_send)

  const canOpenProfile =
    !isGroup &&
    Boolean(person.username)

  const canBlock =
    !isGroup &&
    Boolean(
      conversation &&
        !blockStatus.is_blocked
    )

  const canUnblock =
    !isGroup &&
    Boolean(
      conversation &&
        blockStatus.viewer_has_blocked
    )

  const blockedByOther =
    !isGroup &&
    Boolean(
      conversation &&
        blockStatus.viewer_is_blocked &&
        !blockStatus.viewer_has_blocked
    )

  const readTimeValue =
    !isGroup &&
    conversation?.counterpart_last_read_at
      ? new Date(
          conversation.counterpart_last_read_at
        ).getTime()
      : 0

  const counterpartReadAt =
    Number.isFinite(readTimeValue)
      ? readTimeValue
      : 0

  const handleOpenChatInfo = () => {
    setMenuOpen(false)
    navigate(
      `/chat/${conversationId}/info`
    )
  }
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
    <div className="app-page chat-room-page min-h-screen">

      <style>{`
        html.dark .chat-room-page {
          background: var(--shadow-bg-page);
          color: var(--shadow-text-primary);
        }

        html.dark .chat-room-page [class~="bg-white"],
        html.dark .chat-room-page [class~="bg-white/95"] {
          background-color: var(--shadow-bg-surface) !important;
        }

        html.dark .chat-room-page [class~="text-[#111827]"],
        html.dark .chat-room-page [class~="text-[#22222b]"],
        html.dark .chat-room-page [class~="text-[#24242c]"],
        html.dark .chat-room-page [class~="text-[#282832]"],
        html.dark .chat-room-page [class~="text-[#2a2a33]"],
        html.dark .chat-room-page [class~="text-[#33333c]"],
        html.dark .chat-room-page [class~="text-[#34343d]"],
        html.dark .chat-room-page [class~="text-[#3a3a43]"],
        html.dark .chat-room-page [class~="text-[#4a4655]"],
        html.dark .chat-room-page [class~="text-[#4f4f59]"] {
          color: var(--shadow-text-primary) !important;
        }

        html.dark .chat-room-page [class~="text-[#555560]"],
        html.dark .chat-room-page [class~="text-[#5c5c65]"],
        html.dark .chat-room-page [class~="text-[#5d5d67]"],
        html.dark .chat-room-page [class~="text-[#6c6875]"],
        html.dark .chat-room-page [class~="text-[#6f6b78]"],
        html.dark .chat-room-page [class~="text-[#746b85]"],
        html.dark .chat-room-page [class~="text-[#777781]"],
        html.dark .chat-room-page [class~="text-[#8c8c96]"],
        html.dark .chat-room-page [class~="text-[#8e8e98]"],
        html.dark .chat-room-page [class~="text-[#8e8e97]"],
        html.dark .chat-room-page [class~="text-[#91919b]"],
        html.dark .chat-room-page [class~="text-[#92929c]"],
        html.dark .chat-room-page [class~="text-[#9696a0]"],
        html.dark .chat-room-page [class~="text-[#9898a2]"],
        html.dark .chat-room-page [class~="text-[#9b9ba4]"] {
          color: var(--shadow-text-secondary) !important;
        }

        html.dark .chat-room-page [class~="bg-[#f4f4f6]"],
        html.dark .chat-room-page [class~="bg-[#f5f5f7]"],
        html.dark .chat-room-page [class~="bg-[#f7f7f9]"],
        html.dark .chat-room-page [class~="bg-[#f2f2f4]"] {
          background-color: var(--shadow-bg-soft) !important;
        }

        html.dark .chat-room-page [class~="bg-[#f7f3ff]"],
        html.dark .chat-room-page [class~="bg-[#f4efff]"],
        html.dark .chat-room-page [class~="bg-[#f5f1ff]"],
        html.dark .chat-room-page [class~="bg-[#f8f5ff]"],
        html.dark .chat-room-page [class~="bg-[#e9e0ff]"],
        html.dark .chat-room-page [class~="bg-[#faf8ff]/95"] {
          background-color: rgb(124 58 237 / 0.14) !important;
        }

        html.dark .chat-room-page [class~="bg-[#fff0a8]"] {
          background-color: rgb(245 158 11 / 0.18) !important;
        }

        html.dark .chat-room-page [class~="bg-[#fff0f1]"],
        html.dark .chat-room-page [class~="bg-[#fff1f1]"] {
          background-color: rgb(229 72 77 / 0.13) !important;
        }

        html.dark .chat-room-page [class~="text-[#c7353d]"],
        html.dark .chat-room-page [class~="text-[#c1353b]"],
        html.dark .chat-room-page [class~="text-[#bd3038]"],
        html.dark .chat-room-page [class~="text-[#a64a50]"],
        html.dark .chat-room-page [class~="text-[#a8787c]"] {
          color: #fca5a5 !important;
        }

        html.dark .chat-room-page [class~="border-[#ececf0]"],
        html.dark .chat-room-page [class~="border-[#eceaf2]"],
        html.dark .chat-room-page [class~="border-[#e9e7ef]"],
        html.dark .chat-room-page [class~="border-[#e9e9ed]"],
        html.dark .chat-room-page [class~="border-[#ededf1]"],
        html.dark .chat-room-page [class~="border-[#e4e4e8]"],
        html.dark .chat-room-page [class~="border-[#dedee4]"],
        html.dark .chat-room-page [class~="border-[#d7d7dc]"],
        html.dark .chat-room-page [class~="border-[#ded9ea]"],
        html.dark .chat-room-page [class~="border-[#e6e6ea]"],
        html.dark .chat-room-page [class~="border-[#e6e0f5]"],
        html.dark .chat-room-page [class~="border-[#bbb9c2]"] {
          border-color: var(--shadow-border) !important;
        }

        html.dark .chat-room-page [class~="border-[#ded4fa]"],
        html.dark .chat-room-page [class~="border-[#e9e4f7]"] {
          border-color: rgb(124 58 237 / 0.28) !important;
        }

        html.dark .chat-room-page [class~="border-[#f0c8ca]"],
        html.dark .chat-room-page [class~="border-[#f1d5d7]"] {
          border-color: rgb(248 113 113 / 0.28) !important;
        }

        html.dark .chat-room-page [class~="hover:bg-[#f4f4f6]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f7f5fb]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f5f5f7]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f6f4f9]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f6f3fb]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f7f7f9]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f3effc]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f4f2f7]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-white"]:hover {
          background-color: var(--shadow-bg-hover) !important;
        }

        html.dark .chat-room-page [class~="active:bg-[#ededf0]"]:active,
        html.dark .chat-room-page [class~="active:bg-[#f1edf8]"]:active,
        html.dark .chat-room-page [class~="active:bg-[#eee8f8]"]:active {
          background-color: var(--shadow-bg-hover) !important;
        }

        html.dark .chat-room-page [class~="hover:bg-[#fff1f1]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#fff3f4]"]:hover,
        html.dark .chat-room-page [class~="active:bg-[#ffe8e9]"]:active {
          background-color: rgb(229 72 77 / 0.16) !important;
        }

        html.dark .chat-room-page [class~="hover:bg-[#eee8ff]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#ece6fa]"]:hover {
          background-color: rgb(124 58 237 / 0.18) !important;
        }

        html.dark .chat-room-page input,
        html.dark .chat-room-page textarea,
        html.dark .chat-room-page select {
          color: var(--shadow-text-primary);
          caret-color: var(--shadow-text-primary);
        }

        html.dark .chat-room-page textarea[class~="bg-[#f7f7f9]"],
        html.dark .chat-room-page select[class~="bg-white"],
        html.dark .chat-room-page textarea[class~="bg-white"] {
          background-color: var(--shadow-input-bg) !important;
          border-color: var(--shadow-border) !important;
        }

        html.dark .chat-room-page [class~="focus:bg-white"]:focus {
          background-color: var(--shadow-input-bg) !important;
        }

        html.dark .chat-room-page option {
          background: var(--shadow-bg-elevated);
          color: var(--shadow-text-primary);
        }
      `}</style>
      <header className="sticky top-0 z-[80] border-b border-[#e9e9ed] bg-white/95 backdrop-blur-xl">
        <div className="relative mx-auto flex h-[64px] max-w-[620px] items-center gap-3 px-3">
          {selectionMode ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setSelectedIds(new Set())
                }
                aria-label="Exit selection"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition active:scale-90"
              >
                <X size={24} />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="text-[14px] font-extrabold text-[#111827]">
                  {selectedIds.size} /{' '}
                  {MAX_CHAT_MESSAGE_SELECTION}{' '}
                  selected
                </h1>
              </div>

              <button
                type="button"
                onClick={handleSelectionCopy}
                disabled={Boolean(busyAction)}
                aria-label="Copy selected"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f4a96] transition hover:bg-[#f3effc] active:scale-90 disabled:opacity-40"
              >
                <Copy size={18} />
              </button>

              <button
                type="button"
                onClick={handleSelectionForward}
                disabled={Boolean(busyAction)}
                aria-label="Forward selected"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f4a96] transition hover:bg-[#f3effc] active:scale-90 disabled:opacity-40"
              >
                <Forward size={18} />
              </button>

              <button
                type="button"
                onClick={handleSelectionPin}
                disabled={
                  selectedMessages.length !== 1 ||
                  Boolean(busyAction)
                }
                aria-label="Pin selected"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f4a96] transition hover:bg-[#f3effc] active:scale-90 disabled:opacity-30"
              >
                <Pin size={18} />
              </button>

              <button
                type="button"
                onClick={handleSelectionDelete}
                disabled={
                  !selectedAllMine ||
                  Boolean(busyAction)
                }
                aria-label="Delete selected"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#c7353d] transition hover:bg-[#fff0f1] active:scale-90 disabled:opacity-30"
              >
                {busyAction === 'delete' ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/chat')}
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
                onClick={handleOpenChatInfo}
                aria-label="Open chat info"
                className="shrink-0 rounded-full disabled:cursor-default"
              >
                <RoomAvatar person={person} />
              </button>

              <button
                type="button"
                onClick={handleOpenChatInfo}
                className="min-w-0 flex-1 text-left"
              >
                <h1 className="truncate text-[14px] font-extrabold text-[#111827]">
                  {person.name || 'Conversation'}
                </h1>
                <p className="truncate text-[10px] font-semibold text-[#92929c]">
                  {isGroup
                    ? `${Number(
                        conversation
                          ?.member_count || 0
                      )} people`
                    : person.username
                      ? `@${person.username}`
                      : conversation
                            ?.request_status ===
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
                isGroup={isGroup}
                open={menuOpen}
                canOpenProfile={canOpenProfile}
                canBlock={canBlock}
                canUnblock={canUnblock}
                blockedByOther={blockedByOther}
                busyAction={busyAction}
                onClose={() => setMenuOpen(false)}
                onOpenProfile={handleOpenProfile}
                onArchive={handleArchive}
                onDelete={() => {
                  setMenuOpen(false)
                  setDeleteChatOpen(true)
                }}
                onBlock={() =>
                  handleDecision('block')
                }
                onUnblock={handleUnblock}
              />
            </>
          )}
        </div>
      </header>

      <PinnedBanner
        pin={pins[0]}
        busy={busyAction === 'unpin'}
        onJump={scrollToMessage}
        onUnpin={(messageId) =>
          handlePinToggle(messageId, true)
        }
      />

      <main className="mx-auto max-w-[620px] pb-[136px]">
        {notice ? (
          <div className="fixed left-1/2 top-[82px] z-[115] -translate-x-1/2 rounded-full bg-[#22222a] px-4 py-2 text-[11px] font-bold text-white shadow-xl">
            {notice}
          </div>
        ) : null}

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
              blockStatus={blockStatus}
              busyAction={busyAction}
              onDecision={handleDecision}
            />

            <div className="space-y-2.5 px-3 py-5 sm:px-4">
              {nextBefore ? (
                <div className="flex justify-center pb-2">
                  <button
                    type="button"
                    onClick={handleLoadOlder}
                    disabled={loadingOlder}
                    className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#ded9ea] bg-white px-4 text-[11px] font-extrabold text-[#6f52b5] shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingOlder ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <ChevronUp size={16} />
                    )}
                    Load earlier messages
                  </button>
                </div>
              ) : null}

              {messages.length ? (
                messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    selected={selectedIds.has(
                      String(message.id)
                    )}
                    selectionMode={selectionMode}
                    highlighted={
                      highlightedId ===
                      String(message.id)
                    }
                    isPinned={pinIds.has(
                      String(message.id)
                    )}
                    isRead={
                      !isGroup &&
                      message.is_mine &&
                      counterpartReadAt > 0 &&
                      new Date(
                        message.created_at
                      ).getTime() <=
                        counterpartReadAt
                    }
                    setMessageRef={setMessageRef}
                    onOpenMenu={openMessageMenu}
                    onToggleSelection={toggleSelection}
                    onJumpToReply={scrollToMessage}
                  />
                ))
              ) : (
                <p className="py-20 text-center text-[12px] font-semibold text-[#9898a2]">
                  No messages yet.
                </p>
              )}

              <div ref={bottomRef} />
            </div>
          </>
        ) : null}
      </main>

      {!selectionMode ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-[90] border-t border-[#e6e6ea] bg-white/95 backdrop-blur-xl"
          style={{
            paddingBottom:
              'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="mx-auto max-w-[620px] px-3 py-2.5">
            {replyTarget || editTarget ? (
              <div className="mb-2 flex items-center gap-3 rounded-[14px] border border-[#e6e0f5] bg-[#f8f5ff] px-3 py-2">
                <span className="min-w-0 flex-1 border-l-[3px] border-[#7c3aed] pl-2.5">
                  <span className="block text-[9px] font-extrabold uppercase tracking-wide text-[#7552c6]">
                    {editTarget
                      ? 'Editing message'
                      : `Replying to ${
                          replyTarget?.sender?.name ||
                          (replyTarget?.is_mine
                            ? 'yourself'
                            : 'message')
                        }`}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-semibold text-[#6c6875]">
                    {(editTarget || replyTarget)?.body}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={clearComposerMode}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7552c6] transition hover:bg-[#ece6fa] active:scale-90"
                                >
                  <X size={17} />
                </button>
              </div>
            ) : null}

            <div className="relative">
              <textarea
  ref={textareaRef}
  value={text}
  onChange={(event) =>
    setText(
      event.target.value.slice(0, 2000)
    )
  }
  onKeyDown={handleKeyDown}
  disabled={!canSend || sending}
  rows={1}
  placeholder={
    canSend
      ? editTarget
        ? 'Edit message...'
        : replyTarget
          ? 'Write a reply...'
          : 'Write a message...'
      : conversation?.request_status === 'pending'
        ? 'Waiting for request approval'
        : 'Messages are unavailable'
  }
  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
  className="block max-h-[124px] min-h-[46px] w-full resize-none overflow-y-hidden rounded-[24px] border border-[#dedee4] bg-[#f7f7f9] py-[12px] pl-[52px] pr-[52px] text-[13px] leading-5 text-[#111827] outline-none transition focus:border-[#9b7be8] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
/>

              <button
                type="button"
                onClick={() => setNotice('Coming soon')}
                disabled={!canSend || sending}
                aria-label={
                  text.trim()
                    ? 'Search messages'
                    : 'Camera'
                }
                className="absolute inset-y-0 left-[7px] my-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#9b6df2] text-white transition active:scale-90 disabled:opacity-45"
              >
                {text.trim() ? (
                  <Search size={19} />
                ) : (
                  <Camera size={20} />
                )}
              </button>

              {!text.trim() ? (
  <button
    type="button"
    onClick={() => setNotice('Coming soon')}
    disabled={!canSend || sending}
    aria-label="Image"
    className="absolute inset-y-0 right-[39px] my-auto flex h-8 w-8 items-center justify-center bg-transparent text-[#111827] transition active:scale-90 disabled:opacity-45"
  >
    <Image size={20} />
  </button>
) : null}

              <button
                type="button"
                onClick={
                  text.trim()
                    ? handleSend
                    : () =>
                        setNotice('Coming soon')
                }
                disabled={!canSend || sending}
                aria-label={
                  text.trim()
                    ? editTarget
                      ? 'Save edit'
                      : 'Send message'
                    : 'Emoji'
                }
                className={`absolute inset-y-0 right-[7px] my-auto flex h-8 w-8 items-center justify-center transition active:scale-90 disabled:opacity-45 ${
  text.trim()
    ? 'rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white'
    : 'bg-transparent text-[#111827]'
}`}
              >
                {sending ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : text.trim() ? (
                  editTarget ? (
                    <Check size={20} />
                  ) : (
                    <Send
                      size={19}
                      strokeWidth={2.2}
                    />
                  )
                ) : (
                  <Smile size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MessageActionMenu
        state={messageMenu}
        isPinned={
          messageMenu?.message
            ? pinIds.has(
                String(messageMenu.message.id)
              )
            : false
        }
        busy={busyAction}
        onClose={() => setMessageMenu(null)}
        onAction={handleMessageAction}
      />

      <ForwardModal
        open={forwardIds.length > 0}
        currentConversationId={conversationId}
        messageIds={forwardIds}
        onClose={() => setForwardIds([])}
        onForwarded={() => {
          setForwardIds([])
          setSelectedIds(new Set())
          setNotice('Message forwarded')
          notifyChatUpdated()
        }}
      />

      <ReportModal
        message={reportTarget}
        conversationId={conversationId}
        onClose={() => setReportTarget(null)}
        onSubmitted={() => {
          setReportTarget(null)
          setNotice('Report submitted')
        }}
      />

      <MessageInfoModal
        message={infoTarget}
        onClose={() => setInfoTarget(null)}
      />

      {deleteChatOpen ? (
        <DeleteConversationModal
          conversation={conversation}
          busy={
            busyAction === 'for_me' ||
            busyAction === 'for_both'
              ? busyAction
              : ''
          }
          onClose={() => {
            if (!busyAction) {
              setDeleteChatOpen(false)
            }
          }}
          onDelete={handleDeleteConversation}
        />
      ) : null}
    </div>
  )
}
