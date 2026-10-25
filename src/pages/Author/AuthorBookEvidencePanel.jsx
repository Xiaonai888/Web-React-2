import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorBookEvidence', {
  en: { title: 'Shipping proof for Admin review', company: 'Delivery company', tracking: 'Tracking number', proof: 'HTTPS link to delivery photo or receipt', note: 'Only submit after shipping the book. Admin will review your evidence. Reader confirmation is paused during review.', submit: 'Submit proof', saving: 'Saving...', saved: 'Delivery proof submitted', failed: 'Could not save proof' },
  km: { title: 'ភស្តុតាងដឹកជញ្ជូនសម្រាប់ Admin ពិនិត្យ', company: 'ក្រុមហ៊ុនដឹកជញ្ជូន', tracking: 'លេខតាមដានទំនិញ', proof: 'តំណ HTTPS ទៅរូបភស្តុតាង ឬវិក្កយបត្រដឹកជញ្ជូន', note: 'សូមផ្ញើក្រោយពេលដឹកសៀវភៅចេញរួច។ Admin នឹងពិនិត្យភស្តុតាង ហើយការបញ្ជាក់របស់អ្នកអាននឹងផ្អាកពេលកំពុង Review។', submit: 'ផ្ញើភស្តុតាង', saving: 'កំពុងរក្សាទុក...', saved: 'បានផ្ញើភស្តុតាងរួច', failed: 'មិនអាចរក្សាទុកភស្តុតាងបានទេ' },
  zh: { title: '提交配送凭证供管理员审核', company: '快递公司', tracking: '运单号', proof: '配送照片或收据的 HTTPS 链接', note: '仅在发货后提交。管理员将审核，审核期间暂停买家确认收货。', submit: '提交凭证', saving: '保存中...', saved: '已提交配送凭证', failed: '保存失败' },
  ja: { title: '管理者審査用の配送証明', company: '配送会社', tracking: '追跡番号', proof: '配達写真または受領書の HTTPS URL', note: '発送後のみ提出してください。審査中は読者の受取確認が一時停止されます。', submit: '証明を提出', saving: '保存中...', saved: '配送証明を提出しました', failed: '保存できませんでした' },
  ko: { title: '관리자 심사용 배송 증빙', company: '배송 업체', tracking: '송장 번호', proof: '배송 사진 또는 영수증의 HTTPS 링크', note: '도서 발송 후 제출하세요. 검토 중에는 구매자의 수령 확인이 일시 중단됩니다.', submit: '증빙 제출', saving: '저장 중...', saved: '배송 증빙이 제출되었습니다', failed: '증빙 저장 실패' },
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
      <input required minLength={2} maxLength={120} value={company} onChange={(event) => setCompany(event.target.value)} placeholder={tr('company')} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] p-3 text-sm" />
      <input required minLength={4} maxLength={120} value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder={tr('tracking')} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] p-3 text-sm" />
      <input required type="url" pattern="https://.*" maxLength={1024} value={proof} onChange={(event) => setProof(event.target.value)} placeholder={tr('proof')} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] p-3 text-sm" />
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      {success && <p role="status" className="text-xs text-green-600">{tr('saved')}</p>}
      <button type="submit" disabled={busy || success} className="w-full rounded-xl bg-violet-600 p-3 text-sm font-bold text-white disabled:opacity-50">{busy ? tr('saving') : tr('submit')}</button>
    </form>
  )
}
