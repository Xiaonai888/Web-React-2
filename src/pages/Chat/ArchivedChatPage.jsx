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
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  deleteChatConversation,
  getManagedChatConversations,
  hasReaderSession,
  unarchiveChatConversation,
} from '../../services/chatApi'


registerTranslationNamespace('archivedChatPage', {
  en: {
    shadowUser: 'Shadow User',
    failedLoadArchivedMessages: 'Failed to load archived messages',
    failedRestoreConversation: 'Failed to restore conversation',
    deleteConversationConfirm: 'Delete this conversation from your inbox?',
    failedDeleteConversation: 'Failed to delete conversation',
    searchArchivedChats: 'Search archived chats',
    archivedChats: 'Archived chats',
    openConversation: 'Open this conversation',
    restore: 'Restore',
    delete: 'Delete',
    noArchivedMessages: 'No archived messages',
  },
  km: {
    shadowUser: 'អ្នកប្រើ Shadow',
    failedLoadArchivedMessages: 'មិនអាចផ្ទុកការសន្ទនាដែលបានដាក់ក្នុងប័ណ្ណសារបានទេ',
    failedRestoreConversation: 'មិនអាចស្ដារការសន្ទនាបានទេ',
    deleteConversationConfirm: 'លុបការសន្ទនានេះចេញពីប្រអប់សាររបស់អ្នកមែនទេ?',
    failedDeleteConversation: 'មិនអាចលុបការសន្ទនាបានទេ',
    searchArchivedChats: 'ស្វែងរកការសន្ទនាដែលបានដាក់ក្នុងប័ណ្ណសារ',
    archivedChats: 'ការសន្ទនាដែលបានដាក់ក្នុងប័ណ្ណសារ',
    openConversation: 'បើកការសន្ទនានេះ',
    restore: 'ស្ដារ',
    delete: 'លុប',
    noArchivedMessages: 'មិនមានការសន្ទនាដែលបានដាក់ក្នុងប័ណ្ណសារទេ',
  },
  zh: {
    shadowUser: 'Shadow 用户',
    failedLoadArchivedMessages: '无法加载已归档聊天',
    failedRestoreConversation: '无法恢复聊天',
    deleteConversationConfirm: '要从收件箱中删除此聊天吗？',
    failedDeleteConversation: '无法删除聊天',
    searchArchivedChats: '搜索已归档聊天',
    archivedChats: '已归档聊天',
    openConversation: '打开此聊天',
    restore: '恢复',
    delete: '删除',
    noArchivedMessages: '暂无已归档聊天',
  },
  ja: {
    shadowUser: 'Shadow ユーザー',
    failedLoadArchivedMessages: 'アーカイブ済みチャットを読み込めませんでした',
    failedRestoreConversation: 'チャットを復元できませんでした',
    deleteConversationConfirm: 'このチャットを受信トレイから削除しますか？',
    failedDeleteConversation: 'チャットを削除できませんでした',
    searchArchivedChats: 'アーカイブ済みチャットを検索',
    archivedChats: 'アーカイブ済みチャット',
    openConversation: 'このチャットを開く',
    restore: '復元',
    delete: '削除',
    noArchivedMessages: 'アーカイブ済みチャットはありません',
  },
  ko: {
    shadowUser: 'Shadow 사용자',
    failedLoadArchivedMessages: '보관된 채팅을 불러오지 못했습니다',
    failedRestoreConversation: '채팅을 복원하지 못했습니다',
    deleteConversationConfirm: '받은편지함에서 이 채팅을 삭제하시겠습니까?',
    failedDeleteConversation: '채팅을 삭제하지 못했습니다',
    searchArchivedChats: '보관된 채팅 검색',
    archivedChats: '보관된 채팅',
    openConversation: '이 채팅 열기',
    restore: '복원',
    delete: '삭제',
    noArchivedMessages: '보관된 채팅이 없습니다',
  },
})

function Avatar({ person, t }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || person?.username || t('archivedChatPage.shadowUser')
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
  const { t } = useDisplayTranslation()
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
            t('archivedChatPage.failedLoadArchivedMessages')
        )
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [navigate, t]
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
          t('archivedChatPage.failedRestoreConversation')
      )
    } finally {
      setBusyId('')
    }
  }

  async function remove(conversationId) {
    if (busyId) return

    if (
      !window.confirm(
        t('archivedChatPage.deleteConversationConfirm')
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
          t('archivedChatPage.failedDeleteConversation')
      )
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="app-page min-h-screen bg-[#f7f7f9] dark:bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 border-b border-[#eceaf0] bg-white/95 backdrop-blur-xl dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6] dark:text-[var(--shadow-text-primary)] dark:active:bg-[var(--shadow-bg-hover)]"
            >
              <ChevronLeft size={27} />
            </button>

            {searchOpen ? (
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777a80] dark:text-[var(--shadow-text-secondary)]"
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value.slice(0, 60)
                    )
                  }
                  placeholder={t('archivedChatPage.searchArchivedChats')}
                  className="h-10 w-full rounded-full bg-[#f1f2f4] pl-11 pr-4 text-[14px] text-[#111827] outline-none placeholder:text-[#92929b] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)]"
                />
              </div>
            ) : (
              <>
                <h1 className="min-w-0 flex-1 text-[20px] font-bold leading-none text-[#111827] dark:text-[var(--shadow-text-primary)]">
                  {t('archivedChatPage.archivedChats')}
                </h1>

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f2f2f3] dark:text-[var(--shadow-text-primary)] dark:active:bg-[var(--shadow-bg-hover)]"
                  aria-label={t('archivedChatPage.searchArchivedChats')}
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
            className="mb-3 w-full rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[12px] font-semibold text-[#c7353d] dark:bg-red-500/10 dark:text-red-300"
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
                  className="rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:ring-white/10"
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
                    <Avatar person={person} t={t} />

                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-[15px] font-bold text-[#111827] dark:text-[var(--shadow-text-primary)]">
                        {person.name || t('archivedChatPage.shadowUser')}
                      </strong>
                      <span className="mt-1 block truncate text-[12px] text-[#85818c] dark:text-[var(--shadow-text-secondary)]">
                        {conversation.latest_message
                          ?.body ||
                          t('archivedChatPage.openConversation')}
                      </span>
                    </span>
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#f0eef3] pt-3 dark:border-[var(--shadow-border)]">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        restore(conversation.id)
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#f2edff] text-[11px] font-bold text-[#6f52b5] disabled:opacity-50 dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]"
                    >
                      {busy ? (
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <RotateCcw size={16} />
                      )}
                      {t('archivedChatPage.restore')}
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        remove(conversation.id)
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#fff0f1] text-[11px] font-bold text-[#c7353d] disabled:opacity-50 dark:bg-red-500/10 dark:text-red-300"
                    >
                      <Trash2 size={16} />
                      {t('archivedChatPage.delete')}
                    </button>
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed] dark:bg-[#7c3aed]/15">
              <Archive size={30} />
            </div>
            <h2 className="mt-5 text-[18px] font-bold text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {t('archivedChatPage.noArchivedMessages')}
            </h2>
          </div>
        )}
      </main>
    </div>
  )
}
