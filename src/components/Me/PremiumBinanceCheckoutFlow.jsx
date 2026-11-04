import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PaymentProfileModal from '../Wallet/PaymentProfileModal'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getPaymentCountryTicket, isCountryPolicyEnabled, loadCountrySettings } from '../../utils/countrySettings'

// NEW: Binance Premium QR checkout. Only the backend RPC may fulfill the purchase.
// UI never credits Diamonds/Vouchers or enables Premium from a QR display.
registerTranslationNamespace('premiumBinance', {
  en: {
    title: 'Binance Premium', loading: 'Preparing verified payment...', retry: 'Try again',
    close: 'Close', cancel: 'Cancel unpaid order', cancelBusy: 'Cancelling...',
    price: 'Premium price', fee: 'Binance fee', pay: 'Transfer exactly',
    receiver: 'Verified receiver', uid: 'Binance UID', bonus: 'Bonus',
    voucherBonus: '+100 Vouchers after successful verification',
    scan: 'Scan the verified QR in Binance Pay', download: 'Download QR',
    check: 'Check payment status', checking: 'Checking...',
    waiting: 'Waiting for Binance transfer', review: 'Payment awaiting verification',
    done: 'Premium activated and rewards granted', cancelled: 'Payment cancelled',
    expired: 'Checkout expired. Do not transfer now.',
    late: 'Time to pay has ended. A transfer already sent may still be verified. Do not pay twice or cancel.',
    receipt: 'Order ID', profile: 'Add your Binance account to continue.',
    qrUnavailable: 'Verified receiver QR unavailable. Do not transfer USDT.',
    warning: 'Transfer only to the verified receiver shown here. Premium, Diamonds, and Vouchers are granted only after the official receipt is verified.',
    login: 'Please sign in again.', createError: 'Could not create Binance Premium checkout.',
    statusError: 'Could not check payment status.', cancelError: 'Could not cancel this order.',
    active: 'Another Binance checkout is active. Finish it first.',
  },
  km: {
    title: 'Binance Premium', loading: 'កំពុងរៀបចំការទូទាត់ដែលបានផ្ទៀងផ្ទាត់...', retry: 'ព្យាយាមម្ដងទៀត',
    close: 'បិទ', cancel: 'បោះបង់ Order មិនទាន់បង់', cancelBusy: 'កំពុងបោះបង់...',
    price: 'តម្លៃ Premium', fee: 'ថ្លៃ Binance', pay: 'ផ្ទេរឱ្យត្រឹមត្រូវ',
    receiver: 'គណនីទទួលដែលបានផ្ទៀងផ្ទាត់', uid: 'Binance UID', bonus: 'រង្វាន់',
    voucherBonus: '+100 Vouchers ក្រោយផ្ទៀងផ្ទាត់ជោគជ័យ',
    scan: 'ស្កេន QR ដែលបានផ្ទៀងផ្ទាត់ក្នុង Binance', download: 'ទាញយក QR',
    check: 'ពិនិត្យស្ថានភាពទូទាត់', checking: 'កំពុងពិនិត្យ...',
    waiting: 'រង់ចាំការផ្ទេរ Binance', review: 'ការទូទាត់កំពុងផ្ទៀងផ្ទាត់',
    done: 'Premium បានដំណើរការ និងផ្ដល់រង្វាន់', cancelled: 'ការទូទាត់ត្រូវបានបោះបង់',
    expired: 'ម៉ោងបង់ប្រាក់ផុតកំណត់។ កុំទាន់ផ្ទេរ។',
    late: 'ម៉ោងស្កេនបានផុតកំណត់។ បើបានផ្ទេររួច ប្រព័ន្ធអាចកំពុងផ្ទៀងផ្ទាត់។ កុំបង់ស្ទួន ឬបោះបង់។',
    receipt: 'លេខ Order', profile: 'សូមបំពេញគណនី Binance មុនបន្ត។',
    qrUnavailable: 'មិនមាន QR ដែលបានផ្ទៀងផ្ទាត់ទេ។ សូមកុំផ្ទេរ USDT។',
    warning: 'សូមផ្ទេរតែទៅគណនីទទួលដែលបានផ្ទៀងផ្ទាត់។ Premium, Diamonds និង Vouchers ផ្ដល់ជូនក្រោយពិនិត្យ Receipt ផ្លូវការតែប៉ុណ្ណោះ។',
    login: 'សូម Login ម្ដងទៀត។', createError: 'មិនអាចបង្កើត Binance Premium Order បាន។',
    statusError: 'មិនអាចពិនិត្យស្ថានភាពការទូទាត់បាន។', cancelError: 'មិនអាចបោះបង់ Order បាន។',
    active: 'មាន Binance Order ផ្សេងកំពុងដំណើរការ។ សូមបញ្ចប់ Order ចាស់ជាមុន។',
  },
  zh: {
    title: 'Binance Premium', loading: '正在准备已验证的付款...', retry: '重试', close: '关闭',
    cancel: '取消未付款订单', cancelBusy: '取消中...', price: 'Premium 价格', fee: 'Binance 手续费', pay: '请准确转账',
    receiver: '已验证收款方', uid: 'Binance UID', bonus: '奖励', voucherBonus: '验证成功后赠送 100 Vouchers',
    scan: '使用 Binance 扫描已验证的二维码', download: '下载二维码', check: '检查付款状态', checking: '检查中...',
    waiting: '等待 Binance 转账', review: '正在验证付款', done: 'Premium 已激活并发放奖励', cancelled: '付款已取消',
    expired: '付款时间已过，请勿转账。', late: '付款窗口已结束。已发送的转账可能仍在验证中。请勿重复支付或取消订单。',
    receipt: '订单 ID', profile: '请先添加 Binance 账户。', qrUnavailable: '已验证的二维码不可用，请勿转账。',
    warning: '仅向已验证的收款方转账。Premium、Diamonds 和 Vouchers 在官方收据核实后发放。',
    login: '请重新登录。', createError: '无法创建 Binance Premium 订单。', statusError: '无法检查付款状态。',
    cancelError: '无法取消此订单。', active: '另一个 Binance 订单正在进行，请先完成。',
  },
  ja: {
    title: 'Binance Premium', loading: '確認済み支払いを準備中...', retry: '再試行', close: '閉じる',
    cancel: '未払い注文をキャンセル', cancelBusy: 'キャンセル中...', price: 'Premium 価格', fee: 'Binance 手数料', pay: '正確な送金額',
    receiver: '確認済み受取先', uid: 'Binance UID', bonus: '特典', voucherBonus: '確認後に 100 Vouchers を付与',
    scan: 'Binance で確認済み QR をスキャン', download: 'QR を保存', check: '支払い状況を確認', checking: '確認中...',
    waiting: 'Binance 送金待ち', review: '支払い確認中', done: 'Premium 有効化と特典付与が完了', cancelled: '支払いをキャンセルしました',
    expired: '支払い期限切れです。送金しないでください。', late: '支払い期限が終了しました。送金済みの場合は確認中の可能性があります。再送金やキャンセルはしないでください。',
    receipt: '注文 ID', profile: 'Binance アカウントを追加してください。', qrUnavailable: '確認済み QR が利用できません。送金しないでください。',
    warning: '確認済みの受取先にのみ送金してください。Premium、Diamonds、Vouchers は公式取引確認後に付与されます。',
    login: '再ログインしてください。', createError: 'Binance Premium 注文の作成に失敗しました。',
    statusError: '支払い状況を確認できません。', cancelError: '注文をキャンセルできません。',
    active: '別の Binance 注文が進行中です。先に完了してください。',
  },
  ko: {
    title: 'Binance Premium', loading: '검증된 결제를 준비 중...', retry: '다시 시도', close: '닫기',
    cancel: '미결제 주문 취소', cancelBusy: '취소 중...', price: 'Premium 가격', fee: 'Binance 수수료', pay: '정확한 송금액',
    receiver: '검증된 수취인', uid: 'Binance UID', bonus: '보너스', voucherBonus: '확인 후 100 Vouchers 지급',
    scan: 'Binance에서 검증된 QR 스캔', download: 'QR 저장', check: '결제 상태 확인', checking: '확인 중...',
    waiting: 'Binance 송금 대기', review: '결제 검증 중', done: 'Premium 활성화 및 보상 지급 완료', cancelled: '결제 취소됨',
    expired: '결제 시간이 만료되었습니다. 송금하지 마세요.', late: '결제 시간이 종료되었습니다. 이미 보낸 송금은 확인 중일 수 있으니 중복 송금하거나 취소하지 마세요.',
    receipt: '주문 ID', profile: 'Binance 계정을 먼저 등록하세요.', qrUnavailable: '검증된 QR을 사용할 수 없습니다. 송금하지 마세요.',
    warning: '검증된 수취인에게만 송금하세요. Premium, Diamonds, Vouchers는 공식 영수증 확인 후 지급됩니다.',
    login: '다시 로그인하세요.', createError: 'Binance Premium 주문을 만들 수 없습니다.',
    statusError: '결제 상태를 확인할 수 없습니다.', cancelError: '주문을 취소할 수 없습니다.',
    active: '다른 Binance 주문이 진행 중입니다. 먼저 완료하세요.',
  },
})

