import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallProductDetailPage', {
  en: {
    secondHand: "Second Hand",
    preOrder: "Pre-order",
    newBooks: "New Books",
    soldOutCaps: "SOLD OUT",
    preOrderCaps: "PRE-ORDER",
    inStock: "IN STOCK",
    untitledBook: "Untitled book",
    unknownAuthor: "Unknown author",
    good: "Good",
    closeDetails: "Close details",
    bookInfo: "Book Information",
    publisher: "Publisher",
    novelType: "Novel Type",
    genre: "Genre",
    paperType: "Paper Type",
    coverType: "Cover Type",
    pageCount: "Page Count",
    pages: "{{count}} pages",
    condition: "Condition",
    category: "Category",
    stock: "Stock",
    description: "Description",
    orderReminder: "Please check title, price, condition, and delivery information before placing your order.",
    noCover: "No Cover",
    watchVideo: "Watch Video",
    video: "VIDEO",
    openMedia: "Open media {{count}}",
    imageAlt: "{{title}} image {{count}}",
    videoTitle: "{{title}} video",
    bookNotFound: "Book not found",
    unavailable: "This Shadow Mall product is not available.",
    loadingBook: "Loading book...",
    backShop: "Back to Shop",
    bookDetail: "Book Detail",
    bestSeller: "BEST SELLER",
    by: "by {{author}}",
    shortInfo: "Short Info",
    noDescription: "No description yet.",
    viewDetails: "View Full Details",
    quantity: "Quantity",
    quantityHelp: "Choose how many books you want",
    addCart: "Add to Cart",
    soldOut: "Sold Out",
    buyNow: "Buy Now",
  },
  km: {
    secondHand: "សៀវភៅមួយទឹក",
    preOrder: "កក់មុន",
    newBooks: "សៀវភៅថ្មី",
    soldOutCaps: "អស់ស្តុក",
    preOrderCaps: "កក់មុន",
    inStock: "មានស្តុក",
    untitledBook: "សៀវភៅគ្មានចំណងជើង",
    unknownAuthor: "មិនស្គាល់អ្នកនិពន្ធ",
    good: "ល្អ",
    closeDetails: "បិទព័ត៌មានលម្អិត",
    bookInfo: "ព័ត៌មានសៀវភៅ",
    publisher: "អ្នកបោះពុម្ព",
    novelType: "ប្រភេទប្រលោមលោក",
    genre: "ប្រភេទរឿង",
    paperType: "ប្រភេទក្រដាស",
    coverType: "ប្រភេទគម្រប",
    pageCount: "ចំនួនទំព័រ",
    pages: "{{count}} ទំព័រ",
    condition: "សភាព",
    category: "ប្រភេទ",
    stock: "ស្តុក",
    description: "ការពិពណ៌នា",
    orderReminder: "សូមពិនិត្យចំណងជើង តម្លៃ សភាព និងព័ត៌មានដឹកជញ្ជូន មុនបញ្ជាទិញ។",
    noCover: "គ្មានគម្រប",
    watchVideo: "មើលវីដេអូ",
    video: "វីដេអូ",
    openMedia: "បើកមេឌៀ {{count}}",
    imageAlt: "រូបភាព {{count}} របស់ {{title}}",
    videoTitle: "វីដេអូ {{title}}",
    bookNotFound: "រកមិនឃើញសៀវភៅ",
    unavailable: "ផលិតផល Shadow Mall នេះមិនមានទេ។",
    loadingBook: "កំពុងផ្ទុកសៀវភៅ...",
    backShop: "ត្រឡប់ទៅហាង",
    bookDetail: "ព័ត៌មានសៀវភៅ",
    bestSeller: "លក់ដាច់",
    by: "ដោយ {{author}}",
    shortInfo: "ព័ត៌មានខ្លី",
    noDescription: "មិនទាន់មានការពិពណ៌នា។",
    viewDetails: "មើលព័ត៌មានលម្អិត",
    quantity: "ចំនួន",
    quantityHelp: "ជ្រើសចំនួនសៀវភៅដែលអ្នកចង់បាន",
    addCart: "បន្ថែមទៅកន្ត្រក",
    soldOut: "អស់ស្តុក",
    buyNow: "ទិញឥឡូវនេះ",
  },
  zh: {
    secondHand: "二手书",
    preOrder: "预购",
    newBooks: "新书",
    soldOutCaps: "售罄",
    preOrderCaps: "预购",
    inStock: "有库存",
    untitledBook: "无标题图书",
    unknownAuthor: "未知作者",
    good: "良好",
    closeDetails: "关闭详情",
    bookInfo: "图书信息",
    publisher: "出版社",
    novelType: "小说类型",
    genre: "类型",
    paperType: "纸张类型",
    coverType: "封面类型",
    pageCount: "页数",
    pages: "{{count}} 页",
    condition: "品相",
    category: "分类",
    stock: "库存",
    description: "描述",
    orderReminder: "下单前请检查书名、价格、品相和配送信息。",
    noCover: "暂无封面",
    watchVideo: "观看视频",
    video: "视频",
    openMedia: "打开媒体 {{count}}",
    imageAlt: "{{title}} 图片 {{count}}",
    videoTitle: "{{title}} 视频",
    bookNotFound: "未找到图书",
    unavailable: "此 Shadow Mall 商品不可用。",
    loadingBook: "正在加载图书...",
    backShop: "返回商店",
    bookDetail: "图书详情",
    bestSeller: "畅销",
    by: "作者：{{author}}",
    shortInfo: "简介",
    noDescription: "暂无描述。",
    viewDetails: "查看完整详情",
    quantity: "数量",
    quantityHelp: "选择你想购买的图书数量",
    addCart: "加入购物车",
    soldOut: "售罄",
    buyNow: "立即购买",
  },
  ja: {
    secondHand: "中古本",
    preOrder: "予約注文",
    newBooks: "新刊",
    soldOutCaps: "売り切れ",
    preOrderCaps: "予約受付",
    inStock: "在庫あり",
    untitledBook: "無題の本",
    unknownAuthor: "不明な作者",
    good: "良好",
    closeDetails: "詳細を閉じる",
    bookInfo: "書籍情報",
    publisher: "出版社",
    novelType: "小説タイプ",
    genre: "ジャンル",
    paperType: "紙の種類",
    coverType: "カバータイプ",
    pageCount: "ページ数",
    pages: "{{count}}ページ",
    condition: "状態",
    category: "カテゴリー",
    stock: "在庫",
    description: "説明",
    orderReminder: "注文前にタイトル、価格、状態、配送情報を確認してください。",
    noCover: "表紙なし",
    watchVideo: "動画を見る",
    video: "動画",
    openMedia: "メディア {{count}} を開く",
    imageAlt: "{{title}} の画像 {{count}}",
    videoTitle: "{{title}} の動画",
    bookNotFound: "本が見つかりません",
    unavailable: "この Shadow Mall 商品は利用できません。",
    loadingBook: "本を読み込み中...",
    backShop: "ショップに戻る",
    bookDetail: "本の詳細",
    bestSeller: "ベストセラー",
    by: "{{author}} 著",
    shortInfo: "概要",
    noDescription: "説明はまだありません。",
    viewDetails: "詳細を見る",
    quantity: "数量",
    quantityHelp: "購入する冊数を選択してください",
    addCart: "カートに追加",
    soldOut: "売り切れ",
    buyNow: "今すぐ購入",
  },
  ko: {
    secondHand: "중고 도서",
    preOrder: "예약 주문",
    newBooks: "신간",
    soldOutCaps: "품절",
    preOrderCaps: "예약 주문",
    inStock: "재고 있음",
    untitledBook: "제목 없는 도서",
    unknownAuthor: "알 수 없는 작가",
    good: "좋음",
    closeDetails: "상세정보 닫기",
    bookInfo: "도서 정보",
    publisher: "출판사",
    novelType: "소설 유형",
    genre: "장르",
    paperType: "용지 유형",
    coverType: "표지 유형",
    pageCount: "페이지 수",
    pages: "{{count}}페이지",
    condition: "상태",
    category: "카테고리",
    stock: "재고",
    description: "설명",
    orderReminder: "주문 전에 제목, 가격, 상태 및 배송 정보를 확인하세요.",
    noCover: "표지 없음",
    watchVideo: "동영상 보기",
    video: "동영상",
    openMedia: "미디어 {{count}} 열기",
    imageAlt: "{{title}} 이미지 {{count}}",
    videoTitle: "{{title}} 동영상",
    bookNotFound: "도서를 찾을 수 없습니다",
    unavailable: "이 Shadow Mall 상품은 이용할 수 없습니다.",
    loadingBook: "도서를 불러오는 중...",
    backShop: "상점으로 돌아가기",
    bookDetail: "도서 상세정보",
    bestSeller: "베스트셀러",
    by: "{{author}} 저",
    shortInfo: "간단 정보",
    noDescription: "아직 설명이 없습니다.",
    viewDetails: "전체 상세정보 보기",
    quantity: "수량",
    quantityHelp: "원하는 도서 수량을 선택하세요",
    addCart: "장바구니에 담기",
    soldOut: "품절",
    buyNow: "지금 구매",
  },
})

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return new Intl.NumberFormat(getDisplayLanguageId(), { style: 'currency', currency: 'USD' }).format(number)
}

