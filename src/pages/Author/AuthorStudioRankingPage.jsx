import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BarChart3, ChevronRight, Clock3, Eye } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getStudioRanking } from '../../services/shadowStudioAnalyticsApi'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import {
  StudioBackHeader,
  StudioCard,
  StudioFrame,
  StudioMissing,
  StudioRetry,
  StudioThumbnail,
  formatStudioCount,
} from '../../components/author/studio/ShadowStudioAnalyticsShared'

registerTranslationNamespace('shadowStudioRankingDetail', {
  en: {
    comparable: 'Views at the same time after publishing',
    elapsed: 'Comparison window',
    available: 'Ranking based on actual Shadow view history',
    unavailable: 'An accurate ranking is not available yet. Some videos have no complete view history for this comparison window.',
    recent: 'Latest long videos — newest first (not ranked)',
    ranked: 'Latest long videos — ranked by equal-age views',
    selected: 'Selected video',
    notRecent: 'Your selected video is not among the 10 latest long videos.',
    noSelection: 'Select a video from Dashboard to see its ranking.',
    recentOnly: 'Only published long videos are included; Shorts are excluded.',
    viewCount: 'Views at matching age',
    noResult: 'No eligible published long videos were found.',
    elapsedUnknown: 'Comparison duration is not available.',
  },
  km: {
    comparable: 'ចំនួនមើលក្នុងអាយុវីដេអូស្មើគ្នា',
    elapsed: 'រយៈពេលប្រៀបធៀប',
    available: 'ចំណាត់ថ្នាក់ផ្អែកលើប្រវត្តិ Views ពិតរបស់ Shadow',
    unavailable: 'មិនទាន់អាចគណនាចំណាត់ថ្នាក់បានត្រឹមត្រូវ ព្រោះវីដេអូមួយចំនួនមិនមានប្រវត្តិ Views គ្រប់រយៈពេលសម្រាប់ប្រៀបធៀប។',
    recent: 'វីដេអូវែង ១០ ចុងក្រោយ — តាមថ្ងៃផ្សាយថ្មី (មិនមែន Ranking)',
    ranked: 'វីដេអូវែង ១០ ចុងក្រោយ — តាម Views ក្នុងអាយុស្មើគ្នា',
    selected: 'វីដេអូដែលបានជ្រើស',
    notRecent: 'វីដេអូដែលបានជ្រើសមិនស្ថិតក្នុងវីដេអូវែង ១០ ចុងក្រោយទេ។',
    noSelection: 'ជ្រើសវីដេអូពី Dashboard ដើម្បីមើលចំណាត់ថ្នាក់។',
    recentOnly: 'បង្ហាញតែវីដេអូវែងដែលបានផ្សាយ មិនរាប់ Shorts។',
    viewCount: 'Views នៅអាយុស្មើគ្នា',
    noResult: 'មិនមានវីដេអូវែងដែលបានផ្សាយ និងមានសិទ្ធិប្រៀបធៀបទេ។',
    elapsedUnknown: 'មិនទាន់ដឹងរយៈពេលប្រៀបធៀប។',
  },
  zh: {
    comparable: '发布后相同时间内的观看量', elapsed: '对比时长',
    available: '按 Shadow 实际观看历史排名',
    unavailable: '部分视频缺少完整观看记录，因此暂时无法准确排名。',
    recent: '最近10个长视频 — 按发布时间排列（非排名）', ranked: '最近10个长视频 — 按同龄观看量排名',
    selected: '当前视频', notRecent: '所选视频不在最近10个长视频中。',
    noSelection: '请从控制面板选择视频查看排名。', recentOnly: '仅包含已发布的长视频，不包含 Shorts。',
    viewCount: '相同时长观看量', noResult: '未找到符合条件的已发布长视频。', elapsedUnknown: '对比时长不可用。',
  },
  ja: {
    comparable: '公開から同じ時間内の視聴回数', elapsed: '比較期間',
    available: 'Shadow の実際の視聴履歴に基づくランキング',
    unavailable: '一部の動画の視聴履歴が不足しているため、正確なランキングを表示できません。',
    recent: '最近の長編動画10本 — 新着順（順位ではありません）', ranked: '最近の長編動画10本 — 同じ経過時間での視聴回数順',
    selected: '選択中の動画', notRecent: '選択した動画は最近の長編動画10本に含まれません。',
    noSelection: 'ダッシュボードから動画を選択してください。', recentOnly: '公開中の長編動画のみ対象、Shorts は除外します。',
    viewCount: '同じ経過時間の視聴回数', noResult: '対象の長編動画がありません。', elapsedUnknown: '比較期間がありません。',
  },
  ko: {
    comparable: '게시 후 동일 경과 시간의 조회수', elapsed: '비교 기간',
    available: 'Shadow 실제 조회 기록을 기준으로 산정한 순위',
    unavailable: '일부 동영상의 조회 기록이 부족해 정확한 순위를 표시할 수 없습니다.',
    recent: '최근 긴 동영상 10개 — 최신순 (순위 아님)', ranked: '최근 긴 동영상 10개 — 동일 기간 조회수 순위',
    selected: '선택한 동영상', notRecent: '선택한 동영상은 최근 긴 동영상 10개에 포함되지 않습니다.',
    noSelection: '대시보드에서 동영상을 선택하세요.', recentOnly: '게시된 긴 동영상만 포함하며 Shorts는 제외합니다.',
    viewCount: '동일 기간 조회수', noResult: '대상 긴 동영상이 없습니다.', elapsedUnknown: '비교 기간이 없습니다.',
  },
})

