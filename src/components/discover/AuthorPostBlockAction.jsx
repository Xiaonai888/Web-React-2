import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderToken } from '../../services/chatApi'
import { changeReaderBlockedAccount } from '../../services/readerBlockApi'
import ReaderBlockConfirmModal from '../reader-profile/ReaderBlockConfirmModal'

registerTranslationNamespace('authorPostBlockAction', {
  en: { label: 'Block Page', description: 'Block this Author Page', login: 'Please log in to block this Page', failed: 'Could not block this Page' },
  km: { label: 'Block Page', description: 'ទប់ស្កាត់ទំព័រអ្នកនិពន្ធនេះ', login: 'សូមចូលគណនីដើម្បី Block Page', failed: 'មិនអាច Block Page នេះបានទេ' },
  zh: { label: '屏蔽主页', description: '屏蔽此作者主页', login: '请登录后屏蔽主页', failed: '无法屏蔽此主页' },
  ja: { label: 'ページをブロック', description: 'この著者ページをブロックする', login: 'ログインしてページをブロック', failed: 'このページをブロックできません' },
  ko: { label: '페이지 차단', description: '이 작가 페이지 차단', login: '로그인 후 페이지를 차단하세요', failed: '이 페이지를 차단할 수 없습니다' },
})

registerTranslationNamespace('readerBlockedAccounts', {
  en: { block: 'Block', cancel: 'Cancel', saving: 'Please wait...', blockTitle: 'Block {{name}}?', blockQuestion: 'Are you sure you want to block {{name}}?' },
  km: { block: 'Block', cancel: 'បោះបង់', saving: 'សូមរង់ចាំ...', blockTitle: 'Block {{name}}?', blockQuestion: 'តើអ្នកពិតជាចង់ Block {{name}} មែនទេ?' },
  zh: { block: '屏蔽', cancel: '取消', saving: '请稍候...', blockTitle: '屏蔽 {{name}}？', blockQuestion: '确定要屏蔽 {{name}} 吗？' },
  ja: { block: 'ブロック', cancel: 'キャンセル', saving: 'お待ちください...', blockTitle: '{{name}} をブロックしますか？', blockQuestion: '{{name}} をブロックしてもよろしいですか？' },
  ko: { block: '차단', cancel: '취소', saving: '잠시 기다려 주세요...', blockTitle: '{{name}} 차단?', blockQuestion: '{{name}}을(를) 차단하시겠습니까?' },
})

export default function AuthorPostBlockAction({ post, onBlocked }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const author = post?.author_page || {}
  const pageUsername = String(author.page_username || '').trim()
  const name = String(author.page_name || pageUsername || 'Author Page')
  const target = { ...author, name, username: pageUsername }

  useEffect(() => {
    if (!confirmOpen) return undefined
    function handleEscape(event) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      event.stopImmediatePropagation?.()
      if (!busy) setConfirmOpen(false)
    }
    window.addEventListener('keydown', handleEscape, true)
    return () => window.removeEventListener('keydown', handleEscape, true)
  }, [confirmOpen, busy])

  function openConfirmation() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }
    if (!pageUsername) return
    setError('')
    setConfirmOpen(true)
  }

  async function confirmBlock() {
    if (busy || !pageUsername) return
    setBusy(true)
    setError('')
    try {
      await changeReaderBlockedAccount({ type: 'page', target, shouldBlock: true })
      setConfirmOpen(false)
      onBlocked?.(author.id)
    } catch (cause) {
      setError(cause?.message || t('authorPostBlockAction.failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openConfirmation}
        disabled={!pageUsername}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left text-[#111827] active:bg-black/[0.04] disabled:opacity-55"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M5.6 5.6 18.4 18.4" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-normal leading-5">{t('authorPostBlockAction.label')}</span>
          <span className="mt-0.5 block text-[11px] font-normal leading-4 text-gray-400">{t('authorPostBlockAction.description')}</span>
        </span>
      </button>
      {confirmOpen && createPortal(
        <div className="fixed inset-0 z-[220000]">
          <ReaderBlockConfirmModal
            open
            target={target}
            shouldBlock
            onConfirm={confirmBlock}
            onCancel={() => { if (!busy) setConfirmOpen(false) }}
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
