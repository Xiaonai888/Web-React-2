import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PaymentProfileModal from '../components/Wallet/PaymentProfileModal'
import {
  clearRememberedBinanceOrderId,
  createReaderBinanceOrder,
  getReaderBinanceOrder,
  getRememberedBinanceOrderId,
  getVerifiedBinanceQrUrl,
  rememberBinanceOrderId,
} from '../services/binanceCheckoutApi'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

// Full-page Binance QR checkout. Never auto-credit a wallet from a QR display.
registerTranslationNamespace('binancePayFullPage', {
  en: {
    title: 'Binance Pay', payTo: 'PAY TO', amount: 'AMOUNT', scan: 'Scan to pay', or: 'or',
    download: 'Download QR', bonus: '{{diamonds}} Diamonds + {{vouchers}} Vouchers',
    footnote: 'Diamonds and vouchers are credited after verification.',
    loading: 'Preparing secure payment QR...', profileRequired: 'Add your Binance account to continue.',
    invalidPackage: 'Choose a Diamonds package before opening Binance Pay.',
    expired: 'Payment time expired. Do not send USDT using this order.',
    review: 'Waiting for Admin to verify your payment.', credited: 'Payment verified.',
    cancelled: 'This payment order was cancelled.', unavailable: 'Verified Binance QR is unavailable. Do not send USDT.',
    checkStatus: 'Check status', checking: 'Checking...', back: 'Back to Purchase',
    differentPackage: 'A different Binance payment is still active. Finish that order before buying another package.',
    retry: 'Try again', login: 'Please sign in to continue.',
  },
  km: {
    title: 'Binance Pay', payTo: 'បង់ទៅ', amount: 'ចំនួនទឹកប្រាក់', scan: 'ស្កេនដើម្បីបង់ប្រាក់', or: 'ឬ',
    download: 'ទាញយក QR', bonus: '{{diamonds}} ពេជ្រ + {{vouchers}} Vouchers',
    footnote: 'ពេជ្រ និង Vouchers នឹងបញ្ចូលក្រោយការផ្ទៀងផ្ទាត់ជោគជ័យ។',
    loading: 'កំពុងរៀបចំ QR សុវត្ថិភាព...', profileRequired: 'សូមបំពេញគណនី Binance ដើម្បីបន្ត។',
    invalidPackage: 'សូមជ្រើសកញ្ចប់ពេជ្រជាមុនសិន។',
    expired: 'ផុតពេលបង់ប្រាក់ហើយ។ សូមកុំផ្ញើ USDT តាម Order នេះ។',
    review: 'កំពុងរង់ចាំ Admin ផ្ទៀងផ្ទាត់ការទូទាត់។', credited: 'ការទូទាត់បានផ្ទៀងផ្ទាត់រួច។',
    cancelled: 'Order ទូទាត់នេះត្រូវបានបោះបង់។', unavailable: 'មិនមាន QR Binance ដែលបានផ្ទៀងផ្ទាត់ទេ។ សូមកុំផ្ញើ USDT។',
    checkStatus: 'ពិនិត្យស្ថានភាព', checking: 'កំពុងពិនិត្យ...', back: 'ត្រឡប់ទៅទិញ',
    differentPackage: 'អ្នកមាន Order Binance ផ្សេងមួយកំពុងដំណើរការ។ សូមបញ្ចប់ Order ចាស់ជាមុនសិន។',
    retry: 'សាកល្បងម្ដងទៀត', login: 'សូមចូលគណនីជាមុនសិន។',
  },
  zh: {
    title: 'Binance Pay', payTo: '收款人', amount: '付款金额', scan: '扫码支付', or: '或',
    download: '下载二维码', bonus: '{{diamonds}} 钻石 + {{vouchers}} Vouchers',
    footnote: '钻石和代金券将在付款核实后到账。',
    loading: '正在准备安全付款二维码...', profileRequired: '请先填写您的 Binance 账户信息。',
    invalidPackage: '请先选择钻石套餐。', expired: '付款时间已结束，请勿再向此订单转账。',
    review: '等待管理员核实付款。', credited: '付款已核实。', cancelled: '付款订单已取消。',
    unavailable: '安全付款二维码不可用，请勿转账。', checkStatus: '检查状态', checking: '检查中...',
    back: '返回购买', differentPackage: '另一个 Binance 订单仍在进行，请先完成。',
    retry: '重试', login: '请先登录。',
  },
  ja: {
    title: 'Binance Pay', payTo: '送金先', amount: '支払金額', scan: 'スキャンして支払う', or: 'または',
    download: 'QR をダウンロード', bonus: '{{diamonds}} ダイヤ + {{vouchers}} Vouchers',
    footnote: 'ダイヤと Vouchers は支払い確認後に反映されます。',
    loading: '安全な QR を準備中...', profileRequired: 'Binance アカウント情報を登録してください。',
    invalidPackage: '先にダイヤのプランを選択してください。', expired: '支払い期限が切れました。この注文には送金しないでください。',
    review: '管理者による確認待ちです。', credited: '支払いが確認されました。', cancelled: '注文はキャンセルされました。',
    unavailable: '確認済みの QR が利用できません。送金しないでください。', checkStatus: '状況を確認', checking: '確認中...',
    back: '購入画面へ戻る', differentPackage: '別の Binance 注文が進行中です。先に完了してください。',
    retry: '再試行', login: 'ログインしてください。',
  },
  ko: {
    title: 'Binance Pay', payTo: '받는 사람', amount: '결제 금액', scan: '스캔하여 결제', or: '또는',
    download: 'QR 다운로드', bonus: '{{diamonds}} 다이아몬드 + {{vouchers}} Vouchers',
    footnote: '다이아몬드와 Vouchers는 결제 확인 후 지급됩니다.',
    loading: '안전한 결제 QR 준비 중...', profileRequired: '먼저 Binance 계정 정보를 등록하세요.',
    invalidPackage: '다이아몬드 상품을 먼저 선택하세요.', expired: '결제 시간이 만료되었습니다. 이 주문에 송금하지 마세요.',
    review: '관리자 결제 확인 대기 중입니다.', credited: '결제가 확인되었습니다.', cancelled: '주문이 취소되었습니다.',
    unavailable: '인증된 Binance QR을 사용할 수 없습니다. 송금하지 마세요.', checkStatus: '상태 확인', checking: '확인 중...',
    back: '구매 화면으로', differentPackage: '다른 Binance 주문이 진행 중입니다. 먼저 완료하세요.',
    retry: '다시 시도', login: '로그인해 주세요.',
  },
})

