import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getStudioRanking } from '../../services/shadowStudioAnalyticsApi'
import { StudioThumbnail, formatStudioCount } from '../../components/author/studio/ShadowStudioAnalyticsShared'

registerTranslationNamespace('shadowStudioRecentRanking', {
  en: {
    title: 'Top recent videos', first: 'First {{duration}}', total: 'Views since publishing',
    compared: 'Comparing views of {{count}} recent long videos (excluding Shorts)',
    totalCompared: 'Comparing total views of {{count}} recent long videos (excluding Shorts)',
    empty: 'No published long videos found.', loading: 'Loading videos...', retry: 'Retry',
    unknown: 'View data unavailable',
  },
  km: {
    title: 'វីដេអូថ្មីៗលំដាប់កំពូល', first: 'រយៈពេលដំបូង {{duration}}', total: 'Views សរុបតាំងពីផ្សាយ',
    compared: 'ប្រៀបធៀប Views វីដេអូវែងថ្មីៗ {{count}} (មិនរាប់ Shorts)',
    totalCompared: 'ប្រៀបធៀប Views សរុបវីដេអូវែងថ្មីៗ {{count}} (មិនរាប់ Shorts)',
    empty: 'រកមិនឃើញវីដេអូវែងដែលបានផ្សាយ។', loading: 'កំពុងទាញវីដេអូ...', retry: 'ព្យាយាមម្ដងទៀត',
    unknown: 'មិនទាន់មានទិន្នន័យ Views',
  },
  zh: {
    title: '近期热门视频', first: '前 {{duration}}', total: '发布以来的观看量',
    compared: '比较最近 {{count}} 个长视频的观看量（不包括 Shorts）',
    totalCompared: '比较最近 {{count}} 个长视频的总观看量（不包括 Shorts）',
    empty: '暂无已发布的长视频', loading: '正在加载视频...', retry: '重试', unknown: '暂无观看量数据',
  },
  ja: {
    title: '最近の人気動画', first: '公開後 {{duration}}', total: '公開以来の視聴回数',
    compared: '最近の長編動画 {{count}} 本を比較（Shorts 除外）',
    totalCompared: '最近の長編動画 {{count}} 本の累計視聴回数を比較（Shorts 除外）',
    empty: '公開済みの長編動画がありません', loading: '動画を読み込み中...', retry: '再試行', unknown: '視聴回数データなし',
  },
  ko: {
    title: '최근 인기 동영상', first: '게시 후 첫 {{duration}}', total: '게시 이후 총 조회수',
    compared: '최근 긴 동영상 {{count}}개 조회수 비교 (Shorts 제외)',
    totalCompared: '최근 긴 동영상 {{count}}개 총 조회수 비교 (Shorts 제외)',
    empty: '게시된 긴 동영상이 없습니다', loading: '동영상 불러오는 중...', retry: '다시 시도', unknown: '조회수 데이터 없음',
  },
})

function ageLabel(minutes) {
  const total = Number(minutes)
  if (!Number.isSafeInteger(total) || total < 0) return null
  const days = Math.floor(total / 1440)
  const hours = Math.floor((total % 1440) / 60)
  const mins = total % 60
  if (days) return `${days} days ${hours} hours`
  if (hours) return `${hours} hours ${mins} minutes`
  return `${mins} minutes`
}

function viewNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const count = Number(value)
  return Number.isSafeInteger(count) && count >= 0 ? count : null
}

function rowViews(video, equalAge) {
  if (equalAge) return viewNumber(video.views_at_equal_age)
  return viewNumber(video.display_views ?? video.view_count)
}

