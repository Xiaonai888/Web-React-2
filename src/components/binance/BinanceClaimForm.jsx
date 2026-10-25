import { useState } from 'react'
import { submitReaderBinanceTransaction } from '../../services/binanceCheckoutApi'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('binanceClaimForm', {
  en: { title: 'Report a Binance payment', helper: 'After sending USDT, enter the transaction ID from Binance. This is not payment confirmation.', placeholder: 'Binance Transaction ID', submit: 'Submit for review', submitting: 'Submitting...', submitted: 'Report received. Waiting for Admin verification.', invalid: 'Enter a valid transaction ID (6–128 letters, digits, _ or -).', error: 'Unable to submit payment report.' },
  km: { title: 'រាយការណ៍ការទូទាត់ Binance', helper: 'បន្ទាប់ពីផ្ញើ USDT សូមបញ្ចូល Transaction ID ពី Binance។ នេះមិនមែនជាការបញ្ជាក់ថាបង់ប្រាក់ជោគជ័យទេ។', placeholder: 'Binance Transaction ID', submit: 'បញ្ជូនឱ្យ Admin ពិនិត្យ', submitting: 'កំពុងបញ្ជូន...', submitted: 'បានទទួលរបាយការណ៍។ រង់ចាំ Admin ផ្ទៀងផ្ទាត់។', invalid: 'Transaction ID ត្រូវមាន ៦–១២៨ តួអក្សរ (អង់គ្លេស លេខ _ ឬ -)។', error: 'មិនអាចបញ្ជូនរបាយការណ៍បានទេ។' },
  zh: { title: '申报 Binance 付款', helper: '转账 USDT 后，请输入 Binance 交易编号。这不代表付款已确认。', placeholder: 'Binance 交易编号', submit: '提交审核', submitting: '正在提交...', submitted: '已收到报告，等待管理员核实。', invalid: '请输入有效的交易编号（6–128 位）。', error: '无法提交付款报告。' },
  ja: { title: 'Binance の支払いを報告', helper: 'USDT の送金後、Binance の取引 ID を入力してください。支払い完了の証明にはなりません。', placeholder: 'Binance 取引 ID', submit: '審査に送信', submitting: '送信中...', submitted: '報告を受け付けました。管理者の確認をお待ちください。', invalid: '有効な取引 ID（6〜128文字）を入力してください。', error: '報告を送信できませんでした。' },
  ko: { title: 'Binance 결제 신고', helper: 'USDT 송금 후 Binance 거래 ID를 입력하세요. 결제 확인을 의미하지 않습니다.', placeholder: 'Binance 거래 ID', submit: '검토 요청', submitting: '제출 중...', submitted: '신고가 접수되었습니다. 관리자 확인을 기다리세요.', invalid: '올바른 거래 ID(6~128자)를 입력하세요.', error: '결제 신고를 제출할 수 없습니다.' },
})

export default function BinanceClaimForm({ orderId, disabled = false, onSubmitted }) {
  const { t } = useDisplayTranslation()
  const [transactionId, setTransactionId] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (busy || disabled) return
    const id = transactionId.trim()
    if (!/^[A-Za-z0-9_-]{6,128}$/.test(id)) {
      setError(t('binanceClaimForm.invalid'))
      return
    }
    setError('')
    setMessage('')
    setBusy(true)
    try {
      const claim = await submitReaderBinanceTransaction(orderId, id)
      setMessage(t('binanceClaimForm.submitted'))
      if (onSubmitted) onSubmitted(claim)
    } catch (failure) {
      setError(failure?.message || t('binanceClaimForm.error'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="app-card rounded-[20px] border border-[var(--shadow-border)] p-4">
      <h3 className="app-title text-[15px] font-extrabold">{t('binanceClaimForm.title')}</h3>
      <p className="app-muted mt-2 text-[12px] leading-5">{t('binanceClaimForm.helper')}</p>
      <input value={transactionId} onChange={(event) => setTransactionId(event.target.value)} autoComplete="off" maxLength={128} placeholder={t('binanceClaimForm.placeholder')} disabled={busy || disabled || Boolean(message)} className="app-input mt-3 h-12 w-full rounded-xl border border-[var(--shadow-border)] px-3 text-[14px] disabled:opacity-50" />
      {error ? <p role="alert" className="mt-2 text-[12px] font-semibold text-red-600 dark:text-red-300">{error}</p> : null}
      {message ? <p role="status" className="mt-2 text-[12px] font-semibold text-amber-700 dark:text-amber-300">{message}</p> : null}
      <button type="submit" disabled={busy || disabled || Boolean(message)} className="mt-3 h-12 w-full rounded-xl bg-[#F3BA2F] text-[14px] font-extrabold text-black disabled:opacity-50">{busy ? t('binanceClaimForm.submitting') : t('binanceClaimForm.submit')}</button>
    </form>
  )
}
