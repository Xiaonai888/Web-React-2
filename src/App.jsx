import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Footer from './components/Footer'
import ForYou from './pages/ForYou'
import Library from './pages/Library'
import ShopPage from './pages/ShopPage'
import WalletPage from './pages/WalletPage'
import WalletOrderHistoryPage from './pages/WalletOrderHistoryPage'
import EventPage from './pages/EventPage'
import ProfilePage from './pages/ProfilePage'
import StoryDetailPage from './pages/StoryDetailPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import Me from './pages/Me/Me'
import CreateAuthorPage from './pages/Author/CreateAuthorPage'
import AuthorDashboardPage from './pages/Author/AuthorDashboardPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import FollowingAuthorsPage from './pages/Author/FollowingAuthorsPage'
import TopAuthorsPage from './pages/Author/TopAuthorsPage'
import Search from './pages/Search'
import ReaderPage from './pages/ReaderPage'

function ComingSoon({ title }) {
  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 pb-[110px] pt-10">
      <div className="mx-auto max-w-[560px] rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
        <h1 className="text-[22px] font-extrabold text-[#111827]">{title}</h1>
        <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
          This page is ready for a future update.
        </p>
      </div>
    </div>
  )
}

function AppShell() {
  const location = useLocation()
  const hideFooterPaths = [
    '/login',
    '/register',
    '/shop',
    '/wallet',
    '/wallet/orders',
    '/profile',
    '/event',
    '/author/create',
    '/author/dashboard',
    '/authors/following',
    '/authors/top',
    '/search',
  ]

  const shouldHideFooter =
    hideFooterPaths.includes(location.pathname) || location.pathname.startsWith('/story/')

  return (
    <>
      <Routes>
        <Route path="/" element={<ForYou />} />
        <Route path="/fast" element={<ComingSoon title="Fast" />} />
        <Route path="/discover" element={<ComingSoon title="Discover" />} />
        <Route path="/library" element={<Library />} />
        <Route path="/me" element={<Me />} />

        <Route path="/shop" element={<ShopPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/orders" element={<WalletOrderHistoryPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/story/:id" element={<StoryDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/author/create" element={<CreateAuthorPage />} />
        <Route path="/author/dashboard" element={<AuthorDashboardPage />} />

        <Route path="/check-in" element={<ComingSoon title="Check-in" />} />
        <Route path="/premium" element={<ComingSoon title="Premium" />} />
        <Route path="/inbox" element={<ComingSoon title="Inbox" />} />
        <Route path="/comments" element={<ComingSoon title="My Comments" />} />
        <Route path="/feedback" element={<ComingSoon title="Feedback" />} />
        <Route path="/help" element={<ComingSoon title="Help Center" />} />
        <Route path="/about" element={<ComingSoon title="About Us" />} />
        <Route path="/settings" element={<ComingSoon title="Settings" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/authors/following" element={<FollowingAuthorsPage />} />
        <Route path="/authors/top" element={<TopAuthorsPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/story/:storyId/episode/:episodeId" element={<ReaderPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!shouldHideFooter ? <Footer /> : null}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}
