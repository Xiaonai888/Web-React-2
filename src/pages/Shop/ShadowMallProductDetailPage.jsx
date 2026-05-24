import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
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
  if (category === 'second_hand') return 'Second Hand'
  if (category === 'pre_order') return 'Pre-order'
  return 'New Books'
}

function getStatusLabel(status) {
  if (status === 'sold_out') return 'SOLD OUT'
  if (status === 'pre_order') return 'PRE-ORDER'
  return 'IN STOCK'
}

function getStatusClass(status) {
  if (status === 'sold_out') return 'bg-[#f1f5f9] text-[#64748b]'
  if (status === 'pre_order') return 'bg-[#fff7d8] text-[#7a5600]'
  return 'bg-[#dcfce7] text-[#166534]'
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
    title: product.title || 'Untitled book',
    author: product.author_name || 'Unknown author',
    cover,
    images,
    youtubeUrl: product.youtube_url || product.video_url || '',
    description: product.description || '',
    category: product.category || 'new_books',
    stockStatus: product.stock_status || 'in_stock',
    price: Number(product.price_usd || 0),
    oldPrice,
    stockQuantity: Number(product.stock_quantity || 0),
    condition: product.condition_label || 'Good',
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
    <div className="flex items-start justify-between gap-4 border-b border-[#f0eef6] py-3 last:border-b-0">
      <div className="min-w-[110px] text-[12px] font-bold text-[#8d94a1]">{label}</div>
      <div className="text-right text-[12.5px] font-extrabold leading-5 text-[#111827]">{value}</div>
    </div>
  )
}

