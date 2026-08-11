import {
  Archive,
  Ban,
  BellOff,
  ChevronLeft,
  LoaderCircle,
  Trash2,
  UserRound,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  archiveAuthorChatConversation,
  blockAuthorChatConversation,
  deleteAuthorChatConversation,
  getAuthorChatBlockStatus,
  getAuthorChatMessages,
  getAuthorChatMuteStatus,
  hasAuthorChatSession,
  muteAuthorChatConversation,
  unblockAuthorChatConversation,
  unmuteAuthorChatConversation,
} from '../../services/authorChatApi'

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || person?.username || 'Shadow Reader'
  ).trim()
  const letter = name.charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[24px] font-bold text-white">
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

function Action({
  icon,
  title,
  text,
  danger = false,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-4 border-b border-[#eeeeF2] px-4 py-4 text-left last:border-b-0 disabled:opacity-50 ${
        danger ? 'text-[#c7353d]' : 'text-[#111827]'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          danger
            ? 'bg-[#fff0f1]'
            : 'bg-[#f2edff] text-[#7c3aed]'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-[14px] font-bold">
          {title}
        </strong>
        {text ? (
          <span className="mt-1 block text-[11px] font-semibold leading-5 text-[#8b8792]">
            {text}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function AuthorChatInfoPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [conversation, setConversation] = useState(null)
  const [muted, setMuted] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const loadInfo = useCallback(async () => {
    if (!conversationId) return

    try {
      setLoading(true)

      const [roomData, muteData, blockData] =
        await Promise.all([
          getAuthorChatMessages(
            conversationId,
            { limit: 1 }
          ),
          getAuthorChatMuteStatus(
            conversationId
          ).catch(() => ({})),
          getAuthorChatBlockStatus(
            conversationId
          ).catch(() => ({})),
        ])

      setConversation(roomData.conversation || null)
      setMuted(Boolean(muteData.is_muted))
      setBlocked(
        Boolean(
          blockData.block_status?.viewer_has_blocked
        )
      )
      setError('')
    } catch (loadError) {
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

      setError(
        loadError.message ||
          'Failed to load chat info'
      )
    } finally {
      setLoading(false)
    }
  }, [conversationId, navigate])

  useEffect(() => {
    if (!hasAuthorChatSession()) {
      navigate('/login', { replace: true })
      return
    }

    loadInfo()
  }, [loadInfo, navigate])

  async function runAction(action) {
    if (!conversationId || busy) return

    try {
      setBusy(action)
      setError('')

      if (action === 'mute') {
        await muteAuthorChatConversation(
          conversationId,
          'forever'
        )
        setMuted(true)
      }

      if (action === 'unmute') {
        await unmuteAuthorChatConversation(
          conversationId
        )
        setMuted(false)
      }

      if (action === 'block') {
        if (
          !window.confirm(
            'Block this reader from messaging you?'
          )
        ) {
          return
        }

        await blockAuthorChatConversation(
          conversationId
        )
        setBlocked(true)
      }

      if (action === 'unblock') {
        await unblockAuthorChatConversation(
          conversationId
        )
        setBlocked(false)
      }

      if (action === 'archive') {
        await archiveAuthorChatConversation(
          conversationId
        )
        navigate('/author/page/chat', {
          replace: true,
        })
      }

      if (action === 'delete') {
        if (
          !window.confirm(
            'Delete this Page conversation from your inbox?'
          )
        ) {
          return
        }

        await deleteAuthorChatConversation(
          conversationId
        )
        navigate('/author/page/chat', {
          replace: true,
        })
      }
    } catch (actionError) {
      setError(
        actionError.message ||
          'Failed to update conversation'
      )
    } finally {
      setBusy('')
    }
  }

  const person = conversation?.counterpart || {}

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <header className="sticky top-0 z-40 border-b border-[#ececf0] bg-white">
        <div className="mx-auto flex h-[60px] max-w-[620px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/author/page/chat/${conversationId}`
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
          >
            <ChevronLeft size={26} />
          </button>

          <h1 className="min-w-0 flex-1 text-[17px] font-bold text-[#111827]">
            Chat info
          </h1>

          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="rounded-full bg-[#f2edff] px-3 py-2 text-[11px] font-bold text-[#6d46bf]"
          >
            Profile page
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[620px] pb-[max(30px,env(safe-area-inset-bottom))]">
        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[12px] font-semibold text-[#c7353d]"
          >
            {error}
          </button>
        ) : null}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center text-[#7c3aed]">
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : (
          <>
            <section className="bg-white px-4 py-7 text-center">
              <div className="flex justify-center">
                <Avatar person={person} />
              </div>
              <h2 className="mt-3 text-[19px] font-bold text-[#111827]">
                {person.name || 'Shadow Reader'}
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-[#8d8994]">
                {person.username
                  ? `@${person.username}`
                  : 'Reader'}
              </p>
            </section>

            <section className="mt-3 bg-white">
              <Action
                icon={<BellOff size={20} />}
                title={muted ? 'Unmute' : 'Mute'}
                text={
                  muted
                    ? 'Receive notifications from this chat again.'
                    : 'Stop notifications from this chat.'
                }
                disabled={Boolean(busy)}
                onClick={() =>
                  runAction(
                    muted ? 'unmute' : 'mute'
                  )
                }
              />

              <Action
                icon={<Archive size={20} />}
                title="Archive"
                text="Move this conversation to Archived chats."
                disabled={Boolean(busy)}
                onClick={() =>
                  runAction('archive')
                }
              />

              <Action
                icon={<Ban size={20} />}
                title={blocked ? 'Unblock' : 'Block'}
                text={
                  blocked
                    ? 'Allow this reader to message again.'
                    : 'Stop this reader from messaging you.'
                }
                danger={!blocked}
                disabled={Boolean(busy)}
                onClick={() =>
                  runAction(
                    blocked ? 'unblock' : 'block'
                  )
                }
              />

              <Action
                icon={<Trash2 size={20} />}
                title="Delete conversation"
                text="Remove this Page conversation from your inbox."
                danger
                disabled={Boolean(busy)}
                onClick={() =>
                  runAction('delete')
                }
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
