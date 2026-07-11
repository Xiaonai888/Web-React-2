import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addShadowMallCartItem } from '../../utils/shadowMallCart'
import {
  isShadowMallWishlisted,
  toggleShadowMallWishlist,
} from '../../utils/shadowMallWishlist'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const mallShortcuts = [
  { label: 'Diamond', icon: 'fa-gem', type: 'tab', tab: 'Purchase' },
  { label: 'Plans', icon: 'fa-crown', type: 'tab', tab: 'Plans' },
  { label: 'A', icon: 'fa-book-open', type: 'disabled' },
  { label: 'B', icon: 'fa-box-open', type: 'disabled' },
]

const mallSections = [
  { key: 'new_books', title: 'New Books', subtitle: 'Fresh copies and latest arrivals.' },
  { key: 'second_hand', title: 'Second Hand', subtitle: 'Checked condition, lower price, limited stock' },
  { key: 'best_seller', title: 'Best Seller', subtitle: 'Books readers are choosing most' },
  { key: 'discount', title: 'Discount Books', subtitle: 'Special prices while stock lasts' },
  { key: 'pre_order', title: 'Pre-order', subtitle: 'Reserve upcoming books before release' },
  { key: 'sold_out', title: 'Recently Sold Out', subtitle: 'Popular books that sold out recently' },
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
  centeredSlides: false,
  slidesPerView: 1,
  spaceBetween: 0,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 80,
    modifier: 2,
    slideShadows: false,
  },
  breakpoints: {
    768: {
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
    },
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
              className="relative h-full w-full overflow-hidden bg-[#111827] md:rounded-[20px]"
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

function getProductStatus(product) {
  const status = String(product.status || 'in_stock').toLowerCase()

  if (status === 'sold_out') {
    return {
      label: 'SOLD OUT',
      className: 'bg-[#f1f5f9] text-[#64748b]',
      disabled: true,
      coverClass: 'opacity-60',
    }
  }

  if (status === 'pre_order') {
    return {
      label: 'PRE-ORDER',
      className: 'bg-[#fff7d8] text-[#7a5600]',
      disabled: false,
      coverClass: '',
    }
  }

  return {
    label: 'IN STOCK',
    className: 'bg-[#dcfce7] text-[#166534]',
    disabled: false,
    coverClass: '',
  }
}

function formatUsd(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return `$${number.toFixed(2)}`
}

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title || 'Untitled book',
    author: product.author_name || 'Unknown author',
    cover: product.cover_url || '',
    category: product.category || 'new_books',
    price: formatUsd(product.price_usd),
    oldPrice: product.old_price_usd ? formatUsd(product.old_price_usd) : '',
    status: product.stock_status || 'in_stock',
  }
}

function ProductCard({ product, onOpen }) {
  const status = getProductStatus(product)
  const hasOldPrice = Boolean(String(product.oldPrice || '').trim())
  const [wishlisted, setWishlisted] = useState(() => isShadowMallWishlisted(product.id))

  useEffect(() => {
    const refreshWishlist = () => {
      setWishlisted(isShadowMallWishlisted(product.id))
    }

    window.addEventListener('shadow-mall-wishlist-change', refreshWishlist)
    window.addEventListener('storage', refreshWishlist)
    window.addEventListener('focus', refreshWishlist)

    return () => {
      window.removeEventListener('shadow-mall-wishlist-change', refreshWishlist)
      window.removeEventListener('storage', refreshWishlist)
      window.removeEventListener('focus', refreshWishlist)
    }
  }, [product.id])

  function handleWishlistClick(event) {
    event.stopPropagation()
    const result = toggleShadowMallWishlist(product)
    setWishlisted(result.wishlisted)
  }

  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f3f4f6]">
          {product.cover ? (
            <img
              src={product.cover}
              alt={product.title}
              className={`h-full w-full object-cover transition duration-300 hover:scale-[1.03] ${status.coverClass}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : null}

          <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-extrabold shadow-sm ${status.className}`}>
            {status.label}
          </span>

          <button
            type="button"
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm active:scale-95 ${
              wishlisted ? 'text-[#e5484d]' : 'text-[#111827]'
            }`}
            aria-label={`${wishlisted ? 'Remove saved' : 'Save'} ${product.title}`}
            onClick={handleWishlistClick}
          >
            <i className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-[13px]`} />
          </button>
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
            <div className="text-[13px] font-extrabold text-[#e5484d]">
              {product.price}
            </div>

            {hasOldPrice ? (
              <div className="mt-0.5 text-[10.5px] font-semibold text-[#a0a5b1] line-through">
                {product.oldPrice}
              </div>
            ) : null}
          </button>

          <button
            type="button"
            disabled={status.disabled}
            onClick={(event) => {
              event.stopPropagation()
              if (status.disabled) return
              addShadowMallCartItem(product, 1)
            }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:scale-95 ${
              status.disabled
                ? 'bg-[#eef2f7] text-[#98a2b3]'
                : 'bg-[#111827] text-white'
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            <i className="fa-solid fa-cart-shopping text-[12px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

function MallShortcutRow({ setActiveTab }) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-4 gap-3">
      {mallShortcuts.map((item) => {
        const disabled = item.type === 'disabled'

        return (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (item.type === 'route') navigate(item.path)
              if (item.type === 'tab') setActiveTab?.(item.tab)
            }}
            className={`rounded-[20px] bg-white px-2 py-3 text-center active:scale-[0.98] ${disabled ? 'opacity-45' : ''}`}
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f5f7] text-[#111827]">
              <i className={`fa-solid ${item.icon} text-[14px]`} />
            </div>
            <div className="mt-2 text-[11px] font-extrabold text-[#111827]">{item.label}</div>
            {disabled ? <div className="mt-0.5 text-[9px] font-bold text-[#98a2b3]">Soon</div> : null}
          </button>
        )
      })}
    </div>
  )
}

