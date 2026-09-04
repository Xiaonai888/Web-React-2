import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyPerformance', {
  "en": {
    "selectedMonth": "Selected month",
    "episodeShort": "EP",
    "untitledEpisode": "Untitled Episode",
    "unlocksDiamonds": "{{unlocks}} unlocks • {{diamonds}} Diamonds",
    "failedLoad": "Failed to load performance",
    "cannotConnect": "Cannot connect to backend.",
    "goBack": "Go back",
    "title": "Performance",
    "storyPerformance": "Story Performance",
    "incomeOnly": "Episode unlock income only",
    "month": "Month",
    "loading": "Loading performance...",
    "diamondUnlocks": "Diamond unlocks",
    "monthlyIncome": "Monthly Income",
    "unlocks": "Unlocks",
    "diamonds": "Diamonds",
    "incomeByEpisode": "Income by Episode",
    "noIncome": "No unlock income this month.",
    "noIncomeHelp": "Episode unlock earnings will appear here."
  },
  "km": {
    "selectedMonth": "ខែដែលបានជ្រើស",
    "episodeShort": "ភាគ",
    "untitledEpisode": "ភាគគ្មានចំណងជើង",
    "unlocksDiamonds": "ដោះសោ {{unlocks}} • {{diamonds}} Diamonds",
    "failedLoad": "មិនអាចផ្ទុកទិន្នន័យ Performance បានទេ",
    "cannotConnect": "មិនអាចភ្ជាប់ទៅ Backend បានទេ។",
    "goBack": "ត្រឡប់ក្រោយ",
    "title": "Performance",
    "storyPerformance": "Performance របស់រឿង",
    "incomeOnly": "ចំណូលពីការដោះសោភាគប៉ុណ្ណោះ",
    "month": "ខែ",
    "loading": "កំពុងផ្ទុក Performance...",
    "diamondUnlocks": "ការដោះសោដោយ Diamond",
    "monthlyIncome": "ចំណូលប្រចាំខែ",
    "unlocks": "ការដោះសោ",
    "diamonds": "Diamonds",
    "incomeByEpisode": "ចំណូលតាមភាគ",
    "noIncome": "មិនមានចំណូលពីការដោះសោក្នុងខែនេះទេ។",
    "noIncomeHelp": "ចំណូលពីការដោះសោភាគនឹងបង្ហាញនៅទីនេះ។"
  },
  "zh": {
    "selectedMonth": "所选月份",
    "episodeShort": "章",
    "untitledEpisode": "未命名章节",
    "unlocksDiamonds": "{{unlocks}} 次解锁 • {{diamonds}} Diamonds",
    "failedLoad": "无法加载表现数据",
    "cannotConnect": "无法连接后端。",
    "goBack": "返回",
    "title": "表现",
    "storyPerformance": "故事表现",
    "incomeOnly": "仅统计章节解锁收入",
    "month": "月份",
    "loading": "正在加载表现数据...",
    "diamondUnlocks": "Diamond 解锁",
    "monthlyIncome": "月收入",
    "unlocks": "解锁次数",
    "diamonds": "Diamonds",
    "incomeByEpisode": "按章节收入",
    "noIncome": "本月没有解锁收入。",
    "noIncomeHelp": "章节解锁收入会显示在这里。"
  },
  "ja": {
    "selectedMonth": "選択した月",
    "episodeShort": "話",
    "untitledEpisode": "無題のエピソード",
    "unlocksDiamonds": "{{unlocks}} 回解除 • {{diamonds}} Diamonds",
    "failedLoad": "パフォーマンスを読み込めませんでした",
    "cannotConnect": "バックエンドに接続できません。",
    "goBack": "戻る",
    "title": "パフォーマンス",
    "storyPerformance": "ストーリーパフォーマンス",
    "incomeOnly": "エピソード解除収益のみ",
    "month": "月",
    "loading": "パフォーマンスを読み込み中...",
    "diamondUnlocks": "Diamond 解除",
    "monthlyIncome": "月間収益",
    "unlocks": "解除数",
    "diamonds": "Diamonds",
    "incomeByEpisode": "エピソード別収益",
    "noIncome": "今月の解除収益はありません。",
    "noIncomeHelp": "エピソード解除の収益がここに表示されます。"
  },
  "ko": {
    "selectedMonth": "선택한 달",
    "episodeShort": "EP",
    "untitledEpisode": "제목 없는 에피소드",
    "unlocksDiamonds": "{{unlocks}}회 잠금 해제 • {{diamonds}} Diamonds",
    "failedLoad": "성과 데이터를 불러오지 못했습니다",
    "cannotConnect": "백엔드에 연결할 수 없습니다.",
    "goBack": "뒤로",
    "title": "성과",
    "storyPerformance": "스토리 성과",
    "incomeOnly": "에피소드 잠금 해제 수익만 포함",
    "month": "월",
    "loading": "성과를 불러오는 중...",
    "diamondUnlocks": "Diamond 잠금 해제",
    "monthlyIncome": "월 수익",
    "unlocks": "잠금 해제",
    "diamonds": "Diamonds",
    "incomeByEpisode": "에피소드별 수익",
    "noIncome": "이번 달 잠금 해제 수익이 없습니다.",
    "noIncomeHelp": "에피소드 잠금 해제 수익이 여기에 표시됩니다."
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function currentMonth() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function money(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function number(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId(), {
    maximumFractionDigits: 2,
  })
}

function monthLabel(value) {
  const [year, month] = String(value || '').split('-').map(Number)

  if (!year || !month) return getDisplayText('storyPerformance.selectedMonth')

  return new Date(year, month - 1, 1).toLocaleDateString(getDisplayLanguageId(), {
    month: 'long',
    year: 'numeric',
  })
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="rounded-[14px] bg-[var(--shadow-bg-surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-normal text-[var(--shadow-text-tertiary)]">{label}</div>
        <i className={`${icon} text-[13px] text-[#e85b73]`} />
      </div>
      <div className="mt-3 text-[22px] font-normal text-[var(--shadow-text-primary)]">{value}</div>
    </div>
  )
}

