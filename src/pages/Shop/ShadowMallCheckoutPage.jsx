import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CART_KEY = 'shadow_mall_cart'
const BUYER_PROFILE_KEY = 'shadow_mall_buyer_profile'

const provinces = [
  'Phnom Penh',
  'Banteay Meanchey',
  'Battambang',
  'Kampong Cham',
  'Kampong Chhnang',
  'Kampong Speu',
  'Kampong Thom',
  'Kampot',
  'Kandal',
  'Kep',
  'Koh Kong',
  'Kratie',
  'Mondulkiri',
  'Oddar Meanchey',
  'Pailin',
  'Preah Sihanouk',
  'Preah Vihear',
  'Prey Veng',
  'Pursat',
  'Ratanakiri',
  'Siem Reap',
  'Stung Treng',
  'Svay Rieng',
  'Takeo',
  'Tboung Khmum',
]

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || 'null')
    return value || fallback
  } catch {
    return fallback
  }
}

function readCart() {
  const value = readJson(CART_KEY, [])
  return Array.isArray(value) ? value : []
}

function saveBuyerProfileLocal(profile) {
  localStorage.setItem(BUYER_PROFILE_KEY, JSON.stringify(profile))
}

function readBuyerProfileLocal() {
  return readJson(BUYER_PROFILE_KEY, {
    phone_number: '',
    province_city: 'Phnom Penh',
    delivery_address: '',
    delivery_note: '',
  })
}

function readReaderUser() {
  return readJson('shadow_reader_user', null)
}

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getReaderName(user) {
  if (!user) return ''

  return (
    user.name ||
    user.username ||
    user.full_name ||
    user.display_name ||
    user.email ||
    ''
  )
}

function normalizePrice(value) {
  return Number(String(value || '').replace('$', '')) || 0
}

function normalizeCartItem(item) {
  return {
    id: item.id,
    title: item.title || 'Untitled book',
    author: item.author || item.author_name || 'Unknown author',
    cover: item.cover || item.cover_url || '',
    price: normalizePrice(item.price || item.price_usd),
    oldPrice: normalizePrice(item.oldPrice || item.old_price_usd),
    quantity: Math.max(Number(item.quantity || 1), 1),
  }
}

function normalizeProfile(profile) {
  return {
    phone_number: profile?.phone_number || '',
    province_city: profile?.province_city || 'Phnom Penh',
    delivery_address: profile?.delivery_address || '',
    delivery_note: profile?.delivery_note || '',
  }
}

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
      {children}
      {required ? <span className="ml-1 text-[#e5484d]">*</span> : null}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] font-semibold text-[#111827] outline-none transition placeholder:text-[#a0a5b1] focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)] disabled:bg-[#f4f5f7] disabled:text-[#667085]"
    />
  )
}

function SelectInput(props) {
  return (
    <div className="relative">
      <select
        {...props}
        className="h-12 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 pr-10 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
      />
      <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#98a2b3]" />
    </div>
  )
}