const PACKAGES = new Set([1, 5, 10, 20, 50, 100])
const FIFTEEN_MINUTES = 15 * 60 * 1000
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

function readerToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function isBinanceProfileReady(user) {
  return String(user?.binance_name || '').trim().length >= 2 &&
    /^\d{5,20}$/.test(String(user?.binance_uid || '').trim())
}

function timeRemaining(order, now) {
  if (!order || order.status !== 'waiting_payment') return 0
  const created = Date.parse(order.created_at || '')
  const serverExpiry = Date.parse(order.expires_at || '')
  if (!Number.isFinite(created)) return 0
  const localExpiry = created + FIFTEEN_MINUTES
  const end = Number.isFinite(serverExpiry) ? Math.min(localExpiry, serverExpiry) : localExpiry
  return Math.max(0, Math.ceil((end - now) / 1000))
}

function formatTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}

function isVerifiedCheckout(order) {
  return order?.status === 'waiting_payment' &&
    order?.checkout_ready === true &&
    order?.qr_path === '/api/purchase/binance/receiver/qr' &&
    /^\d{5,20}$/.test(String(order?.receiver?.uid || '')) &&
    String(order?.receiver?.name || '').trim().length > 1
}

export default function BinancePayPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const packageUsd = Number(location.state?.packageUsd)
  const validPackage = PACKAGES.has(packageUsd)

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [requiresProfile, setRequiresProfile] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [qrImage, setQrImage] = useState('')
  const [qrFailed, setQrFailed] = useState(false)
  const [qrAttempt, setQrAttempt] = useState(0)

  const remaining = useMemo(() => timeRemaining(order, now), [order, now])
  const expiredLocally = order?.status === 'waiting_payment' && remaining === 0
  const payable = Boolean(isVerifiedCheckout(order) && !expiredLocally)
  const wrongPackage = Boolean(order && ['waiting_payment', 'pending_review'].includes(order.status) &&
    validPackage && Number(order.package_usd) !== packageUsd)

  function goBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate('/shop/mall/purchase', { replace: true })
  }

  async function createOrder() {
    if (!validPackage) return
    setBusy(true)
    setError('')
    try {
      const next = await createReaderBinanceOrder(packageUsd)
      if (!next?.id) throw new Error(t('binancePayFullPage.unavailable'))
      rememberBinanceOrderId(next.id)
      setOrder(next)
      setNow(Date.now())
    } catch (failure) {
      setError(failure?.message || t('binancePayFullPage.unavailable'))
    } finally {
      setBusy(false)
      setLoading(false)
    }
  }

  // Fetch the user's saved payment profile once. The backend remains the authority
  // for receiver identity, payment order ownership, and QR availability.
  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    async function initialise() {
      setOrder(null)
      setLoading(true)
      setError('')
      setRequiresProfile(false)
      if (!validPackage) { setLoading(false); return }
      const token = readerToken()
      if (!token) { setError(t('binancePayFullPage.login')); setLoading(false); return }
      try {
        const profileResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store',
        })
        const payload = await profileResponse.json().catch(() => ({}))
        if (!profileResponse.ok || payload?.ok !== true || !payload?.user) throw new Error('Unable to load payment profile')
        if (!mounted) return

        const savedId = getRememberedBinanceOrderId()
        if (savedId) {
          try {
            const existing = await getReaderBinanceOrder(savedId)
            if (!mounted) return
            if (['waiting_payment', 'pending_review'].includes(existing?.status)) {
              setOrder(existing)
              setLoading(false)
              return
            }
            clearRememberedBinanceOrderId()
          } catch (failure) {
            if (!mounted) return
            if (failure?.status !== 404) throw failure
            clearRememberedBinanceOrderId()
          }
        }

        if (!isBinanceProfileReady(payload.user)) {
          setRequiresProfile(true)
          setLoading(false)
          return
        }

        const next = await createReaderBinanceOrder(packageUsd)
        if (!mounted) return
        if (!next?.id) throw new Error(t('binancePayFullPage.unavailable'))
        rememberBinanceOrderId(next.id)
        setOrder(next)
      } catch (failure) {
        if (mounted && !controller.signal.aborted) {
          setError(failure?.message || t('binancePayFullPage.unavailable'))
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void initialise()
    return () => { mounted = false; controller.abort() }
    // Reinitialise only if a different package is opened, not on timer ticks.
  }, [packageUsd, validPackage])

  useEffect(() => {
    if (order?.status !== 'waiting_payment') return undefined
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [order?.status])

  // QR is downloaded only from the verified backend image endpoint. Never display
  // or make downloadable a QR when receiver verification or checkout has failed.
  useEffect(() => {
    setQrImage('')
    setQrFailed(false)
    if (!payable) return undefined
    const controller = new AbortController()
    let objectUrl = ''
    async function fetchQr() {
      try {
        const response = await fetch(getVerifiedBinanceQrUrl(), {
          method: 'GET', credentials: 'omit', cache: 'no-store', signal: controller.signal,
        })
        if (!response.ok || !String(response.headers.get('content-type') || '').toLowerCase().startsWith('image/webp')) {
          throw new Error('Unverified QR image')
        }
        const blob = await response.blob()
        if (blob.size < 16 || blob.size > 512 * 1024 || controller.signal.aborted) throw new Error('Invalid QR image')
        objectUrl = URL.createObjectURL(blob)
        setQrImage(objectUrl)
      } catch {
        if (!controller.signal.aborted) setQrFailed(true)
      }
    }
    void fetchQr()
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [order?.id, order?.receiver?.uid, order?.receiver?.name, payable, qrAttempt])

  function downloadQr() {
    if (!payable || !qrImage) return
    const anchor = document.createElement('a')
    anchor.href = qrImage
    anchor.download = 'Shadow-Binance-Pay-QR.webp'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  async function checkStatus() {
    if (!order?.id || busy) return
    setBusy(true)
    setError('')
    try {
      const next = await getReaderBinanceOrder(order.id)
      setOrder(next)
      setNow(Date.now())
      if (['credited', 'expired', 'cancelled'].includes(next?.status)) clearRememberedBinanceOrderId()
    } catch (failure) {
      setError(failure?.message || t('binancePayFullPage.unavailable'))
    } finally {
      setBusy(false)
    }
  }

  let statusText = ''
  if (wrongPackage) statusText = t('binancePayFullPage.differentPackage')
  else if (expiredLocally || order?.status === 'expired') statusText = t('binancePayFullPage.expired')
  else if (order?.status === 'pending_review') statusText = t('binancePayFullPage.review')
  else if (order?.status === 'credited') statusText = t('binancePayFullPage.credited')
  else if (order?.status === 'cancelled') statusText = t('binancePayFullPage.cancelled')
  else if (order && !payable) statusText = t('binancePayFullPage.unavailable')

  return (
    <div className="app-page min-h-[100dvh] bg-white text-[#111827] dark:bg-[#0d0f16] dark:text-white">
      <header className="sticky top-0 z-30 border-b border-[#edf0f5] bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0d0f16]/95">
        <div className="mx-auto flex h-14 w-full max-w-[480px] items-center gap-3 px-4">
          <button type="button" onClick={goBack} aria-label={t('binancePayFullPage.back')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] hover:bg-gray-100 dark:text-white dark:hover:bg-white/10">
            <i className="fas fa-chevron-left text-[16px]" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-[17px] font-extrabold">{t('binancePayFullPage.title')}</h1>
          <div className="flex shrink-0 items-center gap-1.5 text-[14px] font-bold tabular-nums">
            <i className="far fa-clock text-[17px] text-[#E4AC0A]" aria-hidden="true" />
            {formatTime(remaining || (!order && loading ? 900 : 0))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[480px] flex-col items-center px-5 pb-10 pt-7 text-center">
        <img src="/assets/Icons/Picture/Binance%20Logo.svg" alt="Binance" className="h-16 w-16 rounded-2xl bg-[#111111] object-contain p-2" />

        {loading || busy && !order ? (
          <p role="status" className="mt-8 text-[13px] text-gray-500 dark:text-white/60">{t('binancePayFullPage.loading')}</p>
        ) : null}

        {validPackage && order ? (
          <>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/50">{t('binancePayFullPage.payTo')}</p>
            <p className="mt-1 break-words text-[20px] font-extrabold">{order.receiver?.name || '—'}</p>
            <div className="mt-5 w-full border-t border-dashed border-gray-200 dark:border-white/15" />
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/50">{t('binancePayFullPage.amount')}</p>
            <div className="mt-1 flex items-baseline justify-center gap-2">
              <strong className="text-[34px] font-black tracking-tight tabular-nums">{Number(order.amount_usdt).toFixed(2)}</strong>
              <span className="text-[14px] font-bold text-gray-500 dark:text-white/70">USDT</span>
            </div>
            <p className="mt-1 text-[12px] font-medium text-gray-500 dark:text-white/70">
              {t('binancePayFullPage.bonus', { diamonds: order.diamonds, vouchers: order.bonus_vouchers })}
            </p>
          </>
        ) : null}

        {payable && !wrongPackage && (
          <>
            <div className="mt-5 w-full border-t border-dashed border-gray-200 dark:border-white/15" />
            <div className="mt-5 flex aspect-square w-[min(68vw,260px)] items-center justify-center rounded-xl bg-white p-2">
              {qrImage && !qrFailed ? (
                <img src={qrImage} alt="Verified Binance Pay QR" onError={() => setQrFailed(true)} className="h-full w-full object-contain" />
              ) : qrFailed ? (
                <p role="alert" className="px-2 text-[12px] font-semibold text-red-600">{t('binancePayFullPage.unavailable')}</p>
              ) : (
                <span className="text-[12px] text-gray-400">{t('binancePayFullPage.loading')}</span>
              )}
            </div>
            {qrFailed ? (
              <button type="button" onClick={() => setQrAttempt((v) => v + 1)} className="mt-2 rounded-xl border px-4 py-2 text-[12px] font-bold">{t('binancePayFullPage.retry')}</button>
            ) : null}
            {qrImage && !qrFailed ? (
              <>
                <p className="mt-3 text-[13px] font-bold">{t('binancePayFullPage.scan')}</p>
                <p className="mt-1 text-[12px] text-gray-400 dark:text-white/55">{t('binancePayFullPage.or')}</p>
                <button type="button" onClick={downloadQr} className="mt-3 flex min-h-11 items-center justify-center gap-2 text-[14px] font-bold text-[#00A8C9] hover:underline">
                  <i className="fas fa-download" aria-hidden="true" /> {t('binancePayFullPage.download')}
                </button>
              </>
            ) : null}
          </>
        )}

        {statusText ? (
          <div role="status" className="mt-6 w-full rounded-xl bg-gray-50 px-4 py-4 text-[13px] font-semibold leading-6 text-gray-600 dark:bg-white/10 dark:text-white/80">
            {statusText}
          </div>
        ) : null}
        {error ? <p role="alert" className="mt-5 text-[12px] font-semibold text-red-600 dark:text-red-300">{error}</p> : null}
        {!validPackage ? <p className="mt-6 text-[13px]">{t('binancePayFullPage.invalidPackage')}</p> : null}
        {order && !payable && !wrongPackage && (
          <button type="button" disabled={busy} onClick={checkStatus} className="mt-4 min-h-11 rounded-xl border border-gray-300 px-5 text-[13px] font-bold disabled:opacity-60 dark:border-white/20">
            {busy ? t('binancePayFullPage.checking') : t('binancePayFullPage.checkStatus')}
          </button>
        )}
        {!loading && validPackage && !order && !requiresProfile && (
          <button type="button" disabled={busy} onClick={createOrder} className="mt-5 rounded-xl bg-[#F3BA2F] px-6 py-3 text-[13px] font-bold text-black disabled:opacity-50">
            {busy ? t('binancePayFullPage.loading') : t('binancePayFullPage.retry')}
          </button>
        )}
        <p className="mt-8 max-w-[340px] text-[11px] leading-5 text-gray-400 dark:text-white/55">{t('binancePayFullPage.footnote')}</p>
      </main>

      {requiresProfile && (
        <PaymentProfileModal
          showBank={false}
          showBinance
          onClose={goBack}
          onSaved={(savedUser) => {
            if (!isBinanceProfileReady(savedUser)) {
              setError(t('binancePayFullPage.profileRequired'))
              return
            }
            setRequiresProfile(false)
            void createOrder()
          }}
        />
      )}
    </div>
  )
}