function normalizeGallery(value) {
  if (Array.isArray(value)) return value.filter(Boolean).slice(0, 5)
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 5)
  } catch {}

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5)
}

function getYoutubeEmbedUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (raw.includes('youtube.com/embed/')) return raw

  const shortsMatch = raw.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/)
  if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`

  const watchMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]+)/)
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`

  const shortMatch = raw.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`

  return raw
}

function getCategoryLabel(category) {
  if (category === 'second_hand') return getDisplayText('shadowMallProductDetailPage.secondHand')
  if (category === 'pre_order') return getDisplayText('shadowMallProductDetailPage.preOrder')
  return getDisplayText('shadowMallProductDetailPage.newBooks')
}

function getStatusLabel(status) {
  if (status === 'sold_out') return getDisplayText('shadowMallProductDetailPage.soldOutCaps')
  if (status === 'pre_order') return getDisplayText('shadowMallProductDetailPage.preOrderCaps')
  return getDisplayText('shadowMallProductDetailPage.inStock')
}

function getStatusClass(status) {
  if (status === 'sold_out') return 'bg-[#f1f5f9] text-[#64748b] dark:bg-slate-500/15 dark:text-slate-300'
  if (status === 'pre_order') return 'bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-[#dcfce7] text-[#166534] dark:bg-emerald-500/15 dark:text-emerald-300'
}

function normalizeProduct(product) {
  const gallery = normalizeGallery(product.gallery_image_urls || product.image_urls)
  const cover = product.cover_url || ''
  const images = [cover, ...gallery].filter(Boolean)
  const oldPrice = product.old_price_usd === null || product.old_price_usd === undefined || product.old_price_usd === ''
    ? null
    : Number(product.old_price_usd)

  return {
    id: product.id,
    title: product.title || getDisplayText('shadowMallProductDetailPage.untitledBook'),
    author: product.author_name || getDisplayText('shadowMallProductDetailPage.unknownAuthor'),
    cover,
    images,
    youtubeUrl: product.youtube_url || product.video_url || '',
    description: product.description || '',
    category: product.category || 'new_books',
    stockStatus: product.stock_status || 'in_stock',
    price: Number(product.price_usd || 0),
    oldPrice,
    stockQuantity: Number(product.stock_quantity || 0),
    condition: product.condition_label || getDisplayText('shadowMallProductDetailPage.good'),
    publisher: product.publisher || '',
    novelType: product.novel_type || '',
    genre: product.genre || '',
    paperType: product.paper_type || '',
    coverType: product.cover_type || '',
    pageCount: product.page_count || 0,
    isDiscount: Boolean(product.is_discount),
    isBestSeller: Boolean(product.is_best_seller),
  }
}

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null

  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--shadow-border)] py-3 last:border-b-0">
      <div className="min-w-[110px] text-[12px] font-bold text-[var(--shadow-text-secondary)]">{label}</div>
      <div className="text-right text-[12.5px] font-extrabold leading-5 text-[var(--shadow-text-primary)]">{value}</div>
    </div>
  )
}

function FullDetailsSheet({ open, product, onClose }) {
  const { t } = useDisplayTranslation()

  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-[140]">
      <button type="button" aria-label={t('shadowMallProductDetailPage.closeDetails')} onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)] md:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallProductDetailPage.bookInfo')}</div>
            <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{product.title}</div>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] transition active:bg-[var(--shadow-bg-hover)]">
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 pb-5">
          <div className="rounded-[20px] bg-[var(--shadow-bg-soft)] px-4">
            <DetailRow label={t('shadowMallProductDetailPage.publisher')} value={product.publisher} />
            <DetailRow label={t('shadowMallProductDetailPage.novelType')} value={product.novelType} />
            <DetailRow label={t('shadowMallProductDetailPage.genre')} value={product.genre} />
            <DetailRow label={t('shadowMallProductDetailPage.paperType')} value={product.paperType} />
            <DetailRow label={t('shadowMallProductDetailPage.coverType')} value={product.coverType} />
            <DetailRow label={t('shadowMallProductDetailPage.pageCount')} value={product.pageCount ? t('shadowMallProductDetailPage.pages', { count: Number(product.pageCount).toLocaleString(getDisplayLanguageId()) }) : ''} />
            <DetailRow label={t('shadowMallProductDetailPage.condition')} value={product.condition} />
            <DetailRow label={t('shadowMallProductDetailPage.category')} value={getCategoryLabel(product.category)} />
            <DetailRow label={t('shadowMallProductDetailPage.stock')} value={getStatusLabel(product.stockStatus)} />
          </div>

          {product.description ? (
            <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
              <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallProductDetailPage.description')}</div>
              <p className="mt-2 text-[12.5px] font-medium leading-6 text-[var(--shadow-text-secondary)]">{product.description}</p>
            </div>
          ) : null}

          <div className="mt-4 rounded-[18px] bg-[#fff7d8] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
            {t('shadowMallProductDetailPage.orderReminder')}
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageSlider({ images, title, youtubeUrl }) {
  const { t } = useDisplayTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const startXRef = useRef(0)
  const endXRef = useRef(0)
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl)
  const totalSlides = images.length + (embedUrl ? 1 : 0)

  function goTo(index) {
    if (totalSlides <= 0) return
    setActiveIndex(Math.max(0, Math.min(index, totalSlides - 1)))
  }

  function goNext() {
    if (totalSlides <= 1) return
    setActiveIndex((current) => (current + 1 >= totalSlides ? 0 : current + 1))
  }

  function goPrev() {
    if (totalSlides <= 1) return
    setActiveIndex((current) => (current - 1 < 0 ? totalSlides - 1 : current - 1))
  }

  function handleTouchStart(event) {
    startXRef.current = event.touches[0].clientX
    endXRef.current = event.touches[0].clientX
  }

  function handleTouchMove(event) {
    endXRef.current = event.touches[0].clientX
  }

  function handleTouchEnd() {
    const distance = startXRef.current - endXRef.current

    if (Math.abs(distance) < 45) return

    if (distance > 0) {
      goNext()
    } else {
      goPrev()
    }
  }

  function handleMouseDown(event) {
    startXRef.current = event.clientX
    endXRef.current = event.clientX
  }

  function handleMouseMove(event) {
    if (!startXRef.current) return
    endXRef.current = event.clientX
  }

  function handleMouseUp() {
    if (!startXRef.current) return

    const distance = startXRef.current - endXRef.current

    startXRef.current = 0
    endXRef.current = 0

    if (Math.abs(distance) < 45) return

    if (distance > 0) {
      goNext()
    } else {
      goPrev()
    }
  }

  return (
    <div>
      <div
        className="relative cursor-grab overflow-hidden rounded-[26px] bg-[var(--shadow-bg-soft)] shadow-sm ring-1 ring-[var(--shadow-border)] active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative aspect-[2/3] select-none">
          {activeIndex < images.length ? (
            images.length ? (
              <img
                src={images[activeIndex]}
                alt={t('shadowMallProductDetailPage.imageAlt', { title, count: (activeIndex + 1).toLocaleString(getDisplayLanguageId()) })}
                draggable="false"
                className="h-full w-full select-none object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-center text-[13px] font-extrabold text-[var(--shadow-text-tertiary)]">
                {t('shadowMallProductDetailPage.noCover')}
              </div>
            )
          ) : (
            <iframe
              src={embedUrl}
              title={t('shadowMallProductDetailPage.videoTitle', { title })}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}

          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-[#111827] shadow-sm">
            {activeIndex < images.length ? `${Math.min(activeIndex + 1, Math.max(images.length, 1))}/${Math.max(images.length, 1)}` : t('shadowMallProductDetailPage.video')}
          </div>

          {totalSlides > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm active:scale-95 md:flex"
              >
                <i className="fa-solid fa-chevron-left text-[11px]" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm active:scale-95 md:flex"
              >
                <i className="fa-solid fa-chevron-right text-[11px]" />
              </button>
            </>
          ) : null}

          {embedUrl && activeIndex < images.length ? (
            <button
              type="button"
              onClick={() => setActiveIndex(images.length)}
              className="absolute bottom-3 right-3 flex h-10 items-center gap-2 rounded-full bg-[#111827] px-4 text-[12px] font-extrabold text-white shadow-lg active:scale-95"
            >
              <i className="fa-solid fa-play text-[10px]" />
              {t('shadowMallProductDetailPage.watchVideo')}
            </button>
          ) : null}
        </div>
      </div>

      {totalSlides > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={t('shadowMallProductDetailPage.openMedia', { count: (index + 1).toLocaleString(getDisplayLanguageId()) })}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index ? 'w-6 bg-[var(--shadow-text-primary)]' : 'w-2 bg-[var(--shadow-border-strong)]'
              }`}
            />
          ))}
        </div>
      ) : null}

      {totalSlides > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-16 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[var(--shadow-bg-soft)] ring-2 ${
                activeIndex === index ? 'ring-[var(--shadow-text-primary)]' : 'ring-transparent'
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                draggable="false"
                className="h-full w-full object-cover"
              />
            </button>
          ))}

          {embedUrl ? (
            <button
              type="button"
              onClick={() => setActiveIndex(images.length)}
              className={`flex h-16 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#111827] text-white ring-2 ${
                activeIndex === images.length ? 'ring-[#f6b800]' : 'ring-transparent'
              }`}
            >
              <i className="fa-solid fa-play text-[12px]" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function addToLocalCart(product, quantity) {
  const cartKey = 'shadow_mall_cart'
  const current = JSON.parse(localStorage.getItem(cartKey) || '[]')
  const item = {
    id: product.id,
    title: product.title,
    author: product.author,
    cover: product.cover,
    price: product.price,
    quantity,
  }

  const existingIndex = current.findIndex((cartItem) => String(cartItem.id) === String(product.id))

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      quantity: Number(current[existingIndex].quantity || 0) + quantity,
    }
  } else {
    current.push(item)
  }

  localStorage.setItem(cartKey, JSON.stringify(current))
}

