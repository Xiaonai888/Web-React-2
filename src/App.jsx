import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SmartRefreshProvider } from './providers/SmartRefreshProvider'
import { AuthorPageNotificationProvider } from './providers/AuthorPageNotificationProvider'
import { useDisplayTranslation } from './utils/displayLanguage'
import './i18n/appTranslations'
import Footer from './components/Footer'
import ForYou from './pages/ForYou'
import MangaPage from './pages/MangaPage'
import ChatStoryHomePage from './pages/ChatStoryHomePage'
import Library from './pages/Library'
import ShopPage from './pages/ShopPage'
import ReaderStorePage from './pages/ReaderStorePage'
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
import StoryTitleGuidePage from './pages/Author/StoryTitleGuidePage'
import ChatStoryCharactersPage from './pages/Author/ChatStoryCharactersPage'
import ShadowGalleryPage from './pages/Author/ShadowGalleryPage'
import ChatStoryCharacterProfilePage from './pages/Author/ChatStoryCharacterProfilePage'
import ChatStoryEditorPage from './pages/Author/ChatStoryEditorPage'
import StoryManagerPage from './pages/Author/StoryManagerPage'
import EpisodeEditorPage from './pages/Author/EpisodeEditorPage'
import PublishEpisodePage from './pages/Author/PublishEpisodePage'
import EpisodePreviewPage from './pages/Author/EpisodePreviewPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import TopAuthorsPage from './pages/Author/TopAuthorsPage'
import DiscoverSearchPage from './pages/DiscoverSearchPage'
import Search from './pages/Search'
import ReaderPage from './pages/ReaderPage'
import AuthorIncomePage from './pages/Author/AuthorIncomePage'
import AuthorDiamondPage from './pages/Author/AuthorDiamondPage'
import AuthorGiftPage from './pages/Author/AuthorGiftPage'
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
import ShadowSplashScreen from './components/ShadowSplashScreen'
import PublishBlockedWarningPage from './pages/Author/PublishBlockedWarningPage'
import InboxPage from './pages/InboxPage'
import AuthorCommentProtectionPage from './pages/Author/AuthorCommentProtectionPage'
import TermsPoliciesPage from './pages/Auth/TermsPoliciesPage'
import VisitorTracker from './components/VisitorTracker'
import AuthorPageEditDetailsPage from './pages/Author/AuthorPageEditDetailsPage'
import PremiumPage from './pages/Me/PremiumPage'
import AuthorInsightsPage from "./pages/Author/AuthorInsightsPage";
import AuthorStoriesPage from './pages/Author/AuthorStoriesPage'
import StoryNotificationsPage from './pages/Author/StoryNotificationsPage'
import StoryDescriptionGuidePage from './pages/Author/StoryDescriptionGuidePage'
import StoryPerformancePage from './pages/Author/StoryPerformancePage'
import AuthorHiddenCommentsPage from './pages/Author/AuthorHiddenCommentsPage'
import AuthorBlockedReadersPage from './pages/Author/AuthorBlockedReadersPage'
import AuthorModerationHistoryPage from './pages/Author/AuthorModerationHistoryPage'
import UpdateTodayPage from './pages/UpdateTodayPage'
import AuthorIncomeOldPage from './pages/Author/AuthorIncomeOldPage'

const GamePage = lazy(() => import('./pages/Me/GamePage'))
const SpinPage = lazy(() => import('./pages/Me/SpinPage'))
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
const DailyPicksPage = lazy(() => import('./pages/DailyPicksPage'))
const WriterWednesdayEventPage = lazy(() => import('./pages/Event/WriterWednesdayEventPage'))
const YouMightLikePage = lazy(() => import('./pages/YouMightLikePage'))
const MusicPage = lazy(() => import('./pages/MusicPage'))
const GenresPage = lazy(() => import('./pages/GenresPage'))
const RomanceGenrePage = lazy(() => import('./pages/Genre/RomanceGenrePage'))
const GenreStoriesPage = lazy(() => import('./pages/Genre/GenreStoriesPage'))
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
const AuthorPostsContentLibraryPage = lazy(() =>
  import('./pages/Author/AuthorPostsContentLibraryPage')
)
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
const ReaderPostCreatePage = lazy(() =>
  import('./pages/ReaderPosts/ReaderPostCreatePage')
)
const AuthorPostInsightsPage = lazy(() =>
  import('./pages/Author/AuthorPostInsightsPage')
)
const ReaderPostReviewPage = lazy(() =>
  import('./pages/ReaderPosts/ReaderPostReviewPage')
)

