import {
  Archive,
  LoaderCircle,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import ChatInboxPage from './ChatInboxPage'
import {
  getManagedChatConversations,
  hasReaderSession,
} from '../../services/chatApi'

export default function ChatInboxShellPage() {
  const navigate = useNavigate()
  const [archivedCount, setArchivedCount] =
    useState(0)
  const [loading, setLoading] =
    useState(true)

  const loadArchivedCount = useCallback(async () => {
    if (!hasReaderSession()) {
      setArchivedCount(0)
      setLoading(false)
      return
    }

    try {
      const data =
        await getManagedChatConversations({
          view: 'archived',
        })

      setArchivedCount(
        Array.isArray(data.conversations)
          ? data.conversations.length
          : 0
      )
    } catch {
      setArchivedCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadArchivedCount()

    const handleUpdate = () => {
      loadArchivedCount()
    }

    window.addEventListener(
      'shadow-chat-updated',
      handleUpdate
    )

    return () => {
      window.removeEventListener(
        'shadow-chat-updated',
        handleUpdate
      )
    }
  }, [loadArchivedCount])

  return (
    <>
      <ChatInboxPage />

      <button
        type="button"
        onClick={() =>
          navigate('/chat/archived')
        }
        aria-label="Open archived messages"
        className="fixed bottom-[102px] right-4 z-[96] flex h-12 items-center gap-2 rounded-full bg-white px-4 text-[12px] font-extrabold text-[#6f52b5] shadow-none transition active:scale-95"
      >
        {loading ? (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        ) : (
          <Archive size={18} />
        )}
        Archived
        {archivedCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7c3aed] px-1 text-[9px] font-extrabold text-white">
            {archivedCount > 99
              ? '99+'
              : archivedCount}
          </span>
        ) : null}
      </button>
    </>
  )
}
