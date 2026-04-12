import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const weeklyPicks = [
  {
    id: 1,
    title: 'Editor Weekly Pick 1',
    subtitle: 'A featured story selected by Shadow editors this week.',
    image: '/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection 1.jpg',
    link: '/story/1',
    tag: 'NEW',
  },
  {
    id: 2,
    title: 'Editor Weekly Pick 2',
    subtitle: 'Fresh and exciting content worth checking out this week.',
    image: '/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection 2.jpg',
    link: '/story/2',
    tag: 'HOT',
  },
  {
    id: 3,
    title: 'Editor Weekly Pick 3',
    subtitle: 'A special recommendation chosen for For You readers.',
    image: '/assets/EditorWeeklyPicksSection/EditorWeeklyPicksSection 3.jpg',
    link: '/story/3',
    tag: 'TOP',
  },
];

export default function EditorWeeklyPicksSection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragMovedRef = useRef(false);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.offsetWidth * 0.88 + 12;
    const currentIndex = Math.round(container.scrollLeft / slideWidth);
    setActiveIndex(currentIndex);
  };

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.offsetWidth * 0.88 + 12;
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth',
    });

    setActiveIndex(index);
  };

  const handleMouseDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    dragMovedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e) => {
    const container = scrollRef.current;
    if (!container || !isDraggingRef.current) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 4) {
      dragMovedRef.current = true;
    }

    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (e, link) => {
    if (dragMovedRef.current) {
      e.preventDefault();
      return;
    }

    navigate(link);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-3 px-4">
        <h2 className="text-[18px] font-bold tracking-tight text-neutral-900">
           💥 EDITOR’S WEEKLY PICKS
        </h2>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pl-4 pr-10 scrollbar-none cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {weeklyPicks.map((item) => (
          <div
            key={item.id}
            className="mr-3 w-[88%] shrink-0 snap-start"
          >
            <button
              type="button"
              onClick={(e) => handleCardClick(e, item.link)}
              className="group block w-full text-left"
            >
              <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  draggable="false"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-3 flex flex-col justify-end pointer-events-none">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-[#ff3b5c] px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm">
                      {item.tag}
                    </span>

                    <h3 className="truncate text-[11px] font-bold text-white">
                      {item.title}
                    </h3>
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
    </div>
  );
}
