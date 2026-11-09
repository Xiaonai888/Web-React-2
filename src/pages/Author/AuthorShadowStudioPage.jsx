
import { useLocation, useNavigate } from 'react-router-dom'
import AuthorReelGrid from '../../components/author/AuthorReelGrid'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'

export default function AuthorShadowStudioPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const requestedReturnTo = location.state?.returnTo

  const returnTo =
    typeof requestedReturnTo === 'string' &&
    /^\/author\/page(?:\/[^?#]*)?(?:[?#].*)?$/.test(requestedReturnTo)
      ? requestedReturnTo
      : '/author/page'

  const handleStudioTab = (tab) => {
    if (tab === 'dashboard') {
      navigate('/author/reel/studio/dashboard')
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--shadow-bg-surface)] px-3 py-5 pb-28 text-[var(--shadow-text-primary)] sm:px-5">
      <AuthorReelGrid
        isOwner
        studioMode
        onExitStudio={() =>
          navigate(returnTo, {
            state: { activeTab: 'Reel' },
          })
        }
      />

      <ShadowStudioFooter
        activeTab="content"
        enabledTabs={['dashboard', 'content']}
        onTabChange={handleStudioTab}
      />
    </main>
  )
}
