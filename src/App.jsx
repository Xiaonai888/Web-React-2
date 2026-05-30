import { lazy, Suspense } from 'react'
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
import RatingPage from './pages/RatingPage'
import EchoPage from './pages/EchoPage'
import ReactionPage from './pages/ReactionPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import Me from './pages/Me/Me'
import CreateAuthorPage from './pages/Author/CreateAuthorPage'
import AuthorDashboardPage from './pages/Author/AuthorDashboardPage'
import CreateStoryPage from './pages/Author/CreateStoryPage'
import StoryManagerPage from './pages/Author/StoryManagerPage'
import EpisodeEditorPage from './pages/Author/EpisodeEditorPage'
import PublishEpisodePage from './pages/Author/PublishEpisodePage'
import EpisodePreviewPage from './pages/Author/EpisodePreviewPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import FollowingAuthorsPage from './pages/Author/FollowingAuthorsPage'
import TopAuthorsPage from './pages/Author/TopAuthorsPage'
import Search from './pages/Search'
import ReaderPage from './pages/ReaderPage'
import AuthorIncomePage from './pages/Author/AuthorIncomePage'
import AuthorPaymentMethodPage from './pages/Author/AuthorPaymentMethodPage'
import AuthorBenefitsPage from './pages/Author/AuthorBenefitsPage'
import AuthorQuestPage from './pages/Author/AuthorQuestPage'
import AuthorPublicPage from './pages/Author/AuthorPublicPage'
import RankingPage from './pages/RankingPage'
import TaskCenterPage from './pages/TaskCenterPage'
import TaskHistoryPage from './pages/TaskHistoryPage'
import AuthorTrashPage from './pages/Author/AuthorTrashPage'




const ShadowMallProductDetailPage = lazy(() => import('./pages/Shop/ShadowMallProductDetailPage'))
const ShadowMallCartPage = lazy(() => import('./pages/Shop/ShadowMallCartPage'))
const ShadowMallOrderHistoryPage = lazy(() => import('./pages/Shop/ShadowMallOrderHistoryPage'))
const ShadowMallWishlistPage = lazy(() => import('./pages/Shop/ShadowMallWishlistPage'))
const ShadowMallCheckoutPage = lazy(() => import('./pages/Shop/ShadowMallCheckoutPage'))
const ShadowMallPaymentPage = lazy(() => import('./pages/Shop/ShadowMallPaymentPage'))
const ShadowMallSectionPage = lazy(() => import('./pages/Shop/ShadowMallSectionPage'))
const ShadowMallNewBooksPage = lazy(() => import('./pages/Shop/ShadowMallNewBooksPage'))
const ShadowMallSearchPage = lazy(() => import('./pages/Shop/ShadowMallSearchPage'))
const ShadowMallDiscountBooksPage = lazy(() => import('./pages/Shop/ShadowMallDiscountBooksPage'))
const ShadowMallSecondHandPage = lazy(() => import('./pages/Shop/ShadowMallSecondHandPage'))
const ShadowMallBestSellerPage = lazy(() => import('./pages/Shop/ShadowMallBestSellerPage'))
const ShadowMallRecentlySoldOutPage = lazy(() => import('./pages/Shop/ShadowMallRecentlySoldOutPage'))
const ShadowMallPreOrderPage = lazy(() => import('./pages/Shop/ShadowMallPreOrderPage'))
const UpdateTodayPage = lazy(() => import('./pages/UpdateTodayPage'))


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

function PageLoading() {
  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 pt-16">
      <div className="mx-auto max-w-[420px] rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
        <div className="text-[14px] font-extrabold text-[#111827]">Loading...</div>
      </div>
    </div>
  )
}

