import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, ChevronDown, ChevronLeft, LoaderCircle, Send } from 'lucide-react'
import { PageEmptyState, PageErrorState, PageLoadingState } from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  getMySupportConversation,
  getMySupportMessages,
  markMySupportRead,
  sendMySupportMessage,
} from '../../services/readerSupportChatApi'

registerTranslationNamespace('readerSupportChatPage', {
  en: {
    title: 'Chat with Shadow Admin', subtitle: 'Private support messages', back: 'Back',
    verified: 'Verified Shadow Admin', waiting: 'Shadow Support', onlineNote: 'Messages are answered when our team is available.',
    loading: 'Loading your support chat...', loadError: 'Unable to load support chat', retry: 'Retry',
    empty: 'Start a conversation', emptyText: 'Send a message to Shadow Admin and your conversation will appear here.',
    placeholder: 'Write your message...', send: 'Send', sending: 'Sending...', sendError: 'Could not send your message.',
    loadOlder: 'Load earlier messages', loadingOlder: 'Loading earlier messages...', noMessages: 'No messages yet.',
    refresh: 'Refresh', archived: 'This conversation is archived. Contact Shadow Support through the Help Center.',
    signIn: 'Please sign in to contact Shadow Support.', private: 'This conversation is private.', goLogin: 'Sign in',
  },
  km: {
    title: 'ឆាតជាមួយ Shadow Admin', subtitle: 'សារជំនួយឯកជន', back: 'ត្រឡប់ក្រោយ',
    verified: 'Shadow Admin បានផ្ទៀងផ្ទាត់', waiting: 'ក្រុមជំនួយ Shadow', onlineNote: 'ក្រុមការងារនឹងឆ្លើយតបនៅពេលអាចធ្វើបាន។',
    loading: 'កំពុងផ្ទុកឆាតជំនួយ...', loadError: 'មិនអាចផ្ទុកឆាតជំនួយបានទេ', retry: 'ព្យាយាមម្ដងទៀត',
    empty: 'ចាប់ផ្តើមការសន្ទនា', emptyText: 'ផ្ញើសារទៅ Shadow Admin ហើយការសន្ទនានឹងបង្ហាញនៅទីនេះ។',
    placeholder: 'សរសេរសាររបស់អ្នក...', send: 'ផ្ញើ', sending: 'កំពុងផ្ញើ...', sendError: 'មិនអាចផ្ញើសារបានទេ។',
    loadOlder: 'ផ្ទុកសារចាស់ជាងនេះ', loadingOlder: 'កំពុងផ្ទុកសារចាស់...', noMessages: 'មិនទាន់មានសារទេ។',
    refresh: 'ផ្ទុកថ្មី', archived: 'ការសន្ទនានេះត្រូវបានរក្សាទុកក្នុង Archive។ សូមទាក់ទងតាម Help Center។',
    signIn: 'សូមចូលគណនី ដើម្បីទាក់ទង Shadow Support។', private: 'ការសន្ទនានេះជាឯកជន។', goLogin: 'ចូលគណនី',
  },
  zh: {
    title: '联系 Shadow Admin', subtitle: '私人客服消息', back: '返回',
    verified: '已认证 Shadow Admin', waiting: 'Shadow 客服', onlineNote: '我们的团队将在有空时回复。',
    loading: '正在加载客服聊天...', loadError: '无法加载客服聊天', retry: '重试',
    empty: '开始对话', emptyText: '向 Shadow Admin 发送消息后，对话将显示在这里。',
    placeholder: '输入消息...', send: '发送', sending: '发送中...', sendError: '消息发送失败。',
    loadOlder: '加载更早的消息', loadingOlder: '正在加载旧消息...', noMessages: '暂无消息。',
    refresh: '刷新', archived: '此对话已归档。请通过帮助中心联系 Shadow 客服。',
    signIn: '请先登录，再联系 Shadow 客服。', private: '这是私人对话。', goLogin: '登录',
  },
  ja: {
    title: 'Shadow Admin にチャット', subtitle: '非公開サポートメッセージ', back: '戻る',
    verified: '認証済み Shadow Admin', waiting: 'Shadow サポート', onlineNote: '担当者が対応可能になり次第返信します。',
    loading: 'サポートチャットを読み込み中...', loadError: 'サポートチャットを読み込めません', retry: '再試行',
    empty: '会話を始める', emptyText: 'Shadow Admin にメッセージを送ると、会話がここに表示されます。',
    placeholder: 'メッセージを入力...', send: '送信', sending: '送信中...', sendError: 'メッセージを送信できませんでした。',
    loadOlder: '過去のメッセージを表示', loadingOlder: '過去のメッセージを読み込み中...', noMessages: 'まだメッセージがありません。',
    refresh: '更新', archived: 'この会話はアーカイブされています。ヘルプセンターからお問い合わせください。',
    signIn: 'Shadow サポートに連絡するにはログインしてください。', private: 'この会話は非公開です。', goLogin: 'ログイン',
  },
  ko: {
    title: 'Shadow Admin과 채팅', subtitle: '비공개 지원 메시지', back: '뒤로',
    verified: '인증된 Shadow Admin', waiting: 'Shadow 지원팀', onlineNote: '담당자가 가능한 시간에 답변드립니다.',
    loading: '지원 채팅을 불러오는 중...', loadError: '지원 채팅을 불러올 수 없습니다', retry: '다시 시도',
    empty: '대화 시작', emptyText: 'Shadow Admin에게 메시지를 보내면 대화가 여기에 표시됩니다.',
    placeholder: '메시지를 입력하세요...', send: '보내기', sending: '보내는 중...', sendError: '메시지를 보낼 수 없었습니다.',
    loadOlder: '이전 메시지 불러오기', loadingOlder: '이전 메시지를 불러오는 중...', noMessages: '아직 메시지가 없습니다.',
    refresh: '새로고침', archived: '이 대화는 보관되었습니다. 도움말 센터를 통해 문의해 주세요.',
    signIn: 'Shadow 지원팀에 문의하려면 로그인하세요.', private: '이 대화는 비공개입니다.', goLogin: '로그인',
  },
})

