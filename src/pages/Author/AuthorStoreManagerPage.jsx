import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DEFAULT_CATEGORIES = ['New Books', 'Second Hand', 'Best Seller', 'PDF Books', 'Pre-order', 'Author Picks', 'New Release']
const TYPE_FILTERS = ['All', 'Book', 'PDF', 'Active', 'Draft']
const PAPER_TYPES = ['Normal Paper', 'Premium Paper', 'Matte Cover', 'Glossy Cover']
const BOOK_CONDITIONS = ['New', 'Second Hand']
const PDF_ACCESS_RULES = ['Download after payment', 'Read online only', 'Download and read online']

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
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
    category: product.category || 'New Books',
    description: product.description || '',
    originalPrice: String(product.original_price || ''),
    salePrice: String(product.sale_price || ''),
    status: product.status === 'active' ? 'Active' : product.status === 'hidden' ? 'Hidden' : 'Draft',
    coverUrl: product.cover_url || '',
    stock: String(product.stock_quantity || ''),
    paperType: product.paper_type || 'Normal Paper',
    condition: product.book_condition || 'New',
    qualityPercent: product.quality_percent ? String(product.quality_percent) : '',
    deliveryNote: product.delivery_note || '',
    preOrder: Boolean(product.pre_order),
    pdfFileName: product.pdf_file_name || '',
    pageCount: String(product.page_count || ''),
    accessRule: product.access_rule || 'Download after payment',
    createdAt: product.created_at,
  }
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
      category: product.category,
      description: product.description,
      original_price: product.originalPrice,
      sale_price: product.salePrice,
      status: statusToApi(product.status),
      cover_url: product.coverUrl,
      stock_quantity: product.stock,
      paper_type: product.paperType,
      book_condition: product.condition,
      quality_percent: product.qualityPercent,
      delivery_note: product.deliveryNote,
      pre_order: product.preOrder,
      pdf_file_name: product.pdfFileName,
      page_count: product.pageCount,
      access_rule: product.accessRule,
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
      category: product.category,
      description: product.description,
      original_price: product.originalPrice,
      sale_price: product.salePrice,
      status: statusToApi(product.status),
      cover_url: product.coverUrl,
      stock_quantity: product.stock,
      paper_type: product.paperType,
      book_condition: product.condition,
      quality_percent: product.qualityPercent,
      delivery_note: product.deliveryNote,
      pre_order: product.preOrder,
      pdf_file_name: product.pdfFileName,
      page_count: product.pageCount,
      access_rule: product.accessRule,
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
  return <div className="mb-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#374151]">{children}</div>
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]"
    />
  )
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]"
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
      <div className="mb-3 text-[11px] font-black uppercase tracking-[0.09em] text-[#111827]">{title}</div>
    </div>
  )
}

