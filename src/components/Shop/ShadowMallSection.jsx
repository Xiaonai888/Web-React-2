import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mallSlides = [
  { id: 1, badge: 'NEW', image: '/assets/ShadowMall/slide-1.jpg', title: 'Shadow Mall', subtitle: 'Official books from Shadow Era' },
  { id: 2, badge: 'HOT', image: '/assets/ShadowMall/slide-2.jpg', title: 'Khmer Novels', subtitle: 'Printed stories for your shelf' },
  { id: 3, badge: 'TOP', image: '/assets/ShadowMall/slide-3.jpg', title: 'Reader Picks', subtitle: 'Books selected for Shadow readers' },
  { id: 4, badge: 'NEW', image: '/assets/ShadowMall/slide-4.jpg', title: 'New Release', subtitle: 'Fresh books and upcoming titles' },
  { id: 5, badge: 'HOT', image: '/assets/ShadowMall/slide-5.jpg', title: 'Special Price', subtitle: 'Discount books when available' },
  { id: 6, badge: 'TOP', image: '/assets/ShadowMall/slide-6.jpg', title: 'Author Spotlight', subtitle: 'Featured authors and publishers' },
  { id: 7, badge: 'NEW', image: '/assets/ShadowMall/slide-7.jpg', title: 'Pre-order', subtitle: 'Reserve upcoming books early' },
]

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

function getBadgeClass(badge) {
  if (badge === 'HOT') return 'bg-[#ff3b30] text-white'
  if (badge === 'TOP') return 'bg-[#f6b800] text-[#111827]'
  if (badge === 'NEW') return 'bg-[#111827] text-white'
  return 'bg-white/90 text-[#111827]'
}

function SlideBadge({ badge }) {
  if (!badge) return null

  return (
    <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold shadow-sm ${getBadgeClass(badge)}`}>
      {badge}
    </span>
  )
}

function ShadowMallHeroSlide() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Shadow Mall Slide</h3>
          <p className="mt-0.5 text-[11px] font-semibold text-[#8d94a1]">Featured books and mall updates</p>
        </div>

        <div className="flex gap-1.5">
          {mallSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-5 bg-[#111827]' : 'w-2 bg-[#d7dbe3]'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] bg-[#111827] shadow-sm ring-1 ring-black/5">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {mallSlides.map((slide) => (
            <button
              key={slide.id}
              type="button"
              className="relative aspect-[16/9] w-full shrink-0 overflow-hidden text-left"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover opacity-80"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
              <SlideBadge badge={slide.badge} />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="line-clamp-1 text-[22px] font-extrabold text-white">{slide.title}</div>
                <div className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-white/75">{slide.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function ShadowMallBannerRow() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-extrabold text-[#111827]">Mall Banner</h3>
        <span className="text-[11px] font-bold text-[#8d94a1]">7 slides</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mallSlides.map((slide) => (
          <button
            key={slide.id}
            type="button"
            className="relative aspect-[16/9] w-[82%] max-w-[520px] shrink-0 overflow-hidden rounded-[24px] bg-[#111827] text-left shadow-sm ring-1 ring-black/5 sm:w-[48%] lg:w-[33%]"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover opacity-80"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
            <SlideBadge badge={slide.badge} />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="line-clamp-1 text-[17px] font-extrabold text-white">{slide.title}</div>
              <div className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-white/75">{slide.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
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

export default function ShadowMallSection() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

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

  return (
    <section className="space-y-5 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#111827]">Shadow Mall</h2>
          <p className="mt-1 text-[12px] font-medium text-[#8d94a1]">Buy official printed books from Shadow Era</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/shop/mall/cart')}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm active:scale-95"
          aria-label="Open cart"
        >
          <i className="fa-solid fa-cart-shopping text-[15px]" />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">
            0
          </span>
        </button>
      </div>

      <div className="flex h-12 items-center rounded-full bg-[#f4f5f7] px-4 ring-1 ring-black/5">
        <i className="fa-solid fa-magnifying-glass mr-3 text-[13px] text-[#98a2b3]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search books, author, publisher..."
          className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#111827] outline-none placeholder:text-[#a0a5b1]"
        />
      </div>

      <ShadowMallHeroSlide />

      <ShadowMallBannerRow />

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
