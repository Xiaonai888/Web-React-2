import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addShadowMallCartItem } from '../../utils/shadowMallCart'
import {
  isShadowMallWishlisted,
  toggleShadowMallWishlist,
} from '../../utils/shadowMallWishlist'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallSection', {
  en: {
    diamond: 'Diamond',
    plans: 'Plans',
    soon: 'Soon',
    newBooks: 'New Books',
    newBooksSubtitle: 'Fresh copies and latest arrivals.',
    secondHand: 'Second Hand',
    secondHandSubtitle: 'Checked condition, lower price, limited stock',
    bestSeller: 'Best Seller',
    bestSellerSubtitle: 'Books readers are choosing most',
    discountBooks: 'Discount Books',
    discountBooksSubtitle: 'Special prices while stock lasts',
    preOrder: 'Pre-order',
    preOrderSubtitle: 'Reserve upcoming books before release',
    recentlySoldOut: 'Recently Sold Out',
    recentlySoldOutSubtitle: 'Popular books that sold out recently',
    loadingSlides: 'Loading mall slides...',
    noSlides: 'No Mall Slide yet',
    mallSlide: 'Mall Slide {{count}}',
    badgeNew: 'NEW',
    badgeHot: 'HOT',
    badgeTop: 'TOP',
    soldOut: 'SOLD OUT',
    preOrderStatus: 'PRE-ORDER',
    inStock: 'IN STOCK',
    untitledBook: 'Untitled book',
    unknownAuthor: 'Unknown author',
    removeSaved: 'Remove saved {{title}}',
    save: 'Save {{title}}',
    addToCart: 'Add {{title}} to cart',
    preOrderOpen: 'PRE-ORDER OPEN',
    reserveUpcoming: 'Reserve upcoming books before release',
    preOrderHelp: 'Pre-order books are not ready stock. Check release date and reserve early before closing.',
    status: 'STATUS',
    open: 'Open',
    type: 'TYPE',
    reserve: 'Reserve',
    stock: 'STOCK',
    limited: 'Limited',
    viewPreOrder: 'View Pre-order',
    more: 'More',
    comingSoon: 'Coming soon',
    searchBooksAuthors: 'Search books or authors',
    loadFailed: 'Failed to load Shadow Mall products',
  },
  km: {
    diamond: 'Diamond',
    plans: 'គម្រោង',
    soon: 'មកដល់ឆាប់ៗ',
    newBooks: 'សៀវភៅថ្មី',
    newBooksSubtitle: 'សៀវភៅថ្មីៗ និងទើបមកដល់។',
    secondHand: 'សៀវភៅមួយទឹក',
    secondHandSubtitle: 'បានពិនិត្យស្ថានភាព តម្លៃទាប និងស្តុកមានកំណត់',
    bestSeller: 'លក់ដាច់បំផុត',
    bestSellerSubtitle: 'សៀវភៅដែលអ្នកអានកំពុងជ្រើសរើសច្រើនបំផុត',
    discountBooks: 'សៀវភៅបញ្ចុះតម្លៃ',
    discountBooksSubtitle: 'តម្លៃពិសេស ខណៈស្តុកនៅមាន',
    preOrder: 'កក់ទុកមុន',
    preOrderSubtitle: 'កក់សៀវភៅដែលនឹងចេញ មុនថ្ងៃចេញលក់',
    recentlySoldOut: 'ទើបលក់អស់',
    recentlySoldOutSubtitle: 'សៀវភៅពេញនិយមដែលទើបលក់អស់',
    loadingSlides: 'កំពុងទាញ Mall slides...',
    noSlides: 'មិនទាន់មាន Mall Slide',
    mallSlide: 'Mall Slide {{count}}',
    badgeNew: 'ថ្មី',
    badgeHot: 'កំពុងពេញនិយម',
    badgeTop: 'កំពូល',
    soldOut: 'លក់អស់',
    preOrderStatus: 'កក់ទុកមុន',
    inStock: 'មានក្នុងស្តុក',
    untitledBook: 'សៀវភៅគ្មានចំណងជើង',
    unknownAuthor: 'មិនស្គាល់អ្នកនិពន្ធ',
    removeSaved: 'ដក {{title}} ចេញពីការរក្សាទុក',
    save: 'រក្សាទុក {{title}}',
    addToCart: 'បន្ថែម {{title}} ទៅកន្ត្រក',
    preOrderOpen: 'បើកទទួលការកក់មុន',
    reserveUpcoming: 'កក់សៀវភៅដែលនឹងចេញ មុនថ្ងៃចេញលក់',
    preOrderHelp: 'សៀវភៅ Pre-order មិនមែនជាស្តុករួចរាល់ទេ។ សូមពិនិត្យថ្ងៃចេញលក់ និងកក់មុនពេលបិទការកក់។',
    status: 'ស្ថានភាព',
    open: 'បើក',
    type: 'ប្រភេទ',
    reserve: 'កក់',
    stock: 'ស្តុក',
    limited: 'មានកំណត់',
    viewPreOrder: 'មើល Pre-order',
    more: 'បន្ថែម',
    comingSoon: 'មកដល់ឆាប់ៗ',
    searchBooksAuthors: 'ស្វែងរកសៀវភៅ ឬអ្នកនិពន្ធ',
    loadFailed: 'មិនអាចទាញផលិតផល Shadow Mall បាន',
  },
  zh: {
    diamond: 'Diamond',
    plans: '方案',
    soon: '即将推出',
    newBooks: '新书',
    newBooksSubtitle: '最新书籍与新到商品。',
    secondHand: '二手书',
    secondHandSubtitle: '已检查品相，价格更低，库存有限',
    bestSeller: '畅销书',
    bestSellerSubtitle: '读者选择最多的书籍',
    discountBooks: '折扣书籍',
    discountBooksSubtitle: '库存售完前享受特别价格',
    preOrder: '预订',
    preOrderSubtitle: '在发售前预订即将推出的书籍',
    recentlySoldOut: '最近售罄',
    recentlySoldOutSubtitle: '最近售罄的热门书籍',
    loadingSlides: '正在加载商城幻灯片...',
    noSlides: '暂无商城幻灯片',
    mallSlide: '商城幻灯片 {{count}}',
    badgeNew: '新品',
    badgeHot: '热门',
    badgeTop: '精选',
    soldOut: '已售罄',
    preOrderStatus: '预订',
    inStock: '有库存',
    untitledBook: '未命名书籍',
    unknownAuthor: '未知作者',
    removeSaved: '取消收藏 {{title}}',
    save: '收藏 {{title}}',
    addToCart: '将 {{title}} 加入购物车',
    preOrderOpen: '预订开放',
    reserveUpcoming: '在发售前预订即将推出的书籍',
    preOrderHelp: '预订书籍不是现货。请查看发售日期，并在预订截止前提前预订。',
    status: '状态',
    open: '开放',
    type: '类型',
    reserve: '预订',
    stock: '库存',
    limited: '有限',
    viewPreOrder: '查看预订',
    more: '更多',
    comingSoon: '即将推出',
    searchBooksAuthors: '搜索书籍或作者',
    loadFailed: '无法加载 Shadow Mall 商品',
  },
  ja: {
    diamond: 'Diamond',
    plans: 'プラン',
    soon: '近日公開',
    newBooks: '新刊',
    newBooksSubtitle: '新しい本と最新入荷。',
    secondHand: '中古本',
    secondHandSubtitle: '状態確認済み、低価格、在庫限定',
    bestSeller: 'ベストセラー',
    bestSellerSubtitle: '読者に最も選ばれている本',
    discountBooks: '割引本',
    discountBooksSubtitle: '在庫がある間だけの特別価格',
    preOrder: '予約注文',
    preOrderSubtitle: '発売前の本を事前に予約',
    recentlySoldOut: '最近売り切れ',
    recentlySoldOutSubtitle: '最近売り切れた人気の本',
    loadingSlides: 'モールスライドを読み込み中...',
    noSlides: 'モールスライドはまだありません',
    mallSlide: 'モールスライド {{count}}',
    badgeNew: 'NEW',
    badgeHot: 'HOT',
    badgeTop: 'TOP',
    soldOut: '売り切れ',
    preOrderStatus: '予約注文',
    inStock: '在庫あり',
    untitledBook: '無題の本',
    unknownAuthor: '不明な作家',
    removeSaved: '{{title}} の保存を解除',
    save: '{{title}} を保存',
    addToCart: '{{title}} をカートに追加',
    preOrderOpen: '予約受付中',
    reserveUpcoming: '発売前の本を事前に予約',
    preOrderHelp: '予約注文の本は現物在庫ではありません。発売日を確認し、受付終了前に予約してください。',
    status: '状態',
    open: '受付中',
    type: 'タイプ',
    reserve: '予約',
    stock: '在庫',
    limited: '限定',
    viewPreOrder: '予約注文を見る',
    more: 'もっと見る',
    comingSoon: '近日公開',
    searchBooksAuthors: '本または作家を検索',
    loadFailed: 'Shadow Mallの商品を読み込めませんでした',
  },
  ko: {
    diamond: 'Diamond',
    plans: '플랜',
    soon: '출시 예정',
    newBooks: '신간',
    newBooksSubtitle: '새 책과 최신 입고 상품입니다.',
    secondHand: '중고 도서',
    secondHandSubtitle: '상태 확인 완료, 더 낮은 가격, 한정 재고',
    bestSeller: '베스트셀러',
    bestSellerSubtitle: '독자들이 가장 많이 선택하는 도서',
    discountBooks: '할인 도서',
    discountBooksSubtitle: '재고가 있는 동안 특별 가격',
    preOrder: '예약 주문',
    preOrderSubtitle: '출시 전 예정 도서를 미리 예약하세요',
    recentlySoldOut: '최근 품절',
    recentlySoldOutSubtitle: '최근 품절된 인기 도서',
    loadingSlides: '몰 슬라이드 불러오는 중...',
    noSlides: '아직 몰 슬라이드가 없습니다',
    mallSlide: '몰 슬라이드 {{count}}',
    badgeNew: 'NEW',
    badgeHot: 'HOT',
    badgeTop: 'TOP',
    soldOut: '품절',
    preOrderStatus: '예약 주문',
    inStock: '재고 있음',
    untitledBook: '제목 없는 도서',
    unknownAuthor: '알 수 없는 작가',
    removeSaved: '{{title}} 저장 해제',
    save: '{{title}} 저장',
    addToCart: '{{title}} 장바구니에 추가',
    preOrderOpen: '예약 주문 오픈',
    reserveUpcoming: '출시 전 예정 도서를 미리 예약하세요',
    preOrderHelp: '예약 주문 도서는 현재 재고가 아닙니다. 출시일을 확인하고 마감 전에 미리 예약하세요.',
    status: '상태',
    open: '오픈',
    type: '유형',
    reserve: '예약',
    stock: '재고',
    limited: '한정',
    viewPreOrder: '예약 주문 보기',
    more: '더 보기',
    comingSoon: '출시 예정',
    searchBooksAuthors: '도서 또는 작가 검색',
    loadFailed: 'Shadow Mall 상품을 불러오지 못했습니다',
  },
})

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const mallShortcuts = [
  { key: 'diamond', icon: 'fa-gem', type: 'tab', tab: 'Purchase' },
  { key: 'plans', icon: 'fa-crown', type: 'tab', tab: 'Plans' },
  { key: 'A', icon: 'fa-book-open', type: 'disabled' },
  { key: 'B', icon: 'fa-box-open', type: 'disabled' },
]

