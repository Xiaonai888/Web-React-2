import { lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SmartRefreshProvider } from './providers/SmartRefreshProvider'
import Fast from './pages/Fast'
import Footer from './components/Footer'
import ForYou from './pages/ForYou'
import Library from './pages/Library'
import ShopPage from './pages/ShopPage'
import WalletPage from './pages/WalletPage'
import WalletOrderHistoryPage from './pages/WalletOrderHistoryPage'
import EventPage from './pages/EventPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import EditProfileLinksPage from './pages/EditProfileLinksPage'
import ProfileFollowListPage from './pages/ProfileFollowListPage'
import StoryDetailPage from './pages/StoryDetailPage'
import RatingPage from './pages/RatingPage'
import ReactionPage from './pages/ReactionPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import Me from './pages/Me/Me'
import CreateAuthorPage from './pages/Author/CreateAuthorPage'
import AuthorDashboardPage from './pages/Author/AuthorDashboardPage'
import AuthorProfilePage from './pages/Author/AuthorProfilePage'
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
import PublishBlockedWarningPage from './pages/Author/PublishBlockedWarningPage'
import InboxPage from './pages/InboxPage'
import AuthorCommentProtectionPage from './pages/Author/AuthorCommentProtectionPage'
import TermsPoliciesPage from './pages/Auth/TermsPoliciesPage'
import VisitorTracker from './components/VisitorTracker'
import AuthorPageEditDetailsPage from './pages/Author/AuthorPageEditDetailsPage'
import PremiumPage from './pages/Me/PremiumPage'
import AuthorInsightsPage from "./pages/Author/AuthorInsightsPage";





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
const DailyPicksPage = lazy(() => import('./pages/DailyPicksPage'))
const YouMightLikePage = lazy(() => import('./pages/YouMightLikePage'))
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
const AuthorStoreManagerPage = lazy(() => import('./pages/Author/AuthorStoreManagerPage'))
const AuthorEditPage = lazy(() => import('./pages/Author/AuthorEditPage'))
const AuthorPageDashboardPage = lazy(() => import('./pages/Author/AuthorPageDashboardPage'))
const AuthorPageNotificationsPage = lazy(() => import('./pages/Author/AuthorPageNotificationsPage'))
const AuthorPageSettingsPage = lazy(() => import('./pages/Author/AuthorPageSettingsPage'))
const AuthorCartPage = lazy(() => import('./pages/Author/AuthorCartPage'))
const AuthorCheckoutPage = lazy(() => import('./pages/Author/AuthorCheckoutPage'))
const AuthorOrderHistoryPage = lazy(() => import('./pages/Author/AuthorOrderHistoryPage'))
const AuthorStoreProductDetailPage = lazy(() => import('./pages/Author/AuthorStoreProductDetailPage'))
const AuthorStoreCategoryPage = lazy(() => import('./pages/Author/AuthorStoreCategoryPage'))
const AuthorPageFinancePage = lazy(() => import('./pages/Author/AuthorPageFinancePage'))
const AuthorPageIncomePage = lazy(() => import('./pages/Author/AuthorPageIncomePage'))
const AuthorPageWithdrawalPage = lazy(() => import('./pages/Author/AuthorPageWithdrawalPage'))
const ShadowMallPurchasePage = lazy(() => import('./pages/Shop/ShadowMallPurchasePage'))
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'))
const AuthorPageOptionsPage = lazy(() => import('./pages/Author/AuthorPageOptionsPage'))
const AuthorReaderPageOptionsPage = lazy(() => import('./pages/Author/AuthorReaderPageOptionsPage'))
const AuthorFollowersPage = lazy(() => import('./pages/Author/AuthorFollowersPage'))
const AuthorTopFansPage = lazy(() => import('./pages/Author/AuthorTopFansPage'))
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'))
const CompletedPage = lazy(() => import('./pages/CompletedPage'))
const MostReadThisWeekPage = lazy(() => import('./pages/MostReadThisWeekPage'))
const GiftGuidePage = lazy(() => import('./pages/GiftGuidePage'))
const StoryTopFansPage = lazy(() => import('./pages/StoryTopFansPage'))
const TopFansGuidePage = lazy(() => import('./pages/TopFansGuidePage'))
const EpisodeReactionsPage = lazy(() => import('./pages/EpisodeReactionsPage'))
const FastStudioPage = lazy(() => import('./pages/FastStudioPage'))
const FastCreateVideoPage = lazy(() => import('./pages/FastCreateVideoPage'))
const ReportPage = lazy(() => import('./pages/ReportPage'))
const MeCommentsPage = lazy(() => import('./pages/Me/MeCommentsPage'))
const EpisodeEchoesPage = lazy(() => import('./pages/EpisodeEchoesPage'))
const CreateAuthorStoryPage = lazy(() => import('./pages/Author/CreateAuthorStoryPage'))
const SavedPostsPage = lazy(() => import('./pages/Me/SavedPostsPage'))
const AboutUsPage = lazy(() => import('./pages/Me/AboutUsPage'))
const HelpCenterPage = lazy(() => import('./pages/Me/HelpCenterPage'))
const FeedbackSupportPage = lazy(() => import('./pages/Me/FeedbackSupportPage'))


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
    '/author/profile',
    '/author/insights',
    '/author/income',
    '/author/payment-method',
    '/author/benefits',
    '/author/quest',
    '/author/create-story',
    '/authors/top',
    '/search',
    '/notifications',
    '/update-today',
    '/daily-picks',
    '/you-might-like',
    '/tasks',
    '/tasks/history',
    '/author/trash',
    '/comments',
    '/saved-posts',
    '/author/comment-protection',
    '/author/page-settings',
    '/author/page/edit',
    '/author/edit-page',
    '/author/cart',
    '/author/checkout',
    '/author/orders',
    '/most-read-this-week',
    '/gift-guide',
    '/premium',
    '/about',
    '/help',
    '/feedback',
  ]

  const shouldHideFooter =
  hideFooterPaths.includes(location.pathname) ||
  location.pathname.startsWith('/story/') ||
  location.pathname.startsWith('/report/') ||
  location.pathname.startsWith('/author/post/') ||
  location.pathname.startsWith('/author/story/') ||
  location.pathname === '/author/page' ||
  location.pathname.startsWith('/author/page/') ||
  location.pathname.startsWith('/shop/mall/') ||
  location.pathname.startsWith('/profile/') ||
  location.pathname.startsWith('/notifications/')
  const readerToken =
  sessionStorage.getItem('shadow_reader_token') ||
  localStorage.getItem('shadow_reader_token') ||
  ''

