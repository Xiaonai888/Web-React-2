import { useEffect, useMemo, useState } from 'react'
import { BarChart3, CircleDollarSign, Gem, Megaphone, RefreshCw } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { listAuthorAdCampaigns } from '../../services/authorAdsApi'

registerTranslationNamespace('authorAdsOwnInsights', {
  en: {
    heading: 'Campaign Insights', refresh: 'Refresh', loading: 'Loading verified campaign data...',
    error: 'Campaign insights could not be loaded.', retry: 'Try again',
    total: 'Server campaigns', active: 'Active (shown)', planned: 'Planned budget', spent: 'Diamonds spent',
    legacy: 'Legacy USD spent', review: 'Pending review', approved: 'Approved',
    status: 'Campaign status', latest: 'Recent campaigns', empty: 'No campaigns to summarize yet.',
    unknown: 'Unknown', noData: 'Not available yet', reach: 'Reach', clicks: 'Clicks',
    tracking: 'Author Ads does not yet expose verified reach and click data. No estimates are counted as actual results.',
    limited: 'Showing only the newest {{shown}} of {{total}} campaigns. Status and money totals below are for these {{shown}} campaigns, not all campaigns.',
    complete: 'Status and money totals include all {{total}} campaigns.',
    budgetNote: 'Planned budget is shown in Diamonds-equivalent (100 Diamonds = $1), including unpaid drafts. It is not spending.',
    costNote: 'Spent Diamonds are confirmed campaign-spend counters. Legacy USD spending is shown separately and is not converted or added to Diamonds.',
    scope: 'Device-only drafts are not included in these server statistics.', noSpent: 'No confirmed spend yet', last: 'Most recent',
    currency: 'Diamonds', spentOf: 'Spent', plannedOf: 'Budget',
  },
  km: {
    heading: 'ស្ថិតិ Campaign', refresh: 'ធ្វើបច្ចុប្បន្នភាព', loading: 'កំពុងផ្ទុកទិន្នន័យ Campaign...',
    error: 'មិនអាចផ្ទុកស្ថិតិ Campaign បានទេ។', retry: 'សាកម្តងទៀត',
    total: 'Campaign លើ Server', active: 'កំពុងផ្សាយ (ក្នុងបញ្ជី)', planned: 'ថវិកាដែលបានគ្រោង', spent: 'ពេជ្របានចំណាយ',
    legacy: 'USD ចំណាយចាស់', review: 'កំពុងរង់ចាំត្រួតពិនិត្យ', approved: 'បានអនុម័ត',
    status: 'ស្ថានភាព Campaign', latest: 'Campaign ថ្មីៗ', empty: 'មិនទាន់មាន Campaign សម្រាប់សង្ខេបទេ។',
    unknown: 'មិនស្គាល់', noData: 'មិនទាន់មានទិន្នន័យ', reach: 'Reach', clicks: 'Clicks',
    tracking: 'Author Ads មិនទាន់មានទិន្នន័យ Reach និង Clicks ដែលបានផ្ទៀងផ្ទាត់ទេ។ មិនយកលេខប៉ាន់ស្មានធ្វើជាលទ្ធផលពិតឡើយ។',
    limited: 'បង្ហាញតែ {{shown}} Campaign ថ្មីបំផុត ក្នុងចំណោម {{total}}។ ស្ថិតិស្ថានភាព និងប្រាក់គណនាត្រឹម {{shown}} Campaign នេះប៉ុណ្ណោះ។',
    complete: 'ស្ថិតិស្ថានភាព និងប្រាក់គ្របដណ្តប់ Campaign ទាំង {{total}}។',
    budgetNote: 'ថវិកាគ្រោងគិតជាពេជ្រសមមូល (100 ពេជ្រ = $1) រួមទាំង Draft មិនទាន់បង់។ នេះមិនមែនការចំណាយពិតទេ។',
    costNote: 'ពេជ្រចំណាយប្រើតែទិន្នន័យចំណាយ Campaign។ ចំណាយ USD ចាស់បង្ហាញដាច់ដោយឡែក មិនបូកជាមួយពេជ្រ។',
    scope: 'Draft ដែលរក្សាទុកតែក្នុងឧបករណ៍ មិនរាប់បញ្ចូលក្នុងស្ថិតិ Server នេះទេ។', noSpent: 'មិនទាន់មានការចំណាយបានបញ្ជាក់', last: 'ថ្មីបំផុត',
    currency: 'ពេជ្រ', spentOf: 'ចំណាយ', plannedOf: 'ថវិកា',
  },
  zh: {
    heading: '广告活动分析', refresh: '刷新', loading: '正在加载活动数据...',
    error: '无法加载活动分析。', retry: '重试', total: '服务器活动总数', active: '进行中（已加载）',
    planned: '计划预算', spent: '已花费钻石', legacy: '旧版美元支出',
    review: '待审核', approved: '已批准', status: '活动状态', latest: '最近的活动',
    empty: '尚无可分析的活动。', unknown: '未知', noData: '暂不可用', reach: '覆盖', clicks: '点击',
    tracking: '作者广告尚无已核实的覆盖与点击数据；不将预测视为实际结果。',
    limited: '仅显示最近 {{shown}} / {{total}} 个活动。状态与金额统计仅涵盖已加载的活动。',
    complete: '状态与金额统计涵盖全部 {{total}} 个活动。',
    budgetNote: '计划预算以钻石等值显示（100钻石=$1），包括未付款草稿，并非实际支出。',
    costNote: '钻石支出基于活动支出记录。旧版美元支出单独列示，不与钻石合计。',
    scope: '仅保存在设备上的草稿不计入服务器统计。', noSpent: '尚无确认支出', last: '最近', currency: '钻石', spentOf: '支出', plannedOf: '预算',
  },
  ja: {
    heading: 'キャンペーン分析', refresh: '更新', loading: 'データを読み込み中...',
    error: '分析を読み込めません。', retry: '再試行', total: 'サーバーの総数',
    active: '配信中（表示範囲）', planned: '予定予算', spent: '使用済みダイヤ',
    legacy: '旧USD支出', review: '審査待ち', approved: '承認済み',
    status: 'ステータス', latest: '最近のキャンペーン', empty: '対象がありません。',
    unknown: '不明', noData: 'まだ利用できません', reach: 'リーチ', clicks: 'クリック',
    tracking: 'Author Adsのリーチとクリックの検証済みデータはまだありません。推定値を実績として表示しません。',
    limited: '最近の{{shown}}件 / 全{{total}}件を表示。状態・金額集計は表示件数のみです。',
    complete: '状態・金額集計は全{{total}}件を対象としています。',
    budgetNote: '予定予算はダイヤ換算（100ダイヤ=$1）。未払いの下書きを含み、実際の支出ではありません。',
    costNote: 'ダイヤ支出は記録された使用額です。旧USD支出は別に表示します。',
    scope: '端末だけに保存した下書きはサーバー集計に含まれません。', noSpent: '確定した支出なし', last: '最近', currency: 'ダイヤ', spentOf: '使用', plannedOf: '予算',
  },
  ko: {
    heading: '캠페인 인사이트', refresh: '새로고침', loading: '캠페인 데이터 로드 중...',
    error: '인사이트를 불러오지 못했습니다.', retry: '다시 시도',
    total: '서버 캠페인 수', active: '운영 중 (표시 범위)', planned: '계획 예산',
    spent: '사용한 다이아', legacy: '기존 USD 지출', review: '검토 대기',
    approved: '승인', status: '캠페인 상태', latest: '최근 캠페인',
    empty: '분석할 캠페인이 없습니다.', unknown: '알 수 없음', noData: '아직 제공되지 않음',
    reach: '도달', clicks: '클릭',
    tracking: 'Author Ads의 검증된 도달 및 클릭 데이터는 아직 없습니다. 추정치를 실적으로 표시하지 않습니다.',
    limited: '전체 {{total}}개 중 최근 {{shown}}개만 표시합니다. 상태 및 금액 합계는 표시된 건에만 적용됩니다.',
    complete: '상태 및 금액 합계는 전체 {{total}}개 캠페인입니다.',
    budgetNote: '계획 예산은 다이아 환산(100개=$1)이며 미결제 초안도 포함합니다. 실제 지출이 아닙니다.',
    costNote: '다이아 지출은 기록된 캠페인 사용액 기준입니다. 기존 USD 지출은 따로 표시합니다.',
    scope: '기기에만 저장된 초안은 서버 통계에 포함되지 않습니다.', noSpent: '확인된 지출 없음', last: '최근', currency: '다이아', spentOf: '사용', plannedOf: '예산',
  },
})

