import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, ChevronDown, LoaderCircle, RefreshCw, Send } from 'lucide-react'
import { PageEmptyState, PageErrorState, PageHeader, PageLoadingState, PageShell } from '../../components/common/PagePrimitives'
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
    title:'Chat with Shadow Admin', subtitle:'Private support messages', back:'Back',
    verified:'Verified Shadow Admin', waiting:'Shadow Support', onlineNote:'Messages are answered when our team is available.',
    loading:'Loading your support chat...', loadError:'Unable to load support chat', retry:'Retry',
    empty:'Start a conversation', emptyText:'Send a message to Shadow Admin and your conversation will appear here.',
    placeholder:'Write your message...', send:'Send', sending:'Sending...', sendError:'Could not send your message.',
    loadOlder:'Load earlier messages', loadingOlder:'Loading earlier messages...', noMessages:'No messages yet.',
    refresh:'Refresh', archived:'This conversation is archived. Contact Shadow Support through the Help Center.',
    signIn:'Please sign in to contact Shadow Support.', private:'This conversation is private.', goLogin:'Sign in',
  },
  km: {
    title:'ឆាតជាមួយ Shadow Admin', subtitle:'សារជំនួយឯកជន', back:'ត្រឡប់ក្រោយ',
    verified:'Shadow Admin បានផ្ទៀងផ្ទាត់', waiting:'ក្រុមជំនួយ Shadow', onlineNote:'ក្រុមការងារនឹងឆ្លើយតបនៅពេលអាចធ្វើបាន។',
    loading:'កំពុងផ្ទុកឆាតជំនួយ...', loadError:'មិនអាចផ្ទុកឆាតជំនួយបានទេ', retry:'ព្យាយាមម្ដងទៀត',
    empty:'ចាប់ផ្តើមការសន្ទនា', emptyText:'ផ្ញើសារទៅ Shadow Admin ហើយការសន្ទនានឹងបង្ហាញនៅទីនេះ។',
    placeholder:'សរសេរសាររបស់អ្នក...', send:'ផ្ញើ', sending:'កំពុងផ្ញើ...', sendError:'មិនអាចផ្ញើសារបានទេ។',
    loadOlder:'ផ្ទុកសារចាស់ជាងនេះ', loadingOlder:'កំពុងផ្ទុកសារចាស់...', noMessages:'មិនទាន់មានសារទេ។',
    refresh:'ផ្ទុកថ្មី', archived:'ការសន្ទនានេះត្រូវបានរក្សាទុកក្នុង Archive។ សូមទាក់ទងតាម Help Center។',
    signIn:'សូមចូលគណនី ដើម្បីទាក់ទង Shadow Support។', private:'ការសន្ទនានេះជាឯកជន។', goLogin:'ចូលគណនី',
  },
  zh: {
    title:'联系 Shadow Admin', subtitle:'私人客服消息', back:'返回',
    verified:'已认证 Shadow Admin', waiting:'Shadow 客服', onlineNote:'我们的团队将在有空时回复。',
    loading:'正在加载客服聊天...', loadError:'无法加载客服聊天', retry:'重试',
    empty:'开始对话', emptyText:'向 Shadow Admin 发送消息后，对话将显示在这里。',
    placeholder:'输入消息...', send:'发送', sending:'发送中...', sendError:'消息发送失败。',
    loadOlder:'加载更早的消息', loadingOlder:'正在加载旧消息...', noMessages:'暂无消息。',
    refresh:'刷新', archived:'此对话已归档。请通过帮助中心联系 Shadow 客服。',
    signIn:'请先登录，再联系 Shadow 客服。', private:'这是私人对话。', goLogin:'登录',
  },
  ja: {
    title:'Shadow Admin にチャット', subtitle:'非公開サポートメッセージ', back:'戻る',
    verified:'認証済み Shadow Admin', waiting:'Shadow サポート', onlineNote:'担当者が対応可能になり次第返信します。',
    loading:'サポートチャットを読み込み中...', loadError:'サポートチャットを読み込めません', retry:'再試行',
    empty:'会話を始める', emptyText:'Shadow Admin にメッセージを送ると、会話がここに表示されます。',
    placeholder:'メッセージを入力...', send:'送信', sending:'送信中...', sendError:'メッセージを送信できませんでした。',
    loadOlder:'過去のメッセージを表示', loadingOlder:'過去のメッセージを読み込み中...', noMessages:'まだメッセージがありません。',
    refresh:'更新', archived:'この会話はアーカイブされています。ヘルプセンターからお問い合わせください。',
    signIn:'Shadow サポートに連絡するにはログインしてください。', private:'この会話は非公開です。', goLogin:'ログイン',
  },
  ko: {
    title:'Shadow Admin과 채팅', subtitle:'비공개 지원 메시지', back:'뒤로',
    verified:'인증된 Shadow Admin', waiting:'Shadow 지원팀', onlineNote:'담당자가 가능한 시간에 답변드립니다.',
    loading:'지원 채팅을 불러오는 중...', loadError:'지원 채팅을 불러올 수 없습니다', retry:'다시 시도',
    empty:'대화 시작', emptyText:'Shadow Admin에게 메시지를 보내면 대화가 여기에 표시됩니다.',
    placeholder:'메시지를 입력하세요...', send:'보내기', sending:'보내는 중...', sendError:'메시지를 보낼 수 없습니다.',
    loadOlder:'이전 메시지 불러오기', loadingOlder:'이전 메시지를 불러오는 중...', noMessages:'아직 메시지가 없습니다.',
    refresh:'새로고침', archived:'이 대화는 보관되었습니다. 도움말 센터를 통해 문의해 주세요.',
    signIn:'Shadow 지원팀에 문의하려면 로그인하세요.', private:'이 대화는 비공개입니다.', goLogin:'로그인',
  },
})

