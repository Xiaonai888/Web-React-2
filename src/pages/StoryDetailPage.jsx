// StoryDetailPage.jsx
// Clean, production-style version with collapsing header + sticky bottom bar

import { useEffect, useState } from 'react'

export default function StoryDetailPage() {
  const [showHeader, setShowHeader] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [inLibrary, setInLibrary] = useState(false)
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 150)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f8f8] pb-[160px]">

      {/* ===== Sticky Header ===== */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>

        <div className="h-14 bg-white/95 backdrop-blur-md flex items-center justify-between px-4 shadow-sm">

          <button>←</button>

          <div className="text-[15px] font-bold truncate">
            Story Title
          </div>

          <div className="flex gap-2">
            <button onClick={() => setInLibrary(!inLibrary)}>
              {inLibrary ? '❤️' : '🤍'}
            </button>
            <button>⋯</button>
          </div>

        </div>
      </div>

      {/* ===== Hero Cover ===== */}
      <div className="relative h-[300px] bg-black">

        <div className="absolute top-4 left-4">←</div>

        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setInLibrary(!inLibrary)}>
            {inLibrary ? '❤️' : '🤍'}
          </button>
          <button>⋯</button>
        </div>

        <div className="absolute bottom-6 left-4 text-white">
          <h1 className="text-2xl font-black">Story Title</h1>
          <div className="mt-1 text-sm">#Romance #Action</div>
        </div>

      </div>

      {/* ===== Stats Card ===== */}
      <div className="mx-4 -mt-6 bg-white rounded-2xl p-4 shadow">

        <div className="flex justify-between text-center">
          <div>
            <div className="font-bold text-lg">200k</div>
            <div className="text-xs text-gray-400">Likes</div>
          </div>
          <div>
            <div className="font-bold text-lg">1.1M</div>
            <div className="text-xs text-gray-400">Views</div>
          </div>
          <div>
            <div className="font-bold text-lg text-orange-400">4.8</div>
            <div className="text-xs text-gray-400">Rating</div>
          </div>
        </div>

      </div>

      {/* ===== Description ===== */}
      <div className="px-4 mt-6">

        <div className="text-sm text-gray-600">
          Updates: Sat, Sun
        </div>

        <p className={`mt-3 text-sm leading-6 ${expand ? '' : 'line-clamp-4'}`}>
          Long story description goes here... This is example text to simulate 
          real content. It should be expandable and readable.
        </p>

        <button 
          onClick={() => setExpand(!expand)}
          className="mt-2 text-sm text-gray-500 font-bold">
          {expand ? 'See less' : 'See more'}
        </button>

      </div>

      {/* ===== Episodes ===== */}
      <div className="px-4 mt-6">

        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg">Episodes</h2>
          <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">Ongoing</span>
        </div>

        <div className="mt-4 space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-[90px] h-[55px] bg-gray-300 rounded-lg"></div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Episode {i}</div>
                <div className="text-xs text-gray-400">23-11-2024</div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full bg-white p-3 rounded-xl text-gray-500">
          Up to Ep. 55 →
        </button>

      </div>

      {/* ===== Fixed Bottom Bar ===== */}
      <div className="fixed bottom-[64px] left-0 right-0 px-4">

        <div className="bg-white rounded-full p-3 flex gap-3 shadow-lg">

          <button 
            onClick={() => setSubscribed(!subscribed)}
            className="w-12 h-12 rounded-full border flex items-center justify-center">
            {subscribed ? '❤️' : '🤍'}
          </button>

          <button className="flex-1 bg-yellow-400 rounded-full font-bold">
            Continue Ep. 2
          </button>

        </div>

      </div>

    </div>
  )
}
