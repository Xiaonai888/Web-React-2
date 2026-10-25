import { useEffect, useState } from 'react'
import BinanceReceiverCard from './BinanceReceiverCard'
import BinanceClaimForm from './BinanceClaimForm'
import {
  cancelReaderBinanceOrder,
  clearRememberedBinanceOrderId,
  createReaderBinanceOrder,
  getReaderBinanceClaim,
  getReaderBinanceOrder,
  getRememberedBinanceOrderId,
  rememberBinanceOrderId,
} from '../../services/binanceCheckoutApi'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('binanceCheckoutPanel', {
  en: { title: 'Binance Pay checkout', fee: 'Binance fee: 1 USDT', amount: 'Total: {{amount}} USDT', diamonds: '{{count}} Diamonds', bonus: '+100 Vouchers after confirmation', create: 'Prepare verified payment QR', creating: 'Preparing...', refresh: 'Check status', checking: 'Checking...', cancel: 'Cancel order', cancelling: 'Cancelling...', waiting: 'Waiting for payment', review: 'Awaiting Admin review', credited: 'Payment confirmed and wallet credited', expired: 'Order expired', cancelled: 'Order cancelled', unavailable: 'Payment service temporarily unavailable. Please do not send USDT.', noPackage: 'Select a Diamonds package from the purchase page.', back: 'Return to Purchase', report: 'Your payment report is pending verification. Do not pay twice.', error: 'Unable to load payment order.', note: 'Diamonds and Vouchers are credited only after verification.', loading: 'Loading order...' },
  km: { title: 'ទិញតាម Binance Pay', fee: 'ថ្លៃ Binance បន្ថែម៖ 1 USDT', amount: 'ត្រូវបង់សរុប៖ {{amount}} USDT', diamonds: '{{count}} ពេជ្រ', bonus: '+100 Vouchers ក្រោយបញ្ជាក់ទូទាត់', create: 'បង្កើត QR ដែលបានផ្ទៀងផ្ទាត់', creating: 'កំពុងរៀបចំ...', refresh: 'ពិនិត្យស្ថានភាព', checking: 'កំពុងពិនិត្យ...', cancel: 'បោះបង់ Order', cancelling: 'កំពុងបោះបង់...', waiting: 'រង់ចាំការទូទាត់', review: 'រង់ចាំ Admin ពិនិត្យ', credited: 'បញ្ជាក់ទូទាត់ និងបញ្ចូលទៅ Wallet រួច', expired: 'Order ផុតកំណត់', cancelled: 'បានបោះបង់ Order', unavailable: 'សេវាទូទាត់មិនទាន់អាចប្រើបាន។ កុំទាន់ផ្ញើ USDT។', noPackage: 'សូមជ្រើសរើសកញ្ចប់ពេជ្រពីទំព័រទិញជាមុន។', back: 'ត្រឡប់ទៅទិញ', report: 'របាយការណ៍កំពុងរង់ចាំពិនិត្យ។ សូមកុំបង់ពីរដង។', error: 'មិនអាចទាញ Order បានទេ។', note: 'ពេជ្រ និង Voucher នឹងបញ្ចូលតែក្រោយការផ្ទៀងផ្ទាត់ប៉ុណ្ណោះ។', loading: 'កំពុងទាញ Order...' },
  zh: { title: 'Binance Pay 结账', fee: 'Binance 手续费：1 USDT', amount: '合计：{{amount}} USDT', diamonds: '{{count}} 钻石', bonus: '确认后赠送 100 Vouchers', create: '生成已验证的付款二维码', creating: '正在准备...', refresh: '查询状态', checking: '查询中...', cancel: '取消订单', cancelling: '取消中...', waiting: '等待付款', review: '等待管理员审核', credited: '付款已确认并入账', expired: '订单已过期', cancelled: '订单已取消', unavailable: '付款服务暂不可用，请勿转账 USDT。', noPackage: '请先在购买页面选择钻石套餐。', back: '返回购买', report: '付款报告正在审核，请勿重复付款。', error: '无法获取订单。', note: '钻石和优惠券仅在核实付款后入账。', loading: '加载订单中...' },
  ja: { title: 'Binance Pay 決済', fee: 'Binance 手数料: 1 USDT', amount: '合計: {{amount}} USDT', diamonds: '{{count}} ダイヤ', bonus: '確認後に 100 Vouchers 追加', create: '確認済みの支払い QR を作成', creating: '準備中...', refresh: '状況を確認', checking: '確認中...', cancel: '注文をキャンセル', cancelling: 'キャンセル中...', waiting: '入金待ち', review: '管理者の確認待ち', credited: '決済が確認され残高に反映されました', expired: '注文の期限が切れました', cancelled: '注文はキャンセルされました', unavailable: '現在利用できません。USDT を送金しないでください。', noPackage: '購入ページでダイヤプランを選択してください。', back: '購入画面へ戻る', report: '支払い報告を確認中です。二重払いしないでください。', error: '注文を読み込めませんでした。', note: 'ダイヤと Vouchers は支払い確認後に追加されます。', loading: '注文を読み込んでいます...' },
  ko: { title: 'Binance Pay 결제', fee: 'Binance 수수료: 1 USDT', amount: '총액: {{amount}} USDT', diamonds: '다이아몬드 {{count}}개', bonus: '확인 후 Vouchers 100개 추가', create: '확인된 결제 QR 생성', creating: '준비 중...', refresh: '상태 확인', checking: '확인 중...', cancel: '주문 취소', cancelling: '취소 중...', waiting: '결제 대기', review: '관리자 검토 대기', credited: '결제가 확인되어 지갑에 지급되었습니다', expired: '주문 만료', cancelled: '주문 취소됨', unavailable: '현재 결제 서비스를 사용할 수 없습니다. USDT를 보내지 마세요.', noPackage: '구매 페이지에서 다이아몬드 패키지를 선택하세요.', back: '구매로 돌아가기', report: '결제 신고를 검토 중입니다. 중복 결제하지 마세요.', error: '주문을 불러오지 못했습니다.', note: '다이아몬드와 Vouchers는 확인 후에만 지급됩니다.', loading: '주문 불러오는 중...' },
})

