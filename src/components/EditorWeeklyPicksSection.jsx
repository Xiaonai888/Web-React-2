import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const weeklyPicks = [
  {
    id: 1,
    title: 'Editor Weekly Pick 1',
    subtitle: 'A featured story selected by Shadow editors this week.',
    image: '/assets/Editors Weekly Picks/Editor Weekly Picks 1.jpg',
    link: '/story/1',
  },
  {
    id: 2,
    title: 'Editor Weekly Pick 2',
    subtitle: 'Fresh and exciting content worth checking out this week.',
    image: '/assets/Editors Weekly Picks/Editor Weekly Picks 2.jpg',
    link: '/story/2',
  },
  {
    id: 3,
    title: 'Editor Weekly Pick 3',
    subtitle: 'A special recommendation chosen for For You readers.',
    image: '/assets/Editors Weekly Picks/Editor Weekly Picks 3.jpg',
    link: '/story/3',
  },
];

export default function EditorWeeklyPicksSection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.offsetWidth;
    const currentIndex = Math.round(container.scrollLeft / slideWidth);
    setActiveIndex(currentIndex);
  };

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.offsetWidth;
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth',
    });

    setActiveIndex(index);
  };

  return (
    <section className="mt-8 px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-neutral-900 sm:text-[22px]">
          💥 Editor’s Weekly Picks
        </h2>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {weeklyPicks.map((item) => (
          <div key={item.id} className="w-full shrink-0 snap-center">
            <button
              type="button"
              onClick={() => navigate(item.link)}
              className="group block w-full text-left"
            >
              <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition duration-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                <div className="relative aspect-[2.2/1] w-full overflow-hidden bg-neutral-100 sm:aspect-[2.4/1]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="max-w-[78%]">
                      <div className="mb-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                        Editor’s Choice
                      </div>

                      <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm text-white/85 sm:text-[15px]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {weeklyPicks.map((_, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-2.5 w-6 bg-blue-600'
                  : 'h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
