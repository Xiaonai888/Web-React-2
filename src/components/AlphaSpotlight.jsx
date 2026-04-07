import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const AlphaSpotlight = () => {
  const spotlightBooks = [
    { id: 1, title: "The Revenge of Bride", img: "assets/fast/your_book_1.jpg", tag: "HOT" },
    { id: 2, title: "CEO's Secret Baby", img: "assets/fast/your_book_2.jpg", tag: "NEW" },
    { id: 3, title: "Omega Dragon King", img: "https://via.placeholder.com/600x400?text=Dragon+King", tag: "END" }
  ];

  return (
    <section className="pt-6 pb-2 bg-white">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.2}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectCoverflow]}
        className="w-full"
      >
        {spotlightBooks.map((book) => (
          <SwiperSlide key={book.id} className="px-2">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img 
                src={book.img} 
                className="w-full h-full object-cover"
                alt={book.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="bg-[#ff3b5c] text-white text-[10px] font-black px-2.5 py-1 rounded-lg w-fit mb-2 shadow-lg">
                  {book.tag}
                </span>
                <h2 className="text-white font-black text-xl leading-tight drop-shadow-md">
                  {book.title}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AlphaSpotlight;
