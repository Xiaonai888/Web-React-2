// src/pages/Fast.jsx
import { useEffect } from 'react'

const VIDEOS = [
  { id: 1, user: '@creator_alpha_1', verified: true,  likes: '12K',  comments: '342', desc: 'This is the new immersive scrolling experience on Echo Fast! 🚀✨ #echo #fastfeed', audio: 'Original Audio - Echo Beats', heartColor: 'text-red-500' },
  { id: 2, user: '@user_two',        verified: false, likes: '5.2K', comments: '120', desc: 'Second video is here! Perfect spacing on the footer now. #smooth', audio: 'Trending Sound', heartColor: 'text-white' },
  { id: 3, user: '@viral_star',      verified: true,  likes: '1.2M', comments: '14K', desc: 'This one went viral! Great layout for vertical content viewing.', audio: 'Viral Audio', heartColor: 'text-red-500' },
  { id: 4, user: '@lifestyle_vlog',  verified: false, likes: '800',  comments: '45',  desc: 'Morning coffee routine. ☕️ Enjoying the little things in life.', audio: 'Chill Morning Vibes', heartColor: 'text-white' },
  { id: 5, user: '@tech_reviewer',   verified: false, likes: '105K', comments: '1.2K', desc: 'Unboxing the newest gadget! The design is flawless. #tech', audio: 'Tech Background Music', heartColor: 'text-red-500' },
]

function VideoCard({ v }) {
  return (
    <div className="h-screen w-full snap-start relative bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
      <img src={`https://picsum.photos/seed/fast${v.id}/800/1400`} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Right actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-5 z-20">
        <div className="relative w-12 h-12 cursor-pointer mb-2">
          <img src={`https://i.pravatar.cc/150?u=10${v.id}`} className="w-full h-full rounded-full border-2 border-white object-cover" alt="" />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
            <i className="fa-solid fa-plus text-white text-[10px]" />
          </div>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <div className={`w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center`}>
            <i className={`fa-solid fa-heart text-xl ${v.heartColor}`} />
          </div>
          <span className={`text-[11px] font-bold mt-1 ${v.heartColor}`}>{v.likes}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <i className="fa-solid fa-comment-dots text-white text-xl" />
          </div>
          <span className="text-[11px] font-bold mt-1">{v.comments}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <i className="fa-solid fa-share-nodes text-white text-xl" />
          </div>
          <span className="text-[11px] font-bold mt-1">Echo</span>
        </div>
        <div className="w-10 h-10 rounded-full border-[2.5px] border-gray-600 overflow-hidden mt-3 animate-spin" style={{ animationDuration: '4s' }}>
          <img src={`https://i.pravatar.cc/150?u=10${v.id}`} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute left-4 bottom-24 max-w-[75%] z-20">
        <h3 className="font-bold text-[15px] mb-1 text-white flex items-center">
          {v.user}
          {v.verified && <i className="fa-solid fa-circle-check text-blue-500 text-xs ml-1 bg-white rounded-full" />}
        </h3>
        <p className="text-[13px] text-gray-200 line-clamp-2 leading-relaxed">{v.desc}</p>
        <div className="flex items-center space-x-2 mt-3 text-[11px] bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 w-max border border-white/10 text-white">
          <i className="fa-solid fa-music" />
          <span className="font-medium tracking-wide">{v.audio}</span>
        </div>
      </div>
    </div>
  )
}

export default function Fast() {
  return (
    <>
      <style>{`
        body { background:#000; color:#fff; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-5 pb-3 px-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <h1 className="text-2xl font-black text-white tracking-tight italic">Fast</h1>
        <div className="flex space-x-4 items-center">
          <button className="text-white"><i className="fa-solid fa-magnifying-glass text-xl" /></button>
          <button className="text-white"><i className="fa-solid fa-camera text-xl" /></button>
        </div>
      </header>

      {/* Videos */}
      <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black max-w-md mx-auto" style={{ paddingBottom: '70px' }}>
        {VIDEOS.map(v => <VideoCard key={v.id} v={v} />)}
        {/* Extra videos 6-10 */}
        {[6,7,8,9,10].map(i => (
          <div key={i} className="h-screen w-full snap-start relative bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={`https://picsum.photos/seed/fast${i}/800/1400`} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            <div className="absolute left-4 bottom-24 max-w-[75%] z-20">
              <h3 className="font-bold text-[15px] mb-1 text-white">@explore_world_{i}</h3>
              <p className="text-[13px] text-gray-200 line-clamp-2">Exploring the hidden gems of nature. 🌍 #travel</p>
            </div>
          </div>
        ))}
      </main>
    </>
  )
}
