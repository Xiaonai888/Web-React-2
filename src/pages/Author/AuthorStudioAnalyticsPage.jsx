import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import { StudioBackHeader, StudioCard, StudioFrame, StudioRetry } from '../../components/author/studio/ShadowStudioAnalyticsShared'
import StudioChannelOverview from '../../components/author/studio/channel/StudioChannelOverview'
import StudioChannelContent from '../../components/author/studio/channel/StudioChannelContent'
import StudioChannelAudience from '../../components/author/studio/channel/StudioChannelAudience'
import StudioChannelTrends from '../../components/author/studio/channel/StudioChannelTrends'
import useStudioChannelAnalyticsData from '../../components/author/studio/channel/useStudioChannelAnalyticsData'
import '../../components/author/studio/channel/ShadowStudioChannelCopy'
import '../../components/author/studio/channel/ShadowStudioChannelExtraCopy'

const SECTIONS = ['overview', 'content', 'audience', 'trends']

export default function AuthorStudioAnalyticsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const l = key => t(`shadowStudioChannel.${key}`)
  const extra = key => t(`shadowStudioChannelExtra.${key}`)
  const [section, setSection] = useState('overview')
  const [format, setFormat] = useState('all')
  const { data, error, loading, retry, supported } = useStudioChannelAnalyticsData(section, format)

  const openVideo = video => {
    if (!video?.id) return
    navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics?section=overview`, {
      state: { fromContent: false },
    })
  }
  const footerNavigate = tab => {
    if (tab === 'dashboard') navigate('/author/reel/studio/dashboard')
    if (tab === 'content') navigate('/author/reel/studio')
  }

  return <>
    <StudioFrame>
      <StudioBackHeader title={l('title')} onBack={() => navigate('/author/reel/studio/dashboard')} />
      <nav aria-label={extra('selectSection')} className="-mx-4 flex gap-5 overflow-x-auto border-b border-[var(--shadow-border)] px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {SECTIONS.map(item => <button key={item} type="button" onClick={() => setSection(item)}
          aria-current={section === item ? 'page' : undefined}
          className={`shrink-0 border-b-2 pb-3 text-sm ${section === item ? 'border-[var(--shadow-text-primary)] font-semibold' : 'border-transparent text-[var(--shadow-text-secondary)]'}`}>
          {l(item)}
        </button>)}
      </nav>
      <p className="text-xs text-[var(--shadow-text-secondary)]">{extra('last30Fixed')}</p>
      {section === 'content' && !error ? <StudioChannelContent format={format} data={data} onFormatChange={setFormat}
        onOpenVideo={openVideo} loading={loading} /> : null}
      {section === 'overview' && !error && !loading ? <StudioChannelOverview data={data} onOpenVideo={openVideo} /> : null}
      {section === 'audience' ? <StudioChannelAudience /> : null}
      {section === 'trends' ? <StudioChannelTrends /> : null}
      {supported && loading && section !== 'content' ? <StudioCard><p role="status" className="text-sm text-[var(--shadow-text-secondary)]">{l('loading')}</p></StudioCard> : null}
      {supported && !loading && error ? <StudioRetry message={error} label={l('retry')} onRetry={retry} /> : null}
    </StudioFrame>
    <ShadowStudioFooter activeTab="analytics" enabledTabs={['dashboard', 'content', 'analytics']}
      onTabChange={footerNavigate} />
  </>
}
