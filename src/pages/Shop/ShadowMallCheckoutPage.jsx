import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CART_KEY = 'shadow_mall_cart'
const BUYER_PROFILE_KEY = 'shadow_mall_buyer_profile'
const DELIVERY_FEE = 2
const FALLBACK_PAYWAY_LINK = 'https://link.payway.com.kh/ABAPAYnw446278Y'
const DEFAULT_PROVINCE_CITY = 'Phnom Penh'

const deliveryCompanies = [
  {
    key: 'jnt',
    name: 'J&T Express',
    shortName: 'J&T',
    logo: '/assets/ShadowMall/delivery/jnt.png',
  },
  {
    key: 'vireak_buntham',
    name: 'Vireak Buntham Express',
    shortName: 'VET',
    logo: '/assets/ShadowMall/delivery/vireak-buntham.png',
  },
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

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-mall-cart-updated'))
  window.dispatchEvent(new Event('shadow-mall-cart-change'))
}

function saveBuyerProfileLocal(profile) {
  localStorage.setItem(BUYER_PROFILE_KEY, JSON.stringify(profile))
}

function readBuyerProfileLocal() {
  return readJson(BUYER_PROFILE_KEY, {
    phone_number: '',
    province_city: DEFAULT_PROVINCE_CITY,
    delivery_address: '',
    delivery_note: '',
    telegram_username: '',
    facebook_link: '',
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
    province_city: profile?.province_city || DEFAULT_PROVINCE_CITY,
    delivery_address: profile?.delivery_address || '',
    delivery_note: profile?.delivery_note || '',
    telegram_username: profile?.telegram_username || '',
    facebook_link: profile?.facebook_link || '',
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

function DeliveryLogo({ company }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-white shadow-sm ring-1 ring-black/5">
      <img
        src={company.logo}
        alt={company.name}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
          event.currentTarget.nextElementSibling.style.display = 'flex'
        }}
      />
      <span className="hidden h-full w-full items-center justify-center bg-[#f5f3fa] text-[11px] font-extrabold text-[#111827]">
        {company.shortName}
      </span>
    </div>
  )
}

