// REPLACE: Xiaonai888/Web-React-2/src/pages/Chat/ChatInboxShellPage.jsx
// This is an opt-in UI for the *existing* OneSignal web subscription.
// The underlying ChatInboxPage is untouched; no Supabase polling or second SDK.
import { useCallback, useEffect, useState } from 'react'
import { BellRing, LoaderCircle, X } from 'lucide-react'
import ChatInboxPage from './ChatInboxPage'
import {
  enableReaderChatPush,
  getReaderChatPushStatus,
} from '../../services/readerOneSignal.service'
import { getDisplayLanguageId } from '../../utils/displayLanguage'

const MESSAGES = {
  en: {
    heading: 'Get chat notifications',
    description: 'Get notified when someone messages you, even when Shadow is closed.',
    action: 'Enable',
    blocked: 'Notifications are blocked in this browser. Allow notifications in your browser settings.',
    unavailable: 'Unable to check notification permissions. Try again.',
    retry: 'Retry',
    close: 'Dismiss',
  },
  km: {
    heading: 'បើកការជូនដំណឹង Chat',
    description: 'ទទួលដំណឹងពេលមានអ្នកផ្ញើសារមក ទោះបីអ្នកបិទ Shadow ក៏ដោយ។',
    action: 'បើក',
    blocked: 'Browser បានបិទការជូនដំណឹង។ សូមអនុញ្ញាត Notifications ក្នុង Browser Settings។',
    unavailable: 'មិនអាចពិនិត្យការជូនដំណឹងបានទេ។ សូមសាកម្តងទៀត។',
    retry: 'សាកម្ដងទៀត',
    close: 'បិទ',
  },
  zh: {
    heading: '开启聊天通知',
    description: '即使关闭 Shadow，也能收到新消息通知。',
    action: '开启',
    blocked: '此浏览器已阻止通知，请在浏览器设置中允许通知。',
    unavailable: '无法检查通知权限，请重试。',
    retry: '重试',
    close: '关闭',
  },
  ja: {
    heading: 'チャット通知を有効にする',
    description: 'Shadow を閉じていても新着メッセージを通知します。',
    action: '有効にする',
    blocked: 'ブラウザが通知をブロックしています。設定で通知を許可してください。',
    unavailable: '通知の権限を確認できません。もう一度お試しください。',
    retry: '再試行',
    close: '閉じる',
  },
  ko: {
    heading: '채팅 알림 켜기',
    description: 'Shadow를 닫아도 새 메시지 알림을 받을 수 있습니다.',
    action: '켜기',
    blocked: '브라우저에서 알림이 차단되었습니다. 브라우저 설정에서 허용하세요.',
    unavailable: '알림 권한을 확인할 수 없습니다. 다시 시도하세요.',
    retry: '다시 시도',
    close: '닫기',
  },
}

export default function ChatInboxShellPage() {
  const [status, setStatus] = useState('checking')
  const [busy, setBusy] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const language = getDisplayLanguageId()
  const t = MESSAGES[language] || MESSAGES.en

  const refreshStatus = useCallback(async () => {
    try {
      setStatus(await getReaderChatPushStatus())
    } catch {
      setStatus('unavailable')
    }
  }, [])

  useEffect(() => {
    let active = true
    void getReaderChatPushStatus().then((next) => {
      if (active) setStatus(next)
    }).catch(() => {
      if (active) setStatus('unavailable')
    })
    return () => { active = false }
  }, [])

  const handleEnable = async () => {
    if (busy) return
    setBusy(true)
    try {
      const enabled = await enableReaderChatPush()
      if (enabled) {
        setStatus('enabled')
        return
      }
      await refreshStatus()
    } catch {
      await refreshStatus()
    } finally {
      setBusy(false)
    }
  }

  const showPrompt = !dismissed &&
    ['not_enabled', 'blocked', 'unavailable'].includes(status)

  return (
    <>
      {showPrompt ? (
        <aside
          aria-label={t.heading}
          className="mx-auto flex max-w-[620px] items-start gap-3 border-b border-[#ebe9ed] bg-white px-4 py-3 text-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-primary)]"
        >
          <BellRing size={19} className="mt-0.5 shrink-0 text-[#a67d13]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold">{t.heading}</div>
            <p className="mt-1 text-[12px] leading-5 text-[#6b6572] dark:text-[var(--shadow-text-secondary)]">
              {status === 'blocked' ? t.blocked : status === 'unavailable' ? t.unavailable : t.description}
            </p>
            {status !== 'blocked' ? (
              <button
                type="button"
                onClick={status === 'unavailable' ? refreshStatus : handleEnable}
                disabled={busy}
                className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-full bg-[#f5c842] px-4 text-[12px] font-semibold text-black disabled:opacity-60"
              >
                {busy ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : null}
                {status === 'unavailable' ? t.retry : t.action}
              </button>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={t.close}
            onClick={() => setDismissed(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </aside>
      ) : null}
      <ChatInboxPage />
    </>
  )
}
