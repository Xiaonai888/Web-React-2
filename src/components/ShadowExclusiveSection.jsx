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
            src="https://img.icons8.com/emoji/48/star-emoji.png"
            className="w-5 h-5 mr-2"
            alt="icon"
          />
          Shadow Exclusive
        </h3>

        <Link
          to="/shadow-exclusive"
          className="text-indigo-600 text-[11px] font-black uppercase tracking-widest hover:underline transition-all"
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
            <div className="relative aspect-[2/3] bg-gray-100 rounded-2xl overflow-hidden shadow-md border border-gray-50 mb-3">
              <img
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x450?text=Cover'
                }}
              />

              <div className="absolute top-2 right-2 bg-indigo-600/90 backdrop-blur-sm text-white text-[7px] px-2 py-1 rounded-full font-black shadow-lg border border-white/20">
                PREMIUM
              </div>
            </div>

            <div className="px-0.5">
              <h4 className="font-extrabold text-[12px] text-gray-900 leading-tight mb-1.5 overflow-hidden whitespace-nowrap text-ellipsis group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h4>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase border ${
                    item.genreColor === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : item.genreColor === 'rose'
                      ? 'bg-rose-50 text-rose-700 border-rose-100'
                      : 'bg-sky-50 text-sky-700 border-sky-100'
                  }`}
                >
                  {item.genre}
                </span>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase bg-gray-50 text-gray-500 border border-gray-100 tracking-tighter">
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
