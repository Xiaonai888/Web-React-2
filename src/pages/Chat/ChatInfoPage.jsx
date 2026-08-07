import {
  Ban,
  Bell,
  ChevronLeft,
  Clock3,
  FileImage,
  Flag,
  LoaderCircle,
  Pin,
  Search,
  ShieldAlert,
  Trash2,
  UserRound,
  VolumeX,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  blockChatConversation,
  deleteChatConversation,
  getChatBlockStatus,
  getChatMessages,
  hasReaderSession,
  reportChatMessage,
  unblockChatConversation,
} from '../../services/chatApi'

const REPORT_REASONS = [
  ['spam', 'Spam'],
  ['harassment', 'Harassment or bullying'],
  ['hate', 'Hate or abusive content'],
  ['sexual_content', 'Sexual or inappropriate content'],
  ['violence', 'Violence or threats'],
  ['scam', 'Scam or suspicious links'],
  ['impersonation', 'Impersonation'],
  ['privacy', 'Privacy or personal information'],
  ['other', 'Something else'],
]

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name ||
      person?.page_name ||
      person?.username ||
      'Shadow'
  ).trim()
  const avatar =
    person?.avatar_url ||
    person?.profile_image_url ||
    ''

  useEffect(() => {
    setFailed(false)
  }, [avatar])

  return (
    <span className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[30px] font-bold text-white">
      {avatar && !failed ? (
        <img
          src={avatar}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        name.charAt(0).toUpperCase() || 'S'
      )}
    </span>
  )
}

