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
  deleteAuthorChatConversation,
  getAuthorChatConversations,
  hasAuthorChatSession,
  unarchiveAuthorChatConversation,
} from '../../services/authorChatApi'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorArchivedChat', {
  "en": {
    "shadowReader": "Shadow Reader",
    "failedLoadArchived": "Failed to load archived Page messages",
    "failedRestore": "Failed to restore conversation",
    "confirmDelete": "Delete this Page conversation from your inbox?",
    "failedDelete": "Failed to delete conversation",
    "searchArchivedChats": "Search archived chats",
    "archivedChats": "Archived chats",
    "openConversation": "Open this conversation",
    "restore": "Restore",
    "delete": "Delete",
    "noArchivedMessages": "No archived messages"
  },
  "km": {
    "shadowReader": "អ្នកអាន Shadow",
    "failedLoadArchived": "មិនអាចផ្ទុកសារ Page ដែលបានទុកក្នុងបណ្ណសារ",
    "failedRestore": "មិនអាចស្ដារការសន្ទនាបានទេ",
    "confirmDelete": "លុបការសន្ទនា Page នេះចេញពីប្រអប់សាររបស់អ្នកមែនទេ?",
    "failedDelete": "មិនអាចលុបការសន្ទនាបានទេ",
    "searchArchivedChats": "ស្វែងរកការសន្ទនាដែលបានទុកក្នុងបណ្ណសារ",
    "archivedChats": "ការសន្ទនាដែលបានទុកក្នុងបណ្ណសារ",
    "openConversation": "បើកការសន្ទនានេះ",
    "restore": "ស្ដារ",
    "delete": "លុប",
    "noArchivedMessages": "មិនមានសារដែលបានទុកក្នុងបណ្ណសារ"
  },
  "zh": {
    "shadowReader": "Shadow 读者",
    "failedLoadArchived": "无法加载已归档的 Page 消息",
    "failedRestore": "无法恢复对话",
    "confirmDelete": "要从收件箱中删除这个 Page 对话吗？",
    "failedDelete": "无法删除对话",
    "searchArchivedChats": "搜索已归档聊天",
    "archivedChats": "已归档聊天",
    "openConversation": "打开此对话",
    "restore": "恢复",
    "delete": "删除",
    "noArchivedMessages": "暂无已归档消息"
  },
  "ja": {
    "shadowReader": "Shadow 読者",
    "failedLoadArchived": "アーカイブされた Page メッセージを読み込めませんでした",
    "failedRestore": "会話を復元できませんでした",
    "confirmDelete": "この Page の会話を受信トレイから削除しますか？",
    "failedDelete": "会話を削除できませんでした",
    "searchArchivedChats": "アーカイブ済みチャットを検索",
    "archivedChats": "アーカイブ済みチャット",
    "openConversation": "この会話を開く",
    "restore": "復元",
    "delete": "削除",
    "noArchivedMessages": "アーカイブ済みメッセージはありません"
  },
  "ko": {
    "shadowReader": "Shadow 독자",
    "failedLoadArchived": "보관된 Page 메시지를 불러오지 못했습니다",
    "failedRestore": "대화를 복원하지 못했습니다",
    "confirmDelete": "이 Page 대화를 받은편지함에서 삭제할까요?",
    "failedDelete": "대화를 삭제하지 못했습니다",
    "searchArchivedChats": "보관된 채팅 검색",
    "archivedChats": "보관된 채팅",
    "openConversation": "이 대화 열기",
    "restore": "복원",
    "delete": "삭제",
    "noArchivedMessages": "보관된 메시지가 없습니다"
  }
})

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || person?.username || getDisplayText('authorArchivedChat.shadowReader')
  ).trim()
  const letter = name.charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-text-primary)] text-[16px] font-bold text-[var(--shadow-bg-surface)]">
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

export default function AuthorArchivedChatPage() {
  useDisplayTranslation()
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
        const data = await getAuthorChatConversations({
          view: 'archived',
        })

        setConversations(data.conversations || [])
        setError('')
      } catch (loadError) {
        if (loadError.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        setError(
          loadError.message ||
            getDisplayText('authorArchivedChat.failedLoadArchived')
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
      await unarchiveAuthorChatConversation(
        conversationId
      )
      await loadArchived({ silent: true })
    } catch (restoreError) {
      setError(
        restoreError.message ||
          getDisplayText('authorArchivedChat.failedRestore')
      )
    } finally {
      setBusyId('')
    }
  }

  async function remove(conversationId) {
    if (busyId) return

    if (
      !window.confirm(
        getDisplayText('authorArchivedChat.confirmDelete')
      )
    ) {
      return
    }

    try {
      setBusyId(conversationId)
      await deleteAuthorChatConversation(conversationId)
      await loadArchived({ silent: true })
    } catch (deleteError) {
      setError(
        deleteError.message ||
          getDisplayText('authorArchivedChat.failedDelete')
      )
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
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
          navigate('/author/page/chat')
        }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
      >
        <ChevronLeft size={27} />
      </button>

      {searchOpen ? (
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shadow-text-tertiary)]"
          />
          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value.slice(0, 60))
            }
            placeholder={getDisplayText('authorArchivedChat.searchArchivedChats')}
            className="h-10 w-full rounded-full bg-[var(--shadow-input-bg)] pl-11 pr-4 text-[14px] text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
          />
        </div>
      ) : (
        <>
          <h1 className="min-w-0 flex-1 text-[20px] font-bold leading-none text-[var(--shadow-text-primary)]">
            {getDisplayText('authorArchivedChat.archivedChats')}
          </h1>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={getDisplayText('authorArchivedChat.searchArchivedChats')}
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
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : visible.length ? (
          <div className="space-y-3">
            {visible.map((conversation) => {
              const person =
                conversation.counterpart || {}
              const busy = busyId === conversation.id

              return (
                <section
                  key={conversation.id}
                  className="rounded-[20px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/author/page/chat/${conversation.id}`
                      )
                    }
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <Avatar person={person} />
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-[15px] font-bold text-[var(--shadow-text-primary)]">
                        {person.name ||
                          getDisplayText('authorArchivedChat.shadowReader')}
                      </strong>
                      <span className="mt-1 block truncate text-[12px] text-[var(--shadow-text-tertiary)]">
                        {conversation.latest_message
                          ?.body ||
                          getDisplayText('authorArchivedChat.openConversation')}
                      </span>
                    </span>
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--shadow-border)] pt-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        restore(conversation.id)
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[var(--shadow-bg-soft)] text-[11px] font-bold text-[#7c3aed] disabled:opacity-50"
                    >
                      {busy ? (
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <RotateCcw size={16} />
                      )}
                      {getDisplayText('authorArchivedChat.restore')}
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
                      {getDisplayText('authorArchivedChat.delete')}
                    </button>
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
              <Archive size={30} />
            </div>
            <h2 className="mt-5 text-[18px] font-bold text-[var(--shadow-text-primary)]">
              {getDisplayText('authorArchivedChat.noArchivedMessages')}
            </h2>
          </div>
        )}
      </main>
    </div>
  )
}
