import { useRef, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  makeAuthorIncomeExcel,
  makeAuthorIncomeWord,
  makeAuthorIncomePdf,
  saveAuthorIncomeReport,
} from './AuthorIncomeReportFileFormats'

registerTranslationNamespace('authorIncomeReportDownload', {
  en: {
    title: 'Download Income Report', period: 'Report period', today: 'Today', week: 'Last 7 days',
    last30: 'Last 30 days', month: 'This month', year: 'This year', all: 'All time',
    custom: 'Custom', from: 'Start date', to: 'End date', word: 'Word', excel: 'Excel', pdf: 'PDF',
    download: 'Download {{format}}', processing: 'Preparing report…', invalid: 'Choose a valid date range.',
    noLogin: 'Please sign in again.', invalidData: 'The report did not pass validation.',
    failed: 'Could not prepare the report.', limit: 'Hourly report limit reached. Please try again later.',
    ready: '{{format}} downloaded · {{mode}} · {{count}} transactions',
    detail: 'Detailed', summary: 'Summary', note: 'Reports are limited to 500 rows. Larger reports are summarized without removing transactions. Cached reports can be downloaded again.',
  },
  km: {
    title: 'ទាញយករបាយការណ៍ចំណូល', period: 'រយៈពេលរបាយការណ៍', today: 'ថ្ងៃនេះ', week: '៧ ថ្ងៃចុងក្រោយ',
    last30: '៣០ ថ្ងៃចុងក្រោយ', month: 'ខែនេះ', year: 'ឆ្នាំនេះ', all: 'គ្រប់ពេល',
    custom: 'កំណត់ផ្ទាល់', from: 'ថ្ងៃចាប់ផ្ដើម', to: 'ថ្ងៃបញ្ចប់', word: 'Word', excel: 'Excel', pdf: 'PDF',
    download: 'ទាញយក {{format}}', processing: 'កំពុងរៀបចំរបាយការណ៍…', invalid: 'សូមជ្រើសរើសចន្លោះថ្ងៃឱ្យត្រឹមត្រូវ។',
    noLogin: 'សូមចូលគណនីម្ដងទៀត។', invalidData: 'ទិន្នន័យរបាយការណ៍មិនត្រឹមត្រូវ។',
    failed: 'មិនអាចរៀបចំរបាយការណ៍បាន។', limit: 'លើសចំនួនរបាយការណ៍ក្នុងមួយម៉ោង។ សូមសាកល្បងពេលក្រោយ។',
    ready: 'ទាញយក {{format}} រួច · {{mode}} · {{count}} ប្រតិបត្តិការ',
    detail: 'លម្អិត', summary: 'សង្ខេប', note: 'របាយការណ៍អតិបរមា ៥០០ ជួរ។ បើលើស ប្រព័ន្ធសង្ខេបដោយមិនដកប្រតិបត្តិការចេញ។ ការទាញម្ដងទៀតប្រើ Cache។',
  },
  zh: {
    title: '下载收入报告', period: '报告期间', today: '今天', week: '最近7天', last30: '最近30天',
    month: '本月', year: '今年', all: '全部时间', custom: '自定义', from: '开始日期', to: '结束日期',
    word: 'Word', excel: 'Excel', pdf: 'PDF', download: '下载 {{format}}', processing: '正在准备报告…',
    invalid: '请选择有效的日期范围。', noLogin: '请重新登录。', invalidData: '报告数据验证失败。',
    failed: '无法准备报告。', limit: '已达到每小时报告上限，请稍后重试。',
    ready: '{{format}} 已下载 · {{mode}} · {{count}} 笔交易', detail: '明细', summary: '汇总',
    note: '报告最多500行。超出的交易将汇总而不会丢失。重复下载使用缓存。',
  },
  ja: {
    title: '収益レポートをダウンロード', period: '対象期間', today: '今日', week: '過去7日間',
    last30: '過去30日間', month: '今月', year: '今年', all: '全期間', custom: 'カスタム',
    from: '開始日', to: '終了日', word: 'Word', excel: 'Excel', pdf: 'PDF',
    download: '{{format}}をダウンロード', processing: 'レポートを準備中…', invalid: '正しい期間を選択してください。',
    noLogin: '再度ログインしてください。', invalidData: 'レポートデータの検証に失敗しました。',
    failed: 'レポートを準備できませんでした。', limit: '時間あたりの上限に達しました。後でもう一度お試しください。',
    ready: '{{format}}をダウンロードしました · {{mode}} · {{count}}件', detail: '詳細', summary: '集計',
    note: 'レポートは最大500行です。超過分は取引を削除せずに集計します。再ダウンロードはキャッシュを利用します。',
  },
  ko: {
    title: '수입 보고서 다운로드', period: '보고 기간', today: '오늘', week: '최근 7일',
    last30: '최근 30일', month: '이번 달', year: '올해', all: '전체 기간', custom: '사용자 지정',
    from: '시작 날짜', to: '종료 날짜', word: 'Word', excel: 'Excel', pdf: 'PDF',
    download: '{{format}} 다운로드', processing: '보고서를 준비하는 중…', invalid: '유효한 날짜 범위를 선택하세요.',
    noLogin: '다시 로그인하세요.', invalidData: '보고서 데이터 검증에 실패했습니다.',
    failed: '보고서를 준비할 수 없습니다.', limit: '시간당 보고서 생성 한도에 도달했습니다. 나중에 다시 시도하세요.',
    ready: '{{format}} 다운로드 완료 · {{mode}} · 거래 {{count}}건', detail: '상세', summary: '요약',
    note: '보고서는 최대 500행입니다. 초과 거래는 삭제하지 않고 요약합니다. 다시 다운로드하면 캐시를 사용합니다.',
  },
})

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
const CACHE_TTL_MS = 10 * 60 * 1000

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function dateCambodia() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function validateReport(report) {
  return report?.ok === true && (report.mode === 'detail' || report.mode === 'summary') &&
    Array.isArray(report.rows) && report.rows.length <= 500 &&
    report.totals && report.author && report.range &&
    ['transaction_count', 'paid_diamonds', 'author_earned_diamonds', 'author_net_payout_usd']
      .every(field => report.totals[field] !== undefined && report.totals[field] !== null)
}