function LazyPage({ children }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>
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
    '/author/income',
    '/author/payment-method',
    '/author/benefits',
    '/author/quest',
    '/author/create-story',
    '/authors/following',
    '/authors/top',
    '/search',
    '/update-today',
    '/tasks',
    '/tasks/history',
    '/author/trash',
  ]

  const shouldHideFooter =
    hideFooterPaths.includes(location.pathname) ||
    location.pathname.startsWith('/story/') ||
    location.pathname.startsWith('/author/story/') ||
    location.pathname.startsWith('/shop/mall/')

  return (
    <>
      <Routes>
        <Route path="/" element={<ForYou />} />
        <Route path="/fast" element={<ComingSoon title="Fast" />} />
        <Route path="/discover" element={<ComingSoon title="Discover" />} />
        <Route path="/library" element={<Library />} />
        <Route path="/me" element={<Me />} />

        <Route path="/shop" element={<ShopPage />} />
        <Route
          path="/shop/mall/product/:productId"
          element={
            <LazyPage>
              <ShadowMallProductDetailPage />
            </LazyPage>
          }
        />
        <Route
          path="/shop/mall/cart"
          element={
            <LazyPage>
              <ShadowMallCartPage />
            </LazyPage>
          }
        />
        <Route
          path="/shop/mall/checkout"
          element={
            <LazyPage>
              <ShadowMallCheckoutPage />
            </LazyPage>
          }
        />

        <Route
  path="/shop/mall/wishlist"
  element={
    <LazyPage>
      <ShadowMallWishlistPage />
    </LazyPage>
  }
/>
        <Route
          path="/shop/mall/payment"
          element={
            <LazyPage>
              <ShadowMallPaymentPage />
            </LazyPage>
          }
        />

        <Route
  path="/shop/mall/orders"
  element={
    <LazyPage>
      <ShadowMallOrderHistoryPage />
    </LazyPage>
  }
/>

        <Route
  path="/shop/mall/section/:sectionKey"
  element={
    <LazyPage>
      <ShadowMallSectionPage />
    </LazyPage>
  }
/>
        <Route
  path="/shop/mall/new-books"
  element={
    <LazyPage>
      <ShadowMallNewBooksPage />
    </LazyPage>
  }
/>

        <Route
  path="/shop/mall/second-hand"
  element={
    <LazyPage>
      <ShadowMallSecondHandPage />
    </LazyPage>
  }
/>
        <Route
  path="/shop/mall/discount-books"
  element={
    <LazyPage>
      <ShadowMallDiscountBooksPage />
    </LazyPage>
  }
/>

        <Route
  path="/shop/mall/best-seller"
  element={
    <LazyPage>
      <ShadowMallBestSellerPage />
    </LazyPage>
  }
/>

        <Route
  path="/shop/mall/search"
  element={
    <LazyPage>
      <ShadowMallSearchPage />
    </LazyPage>
  }
/>
        <Route
  path="/shop/mall/recently-sold-out"
  element={
    <LazyPage>
      <ShadowMallRecentlySoldOutPage />
    </LazyPage>
  }
/>
        <Route
  path="/shop/mall/pre-order"
  element={
    <LazyPage>
      <ShadowMallPreOrderPage />
    </LazyPage>
  }
/>

        <Route
  path="/update-today"
  element={
    <LazyPage>
      <UpdateTodayPage />
    </LazyPage>
  }
/>
        
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/orders" element={<WalletOrderHistoryPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/story/:id" element={<StoryDetailPage />} />
        <Route path="/story/:storyId/rating" element={<RatingPage />} />
        <Route path="/story/:storyId/echo" element={<EchoPage />} />
        <Route path="/story/:storyId/reaction" element={<ReactionPage />} />
        <Route path="/story/:storyId/episode/:episodeId" element={<ReaderPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/author/create" element={<CreateAuthorPage />} />
        <Route path="/author/dashboard" element={<AuthorDashboardPage />} />
        <Route path="/author/create-story" element={<CreateStoryPage />} />
        <Route path="/author/story/:storyId/manage" element={<StoryManagerPage />} />
        <Route path="/author/story/:storyId/episode/create" element={<EpisodeEditorPage />} />
        <Route path="/author/story/:storyId/episode/publish" element={<PublishEpisodePage />} />
        <Route path="/author/story/:storyId/episode/preview" element={<EpisodePreviewPage />} />

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
        <Route path="/author/income" element={<AuthorIncomePage />} />
        <Route path="/author/payment-method" element={<AuthorPaymentMethodPage />} />
        <Route path="/author/benefits" element={<AuthorBenefitsPage />} />
        <Route path="/author/quest" element={<AuthorQuestPage />} />
        <Route path="/author/page/:pageUsername" element={<AuthorPublicPage />} />
        <Route path="/author/page" element={<AuthorPublicPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/tasks" element={<TaskCenterPage />} />
        <Route path="/tasks/history" element={<TaskHistoryPage />} />
        <Route path="/author/trash" element={<AuthorTrashPage />} />

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
