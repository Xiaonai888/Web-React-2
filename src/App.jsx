import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import ForYou from './pages/ForYou'
import Fast from './pages/Fast'
import Discover from './pages/Discover'
import Library from './pages/Library'
import Me from './pages/Me'
import Search from './pages/Search'
import ShadowExclusivePage from './pages/ShadowExclusivePage'

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
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
