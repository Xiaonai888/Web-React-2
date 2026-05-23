import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

const METHOD_OPTIONS = [
  {
    key: 'bank_qr',
    title: 'Bank QR',
    subtitle: 'Recommended for Cambodia payouts',
    icon: 'fa-solid fa-qrcode',
    badge: 'Recommended',
  },
  {
    key: 'paypal',
    title: 'PayPal',
    subtitle: 'PayPal transfer fees may apply',
    icon: 'fa-brands fa-paypal',
    badge: 'Pay fee',
  },
  {
    key: 'phone',
    title: 'Phone Number',
    subtitle: 'Wing or other phone payout providers',
    icon: 'fa-solid fa-mobile-screen',
    badge: 'Pay fee',
  },
]

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
    >
      <i className={`${icon} text-[15px]`} />
    </button>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#667085]">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-[18px] border border-[#e5e7eb] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none transition placeholder:text-[#b6bdc8] focus:border-[#111827]"
      />
    </label>
  )
}

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#667085]">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-[18px] border border-[#e5e7eb] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#111827]"
      >
        {children}
      </select>
    </label>
  )
}

function MethodButton({ option, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex min-w-0 items-center gap-3 rounded-[22px] border border-[#eceaf2] bg-white p-3 text-left text-[#111827] shadow-sm transition active:scale-[0.99] md:hover:-translate-y-0.5 md:hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#f7f4ee] text-[#c89b1e]">
        <i className={`${option.icon} text-[15px]`} />
      </div>

      <div className="min-w-0 flex-1 pr-24">
        <div className="line-clamp-1 text-[14px] font-black">{option.title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[#98a2b3]">
          {option.subtitle}
        </div>
      </div>

      {option.badge ? (
        <span
          className={`absolute right-8 top-3 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
            option.key === 'bank_qr' ? 'bg-[#fff7ed] text-[#c05621]' : 'bg-[#f2f4f7] text-[#667085]'
          }`}
        >
          {option.badge}
        </span>
      ) : null}

      <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1]" />
    </button>
  )
}

function CurrentMethodCard({ method }) {
  if (!method) {
    return (
      <div className="rounded-[26px] bg-[#111827] p-4 text-white shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f7c948]">
            <i className="fa-solid fa-circle-exclamation text-[15px]" />
          </div>
          <div>
            <div className="text-[15px] font-black">Payment method missing</div>
            <p className="mt-1 text-[12.5px] font-semibold leading-5 text-white/60">
              Add your payment details so admin can process your automatic monthly payout.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const label =
    method.method_type === 'bank_qr'
      ? 'Bank QR'
      : method.method_type === 'paypal'
        ? 'PayPal'
        : 'Phone Number'

  const main =
    method.method_type === 'bank_qr'
      ? method.account_name
      : method.method_type === 'paypal'
        ? method.paypal_email
        : method.phone_number

  const sub =
    method.method_type === 'bank_qr'
      ? method.bank_name
      : method.method_type === 'paypal'
        ? method.paypal_name
        : method.phone_provider

  return (
    <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ecfdf3] text-[#16803c]">
          <i className="fa-solid fa-circle-check text-[15px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#98a2b3]">Current Method</div>
          <div className="mt-1 text-[16px] font-black text-[#111827]">{label}</div>
          <div className="mt-0.5 line-clamp-1 text-[12.5px] font-semibold text-[#667085]">{main || 'No account name'}</div>
          <div className="mt-0.5 line-clamp-1 text-[12px] font-semibold text-[#98a2b3]">{sub || 'No extra detail'}</div>
        </div>
      </div>
    </div>
  )
}

function ImageUpload({ value, onChange }) {
  async function handleFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      onChange(String(reader.result || ''))
    }

    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#667085]">QR code image</div>

      <label className="flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-[#cfd4dc] bg-[#fafafa] px-4 py-5 text-center transition active:scale-[0.99] md:hover:border-[#111827]">
        {value ? (
          <img src={value} alt="Bank QR preview" className="max-h-[260px] max-w-full rounded-[18px] object-contain shadow-sm" />
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
              <i className="fa-solid fa-arrow-up-from-bracket text-[18px]" />
            </div>
            <div className="mt-3 text-[14px] font-black text-[#111827]">Upload QR image</div>
            <div className="mt-1 text-[12px] font-semibold text-[#98a2b3]">PNG or JPG recommended</div>
          </>
        )}

        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 text-[12px] font-black text-[#e11d48]"
        >
          Remove image
        </button>
      ) : null}
    </div>
  )
}

function ImportantCard() {
  return (
    <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f4ee] text-[#c89b1e]">
          <i className="fa-solid fa-circle-info text-[15px]" />
        </div>
        <div>
          <div className="text-[15px] font-black text-[#111827]">Important</div>
          <p className="mt-1 text-[12.5px] font-medium leading-6 text-[#8d94a1]">
            Make sure your name and payment account are correct. If payment information is missing or incorrect, your payout can be delayed or marked as failed by admin.
          </p>
        </div>
      </div>
    </section>
  )
}

function FormHeader({ title, subtitle, onBack }) {
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex h-9 items-center gap-2 rounded-full bg-[#f4f5f7] px-3 text-[12px] font-black text-[#667085] active:scale-95"
      >
        <i className="fa-solid fa-chevron-left text-[10px]" />
        Back to methods
      </button>

      <h2 className="text-[20px] font-black tracking-[-0.04em] text-[#111827]">{title}</h2>
      <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#8d94a1]">{subtitle}</p>
    </div>
  )
}

export default function AuthorPaymentMethodPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [methods, setMethods] = useState([])
  const [viewMode, setViewMode] = useState('list')
  const [selectedMethod, setSelectedMethod] = useState('')

  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [paypalName, setPaypalName] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [phoneProvider, setPhoneProvider] = useState('Wing')
  const [phoneNumber, setPhoneNumber] = useState('')

  const primaryMethod = useMemo(() => {
    return methods.find((method) => method.is_primary && method.status === 'active') || methods[0] || null
  }, [methods])

  const selectedOption = METHOD_OPTIONS.find((option) => option.key === selectedMethod)

  useEffect(() => {
    let ignore = false

    async function loadMethods() {
      try {
        setLoading(true)
        setError('')

        const token = getAuthToken()

        if (!token) {
          navigate('/login', { replace: true })
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/authors/me/payment-methods`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load payment methods')
        }

        if (!ignore) {
          const list = result.payment_methods || []
          setMethods(list)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load payment methods')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadMethods()

    return () => {
      ignore = true
    }
  }, [navigate])

  function openMethod(methodType) {
    const old = methods.find((method) => method.method_type === methodType && method.status === 'active')

    setSelectedMethod(methodType)
    setViewMode('form')
    setError('')
    setSuccess('')

    if (!old) {
      setBankName('')
      setAccountName('')
      setQrImageUrl('')
      setPaypalName('')
      setPaypalEmail('')
      setPhoneProvider(methodType === 'phone' ? 'Wing' : '')
      setPhoneNumber('')
      return
    }

    setBankName(old.bank_name || '')
    setAccountName(old.account_name || '')
    setQrImageUrl(old.qr_image_url || '')
    setPaypalName(old.paypal_name || '')
    setPaypalEmail(old.paypal_email || '')
    setPhoneProvider(old.phone_provider || 'Wing')
    setPhoneNumber(old.phone_number || '')
  }

  function backToMethods() {
    setViewMode('list')
    setSelectedMethod('')
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      const body = {
        method_type: selectedMethod,
        display_name: selectedOption?.title || 'Payment Method',
        account_name: accountName,
        bank_name: bankName,
        qr_image_url: qrImageUrl,
        paypal_name: paypalName,
        paypal_email: paypalEmail,
        phone_provider: phoneProvider,
        phone_number: phoneNumber,
      }

      const response = await fetch(`${API_BASE_URL}/api/authors/me/payment-methods`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || 'Failed to save payment method')
      }

      setMethods((old) => [result.payment_method, ...old.map((method) => ({ ...method, is_primary: false }))])
      setSuccess('Payment method saved successfully.')
      setViewMode('list')
      setSelectedMethod('')
    } catch (err) {
      setError(err.message || 'Failed to save payment method')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-10">
      <div className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f5ef]/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label="Back"
            onClick={() => {
              if (viewMode === 'form') {
                backToMethods()
                return
              }

              navigate('/author/income', { replace: true })
            }}
          />

          <div className="text-center">
            <h1 className="text-[16px] font-black text-[#111827]">Payment Method</h1>
            <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">Auto payout setup</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-4 pt-4">
        {loading ? (
          <div className="space-y-4">
            <div className="h-[110px] animate-pulse rounded-[26px] bg-white" />
            <div className="h-[320px] animate-pulse rounded-[26px] bg-white" />
          </div>
        ) : null}

        {!loading && viewMode === 'list' ? (
          <>
            <CurrentMethodCard method={primaryMethod} />

            <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="mb-4">
                <h2 className="text-[18px] font-black tracking-[-0.03em] text-[#111827]">Choose payout method</h2>
                <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#8d94a1]">
                  Choose one method first. Then fill in the required payout details.
                </p>
              </div>

              {success ? (
                <div className="mb-3 rounded-[18px] bg-[#ecfdf3] px-4 py-3 text-[12.5px] font-bold leading-5 text-[#16803c]">
                  {success}
                </div>
              ) : null}

              {error ? (
                <div className="mb-3 rounded-[18px] bg-[#fff1f2] px-4 py-3 text-[12.5px] font-bold leading-5 text-[#e11d48]">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-2.5">
                {METHOD_OPTIONS.map((option) => (
                  <MethodButton
                    key={option.key}
                    option={option}
                    onClick={() => openMethod(option.key)}
                  />
                ))}
              </div>
            </section>

            <ImportantCard />
          </>
        ) : null}

        {!loading && viewMode === 'form' ? (
          <form onSubmit={handleSubmit} className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            {selectedMethod === 'bank_qr' ? (
              <FormHeader
                title="Add Bank QR"
                subtitle="Upload your Bank QR and make sure the name matches your real bank account."
                onBack={backToMethods}
              />
            ) : null}

            {selectedMethod === 'paypal' ? (
              <FormHeader
                title="Add PayPal"
                subtitle="Use the PayPal name and email that can receive payouts."
                onBack={backToMethods}
              />
            ) : null}

            {selectedMethod === 'phone' ? (
              <FormHeader
                title="Add Phone Number"
                subtitle="Use the phone account name that matches your payout account."
                onBack={backToMethods}
              />
            ) : null}

            <div className="space-y-4">
              {selectedMethod === 'bank_qr' ? (
                <>
                  <Field label="Bank account name" value={accountName} onChange={setAccountName} placeholder="Example: KEO DARIYA" />
                  <Field label="Bank name" value={bankName} onChange={setBankName} placeholder="Example: ABA, ACLEDA, Wing Bank" />
                  <ImageUpload value={qrImageUrl} onChange={setQrImageUrl} />
                </>
              ) : null}

              {selectedMethod === 'paypal' ? (
                <>
                  <Field label="PayPal name" value={paypalName} onChange={setPaypalName} placeholder="Your PayPal account name" />
                  <Field label="PayPal email" type="email" value={paypalEmail} onChange={setPaypalEmail} placeholder="name@example.com" />
                  <div className="rounded-[18px] bg-[#fff7ed] px-4 py-3 text-[12px] font-semibold leading-5 text-[#9a5b00]">
                    PayPal fees may apply depending on country, currency, and transfer type.
                  </div>
                </>
              ) : null}

              {selectedMethod === 'phone' ? (
                <>
                  <SelectField label="Provider" value={phoneProvider} onChange={setPhoneProvider}>
                    <option value="Wing">Wing</option>
                    <option value="Other">Other</option>
                  </SelectField>
                  <Field label="Phone number" value={phoneNumber} onChange={setPhoneNumber} placeholder="Example: 012 345 678" />
                  <Field label="Account name" value={accountName} onChange={setAccountName} placeholder="Name on the account" />
                  <div className="rounded-[18px] bg-[#fff7ed] px-4 py-3 text-[12px] font-semibold leading-5 text-[#9a5b00]">
                    Phone number payouts may have handling fees. Bank QR is recommended when available.
                  </div>
                </>
              ) : null}

              {error ? (
                <div className="rounded-[18px] bg-[#fff1f2] px-4 py-3 text-[12.5px] font-bold leading-5 text-[#e11d48]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Payment Method'}
              </button>
            </div>
          </form>
        ) : null}
      </main>
    </div>
  )
}