const ReaderPostDetailPage = lazy(() =>
  import('./pages/ReaderPosts/ReaderPostDetailPage')
)

const AuthorPostDetailPage = lazy(() =>
  import('./pages/AuthorPosts/AuthorPostDetailPage')
)

const ReaderDiscoverPeoplePage = lazy(() =>
  import('./pages/ReaderProfiles/ReaderDiscoverPeoplePage')
)
const ReaderShareProfilePage = lazy(() =>
  import('./pages/ReaderProfiles/ReaderShareProfilePage')
)
const ReaderSettingsPage = lazy(() =>
  import('./pages/ReaderProfiles/ReaderSettingsPage')
)

const ReaderAccountSecurityPage = lazy(() =>
  import('./pages/ReaderProfiles/ReaderAccountSecurityPage')
)

const ReaderChangePasswordPage = lazy(() =>
  import('./pages/ReaderProfiles/ReaderChangePasswordPage')
)

const ReaderChangeEmailPage = lazy(() =>
  import('./pages/ReaderProfiles/ReaderChangeEmailPage')
)

const AuthorPageOptionsPage = lazy(() => import('./pages/Author/AuthorPageOptionsPage'))
const AuthorReaderPageOptionsPage = lazy(() => import('./pages/Author/AuthorReaderPageOptionsPage'))
const AuthorPageSearchPage = lazy(() => import('./pages/Author/AuthorPageSearchPage'))
const AuthorFollowersPage = lazy(() => import('./pages/Author/AuthorFollowersPage'))
const AuthorTopFansPage = lazy(() => import('./pages/Author/AuthorTopFansPage'))
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'))
const ShadowExclusivePage = lazy(() => import('./pages/ShadowExclusivePage'))
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
const SocialInteractionUsersPage = lazy(() =>
  import('./pages/SocialInteractionUsersPage')
)
const ReceivedEchoesPage = lazy(() =>
  import('./pages/ReceivedEchoesPage')
)
const CreateAuthorStoryPage = lazy(() => import('./pages/Author/CreateAuthorStoryPage'))
const CreateReaderStoryPage = lazy(() => import('./pages/ReaderStories/CreateReaderStoryPage'))
const SavedPostsPage = lazy(() => import('./pages/Me/SavedPostsPage'))
const AboutUsPage = lazy(() => import('./pages/Me/AboutUsPage'))
const HelpCenterPage = lazy(() => import('./pages/Me/HelpCenterPage'))
const FeedbackSupportPage = lazy(() => import('./pages/Me/FeedbackSupportPage'))
const ChatInboxShellPage = lazy(() => import('./pages/Chat/ChatInboxShellPage'))
const ArchivedChatPage = lazy(() => import('./pages/Chat/ArchivedChatPage'))
const ChatRoomPage = lazy(() => import('./pages/Chat/ChatRoomPage'))
const ChatInfoPage = lazy(() => import('./pages/Chat/ChatInfoPage'))
const AuthorPageInviteFriendsPage = lazy(() => import('./pages/Author/AuthorPageInviteFriendsPage'))
const AuthorPageHelpPage = lazy(() => import('./pages/Author/AuthorPageHelpPage'))
const AuthorChatInboxPage = lazy(() => import('./pages/AuthorChat/AuthorChatInboxPage'))
const AuthorArchivedChatPage = lazy(() => import('./pages/AuthorChat/AuthorArchivedChatPage'))
const AuthorChatRoomPage = lazy(() => import('./pages/AuthorChat/AuthorChatRoomPage'))
const AuthorChatInfoPage = lazy(() => import('./pages/AuthorChat/AuthorChatInfoPage'))
const AuthorPostCommentFocusPage = lazy(() => import('./pages/AuthorChat/AuthorPostCommentFocusPage'))
const AuthorPostActivityPage = lazy(() => import('./pages/Author/AuthorPostActivityPage'))


function ComingSoon({ titleKey }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] px-4 pb-[110px] pt-10">
      <div className="mx-auto max-w-[560px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
        <h1 className="text-[22px] font-extrabold text-[var(--shadow-text-primary)]">
          {t(`app.routes.${titleKey}`)}
        </h1>
        <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-tertiary)]">
          {t('app.comingSoonDescription')}
        </p>
      </div>
    </div>
  )
}

function PageLoading() {
  const { t } = useDisplayTranslation()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] px-4 pt-16">
      <div className="mx-auto max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[var(--shadow-text-primary)]" />
        <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
          {t('app.loading')}
        </div>
      </div>
    </div>
  )
}