function formatAgeWindow(minutes) {
  const value = Number(minutes)
  if (!Number.isSafeInteger(value) || value < 0) return null
  const days = Math.floor(value / 1440)
  const hours = Math.floor((value % 1440) / 60)
  const remaining = value % 60
  if (days) return `${days}d ${hours}h ${remaining}m`
  if (hours) return `${hours}h ${remaining}m`
  return `${remaining}m`
}

function publishedTime(video) {
  const time = Date.parse(video.published_at || '')
  return Number.isFinite(time) ? time : 0
}

function validRankingPosition(position) {
  const value = Number(position)
  return position !== null && position !== undefined && Number.isSafeInteger(value) && value >= 1 && value <= 10
    ? value
    : null
}

export default function AuthorStudioRankingPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedId = (searchParams.get('videoId') || '').trim()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    if (!selectedId) {
      setData(null)
      setError('')
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    setData(null)
    setError('')
    setLoading(true)

    getStudioRanking(selectedId, { signal: controller.signal })
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
  }, [selectedId, reload])

  const hasRanking = data?.comparison_complete === true
  const videos = Array.isArray(data?.ranking) ? data.ranking.slice(0, 10) : []
  const orderedVideos = [...videos].sort((a, b) => {
    if (hasRanking) {
      const difference = Number(a.position) - Number(b.position)
      if (Number.isFinite(difference) && difference) return difference
    }
    return publishedTime(b) - publishedTime(a) || String(b.id).localeCompare(String(a.id))
  })
  const timeWindow = formatAgeWindow(data?.age_minutes)
  const selectedVisible = orderedVideos.some(video => video.id === selectedId)

  const footerNavigate = tab => {
    if (tab === 'dashboard') navigate('/author/reel/studio/dashboard')
    if (tab === 'content') navigate('/author/reel/studio')
  }

  return (
    <StudioFrame>
      <StudioBackHeader
        title={t('shadowStudioStats.ranking')}
        onBack={() => navigate('/author/reel/studio/dashboard')}
      />

      <section className="space-y-2">
        <h2 className="text-lg font-bold">{t('shadowStudioRankingDetail.comparable')}</h2>
        <p className="flex items-center gap-2 text-sm text-[var(--shadow-text-secondary)]">
          <Clock3 size={17} aria-hidden="true" />
          {t('shadowStudioRankingDetail.elapsed')}: {timeWindow || t('shadowStudioRankingDetail.elapsedUnknown')}
        </p>
        <p className="text-xs text-[var(--shadow-text-secondary)]">
          {t('shadowStudioStats.compare')}
        </p>
      </section>

      {!selectedId ? <StudioMissing>{t('shadowStudioRankingDetail.noSelection')}</StudioMissing> : null}
      {loading ? (
        <StudioCard>
          <p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.loading')}</p>
        </StudioCard>
      ) : null}
      {!loading && error ? (
        <StudioRetry
          message={error}
          label={t('shadowStudioStats.retry')}
          onRetry={() => setReload(current => current + 1)}
        />
      ) : null}

      {!loading && !error && data ? (
        <section className="space-y-3">
          {hasRanking ? (
            <p className="flex items-start gap-2 text-sm text-[var(--shadow-text-secondary)]">
              <BarChart3 size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              {t('shadowStudioRankingDetail.available')}
            </p>
          ) : (
            <StudioMissing>{t('shadowStudioRankingDetail.unavailable')}</StudioMissing>
          )}

          {videos.length && !selectedVisible ? (
            <StudioMissing>{t('shadowStudioRankingDetail.notRecent')}</StudioMissing>
          ) : null}

          <h3 className="text-sm font-semibold">
            {t(hasRanking ? 'shadowStudioRankingDetail.ranked' : 'shadowStudioRankingDetail.recent')}
          </h3>
          {orderedVideos.length === 0 ? (
            <StudioCard>{t('shadowStudioRankingDetail.noResult')}</StudioCard>
          ) : (
            <StudioCard className="!p-0">
              <div className="divide-y divide-[var(--shadow-border)]">
                {orderedVideos.map(video => {
                  const position = hasRanking ? validRankingPosition(video.position) : null
                  const views = hasRanking && position != null ? Number(video.views_at_equal_age) : null
                  const isSelected = video.id === selectedId
                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics`)}
                      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-[var(--shadow-bg-soft)] sm:px-5 ${isSelected ? 'bg-[var(--shadow-bg-soft)] ring-1 ring-inset ring-[var(--shadow-border)]' : ''}`}
                    >
                      <span className="w-8 shrink-0 text-center text-sm font-bold tabular-nums">
                        {position != null ? `#${position}` : '—'}
                      </span>
                      <StudioThumbnail video={video} className="h-[51px] w-[88px]" />
                      <span className="min-w-0 flex-1 space-y-1">
                        <span className="block truncate text-sm font-semibold">{video.title || '—'}</span>
                        {isSelected ? (
                          <span className="block text-xs text-[var(--shadow-text-secondary)]">
                            {t('shadowStudioRankingDetail.selected')}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-0.5 text-sm tabular-nums">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Eye size={14} aria-hidden="true" />
                          {views != null && Number.isSafeInteger(views) && views >= 0 ? formatStudioCount(views) : '—'}
                        </span>
                        <span className="max-w-[100px] text-right text-[10px] text-[var(--shadow-text-secondary)]">
                          {t('shadowStudioRankingDetail.viewCount')}
                        </span>
                      </span>
                      <ChevronRight size={16} className="shrink-0 text-[var(--shadow-text-secondary)]" aria-hidden="true" />
                    </button>
                  )
                })}
              </div>
            </StudioCard>
          )}
          <StudioMissing>{t('shadowStudioRankingDetail.recentOnly')}</StudioMissing>
        </section>
      ) : null}

      <ShadowStudioFooter
        activeTab="dashboard"
        enabledTabs={['dashboard', 'content']}
        onTabChange={footerNavigate}
      />
    </StudioFrame>
  )
}