function PreOrderFeature({ products, onOpen }) {
  const firstProduct = products[0]

  return (
    <section className="overflow-hidden rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-extrabold text-[#7a5600]">
            PRE-ORDER OPEN
          </div>

          <h3 className="mt-3 text-[20px] font-extrabold leading-7 text-[#111827]">
            Reserve upcoming books before release
          </h3>

          <p className="mt-2 text-[12px] font-semibold leading-5 text-[#8d94a1]">
            Pre-order books are not ready stock. Check release date and reserve early before closing.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#f4f5f7] text-[#111827]">
          <i className="fa-solid fa-calendar-check text-[22px]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-[16px] bg-[#f8f8f8] px-3 py-2">
          <div className="text-[9px] font-bold text-[#98a2b3]">STATUS</div>
          <div className="mt-1 text-[11px] font-extrabold text-[#111827]">{firstProduct ? 'Open' : 'Soon'}</div>
        </div>

        <div className="rounded-[16px] bg-[#f8f8f8] px-3 py-2">
          <div className="text-[9px] font-bold text-[#98a2b3]">TYPE</div>
          <div className="mt-1 text-[11px] font-extrabold text-[#111827]">Reserve</div>
        </div>

        <div className="rounded-[16px] bg-[#f8f8f8] px-3 py-2">
          <div className="text-[9px] font-bold text-[#98a2b3]">STOCK</div>
          <div className="mt-1 text-[11px] font-extrabold text-[#111827]">Limited</div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99]"
        onClick={() => {
          if (firstProduct) onOpen(firstProduct)
        }}
      >
        View Pre-order
      </button>
    </section>
  )
}

function MallBookSection({ title, subtitle, books, onOpen, loading, sectionKey, onMore }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] font-extrabold text-[#111827]">{title}</h3>
          {subtitle ? <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[#98a2b3]">{subtitle}</p> : null}
        </div>
        <button
  type="button"
  className="shrink-0 text-[12px] font-extrabold text-[#8d94a1]"
  onClick={onMore}
>
  More &gt;
</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="aspect-[2/3] animate-pulse rounded-[22px] bg-[#eef2f7]" />
          ))}
        </div>
      ) : books.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {books.map((product) => (
            <ProductCard key={`${title}-${product.id}`} product={product} onOpen={() => onOpen(product)} />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-white px-4 py-7 text-center shadow-sm ring-1 ring-black/5">
          <div className="text-[13px] font-extrabold text-[#98a2b3]">Coming soon</div>
        </div>
      )}
    </section>
  )
}