function BuyerProfileSheet({
  open,
  onClose,
  readerName,
  profileLoading,
  phone,
  setPhone,
  address,
  setAddress,
  telegramUsername,
  setTelegramUsername,
  facebookLink,
  setFacebookLink,
  saving,
  onSave,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Close Buyer Profile"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="flex items-center justify-between gap-3 border-b border-[#f0eef6] px-5 pb-4 pt-5">
          <div>
            <div className="text-[18px] font-extrabold text-[#111827]">Buyer Profile</div>
            <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
              Required for printed book delivery.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#555b66]"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 pb-5 pt-4">
          {profileLoading ? (
            <div className="mb-4 rounded-[16px] bg-[#eef2ff] px-4 py-3 text-[12px] font-extrabold text-[#4f46e5]">
              Loading buyer profile...
            </div>
          ) : null}

          <div className="space-y-4">
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
              <FieldLabel>Telegram Username</FieldLabel>
              <TextInput
                value={telegramUsername}
                onChange={(event) => setTelegramUsername(event.target.value)}
                placeholder="@yourname"
              />
            </div>

            <div>
              <FieldLabel>Facebook Link</FieldLabel>
              <TextInput
                value={facebookLink}
                onChange={(event) => setFacebookLink(event.target.value)}
                placeholder="Paste Facebook profile or Messenger link"
              />
            </div>

            <div>
              <FieldLabel required>Delivery Address</FieldLabel>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="House number, street, village, commune, district, province/city..."
                className="min-h-[120px] w-full resize-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] font-semibold leading-6 text-[#111827] outline-none transition placeholder:text-[#a0a5b1] focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
              />
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:bg-[#aeb6c4]"
            >
              {saving ? 'Saving...' : 'Save Information'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex gap-3 border-b border-[#f0eef6] py-3 last:border-b-0">
      <div className="h-[86px] w-[58px] shrink-0 overflow-hidden rounded-[12px] bg-[#eef0f4]">
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[#111827]">{item.title}</div>
            <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#8d94a1]">{item.author}</div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95"
            aria-label={`Remove ${item.title}`}
          >
            <i className="fa-solid fa-trash text-[11px]" />
          </button>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-[13px] font-extrabold text-[#e5484d]">
              {formatUsd(item.price * item.quantity)}
            </div>
            {item.quantity > 1 ? (
              <div className="mt-0.5 text-[10.5px] font-semibold text-[#a0a5b1]">
                {formatUsd(item.price)} each
              </div>
            ) : null}
          </div>

          <div className="flex items-center rounded-full bg-[#f5f3fa] p-1">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111827] active:scale-95"
              aria-label={`Decrease ${item.title}`}
            >
              <i className="fa-solid fa-minus text-[10px]" />
            </button>
            <div className="w-9 text-center text-[13px] font-extrabold text-[#111827]">{item.quantity}</div>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
              aria-label={`Increase ${item.title}`}
            >
              <i className="fa-solid fa-plus text-[10px]" />
            </button>
          </div>
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
  const [address, setAddress] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [facebookLink, setFacebookLink] = useState('')
  const [note, setNote] = useState('')
  const [deliveryCompany, setDeliveryCompany] = useState('jnt')
  const [message, setMessage] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showOrderItems, setShowOrderItems] = useState(true)
  const [buyerProfileOpen, setBuyerProfileOpen] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadCheckout() {
      const localProfile = readBuyerProfileLocal()
      const token = getReaderToken()

      setItems(readCart().map(normalizeCartItem))
      setReaderUser(readReaderUser())
      setPhone(localProfile.phone_number || '')
      setAddress(localProfile.delivery_address || '')
      setTelegramUsername(localProfile.telegram_username || '')
      setFacebookLink(localProfile.facebook_link || '')
      setNote(localProfile.delivery_note || '')

      if (!token) {
        setProfileLoading(false)
        setBuyerProfileOpen(true)
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
          setAddress(serverProfile.delivery_address)
          setNote(serverProfile.delivery_note)
          setTelegramUsername(serverProfile.telegram_username)
          setFacebookLink(serverProfile.facebook_link)
          saveBuyerProfileLocal(serverProfile)
        }

        if (!ignore && (!data.profile?.phone_number || !data.profile?.delivery_address)) {
          setBuyerProfileOpen(true)
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

  const selectedDeliveryCompany = useMemo(
    () => deliveryCompanies.find((company) => company.key === deliveryCompany) || deliveryCompanies[0],
    [deliveryCompany]
  )

  const total = subtotal + DELIVERY_FEE

  const profileComplete =
    Boolean(readerName.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(address.trim())

  const canContinue =
    profileComplete &&
    items.length > 0 &&
    !saving

  function updateItems(nextItems) {
    const normalizedItems = nextItems.map(normalizeCartItem)
    setItems(normalizedItems)
    saveCart(normalizedItems)
  }

  function increaseItem(id) {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    )
  }

  function decreaseItem(id) {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    )
  }

  function removeItem(id) {
    updateItems(items.filter((item) => String(item.id) !== String(id)))
  }

  async function saveBuyerProfileOnly() {
    const token = getReaderToken()

    if (!readerName.trim() || !token) {
      setMessage('Please login before saving buyer profile.')
      return false
    }

    if (!phone.trim() || !address.trim()) {
      setMessage('Phone number and delivery address are required.')
      return false
    }

    const profile = {
      phone_number: phone.trim(),
      province_city: DEFAULT_PROVINCE_CITY,
      delivery_address: address.trim(),
      delivery_note: note.trim(),
      telegram_username: telegramUsername.trim(),
      facebook_link: facebookLink.trim(),
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

      saveBuyerProfileLocal(savedProfile)
      setPhone(savedProfile.phone_number)
      setAddress(savedProfile.delivery_address)
      setNote(savedProfile.delivery_note)
      setTelegramUsername(savedProfile.telegram_username)
      setFacebookLink(savedProfile.facebook_link)
      setBuyerProfileOpen(false)

      return true
    } catch (error) {
      setMessage(error.message || 'Failed to save buyer profile')
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleContinue() {
    const token = getReaderToken()

    if (!readerName.trim() || !token) {
      setMessage('Please login before checkout.')
      setBuyerProfileOpen(true)
      return
    }

    if (!items.length) {
      setMessage('Your cart is empty.')
      return
    }

    if (!phone.trim() || !address.trim()) {
      setMessage('Phone number and delivery address are required.')
      setBuyerProfileOpen(true)
      return
    }

    const profile = {
      phone_number: phone.trim(),
      province_city: DEFAULT_PROVINCE_CITY,
      delivery_address: address.trim(),
      delivery_note: note.trim(),
      telegram_username: telegramUsername.trim(),
      facebook_link: facebookLink.trim(),
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
      saveBuyerProfileLocal(savedProfile)

      const orderResponse = await fetch(`${API_URL}/api/shadow-mall/orders/create-payment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          delivery_company: selectedDeliveryCompany,
        }),
      })

      const orderData = await orderResponse.json().catch(() => ({}))

      if (!orderResponse.ok || orderData.ok === false) {
        throw new Error(orderData.message || 'Failed to create Shadow Mall payment')
      }

      if (!orderData.order) {
        throw new Error('Payment order was not created')
      }

      localStorage.setItem(
        'shadow_mall_current_order_payment',
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
    <div className="min-h-screen bg-[#f5f3fa] pb-[120px]">
      <BuyerProfileSheet
        open={buyerProfileOpen}
        onClose={() => setBuyerProfileOpen(false)}
        readerName={readerName}
        profileLoading={profileLoading}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        telegramUsername={telegramUsername}
        setTelegramUsername={setTelegramUsername}
        facebookLink={facebookLink}
        setFacebookLink={setFacebookLink}
        saving={saving}
        onSave={saveBuyerProfileOnly}
      />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop/mall/cart')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 text-left text-[18px] font-extrabold text-[#111827]">
            Checkout
          </h1>

          <button
            type="button"
            onClick={() => setBuyerProfileOpen(true)}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Open Buyer Profile"
          >
            <i className="fa-solid fa-user text-[14px]" />
            {!profileComplete ? (
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#e5484d] ring-2 ring-white" />
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {message ? (
          <div className="mb-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d]">
            {message}
          </div>
        ) : null}

        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[16px] font-extrabold text-[#111827]">Delivery Company</div>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8d94a1]">
                Choose the company for printed book delivery.
              </p>
            </div>

            <div className="rounded-full bg-[#fff7d8] px-3 py-1 text-[11px] font-extrabold text-[#7a5600]">
              {formatUsd(DELIVERY_FEE)}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {deliveryCompanies.map((company) => {
              const selected = deliveryCompany === company.key

              return (
                <button
                  key={company.key}
                  type="button"
                  onClick={() => setDeliveryCompany(company.key)}
                  className={`flex items-center gap-3 rounded-[18px] border-2 p-3 text-left transition active:scale-[0.99] ${
                    selected
                      ? 'border-[#d4af37] bg-[#fffaf0] shadow-[0_10px_24px_rgba(212,175,55,0.18)]'
                      : 'border-[#eceaf2] bg-[#fafafe]'
                  }`}
                >
                  <DeliveryLogo company={company} />

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-extrabold text-[#111827]">{company.shortName}</div>
                    <div className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[#8d94a1]">
                      {company.name}
                    </div>
                  </div>

                  {selected ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-white">
                      <i className="fa-solid fa-check text-[11px]" />
                    </div>
                  ) : null}
                </button>
              )
            })}
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
                  <CheckoutItem
                    key={item.id}
                    item={item}
                    onIncrease={() => increaseItem(item.id)}
                    onDecrease={() => decreaseItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
                    <i className="fa-solid fa-cart-shopping text-[18px]" />
                  </div>
                  <div className="mt-3 text-[14px] font-extrabold text-[#111827]">No books in cart</div>
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="mt-4 rounded-full bg-[#111827] px-5 py-3 text-[12px] font-extrabold text-white active:scale-95"
                  >
                    Back to Shop
                  </button>
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
              <span className="font-extrabold text-[#111827]">{formatUsd(DELIVERY_FEE)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Delivery Company</span>
              <span className="font-extrabold text-[#111827]">{selectedDeliveryCompany.shortName}</span>
            </div>

            <div className="border-t border-[#f0eef6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-extrabold text-[#111827]">Total</span>
                <span className="text-[20px] font-extrabold text-[#e5484d]">{formatUsd(total)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-[#8d94a1]">Total</div>
            <div className="line-clamp-1 text-[18px] font-extrabold text-[#e5484d]">{formatUsd(total)}</div>
          </div>

          {readerName ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className="flex h-[52px] min-w-[180px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] disabled:bg-[#aeb6c4] disabled:shadow-none"
            >
              {saving ? 'Opening PayWay...' : 'Continue to Payment'}
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
