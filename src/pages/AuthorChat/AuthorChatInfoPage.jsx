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
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorChatInfo', {
  "en": {
    "shadowReader": "Shadow Reader",
    "failedLoadInfo": "Failed to load chat info",
    "confirmBlock": "Block this reader from messaging you?",
    "confirmDelete": "Delete this Page conversation from your inbox?",
    "failedUpdate": "Failed to update conversation",
    "chatInfo": "Chat info",
    "profilePage": "Profile page",
    "reader": "Reader",
    "unmute": "Unmute",
    "mute": "Mute",
    "receiveNotifications": "Receive notifications from this chat again.",
    "stopNotifications": "Stop notifications from this chat.",
    "archive": "Archive",
    "archiveHelp": "Move this conversation to Archived chats.",
    "unblock": "Unblock",
    "block": "Block",
    "allowMessages": "Allow this reader to message again.",
    "stopMessages": "Stop this reader from messaging you.",
    "deleteConversation": "Delete conversation",
    "deleteHelp": "Remove this Page conversation from your inbox."
  },
  "km": {
    "shadowReader": "អ្នកអាន Shadow",
    "failedLoadInfo": "មិនអាចផ្ទុកព័ត៌មានការសន្ទនាបានទេ",
    "confirmBlock": "រារាំងអ្នកអាននេះមិនឱ្យផ្ញើសារមកអ្នកមែនទេ?",
    "confirmDelete": "លុបការសន្ទនា Page នេះចេញពីប្រអប់សាររបស់អ្នកមែនទេ?",
    "failedUpdate": "មិនអាចអាប់ដេតការសន្ទនាបានទេ",
    "chatInfo": "ព័ត៌មានការសន្ទនា",
    "profilePage": "ទំព័រ Profile",
    "reader": "អ្នកអាន",
    "unmute": "បើកសំឡេង",
    "mute": "បិទសំឡេង",
    "receiveNotifications": "ទទួលការជូនដំណឹងពីការសន្ទនានេះម្តងទៀត។",
    "stopNotifications": "ឈប់ទទួលការជូនដំណឹងពីការសន្ទនានេះ។",
    "archive": "ទុកក្នុងបណ្ណសារ",
    "archiveHelp": "ផ្លាស់ការសន្ទនានេះទៅការសន្ទនាដែលបានទុកក្នុងបណ្ណសារ។",
    "unblock": "ដោះការរារាំង",
    "block": "រារាំង",
    "allowMessages": "អនុញ្ញាតឱ្យអ្នកអាននេះផ្ញើសារម្តងទៀត។",
    "stopMessages": "រារាំងអ្នកអាននេះមិនឱ្យផ្ញើសារមកអ្នក។",
    "deleteConversation": "លុបការសន្ទនា",
    "deleteHelp": "យកការសន្ទនា Page នេះចេញពីប្រអប់សាររបស់អ្នក។"
  },
  "zh": {
    "shadowReader": "Shadow 读者",
    "failedLoadInfo": "无法加载聊天信息",
    "confirmBlock": "阻止此读者给你发消息吗？",
    "confirmDelete": "要从收件箱中删除这个 Page 对话吗？",
    "failedUpdate": "无法更新对话",
    "chatInfo": "聊天信息",
    "profilePage": "个人主页",
    "reader": "读者",
    "unmute": "取消静音",
    "mute": "静音",
    "receiveNotifications": "重新接收此聊天的通知。",
    "stopNotifications": "停止接收此聊天的通知。",
    "archive": "归档",
    "archiveHelp": "将此对话移至已归档聊天。",
    "unblock": "取消屏蔽",
    "block": "屏蔽",
    "allowMessages": "允许此读者再次给你发消息。",
    "stopMessages": "阻止此读者给你发消息。",
    "deleteConversation": "删除对话",
    "deleteHelp": "从收件箱中移除此 Page 对话。"
  },
  "ja": {
    "shadowReader": "Shadow 読者",
    "failedLoadInfo": "チャット情報を読み込めませんでした",
    "confirmBlock": "この読者からのメッセージをブロックしますか？",
    "confirmDelete": "この Page の会話を受信トレイから削除しますか？",
    "failedUpdate": "会話を更新できませんでした",
    "chatInfo": "チャット情報",
    "profilePage": "プロフィールページ",
    "reader": "読者",
    "unmute": "ミュート解除",
    "mute": "ミュート",
    "receiveNotifications": "このチャットの通知を再び受け取ります。",
    "stopNotifications": "このチャットの通知を停止します。",
    "archive": "アーカイブ",
    "archiveHelp": "この会話をアーカイブ済みチャットへ移動します。",
    "unblock": "ブロック解除",
    "block": "ブロック",
    "allowMessages": "この読者からのメッセージを再び許可します。",
    "stopMessages": "この読者からのメッセージを停止します。",
    "deleteConversation": "会話を削除",
    "deleteHelp": "この Page の会話を受信トレイから削除します。"
  },
  "ko": {
    "shadowReader": "Shadow 독자",
    "failedLoadInfo": "채팅 정보를 불러오지 못했습니다",
    "confirmBlock": "이 독자의 메시지를 차단할까요?",
    "confirmDelete": "이 Page 대화를 받은편지함에서 삭제할까요?",
    "failedUpdate": "대화를 업데이트하지 못했습니다",
    "chatInfo": "채팅 정보",
    "profilePage": "프로필 페이지",
    "reader": "독자",
    "unmute": "음소거 해제",
    "mute": "음소거",
    "receiveNotifications": "이 채팅의 알림을 다시 받습니다.",
    "stopNotifications": "이 채팅의 알림을 중지합니다.",
    "archive": "보관",
    "archiveHelp": "이 대화를 보관된 채팅으로 이동합니다.",
    "unblock": "차단 해제",
    "block": "차단",
    "allowMessages": "이 독자가 다시 메시지를 보낼 수 있게 합니다.",
    "stopMessages": "이 독자의 메시지를 차단합니다.",
    "deleteConversation": "대화 삭제",
    "deleteHelp": "이 Page 대화를 받은편지함에서 제거합니다."
  }
})

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || person?.username || getDisplayText('authorChatInfo.shadowReader')
  ).trim()
  const letter = name.charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-text-primary)] text-[24px] font-bold text-[var(--shadow-bg-surface)]">
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
      className={`flex w-full items-center gap-4 border-b border-[var(--shadow-border)] px-4 py-4 text-left last:border-b-0 disabled:opacity-50 ${
        danger ? 'text-[#c7353d]' : 'text-[var(--shadow-text-primary)]'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          danger
            ? 'bg-[#fff0f1]'
            : 'bg-[var(--shadow-bg-soft)] text-[#7c3aed]'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-[14px] font-bold">
          {title}
        </strong>
        {text ? (
          <span className="mt-1 block text-[11px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
            {text}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function AuthorChatInfoPage() {
  useDisplayTranslation()
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
          getDisplayText('authorChatInfo.failedLoadInfo')
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
            getDisplayText('authorChatInfo.confirmBlock')
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
            getDisplayText('authorChatInfo.confirmDelete')
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
          getDisplayText('authorChatInfo.failedUpdate')
      )
    } finally {
      setBusy('')
    }
  }

  const person = conversation?.counterpart || {}

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[60px] max-w-[620px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/author/page/chat/${conversationId}`
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <ChevronLeft size={26} />
          </button>

          <h1 className="min-w-0 flex-1 text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('authorChatInfo.chatInfo')}
          </h1>

          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="rounded-full bg-[var(--shadow-bg-soft)] px-3 py-2 text-[11px] font-bold text-[#7c3aed]"
          >
            {getDisplayText('authorChatInfo.profilePage')}
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
            <section className="bg-[var(--shadow-bg-surface)] px-4 py-7 text-center">
              <div className="flex justify-center">
                <Avatar person={person} />
              </div>
              <h2 className="mt-3 text-[19px] font-bold text-[var(--shadow-text-primary)]">
                {person.name || getDisplayText('authorChatInfo.shadowReader')}
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
                {person.username
                  ? `@${person.username}`
                  : getDisplayText('authorChatInfo.reader')}
              </p>
            </section>

            <section className="mt-3 bg-[var(--shadow-bg-surface)]">
              <Action
                icon={<BellOff size={20} />}
                title={muted ? getDisplayText('authorChatInfo.unmute') : getDisplayText('authorChatInfo.mute')}
                text={
                  muted
                    ? getDisplayText('authorChatInfo.receiveNotifications')
                    : getDisplayText('authorChatInfo.stopNotifications')
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
                title={getDisplayText('authorChatInfo.archive')}
                text={getDisplayText('authorChatInfo.archiveHelp')}
                disabled={Boolean(busy)}
                onClick={() =>
                  runAction('archive')
                }
              />

              <Action
                icon={<Ban size={20} />}
                title={blocked ? getDisplayText('authorChatInfo.unblock') : getDisplayText('authorChatInfo.block')}
                text={
                  blocked
                    ? getDisplayText('authorChatInfo.allowMessages')
                    : getDisplayText('authorChatInfo.stopMessages')
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
                title={getDisplayText('authorChatInfo.deleteConversation')}
                text={getDisplayText('authorChatInfo.deleteHelp')}
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