const LOGO = '/assets/Icons/Logo%20Shadow%203.png'

function displayTime(value) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function imageSource(attachment) {
  const value = typeof attachment === 'string'
    ? attachment
    : attachment?.url || attachment?.public_url || attachment?.image_url || attachment?.file_url || ''
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return ''
  const type = typeof attachment === 'object'
    ? String(attachment?.mime_type || attachment?.content_type || attachment?.type || '').toLowerCase()
    : ''
  if (type && !type.startsWith('image') && !['photo', 'picture'].includes(type)) return ''
  return value
}

export default function ReaderSupportChatPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loginRequired, setLoginRequired] = useState(false)
  const [sending, setSending] = useState(false)
  const [draft, setDraft] = useState('')
  const [olderLoading, setOlderLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [before, setBefore] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [viewport, setViewport] = useState(null)
  const scrollBoxRef = useRef(null)
  const composerRef = useRef(null)
  const restoreScrollRef = useRef(null)
  const nearBottomRef = useRef(true)
  const pendingSendRef = useRef(null)
  const lastMessageKeyRef = useRef('')

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('reader-support-chat-screen-open')
    const visual = window.visualViewport
    const updateViewport = () => {
      if (!visual) return
      const next = { top: visual.offsetTop, height: visual.height, keyboard: window.innerHeight - visual.height > 120 }
      setViewport(current => current && Math.abs(current.top - next.top) < 1 && Math.abs(current.height - next.height) < 1 && current.keyboard === next.keyboard ? current : next)
    }
    updateViewport()
    visual?.addEventListener('resize', updateViewport)
    visual?.addEventListener('scroll', updateViewport)
    window.addEventListener('resize', updateViewport)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('reader-support-chat-screen-open')
      visual?.removeEventListener('resize', updateViewport)
      visual?.removeEventListener('scroll', updateViewport)
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useLayoutEffect(() => {
    const element = composerRef.current
    if (!element) return
    element.style.height = '44px'
    element.style.height = `${Math.min(element.scrollHeight, 128)}px`
  }, [draft])

  const reload = useCallback(async signal => {
    const data = await getMySupportConversation({ signal })
    if (signal?.aborted) return
    const item = data.conversation || null
    if (!item) {
      lastMessageKeyRef.current = ''
      setConversation(null)
      setMessages([])
      setBefore('')
      setHasMore(false)
      return
    }
    const history = await getMySupportMessages({ signal })
    if (signal?.aborted) return
    lastMessageKeyRef.current = `${item.id}:${item.last_message_at || ''}:${item.status || ''}`
    setConversation(item)
    setMessages(history.messages || [])
    setBefore(history.next_before || '')
    setHasMore(Boolean(history.has_more))
    if (item.unread_for_reader > 0) markMySupportRead().catch(() => {})
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setLoginRequired(false)
    reload(controller.signal)
      .catch(err => {
        if (controller.signal.aborted || err.name === 'AbortError') return
        if (err.status === 401 || err.code === 'LOGIN_REQUIRED') setLoginRequired(true)
        else setError(err.message || t('readerSupportChatPage.loadError'))
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload, refreshIndex, t])

  useEffect(() => {
    if (loading || loginRequired || sending) return undefined
    const controller = new AbortController()
    let checking = false
    let lastChecked = Date.now()

    const checkIncoming = async () => {
      if (controller.signal.aborted || checking || document.hidden || Date.now() - lastChecked < 12000) return
      lastChecked = Date.now()
      checking = true
      try {
        const data = await getMySupportConversation({ signal: controller.signal })
        if (controller.signal.aborted) return
        const item = data.conversation || null
        const key = item ? `${item.id}:${item.last_message_at || ''}:${item.status || ''}` : ''
        if (key !== lastMessageKeyRef.current) {
          const sameConversation = Boolean(item && lastMessageKeyRef.current.startsWith(`${item.id}:`))
          const history = item ? await getMySupportMessages({ signal: controller.signal }) : null
          if (controller.signal.aborted) return
          const incoming = Array.isArray(history?.messages) ? history.messages : []
          if (sameConversation) {
            setMessages(previous => {
              const seen = new Set(previous.map(message => message.id))
              const additions = incoming.filter(message => !seen.has(message.id))
              return additions.length ? [...previous, ...additions] : previous
            })
          } else {
            setMessages(incoming)
            setBefore(history?.next_before || '')
            setHasMore(Boolean(history?.has_more))
          }
          lastMessageKeyRef.current = key
          setConversation(item)
        }
        if (item?.unread_for_reader > 0) void markMySupportRead().catch(() => {})
      } catch (err) {
        if (!controller.signal.aborted && (err.status === 401 || err.code === 'LOGIN_REQUIRED')) setLoginRequired(true)
      } finally {
        checking = false
      }
    }

    const onVisibility = () => { if (!document.hidden) void checkIncoming() }
    const onFocus = () => { void checkIncoming() }
    const interval = window.setInterval(() => { void checkIncoming() }, 60000)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)
    return () => {
      controller.abort()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
    }
  }, [loading, loginRequired, sending])

  useLayoutEffect(() => {
    const element = scrollBoxRef.current
    if (!element) return
    const position = restoreScrollRef.current
    if (position) {
      element.scrollTop = position.top + element.scrollHeight - position.height
      restoreScrollRef.current = null
    } else if (nearBottomRef.current) {
      element.scrollTop = element.scrollHeight
    }
  }, [messages, loading])

  async function loadOlder() {
    if (!hasMore || !before || olderLoading) return
    setOlderLoading(true)
    setError('')
    try {
      const data = await getMySupportMessages({ before })
      const element = scrollBoxRef.current
      if (element) restoreScrollRef.current = { top: element.scrollTop, height: element.scrollHeight }
      setMessages(current => {
        const existing = new Set(current.map(message => message.id))
        return [...(data.messages || []).filter(message => !existing.has(message.id)), ...current]
      })
      setHasMore(Boolean(data.has_more))
      setBefore(data.next_before || '')
    } catch (err) {
      restoreScrollRef.current = null
      setError(err.message || t('readerSupportChatPage.loadError'))
    } finally {
      setOlderLoading(false)
    }
  }

  async function submit(event) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || content.length > 2000 || sending || loading || loginRequired || conversation?.status === 'archived') return
    setSending(true)
    setError('')
    const requestId = pendingSendRef.current?.content === content
      ? pendingSendRef.current.requestId
      : globalThis.crypto?.randomUUID?.()
    pendingSendRef.current = { content, requestId }
    try {
      await sendMySupportMessage(content, requestId)
      pendingSendRef.current = null
      setDraft('')
      nearBottomRef.current = true
      try { await reload() }
      catch (err) { setError(err.message || t('readerSupportChatPage.loadError')) }
    } catch (err) {
      if (err.status === 401 || err.code === 'LOGIN_REQUIRED') setLoginRequired(true)
      setError(err.message || t('readerSupportChatPage.sendError'))
    } finally {
      setSending(false)
    }
  }

  const archived = conversation?.status === 'archived'
  const composeDisabled = loading || loginRequired || archived || sending

  return (
    <div
      className="fixed inset-x-0 top-0 z-[100] flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]"
      style={viewport ? { top: `${viewport.top}px`, height: `${viewport.height}px` } : undefined}
    >
      <style>{'body.reader-support-chat-screen-open footer.app-nav { display: none !important; }'}</style>
      <header className="z-10 shrink-0 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[64px] w-full max-w-[720px] items-center gap-2 px-2 sm:px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('readerSupportChatPage.back')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
          >
            <ChevronLeft size={26} />
          </button>
          <img src={LOGO} alt="Shadow Admin" className="h-11 w-11 shrink-0 rounded-full border border-[var(--shadow-border)] object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[15px] font-bold">Shadow Admin</span>
              <BadgeCheck size={17} className="shrink-0 text-blue-500" aria-label={t('readerSupportChatPage.verified')} />
            </div>
            <p className="truncate text-[11px] text-[var(--shadow-text-secondary)]">{t('readerSupportChatPage.subtitle')}</p>
          </div>
        </div>
      </header>

      <main
        ref={scrollBoxRef}
        onScroll={event => {
          const node = event.currentTarget
          nearBottomRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 120
        }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--shadow-bg-page)]"
      >
        <div className="mx-auto flex min-h-full w-full max-w-[720px] flex-col px-3 py-4 sm:px-4">
          <p className="mb-5 text-center text-[11px] text-[var(--shadow-text-tertiary)]">{t('readerSupportChatPage.private')}</p>
          {loading && <PageLoadingState label={t('readerSupportChatPage.loading')} rows={3} />}
          {!loading && loginRequired && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
              <PageEmptyState title={t('readerSupportChatPage.signIn')} body={t('readerSupportChatPage.private')} />
              <button type="button" onClick={() => navigate('/login')} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white">
                {t('readerSupportChatPage.goLogin')}
              </button>
            </div>
          )}
          {!loading && !loginRequired && error && messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-12">
              <PageErrorState title={t('readerSupportChatPage.loadError')} body={error} actionLabel={t('readerSupportChatPage.retry')} onAction={() => setRefreshIndex(count => count + 1)} />
            </div>
          )}
          {!loading && !loginRequired && !error && messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-12">
              <PageEmptyState title={t('readerSupportChatPage.empty')} body={t('readerSupportChatPage.emptyText')} />
            </div>
          )}
          {!loading && !loginRequired && messages.length > 0 && (
            <div className="space-y-3">
              {hasMore && (
                <div className="pb-2 text-center">
                  <button type="button" disabled={olderLoading} onClick={loadOlder} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-[12px] font-semibold disabled:opacity-60">
                    {olderLoading ? <LoaderCircle size={15} className="animate-spin" /> : <ChevronDown size={15} />}
                    {olderLoading ? t('readerSupportChatPage.loadingOlder') : t('readerSupportChatPage.loadOlder')}
                  </button>
                </div>
              )}
              {messages.map(item => {
                const mine = item.sender_kind === 'reader'
                const images = Array.isArray(item.attachments) ? item.attachments.map(imageSource).filter(Boolean) : []
                return (
                  <div key={item.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] rounded-[18px] px-3.5 py-2.5 shadow-sm ${mine ? 'rounded-br-[6px] bg-[#FFF4D9] text-[#28211C] ring-1 ring-[#F6DB98]' : 'rounded-bl-[6px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]'}`}>
                      {item.message_text && <p className="whitespace-pre-wrap break-words text-[13px] leading-5">{item.message_text}</p>}
                      {images.length > 0 && (
                        <div className="mt-2 grid max-w-[250px] grid-cols-2 gap-1.5">
                          {images.map((src, index) => (
                            <a key={`${src}-${index}`} href={src} target="_blank" rel="noopener noreferrer" className={images.length === 1 ? 'col-span-2' : ''}>
                              <img src={src} alt="Chat attachment" loading="lazy" className="max-h-[240px] w-full rounded-xl object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                      <div className={`mt-1 text-right text-[10px] ${mine ? 'text-[#8C7352]' : 'text-[var(--shadow-text-tertiary)]'}`}>
                        {displayTime(item.created_at)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <div className="z-10 shrink-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]" style={{ paddingBottom: viewport?.keyboard ? '8px' : 'max(10px, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto w-full max-w-[720px]">
          {archived && <p className="mx-3 mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900">{t('readerSupportChatPage.archived')}</p>}
          {!loginRequired && error && messages.length > 0 && <p role="alert" className="mx-3 mt-2 text-[12px] text-red-600">{error}</p>}
          <form onSubmit={submit} className="flex items-end gap-2 px-3 pt-2">
            <textarea
              ref={composerRef}
              className="min-h-11 max-h-32 min-w-0 flex-1 resize-none overflow-y-auto rounded-[20px] bg-[var(--shadow-input-bg)] px-4 py-3 text-[13px] leading-5 text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)] disabled:opacity-60"
              rows={1}
              maxLength={2000}
              value={draft}
              onChange={event => setDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder={t('readerSupportChatPage.placeholder')}
              aria-label={t('readerSupportChatPage.placeholder')}
              disabled={composeDisabled}
            />
            <button
              type="submit"
              disabled={!draft.trim() || composeDisabled}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9AD4B] text-white active:scale-95 disabled:opacity-40"
              aria-label={t('readerSupportChatPage.send')}
            >
              {sending ? <LoaderCircle size={19} className="animate-spin" /> : <Send size={19} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