export default function ShadowMallProductDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { productId } = useParams()
  const { t } = useDisplayTranslation()
  const [quantity, setQuantity] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function fetchProduct() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/api/shadow-mall/products/${productId}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false || !data.product) {
          throw new Error(data.message || t('shadowMallProductDetailPage.bookNotFound'))
        }

        if (!ignore) {
          setProduct(normalizeProduct(data.product))
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message || t('shadowMallProductDetailPage.bookNotFound'))
          setProduct(null)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProduct()

    return () => {
      ignore = true
    }
  }, [productId])

  if (loading) {
    return (
      <div className="app-page min-h-screen px-4 pt-16">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border-strong)] border-t-[var(--shadow-text-primary)]" />
          <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallProductDetailPage.loadingBook')}</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="app-page min-h-screen px-4 pt-10">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
            <i className="fa-solid fa-book-open text-[18px]" />
          </div>
          <h1 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallProductDetailPage.bookNotFound')}</h1>
          <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{error || t('shadowMallProductDetailPage.unavailable')}</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
          >
            {t('shadowMallProductDetailPage.backShop')}
          </button>
        </div>
      </div>
    )
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const isSoldOut = product.stockStatus === 'sold_out'
  const increaseQuantity = () => setQuantity((value) => Math.min(value + 1, 99))
  const decreaseQuantity = () => setQuantity((value) => Math.max(value - 1, 1))

  const handleAddToCart = () => {
    if (isSoldOut) return
    addToLocalCart(product, quantity)
    navigate('/shop/mall/cart', {
  state: { from: location.pathname + location.search + location.hash },
})
  }

  const handleBuyNow = () => {
    if (isSoldOut) return
    addToLocalCart(product, quantity)
    navigate('/shop/mall/checkout', {
  state: { from: location.pathname + location.search + location.hash },
})
  }

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <FullDetailsSheet open={detailsOpen} product={product} onClose={() => setDetailsOpen(false)} />

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] transition active:scale-95 active:bg-[var(--shadow-bg-hover)]">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallProductDetailPage.bookDetail')}</h1>

          <button type="button" onClick={() =>
  navigate('/shop/mall/cart', {
    state: { from: location.pathname + location.search + location.hash },
  })
}className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 dark:bg-white dark:text-[#111827]">
            <i className="fa-solid fa-cart-shopping text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[28px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <div className="mx-auto w-full max-w-[300px]">
              <ImageSlider images={product.images} title={product.title} youtubeUrl={product.youtubeUrl} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-extrabold text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
                  {getCategoryLabel(product.category)}
                </div>

                <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold ${getStatusClass(product.stockStatus)}`}>
                  {getStatusLabel(product.stockStatus)}
                </div>

                {product.isBestSeller ? (
                  <div className="inline-flex rounded-full bg-[#eef2ff] px-3 py-1 text-[10px] font-extrabold text-[#4f46e5] dark:bg-indigo-500/15 dark:text-indigo-300">
                    {t('shadowMallProductDetailPage.bestSeller')}
                  </div>
                ) : null}
              </div>

              <h2 className="mt-3 text-[22px] font-extrabold leading-8 text-[var(--shadow-text-primary)]">
                {product.title}
              </h2>

              <p className="mt-1 text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('shadowMallProductDetailPage.by', { author: product.author })}
              </p>

              <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
                <div className="flex items-end gap-2">
                  <div className="text-[22px] font-extrabold text-[#e5484d]">
                    {formatUsd(product.price)}
                  </div>
                  {hasDiscount ? (
                    <div className="pb-1 text-[13px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                      {formatUsd(product.oldPrice)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                  <div className="rounded-[14px] bg-[var(--shadow-bg-surface)] px-3 py-2 ring-1 ring-[var(--shadow-border)]">
                    <div className="text-[var(--shadow-text-tertiary)]">{t('shadowMallProductDetailPage.publisher')}</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[var(--shadow-text-primary)]">{product.publisher || '-'}</div>
                  </div>

                  <div className="rounded-[14px] bg-[var(--shadow-bg-surface)] px-3 py-2 ring-1 ring-[var(--shadow-border)]">
                    <div className="text-[var(--shadow-text-tertiary)]">{t('shadowMallProductDetailPage.condition')}</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[var(--shadow-text-primary)]">{product.condition}</div>
                  </div>

                  <div className="rounded-[14px] bg-[var(--shadow-bg-surface)] px-3 py-2 ring-1 ring-[var(--shadow-border)]">
                    <div className="text-[var(--shadow-text-tertiary)]">{t('shadowMallProductDetailPage.genre')}</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[var(--shadow-text-primary)]">{product.genre || '-'}</div>
                  </div>

                  <div className="rounded-[14px] bg-[var(--shadow-bg-surface)] px-3 py-2 ring-1 ring-[var(--shadow-border)]">
                    <div className="text-[var(--shadow-text-tertiary)]">{t('shadowMallProductDetailPage.stock')}</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[var(--shadow-text-primary)]">{Number(product.stockQuantity).toLocaleString(getDisplayLanguageId())}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
                <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallProductDetailPage.shortInfo')}</div>
                <p className="mt-2 line-clamp-3 text-[12.5px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
                  {product.description || t('shadowMallProductDetailPage.noDescription')}
                </p>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--shadow-bg-surface)] px-4 py-2 text-[12px] font-extrabold text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] active:scale-95"
                >
                  {t('shadowMallProductDetailPage.viewDetails')}
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
                <div>
                  <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallProductDetailPage.quantity')}</div>
                  <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{t('shadowMallProductDetailPage.quantityHelp')}</div>
                </div>

                <div className="flex items-center rounded-full bg-[var(--shadow-bg-surface)] p-1 ring-1 ring-[var(--shadow-border)]">
                  <button type="button" onClick={decreaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
                    <i className="fa-solid fa-minus text-[11px]" />
                  </button>
                  <div className="w-11 text-center text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{Number(quantity).toLocaleString(getDisplayLanguageId())}</div>
                  <button type="button" onClick={increaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 dark:bg-white dark:text-[#111827]">
                    <i className="fa-solid fa-plus text-[11px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_1.3fr] gap-3">
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleAddToCart}
            className={`flex h-13 min-h-[52px] items-center justify-center rounded-full border text-[13px] font-extrabold active:scale-[0.99] ${
              isSoldOut
                ? 'border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-disabled)]'
                : 'border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]'
            }`}
          >
            {t('shadowMallProductDetailPage.addCart')}
          </button>

          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleBuyNow}
            className={`flex h-13 min-h-[52px] items-center justify-center rounded-full text-[13px] font-extrabold shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] ${
              isSoldOut
                ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-disabled)]'
                : 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
            }`}
          >
            {isSoldOut ? t('shadowMallProductDetailPage.soldOut') : t('shadowMallProductDetailPage.buyNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
