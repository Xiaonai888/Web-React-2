import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const categories = ['All', 'New Release', 'Best Seller', 'Discount', 'Khmer Novel', 'Pre-order']

const products = [
  {
    id: 1,
    title: 'គ្រោះព្រោះនិស្ស័យ',
    author: 'ពេជ្រ ជិន្នា',
    cover: '/assets/ShadowMall/books/book-1.jpg',
    category: 'Khmer Novel',
    price: '36,000៛',
    oldPrice: '44,000៛',
    badge: 'SALE',
  },
]

function parseSlideTitle(value = '') {
  const match = String(value).match(/^\[(NEW|HOT|TOP)\]\s*(.*)$/i)

  if (!match) {
    return { badge: '', title: value || '' }
  }

  return { badge: match[1].toUpperCase(), title: match[2] || '' }
}

function getSlideBadge(slide) {
  return parseSlideTitle(slide?.title || '').badge
}

function getBadgeClass(badge) {
  if (badge === 'HOT') return 'bg-[#ff3b30] text-white'
  if (badge === 'TOP') return 'bg-[#f6b800] text-[#111827]'
  if (badge === 'NEW') return 'bg-[#111827] text-white'
  return 'bg-white/90 text-[#111827]'
}

function SlideBadge({ badge }) {
  if (!badge) return null

  return (
    <span className={`absolute bottom-3 left-3 z-10 rounded-full px-3 py-1 text-[10px] font-extrabold shadow-sm ${getBadgeClass(badge)}`}>
      {badge}
    </span>
  )
}

