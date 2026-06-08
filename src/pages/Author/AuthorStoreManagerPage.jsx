import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DEFAULT_CATEGORIES = ['New Release', 'Best Seller', 'Completed Series', 'Special Edition', 'Author Picks']
const TYPE_FILTERS = ['All', 'Book', 'PDF']
const PRODUCT_STATUSES = ['Draft', 'Active', 'Hidden']
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
    category: product.category || 'New Release',
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
    throw new Error(data.message || 'Failed to save product')
  }

  return data.product ? formatProductForUi(data.product) : null
}

function FieldLabel({ children }) {
  return <div className="mb-1.5 text-[12px] font-black text-[#374151]">{children}</div>
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 text-[13px] font-bold text-[#111827] outline-none focus:border-[#7c5cff]"
    />
  )
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 text-[13px] font-bold text-[#111827] outline-none focus:border-[#7c5cff]"
    >
      {children}
    </select>
  )
}

function SectionCard({ title, text, children }) {
  return (
    <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-4">
        <h2 className="text-[17px] font-black text-[#111827]">{title}</h2>
        {text ? <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">{text}</p> : null}
      </div>
      {children}
    </section>
  )
}

function EmptyState({ onAddProduct }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="bg-gradient-to-br from-[#f8f7ff] via-white to-[#fff8e6] px-5 py-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#7c5cff] shadow-sm ring-1 ring-black/5">
          <i className="fa-solid fa-store text-[22px]" />
        </div>
        <h3 className="text-[18px] font-black text-[#111827]">Start selling from your author page</h3>
        <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
          Add paper books, PDFs, or pre-orders so readers can discover products from your page.
        </p>
        <button
          type="button"
          onClick={onAddProduct}
          className="mt-5 h-12 rounded-full bg-[#7c5cff] px-6 text-[13px] font-black text-white shadow-sm active:scale-[0.98]"
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
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#7c5cff] shadow-lg ring-1 ring-black/5 active:scale-95"
        >
          <i className="fa-solid fa-bag-shopping text-[13px]" />
        </button>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[38px] text-[14px] font-black leading-5 text-[#111827]">{product.title || 'Untitled product'}</h3>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#6b7280] ring-1 ring-black/5">{product.category}</span>
          <span className="rounded-full bg-[#f5f3ff] px-2 py-1 text-[10px] font-black text-[#7c5cff]">{product.status}</span>
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
  newCategory,
  setNewCategory,
  addCategory,
  onAddProduct,
  loading,
  localError,
}) {
  return (
    <main className="mx-auto max-w-[980px] px-4 py-4">
      <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h1 className="text-[21px] font-black leading-6 text-[#111827]">Store Manager</h1>
      <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
        Sell books, PDFs, and pre-orders from your author page.
      </p>
    </div>

    <button
      type="button"
      onClick={onAddProduct}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm active:scale-[0.98]"
      aria-label="Add product"
    >
      <i className="fa-solid fa-plus text-[14px]" />
    </button>
  </div>

  <div className="mt-4 grid grid-cols-3 gap-2">
    <StatCard label="Products" value={products.length} icon="fa-box" />
    <StatCard label="Orders" value="0" icon="fa-receipt" />
    <StatCard label="Revenue" value="$0" icon="fa-chart-line" />
  </div>

  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
    {['Products', 'Categories', 'Orders'].map((tab) => {
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

      {activeTab === 'Products' ? (
        <section className="mt-4 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TYPE_FILTERS.map((type) => {
              const active = activeType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${
                    active
                      ? 'bg-[#fff4cc] text-[#111827] ring-1 ring-[#f6b800]/35'
                      : 'bg-white text-[#6b7280] ring-1 ring-black/5'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-white p-8 text-center text-[13px] font-bold text-[#8b93a1] shadow-sm ring-1 ring-black/5">
              Loading products...
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <EmptyState onAddProduct={onAddProduct} />
          )}
        </section>
      ) : null}

      {activeTab === 'Categories' ? (
        <section className="mt-4 space-y-3">
          <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <h2 className="text-[16px] font-black text-[#111827]">Create category</h2>
            <div className="mt-3 flex gap-2">
              <TextInput value={newCategory} onChange={setNewCategory} placeholder="Category name" />
              <button type="button" onClick={addCategory} className="h-11 shrink-0 rounded-2xl bg-[#7c5cff] px-4 text-[12px] font-black text-white">
                Add
              </button>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-black text-[#111827]">Categories</h2>
              <span className="text-[11px] font-bold text-[#9ca3af]">Product categories</span>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center justify-between rounded-2xl bg-[#f8fafc] px-4 py-3 ring-1 ring-black/5">
                  <span className="text-[13px] font-black text-[#111827]">{category}</span>
                  <i className="fa-solid fa-grip-lines text-[#9ca3af]" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'Orders' ? (
        <section className="mt-4">
          <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3ff] text-[#7c5cff]">
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

function AddProductPage({ categories, onBack, onSave }) {
  const fileInputRef = useRef(null)
  const [type, setType] = useState('Book')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0] || 'New Release')
  const [description, setDescription] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [status, setStatus] = useState('Draft')
  const [coverFile, setCoverFile] = useState(null)
  const [coverFileName, setCoverFileName] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [stock, setStock] = useState('')
  const [paperType, setPaperType] = useState('Normal Paper')
  const [condition, setCondition] = useState('New')
  const [qualityPercent, setQualityPercent] = useState('')
  const [deliveryNote, setDeliveryNote] = useState('')
  const [preOrder, setPreOrder] = useState(false)
  const [pdfFileName, setPdfFileName] = useState('')
  const [pageCount, setPageCount] = useState('')
  const [accessRule, setAccessRule] = useState('Download after payment')
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

  const saveProduct = async () => {
    const qualityNumber = Number(qualityPercent)

    if (saving) return

    if (!coverFile) {
      setFormError('Product cover is required.')
      return
    }

    if (!title.trim()) {
      setFormError('Product title is required.')
      return
    }

    if (type === 'Book' && condition === 'Second Hand' && (!qualityPercent || Number.isNaN(qualityNumber) || qualityNumber < 1 || qualityNumber > 100)) {
      setFormError('Book quality must be between 1% and 100%.')
      return
    }

    try {
      setSaving(true)
      setFormError('Uploading cover to Cloudflare...')

      const coverUrl = await uploadCoverImage(coverFile)

      setFormError('Saving product...')

      await onSave({
        type,
        title: title.trim(),
        category,
        description,
        originalPrice,
        salePrice,
        status,
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
      setFormError(error.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-[980px] px-4 py-4 pb-28">
      <SectionCard title="Product cover" text="Upload 1 vertical cover image. This image will be saved to Cloudflare R2.">
        <div className="flex flex-col items-center">
          <div className="aspect-[3/4] w-[168px] overflow-hidden rounded-[24px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] shadow-inner sm:w-[210px]">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center px-5 text-center text-[#9ca3af]">
                <i className="fa-regular fa-image mb-3 text-[28px]" />
                <span className="text-[12px] font-black">Main Cover Preview</span>
                <span className="mt-1 text-[11px] font-bold">2:3 vertical</span>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={(event) => selectCover(event.target.files?.[0])} className="hidden" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 h-11 w-full max-w-[360px] rounded-2xl border border-dashed border-[#b8c2d6] bg-white text-[12px] font-black text-[#111827] active:scale-[0.98]"
          >
            {coverPreview ? 'Choose or replace main cover' : 'Choose main cover'}
          </button>

          {coverPreview ? (
            <button
              type="button"
              onClick={removeCover}
              className="mt-2 h-10 w-full max-w-[360px] rounded-2xl bg-[#fff1f1] text-[12px] font-black text-[#e5484d] active:scale-[0.98]"
            >
              Remove cover
            </button>
          ) : null}

          {coverFileName ? <p className="mt-2 max-w-[360px] truncate text-center text-[11px] font-bold text-[#8b93a1]">{coverFileName}</p> : null}
        </div>
      </SectionCard>

      <section className="mt-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <h1 className="text-[22px] font-black text-[#111827]">Add Product</h1>
        <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">Create a book or PDF product for your author store.</p>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#f3f4f6] p-1">
          <button
            type="button"
            onClick={() => setType('Book')}
            className={`h-11 rounded-xl text-[13px] font-black ${type === 'Book' ? 'bg-white text-[#7c5cff] shadow-sm' : 'text-[#6b7280]'}`}
          >
            Book
          </button>
          <button
            type="button"
            onClick={() => setType('PDF')}
            className={`h-11 rounded-xl text-[13px] font-black ${type === 'PDF' ? 'bg-white text-[#7c5cff] shadow-sm' : 'text-[#6b7280]'}`}
          >
            PDF
          </button>
        </div>
      </section>

      <section className="mt-4 space-y-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <h2 className="text-[16px] font-black text-[#111827]">Product information</h2>

        <div>
          <FieldLabel>Title</FieldLabel>
          <TextInput value={title} onChange={setTitle} placeholder="Product title" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Category</FieldLabel>
            <SelectInput value={category} onChange={setCategory}>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <SelectInput value={status} onChange={setStatus}>
              {PRODUCT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectInput>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Original price</FieldLabel>
            <TextInput value={originalPrice} onChange={setOriginalPrice} placeholder="5.00" type="number" />
          </div>
          <div>
            <FieldLabel>Sale price</FieldLabel>
            <TextInput value={salePrice} onChange={setSalePrice} placeholder="3.99" type="number" />
          </div>
        </div>

        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short product description"
            className="min-h-[110px] w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 py-3 text-[13px] font-bold text-[#111827] outline-none focus:border-[#7c5cff]"
          />
        </div>
      </section>

      {type === 'Book' ? (
        <section className="mt-4 space-y-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="text-[16px] font-black text-[#111827]">Book details</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Stock quantity</FieldLabel>
              <TextInput value={stock} onChange={setStock} placeholder="10" type="number" />
            </div>
            <div>
              <FieldLabel>Paper type</FieldLabel>
              <SelectInput value={paperType} onChange={setPaperType}>
                {PAPER_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
              </SelectInput>
            </div>
          </div>

          <div>
            <FieldLabel>Book condition</FieldLabel>
            <SelectInput
              value={condition}
              onChange={(value) => {
                setCondition(value)
                setFormError('')
                if (value !== 'Second Hand') setQualityPercent('')
              }}
            >
              {BOOK_CONDITIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectInput>
          </div>

          {condition === 'Second Hand' ? (
            <div>
              <FieldLabel>Book quality percentage</FieldLabel>
              <TextInput value={qualityPercent} onChange={setQualityPercent} placeholder="Example: 85" type="number" />
              <p className="mt-1.5 text-[11px] font-bold text-[#8b93a1]">Enter the estimated book quality from 1% to 100%.</p>
            </div>
          ) : null}

          <label className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-black text-[#111827] ring-1 ring-black/5">
            <input type="checkbox" checked={preOrder} onChange={(event) => setPreOrder(event.target.checked)} />
            Pre-order product
          </label>

          <div>
            <FieldLabel>Delivery note</FieldLabel>
            <TextInput value={deliveryNote} onChange={setDeliveryNote} placeholder="Delivery note for buyers" />
          </div>
        </section>
      ) : (
        <section className="mt-4 space-y-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="text-[16px] font-black text-[#111827]">PDF details</h2>

          <div>
            <FieldLabel>PDF file</FieldLabel>
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => setPdfFileName(event.target.files?.[0]?.name || '')}
              className="block w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 py-3 text-[13px] font-bold text-[#111827]"
            />
            {pdfFileName ? <div className="mt-2 text-[11px] font-bold text-[#6b7280]">{pdfFileName}</div> : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Page count</FieldLabel>
              <TextInput value={pageCount} onChange={setPageCount} placeholder="120" type="number" />
            </div>
            <div>
              <FieldLabel>Access rule</FieldLabel>
              <SelectInput value={accessRule} onChange={setAccessRule}>
                {PDF_ACCESS_RULES.map((item) => <option key={item} value={item}>{item}</option>)}
              </SelectInput>
            </div>
          </div>
        </section>
      )}

      {formError ? <p className="mt-4 rounded-2xl bg-[#fff7ed] px-4 py-3 text-[12px] font-black text-[#9a3412]">{formError}</p> : null}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#eef0f4] bg-white/95 p-3 shadow-xl backdrop-blur">
        <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-3">
          <button type="button" onClick={onBack} className="h-12 rounded-full border border-[#e5e7eb] bg-white text-[13px] font-black text-[#111827]">
            Cancel
          </button>
          <button type="button" disabled={saving} onClick={saveProduct} className="h-12 rounded-full bg-[#7c5cff] text-[13px] font-black text-white disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function AuthorStoreManagerPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('manager')
  const [activeTab, setActiveTab] = useState('Products')
  const [activeType, setActiveType] = useState('All')
  const [newCategory, setNewCategory] = useState('')
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const filteredProducts = useMemo(() => {
    if (activeType === 'All') return products
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

  const addCategory = () => {
    const name = newCategory.trim()

    if (!name) return

    if (categories.some((item) => item.toLowerCase() === name.toLowerCase())) {
      setNewCategory('')
      return
    }

    setCategories((current) => [...current, name])
    setNewCategory('')
  }

  const saveProduct = async (product) => {
    const savedProduct = await createStoreProduct(product)

    if (savedProduct) {
      setProducts((current) => [savedProduct, ...current])
      if (savedProduct.category && !categories.includes(savedProduct.category)) {
        setCategories((current) => [...current, savedProduct.category])
      }
    }

    setMode('manager')
    setActiveTab('Products')
  }

  return (
    <div className={`min-h-screen bg-[#f3f4f6] ${mode === 'form' ? 'pb-0' : 'pb-[92px]'}`}>
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => (mode === 'form' ? setMode('manager') : navigate('/author/page'))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>
          <div className="text-[16px] font-black text-[#111827]">{mode === 'form' ? 'Add Product' : 'Store'}</div>
          <button
            type="button"
            onClick={() => setMode('form')}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#7c5cff] text-white shadow-sm ${mode === 'form' ? 'invisible' : ''}`}
          >
            <i className="fa-solid fa-plus text-[14px]" />
          </button>
        </div>
      </div>

      {mode === 'form' ? (
        <AddProductPage categories={categories} onBack={() => setMode('manager')} onSave={saveProduct} />
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
          onAddProduct={() => setMode('form')}
          loading={loading}
          localError={localError}
        />
      )}

      {mode === 'manager' ? <AuthorPageFooter active="Store" /> : null}
    </div>
  )
}
