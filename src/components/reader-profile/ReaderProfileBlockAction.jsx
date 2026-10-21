import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderToken } from '../../services/chatApi'
import { changeReaderBlockedAccount } from '../../services/readerBlockApi'
import ReaderBlockConfirmModal from './ReaderBlockConfirmModal'

registerTranslationNamespace('readerBlockedAccounts', {
  en: { block: 'Block', cancel: 'Cancel', saving: 'Please wait...', blockTitle: 'Block {{name}}?', blockQuestion: 'Are you sure you want to block {{name}}?' },
  km: { block: 'Block', cancel: 'បោះបង់', saving: 'សូមរង់ចាំ...', blockTitle: 'Block {{name}}?', blockQuestion: 'តើអ្នកពិតជាចង់ Block {{name}} មែនទេ?' },
  zh: { block: '屏蔽', cancel: '取消', saving: '请稍候...', blockTitle: '屏蔽 {{name}}？', blockQuestion: '确定要屏蔽 {{name}} 吗？' },
  ja: { block: 'ブロック', cancel: 'キャンセル', saving: 'お待ちください...', blockTitle: '{{name}} をブロックしますか？', blockQuestion: '{{name}} をブロックしてもよろしいですか？' },
  ko: { block: '차단', cancel: '취소', saving: '잠시 기다려 주세요...', blockTitle: '{{name}} 차단?', blockQuestion: '{{name}}을(를) 차단하시겠습니까?' },
})

registerTranslationNamespace('readerProfileBlockAction', {
  en: { failed: 'Could not block this reader.' },
  km: { failed: 'មិនអាច Block អ្នកអាននេះបានទេ។' },
  zh: { failed: '无法屏蔽此读者。' },
  ja: { failed: 'この読者をブロックできません。' },
  ko: { failed: '이 독자를 차단할 수 없습니다.' },
})

export default function ReaderProfileBlockAction({ open, target, onClose, onBlocked }) {
  const { t } = useDisplayTranslation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const readerId = String(target?.id || '').trim()

  useEffect(() => {
    if (open) setError('')
  }, [open, readerId])

  async function confirmBlock() {
    if (busy || !readerId) return
    if (!getReaderToken()) return
    setBusy(true)
    setError('')

    try {
      await changeReaderBlockedAccount({ type: 'reader', target: { id: readerId }, shouldBlock: true })
      onClose?.()
      onBlocked?.(readerId)
    } catch (cause) {
      setError(cause?.message || t('readerProfileBlockAction.failed'))
    } finally {
      setBusy(false)
    }
  }

  if (!open || !target || !readerId) return null

  return createPortal(
    <ReaderBlockConfirmModal
      open
      target={target}
      shouldBlock
      onConfirm={confirmBlock}
      onCancel={() => { if (!busy) onClose?.() }}
      busy={busy}
      error={error}
      t={t}
    />,
    document.body
  )
}
