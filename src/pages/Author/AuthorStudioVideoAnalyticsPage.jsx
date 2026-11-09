import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BarChart3, Clock3, Eye, MousePointerClick, UsersRound } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { getStudioPublishedVideo } from '../../services/shadowStudioAnalyticsApi'
import {
  StudioBackHeader, StudioCard, StudioEmptyGraph, StudioFrame, StudioMetric,
  StudioMissing, StudioRetry,
} from '../../components/author/studio/ShadowStudioAnalyticsShared'

const SECTIONS = ['overview', 'reach', 'engagement', 'audience']

export default function AuthorStudioVideoAnalyticsPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const { videoId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSection = SECTIONS.includes(searchParams.get('section')) ? searchParams.get('section') : 'overview'
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setVideo(null)
    setError('')
    getStudioPublishedVideo(videoId, { signal: controller.signal })
      .then(video => {
        if (!controller.signal.aborted) {
          setVideo(video)
          setLoading(false)
        }
      })
      .catch(cause => {
        if (!controller.signal.aborted) {
          setError(cause.message || t('shadowStudioStats.unable'))
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [videoId, reload, t])

  const views = video?.view_count != null && Number.isFinite(Number(video.view_count)) ? Number(video.view_count) : null
  const pickSection = section => setSearchParams({ section }, { replace: true })

  return <StudioFrame>
    <StudioBackHeader video={video} title={video?.title || t('shadowStudioStats.analytics')} onBack={() => navigate('/author/reel/studio/dashboard')} />
    <nav className="-mx-4 flex gap-5 overflow-x-auto border-b border-[var(--shadow-border)] px-4 sm:mx-0 sm:px-0" aria-label={t('shadowStudioStats.analytics')}>
      {SECTIONS.map(section => <button key={section} type="button" onClick={() => pickSection(section)} aria-current={currentSection === section ? 'page' : undefined}
        className={`shrink-0 border-b-2 pb-3 text-sm ${currentSection === section ? 'border-[var(--shadow-text-primary)] font-semibold text-[var(--shadow-text-primary)]' : 'border-transparent text-[var(--shadow-text-secondary)]'}`}>
        {t(`shadowStudioStats.${section}`)}
      </button>)}
    </nav>
    {loading ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.loading')}</p></StudioCard> : null}
    {!loading && error ? <StudioRetry message={error} label={t('shadowStudioStats.retry')} onRetry={() => setReload(current => current + 1)} /> : null}
    {!loading && !error && !video ? <StudioMissing>{t('shadowStudioStats.videoMissing')}</StudioMissing> : null}
    {!loading && !error && video ? <div className="space-y-5">
      {currentSection === 'overview' ? <>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <StudioMetric label={t('shadowStudioStats.sincePublished')} value={views} icon={Eye} subtitle={t('shadowStudioStats.lifetime')} />
          <StudioMetric label={t('shadowStudioStats.watchTime')} value={null} icon={Clock3} />
        </div>
        <StudioEmptyGraph title={t('shadowStudioStats.views')} subtitle={t('shadowStudioStats.noChart')} />
        <StudioCard className="space-y-4">
          <h2 className="font-bold">{t('shadowStudioStats.traffic')}</h2>
          <StudioMissing>{t('shadowStudioStats.sourceMissing')}</StudioMissing>
        </StudioCard>
        <StudioEmptyGraph title={t('shadowStudioStats.retention')} subtitle={t('shadowStudioStats.noChart')} />
        <StudioCard className="space-y-4">
          <div className="flex items-center justify-between gap-3"><h2 className="font-bold">{t('shadowStudioStats.realtime')}</h2><BarChart3 size={19}/></div>
          <p className="text-xl font-bold">—</p><p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.last48')}</p>
          <StudioMissing>{t('shadowStudioStats.sourceMissing')}</StudioMissing>
        </StudioCard>
      </> : null}
      {currentSection === 'reach' ? <>
        <div className="grid grid-cols-2 gap-2 sm:gap-3"><StudioMetric label={t('shadowStudioStats.views')} value={views} icon={Eye} /><StudioMetric label={t('shadowStudioStats.ctr')} value={null} icon={MousePointerClick}/></div>
        <StudioEmptyGraph title={t('shadowStudioStats.traffic')} subtitle={t('shadowStudioStats.noChart')}/>
        <StudioCard className="space-y-3"><h2 className="font-semibold">{t('shadowStudioStats.topSources')}</h2><StudioMissing>{t('shadowStudioStats.sourceMissing')}</StudioMissing></StudioCard>
      </> : null}
      {currentSection === 'engagement' ? <>
        <div className="grid grid-cols-2 gap-2 sm:gap-3"><StudioMetric label={t('shadowStudioStats.watchTime')} value={null} icon={Clock3}/><StudioMetric label={t('shadowStudioStats.average')} value={null} icon={BarChart3}/></div>
        <StudioEmptyGraph title={t('shadowStudioStats.retention')} subtitle={t('shadowStudioStats.noChart')}/>
      </> : null}
      {currentSection === 'audience' ? <>
        <StudioMetric label={t('shadowStudioStats.audience')} value={null} icon={UsersRound}/>
        <StudioEmptyGraph title={t('shadowStudioStats.audience')} subtitle={t('shadowStudioStats.noChart')}/>
      </> : null}
      <StudioMissing>{t('shadowStudioStats.sourceMissing')}</StudioMissing>
    </div> : null}
  </StudioFrame>
}