function Shortcut({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-[96px] flex-col items-center gap-2 text-[#111827] active:opacity-60"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f1f4]">
        <Icon size={22} strokeWidth={2} />
      </span>
      <span className="text-[12px] font-normal">{label}</span>
    </button>
  )
}

function Row({
  icon: Icon,
  title,
  subtitle = '',
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[58px] w-full items-center gap-4 px-1 text-left active:bg-[#f7f7f9] ${
        danger ? 'text-[#d13a42]' : 'text-[#111827]'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon size={22} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-[11px] font-normal text-[#8a8a95]">
            {subtitle}
          </span>
        ) : null}
      </span>
    </button>
  )
}

function Sheet({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/35 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />
      <section className="relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-4 sm:max-w-[460px] sm:rounded-[24px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111827]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-full px-3 text-[12px] font-semibold text-[#6b7280]"
          >
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default function ChatInfoPage() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [blockStatus, setBlockStatus] = useState({
    is_blocked: false,
    viewer_has_blocked: false,
    viewer_is_blocked: false,
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('spam')
  const [reportDetails, setReportDetails] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  const person = conversation?.counterpart || {}
  const name =
    person.name ||
    person.page_name ||
    person.username ||
    'Conversation'
  const username =
    person.username ||
    person.page_username ||
    ''
  const canDeleteForBoth =
    conversation?.conversation_type === 'reader_reader' ||
    conversation?.delete_permissions?.can_delete_for_both === true

  const reportMessage = useMemo(
    () =>
      [...messages]
        .reverse()
        .find(
          (message) =>
            !message.is_mine &&
            !message.is_deleted &&
            message.id
        ) || null,
    [messages]
  )

  const notifyUpdated = () => {
    window.dispatchEvent(new CustomEvent('shadow-chat-updated'))
  }

  const showNotice = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 2200)
  }

  const loadInfo = async () => {
    if (!conversationId) return

    if (!hasReaderSession()) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setLoading(true)
      const [roomData, blockData] = await Promise.all([
        getChatMessages(conversationId, { limit: 50 }),
        getChatBlockStatus(conversationId),
      ])

      setConversation(roomData.conversation || null)
      setMessages(
        Array.isArray(roomData.messages) ? roomData.messages : []
      )
      setBlockStatus({
        is_blocked: Boolean(blockData.block_status?.is_blocked),
        viewer_has_blocked: Boolean(
          blockData.block_status?.viewer_has_blocked
        ),
        viewer_is_blocked: Boolean(
          blockData.block_status?.viewer_is_blocked
        ),
      })
    } catch (error) {
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.status === 404
      ) {
        navigate('/chat', { replace: true })
        return
      }

      showNotice(error.message || 'Failed to load chat info')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInfo()
  }, [conversationId])

  const openProfile = () => {
    if (!username) return

    if (person.type === 'author') {
      navigate(`/author/page/${encodeURIComponent(username)}`)
      return
    }

    navigate(`/profile?username=${encodeURIComponent(username)}`)
  }

  const handleBlock = async () => {
    if (busy) return

    const unblocking = blockStatus.viewer_has_blocked
    if (
      !window.confirm(
        unblocking
          ? 'Unblock this account?'
          : 'Block this account and stop messages?'
      )
    ) {
      return
    }

    setBusy(unblocking ? 'unblock' : 'block')

    try {
      if (unblocking) {
        await unblockChatConversation(conversationId)
      } else {
        await blockChatConversation(conversationId)
      }

      await loadInfo()
      notifyUpdated()
      showNotice(unblocking ? 'Account unblocked' : 'Account blocked')
    } catch (error) {
      showNotice(error.message || 'Failed to update block')
    } finally {
      setBusy('')
    }
  }

  const handleReport = async () => {
    if (!reportMessage) {
      showNotice('No received message is available to report.')
      return
    }

    if (busy === 'report') return
    setBusy('report')

    try {
      await reportChatMessage(conversationId, reportMessage.id, {
        reason: reportReason,
        details: reportDetails.trim(),
      })
      setReportOpen(false)
      setReportDetails('')
      showNotice('Report submitted')
    } catch (error) {
      showNotice(error.message || 'Failed to submit report')
    } finally {
      setBusy('')
    }
  }

  const handleDelete = async (scope) => {
    if (busy) return

    if (
      !window.confirm(
        scope === 'for_both'
          ? 'Delete this chat for both people?'
          : 'Delete this chat from your inbox?'
      )
    ) {
      return
    }

    setBusy(scope)

    try {
      await deleteChatConversation(conversationId, scope)
      notifyUpdated()
      navigate('/chat', { replace: true })
    } catch (error) {
      showNotice(error.message || 'Failed to delete chat')
    } finally {
      setBusy('')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#7c3aed]">
        <LoaderCircle size={28} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[560px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate(`/chat/${conversationId}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Back to chat"
          >
            <ChevronLeft size={27} strokeWidth={2} />
          </button>
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[560px] px-5 pb-12">
        {notice ? (
          <div className="fixed left-1/2 top-[70px] z-[170] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[11px] font-medium text-white">
            {notice}
          </div>
        ) : null}

        <section className="flex flex-col items-center pt-6 text-center">
          <Avatar person={person} />
          <h1 className="mt-4 max-w-full truncate text-[22px] font-semibold">
            {name}
          </h1>
          {username ? (
            <p className="mt-1 text-[12px] font-normal text-[#7b7b85]">
              @{username}
            </p>
          ) : null}

          <div className="mt-6 flex items-start justify-center gap-10">
            <Shortcut icon={UserRound} label="Profile" onClick={openProfile} />
            <Shortcut
              icon={Search}
              label="Search"
              onClick={() => showNotice('Search in chat is coming soon.')}
            />
          </div>
        </section>

        <section className="mt-9">
          <h2 className="mb-2 text-[13px] font-normal text-[#777781]">
            Chat info
          </h2>
          <Row
            icon={FileImage}
            title="View media, files & links"
            onClick={() => showNotice('Coming soon')}
          />
          <Row
            icon={Pin}
            title="Pinned messages"
            onClick={() => showNotice('Coming soon')}
          />
        </section>

        <section className="mt-7">
          <h2 className="mb-2 text-[13px] font-normal text-[#777781]">
            Actions
          </h2>
          <Row
            icon={VolumeX}
            title={`Mute ${name}`}
            onClick={() => showNotice('Mute is coming soon.')}
          />
          <Row
            icon={Bell}
            title="Notifications"
            onClick={() =>
              showNotice('Chat notifications are coming soon.')
            }
          />
          <Row
            icon={Clock3}
            title="Auto-delete chat"
            onClick={() => showNotice('Auto-delete chat is coming soon.')}
          />
        </section>

        <section className="mt-7">
          <h2 className="mb-2 text-[13px] font-normal text-[#777781]">
            Privacy and report
          </h2>
          <Row
            icon={Ban}
            title={blockStatus.viewer_has_blocked ? 'Unblock' : 'Block'}
            subtitle={
              blockStatus.viewer_is_blocked &&
              !blockStatus.viewer_has_blocked
                ? 'This account has blocked messaging with you'
                : ''
            }
            danger={!blockStatus.viewer_has_blocked}
            onClick={handleBlock}
          />
          <Row
            icon={ShieldAlert}
            title="Restrict"
            onClick={() => showNotice('Restrict is coming soon.')}
          />
          <Row
            icon={Flag}
            title="Report"
            danger
            onClick={() => {
              if (!reportMessage) {
                showNotice('No received message is available to report.')
                return
              }
              setReportOpen(true)
            }}
          />
          <Row
            icon={Trash2}
            title="Delete chat"
            danger
            onClick={() => setDeleteOpen(true)}
          />
        </section>
      </main>

      {reportOpen ? (
        <Sheet title="Report this chat" onClose={() => setReportOpen(false)}>
          <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
            Choose the reason that best describes the problem in this conversation.
          </p>

          <select
            value={reportReason}
            onChange={(event) => setReportReason(event.target.value)}
            className="h-11 w-full rounded-[12px] border border-[#dedee4] bg-white px-3 text-[13px] font-normal outline-none focus:border-[#7c3aed]"
          >
            {REPORT_REASONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <textarea
            value={reportDetails}
            onChange={(event) =>
              setReportDetails(event.target.value.slice(0, 1000))
            }
            rows={4}
            placeholder="Add details (optional)"
            className="mt-3 w-full resize-none rounded-[12px] border border-[#dedee4] px-3 py-3 text-[13px] font-normal outline-none focus:border-[#7c3aed]"
          />

          <button
            type="button"
            onClick={handleReport}
            disabled={busy === 'report'}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#d13a42] text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {busy === 'report' ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Flag size={17} />
            )}
            Submit report
          </button>
        </Sheet>
      ) : null}

      {deleteOpen ? (
        <Sheet title="Delete chat" onClose={() => setDeleteOpen(false)}>
          <button
            type="button"
            onClick={() => handleDelete('for_me')}
            disabled={Boolean(busy)}
            className="flex min-h-[54px] w-full items-center gap-3 rounded-[14px] bg-[#f5f5f7] px-4 text-left text-[13px] font-medium text-[#111827] disabled:opacity-50"
          >
            <Trash2 size={19} />
            Delete for me
          </button>

          {canDeleteForBoth ? (
            <button
              type="button"
              onClick={() => handleDelete('for_both')}
              disabled={Boolean(busy)}
              className="mt-2 flex min-h-[54px] w-full items-center gap-3 rounded-[14px] bg-[#fff0f1] px-4 text-left text-[13px] font-medium text-[#d13a42] disabled:opacity-50"
            >
              <Trash2 size={19} />
              Delete for both
            </button>
          ) : null}
        </Sheet>
      ) : null}
    </div>
  )
}
