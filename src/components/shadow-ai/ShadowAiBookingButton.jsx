import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles } from 'lucide-react'
import ShadowAiBookingPanel from './ShadowAiBookingPanel'
import { useShadowAiText } from './shadowAiPreOrderText'

export default function ShadowAiBookingButton({ conversationId, eligibility, disabled = false }) {
  const tr = useShadowAiText()
  const [open,setOpen] = useState(false)
  const campaigns = eligibility?.conversation_id === conversationId && eligibility?.enabled === true && eligibility?.stock_verified === true && Array.isArray(eligibility.campaigns) ? eligibility.campaigns.filter(c => c.can_book === true && c.id && Date.parse(c.close_at) > Date.now()) : []
  const allowed = !disabled && Boolean(conversationId) && campaigns.length > 0
  useEffect(() => { setOpen(false) }, [conversationId, allowed])
  useEffect(() => {
    if (!open || !allowed) return
    const close = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown',close)
    return () => window.removeEventListener('keydown',close)
  }, [open,allowed])
  if (!allowed) return null
  return <>
    <button type="button" aria-label={tr('title')} aria-expanded={open} onClick={() => setOpen(v => !v)} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90 ${open ? 'bg-[#7951d1] text-white' : 'text-[#7951d1]'}`}><Sparkles size={21}/></button>
    {open && createPortal(<div className="app-page fixed inset-x-0 bottom-0 top-[64px] z-[79]" key={conversationId}><ShadowAiBookingPanel key={conversationId} conversationId={conversationId} campaigns={campaigns} onClose={() => setOpen(false)}/></div>,document.body)}
  </>
}
