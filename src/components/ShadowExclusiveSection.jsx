import { Link } from 'react-router-dom'

export default function ShadowExclusiveSection() {
  const sectionData = [
    {
      id: 1,
      title: 'Shadow Bride',
      image: '/assets/Must Read pic/Must Read 1.jpg',
      genre: 'Fantasy',
      genreColor: 'emerald',
      episode: 'EP 20',
    },
    {
      id: 2,
      title: 'Royal Scheme',
      image: '/assets/Must Read pic/Must Read 2.jpg',
      genre: 'Romance',
      genreColor: 'rose',
      episode: 'EP 12',
    },
    {
      id: 3,
      title: 'Hidden Love',
      image: '/assets/Must Read pic/Must Read 3.jpg',
      genre: 'Drama',
      genreColor: 'sky',
      episode: 'EP 8',
    },
    {
      id: 4,
      title: 'Omega Dragon',
      image: '/assets/Must Read pic/Must Read 4.jpg',
      genre: 'Fantasy',
      genreColor: 'emerald',
      episode: 'EP 25',
    },
    {
      id: 5,
      title: 'CEO’s Secret Baby',
      image: '/assets/Must Read pic/Must Read 5.jpg',
      genre: 'Romance',
      genreColor: 'rose',
      episode: 'EP 16',
    },
    {
      id: 6,
      title: 'My Princess',
      image: '/assets/Must Read pic/Must Read 6.jpg',
      genre: 'Drama',
      genreColor: 'sky',
      episode: 'EP 9',
    },
  ]

  return (
    <div className="px-4 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-gray-900 text-lg flex items-center uppercase tracking-tight">
          <img
            src="https://img.icons8.com/emoji/48/crown-emoji.png"
            className="w-5 h-5 mr-2"
            alt="crown"
          />
          Shadow Exclusive
        </h3>

        <Link
          to="/shadow-exclusive"
          className="text-amber-700 text-[11px] font-black uppercase tracking-widest hover:text-amber-800 hover:underline transition-all"
        >
          See All
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-10">
        {sectionData.map((item) => (
          <Link
            to="/shadow-exclusive"
            key={item.id}
            className="group flex flex-col cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 bg-white border border-amber-200/70 shadow-[0_8px_24px_rgba(212,175,55,0.18)] group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.28)] transition-all duration-500">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-amber-300/80 pointer-events-none z-10" />

              <img
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x450?text=Cover'
                }}
              />

              <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-full text-[7px] font-black tracking-[0.16em] uppercase text-amber-950 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 border border-amber-100 shadow-[0_6px_18px_rgba(212,175,55,0.35)]">
                Premium
              </div>

              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
            </div>

            <div className="px-0.5">
              <h4 className="font-extrabold text-[12px] text-gray-900 leading-tight mb-1.5 overflow-hidden whitespace-nowrap text-ellipsis group-hover:text-amber-700 transition-colors">
                {item.title}
              </h4>

              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span
                  className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase border shadow-sm ${
                    item.genreColor === 'emerald'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : item.genreColor === 'rose'
                      ? 'bg-pink-100 text-pink-800 border-pink-200'
                      : 'bg-cyan-100 text-cyan-800 border-cyan-200'
                  }`}
                >
                  {item.genre}
                </span>

                <span className="text-[8px] font-black px-2.5 py-1 rounded-full uppercase bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
                  {item.episode}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
