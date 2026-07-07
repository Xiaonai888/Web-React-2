import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'
import { SalesReportsSettingsMenuItem, SalesReportsSettingsPage } from './SalesReportsSettings'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DEFAULT_CATEGORIES = ['New Books', 'Second Hand', 'Best Seller', 'PDF Books', 'Pre-order', 'Author Picks', 'New Release']
const TYPE_FILTERS = ['All', 'Book', 'PDF', 'Active', 'Draft']
const PAPER_TYPES = ['Normal Paper', 'Premium Paper', 'Matte Cover', 'Glossy Cover']
const BOOK_CONDITIONS = ['New', 'Second Hand']
const PDF_ACCESS_RULES = ['Read online only']
const ORDER_REPORT_LIMIT = 20
const ORDER_REFRESH_INTERVAL_MS = 60000
const ORDER_MAX_AUTO_REFRESHES = 10


function withSystemCategories(categories) {
  const safeCategories = Array.isArray(categories) ? categories : []
  const hasSoldOut = safeCategories.some((category) => category.name === 'Sold out')

  if (hasSoldOut) return safeCategories

  return [
    ...safeCategories,
    {
      id: 'system-sold-out',
      name: 'Sold out',
      sortOrder: safeCategories.length,
      isDefault: true,
    },
  ]
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function statusToApi(status) {
  const value = String(status || '').toLowerCase()
  if (value === 'active') return 'active'
  if (value === 'hidden') return 'hidden'
  return 'draft'
}

function apiTypeToUi(productType) {
  return productType === 'pdf' ? 'PDF' : 'Book'
}

function formatProductForUi(product) {
  return {
    id: product.id,
    type: apiTypeToUi(product.product_type),
    title: product.title || '',
    authorName: product.author_name || product.authorName || '',
    publisher: product.publisher || '',
    novelType: product.novel_type || product.novelType || '',
    category: product.category || 'New Books',
    genre: product.genre || '',
    description: product.description || '',
    coverType: product.cover_type || product.coverType || '',
    sortOrder: String(product.sort_order ?? product.sortOrder ?? 0),
    bestSeller: Boolean(product.best_seller ?? product.bestSeller),
    discount: Boolean(product.discount),
    originalPrice: String(product.original_price || ''),
    salePrice: String(product.sale_price || ''),
    status: product.status === 'active' ? 'Active' : product.status === 'hidden' ? 'Hidden' : 'Draft',
    coverUrl: product.cover_url || '',
galleryImages: formatGalleryImagesForUi(product.gallery_images),
    stock: String(product.stock_quantity || ''),
    paperType: product.paper_type || 'Normal Paper',
    condition: product.book_condition || 'New',
    qualityPercent: product.quality_percent ? String(product.quality_percent) : '',
    deliveryNote: product.delivery_note || '',
    preOrder: Boolean(product.pre_order),
   pdfFileUrl: product.pdf_file_url || '',
pdfFileName: product.pdf_file_name || '',
pageCount: product.page_count || '',
accessRule: product.access_rule || 'Read online only',
    
    createdAt: product.created_at,
updatedAt: product.updated_at || product.updatedAt || product.created_at,
  }
}

function formatGalleryImagesForUi(images) {
  const list = Array.isArray(images) ? images : []

  return list
    .map((item) => {
      if (typeof item === 'string') {
        return {
          url: item,
          name: '',
        }
      }

      return {
        url: item?.url || item?.image_url || item?.imageUrl || '',
        name: item?.name || item?.file_name || item?.fileName || '',
      }
    })
    .filter((item) => item.url)
    .slice(0, 5)
}

async function uploadCoverImage(file) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', 'author_store_cover')

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload cover image')
  }

  return data.image_url || data.imageUrl
}


async function uploadGalleryImage(file) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', 'author_store_gallery')

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload gallery image')
  }

  return data.image_url || data.imageUrl || ''
}


async function uploadPrivatePdfFile(file) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')
  if (!file) throw new Error('PDF file is required')

  const formData = new FormData()
  formData.append('pdf', file)

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/pdfs/upload-private`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false || !data.pdf?.storage_key) {
    throw new Error(data.message || 'Failed to upload private PDF')
  }

  return data.pdf
}

async function attachPrivatePdfToProduct(productId, pdf) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')
  if (!productId) throw new Error('Product ID is required')
  if (!pdf?.storage_key) throw new Error('Private PDF storage key is missing')

  const response = await fetch(
    `${API_BASE_URL}/api/author-store/me/products/${encodeURIComponent(productId)}/private-pdf`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pdf_storage_key: pdf.storage_key,
        pdf_file_name: pdf.file_name,
        pdf_mime_type: pdf.mime_type,
        pdf_file_size_bytes: pdf.file_size_bytes,
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to attach private PDF')
  }

  return data.product || null
}


async function fetchMyProducts() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load products')
  }

  return Array.isArray(data.products) ? data.products.map(formatProductForUi) : []
}

async function fetchMyStorePromotion() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/promotion`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load promotion')
  }

  return data.promotion || null
}

async function fetchMyOrderReport({ page = 1, limit = 20, type = 'book', prepareStatus = 'all', q = '' } = {}) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    type,
    prepare_status: prepareStatus,
  })

  if (q) params.set('q', q)

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/orders?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load orders')
  }

  return {
    summary: data.summary || {
      orders_count: 0,
      revenue: 0,
      gross_revenue: 0,
      platform_fee: 0,
      author_income: 0,
    },
    orders: Array.isArray(data.orders) ? data.orders : [],
    pagination: data.pagination || {
      page: Number(data.page || page),
      limit: Number(data.limit || limit),
      total: Number(data.total || 0),
      total_pages: Number(data.total_pages || 1),
    },
  }
}

async function markMyAuthorStoreOrderPreparing(orderId) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/orders/${encodeURIComponent(orderId)}/preparing`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to mark preparing')
  }

  return data.order || null
}

async function fetchDeliverySettings() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/delivery-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load delivery settings')
  }

  return data.delivery_settings || []
}

async function fetchTelegramSettings() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load Telegram settings')
  }

  return data.telegram_settings || {}
}

async function createTelegramConnectLink() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings/connect-link`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to create Telegram connect link')
  }

  return data
}

async function unlinkTelegramGroup() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings/unlink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to unlink Telegram group')
  }

  return data.telegram_settings || {}
}

async function fetchSalesReportsSettings() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/sales-reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load Sales Reports settings')
  }

  return data
}

async function connectSalesReports(spreadsheetUrl) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/sales-reports/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      spreadsheet_url: spreadsheetUrl,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to connect Google Sheet')
  }

  return data
}

async function syncSalesReports() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/sales-reports/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to sync Sales Reports')
  }

  return data
}

async function disconnectSalesReports() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/sales-reports/disconnect`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to disconnect Google Sheet')
  }

  return data
}


async function updateDeliverySettings(deliverySettings) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/delivery-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ delivery_settings: deliverySettings }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update delivery settings')
  }

  return data.delivery_settings || []
}

async function createStoreProduct(product) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_type: product.type === 'PDF' ? 'pdf' : 'book',
      title: product.title,
      author_name: product.authorName,
      publisher: product.publisher,
      novel_type: product.novelType,
      category: product.category,
      genre: product.genre,
      description: product.description,
      cover_type: product.coverType,
      sort_order: product.sortOrder,
      best_seller: Boolean(product.bestSeller),
      discount: Boolean(product.discount),
      original_price: product.originalPrice,
      sale_price: product.salePrice,
      status: statusToApi(product.status),
      cover_url: product.coverUrl,
      gallery_images: product.galleryImages || [],
      stock_quantity: product.stock,
      paper_type: product.paperType,
      book_condition: product.condition,
      quality_percent: product.qualityPercent,
      delivery_note: product.deliveryNote,
      pre_order: product.preOrder,
      pdf_file_url: product.type === 'PDF' ? '' : product.pdfFileUrl,
      pdf_file_name: product.pdfFileName,
      page_count: product.pageCount,
      access_rule: product.type === 'PDF' ? 'Read online only' : product.accessRule,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to create product')
  }

  return data.product ? formatProductForUi(data.product) : null
}

async function updateStoreProduct(productId, product) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_type: product.type === 'PDF' ? 'pdf' : 'book',
      title: product.title,
      author_name: product.authorName,
      publisher: product.publisher,
      novel_type: product.novelType,
      category: product.category,
      genre: product.genre,
      description: product.description,
      cover_type: product.coverType,
      sort_order: product.sortOrder,
      best_seller: Boolean(product.bestSeller),
      discount: Boolean(product.discount),
      original_price: product.originalPrice,
      sale_price: product.salePrice,
      status: statusToApi(product.status),
      cover_url: product.coverUrl,
      gallery_images: product.galleryImages || [],
      stock_quantity: product.stock,
      paper_type: product.paperType,
      book_condition: product.condition,
      quality_percent: product.qualityPercent,
      delivery_note: product.deliveryNote,
      pre_order: product.preOrder,
      pdf_file_url: product.pdfFileUrl,
      pdf_file_name: product.pdfFileName,
      page_count: product.pageCount,
      access_rule: product.type === 'PDF' ? 'Read online only' : product.accessRule,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update product')
  }

  return data.product ? formatProductForUi(data.product) : null
}

async function deleteStoreProduct(productId) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to delete product')
  }

  return data
}

function FieldLabel({ children }) {
  const label = String(children || '')
  const hasRequiredMark = label.includes('*')
  const cleanLabel = label.replace('*', '').trim()

  return (
    <div className="mb-1.5 text-[12px] font-medium tracking-normal text-[#374151]">
      {cleanLabel}
      {hasRequiredMark ? <span className="font-semibold text-[#ef4444]"> *</span> : null}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-medium text-[#111827] placeholder:font-normal outline-none focus:border-[#111827]"
    />
  )
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-medium text-[#111827] placeholder:font-normal outline-none focus:border-[#111827]"
    >
      {children}
    </select>
  )
}

function AdminStyleCard({ title, text, children }) {
  return (
    <section className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="border-b border-[#e6edf5] px-4 py-4">
        <h2 className="text-[17px] font-black leading-5 text-[#111827]">{title}</h2>
        {text ? <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">{text}</p> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function FormDivider({ title }) {
  return (
    <div className="border-t border-[#e6edf5] pt-4">
      <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.07em] text-[#334155]">{title}</div>
    </div>
  )
}


function EmptyState({ onAddProduct }) {
  return (
    <div className="rounded-[22px] bg-gradient-to-br from-[#f8f5ff] via-white to-[#fff8e8] px-5 py-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1ebff] text-[#7c5cff] shadow-[0_10px_26px_rgba(124,91,255,0.16)] ring-1 ring-white">
        <i className="fa-solid fa-store text-[22px]" />
      </div>

      <h3 className="mt-4 text-[17px] font-bold leading-6 text-[#2d2766]">
        Create your first product
      </h3>

      <p className="mx-auto mt-2 max-w-[280px] text-[12px] font-normal leading-5 text-[#7c7da6]">
        Add a book or PDF and start selling from your author page.
      </p>

      <button
        type="button"
        onClick={onAddProduct}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] px-6 text-[13px] font-normal text-white shadow-[0_12px_26px_rgba(124,91,255,0.28)] active:scale-[0.97]"
      >
        <i className="fa-solid fa-plus text-[11px]" />
        Add product
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        {['Book', 'PDF', 'Pre-order'].map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-normal text-[#7c7da6] shadow-sm ring-1 ring-[#ece7ff]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const priceText = product.salePrice || product.originalPrice || '0.00'
  const hasDiscount = product.salePrice && product.originalPrice && product.salePrice !== product.originalPrice

  return (
    <div className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[3/4] bg-[#f3f4f6]">
        {product.coverUrl ? (
          <img src={product.coverUrl} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
            <i className="fa-regular fa-image text-[30px]" />
          </div>
        )}

        <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-[#111827] shadow-sm">
          {product.type}
        </div>
        <button
          type="button"
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-lg ring-1 ring-black/5 active:scale-95"
        >
          <i className="fa-solid fa-bag-shopping text-[13px]" />
        </button>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[38px] text-[14px] font-black leading-5 text-[#111827]">{product.title || 'Untitled product'}</h3>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#6b7280] ring-1 ring-black/5">{product.category}</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-black ${product.status === 'Active' ? 'bg-[#ecfdf3] text-[#027a48]' : 'bg-[#f5f3ff] text-[#6b5cff]'}`}>{product.status}</span>
        </div>

        <div className="mt-2 text-[15px] font-black text-[#111827]">
          ${priceText}
          {hasDiscount ? <span className="ml-2 text-[11px] font-bold text-[#9ca3af] line-through">${product.originalPrice}</span> : null}
        </div>

        <div className="mt-1 text-[11px] font-bold text-[#8b93a1]">
          {product.type === 'Book'
            ? `${product.stock || 0} stock • ${product.condition}${product.condition === 'Second Hand' && product.qualityPercent ? ` • ${product.qualityPercent}%` : ''}`
            : `${product.pageCount || 0} pages • PDF`}
        </div>
      </div>
    </div>
  )
}

