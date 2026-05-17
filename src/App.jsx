function AppFooter() {
  const location = useLocation()

  const shouldHideFooter = /^\/story\/[^/]+$/.test(location.pathname)

  if (shouldHideFooter) return null

  return <Footer />
}

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Footer from './components/Footer'

import ForYou from './pages/ForYou'
import Fast from './pages/Fast'
import Discover from './pages/Discover'
import Library from './pages/Library'
import Me from './pages/Me/Me'
import Search from './pages/Search'
import ShadowExclusivePage from './pages/ShadowExclusivePage'
import StoryDetailPage from './pages/StoryDetailPage'
import ReaderPage from './pages/ReaderPage'
import UpdateTodayPage from './pages/UpdateTodayPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import PremiumPage from './pages/Me/PremiumPage'
import SettingsPage from './pages/Me/SettingsPage'
import TopNovelPage from './pages/TopNovelPage'
import YouMightLikePage from './pages/YouMightLikePage'
import NewArrivalsPage from './pages/NewArrivalsPage'
import CompletedPage from './pages/CompletedPage'
import ShopPage from './pages/ShopPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import TermsPoliciesPage from './pages/Auth/TermsPoliciesPage'
import ProfilePage from './pages/ProfilePage'
import EventPage from './pages/EventPage'
import CreateAuthorPage from './pages/Author/CreateAuthorPage'
import AuthorDashboardPage from './pages/Author/AuthorDashboardPage'
import StoryManagerPage from './pages/Author/StoryManagerPage'
import CreateStoryPage from './pages/Author/CreateStoryPage'
import ShadowAuthorAgreementPage from './pages/Author/ShadowAuthorAgreementPage'
import EpisodeEditorPage from './pages/Author/EpisodeEditorPage'
import PublishEpisodePage from './pages/Author/PublishEpisodePage'
import EpisodePreviewPage from './pages/Author/EpisodePreviewPage'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ForYou />} />
        <Route path="/fast" element={<Fast />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/library" element={<Library />} />
        <Route path="/me" element={<Me />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/author/create" element={<CreateAuthorPage />} />
        <Route path="/author/dashboard" element={<AuthorDashboardPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shadow-exclusive" element={<ShadowExclusivePage />} />
        <Route path="/update-today" element={<UpdateTodayPage />} />
        <Route path="/story/:storyId/episode/:episodeId" element={<ReaderPage />} />
        <Route path="/story/:id" element={<StoryDetailPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/top-novel" element={<TopNovelPage />} />
        <Route path="/you-might-like" element={<YouMightLikePage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/completed" element={<CompletedPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms" element={<TermsPoliciesPage />} />
        <Route path="/author/story/:storyId/manage" element={<StoryManagerPage />} />
        <Route path="/author/create-story" element={<CreateStoryPage />} />
        <Route path="/author/agreement" element={<ShadowAuthorAgreementPage />} />
        <Route path="/author/story/:storyId/episode/create" element={<EpisodeEditorPage />} />
        <Route path="/author/story/:storyId/episode/publish" element={<PublishEpisodePage />} />
        <Route path="/author/story/:storyId/episode/preview" element={<EpisodePreviewPage />} />
        
        
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}
