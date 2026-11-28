import { useState } from 'react'
import { useShadowAiText } from './shadowAiPreOrderText'
import { useShadowLocalGuideText } from './shadowLocalGuideText'
import { getShadowLocalBookingGuide,composeShadowLocalGuideMessage } from './shadowLocalBookingGuide.js'

function GuideField({guide,disabled,onCompose}){
  const tr=useShadowAiText(),t=useShadowLocalGuideText()
  const [value,setValue]=useState('')
  const message=composeShadowLocalGuideMessage(guide,value)
  const label=tr(guide.kind)
  return <div className="space-y-2">
    <p className="app-title font-medium">{label}{guide.bookTitle?' · '+guide.bookTitle:''}</p>
    {guide.choices?<div className="flex flex-wrap gap-2">{guide.choices.map(c=><button key={c.value} type="button" disabled={disabled} onClick={()=>onCompose?.(c.message)} className="app-card app-border rounded-lg border px-3 py-2 disabled:opacity-40">{c.label??(['yes','no'].includes(c.labelKey)?t(c.labelKey):tr(c.labelKey))}</button>)}</div>:<div className="flex flex-wrap items-end gap-2"><input aria-label={label} type="text" inputMode={['quantity','phone_number','second_phone'].includes(guide.kind)?'numeric':'text'} autoComplete="off" placeholder={t('entry')} maxLength={guide.kind==='quantity'?2:guide.max} disabled={disabled} value={value} onChange={e=>setValue(e.target.value)} className="app-input app-border min-w-0 flex-1 rounded-lg border p-2"/><button type="button" disabled={disabled||!message} onClick={()=>{onCompose?.(message);setValue('')}} className="app-card app-border rounded-lg border px-3 py-2 disabled:opacity-40">{t('compose')}</button></div>}
  </div>
}
export default function ShadowLocalBookingGuide({session,disabled=false,onCompose}){
  const t=useShadowLocalGuideText(),guide=getShadowLocalBookingGuide(session)
  if(!guide||typeof onCompose!=='function')return null
  return <section className="app-soft app-border space-y-2 rounded-xl border p-3 text-[12px]" aria-label={t('heading')}>
    <h3 className="app-title font-bold">{t('heading')}</h3><p className="app-muted">{t('hint')}</p>
    <GuideField key={`${session.context?.campaign_id??''}:${session.revision??'new'}:${guide.field}`} guide={guide} disabled={disabled} onCompose={onCompose}/>
    <p className="app-muted">{t('privacy')}</p>
  </section>
}
