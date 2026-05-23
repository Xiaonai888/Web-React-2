import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const cartItems = [
  {
    id: '1',
    title: 'គ្រោះព្រោះនិស្ស័យ',
    author: 'ពេជ្រ ជិន្នា',
    cover: '/assets/ShadowMall/books/book-1.jpg',
    price: 36000,
    quantity: 1,
  },
  {
    id: '2',
    title: 'Silent Moon',
    author: 'Shadow Author',
    cover: '/assets/ShadowMall/books/book-2.jpg',
    price: 32000,
    quantity: 1,
  },
]

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

function formatRiel(value) {
  return `${Number(value || 0).toLocaleString('en-US')}៛`
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
      className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] font-semibold text-[#111827] outline-none transition placeholder:text-[#a0a5b1] focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
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
        <img
          src={item.cover}
          alt={item.title}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[#111827]">{item.title}</div>
        <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#8d94a1]">{item.author}</div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[12px] font-bold text-[#8d94a1]">Qty: {item.quantity}</span>
          <span className="text-[13px] font-extrabold text-[#e5484d]">{formatRiel(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  )
}

export default function ShadowMallCheckoutPage() {
  const navigate = useNavigate()
  const [receiverName, setReceiverName] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState('Phnom Penh')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('aba_khqr')
  const [showOrderItems, setShowOrderItems] = useState(false)

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    []
  )

  const deliveryFee = province === 'Phnom Penh' ? 3000 : 5000
  const grandTotal = subtotal + deliveryFee
  const canContinue = receiverName.trim() && phone.trim() && province && address.trim()

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
        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-[16px] font-extrabold text-[#111827]">Delivery Information</div>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8d94a1]">
            Please enter correct information so Admin can prepare your book order.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <FieldLabel required>Receiver name</FieldLabel>
              <TextInput
                value={receiverName}
                onChange={(event) => setReceiverName(event.target.value)}
                placeholder="Enter receiver name"
              />
            </div>

            <div>
              <FieldLabel required>Phone number</FieldLabel>
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

            <div>
              <FieldLabel>Payment method</FieldLabel>
              <SelectInput value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option value="aba_khqr">ABA KHQR</option>
              </SelectInput>
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel required>Full address</FieldLabel>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="House number, street, village, commune, district..."
              className="min-h-[110px] w-full resize-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] font-semibold leading-6 text-[#111827] outline-none transition placeholder:text-[#a0a5b1] focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />
          </div>

          <div className="mt-4">
            <FieldLabel>Delivery note</FieldLabel>
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
                {cartItems.length} books in this order
              </div>
            </div>
            <i className={`fa-solid fa-chevron-down text-[12px] text-[#98a2b3] transition ${showOrderItems ? 'rotate-180' : ''}`} />
          </button>

          {showOrderItems ? (
            <div className="px-4 pb-3">
              {cartItems.map((item) => (
                <CheckoutItem key={item.id} item={item} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-[16px] font-extrabold text-[#111827]">Payment Summary</div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Subtotal</span>
              <span className="font-extrabold text-[#111827]">{formatRiel(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Delivery fee</span>
              <span className="font-extrabold text-[#111827]">{formatRiel(deliveryFee)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Discount</span>
              <span className="font-extrabold text-[#111827]">0៛</span>
            </div>

            <div className="border-t border-[#f0eef6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-extrabold text-[#111827]">Grand total</span>
                <span className="text-[20px] font-extrabold text-[#e5484d]">{formatRiel(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] bg-[#fff7d8] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#7a5600]">
            After payment, your book order will show as successful, but Admin still needs to prepare and deliver the books.
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-[#8d94a1]">Grand total</div>
            <div className="line-clamp-1 text-[18px] font-extrabold text-[#e5484d]">{formatRiel(grandTotal)}</div>
          </div>

          <button
            type="button"
            disabled={!canContinue}
            className="flex h-[52px] min-w-[170px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] disabled:bg-[#9ca3af] disabled:shadow-none"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  )
}
