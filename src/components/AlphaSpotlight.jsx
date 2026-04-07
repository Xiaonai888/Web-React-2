import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const AlphaSpotlight = () => {
  const spotlightData = [
    { id: 1, title: "CEO's Secret Baby", img: "assets/fast/your_book_1.jpg", tag: "NEW" },
    { id: 2, title: "The Revenge", img: "assets/fast/your_book_2.jpg", tag: "HOT" },
    { id: 3, title: "Omega Dragon", img: "https://via.placeholder.com/600x200?text=Book+3", tag: "TOP" },
    { id: 4, title: "My Princess", img: "https://via.placeholder.com/600x200?text=Book+4", tag: "NEW" },
    { id: 5, title: "Hidden Love", img: "https://via.placeholder.com/600x200?text=Book+5", tag: "HOT" },
    { id: 6, title: "Royal Scheme", img: "https://via.placeholder.com/600x200?text=Book+6", tag: "END" },
  ];

  return (
    <section className="w-full">
      <Swiper
        modules={[Pagination]}
        spaceBetween={12}
        slidesPerView={1.2} // បង្ហាញរូបបន្ទាប់បន្តិច (ទាក់ទាញឱ្យអូស)
        centeredSlides={true} // ដាក់រូបចំកណ្ដាល
        loop={true}
        pagination={{ clickable: true }}
        className="pb-10"
      >
        {spotlightData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative aspect-[3/1] w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 transition-transform duration-300">
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
                  <h2 className="text-white font-bold text-[11px] truncate drop-shadow-md">
                    {item.title}
                  </h2>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AlphaSpotlight;
