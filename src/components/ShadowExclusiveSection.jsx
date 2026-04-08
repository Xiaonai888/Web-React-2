import { Link } from 'react-router-dom'

export default function ShadowExclusiveSection() {
  const ShadowExclusiveSectionData = [
    {
      id: 1,
      title: 'Shadow Bride',
      image: '/assets/Must Read pic/Must Read 1.jpg',
      genre: 'Fantasy',
      genreColor: 'emerald', // Added genre colors to data
      episode: 'EP 20',
      link: '/fast',
    },
    {
      id: 2,
      title: 'Royal Scheme',
      image: '/assets/Must Read pic/Must Read 2.jpg',
      genre: 'Romance',
      genreColor: 'rose',
      episode: 'EP 12',
      link: '/fast',
    },
    {
      id: 3,
      title: 'Hidden Love',
      image: '/assets/Must Read pic/Must Read 3.jpg',
      genre: 'Drama',
      genreColor: 'sky',
      episode: 'EP 8',
      link: '/fast',
    },
    {
      id: 4,
      title: 'Omega Dragon',
      image: '/assets/Must Read pic/Must Read 4.jpg',
      genre: 'Fantasy',
      genreColor: 'emerald',
      episode: 'EP 25',
      link: '/fast',
    },
    {
      id: 5,
      title: 'CEO’s Secret Baby',
      image: '/assets/Must Read pic/Must Read 5.jpg',
      genre: 'Romance',
      genreColor: 'rose',
      episode: 'EP 16',
      link: '/fast',
    },
    {
      id: 6,
      title: 'My Princess',
      image: '/assets/Must Read pic/Must Read 6.jpg',
      genre: 'Drama',
      genreColor: 'sky',
      episode: 'EP 9',
      link: '/fast',
    },
  ]

  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-lg flex items-center">
          <img
            src="https://img.icons8.com/emoji/48/star-emoji.png"
            className="w-5 h-5 mr-2"
            alt=""
          />
          Must Reads
        </h3>
        <button className="text-blue-600 text-xs font-bold uppercase">See All</button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-8">
        {mustReadData.map((item) => (
          <Link to={item.link} key={item.id} className="group cursor-pointer">
            <div className="aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-50 mb-3">
              <img
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={item.title}
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Cover" }}
              />
            </div>

            {/* COOLER TITLE & INFO SECTION */}
            <div className="mt-3">
              <h4 className="font-extrabold text-[12px] text-gray-900 leading-tight mb-1 truncate group-hover:text-blue-600">
                {item.title}
              </h4>

              <div className="flex items-center space-x-2 mt-1.5">
                {/* COOLER GENRE TAG with dynamic color and bold font */}
                <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${item.genreColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : item.genreColor === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-sky-50 text-sky-700 border-sky-100'}`}>
                  {item.genre}
                </span>

                {/* COOLER EPISODE PILL with distinct styling and bold font */}
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-gray-100 text-gray-600 border border-gray-100">
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
