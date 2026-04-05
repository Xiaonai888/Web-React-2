// src/pages/Discover.jsx
import { useEffect, useState } from 'react'

const REACTIONS = [
  { name:'Like',    icon:'fa-thumbs-up',          color:'text-blue-600',  bg:'bg-blue-100'  },
  { name:'Love',    icon:'fa-heart',               color:'text-red-500',   bg:'bg-red-100'   },
  { name:'Laugh',   icon:'fa-face-laugh-squint',   color:'text-yellow-500',bg:'bg-yellow-100'},
  { name:'Wow',     icon:'fa-face-surprise',       color:'text-orange-500',bg:'bg-orange-100'},
  { name:'Sad',     icon:'fa-face-sad-tear',       color:'text-blue-400',  bg:'bg-blue-100'  },
  { name:'Angry',   icon:'fa-face-angry',          color:'text-red-600',   bg:'bg-red-100'   },
  { name:'Support', icon:'fa-hands-holding-heart', color:'text-green-500', bg:'bg-green-100' },
]

const STORY_NAMES = ['Sokha','Dara','Maly','Rith','Pisey','Vanna','Kosal','Sreyla','Bopha','Chenda','Sothy','Ratana','Leakhena','Visal','Sophy','Chanthy','Makara','Pichda','Lyda']

