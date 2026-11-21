import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Pencil, RefreshCw } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { authorPreOrderText, campaignStatus } from '../../utils/authorPreOrderRules'
import { fetchAuthorPreOrder, verifyAuthorPreOrderAccess } from '../../services/authorPreOrder.service'
import AuthorPreOrderRecordBookList from '../../components/author/preorder/AuthorPreOrderRecordBookList'
import AuthorPreOrderRecordDelivery from '../../components/author/preorder/AuthorPreOrderRecordDelivery'
import AuthorPreOrderRecordPaidSummary from '../../components/author/preorder/AuthorPreOrderRecordPaidSummary'

const COPY = {
  en: { title: 'Pre-order Record', overview: 'Story Overview', start: 'Opens', end: 'Closes', ship: 'Expected shipping', authorNote: 'Author note', deliveryNote: 'Delivery note', storyRecord: 'One master record for this story', editDraft: 'Edit draft', retry: 'Retry', loading: 'Loading record...', error: 'Could not load this record.', noDate: 'Not set', signature: 'Signed copies available' },
  km: { title: 'ព័ត៌មានរឿងបើកកក់', overview: 'ព័ត៌មានរឿង', start: 'បើកកក់', end: 'បិទកក់', ship: 'រំពឹងដឹកចេញ', authorNote: 'សម្គាល់អ្នកនិពន្ធ', deliveryNote: 'សម្គាល់ដឹកជញ្ជូន', storyRecord: 'Master Record មួយសម្រាប់រឿងនេះ', editDraft: 'កែ Draft', retry: 'សាកម្ដងទៀត', loading: 'កំពុងផ្ទុកព័ត៌មាន...', error: 'មិនអាចផ្ទុក Record នេះ។', noDate: 'មិនទាន់កំណត់', signature: 'មានជម្រើសហត្ថលេខា' },
  zh: { title: '预订记录', overview: '作品概览', start: '开始', end: '结束', ship: '预计发货', authorNote: '作者备注', deliveryNote: '配送备注', storyRecord: '本作品的独立主记录', editDraft: '编辑草稿', retry: '重试', loading: '加载记录中...', error: '记录加载失败。', noDate: '未设置', signature: '提供签名本' },
  ja: { title: '予約記録', overview: '作品概要', start: '開始', end: '終了', ship: '発送予定', authorNote: '作者のメモ', deliveryNote: '配送メモ', storyRecord: 'この作品の独立したマスター記録', editDraft: '下書きを編集', retry: '再試行', loading: '読み込み中...', error: '記録を読み込めません。', noDate: '未設定', signature: 'サイン本に対応' },
  ko: { title: '예약 기록', overview: '작품 개요', start: '시작', end: '종료', ship: '예상 배송일', authorNote: '작가 메모', deliveryNote: '배송 안내', storyRecord: '이 작품의 개별 마스터 기록', editDraft: '초안 편집', retry: '다시 시도', loading: '기록 불러오는 중...', error: '기록을 불러올 수 없습니다.', noDate: '미설정', signature: '사인본 제공' },
}

function formatDate(value, language) {
  const parsed = Date.parse(String(value || ''))
  if (!Number.isFinite(parsed)) return ''
  const locale = { en: 'en-GB', km: 'km-KH', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }[language] || 'en-GB'
  return new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Phnom_Penh', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(parsed))
}

function RecordDate({ label, value, language, noDate }) {
  return <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] py-3 last:border-0"><span className="text-[11px] text-[#777]">{label}</span><span className="text-right text-[12px] font-semibold text-[#333]">{formatDate(value, language) || noDate}</span></div>
}

export default function AuthorPreOrderRecordPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { language } = useDisplayTranslation()
  const t = COPY[language] || COPY.en
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setCampaign(null)
    verifyAuthorPreOrderAccess()
      .then(() => fetchAuthorPreOrder(campaignId, { signal: controller.signal }))
      .then(data => { if (!controller.signal.aborted) setCampaign(data) })
      .catch(cause => { if (!controller.signal.aborted) setError(cause.message || t.error) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [campaignId, reload])

  const status = campaignStatus(campaign)
  const image = campaign?.banner_url || campaign?.books?.[0]?.cover_url || ''
  const orderPath = `/author/page/pre-order/orders?campaign_id=${encodeURIComponent(campaignId || '')}`

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(28px+env(safe-area-inset-bottom))] text-[#1c1c1c]">
      <div className="mx-auto max-w-[720px] px-4 pt-3 sm:px-6">
        <header className="flex min-h-12 items-center gap-3">
          <button type="button" onClick={() => navigate('/author/page/pre-order')} aria-label={authorPreOrderText(language, 'back')} className="flex h-10 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#f5f5f5]"><ArrowLeft size={21} /></button>
          <h1 className="min-w-0 flex-1 truncate text-[19px] font-bold">{t.title}</h1>
          {campaign && status === 'draft' ? <button type="button" onClick={() => navigate(`/author/page/pre-order/${encodeURIComponent(campaign.id)}/edit`)} className="flex items-center gap-1.5 rounded-[10px] border border-[#e0e0e0] px-3 py-2 text-[12px] font-semibold"><Pencil size={14} />{t.editDraft}</button> : null}
        </header>
        {loading ? <p role="status" className="py-20 text-center text-[13px] text-[#777]">{t.loading}</p> : error ? (
          <div className="mx-auto mt-20 max-w-[360px] text-center"><p role="alert" className="break-words text-[13px] text-[#777]">{error}</p><button type="button" onClick={() => setReload(count => count + 1)} className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-[#dedede] px-4 py-2 text-[12px] font-semibold"><RefreshCw size={14} />{t.retry}</button></div>
        ) : campaign ? (
          <div className="mt-3 space-y-4">
            <section className="overflow-hidden rounded-[17px] border border-[#e7e7e7] bg-white">
              {image ? <div className="flex max-h-[320px] min-h-[140px] items-center justify-center bg-[#f7f7f7] p-3"><img src={image} alt="" className="max-h-[290px] max-w-full object-contain" /></div> : null}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium text-[#888]">{t.storyRecord}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${status === 'active' ? 'bg-[#ffedac] text-[#3d310f]' : 'bg-[#f3f3f3] text-[#666]'}`}>{authorPreOrderText(language, status)}</span>
                </div>
                <h2 className="mt-2 break-words text-[19px] font-bold leading-7">{campaign.title || '—'}</h2>
                {campaign.genre ? <p className="mt-1 text-[11px] text-[#777]">{campaign.genre}</p> : null}
                {campaign.description ? <p className="mt-3 whitespace-pre-wrap break-words text-[12px] leading-6 text-[#555]">{campaign.description}</p> : null}
                {campaign.signature_enabled === true ? <p className="mt-3 text-[11px] font-medium text-[#555]">{t.signature}</p> : null}
              </div>
            </section>
            <AuthorPreOrderRecordPaidSummary campaignId={campaign.id} language={language} onOpenOrders={() => navigate(orderPath)} />
            <section className="rounded-[17px] border border-[#e7e7e7] bg-white p-4">
              <h2 className="flex items-center gap-2 text-[15px] font-bold"><CalendarDays size={17} className="text-[#666]" />{t.overview}</h2>
              <div className="mt-2"><RecordDate label={t.start} value={campaign.open_at} language={language} noDate={t.noDate} /><RecordDate label={t.end} value={campaign.close_at} language={language} noDate={t.noDate} /><RecordDate label={t.ship} value={campaign.expected_ship_at} language={language} noDate={t.noDate} /></div>
            </section>
            <AuthorPreOrderRecordBookList books={campaign.books} language={language} />
            <AuthorPreOrderRecordDelivery selectedKeys={campaign.delivery_company_keys} language={language} />
            {campaign.author_note ? <section className="rounded-[17px] border border-[#e7e7e7] p-4"><h2 className="text-[14px] font-bold">{t.authorNote}</h2><p className="mt-2 whitespace-pre-wrap break-words text-[12px] leading-6 text-[#666]">{campaign.author_note}</p></section> : null}
            {campaign.delivery_note ? <section className="rounded-[17px] border border-[#e7e7e7] p-4"><h2 className="text-[14px] font-bold">{t.deliveryNote}</h2><p className="mt-2 whitespace-pre-wrap break-words text-[12px] leading-6 text-[#666]">{campaign.delivery_note}</p></section> : null}
          </div>
        ) : null}
      </div>
    </main>
  )
}