const shouldShowOpeningAds =
  Boolean(readerToken) &&
  location.pathname !== '/login' &&
  location.pathname !== '/register' &&
  location.pathname !== '/forgot-password' &&
  location.pathname !== '/reset-password'

  const shouldShowMeAd =
    location.pathname === '/me' &&
    (!shouldShowOpeningAds || adStep === 'done')

  return (
    <>
      <VisitorTracker />
      <Routes>
        <Route path="/" element={<ForYou />} />
        <Route path="/fast" element={<Fast />} />
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
  path="/daily-picks"
  element={
    <LazyPage>
      <DailyPicksPage />
    </LazyPage>
  }
/>

<Route
  path="/you-might-like"
  element={
    <LazyPage>
      <YouMightLikePage />
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

        <Route
  path="/saved-posts"
  element={
    <LazyPage>
      <SavedPostsPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/cart"
  element={
    <LazyPage>
      <AuthorCartPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/checkout"
  element={
    <LazyPage>
      <AuthorCheckoutPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page/store"
  element={
    <LazyPage>
      <AuthorStoreManagerPage />
    </LazyPage>
  }
/>
<Route
  path="/author/page/:pageUsername/store/category/:categoryKey"
  element={
    <LazyPage>
      <AuthorStoreCategoryPage />
    </LazyPage>
  }
/>
        
        <Route
  path="/author/page/:pageUsername/store/product/:productId"
  element={
    <LazyPage>
      <AuthorStoreProductDetailPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/edit-page"
  element={
    <LazyPage>
      <AuthorEditPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page/dashboard"
  element={
    <LazyPage>
      <AuthorPageDashboardPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page/notifications"
  element={
    <LazyPage>
      <AuthorPageNotificationsPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page-settings"
  element={
    <LazyPage>
      <AuthorPageSettingsPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page/edit"
  element={
    <LazyPage>
      <AuthorPageEditDetailsPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/cart"
  element={
    <LazyPage>
      <AuthorCartPage />
    </LazyPage>
  }
/>

<Route
  path="/author/orders"
  element={
    <LazyPage>
      <AuthorOrderHistoryPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page/store/withdrawal"
  element={<Navigate to="/author/page/finance/withdrawal" replace />}
/>


        <Route
  path="/author/page/finance"
  element={
    <LazyPage>
      <AuthorPageFinancePage />
    </LazyPage>
  }
/>

<Route
  path="/author/page/finance/income"
  element={
    <LazyPage>
      <AuthorPageIncomePage />
    </LazyPage>
  }
/>


<Route
  path="/author/page/finance/withdrawal"
  element={
    <LazyPage>
      <AuthorPageWithdrawalPage />
    </LazyPage>
  }
/>

        <Route
  path="/shop/mall/purchase"
  element={
    <LazyPage>
      <ShadowMallPurchasePage />
    </LazyPage>
  }
/>

        <Route
  path="/discover"
  element={
    <LazyPage>
      <DiscoverPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page-options"
  element={
    <LazyPage>
      <AuthorPageOptionsPage />
    </LazyPage>
  }
/>
        <Route
  path="/author/page/:pageUsername/options"
  element={
    <LazyPage>
      <AuthorReaderPageOptionsPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/page/:pageUsername/followers"
  element={
    <LazyPage>
      <AuthorFollowersPage />
    </LazyPage>
  }
/>

      <Route
  path="/author/page/:pageUsername/top-fans"
  element={
    <LazyPage>
      <AuthorTopFansPage />
    </LazyPage>
  }
/>

      <Route
  path="/discover"
  element={
    <LazyPage>
      <DiscoverPage />
    </LazyPage>
  }
/>

      <Route
  path="/new-arrivals"
  element={
    <LazyPage>
      <NewArrivalsPage />
    </LazyPage>
  }
/>

      <Route
  path="/completed"
  element={
    <LazyPage>
      <CompletedPage />
    </LazyPage>
  }
/>

      <Route
  path="/most-read-this-week"
  element={
    <LazyPage>
      <MostReadThisWeekPage />
    </LazyPage>
  }
/>

      <Route
  path="/gift-guide"
  element={
    <LazyPage>
      <GiftGuidePage />
    </LazyPage>
  }
/>
      <Route
  path="/story/:storyId/top-fans"
  element={
    <LazyPage>
      <StoryTopFansPage />
    </LazyPage>
  }
/>

      <Route
  path="/story/:storyId/top-fans-guide"
  element={
    <LazyPage>
      <TopFansGuidePage />
    </LazyPage>
  }
/>

      <Route
  path="/story/:storyId/episode/:episodeId/reactions"
  element={
    <LazyPage>
      <EpisodeReactionsPage />
    </LazyPage>
  }
/>

      <Route
  path="/story/:storyId/episode/:episodeId/echoes"
  element={
    <LazyPage>
      <EpisodeEchoesPage />
    </LazyPage>
  }
/>
      
<Route
  path="/author/page/story/create"
  element={<LazyPage><CreateAuthorStoryPage /></LazyPage>}
/>

      <Route
  path="/fast/studio"
  element={
    <LazyPage>
      <FastStudioPage />
    </LazyPage>
  }
/>

      <Route
          path="/report/:reportType/:targetId"
          element={
            <LazyPage>
              <ReportPage />
            </LazyPage>
          }
        />

        <Route
  path="/about"
  element={
    <LazyPage>
      <AboutUsPage />
    </LazyPage>
  }
/>

      
        <Route path="/story/:storyId/episode/:episodeId" element={<ReaderPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/orders" element={<WalletOrderHistoryPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/edit/links" element={<EditProfileLinksPage />} />
        <Route path="/profile/:username/:listType" element={<ProfileFollowListPage />} />
        <Route path="/story/:id" element={<StoryDetailPage />} />
        <Route path="/story/:storyId/rating" element={<RatingPage />} />
        <Route path="/story/:storyId/reaction" element={<ReactionPage />} />
        <Route path="/story/:storyId/episode/:episodeId" element={<ReaderPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms" element={<TermsPoliciesPage />} />
        <Route path="/author/agreement" element={<TermsPoliciesPage />} />

        <Route path="/author/create" element={<CreateAuthorPage />} />
        <Route path="/author/dashboard" element={<AuthorDashboardPage />} />
        <Route path="/author/profile" element={<AuthorProfilePage />} />
        <Route path="/author/insights" element={<AuthorInsightsPage />} />
        <Route path="/author/create-story" element={<CreateStoryPage />} />
        <Route path="/author/story/:storyId/manage" element={<StoryManagerPage />} />
        <Route path="/author/story/:storyId/episode/create" element={<EpisodeEditorPage />} />
        <Route path="/author/story/:storyId/episode/publish" element={<PublishEpisodePage />} />
        <Route path="/author/story/:storyId/episode/publish-warning" element={<PublishBlockedWarningPage />} />
        <Route path="/author/story/:storyId/episode/preview" element={<EpisodePreviewPage />} />
        <Route path="/check-in" element={<ComingSoon title="Check-in" />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/comments" element={<ComingSoon title="My Comments" />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/feedback" element={<LazyPage><FeedbackSupportPage /></LazyPage>} />
        <Route path="/help" element={<LazyPage><HelpCenterPage /></LazyPage>} />
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
        <Route path="/author/comment-protection" element={<AuthorCommentProtectionPage />} />
        <Route path="/story/:storyId/episode/:episodeId" element={<ReaderPage />} />
        <Route path="/fast/studio" element={<LazyPage><FastStudioPage /></LazyPage>} />
        <Route path="/fast/studio/create" element={<LazyPage><FastCreateVideoPage /></LazyPage>} />
  
 
      </Routes>

      {shouldShowOpeningAds && adStep === 'splash' ? (
  <AdvertisementPopup placement="splash" blocking onFinish={() => setAdStep('opening')} />
) : null}

{shouldShowOpeningAds && adStep === 'opening' ? (
  <AdvertisementPopup placement="opening" blocking onFinish={() => setAdStep('done')} />
) : null}

      {shouldShowMeAd ? <AdvertisementPopup placement="me" /> : null}

      {!shouldHideFooter ? <Footer /> : null}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <SmartRefreshProvider>
        <AppShell />
      </SmartRefreshProvider>
    </Router>
  )
}
