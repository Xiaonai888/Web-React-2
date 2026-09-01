import {
  LoaderCircle,
  Send,
  X,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createReaderReaderMessageRequest,
  getChatConversations,
} from '../../services/chatApi'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerMessageRequest', {
  en: {
    reader: 'Reader',
    checkFailed: 'Failed to check conversation',
    conversationNotCreated: 'Conversation was not created',
    sendFailed: 'Failed to send message request',
    closeRequest: 'Close message request',
    title: 'Message request',
    readerProfile: 'Reader profile',
    close: 'Close',
    helper: 'You can send one message request. More messages become available after this reader accepts it.',
    placeholder: 'Write a message to {{name}}...',
    sendRequest: 'Send request',
  },
  km: {
    reader: 'អ្នកអាន',
    checkFailed: 'មិនអាចពិនិត្យការសន្ទនាបានទេ',
    conversationNotCreated: 'មិនអាចបង្កើតការសន្ទនាបានទេ',
    sendFailed: 'មិនអាចផ្ញើសំណើសារបានទេ',
    closeRequest: 'បិទសំណើសារ',
    title: 'សំណើសារ',
    readerProfile: 'ប្រវត្តិរូបអ្នកអាន',
    close: 'បិទ',
    helper: 'អ្នកអាចផ្ញើសំណើសារបានមួយ។ អ្នកអាចផ្ញើសារបន្ថែមបាន បន្ទាប់ពីអ្នកអាននេះទទួលយកសំណើ។',
    placeholder: 'សរសេរសារទៅ {{name}}...',
    sendRequest: 'ផ្ញើសំណើ',
  },
  zh: {
    reader: '读者',
    checkFailed: '无法检查会话',
    conversationNotCreated: '未能创建会话',
    sendFailed: '无法发送消息请求',
    closeRequest: '关闭消息请求',
    title: '消息请求',
    readerProfile: '读者资料',
    close: '关闭',
    helper: '你可以发送一条消息请求。对方接受后即可发送更多消息。',
    placeholder: '给 {{name}} 写消息...',
    sendRequest: '发送请求',
  },
  ja: {
    reader: '読者',
    checkFailed: '会話を確認できませんでした',
    conversationNotCreated: '会話を作成できませんでした',
    sendFailed: 'メッセージリクエストを送信できませんでした',
    closeRequest: 'メッセージリクエストを閉じる',
    title: 'メッセージリクエスト',
    readerProfile: '読者プロフィール',
    close: '閉じる',
    helper: 'メッセージリクエストを1件送信できます。この読者が承認すると、さらにメッセージを送れるようになります。',
    placeholder: '{{name}} にメッセージを書く...',
    sendRequest: 'リクエストを送信',
  },
  ko: {
    reader: '독자',
    checkFailed: '대화를 확인하지 못했습니다',
    conversationNotCreated: '대화를 만들지 못했습니다',
    sendFailed: '메시지 요청을 보내지 못했습니다',
    closeRequest: '메시지 요청 닫기',
    title: '메시지 요청',
    readerProfile: '독자 프로필',
    close: '닫기',
    helper: '메시지 요청을 한 번 보낼 수 있습니다. 이 독자가 요청을 수락하면 더 많은 메시지를 보낼 수 있습니다.',
    placeholder: '{{name}}님에게 메시지 쓰기...',
    sendRequest: '요청 보내기',
  },
})