const STATUS = ['active', 'paused', 'scheduled', 'approved', 'pending_review', 'draft', 'completed', 'rejected', 'cancelled']
const LABELS = {
  active: 'Active', paused: 'Paused', scheduled: 'Scheduled', approved: 'Approved',
  pending_review: 'Pending Review', draft: 'Draft', completed: 'Completed',
  rejected: 'Rejected', cancelled: 'Cancelled',
}
const safeAmount = value => {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : 0
}
const fmt = value => safeAmount(value).toLocaleString(undefined, { maximumFractionDigits: 2 })

function Metric({ icon: Icon, label, value, suffix }) {
  return (
    <div className="rounded-2xl border border-[#eeebf8] bg-white p-4 dark:border-white/10 dark:bg-[#241d30]">
      <div className="mb-3 flex items-center gap-2 text-[#817990] dark:text-[#c7bfd4]">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="break-all text-[22px] font-bold tabular-nums">
        {value}{suffix && <span className="ml-1 text-[11px] font-normal text-[#817990]">{suffix}</span>}
      </p>
    </div>
  )
}

export default function AuthorAdsInsightsPanel() {
  const { t } = useDisplayTranslation()
  const tr = (key, values) => t(`authorAdsOwnInsights.${key}`, values)
  const [snapshot, setSnapshot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)
    listAuthorAdCampaigns({
      page: 1, limit: 50, signal: controller.signal, refresh: reload > 0,
    }).then(data => {
      if (!controller.signal.aborted) setSnapshot(data)
    }).catch(() => {
      if (!controller.signal.aborted) {
        setSnapshot(null)
        setError(true)
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [reload])

  const summary = useMemo(() => {
    const campaigns = snapshot?.campaigns || []
    const statuses = Object.fromEntries(STATUS.map(status => [status, 0]))
    let budget = 0
    let diamondsSpent = 0
    let legacySpent = 0
    for (const item of campaigns) {
      if (Object.prototype.hasOwnProperty.call(statuses, item.status)) statuses[item.status] += 1
      budget += safeAmount(item.budgetDiamonds ?? (safeAmount(item.budgetUsd) * 100))
      if (item.fundingType === 'diamonds') diamondsSpent += safeAmount(item.spentDiamonds)
      if (item.fundingType === 'usd') legacySpent += safeAmount(item.spentUsd)
    }
    return { campaigns, statuses, budget, diamondsSpent, legacySpent }
  }, [snapshot])

  return (
    <section className="space-y-4" aria-label={tr('heading')}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{tr('heading')}</h2>
        <button type="button" onClick={() => setReload(value => value + 1)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-[#e8e3f2] bg-white px-3 py-2 text-xs font-semibold text-[#6540c7] disabled:opacity-50 dark:border-white/10 dark:bg-[#302640] dark:text-[#d1bdff]">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{tr('refresh')}
        </button>
      </div>

      {loading && <p role="status" className="py-7 text-center text-sm text-[#8b859a]">{tr('loading')}</p>}
      {error && !loading && (
        <div role="alert" className="rounded-xl border border-[#e9dba8] bg-[#fff8de] p-4 text-sm text-[#6a5020]">
          {tr('error')}
          <button type="button" className="ml-2 font-semibold underline" onClick={() => setReload(v => v + 1)}>{tr('retry')}</button>
        </div>
      )}

      {!loading && !error && snapshot && (
        <>
          <p className="text-xs leading-5 text-[#817a91] dark:text-[#c9c0d2]">
            {snapshot.total > summary.campaigns.length
              ? tr('limited', { shown: summary.campaigns.length, total: snapshot.total })
              : tr('complete', { total: snapshot.total })}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Metric icon={Megaphone} label={tr('total')} value={fmt(snapshot.total)} />
            <Metric icon={BarChart3} label={tr('active')} value={fmt(summary.statuses.active)} />
            <Metric icon={Gem} label={tr('planned')} value={fmt(summary.budget)} suffix="💎" />
            <Metric icon={Gem} label={tr('spent')} value={fmt(summary.diamondsSpent)} suffix="💎" />
            {summary.legacySpent > 0 && (
              <Metric icon={CircleDollarSign} label={tr('legacy')} value={`$${fmt(summary.legacySpent)}`} />
            )}
            <Metric icon={Megaphone} label={tr('review')} value={fmt(summary.statuses.pending_review)} />
            <Metric icon={Megaphone} label={tr('approved')} value={fmt(summary.statuses.approved)} />
          </div>

          <div className="rounded-2xl border border-[#eeebf8] bg-white p-4 dark:border-white/10 dark:bg-[#241d30]">
            <h3 className="mb-4 text-sm font-semibold">{tr('status')}</h3>
            {summary.campaigns.length === 0
              ? <p className="py-4 text-center text-sm text-[#898395]">{tr('empty')}</p>
              : <div className="space-y-3">
                {STATUS.filter(status => summary.statuses[status] > 0).map(status => (
                  <div key={status} className="grid grid-cols-[104px_1fr_32px] items-center gap-2">
                    <span className="truncate text-xs text-[#777087] dark:text-[#c4bcd0]">{LABELS[status]}</span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#f0ecfa] dark:bg-[#392e4d]">
                      <div className="h-full rounded-full bg-[#8259d5]" style={{ width: `${100 * summary.statuses[status] / summary.campaigns.length}%` }} />
                    </div>
                    <span className="text-right text-xs font-semibold tabular-nums">{fmt(summary.statuses[status])}</span>
                  </div>
                ))}
              </div>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#eeebf8] bg-white p-4 dark:border-white/10 dark:bg-[#241d30]">
              <div className="text-xs text-[#898395]">{tr('reach')}</div>
              <div className="mt-3 text-sm font-semibold text-[#726b85]">{tr('noData')}</div>
            </div>
            <div className="rounded-2xl border border-[#eeebf8] bg-white p-4 dark:border-white/10 dark:bg-[#241d30]">
              <div className="text-xs text-[#898395]">{tr('clicks')}</div>
              <div className="mt-3 text-sm font-semibold text-[#726b85]">{tr('noData')}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9e1fa] bg-[#faf8ff] p-4 text-xs leading-6 text-[#746a87] dark:border-white/10 dark:bg-[#2b243a] dark:text-[#d2c5e1]">
            <p>{tr('tracking')}</p>
            <p className="mt-2">{tr('budgetNote')}</p>
            <p className="mt-2">{tr('costNote')}</p>
            <p className="mt-2">{tr('scope')}</p>
          </div>

          {summary.campaigns.length > 0 && (
            <div className="rounded-2xl border border-[#eeebf8] bg-white p-4 dark:border-white/10 dark:bg-[#241d30]">
              <h3 className="mb-3 text-sm font-semibold">{tr('latest')}</h3>
              <div className="divide-y divide-[#f0edf5] dark:divide-white/10">
                {summary.campaigns.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold">{item.contentTitle || tr('unknown')}</p>
                      <p className="mt-1 text-xs text-[#898395]">{LABELS[item.status] || tr('unknown')}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold">{fmt(item.budgetDiamonds ?? safeAmount(item.budgetUsd) * 100)} 💎</p>
                      {item.fundingType === 'diamonds' && (
                        <p className="mt-1 text-[11px] text-[#898395]">{tr('spentOf')}: {fmt(item.spentDiamonds)} 💎</p>
                      )}
                      {item.fundingType === 'usd' && (
                        <p className="mt-1 text-[11px] text-[#898395]">{tr('spentOf')}: ${fmt(item.spentUsd)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
