import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, X } from 'lucide-react'
import { openShadowAiSession, sendShadowAiMessage, reviewShadowAiBooking } from '../../services/shadowAiPreOrderApi'
import { useShadowAiText } from './shadowAiPreOrderText'
import ShadowLocalBookingGuide from './ShadowLocalBookingGuide'
import { getDisplayLanguageId } from '../../utils/displayLanguage'
import { readShadowAiTurnReply, resolveShadowAiQuestionSession } from './shadowAiQuestionSession'

const money = n => Number.isFinite(Number(n)) ? `$${Number(n).toFixed(2)}` : '—'
function DateValue({ value }) { const date = new Date(value || ''); return Number.isFinite(date.getTime()) ? <time dateTime={value}>{date.toLocaleString(undefined, { timeZone:'Asia/Phnom_Penh' })}</time> : null }
function FieldName({ field, context, tr }) {
  const [key, bookId] = field.split(':')
  const book = context?.books?.find(item => item.id === bookId)
  return <>{tr(key)}{book ? ` · ${book.title}` : ''}</>
}
function ContextAnswer({ question, context, rules, tr }) {
  if (!context || !question) return null
  return <div className="app-soft space-y-2 rounded-xl p-3 text-[12px]">
    {['books','stock','price'].includes(question) && context.books.map(book => <div key={book.id}><p className="font-bold">{book.title}</p>{book.editions.map(e => <p key={e.edition}>{tr(e.edition)} · {money(e.price_usd)} · {tr('stock')}: {e.available}</p>)}</div>)}
    {question === 'delivery' && <>{context.delivery_companies.map(c => <p key={c.company_key}>{c.company_name} · {money(c.fee_usd)}</p>)}<p className="whitespace-pre-wrap">{context.delivery_note}</p></>}
    {question === 'signature' && <>{context.signature_enabled ? <p>{tr('signatureFee')}: {money(context.signature_fee_usd)}</p> : <p>—</p>}<p className="whitespace-pre-wrap">{context.signature_note}</p></>}
    {question === 'schedule' && <div className="grid gap-1"><DateValue value={context.open_at}/><DateValue value={context.close_at}/><DateValue value={context.expected_ship_at}/></div>}
    {question === 'requirements' && <>{['name','phone_number','delivery_address'].map(field => <p key={field}>{tr(field)}</p>)}{rules?.map(rule => <p key={`${rule.field}:${rule.condition}`}>{tr(rule.field)} · {tr(rule.condition)}</p>)}<p className="whitespace-pre-wrap">{context.buyer_note_instruction}</p></>}
  </div>
}
function Review({ result, tr }) {
  const r = result?.review
  if (!r) return null
  return <section className="app-card app-border space-y-2 rounded-xl border p-3 text-[12px]">
    <h3 className="font-bold">{tr('review')}</h3>
    {r.items?.map(i => <div key={i.book_id} className="flex justify-between gap-2"><span>{i.book_title} · {tr(i.edition)} × {i.quantity}</span><b>{money(i.line_total_usd)}</b></div>)}
    <p>{tr('buyer')}: {r.buyer_snapshot?.name}</p><p>{tr('phone_number')}: {r.buyer_snapshot?.phone_number}</p><p>{tr('address')}: {result.original_delivery_address || r.delivery_snapshot?.address}</p><p>{tr('delivery')}: {r.delivery_snapshot?.company?.company_name}</p>
    {r.signature_requested && <p>{tr('signature_name')}: {r.signature_name}</p>}
    {['telegram_username','facebook_link'].map(field => r.buyer_snapshot?.[field] ? <p key={field}>{tr(field)}: {r.buyer_snapshot[field]}</p> : null)}
    {r.buyer_note && <p>{tr('buyer_note')}: {r.buyer_note}</p>}
    {Object.entries(result.additional_requirements || {}).map(([field,value]) => <p key={field}>{tr(field)}: {value}</p>)}
    {['subtotal_usd','delivery_fee_usd','signature_fee_usd','total_usd'].map((field,i) => <div key={field} className="flex justify-between gap-2"><span>{tr(['subtotal','fee','signatureFee','total'][i])}</span><b>{money(r.pricing?.[field])}</b></div>)}
    <p className="app-muted">{tr('reviewOnly')}</p>
  </section>
}
export default function ShadowAiBookingPanel({ conversationId, campaigns, onClose }) {
  const tr = useShadowAiText()
  const [campaignId,setCampaignId] = useState(() => campaigns.length === 1 ? campaigns[0].id : '')
  const [session,setSession] = useState(null)
  const [message,setMessage] = useState('')
  const [turns,setTurns] = useState([])
  const [result,setResult] = useState(null)
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const [reload,setReload] = useState(0)
  const current = useRef(null)
  const bottom = useRef(null)
  const lock = useRef(false)
  useEffect(() => {
    current.current?.abort(); lock.current = false; setSession(null); setResult(null); setTurns([]); setMessage(''); setError(''); setBusy(false)
    if (!campaignId) return
    const controller = new AbortController(); current.current = controller; lock.current = true; setBusy(true)
    openShadowAiSession(conversationId,campaignId,controller.signal).then(data => { if (!controller.signal.aborted) setSession(data) }).catch(() => { if (!controller.signal.aborted) setError('error') }).finally(() => { if (!controller.signal.aborted) { lock.current = false; setBusy(false) } })
    return () => controller.abort()
  }, [conversationId,campaignId,reload])
  useEffect(() => () => current.current?.abort(), [])
  useEffect(() => { bottom.current?.scrollIntoView({ block:'nearest' }) }, [turns,result])
  async function action(review = false) {
    if (lock.current || !session || (!review && !message.trim())) return
    lock.current = true; setBusy(true); setError(''); setResult(null)
    const controller = new AbortController(); current.current = controller
    const sent = message.trim()
    try {
      if (review) {
        const data = await reviewShadowAiBooking(conversationId,campaignId,session.revision,controller.signal)
        if (!controller.signal.aborted) setResult(data)
      } else {
        const locale = getDisplayLanguageId()
        const data = await sendShadowAiMessage(conversationId,campaignId,sent,session.revision,controller.signal,locale)
        if (controller.signal.aborted) return
        let questionContext = null, questionRules = null
        if (data.intent === 'question' && data.question) {
          const fresh = await resolveShadowAiQuestionSession({ data, previousSession:session, campaignId, signal:controller.signal, loadSession:() => openShadowAiSession(conversationId,campaignId,controller.signal) })
          if (controller.signal.aborted) return
          if (!fresh) throw new Error('Invalid AI question response')
          questionContext = fresh.context
          questionRules = fresh.rules
          setSession(fresh)
        } else setSession(old => ({ ...old, draft:data.draft, revision:data.revision, validation:data.validation, expires_at:data.expires_at }))
        const replyText = readShadowAiTurnReply(data,locale)
        setTurns(old => [...old.slice(-9),{ sent, intent:data.intent, question:data.question, questionContext, questionRules, replyText }]); setMessage('')
      }
    } catch(e) { if (!controller.signal.aborted) setError(e?.code === 'SHADOW_AI_DRAFT_CONFLICT' ? 'stale' : 'error') }
    finally { if (!controller.signal.aborted) { lock.current = false; setBusy(false) } }
  }
  const validation = session?.validation
  return <section aria-label={tr('title')} className="app-card app-border mx-auto flex h-full min-h-0 w-full max-w-[620px] flex-col border-x">
    <header className="app-border flex items-center gap-2 border-b px-3 py-2"><Sparkles size={20} className="text-[#7951d1]"/><h2 className="app-title flex-1 font-bold text-[14px]">{tr('title')}</h2><button type="button" onClick={onClose} aria-label={tr('close')} className="app-muted rounded-full p-2"><X size={20}/></button></header>
    <div className="app-border border-b p-3"><label className="app-muted block text-[11px]">{tr('choose')}</label><select aria-label={tr('choose')} disabled={busy} value={campaignId} onChange={e => setCampaignId(e.target.value)} className="app-input app-border mt-1 w-full rounded-lg border p-2 text-[13px]"><option value="">{tr('select')}</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
    <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 text-[13px]">
      <p className="app-muted text-[11px]">{tr('private')}</p>
      {session && <p className="app-soft rounded-xl p-3">{tr('hello')}</p>}
      {turns.map((turn,i) => <div key={i} className="space-y-2"><div className="flex justify-end"><p className="max-w-[90%] whitespace-pre-wrap break-words rounded-xl bg-[#7951d1] p-3 text-white">{turn.sent}</p></div>{turn.replyText ? <p className="app-soft whitespace-pre-wrap break-words rounded-xl p-3">{turn.replyText}</p> : <>{turn.intent === 'unrelated' && <p className="app-soft rounded-xl p-3">{tr('unrelated')}</p>}{turn.intent === 'unclear' && <p className="app-soft rounded-xl p-3">{tr('unclear')}</p>}</>}<ContextAnswer question={turn.question} context={turn.questionContext} rules={turn.questionRules} tr={tr}/></div>)}
      {validation && <div className="app-soft space-y-1 rounded-xl p-3">{validation.ready ? <p>{tr('ready')}</p> : <>{validation.missing?.length > 0 && <><p className="font-bold">{tr('missing')}</p>{validation.missing.map(field => <p key={field}>• <FieldName field={field} context={session.context} tr={tr}/></p>)}</>}{(validation.issues?.length > 0 || validation.pending_requirements?.length > 0) && <p className="app-warning">{tr('issue')}</p>}</>}</div>}
      {session && !result && error !== 'stale' && <ShadowLocalBookingGuide session={session} disabled={busy || Boolean(message.trim())} onCompose={value => setMessage(old => old.trim() ? old : value)}/>}
      {error && <div role="alert" className="app-danger rounded-xl p-2">{tr(error)}{(!session || error === 'stale') && <button type="button" disabled={busy} onClick={() => setReload(x => x+1)} className="ml-2 underline">{tr('retry')}</button>}</div>}
      {busy && <p role="status" className="app-muted">{tr('loading')}</p>}
      <Review result={result} tr={tr}/><div ref={bottom}/>
    </div>
    <div className="app-border space-y-2 border-t p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
      {validation?.ready && session.revision !== null && !result && <button type="button" disabled={busy || error === 'stale'} onClick={() => void action(true)} className="w-full rounded-xl bg-[#7951d1] p-2.5 text-white text-[13px] font-bold disabled:opacity-40">{tr('review')}</button>}
      <form onSubmit={e => { e.preventDefault(); void action() }} className="flex items-end gap-2"><textarea aria-label={tr('placeholder')} placeholder={tr('placeholder')} rows={2} maxLength={2000} value={message} onChange={e => setMessage(e.target.value)} disabled={!session || busy || error === 'stale'} className="app-input app-border min-w-0 flex-1 resize-none rounded-xl border p-2 text-[13px]"/><button type="submit" aria-label={tr('send')} disabled={!session || busy || !message.trim() || error === 'stale'} className="rounded-full bg-[#7951d1] p-3 text-white disabled:opacity-40"><Send size={18}/></button></form>
    </div>
  </section>
}
