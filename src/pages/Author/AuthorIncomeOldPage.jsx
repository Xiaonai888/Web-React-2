import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const INCOME_MANGA_IMAGES = [
  '/assets/Author Income/author-income-manga-girl.webp',
  '/assets/Author Benefits/author-benefits-manga-girl.webp',
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function money(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return `$${number.toFixed(2)}`
}

function numberText(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}

function percent(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0%'

  return `${number.toFixed(number % 1 === 0 ? 0 : 1)}%`
}

function dateText(value) {
  if (!value) return 'Not scheduled yet'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Not scheduled yet'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function dateTimeText(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function methodLabel(method) {
  if (!method) return 'Missing'
  if (method.method_type === 'bank_qr') return 'Bank QR'
  if (method.method_type === 'paypal') return 'PayPal'
  if (method.method_type === 'phone') return 'Phone Number'
  return 'Payment Method'
}

function statusStyle(status) {
  if (status === 'paid') return 'border-[#bfe5c8] bg-[#effbf2] text-[#3f8d56]'
  if (status === 'failed' || status === 'missing_payment_method') {
    return 'border-[#f2c8d6] bg-[#fff2f6] text-[#c8567c]'
  }
  if (status === 'scheduled') {
    return 'border-[#ead59b] bg-[#fff8e6] text-[#aa7512]'
  }
  return 'border-[#ddd1ec] bg-[#f6f1fb] text-[#785b99]'
}

function normalizeEarning(item) {
  const metadata = item.metadata || {}

  return {
    id: item.id,
    title: metadata.story_title || metadata.episode_title || 'Episode unlock',
    subtitle: metadata.package_label || metadata.episode_title || 'Diamond unlock',
    amount: Number(item.author_net_payout_usd || 0),
    diamonds: Number(item.author_earned_diamonds || 0),
    share: Number(item.author_share_percent || 0),
    status: item.earning_status || 'available',
    createdAt: item.created_at,
  }
}

function getInitial(value) {
  return String(value || 'R').trim().slice(0, 1).toUpperCase() || 'R'
}

function supporterName(item, index) {
  return (
    item.reader_name ||
    item.display_name ||
    item.username ||
    item.reader_username ||
    `Reader Supporter ${index + 1}`
  )
}

function supporterAvatar(item) {
  return (
    item.reader_avatar_url ||
    item.avatar_url ||
    item.profile_image_url ||
    ''
  )
}

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d6ef] bg-[#fffdfb] text-[#60447f] shadow-[0_5px_16px_rgba(86,61,118,0.09)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding({ dark = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 w-[31px] border-r ${
        dark
          ? 'border-white/10 bg-white/[0.05]'
          : 'border-[#dfd0ef] bg-[linear-gradient(180deg,#eee4ff_0%,#fbf7ff_100%)]'
      }`}
    >
      {[28, 72, 116, 160, 204, 248, 292, 336, 380].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span
            className={`block h-[12px] w-[12px] rounded-full border-2 ${
              dark
                ? 'border-[#d6bbff] bg-[#5d4385]'
                : 'border-[#9d73d4] bg-white'
            }`}
          />
          <span
            className={`absolute left-[7px] top-[4px] h-[3px] w-[12px] rounded-full ${
              dark ? 'bg-[#e2ccff]' : 'bg-[#8f64c8]'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

function Tape({ className = '', blue = false }) {
  return (
    <div
      className={`pointer-events-none absolute h-6 w-[70px] overflow-hidden rounded-[3px] border border-white/70 shadow-sm ${
        blue ? 'bg-[#b9d1ff]/75' : 'bg-[#f7bdd6]/75'
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

function IncomeMascot() {
  const [imageIndex, setImageIndex] = useState(0)

  if (imageIndex >= INCOME_MANGA_IMAGES.length) {
    return (
      <div className="relative flex h-[178px] w-[178px] items-center justify-center">
        <div className="absolute h-[142px] w-[142px] rounded-full bg-[#eadcff]/60" />
        <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-[34px] border-4 border-white bg-[linear-gradient(145deg,#f7e4ff_0%,#f8bfd9_100%)] text-[#7651ad] shadow-[0_12px_26px_rgba(77,51,112,0.16)]">
          <i className="fa-solid fa-piggy-bank text-[42px]" />
          <i className="fa-solid fa-star absolute -right-2 top-3 text-[18px] text-[#efb63d]" />
          <i className="fa-solid fa-heart absolute -left-2 bottom-4 text-[15px] text-[#ed8fb5]" />
        </div>
      </div>
    )
  }

  return (
    <img
      src={INCOME_MANGA_IMAGES[imageIndex]}
      alt=""
      onError={() => setImageIndex((current) => current + 1)}
      className="h-[190px] w-[190px] object-contain object-bottom drop-shadow-[0_15px_27px_rgba(79,52,117,0.2)] sm:h-[225px] sm:w-[225px]"
    />
  )
}

function SmallStat({ label, value, icon, tone }) {
  const tones = {
    pink: 'border-[#efc5d7] bg-[#fff6fa] text-[#c65b83]',
    purple: 'border-[#d4c2ec] bg-[#f8f3ff] text-[#7652ad]',
    gold: 'border-[#ead398] bg-[#fff9e9] text-[#ac7610]',
  }

  return (
    <div
      className={`rounded-[18px] border px-2.5 py-3 text-center shadow-[0_4px_12px_rgba(72,51,96,0.04)] ${
        tones[tone] || tones.purple
      }`}
    >
      <div className="flex items-center justify-center gap-1.5">
        <i className={`${icon} text-[9px] opacity-70`} />
        <div className="text-[16px] font-black tracking-[-0.03em]">{value}</div>
      </div>
      <div className="mt-1 text-[8.5px] font-black uppercase tracking-[0.07em] opacity-70">
        {label}
      </div>
    </div>
  )
}

function PaperCard({
  title,
  eyebrow,
  icon,
  children,
  onClick,
  tone = 'purple',
}) {
  const tones = {
    purple: {
      border: 'border-[#d8c8e9]',
      icon: 'bg-[#ede4ff] text-[#7552ad]',
      eyebrow: 'text-[#8b65b2]',
    },
    pink: {
      border: 'border-[#efccd9]',
      icon: 'bg-[#ffe5ef] text-[#d36691]',
      eyebrow: 'text-[#c55d84]',
    },
    gold: {
      border: 'border-[#e8d6a4]',
      icon: 'bg-[#fff0c9] text-[#c18a16]',
      eyebrow: 'text-[#a97818]',
    },
    blue: {
      border: 'border-[#cdd9f0]',
      icon: 'bg-[#e8efff] text-[#5974bd]',
      eyebrow: 'text-[#5f75b1]',
    },
  }

  const style = tones[tone] || tones.purple
  const Element = onClick ? 'button' : 'section'

  return (
    <Element
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-[27px] border ${style.border} bg-[linear-gradient(180deg,#fffdfb_0%,#fbf8ff_100%)] p-4 text-left shadow-[0_10px_26px_rgba(85,59,117,0.07)] transition ${
        onClick ? 'active:scale-[0.99]' : ''
      }`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(112,86,142,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(112,86,142,0.03) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[7deg]" blue={tone === 'blue'} />

      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${style.icon}`}
        >
          <i className={`${icon} text-[15px]`} />
        </span>

        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <div
              className={`text-[9px] font-black uppercase tracking-[0.11em] ${style.eyebrow}`}
            >
              {eyebrow}
            </div>
          ) : null}
          <h2 className="mt-1 text-[18px] font-black tracking-[-0.035em] text-[#4c3861]">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </Element>
  )
}

function LongSectionCard({
  title,
  subtitle,
  icon,
  tone = 'purple',
  action,
  children,
}) {
  const tones = {
    purple: {
      border: 'border-[#d8c8e9]',
      icon: 'bg-[#ede4ff] text-[#7652ad]',
    },
    pink: {
      border: 'border-[#efcbd9]',
      icon: 'bg-[#ffe4ef] text-[#d56894]',
    },
    gold: {
      border: 'border-[#ead6a2]',
      icon: 'bg-[#fff1cb] text-[#bd8614]',
    },
  }

  const style = tones[tone] || tones.purple

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border ${style.border} bg-[linear-gradient(180deg,#fffdfb_0%,#fbf8ff_100%)] p-4 shadow-[0_11px_28px_rgba(85,59,117,0.07)]`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(112,86,142,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(112,86,142,0.03) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[7deg]" />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] ${style.icon}`}
          >
            <i className={`${icon} text-[14px]`} />
          </span>

          <div className="min-w-0">
            <h2 className="text-[17px] font-black tracking-[-0.03em] text-[#4d3961]">
              {title}
            </h2>
            <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[#8c7d96]">
              {subtitle}
            </p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  )
}

function EmptyState({ icon, title, text, tone = 'purple' }) {
  const tones = {
    purple: 'border-[#dfd2ec] bg-[#faf7ff] text-[#7652ad]',
    pink: 'border-[#efd0dc] bg-[#fff8fb] text-[#d06390]',
    gold: 'border-[#ead9aa] bg-[#fffaf0] text-[#b98216]',
  }

  return (
    <div
      className={`flex min-h-[150px] w-full items-center gap-4 rounded-[22px] border border-dashed px-4 py-5 ${
        tones[tone] || tones.purple
      }`}
    >
      <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[22px] border border-current/15 bg-white/80 shadow-sm">
        <i className={`${icon} text-[23px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-black text-[#4b385e]">{title}</div>
        <div className="mt-1 max-w-[390px] text-[11px] font-semibold leading-5 text-[#8b7d94]">
          {text}
        </div>
      </div>

      <i className="fa-solid fa-star hidden shrink-0 text-[15px] text-[#efb63d]/70 sm:block" />
    </div>
  )
}

function EarningRow({ item }) {
  return (
    <div className="flex min-h-[82px] items-center gap-3 rounded-[20px] border border-[#e6dced] bg-white/85 p-3.5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#eee5ff] text-[#7451ac]">
        <i className="fa-solid fa-gem text-[16px]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[#4a385d]">
          {item.title}
        </div>
        <div className="mt-1 line-clamp-1 text-[10.5px] font-semibold text-[#8b7e94]">
          {item.subtitle} · {percent(item.share)} share
        </div>
        {item.createdAt ? (
          <div className="mt-1 text-[9.5px] font-semibold text-[#ad9db8]">
            {dateTimeText(item.createdAt)}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[14px] font-black text-[#bc507c]">
          +{money(item.amount)}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[#8e7f98]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{numberText(item.diamonds)}</span>
        </div>
      </div>
    </div>
  )
}

function SupporterRow({ item, index }) {
  const name = supporterName(item, index)
  const avatar = supporterAvatar(item)

  return (
    <div className="flex min-h-[86px] items-center gap-3 rounded-[20px] border border-[#efd9e2] bg-white/85 p-3.5">
      <div className="relative h-12 w-12 shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,#f8d8e7_0%,#e0d0ff_100%)] text-[15px] font-black text-[#7452a5] shadow-sm">
            {getInitial(name)}
          </div>
        )}

        <span
          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[8px] font-black ${
            index === 0
              ? 'bg-[#f4c348] text-[#6f4b00]'
              : 'bg-[#eee4ff] text-[#7551a9]'
          }`}
        >
          {index === 0 ? (
            <i className="fa-solid fa-crown text-[8px]" />
          ) : (
            index + 1
          )}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[#4c3960]">
          {name}
        </div>
        <div className="mt-1 text-[10.5px] font-semibold text-[#8b7d95]">
          Diamond unlock supporter
        </div>
        {item.reader_username ? (
          <div className="mt-1 line-clamp-1 text-[9.5px] font-semibold text-[#ad9db8]">
            @{item.reader_username}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[13px] font-black text-[#b9517b]">
          {money(item.total_usd)}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[#8e7f98]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{numberText(item.total_diamonds)}</span>
        </div>
      </div>
    </div>
  )
}

function PayoutRow({ item }) {
  const status = String(item.status || 'scheduled').replaceAll('_', ' ')
  const detail = item.paid_at
    ? `Paid ${dateText(item.paid_at)}`
    : item.scheduled_at
      ? `Scheduled ${dateText(item.scheduled_at)}`
      : 'Automatic monthly payout'

  return (
    <div className="rounded-[20px] border border-[#e6dcec] bg-white/85 p-3.5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#fff0c8] text-[#b98215]">
          <i className="fa-solid fa-receipt text-[16px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[13px] font-black text-[#4b385e]">
            {item.payout_month || 'Monthly payout'}
          </div>
          <div className="mt-1 text-[10.5px] font-semibold text-[#8b7d95]">
            {detail}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[8.5px] font-black capitalize ${statusStyle(
                item.status
              )}`}
            >
              {status}
            </span>

            {item.payment_method_type ? (
              <span className="inline-flex rounded-full border border-[#ddd0eb] bg-[#f7f3fb] px-2.5 py-1 text-[8.5px] font-black text-[#765d8d]">
                {String(item.payment_method_type).replaceAll('_', ' ')}
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[14px] font-black text-[#7651ad]">
            {money(item.net_payout_usd)}
          </div>
          <div className="mt-1 text-[9.5px] font-semibold text-[#a393ad]">
            Net payout
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[300px] animate-pulse rounded-[30px] bg-white" />
      <div className="h-[138px] animate-pulse rounded-[27px] bg-white" />
      <div className="h-[138px] animate-pulse rounded-[27px] bg-white" />
      <div className="h-[235px] animate-pulse rounded-[28px] bg-white" />
    </div>
  )
}

export default function AuthorIncomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadIncome() {
      try {
        setLoading(true)
        setError('')

        const token = getAuthToken()

        if (!token) {
          navigate('/login', { replace: true })
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/authors/me/income`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load income')
        }

        if (!ignore) {
          setData(result)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load income')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadIncome()

    return () => {
      ignore = true
    }
  }, [navigate])

  const recentEarnings = useMemo(() => {
    return (data?.recent_earnings || []).map(normalizeEarning)
  }, [data])

  const paymentMethod = data?.payment_method?.primary || null
  const paymentComplete = Boolean(data?.payment_method?.complete)

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
            onClick={() => navigate('/author/profile', { replace: true })}
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-[9px] text-[#efb73e]" />
              <h1 className="text-[19px] font-black tracking-[-0.04em] text-[#563b79]">
                My Income
              </h1>
              <i className="fa-solid fa-heart text-[9px] text-[#ed8fb5]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#aa91c1]">
              Net author earnings
            </p>
          </div>

          <HeaderButton
            icon="fa-solid fa-circle-info"
            label="Info"
            onClick={() => setShowTip(true)}
          />
        </div>
      </div>

      {showTip ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
          <button
            type="button"
            aria-label="Close income tip"
            onClick={() => setShowTip(false)}
            className="absolute inset-0"
          />

          <div
            className="relative w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[#dac9e9] bg-[#fffdfb] p-5 shadow-2xl"
            style={{
              backgroundImage:
                'linear-gradient(rgba(112,86,142,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(112,86,142,0.035) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <Tape className="-right-3 top-4 rotate-[8deg]" />

            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-[18px] font-black text-[#51396b]">
                  How income works
                </div>
                <div className="mt-1 text-[11px] font-semibold text-[#9b88a7]">
                  Quick guide for author earnings
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTip(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1e9f8] text-[#7959a0]"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            </div>

            <div className="space-y-2.5 text-[11.5px] font-semibold leading-5 text-[#74657f]">
              <p className="rounded-[17px] border border-[#eadfed] bg-white/80 p-3">
                Your income is shown as money, but the system records earnings from Diamond unlocks.
              </p>
              <p className="rounded-[17px] border border-[#eadfed] bg-white/80 p-3">
                Your share depends on your Quest stage.
              </p>
              <p className="rounded-[17px] border border-[#eadfed] bg-white/80 p-3">
                Payouts are processed automatically every 15th. You don’t need to request withdrawal.
              </p>
              <p className="rounded-[17px] border border-[#eadfed] bg-white/80 p-3">
                Free unlocks, Gems, Vouchers, Story Cards, and Episodes 1–5 do not count as paid income.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowTip(false)
                navigate('/author/benefits')
              }}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#7b55b2_0%,#a66bd0_100%)] text-[13px] font-black text-white shadow-[0_8px_18px_rgba(110,75,156,0.2)] active:scale-[0.99]"
            >
              View Author Benefits
              <i className="fa-solid fa-star text-[8px] text-[#ffdf79]" />
            </button>
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        {loading ? <LoadingSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-[26px] border border-[#efccd8] bg-white p-5 text-center shadow-[0_10px_26px_rgba(87,61,116,0.08)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe8ef] text-[#d7618d]">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="mt-3 text-[15px] font-black text-[#4d395f]">
              {error}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-11 rounded-full bg-[#7651ad] px-6 text-[12px] font-black text-white active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section
              className="relative overflow-hidden rounded-[30px] border border-[#c9b4eb] bg-[linear-gradient(145deg,#7759ad_0%,#8d68bd_48%,#7453a7_100%)] text-white shadow-[0_17px_38px_rgba(85,56,125,0.2)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <SpiralBinding dark />
              <Sparkles className="absolute right-5 top-4" />
              <Tape className="left-12 top-3 rotate-[-8deg]" blue />

              <div className="relative min-h-[306px] pl-[45px] pr-3 pt-5">
                <div className="absolute right-[-24px] top-[53px] z-0 sm:right-3 sm:top-[30px]">
                  <IncomeMascot />
                </div>

                <div className="relative z-10 max-w-[61%] sm:max-w-[55%]">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#ffe9a0]">
                    <i className="fa-solid fa-star text-[7px]" />
                    This Month
                  </div>

                  <div className="mt-3 text-[44px] font-black leading-none tracking-[-0.065em] text-[#fff8ed] drop-shadow-[0_2px_0_rgba(67,43,100,0.3)] sm:text-[52px]">
                    {money(data.income?.this_month_usd)}
                  </div>

                  <p className="mt-3 max-w-[260px] text-[10.5px] font-semibold leading-5 text-white/75">
                    Your income is shown as money. Shadow still records earnings from Diamond unlocks behind the scenes.
                  </p>
                </div>

                <div className="absolute right-4 top-4 z-20 rotate-[2deg] rounded-[16px] border border-[#efd39b] bg-[#fff7e6] px-3 py-2.5 text-center shadow-[0_7px_18px_rgba(61,43,88,0.18)]">
                  <div className="text-[8px] font-black uppercase tracking-[0.08em] text-[#9c799f]">
                    Share
                  </div>
                  <div className="mt-1 text-[20px] font-black text-[#c15480]">
                    {percent(data.current_share_percent)}
                  </div>
                </div>

                <div className="relative z-20 mb-4 mt-6 grid grid-cols-3 gap-2 rounded-[22px] border border-white/15 bg-[#fffaf4]/95 p-2.5 shadow-[0_10px_24px_rgba(54,37,81,0.15)]">
                  <SmallStat
                    label="Today"
                    value={money(data.income?.today_usd)}
                    icon="fa-regular fa-calendar"
                    tone="pink"
                  />
                  <SmallStat
                    label="Week"
                    value={money(data.income?.this_week_usd)}
                    icon="fa-regular fa-calendar-days"
                    tone="purple"
                  />
                  <SmallStat
                    label="Total"
                    value={money(data.income?.total_usd)}
                    icon="fa-solid fa-medal"
                    tone="gold"
                  />
                </div>
              </div>
            </section>

            <PaperCard
              title={dateText(data.next_payout_date)}
              eyebrow="Next Payout"
              icon="fa-solid fa-calendar-check"
              tone="pink"
            >
              <p className="mt-2 max-w-[470px] text-[11px] font-semibold leading-5 text-[#86768f]">
                Payout is handled automatically. You do not need to request withdrawal.
              </p>
            </PaperCard>

            <PaperCard
              title={paymentComplete ? methodLabel(paymentMethod) : 'Missing'}
              eyebrow="Payment Method"
              icon={paymentComplete ? 'fa-solid fa-qrcode' : 'fa-solid fa-circle-exclamation'}
              tone="purple"
              onClick={() => navigate('/author/payment-method')}
            >
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="max-w-[470px] text-[11px] font-semibold leading-5 text-[#86768f]">
                  {paymentComplete
                    ? 'Tap to review or update your payout details.'
                    : 'Tap to add Bank QR, PayPal, or phone payout details.'}
                </p>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0e8fa] text-[#7d5aa7]">
                  <i className="fa-solid fa-chevron-right text-[9px]" />
                </span>
              </div>
            </PaperCard>

            <LongSectionCard
              title="Recent Earnings"
              subtitle="Net earnings from paid Diamond unlocks."
              icon="fa-solid fa-gem"
              tone="purple"
              action={
                <span className="rounded-full border border-[#e0d4eb] bg-[#f5effa] px-3 py-1.5 text-[9px] font-black text-[#775a95]">
                  Latest
                </span>
              }
            >
              {recentEarnings.length ? (
                <div className="space-y-2.5">
                  {recentEarnings.map((item) => (
                    <EarningRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-gem"
                  title="No earnings yet"
                  text="Paid Diamond unlocks will appear here after readers unlock your locked episodes."
                  tone="purple"
                />
              )}
            </LongSectionCard>

            <LongSectionCard
              title="Top Supporters"
              subtitle="Readers who supported your stories through paid unlocks."
              icon="fa-solid fa-heart"
              tone="pink"
            >
              {data.top_supporters?.length ? (
                <div className="space-y-2.5">
                  {data.top_supporters.map((item, index) => (
                    <SupporterRow
                      key={item.reader_id || index}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-users"
                  title="No supporters yet"
                  text="When readers unlock paid episodes, your strongest supporters will appear here."
                  tone="pink"
                />
              )}
            </LongSectionCard>

            <LongSectionCard
              title="Payout History"
              subtitle="Automatic monthly payout records."
              icon="fa-solid fa-receipt"
              tone="gold"
            >
              {data.payout_history?.length ? (
                <div className="space-y-2.5">
                  {data.payout_history.map((item) => (
                    <PayoutRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-receipt"
                  title="No payout yet"
                  text="Your monthly payout history will appear here after admin processes payments."
                  tone="gold"
                />
              )}
            </LongSectionCard>

            <button
              type="button"
              onClick={() => navigate('/author/quest?from=income')}
              className="relative w-full overflow-hidden rounded-[28px] border border-[#dfcee9] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7fb_100%)] p-4 text-left shadow-[0_10px_26px_rgba(85,59,117,0.07)] transition active:scale-[0.99]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(112,86,142,0.03) 1px, transparent 1px)',
                backgroundSize: '100% 22px',
              }}
            >
              <Tape className="-right-4 top-3 rotate-[8deg]" />

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#fff0c8] text-[#b98215]">
                  <i className="fa-solid fa-scale-balanced text-[16px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[15px] font-black text-[#4f3964]">
                      Income Rules
                    </div>
                    <i className="fa-solid fa-star text-[8px] text-[#efb63d]" />
                  </div>

                  <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[#81728b]">
                    Income is calculated from net Diamond unlock revenue after package discounts. Your current share comes from Quest progress. Free unlocks, Gems, Vouchers, Story Cards, and Episodes 1–5 do not count as paid income.
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eee5f7] text-[#7957a1]">
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </div>
              </div>
            </button>
          </>
        ) : null}
      </main>
    </div>
  )
}