function ProductRecordRow({ product, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const priceText = product.salePrice || product.originalPrice || '0.00'
  const hasDiscount =
    product.salePrice &&
    product.originalPrice &&
    product.salePrice !== product.originalPrice
  const isActive = product.status === 'Active'
  const isDraft = product.status === 'Draft'

  return (
    <article className="border-b border-[#eef0f4] px-0 py-3 last:border-b-0">
      <div className="flex gap-3">
        <div className="h-[86px] w-[64px] shrink-0 overflow-hidden rounded-[12px] bg-[#f3f4f6] ring-1 ring-black/5">
          {product.coverUrl ? (
            <img
              src={product.coverUrl}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
              <i className="fa-regular fa-image text-[18px]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-[13px] font-black text-[#111827]">
                {product.title || 'Untitled product'}
              </h3>

              <p className="mt-0.5 text-[10px] font-bold text-[#8b93a1]">
                ID: {product.id}
              </p>
            </div>

            <div className={`relative shrink-0 ${menuOpen ? 'z-[150]' : ''}`}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-[#7c5cff] shadow-[0_6px_16px_rgba(124,91,255,0.10)] ring-1 ring-[#e9e2ff] transition active:scale-95"
                aria-label="Product options"
                aria-expanded={menuOpen}
              >
                <i className="fa-solid fa-ellipsis-vertical text-[13px]" />
              </button>

              {menuOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Close product menu"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-[149] cursor-default bg-transparent"
                  />

                  <div className="absolute right-0 top-[38px] z-[150] w-[130px] overflow-hidden rounded-[14px] bg-white p-1.5 shadow-[0_16px_38px_rgba(45,39,102,0.20)] ring-1 ring-[#e9e2ff]">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onEdit(product)
                      }}
                      className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-left text-[12px] font-normal text-[#6f4cff] transition hover:bg-[#f3edff] active:bg-[#eee7ff]"
                    >
                      <i className="fa-regular fa-pen-to-square w-4 text-center text-[12px]" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onDelete(product)
                      }}
                      className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-left text-[12px] font-normal text-[#e5484d] transition hover:bg-[#fff1f1] active:bg-[#ffe8e8]"
                    >
                      <i className="fa-regular fa-trash-can w-4 text-center text-[12px]" />
                      Delete
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#6b7280] ring-1 ring-black/5">
              {product.category}
            </span>

            <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#111827] ring-1 ring-black/5">
              {product.type}
            </span>

            <span
              className={`rounded-full px-2 py-1 text-[10px] font-black ${
                isActive
                  ? 'bg-[#ecfdf3] text-[#027a48]'
                  : isDraft
                    ? 'bg-[#f5f3ff] text-[#6b5cff]'
                    : 'bg-[#f3f4f6] text-[#6b7280]'
              }`}
            >
              {product.status}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-[#6b7280]">
            <span className="font-black text-[#111827]">${priceText}</span>

            {hasDiscount ? (
              <span className="line-through">${product.originalPrice}</span>
            ) : null}

            <span>
              {product.type === 'Book'
                ? `${product.stock || 0} stock • ${product.condition}`
                : `${product.pageCount || 0} pages • PDF`}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

function formatCategoryForUi(category) {
  return {
    id: category.id,
    name: category.name || '',
    sortOrder: Number(category.sort_order || 0),
    isDefault: Boolean(category.is_default),
    isHidden: Boolean(category.is_hidden),
  }
}

async function fetchMyCategories() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load categories')
  }

  return Array.isArray(data.categories) ? data.categories.map(formatCategoryForUi) : []
}

async function createStoreCategory(name) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to create category')
  }

  return data.category ? formatCategoryForUi(data.category) : null
}

async function updateStoreCategory(categoryId, updates) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update category')
  }

  return data.category ? formatCategoryForUi(data.category) : null
}


async function deleteStoreCategory(categoryId) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to delete category')
  }

  return data
}

async function reorderStoreCategories(categoryIds) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ category_ids: categoryIds }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to save category order')
  }

  return Array.isArray(data.categories) ? data.categories.map(formatCategoryForUi) : []
}

function StatCard({ label, value, icon }) {
  return (
    <div className="relative overflow-hidden rounded-[10px] bg-white/75 p-3.5 shadow-[0_14px_34px_rgba(124,91,255,0.12)] ring-1 ring-white/80 backdrop-blur">
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#ede9fe]/70 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3edff] text-[#7c5cff] shadow-[0_10px_24px_rgba(124,91,255,0.18)] ring-1 ring-white/80">
          <i className={`fa-solid ${icon} text-[14px]`} />
        </div>

        <div className="min-w-0">
          <div className="text-[20px] font-black leading-6 text-[#2d2766]">{value}</div>
          <div className="mt-1 text-[12px] font-semibold text-[#7c7da6]">{label}</div>
        </div>
      </div>
    </div>
  )
}

function OrderHistoryRow({ order, onMarkPreparing, preparingLoading }) {
  const items = Array.isArray(order.items) ? order.items : []
  const firstItem = items[0] || {}
  const title = firstItem.product_title || firstItem.title || order.product_title || 'Order item'
  const total = order.total_usd || order.total_amount || order.product_subtotal_usd || order.amount_usd || 0
  const buyer = order.buyer_name || order.customer_name || order.reader_name || 'Reader'
  const phone = order.buyer_phone || order.customer_phone || ''
  const dateText = order.created_at ? new Date(order.created_at).toLocaleString() : ''
  const preparing = String(order.author_prepare_status || '').toLowerCase() === 'preparing'
  const hasBook = items.some((item) => String(item.product_type || '').toLowerCase() === 'book')

  return (
    <article className="rounded-[22px] bg-white px-4 py-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="h-14 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f3f4f6] ring-1 ring-black/5">
          {firstItem.cover_url ? (
            <img src={firstItem.cover_url} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
              <i className="fa-regular fa-image text-[14px]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{title}</div>
          <div className="mt-1 text-[11px] font-bold text-[#8b93a1]">
            Order #{String(order.order_number || order.order_id || order.id || '').slice(0, 16)}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-[#6b7280]">
            {buyer}{phone ? ` · ${phone}` : ''}
          </div>
          {dateText ? <div className="mt-0.5 text-[11px] font-semibold text-[#8b93a1]">{dateText}</div> : null}
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[14px] font-black text-[#111827]">{formatMoney(total)}</div>
          <div className="mt-1 text-[11px] font-bold text-[#6b7280]">
            Income {formatMoney(order.author_income_usd || 0)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#eef0f4] pt-3">
        <div className="text-[11px] font-bold text-[#8b93a1]">
          {items.length || 1} item{items.length > 1 ? 's' : ''}
        </div>

        {hasBook ? (
          preparing ? (
            <div className="rounded-full bg-[#ecfdf3] px-3 py-1.5 text-[11px] font-black text-[#027a48]">
              Preparing ✓
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onMarkPreparing(order)}
              disabled={preparingLoading}
              className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-black text-white disabled:opacity-50"
            >
              {preparingLoading ? 'Saving...' : 'Mark Preparing'}
            </button>
          )
        ) : (
          <div className="rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[11px] font-black text-[#6b7280]">
            PDF order
          </div>
        )}
      </div>
    </article>
  )
}

function readStoredJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

function getAuthorMenuProfile() {
  const authorPage = readStoredJson('shadow_author_page') || {}
  const readerUser = readStoredJson('shadow_reader_user') || {}

  const name =
    authorPage.page_name ||
    authorPage.name ||
    readerUser.name ||
    readerUser.username ||
    'Author'

  const avatarUrl =
    authorPage.avatar_url ||
    authorPage.logo_url ||
    readerUser.avatar_url ||
    ''

  return {
    name,
    avatarUrl,
    letter: String(name || 'A').slice(0, 1).toUpperCase(),
  }
}

function AuthorStoreMenuSheet({ open, onClose, onSwitchProfile, onFinance, onSettings }) {
  if (!open) return null

  const profile = getAuthorMenuProfile()

  return (
    <div className="fixed inset-0 z-[400] bg-black/25">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0"
      />

      <aside className="relative h-full w-[82%] max-w-[340px] bg-white px-4 py-4 shadow-2xl">
        <div className="text-[14px] font-black text-[#111827]">Author Menu</div>

        <button
          type="button"
          onClick={onSwitchProfile}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl text-left active:opacity-70"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-[16px] font-black text-[#111827] ring-1 ring-black/10">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              profile.letter
            )}
          </div>

          <div className="min-w-0">
            <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{profile.name}</div>
            <div className="mt-0.5 text-[11px] font-semibold text-[#8b93a1]">Switch Profile</div>
          </div>
        </button>

        <div className="mt-8 space-y-2">
          <button
            type="button"
            onClick={onFinance}
            className="flex h-12 w-full items-center gap-4 rounded-2xl px-1 text-left text-[14px] font-semibold text-[#111827] active:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-wallet w-7 text-center text-[15px]" />
            Finance
          </button>

          <button
            type="button"
            onClick={onSettings}
            className="flex h-12 w-full items-center gap-4 rounded-2xl px-1 text-left text-[14px] font-semibold text-[#111827] active:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-gear w-7 text-center text-[15px]" />
            Settings
          </button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="text-[18px] font-black tracking-[-0.05em] text-[#111827]">
            SHADOW <span className="text-[14px]">☠</span>
          </div>
        </div>
      </aside>
    </div>
  )
}

function DeliveryLogo({ type }) {
  const src = type === 'jnt' ? '/assets/Icons/J%26T.svg' : '/assets/Icons/VET.svg'
  const label = type === 'jnt' ? 'J&T' : 'VET'

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/10">
      <img src={src} alt={label} className="h-10 w-10 object-contain" />
    </div>
  )
}