function EpisodeIncomeRow({ item, last }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="relative flex items-center gap-3 bg-[var(--shadow-bg-surface)] px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[12px] font-normal text-[#e85b73]">
        {item.episode_number
          ? `${t('storyPerformance.episodeShort')} ${item.episode_number}`
          : t('storyPerformance.episodeShort')}
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-normal text-[var(--shadow-text-primary)]">
          {item.title || t('storyPerformance.untitledEpisode')}
        </div>
        <div className="mt-1 text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
          {t('storyPerformance.unlocksDiamonds', {
            unlocks: number(item.unlocks),
            diamonds: number(item.diamonds),
          })}
        </div>
      </div>

      <div className="shrink-0 text-[13px] font-normal text-[var(--shadow-text-primary)]">
        {money(item.income_usd)}
      </div>

      {!last ? <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[var(--shadow-border)]" /> : null}
    </div>
  )
}

export default function StoryPerformancePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { storyId } = useParams()
  const [month, setMonth] = useState(currentMonth())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadPerformance() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/performance?month=${encodeURIComponent(month)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || t('storyPerformance.failedLoad'))
        }

        if (!ignore) setData(result)
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message === 'Failed to fetch'
              ? t('storyPerformance.cannotConnect')
              : loadError.message || t('storyPerformance.failedLoad')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPerformance()

    return () => {
      ignore = true
    }
  }, [month, navigate, storyId, t])

  const episodes = useMemo(() => data?.episodes || [], [data])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto grid h-[58px] max-w-4xl grid-cols-[44px_1fr_44px] items-center px-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center active:opacity-60"
            aria-label={t('storyPerformance.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="truncate text-center text-[15px] font-normal">{t('storyPerformance.title')}</h1>
          <div />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-4 sm:px-5">
        <section className="rounded-[14px] bg-[var(--shadow-bg-surface)] p-4">
          <div className="flex items-center gap-3">
            <div className="aspect-[2/3] w-[58px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
              {data?.story?.cover_url ? (
                <img
                  src={data.story.cover_url}
                  alt={data.story.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
                  <i className="fa-regular fa-image text-[16px]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-2 text-[17px] font-normal">
                {data?.story?.title || t('storyPerformance.storyPerformance')}
              </div>
              <div className="mt-1 text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                {t('storyPerformance.incomeOnly')}
              </div>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="text-[11px] font-normal text-[var(--shadow-text-tertiary)]">{t('storyPerformance.month')}</span>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value || currentMonth())}
              className="mt-1 h-11 w-full rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[13px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#e85b73]"
            />
          </label>
        </section>

        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mt-3 w-full rounded-[12px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-normal text-[#e5484d]"
          >
            {error}
          </button>
        ) : null}

        {loading ? (
          <div className="mt-3 rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border-strong)] border-t-[#e85b73]" />
            <div className="mt-3 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
              {t('storyPerformance.loading')}
            </div>
          </div>
        ) : null}

        {!loading && data ? (
          <>
            <div className="mt-3 flex items-center justify-between px-1">
              <div className="text-[14px] font-normal">{monthLabel(data.month)}</div>
              <div className="text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                {t('storyPerformance.diamondUnlocks')}
              </div>
            </div>

            <section className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryCard
                label={t('storyPerformance.monthlyIncome')}
                value={money(data.summary?.income_usd)}
                icon="fa-solid fa-dollar-sign"
              />
              <SummaryCard
                label={t('storyPerformance.unlocks')}
                value={number(data.summary?.unlocks)}
                icon="fa-solid fa-unlock-keyhole"
              />
              <SummaryCard
                label={t('storyPerformance.diamonds')}
                value={number(data.summary?.diamonds)}
                icon="fa-solid fa-gem"
              />
            </section>

            <section className="mt-3 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-surface)]">
              <div className="px-4 pb-3 pt-4 text-[14px] font-normal">
                {t('storyPerformance.incomeByEpisode')}
              </div>

              {episodes.length ? (
                episodes.map((item, index) => (
                  <EpisodeIncomeRow
                    key={item.episode_id || `${item.title}-${index}`}
                    item={item}
                    last={index === episodes.length - 1}
                  />
                ))
              ) : (
                <div className="px-6 py-14 text-center">
                  <div className="text-[14px] font-normal text-[var(--shadow-text-primary)]">
                    {t('storyPerformance.noIncome')}
                  </div>
                  <div className="mt-2 text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                    {t('storyPerformance.noIncomeHelp')}
                  </div>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