function ReaderAvatar({
  reader,
  fallbackName,
}) {
  const [failed, setFailed] = useState(false)
  const name =
    reader?.name ||
    reader?.username ||
    fallbackName
  const letter =
    String(name).trim().charAt(0).toUpperCase() ||
    'R'
  const avatarUrl =
    reader?.avatar_url ||
    reader?.avatarUrl ||
    ''

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[17px] font-extrabold text-white">
      {avatarUrl && !failed ? (
        <img
          src={avatarUrl}
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

export default function ReaderReaderMessageRequestModal({
  open,
  reader,
  onClose,
}) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [message, setMessage] = useState('')
  const [checking, setChecking] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow =
      document.body.style.overflow
    const previousTouchAction =
      document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction =
        previousTouchAction
    }
  }, [open])

  useEffect(() => {
    if (!open || !reader?.id) return undefined

    let ignore = false

    async function checkExistingConversation() {
      setMessage('')
      setError('')
      setChecking(true)

      try {
        const data =
          await getChatConversations('all')
        const conversations =
          Array.isArray(data.conversations)
            ? data.conversations
            : []

        const existing = conversations.find(
          (item) =>
            item.conversation_type ===
              'reader_reader' &&
            String(
              item.counterpart?.user_id || ''
            ) === String(reader.id)
        )

        if (!ignore && existing?.id) {
          onClose?.()
          navigate(`/chat/${existing.id}`)
          return
        }
      } catch (checkError) {
        if (!ignore) {
          setError(
            checkError.message ||
              t('readerMessageRequest.checkFailed')
          )
        }
      } finally {
        if (!ignore) {
          setChecking(false)
        }
      }
    }

    checkExistingConversation()

    return () => {
      ignore = true
    }
  }, [
    navigate,
    onClose,
    open,
    reader?.id,
    t,
  ])

  if (!open) return null

  const readerName =
    reader?.name ||
    reader?.username ||
    t('readerMessageRequest.reader')

  const handleSubmit = async () => {
    const text = message.trim()

    if (
      !text ||
      !reader?.id ||
      checking ||
      sending
    ) {
      return
    }

    try {
      setSending(true)
      setError('')

      const data =
        await createReaderReaderMessageRequest({
          readerUserId: reader.id,
          message: text,
        })

      const conversationId =
        data.conversation?.id

      if (!conversationId) {
        throw new Error(
          t(
            'readerMessageRequest.conversationNotCreated'
          )
        )
      }

      window.dispatchEvent(
        new CustomEvent('shadow-chat-updated')
      )
      onClose?.()
      navigate(`/chat/${conversationId}`)
    } catch (sendError) {
      setError(
        sendError.message ||
          t('readerMessageRequest.sendFailed')
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[320] flex items-end justify-center md:items-center md:px-4">
      <button
        type="button"
        aria-label={t(
          'readerMessageRequest.closeRequest'
        )}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <section className="relative w-full rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))] pt-3 shadow-2xl md:max-w-[430px] md:rounded-[26px] md:px-5 md:pb-5">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)] md:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ReaderAvatar
              reader={reader}
              fallbackName={t(
                'readerMessageRequest.reader'
              )}
            />

            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[var(--shadow-text-secondary)]">
                {t('readerMessageRequest.title')}
              </div>
              <h2 className="mt-0.5 truncate text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
                {readerName}
              </h2>
              <div className="mt-0.5 truncate text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                {reader?.username
                  ? `@${reader.username}`
                  : t(
                      'readerMessageRequest.readerProfile'
                    )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t(
              'readerMessageRequest.close'
            )}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] transition active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {checking ? (
          <div className="flex min-h-[190px] items-center justify-center text-[#7c3aed]">
            <LoaderCircle
              size={27}
              className="animate-spin"
            />
          </div>
        ) : (
          <>
            <div className="mt-5 rounded-[16px] bg-[#f6f2ff] px-4 py-3 text-[11px] font-semibold leading-5 text-[#6d5a91] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
              {t('readerMessageRequest.helper')}
            </div>

            {error ? (
              <div className="mt-3 rounded-[14px] bg-[#fff0f1] px-4 py-3 text-[11px] font-bold text-[#c7353d] dark:bg-[#7f1d1d]/25 dark:text-[#fca5a5]">
                {error}
              </div>
            ) : null}

            <div className="mt-4">
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value.slice(
                      0,
                      2000
                    )
                  )
                }
                rows={5}
                autoFocus
                placeholder={t(
                  'readerMessageRequest.placeholder',
                  { name: readerName }
                )}
                className="min-h-[130px] w-full resize-none rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[13px] leading-6 text-[var(--shadow-text-primary)] outline-none transition placeholder:text-[var(--shadow-placeholder)] focus:border-[#9b7be8] focus:bg-[var(--shadow-bg-surface)]"
              />

              <div className="mt-1 text-right text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
                {message.length}/2000
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!message.trim() || sending}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(124,58,237,0.22)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {sending ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Send
                  size={17}
                  strokeWidth={2.2}
                />
              )}
              {t('readerMessageRequest.sendRequest')}
            </button>
          </>
        )}
      </section>
    </div>
  )
}