function ShadowMallSwiperSlide({ slides, loading, onSlideClick }) {
  const swiperRef = useRef(null)

  useEffect(() => {
    if (!window.Swiper || slides.length === 0) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.shadowMallSwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 80,
        modifier: 2,
        slideShadows: false,
      },
      loop: slides.length > 1,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.shadow-mall-pagination',
        clickable: true,
      },
    })

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [slides])

  if (loading) {
    return (
      <div className="shadow-mall-swiper-container">
        <div className="mx-auto flex aspect-[16/9] w-[85%] items-center justify-center rounded-[20px] bg-[#f4f5f7] text-[13px] font-extrabold text-[#98a2b3] md:w-[58%]">
          Loading mall slides...
        </div>
      </div>
    )
  }

  if (!slides.length) {
    return (
      <div className="shadow-mall-swiper-container">
        <div className="mx-auto flex aspect-[16/9] w-[85%] items-center justify-center rounded-[20px] bg-[#f4f5f7] text-center text-[13px] font-extrabold text-[#98a2b3] md:w-[58%]">
          No Mall Slide yet
        </div>
      </div>
    )
  }

  return (
    <div className="shadow-mall-swiper-container shadowMallSwiper">
      <div className="swiper-wrapper">
        {slides.map((slide, index) => (
          <div key={slide.id || index} className="swiper-slide aspect-[16/9] cursor-pointer">
            <button
              type="button"
              onClick={() => onSlideClick(slide)}
              className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#111827]"
            >
              <img
                src={slide.image_url}
                alt={slide.title || `Mall Slide ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

{slide.subtitle ? (
  <div className="absolute bottom-10 left-3 right-3 z-10 line-clamp-2 text-left text-[12px] font-bold leading-5 text-white drop-shadow">
    {slide.subtitle}
  </div>
) : null}

<SlideBadge badge={getSlideBadge(slide)} />
            </button>
          </div>
        ))}
      </div>

      <div className="shadow-mall-pagination swiper-pagination" />
    </div>
  )
}

function ProductCard({ product, onOpen }) {
  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f3f4f6]">
          <img
            src={product.cover}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          {product.badge ? (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-extrabold text-[#111827] shadow-sm">
              {product.badge}
            </span>
          ) : null}
        </div>
      </button>

      <div className="p-3">
        <button type="button" onClick={onOpen} className="block w-full text-left">
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[19px] text-[#111827]">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#8d94a1]">
            {product.author}
          </p>
        </button>

        <div className="mt-3 flex items-end justify-between gap-2">
          <button type="button" onClick={onOpen} className="min-w-0 text-left">
            <div className="text-[13px] font-extrabold text-[#e5484d]">{product.price}</div>
            {product.oldPrice ? (
              <div className="mt-0.5 text-[10.5px] font-semibold text-[#a0a5b1] line-through">{product.oldPrice}</div>
            ) : null}
          </button>

          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
            aria-label={`Add ${product.title} to cart`}
          >
            <i className="fa-solid fa-cart-shopping text-[12px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallSection({ tabs = [], activeTab = 'Shadow Mall', setActiveTab, showSearch = false }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [mallSlides, setMallSlides] = useState([])
  const [slidesLoading, setSlidesLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchMallSlides() {
      try {
        const response = await fetch(`${API_URL}/api/slides?section_key=mall_top_slider`)
        const data = await response.json().catch(() => ({}))

        if (!ignore && response.ok && data.ok) {
          setMallSlides((data.slides || []).slice(0, 7))
        }
      } catch {
        if (!ignore) {
          setMallSlides([])
        }
      } finally {
        if (!ignore) {
          setSlidesLoading(false)
        }
      }
    }

    fetchMallSlides()

    const interval = setInterval(fetchMallSlides, 5000)

    return () => {
      ignore = true
      clearInterval(interval)
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return products.filter((product) => {
      const categoryMatch = activeCategory === 'All' || product.category === activeCategory
      const searchMatch =
        !keyword ||
        product.title.toLowerCase().includes(keyword) ||
        product.author.toLowerCase().includes(keyword)

      return categoryMatch && searchMatch
    })
  }, [activeCategory, search])

  const handleSlideClick = (slide) => {
    if (slide?.link_url) {
      navigate(slide.link_url)
    }
  }

  return (
    <section className="space-y-5 pb-4">
      <style>{`
        .shadow-mall-swiper-container {
          width: 100%;
          padding-top: 10px;
          padding-bottom: 30px;
          overflow: hidden;
        }

        .shadow-mall-swiper-container .swiper-slide {
          width: 85%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .shadow-mall-swiper-container .swiper-slide-next,
        .shadow-mall-swiper-container .swiper-slide-prev {
          opacity: 0.4;
          transform: scale(0.9);
        }

        .shadow-mall-swiper-container .swiper-pagination-bullet-active {
          background: #111827;
          width: 20px;
          border-radius: 5px;
        }

        @media (min-width: 768px) {
          .shadow-mall-swiper-container .swiper-slide {
            width: 58%;
          }
        }
      `}</style>

      <div className="relative">
  <ShadowMallSwiperSlide
    slides={mallSlides}
    loading={slidesLoading}
    onSlideClick={handleSlideClick}
  />
      {showSearch ? (
  <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
    <div className="flex items-center gap-2 rounded-full bg-[#f4f5f7] px-4 py-3">
      <i className="fa-solid fa-magnifying-glass text-[14px] text-[#8d94a1]" />
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search books or authors"
        className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
      />
      {search ? (
        <button
          type="button"
          onClick={() => setSearch('')}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8d94a1]"
          aria-label="Clear search"
        >
          <i className="fa-solid fa-xmark text-[12px]" />
        </button>
      ) : null}
    </div>
  </div>
) : null}
    
<div className="flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  {tabs.map((tab) => {
    const isActive = activeTab === tab

    return (
      <button
        key={tab}
        type="button"
        onClick={() => setActiveTab?.(tab)}
        className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
          isActive
            ? 'border-black bg-black text-white'
            : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
        }`}
      >
        {tab}
      </button>
    )
  })}
</div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const active = activeCategory === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold transition ${
                active
                  ? 'bg-[#111827] text-white'
                  : 'bg-white text-[#555b66] ring-1 ring-[#eceaf2]'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-extrabold text-[#111827]">Available Books</h3>
        <span className="text-[11px] font-bold text-[#8d94a1]">{filteredProducts.length} items</span>
      </div>

      {filteredProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => navigate(`/shop/mall/product/${product.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-white px-4 py-10 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f5f7] text-[#98a2b3]">
            <i className="fa-solid fa-book-open text-[16px]" />
          </div>
          <div className="mt-3 text-[14px] font-extrabold text-[#111827]">No books found</div>
          <div className="mt-1 text-[12px] text-[#8d94a1]">Try another keyword or category.</div>
        </div>
      )}
    </section>
  )
}