function StoreManagerHome({
  promotion,
  activeTab,
  setActiveTab,
  activeType,
  setActiveType,
  filteredProducts,
  products,
  categories,
  storeCategories,
  newCategory,
  setNewCategory,
  addCategory,
  categoryError,
  categorySaving,
  editingCategoryId,
  editingCategoryName,
  setEditingCategoryName,
  startEditCategory,
  cancelEditCategory,
  saveEditCategory,
  handleDeleteCategory,
  handleToggleHideCategory,
  moveCategory,
  saveCategoryOrder,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  loading,
  localError,
  onRefreshOrders,
  orderSummary,
  orders,
  orderPage,
  setOrderPage,
  orderLoading,
  orderPagination,
  orderType,
  setOrderType,
  orderPrepareFilter,
  setOrderPrepareFilter,
  orderSearchDraft,
  setOrderSearchDraft,
  setOrderSearchQuery,
  onMarkOrderPreparing,
  orderActionLoadingId,
}) {
  const [recordQuery, setRecordQuery] = useState('')
const [recordFilterOpen, setRecordFilterOpen] = useState(false)
const [recordFilter, setRecordFilter] = useState('newest')
const [orderFilterOpen, setOrderFilterOpen] = useState(false)
const [openCategoryMenuId, setOpenCategoryMenuId] = useState('')
const [searchParams] = useSearchParams()
const initialSettingsView = ['categories', 'delivery', 'sales-reports', 'telegram'].includes(searchParams.get('settings'))
  ? searchParams.get('settings')
  : 'home'
const [settingsView, setSettingsView] = useState(initialSettingsView)
  const [jtDeliveryFee, setJtDeliveryFee] = useState('2')
  const [vetDeliveryFee, setVetDeliveryFee] = useState('2')
  const [deliverySaving, setDeliverySaving] = useState(false)
  const [deliveryLoading, setDeliveryLoading] = useState(false)
  const [deliveryMessage, setDeliveryMessage] = useState('')
  const [telegramBotUsername, setTelegramBotUsername] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  const [telegramChatTitle, setTelegramChatTitle] = useState('')
  const [telegramLinkedAt, setTelegramLinkedAt] = useState('')
  const [telegramConnecting, setTelegramConnecting] = useState(false)
  const [telegramUnlinking, setTelegramUnlinking] = useState(false)
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [telegramMessage, setTelegramMessage] = useState('')
  const customCategoryCount = storeCategories.filter((category) => !category.isDefault).length
  const canCreateCustomCategory = customCategoryCount < 5
  useEffect(() => {
    let ignore = false

    async function loadDeliverySettings() {
      try {
        setDeliveryLoading(true)

        const settings = await fetchDeliverySettings()
        const jnt = settings.find((item) => item.company_key === 'jnt')
        const vet = settings.find((item) => item.company_key === 'vet')

        if (!ignore) {
          setJtDeliveryFee(String(jnt?.fee_usd ?? 2))
          setVetDeliveryFee(String(vet?.fee_usd ?? 2))
        }
      } catch {
      } finally {
        if (!ignore) setDeliveryLoading(false)
      }
    }

    loadDeliverySettings()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadTelegramSettings() {
      try {
        setTelegramLoading(true)

        const settings = await fetchTelegramSettings()

        if (!ignore) {
          setTelegramBotUsername(settings.bot_username || '')
          setTelegramChatId(settings.chat_id || '')
          setTelegramChatTitle(settings.chat_title || '')
          setTelegramLinkedAt(settings.linked_at || '')
        }
      } catch {
      } finally {
        if (!ignore) setTelegramLoading(false)
      }
    }

    loadTelegramSettings()

    return () => {
      ignore = true
    }
  }, [])

  const handleSaveDeliveryFees = async () => {
  try {
    setDeliverySaving(true)
    setDeliveryMessage('')

    const settings = await updateDeliverySettings([
      { company_key: 'jnt', fee_usd: Number(jtDeliveryFee || 0) },
      { company_key: 'vet', fee_usd: Number(vetDeliveryFee || 0) },
    ])

    const jnt = settings.find((item) => item.company_key === 'jnt')
    const vet = settings.find((item) => item.company_key === 'vet')

    setJtDeliveryFee(String(jnt?.fee_usd ?? jtDeliveryFee))
    setVetDeliveryFee(String(vet?.fee_usd ?? vetDeliveryFee))
    setDeliveryMessage('Delivery fees saved.')
  } catch (error) {
    setDeliveryMessage(error.message || 'Failed to save delivery fees.')
  } finally {
    setDeliverySaving(false)
  }
}

  const handleCreateTelegramConnectLink = async () => {
  try {
    setTelegramConnecting(true)
    setTelegramMessage('')

    const data = await createTelegramConnectLink()
    const settings = data.telegram_settings || {}
    const connectUrl = data.telegram_connect?.connect_url || ''

    setTelegramBotUsername(settings.bot_username || telegramBotUsername)
    setTelegramChatId(settings.chat_id || telegramChatId)
    setTelegramChatTitle(settings.chat_title || telegramChatTitle)
    setTelegramLinkedAt(settings.linked_at || telegramLinkedAt)

    if (connectUrl) {
      window.location.href = connectUrl
      return
    }

    setTelegramMessage('Telegram connect link was created, but the link was missing.')
  } catch (error) {
    setTelegramMessage(error.message || 'Failed to open Telegram connect link.')
  } finally {
    setTelegramConnecting(false)
  }
}

  const handleUnlinkTelegramGroup = async () => {
  try {
    setTelegramUnlinking(true)
    setTelegramMessage('')

    const settings = await unlinkTelegramGroup()

    setTelegramBotUsername(settings.bot_username || telegramBotUsername)
    setTelegramChatId(settings.chat_id || '')
    setTelegramChatTitle(settings.chat_title || '')
    setTelegramLinkedAt(settings.linked_at || '')
    setTelegramMessage('Telegram group unlinked. You can connect a new group now.')
  } catch (error) {
    setTelegramMessage(error.message || 'Failed to unlink Telegram group.')
  } finally {
    setTelegramUnlinking(false)
  }
}

 const visibleRecords = useMemo(() => {
  const query = recordQuery.trim().toLowerCase()

  let records = filteredProducts.filter((product) => {
    if (activeType === 'Active') return product.status === 'Active'
    if (activeType === 'Draft') return product.status === 'Draft'
    return true
  })

  if (query) {
    records = records.filter((product) => {
      return (
        String(product.title || '').toLowerCase().includes(query) ||
        String(product.id || '').toLowerCase().includes(query) ||
        String(product.category || '').toLowerCase().includes(query) ||
        String(product.status || '').toLowerCase().includes(query) ||
        String(product.type || '').toLowerCase().includes(query)
      )
    })
  }

  if (recordFilter === 'low_stock') {
    records = records.filter((product) => {
      const stock = Number(product.stock || 0)

      return product.type === 'Book' && stock > 0 && stock <= 5
    })
  }

  if (recordFilter === 'sold_out') {
    records = records.filter((product) => {
      return product.type === 'Book' && Number(product.stock || 0) <= 0
    })
  }

  const getTime = (value) => {
    const time = new Date(value || 0).getTime()
    return Number.isFinite(time) ? time : 0
  }

  return [...records].sort((firstProduct, secondProduct) => {
    if (recordFilter === 'oldest') {
      return (
        getTime(firstProduct.createdAt) -
        getTime(secondProduct.createdAt)
      )
    }

    if (recordFilter === 'recently_updated') {
      return (
        getTime(secondProduct.updatedAt) -
        getTime(firstProduct.updatedAt)
      )
    }

    return (
      getTime(secondProduct.createdAt) -
      getTime(firstProduct.createdAt)
    )
  })
}, [filteredProducts, recordQuery, activeType, recordFilter])

  return (
    <main className="mx-auto max-w-[980px] px-0 py-0 sm:px-4 sm:py-4">
      <section
        className="relative overflow-hidden rounded-none bg-[#f5f3ff] bg-cover bg-center bg-no-repeat px-4 pb-4 pt-[92px] shadow-none ring-0 sm:rounded-[28px] sm:px-5 sm:pb-5 sm:pt-[118px] sm:shadow-[0_24px_60px_rgba(124,91,255,0.16)] sm:ring-1 sm:ring-white/70"
        style={{
          backgroundImage: "url('/assets/Author%20Page/Store%20Manager.png')",
        }}
      >
        <div className="relative grid grid-cols-2 gap-3">
          <StatCard
            label="Orders"
            value={String(orderSummary.orders_count || 0)}
            icon="fa-bag-shopping"
          />
          <StatCard
            label="Net income"
            value={formatMoney(orderSummary.revenue || orderSummary.author_income || 0)}
            icon="fa-chart-line"
          />
        </div>
      </section>

<section className="mx-4 mt-3 overflow-hidden rounded-[10px] bg-white/90 px-4 py-3 shadow-[0_14px_38px_rgba(124,91,255,0.10)] ring-1 ring-white/80 backdrop-blur sm:mx-0 sm:rounded-[10px]">
  <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3edff] text-[#7c5cff] shadow-[0_10px_24px_rgba(124,91,255,0.18)] ring-1 ring-white/80">
      <i className="fa-solid fa-tags text-[14px]" />
    </div>

    <div className="min-w-0 flex-1">
      <div className="text-[13px] font-black text-[#2d2766]">
        0% Service Fee Promotion
      </div>

      <div className="mt-1 flex items-center gap-2 text-[13px] font-normal">
        <span className="text-[#6f5cff]">
          Book {promotion?.book?.used || 0}/{promotion?.book?.limit || 50}
        </span>
        <span className="text-[#a6a3c7]">•</span>
        <span className="text-[#d6a52a]">
          PDF {promotion?.pdf?.used || 0}/{promotion?.pdf?.limit || 100}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="h-2 overflow-hidden rounded-full bg-[#ebe7ff]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  (Number(promotion?.book?.used || 0) /
                    Math.max(1, Number(promotion?.book?.limit || 50))) *
                    100,
                ),
              )}%`,
            }}
          />
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#fff1c7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d6a52a] to-[#f1c75b] transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  (Number(promotion?.pdf?.used || 0) /
                    Math.max(1, Number(promotion?.pdf?.limit || 100))) *
                    100,
                ),
              )}%`,
            }}
          />
        </div>
      </div>
    </div>

    <i className="fa-solid fa-chevron-right shrink-0 text-[13px] text-[#9b98bd]" />
  </div>
</section>

<section className="mx-4 mt-3 overflow-hidden rounded-full bg-white shadow-[0_14px_38px_rgba(124,91,255,0.10)] sm:mx-0">
  <div className="grid grid-cols-2 gap-0">
    {['Records', 'Orders'].map((tab) => {
      const active = activeTab === tab

      return (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`flex h-11 items-center justify-center gap-2 rounded-full text-[13px] font-normal transition active:scale-[0.98] ${
            active
              ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-[0_12px_26px_rgba(124,91,255,0.32)]'
              : 'bg-transparent text-[#7c7da6]'
          }`}
        >
          <i className={`fa-solid ${tab === 'Records' ? 'fa-list-alt' : 'fa-bag-shopping'} text-[13px]`} />
          {tab}
        </button>
      )
    })}
  </div>
