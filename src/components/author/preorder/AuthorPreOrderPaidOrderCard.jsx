import { useState } from 'react'
import { ChevronDown, ChevronUp, Truck, PenLine } from 'lucide-react'

const COPY = {
  en: { paid: 'Paid', order: 'Order', show: 'Order details', hide: 'Hide details', standard: 'Standard', limited: 'Limited', items: 'Editions', units: 'copies', delivery: 'Delivery', signed: 'Signed copy', note: 'Buyer note', phone: 'Phone', address: 'Address', telegram: 'Telegram', facebook: 'Facebook', payment: 'Payment reference', total: 'Order total', noDate: 'Time unavailable', all: 'Full paid order' },
  km: { paid: 'បង់ប្រាក់រួច', order: 'ការកម្មង់', show: 'មើលព័ត៌មាន', hide: 'បិទព័ត៌មាន', standard: 'ធម្មតា', limited: 'មានកំណត់', items: 'ប្រភេទសៀវភៅ', units: 'ក្បាល', delivery: 'ដឹកជញ្ជូន', signed: 'ហត្ថលេខា', note: 'សម្គាល់អ្នកទិញ', phone: 'ទូរសព្ទ', address: 'អាសយដ្ឋាន', telegram: 'Telegram', facebook: 'Facebook', payment: 'លេខយោងទូទាត់', total: 'សរុបការកម្មង់', noDate: 'គ្មានម៉ោង', all: 'ការទូទាត់សរុប' },
  zh: { paid: '已付款', order: '订单', show: '订单详情', hide: '收起详情', standard: '普通版', limited: '限量版', items: '版本', units: '本', delivery: '配送', signed: '签名版', note: '买家备注', phone: '电话', address: '地址', telegram: 'Telegram', facebook: 'Facebook', payment: '付款参考号', total: '订单总额', noDate: '无时间', all: '完整订单' },
  ja: { paid: '支払済み', order: '注文', show: '注文詳細', hide: '詳細を閉じる', standard: '通常版', limited: '限定版', items: 'エディション', units: '冊', delivery: '配送', signed: 'サイン本', note: '購入者のメモ', phone: '電話', address: '住所', telegram: 'Telegram', facebook: 'Facebook', payment: '決済番号', total: '注文合計', noDate: '日時なし', all: '注文全体' },
  ko: { paid: '결제 완료', order: '주문', show: '주문 상세', hide: '상세 닫기', standard: '일반판', limited: '한정판', items: '에디션', units: '권', delivery: '배송', signed: '사인본', note: '구매자 메모', phone: '전화', address: '주소', telegram: 'Telegram', facebook: 'Facebook', payment: '결제 참조', total: '주문 합계', noDate: '시간 없음', all: '전체 주문' },
}

function paidTime(value, language) {
  const time = Date.parse(String(value || ''))
  if (!Number.isFinite(time)) return ''
  const locale = { km: 'km-KH', en: 'en-GB', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }[language] || 'en-GB'
  return new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Phnom_Penh', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(time))
}

function amount(value) {
  const number = Number(value)
  return Number.isFinite(number) ? `$${number.toFixed(2)}` : '$0.00'
}

function Info({ label, value }) {
  if (!value) return null
  return <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-2 text-[12px]"><span className="text-[#777]">{label}</span><span className="break-words text-[#252525]">{value}</span></div>
}

export default function AuthorPreOrderPaidOrderCard({ order, language = 'en' }) {
  const [expanded, setExpanded] = useState(false)
  const t = COPY[language] || COPY.en
  const rows = Array.isArray(order?.items) ? order.items : []
  const number = String(order?.id || '').slice(0, 8).toUpperCase()
  const date = paidTime(order?.paid_at, language)
  return (
    <article className="overflow-hidden rounded-[16px] border border-[#e8e8e8] bg-white p-4 text-[#191919]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-bold">{t.order} #{number}</p>
        <span className="rounded-full bg-[#f4f4f4] px-2.5 py-1 text-[10px] font-semibold text-[#434343]">{t.paid}</span>
      </div>
      <p className="mt-2 truncate text-[14px] font-bold">{order?.buyer_name || '—'}</p>
      <p className="mt-1 text-[11px] text-[#777]">{date || t.noDate} · ICT (UTC+7)</p>
      <div className="mt-3 space-y-2 rounded-[11px] bg-[#f8f8f8] px-3 py-3">
        {rows.map((item, index) => (
          <div key={item.id || `${item.book_id}-${item.edition}-${index}`} className="flex justify-between gap-3 text-[12px]">
            <span className="min-w-0 flex-1 break-words">{item.title || '—'} <span className="font-semibold">· {item.edition === 'limited' ? t.limited : t.standard} × {item.quantity}</span></span>
            <span className="shrink-0 font-semibold">{amount(item.line_total_usd)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-[12px]">
        <span className="flex items-center gap-1.5 text-[#666]"><Truck size={15} />{order?.delivery_company || '—'}</span>
        <span className="font-bold">{amount(order?.total_usd)}</span>
      </div>
      {order?.signature_requested ? <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#666]"><PenLine size={14} />{t.signed}{order.signature_name ? ` · ${order.signature_name}` : ''}</p> : null}
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)} className="mt-3 flex w-full items-center justify-center gap-2 border-t border-[#eee] pt-3 text-[12px] font-semibold text-[#555]">
        {expanded ? t.hide : t.show}{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {expanded ? (
        <div className="mt-3 space-y-2.5 border-t border-[#eee] pt-3">
          <Info label={t.phone} value={order?.buyer_phone} />
          <Info label={t.address} value={order?.delivery_address} />
          <Info label={t.telegram} value={order?.buyer_telegram} />
          <Info label={t.facebook} value={order?.buyer_facebook} />
          <Info label={t.payment} value={order?.payment_reference} />
          <Info label={t.note} value={order?.buyer_note} />
          <Info label={t.total} value={amount(order?.total_usd)} />
        </div>
      ) : null}
    </article>
  )
}