export default function AuthorIncomeReportDownloads() {
  const { t } = useDisplayTranslation()
  const [period, setPeriod] = useState('month')
  const [from, setFrom] = useState(dateCambodia)
  const [to, setTo] = useState(dateCambodia)
  const [working, setWorking] = useState('')
  const [notice, setNotice] = useState('')
  const [isError, setIsError] = useState(false)
  const cache = useRef({ token: '', key: '', value: null, expiresAt: 0 })
  const pending = useRef(null)
  const prefix = 'authorIncomeReportDownload'
  const label = key => t(`${prefix}.${key}`)

  async function fetchReport(token, query) {
    const response = await fetch(`${API_BASE_URL}/api/authors/me/income-report/export-data?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) {
      const error = new Error(data.message || label('failed'))
      error.status = response.status
      error.code = data.code
      throw error
    }
    if (!validateReport(data)) throw new Error(label('invalidData'))
    return data
  }

  async function download(format) {
    if (working) return
    if (period === 'custom' && (!validDate(from) || !validDate(to) || from > to)) {
      setNotice(label('invalid'))
      setIsError(true)
      return
    }
    const token = getToken()
    if (!token) {
      setNotice(label('noLogin'))
      setIsError(true)
      return
    }
    const params = new URLSearchParams({ period })
    if (period === 'custom') {
      params.set('from', from)
      params.set('to', to)
    }
    const key = `${params.toString()}|${dateCambodia()}`
    setWorking(format)
    setNotice('')
    setIsError(false)
    try {
      let report = cache.current.value && cache.current.token === token && cache.current.key === key && cache.current.expiresAt > Date.now()
        ? cache.current.value : null
      if (!report) {
        if (!pending.current || pending.current.key !== key || pending.current.token !== token) {
          pending.current = { key, token, request: fetchReport(token, params.toString()) }
        }
        report = await pending.current.request
        cache.current = { token, key, value: report, expiresAt: Date.now() + CACHE_TTL_MS }
        pending.current = null
      }
      const blob = format === 'xlsx' ? makeAuthorIncomeExcel(report)
        : format === 'docx' ? makeAuthorIncomeWord(report)
          : await makeAuthorIncomePdf(report)
      saveAuthorIncomeReport(blob, report, format)
      setNotice(t(`${prefix}.ready`, {
        format: label(format === 'xlsx' ? 'excel' : format === 'docx' ? 'word' : 'pdf'),
        mode: label(report.mode === 'detail' ? 'detail' : 'summary'),
        count: String(report.totals.transaction_count),
      }))
    } catch (error) {
      pending.current = null
      setNotice(error.status === 429 || error.code === 'REPORT_LIMIT_REACHED' ? label('limit') : error.message || label('failed'))
      setIsError(true)
    } finally {
      setWorking('')
    }
  }

  return (
    <section className="rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
      <div className="flex items-center gap-2 text-[var(--shadow-text-primary)]">
        <i className="fa-solid fa-file-arrow-down text-[15px] text-[#7651ad]" />
        <h2 className="text-[14px] font-black">{label('title')}</h2>
      </div>
      <label className="mt-3 block text-[10px] font-bold text-[var(--shadow-text-secondary)]">
        {label('period')}
        <select value={period} disabled={Boolean(working)} onChange={event => setPeriod(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-3 text-[12px] font-bold text-[var(--shadow-text-primary)] outline-none">
          {['today', 'week', 'last30', 'month', 'year', 'all', 'custom'].map(item => (
            <option value={item} key={item}>{label(item)}</option>
          ))}
        </select>
      </label>
      {period === 'custom' && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[['from', from, setFrom], ['to', to, setTo]].map(([name, value, setter]) => (
            <label key={name} className="min-w-0 text-[10px] font-bold text-[var(--shadow-text-secondary)]">
              {label(name)}
              <input type="date" lang={getDisplayLanguageId()} value={value} disabled={Boolean(working)}
                onChange={event => setter(event.target.value)}
                className="mt-1.5 h-11 w-full min-w-0 rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-2 text-[12px] text-[var(--shadow-text-primary)] outline-none" />
            </label>
          ))}
        </div>
      )}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[['docx', 'word'], ['xlsx', 'excel'], ['pdf', 'pdf']].map(([format, name]) => (
          <button type="button" key={format} disabled={Boolean(working)} onClick={() => download(format)}
            className="min-h-11 rounded-[13px] border border-[#a58ac7] bg-[#7651ad] px-2 text-[11px] font-black text-white disabled:opacity-50 active:scale-[0.98]">
            {working === format ? label('processing') : label(name)}
          </button>
        ))}
      </div>
      {notice && <p role="status" className={`mt-3 text-[11px] font-semibold ${isError ? 'text-[#d65176]' : 'text-[#7651ad]'}`}>{notice}</p>}
      <p className="mt-3 text-[10px] leading-5 text-[var(--shadow-text-tertiary)]">{label('note')}</p>
    </section>
  )
}
