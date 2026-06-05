import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

const DEFAULT_CATEGORIES = ['New Release', 'Best Seller', 'Completed Series', 'Special Edition', 'Author Picks']
const TYPE_FILTERS = ['All', 'Book', 'PDF']
const PRODUCT_STATUSES = ['Draft', 'Active', 'Hidden']
const PAPER_TYPES = ['Normal Paper', 'Premium Paper', 'Matte Cover', 'Glossy Cover']
const BOOK_CONDITIONS = ['New', 'Second Hand']
const PDF_ACCESS_RULES = ['Download after payment', 'Read online only', 'Download and read online']

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
      className="h-11 w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]"
    />
  )
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]"
    >
      {children}
    </select>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-[24px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-solid fa-bag-shopping text-[20px]" />
      </div>
      <h3 className="text-[16px] font-black text-[#111827]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">{text}</p>
    </div>
  )
}

function ProductCard({ product }) {
  const priceText = product.salePrice || product.originalPrice || '0.00'
  const hasDiscount = product.salePrice && product.originalPrice && product.salePrice !== product.originalPrice

  return (
    <div className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="flex h-[96px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#f3f4f6] text-[#9ca3af]">
          {product.coverUrl ? (
            <img src={product.coverUrl} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <i className="fa-regular fa-image text-[22px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-[#111827]">{product.title || 'Untitled product'}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-[#f5f3fa] px-2 py-1 text-[10px] font-black text-[#111827]">{product.type}</span>
                <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#6b7280] ring-1 ring-black/5">{product.status}</span>
              </div>
            </div>
            <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <i className="fa-regular fa-pen-to-square text-[13px]" />
            </button>
          </div>

          <div className="mt-2 text-[13px] font-black text-[#111827]">
            ${priceText}
            {hasDiscount ? <span className="ml-2 text-[11px] font-bold text-[#9ca3af] line-through">${product.originalPrice}</span> : null}
          </div>

          <div className="mt-2 text-[11px] font-bold text-[#8b93a1]">
            {product.type === 'Book' ? `${product.stock || 0} stock • ${product.paperType}` : `${product.pageCount || 0} pages • ${product.accessRule}`}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductForm({ open, onClose, onSave, categories }) {
  const [type, setType] = useState('Book')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0] || 'New Release')
  const [description, setDescription] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [status, setStatus] = useState('Draft')
  const [coverUrl, setCoverUrl] = useState('')
  const [stock, setStock] = useState('')
  const [paperType, setPaperType] = useState('Normal Paper')
  const [condition, setCondition] = useState('New')
  const [deliveryNote, setDeliveryNote] = useState('')
  const [preOrder, setPreOrder] = useState(false)
  const [pdfFileName, setPdfFileName] = useState('')
  const [pageCount, setPageCount] = useState('')
  const [accessRule, setAccessRule] = useState('Download after payment')

  if (!open) return null

  const saveProduct = () => {
    onSave({
      id: `local-${Date.now()}`,
      type,
      title,
      category,
      description,
      originalPrice,
      salePrice,
      status,
      coverUrl,
      stock,
      paperType,
      condition,
      deliveryNote,
      preOrder,
      pdfFileName,
      pageCount,
      accessRule,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 md:items-center">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close add product" />

      <div className="relative max-h-[88vh] w-full overflow-hidden rounded-t-[26px] bg-white shadow-2xl md:max-w-[620px] md:rounded-[26px]">
        <div className="flex items-center justify-between border-b border-[#eef0f4] px-4 py-4">
          <div>
            <h2 className="text-[17px] font-black text-[#111827]">Add Product</h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">Create a book or PDF product.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="max-h-[68vh] space-y-4 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setType('Book')} className={`h-11 rounded-2xl text-[13px] font-black ${type === 'Book' ? 'bg-[#111827] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>Book</button>
            <button type="button" onClick={() => setType('PDF')} className={`h-11 rounded-2xl text-[13px] font-black ${type === 'PDF' ? 'bg-[#111827] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>PDF</button>
          </div>

          <div>
            <FieldLabel>Cover image URL</FieldLabel>
            <TextInput value={coverUrl} onChange={setCoverUrl} placeholder="Paste cover image URL for now" />
          </div>

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
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short product description" className="min-h-[96px] w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 py-3 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]" />
          </div>

          {type === 'Book' ? (
            <>
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
                <SelectInput value={condition} onChange={setCondition}>
                  {BOOK_CONDITIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </SelectInput>
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-black text-[#111827] ring-1 ring-black/5">
                <input type="checkbox" checked={preOrder} onChange={(event) => setPreOrder(event.target.checked)} />
                Pre-order product
              </label>

              <div>
                <FieldLabel>Delivery note</FieldLabel>
                <TextInput value={deliveryNote} onChange={setDeliveryNote} placeholder="Delivery note for buyers" />
              </div>
            </>
          ) : (
            <>
              <div>
                <FieldLabel>PDF file</FieldLabel>
                <input type="file" accept="application/pdf" onChange={(event) => setPdfFileName(event.target.files?.[0]?.name || '')} className="block w-full rounded-2xl border border-[#e5e7eb] bg-white px-3.5 py-3 text-[13px] font-bold text-[#111827]" />
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
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[#eef0f4] p-4">
          <button type="button" onClick={onClose} className="h-12 rounded-full border border-[#e5e7eb] bg-white text-[13px] font-black text-[#111827]">Cancel</button>
          <button type="button" onClick={saveProduct} className="h-12 rounded-full bg-[#111827] text-[13px] font-black text-white">Save Product</button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorStoreManagerPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Products')
  const [activeType, setActiveType] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [categories] = useState(DEFAULT_CATEGORIES)
  const [products, setProducts] = useState([])

  const filteredProducts = useMemo(() => {
    if (activeType === 'All') return products
    return products.filter((product) => product.type === activeType)
  }, [activeType, products])

  const saveProduct = (product) => {
    setProducts((current) => [product, ...current])
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-[92px]">
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate('/author/page')} className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]">
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>
          <div className="text-[16px] font-black text-[#111827]">Store</div>
          <button type="button" onClick={() => setFormOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white">
            <i className="fa-solid fa-plus text-[14px]" />
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-black text-[#111827]">Store Manager</h1>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">Manage paper books, PDFs, categories, and orders.</p>
            </div>
            <button type="button" onClick={() => setFormOpen(true)} className="hidden h-10 rounded-full bg-[#111827] px-4 text-[12px] font-black text-white sm:block">+ Add Product</button>
          </div>

          <div className="mt-4 grid grid-cols-3 rounded-2xl bg-[#f3f4f6] p-1">
            {['Products', 'Categories', 'Orders'].map((tab) => {
              const active = activeTab === tab
              return (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`h-10 rounded-xl text-[12px] font-black ${active ? 'bg-white text-[#111827] shadow-sm' : 'text-[#8b93a1]'}`}>
                  {tab}
                </button>
              )
            })}
          </div>
        </section>

        {activeTab === 'Products' ? (
          <section className="mt-4 space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TYPE_FILTERS.map((type) => {
                const active = activeType === type
                return (
                  <button key={type} type="button" onClick={() => setActiveType(type)} className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${active ? 'bg-[#111827] text-white' : 'bg-white text-[#6b7280] ring-1 ring-black/5'}`}>
                    {type}
                  </button>
                )
              })}
            </div>

            {filteredProducts.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <EmptyState title="No products yet" text="Add a paper book or PDF product. Backend saving will be connected in a later stage." />
            )}
          </section>
        ) : null}

        {activeTab === 'Categories' ? (
          <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-black text-[#111827]">Categories</h2>
              <span className="text-[11px] font-bold text-[#9ca3af]">Editable later</span>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center justify-between rounded-2xl bg-[#f8fafc] px-4 py-3 ring-1 ring-black/5">
                  <span className="text-[13px] font-black text-[#111827]">{category}</span>
                  <i className="fa-solid fa-grip-lines text-[#9ca3af]" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'Orders' ? (
          <section className="mt-4">
            <EmptyState title="No orders yet" text="Orders for paper books and PDF products will appear here after checkout is connected." />
          </section>
        ) : null}
      </main>

      <ProductForm open={formOpen} onClose={() => setFormOpen(false)} onSave={saveProduct} categories={categories} />

      <AuthorPageFooter active="Store" />
    </div>
  )
}
