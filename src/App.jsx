import { lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Footer from './components/Footer'
import ForYou from './pages/ForYou'
import Library from './pages/Library'
import ShopPage from './pages/ShopPage'
import WalletPage from './pages/WalletPage'
import WalletOrderHistoryPage from './pages/WalletOrderHistoryPage'
import EventPage from './pages/EventPage'
import ProfilePage from './pages/ProfilePage'
import ProfileFollowListPage from './pages/ProfileFollowListPage'
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
import NotificationPage from './pages/NotificationPage'
import AdvertisementPopup from './components/AdvertisementPopup'
const MeCommentsPage = lazy(() => import('./pages/Me/MeCommentsPage'))
import PublishBlockedWarningPage from './pages/Author/PublishBlockedWarningPage'



const TopNovelPage = lazy(() => import('./pages/TopNovelPage'))
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
const GenresPage = lazy(() => import('./pages/GenresPage'))
const RomanceGenrePage = lazy(() => import('./pages/Genre/RomanceGenrePage'))
const FantasyGenrePage = lazy(() => import('./pages/Genre/FantasyGenrePage'))
const ActionGenrePage = lazy(() => import('./pages/Genre/ActionGenrePage'))
const ComedyGenrePage = lazy(() => import('./pages/Genre/ComedyGenrePage'))
const AdventureGenrePage = lazy(() => import('./pages/Genre/AdventureGenrePage'))
const SchoolLifeGenrePage = lazy(() => import('./pages/Genre/SchoolLifeGenrePage'))
const HistoricalGenrePage = lazy(() => import('./pages/Genre/HistoricalGenrePage'))
const MysteryGenrePage = lazy(() => import('./pages/Genre/MysteryGenrePage'))
const HorrorGenrePage = lazy(() => import('./pages/Genre/HorrorGenrePage'))
const LGBTQGenrePage = lazy(() => import('./pages/Genre/LGBTQGenrePage'))
const SciFiGenrePage = lazy(() => import('./pages/Genre/SciFiGenrePage'))
const DramaGenrePage = lazy(() => import('./pages/Genre/DramaGenrePage'))
const ThrillerGenrePage = lazy(() => import('./pages/Genre/ThrillerGenrePage'))
const SystemGenrePage = lazy(() => import('./pages/Genre/SystemGenrePage'))
const IsekaiGenrePage = lazy(() => import('./pages/Genre/IsekaiGenrePage'))
const SupernaturalGenrePage = lazy(() => import('./pages/Genre/SupernaturalGenrePage'))
const MartialArtsGenrePage = lazy(() => import('./pages/Genre/MartialArtsGenrePage'))
const RevengeGenrePage = lazy(() => import('./pages/Genre/RevengeGenrePage'))
const CEOGenrePage = lazy(() => import('./pages/Genre/CEOGenrePage'))
const SlowBurnGenrePage = lazy(() => import('./pages/Genre/SlowBurnGenrePage'))
const EnemiesToLoversGenrePage = lazy(() => import('./pages/Genre/EnemiesToLoversGenrePage'))
const TimeTravelGenrePage = lazy(() => import('./pages/Genre/TimeTravelGenrePage'))
const StrongFemaleLeadGenrePage = lazy(() => import('./pages/Genre/StrongFemaleLeadGenrePage'))
const HiddenIdentityGenrePage = lazy(() => import('./pages/Genre/HiddenIdentityGenrePage'))
const RoyaltyGenrePage = lazy(() => import('./pages/Genre/RoyaltyGenrePage'))
const MagicGenrePage = lazy(() => import('./pages/Genre/MagicGenrePage'))
const SecondChanceGenrePage = lazy(() => import('./pages/Genre/SecondChanceGenrePage'))
const ColdMaleLeadGenrePage = lazy(() => import('./pages/Genre/ColdMaleLeadGenrePage'))
const BLGenrePage = lazy(() => import('./pages/Genre/BLGenrePage'))
const GLGenrePage = lazy(() => import('./pages/Genre/GLGenrePage'))


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
  const [adStep, setAdStep] = useState('splash')
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
    '/authors/top',
    '/search',
    '/notifications',
    '/update-today',
    '/tasks',
    '/tasks/history',
    '/author/trash',
    '/comments',
    
  ]

  const shouldHideFooter =
  hideFooterPaths.includes(location.pathname) ||
  location.pathname.startsWith('/story/') ||
  location.pathname.startsWith('/author/story/') ||
  location.pathname.startsWith('/shop/mall/') ||
  location.pathname.startsWith('/profile/') ||
  location.pathname.startsWith('/notifications/')
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

        <Route
  path="/genre/romance"
  element={
    <LazyPage>
      <RomanceGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/fantasy"
  element={
    <LazyPage>
      <FantasyGenrePage />
    </LazyPage>
  }
/>
        <Route
  path="/genre/action"
  element={
    <LazyPage>
      <ActionGenrePage />
    </LazyPage>
  }
/>
        <Route
  path="/genre/comedy"
  element={
    <LazyPage>
      <ComedyGenrePage />
    </LazyPage>
  }
/>
        <Route
  path="/genre/adventure"
  element={
    <LazyPage>
      <AdventureGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/school-life"
  element={
    <LazyPage>
      <SchoolLifeGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/historical"
  element={
    <LazyPage>
      <HistoricalGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/mystery"
  element={
    <LazyPage>
      <MysteryGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/horror"
  element={
    <LazyPage>
      <HorrorGenrePage />
    </LazyPage>
  }
/>

<Route
  path="/genre/lgbtq"
  element={
    <LazyPage>
      <LGBTQGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/sci-fi"
  element={
    <LazyPage>
      <SciFiGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/drama"
  element={
    <LazyPage>
      <DramaGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/thriller"
  element={
    <LazyPage>
      <ThrillerGenrePage />
    </LazyPage>
  }
/>


        <Route
  path="/genre/system"
  element={
    <LazyPage>
      <SystemGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/isekai"
  element={
    <LazyPage>
      <IsekaiGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/supernatural"
  element={
    <LazyPage>
      <SupernaturalGenrePage />
    </LazyPage>
  }
/>


        <Route
  path="/genre/martial-arts"
  element={
    <LazyPage>
      <MartialArtsGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/revenge"
  element={
    <LazyPage>
      <RevengeGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/ceo"
  element={
    <LazyPage>
      <CEOGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/slow-burn"
  element={
    <LazyPage>
      <SlowBurnGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/enemies-to-lovers"
  element={
    <LazyPage>
      <EnemiesToLoversGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/time-travel"
  element={
    <LazyPage>
      <TimeTravelGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/strong-female-lead"
  element={
    <LazyPage>
      <StrongFemaleLeadGenrePage />
    </LazyPage>
  }
/>
        <Route
  path="/genre/hidden-identity"
  element={
    <LazyPage>
      <HiddenIdentityGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/royalty"
  element={
    <LazyPage>
      <RoyaltyGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/magic"
  element={
    <LazyPage>
      <MagicGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/second-chance"
  element={
    <LazyPage>
      <SecondChanceGenrePage />
    </LazyPage>
  }
/>
        <Route
  path="/genre/cold-male-lead"
  element={
    <LazyPage>
      <ColdMaleLeadGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/bl"
  element={
    <LazyPage>
      <BLGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genre/gl"
  element={
    <LazyPage>
      <GLGenrePage />
    </LazyPage>
  }
/>

        <Route
  path="/genres"
  element={
    <LazyPage>
      <GenresPage />
    </LazyPage>
  }
/>

        <Route
  path="/top-novel"
  element={
    <LazyPage>
      <TopNovelPage />
    </LazyPage>
  }
/>
        
<Route
  path="/comments"
  element={
    <LazyPage>
      <MeCommentsPage />
    </LazyPage>
  }
/>

        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/orders" element={<WalletOrderHistoryPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username/:listType" element={<ProfileFollowListPage />} />
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
        <Route path="/author/story/:storyId/episode/publish-warning" element={<PublishBlockedWarningPage />} />
        <Route path="/author/story/:storyId/episode/preview" element={<EpisodePreviewPage />} />
        <Route path="/check-in" element={<ComingSoon title="Check-in" />} />
        <Route path="/premium" element={<ComingSoon title="Premium" />} />
        <Route path="/inbox" element={<ComingSoon title="Inbox" />} />
        <Route path="/comments" element={<ComingSoon title="My Comments" />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/feedback" element={<ComingSoon title="Feedback" />} />
        <Route path="/help" element={<ComingSoon title="Help Center" />} />
        <Route path="/about" element={<ComingSoon title="About Us" />} />
        <Route path="/settings" element={<ComingSoon title="Settings" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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

      {adStep === 'splash' ? (
  <AdvertisementPopup placement="splash" blocking onFinish={() => setAdStep('opening')} />
) : null}

{adStep === 'opening' ? (
  <AdvertisementPopup placement="opening" blocking onFinish={() => setAdStep('done')} />
) : null}

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
