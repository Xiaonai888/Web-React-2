import { useEffect, useState } from 'react'
import { RefreshCw, Truck } from 'lucide-react'
import { fetchAuthorPreOrderDeliveryCompanies, findUnavailablePreOrderDeliveryKeys } from '../../../services/authorPreOrderDelivery.service'

const COPY = {
  en: { title: 'Delivery Companies', hint: 'Current companies and fees from Author Store settings.', loading: 'Loading delivery settings...', retry: 'Retry', unavailable: 'Unavailable or inactive:', empty: 'No delivery companies selected.', fee: 'Current fee', error: 'Could not load delivery settings.' },
  km: { title: 'ក្រុមហ៊ុនដឹកជញ្ជូន', hint: 'បង្ហាញក្រុមហ៊ុន និងតម្លៃបច្ចុប្បន្នពី Author Store។', loading: 'កំពុងផ្ទុក...', retry: 'សាកម្ដងទៀត', unavailable: 'មិនមាន ឬមិនសកម្ម៖', empty: 'មិនទាន់ជ្រើសក្រុមហ៊ុនដឹកជញ្ជូន។', fee: 'តម្លៃបច្ចុប្បន្ន', error: 'មិនអាចផ្ទុកក្រុមហ៊ុនដឹកជញ្ជូន។' },
  zh: { title: '配送公司', hint: '来自作者商店设置的最新公司及运费。', loading: '正在加载...', retry: '重试', unavailable: '已停用或不可用：', empty: '未选择配送公司。', fee: '当前运费', error: '配送设置加载失败。' },
  ja: { title: '配送会社', hint: '作者ストア設定の現在の配送会社と送料。', loading: '読み込み中...', retry: '再試行', unavailable: '無効または利用不可：', empty: '配送会社が選択されていません。', fee: '現在の送料', error: '配送設定を読み込めません。' },
  ko: { title: '배송 업체', hint: '작가 스토어 설정의 현재 업체와 배송비입니다.', loading: '불러오는 중...', retry: '다시 시도', unavailable: '비활성 또는 사용할 수 없음:', empty: '선택한 배송 업체가 없습니다.', fee: '현재 배송비', error: '배송 설정을 불러오지 못했습니다.' },
}

export default function AuthorPreOrderRecordDelivery({ selectedKeys = [], language = 'en' }) {
  const t = COPY[language] || COPY.en
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const selection = Array.isArray(selectedKeys) ? selectedKeys : []

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetchAuthorPreOrderDeliveryCompanies({ signal: controller.signal })
      .then(rows => { if (!controller.signal.aborted) setCompanies(rows) })
      .catch(cause => { if (!controller.signal.aborted) setError(cause.message || t.error) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload])

  const chosen = companies.filter(company => selection.includes(company.company_key))
  const unavailable = !loading && !error ? findUnavailablePreOrderDeliveryKeys(selection, companies) : []

  return (
    <section className="rounded-[17px] border border-[#e7e7e7] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#1c1c1c]"><Truck size={18} className="text-[#666]" />{t.title}</h2>
          <p className="mt-1 text-[11px] leading-5 text-[#777]">{t.hint}</p>
        </div>
        <button type="button" aria-label={t.retry} onClick={() => setReload(value => value + 1)} disabled={loading} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] text-[#666] disabled:opacity-40"><RefreshCw size={16} /></button>
      </div>
      {loading ? <p role="status" className="mt-4 text-[12px] text-[#777]">{t.loading}</p> : error ? <p role="alert" className="mt-4 break-words text-[12px] text-[#9e4339]">{error}</p> : (
        <div className="mt-4 space-y-2">
          {chosen.map(company => (
            <div key={company.company_key} className="flex items-center gap-3 rounded-[11px] bg-[#f8f8f8] px-3 py-3">
              {company.logo_url ? <img src={company.logo_url} alt="" loading="lazy" className="h-9 w-9 shrink-0 rounded-md object-contain" /> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#ececec]"><Truck size={17} className="text-[#777]" /></span>}
              <span className="min-w-0 flex-1 break-words text-[12px] font-semibold text-[#303030]">{company.company_name}</span>
              <span className="text-right"><span className="block text-[10px] text-[#888]">{t.fee}</span><span className="block text-[12px] font-bold">${Number(company.fee_usd).toFixed(2)}</span></span>
            </div>
          ))}
          {!selection.length ? <p className="text-[12px] text-[#777]">{t.empty}</p> : null}
          {unavailable.length ? <p role="alert" className="rounded-lg bg-[#f7f7f7] p-2.5 text-[11px] text-[#805444]">{t.unavailable} {unavailable.join(', ')}</p> : null}
        </div>
      )}
    </section>
  )
}