const API = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const ORDER_KEY = 'shadow_premium_binance_order_v1'
const QR_PATH = '/api/purchase/binance/receiver/qr'
const ID_RE = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
const FIFTEEN_MINUTES = 15 * 60 * 1000
const PLAN_MONTHS = new Set([1, 3, 12])

function readerToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}
function isBinanceProfileReady(user) {
  return String(user?.binance_name || '').trim().length >= 2 && /^\d{5,20}$/.test(String(user?.binance_uid || '').trim())
}
function pendingOrderId() {
  const id = localStorage.getItem(ORDER_KEY) || ''
  return ID_RE.test(id) ? id : ''
}
function saveOrderId(id) {
  if (ID_RE.test(id)) localStorage.setItem(ORDER_KEY, id)
}
function clearOrderId() {
  localStorage.removeItem(ORDER_KEY)
}
function safeOrder(order, months) {
  return order && ID_RE.test(String(order.id || order.order_id)) && order.purchase_kind === 'premium'
    && Number(order.plan_months) === months && Number(order.binance_fee_usdt) === 1
    && Number(order.bonus_vouchers) === 100 && Number(order.amount_usdt) > 1
}
function secondsRemaining(order, now) {
  if (!order || order.status !== 'waiting_payment') return 0
  const created = Date.parse(order.created_at || '')
  const expires = Date.parse(order.expires_at || '')
  if (!Number.isFinite(created) || !Number.isFinite(expires)) return 0
  return Math.max(0, Math.ceil((Math.min(expires, created + FIFTEEN_MINUTES) - now) / 1000))
}
function verifiedQr(order, now) {
  return secondsRemaining(order, now) > 0 && order?.checkout_ready === true
    && order?.qr_path === QR_PATH && /^\d{5,20}$/.test(String(order?.receiver?.uid || ''))
    && String(order?.receiver?.name || '').trim().length >= 2
}
function prettyTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}
function rememberPremium(premium) {
  if (!premium) return
  for (const store of [localStorage, sessionStorage]) {
    try {
      const raw = store.getItem('shadow_reader_user')
      if (!raw) continue
      const user = JSON.parse(raw)
      store.setItem('shadow_reader_user', JSON.stringify({
        ...user,
        is_premium: Boolean(premium.is_premium),
        premium_started_at: premium.premium_started_at || null,
        premium_expires_at: premium.premium_expires_at || null,
        premium_plan_months: Number(premium.premium_plan_months || 0),
      }))
    } catch { /* storage may be disabled */ }
  }
}