</section>

      {localError ? (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold text-[#9a3412]"
        >
          {localError}
        </button>
      ) : null}

      {activeTab === 'Records' ? (
  <section className="mx-4 mt-3 overflow-hidden rounded-[10px] bg-[linear-gradient(135deg,#fbfaff_0%,#f3efff_55%,#ffffff_100%)] shadow-[0_16px_38px_rgba(124,91,255,0.10)] ring-1 ring-white/80 sm:mx-0 sm:mt-4">
    <div className="border-b border-white/70 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-black text-[#2d2766]">
            Book Records
          </h2>

          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#7c7da6]">
            Search, filter, and manage your author store products.
          </p>
        </div>

        <span className="shrink-0 rounded-[10px] bg-white/75 px-3 py-1.5 text-[11px] font-black text-[#6f5cff] shadow-[0_8px_20px_rgba(124,91,255,0.10)] ring-1 ring-white/80">
          {products.length} products
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#9b98bd]" />

          <input
            type="search"
            value={recordQuery}
            onChange={(event) => setRecordQuery(event.target.value)}
            placeholder="Search title, category, product ID..."
            className="h-11 w-full rounded-[10px] border border-[#ddd6fe] bg-white/85 pl-9 pr-3 text-[13px] font-bold text-[#2d2766] shadow-[0_8px_22px_rgba(124,91,255,0.07)] outline-none placeholder:text-[#aaa8c8] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10"
          />
        </div>

        <div className="relative z-[130] shrink-0">
  <button
    type="button"
    onClick={() => setRecordFilterOpen((current) => !current)}
    className={`relative flex h-11 w-11 items-center justify-center rounded-[10px] bg-white shadow-[0_8px_22px_rgba(124,91,255,0.12)] ring-1 ring-[#e9e2ff] transition active:scale-[0.96] ${
      recordFilterOpen
        ? 'bg-[#f3edff] text-[#7c5cff]'
        : 'text-[#7c5cff]'
    }`}
    aria-label="Filter product records"
    aria-expanded={recordFilterOpen}
  >
    <i className="fa-solid fa-sliders text-[14px]" />

    {recordFilter !== 'newest' ? (
      <span className="absolute right-[6px] top-[6px] h-2 w-2 rounded-full bg-[#8b5cf6] ring-2 ring-white" />
    ) : null}
  </button>

  {recordFilterOpen ? (
    <>
      <button
        type="button"
        aria-label="Close record filter"
        onClick={() => setRecordFilterOpen(false)}
        className="fixed inset-0 z-[129] cursor-default bg-transparent"
      />

      <div className="absolute right-0 top-[52px] z-[130] w-[190px] overflow-hidden rounded-[16px] bg-white p-2 shadow-[0_18px_45px_rgba(45,39,102,0.22)] ring-1 ring-[#e5ddff]">
        {[
          { value: 'newest', label: 'Newest first' },
          { value: 'recently_updated', label: 'Recently updated' },
          { value: 'low_stock', label: 'Low stock' },
          { value: 'sold_out', label: 'Sold out' },
          { value: 'oldest', label: 'Oldest first' },
        ].map((item) => {
          const active = recordFilter === item.value

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setRecordFilter(item.value)
                setRecordFilterOpen(false)
              }}
              className={`flex h-10 w-full items-center justify-between rounded-[11px] px-3 text-left text-[12px] font-normal transition ${
                active
                  ? 'bg-[#f1edff] text-[#6f4cff]'
                  : 'text-[#555777] hover:bg-[#f8f7ff] active:bg-[#f3efff]'
              }`}
            >
              <span>{item.label}</span>

              {active ? (
                <i className="fa-solid fa-check text-[11px] text-[#7c5cff]" />
              ) : null}
            </button>
          )
        })}
      </div>
    </>
  ) : null}
