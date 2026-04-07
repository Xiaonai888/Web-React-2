import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const AlphaSpotlight = () => {
  const data = [
    { id: 1, title: "The Revenge", img: "assets/fast/your_book_1.jpg" },
    { id: 2, title: "CEO's Secret", img: "assets/fast/your_book_2.jpg" }
  ];

  return (
    <section className="px-5 mt-4">
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
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative aspect-[16/9]">
              <img src={item.img} className="w-full h-full object-cover rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 p-4 flex flex-col justify-end">
                <h2 className="text-white font-bold text-lg">{item.title}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AlphaSpotlight;
