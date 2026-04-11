import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { topNovelCategories, topNovelData } from '../data/topNovelData';

function RankBadge({ rank }) {
  const styles = {
    1: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 text-white shadow-[0_6px_16px_rgba(217,119,6,0.35)]',
    2: 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 text-white shadow-[0_6px_16px_rgba(100,116,139,0.30)]',
    3: 'bg-gradient-to-br from-amber-200 via-orange-400 to-amber-700 text-white shadow-[0_6px_16px_rgba(180,83,9,0.30)]',
  };

  return (
    <div
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[28px] font-black ${styles[rank] || styles[3]}`}
    >
      {rank}
    </div>
  );
}

export default function TopNovelPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Romance');

  const filteredData = useMemo(() => {
    return topNovelData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-24">
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[22px]">🏆</span>
            <h1 className="text-[22px] font-extrabold tracking-tight text-neutral-900">
              Top Novel
            </h1>
          </div>
        </div>
      </div>

      <section className="px-4 py-5 sm:px-5 lg:px-6">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {topNovelCategories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {filteredData.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.link)}
              className="flex w-full items-start gap-4 text-left"
            >
              <div className="pt-5">
                <RankBadge rank={item.rank} />
              </div>

              <div className="h-[132px] w-[92px] shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <h2 className="line-clamp-1 text-[22px] font-extrabold leading-tight text-[#6b1028]">
                  {item.title}
                </h2>

                <p className="mt-1 line-clamp-1 text-[16px] font-bold text-neutral-900">
                  {item.author}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-blue-700">
                    <span>👁️</span>
                    <span className="font-semibold">{item.views}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-red-600">
                    <span>❤️</span>
                    <span className="font-semibold">{item.likes}</span>
                  </div>
                </div>

                <p className="mt-2 line-clamp-4 text-[14px] leading-7 text-neutral-800">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
