import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { listRecentStudioLongVideos } from '../../services/shadowStudioAnalyticsApi'
import {
  StudioBackHeader, StudioCard, StudioFrame, StudioMissing, StudioRetry, StudioThumbnail, studioVideoAge,
} from '../../components/author/studio/ShadowStudioAnalyticsShared'

export default function AuthorStudioRankingPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const selectedId = params.get('videoId') || ''
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [partial, setPartial] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listRecentStudioLongVideos({ take: 10, maxBatches: 5, signal: controller.signal })
      .then(({ videos: result, hasMore }) => {
        if (controller.signal.aborted) return
        setVideos(result)
        setPartial(hasMore && result.length < 10)
        setLoading(false)
      })
      .catch(cause => {
        if (!controller.signal.aborted) {
          setError(cause.message || t('shadowStudioStats.unable'))
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [reload, t])

  const selected = videos.find(video => video.id === selectedId) || videos[0]

  return <StudioFrame>
    <StudioBackHeader title={t('shadowStudioStats.ranking')} onBack={() => navigate('/author/reel/studio/dashboard')} />
    <header className="space-y-1">
      <h2 className="text-lg font-bold">{selected ? t('shadowStudioStats.ageWindow', { age: studioVideoAge(selected.published_at) }) : t('shadowStudioStats.ranking')}</h2>
      <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.compare')}</p>
    </header>
    <StudioMissing>{t('shadowStudioStats.sameAgeUnavailable')}</StudioMissing>
    <h3 className="text-sm font-semibold">{t('shadowStudioStats.recentNotRanked')}</h3>
    {loading ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.loading')}</p></StudioCard> : null}
    {!loading && error ? <StudioRetry message={error} label={t('shadowStudioStats.retry')} onRetry={() => setReload(value => value + 1)}/> : null}
    {!loading && !error && videos.length === 0 ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.noVideos')}</p></StudioCard> : null}
    {!loading && !error && videos.length ? <StudioCard className="!p-0">
      <div className="divide-y divide-[var(--shadow-border)]">
        {videos.map(video => <button key={video.id} type="button"
          onClick={() => navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics`)}
          className={`flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-[var(--shadow-bg-soft)] sm:px-5 ${video.id === selectedId ? 'bg-[var(--shadow-bg-soft)]' : ''}`}>
          <span className="w-5 shrink-0 text-center text-sm text-[var(--shadow-text-secondary)]">—</span>
          <StudioThumbnail video={video} className="h-[50px] w-[85px]" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{video.title}</span>
          <ChevronRight className="shrink-0 text-[var(--shadow-text-secondary)]" size={16}/>
        </button>)}
      </div>
    </StudioCard> : null}
    {!loading && !error && partial ? <StudioMissing>{t('shadowStudioStats.partial')}</StudioMissing> : null}
    <StudioMissing>{t('shadowStudioStats.longNotice')}</StudioMissing>
  </StudioFrame>
}
