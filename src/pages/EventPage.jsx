STEP 1 — Web-React-2/src/pages/EventPage.jsx

Find this block inside <style>{` ... `}</style>:

        .eventSwiper {
          width: 100%;
          padding-top: 4px;
          padding-bottom: 26px;
        }
        .eventSwiper .swiper-slide {
          width: 86%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

Replace it with:

        .eventSwiper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          padding-top: 10px;
          padding-bottom: 30px;
        }

        .eventSwiper .swiper-slide {
          width: 85%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .eventSwiper .swiper-slide-next,
        .eventSwiper .swiper-slide-prev {
          opacity: 0.4;
          transform: scale(0.9);
        }

        @media (min-width: 768px) {
          .eventSwiper .swiper-slide {
            width: 58%;
          }
        }


STEP 2 — Still in Web-React-2/src/pages/EventPage.jsx

Find this class inside EventSlideBanner():

className="swiper-slide aspect-[2.6/1] cursor-pointer overflow-hidden rounded-[20px]"

Replace with:

className="swiper-slide aspect-[16/9] cursor-pointer"


STEP 3 — Still in Web-React-2/src/pages/EventPage.jsx

Find loading fallback:

<div className="flex aspect-[2.6/1] w-full items-center justify-center rounded-[20px] bg-[#f4f5f7] text-[14px] font-bold text-[#8d94a1]">

Replace with:

<div className="flex aspect-[16/9] w-full items-center justify-center rounded-[20px] bg-[#f4f5f7] text-[14px] font-bold text-[#8d94a1]">


STEP 4 — Still in Web-React-2/src/pages/EventPage.jsx

Find empty fallback:

<div className="flex aspect-[2.6/1] w-full items-center justify-center rounded-[20px] bg-black text-[34px] font-extrabold text-white/80">

Replace with:

<div className="flex aspect-[16/9] w-full items-center justify-center rounded-[20px] bg-black text-[34px] font-extrabold text-white/80">
