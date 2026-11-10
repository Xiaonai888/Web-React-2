import { useLocation, useNavigate } from 'react-router-dom'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import ShadowStudioContentWorkspace from '../../components/author/studio/content/ShadowStudioContentWorkspace'

export default function AuthorShadowStudioPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const requestedReturnTo = location.state?.returnTo
  const returnTo = typeof requestedReturnTo === 'string' &&
    /^\/author\/page(?:\/[^?#]*)?(?:[?#].*)?$/.test(requestedReturnTo)
    ? requestedReturnTo : '/author/page'

  const addVideo = () => navigate('/author/reel/add', {
    state: { returnTo: '/author/reel/studio' },
  })
  const viewAnalytics = video => {
    if (!video?.id) return
    navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics?section=overview`, { state: { fromContent: true } })
  }

  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-surface)] px-3 py-5 pb-28 text-[var(--shadow-text-primary)] sm:px-5">
    <ShadowStudioContentWorkspace
      onExitStudio={() => navigate(returnTo, { state: { activeTab: 'Reel' } })}
      onAddVideo={addVideo}
      onViewAnalytics={viewAnalytics}
    />
    <ShadowStudioFooter activeTab="content" enabledTabs={['dashboard', 'content']}
      onTabChange={tab => { if (tab === 'dashboard') navigate('/author/reel/studio/dashboard') }}/>
  </main>
}
