import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  Crown,
  Flame,
  Zap,
  Star,
  Clock,
  Trophy,
  ShieldCheck,
  HelpCircle,
  Search,
  Bell,
} from 'lucide-react'

const ShadowExclusivePage = () => {
  const [activeTab, setActiveTab] = useState('Weekly')

  const categories = ['Popular', 'Daily', 'Weekly', 'All Time']

  const shadowPicks = [
    {
      id: 1,
      title: 'The Silent Archon',
      chapter: 'Ch. 42',
      genre: 'Dark Fantasy',
      image:
        'https://images.unsplash.com/photo-1543003919-a9957004550d?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      title: 'Velvet Requiem',
      chapter: 'Ch. 15',
      genre: 'Romance',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      title: 'Neon Syndicate',
      chapter: 'Ch. 89',
      genre: 'Sci-Fi',
      image:
        'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      title: 'Ethereal Contract',
      chapter: 'Ch. 04',
      genre: 'Supernatural',
      image:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
    },
  ]

  const moonlitChemistry = [
    {
      id: 5,
      title: 'Pulse of the Abyss',
      chapter: 'Ch. 22',
      genre: 'Psychological',
      image:
        'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 6,
      title: 'Gilded Chains',
      chapter: 'Ch. 56',
      genre: 'Drama',
      image:
        'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 7,
      title: 'The Last Oracle',
      chapter: 'Ch. 12',
      genre: 'Mystery',
      image:
        'https://images.unsplash.com/photo-1516589174418-0a114486689d?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 8,
      title: 'Stellar Drifters',
      chapter: 'Ch. 31',
      genre: 'Adventure',
      image:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400',
    },
  ]

  const arcaneVault = [
    {
      id: 9,
      title: 'Bloodline Legacy',
      chapter: 'Ch. 104',
      genre: 'Action',
      image:
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 10,
      title: 'Midnight Protocol',
      chapter: 'Ch. 09',
      genre: 'Thriller',
      image:
        'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 11,
      title: 'Aurelian Dawn',
      chapter: 'Ch. 45',
      genre: 'Epic Fantasy',
      image:
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 12,
      title: 'Iron Serpent',
      chapter: 'Ch. 18',
      genre: 'Martial Arts',
      image:
        'https://images.unsplash.com/photo-1533109721025-d1ae2ee8c1eb?auto=format&fit=crop&q=80&w=400',
    },
  ]

  const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center justify-between mb-6 px-4">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />}
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <button className="text-xs font-semibold text-zinc-500 uppercase tracking-widest hover:text-amber-400 transition-colors">
        Explore All
      </button>
    </div>
  )

  const ComicCard = ({ title, image, chapter, genre }) => (
    <div className="group relative flex flex-col cursor-pointer transition-all duration-500 hover:-translate-y-1">
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-lg border border-white/5 group-hover:border-amber-400/30 transition-all duration-500">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Cover'
          }}
        />

        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <Crown className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-bold text-white tracking-wide uppercase">Vault</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-sm font-bold text-zinc-100 line-clamp-1 group-hover:text-amber-400 transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-medium text-amber-400/80 uppercase tracking-wider">{genre}</span>
          <span className="text-[10px] text-zinc-500 font-bold">•</span>
          <span className="text-[10px] text-zinc-400 font-bold">{chapter}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 font-sans selection:bg-amber-400/30">
      <header className="sticky top-0 z-[100] w-full bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </Link>

            <div>
              <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                SHADOW VAULT
                <span className="bg-amber-400 text-black text-[9px] px-1.5 py-0.5 rounded-sm font-black">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                Curated Inner Circle
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/search" className="p-2.5 text-zinc-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <button className="p-2.5 text-zinc-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#0a0a0c]" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pb-28">
        <div className="mt-6 px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-[#111116] to-black border border-white/5 p-8 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-amber-400/10 rounded-lg">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                    Premium Access Required
                  </span>
                </div>

                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                  The Shadow Membership
                </h2>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Unlock the full Arcane Vault. As a member, you get instant access to every curated story,
                  zero advertisements, and early access to internal weekly drops.
                </p>
              </div>

              <div>
                <button className="group relative px-8 py-4 bg-amber-400 rounded-2xl font-black text-black text-sm uppercase tracking-wider overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    Upgrade to Premium
                    <Zap className="w-4 h-4 fill-current" />
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 px-4 sticky top-[65px] z-40 bg-[#0a0a0c]/60 backdrop-blur-md py-4">
          <div className="flex items-center gap-1 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === cat
                    ? 'bg-amber-400 text-black shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-12">
          <SectionHeader title="Inner Circle Reads" icon={Flame} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4">
            {shadowPicks.map((book) => (
              <ComicCard key={book.id} {...book} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeader title="Moonlit Chemistry" icon={Star} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4">
            {moonlitChemistry.map((book) => (
              <ComicCard key={book.id} {...book} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeader title="Arcane Vault" icon={Trophy} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4">
            {arcaneVault.map((book) => (
              <ComicCard key={book.id} {...book} />
            ))}
          </div>
        </section>

        <section className="mt-24 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 transition-all">
              <ShieldCheck className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Zero Intrusive Ads</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Experience your stories without interruptions. Premium members read pure content only.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 transition-all">
              <Zap className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Shadow Early Access</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Read upcoming chapters 72 hours before anyone else. Stay ahead of the discussion circle.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 transition-all">
              <Clock className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Unlimited Vault Offline</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Download any curation in the vault to your device for reading in the most remote areas.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20 px-4">
          <div className="bg-gradient-to-r from-[#16161a] to-[#0a0a0c] rounded-3xl border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">Issues with your Vault Access?</h4>
                <p className="text-xs text-zinc-500 font-medium">
                  Contact the Shadow concierge for instant support.
                </p>
              </div>
            </div>

            <button className="px-6 py-3 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Support Center
            </button>
          </div>
        </section>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />
    </div>
  )
}

export default ShadowExclusivePage
