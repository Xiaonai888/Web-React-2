import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoreProductDetail', {
  "en": {
    "untitledBook": "Untitled book",
    "author": "Author",
    "pdfBooks": "PDF Books",
    "newBooks": "New Books",
    "good": "Good",
    "preOrder": "PRE-ORDER",
    "inStock": "IN STOCK",
    "outOfStock": "OUT OF STOCK",
    "failedLoad": "Failed to load product",
    "bookNotFound": "Book not found",
    "closeDetails": "Close details",
    "bookInformation": "Book Information",
    "category": "Category",
    "productType": "Product Type",
    "condition": "Condition",
    "paperType": "Paper Type",
    "pageCount": "Page Count",
    "pages": "{{count}} pages",
    "stock": "Stock",
    "accessRule": "Access Rule",
    "deliveryNote": "Delivery Note",
    "description": "Description",
    "noDescription": "No description yet.",
    "noCover": "No Cover",
    "openMedia": "Open media {{number}}",
    "loadingBook": "Loading book...",
    "notAvailable": "This author store product is not available.",
    "goBack": "Go back",
    "bookDetail": "Book Detail",
    "byAuthor": "by {{author}}",
    "type": "Type",
    "digital": "Digital",
    "shortInfo": "Short Info",
    "viewFullDetails": "View Full Details",
    "quantity": "Quantity",
    "quantityHelp": "Choose how many books you want",
    "addToCart": "Add to Cart",
    "buyNow": "Buy Now",
    "openCart": "Open cart",
    "previousImage": "Previous image",
    "nextImage": "Next image",
    "book": "Book",
    "pdf": "PDF",
    "newRelease": "New Release",
    "bestSeller": "Best Seller",
    "secondHand": "Second Hand",
    "authorPicks": "Author Picks",
    "soldOut": "Sold out",
    "new": "New",
    "decreaseQuantity": "Decrease quantity",
    "increaseQuantity": "Increase quantity",
    "imageAlt": "{{title}} image {{number}}",
    "thumbnailAlt": "{{title}} thumbnail {{number}}"
  },
  "km": {
    "untitledBook": "សៀវភៅគ្មានចំណងជើង",
    "author": "អ្នកនិពន្ធ",
    "pdfBooks": "សៀវភៅ PDF",
    "newBooks": "សៀវភៅថ្មី",
    "good": "ល្អ",
    "preOrder": "បញ្ជាទិញមុន",
    "inStock": "មានក្នុងស្តុក",
    "outOfStock": "អស់ពីស្តុក",
    "failedLoad": "មិនអាចផ្ទុកទំនិញបានទេ",
    "bookNotFound": "រកមិនឃើញសៀវភៅ",
    "closeDetails": "បិទព័ត៌មានលម្អិត",
    "bookInformation": "ព័ត៌មានសៀវភៅ",
    "category": "ប្រភេទ",
    "productType": "ប្រភេទទំនិញ",
    "condition": "សភាព",
    "paperType": "ប្រភេទក្រដាស",
    "pageCount": "ចំនួនទំព័រ",
    "pages": "{{count}} ទំព័រ",
    "stock": "ស្តុក",
    "accessRule": "លក្ខខណ្ឌចូលប្រើ",
    "deliveryNote": "កំណត់ចំណាំដឹកជញ្ជូន",
    "description": "ការពិពណ៌នា",
    "noDescription": "មិនទាន់មានការពិពណ៌នា។",
    "noCover": "គ្មានគម្រប",
    "openMedia": "បើករូបទី {{number}}",
    "loadingBook": "កំពុងផ្ទុកសៀវភៅ...",
    "notAvailable": "ទំនិញនេះក្នុងហាងអ្នកនិពន្ធមិនមានទេ។",
    "goBack": "ត្រឡប់ក្រោយ",
    "bookDetail": "ព័ត៌មានសៀវភៅ",
    "byAuthor": "ដោយ {{author}}",
    "type": "ប្រភេទ",
    "digital": "ឌីជីថល",
    "shortInfo": "ព័ត៌មានខ្លី",
    "viewFullDetails": "មើលព័ត៌មានលម្អិត",
    "quantity": "ចំនួន",
    "quantityHelp": "ជ្រើសចំនួនសៀវភៅដែលអ្នកចង់បាន",
    "addToCart": "បន្ថែមទៅរទេះ",
    "buyNow": "ទិញឥឡូវ",
    "openCart": "បើករទេះ",
    "previousImage": "រូបមុន",
    "nextImage": "រូបបន្ទាប់",
    "book": "សៀវភៅ",
    "pdf": "PDF",
    "newRelease": "ចេញថ្មី",
    "bestSeller": "លក់ដាច់បំផុត",
    "secondHand": "សៀវភៅមួយទឹក",
    "authorPicks": "ជម្រើសអ្នកនិពន្ធ",
    "soldOut": "អស់ពីស្តុក",
    "new": "ថ្មី",
    "decreaseQuantity": "បន្ថយចំនួន",
    "increaseQuantity": "បង្កើនចំនួន",
    "imageAlt": "រូបទី {{number}} របស់ {{title}}",
    "thumbnailAlt": "រូបតូចទី {{number}} របស់ {{title}}"
  },
  "zh": {
    "untitledBook": "未命名书籍",
    "author": "作者",
    "pdfBooks": "PDF 书籍",
    "newBooks": "新书",
    "good": "良好",
    "preOrder": "预购",
    "inStock": "有库存",
    "outOfStock": "缺货",
    "failedLoad": "无法加载商品",
    "bookNotFound": "找不到书籍",
    "closeDetails": "关闭详情",
    "bookInformation": "书籍信息",
    "category": "分类",
    "productType": "商品类型",
    "condition": "品相",
    "paperType": "纸张类型",
    "pageCount": "页数",
    "pages": "{{count}} 页",
    "stock": "库存",
    "accessRule": "访问规则",
    "deliveryNote": "配送备注",
    "description": "描述",
    "noDescription": "暂无描述。",
    "noCover": "无封面",
    "openMedia": "打开第 {{number}} 张图片",
    "loadingBook": "正在加载书籍...",
    "notAvailable": "此作者商店商品不可用。",
    "goBack": "返回",
    "bookDetail": "书籍详情",
    "byAuthor": "作者：{{author}}",
    "type": "类型",
    "digital": "数字版",
    "shortInfo": "简要信息",
    "viewFullDetails": "查看完整详情",
    "quantity": "数量",
    "quantityHelp": "选择要购买的书籍数量",
    "addToCart": "加入购物车",
    "buyNow": "立即购买",
    "openCart": "打开购物车",
    "previousImage": "上一张图片",
    "nextImage": "下一张图片",
    "book": "书籍",
    "pdf": "PDF",
    "newRelease": "最新发行",
    "bestSeller": "畅销书",
    "secondHand": "二手书",
    "authorPicks": "作者精选",
    "soldOut": "售罄",
    "new": "全新",
    "decreaseQuantity": "减少数量",
    "increaseQuantity": "增加数量",
    "imageAlt": "{{title}} 图片 {{number}}",
    "thumbnailAlt": "{{title}} 缩略图 {{number}}"
  },
  "ja": {
    "untitledBook": "無題の本",
    "author": "著者",
    "pdfBooks": "PDF ブック",
    "newBooks": "新刊",
    "good": "良好",
    "preOrder": "予約注文",
    "inStock": "在庫あり",
    "outOfStock": "在庫切れ",
    "failedLoad": "商品を読み込めませんでした",
    "bookNotFound": "本が見つかりません",
    "closeDetails": "詳細を閉じる",
    "bookInformation": "書籍情報",
    "category": "カテゴリ",
    "productType": "商品タイプ",
    "condition": "状態",
    "paperType": "紙の種類",
    "pageCount": "ページ数",
    "pages": "{{count}} ページ",
    "stock": "在庫",
    "accessRule": "アクセス条件",
    "deliveryNote": "配送メモ",
    "description": "説明",
    "noDescription": "説明はまだありません。",
    "noCover": "表紙なし",
    "openMedia": "画像 {{number}} を開く",
    "loadingBook": "本を読み込み中...",
    "notAvailable": "この著者ストア商品は利用できません。",
    "goBack": "戻る",
    "bookDetail": "本の詳細",
    "byAuthor": "著者：{{author}}",
    "type": "タイプ",
    "digital": "デジタル",
    "shortInfo": "概要",
    "viewFullDetails": "詳細をすべて見る",
    "quantity": "数量",
    "quantityHelp": "購入する本の数量を選択してください",
    "addToCart": "カートに追加",
    "buyNow": "今すぐ購入",
    "openCart": "カートを開く",
    "previousImage": "前の画像",
    "nextImage": "次の画像",
    "book": "本",
    "pdf": "PDF",
    "newRelease": "新刊",
    "bestSeller": "ベストセラー",
    "secondHand": "中古",
    "authorPicks": "著者のおすすめ",
    "soldOut": "売り切れ",
    "new": "新品",
    "decreaseQuantity": "数量を減らす",
    "increaseQuantity": "数量を増やす",
    "imageAlt": "{{title}} 画像 {{number}}",
    "thumbnailAlt": "{{title}} サムネイル {{number}}"
  },
  "ko": {
    "untitledBook": "제목 없는 책",
    "author": "작가",
    "pdfBooks": "PDF 도서",
    "newBooks": "새 책",
    "good": "좋음",
    "preOrder": "예약 주문",
    "inStock": "재고 있음",
    "outOfStock": "품절",
    "failedLoad": "상품을 불러오지 못했습니다",
    "bookNotFound": "책을 찾을 수 없습니다",
    "closeDetails": "상세 정보 닫기",
    "bookInformation": "도서 정보",
    "category": "카테고리",
    "productType": "상품 유형",
    "condition": "상태",
    "paperType": "종이 종류",
    "pageCount": "페이지 수",
    "pages": "{{count}}페이지",
    "stock": "재고",
    "accessRule": "접근 규칙",
    "deliveryNote": "배송 메모",
    "description": "설명",
    "noDescription": "아직 설명이 없습니다.",
    "noCover": "표지 없음",
    "openMedia": "이미지 {{number}} 열기",
    "loadingBook": "책 불러오는 중...",
    "notAvailable": "이 작가 스토어 상품을 이용할 수 없습니다.",
    "goBack": "뒤로",
    "bookDetail": "책 상세 정보",
    "byAuthor": "{{author}} 작가",
    "type": "유형",
    "digital": "디지털",
    "shortInfo": "간단 정보",
    "viewFullDetails": "전체 상세 보기",
    "quantity": "수량",
    "quantityHelp": "원하는 책 수량을 선택하세요",
    "addToCart": "장바구니에 추가",
    "buyNow": "지금 구매",
    "openCart": "장바구니 열기",
    "previousImage": "이전 이미지",
    "nextImage": "다음 이미지",
    "book": "책",
    "pdf": "PDF",
    "newRelease": "신간",
    "bestSeller": "베스트셀러",
    "secondHand": "중고",
    "authorPicks": "작가 추천",
    "soldOut": "품절",
    "new": "새 책",
    "decreaseQuantity": "수량 줄이기",
    "increaseQuantity": "수량 늘리기",
    "imageAlt": "{{title}} 이미지 {{number}}",
    "thumbnailAlt": "{{title}} 썸네일 {{number}}"
  }
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function formatUsd(value) {
  const number = Number(value || 0)

  return (Number.isFinite(number) ? number : 0).toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId())
}