const mallSections = [
  { key: 'new_books', titleKey: 'newBooks', subtitleKey: 'newBooksSubtitle' },
  { key: 'second_hand', titleKey: 'secondHand', subtitleKey: 'secondHandSubtitle' },
  { key: 'best_seller', titleKey: 'bestSeller', subtitleKey: 'bestSellerSubtitle' },
  { key: 'discount', titleKey: 'discountBooks', subtitleKey: 'discountBooksSubtitle' },
  { key: 'pre_order', titleKey: 'preOrder', subtitleKey: 'preOrderSubtitle' },
  { key: 'sold_out', titleKey: 'recentlySoldOut', subtitleKey: 'recentlySoldOutSubtitle' },
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

function getBadgeLabel(badge, t) {
  if (badge === 'NEW') return t('shadowMallSection.badgeNew')
  if (badge === 'HOT') return t('shadowMallSection.badgeHot')
  if (badge === 'TOP') return t('shadowMallSection.badgeTop')
  return badge
}

function SlideBadge({ badge, t }) {
  if (!badge) return null

  return (
    <span className={`absolute bottom-3 left-3 z-10 rounded-full px-3 py-1 text-[10px] font-extrabold shadow-sm ${getBadgeClass(badge)}`}>
      {getBadgeLabel(badge, t)}
    </span>
  )
}

function ShadowMallSwiperSlide({ slides, loading, onSlideClick, t }) {
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
        <div className="mx-auto flex aspect-[16/9] w-[85%] items-center justify-center rounded-[20px] bg-[var(--shadow-bg-soft)] text-[13px] font-extrabold text-[var(--shadow-text-tertiary)] md:w-[58%]">
          {t('shadowMallSection.loadingSlides')}
        </div>
      </div>
    )
  }

  if (!slides.length) {
    return (
      <div className="shadow-mall-swiper-container">
        <div className="mx-auto flex aspect-[16/9] w-[85%] items-center justify-center rounded-[20px] bg-[var(--shadow-bg-soft)] text-center text-[13px] font-extrabold text-[var(--shadow-text-tertiary)] md:w-[58%]">
          {t('shadowMallSection.noSlides')}
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
                alt={slide.title || t('shadowMallSection.mallSlide', { count: index + 1 })}
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
              <SlideBadge badge={getSlideBadge(slide)} t={t} />
            </button>
          </div>
        ))}
      </div>
      <div className="shadow-mall-pagination swiper-pagination" />
    </div>
  )
}

