import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const FALLBACK_PAYWAY_LINK = 'https://link.payway.com.kh/ABAPAYnw446278Y'

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

const DELIVERY_COMPANIES = [
  {
    id: 'jnt',
    name: 'J&T',
    label: 'J&T Express',
    fee: 2,
    logo: '/assets/Icons/J&T.svg',
  },
  {
    id: 'vet',
    name: 'VET',
    label: 'Vireak Buntham Express',
    fee: 2,
    logo: '/assets/Icons/VET.svg',
  },
]

function getCartItems() {
  try {
    const raw = localStorage.getItem('shadow_author_cart_items') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCartItems(items) {
  localStorage.setItem('shadow_author_cart_items', JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
}

function getBuyerProfile() {
  try {
    const raw = localStorage.getItem('shadow_mall_buyer_profile') || '{}'
    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') return {}

    return {
      name: parsed.name || '',
      phone_number: parsed.phone_number || parsed.phone || '',
      telegram_username: parsed.telegram_username || parsed.telegram || '',
      facebook_link: parsed.facebook_link || parsed.facebook || '',
      delivery_address: parsed.delivery_address || parsed.address || '',
      delivery_note: parsed.delivery_note || '',
      province_city: parsed.province_city || 'Phnom Penh',
    }
  } catch {
    return {}
  }
}

function saveBuyerProfile(profile) {
  localStorage.setItem('shadow_mall_buyer_profile', JSON.stringify(profile))
}
function getReaderUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function money(value) {
  const number = Number(value || 0)
  return `$${number.toFixed(2)}`
}

function createOrderId() {
  return `AOH${Date.now().toString(36).toUpperCase()}`
}

function saveAuthorOrder({ items, subtotal, deliveryFee, deliveryCompany, deliveryNote, buyerProfile }) {
  const firstItem = Array.isArray(items) ? items[0] || {} : {}
  const rawOrders = localStorage.getItem('shadow_author_order_history') || '[]'
  const orders = JSON.parse(rawOrders)
  const safeOrders = Array.isArray(orders) ? orders : []

  const nextOrder = {
    order_id: createOrderId(),
    transaction_id: '',
    status: 'waiting',
    created_at: new Date().toISOString(),
    source: 'author_store',
    author_page_id: firstItem.author_page_id || '',
    author_page_name: firstItem.author_page_name || '',
    author_page_username: firstItem.author_page_username || '',
    items,
    subtotal,
    delivery_fee: deliveryFee,
    total: Number(subtotal || 0) + Number(deliveryFee || 0),
    delivery: deliveryCompany?.name || '',
    delivery_company: deliveryCompany || null,
    delivery_note: deliveryNote || '',
    buyer_profile: buyerProfile || {},
  }

  localStorage.setItem('shadow_author_order_history', JSON.stringify([nextOrder, ...safeOrders]))
  return nextOrder
}

function BuyerProfileSheet({ open, profile, onClose, onSave }) {
  const readerUser = getReaderUser()
   const [name, setName] = useState(profile.name || readerUser?.name || '')
  const [phone, setPhone] = useState(profile.phone_number || '')
  const [telegram, setTelegram] = useState(profile.telegram_username || '')
  const [facebook, setFacebook] = useState(profile.facebook_link || '')
 const [address, setAddress] = useState(profile.delivery_address || profile.address || '')
  const [error, setError] = useState('')

  if (!open) return null

  function handleSave() {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Name, phone number, and delivery address are required.')
      return
    }

    const nextProfile = {
  name: name.trim(),
  phone_number: phone.trim(),
  telegram_username: telegram.trim(),
  facebook_link: facebook.trim(),
  delivery_address: address.trim(),
  delivery_note: profile.delivery_note || '',
  province_city: profile.province_city || 'Phnom Penh',
}

    saveBuyerProfile(nextProfile)
    onSave(nextProfile)
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/35">
      <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:left-1/2 sm:max-w-[430px] sm:-translate-x-1/2">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#eef0f4] bg-white px-5 py-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827]">Buyer Profile</h2>
            <p className="mt-1 text-[11px] font-semibold text-[#8b93a1]">Required for printed book delivery.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] active:scale-95">
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="space-y-4 px-5 pb-5 pt-4">
          {error ? (
            <button type="button" onClick={() => setError('')} className="w-full rounded-2xl bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]">
              {error}
            </button>
          ) : null}

          <div>
            <label className="mb-2 block text-[12px] font-black text-[#111827]">Name <span className="text-[#e5484d]">*</span></label>
            <input value={name} onChange={(event) => setName(event.target.value)} className="h-12 w-full rounded-2xl border border-[#d9e1ec] bg-[#f8fafc] px-4 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]" />
            <p className="mt-2 text-[10px] font-semibold text-[#8b93a1]">Name comes from your reader account. To change it, update your main profile.</p>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[#111827]">Phone Number <span className="text-[#e5484d]">*</span></label>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-12 w-full rounded-2xl border border-[#d9e1ec] bg-[#f8fafc] px-4 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]" />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[#111827]">Telegram Username</label>
            <input value={telegram} onChange={(event) => setTelegram(event.target.value)} placeholder="@username" className="h-12 w-full rounded-2xl border border-[#d9e1ec] bg-[#f8fafc] px-4 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]" />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[#111827]">Facebook Link</label>
            <input value={facebook} onChange={(event) => setFacebook(event.target.value)} placeholder="https://facebook.com/..." className="h-12 w-full rounded-2xl border border-[#d9e1ec] bg-[#f8fafc] px-4 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827]" />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[#111827]">Delivery Address <span className="text-[#e5484d]">*</span></label>
            <textarea value={address} onChange={(event) => setAddress(event.target.value)} className="min-h-[96px] w-full rounded-2xl border border-[#d9e1ec] bg-[#f8fafc] px-4 py-3 text-[13px] font-bold leading-6 text-[#111827] outline-none focus:border-[#111827]" />
          </div>

          <button type="button" onClick={handleSave} className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white shadow-xl active:scale-[0.98]">
            Save Information
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorCheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(getCartItems)
  const [buyerProfile, setBuyerProfile] = useState(getBuyerProfile)
  const [buyerOpen, setBuyerOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState(DELIVERY_COMPANIES[0].id)
  const [deliveryNote, setDeliveryNote] = useState(() => getBuyerProfile().delivery_note || '')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedCompany = DELIVERY_COMPANIES.find((company) => company.id === selectedCompanyId) || DELIVERY_COMPANIES[0]
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.price_value || 0) * Number(item.quantity || 1), 0), [items])
  const deliveryFee = Number(selectedCompany.fee || 0)
  const total = subtotal + deliveryFee
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  const hasBuyerProfile = Boolean(
  buyerProfile.name &&
  buyerProfile.phone_number &&
  buyerProfile.delivery_address
)

  function updateQuantity(id, nextQuantity) {
    const nextItems = items.map((item) => (
      item.id === id ? { ...item, quantity: Math.max(1, nextQuantity) } : item
    ))
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  function removeItem(id) {
    const nextItems = items.filter((item) => item.id !== id)
    setItems(nextItems)
    saveCartItems(nextItems)
  }

 async function handleContinuePayment() {
  const token = getReaderToken()

  if (!token) {
    setMessage('Please login before checkout.')
    setBuyerOpen(true)
    return
  }

  if (!items.length) {
    setMessage('Your cart is empty.')
    return
  }

  if (!hasBuyerProfile) {
    setBuyerOpen(true)
    return
  }

  const profile = {
    phone_number: buyerProfile.phone_number || '',
    province_city: buyerProfile.province_city || 'Phnom Penh',
    delivery_address: buyerProfile.delivery_address || '',
    delivery_note: deliveryNote || buyerProfile.delivery_note || '',
    telegram_username: buyerProfile.telegram_username || '',
    facebook_link: buyerProfile.facebook_link || '',
  }

  try {
    setSaving(true)
    setMessage('')

    const profileResponse = await fetch(`${API_URL}/api/shadow-mall/buyer-profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })

    const profileData = await profileResponse.json().catch(() => ({}))

    if (!profileResponse.ok || profileData.ok === false) {
      throw new Error(profileData.message || 'Failed to save buyer profile')
    }

    const savedProfile = {
      ...buyerProfile,
      ...profile,
      ...(profileData.profile || {}),
    }

    saveBuyerProfile(savedProfile)
    setBuyerProfile(savedProfile)

    const orderResponse = await fetch(`${API_URL}/api/author-store/orders/create-payment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        delivery_company: {
          key: selectedCompany.id,
          name: selectedCompany.label,
          shortName: selectedCompany.name,
          fee: selectedCompany.fee,
        },
      }),
    })

    const orderData = await orderResponse.json().catch(() => ({}))

    if (!orderResponse.ok || orderData.ok === false) {
      throw new Error(orderData.message || 'Failed to create Author Store payment')
    }

    if (!orderData.order) {
      throw new Error('Payment order was not created')
    }

    localStorage.setItem(
      'shadow_author_current_order_payment',
      JSON.stringify({
        order: orderData.order,
        created_at: new Date().toISOString(),
      })
    )

    const paywayUrl =
      orderData.order.checkout_url ||
      orderData.order.deeplink ||
      FALLBACK_PAYWAY_LINK

    window.location.replace(paywayUrl)
  } catch (error) {
    setMessage(error.message || 'Failed to continue payment')
  } finally {
    setSaving(false)
  }
}

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-[92px]">
      <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <div className="min-w-0 flex-1 px-3 text-[18px] font-black text-[#111827]">Checkout</div>
          <button type="button" onClick={() => setBuyerOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827] active:scale-95">
            <i className="fa-solid fa-user text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        {message ? (
          <button type="button" onClick={() => setMessage('')} className="mb-3 w-full rounded-[18px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]">
            {message}
          </button>
        ) : null}

        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-black text-[#111827]">Delivery Company</h2>
              <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">Choose the company for printed book delivery.</p>
            </div>
            <span className="rounded-full bg-[#fff4cc] px-3 py-1.5 text-[11px] font-black text-[#9a6a00]">{money(deliveryFee)}</span>
          </div>

          <div className="space-y-3">
            {DELIVERY_COMPANIES.map((company) => {
              const active = selectedCompanyId === company.id

              return (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`flex w-full items-center justify-between rounded-[18px] border px-3 py-3 text-left transition active:scale-[0.99] ${
                    active ? 'border-[#d6a800] bg-[#fffaf0]' : 'border-[#d9e1ec] bg-[#f8fafc]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                   <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-white ring-1 ring-black/5">
  <img src={company.logo} alt={company.name} className="h-9 w-9 object-contain" />
</span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-black text-[#111827]">{company.name}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-[#8b93a1]">{company.label}</span>
                    </span>
                  </span>
                  {active ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d6a800] text-white">
                      <i className="fa-solid fa-check text-[12px]" />
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[12px] font-black text-[#111827]">Delivery Note</label>
            <textarea
              value={deliveryNote}
              onChange={(event) => setDeliveryNote(event.target.value)}
              placeholder="Optional note for admin or delivery..."
              className="min-h-[96px] w-full rounded-2xl border border-[#d9e1ec] bg-[#f8fafc] px-4 py-3 text-[13px] font-bold leading-6 text-[#111827] outline-none focus:border-[#111827]"
            />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-black text-[#111827]">Order Items</h2>
              <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">{itemCount} books in this order</p>
            </div>
            <i className="fa-solid fa-chevron-up text-[12px] text-[#9ca3af]" />
          </div>

          <div className="space-y-3">
            {items.length ? items.map((item) => (
              <article key={item.id} className="flex gap-3 rounded-[18px] bg-white py-2">
                <div className="h-[92px] w-[68px] shrink-0 overflow-hidden rounded-[14px] bg-[#f3f4f6] ring-1 ring-black/5">
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
                      <i className="fa-regular fa-image text-[18px]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-[13px] font-black text-[#111827]">{item.title}</h3>
                      <p className="mt-1 text-[11px] font-semibold text-[#8b93a1]">{item.type || 'Book'}</p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95">
                      <i className="fa-solid fa-trash text-[11px]" />
                    </button>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div className="text-[14px] font-black text-[#e5484d]">{money(Number(item.price_value || 0) * Number(item.quantity || 1))}</div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity || 1) - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827]">
                        <i className="fa-solid fa-minus text-[11px]" />
                      </button>
                      <span className="w-5 text-center text-[13px] font-black text-[#111827]">{item.quantity || 1}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity || 1) + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white">
                        <i className="fa-solid fa-plus text-[11px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-[18px] bg-[#f8fafc] p-6 text-center text-[12px] font-bold text-[#8b93a1]">
                No items in cart.
              </div>
            )}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="text-[17px] font-black text-[#111827]">Payment Summary</h2>
          <div className="mt-4 space-y-3 text-[13px] font-semibold">
            <div className="flex justify-between text-[#42526b]">
              <span>Subtotal</span>
              <span className="font-black text-[#111827]">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#42526b]">
              <span>Delivery Fee</span>
              <span className="font-black text-[#111827]">{money(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-[#42526b]">
              <span>Delivery Company</span>
              <span className="font-black text-[#111827]">{selectedCompany.name}</span>
            </div>
            <div className="border-t border-[#eef0f4] pt-3">
              <div className="flex justify-between text-[14px] font-black text-[#111827]">
                <span>Total</span>
                <span className="text-[#e5484d]">{money(total)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[82px] max-w-[980px] items-center justify-between px-4">
          <div>
            <div className="text-[11px] font-semibold text-[#8b93a1]">Total</div>
            <div className="mt-1 text-[17px] font-black text-[#e5484d]">{money(total)}</div>
          </div>
          
        <button
  type="button"
  onClick={handleContinuePayment}
  disabled={saving}
  className="h-12 rounded-full bg-[#111827] px-8 text-[13px] font-black text-white shadow-xl active:scale-95 disabled:bg-[#aeb6c4]"
>
  {saving ? 'Creating payment...' : 'Continue to Payment'}
</button>
          
        </div>
      </footer>

      <BuyerProfileSheet
        open={buyerOpen}
        profile={buyerProfile}
        onClose={() => setBuyerOpen(false)}
        onSave={(nextProfile) => {
          setBuyerProfile(nextProfile)
          setBuyerOpen(false)
        }}
      />
    </div>
  )
}