function displayProductValue(value) {
  const keyMap = {
    'Untitled book': 'untitledBook',
    Author: 'author',
    Book: 'book',
    PDF: 'pdf',
    'PDF Books': 'pdfBooks',
    'New Books': 'newBooks',
    'New Release': 'newRelease',
    'Best Seller': 'bestSeller',
    'Second Hand': 'secondHand',
    'Author Picks': 'authorPicks',
    'Sold out': 'soldOut',
    New: 'new',
    Good: 'good',
    'PRE-ORDER': 'preOrder',
    'IN STOCK': 'inStock',
    'OUT OF STOCK': 'outOfStock',
  }

  const key = keyMap[String(value || '')]
  return key ? getDisplayText(`authorStoreProductDetail.${key}`) : value
}

function getCartItems() {
  try {
    const value = JSON.parse(localStorage.getItem('shadow_author_cart_items') || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function saveCartItems(items) {
  localStorage.setItem('shadow_author_cart_items', JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
}

function normalizeGalleryImages(images) {
  const list = Array.isArray(images) ? images : []

  return list
    .map((item) => {
      if (typeof item === 'string') return item

      return item?.url || item?.image_url || item?.imageUrl || ''
    })
    .filter(Boolean)
    .slice(0, 5)
}

function normalizeProduct(product, pageUsername) {
  const type = product.type || (product.product_type === 'pdf' ? 'PDF' : 'Book')
  const salePrice = Number(product.sale_price || 0)
  const originalPrice = Number(product.original_price || 0)
  const price = salePrice || originalPrice
  const stockQuantity = Number(product.stock_quantity || 0)
  const galleryImages = normalizeGalleryImages(product.gallery_images || product.galleryImages)
  const images = [product.cover_url || '', ...galleryImages].filter(Boolean)

  return {
    id: product.id,
    author_page_id: product.author_page_id || '',
    author_page_username: pageUsername || '',
    title: product.title || 'Untitled book',
    author: product.author_name || product.author_page_name || pageUsername || 'Author',
    type,
    category: product.category || (type === 'PDF' ? 'PDF Books' : 'New Books'),
    description: product.description || '',
    cover_url: product.cover_url || '',
    images,
    salePrice,
    originalPrice,
    price,
    stockQuantity,
    stockStatus: product.pre_order ? 'PRE-ORDER' : stockQuantity > 0 || type === 'PDF' ? 'IN STOCK' : 'OUT OF STOCK',
    condition: product.book_condition || product.condition || 'Good',
    paperType: product.paper_type || '',
    pageCount: Number(product.page_count || 0),
    deliveryNote: product.delivery_note || '',
    preOrder: Boolean(product.pre_order),
    pdfFileName: product.pdf_file_name || '',
    accessRule: product.access_rule || '',
  }
}

async function fetchAuthorStoreProduct(pageUsername, productId) {
  const response = await fetch(`${API_BASE_URL}/api/author-store/page/${encodeURIComponent(pageUsername)}/products`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorStoreProductDetail.failedLoad'))
  }

  const products = Array.isArray(data.products) ? data.products : []
  const product = products.find((item) => String(item.id) === String(productId))

  if (!product) throw new Error(getDisplayText('authorStoreProductDetail.bookNotFound'))

  return normalizeProduct(product, pageUsername)
}

function DetailItem({ label, value }) {
  if (!value && value !== 0) return null

  return (
    <div className="rounded-[14px] bg-[var(--shadow-bg-surface)] px-3 py-2">
      <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{label}</div>
      <div className="mt-1 line-clamp-1 text-[12px] font-black text-[var(--shadow-text-primary)]">{displayProductValue(value)}</div>
    </div>
  )
}

function FullDetailsSheet({ open, product, onClose }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-[130]">
      <button type="button" aria-label={getDisplayText('authorStoreProductDetail.closeDetails')} onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--shadow-bg-soft)] md:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[18px] font-black text-[var(--shadow-text-primary)]">{getDisplayText('authorStoreProductDetail.bookInformation')}</div>
            <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">{displayProductValue(product.title)}</div>
          </div>

          <button type="button" aria-label={getDisplayText('authorStoreProductDetail.closeDetails')} onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 pb-5">
          <div className="rounded-[20px] bg-[var(--shadow-bg-soft)] px-4">
            {[
              [getDisplayText('authorStoreProductDetail.category'), product.category],
              [getDisplayText('authorStoreProductDetail.productType'), product.type],
              [getDisplayText('authorStoreProductDetail.condition'), product.condition],
              [getDisplayText('authorStoreProductDetail.paperType'), product.paperType],
              [getDisplayText('authorStoreProductDetail.pageCount'), product.pageCount ? getDisplayText('authorStoreProductDetail.pages', { count: formatNumber(product.pageCount) }) : ''],
              [getDisplayText('authorStoreProductDetail.stock'), product.stockStatus],
              [getDisplayText('authorStoreProductDetail.accessRule'), product.accessRule],
              [getDisplayText('authorStoreProductDetail.deliveryNote'), product.deliveryNote],
            ].map(([label, value]) => (
              value || value === 0 ? (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[var(--shadow-border)] py-3 last:border-b-0">
                  <div className="min-w-[110px] text-[12px] font-bold text-[var(--shadow-text-tertiary)]">{label}</div>
                  <div className="text-right text-[12.5px] font-black leading-5 text-[var(--shadow-text-primary)]">{displayProductValue(value)}</div>
                </div>
              ) : null
            ))}
          </div>

          <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
            <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">{getDisplayText('authorStoreProductDetail.description')}</div>
            <p className="mt-2 whitespace-pre-wrap text-[12.5px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
              {product.description || getDisplayText('authorStoreProductDetail.noDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageSlider({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const startXRef = useRef(0)
  const endXRef = useRef(0)
  const safeImages = images.length ? images : ['']

  function goTo(index) {
    setActiveIndex(Math.max(0, Math.min(index, safeImages.length - 1)))
  }

  function goNext() {
    if (safeImages.length <= 1) return
    setActiveIndex((current) => (current + 1 >= safeImages.length ? 0 : current + 1))
  }

  function goPrev() {
    if (safeImages.length <= 1) return
    setActiveIndex((current) => (current - 1 < 0 ? safeImages.length - 1 : current - 1))
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
    if (distance > 0) goNext()
    else goPrev()
  }

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-[26px] bg-[var(--shadow-bg-soft)] shadow-sm ring-1 ring-[var(--shadow-border)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-[2/3]">
          {safeImages[activeIndex] ? (
            <img src={safeImages[activeIndex]} alt={getDisplayText('authorStoreProductDetail.imageAlt', { title, number: formatNumber(activeIndex + 1) })} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center text-[13px] font-black text-[var(--shadow-text-tertiary)]">
              {getDisplayText('authorStoreProductDetail.noCover')}
            </div>
          )}

          <div className="absolute left-3 top-3 rounded-full bg-[var(--shadow-bg-elevated)] px-3 py-1 text-[10px] font-black text-[var(--shadow-text-primary)] shadow-sm">
            {formatNumber(activeIndex + 1)}/{formatNumber(safeImages.length)}
          </div>

          {safeImages.length > 1 ? (
            <>
              <button type="button" aria-label={getDisplayText('authorStoreProductDetail.previousImage')} onClick={goPrev} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm active:scale-95">
                <i className="fa-solid fa-chevron-left text-[11px]" />
              </button>

              <button type="button" aria-label={getDisplayText('authorStoreProductDetail.nextImage')} onClick={goNext} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm active:scale-95">
                <i className="fa-solid fa-chevron-right text-[11px]" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {safeImages.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((imageUrl, index) => (
            <button
              key={`${imageUrl}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              aria-label={getDisplayText('authorStoreProductDetail.openMedia', { number: formatNumber(index + 1) })}
              className={`h-14 w-11 shrink-0 overflow-hidden rounded-xl bg-[var(--shadow-bg-soft)] transition ${
                activeIndex === index ? 'ring-2 ring-[var(--shadow-text-primary)]' : 'ring-1 ring-[var(--shadow-border-strong)]'
              }`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={getDisplayText('authorStoreProductDetail.thumbnailAlt', { title, number: formatNumber(index + 1) })}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-black text-[var(--shadow-text-tertiary)]">
                  {formatNumber(index + 1)}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function addToAuthorCart(product, quantity) {
  const current = getCartItems()
  const item = {
    id: product.id,
    title: product.title,
    type: product.type,
    cover_url: product.cover_url,
    price_value: Number(product.price || 0),
    quantity,
    author_page_id: product.author_page_id || '',
    author_page_name: product.author || '',
    author_page_username: product.author_page_username || '',
  }

  const existing = current.find((cartItem) => String(cartItem.id) === String(product.id))
  const next = existing
    ? current.map((cartItem) => (
        String(cartItem.id) === String(product.id)
          ? { ...cartItem, quantity: Number(cartItem.quantity || 1) + quantity }
          : cartItem
      ))
    : [...current, item]

  saveCartItems(next)
}

export default function AuthorStoreProductDetailPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { pageUsername, productId } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProduct() {
      try {
        setLoading(true)
        setError('')
        const nextProduct = await fetchAuthorStoreProduct(pageUsername, productId)

        if (!ignore) setProduct(nextProduct)
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || t('authorStoreProductDetail.bookNotFound'))
          setProduct(null)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProduct()

    return () => {
      ignore = true
    }
  }, [pageUsername, productId, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--shadow-bg-page)] px-4 pt-16">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[var(--shadow-text-primary)]" />
          <div className="text-[14px] font-black text-[var(--shadow-text-primary)]">{t('authorStoreProductDetail.loadingBook')}</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--shadow-bg-page)] px-4 pt-10">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-page)] text-[var(--shadow-text-tertiary)]">
            <i className="fa-solid fa-book-open text-[18px]" />
          </div>
          <h1 className="mt-4 text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorStoreProductDetail.bookNotFound')}</h1>
          <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-tertiary)]">{error || t('authorStoreProductDetail.notAvailable')}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-full bg-[var(--shadow-text-primary)] px-5 py-3 text-[13px] font-black text-[var(--shadow-bg-surface)] active:scale-95"
          >
            {t('authorStoreProductDetail.goBack')}
          </button>
        </div>
      </div>
    )
  }

  const hasDiscount = product.salePrice && product.originalPrice && product.salePrice !== product.originalPrice
  const isSoldOut = product.stockStatus === 'OUT OF STOCK'
  const increaseQuantity = () => setQuantity((value) => Math.min(value + 1, 99))
  const decreaseQuantity = () => setQuantity((value) => Math.max(value - 1, 1))

  const handleAddToCart = () => {
    if (isSoldOut) return
    addToAuthorCart(product, quantity)
    navigate('/author/cart')
  }

  const handleBuyNow = () => {
    if (isSoldOut) return
    addToAuthorCart(product, quantity)
    navigate('/author/checkout')
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[110px]">
      <FullDetailsSheet open={detailsOpen} product={product} onClose={() => setDetailsOpen(false)} />

      <header className="sticky top-0 z-50 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" aria-label={t('authorStoreProductDetail.goBack')} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">{t('authorStoreProductDetail.bookDetail')}</h1>

          <button type="button" aria-label={t('authorStoreProductDetail.openCart')} onClick={() => navigate('/author/cart')} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] active:scale-95">
            <i className="fa-solid fa-cart-shopping text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[28px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <div className="mx-auto w-full max-w-[300px]">
              <ImageSlider images={product.images} title={displayProductValue(product.title)} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-black text-[#7a5600]">
                  {displayProductValue(product.category)}
                </div>

                <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black ${isSoldOut ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]' : 'bg-[#dcfce7] text-[#166534]'}`}>
                  {displayProductValue(product.stockStatus)}
                </div>
              </div>

              <h2 className="mt-3 text-[22px] font-black leading-8 text-[var(--shadow-text-primary)]">
                {displayProductValue(product.title)}
              </h2>

              <p className="mt-1 text-[13px] font-semibold text-[var(--shadow-text-tertiary)]">
                {t('authorStoreProductDetail.byAuthor', { author: displayProductValue(product.author) })}
              </p>

              <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
                <div className="flex items-end gap-2">
                  <div className="text-[22px] font-black text-[#e5484d]">
                    {formatUsd(product.price)}
                  </div>
                  {hasDiscount ? (
                    <div className="pb-1 text-[13px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                      {formatUsd(product.originalPrice)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                  <DetailItem label={t('authorStoreProductDetail.type')} value={displayProductValue(product.type)} />
                  <DetailItem label={t('authorStoreProductDetail.condition')} value={displayProductValue(product.condition)} />
                  <DetailItem label={t('authorStoreProductDetail.category')} value={displayProductValue(product.category)} />
                  <DetailItem label={t('authorStoreProductDetail.stock')} value={product.type === 'PDF' ? t('authorStoreProductDetail.digital') : formatNumber(product.stockQuantity)} />
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
                <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">{t('authorStoreProductDetail.shortInfo')}</div>
                <p className="mt-2 line-clamp-3 text-[12.5px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
                  {product.description || product.deliveryNote || t('authorStoreProductDetail.noDescription')}
                </p>

                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-[var(--shadow-bg-surface)] px-4 text-[12px] font-black text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-95"
                >
                  {t('authorStoreProductDetail.viewFullDetails')}
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>

              <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">{t('authorStoreProductDetail.quantity')}</div>
                    <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorStoreProductDetail.quantityHelp')}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="button" aria-label={t('authorStoreProductDetail.decreaseQuantity')} onClick={decreaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-95">
                      <i className="fa-solid fa-minus text-[11px]" />
                    </button>
                    <div className="min-w-[22px] text-center text-[14px] font-black text-[var(--shadow-text-primary)]">{formatNumber(quantity)}</div>
                    <button type="button" aria-label={t('authorStoreProductDetail.increaseQuantity')} onClick={increaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] shadow-sm active:scale-95">
                      <i className="fa-solid fa-plus text-[11px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className="h-12 rounded-full border border-[var(--shadow-text-primary)] bg-[var(--shadow-bg-surface)] text-[13px] font-black text-[var(--shadow-text-primary)] active:scale-[0.98] disabled:border-[var(--shadow-border-strong)] disabled:text-[var(--shadow-text-tertiary)]"
          >
            {t('authorStoreProductDetail.addToCart')}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isSoldOut}
            className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-black text-[var(--shadow-bg-surface)] shadow-sm active:scale-[0.98] disabled:bg-[var(--shadow-text-disabled)]"
          >
            {t('authorStoreProductDetail.buyNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
