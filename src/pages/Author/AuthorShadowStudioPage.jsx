import { useLocation, useNavigate } from 'react-router-dom'
import AuthorReelGrid from '../../components/author/AuthorReelGrid'

// NEW: Author Page -> Reel -> Shadow Studio (standalone page).
// Reuses the existing owner Reel manager without copying management logic.
export default function AuthorShadowStudioPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const requestedReturnTo = location.state?.returnTo
  const returnTo =
    typeof requestedReturnTo === 'string' &&
    /^\/author\/page(?:\/[^?#]*)?(?:[?#].*)?$/.test(requestedReturnTo)
      ? requestedReturnTo
      : '/author/page'

  return (
    <main className="min-h-[100dvh] bg-[var(--shadow-bg-surface)] px-3 py-5 text-[var(--shadow-text-primary)] sm:px-5">
      <AuthorReelGrid
        isOwner
        studioMode
        onExitStudio={() => navigate(returnTo, { state: { activeTab: 'Reel' } })}
      />
    </main>
  )
}
