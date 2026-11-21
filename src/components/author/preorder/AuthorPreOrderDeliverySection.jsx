import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, Truck } from 'lucide-react'
import { useDisplayTranslation } from '../../../utils/displayLanguage'
import { fetchAuthorPreOrderDeliveryCompanies, findUnavailablePreOrderDeliveryKeys } from '../../../services/authorPreOrderDelivery.service'

const COPY = {
  en: { title: 'Delivery Companies', hint: 'Uses your current Author Store delivery settings.', loading: 'Loading companies...', retry: 'Refresh', unavailable: 'These selected companies are no longer active:', empty: 'Select at least one delivery company.', error: 'Could not load delivery companies.', fee: 'Delivery fee' },
  km: { title: 'ក្រុមហ៊ុនដឹកជញ្ជូន', hint: 'ប្រើការកំណត់ពី Author Store បច្ចុប្បន្ន។', loading: 'កំពុងផ្ទុកក្រុមហ៊ុន...', retry: 'ផ្ទុកឡើងវិញ', unavailable: 'ក្រុមហ៊ុនដែលបានជ្រើសទាំងនេះមិនសកម្មទៀតទេ៖', empty: 'សូមជ្រើសក្រុមហ៊ុនយ៉ាងតិចមួយ។', error: 'មិនអាចផ្ទុកក្រុមហ៊ុនដឹកជញ្ជូនបាន។', fee: 'ថ្លៃដឹកជញ្ជូន' },
  zh: { title: '配送公司', hint: '使用当前作者商店的配送设置。', loading: '正在加载配送公司...', retry: '刷新', unavailable: '以下已选配送公司不再可用：', empty: '请至少选择一家配送公司。', error: '无法加载配送公司。', fee: '配送费' },
  ja: { title: '配送会社', hint: '現在の作者ストアの配送設定を使用します。', loading: '配送会社を読み込み中...', retry: '更新', unavailable: '選択済みの会社は現在利用できません：', empty: '少なくとも1社を選んでください。', error: '配送会社を読み込めません。', fee: '送料' },
  ko: { title: '배송 업체', hint: '현재 작가 스토어의 배송 설정을 사용합니다.', loading: '배송 업체 불러오는 중...', retry: '새로고침', unavailable: '선택한 업체가 더 이상 활성화되지 않았습니다:', empty: '배송 업체를 하나 이상 선택하세요.', error: '배송 업체를 불러올 수 없습니다.', fee: '배송비' },
}

export default function AuthorPreOrderDeliverySection({ selectedKeys = [], onChange, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = COPY[language] || COPY.en
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetchAuthorPreOrderDeliveryCompanies({ signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setCompanies(data) })
      .catch(cause => { if (!controller.signal.aborted) { setCompanies([]); setError(cause.message || t.error) } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload])

  const toggle = useCallback((key, checked) => {
    if (!onChange || disabled || loading || error) return
    const current = Array.isArray(selectedKeys) ? selectedKeys : []
    const next = checked ? [...new Set([...current, key])] : current.filter(item => item !== key)
    onChange(next)
  }, [onChange, selectedKeys, disabled, loading, error])

  const missing = !loading && !error ? findUnavailablePreOrderDeliveryKeys(selectedKeys, companies) : []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-[#222]"><Truck size={17} />{t.title}</p>
          <p className="mt-1 text-[11px] leading-5 text-[#777]">{t.hint}</p>
        </div>
        <button type="button" onClick={() => setReload(x => x + 1)} disabled={disabled || loading} aria-label={t.retry} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] text-[#555] disabled:opacity-50"><RefreshCw size={16} /></button>
      </div>
      {loading ? <p role="status" className="py-3 text-[12px] text-[#777]">{t.loading}</p> : error ? <p role="alert" className="rounded-xl bg-[#f7f7f7] p-3 text-[12px] text-[#777]">{error}</p> : (
        <>
          <div className="space-y-2">
            {companies.map(company => (
              <label key={company.company_key} className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[#e6e6e6] px-3 py-3">
                <input type="checkbox" disabled={disabled} checked={selectedKeys.includes(company.company_key)} onChange={event => toggle(company.company_key, event.target.checked)} className="h-4 w-4 shrink-0 accent-[#e2ae00]" />
                {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 shrink-0 rounded-lg object-contain" /> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5]"><Truck size={18} className="text-[#888]" /></span>}
                <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-[#252525]">{company.company_name}</span><span className="text-[11px] text-[#777]">{t.fee}</span></span>
                <span className="text-[12px] font-semibold text-[#333]">${company.fee_usd.toFixed(2)}</span>
              </label>
            ))}
          </div>
          {missing.length > 0 ? <p role="alert" className="rounded-xl border border-[#e1d0c9] bg-[#faf8f7] px-3 py-2 text-[12px] text-[#725442]">{t.unavailable} {missing.join(', ')}</p> : null}
          {!selectedKeys.length ? <p className="text-[11px] text-[#777]">{t.empty}</p> : null}
        </>
      )}
    </div>
  )
}
