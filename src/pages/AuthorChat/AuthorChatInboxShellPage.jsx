// NEW: Xiaonai888/Web-React-2/src/pages/AuthorChat/AuthorChatInboxShellPage.jsx
// Author Chat opt-in UI; retains the existing AuthorChatInboxPage unchanged.
import { useCallback, useEffect, useState } from 'react'
import { BellRing, LoaderCircle, X } from 'lucide-react'
import AuthorChatInboxPage from './AuthorChatInboxPage'
import {
  enableReaderChatPush,
  getReaderChatPushStatus,
} from '../../services/readerOneSignal.service'
import { getDisplayLanguageId } from '../../utils/displayLanguage'

const COPY = {
  en: {
    heading: 'Get chat notifications',
    description: 'Get an alert when readers or authors send you messages.',
    enable: 'Enable',
    blocked: 'This browser has blocked notifications. Allow them in browser settings.',
    unavailable: 'Could not check notification permissions.',
    retry: 'Retry',
    dismiss: 'Dismiss',
  },
  km: {
    heading: 'បើកការជូនដំណឹង Chat',
    description: 'ទទួលដំណឹងពេលមានអ្នកអាន ឬអ្នកនិពន្ធផ្ញើសារមក។',
    enable: 'បើក',
    blocked: 'Browser បានបិទការជូនដំណឹង។ សូមអនុញ្ញាតក្នុង Browser Settings។',
    unavailable: 'មិនអាចពិនិត្យការអនុញ្ញាតការជូនដំណឹងបានទេ។',
    retry: 'សាកម្ដងទៀត',
    dismiss: 'បិទ',
  },
  zh: {
    heading: '开启聊天通知',
    description: '在读者或作者向你发送消息时接收通知。',
    enable: '开启',
    blocked: '浏览器已阻止通知，请在浏览器设置中允许。',
    unavailable: '无法检查通知权限。',
    retry: '重试',
    dismiss: '关闭',
  },
  ja: {
    heading: 'チャット通知を有効にする',
    description: '読者や作者からメッセージが届くと通知します。',
    enable: '有効にする',
    blocked: 'ブラウザが通知をブロックしています。設定から許可してください。',
    unavailable: '通知の権限を確認できません。',
    retry: '再試行',
    dismiss: '閉じる',
  },
  ko: {
    heading: '채팅 알림 켜기',
    description: '독자나 작가에게 메시지가 오면 알려드립니다.',
    enable: '켜기',
    blocked: '브라우저에서 알림이 차단되었습니다. 설정에서 허용하세요.',
    unavailable: '알림 권한을 확인할 수 없습니다.',
    retry: '다시 시도',
    dismiss: '닫기',
  },
}

export default function AuthorChatInboxShellPage() {
  const [status, setStatus] = useState('checking')
  const [busy, setBusy] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const t = COPY[getDisplayLanguageId()] || COPY.en

  const refreshStatus = useCallback(async () => {
    try {
      setStatus(await getReaderChatPushStatus())
    } catch {
      setStatus('unavailable')
    }
  }, [])

  useEffect(() => {
    let mounted = true
    void getReaderChatPushStatus()
      .then((value) => { if (mounted) setStatus(value) })
      .catch(() => { if (mounted) setStatus('unavailable') })
    return () => { mounted = false }
  }, [])

  const handleEnable = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (await enableReaderChatPush()) {
        setStatus('enabled')
      } else {
        await refreshStatus()
      }
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
          className="mx-auto flex max-w-[680px] items-start gap-3 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[var(--shadow-text-primary)]"
        >
          <BellRing size={20} className="mt-0.5 shrink-0 text-[#c59b23]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-semibold">{t.heading}</strong>
            <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
              {status === 'blocked' ? t.blocked : status === 'unavailable' ? t.unavailable : t.description}
            </p>
            {status !== 'blocked' ? (
              <button
                type="button"
                disabled={busy}
                onClick={status === 'unavailable' ? refreshStatus : handleEnable}
                className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-full bg-[#f5c842] px-4 text-[12px] font-semibold text-black disabled:opacity-60"
              >
                {busy ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : null}
                {status === 'unavailable' ? t.retry : t.enable}
              </button>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={t.dismiss}
            onClick={() => setDismissed(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </aside>
      ) : null}
      <AuthorChatInboxPage />
    </>
  )
}
