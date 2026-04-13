import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import ForYou from './pages/ForYou'
import Fast from './pages/Fast'
import Discover from './pages/Discover'
import Library from './pages/Library'
import Me from './pages/Me/Me'
import Search from './pages/Search'
import ShadowExclusivePage from './pages/ShadowExclusivePage'
import StoryDetailPage from './pages/StoryDetailPage'
import UpdateTodayPage from './pages/UpdateTodayPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import PremiumPage from './pages/Me/PremiumPage'
import SettingsPage from './pages/Me/SettingsPage'
import TopNovelPage from './pages/TopNovelPage'
import YouMightLikePage from './pages/YouMightLikePage'
import YouMightLikeDemoPage from '../Demo/YouMightLikeDemoPage'
import NewArrivalsPage from './pages/NewArrivalsPage'
import NewArrivalsDemoPage from '../Demo/NewArrivalsDemoPage'
import CompletedPage from './pages/CompletedPage'
import CompletedDemoPage from '../Demo/CompletedDemoPage'.
import ShopPage from './pages/ShopPage'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ForYou />} />
        <Route path="/fast" element={<Fast />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/library" element={<Library />} />
        <Route path="/me" element={<Me />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shadow-exclusive" element={<ShadowExclusivePage />} />
        <Route path="/update-today" element={<UpdateTodayPage />} />
        <Route path="/story/:id" element={<StoryDetailPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/top-novel" element={<TopNovelPage />} />
        <Route path="/you-might-like" element={<YouMightLikePage />} />
        <Route path="/you-might-like-demo" element={<YouMightLikeDemoPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/new-arrivals-demo" element={<NewArrivalsDemoPage />} />
        <Route path="/completed" element={<CompletedPage />} />
        <Route path="/completed-demo" element={<CompletedDemoPage />} />
        <Route path="/shop" element={<ShopPage />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
