import { useEffect, useState } from 'react'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { fetchAuthorPreOrderPaidOrders } from '../../../services/authorPreOrderReportsApi'

const COPY = {
  en: { title: 'Successful Orders', paid: 'Paid orders', caption: 'Counted once per successful payment, not per copy.', open: 'View paid orders', retry: 'Retry', error: 'Paid orders could not be loaded.' },
  km: { title: 'ការកក់ជោគជ័យ', paid: 'Order បានបង់ប្រាក់', caption: 'Order មួយរាប់តែម្តង ទោះទិញច្រើនក្បាលក៏ដោយ។', open: 'មើលការកក់ជោគជ័យ', retry: 'សាកម្ដងទៀត', error: 'មិនអាចផ្ទុកបញ្ជីការកក់បាន។' },
  zh: { title: '成功订单', paid: '已付款订单', caption: '每笔成功付款仅统计一次，而非按册数。', open: '查看已付款订单', retry: '重试', error: '无法加载已付款订单。' },
  ja: { title: '支払済みの注文', paid: '支払済み注文数', caption: '冊数ではなく支払いに成功した注文ごとに1回数えます。', open: '注文を見る', retry: '再試行', error: '支払済み注文を読み込めません。' },
  ko: { title: '결제 완료 주문', paid: '결제 완료 건수', caption: '도서 수량이 아닌 결제에 성공한 주문을 한 번씩 집계합니다.', open: '주문 보기', retry: '다시 시도', error: '결제 완료 주문을 불러올 수 없습니다.' },
}

export default function AuthorPreOrderRecordPaidSummary({ campaignId, language = 'en', onOpenOrders }) {
  const t = COPY[language] || COPY.en
  const [total, setTotal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    if (!campaignId) {
      setTotal(null)
      setLoading(false)
      return undefined
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setTotal(null)
    fetchAuthorPreOrderPaidOrders({ campaignId, page: 1, limit: 1 }, { signal: controller.signal })
      .then(data => {
        if (!controller.signal.aborted) setTotal(Math.max(0, Number(data.total_paid_orders || 0)))
      })
      .catch(cause => { if (!controller.signal.aborted) setError(cause.message || t.error) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [campaignId, reload])

  return (
    <section className="rounded-[17px] border border-[#e7e7e7] bg-white p-4">
      <h2 className="text-[15px] font-bold text-[#222]">{t.title}</h2>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] text-[#777]">{t.paid}</p>
          <p aria-live="polite" className="mt-1 text-[27px] font-bold tabular-nums text-[#181818]">{loading || error || total === null ? '—' : total.toLocaleString('en-US')}</p>
        </div>
        {error ? <button type="button" onClick={() => setReload(value => value + 1)} aria-label={t.retry} className="flex items-center gap-1 rounded-full border border-[#ddd] px-3 py-2 text-[11px]"><RefreshCw size={13} />{t.retry}</button> : null}
      </div>
      <p className="mt-2 text-[11px] leading-5 text-[#777]">{t.caption}</p>
      {error ? <p role="alert" className="mt-2 break-words text-[11px] text-[#91473b]">{error}</p> : null}
      <button type="button" onClick={onOpenOrders} disabled={!onOpenOrders} className="mt-4 flex w-full items-center justify-between border-t border-[#eee] pt-3 text-left text-[12px] font-semibold text-[#2d2d2d] disabled:opacity-50"><span>{t.open}</span><ChevronRight size={17} /></button>
    </section>
  )
}