export default function ShadowMallSection({ setActiveTab, showSearch = false }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [mallSlides, setMallSlides] = useState([])
  const [slidesLoading, setSlidesLoading] = useState(true)
  const [homeSections, setHomeSections] = useState({
    new_books: [],
    second_hand: [],
    best_seller: [],
    discount: [],
    pre_order: [],
    sold_out: [],
  })
  const [productsLoading, setProductsLoading] = useState(true)

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
        if (!ignore) setMallSlides([])
      } finally {
        if (!ignore) setSlidesLoading(false)
      }
    }

    fetchMallSlides()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function fetchShadowMallHome() {
      try {
        setProductsLoading(true)

        const response = await fetch(`${API_URL}/api/shadow-mall/home`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load Shadow Mall products')
        }

        const sections = data.sections || {}

        if (!ignore) {
          setHomeSections({
            new_books: (sections.new_books || []).map(normalizeProduct),
            second_hand: (sections.second_hand || []).map(normalizeProduct),
            best_seller: (sections.best_seller || []).map(normalizeProduct),
            discount: (sections.discount || []).map(normalizeProduct),
            pre_order: (sections.pre_order || []).map(normalizeProduct),
            sold_out: (sections.sold_out || []).map(normalizeProduct),
          })
        }
      } catch {
        if (!ignore) {
          setHomeSections({
            new_books: [],
            second_hand: [],
            best_seller: [],
            discount: [],
            pre_order: [],
            sold_out: [],
          })
        }
      } finally {
        if (!ignore) setProductsLoading(false)
      }
    }

    fetchShadowMallHome()

    return () => {
      ignore = true
    }
  }, [])

  const filteredSections = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) return homeSections

    const nextSections = {}

    Object.entries(homeSections).forEach(([key, items]) => {
      nextSections[key] = items.filter((product) => {
        return (
          product.title.toLowerCase().includes(keyword) ||
          product.author.toLowerCase().includes(keyword) ||
          String(product.category || '').toLowerCase().includes(keyword)
        )
      })
    })

    return nextSections
  }, [homeSections, search])

  const handleSlideClick = () => {}

  const openProduct = (product) => {
    navigate(`/shop/mall/product/${product.id}`)
  }

  return (
    <section className="space-y-5 pb-4">
      <style>{`
        .shadow-mall-swiper-container {
  width: calc(100% + 2rem);
  margin-left: -1rem;
  margin-right: -1rem;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}

.shadow-mall-swiper-container .swiper-slide {
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  transition: all 0.3s ease;
}

.shadow-mall-swiper-container .swiper-slide-next,
.shadow-mall-swiper-container .swiper-slide-prev {
  opacity: 1;
  transform: none;
}

.shadow-mall-pagination {
  left: auto !important;
  right: 10px !important;
  bottom: 8px !important;
  width: auto !important;
  text-align: right;
}

.shadow-mall-pagination .swiper-pagination-bullet {
  width: 5px;
  height: 5px;
  margin: 0 2px !important;
  background: rgba(255, 255, 255, 0.65);
  opacity: 1;
}

.shadow-mall-pagination .swiper-pagination-bullet-active {
  width: 5px;
  background: #ffffff;
  border-radius: 50%;
}

@media (min-width: 768px) {
  .shadow-mall-swiper-container {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding-top: 10px;
    padding-bottom: 30px;
  }

  .shadow-mall-swiper-container .swiper-slide {
    width: 58%;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  .shadow-mall-swiper-container .swiper-slide-next,
  .shadow-mall-swiper-container .swiper-slide-prev {
    opacity: 0.4;
    transform: scale(0.9);
  }

  .shadow-mall-pagination {
    left: 0 !important;
    right: 0 !important;
    bottom: 10px !important;
    width: 100% !important;
    text-align: center;
  }

  .shadow-mall-pagination .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    margin: 0 4px !important;
    background: #111827;
    opacity: 0.2;
  }

  .shadow-mall-pagination .swiper-pagination-bullet-active {
    width: 20px;
    background: #111827;
    border-radius: 5px;
    opacity: 1;
  }
}
      `}</style>

      {showSearch ? (
  <button
    type="button"
    onClick={() => navigate('/shop/mall/search')}
    className="w-full rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
  >
    <div className="flex items-center gap-2 rounded-full bg-[#f4f5f7] px-4 py-3">
      <i className="fa-solid fa-magnifying-glass text-[14px] text-[#8d94a1]" />
      <span className="min-w-0 flex-1 text-[14px] font-semibold text-[#9ca3af]">
        Search books or authors
      </span>
    </div>
  </button>
) : null}

      <ShadowMallSwiperSlide slides={mallSlides} loading={slidesLoading} onSlideClick={handleSlideClick} />
      <MallShortcutRow setActiveTab={setActiveTab} />

      <PreOrderFeature products={filteredSections.pre_order || []} onOpen={() => navigate('/shop/mall/pre-order')} />

      {mallSections.map((section) => (
        <MallBookSection
          key={section.key}
          title={section.title}
          subtitle={section.subtitle}
          books={filteredSections[section.key] || []}
          loading={productsLoading}
          onOpen={openProduct}
          sectionKey={section.key}
onMore={() => {
  if (section.key === 'new_books') navigate('/shop/mall/new-books')
  if (section.key === 'second_hand') navigate('/shop/mall/second-hand')
  if (section.key === 'best_seller') navigate('/shop/mall/best-seller')
  if (section.key === 'discount') navigate('/shop/mall/discount-books')
  if (section.key === 'pre_order') navigate('/shop/mall/pre-order')
  if (section.key === 'sold_out') navigate('/shop/mall/recently-sold-out')
}}
        />
      ))}
    </section>
  )
}
