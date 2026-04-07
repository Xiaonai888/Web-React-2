import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import AlphaSpotlight from './components/AlphaSpotlight'
import ForYou from './pages/ForYou'
import Fast from './pages/Fast'
import Discover from './pages/Discover'
import Library from './pages/Library'
import Me from './pages/Me'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* For You page with Spotlight inside */}
        <Route path="/" element={
          <>
            <AlphaSpotlight />
            <ForYou />
          </>
        } />

        {/* Other pages without Spotlight */}
        <Route path="/fast" element={<Fast />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/library" element={<Library />} />
        <Route path="/me" element={<Me />} />
        <Route path="/search" element={<Search />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}
