import { useEffect, useState } from 'react'
import { BadgeCheck, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ChatInboxPage from './ChatInboxPage'
import { getReaderToken } from '../../services/chatApi'
import { getMySupportConversation } from '../../services/readerSupportChatApi'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('shadowSupportInbox', {
  en: { label: 'Shadow Admin', empty: 'Private support conversation', unread: 'unread support messages', open: 'Open Shadow Admin support chat' },
  km: { label: 'Shadow Admin', empty: 'ការសន្ទនាជំនួយឯកជន', unread: 'សារជំនួយមិនទាន់អាន', open: 'បើកឆាតជាមួយ Shadow Admin' },
  zh: { label: 'Shadow Admin', empty: '私人客服对话', unread: '条未读客服消息', open: '打开 Shadow Admin 客服聊天' },
  ja: { label: 'Shadow Admin', empty: '非公開サポートチャット', unread: '件の未読サポートメッセージ', open: 'Shadow Admin チャットを開く' },
  ko: { label: 'Shadow Admin', empty: '비공개 고객지원 대화', unread: '개의 읽지 않은 지원 메시지', open: 'Shadow Admin 채팅 열기' },
})

export default function ChatInboxShellPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [support, setSupport] = useState(null)

  useEffect(() => {
    if (!getReaderToken()) return undefined
    const controller = new AbortController()
    let lastCheck = 0
    let busy = false

    const refresh = async () => {
      if (controller.signal.aborted || busy || document.visibilityState === 'hidden') return
      if (Date.now() - lastCheck < 15000) return
      lastCheck = Date.now()
      busy = true
      try {
        const response = await getMySupportConversation({ signal: controller.signal })
        if (!controller.signal.aborted) setSupport(response.conversation || null)
      } catch (error) {
        if (!controller.signal.aborted && error?.status === 401) setSupport(null)
      } finally {
        busy = false
      }
    }

    refresh()
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      controller.abort()
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const unread = Math.max(0, Number(support?.unread_for_reader) || 0)

  return <>
    {support && <div className="app-page px-3 pt-3">
      <button
        type="button"
        onClick={() => navigate('/support-chat')}
        aria-label={t('shadowSupportInbox.open')}
        className="app-card mx-auto flex w-full max-w-[760px] items-center gap-3 rounded-[16px] border border-[var(--shadow-border)] px-3 py-3 text-left"
      >
        <img src="/assets/Icons/Logo%20Shadow%203.png" alt="" className="h-12 w-12 shrink-0 rounded-full border border-[var(--shadow-border)] object-cover" />
        <span className="min-w-0 flex-1">
          <span className="app-title flex items-center gap-1.5 text-[13px] font-extrabold">{t('shadowSupportInbox.label')} <BadgeCheck size={16} className="text-blue-500" aria-hidden="true" /></span>
          <span className="app-muted mt-1 block truncate text-[12px]">{support.last_message_preview || t('shadowSupportInbox.empty')}</span>
        </span>
        {unread > 0 && <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white" title={t('shadowSupportInbox.unread')}>{unread > 99 ? '99+' : unread}</span>}
        <ChevronRight size={17} className="app-muted shrink-0" aria-hidden="true" />
      </button>
    </div>}
    <ChatInboxPage />
  </>
}