function FullDetailsSheet({ open, product, onClose }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-[140]">
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">Book Information</div>
            <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#8d94a1]">{product.title}</div>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#555b66]">
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 pb-5">
          <div className="rounded-[20px] bg-[#fafafe] px-4">
            <DetailRow label="Publisher" value={product.publisher} />
            <DetailRow label="Novel Type" value={product.novelType} />
            <DetailRow label="Genre" value={product.genre} />
            <DetailRow label="Paper Type" value={product.paperType} />
            <DetailRow label="Cover Type" value={product.coverType} />
            <DetailRow label="Page Count" value={product.pageCount ? `${product.pageCount} pages` : ''} />
            <DetailRow label="Condition" value={product.condition} />
            <DetailRow label="Category" value={getCategoryLabel(product.category)} />
            <DetailRow label="Stock" value={getStatusLabel(product.stockStatus)} />
          </div>

          {product.description ? (
            <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
              <div className="text-[13px] font-extrabold text-[#111827]">Description</div>
              <p className="mt-2 text-[12.5px] font-medium leading-6 text-[#667085]">{product.description}</p>
            </div>
          ) : null}

          <div className="mt-4 rounded-[18px] bg-[#fff7d8] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#7a5600]">
            Please check title, price, condition, and delivery information before placing your order.
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageSlider({ images, title, youtubeUrl }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl)
  const totalSlides = images.length + (embedUrl ? 1 : 0)

  return (
    <div>
      <div className="relative overflow-hidden rounded-[26px] bg-[#eef0f4] shadow-sm ring-1 ring-black/5">
        <div className="relative aspect-[2/3]">
          {activeIndex < images.length ? (
            images.length ? (
              <img
                src={images[activeIndex]}
                alt={`${title} image ${activeIndex + 1}`}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-center text-[13px] font-extrabold text-[#98a2b3]">
                No Cover
              </div>
            )
          ) : (
            <iframe
              src={embedUrl}
              title={`${title} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}

          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-[#111827] shadow-sm">
            {activeIndex < images.length ? `${Math.min(activeIndex + 1, Math.max(images.length, 1))}/${Math.max(images.length, 1)}` : 'VIDEO'}
          </div>

          {embedUrl && activeIndex < images.length ? (
            <button
              type="button"
              onClick={() => setActiveIndex(images.length)}
              className="absolute bottom-3 right-3 flex h-10 items-center gap-2 rounded-full bg-[#111827] px-4 text-[12px] font-extrabold text-white shadow-lg active:scale-95"
            >
              <i className="fa-solid fa-play text-[10px]" />
              Watch Video
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
              onClick={() => setActiveIndex(index)}
              aria-label={`Open media ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index ? 'w-6 bg-[#111827]' : 'w-2 bg-[#d7dce5]'
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
              className={`h-16 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[#eef0f4] ring-2 ${
                activeIndex === index ? 'ring-[#111827]' : 'ring-transparent'
              }`}
            >
              <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
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
  const { productId } = useParams()
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
          throw new Error(data.message || 'Book not found')
        }

        if (!ignore) {
          setProduct(normalizeProduct(data.product))
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message || 'Book not found')
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
      <div className="min-h-screen bg-[#f5f3fa] px-4 pt-16">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
          <div className="text-[14px] font-extrabold text-[#111827]">Loading book...</div>
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
          <h1 className="mt-4 text-[18px] font-extrabold text-[#111827]">Book not found</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">{error || 'This Shadow Mall product is not available.'}</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
          >
            Back to Shop
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
    navigate('/shop/mall/cart')
  }

  const handleBuyNow = () => {
    if (isSoldOut) return
    addToLocalCart(product, quantity)
    navigate('/shop/mall/checkout')
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <FullDetailsSheet open={detailsOpen} product={product} onClose={() => setDetailsOpen(false)} />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Book Detail</h1>

          <button type="button" onClick={() => navigate('/shop/mall/cart')} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95">
            <i className="fa-solid fa-cart-shopping text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
            <div className="mx-auto w-full max-w-[300px]">
              <ImageSlider images={product.images} title={product.title} youtubeUrl={product.youtubeUrl} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-extrabold text-[#7a5600]">
                  {getCategoryLabel(product.category)}
                </div>

                <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold ${getStatusClass(product.stockStatus)}`}>
                  {getStatusLabel(product.stockStatus)}
                </div>

                {product.isBestSeller ? (
                  <div className="inline-flex rounded-full bg-[#eef2ff] px-3 py-1 text-[10px] font-extrabold text-[#4f46e5]">
                    BEST SELLER
                  </div>
                ) : null}
              </div>

              <h2 className="mt-3 text-[22px] font-extrabold leading-8 text-[#111827]">
                {product.title}
              </h2>

              <p className="mt-1 text-[13px] font-semibold text-[#8d94a1]">
                by {product.author}
              </p>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="flex items-end gap-2">
                  <div className="text-[22px] font-extrabold text-[#e5484d]">
                    {formatUsd(product.price)}
                  </div>
                  {hasDiscount ? (
                    <div className="pb-1 text-[13px] font-semibold text-[#a0a5b1] line-through">
                      {formatUsd(product.oldPrice)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[#555b66]">
                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Publisher</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[#111827]">{product.publisher || '-'}</div>
                  </div>

                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Condition</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[#111827]">{product.condition}</div>
                  </div>

                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Genre</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[#111827]">{product.genre || '-'}</div>
                  </div>

                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Stock</div>
                    <div className="mt-1 line-clamp-1 font-extrabold text-[#111827]">{product.stockQuantity}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="text-[13px] font-extrabold text-[#111827]">Short Info</div>
                <p className="mt-2 line-clamp-3 text-[12.5px] font-medium leading-6 text-[#667085]">
                  {product.description || 'No description yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[#111827] ring-1 ring-[#eceaf2] active:scale-95"
                >
                  View Full Details
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-[20px] bg-[#fafefe] p-4">
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">Quantity</div>
                  <div className="mt-1 text-[11px] font-semibold text-[#8d94a1]">Choose how many books you want</div>
                </div>

                <div className="flex items-center rounded-full bg-white p-1 ring-1 ring-[#eceaf2]">
                  <button type="button" onClick={decreaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
                    <i className="fa-solid fa-minus text-[11px]" />
                  </button>
                  <div className="w-11 text-center text-[14px] font-extrabold text-[#111827]">{quantity}</div>
                  <button type="button" onClick={increaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95">
                    <i className="fa-solid fa-plus text-[11px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_1.3fr] gap-3">
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleAddToCart}
            className={`flex h-13 min-h-[52px] items-center justify-center rounded-full border text-[13px] font-extrabold active:scale-[0.99] ${
              isSoldOut
                ? 'border-[#e5e7eb] bg-[#f4f5f7] text-[#98a2b3]'
                : 'border-[#111827] bg-white text-[#111827]'
            }`}
          >
            Add to Cart
          </button>

          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleBuyNow}
            className={`flex h-13 min-h-[52px] items-center justify-center rounded-full text-[13px] font-extrabold shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] ${
              isSoldOut
                ? 'bg-[#d1d5db] text-white'
                : 'bg-[#111827] text-white'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