function CheckoutItem({ item }) {
  return (
    <div className="flex gap-3 border-b border-[#f0eef6] py-3 last:border-b-0">
      <div className="h-[76px] w-[52px] shrink-0 overflow-hidden rounded-[12px] bg-[#eef0f4]">
        {item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
            <i className="fa-solid fa-book-open text-[15px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[#111827]">{item.title}</div>
        <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#8d94a1]">{item.author}</div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[12px] font-bold text-[#8d94a1]">Qty: {item.quantity}</span>
          <span className="text-[13px] font-extrabold text-[#e5484d]">
            {formatUsd(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ShadowMallCheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [readerUser, setReaderUser] = useState(null)
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState('Phnom Penh')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showOrderItems, setShowOrderItems] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadCheckout() {
      const localProfile = readBuyerProfileLocal()
      const token = getReaderToken()

      setItems(readCart().map(normalizeCartItem))
      setReaderUser(readReaderUser())
      setPhone(localProfile.phone_number || '')
      setProvince(localProfile.province_city || 'Phnom Penh')
      setAddress(localProfile.delivery_address || '')
      setNote(localProfile.delivery_note || '')

      if (!token) {
        setProfileLoading(false)
        return
      }

      try {
        setProfileLoading(true)

        const response = await fetch(`${API_URL}/api/shadow-mall/buyer-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load buyer profile')
        }

        if (!ignore && data.profile) {
          const serverProfile = normalizeProfile(data.profile)

          setPhone(serverProfile.phone_number)
          setProvince(serverProfile.province_city)
          setAddress(serverProfile.delivery_address)
          setNote(serverProfile.delivery_note)
          saveBuyerProfileLocal(serverProfile)
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error.message || 'Failed to load buyer profile')
        }
      } finally {
        if (!ignore) setProfileLoading(false)
      }
    }

    loadCheckout()

    return () => {
      ignore = true
    }
  }, [])

  const readerName = useMemo(() => getReaderName(readerUser), [readerUser])

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const canContinue =
    Boolean(readerName.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(province) &&
    Boolean(address.trim()) &&
    items.length > 0 &&
    !saving

  async function handleContinue() {
    const token = getReaderToken()

    if (!readerName.trim() || !token) {
      setMessage('Please login before checkout.')
      return
    }

    if (!items.length) {
      setMessage('Your cart is empty.')
      return
    }

    if (!phone.trim() || !address.trim()) {
      setMessage('Phone number and delivery address are required.')
      return
    }

    const profile = {
      phone_number: phone.trim(),
      province_city: province,
      delivery_address: address.trim(),
      delivery_note: note.trim(),
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_URL}/api/shadow-mall/buyer-profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save buyer profile')
      }

      const savedProfile = normalizeProfile(data.profile || profile)
      const checkoutDraft = {
        buyer_name: readerName,
        buyer_profile: savedProfile,
        items,
        subtotal,
        delivery_fee: null,
        grand_total: subtotal,
        currency: 'USD',
        created_at: new Date().toISOString(),
      }

      saveBuyerProfileLocal(savedProfile)
      localStorage.setItem('shadow_mall_checkout_draft', JSON.stringify(checkoutDraft))
      navigate('/shop/mall/payment')
    } catch (error) {
      setMessage(error.message || 'Failed to save buyer profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[120px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Checkout</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {message ? (
          <div className="mb-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d]">
            {message}
          </div>
        ) : null}

        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[16px] font-extrabold text-[#111827]">Buyer Profile</div>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8d94a1]">
                Used only for printed book delivery and order contact.
              </p>
            </div>

            {profileLoading ? (
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[10px] font-extrabold text-[#4f46e5]">
                Loading
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <FieldLabel required>Name</FieldLabel>
              <TextInput
                value={readerName || 'Please login first'}
                disabled
                readOnly
              />
              <p className="mt-2 text-[11px] font-semibold leading-5 text-[#8d94a1]">
                Name comes from your reader account. To change it, update your main profile.
              </p>
            </div>

            <div>
              <FieldLabel required>Phone Number</FieldLabel>
              <TextInput
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter phone number"
                inputMode="tel"
              />
            </div>

            <div>
              <FieldLabel required>Province / City</FieldLabel>
              <SelectInput value={province} onChange={(event) => setProvince(event.target.value)}>
                {provinces.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </SelectInput>
            </div>

            <div className="rounded-[18px] bg-[#fff7d8] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#7a5600]">
              You can pay using ABA PayWay / KHQR from any supported bank app. No bank selection is needed here.
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel required>Delivery Address</FieldLabel>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="House number, street, village, commune, district..."
              className="min-h-[110px] w-full resize-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] font-semibold leading-6 text-[#111827] outline-none transition placeholder:text-[#a0a5b1] focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />
          </div>

          <div className="mt-4">
            <FieldLabel>Delivery Note</FieldLabel>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Optional note for admin or delivery..."
              className="min-h-[90px] w-full resize-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] font-semibold leading-6 text-[#111827] outline-none transition placeholder:text-[#a0a5b1] focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => setShowOrderItems((value) => !value)}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
          >
            <div>
              <div className="text-[16px] font-extrabold text-[#111827]">Order Items</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                {itemCount} books in this order
              </div>
            </div>
            <i className={`fa-solid fa-chevron-down text-[12px] text-[#98a2b3] transition ${showOrderItems ? 'rotate-180' : ''}`} />
          </button>

          {showOrderItems ? (
            <div className="px-4 pb-3">
              {items.length ? (
                items.map((item) => (
                  <CheckoutItem key={item.id} item={item} />
                ))
              ) : (
                <div className="py-8 text-center text-[13px] font-extrabold text-[#98a2b3]">
                  No books in cart.
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-[16px] font-extrabold text-[#111827]">Payment Summary</div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Subtotal</span>
              <span className="font-extrabold text-[#111827]">{formatUsd(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Delivery Fee</span>
              <span className="font-extrabold text-[#111827]">Calculate later</span>
            </div>

            <div className="border-t border-[#f0eef6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-extrabold text-[#111827]">Total</span>
                <span className="text-[20px] font-extrabold text-[#e5484d]">{formatUsd(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] font-medium text-[#8d94a1]">
                Delivery fee will be confirmed by Admin based on address.
              </p>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-[#8d94a1]">Total</div>
            <div className="line-clamp-1 text-[18px] font-extrabold text-[#e5484d]">{formatUsd(subtotal)}</div>
          </div>

          {readerName ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className="flex h-[52px] min-w-[180px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] disabled:bg-[#aeb6c4] disabled:shadow-none"
            >
              {saving ? 'Saving...' : 'Continue to Payment'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex h-[52px] min-w-[180px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99]"
            >
              Login to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