function LazyPage({ children }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>
}

function AppShell() {
  const location = useLocation()
  const backgroundLocation =
    location.state?.backgroundLocation?.pathname === '/discover'
      ? location.state.backgroundLocation
      : null
  const [adStep, setAdStep] = useState('splash')
  const [showShadowSplash, setShowShadowSplash] = useState(
  location.pathname === '/' && sessionStorage.getItem('shadow_splash_shown') !== '1'
)
useEffect(() => {
  if (showShadowSplash) sessionStorage.setItem('shadow_splash_shown', '1')
}, [showShadowSplash])
const finishShadowSplash = useCallback(() => setShowShadowSplash(false), [])
  const hideFooterPaths = [
    '/login',
    '/register',
    '/shop',
    '/wallet',
    '/wallet/orders',
    '/profile',
    '/library',
    '/chat',
    '/event',
    '/event/writer-wednesday',
    '/author/create',
    '/author/dashboard',
    '/author/profile',
    '/author/insights',
    '/author/income',
    '/author/diamonds',
    '/author/gifts',
    '/author/payment-method',
    '/author/benefits',
    '/author/quest',
    '/author/create-story',
    '/authors/top',
    '/search',
    '/discover/search',
    '/notifications',
    '/update-today',
    '/daily-picks',
    '/you-might-like',
    '/tasks',
    '/tasks/history',
    '/author/trash',
    '/comments',
    '/saved-posts',
    '/game',
    '/reader/post/create',
    '/reader/post/review',
    '/author/comment-protection',
    '/author/comment-protection/hidden-comments',
    '/author/comment-protection/blocked-readers',
    '/author/comment-protection/moderation-history',
    '/author/page-settings',
    '/author/page/edit',
    '/author/page/posts',
    '/author/edit-page',
    '/author/cart',
    '/author/checkout',
    '/author/orders',
    '/most-read-this-week',
    '/gift-guide',
    '/premium',
    '/shadow-exclusive',
    '/about',
    '/help',
    '/feedback',
    '/author/stories',
    '/reader/story/create',
    '/author/notifications',
    '/genre/romance/latest',
    '/genre/romance/updates',
    '/genre/romance/completed',
    '/store',
    '/music',
    '/author/earnings',

  ]

  const shouldHideFooter =
  hideFooterPaths.includes(location.pathname) ||
  location.pathname.startsWith('/story/') ||
/^\/genre\/[^/]+\/(latest|updates|completed)$/.test(location.pathname) ||
  location.pathname.startsWith('/report/') ||
  location.pathname.startsWith('/reader/post/') ||
  location.pathname.startsWith('/author/post/') ||
  location.pathname.startsWith('/author/story/') ||
  location.pathname === '/author/page' ||
  location.pathname.startsWith('/author/page/') ||
  location.pathname.startsWith('/shop/mall/') ||
  location.pathname.startsWith('/profile/') ||
  location.pathname.startsWith('/chat/') ||
  location.pathname.startsWith('/notifications/') ||
  location.pathname.startsWith('/interactions/')
  location.pathname.startsWith('/game/') ||
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
  shouldShowOpeningAds &&
  adStep === 'done'
  return (
    <>
      <VisitorTracker />
        <Routes location={backgroundLocation || location}>
        <Route path="/" element={<ForYou onReady={finishShadowSplash} />} />
        <Route path="/manga" element={<MangaPage />} />
        <Route path="/chat-story" element={<ChatStoryHomePage />} />
        <Route path="/fast" element={<ComingSoon titleKey="fastReels" />} />
        <Route path="/check-in" element={<ComingSoon titleKey="checkIn" />} />
        <Route path="/settings" element={<ComingSoon titleKey="settings" />} />

        <Route
  path="/game"
  element={
    <LazyPage>
      <GamePage />
    </LazyPage>
  }
/>

        <Route path="/store" element={<ReaderStorePage />} />
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
  path="/shadow-exclusive"
  element={
    <LazyPage>
      <ShadowExclusivePage />
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
  path="/echoes/received"
  element={<LazyPage><ReceivedEchoesPage /></LazyPage>}
/>

  <Route
  path="/profile/settings/account-security/change-email"
  element={<LazyPage><ReaderChangeEmailPage /></LazyPage>}
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
  path="/game/spin"
  element={
    <LazyPage>
      <SpinPage />
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
  path="/author/page/posts"
  element={
    <LazyPage>
      <AuthorPostsContentLibraryPage />
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
  path="/author/page/chat"
  element={<LazyPage><AuthorChatInboxPage /></LazyPage>}
/>

<Route
  path="/author/page/chat/archived"
  element={<LazyPage><AuthorArchivedChatPage /></LazyPage>}
/>

<Route
  path="/author/page/chat/:conversationId/info"
  element={<LazyPage><AuthorChatInfoPage /></LazyPage>}
/>

<Route
  path="/author/page/chat/:conversationId"
  element={<LazyPage><AuthorChatRoomPage /></LazyPage>}
/>
        <Route
  path="/author/page/chat/comments/:postId/:commentId"
  element={<LazyPage><AuthorPostCommentFocusPage /></LazyPage>}
/> 

        <Route
  path="/author/page/posts/:postId/activity"
  element={
    <LazyPage>
      <AuthorPostActivityPage />
    </LazyPage>
  }
/>
          <Route
  path="/author/page/posts/:postId/insights"
  element={<LazyPage><AuthorPostInsightsPage /></LazyPage>}
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
  path="/reader/post/create"
  element={
    <LazyPage>
      <ReaderPostCreatePage />
    </LazyPage>
  }
/>

        <Route
  path="/reader/post/review"
  element={<LazyPage><ReaderPostReviewPage /></LazyPage>}
/>

  <Route
  path="/profile/settings/account-security/change-password"
  element={<LazyPage><ReaderChangePasswordPage /></LazyPage>}
/>
        
<Route
  path="/reader/post/:postId"
  element={
    <LazyPage>
      <ReaderPostDetailPage />
    </LazyPage>
  }
/>

        <Route
  path="/author/post/:postId"
  element={
    <LazyPage>
      <AuthorPostDetailPage />
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
  path="/interactions/:sourceType/:sourceId/:interactionType"
  element={<LazyPage><SocialInteractionUsersPage /></LazyPage>}
/>

<Route
  path="/reader/story/create"
  element={
    <LazyPage>
      <CreateReaderStoryPage />
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

        <Route
  path="/profile/discover-people"
  element={
    <LazyPage>
      <ReaderDiscoverPeoplePage />
    </LazyPage>
  }
/>

        <Route
  path="/profile/share"
  element={
    <LazyPage>
      <ReaderShareProfilePage />
    </LazyPage>
  }
/>

        <Route
  path="/profile/settings"
  element={
    <LazyPage>
      <ReaderSettingsPage />
    </LazyPage>
  }
/>

  <Route
  path="/profile/settings/account-security"
  element={<LazyPage><ReaderAccountSecurityPage /></LazyPage>}
/>

        <Route
  path="/author/story/:storyId/chat/characters/:characterId/profile"
  element={<ChatStoryCharacterProfilePage />}
/>

        <Route
  path="/author/story/:storyId/chat/shadow-gallery"
  element={<ShadowGalleryPage />}
/>
        <Route
  path="/event/writer-wednesday"
  element={<LazyPage><WriterWednesdayEventPage /></LazyPage>}
/>

        <Route
  path="/author/page/:pageUsername/search"
  element={<LazyPage><AuthorPageSearchPage /></LazyPage>}
/>


        <Route path="/author/story/description-guide" element={<StoryDescriptionGuidePage />} />
        <Route path="/author/story/title-guide" element={<StoryTitleGuidePage />} />
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
        <Route path="/author/story/:storyId/chat/characters" element={<ChatStoryCharactersPage />} />
        <Route path="/author/story/:storyId/chat/editor" element={<ChatStoryEditorPage />} />
        <Route path="/author/story/:storyId/manage" element={<StoryManagerPage />} />
        <Route path="/author/story/:storyId/performance" element={<StoryPerformancePage />} />
        <Route path="/author/story/:storyId/episode/create" element={<EpisodeEditorPage />} />
        <Route path="/author/story/:storyId/episode/publish" element={<PublishEpisodePage />} />
        <Route path="/author/story/:storyId/episode/publish-warning" element={<PublishBlockedWarningPage />} />
        <Route path="/author/story/:storyId/episode/preview" element={<EpisodePreviewPage />} />
        <Route path="/check-in" element={<ComingSoon title="Check-in" />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/chat" element={<LazyPage><ChatInboxShellPage /></LazyPage>} />
        <Route path="/chat/archived" element={<LazyPage><ArchivedChatPage /></LazyPage>} />
        <Route path="/chat/:conversationId/info" element={<LazyPage><ChatInfoPage /></LazyPage>} />
        <Route path="/chat/:conversationId" element={<LazyPage><ChatRoomPage /></LazyPage>} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/feedback" element={<LazyPage><FeedbackSupportPage /></LazyPage>} />
        <Route path="/help" element={<LazyPage><HelpCenterPage /></LazyPage>} />
        <Route path="/settings" element={<ComingSoon title="Settings" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/authors/top" element={<TopAuthorsPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/discover/search" element={<DiscoverSearchPage />} />
        <Route path="/author/income" element={<AuthorIncomeOldPage />} />
        <Route path="/author/earnings" element={<AuthorIncomePage />} />
        <Route path="/author/diamonds" element={<AuthorDiamondPage />} />
        <Route path="/author/gifts" element={<AuthorGiftPage />} />
        <Route path="/author/payment-method" element={<AuthorPaymentMethodPage />} />
        <Route path="/author/benefits" element={<AuthorBenefitsPage />} />
        <Route path="/author/quest" element={<AuthorQuestPage />} />
        <Route path="/author/page/:pageUsername" element={<AuthorPublicPage />} />
        <Route path="/author/page" element={<AuthorPublicPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/tasks" element={<TaskCenterPage />} />
        <Route path="/tasks/history" element={<TaskHistoryPage />} />
        <Route path="/author/trash" element={<AuthorTrashPage />} />
        <Route path="/author/comment-protection" element={<AuthorCommentProtectionPage />} />
        <Route path="/author/comment-protection/hidden-comments" element={<AuthorHiddenCommentsPage />} />
        <Route path="/author/comment-protection/blocked-readers" element={<AuthorBlockedReadersPage />} />
        <Route path="/author/comment-protection/moderation-history" element={<AuthorModerationHistoryPage />} />
        <Route path="/fast/studio/create" element={<LazyPage><FastCreateVideoPage /></LazyPage>} />
        <Route path="/author/stories" element={<AuthorStoriesPage />} />
        <Route path="/author/notifications" element={<StoryNotificationsPage />} />
        <Route path="/genre/:genreSlug/latest" element={<LazyPage><GenreStoriesPage tab="latest" /></LazyPage>} />
        <Route path="/genre/:genreSlug/updates" element={<LazyPage><GenreStoriesPage tab="updates" /></LazyPage>} />
        <Route path="/genre/:genreSlug/completed" element={<LazyPage><GenreStoriesPage tab="completed" /></LazyPage>} />
        <Route path="/author/page/:pageUsername/invite" element={<LazyPage><AuthorPageInviteFriendsPage /></LazyPage>} />
        <Route path="/author/page/:pageUsername/help" element={<LazyPage><AuthorPageHelpPage /></LazyPage>} />
        <Route path="/store" element={<ReaderStorePage />} />
        <Route path="/me" element={<Me />} />
        <Route path="/music" element={<LazyPage><MusicPage /></LazyPage>} />


        <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

{backgroundLocation ? (
  <div className="fixed inset-0 z-[100001] overflow-y-auto overscroll-contain bg-[#f0f2f5]">
    <Routes>
      <Route
        path="/reader/post/:postId"
        element={
          <LazyPage>
            <ReaderPostDetailPage />
          </LazyPage>
        }
      />

      <Route
        path="/author/post/:postId"
        element={
          <LazyPage>
            <AuthorPostDetailPage />
          </LazyPage>
        }
      />
    </Routes>
  </div>
) : null}

{showShadowSplash ? (
        <ShadowSplashScreen onFinish={finishShadowSplash} duration={3000} />
      ) : null}

      {!showShadowSplash && shouldShowOpeningAds && adStep === 'splash' ? (
        <AdvertisementPopup
          placement="splash"
          blocking
          onFinish={() => setAdStep('opening')}
        />
      ) : null}

      {!showShadowSplash && shouldShowOpeningAds && adStep === 'opening' ? (
        <AdvertisementPopup
          placement="opening"
          blocking
          onFinish={() => setAdStep('done')}
        />
      ) : null}

      {shouldShowMeAd ? <AdvertisementPopup placement="me" /> : null}

      {!shouldHideFooter ? <Footer /> : null}
    </>
  )
}

export default function App() {
  return (
    <Router>
  <AuthorPageNotificationProvider>
    <SmartRefreshProvider>
      <AppShell />
    </SmartRefreshProvider>
  </AuthorPageNotificationProvider>
</Router>
  )
}