</div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {TYPE_FILTERS.map((type) => {
          const active = activeType === type

          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`flex h-8 min-w-[44px] shrink-0 items-center justify-center gap-1 rounded-full px-3 text-[11px] font-black transition active:scale-[0.97] ${
                active
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-[0_10px_24px_rgba(124,91,255,0.28)]'
                  : 'bg-white/70 text-[#74759b] shadow-[0_7px_18px_rgba(124,91,255,0.07)] ring-1 ring-white/80'
              }`}
            >
              <span>{type}</span>

              {type === 'Active' ? (
                <span className="h-1.5 w-1.5 rounded-full bg-[#41c98e]" />
              ) : null}

              {type === 'Draft' ? (
                <span className="h-1.5 w-1.5 rounded-full bg-[#aaa8c8]" />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>

          <div className="bg-white/85 px-4 py-2">
  {loading ? (
  <div className="rounded-[18px] bg-[#f8fafc] p-8 text-center text-[13px] font-bold text-[#8b93a1] ring-1 ring-black/5">
    Loading products...
  </div>
) : products.length === 0 ? (
  <EmptyState onAddProduct={onAddProduct} />
) : visibleRecords.length ? (
  <div className="overflow-hidden bg-white">
    {visibleRecords.map((product) => (
      <ProductRecordRow
        key={product.id}
        product={product}
        onEdit={onEditProduct}
        onDelete={onDeleteProduct}
      />
    ))}
  </div>
) : (
  <div className="rounded-[18px] bg-white px-4 py-10 text-center ring-1 ring-[#ece7ff]">
    <i className="fa-solid fa-magnifying-glass text-[20px] text-[#a78bfa]" />

    <div className="mt-3 text-[14px] font-bold text-[#2d2766]">
      No matching products
    </div>

    <div className="mt-1 text-[12px] font-normal text-[#8b86aa]">
      Try another search or filter.
    </div>
  </div>
)}
</div>
        </section>
      ) : null}

{activeTab === 'Settings' ? (
  <section className="mt-4 space-y-3">
    {settingsView === 'home' ? (
  <div className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
    <div className="px-4 pb-2 pt-4">
      <h2 className="text-[17px] font-black text-[#111827]">Store Settings</h2>
      <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
        Manage store sections and checkout settings.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setSettingsView('categories')}
      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
    >
      <span className="min-w-0">
        <span className="block text-[14px] font-black text-[#111827]">Category Management</span>
        <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-[#8b93a1]">
          Categories, hidden sections, and order.
        </span>
      </span>
      <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#9ca3af]" />
    </button>

    <div className="mx-4 h-px bg-[#eef0f4]" />

    <button
      type="button"
      onClick={() => setSettingsView('delivery')}
      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
    >
      <span className="min-w-0">
        <span className="block text-[14px] font-black text-[#111827]">Delivery Company</span>
        <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-[#8b93a1]">
          J&amp;T fee, VET fee, and checkout delivery.
        </span>
      </span>
      <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#9ca3af]" />
    </button>

    <SalesReportsSettingsMenuItem
  onOpen={() => setSettingsView('sales-reports')}
/>

<div className="mx-4 h-px bg-[#eef0f4]" />

<button
  type="button"
  onClick={() => setSettingsView('telegram')}
  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
>
  <span className="min-w-0">
    <span className="block text-[14px] font-black text-[#111827]">Telegram Bot</span>
    <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-[#8b93a1]">
      Connect order approval notifications to your Telegram group.
    </span>
  </span>
  <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#9ca3af]" />
</button>
      type="button"
      onClick={() => setSettingsView('telegram')}
      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
    >
      <span className="min-w-0">
        <span className="block text-[14px] font-black text-[#111827]">Telegram Bot</span>
        <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-[#8b93a1]">
          Connect order approval notifications to your Telegram group.
        </span>
      </span>
      <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#9ca3af]" />
    </button>
  </div>
) : null}
    {settingsView === 'categories' ? (
      <>
        <button
          type="button"
          onClick={() => setSettingsView('home')}
          className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-[12px] font-black text-[#111827] shadow-sm ring-1 ring-black/5"
        >
          <i className="fa-solid fa-chevron-left text-[12px]" />
          Settings
        </button>

       <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h2 className="text-[16px] font-black text-[#111827]">Create custom category</h2>
      <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
        You can create up to 5 custom categories.
      </p>
    </div>

    <span className="shrink-0 rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[11px] font-black text-[#111827]">
      {customCategoryCount}/5
    </span>
  </div>

  <div className="mt-3 flex gap-2">
    <TextInput
      value={newCategory}
      onChange={setNewCategory}
      placeholder={canCreateCustomCategory ? 'Category name' : 'Custom category limit reached'}
    />
    <button
      type="button"
      onClick={addCategory}
      disabled={categorySaving || !canCreateCustomCategory}
      className="h-11 shrink-0 rounded-2xl bg-[#111827] px-4 text-[12px] font-black text-white disabled:opacity-40"
    >
      Add
    </button>
  </div>

  {!canCreateCustomCategory ? (
    <p className="mt-2 text-[11px] font-bold text-[#e5484d]">
      Custom category limit reached. Delete one custom category before creating a new one.
    </p>
  ) : null}
</div>
    <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-black text-[#111827]">Categories</h2>
        <button
          type="button"
          onClick={saveCategoryOrder}
          disabled={categorySaving || !storeCategories.length}
          className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-black text-white disabled:opacity-50"
        >
          Save order
        </button>
      </div>

      {categoryError ? (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mb-3 w-full rounded-2xl bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold text-[#9a3412]"
        >
          {categoryError}
        </button>
      ) : null}

      <div className="space-y-2">
        {withSystemCategories(storeCategories.length ? storeCategories : categories.map((name, index) => ({
  id: `local-${index}`,
  name,
}))).map((category, index, list) => {
  const editing = editingCategoryId === category.id
  const isSoldOutSystem = category.name === 'Sold out'
  const isLocalCategory = category.id.startsWith('local-')
  const menuOpen = openCategoryMenuId === category.id

          return (
            <div
              key={category.id}
              className="rounded-2xl bg-[#f8fafc] px-3 py-3 ring-1 ring-black/5"
            >
              <div className="flex items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {editing ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(event) => setEditingCategoryName(event.target.value)}
                      className="h-10 w-full rounded-xl border border-[#d9e1ec] bg-white px-3 text-[13px] font-black text-[#111827] outline-none focus:border-[#111827]"
                    />
                  ) : (
                    <div className="flex min-w-0 items-center gap-2">
  <span className="truncate text-[13px] font-black text-[#111827]">
    {category.name}
  </span>
  {isSoldOutSystem ? (
    <span className="shrink-0 rounded-full bg-[#eef3f8] px-2 py-0.5 text-[9px] font-black text-[#42526b]">
      System
    </span>
  ) : null}
  {category.isHidden ? (
    <span className="shrink-0 rounded-full bg-[#fff1f1] px-2 py-0.5 text-[9px] font-black text-[#e5484d]">
      Hidden
    </span>
  ) : null}
</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => moveCategory(category.id, 'up')}
                  disabled={index === 0 || category.id.startsWith('local-')}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#111827] ring-1 ring-black/5 disabled:opacity-30"
                >
                  <i className="fa-solid fa-arrow-up text-[11px]" />
                </button>

                <button
                  type="button"
                  onClick={() => moveCategory(category.id, 'down')}
                  disabled={index === list.length - 1 || category.id.startsWith('local-')}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#111827] ring-1 ring-black/5 disabled:opacity-30"
                >
                  <i className="fa-solid fa-arrow-down text-[11px]" />
                </button>

                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEditCategory(category)}
                      disabled={categorySaving}
                      className="h-8 rounded-xl bg-[#111827] px-3 text-[11px] font-black text-white disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditCategory}
                      className="h-8 rounded-xl bg-white px-3 text-[11px] font-black text-[#111827] ring-1 ring-black/5"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="relative">
  <button
    type="button"
    onClick={() => setOpenCategoryMenuId(menuOpen ? '' : category.id)}
    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#111827] ring-1 ring-black/5 active:scale-95"
  >
    <i className="fa-solid fa-ellipsis text-[12px]" />
  </button>

  {menuOpen ? (
    <div className="absolute right-0 top-9 z-30 w-32 overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-black/10">
      <button
  type="button"
  onClick={() => {
    setOpenCategoryMenuId('')
    handleToggleHideCategory(category)
  }}
  disabled={isLocalCategory}
  className="block w-full px-3 py-2 text-left text-[12px] font-black text-[#111827] hover:bg-[#f8fafc] disabled:opacity-40"
>
  {category.isHidden ? 'Show' : 'Hide'}
</button>

      {!category.isDefault ? (
        <button
          type="button"
          onClick={() => {
            setOpenCategoryMenuId('')
            startEditCategory(category)
          }}
          disabled={isLocalCategory}
          className="block w-full px-3 py-2 text-left text-[12px] font-black text-[#111827] hover:bg-[#f8fafc] disabled:opacity-40"
        >
          Edit
        </button>
      ) : null}

      {!category.isDefault ? (
  <button
    type="button"
    onClick={() => {
      setOpenCategoryMenuId('')
      handleDeleteCategory(category)
    }}
    disabled={isLocalCategory}
    className="block w-full px-3 py-2 text-left text-[12px] font-black text-[#e5484d] hover:bg-[#fff1f1] disabled:opacity-40"
  >
    Delete
  </button>
) : null}
    </div>
  ) : null}
</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
       </div>
      </>
    ) : null}

  {settingsView === 'delivery' ? (
  <div className="fixed inset-0 z-[999] bg-[#f7f5fb]">
    <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => setSettingsView('home')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827] active:scale-95"
        >
          <i className="fa-solid fa-chevron-left text-[14px]" />
        </button>

        <div className="min-w-0">
          <h1 className="text-[18px] font-black leading-5 text-[#111827]">Delivery Company</h1>
          <p className="mt-0.5 text-[11px] font-semibold text-[#8b93a1]">
            Set delivery fees for reader checkout.
          </p>
        </div>
      </div>
    </header>

    <main className="h-[calc(100vh-56px)] overflow-y-auto px-4 pb-28 pt-4">
      <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
        <div className="px-4 pb-2 pt-4">
          <h2 className="text-[16px] font-black text-[#111827]">Delivery fees</h2>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
            These fees will be added to checkout total.
          </p>
        </div>

        <div className="px-4 py-4">
          <div className="flex gap-3">
            <DeliveryLogo type="jnt" />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-black text-[#111827]">J&T</h3>
                  <p className="mt-0.5 text-[12px] font-semibold text-[#8b93a1]">
                    J&T Express delivery for printed books.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#fff4cc] px-3 py-1 text-[11px] font-black text-[#111827]">
                  ${Number(jtDeliveryFee || 0).toFixed(2)}
                </span>
              </div>

              <div className="mt-3">
                <FieldLabel>Delivery fee</FieldLabel>
                <TextInput value={jtDeliveryFee} onChange={setJtDeliveryFee} placeholder="2.00" type="number" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 h-px bg-[#eef0f4]" />

        <div className="px-4 py-4">
          <div className="flex gap-3">
            <DeliveryLogo type="vet" />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-black text-[#111827]">VET</h3>
                  <p className="mt-0.5 text-[12px] font-semibold text-[#8b93a1]">
                    Virak Buntham Express delivery option.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#fff4cc] px-3 py-1 text-[11px] font-black text-[#111827]">
                  ${Number(vetDeliveryFee || 0).toFixed(2)}
                </span>
              </div>

              <div className="mt-3">
                <FieldLabel>Delivery fee</FieldLabel>
                <TextInput value={vetDeliveryFee} onChange={setVetDeliveryFee} placeholder="2.00" type="number" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {deliveryMessage ? (
        <button
          type="button"
          onClick={() => setDeliveryMessage('')}
          className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-left text-[12px] font-bold text-[#42526b] shadow-sm ring-1 ring-black/5"
        >
          {deliveryMessage}
        </button>
      ) : null}
    </main>

    <div className="fixed inset-x-0 bottom-0 z-[1000] border-t border-[#eeeaf5] bg-white/95 p-4 backdrop-blur">
      <button
        type="button"
        onClick={handleSaveDeliveryFees}
        disabled={deliverySaving}
        className="h-12 w-full rounded-2xl bg-[#111827] text-[13px] font-black text-white shadow-lg active:scale-[0.98] disabled:opacity-60"
      >
        {deliverySaving ? 'Saving...' : 'Save delivery fees'}
      </button>
    </div>
  </div>
) : null}

    <SalesReportsSettingsPage
  open={settingsView === 'sales-reports'}
  onBack={() => setSettingsView('home')}
  fetchSettings={fetchSalesReportsSettings}
  connectSheet={connectSalesReports}
  syncSheet={syncSalesReports}
  disconnectSheet={disconnectSalesReports}
/>

  {settingsView === 'telegram' ? (
  <>
    <button
      type="button"
      onClick={() => setSettingsView('home')}
      className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-[12px] font-black text-[#111827] shadow-sm ring-1 ring-black/5"
    >
      <i className="fa-solid fa-chevron-left text-[12px]" />
      Settings
    </button>

    <div className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="bg-gradient-to-br from-[#dff6ff] via-[#eefaff] to-white px-4 py-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#229ed9] shadow-sm ring-1 ring-black/5">
          <i className="fa-brands fa-telegram text-[30px]" />
        </div>
        <h2 className="mt-3 text-[17px] font-black text-[#111827]">Receive Telegram Notifications</h2>
        <p className="mx-auto mt-1 max-w-[380px] text-[12px] font-semibold leading-5 text-[#6b7280]">
          Link this author page to one Telegram group for order approval alerts. You can change groups only after unlinking the current one.
        </p>
      </div>

      <div className="space-y-4 p-4">
        {telegramMessage ? (
          <button
            type="button"
            onClick={() => setTelegramMessage('')}
            className="w-full rounded-2xl bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold text-[#111827] ring-1 ring-black/5"
          >
            {telegramMessage}
          </button>
        ) : null}

        {telegramChatId ? (
          <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f7ff] text-[#229ed9] ring-1 ring-[#229ed9]/20">
                <i className="fa-brands fa-telegram text-[22px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#8b93a1]">Linked group</div>
                <div className="mt-1 truncate text-[16px] font-black text-[#111827]">{telegramChatTitle || 'Telegram group'}</div>
                <div className="mt-1 text-[12px] font-bold text-[#6b7280]">Group ID: {telegramChatId}</div>
                {telegramLinkedAt ? <div className="mt-1 text-[11px] font-semibold text-[#8b93a1]">Linked: {new Date(telegramLinkedAt).toLocaleString()}</div> : null}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#f8fafc] px-4 py-3 text-[12px] font-semibold leading-5 text-[#6b7280]">
              This author page can use only one Telegram group. To connect another group, unlink this group first.
            </div>

            <button
              type="button"
              onClick={handleUnlinkTelegramGroup}
              disabled={telegramUnlinking || telegramLoading}
              className="mt-4 h-12 w-full rounded-full bg-[#fff1f2] text-[13px] font-black text-[#b91c1c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-60"
            >
              {telegramUnlinking ? 'Unlinking...' : 'Unlink group'}
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-dashed border-[#b8c2d6] bg-white p-4">
              <div className="text-[12px] font-black text-[#111827]">How to connect</div>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12px] font-semibold leading-5 text-[#6b7280]">
                <li>Tap Connect Telegram Group.</li>
                <li>Telegram will open and ask you to choose a group.</li>
                <li>Add @{telegramBotUsername || 'ShadowAuthorStoreNotifyBot'} to that group.</li>
                <li>The bot will confirm when the group is linked.</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={handleCreateTelegramConnectLink}
              disabled={telegramConnecting || telegramLoading}
              className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white shadow-sm active:scale-[0.98] disabled:bg-[#aeb6c4]"
            >
              {telegramConnecting ? 'Opening Telegram...' : telegramLoading ? 'Loading...' : 'Connect Telegram Group'}
            </button>
          </>
        )}
      </div>
    </div>
  </>
) : null}
  </section>
) : null}

     {activeTab === 'Orders' ? (
  <section className="mt-4 space-y-3">
    <div className="mx-4 overflow-visible rounded-[10px] bg-[linear-gradient(135deg,#fbfaff_0%,#f3efff_55%,#ffffff_100%)] px-4 py-4 shadow-[0_16px_38px_rgba(124,91,255,0.10)] ring-1 ring-white/80 sm:mx-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-black text-[#2d2766]">Order history</h2>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#7c7da6]">
            Orders checked by admin from your author store.
          </p>
        </div>

        
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          setOrderPage(1)
          setOrderSearchQuery(orderSearchDraft.trim())
        }}
        className="mt-4 flex items-center gap-2"
      >
        <div className="relative min-w-0 flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#9b98bd]" />
          <input
            type="search"
            value={orderSearchDraft}
            onChange={(event) => setOrderSearchDraft(event.target.value)}
            placeholder="Search order ID, buyer name, phone..."
            className="h-11 w-full rounded-[10px] border border-[#ddd6fe] bg-white/85 pl-9 pr-3 text-[13px] font-bold text-[#2d2766] shadow-[0_8px_22px_rgba(124,91,255,0.07)] outline-none placeholder:text-[#aaa8c8] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10"
          />
        </div>

        <div className="relative z-[120] shrink-0">
          <button
            type="button"
            onClick={() => setOrderFilterOpen((current) => !current)}
            className={`relative flex h-11 w-11 items-center justify-center rounded-[10px] bg-white shadow-[0_8px_22px_rgba(124,91,255,0.12)] ring-1 ring-[#e9e2ff] transition active:scale-[0.96] ${
              orderFilterOpen ? 'bg-[#f3edff] text-[#7c5cff]' : 'text-[#8b86aa]'
            }`}
            aria-label="Filter orders"
            aria-expanded={orderFilterOpen}
          >
            <i className="fa-solid fa-sliders text-[14px]" />

            {orderPrepareFilter !== 'all' ? (
              <span className="absolute right-[6px] top-[6px] h-2 w-2 rounded-full bg-[#8b5cf6] ring-2 ring-white" />
            ) : null}
          </button>

          {orderFilterOpen ? (
            <>
              <button
                type="button"
                aria-label="Close order filter"
                onClick={() => setOrderFilterOpen(false)}
                className="fixed inset-0 z-[119] cursor-default bg-transparent"
              />

              <div className="absolute right-0 top-[52px] z-[120] w-[176px] overflow-hidden rounded-[16px] bg-white p-2 shadow-[0_18px_45px_rgba(45,39,102,0.22)] ring-1 ring-[#e5ddff]">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'to_prepare', label: 'To prepare' },
                  { value: 'preparing', label: 'Preparing' },
                ].map((item) => {
                  const active = orderPrepareFilter === item.value

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setOrderPrepareFilter(item.value)
                        setOrderPage(1)
                        setOrderFilterOpen(false)
                      }}
                      className={`flex h-10 w-full items-center justify-between rounded-[11px] px-3 text-left text-[12px] font-black transition ${
                        active
                          ? 'bg-[#f1edff] text-[#6f4cff]'
                          : 'text-[#555777] hover:bg-[#f8f7ff] active:bg-[#f3efff]'
                      }`}
                    >
                      <span>{item.label}</span>

                      {active ? (
                        <i className="fa-solid fa-check text-[11px] text-[#7c5cff]" />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </>
          ) : null}
        </div>
        
      </form>

      <div className="mt-3 flex gap-1.5">
  {[
    { value: 'all', label: 'All' },
    { value: 'book', label: 'Book' },
    { value: 'pdf', label: 'PDF' },
  ].map((item) => {
    const active = orderType === item.value

    return (
      <button
        key={item.value}
        type="button"
        onClick={() => {
          setOrderType(item.value)
          setOrderPage(1)
        }}
        className={`flex h-8 min-w-[58px] flex-1 items-center justify-center rounded-full px-3 text-[11px] font-black transition active:scale-[0.97] ${
          active
            ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-[0_8px_20px_rgba(124,91,255,0.24)]'
            : 'bg-white/75 text-[#74759b] shadow-[0_7px_18px_rgba(124,91,255,0.07)] ring-1 ring-white/80'
        }`}
      >
        {item.label}
      </button>
    )
  })}
</div>
    </div>

    {orderLoading ? (
      <div className="rounded-[24px] bg-white p-8 text-center text-[13px] font-bold text-[#8b93a1] shadow-sm ring-1 ring-black/5">
        Loading orders...
      </div>
    ) : orders.length ? (
      <>
        <div className="space-y-2">
          {orders.map((order) => (
            <OrderHistoryRow
              key={order.id}
              order={order}
              onMarkPreparing={onMarkOrderPreparing}
              preparingLoading={orderActionLoadingId === order.id}
            />
          ))}
        </div>

        <div className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => setOrderPage((page) => Math.max(1, page - 1))}
            disabled={orderPage <= 1}
            className="rounded-full bg-[#f3f4f6] px-4 py-2 text-[12px] font-black text-[#111827] disabled:opacity-40"
          >
            Previous
          </button>

          <div className="text-[12px] font-bold text-[#6b7280]">
            Page {orderPage} / {Math.max(Number(orderPagination.total_pages || 1), 1)}
          </div>

          <button
            type="button"
            onClick={() => setOrderPage((page) => page + 1)}
            disabled={orderPage >= Number(orderPagination.total_pages || 1)}
            className="rounded-full bg-[#f3f4f6] px-4 py-2 text-[12px] font-black text-[#111827] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </>
    ) : (
      <div className="rounded-[22px] bg-gradient-to-br from-[#f8f5ff] via-white to-[#fff8e8] px-5 py-8 text-center">
  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1ebff] text-[#7c5cff] shadow-[0_10px_26px_rgba(124,91,255,0.16)] ring-1 ring-white">
    <i className="fa-solid fa-receipt text-[22px]" />
  </div>

  <h3 className="mt-4 text-[17px] font-bold leading-6 text-[#2d2766]">
    No orders yet
  </h3>

  <p className="mx-auto mt-2 max-w-[280px] text-[12px] font-normal leading-5 text-[#7c7da6]">
    New confirmed orders from your author store will appear here.
  </p>

  <div className="mt-4 flex items-center justify-center gap-2">
    {['Book', 'PDF', 'Preparing'].map((item) => (
      <span
        key={item}
        className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-normal text-[#7c7da6] shadow-sm ring-1 ring-[#ece7ff]"
      >
        {item}
      </span>
    ))}
  </div>
</div>
    )}
  </section>
) : null}
    </main>
  )
}

function GallerySlot({ image, index, onChoose, onRemove }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#d9e1ec] bg-[#f8fafc]">
      <div className="relative aspect-[3/4] bg-[#f3f6fa]">
        {image?.url ? (
          <img src={image.url} alt={`Book image ${index + 1}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[12px] font-black text-[#9ca3af]">
            Image {index + 1}
          </div>
        )}

        {image?.url ? (
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#111827] shadow-sm">
            {index + 1}
          </span>
        ) : null}
      </div>

      <div className="space-y-1.5 p-2">
        <button
          type="button"
          onClick={onChoose}
          className="h-8 w-full rounded-xl bg-[#eef2ff] text-[11px] font-black text-[#111827] active:scale-[0.98]"
        >
          Choose
        </button>
        {image?.url ? (
          <button
            type="button"
            onClick={onRemove}
            className="h-8 w-full rounded-xl bg-[#fff1f1] text-[11px] font-black text-[#e5484d] active:scale-[0.98]"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}

function AddProductPage({ categories, productToEdit = null, onBack, onSave }) {
  const fileInputRef = useRef(null)
  const galleryInputRefs = useRef([])
  const [type, setType] = useState(productToEdit?.type || 'Book')
  const [title, setTitle] = useState(productToEdit?.title || '')
  const [category, setCategory] = useState(productToEdit?.category || '')
  const [authorName, setAuthorName] = useState(productToEdit?.authorName || '')
  const [publisher, setPublisher] = useState(productToEdit?.publisher || '')
  const [novelType, setNovelType] = useState(productToEdit?.novelType || '')
  const [coverType, setCoverType] = useState(productToEdit?.coverType || '')
  const [sortOrder, setSortOrder] = useState(String(productToEdit?.sortOrder ?? '0'))
  const [bestSeller, setBestSeller] = useState(Boolean(productToEdit?.bestSeller))
  const [discount, setDiscount] = useState(Boolean(productToEdit?.discount))
  const [description, setDescription] = useState(productToEdit?.description || '')
  const [originalPrice, setOriginalPrice] = useState(productToEdit?.originalPrice || '')
  const [salePrice, setSalePrice] = useState(productToEdit?.salePrice || '')
  const [active, setActive] = useState(productToEdit ? productToEdit.status === 'Active' : true)
  const [coverFile, setCoverFile] = useState(null)
  const [coverFileName, setCoverFileName] = useState('')
  const [coverPreview, setCoverPreview] = useState(productToEdit?.coverUrl || '')
  const [galleryImages, setGalleryImages] = useState(() => {
  const savedImages = Array.isArray(productToEdit?.galleryImages)
    ? productToEdit.galleryImages.slice(0, 5).map((image) => ({
        url: image.url || '',
        name: image.name || '',
        file: null,
        local: false,
      }))
    : []

  return [
    ...savedImages,
    ...Array.from({ length: Math.max(0, 5 - savedImages.length) }, () => null),
  ]
})
  const [stock, setStock] = useState(productToEdit?.stock || '')
  const [paperType, setPaperType] = useState(productToEdit?.paperType || '')
  const [condition, setCondition] = useState(productToEdit?.condition || 'New')
  const [qualityPercent, setQualityPercent] = useState(productToEdit?.qualityPercent || '')
  const [deliveryNote, setDeliveryNote] = useState(productToEdit?.deliveryNote || '')
  const [genre, setGenre] = useState(productToEdit?.genre || '')
  const [preOrder, setPreOrder] = useState(Boolean(productToEdit?.preOrder))
  const [pdfFileName, setPdfFileName] = useState(productToEdit?.pdfFileName || '')
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfFileUrl, setPdfFileUrl] = useState(productToEdit?.pdfFileUrl || '')
  const [pageCount, setPageCount] = useState(productToEdit?.pageCount || '')
  const [accessRule, setAccessRule] = useState('Read online only')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
  if (!formError) return
  if (formError.includes('Uploading') || formError.includes('Saving')) return

  const timer = window.setTimeout(() => {
    setFormError('')
  }, 2500)

  return () => window.clearTimeout(timer)
}, [formError])

  const selectCover = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Please upload a valid cover image.')
      return
    }

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }

    setCoverFile(file)
    setCoverFileName(file.name)
    setCoverPreview(URL.createObjectURL(file))
    setFormError('')
  }

  const removeCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }

    setCoverFile(null)
    setCoverFileName('')
    setCoverPreview('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

 const selectGalleryImage = (index, file) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    setFormError('Please upload a valid gallery image.')
    return
  }

  setGalleryImages((current) => {
    const next = [...current]

    if (next[index]?.local && next[index]?.url) {
      URL.revokeObjectURL(next[index].url)
    }

    next[index] = {
      url: URL.createObjectURL(file),
      name: file.name,
      file,
      local: true,
    }

    return next
  })

  setFormError('')
}

  const removeGalleryImage = (index) => {
  setGalleryImages((current) => {
    const next = [...current]

    if (next[index]?.local && next[index]?.url) {
      URL.revokeObjectURL(next[index].url)
    }

    next[index] = null
    return next
  })

  if (galleryInputRefs.current[index]) {
    galleryInputRefs.current[index].value = ''
  }
}

  const uploadBookGalleryImages = async () => {
    if (type !== 'Book') return []

    const uploadedImages = []

    for (let index = 0; index < galleryImages.length; index += 1) {
      const image = galleryImages[index]

      if (!image?.url && !image?.file) continue

      if (image.file) {
        setFormError('Saving product...')
        const imageUrl = await uploadGalleryImage(image.file)

        uploadedImages.push({
          url: imageUrl,
          name: image.name || image.file.name || `Gallery image ${index + 1}`,
        })
      } else if (image.url) {
        uploadedImages.push({
          url: image.url,
          name: image.name || '',
        })
      }
    }

    return uploadedImages.slice(0, 5)
  }

  const saveProduct = async () => {
    const qualityNumber = Number(qualityPercent)
const stockNumber = Number(stock || 0)

    if (saving) return

    if (!title.trim()) {
  setFormError('Book title is required.')
  return
}

if (!authorName.trim()) {
  setFormError('Author name is required.')
  return
}

if (!category) {
  setFormError('Category is required.')
  return
}

if (!salePrice || Number(salePrice) <= 0) {
  setFormError('Sell price is required.')
  return
}

   if (!coverFile && !coverPreview) {
  setFormError('Book cover is required.')
  return
}

   if (type === 'Book' && (Number.isNaN(stockNumber) || stockNumber < 0)) {
  setFormError('Stock quantity cannot be negative.')
  return
}
    if (type === 'Book' && condition === 'Second Hand' && (!qualityPercent || Number.isNaN(qualityNumber) || qualityNumber < 1 || qualityNumber > 100)) {
      setFormError('Book quality must be between 1% and 100%.')
      return
    }

    try {
      setSaving(true)
    setFormError('Saving product...')

const coverUrl = coverFile ? await uploadCoverImage(coverFile) : coverPreview

const nextGalleryImages = await uploadBookGalleryImages()

const hasExistingPdf = Boolean(pdfFileUrl || pdfFileName)

if (type === 'PDF' && !pdfFile && !hasExistingPdf) {
  setFormError('PDF file is required.')
  setSaving(false)
  return
}

setFormError(
  type === 'PDF' && pdfFile
    ? 'Uploading private PDF...'
    : 'Saving product...'
)

      await onSave({
        type,
        title: title.trim(),
        authorName: authorName.trim(),
        publisher: publisher.trim(),
        novelType: novelType.trim(),
        category,
        genre: genre.trim(),
        description,
        coverType: coverType.trim(),
        sortOrder,
        bestSeller,
        discount,
        originalPrice,
        salePrice,
        status: active ? 'Active' : 'Draft',
        coverUrl,
galleryImages: nextGalleryImages,
stock,
        paperType,
        condition,
        qualityPercent: condition === 'Second Hand' ? qualityPercent : '',
        deliveryNote,
        preOrder,
        pdfFile,
        pdfFileName,
pdfFileUrl,
pageCount,
accessRule: type === 'PDF' ? 'Read online only' : accessRule,
      })
    } catch (error) {
      setFormError(error.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-4 pb-28">
{formError ? (
  <button
    type="button"
    onClick={() => setFormError('')}
    className="fixed left-1/2 top-20 z-[300] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 rounded-2xl bg-[#111827] px-4 py-3 text-left text-[12px] font-black text-white shadow-2xl active:scale-[0.98]"
  >
    {formError}
  </button>
) : null}
      
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <AdminStyleCard title="Book Cover" text="Upload the vertical cover shown on product cards.">
          <FormDivider title="Main cover" />

          <p className="mb-3 text-[11px] font-semibold leading-5 text-[#64748b]">
            Recommended vertical 2:3 ratio, JPG, PNG, or WEBP.
          </p>

          <div className="flex flex-col items-center">
            <div className="aspect-[2/3] w-[200px] overflow-hidden rounded-[24px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] shadow-inner">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center px-5 text-center text-[#9ca3af]">
                  <i className="fa-regular fa-image mb-3 text-[28px]" />
                  <span className="text-[12px] font-black">Book Cover Preview</span>
                  <span className="mt-1 text-[11px] font-bold">2:3 vertical</span>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={(event) => selectCover(event.target.files?.[0])} className="hidden" />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 h-11 w-full rounded-2xl border border-dashed border-[#b8c2d6] bg-white text-[12px] font-black text-[#111827] active:scale-[0.98]"
            >
              {coverPreview ? 'Choose or replace book cover' : 'Choose book cover'}
            </button>

            {coverPreview ? (
              <button
                type="button"
                onClick={removeCover}
                className="mt-2 h-10 w-full rounded-2xl bg-[#fff1f1] text-[12px] font-black text-[#e5484d] active:scale-[0.98]"
              >
                Clear Book Cover
              </button>
            ) : null}

            {coverFileName ? <p className="mt-2 w-full truncate text-center text-[11px] font-bold text-[#8b93a1]">{coverFileName}</p> : null}
          </div>
        </AdminStyleCard>

        <AdminStyleCard title="Book Gallery" text="Upload extra vertical images shown on the product detail page.">
          <FormDivider title="Extra book images" />

          <p className="mb-3 text-[11px] font-semibold leading-5 text-[#64748b]">
            Maximum 5 vertical gallery images. These help readers see more details before buying.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {galleryImages.map((image, index) => (
              <div key={index}>
                <input
                  ref={(node) => {
                    galleryInputRefs.current[index] = node
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(event) => selectGalleryImage(index, event.target.files?.[0])}
                  className="hidden"
                />
                <GallerySlot
                  image={image}
                  index={index}
                  onChoose={() => galleryInputRefs.current[index]?.click()}
                  onRemove={() => removeGalleryImage(index)}
                />
              </div>
            ))}
          </div>
        </AdminStyleCard>
      </div>

      <section className="mt-4 overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
        <div className="border-b border-[#e6edf5] px-4 py-4">
          <h1 className="text-[17px] font-black leading-5 text-[#111827]">Book Information</h1>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
            Add book details for your author store.
          </p>
        </div>

        <div className="space-y-4 p-4">
          <FormDivider title="Product type" />

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f3f4f6] p-1">
            <button
              type="button"
              onClick={() => setType('Book')}
              className={`h-11 rounded-xl text-[13px] font-black ${type === 'Book' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6b7280]'}`}
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => setType('PDF')}
              className={`h-11 rounded-xl text-[13px] font-black ${type === 'PDF' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6b7280]'}`}
            >
              PDF
            </button>
          </div>

        <FormDivider title="Book information" />

<div>
  <FieldLabel>Book title *</FieldLabel>
  <TextInput value={title} onChange={setTitle} placeholder="Enter book title" />
</div>

<div className="grid gap-3 sm:grid-cols-2">
  <div>
    <FieldLabel>Author name *</FieldLabel>
    <TextInput value={authorName} onChange={setAuthorName} placeholder="Author name" />
  </div>

  <div>
    <FieldLabel>Publisher</FieldLabel>
    <TextInput value={publisher} onChange={setPublisher} placeholder="Publisher" />
  </div>
</div>

<div className="grid gap-3 sm:grid-cols-2">
  <div>
    <FieldLabel>Novel type</FieldLabel>
    <TextInput value={novelType} onChange={setNovelType} placeholder="Example: Khmer, English, Chinese..." />
  </div>

  <div>
    <FieldLabel>Category *</FieldLabel>
    <SelectInput value={category} onChange={setCategory}>
  <option value="">Select category</option>
  {categories
  .filter((item) => item !== 'Sold out')
  .map((item) => <option key={item} value={item}>{item}</option>)}
</SelectInput>
  </div>
</div>

<div className="grid gap-3 sm:grid-cols-2">
  <div>
    <FieldLabel>Genre</FieldLabel>
    <TextInput value={genre} onChange={setGenre} placeholder="Romance, fantasy, mystery..." />
  </div>

  {type === 'Book' ? (
    <div>
      <FieldLabel>Condition</FieldLabel>
      <SelectInput value={condition} onChange={setCondition}>
        {BOOK_CONDITIONS.map((item) => <option key={item} value={item}>{item}</option>)}
      </SelectInput>
    </div>
  ) : null}
</div>

{type === 'Book' ? (
  <div className="grid gap-3 sm:grid-cols-2">
    <div>
      <FieldLabel>Paper type</FieldLabel>
      <TextInput value={paperType} onChange={setPaperType} placeholder="Example: Normal paper, glossy paper, cream paper..." />
    </div>

    <div>
      <FieldLabel>Cover type</FieldLabel>
      <TextInput value={coverType} onChange={setCoverType} placeholder="Example: Paperback, hardcover..." />
    </div>
  </div>
) : null}

<div className="grid gap-3 sm:grid-cols-2">
  <div>
    <FieldLabel>Page count</FieldLabel>
    <TextInput value={pageCount} onChange={setPageCount} placeholder="Example: 436" type="number" />
  </div>

  {condition === 'Second Hand' ? (
    <div>
      <FieldLabel>Condition note</FieldLabel>
      <TextInput value={qualityPercent} onChange={setQualityPercent} placeholder="Example: 85" type="number" />
      <p className="mt-1.5 text-[11px] font-bold text-[#8b93a1]">Enter the estimated book quality from 1% to 100%.</p>
    </div>
  ) : null}
</div>

          <FormDivider title="Sale & stock" />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Sale price *</FieldLabel>
              <TextInput value={salePrice} onChange={setSalePrice} placeholder="Example: 8.75" type="number" />
            </div>
            <div>
              <FieldLabel>Original price</FieldLabel>
              <TextInput value={originalPrice} onChange={setOriginalPrice} placeholder="Leave empty if no discount" type="number" />
            </div>
          </div>

         {type === 'Book' ? (
  <div className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <FieldLabel>Stock quantity</FieldLabel>
        <TextInput value={stock} onChange={setStock} placeholder="Example: 10" type="number" />
      </div>

      <div>
        <FieldLabel>Sort order</FieldLabel>
        <TextInput value={sortOrder} onChange={setSortOrder} placeholder="0" type="number" />
      </div>
    </div>

    <label className="flex h-11 items-center gap-2 rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-bold text-[#111827]">
      <input type="checkbox" checked={preOrder} onChange={(event) => setPreOrder(event.target.checked)} />
      Pre-order product
    </label>

<div className="grid gap-3 sm:grid-cols-2">
  <label className="flex h-11 items-center gap-2 rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-bold text-[#111827]">
    <input
      type="checkbox"
      checked={bestSeller}
      onChange={(event) => setBestSeller(event.target.checked)}
    />
    Best seller product
  </label>

  <label className="flex h-11 items-center gap-2 rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-bold text-[#111827]">
    <input
      type="checkbox"
      checked={discount}
      onChange={(event) => setDiscount(event.target.checked)}
    />
    Discount product
  </label>
</div>
    
  </div>
) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>PDF file</FieldLabel>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => {
  const file = event.target.files?.[0]

  if (!file) {
    setPdfFile(null)
    setPdfFileName('')
    return
  }

  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf')

  if (!isPdf) {
    setFormError('Please upload a valid PDF file.')
    setPdfFile(null)
    setPdfFileName('')
    return
  }

  if (file.size > 50 * 1024 * 1024) {
    setFormError('PDF file must be 50 MB or smaller.')
    setPdfFile(null)
    setPdfFileName('')
    return
  }

  setPdfFile(file)
  setPdfFileName(file.name)
  setFormError('')
}}
                  className="block h-11 w-full rounded-2xl border border-[#d9e1ec] bg-white px-3.5 py-2 text-[13px] font-bold text-[#111827]"
                />
                {pdfFileName ? <div className="mt-2 text-[11px] font-bold text-[#6b7280]">{pdfFileName}</div> : null}
              </div>
              <div>
                <FieldLabel>Page count</FieldLabel>
                <TextInput value={pageCount} onChange={setPageCount} placeholder="Example: 120" type="number" />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Access rule</FieldLabel>
                <SelectInput value={accessRule} onChange={setAccessRule}>
                  {PDF_ACCESS_RULES.map((item) => <option key={item} value={item}>{item}</option>)}
                </SelectInput>
              </div>
            </div>
          )}

<FormDivider title="Product details" />

<div>
  <FieldLabel>Condition label</FieldLabel>
  <TextInput value={deliveryNote} onChange={setDeliveryNote} placeholder="New, Like new, Good, Fair..." />
</div>

<div>
  <FieldLabel>Description</FieldLabel>
  <textarea
    value={description}
    onChange={(event) => setDescription(event.target.value)}
    placeholder="Book details, condition, delivery note, or pre-order note..."
    className="min-h-[120px] w-full rounded-2xl border border-[#d9e1ec] bg-white px-3.5 py-3 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]"
  />
</div>

<div>
  <label className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-black text-[#111827] ring-1 ring-black/5">
    <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
    Active
  </label>
</div>

{formError ? (
  <button
    type="button"
    onClick={() => setFormError('')}
    className="w-full rounded-2xl bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold text-[#9a3412]"
  >
    {formError}
  </button>
) : null}

<div className="grid gap-3 sm:grid-cols-2">
  <button
    type="button"
    onClick={onBack}
    className="h-12 rounded-2xl bg-[#f3f4f6] text-[13px] font-black text-[#111827] active:scale-[0.98]"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={saveProduct}
    disabled={saving}
    className="h-12 rounded-2xl bg-[#111827] text-[13px] font-black text-white active:scale-[0.98] disabled:opacity-60"
  >
    {saving ? 'Saving...' : productToEdit ? 'Save Product' : 'Create Product'}
  </button>
</div>
        </div>
      </section>
    </main>
  )
}

export default function AuthorStoreManagerPage() {
  const [promotion, setPromotion] = useState(null)
  const [authorMenuOpen, setAuthorMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [mode, setMode] = useState('manager')
  const [editingProduct, setEditingProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('Records')
  const [activeType, setActiveType] = useState('All')
  const [newCategory, setNewCategory] = useState('')
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [storeCategories, setStoreCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  const [categorySaving, setCategorySaving] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const [orderSummary, setOrderSummary] = useState({
    orders_count: 0,
    revenue: 0,
    gross_revenue: 0,
    platform_fee: 0,
    author_income: 0,
  })
  const [orders, setOrders] = useState([])
  const [orderPage, setOrderPage] = useState(1)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderPagination, setOrderPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  })
  const [orderType, setOrderType] = useState('all')
  const [orderPrepareFilter, setOrderPrepareFilter] = useState('all')
  const [orderSearchDraft, setOrderSearchDraft] = useState('')
  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [orderActionLoadingId, setOrderActionLoadingId] = useState('')
  const orderAutoRefreshCountRef = useRef(0)
  const lastOrderReportLoadAtRef = useRef(0)

  const loadPromotion = useCallback(async () => {
    try {
      const nextPromotion = await fetchMyStorePromotion()
      setPromotion(nextPromotion)
    } catch {
      setPromotion(null)
    }
  }, [])

  const loadOrderReport = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setOrderLoading(true)

      const report = await fetchMyOrderReport({
        page: orderPage,
        limit: ORDER_REPORT_LIMIT,
        type: orderType,
        prepareStatus: orderPrepareFilter,
        q: orderSearchQuery,
      })
      const summary = report.summary || {}

      lastOrderReportLoadAtRef.current = Date.now()

      setOrderSummary({
        orders_count: Number(summary.orders_count || summary.total_orders || 0),
        revenue: Number(summary.revenue || summary.author_income || 0),
        gross_revenue: Number(summary.gross_revenue || 0),
        platform_fee: Number(summary.platform_fee || 0),
        author_income: Number(summary.author_income || summary.revenue || 0),
      })

      setOrders(report.orders || [])
      setOrderPagination(report.pagination || {
        page: orderPage,
        limit: ORDER_REPORT_LIMIT,
        total: 0,
        total_pages: 1,
      })
      await loadPromotion()
    } catch {
      setOrders([])
    } finally {
      setOrderLoading(false)
    }
  }, [orderPage, orderType, orderPrepareFilter, orderSearchQuery, loadPromotion])

  useEffect(() => {
    setOrderPage(1)
  }, [orderType, orderPrepareFilter, orderSearchQuery])

  const filteredProducts = useMemo(() => {
  if (activeType === 'All' || activeType === 'Active' || activeType === 'Draft') return products
  return products.filter((product) => product.type === activeType)
}, [activeType, products])
  
  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      try {
        setLoading(true)
        setLocalError('')

        const nextProducts = await fetchMyProducts()

        if (!ignore) {
          setProducts(nextProducts)
          const productCategories = nextProducts.map((item) => item.category).filter(Boolean)
          setCategories((current) => Array.from(new Set([...current, ...productCategories])))
        }
      } catch (error) {
        if (!ignore) {
          setLocalError(error.message || 'Failed to load products')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    loadPromotion()
  }, [loadPromotion])

  useEffect(() => {
    const refreshPromotion = () => {
      if (document.visibilityState === 'visible') loadPromotion()
    }

    window.addEventListener('focus', refreshPromotion)
    document.addEventListener('visibilitychange', refreshPromotion)

    return () => {
      window.removeEventListener('focus', refreshPromotion)
      document.removeEventListener('visibilitychange', refreshPromotion)
    }
  }, [loadPromotion])
  
  useEffect(() => {
    let timer = null

    if (activeTab !== 'Orders') {
      if (!lastOrderReportLoadAtRef.current) {
        loadOrderReport({ silent: true })
      }

      return () => {
        if (timer) window.clearInterval(timer)
      }
    }

    orderAutoRefreshCountRef.current = 0
    loadOrderReport({ silent: false })

    timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return

      if (orderAutoRefreshCountRef.current >= ORDER_MAX_AUTO_REFRESHES) {
        window.clearInterval(timer)
        return
      }

      orderAutoRefreshCountRef.current += 1
      loadOrderReport({ silent: true })
    }, ORDER_REFRESH_INTERVAL_MS)

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return

      const lastLoadedAt = lastOrderReportLoadAtRef.current
      const isStale = !lastLoadedAt || Date.now() - lastLoadedAt >= ORDER_REFRESH_INTERVAL_MS

      if (isStale) {
        loadOrderReport({ silent: true })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (timer) window.clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [activeTab, loadOrderReport])
  useEffect(() => {
    let ignore = false

    async function loadCategories() {
      try {
        setCategoryError('')
        const nextCategories = await fetchMyCategories()

        if (!ignore) {
          setStoreCategories(nextCategories)
          setCategories((current) => {
            const names = nextCategories.map((item) => item.name).filter(Boolean)
            return Array.from(new Set([...current, ...names]))
          })
        }
      } catch (error) {
        if (!ignore) {
          setCategoryError(error.message || 'Failed to load categories')
        }
      }
    }

    loadCategories()

    return () => {
      ignore = true
    }
  }, [])

  const addCategory = async () => {
  const name = newCategory.trim()

  if (!name || categorySaving) return

  if (storeCategories.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    setNewCategory('')
    return
  }

  try {
    setCategorySaving(true)
    setCategoryError('')

    const createdCategory = await createStoreCategory(name)

    if (createdCategory) {
      setStoreCategories((current) => [...current, createdCategory])
      setCategories((current) => Array.from(new Set([...current, createdCategory.name])))
    }

    setNewCategory('')
  } catch (error) {
    setCategoryError(error.message || 'Failed to create category')
  } finally {
    setCategorySaving(false)
  }
}

  const startEditCategory = (category) => {
  setEditingCategoryId(category.id)
  setEditingCategoryName(category.name)
  setCategoryError('')
}

const cancelEditCategory = () => {
  setEditingCategoryId('')
  setEditingCategoryName('')
}

const saveEditCategory = async (category) => {
  const name = editingCategoryName.trim()

  if (!category?.id || !name || categorySaving) return

  try {
    setCategorySaving(true)
    setCategoryError('')

    const updatedCategory = await updateStoreCategory(category.id, { name })

    if (updatedCategory) {
      setStoreCategories((current) =>
        current.map((item) => (item.id === updatedCategory.id ? updatedCategory : item))
      )
      setCategories((current) => Array.from(new Set([...current, updatedCategory.name])))
    }

    cancelEditCategory()
  } catch (error) {
    setCategoryError(error.message || 'Failed to update category')
  } finally {
    setCategorySaving(false)
  }
}

const handleDeleteCategory = async (category) => {
  if (!category?.id || categorySaving) return

  const confirmed = window.confirm(`Delete "${category.name}"?`)

  if (!confirmed) return

  try {
    setCategorySaving(true)
    setCategoryError('')

    await deleteStoreCategory(category.id)
    setStoreCategories((current) => current.filter((item) => item.id !== category.id))
  } catch (error) {
    setCategoryError(error.message || 'Failed to delete category')
  } finally {
    setCategorySaving(false)
  }
}

      const handleToggleHideCategory = async (category) => {
  if (!category?.id || categorySaving) return

  try {
    setCategorySaving(true)
    setCategoryError('')

    const updatedCategory = await updateStoreCategory(category.id, {
      is_hidden: !category.isHidden,
    })

    if (updatedCategory) {
      setStoreCategories((current) =>
        current.map((item) => (item.id === updatedCategory.id ? updatedCategory : item))
      )
    }
  } catch (error) {
    setCategoryError(error.message || 'Failed to update category')
  } finally {
    setCategorySaving(false)
  }
}

const moveCategory = (categoryId, direction) => {
  setStoreCategories((current) => {
    const index = current.findIndex((item) => item.id === categoryId)
    if (index < 0) return current

    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= current.length) return current

    const next = [...current]
    const temp = next[index]
    next[index] = next[nextIndex]
    next[nextIndex] = temp
    return next
  })
}

const saveCategoryOrder = async () => {
  if (categorySaving) return

  try {
    setCategorySaving(true)
    setCategoryError('')

    const savedCategories = await reorderStoreCategories(storeCategories.map((item) => item.id))
    setStoreCategories(savedCategories)
  } catch (error) {
    setCategoryError(error.message || 'Failed to save category order')
  } finally {
    setCategorySaving(false)
  }
}

  const saveProduct = async (product) => {
    const isEditing = Boolean(editingProduct?.id)
    const hasNewPrivatePdf = product.type === 'PDF' && Boolean(product.pdfFile)
    let savedProduct = null

    try {
      if (isEditing) {
        const metadataProduct = hasNewPrivatePdf
          ? {
              ...product,
              pdfFileName: editingProduct?.pdfFileName || '',
              pdfFileUrl: editingProduct?.pdfFileUrl || '',
              accessRule: 'Read online only',
            }
          : product

        savedProduct = await updateStoreProduct(editingProduct.id, metadataProduct)
      } else {
        const initialProduct = hasNewPrivatePdf
          ? {
              ...product,
              status: 'Draft',
              pdfFileUrl: '',
              accessRule: 'Read online only',
            }
          : product

        savedProduct = await createStoreProduct(initialProduct)
      }

      if (!savedProduct?.id) {
        throw new Error('Product was not saved')
      }

      if (hasNewPrivatePdf) {
        const privatePdf = await uploadPrivatePdfFile(product.pdfFile)

        await attachPrivatePdfToProduct(savedProduct.id, privatePdf)

        if (!isEditing && product.status !== 'Draft') {
          savedProduct = await updateStoreProduct(savedProduct.id, {
            ...product,
            pdfFile: null,
            pdfFileUrl: '',
            pdfFileName: privatePdf.file_name,
            accessRule: 'Read online only',
          })
        }
      }

      const nextProducts = await fetchMyProducts()
      const finalProduct =
        nextProducts.find((item) => item.id === savedProduct.id) ||
        savedProduct

      setProducts(nextProducts)

      if (finalProduct.category && !categories.includes(finalProduct.category)) {
        setCategories((current) => [...current, finalProduct.category])
      }

      setEditingProduct(null)
      setMode('manager')
      setActiveTab('Records')

      return finalProduct
    } catch (error) {
      if (!isEditing && savedProduct?.id && hasNewPrivatePdf) {
        try {
          await deleteStoreProduct(savedProduct.id)
        } catch {
        }
      }

      throw error
    }
  }

  const handleMarkOrderPreparing = async (order) => {
    const orderId = order?.order_id || order?.order_number || order?.id

    if (!orderId || orderActionLoadingId) return

    try {
      setOrderActionLoadingId(order.id || orderId)

      const updatedOrder = await markMyAuthorStoreOrderPreparing(orderId)

      if (updatedOrder) {
        setOrders((current) =>
          current.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
        )
      }

      await loadOrderReport({ silent: true })
    } catch {
    } finally {
      setOrderActionLoadingId('')
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!product?.id) return

    const confirmed = window.confirm(`Delete "${product.title || 'this product'}"?`)

    if (!confirmed) return

    try {
      setLocalError('')
      await deleteStoreProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch (error) {
      setLocalError(error.message || 'Failed to delete product')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setMode('form')
  }

  const openAddProductForm = () => {
    setEditingProduct(null)
    setMode('form')
  }

  const closeProductForm = () => {
    setEditingProduct(null)
    setMode('manager')
  }

  return (
    <div className={`min-h-screen bg-[#f3f4f6] ${mode === 'form' ? 'pb-0' : 'pb-[92px]'}`}>
<AuthorStoreMenuSheet
  open={authorMenuOpen}
  onClose={() => setAuthorMenuOpen(false)}
  onSwitchProfile={() => {
    setAuthorMenuOpen(false)
    navigate('/author/page')
  }}
  onFinance={() => {
    setAuthorMenuOpen(false)
    navigate('/author/page/finance')
  }}
  onSettings={() => {
    setAuthorMenuOpen(false)
    navigate('/author/page-settings')
  }}
/>
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
  type="button"
  onClick={() => {
    if (mode === 'form') {
      closeProductForm()
      return
    }

    setAuthorMenuOpen(true)
  }}
  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
>
  <i className={`fa-solid ${mode === 'form' ? 'fa-chevron-left' : 'fa-bars'} text-[16px]`} />
</button>
          <div className="text-[16px] font-black text-[#111827]">
            {mode === 'form' ? (editingProduct ? 'Edit Product' : 'Add Product') : 'Store'}
          </div>

          <button
            type="button"
            onClick={openAddProductForm}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm ${mode === 'form' ? 'invisible' : ''}`}
          >
            <i className="fa-solid fa-plus text-[14px]" />
          </button>
        </div>
      </div>

      {mode === 'form' ? (
        <AddProductPage
          categories={categories}
          productToEdit={editingProduct}
          onBack={closeProductForm}
          onSave={saveProduct}
        />
      ) : (
        <StoreManagerHome
          promotion={promotion}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeType={activeType}
          setActiveType={setActiveType}
          filteredProducts={filteredProducts}
          products={products}
          categories={categories}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          addCategory={addCategory}
          onAddProduct={openAddProductForm}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          loading={loading}
          localError={localError}
          storeCategories={storeCategories}
          categoryError={categoryError}
          categorySaving={categorySaving}
          editingCategoryId={editingCategoryId}
          editingCategoryName={editingCategoryName}
          setEditingCategoryName={setEditingCategoryName}
          startEditCategory={startEditCategory}
          cancelEditCategory={cancelEditCategory}
          saveEditCategory={saveEditCategory}
          handleDeleteCategory={handleDeleteCategory}
          handleToggleHideCategory={handleToggleHideCategory}
          moveCategory={moveCategory}
          saveCategoryOrder={saveCategoryOrder}
          orderSummary={orderSummary}
          orders={orders}
          orderPage={orderPage}
          setOrderPage={setOrderPage}
          orderLoading={orderLoading}
          orderPagination={orderPagination}
          onRefreshOrders={() => loadOrderReport({ silent: false })}
          orderType={orderType}
          setOrderType={setOrderType}
          orderPrepareFilter={orderPrepareFilter}
          setOrderPrepareFilter={setOrderPrepareFilter}
          orderSearchDraft={orderSearchDraft}
          setOrderSearchDraft={setOrderSearchDraft}
          setOrderSearchQuery={setOrderSearchQuery}
          onMarkOrderPreparing={handleMarkOrderPreparing}
          orderActionLoadingId={orderActionLoadingId}
        />
      )}

      {mode === 'manager' ? <AuthorPageFooter active="Store" /> : null}
    </div>
  )
}
