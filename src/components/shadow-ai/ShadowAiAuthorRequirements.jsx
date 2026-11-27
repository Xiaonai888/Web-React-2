import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { getShadowAiRequirements, previewShadowAiRequirements, confirmShadowAiRequirements } from '../../services/shadowAiPreOrderApi'
import { useShadowAiText } from './shadowAiPreOrderText'

const fields = ['second_phone','telegram_username','facebook_link','detailed_address','english_buyer_name','english_signature_name','buyer_note']
const conditions = ['always','limited','standard','signed','outside_phnom_penh']
const options = field => field === 'english_signature_name' ? ['signed'] : conditions
export default function ShadowAiAuthorRequirements({ campaignId, instruction = '', savedInstruction, disabled = false, onConfirmed }) {
  const tr = useShadowAiText()
  const [rules, setRules] = useState([])
  const [preview, setPreview] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [editable, setEditable] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const request = useRef(null)
  const current = useRef({ campaignId, instruction })
  current.current = { campaignId, instruction }
  const clean = Boolean(campaignId) && typeof savedInstruction === 'string' && instruction.trim() === savedInstruction.trim()
  useEffect(() => {
    request.current?.abort()
    setRules([]); setPreview(null); setConfirmed(false); setEditable(true); setError(false); setBusy(false)
    if (!campaignId) return
    const controller = new AbortController(); request.current = controller
    setBusy(true)
    getShadowAiRequirements(campaignId, controller.signal).then(data => {
      if (controller.signal.aborted) return
      setRules(Array.isArray(data.rules) ? data.rules : []); setConfirmed(data.confirmed === true); setEditable(data.editable === true)
    }).catch(() => { if (!controller.signal.aborted) setError(true) }).finally(() => { if (!controller.signal.aborted) setBusy(false) })
    return () => controller.abort()
  }, [campaignId])
  useEffect(() => { setPreview(null) }, [instruction, savedInstruction])
  async function act(confirm) {
    if (!clean || !editable || disabled || request.current?.pending) return
    if (confirm && (!preview || preview.needs_review?.length || preview.source_instruction !== savedInstruction.trim())) return
    const controller = new AbortController(); controller.pending = true; request.current = controller
    const source = instruction; const id = campaignId
    setBusy(true); setError(false)
    try {
      const data = confirm ? await confirmShadowAiRequirements(id, preview, controller.signal) : await previewShadowAiRequirements(id, rules, controller.signal)
      if (controller.signal.aborted || current.current.campaignId !== id || current.current.instruction !== source) return
      if (confirm) { setConfirmed(data.confirmed === true); setPreview(null); onConfirmed?.(data) }
      else setPreview(data)
    } catch { if (!controller.signal.aborted) setError(true) }
    finally { controller.pending = false; if (!controller.signal.aborted) setBusy(false) }
  }
  function toggle(field, checked) {
    setRules(old => checked ? [...old, { field, condition: options(field)[0] }] : old.filter(rule => rule.field !== field)); setPreview(null); setConfirmed(false)
  }
  function condition(field, value) {
    setRules(old => [...old.filter(rule => rule.field !== field), { field, condition: value }]); setPreview(null); setConfirmed(false)
  }
  const locked = busy || disabled || !editable
  return <section className="app-card app-border space-y-3 rounded-xl border p-3 text-[12px]">
    <h3 className="app-title flex items-center gap-2 font-bold"><Sparkles size={17} className="text-[#7951d1]" />{tr('requirements')}</h3>
    {['name','phone_number','delivery_address'].map(field => <label key={field} className="flex gap-2 items-center"><input type="checkbox" checked disabled />{tr(field)}</label>)}
    {fields.map(field => { const matches = rules.filter(rule => rule.field === field); return <div key={field} className="flex items-center gap-2 flex-wrap"><label className="flex flex-1 items-center gap-2"><input type="checkbox" checked={matches.length > 0} disabled={locked} onChange={e => toggle(field,e.target.checked)} />{tr(field)}</label>{matches.length > 0 && <select aria-label={tr(field)} className="app-input app-border max-w-[150px] rounded-lg border p-1" disabled={locked} value={matches.length === 1 ? matches[0].condition : ''} onChange={e => condition(field,e.target.value)}>{matches.length > 1 && <option value="" disabled>{matches.map(x => tr(x.condition)).join(' / ')}</option>}{options(field).map(c => <option key={c} value={c}>{tr(c)}</option>)}</select>}</div> })}
    {!clean && <p className="app-muted">{tr('saveFirst')}</p>}
    {!editable && <p className="app-muted">{tr('notEditable')}</p>}
    {error && <p role="alert" className="app-danger">{tr('error')}</p>}
    {confirmed && clean && <p role="status" className="app-success">{tr('confirmed')}</p>}
    <button type="button" disabled={locked || !clean} onClick={() => void act(false)} className="w-full rounded-xl bg-[#7951d1] p-2.5 font-bold text-white disabled:opacity-40">{busy ? tr('loading') : tr('analyze')}</button>
    {preview && <div className="app-soft rounded-xl p-3 space-y-2"><p className="font-bold">{tr('review')}</p>{preview.rules?.map(rule => <p key={`${rule.field}:${rule.condition}`}>{tr(rule.field)} · {tr(rule.condition)}</p>)}{preview.needs_review?.length > 0 && <div role="alert" className="app-danger"><p>{tr('needsReview')}</p>{preview.needs_review.map((note,i) => <p key={i}>{note}</p>)}</div>}<button type="button" disabled={locked || !clean || Boolean(preview.needs_review?.length)} onClick={() => void act(true)} className="w-full rounded-xl bg-[#7951d1] p-2.5 font-bold text-white disabled:opacity-40">{tr('confirm')}</button></div>}
  </section>
}
