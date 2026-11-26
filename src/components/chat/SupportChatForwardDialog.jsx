import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { getChatConversations, sendChatMessage } from '../../services/chatApi'

export function supportForwardText(messages) {
  if (!Array.isArray(messages) || !messages.length || messages.length > 50) return ''
  if (messages.some(message => message?.deleted_at || typeof message?.message_text !== 'string' || !message.message_text.trim())) return ''
  const text = messages.map(message => message.message_text.trim()).join('\n\n')
  return text.length <= 2000 ? text : ''
}

export function supportForwardRecipients(data) {
  if (!Array.isArray(data?.conversations)) return []
  return data.conversations.filter(item => item?.id && item.request_status === 'accepted' && item.can_send === true && item.is_group !== true && (item.counterpart?.name || item.counterpart?.username))
}

export default function SupportChatForwardDialog({ text, labels, onClose, onDone }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [targetId, setTargetId] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const inFlight = useRef(false)
  const attemptedRef = useRef(false)
  const alive = useRef(false)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    alive.current = true
    const controller = new AbortController()
    getChatConversations('accepted', { signal: controller.signal }).then(data => {
      if (!controller.signal.aborted) setItems(supportForwardRecipients(data))
    }).catch(() => {
      if (!controller.signal.aborted) setError(labels.loadError)
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    const escape = event => { if (event.key === 'Escape' && !inFlight.current) closeRef.current() }
    document.addEventListener('keydown', escape)
    return () => {
      alive.current = false
      controller.abort()
      document.removeEventListener('keydown', escape)
    }
  }, [labels.loadError])

  const target = items.find(item => item.id === targetId)
  const close = () => { if (!inFlight.current) onClose() }
  async function send() {
    if (!target || !text.trim() || text.length > 2000 || inFlight.current || attemptedRef.current || sent) return
    inFlight.current = true
    attemptedRef.current = true
    setSending(true)
    setAttempted(true)
    setError('')
    try {
      const result = await sendChatMessage(target.id, text)
      if (!result?.message?.id) throw new Error('Message confirmation unavailable')
      if (alive.current) {
        setSent(true)
        onDone?.()
      }
    } catch {
      if (alive.current) setError(labels.sendError)
    } finally {
      inFlight.current = false
      if (alive.current) setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/50 sm:items-center sm:px-4">
      <button type="button" className="absolute inset-0" aria-label={labels.close} disabled={sending} onClick={close} />
      <section role="dialog" aria-modal="true" aria-label={labels.title} className="relative flex max-h-[85dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-xl sm:rounded-[24px]">
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--shadow-border)] px-4 py-3"><h2 className="text-[15px] font-bold">{labels.title}</h2><button type="button" disabled={sending} onClick={close} aria-label={labels.close} className="flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-40"><X size={20} /></button></header>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {sent ? <p role="status" className="py-4 text-center text-[13px] font-semibold text-green-600">{labels.success}</p> : <>
            <p className="text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{labels.note}</p>
            <p className="max-h-28 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-[var(--shadow-bg-soft)] p-3 text-[13px]">{text}</p>
            {error && <p role="alert" className="text-[12px] leading-5 text-red-600">{error}</p>}
            {loading ? <div className="flex justify-center py-6"><LoaderCircle size={22} className="animate-spin text-amber-600" /></div> : items.length ? <div className="space-y-1" role="radiogroup" aria-label={labels.recipient}>{items.map(item => <label key={item.id} className={`flex items-center gap-3 rounded-xl p-3 ${targetId === item.id ? 'bg-amber-500/15' : 'hover:bg-[var(--shadow-bg-soft)]'}`}>
              <input type="radio" name="support-forward-target" checked={targetId === item.id} disabled={sending || attempted} onChange={() => setTargetId(item.id)} className="accent-amber-500" />
              <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-bold">{item.counterpart?.name || item.counterpart?.username}</span>{item.counterpart?.username && <span className="block truncate text-[11px] text-[var(--shadow-text-secondary)]">@{item.counterpart.username}</span>}</span>
            </label>)}</div> : !error && <p className="py-5 text-center text-[12px] text-[var(--shadow-text-secondary)]">{labels.empty}</p>}
          </>}
        </div>
        <footer className="flex shrink-0 justify-end gap-2 border-t border-[var(--shadow-border)] p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button type="button" disabled={sending} onClick={close} className="rounded-xl bg-[var(--shadow-bg-soft)] px-4 py-2.5 text-[13px] font-semibold disabled:opacity-40">{labels.close}</button>
          {!sent && <button type="button" disabled={!target || loading || sending || attempted} onClick={send} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-40">{sending && <LoaderCircle size={16} className="animate-spin" />}{labels.send}</button>}
        </footer>
      </section>
    </div>
  )
}
