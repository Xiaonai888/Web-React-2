import { Link } from 'react-router-dom'

export default function MustReads() {
  const mustReadData = [
    {
      id: 1,
      title: 'Shadow Bride',
      image: '/assets/Must Read pic/Must Read 1.jpg',
      genre: 'Fantasy',
      episode: 'EP 20',
      link: '/fast',
    },
    {
      id: 2,
      title: 'Royal Scheme',
      image: '/assets/Must Read pic/Must Read 2.jpg',
      genre: 'Romance',
      episode: 'EP 12',
      link: '/fast',
    },
    {
      id: 3,
      title: 'Hidden Love',
      image: '/assets/Must Read pic/Must Read 3.jpg',
      genre: 'Drama',
      episode: 'EP 8',
      link: '/fast',
    },
    {
      id: 4,
      title: 'Omega Dragon',
      image: '/assets/Must Read pic/Must Read 4.jpg',
      genre: 'Fantasy',
      episode: 'EP 25',
      link: '/fast',
    },
    {
      id: 5,
      title: 'CEO’s Secret Baby',
      image: '/assets/Must Read pic/Must Read 5.jpg',
      genre: 'Romance',
      episode: 'EP 16',
      link: '/fast',
    },
    {
      id: 6,
      title: 'My Princess',
      image: '/assets/Must Read pic/Must Read 6.jpg',
      genre: 'Drama',
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

            <h4 className="font-bold text-[11px] text-gray-900 mb-1 truncate group-hover:text-blue-600">
              {item.title}
            </h4>

            <div className="flex items-center space-x-2">
              <span className="bg-yellow-100 text-yellow-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                {item.genre}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">{item.episode}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
