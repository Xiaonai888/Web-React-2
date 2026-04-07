import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const AlphaSpotlight = () => {
  const spotlightData = [
    { id: 1, title: "The Revenge", img: "assets/fast/your_book_1.jpg", tag: "Hot" },
    { id: 2, title: "CEO's Secret", img: "assets/fast/your_book_2.jpg", tag: "New" },
    { id: 3, title: "Omega Dragon", img: "https://via.placeholder.com/400x200", tag: "End" },
  ];

  return (
    <section className="alpha-spotlight px-5 mt-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={15}
        slidesPerView={1.1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        className="rounded-2xl overflow-hidden shadow-xl"
      >
        {spotlightData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative aspect-[16/9] w-full">
              <img 
                src={item.img} 
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 rounded-2xl">
                <span className="bg-[#ff3b5c] text-white text-[10px] font-bold px-2 py-0.5 rounded-md w-fit mb-2">
                  {item.tag}
                </span>
                <h2 className="text-white font-extrabold text-lg leading-tight">{item.title}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AlphaSpotlight;
