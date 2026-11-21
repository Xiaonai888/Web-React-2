import { CalendarDays, ChevronRight, Clock3, Package, ShoppingBag } from 'lucide-react'
import { authorPreOrderText, campaignStatus, formatPreOrderDate } from '../../../utils/authorPreOrderRules'

const statusStyles = {
  draft: 'bg-[#f3f3f3] text-[#575757]',
  scheduled: 'bg-[#f3f3f3] text-[#505050]',
  active: 'bg-[#fff3c8] text-[#4a3700]',
  closed: 'bg-[#f3f3f3] text-[#505050]',
  completed: 'bg-[#f3f3f3] text-[#505050]',
  cancelled: 'bg-[#f3f3f3] text-[#505050]',
}

function editionTotals(books, type) {
  return books.reduce((sum, book) => {
    const edition = book.editions?.[type]
    if (!edition?.enabled) return sum
    const quota = Math.max(0, Number(edition.quota || 0))
    const reserved = Math.max(0, Number(edition.reserved ?? edition.sold ?? 0))
    return { quota: sum.quota + quota, reserved: sum.reserved + reserved, enabled: sum.enabled + 1 }
  }, { quota: 0, reserved: 0, enabled: 0 })
}

function QuantityProgress({ label, counts }) {
  if (!counts.enabled) return null
  const percent = counts.quota ? Math.min(100, Math.round(counts.reserved / counts.quota * 100)) : 0
  return (
    <div className="min-w-0 flex-1 space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold text-[#252525]">{label}</span>
        <span className="shrink-0 text-[#696969]">{counts.reserved} / {counts.quota}</span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-[#ebebeb]">
        <div className="h-full rounded-full bg-[#ffcc28]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function AuthorPreOrderCampaignCard({ campaign, language = 'en', onOpen }) {
  const text = key => authorPreOrderText(language, key)
  const books = Array.isArray(campaign.books) ? campaign.books : []
  const firstBook = books[0] || {}
  const cover = firstBook.cover_url || campaign.banner_url || ''
  const status = campaignStatus(campaign)
  const standard = editionTotals(books, 'standard')
  const limited = editionTotals(books, 'limited')
  const totalOrders = Math.max(0, Number(campaign.total_orders || 0))

  return (
    <article className="rounded-[18px] border border-[#e8e8e8] bg-white p-3.5 text-[#191919] shadow-[0_3px_14px_rgba(0,0,0,0.025)]">
      <button type="button" className="flex w-full items-start gap-3 text-left" onClick={onOpen}>
        <div className="flex h-[114px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f4f4f4]">
          {cover ? <img src={cover} alt={firstBook.title || campaign.title || ''} className="h-full w-full object-contain" loading="lazy" /> : <Package size={27} className="text-[#aaa]" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-[14px] font-bold leading-5">{campaign.title || firstBook.title || '—'}</h2>
            <ChevronRight size={18} className="mt-0.5 shrink-0 text-[#929292]" />
          </div>
          <div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[status]}`}>
            {text(status)}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#757575]">
            <ShoppingBag size={13} /> {books.length} {books.length === 1 ? text('book') : text('books')}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#757575]">
            <CalendarDays size={13} /> {text('close')}: {formatPreOrderDate(campaign.close_at, language)}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#757575]">
            <Clock3 size={13} /> {text('shipping')}: {formatPreOrderDate(campaign.expected_ship_at, language)}
          </p>
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f7f7f7] px-3 py-2.5 text-[12px]">
        <span className="font-medium text-[#606060]">{text('orders')}</span>
        <span className="font-bold text-[#171717]">{totalOrders.toLocaleString()}</span>
      </div>
      {(standard.enabled || limited.enabled) ? (
        <div className="mt-3 flex gap-4">
          <QuantityProgress label={text('standard')} counts={standard} />
          <QuantityProgress label={text('limited')} counts={limited} />
        </div>
      ) : null}
    </article>
  )
}
