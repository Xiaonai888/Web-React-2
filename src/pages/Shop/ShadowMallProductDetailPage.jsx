import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const products = [
  {
    id: '1',
    title: 'គ្រោះព្រោះនិស្ស័យ',
    author: 'ពេជ្រ ជិន្នា',
    publisher: 'ពិភពសុបិន',
    cover: '/assets/ShadowMall/books/book-1.jpg',
    category: 'ប្រលោមលោកខ្មែរ',
    genre: 'មនោសញ្ចេតនា',
    pages: '370 ទំព័រ',
    paperType: 'កាកអំពៅ',
    coverType: 'ក្របទន់បត់',
    condition: 'ថ្មី',
    price: '36,000៛',
    oldPrice: '44,000៛',
    badge: 'SALE',
    summary: 'ប្រលោមលោកខ្មែរ បែបមនោសញ្ចេតនា ក្របទន់ សៀវភៅថ្មី សមសម្រាប់អ្នកចូលចិត្តអារម្មណ៍ស្នេហា និងនិស្ស័យ។',
    fullDetails: [
      ['ប្រភេទសៀវភៅ', 'ប្រលោមលោកខ្មែរ'],
      ['និពន្ធដោយ', 'ពេជ្រ ជិន្នា'],
      ['ចេញផ្សាយដោយ', 'ពិភពសុបិន'],
      ['ប្រភេទ', 'មនោសញ្ចេតនា'],
      ['កម្រាស់', '370 ទំព័រ'],
      ['ប្រភេទក្រដាស', 'កាកអំពៅ'],
      ['ក្រប', 'ក្របទន់បត់'],
      ['គុណភាព', 'ថ្មី'],
      ['តម្លៃដើម', '44,000៛'],
      ['តម្លៃលក់', '36,000៛'],
    ],
  },
  {
    id: '2',
    title: 'Silent Moon',
    author: 'Shadow Author',
    publisher: 'Shadow Era',
    cover: '/assets/ShadowMall/books/book-2.jpg',
    category: 'New Release',
    genre: 'Romance',
    pages: '280 pages',
    paperType: 'Standard paper',
    coverType: 'Soft cover',
    condition: 'New',
    price: '32,000៛',
    oldPrice: '',
    badge: 'NEW',
    summary: 'A soft emotional novel for readers who love quiet romance and late-night stories.',
    fullDetails: [
      ['Book type', 'Novel'],
      ['Author', 'Shadow Author'],
      ['Publisher', 'Shadow Era'],
      ['Genre', 'Romance'],
      ['Pages', '280 pages'],
      ['Paper type', 'Standard paper'],
      ['Cover type', 'Soft cover'],
      ['Condition', 'New'],
      ['Sale price', '32,000៛'],
    ],
  },
  {
    id: '3',
    title: 'The Last Letter',
    author: 'Shadow Author',
    publisher: 'Shadow Era',
    cover: '/assets/ShadowMall/books/book-3.jpg',
    category: 'Best Seller',
    genre: 'Drama',
    pages: '310 pages',
    paperType: 'Standard paper',
    coverType: 'Soft cover',
    condition: 'New',
    price: '40,000៛',
    oldPrice: '',
    badge: 'TOP',
    summary: 'A dramatic story about memory, goodbye, and words that arrive too late.',
    fullDetails: [
      ['Book type', 'Novel'],
      ['Author', 'Shadow Author'],
      ['Publisher', 'Shadow Era'],
      ['Genre', 'Drama'],
      ['Pages', '310 pages'],
      ['Paper type', 'Standard paper'],
      ['Cover type', 'Soft cover'],
      ['Condition', 'New'],
      ['Sale price', '40,000៛'],
    ],
  },
  {
    id: '4',
    title: 'Love After Rain',
    author: 'Shadow Author',
    publisher: 'Shadow Era',
    cover: '/assets/ShadowMall/books/book-4.jpg',
    category: 'Discount',
    genre: 'Romance',
    pages: '260 pages',
    paperType: 'Standard paper',
    coverType: 'Soft cover',
    condition: 'New',
    price: '30,000៛',
    oldPrice: '38,000៛',
    badge: 'SALE',
    summary: 'A gentle romance about healing after heartbreak and finding warmth again.',
    fullDetails: [
      ['Book type', 'Novel'],
      ['Author', 'Shadow Author'],
      ['Publisher', 'Shadow Era'],
      ['Genre', 'Romance'],
      ['Pages', '260 pages'],
      ['Paper type', 'Standard paper'],
      ['Cover type', 'Soft cover'],
      ['Condition', 'New'],
      ['Original price', '38,000៛'],
      ['Sale price', '30,000៛'],
    ],
  },
  {
    id: '5',
    title: 'Before Goodbye',
    author: 'Shadow Author',
    publisher: 'Shadow Era',
    cover: '/assets/ShadowMall/books/book-5.jpg',
    category: 'Pre-order',
    genre: 'Sad Romance',
    pages: 'Coming soon',
    paperType: 'Standard paper',
    coverType: 'Soft cover',
    condition: 'Pre-order',
    price: '35,000៛',
    oldPrice: '',
    badge: 'PRE',
    summary: 'A pre-order title for readers who love emotional romance and quiet goodbye stories.',
    fullDetails: [
      ['Book type', 'Novel'],
      ['Author', 'Shadow Author'],
      ['Publisher', 'Shadow Era'],
      ['Genre', 'Sad Romance'],
      ['Pages', 'Coming soon'],
      ['Paper type', 'Standard paper'],
      ['Cover type', 'Soft cover'],
      ['Condition', 'Pre-order'],
      ['Sale price', '35,000៛'],
    ],
  },
  {
    id: '6',
    title: 'Broken Promise',
    author: 'Shadow Author',
    publisher: 'Shadow Era',
    cover: '/assets/ShadowMall/books/book-6.jpg',
    category: 'Khmer Novel',
    genre: 'Drama',
    pages: '295 pages',
    paperType: 'Standard paper',
    coverType: 'Soft cover',
    condition: 'New',
    price: '39,000៛',
    oldPrice: '',
    badge: 'HOT',
    summary: 'A strong emotional novel about promises, distance, and the truth behind silence.',
    fullDetails: [
      ['Book type', 'Novel'],
      ['Author', 'Shadow Author'],
      ['Publisher', 'Shadow Era'],
      ['Genre', 'Drama'],
      ['Pages', '295 pages'],
      ['Paper type', 'Standard paper'],
      ['Cover type', 'Soft cover'],
      ['Condition', 'New'],
      ['Sale price', '39,000៛'],
    ],
  },
]

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-[#f0eef6] py-3 last:border-b-0">
      <div className="text-[12px] font-bold text-[#8d94a1]">{label}</div>
      <div className="text-[12.5px] font-extrabold leading-5 text-[#111827]">{value}</div>
    </div>
  )
}

