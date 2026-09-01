import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PAYMENT_MASCOT_IMAGES = [
  '/assets/Author Payment/author-payment-manga-girl.webp',
  '/assets/Author Income/author-income-manga-girl.webp',
  '/assets/Author Benefits/author-benefits-manga-girl.webp',
  '/assets/Author/quest-manga-girl.webp',
]

const METHOD_OPTIONS = [
  {
    key: 'bank_qr',
    title: 'Bank QR',
    subtitle: 'Recommended for Cambodia payouts',
    icon: 'fa-solid fa-qrcode',
    badge: 'Recommended',
    tone: 'purple',
  },
  {
    key: 'paypal',
    title: 'PayPal',
    subtitle: 'PayPal transfer fees may apply',
    icon: 'fa-brands fa-paypal',
    badge: 'Pay fee',
    tone: 'blue',
  },
  {
    key: 'phone',
    title: 'Phone Number',
    subtitle: 'Wing or other phone payout providers',
    icon: 'fa-solid fa-mobile-screen',
    badge: 'Pay fee',
    tone: 'pink',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadcf2] bg-[#fffdfb] text-[#68498d] shadow-[0_5px_16px_rgba(85,59,117,0.09)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 w-[31px] border-r border-[#decfed] bg-[linear-gradient(180deg,#eee4ff_0%,#fbf7ff_100%)]">
      {[28, 72, 116, 160, 204, 248, 292, 336].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span className="block h-[12px] w-[12px] rounded-full border-2 border-[#9c72d4] bg-white" />
          <span className="absolute left-[7px] top-[4px] h-[3px] w-[12px] rounded-full bg-[#8e64c7]" />
        </div>
      ))}
    </div>
  )
}

function Tape({ className = '', blue = false }) {
  return (
    <div
      className={`pointer-events-none absolute h-6 w-[70px] overflow-hidden rounded-[3px] border border-white/70 shadow-sm ${
        blue ? 'bg-[#b8d1ff]/75' : 'bg-[#f8bdd6]/75'
      } ${className}`}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.4)_0_5px,transparent_5px_10px)]" />
    </div>
  )
}

function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <i className="fa-solid fa-star text-[12px] text-[#efb83d]" />
      <i className="fa-solid fa-heart ml-3 text-[10px] text-[#ef8fb7]" />
      <i className="fa-solid fa-star ml-3 text-[8px] text-[#a17bd7]" />
    </div>
  )
}

function MascotFallback({ small = false }) {
  return (
    <div
      className={`relative flex items-center justify-center ${
        small ? 'h-[82px] w-[82px]' : 'h-[172px] w-[172px]'
      }`}
    >
      <div
        className={`absolute rounded-full bg-[linear-gradient(145deg,#f7ddeb_0%,#e1d1ff_100%)] ${
          small ? 'h-[66px] w-[66px]' : 'h-[132px] w-[132px]'
        }`}
      />
      <div
        className={`relative flex items-center justify-center rounded-[30px] border-4 border-white bg-[#fff9fc] text-[#7853ad] shadow-[0_12px_25px_rgba(79,52,117,0.15)] ${
          small ? 'h-[56px] w-[56px]' : 'h-[105px] w-[105px]'
        }`}
      >
        <i className={`fa-solid fa-heart ${small ? 'text-[20px]' : 'text-[36px]'}`} />
        <span
          className={`absolute -top-3 left-[17%] rotate-[-18deg] rounded-full bg-[#fff9fc] ${
            small ? 'h-6 w-3' : 'h-10 w-5'
          }`}
        />
        <span
          className={`absolute -top-3 right-[17%] rotate-[18deg] rounded-full bg-[#fff9fc] ${
            small ? 'h-6 w-3' : 'h-10 w-5'
          }`}
        />
        <i className="fa-solid fa-star absolute -right-2 top-1 text-[13px] text-[#efb63d]" />
      </div>
    </div>
  )
}

