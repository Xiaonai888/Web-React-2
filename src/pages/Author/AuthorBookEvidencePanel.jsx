import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorBookEvidence', {
  en: { title: 'Mark as Shipped · Shipping Details', company: 'Delivery company (required)', tracking: 'Tracking number (optional)', proof: 'HTTPS link to shipping photo or receipt (required)', note: 'Submit only after shipping the book. Payment stays on hold until the reader confirms receipt or the owner approves after review.', submit: 'Submit shipping proof', saving: 'Saving...', saved: 'Shipping proof submitted', failed: 'Could not save shipping proof' },
  km: { title: 'បញ្ជាក់ការផ្ញើសៀវភៅ · ព័ត៌មានដឹកជញ្ជូន', company: 'ក្រុមហ៊ុនដឹកជញ្ជូន (ចាំបាច់)', tracking: 'លេខតាមដានទំនិញ (មិនចាំបាច់)', proof: 'តំណ HTTPS រូបថត ឬវិក្កយបត្រផ្ញើសៀវភៅ (ចាំបាច់)', note: 'សូមបញ្ជូនភស្តុតាងក្រោយផ្ញើសៀវភៅរួចប៉ុណ្ណោះ។ ប្រាក់នៅតែបង្កករហូតដល់អ្នកអានបញ្ជាក់ទទួល ឬ Owner អនុម័តក្រោយពិនិត្យ។', submit: 'បញ្ជូនភស្តុតាង', saving: 'កំពុងរក្សាទុក...', saved: 'បានបញ្ជូនភស្តុតាងរួច', failed: 'មិនអាចរក្សាទុកភស្តុតាងបានទេ' },
  zh: { title: '标记已发货 · 物流信息', company: '物流公司（必填）', tracking: '运单号（选填）', proof: '发货照片或收据的 HTTPS 链接（必填）', note: '请仅在实际发货后提交凭证。款项将继续保留，直到读者确认收货或所有者审核后批准。', submit: '提交发货凭证', saving: '保存中...', saved: '已提交发货凭证', failed: '无法保存发货凭证' },
  ja: { title: '発送済みにする · 配送情報', company: '配送会社（必須）', tracking: '追跡番号（任意）', proof: '発送写真または領収書の HTTPS URL（必須）', note: '書籍を発送した後に証明を提出してください。読者の受取確認または所有者の審査承認まで支払いは保留されます。', submit: '発送証明を提出', saving: '保存中...', saved: '発送証明を提出しました', failed: '発送証明を保存できませんでした' },
  ko: { title: '배송 완료 표시 · 배송 정보', company: '배송 업체(필수)', tracking: '송장 번호(선택)', proof: '배송 사진 또는 영수증의 HTTPS 링크(필수)', note: '도서를 발송한 후에만 증빙을 제출하세요. 독자가 수령을 확인하거나 소유자가 검토 후 승인할 때까지 대금은 보류됩니다.', submit: '배송 증빙 제출', saving: '저장 중...', saved: '배송 증빙을 제출했습니다', failed: '배송 증빙을 저장하지 못했습니다' },
})

const API = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'

export default function AuthorBookEvidencePanel({ order, onSaved }) {
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`authorBookEvidence.${key}`)
  const [company, setCompany] = useState(String(order?.deliveryCompany || ''))
  const [tracking, setTracking] = useState(String(order?.trackingNumber || ''))
  const [proof, setProof] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function send(event) {
    event.preventDefault()
    if (busy || !order?.id) return
    setBusy(true)
    setError('')
    try {
      const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
      const response = await fetch(`${API}/api/author-store/me/book-pending/${encodeURIComponent(order.id)}/evidence`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_company: company.trim(), tracking_number: tracking.trim(), proof_url: proof.trim() }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true) throw new Error(data.message || tr('failed'))
      setSuccess(true)
      onSaved?.()
    } catch (caught) {
      setError(caught.message || tr('failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={(event) => void send(event)} className="mt-4 space-y-3 border-t border-[var(--shadow-border)] pt-4">
      <h3 className="text-sm font-bold">{tr('title')}</h3>
      <p className="text-xs leading-5 text-[var(--shadow-text-secondary)]">{tr('note')}</p>
      <input required minLength={2} maxLength={120} value={company} onChange={(event) => setCompany(event.target.value)} placeholder={tr('company')} aria-label={tr('company')} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] p-3 text-sm" />
      <input minLength={4} maxLength={120} value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder={tr('tracking')} aria-label={tr('tracking')} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] p-3 text-sm" />
      <input required type="url" pattern="https://.*" maxLength={1024} value={proof} onChange={(event) => setProof(event.target.value)} placeholder={tr('proof')} aria-label={tr('proof')} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] p-3 text-sm" />
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      {success && <p role="status" className="text-xs text-green-600">{tr('saved')}</p>}
      <button type="submit" disabled={busy || success} className="w-full rounded-xl bg-violet-600 p-3 text-sm font-bold text-white disabled:opacity-50">{busy ? tr('saving') : tr('submit')}</button>
    </form>
  )
}