const LOGO = '/assets/Icons/Logo%20Shadow%203.png'

function displayTime(value) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
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
  const scrollBoxRef = useRef(null)
  const restoreScrollRef = useRef(null)
  const pendingSendRef = useRef(null)
  const lastMessageKeyRef = useRef('')

  const reload = useCallback(async signal => {
    const data = await getMySupportConversation({ signal })
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
    } else {
      element.scrollTop = element.scrollHeight
    }
  }, [messages])

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
    } catch (err) { restoreScrollRef.current = null; setError(err.message || t('readerSupportChatPage.loadError')) }
    finally { setOlderLoading(false) }
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
      try { await reload() }
      catch (err) { setError(err.message || t('readerSupportChatPage.loadError')) }
    } catch (err) {
      if (err.status === 401 || err.code === 'LOGIN_REQUIRED') setLoginRequired(true)
      setError(err.message || t('readerSupportChatPage.sendError'))
    } finally { setSending(false) }
  }

  const archived = conversation?.status === 'archived'

  return <PageShell className="pb-20">
    <PageHeader title={t('readerSupportChatPage.title')} subtitle={t('readerSupportChatPage.subtitle')} backLabel={t('readerSupportChatPage.back')} onBack={() => navigate(-1)} right={<button type="button" aria-label={t('readerSupportChatPage.refresh')} className="app-soft flex h-9 w-9 items-center justify-center rounded-full" onClick={() => setRefreshIndex(count => count + 1)}><RefreshCw size={16} /></button>} />
    <main className="mx-auto max-w-[760px] px-3 py-4">
      <section className="app-card overflow-hidden rounded-[20px] border">
        <header className="app-nav flex items-center gap-3 border-b px-4 py-3">
          <img src={LOGO} alt="Shadow Admin" className="h-11 w-11 shrink-0 rounded-full border border-[var(--shadow-border)] object-cover" />
          <div className="min-w-0 flex-1">
            <div className="app-title flex items-center gap-1.5 text-[14px] font-extrabold">Shadow Admin <BadgeCheck size={17} className="text-blue-500" aria-label={t('readerSupportChatPage.verified')} /></div>
            <p className="app-muted mt-1 text-[11px]">{t('readerSupportChatPage.onlineNote')}</p>
          </div>
        </header>
        <div ref={scrollBoxRef} className="app-page min-h-[380px] max-h-[65vh] overflow-y-auto px-3 py-5">
          {loading && <PageLoadingState label={t('readerSupportChatPage.loading')} rows={3} />}
          {!loading && loginRequired && <div className="flex flex-col items-center gap-3"><PageEmptyState title={t('readerSupportChatPage.signIn')} body={t('readerSupportChatPage.private')} /><button type="button" onClick={() => navigate('/login')} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white">{t('readerSupportChatPage.goLogin')}</button></div>}
          {!loading && !loginRequired && error && messages.length === 0 && <PageErrorState title={t('readerSupportChatPage.loadError')} body={error} actionLabel={t('readerSupportChatPage.retry')} onAction={() => setRefreshIndex(count => count + 1)} />}
          {!loading && !loginRequired && !error && messages.length === 0 && <PageEmptyState title={t('readerSupportChatPage.empty')} body={t('readerSupportChatPage.emptyText')} />}
          {!loading && !loginRequired && messages.length > 0 && <div className="space-y-3">
            {hasMore && <div className="text-center"><button type="button" disabled={olderLoading} onClick={loadOlder} className="app-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold"><ChevronDown size={15} />{olderLoading ? t('readerSupportChatPage.loadingOlder') : t('readerSupportChatPage.loadOlder')}</button></div>}
            {messages.map(item => <div key={item.id} className={`flex ${item.sender_kind === 'reader' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[83%] rounded-[16px] border px-3.5 py-2.5 ${item.sender_kind === 'reader' ? 'border-amber-200 bg-amber-50 text-slate-900' : 'app-card'}`}>
              {item.sender_kind === 'admin' && <div className="mb-1.5 flex items-center gap-1 text-[10px] font-extrabold text-amber-700">{t('readerSupportChatPage.waiting')} <BadgeCheck size={13} className="text-blue-500" /></div>}
              <p className="whitespace-pre-wrap break-words text-[13px] leading-6">{item.message_text || ''}</p>
              <div className={`mt-1 text-[10px] ${item.sender_kind === 'reader' ? 'text-slate-500' : 'app-muted'}`}>{displayTime(item.created_at)}</div>
            </div></div>)}
          </div>}
        </div>
        {archived && <div className="mx-3 mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-900">{t('readerSupportChatPage.archived')}</div>}
        {!loginRequired && error && messages.length > 0 && <div role="alert" className="mx-3 mb-2 text-[12px] text-red-600">{error}</div>}
        <form onSubmit={submit} className="app-nav flex items-end gap-2 border-t px-3 py-3">
          <textarea className="app-input min-h-11 max-h-32 min-w-0 flex-1 resize-y rounded-xl border border-[var(--shadow-border)] p-3 text-[13px] outline-none" rows={1} maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} placeholder={t('readerSupportChatPage.placeholder')} aria-label={t('readerSupportChatPage.placeholder')} disabled={loading || loginRequired || archived || sending} />
          <button type="submit" disabled={!draft.trim() || sending || loading || loginRequired || archived} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white disabled:opacity-50" aria-label={t('readerSupportChatPage.send')}>{sending ? <LoaderCircle size={19} className="animate-spin" /> : <Send size={19} />}</button>
        </form>
      </section>
      <p className="app-muted mt-3 text-center text-[11px]">{t('readerSupportChatPage.private')}</p>
    </main>
  </PageShell>
}
