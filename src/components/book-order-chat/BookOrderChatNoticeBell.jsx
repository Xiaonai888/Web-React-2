import { useEffect, useState } from 'react'
import { Bell, CheckCheck, ChevronRight, LoaderCircle, RefreshCw, X } from 'lucide-react'
import useBookOrderChatNotices from '../../hooks/useBookOrderChatNotices'
import { bookOrderNoticeLocale, useBookOrderChatNoticeText } from './bookOrderChatNoticeText'

const TYPES = new Set(['payment_verified', 'book_shipped', 'reader_received', 'owner_released', 'refunded'])

function dateLabel(value, locale) {
  const date = new Date(value || '')
  if (!Number.isFinite(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

export default function BookOrderChatNoticeBell({ conversationId, onSelectOrder }) {
  const tr = useBookOrderChatNoticeText()
  const locale = bookOrderNoticeLocale()
  const [open, setOpen] = useState(false)
  const { notices, unreadCount, loaded, loading, hasMore, savingId, error, loadFirst, loadMore, markRead } = useBookOrderChatNotices(conversationId)

  useEffect(() => setOpen(false), [conversationId])

  function toggle() {
    if (!open && !loaded && !loading) void loadFirst()
    setOpen((value) => !value)
  }

  async function selectNotice(notice) {
    if (savingId || !TYPES.has(notice.notice_type)) return
    if (!notice.seen_at) {
      const saved = await markRead(notice.id)
      if (!saved) return
    }
    if (typeof onSelectOrder === 'function') {
      onSelectOrder(notice.order_id)
      setOpen(false)
    }
  }

  if (!conversationId) return null

  return (
    <div className="relative inline-flex shrink-0">
      <button type="button" onClick={toggle} aria-label={tr('open')} aria-expanded={open} className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#7C3AED] active:bg-[#F6F2FF]">
        <Bell size={21} />
        {loaded && unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFCF38] px-1 text-[10px] font-extrabold text-[#231744]">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[110] w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-[22px] border border-[#E9E2FA] bg-white text-[#201A32] shadow-[0_18px_45px_rgba(17,12,37,0.2)]">
          <div className="flex items-center justify-between border-b border-[#EEE8FA] bg-[#F6F2FF] px-4 py-3">
            <div className="min-w-0"><h3 className="text-[13px] font-extrabold">{tr('title')}</h3>{loaded && unreadCount > 0 && <p className="mt-0.5 text-[11px] font-semibold text-[#7C3AED]">{unreadCount} {tr('count')}</p>}</div>
            <div className="flex items-center gap-1">
              <button type="button" aria-label={tr('refresh')} onClick={() => void loadFirst()} disabled={loading} className="rounded-full p-2 text-[#7C3AED] disabled:opacity-50"><RefreshCw size={16} /></button>
              <button type="button" aria-label={tr('close')} onClick={() => setOpen(false)} className="rounded-full p-2 text-[#665C76]"><X size={17} /></button>
            </div>
          </div>
          <div className="max-h-[min(56dvh,480px)] overflow-y-auto px-3 py-2">
            {error && <div role="alert" className="rounded-xl bg-[#FFF0F1] p-3 text-[12px] text-[#C7353D]">{error}<button type="button" onClick={() => void loadFirst()} className="ml-2 font-bold underline">{tr('retry')}</button></div>}
            {notices.filter((notice) => TYPES.has(notice.notice_type)).map((notice) => (
              <button key={notice.id} type="button" disabled={savingId === notice.id} onClick={() => void selectNotice(notice)} className={`mb-2 flex w-full items-start gap-3 rounded-[15px] border p-3 text-left disabled:opacity-60 ${notice.seen_at ? 'border-[#EEE8FA] bg-white' : 'border-[#E7DCFF] bg-[#F6F2FF]'}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E9DFFF] text-[#7C3AED]">{notice.seen_at ? <CheckCheck size={16} /> : <Bell size={16} />}</span>
                <span className="min-w-0 flex-1"><span className="block text-[12px] font-bold leading-5">{tr(notice.notice_type)}</span><span className="mt-1 block text-[10px] text-[#766E82]">{dateLabel(notice.created_at, locale)}</span><span className="mt-1 block text-[10px] font-semibold text-[#7C3AED]">{notice.seen_at ? tr('read') : tr('unread')}</span></span>
                {savingId === notice.id ? <LoaderCircle size={15} className="mt-1 animate-spin text-[#7C3AED]" /> : <ChevronRight size={16} className="mt-1 text-[#7C3AED]" />}
              </button>
            ))}
            {loaded && !loading && !notices.length && !error && <p className="py-8 text-center text-[12px] text-[#766E82]">{tr('empty')}</p>}
            {loading && <p role="status" className="flex items-center justify-center gap-2 py-3 text-[11px] text-[#7C3AED]"><LoaderCircle size={15} className="animate-spin" />{tr('loading')}</p>}
            {loaded && hasMore && !loading && <button type="button" onClick={() => void loadMore()} className="w-full rounded-xl bg-[#FFCF38] py-2.5 text-[12px] font-extrabold text-[#231744]">{tr('more')}</button>}
          </div>
        </div>
      )}
    </div>
  )
}
