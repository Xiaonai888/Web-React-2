import { useEffect } from 'react';

export default function AlphaSpotlight() {
  useEffect(() => {
    const initSwiper = () => {
      if (window.Swiper) {
        new window.Swiper('.alphaSwiper', {
          slidesPerView: 1.1,
          spaceBetween: 12,
          centeredSlides: false,
          loop: false,
          pagination: {
            el: '.alpha-pagination',
            clickable: true,
          },
        });
      }
    };

    if (document.readyState === 'complete') {
      initSwiper();
    } else {
      window.addEventListener('load', initSwiper);
      return () => window.removeEventListener('load', initSwiper);
    }
  }, []);

  const spotlightData = [
    { id: 1, title: "CEO's Secret Baby", img: "assets/alpha-spotlight/pic1.jpg", tag: "NEW" },
    { id: 2, title: "The Revenge", img: "assets/alpha-spotlight/pic2.jpg", tag: "HOT" },
    { id: 3, title: "Omega Dragon", img: "assets/alpha-spotlight/pic3.jpg", tag: "TOP" },
    { id: 4, title: "My Princess", img: "assets/alpha-spotlight/pic4.jpg", tag: "NEW" },
    { id: 5, title: "Hidden Love", img: "assets/alpha-spotlight/pic5.jpg", tag: "HOT" },
    { id: 6, title: "Royal Scheme", img: "assets/alpha-spotlight/pic6.jpg", tag: "END" },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="swiper alphaSwiper !pl-4 !pr-10">
        <div className="swiper-wrapper">
          {spotlightData.map((item) => (
            <div key={item.id} className="swiper-slide">
              <div className="relative aspect-[3/1] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-3 flex flex-col justify-end">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#ff3b5c] text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                      {item.tag}
                    </span>
                    <h2 className="text-white font-bold text-[11px] truncate">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="alpha-pagination flex justify-center mt-4"></div>
      </div>
    </div>
  );
}
