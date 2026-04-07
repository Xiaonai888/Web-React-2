import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const AlphaSpotlight = () => {
  const spotlightData = [
    { id: 1, title: "CEO's Secret Baby", img: "assets/fast/your_book_1.jpg", tag: "NEW" },
    { id: 2, title: "The Revenge", img: "assets/fast/your_book_2.jpg", tag: "HOT" },
    { id: 3, title: "Omega Dragon", img: "https://via.placeholder.com/600x300", tag: "END" },
    { id: 4, title: "My Princess", img: "https://via.placeholder.com/600x300", tag: "TOP" },
    { id: 5, title: "Hidden Love", img: "https://via.placeholder.com/600x300", tag: "NEW" },
    { id: 6, title: "Royal Scheme", img: "https://via.placeholder.com/600x300", tag: "HOT" },
  ];

  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={12}
        slidesPerView={1.3} // បង្ហាញ ១ រូបពេញ និងចំហៀងបន្តិច ដើម្បីឱ្យដឹងថាអាចអូសបាន
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        className="pb-8"
      >
        {spotlightData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent p-4 flex flex-col justify-end">
                <span className="bg-[#ff3b5c] text-white text-[9px] font-bold px-2 py-0.5 rounded-md w-fit mb-1">
                  {item.tag}
                </span>
                <h2 className="text-white font-bold text-sm truncate">{item.title}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AlphaSpotlight;