export default function PremiumBinanceCheckoutFlow({ planMonths, onClose, onSuccess }) {
  const { t } = useDisplayTranslation()
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requiresProfile, setRequiresProfile] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [qrFailed, setQrFailed] = useState(false)
  const [qrTry, setQrTry] = useState(0)
  const completionNotified = useRef('')
  const months = Number(planMonths)
  const remaining = useMemo(() => secondsRemaining(order, now), [order, now])
  const payable = Boolean(safeOrder(order, months) && verifiedQr(order, now))
  const amount = Number(order?.amount_usdt || 0)

  const request = useCallback(async (path, { method = 'GET', body, signal } = {}) => {
    const token = readerToken()
    if (!token) throw new Error(t('premiumBinance.login'))
    let ticket = null
    if (path === '/checkout' && method === 'POST') {
      const settings = await loadCountrySettings()
      if (isCountryPolicyEnabled(settings)) {
        ticket = await getPaymentCountryTicket()
        if (!ticket) throw new Error('Country verification required. Please refresh your account.')
      }
    }
    const response = await fetch(API + '/api/purchase/binance/premium' + path, {
      method, signal, cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(ticket ? { 'X-Shadow-Country-Ticket': ticket } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.ok !== true) {
      const failure = new Error(payload.message || t('premiumBinance.statusError'))
      failure.code = payload.code || 'REQUEST_FAILED'
      failure.status = response.status
      throw failure
    }
    return payload
  }, [t])

  const refreshPremium = useCallback(async (id) => {
    try {
      const response = await fetch(API + '/api/purchase/premium/status', {
        cache: 'no-store', headers: { Authorization: `Bearer ${readerToken()}` },
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok && data.ok && data.premium) {
        rememberPremium(data.premium)
        if (completionNotified.current !== id) {
          completionNotified.current = id
          onSuccess?.(data)
        }
      }
    } catch { /* order is still fulfilled on the server */ }
  }, [onSuccess])

  const applyOrder = useCallback((next) => {
    if (!safeOrder(next, months)) throw new Error('Invalid Premium checkout details. Please contact Admin.')
    setOrder(next)
    setNow(Date.now())
    setQrFailed(false)
    if (next.status === 'fulfilled') {
      clearOrderId()
      void refreshPremium(next.id)
    } else if (next.status === 'cancelled' || next.status === 'expired') {
      clearOrderId()
    } else {
      saveOrderId(next.id)
    }
  }, [months, refreshPremium])

  const createOrder = useCallback(async () => {
    if (!PLAN_MONTHS.has(months)) return
    setBusy(true)
    setError('')
    try {
      const data = await request('/checkout', { method: 'POST', body: { plan_months: months } })
      applyOrder(data.order)
    } catch (failure) {
      if (failure.code === 'BINANCE_PROFILE_REQUIRED') setRequiresProfile(true)
      setError(failure.message || t('premiumBinance.createError'))
    } finally {
      setBusy(false)
      setLoading(false)
    }
  }, [months, request, applyOrder, t])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    async function boot() {
      if (!PLAN_MONTHS.has(months)) { if (active) { setError('Invalid Premium plan'); setLoading(false) }; return }
      try {
        const savedId = pendingOrderId()
        if (savedId) {
          try {
            const data = await request(`/checkout/${encodeURIComponent(savedId)}`, { signal: controller.signal })
            if (!active) return
            if (safeOrder(data.order, months) && !['expired', 'cancelled'].includes(data.order.status)) {
              applyOrder(data.order)
              setLoading(false)
              return
            }
            if (data.order?.status === 'waiting_payment' || data.order?.status === 'pending_review') {
              throw new Error(t('premiumBinance.active'))
            }
            clearOrderId()
          } catch (e) {
            if (e.status !== 404) throw e
            clearOrderId()
          }
        }
        const response = await fetch(API + '/api/users/me', {
          cache: 'no-store', signal: controller.signal,
          headers: { Authorization: `Bearer ${readerToken()}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || !data.ok || !data.user) throw new Error(t('premiumBinance.login'))
        if (!active) return
        if (!isBinanceProfileReady(data.user)) {
          setRequiresProfile(true)
          setLoading(false)
          return
        }
        await createOrder()
      } catch (e) {
        if (active && !controller.signal.aborted) {
          setError(e.message || t('premiumBinance.createError'))
          setLoading(false)
        }
      }
    }
    void boot()
    return () => { active = false; controller.abort() }
  // Only initialise for a different selected plan; order creation is idempotent on the server.
  }, [months])

  useEffect(() => {
    if (!order || order.status !== 'waiting_payment') return undefined
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [order?.id, order?.status])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  async function checkStatus() {
    if (!order?.id || busy) return
    setBusy(true)
    setError('')
    try {
      const data = await request(`/checkout/${encodeURIComponent(order.id)}`)
      applyOrder(data.order)
    } catch (e) {
      setError(e.message || t('premiumBinance.statusError'))
    } finally { setBusy(false) }
  }

  async function cancelUnpaid() {
  if (!order?.id || busy || order.status !== 'waiting_payment' || remaining <= 0) return

  if (!window.confirm(t('premiumBinance.cancelConfirm'))) return

  setBusy(true)
    setError('')
    try {
      const data = await request(`/checkout/${encodeURIComponent(order.id)}/cancel`, { method: 'POST' })
      applyOrder(data.order)
    } catch (e) {
      setError(e.message || t('premiumBinance.cancelError'))
    } finally { setBusy(false) }
  }

  async function downloadQr() {
    if (!payable || busy) return
    setBusy(true)
    try {
      const response = await fetch(API + QR_PATH, { cache: 'no-store' })
      if (!response.ok || !String(response.headers.get('content-type') || '').includes('image/webp')) {
        throw new Error(t('premiumBinance.qrUnavailable'))
      }
      const blob = await response.blob()
      if (blob.size < 16 || blob.size > 512 * 1024) throw new Error(t('premiumBinance.qrUnavailable'))
      const link = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      link.href = objectUrl
      link.download = 'Shadow-Binance-Premium-QR.webp'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000)
    } catch (e) { setError(e.message || t('premiumBinance.qrUnavailable')) }
    finally { setBusy(false) }
  }

  const stateLabel = order?.status === 'fulfilled' ? t('premiumBinance.done')
    : order?.status === 'cancelled' ? t('premiumBinance.cancelled')
      : order?.status === 'expired' ? t('premiumBinance.expired')
        : order?.status === 'pending_review' ? t('premiumBinance.review')
          : remaining <= 0 && order?.status === 'waiting_payment' ? t('premiumBinance.late')
            : t('premiumBinance.waiting')

  return createPortal(
    <>
      <div className="fixed inset-0 z-[8000] flex justify-center bg-white p-0 dark:bg-[var(--shadow-bg-surface)]">
        <div className="relative h-[100dvh] w-full max-w-[510px] overflow-y-auto bg-white px-5 pb-7 pt-5 text-[#1f2937] dark:bg-[var(--shadow-bg-surface)] dark:text-white">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[20px] font-bold">{t('premiumBinance.title')}</h2>
            <button type="button" onClick={onClose} className="rounded-full border border-gray-200 px-3 py-2 text-[13px] dark:border-white/15" aria-label={t('premiumBinance.close')}>✕</button>
          </div>
          {loading ? <p className="mt-6 text-center text-[13px]">{t('premiumBinance.loading')}</p> : null}
          {order && safeOrder(order, months) ? <>
            <div className="mt-5 rounded-[18px] bg-[#f7f7f7] p-4 text-[13px] dark:bg-white/10">
              <div className="flex justify-between gap-2"><span>{t('premiumBinance.price')}</span><b>${order.price_usd}</b></div>
              <div className="mt-2 flex justify-between gap-2"><span>{t('premiumBinance.fee')}</span><b>+{order.binance_fee_usdt} USDT</b></div>
              <div className="mt-3 flex justify-between gap-2 border-t pt-3 text-[15px] dark:border-white/15"><b>{t('premiumBinance.pay')}</b><strong className="text-[#d49b00]">{order.amount_usdt} USDT</strong></div>
              <p className="mt-3 text-[12px] font-medium text-emerald-700 dark:text-emerald-300">{t('premiumBinance.voucherBonus')}</p>
              <p className="mt-2 break-all text-[11px] text-gray-500 dark:text-gray-300">{t('premiumBinance.receipt')}: {order.id}</p>
            </div>
            <p role="status" className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[12px] font-semibold leading-5 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">{stateLabel}</p>
            {payable ? <div className="mt-5 text-center">
              <p className="text-[13px] font-medium">{t('premiumBinance.receiver')}: <strong>{order.receiver.name}</strong></p>
              <p className="mt-1 font-mono text-[13px]">{t('premiumBinance.uid')}: {order.receiver.uid}</p>
              <p className="mt-3 font-mono text-[22px] font-bold">{prettyTime(remaining)}</p>
              <div className="mx-auto mt-3 flex h-[230px] w-[230px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-3">
                {!qrFailed ? <img key={qrTry} src={API + QR_PATH} alt="Verified Binance Premium receiver QR" className="h-full w-full object-contain" onError={() => setQrFailed(true)} /> : <p role="alert" className="text-[12px] font-semibold text-red-600">{t('premiumBinance.qrUnavailable')}</p>}
              </div>
              <p className="mt-3 text-[12px] font-medium">{t('premiumBinance.scan')}</p>
              {qrFailed ? <button type="button" className="mt-2 rounded-lg border px-3 py-2 text-[12px]" onClick={() => { setQrFailed(false); setQrTry((n) => n + 1) }}>{t('premiumBinance.retry')}</button> : <button type="button" disabled={busy} className="mt-2 rounded-lg border px-4 py-2 text-[13px] disabled:opacity-40" onClick={downloadQr}>{t('premiumBinance.download')}</button>}
            </div> : null}
            <p className="mt-4 text-[11px] leading-5 text-gray-500 dark:text-gray-300">{t('premiumBinance.warning')}</p>
            <button type="button" disabled={busy} onClick={checkStatus} className="mt-5 w-full rounded-full bg-[#F3BA2F] py-3 text-[14px] font-bold text-black disabled:opacity-50">{busy ? t('premiumBinance.checking') : t('premiumBinance.check')}</button>
            {order.status === 'waiting_payment' && remaining > 0 ? <button type="button" disabled={busy} onClick={cancelUnpaid} className="mt-2 w-full py-3 text-[12px] font-semibold text-red-600 disabled:opacity-40">{busy ? t('premiumBinance.cancelBusy') : t('premiumBinance.cancel')}</button> : null}
          </> : null}
          {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-[12px] font-semibold text-red-600">{error}</p> : null}
          {!loading && !order && !requiresProfile ? <button type="button" disabled={busy} className="mt-5 w-full rounded-full bg-[#F3BA2F] py-3 text-[13px] font-bold text-black disabled:opacity-50" onClick={createOrder}>{busy ? t('premiumBinance.loading') : t('premiumBinance.retry')}</button> : null}
        </div>
      </div>
      {requiresProfile ? <PaymentProfileModal showBank={false} showBinance onClose={onClose} onSaved={(savedUser) => {
        if (!isBinanceProfileReady(savedUser)) { setError(t('premiumBinance.profile')); return }
        setRequiresProfile(false)
        void createOrder()
      }} /> : null}
    </>,
    document.body
  )
}
