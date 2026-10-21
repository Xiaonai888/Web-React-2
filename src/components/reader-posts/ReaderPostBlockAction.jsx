import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderToken } from '../../services/chatApi'
import { changeReaderBlockedAccount } from '../../services/readerBlockApi'
import ReaderBlockConfirmModal from '../reader-profile/ReaderBlockConfirmModal'

registerTranslationNamespace('readerPostBlockAction', {
  en: { label: 'Block Reader', description: 'Block this reader account', failed: 'Could not block this reader' },
  km: { label: 'Block Reader', description: 'ទប់ស្កាត់គណនីអ្នកអាននេះ', failed: 'មិនអាច Block អ្នកអាននេះបានទេ' },
  zh: { label: '屏蔽读者', description: '屏蔽此读者账号', failed: '无法屏蔽此读者' },
  ja: { label: '読者をブロック', description: 'この読者アカウントをブロックする', failed: 'この読者をブロックできません' },
  ko: { label: '독자 차단', description: '이 독자 계정을 차단', failed: '이 독자를 차단할 수 없습니다' },
})

registerTranslationNamespace('readerBlockedAccounts', {
  en: { block: 'Block', cancel: 'Cancel', saving: 'Please wait...', blockTitle: 'Block {{name}}?', blockQuestion: 'Are you sure you want to block {{name}}?' },
  km: { block: 'Block', cancel: 'បោះបង់', saving: 'សូមរង់ចាំ...', blockTitle: 'Block {{name}}?', blockQuestion: 'តើអ្នកពិតជាចង់ Block {{name}} មែនទេ?' },
  zh: { block: '屏蔽', cancel: '取消', saving: '请稍候...', blockTitle: '屏蔽 {{name}}？', blockQuestion: '确定要屏蔽 {{name}} 吗？' },
  ja: { block: 'ブロック', cancel: 'キャンセル', saving: 'お待ちください...', blockTitle: '{{name}} をブロックしますか？', blockQuestion: '{{name}} をブロックしてもよろしいですか？' },
  ko: { block: '차단', cancel: '취소', saving: '잠시 기다려 주세요...', blockTitle: '{{name}} 차단?', blockQuestion: '{{name}}을(를) 차단하시겠습니까?' },
})

export default function ReaderPostBlockAction({ post, onBlocked }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const owner = post?.user || {}
  const readerId = String(post?.user_id || owner.id || '').trim()
  const target = {
    id: readerId,
    name: String(owner.name || owner.username || 'Reader'),
    username: String(owner.username || ''),
    avatar_url: owner.avatar_url || null,
  }

  function openConfirmation() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }
    if (!readerId) return
    setError('')
    setOpen(true)
  }

  async function confirmBlock() {
    if (busy || !readerId) return
    setBusy(true)
    setError('')
    try {
      await changeReaderBlockedAccount({ type: 'reader', target, shouldBlock: true })
      setOpen(false)
      onBlocked?.(readerId)
    } catch (cause) {
      setError(cause?.message || t('readerPostBlockAction.failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openConfirmation}
        disabled={!readerId}
        className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left active:bg-[var(--shadow-bg-hover)] disabled:opacity-55"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
          <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M5.6 5.6 18.4 18.4" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-normal text-[var(--shadow-text-primary)]">{t('readerPostBlockAction.label')}</span>
          <span className="mt-0.5 block text-[10px] font-normal leading-4 text-[var(--shadow-text-tertiary)]">{t('readerPostBlockAction.description')}</span>
        </span>
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-[220000]">
          <ReaderBlockConfirmModal
            open
            target={target}
            shouldBlock
            onConfirm={confirmBlock}
            onCancel={() => { if (!busy) setOpen(false) }}
            busy={busy}
            error={error}
            t={t}
          />
        </div>,
        document.body
      )}
    </>
  )
}