function FullDetailsSheet({ open, product, onClose }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-[140]">
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[480px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">Full Details</div>
            <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#8d94a1]">{product.title}</div>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#555b66]">
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 pb-5">
          <div className="rounded-[20px] bg-[#fafafe] px-4">
            {product.fullDetails.map(([label, value]) => (
              <DetailRow key={label} label={label} value={value} />
            ))}
          </div>

          <div className="mt-4 rounded-[18px] bg-[#fff7d8] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#7a5600]">
            Please check title, price, and book condition before placing your order.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShadowMallProductDetailPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const product = useMemo(() => products.find((item) => item.id === productId) || products[0], [productId])

  const increaseQuantity = () => setQuantity((value) => Math.min(value + 1, 99))
  const decreaseQuantity = () => setQuantity((value) => Math.max(value - 1, 1))

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <FullDetailsSheet open={detailsOpen} product={product} onClose={() => setDetailsOpen(false)} />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Book Detail</h1>

          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95">
            <i className="fa-solid fa-cart-shopping text-[14px]" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">0</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
            <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[22px] bg-[#eef0f4] shadow-sm">
              <div className="relative aspect-[2/3]">
                <img
                  src={product.cover}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                {product.badge ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-[#111827] shadow-sm">
                    {product.badge}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="min-w-0">
              <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-extrabold text-[#7a5600]">
                {product.category}
              </div>

              <h2 className="mt-3 text-[22px] font-extrabold leading-8 text-[#111827]">
                {product.title}
              </h2>

              <p className="mt-1 text-[13px] font-semibold text-[#8d94a1]">
                by {product.author}
              </p>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="flex items-end gap-2">
                  <div className="text-[22px] font-extrabold text-[#e5484d]">{product.price}</div>
                  {product.oldPrice ? (
                    <div className="pb-1 text-[13px] font-semibold text-[#a0a5b1] line-through">{product.oldPrice}</div>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[#555b66]">
                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Pages</div>
                    <div className="mt-1 font-extrabold text-[#111827]">{product.pages}</div>
                  </div>
                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Condition</div>
                    <div className="mt-1 font-extrabold text-[#111827]">{product.condition}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="text-[13px] font-extrabold text-[#111827]">Short Info</div>
                <p className="mt-2 line-clamp-3 text-[12.5px] font-medium leading-6 text-[#667085]">
                  {product.summary}
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

              <div className="mt-4 flex items-center justify-between gap-4 rounded-[20px] bg-[#fafafe] p-4">
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
            className="flex h-13 min-h-[52px] items-center justify-center rounded-full border border-[#111827] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]"
          >
            Add to Cart
          </button>
          <button
            type="button"
            className="flex h-13 min-h-[52px] items-center justify-center rounded-full bg-[#111827] text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