function EmptyState({ onAddProduct }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="bg-gradient-to-br from-[#f8f7ff] via-white to-[#fff8e6] px-5 py-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
          <i className="fa-solid fa-store text-[22px]" />
        </div>
        <h3 className="text-[18px] font-black text-[#111827]">Start selling from your author page</h3>
        <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
          Add paper books, PDFs, or pre-orders so readers can discover products from your page.
        </p>
        <button
          type="button"
          onClick={onAddProduct}
          className="mt-5 h-12 rounded-full bg-[#111827] px-6 text-[13px] font-black text-white shadow-sm active:scale-[0.98]"
        >
          Add your first product
        </button>
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
  const priceText = product.salePrice || product.originalPrice || '0.00'
  const hasDiscount = product.salePrice && product.originalPrice && product.salePrice !== product.originalPrice
  const isActive = product.status === 'Active'
  const isDraft = product.status === 'Draft'

  return (
    <article className="border-b border-[#eef0f4] px-0 py-3 last:border-b-0">
  <div className="flex gap-3">
        <div className="h-[86px] w-[64px] shrink-0 overflow-hidden rounded-[12px] bg-[#f3f4f6] ring-1 ring-black/5">
          {product.coverUrl ? (
            <img src={product.coverUrl} alt={product.title} className="h-full w-full object-cover" />
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
              <p className="mt-0.5 text-[10px] font-bold text-[#8b93a1]">ID: {product.id}</p>
            </div>

            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="h-8 rounded-xl bg-[#fff4cc] px-3 text-[11px] font-black text-[#111827] active:scale-95"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="h-8 rounded-xl bg-[#fff1f1] px-3 text-[11px] font-black text-[#e5484d] active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#6b7280] ring-1 ring-black/5">
              {product.category}
            </span>
            <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#111827] ring-1 ring-black/5">
              {product.type}
            </span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${
              isActive
                ? 'bg-[#ecfdf3] text-[#027a48]'
                : isDraft
                  ? 'bg-[#f5f3ff] text-[#6b5cff]'
                  : 'bg-[#f3f4f6] text-[#6b7280]'
            }`}>
              {product.status}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-[#6b7280]">
            <span className="font-black text-[#111827]">${priceText}</span>
            {hasDiscount ? <span className="line-through">${product.originalPrice}</span> : null}
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

async function updateStoreCategory(categoryId, name) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
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
    <div className="rounded-[18px] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[18px] font-black text-[#111827]">{value}</div>
          <div className="mt-0.5 text-[11px] font-semibold text-[#8b93a1]">{label}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
          <i className={`fa-solid ${icon} text-[13px]`} />
        </div>
      </div>
    </div>
  )
}

function StoreManagerHome({
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
  moveCategory,
  saveCategoryOrder,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  loading,
  localError,
}) {
  const [recordQuery, setRecordQuery] = useState('')

 const visibleRecords = useMemo(() => {
  const query = recordQuery.trim().toLowerCase()
  const records = filteredProducts.filter((product) => {
    if (activeType === 'Active') return product.status === 'Active'
    if (activeType === 'Draft') return product.status === 'Draft'
    return true
  })

  if (!query) return records

  return records.filter((product) => {
    return (
      product.title.toLowerCase().includes(query) ||
      String(product.id).toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.status.toLowerCase().includes(query) ||
      product.type.toLowerCase().includes(query)
    )
  })
}, [filteredProducts, recordQuery, activeType])

  return (
    <main className="mx-auto max-w-[980px] px-4 py-4">
      <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div>
          <h1 className="text-[21px] font-black leading-6 text-[#111827]">Store Manager</h1>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
            Sell books, PDFs, and pre-orders from your author page.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
  <StatCard label="Orders" value="0" icon="fa-receipt" />
  <StatCard label="Revenue" value="$0" icon="fa-chart-line" />
</div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {['Records', 'Orders', 'Settings'].map((tab) => {
            const active = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-9 shrink-0 rounded-full px-4 text-[12px] font-semibold transition active:scale-[0.98] ${
                  active
                    ? 'bg-[#f3f4f6] text-[#111827] shadow-sm'
                    : 'bg-transparent text-[#8b93a1]'
                }`}
              >
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
        <section className="mt-4 rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="border-b border-[#eef0f4] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-black text-[#111827]">Book Records</h2>
                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
                  Search, filter, and manage your author store products.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[11px] font-black text-[#111827]">
                {products.length} products
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#9ca3af]" />
                <input
                  type="search"
                  value={recordQuery}
                  onChange={(event) => setRecordQuery(event.target.value)}
                  placeholder="Search title, category, product ID..."
                  className="h-11 w-full rounded-2xl border border-[#d9e1ec] bg-white pl-9 pr-3 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {TYPE_FILTERS.map((type) => {
                  const active = activeType === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveType(type)}
                      className={`h-10 shrink-0 rounded-full px-4 text-[12px] font-black ${
                        active
                          ? 'bg-[#fff4cc] text-[#111827] ring-1 ring-[#f6b800]/35'
                          : 'bg-[#f8fafc] text-[#6b7280] ring-1 ring-black/5'
                      }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="px-4 py-2">
  {loading ? (
    <div className="rounded-[18px] bg-[#f8fafc] p-8 text-center text-[13px] font-bold text-[#8b93a1] ring-1 ring-black/5">
      Loading products...
    </div>
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
    <EmptyState onAddProduct={onAddProduct} />
  )}
</div>
        </section>
      ) : null}

{activeTab === 'Settings' ? (
  <section className="mt-4 space-y-3">
    <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <h2 className="text-[16px] font-black text-[#111827]">Create category</h2>
      <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
        New categories can become sections in the public Store tab.
      </p>
      <div className="mt-3 flex gap-2">
        <TextInput value={newCategory} onChange={setNewCategory} placeholder="Category name" />
        <button
          type="button"
          onClick={addCategory}
          disabled={categorySaving}
          className="h-11 shrink-0 rounded-2xl bg-[#111827] px-4 text-[12px] font-black text-white disabled:opacity-60"
        >
          Add
        </button>
      </div>
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
        {(storeCategories.length ? storeCategories : categories.map((name, index) => ({
          id: `local-${index}`,
          name,
        }))).map((category, index, list) => {
          const editing = editingCategoryId === category.id

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
                    <span className="truncate text-[13px] font-black text-[#111827]">
                      {category.name}
                    </span>
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
                  <>
                    <button
                      type="button"
                      onClick={() => startEditCategory(category)}
                      disabled={category.id.startsWith('local-')}
                      className="h-8 rounded-xl bg-[#fff4cc] px-3 text-[11px] font-black text-[#111827] disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      disabled={category.id.startsWith('local-')}
                      className="h-8 rounded-xl bg-[#fff1f1] px-3 text-[11px] font-black text-[#e5484d] disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
) : null}

      {activeTab === 'Orders' ? (
        <section className="mt-4">
          <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <i className="fa-solid fa-receipt text-[22px]" />
            </div>
            <h3 className="text-[17px] font-black text-[#111827]">No orders yet</h3>
            <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
              Orders for paper books and PDF products will appear here after checkout is connected.
            </p>
          </div>
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
  const [category, setCategory] = useState(productToEdit?.category || categories[0] || 'New Books')
  const [authorName, setAuthorName] = useState('')
  const [publisher, setPublisher] = useState('')
  const [novelType, setNovelType] = useState('Khmer')
  const [coverType, setCoverType] = useState('Paperback')
  const [sortOrder, setSortOrder] = useState('0')
  const [bestSeller, setBestSeller] = useState(false)
  const [discount, setDiscount] = useState(false)
  const [description, setDescription] = useState(productToEdit?.description || '')
  const [originalPrice, setOriginalPrice] = useState(productToEdit?.originalPrice || '')
  const [salePrice, setSalePrice] = useState(productToEdit?.salePrice || '')
  const [active, setActive] = useState(productToEdit ? productToEdit.status === 'Active' : true)
  const [coverFile, setCoverFile] = useState(null)
  const [coverFileName, setCoverFileName] = useState('')
  const [coverPreview, setCoverPreview] = useState(productToEdit?.coverUrl || '')
  const [galleryImages, setGalleryImages] = useState([null, null, null, null, null])
  const [stock, setStock] = useState(productToEdit?.stock || '')
  const [paperType, setPaperType] = useState(productToEdit?.paperType || 'Normal Paper')
  const [condition, setCondition] = useState(productToEdit?.condition || 'New')
  const [qualityPercent, setQualityPercent] = useState(productToEdit?.qualityPercent || '')
  const [deliveryNote, setDeliveryNote] = useState(productToEdit?.deliveryNote || '')
  const [genre, setGenre] = useState('')
  const [preOrder, setPreOrder] = useState(Boolean(productToEdit?.preOrder))
  const [pdfFileName, setPdfFileName] = useState(productToEdit?.pdfFileName || '')
  const [pageCount, setPageCount] = useState(productToEdit?.pageCount || '')
  const [accessRule, setAccessRule] = useState(productToEdit?.accessRule || 'Download after payment')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

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

      if (next[index]?.url) {
        URL.revokeObjectURL(next[index].url)
      }

      next[index] = {
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      }

      return next
    })

    setFormError('')
  }

  const removeGalleryImage = (index) => {
    setGalleryImages((current) => {
      const next = [...current]

      if (next[index]?.url) {
        URL.revokeObjectURL(next[index].url)
      }

      next[index] = null
      return next
    })

    if (galleryInputRefs.current[index]) {
      galleryInputRefs.current[index].value = ''
    }
  }

  const saveProduct = async () => {
    const qualityNumber = Number(qualityPercent)

    if (saving) return

   if (!coverFile && !coverPreview) {
  setFormError('Book cover is required.')
  return
}

    if (!title.trim()) {
      setFormError('Book title is required.')
      return
    }

    if (type === 'Book' && condition === 'Second Hand' && (!qualityPercent || Number.isNaN(qualityNumber) || qualityNumber < 1 || qualityNumber > 100)) {
      setFormError('Book quality must be between 1% and 100%.')
      return
    }

    try {
      setSaving(true)
    setFormError(coverFile ? 'Uploading cover to Cloudflare...' : 'Saving product...')

const coverUrl = coverFile ? await uploadCoverImage(coverFile) : coverPreview

setFormError(productToEdit ? 'Updating product...' : 'Creating product...')

      await onSave({
        type,
        title: title.trim(),
        category,
        description,
        originalPrice,
        salePrice,
        status: active ? 'Active' : 'Draft',
        coverUrl,
        stock,
        paperType,
        condition,
        qualityPercent: condition === 'Second Hand' ? qualityPercent : '',
        deliveryNote,
        preOrder,
        pdfFileName,
        pageCount,
        accessRule,
      })
    } catch (error) {
      setFormError(error.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-4 pb-28">
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
  <FieldLabel>Book title</FieldLabel>
  <TextInput value={title} onChange={setTitle} placeholder="Enter book title" />
</div>

<div className="grid gap-3 sm:grid-cols-2">
  <div>
    <FieldLabel>Author name</FieldLabel>
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
    <TextInput value={novelType} onChange={setNovelType} placeholder="Khmer" />
  </div>

  <div>
    <FieldLabel>Category</FieldLabel>
    <SelectInput value={category} onChange={setCategory}>
      {categories.map((item) => <option key={item} value={item}>{item}</option>)}
    </SelectInput>
  </div>
</div>

<div className="grid gap-3 sm:grid-cols-2">
  <div>
    <FieldLabel>Genre</FieldLabel>
    <TextInput value={genre} onChange={setGenre} placeholder="Romance, fantasy, mystery..." />
  </div>

  <div>
    <FieldLabel>Availability / Stock status</FieldLabel>
    <SelectInput value={condition} onChange={setCondition}>
      {BOOK_CONDITIONS.map((item) => <option key={item} value={item}>{item}</option>)}
    </SelectInput>
  </div>
</div>

<div className="grid gap-3 sm:grid-cols-2">
  <div>
    <FieldLabel>Paper type</FieldLabel>
    <SelectInput value={paperType} onChange={setPaperType}>
      {PAPER_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
    </SelectInput>
  </div>

  <div>
    <FieldLabel>Cover type</FieldLabel>
    <TextInput value={coverType} onChange={setCoverType} placeholder="Paperback" />
  </div>
</div>

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
              <FieldLabel>Sale price</FieldLabel>
              <TextInput value={salePrice} onChange={setSalePrice} placeholder="Example: 8.75" type="number" />
            </div>
            <div>
              <FieldLabel>Original price</FieldLabel>
              <TextInput value={originalPrice} onChange={setOriginalPrice} placeholder="Leave empty if no discount" type="number" />
            </div>
          </div>

          {type === 'Book' ? (
            <div className="grid gap-3 sm:grid-cols-2">
             <div>
  <FieldLabel>Sort order</FieldLabel>
  <TextInput value={sortOrder} onChange={setSortOrder} placeholder="0" type="number" />
</div>
<div>
  <FieldLabel>&nbsp;</FieldLabel>
  <label className="flex h-11 items-center gap-2 rounded-2xl border border-[#d9e1ec] bg-white px-3.5 text-[13px] font-bold text-[#111827]">
    <input type="checkbox" checked={preOrder} onChange={(event) => setPreOrder(event.target.checked)} />
    Pre-order product
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
                  onChange={(event) => setPdfFileName(event.target.files?.[0]?.name || '')}
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

<div className="grid gap-3 sm:grid-cols-3">
  <label className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-black text-[#111827] ring-1 ring-black/5">
    <input type="checkbox" checked={bestSeller} onChange={(event) => setBestSeller(event.target.checked)} />
    Best seller
  </label>

  <label className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-black text-[#111827] ring-1 ring-black/5">
    <input type="checkbox" checked={discount} onChange={(event) => setDiscount(event.target.checked)} />
    Discount
  </label>

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

    const updatedCategory = await updateStoreCategory(category.id, name)

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
    const savedProduct = editingProduct?.id
      ? await updateStoreProduct(editingProduct.id, product)
      : await createStoreProduct(product)

    if (savedProduct) {
      setProducts((current) => {
        if (editingProduct?.id) {
          return current.map((item) => (item.id === savedProduct.id ? savedProduct : item))
        }

        return [savedProduct, ...current]
      })

      if (savedProduct.category && !categories.includes(savedProduct.category)) {
        setCategories((current) => [...current, savedProduct.category])
      }
    }

    setEditingProduct(null)
    setMode('manager')
    setActiveTab('Records')
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
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => {
              if (mode === 'form') {
                closeProductForm()
                return
              }

              navigate('/author/page')
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
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
moveCategory={moveCategory}
saveCategoryOrder={saveCategoryOrder}
        />
      )}

      {mode === 'manager' ? <AuthorPageFooter active="Store" /> : null}
    </div>
  )
}

