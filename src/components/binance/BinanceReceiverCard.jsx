import { useEffect, useState } from 'react'
import { getVerifiedBinanceQrUrl } from '../../services/binanceCheckoutApi'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('binanceReceiverCard', {
  en: { receiver: 'Verified receiver', uid: 'Binance UID', loading: 'Checking payment QR...', unavailable: 'Payment QR cannot be verified. Do not send money. Contact Admin.', payExactly: 'Send exactly {{amount}} USDT', warning: 'Confirm the recipient in Binance before sending money.' },
  km: { receiver: 'អ្នកទទួលដែលបានផ្ទៀងផ្ទាត់', uid: 'Binance UID', loading: 'កំពុងផ្ទៀងផ្ទាត់ QR...', unavailable: 'មិនអាចផ្ទៀងផ្ទាត់ QR បានទេ។ កុំទាន់ផ្ញើប្រាក់។ សូមទាក់ទង Admin។', payExactly: 'សូមបង់ឱ្យត្រឹមត្រូវ {{amount}} USDT', warning: 'សូមផ្ទៀងផ្ទាត់អ្នកទទួលក្នុង Binance មុនផ្ញើប្រាក់។' },
  zh: { receiver: '已验证收款人', uid: 'Binance UID', loading: '正在验证收款二维码...', unavailable: '无法验证二维码，请勿转账，并联系管理员。', payExactly: '请准确支付 {{amount}} USDT', warning: '转账前请在 Binance 中核对收款人。' },
  ja: { receiver: '確認済みの受取人', uid: 'Binance UID', loading: 'QR を検証しています...', unavailable: 'QR を確認できません。送金せず、管理者にお問い合わせください。', payExactly: '{{amount}} USDT を正確に送金', warning: '送金前に Binance 内で受取人を確認してください。' },
  ko: { receiver: '확인된 수취인', uid: 'Binance UID', loading: '결제 QR 확인 중...', unavailable: 'QR을 확인할 수 없습니다. 송금하지 말고 관리자에게 문의하세요.', payExactly: '{{amount}} USDT를 정확히 송금', warning: '송금하기 전 Binance 앱에서 수취인을 확인하세요.' },
})

export default function BinanceReceiverCard({ order }) {
  const { t } = useDisplayTranslation()
  const [imageUrl, setImageUrl] = useState('')
  const [failed, setFailed] = useState(false)
  const authorized = Boolean(order?.id && order?.checkout_ready === true && order?.qr_path === '/api/purchase/binance/receiver/qr' && /^\d{5,20}$/.test(String(order?.receiver?.uid || '')) && String(order?.receiver?.name || '').trim().length > 1)

  useEffect(() => {
    if (!authorized) {
      setImageUrl('')
      setFailed(false)
      return undefined
    }
    let cancelled = false
    let localUrl = ''
    setImageUrl('')
    setFailed(false)
    const controller = new AbortController()
    async function loadVerifiedQr() {
      try {
        const response = await fetch(getVerifiedBinanceQrUrl(), {
          method: 'GET', cache: 'no-store', credentials: 'omit', signal: controller.signal,
        })
        if (!response.ok || !String(response.headers.get('content-type') || '').toLowerCase().startsWith('image/webp')) throw new Error('Invalid QR response')
        const blob = await response.blob()
        if (blob.size < 16 || blob.size > 512 * 1024) throw new Error('Invalid QR size')
        if (cancelled) return
        localUrl = URL.createObjectURL(blob)
        setImageUrl(localUrl)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }
    loadVerifiedQr()
    return () => {
      cancelled = true
      controller.abort()
      if (localUrl) URL.revokeObjectURL(localUrl)
    }
  }, [authorized, order?.id, order?.receiver?.uid, order?.receiver?.name])

  if (!authorized) return null

  return (
    <div className="app-card rounded-[20px] border border-[var(--shadow-border)] p-4 text-center">
      <img src="/assets/Icons/Picture/Binance%20Logo.svg" alt="Binance Pay" className="mx-auto h-14 w-14 rounded-xl bg-black object-contain p-1" />
      <p className="app-title mt-3 text-[15px] font-extrabold">{t('binanceReceiverCard.receiver')}</p>
      <p className="app-title mt-1 break-words text-[18px] font-black">{order.receiver.name}</p>
      <p className="app-muted mt-1 text-[13px]">{t('binanceReceiverCard.uid')}: <span className="font-bold">{order.receiver.uid}</span></p>
      {failed ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-[13px] font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300">{t('binanceReceiverCard.unavailable')}</p> : null}
      {!failed && !imageUrl ? <p className="app-muted mt-5 text-[12px]">{t('binanceReceiverCard.loading')}</p> : null}
      {!failed && imageUrl ? <img src={imageUrl} alt="Verified Binance payment QR" onError={() => { setFailed(true); setImageUrl('') }} className="mx-auto mt-4 aspect-square max-h-[320px] w-full max-w-[320px] rounded-lg bg-white p-2 object-contain" /> : null}
      {!failed && imageUrl ? <p className="mt-3 text-[17px] font-black text-amber-600 dark:text-amber-300">{t('binanceReceiverCard.payExactly', { amount: order.amount_usdt })}</p> : null}
      <p className="app-muted mt-3 text-[12px] leading-5">{t('binanceReceiverCard.warning')}</p>
    </div>
  )
}
