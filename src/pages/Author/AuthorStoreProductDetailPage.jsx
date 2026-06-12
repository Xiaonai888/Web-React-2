import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
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
    throw new Error(data.message || 'Failed to load product')
  }

  const products = Array.isArray(data.products) ? data.products : []
  const product = products.find((item) => String(item.id) === String(productId))

  if (!product) throw new Error('Book not found')

  return normalizeProduct(product, pageUsername)
}

function DetailItem({ label, value }) {
  if (!value && value !== 0) return null

  return (
    <div className="rounded-[14px] bg-white px-3 py-2">
      <div className="text-[11px] font-bold text-[#98a2b3]">{label}</div>
      <div className="mt-1 line-clamp-1 text-[12px] font-black text-[#111827]">{value}</div>
    </div>
  )
}

function FullDetailsSheet({ open, product, onClose }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-[130]">
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[18px] font-black text-[#111827]">Book Information</div>
            <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#8d94a1]">{product.title}</div>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#555b66]">
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 pb-5">
          <div className="rounded-[20px] bg-[#fafafe] px-4">
            {[
              ['Category', product.category],
              ['Product Type', product.type],
              ['Condition', product.condition],
              ['Paper Type', product.paperType],
              ['Page Count', product.pageCount ? `${product.pageCount} pages` : ''],
              ['Stock', product.stockStatus],
              ['Access Rule', product.accessRule],
              ['Delivery Note', product.deliveryNote],
            ].map(([label, value]) => (
              value || value === 0 ? (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[#f0eef6] py-3 last:border-b-0">
                  <div className="min-w-[110px] text-[12px] font-bold text-[#8d94a1]">{label}</div>
                  <div className="text-right text-[12.5px] font-black leading-5 text-[#111827]">{value}</div>
                </div>
              ) : null
            ))}
          </div>

          <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
            <div className="text-[13px] font-black text-[#111827]">Description</div>
            <p className="mt-2 whitespace-pre-wrap text-[12.5px] font-medium leading-6 text-[#667085]">
              {product.description || 'No description yet.'}
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
        className="relative overflow-hidden rounded-[26px] bg-[#eef0f4] shadow-sm ring-1 ring-black/5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-[2/3]">
          {safeImages[activeIndex] ? (
            <img src={safeImages[activeIndex]} alt={`${title} image ${activeIndex + 1}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center text-[13px] font-black text-[#98a2b3]">
              No Cover
            </div>
          )}

          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#111827] shadow-sm">
            {activeIndex + 1}/{safeImages.length}
          </div>

          {safeImages.length > 1 ? (
            <>
              <button type="button" onClick={goPrev} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm active:scale-95">
                <i className="fa-solid fa-chevron-left text-[11px]" />
              </button>

              <button type="button" onClick={goNext} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm active:scale-95">
                <i className="fa-solid fa-chevron-right text-[11px]" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {safeImages.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {safeImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Open media ${index + 1}`}
              className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-6 bg-[#111827]' : 'w-2 bg-[#d7dce5]'}`}
            />
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
          setError(loadError.message || 'Book not found')
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
  }, [pageUsername, productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3fa] px-4 pt-16">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
          <div className="text-[14px] font-black text-[#111827]">Loading book...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f3fa] px-4 pt-10">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
            <i className="fa-solid fa-book-open text-[18px]" />
          </div>
          <h1 className="mt-4 text-[18px] font-black text-[#111827]">Book not found</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">{error || 'This author store product is not available.'}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-black text-white active:scale-95"
          >
            Go back
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
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <FullDetailsSheet open={detailsOpen} product={product} onClose={() => setDetailsOpen(false)} />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-black text-[#111827]">Book Detail</h1>

          <button type="button" onClick={() => navigate('/author/cart')} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95">
            <i className="fa-solid fa-cart-shopping text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <div className="mx-auto w-full max-w-[300px]">
              <ImageSlider images={product.images} title={product.title} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-black text-[#7a5600]">
                  {product.category}
                </div>

                <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black ${isSoldOut ? 'bg-[#f1f5f9] text-[#64748b]' : 'bg-[#dcfce7] text-[#166534]'}`}>
                  {product.stockStatus}
                </div>
              </div>

              <h2 className="mt-3 text-[22px] font-black leading-8 text-[#111827]">
                {product.title}
              </h2>

              <p className="mt-1 text-[13px] font-semibold text-[#8d94a1]">
                by {product.author}
              </p>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="flex items-end gap-2">
                  <div className="text-[22px] font-black text-[#e5484d]">
                    {formatUsd(product.price)}
                  </div>
                  {hasDiscount ? (
                    <div className="pb-1 text-[13px] font-semibold text-[#a0a5b1] line-through">
                      {formatUsd(product.originalPrice)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[#555b66]">
                  <DetailItem label="Type" value={product.type} />
                  <DetailItem label="Condition" value={product.condition} />
                  <DetailItem label="Category" value={product.category} />
                  <DetailItem label="Stock" value={product.type === 'PDF' ? 'Digital' : product.stockQuantity} />
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="text-[13px] font-black text-[#111827]">Short Info</div>
                <p className="mt-2 line-clamp-3 text-[12.5px] font-medium leading-6 text-[#667085]">
                  {product.description || product.deliveryNote || 'No description yet.'}
                </p>

                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[12px] font-black text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
                >
                  View Full Details
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>

              <div className="mt-4 rounded-[20px] bg-[#fbfffd] p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-black text-[#111827]">Quantity</div>
                    <div className="mt-1 text-[11px] font-semibold text-[#8d94a1]">Choose how many books you want</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="button" onClick={decreaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95">
                      <i className="fa-solid fa-minus text-[11px]" />
                    </button>
                    <div className="min-w-[22px] text-center text-[14px] font-black text-[#111827]">{quantity}</div>
                    <button type="button" onClick={increaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm active:scale-95">
                      <i className="fa-solid fa-plus text-[11px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ece8f4] bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className="h-12 rounded-full border border-[#111827] bg-white text-[13px] font-black text-[#111827] active:scale-[0.98] disabled:border-[#d1d5db] disabled:text-[#9ca3af]"
          >
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isSoldOut}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-black text-white shadow-sm active:scale-[0.98] disabled:bg-[#d1d5db]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