function PaymentMascot({ small = false }) {
  const [index, setIndex] = useState(0)

  if (index >= PAYMENT_MASCOT_IMAGES.length) {
    return <MascotFallback small={small} />
  }

  return (
    <img
      src={PAYMENT_MASCOT_IMAGES[index]}
      alt=""
      onError={() => setIndex((current) => current + 1)}
      className={
        small
          ? 'h-[90px] w-[90px] object-contain drop-shadow-[0_9px_16px_rgba(79,52,117,0.16)]'
          : 'h-[188px] w-[188px] object-contain object-bottom drop-shadow-[0_14px_25px_rgba(79,52,117,0.19)] sm:h-[220px] sm:w-[220px]'
      }
    />
  )
}

function RibbonTitle({ children, tone = 'purple' }) {
  const tones = {
    purple: 'border-[#c5abe7] bg-[#e9ddff] text-[#684493]',
    pink: 'border-[#edbfd1] bg-[#ffe3ee] text-[#c45583]',
    blue: 'border-[#bfd0ef] bg-[#e5edff] text-[#526db4]',
    gold: 'border-[#ead28c] bg-[#fff1c3] text-[#a8730c]',
  }

  return (
    <div className="flex justify-center">
      <div
        className={`relative inline-flex min-h-9 items-center justify-center rounded-[11px] border px-5 py-2 text-center text-[14px] font-black shadow-sm ${
          tones[tone] || tones.purple
        }`}
      >
        <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-current/20 bg-inherit" />
        <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-current/20 bg-inherit" />
        {children}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon = 'fa-regular fa-user',
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[11.5px] font-black text-[#543a72]">{label}</div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[#9870c3]">
          <i className={`${icon} text-[13px]`} />
        </span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-[54px] w-full rounded-[17px] border border-[#d7bee8] bg-[#fffdfd]/90 pl-12 pr-4 text-[13.5px] font-semibold text-[#49365d] outline-none transition placeholder:text-[#b4a5ba] focus:border-[#956dca] focus:shadow-[0_0_0_3px_rgba(149,109,202,0.09)]"
        />
      </div>
    </label>
  )
}

function MethodButton({ option, onClick }) {
  const tones = {
    purple: {
      border: 'border-[#d2bee9]',
      box: 'bg-[#eee2ff] text-[#7450ad]',
      badge: 'bg-[#ffe3ed] text-[#c8517c]',
    },
    blue: {
      border: 'border-[#c8d6f1]',
      box: 'bg-[#e4edff] text-[#536fbd]',
      badge: 'bg-[#e9efff] text-[#526bb0]',
    },
    pink: {
      border: 'border-[#edc5d5]',
      box: 'bg-[#ffe1ec] text-[#d45e8d]',
      badge: 'bg-[#eee8ff] text-[#7558a7]',
    },
  }

  const style = tones[option.tone] || tones.purple

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[88px] w-full min-w-0 items-center gap-3 rounded-[22px] border ${style.border} bg-[#fffdfc]/90 p-3 text-left shadow-[0_5px_16px_rgba(77,54,102,0.05)] transition active:scale-[0.99]`}
    >
      <div
        className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[19px] border border-white/80 ${style.box}`}
      >
        <i className={`${option.icon} text-[22px]`} />
      </div>

      <div className="min-w-0 flex-1 pr-[62px]">
        <div className="line-clamp-1 text-[13.5px] font-black text-[#4c3762]">
          {option.title}
        </div>
        <div className="mt-1 line-clamp-2 text-[10.5px] font-semibold leading-4 text-[#897a93]">
          {option.subtitle}
        </div>
      </div>

      <span
        className={`absolute right-8 top-3 rounded-full px-2 py-1 text-[7.5px] font-black uppercase tracking-[0.03em] ${style.badge}`}
      >
        {option.badge}
      </span>

      <i className="fa-solid fa-chevron-right shrink-0 text-[10px] text-[#8c69b2]" />
    </button>
  )
}

function CurrentMethodCard({ method, onView }) {
  if (!method) {
    return (
      <section
        className="relative overflow-hidden rounded-[29px] border border-[#cfbae9] bg-[linear-gradient(145deg,#f2e7ff_0%,#fff4f9_54%,#fff9ee_100%)] p-4 shadow-[0_13px_30px_rgba(87,61,118,0.09)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(113,85,146,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.035) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <SpiralBinding />
        <Sparkles className="absolute right-5 top-4" />

        <div className="relative pl-[34px]">
          <div className="inline-flex rounded-full bg-[#eadcff] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.09em] text-[#7551a8]">
            Current Method
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#fff0c8] text-[#bd8514]">
              <i className="fa-solid fa-circle-exclamation text-[16px]" />
            </div>
            <div>
              <div className="text-[17px] font-black text-[#503768]">
                Payment method missing
              </div>
              <p className="mt-1 max-w-[410px] text-[11px] font-semibold leading-5 text-[#85768e]">
                Add your payment details so admin can process your automatic monthly payout.
              </p>
            </div>
          </div>
        </div>
      </section>
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

  const methodIcon =
    method.method_type === 'bank_qr'
      ? 'fa-solid fa-qrcode'
      : method.method_type === 'paypal'
        ? 'fa-brands fa-paypal'
        : 'fa-solid fa-mobile-screen'

  return (
    <section
      className="relative overflow-hidden rounded-[29px] border border-[#cdb7ea] bg-[linear-gradient(145deg,#ecddff_0%,#fff0f8_52%,#fff8ed_100%)] shadow-[0_14px_32px_rgba(87,61,118,0.1)]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(113,85,146,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.035) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <SpiralBinding />
      <Sparkles className="absolute right-5 top-4" />
      <Tape className="right-3 top-[82px] rotate-[7deg]" />

      <div className="relative min-h-[220px] pl-[46px] pr-3 pt-5">
        <div className="absolute bottom-0 right-[-14px] sm:right-5">
          <PaymentMascot />
        </div>

        <div className="relative z-10 max-w-[62%] sm:max-w-[55%]">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#9c76cf] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.09em] text-white">
            <i className="fa-solid fa-star text-[7px] text-[#ffe181]" />
            Current Method
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-white/75 text-[#7651ad] shadow-sm">
              <i className={`${methodIcon} text-[15px]`} />
            </span>
            <div className="text-[23px] font-black tracking-[-0.04em] text-[#553771]">
              {label}
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7bc989] text-white">
              <i className="fa-solid fa-check text-[8px]" />
            </span>
          </div>

          <div className="mt-3 line-clamp-1 text-[12px] font-black text-[#5f4772]">
            {main || 'No account name'}
          </div>
          <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#917ea0]">
            {sub || 'No extra detail'}
          </div>

          <button
            type="button"
            onClick={onView}
            className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#8259ba_0%,#a56ad0_100%)] px-4 text-[10px] font-black text-white shadow-[0_7px_15px_rgba(115,76,166,0.2)] active:scale-95"
          >
            View Details
            <i className="fa-solid fa-star text-[7px] text-[#ffdf78]" />
          </button>
        </div>
      </div>
    </section>
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
      <div className="mb-2 text-[11.5px] font-black text-[#543a72]">
        Upload QR Code
      </div>
      <p className="mb-3 text-[10.5px] font-semibold leading-5 text-[#8c7d96]">
        Upload your bank QR image for payout verification.
      </p>

      <label className="relative flex min-h-[215px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-[#bfa8dd] bg-[linear-gradient(145deg,#fffafd_0%,#f7f0ff_100%)] px-4 py-5 text-center transition active:scale-[0.99]">
        <Tape className="-left-3 top-3 rotate-[-10deg]" />
        <Tape className="-right-3 bottom-4 rotate-[8deg]" blue />

        {value ? (
          <>
            <div className="rounded-[20px] border-4 border-[#eadcff] bg-white p-3 shadow-[0_8px_20px_rgba(93,62,131,0.1)]">
              <img
                src={value}
                alt="Bank QR preview"
                className="max-h-[260px] max-w-full rounded-[12px] object-contain"
              />
            </div>
            <div className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-[#d2bee8] bg-white px-4 text-[10px] font-black text-[#72509f]">
              <i className="fa-solid fa-arrow-up-from-bracket text-[10px]" />
              Change QR
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[25px] border border-[#d0b8e9] bg-[#eee2ff] text-[#7451ad] shadow-sm">
              <i className="fa-solid fa-qrcode text-[30px]" />
            </div>
            <div className="mt-3 text-[13px] font-black text-[#51396a]">
              Upload QR image
            </div>
            <div className="mt-1 text-[10.5px] font-semibold text-[#9687a0]">
              PNG, JPG, WEBP, or GIF · Max 2 MB
            </div>
          </>
        )}

        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-black text-[#d25882]"
        >
          <i className="fa-solid fa-trash-can text-[9px]" />
          Remove image
        </button>
      ) : null}
    </div>
  )
}

function ImportantCard() {
  return (
    <section
      className="relative overflow-hidden rounded-[27px] border border-[#ead1ad] bg-[linear-gradient(145deg,#fff9ec_0%,#fff7f8_100%)] p-4 shadow-[0_10px_26px_rgba(91,67,111,0.06)]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(189,137,68,0.035) 1px, transparent 1px)',
        backgroundSize: '100% 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[8deg]" />

      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#fff0c9] text-[#bb8212]">
          <i className="fa-solid fa-circle-info text-[15px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[15px] font-black text-[#513b64]">Important</div>
            <i className="fa-solid fa-star text-[8px] text-[#efb63d]" />
          </div>

          <p className="mt-2 text-[11px] font-semibold leading-5 text-[#81728a]">
            Make sure your name and payment account are correct. If payment information is missing or incorrect, your payout can be delayed or marked as failed by admin.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-4 right-1 opacity-90">
        <MascotFallback small />
      </div>
    </section>
  )
}

function FormStepHeader({ selectedMethod }) {
  const option = METHOD_OPTIONS.find((item) => item.key === selectedMethod)

  return (
    <div className="mb-5">
      <div className="grid grid-cols-3 gap-2 rounded-[22px] border border-[#e2d5ed] bg-[#fffdfb] p-3 shadow-sm">
        {[
          ['Choose Method', 'fa-solid fa-list-check'],
          ['Fill Details', 'fa-solid fa-pen-to-square'],
          ['Save & Done', 'fa-solid fa-heart'],
        ].map(([label, icon], index) => (
          <div key={label} className="relative text-center">
            {index < 2 ? (
              <span className="absolute left-[58%] top-[18px] h-px w-[84%] bg-[#e4d5eb]" />
            ) : null}
            <div
              className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${
                index === 1
                  ? 'border-[#9065c4] bg-[#8a62bf] text-white'
                  : index === 0
                    ? 'border-[#b8d8bf] bg-[#edf9f0] text-[#57a36a]'
                    : 'border-[#e6d8ec] bg-[#faf6fc] text-[#b19cbc]'
              }`}
            >
              {index === 0 ? (
                <i className="fa-solid fa-check text-[10px]" />
              ) : (
                <i className={`${icon} text-[10px]`} />
              )}
            </div>
            <div
              className={`mt-2 text-[8.5px] font-black ${
                index === 1 ? 'text-[#67458e]' : 'text-[#a18da9]'
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <RibbonTitle
          tone={
            selectedMethod === 'paypal'
              ? 'blue'
              : selectedMethod === 'phone'
                ? 'pink'
                : 'purple'
          }
        >
          {option?.title || 'Payment Details'}
        </RibbonTitle>
      </div>
    </div>
  )
}

function NoteCard({ children, tone = 'gold' }) {
  const tones = {
    gold: 'border-[#ead5a2] bg-[#fff9e9] text-[#9b711c]',
    pink: 'border-[#efcbd9] bg-[#fff6fa] text-[#b9587b]',
    blue: 'border-[#cbd8f0] bg-[#f5f8ff] text-[#5970ab]',
    purple: 'border-[#dac8e8] bg-[#faf6ff] text-[#76569a]',
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border p-3.5 text-[10.5px] font-semibold leading-5 ${
        tones[tone] || tones.gold
      }`}
    >
      <i className="fa-solid fa-heart mr-2 text-[9px] opacity-75" />
      {children}
      <i className="fa-solid fa-star absolute right-3 top-3 text-[8px] text-[#efb63d]" />
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="space-y-4">
      <div className="h-[220px] animate-pulse rounded-[29px] bg-white" />
      <div className="h-[390px] animate-pulse rounded-[29px] bg-white" />
      <div className="h-[160px] animate-pulse rounded-[27px] bg-white" />
    </div>
  )
}

export default function AuthorPaymentMethodPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const backPath = searchParams.get('back') || '/author/income'
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
  const [phoneProvider, setPhoneProvider] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const primaryMethod = useMemo(() => {
    return (
      methods.find((method) => method.is_primary && method.status === 'active') ||
      methods[0] ||
      null
    )
  }, [methods])

  const selectedOption = METHOD_OPTIONS.find(
    (option) => option.key === selectedMethod
  )

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

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/payment-methods`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

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
    const old = methods.find(
      (method) =>
        method.method_type === methodType && method.status === 'active'
    )

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
      setPhoneProvider('')
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

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/payment-methods`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || 'Failed to save payment method')
      }

      setMethods((old) => [
        result.payment_method,
        ...old.map((method) => ({
          ...method,
          is_primary: false,
        })),
      ])
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
    <div
      className="min-h-screen pb-10"
      style={{
        backgroundColor: '#fbf8ff',
        backgroundImage:
          'radial-gradient(circle at 12% 6%, rgba(255,211,229,0.56), transparent 24%), radial-gradient(circle at 88% 9%, rgba(216,201,255,0.62), transparent 25%), linear-gradient(180deg,#fffdf9 0%,#f8f3ff 52%,#fff8fb 100%)',
      }}
    >
      <div className="sticky top-0 z-40 border-b border-[#eadff1] bg-[#fffdf9]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label="Back"
            onClick={() => {
              if (viewMode === 'form') {
                backToMethods()
                return
              }

              navigate(backPath, { replace: true })
            }}
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-[9px] text-[#efb73e]" />
              <h1 className="text-[18px] font-black tracking-[-0.035em] text-[#553a78]">
                Payment Method
              </h1>
              <i className="fa-solid fa-heart text-[9px] text-[#ed8fb5]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#aa91c1]">
              Auto payout setup
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e8fa] text-[#7452a2]">
            <i className="fa-solid fa-circle-info text-[12px]" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        {loading ? <LoadingPage /> : null}

        {!loading && viewMode === 'list' ? (
          <>
            <CurrentMethodCard
              method={primaryMethod}
              onView={() => {
                if (primaryMethod?.method_type) {
                  openMethod(primaryMethod.method_type)
                }
              }}
            />

            <section
              className="relative overflow-hidden rounded-[29px] border border-[#ddcfeb] bg-[linear-gradient(180deg,#fffdfb_0%,#fbf8ff_100%)] p-4 shadow-[0_11px_28px_rgba(86,61,118,0.07)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(113,85,146,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.03) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <Tape className="-right-4 top-3 rotate-[7deg]" />
              <Sparkles className="absolute left-4 top-4 opacity-70" />

              <div className="pt-1">
                <RibbonTitle tone="purple">Choose payout method</RibbonTitle>

                <p className="mx-auto mt-4 max-w-[500px] text-center text-[10.5px] font-semibold leading-5 text-[#897a93]">
                  Choose one method first. Then fill in the required payout details.
                </p>
              </div>

              {success ? (
                <div className="mt-4 rounded-[19px] border border-[#c7e5ce] bg-[#f1fbf3] px-4 py-3 text-[11px] font-bold leading-5 text-[#458b58]">
                  <i className="fa-solid fa-circle-check mr-2 text-[10px]" />
                  {success}
                </div>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-[19px] border border-[#efcad7] bg-[#fff3f7] px-4 py-3 text-[11px] font-bold leading-5 text-[#c9577c]">
                  <i className="fa-solid fa-circle-exclamation mr-2 text-[10px]" />
                  {error}
                </div>
              ) : null}

              <div className="mt-4 grid gap-2.5">
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
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[29px] border border-[#d8c6e8] bg-[linear-gradient(180deg,#fffdfb_0%,#fff9fb_52%,#faf6ff_100%)] p-4 shadow-[0_12px_30px_rgba(86,61,118,0.08)]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(113,85,146,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.03) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <Tape className="-right-4 top-3 rotate-[7deg]" />
            <Sparkles className="absolute left-4 top-4 opacity-70" />

            <FormStepHeader selectedMethod={selectedMethod} />

            <div className="space-y-4">
              {selectedMethod === 'bank_qr' ? (
                <>
                  <Field
                    label="Account Holder Name"
                    value={accountName}
                    onChange={setAccountName}
                    placeholder="Example: KEO DARIYA"
                    icon="fa-regular fa-user"
                  />
                  <Field
                    label="Bank Name"
                    value={bankName}
                    onChange={setBankName}
                    placeholder="Example: ABA, ACLEDA, Wing Bank"
                    icon="fa-solid fa-building-columns"
                  />
                  <ImageUpload value={qrImageUrl} onChange={setQrImageUrl} />

                  <NoteCard tone="pink">
                    Account name must match your real bank account and the QR image should be clear and active.
                  </NoteCard>
                  <NoteCard tone="purple">
                    Payments will be sent to this account automatically after admin payout processing.
                  </NoteCard>
                </>
              ) : null}

              {selectedMethod === 'paypal' ? (
                <>
                  <Field
                    label="PayPal Email"
                    type="email"
                    value={paypalEmail}
                    onChange={setPaypalEmail}
                    placeholder="name@example.com"
                    icon="fa-regular fa-envelope"
                  />
                  <Field
                    label="Account Holder Name"
                    value={paypalName}
                    onChange={setPaypalName}
                    placeholder="Your PayPal account name"
                    icon="fa-regular fa-user"
                  />

                  <div className="mt-1">
                    <RibbonTitle tone="pink">Important Notes</RibbonTitle>
                  </div>

                  <div className="space-y-2">
                    <NoteCard tone="pink">
                      PayPal transfer fees may apply depending on country, currency, and transfer type.
                    </NoteCard>
                    <NoteCard tone="blue">
                      Make sure your PayPal email can receive payments before saving.
                    </NoteCard>
                    <NoteCard tone="purple">
                      Shadow author payouts are recorded in USD.
                    </NoteCard>
                  </div>

                  <div className="flex justify-end">
                    <PaymentMascot small />
                  </div>
                </>
              ) : null}

              {selectedMethod === 'phone' ? (
                <>
                  <Field
                    label="Provider"
                    value={phoneProvider}
                    onChange={setPhoneProvider}
                    placeholder="Wing, Other"
                    icon="fa-solid fa-building"
                  />
                  <Field
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Example: 012 345 678"
                    icon="fa-solid fa-mobile-screen"
                  />
                  <Field
                    label="Account Holder Name"
                    value={accountName}
                    onChange={setAccountName}
                    placeholder="Name on the account"
                    icon="fa-regular fa-user"
                  />

                  <div className="mt-1">
                    <RibbonTitle tone="pink">Important Notes</RibbonTitle>
                  </div>

                  <NoteCard tone="pink">
                    Phone number payouts may have handling fees depending on the provider.
                  </NoteCard>
                  <NoteCard tone="gold">
                    Bank QR is recommended when it is available for your account.
                  </NoteCard>
                </>
              ) : null}

              {error ? (
                <div className="rounded-[19px] border border-[#efcad7] bg-[#fff3f7] px-4 py-3 text-[11px] font-bold leading-5 text-[#c9577c]">
                  <i className="fa-solid fa-circle-exclamation mr-2 text-[10px]" />
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-[#7f55b4] bg-[linear-gradient(90deg,#8058b8_0%,#a568d0_100%)] text-[13px] font-black text-white shadow-[0_9px_20px_rgba(109,72,155,0.22)] transition active:scale-[0.99] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-[11px]" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <i className="fa-solid fa-star text-[9px] text-[#ffdf79]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={backToMethods}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-[10.5px] font-black text-[#8263a0] active:scale-[0.99]"
              >
                <i className="fa-solid fa-chevron-left text-[8px]" />
                Back to payout methods
              </button>
            </div>
          </form>
        ) : null}
      </main>
    </div>
  )
}