function getProductStatus(product, t) {
  const status = String(product.status || 'in_stock').toLowerCase()

  if (status === 'sold_out') {
    return {
      label: t('shadowMallSection.soldOut'),
      className: 'bg-[#f1f5f9] text-[#64748b] dark:bg-slate-500/15 dark:text-slate-300',
      disabled: true,
      coverClass: 'opacity-60',
    }
  }

  if (status === 'pre_order') {
    return {
      label: t('shadowMallSection.preOrderStatus'),
      className: 'bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300',
      disabled: false,
      coverClass: '',
    }
  }

  return {
    label: t('shadowMallSection.inStock'),
    className: 'bg-[#dcfce7] text-[#166534] dark:bg-emerald-500/15 dark:text-emerald-300',
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
    title: product.title || '',
    author: product.author_name || '',
    cover: product.cover_url || '',
    category: product.category || 'new_books',
    price: formatUsd(product.price_usd),
    oldPrice: product.old_price_usd ? formatUsd(product.old_price_usd) : '',
    status: product.stock_status || 'in_stock',
  }
}

function ProductCard({ product, onOpen, t }) {
  const status = getProductStatus(product, t)
  const hasOldPrice = Boolean(String(product.oldPrice || '').trim())
  const displayTitle = product.title || t('shadowMallSection.untitledBook')
  const displayAuthor = product.author || t('shadowMallSection.unknownAuthor')
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
    <article className="overflow-hidden rounded-[22px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[2/3] overflow-hidden bg-[var(--shadow-bg-soft)]">
          {product.cover ? (
            <img
              src={product.cover}
              alt={displayTitle}
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
            aria-label={
              wishlisted
                ? t('shadowMallSection.removeSaved', { title: displayTitle })
                : t('shadowMallSection.save', { title: displayTitle })
            }
            onClick={handleWishlistClick}
          >
            <i className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-[13px]`} />
          </button>
        </div>
      </button>

      <div className="p-3">
        <button type="button" onClick={onOpen} className="block w-full text-left">
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[19px] text-[var(--shadow-text-primary)]">
            {displayTitle}
          </h3>

          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
            {displayAuthor}
          </p>
        </button>

        <div className="mt-3 flex items-end justify-between gap-2">
          <button type="button" onClick={onOpen} className="min-w-0 text-left">
            <div className="text-[13px] font-extrabold text-[#e5484d]">
              {product.price}
            </div>

            {hasOldPrice ? (
              <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
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
                ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]'
                : 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
            }`}
            aria-label={t('shadowMallSection.addToCart', { title: displayTitle })}
          >
            <i className="fa-solid fa-cart-shopping text-[12px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

function MallShortcutRow({ setActiveTab, t }) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-4 gap-3">
      {mallShortcuts.map((item) => {
        const disabled = item.type === 'disabled'
        const label =
          item.key === 'diamond' || item.key === 'plans'
            ? t(`shadowMallSection.${item.key}`)
            : item.key

        return (
          <button
            key={item.key}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (item.type === 'route') navigate(item.path)
              if (item.type === 'tab') setActiveTab?.(item.tab)
            }}
            className={`rounded-[20px] bg-[var(--shadow-bg-surface)] px-2 py-3 text-center transition active:scale-[0.98] active:bg-[var(--shadow-bg-hover)] ${disabled ? 'opacity-45' : ''}`}
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className={`fa-solid ${item.icon} text-[14px]`} />
            </div>
            <div className="mt-2 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">{label}</div>
            {disabled ? (
              <div className="mt-0.5 text-[9px] font-bold text-[var(--shadow-text-tertiary)]">
                {t('shadowMallSection.soon')}
              </div>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function PreOrderFeature({ products, onOpen, t }) {
  const firstProduct = products[0]

  return (
    <section className="overflow-hidden rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-extrabold text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
            {t('shadowMallSection.preOrderOpen')}
          </div>

          <h3 className="mt-3 text-[20px] font-extrabold leading-7 text-[var(--shadow-text-primary)]">
            {t('shadowMallSection.reserveUpcoming')}
          </h3>

          <p className="mt-2 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
            {t('shadowMallSection.preOrderHelp')}
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
          <i className="fa-solid fa-calendar-check text-[22px]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-2">
          <div className="text-[9px] font-bold text-[var(--shadow-text-tertiary)]">
            {t('shadowMallSection.status')}
          </div>
          <div className="mt-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">
            {firstProduct ? t('shadowMallSection.open') : t('shadowMallSection.soon')}
          </div>
        </div>

        <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-2">
          <div className="text-[9px] font-bold text-[var(--shadow-text-tertiary)]">
            {t('shadowMallSection.type')}
          </div>
          <div className="mt-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">
            {t('shadowMallSection.reserve')}
          </div>
        </div>

        <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-2">
          <div className="text-[9px] font-bold text-[var(--shadow-text-tertiary)]">
            {t('shadowMallSection.stock')}
          </div>
          <div className="mt-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">
            {t('shadowMallSection.limited')}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] dark:bg-white dark:text-[#111827]"
        onClick={() => {
          if (firstProduct) onOpen(firstProduct)
        }}
      >
        {t('shadowMallSection.viewPreOrder')}
      </button>
    </section>
  )
}

function MallBookSection({ title, subtitle, books, onOpen, loading, sectionKey, onMore, t }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{title}</h3>
          {subtitle ? <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-tertiary)]">{subtitle}</p> : null}
        </div>
        <button
  type="button"
  className="shrink-0 text-[12px] font-extrabold text-[var(--shadow-text-secondary)]"
  onClick={onMore}
>
  {t('shadowMallSection.more')} &gt;
</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="aspect-[2/3] animate-pulse rounded-[22px] bg-[var(--shadow-bg-soft)]" />
          ))}
        </div>
      ) : books.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {books.map((product) => (
            <ProductCard
              key={`${title}-${product.id}`}
              product={product}
              onOpen={() => onOpen(product)}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-7 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="text-[13px] font-extrabold text-[var(--shadow-text-tertiary)]">
            {t('shadowMallSection.comingSoon')}
          </div>
        </div>
      )}
    </section>
  )
}

export default function ShadowMallSection({ setActiveTab, showSearch = false, sliderOnly = false }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
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

    if (sliderOnly) {
      setProductsLoading(false)
      return
    }

    async function fetchShadowMallHome() {
      try {
        setProductsLoading(true)

        const response = await fetch(`${API_URL}/api/shadow-mall/home`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || t('shadowMallSection.loadFailed'))
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
  }, [sliderOnly])

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
    background: var(--shadow-text-primary);
    opacity: 0.2;
  }

  .shadow-mall-pagination .swiper-pagination-bullet-active {
    width: 20px;
    background: var(--shadow-text-primary);
    border-radius: 5px;
    opacity: 1;
  }
}
      `}</style>

      {showSearch ? (
  <button
    type="button"
    onClick={() => navigate('/shop/mall/search')}
    className="w-full rounded-2xl bg-[var(--shadow-bg-surface)] p-3 text-left shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-[0.99]"
  >
    <div className="flex items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-3">
      <i className="fa-solid fa-magnifying-glass text-[14px] text-[var(--shadow-text-secondary)]" />
      <span className="min-w-0 flex-1 text-[14px] font-semibold text-[var(--shadow-placeholder)]">
        {t('shadowMallSection.searchBooksAuthors')}
      </span>
    </div>
  </button>
) : null}

      <ShadowMallSwiperSlide
        slides={mallSlides}
        loading={slidesLoading}
        onSlideClick={handleSlideClick}
        t={t}
      />
      {!sliderOnly ? <MallShortcutRow setActiveTab={setActiveTab} t={t} /> : null}

      {!sliderOnly ? (
        <PreOrderFeature
          products={filteredSections.pre_order || []}
          onOpen={() => navigate('/shop/mall/pre-order')}
          t={t}
        />
      ) : null}

      {!sliderOnly && mallSections.map((section) => (
        <MallBookSection
          key={section.key}
          title={t(`shadowMallSection.${section.titleKey}`)}
          subtitle={t(`shadowMallSection.${section.subtitleKey}`)}
          books={filteredSections[section.key] || []}
          loading={productsLoading}
          onOpen={openProduct}
          sectionKey={section.key}
          t={t}
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