export default function AuthorStudioRankingPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const videoId = (searchParams.get('videoId') || '').trim()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setData(null)
    if (!videoId) {
      setLoading(false)
      return () => controller.abort()
    }
    getStudioRanking(videoId, { signal: controller.signal, force: revision > 0 })
      .then(result => {
        if (!controller.signal.aborted) setData(result)
      })
      .catch(cause => {
        if (!controller.signal.aborted) setError(cause?.message || 'Unable to load ranking.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [videoId, revision])

  const equalAge = data?.view_basis === 'equal_age' || (data?.view_basis == null && data?.comparison_complete === true)
  const videos = useMemo(() => {
    const rows = Array.isArray(data?.ranking) ? data.ranking.slice(0, 10) : []
    return [...rows].sort((a, b) => {
      const ap = Number(a?.position)
      const bp = Number(b?.position)
      if (Number.isSafeInteger(ap) && ap > 0 && Number.isSafeInteger(bp) && bp > 0) return ap - bp
      const av = rowViews(a, equalAge)
      const bv = rowViews(b, equalAge)
      if (av !== bv) return (bv ?? -1) - (av ?? -1)
      return Date.parse(b?.published_at || '') - Date.parse(a?.published_at || '') || 0
    })
  }, [data, equalAge])
  const duration = equalAge ? ageLabel(data?.age_minutes) : null

  return (
    <main className="min-h-[100dvh] bg-[var(--shadow-bg-base,var(--shadow-bg-surface))] text-[var(--shadow-text-primary)]">
      <div className="mx-auto w-full max-w-[800px] pb-[calc(28px+env(safe-area-inset-bottom,0px))]">
        <header className="flex h-[72px] items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/author/reel/studio/dashboard')}
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]"
          >
            <ArrowLeft size={26} strokeWidth={1.8} />
          </button>
          <h1 className="truncate text-[20px] font-medium">{t('shadowStudioRecentRanking.title')}</h1>
        </header>

        {!loading && !error && data ? (
          <section className="px-5 pb-8 pt-6 sm:px-6">
            <h2 className="text-[20px] font-bold leading-7">
              {duration ? t('shadowStudioRecentRanking.first', { duration }) : t('shadowStudioRecentRanking.total')}
            </h2>
            <p className="mt-1 text-[13px] text-[var(--shadow-text-secondary)]">
              {t(equalAge ? 'shadowStudioRecentRanking.compared' : 'shadowStudioRecentRanking.totalCompared', { count: videos.length })}
            </p>
          </section>
        ) : null}

        {loading ? <p className="px-6 py-8 text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioRecentRanking.loading')}</p> : null}
        {!loading && error ? (
          <div className="space-y-3 px-6 py-8">
            <p role="alert" className="break-words text-sm text-[var(--shadow-text-secondary)]">{error}</p>
            <button type="button" onClick={() => setRevision(value => value + 1)} className="inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] px-4 py-2 text-sm">
              <RefreshCw size={16} />{t('shadowStudioRecentRanking.retry')}
            </button>
          </div>
        ) : null}
        {!loading && !error && videos.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioRecentRanking.empty')}</p>
        ) : null}

        {!loading && !error ? (
          <ol aria-label={t('shadowStudioRecentRanking.title')}>
            {videos.map((video, index) => {
              const count = rowViews(video, equalAge)
              return (
                <li key={video.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics`)}
                    className={`flex min-h-[78px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--shadow-bg-soft)] sm:gap-4 sm:px-6 ${video.id === videoId ? 'bg-[var(--shadow-bg-soft)]' : ''}`}
                    aria-label={`${index + 1}. ${video.title || 'Video'}: ${count === null ? t('shadowStudioRecentRanking.unknown') : formatStudioCount(count)}`}
                  >
                    <span className="w-5 shrink-0 text-center text-[15px] tabular-nums text-[var(--shadow-text-secondary)]">{index + 1}</span>
                    <StudioThumbnail video={video} className="h-[49px] w-[85px] rounded-md sm:h-[60px] sm:w-[105px]" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-normal sm:text-base">{video.title || '—'}</span>
                    <span className="w-[54px] shrink-0 text-right text-[15px] tabular-nums sm:w-[72px] sm:text-base">
                      {count === null ? '—' : formatStudioCount(count)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        ) : null}
      </div>
    </main>
  )
}