const PACKAGES = new Set([1, 5, 10, 20, 50, 100])

export default function BinanceCheckoutPanel({ packageUsd, onBack }) {
  const { t } = useDisplayTranslation()
  const [order, setOrder] = useState(null)
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const requestedAmount = Number(packageUsd)
  const validPackage = PACKAGES.has(requestedAmount)

  useEffect(() => {
    let active = true
    async function restore() {
      const savedId = getRememberedBinanceOrderId()
      if (!savedId) {
        if (active) setLoading(false)
        return
      }
      try {
        const existing = await getReaderBinanceOrder(savedId)
        if (!active) return
        setOrder(existing)
        if (existing.status === 'pending_review') {
          const savedClaim = await getReaderBinanceClaim(savedId).catch(() => null)
          if (active) setClaim(savedClaim)
        }
      } catch (failure) {
        if (failure?.status === 404) clearRememberedBinanceOrderId()
        if (active && failure?.status !== 404) setError(failure?.message || t('binanceCheckoutPanel.error'))
      } finally {
        if (active) setLoading(false)
      }
    }
    restore()
    return () => { active = false }
  }, [t])

  async function prepare() {
    if (busy || !validPackage) return
    setBusy(true)
    setError('')
    try {
      const next = await createReaderBinanceOrder(requestedAmount)
      if (!next?.id) throw new Error(t('binanceCheckoutPanel.unavailable'))
      rememberBinanceOrderId(next.id)
      setOrder(next)
      setClaim(null)
    } catch (failure) {
      setError(failure?.message || t('binanceCheckoutPanel.unavailable'))
    } finally {
      setBusy(false)
    }
  }

  async function refresh() {
    if (!order?.id || busy) return
    setBusy(true)
    setError('')
    try {
      const next = await getReaderBinanceOrder(order.id)
      setOrder(next)
      if (next.status === 'pending_review' || next.status === 'credited') {
        setClaim(await getReaderBinanceClaim(next.id).catch(() => null))
      }
    } catch (failure) {
      setError(failure?.message || t('binanceCheckoutPanel.error'))
    } finally {
      setBusy(false)
    }
  }

  async function cancel() {
    if (!order?.id || busy) return
    setBusy(true)
    setError('')
    try {
      const next = await cancelReaderBinanceOrder(order.id)
      setOrder(next)
      if (next.status === 'cancelled') clearRememberedBinanceOrderId()
    } catch (failure) {
      setError(failure?.message || t('binanceCheckoutPanel.error'))
    } finally {
      setBusy(false)
    }
  }

  const statusKey = ({ waiting_payment: 'waiting', pending_review: 'review', credited: 'credited', expired: 'expired', cancelled: 'cancelled' })[order?.status] || 'unavailable'
  const mayReport = order?.status === 'waiting_payment' && claim == null && order?.checkout_ready === true
  const showQr = mayReport

  return (
    <div className="space-y-4">
      <section className="app-card rounded-[20px] border border-[var(--shadow-border)] p-5">
        <div className="flex items-center gap-3">
          <img src="/assets/Icons/Picture/Binance%20Logo.svg" alt="Binance Pay" className="h-12 w-12 rounded-xl bg-black object-contain p-1" />
          <div><h2 className="app-title text-[17px] font-black">{t('binanceCheckoutPanel.title')}</h2><p className="app-muted text-[12px]">{t('binanceCheckoutPanel.fee')}</p></div>
        </div>
        {!order && validPackage ? <div className="mt-4 space-y-1"><p className="app-title text-[20px] font-black">{t('binanceCheckoutPanel.amount', { amount: requestedAmount + 1 })}</p><p className="app-muted text-[12px]">{t('binanceCheckoutPanel.diamonds', { count: requestedAmount * 100 })} · {t('binanceCheckoutPanel.bonus')}</p></div> : null}
        {order ? <div className="mt-4 space-y-1"><p className="app-title text-[20px] font-black">{t('binanceCheckoutPanel.amount', { amount: order.amount_usdt })}</p><p className="app-muted text-[12px]">{t('binanceCheckoutPanel.diamonds', { count: order.diamonds })} · {t('binanceCheckoutPanel.bonus')}</p><p className="app-title pt-2 text-[13px] font-bold">{t(`binanceCheckoutPanel.${statusKey}`)}</p></div> : null}
        {loading ? <p className="app-muted mt-4 text-[12px]">{t('binanceCheckoutPanel.loading')}</p> : null}
        {!loading && !order && !validPackage ? <p className="app-muted mt-4 text-[13px]">{t('binanceCheckoutPanel.noPackage')}</p> : null}
        {!loading && !order && validPackage ? <button onClick={prepare} disabled={busy} className="mt-4 h-12 w-full rounded-xl bg-[#F3BA2F] text-[14px] font-extrabold text-black disabled:opacity-50">{busy ? t('binanceCheckoutPanel.creating') : t('binanceCheckoutPanel.create')}</button> : null}
        {order ? <button onClick={refresh} disabled={busy} className="mt-4 h-11 w-full rounded-xl border border-[var(--shadow-border)] font-bold disabled:opacity-50">{busy ? t('binanceCheckoutPanel.checking') : t('binanceCheckoutPanel.refresh')}</button> : null}
        {order?.status === 'waiting_payment' ? <button onClick={cancel} disabled={busy} className="app-muted mt-2 w-full py-2 text-[12px] font-bold disabled:opacity-50">{t('binanceCheckoutPanel.cancel')}</button> : null}
        {error ? <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-[12px] font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p> : null}
        <p className="app-muted mt-4 text-[11px] leading-5">{t('binanceCheckoutPanel.note')}</p>
        {onBack ? <button onClick={onBack} className="app-muted mt-3 w-full py-2 text-[12px] font-bold">{t('binanceCheckoutPanel.back')}</button> : null}
      </section>
      {showQr ? <BinanceReceiverCard order={order} /> : null}
      {mayReport ? <BinanceClaimForm key={order.id} orderId={order.id} onSubmitted={(next) => { setClaim(next); setOrder(previous => ({ ...previous, status: next?.review_status === 'submitted' ? 'pending_review' : previous.status, checkout_ready: false })) }} /> : null}
      {order?.status === 'pending_review' ? <div role="status" className="app-card rounded-xl border border-[var(--shadow-border)] p-4 text-center text-[13px] font-semibold">{t('binanceCheckoutPanel.report')}</div> : null}
    </div>
  )
}