export default function Discover() {
  const [tab, setTab] = useState('fresh')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare]       = useState(false)
  const [showMenu, setShowMenu]         = useState(false)

  useEffect(() => { loadMore() }, [])

  function loadMore() {
    if (loading || page >= 30) return
    setLoading(true)
    setTimeout(() => {
      setPosts(prev => [...prev, ...Array.from({ length: 10 }, (_, i) => page + i + 1)])
      setPage(p => p + 10)
      setLoading(false)
    }, 800)
  }

  function handleScroll(e) {
    const el = e.target
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 800) loadMore()
  }

  return (
    <>
      <style>{`
        :root { --echo-primary:#3b82f6; --echo-bg:#f8fafc; }
        body { background:var(--echo-bg); font-family:'Plus Jakarta Sans','Kantumruy Pro',sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        .premium-card { background:#fff; border:1px solid #f1f5f9; box-shadow:0 4px 20px -4px rgba(0,0,0,0.03); border-radius:24px; }
        .tab-active { color:var(--echo-primary); font-weight:800; border-bottom:3px solid var(--echo-primary); }
        .btn-press:active { transform:scale(0.96); }
        .reaction-container:hover .reaction-picker { opacity:1!important; pointer-events:auto!important; transform:translateY(0) scale(1)!important; }
        .reaction-picker { opacity:0; pointer-events:none; transform:translateY(10px) scale(0.9); transition:all 0.2s; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .fade-in { animation:fadeIn 0.2s ease-out; }
        .slide-up { animation:slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      <div onScroll={handleScroll} style={{ overflowY:'auto', height:'100vh', paddingBottom:'80px' }}>
        {/* Header */}
        <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-lg border-b border-gray-100">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center px-4 py-3">
              <h1 className="text-2xl font-black text-blue-600 tracking-tight">Echo</h1>
              <div className="flex space-x-3">
                <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 btn-press">
                  <i className="fa-solid fa-magnifying-glass" />
                </button>
                <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 btn-press relative">
                  <i className="fa-solid fa-bell" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
              </div>
            </div>
            <nav className="flex px-4">
              <button onClick={() => setTab('fresh')} className={`flex-1 py-3 text-sm font-bold text-center transition-all ${tab==='fresh' ? 'tab-active' : 'text-gray-400'}`}>Fresh</button>
              <button onClick={() => setTab('following')} className={`flex-1 py-3 text-sm font-semibold text-center transition-all ${tab==='following' ? 'tab-active' : 'text-gray-400'}`}>Following</button>
            </nav>
          </div>
        </header>

        <main className="max-w-2xl mx-auto mt-4">
          {/* Stories */}
          <section className="mb-6">
            <div className="flex space-x-3 overflow-x-auto no-scrollbar px-4 pb-2">
              {/* Create */}
              <div className="shrink-0 cursor-pointer" style={{ width:'80px' }}>
                <div style={{ width:'80px', height:'130px', borderRadius:'14px', overflow:'hidden', position:'relative', background:'#f0f2f5', border:'1px solid #e4e6eb' }}>
                  <img src="https://i.pravatar.cc/150?img=32" style={{ width:'100%', height:'75%', objectFit:'cover', display:'block' }} alt="" />
                  <div style={{ position:'absolute', bottom:'28px', left:'50%', transform:'translateX(-50%)', width:'36px', height:'36px', background:'#1877f2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'3px solid white' }}>
                    <i className="fa-solid fa-plus" style={{ color:'white', fontSize:'14px' }} />
                  </div>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'white', height:'40px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'11px', fontWeight:700, color:'#1c1e21' }}>Create Story</span>
                  </div>
                </div>
              </div>
              {/* User stories */}
              {STORY_NAMES.map((name, i) => (
                <div key={i} className="shrink-0 cursor-pointer" style={{ width:'80px' }}>
                  <div style={{ width:'80px', height:'130px', borderRadius:'14px', overflow:'hidden', position:'relative', border:'3px solid #1877f2' }}>
                    <img src={`https://i.pravatar.cc/150?u=story${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                    <div style={{ position:'absolute', top:'8px', left:'8px', width:'34px', height:'34px', borderRadius:'50%', border:'3px solid #1877f2', overflow:'hidden', background:'white' }}>
                      <img src={`https://i.pravatar.cc/150?u=av${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                    </div>
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px 6px 6px', background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                      <span style={{ fontSize:'11px', fontWeight:700, color:'white', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', display:'block' }}>{name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Post input */}
          <section className="px-4 mb-6">
            <div className="premium-card p-4 flex items-center space-x-3 cursor-text">
              <img src="https://i.pravatar.cc/150?img=32" className="w-10 h-10 rounded-full object-cover border border-gray-100" alt="" />
              <div className="flex-1 bg-gray-50 rounded-full py-2.5 px-4 text-sm text-gray-500 font-medium">What's your Echo today?</div>
              <button className="text-gray-400 hover:text-green-500 transition-colors"><i className="fa-solid fa-image text-lg" /></button>
            </div>
          </section>

          {/* Feed */}
          <div className="space-y-5 px-4 pb-4">
            {posts.map(id => (
              <article key={id} className="premium-card p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <img src={`https://i.pravatar.cc/150?u=author${id}`} className="w-10 h-10 rounded-full object-cover" alt="" />
                      {id % 3 === 0 && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"><i className="fa-solid fa-circle-check text-blue-500 text-[10px]" /></div>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:underline">Echo Creator {id}</h4>
                      <div className="flex items-center space-x-1 text-[11px] font-semibold text-gray-400">
                        <span>{id}h ago</span><span>•</span><i className="fa-solid fa-earth-americas text-[9px]" />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowMenu(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><i className="fa-solid fa-ellipsis" /></button>
                </div>

                <p className="text-[14px] leading-relaxed text-gray-800 mb-3 font-medium">Just testing out the new Echo platform update. The professional design language feels incredible. 🚀✨</p>

                {id % 2 !== 0 && (
                  <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-3 border border-gray-100">
                    <img src={`https://picsum.photos/seed/post${id}/800/600`} className="w-full h-full object-cover" alt="" />
                  </div>
                )}

                <div className="flex justify-between items-center pb-3 border-b border-gray-100 px-1">
                  <div className="flex items-center space-x-1.5 cursor-pointer">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white z-20"><i className="fa-solid fa-thumbs-up text-white text-[8px]" /></div>
                      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center border border-white z-10"><i className="fa-solid fa-heart text-white text-[8px]" /></div>
                    </div>
                    <span className="text-[12px] font-bold text-gray-500">{id * 14}</span>
                  </div>
                  <div className="flex space-x-3 text-[12px] font-bold text-gray-500">
                    <span className="hover:underline cursor-pointer" onClick={() => setShowComments(true)}>{id * 3} Comments</span>
                    <span className="hover:underline cursor-pointer">{id} Echoes</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 mt-1 relative reaction-container">
                  <div className="reaction-picker absolute bottom-12 left-0 bg-white rounded-full shadow-lg border border-gray-100 px-2 py-1.5 flex z-50">
                    {REACTIONS.map(r => (
                      <button key={r.name} className={`w-8 h-8 rounded-full ${r.bg} ${r.color} flex items-center justify-center text-sm shadow-sm mx-1`}>
                        <i className={`fa-solid ${r.icon}`} />
                      </button>
                    ))}
                  </div>
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-gray-500 hover:bg-gray-50 font-bold text-[13px] transition-colors btn-press">
                    <i className="fa-regular fa-thumbs-up text-lg" /><span>React</span>
                  </button>
                  <button onClick={() => setShowComments(true)} className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-gray-500 hover:bg-gray-50 font-bold text-[13px] transition-colors btn-press">
                    <i className="fa-regular fa-comment text-lg" /><span>Comment</span>
                  </button>
                  <button onClick={() => setShowShare(true)} className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-gray-500 hover:bg-gray-50 font-bold text-[13px] transition-colors btn-press">
                    <i className="fa-solid fa-share-nodes text-lg" /><span>Echo</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {loading && (
            <div className="py-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">Loading Fresh Content</p>
            </div>
          )}
        </main>
      </div>

      {/* Overlay */}
      {(showComments || showShare || showMenu) && (
        <div className="fixed inset-0 bg-black/60 z-[150] fade-in" onClick={() => { setShowComments(false); setShowShare(false); setShowMenu(false) }} />
      )}

      {/* Comments drawer */}
      {showComments && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[160] max-w-2xl mx-auto h-[80vh] flex flex-col slide-up shadow-2xl">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />
          <div className="flex justify-between items-center px-6 pb-3 border-b border-gray-100 shrink-0">
            <h3 className="font-black text-lg text-gray-900">Comments <span className="text-gray-400 text-sm font-semibold ml-1">124</span></h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            <div className="flex space-x-3 mb-4">
              <img src="https://i.pravatar.cc/150?img=12" className="w-8 h-8 rounded-full shrink-0" alt="" />
              <div className="bg-gray-50 rounded-2xl p-3"><span className="font-bold text-sm text-gray-900 block mb-1">David Chen</span><p className="text-sm text-gray-700">This UI looks incredibly clean! Great work. 🎉</p></div>
            </div>
          </div>
          <div className="shrink-0 p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <img src="https://i.pravatar.cc/150?img=32" className="w-9 h-9 rounded-full shrink-0" alt="" />
              <div className="flex-1 bg-gray-50 rounded-full flex items-center px-4 py-2 border border-gray-200">
                <input placeholder="Write an Echo..." className="w-full bg-transparent border-none outline-none text-sm" />
                <button className="text-blue-600 font-bold ml-2"><i className="fa-solid fa-paper-plane" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[160] max-w-2xl mx-auto pb-8 slide-up">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-4" />
          <h3 className="text-center font-black text-lg text-gray-900 mb-6">Echo to...</h3>
          <div className="px-6 space-y-3">
            <button className="w-full bg-blue-50 text-blue-600 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2"><i className="fa-solid fa-retweet text-lg" /><span>Echo to Fresh Feed</span></button>
            <button className="w-full bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2"><i className="fa-solid fa-user-group text-lg" /><span>Echo to Following</span></button>
            <button onClick={() => setShowShare(false)} className="w-full text-gray-400 font-bold py-4 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </>
  )
}
